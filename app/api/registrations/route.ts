import { NextResponse } from "next/server";

const backendBaseUrl = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

export async function GET() {
  try {
    const upstream = await fetch(`${backendBaseUrl}/registrations`, {
      cache: "no-store",
    });

    // If backend URL is stale/misconfigured, avoid surfacing noisy 404 in admin UI.
    if (upstream.status === 404) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { message: `Upstream error: ${upstream.status}` },
        { status: upstream.status }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const upstream = await fetch(`${backendBaseUrl}/registrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();
    const payload = text ? JSON.parse(text) : {};

    return NextResponse.json(payload, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { message: "Failed to submit registration" },
      { status: 500 }
    );
  }
}
