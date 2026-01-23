'use server';

import sql from './db';
import { isAdmin } from './auth';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

export async function createRedirect(url: string, customId?: string) {
    if (!(await isAdmin())) throw new Error('Unauthorized');

    const id = customId || nanoid(6);

    try {
        await sql`INSERT INTO redirects (id, url) VALUES (${id}, ${url})`;
        revalidatePath('/admin/dashboard');
        return { success: true, id };
    } catch (error: any) {
        if (error.code === '23505') { // Postgres unique violation
            return { error: 'Cet identifiant existe déjà.' };
        }
        console.error('Create redirect error:', error);
        return { error: 'Une erreur est survenue.' };
    }
}

export async function deleteRedirect(id: string) {
    if (!(await isAdmin())) throw new Error('Unauthorized');

    await sql`DELETE FROM redirects WHERE id = ${id}`;
    revalidatePath('/admin/dashboard');
    return { success: true };
}

export async function getRedirects() {
    if (!(await isAdmin())) throw new Error('Unauthorized');

    try {
        // Simple way to ensure table exists in the cloud DB
        const { rows } = await sql`SELECT * FROM redirects ORDER BY created_at DESC`;
        return rows as any[];
    } catch (error: any) {
        // If table doesn't exist, try to create it and return empty list
        if (error.message?.includes('relation "redirects" does not exist')) {
            console.log('Table "redirects" not found, creating...');
            const { initDb } = await import('./db');
            await initDb();
            return [];
        }
        console.error('Get redirects error:', error);
        return [];
    }
}
