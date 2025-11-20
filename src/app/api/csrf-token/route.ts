import { NextResponse } from 'next/server'
import { generateCSRFToken } from '@/lib/security/csrf'

export async function GET() {
  const token = generateCSRFToken()

  return NextResponse.json({ token })
}
