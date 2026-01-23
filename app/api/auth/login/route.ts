import { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_COOKIE } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Définir le cookie directement dans la réponse
            const response = NextResponse.json({ success: true });

            response.cookies.set(AUTH_COOKIE, 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return response;
        } else {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
}
