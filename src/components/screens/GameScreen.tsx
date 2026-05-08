import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { cn } from '../../lib/utils';
import { Droplet } from 'lucide-react';

// A minimal vector class
class Vec2 {
  constructor(public x: number, public y: number) {}
  add(v: Vec2) { return new Vec2(this.x + v.x, this.y + v.y); }
  sub(v: Vec2) { return new Vec2(this.x - v.x, this.y - v.y); }
  mult(n: number) { return new Vec2(this.x * n, this.y * n); }
  mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
  normalize() { 
    const m = this.mag(); 
    return m === 0 ? new Vec2(0,0) : new Vec2(this.x / m, this.y / m);
  }
}

// Global game constants
const PLAYER_SPEED = 200; // px per second
const ENEMY_SPEED = 100;
const ATTACK_COOLDOWN = 0.4; // seconds
const ATTACK_RANGE = 80;

export function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setScreen, addEssence, updateDepth, currentDepth, weaponLevel } = useGameStore();

  const [health, setHealth] = useState(100);
  const [maxHealth] = useState(100);
  const [joystick, setJoystick] = useState({ active: false, origin: { x: 0, y: 0 }, pos: { x: 0, y: 0 }, vector: new Vec2(0,0) });
  const [attackActive, setAttackActive] = useState(false);

  // Quick inputs ref to prevent dependency loops in RAF
  const inputsRef = useRef({ joystickVec: new Vec2(0,0), attacking: false });
  
  useEffect(() => {
    inputsRef.current = { joystickVec: joystick.vector, attacking: attackActive };
  }, [joystick.vector, attackActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    let lastTime = performance.now();
    let animationFrameId: number;

    const player = {
      pos: new Vec2(w / 2, h / 2),
      radius: 16,
      attackTimer: 0,
    };

    const enemies: { pos: Vec2, radius: number, hp: number, maxHp: number }[] = [];
    const particles: { pos: Vec2, vel: Vec2, life: number, color: string }[] = [];
    const essenceDrops: { pos: Vec2, life: number }[] = [];

    let depthTimer = 0;
    let spawnTimer = 0;
    let playerHealthInternal = health;

    const spawnEnemy = () => {
      // Spawn just offscreen
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.max(w, h) / 2 + 50;
      enemies.push({
        pos: new Vec2(player.pos.x + Math.cos(angle) * dist, player.pos.y + Math.sin(angle) * dist),
        radius: 12 + Math.random() * 8,
        hp: 20 + Math.random() * 20 * (currentDepth / 10 + 1),
        maxHp: 20 + Math.random() * 20 * (currentDepth / 10 + 1),
      });
    };

    const gameOver = () => {
      cancelAnimationFrame(animationFrameId);
      setScreen('GAME_OVER');
    };

    const update = (dt: number) => {
      // Progression
      depthTimer += dt;
      if (depthTimer > 1) { // 1 deeper every second
         depthTimer = 0;
         updateDepth(useGameStore.getState().currentDepth + 1);
      }

      spawnTimer += dt;
      if (spawnTimer > Math.max(0.2, 2 - (useGameStore.getState().currentDepth / 50))) {
        spawnEnemy();
        spawnTimer = 0;
      }

       // Player Movement (world is fixed, player moves for simplicity, or camera follows player. Mobile view = camera follows player, so player is center, world moves).
       // Actually, easiest implementation for this context: camera is centered on player.
      const moveVec = inputsRef.current.joystickVec.mult(PLAYER_SPEED * dt);
      
      // Update attack
      player.attackTimer -= dt;
      if (inputsRef.current.attacking && player.attackTimer <= 0) {
        player.attackTimer = ATTACK_COOLDOWN;
        // Perform Slash
        
        // Add slash particle effect
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 100 + Math.random() * 200;
          particles.push({
            pos: new Vec2(player.pos.x, player.pos.y),
            vel: new Vec2(Math.cos(angle) * speed, Math.sin(angle) * speed),
            life: 0.2 + Math.random() * 0.2,
            color: '#a855f7' // purple
          });
        }

        // Hit enemies
        const dmg = 15 * weaponLevel;
        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          const dist = e.pos.sub(player.pos).mag();
          if (dist < ATTACK_RANGE + e.radius) {
            e.hp -= dmg;
            if (e.hp <= 0) {
              // Enemy died
              enemies.splice(i, 1);
              // Drop essence
              if (Math.random() > 0.5) {
                essenceDrops.push({ pos: new Vec2(e.pos.x, e.pos.y), life: 10 });
              }
              // Blood particles
              for (let p = 0; p < 10; p++) {
                const angle = Math.random() * Math.PI * 2;
                particles.push({
                  pos: new Vec2(e.pos.x, e.pos.y),
                  vel: new Vec2(Math.cos(angle) * 50, Math.sin(angle) * 50),
                  life: 0.5 + Math.random() * 0.5,
                  color: '#ef4444' // red
                });
              }
            }
          }
        }
      }

      // Collect Essence
      for (let i = essenceDrops.length - 1; i >= 0; i--) {
        const drop = essenceDrops[i];
        const dist = drop.pos.sub(player.pos).mag();
        if (dist < 40) {
           // Magnet pull
           drop.pos = drop.pos.add(player.pos.sub(drop.pos).normalize().mult(300 * dt));
        }
        if (dist < player.radius + 5) {
           essenceDrops.splice(i, 1);
           addEssence(5);
        }
      }

      // Update Enemies
      for (const e of enemies) {
        // Move towards player
        const dir = player.pos.sub(e.pos).normalize();
        e.pos = e.pos.add(dir.mult(ENEMY_SPEED * dt));
        
        // Push away from other enemies slightly (simple separation)
        for(const other of enemies) {
           if(e === other) continue;
           const dist = e.pos.sub(other.pos);
           const m = dist.mag();
           if(m > 0 && m < e.radius + other.radius) {
               e.pos = e.pos.add(dist.normalize().mult(20 * dt));
           }
        }

        // Damage Player
        if (e.pos.sub(player.pos).mag() < player.radius + e.radius) {
             playerHealthInternal -= 10 * dt;
             // Push enemy back
             e.pos = e.pos.sub(dir.mult(50));
        }
      }

      if (playerHealthInternal <= 0) {
        gameOver();
      } else {
        setHealth(playerHealthInternal);
      }

      // Move player strictly logic (camera handles view)
      player.pos = player.pos.add(moveVec);

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.pos = p.pos.add(p.vel.mult(dt));
        p.life -= dt;
        if (p.life <= 0) particles.splice(i, 1);
      }
    };

    const draw = () => {
      // Clear Screen
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Camera Transform
      ctx.save();
      ctx.translate(w / 2 - player.pos.x, h / 2 - player.pos.y);

      // Draw Grid (Procedural feeling)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 100;
      const startX = Math.floor((player.pos.x - w/2) / gridSize) * gridSize;
      const startY = Math.floor((player.pos.y - h/2) / gridSize) * gridSize;
      for(let x = startX; x < player.pos.x + w/2; x+= gridSize) {
        ctx.beginPath(); ctx.moveTo(x, player.pos.y - h/2); ctx.lineTo(x, player.pos.y + h/2); ctx.stroke();
      }
      for(let y = startY; y < player.pos.y + h/2; y+= gridSize) {
        ctx.beginPath(); ctx.moveTo(player.pos.x - w/2, y); ctx.lineTo(player.pos.x + w/2, y); ctx.stroke();
      }

      // Draw Essence Drops
      essenceDrops.forEach(drop => {
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(drop.pos.x, drop.pos.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Particles
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life * 2);
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw Enemies
      enemies.forEach(e => {
        ctx.fillStyle = '#ef4444'; // red
        ctx.beginPath();
        ctx.arc(e.pos.x, e.pos.y, e.radius, 0, Math.PI * 2);
        ctx.fill();

        // HP Bar
        if (e.hp < e.maxHp) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(e.pos.x - 10, e.pos.y - e.radius - 8, 20, 3);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(e.pos.x - 10, e.pos.y - e.radius - 8, 20 * (e.hp / e.maxHp), 3);
        }
      });

      // Draw Player
      ctx.fillStyle = '#3b82f6'; // blue
      ctx.beginPath();
      ctx.arc(player.pos.x, player.pos.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Attack Radius Indicator
      if (player.attackTimer > 0) {
        ctx.strokeStyle = `rgba(168, 85, 247, ${player.attackTimer / ATTACK_COOLDOWN})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.pos.x, player.pos.y, ATTACK_RANGE, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      
      // Cap dt to prevent huge jumps if tab was inactive
      if (dt < 0.1) {
          update(dt);
          draw();
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Joystick handlers
  const maxJoyRadius = 50;
  
  const handleJoyStart = (e: React.PointerEvent | React.TouchEvent) => {
    e.preventDefault();
    const touch = 'touches' in e ? e.touches[0] : e as any;
    setJoystick({
      active: true,
      origin: { x: touch.clientX, y: touch.clientY },
      pos: { x: touch.clientX, y: touch.clientY },
      vector: new Vec2(0,0)
    });
  };

  const handleJoyMove = (e: React.PointerEvent | React.TouchEvent) => {
    if (!joystick.active) return;
    const touch = 'touches' in e ? e.touches[0] : e as any;
    
    const dx = touch.clientX - joystick.origin.x;
    const dy = touch.clientY - joystick.origin.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    // Clamp
    let nx = dx, ny = dy;
    if (dist > maxJoyRadius) {
       nx = (dx / dist) * maxJoyRadius;
       ny = (dy / dist) * maxJoyRadius;
    }
    
    setJoystick({
      ...joystick,
      pos: { x: joystick.origin.x + nx, y: joystick.origin.y + ny },
      vector: new Vec2(nx / maxJoyRadius, ny / maxJoyRadius)
    });
  };

  const handleJoyEnd = () => {
    setJoystick({ active: false, origin: { x: 0, y: 0 }, pos: { x: 0, y: 0 }, vector: new Vec2(0,0) });
  };

  return (
    <div className="absolute inset-0 select-none overflow-hidden touch-none" ref={containerRef}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-10">
         <div className="flex flex-col gap-2">
            <div className="w-48 h-4 glass-panel rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-200"
                  style={{ width: `${Math.max(0, (health/maxHealth)*100)}%`}}
                />
            </div>
            <div className="stat-value text-[10px] text-gray-400 uppercase tracking-widest">DEPTH <span className="text-white">{currentDepth}m</span></div>
         </div>

         <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-lg">
             <Droplet className="w-4 h-4 text-cyan-400" />
             <span className="stat-value text-cyan-400 text-sm">{useGameStore.getState().essence}</span>
         </div>
      </div>

      {/* Controls Overlay - Left side movement, Right side attack */}
      <div className="absolute inset-0 z-20 flex">
         {/* Left Side (Movement) */}
         <div 
           className="w-1/2 h-full opacity-50 relative pointer-events-auto touch-none"
           onPointerDown={handleJoyStart}
           onPointerMove={handleJoyMove}
           onPointerUp={handleJoyEnd}
           onPointerCancel={handleJoyEnd}
         >
           {/* Visual Joystick */}
           {joystick.active && (
              <div 
                className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{ left: joystick.origin.x, top: joystick.origin.y }}
              >
                  <div className="w-24 h-24 rounded-full border-2 border-white/20 bg-white/5" />
                  <div className="absolute w-10 h-10 rounded-full bg-white/40 shadow-xl"
                       style={{ 
                         transform: `translate(${joystick.pos.x - joystick.origin.x}px, ${joystick.pos.y - joystick.origin.y}px)`
                       }}
                  />
              </div>
           )}
         </div>

         {/* Right Side (Attack) */}
         <div 
           className="w-1/2 h-full relative pointer-events-auto touch-none flex items-end justify-end p-8 md:p-16"
           onPointerDown={(e) => { e.preventDefault(); setAttackActive(true); }}
           onPointerUp={() => setAttackActive(false)}
           onPointerCancel={() => setAttackActive(false)}
         >
            <div className={cn(
              "w-24 h-24 md:w-32 md:h-32 rounded-full border border-purple-500/30 flex items-center justify-center transition-all duration-100",
              attackActive ? "bg-purple-600/60 scale-95 shadow-[0_0_20px_rgba(139,92,246,0.6)]" : "glass-panel"
            )}>
               <span className="text-white/80 font-bold uppercase tracking-widest text-[10px] pointer-events-none select-none">Slash</span>
            </div>
         </div>
      </div>
    </div>
  );
}
