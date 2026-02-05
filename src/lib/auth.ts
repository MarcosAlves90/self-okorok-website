import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ApiError } from '@/lib/api-utils'

type AuthUser = {
    id: string | number
    name: string
    email: string
    avatarUrl?: string | null
    bio?: string | null
}

const COOKIE_NAME = 'okorok_token'
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7

function getJwtSecret() {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET não configurado')
    }
    return new TextEncoder().encode(secret)
}

export async function signAuthToken(user: AuthUser) {
    return new SignJWT({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl ?? null,
        bio: user.bio ?? null,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(String(user.id))
        .setIssuedAt()
        .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
        .sign(getJwtSecret())
}

export async function verifyAuthToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, getJwtSecret())
        return payload
    } catch {
        return null
    }
}

function getCookieOptions(maxAge = TOKEN_TTL_SECONDS) {
    return {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge,
    }
}

export function setAuthCookie(response: NextResponse, token: string) {
    response.cookies.set(COOKIE_NAME, token, getCookieOptions())
}

export function clearAuthCookie(response: NextResponse) {
    response.cookies.set(COOKIE_NAME, '', getCookieOptions(0))
}

export async function getAuthUserId() {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    const payload = await verifyAuthToken(token)
    if (!payload?.sub) return null
    return String(payload.sub)
}

export async function requireAuthUserId(message = 'Não autenticado') {
    const userId = await getAuthUserId()
    if (!userId) {
        throw new ApiError(message, 401)
    }
    return userId
}

export async function ensureSameUser(expectedUserId: string, message = 'Acesso negado') {
    const userId = await requireAuthUserId()
    if (String(userId) !== String(expectedUserId)) {
        throw new ApiError(message, 403)
    }
    return userId
}
