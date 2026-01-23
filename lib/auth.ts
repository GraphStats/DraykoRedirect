import { cookies } from 'next/headers';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'graphstats.pro@gmail.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SamCloud2024';
export const AUTH_COOKIE = 'drayko_session';

export async function login(email: string, pass: string) {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set(AUTH_COOKIE, 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        return true;
    }
    return false;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
}

export async function isAdmin() {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE);
    return session?.value === 'authenticated';
}
