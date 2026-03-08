import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { queryOne, execute, toISOString } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface PreferencesRow {
    email_notifications: number;
    marketing_emails: number;
    language: string;
    timezone: string;
    download_format: string;
}

const DEFAULT_PREFERENCES = {
    emailNotifications: true,
    marketingEmails: false,
    language: 'en',
    timezone: 'America/New_York',
    downloadFormat: 'pdf',
};

// GET /api/account/settings — get user preferences
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Please login' } },
                { status: 401 }
            );
        }

        const row = await queryOne<PreferencesRow>(
            'SELECT email_notifications, marketing_emails, language, timezone, download_format FROM user_preferences WHERE user_id = ?',
            [user.id]
        );

        const preferences = row
            ? {
                emailNotifications: Boolean(row.email_notifications),
                marketingEmails: Boolean(row.marketing_emails),
                language: row.language,
                timezone: row.timezone,
                downloadFormat: row.download_format,
            }
            : DEFAULT_PREFERENCES;

        return NextResponse.json({
            ok: true,
            data: { preferences, user: { name: user.name, email: user.email } },
            error: null,
        });
    } catch (error) {
        console.error('Get settings error:', error);
        return NextResponse.json(
            { ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to get settings' } },
            { status: 500 }
        );
    }
}

// PUT /api/account/settings — update user preferences and/or name
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return NextResponse.json(
                { ok: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Please login' } },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { preferences, name } = body;

        // Update name if provided
        if (name !== undefined) {
            const safeName = typeof name === 'string' ? name.trim().slice(0, 100) : null;
            await execute(
                'UPDATE users SET name = ?, updated_at = ? WHERE id = ?',
                [safeName || null, toISOString(new Date()), user.id]
            );
        }

        // Upsert preferences if provided
        if (preferences) {
            const existing = await queryOne<{ user_id: string }>(
                'SELECT user_id FROM user_preferences WHERE user_id = ?',
                [user.id]
            );

            if (existing) {
                await execute(
                    `UPDATE user_preferences SET
            email_notifications = ?,
            marketing_emails = ?,
            language = ?,
            timezone = ?,
            download_format = ?,
            updated_at = ?
           WHERE user_id = ?`,
                    [
                        preferences.emailNotifications ? 1 : 0,
                        preferences.marketingEmails ? 1 : 0,
                        preferences.language || 'en',
                        preferences.timezone || 'America/New_York',
                        preferences.downloadFormat || 'pdf',
                        toISOString(new Date()),
                        user.id,
                    ]
                );
            } else {
                await execute(
                    `INSERT INTO user_preferences (user_id, email_notifications, marketing_emails, language, timezone, download_format)
           VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        user.id,
                        preferences.emailNotifications ? 1 : 0,
                        preferences.marketingEmails ? 1 : 0,
                        preferences.language || 'en',
                        preferences.timezone || 'America/New_York',
                        preferences.downloadFormat || 'pdf',
                    ]
                );
            }
        }

        return NextResponse.json({ ok: true, data: { updated: true }, error: null });
    } catch (error) {
        console.error('Update settings error:', error);
        return NextResponse.json(
            { ok: false, data: null, error: { code: 'SERVER_ERROR', message: 'Failed to update settings' } },
            { status: 500 }
        );
    }
}
