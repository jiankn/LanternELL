import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get('all') === 'true'
    const where = all ? '' : 'WHERE active = 1'
    const products = await query(
      `SELECT id, slug, name, description, type, price_cents, price_tier, active, created_at FROM products ${where} ORDER BY created_at DESC`
    )
    return NextResponse.json({ ok: true, data: { products } })
  } catch (error) {
    console.error('Admin products error:', error)
    return NextResponse.json({ ok: false, error: { message: 'Internal error' } }, { status: 500 })
  }
}
