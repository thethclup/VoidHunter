import { NextResponse } from 'next/server';

const agentData = {
  name: "Void Hunter Orchestrator",
  status: "active",
  wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
  platform: "Void Hunter",
  version: "1.0.0"
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  return NextResponse.json(agentData, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      ...agentData,
      received: body
    }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Invalid JSON" }, { status: 400, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
