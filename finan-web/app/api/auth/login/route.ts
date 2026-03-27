import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { code } = await req.json()

  if (code === process.env.ADMIN_CODE) {
    const res = NextResponse.json({ success: true })

    res.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24
    })

    return res
  }

  return NextResponse.json({ error: 'Invalid' }, { status: 401 })
}