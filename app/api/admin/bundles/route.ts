import { NextRequest, NextResponse } from 'next/server'
import { execute, generateId, query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, price_cents, product_ids } = body

    if (!name || !price_cents) {
      return NextResponse.json({ ok: false, error: { message: 'Name and price required' } }, { status: 400 })
    }

    const id = generateId('prod')
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    await execute(
      `INSERT INTO products (id, slug, name, description, type, price_cents, active, created_at)
       VALUES (?, ?, ?, ?, 'bundle', ?, 1, datetime('now'))`,
      [id, finalSlug, name, description || '', price_cents]
    )

    // Link child products via product_resources (reuse existing join table)
    if (product_ids?.length) {
      for (const childId of product_ids) {
        // Get resources from child product and link them to the bundle
        const childResources = await query<{ resource_id: string }>(
          'SELECT resource_id FROM product_resources WHERE product_id = ?',
          [childId]
        )
        for (const cr of childResources) {
          await execute(
            'INSERT OR IGNORE INTO product_resources (product_id, resource_id) VALUES (?, ?)',
            [id, cr.resource_id]
          )
        }
      }
    }

    return NextResponse.json({ ok: true, data: { id, slug: finalSlug } })
  } catch (error) {
    console.error('Bundle creation error:', error)
    return NextResponse.json({ ok: false, error: { message: 'Internal error' } }, { status: 500 })
  }
}
