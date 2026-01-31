'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import sql, { initDb } from './db';

export async function createUserRedirect(url: string, customId?: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const id = customId || nanoid(6);

    try {
        await initDb();
        await sql`INSERT INTO redirects (id, url, user_id) VALUES (${id}, ${url}, ${userId})`;
        revalidatePath('/dashboard');
        return { success: true, id };
    } catch (error: any) {
        if (error.code === '23505') {
            return { error: 'Cet identifiant existe deja.' };
        }
        console.error('Create redirect error:', error);
        return { error: 'Une erreur est survenue.' };
    }
}

export async function deleteUserRedirect(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    await sql`DELETE FROM redirects WHERE id = ${id} AND user_id = ${userId}`;
    revalidatePath('/dashboard');
    return { success: true };
}

export async function getUserRedirects() {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    try {
        const { rows } =
            await sql`SELECT * FROM redirects WHERE user_id = ${userId} ORDER BY created_at DESC`;
        return rows as any[];
    } catch (error: any) {
        if (error.message?.includes('relation \"redirects\" does not exist')) {
            console.log('Table \"redirects\" not found, creating...');
            await initDb();
            return [];
        }
        console.error('Get redirects error:', error);
        return [];
    }
}
