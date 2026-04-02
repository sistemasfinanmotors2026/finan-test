import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  if (code === process.env.ADMIN_CODE) {
    const response = NextResponse.json({ success: true });

    // 🔥 COOKIE REAL (server-side)
    response.cookies.set("admin-auth", "true", {
      path: "/",
      httpOnly: false, // puedes poner true luego
      sameSite: "lax",
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}