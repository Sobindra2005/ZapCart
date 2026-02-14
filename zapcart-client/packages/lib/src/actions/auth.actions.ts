'use server';

import { cookies } from 'next/headers';

/**
 * Server action to set httpOnly cookie
 * This is the most secure way to store tokens in Next.js App Router
 */
export async function setAuthToken(token: string, expiresIn: number = 7 * 24 * 60 * 60) {
    const cookieStore = await cookies();

    cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expiresIn, // seconds
        path: '/',
    });

    return { success: true };
}

/**
 * Server action to remove auth token
 */
export async function removeAuthToken() {
    const cookieStore = await cookies();

    cookieStore.delete('token');

    return { success: true };
}
