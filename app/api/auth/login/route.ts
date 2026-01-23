import { login } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        const success = await login(email, password);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
}
