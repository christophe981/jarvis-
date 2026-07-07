import { NextResponse } from "next/server"

import { runRelancesSweep } from "@/lib/relances/run-sweep"

export async function GET(request: Request) {
  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const result = await runRelancesSweep()
  return NextResponse.json(result)
}
