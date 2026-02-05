import { NextResponse } from 'next/server'
import { query } from '@/lib/database'

type ApiFailureExtra = Record<string, unknown>

export class ApiError extends Error {
    status: number
    extra?: ApiFailureExtra

    constructor(message: string, status = 400, extra?: ApiFailureExtra) {
        super(message)
        this.status = status
        this.extra = extra
    }
}

export function json(body: unknown, status = 200) {
    return NextResponse.json(body, { status })
}

export function success<T>(data?: T, message?: string, status = 200) {
    const payload: Record<string, unknown> = { success: true }
    if (message) payload.message = message
    if (data !== undefined) payload.data = data
    return json(payload, status)
}

export function failure(message: string, status = 400, extra?: ApiFailureExtra) {
    return json({ success: false, message, ...(extra ?? {}) }, status)
}

export function handleApiError(error: unknown, fallbackMessage: string, logLabel?: string) {
    if (error instanceof ApiError) {
        return failure(error.message, error.status, error.extra)
    }

    if (logLabel) {
        console.error(logLabel, error)
    }

    return failure(fallbackMessage, 500)
}

export function assertParam(value: string | null, message: string) {
    if (!value || !value.trim()) {
        throw new ApiError(message, 400)
    }
    return value.trim()
}

export function assertString(value: unknown, message: string, status = 400) {
    if (typeof value !== 'string' || !value.trim()) {
        throw new ApiError(message, status)
    }
    return value.trim()
}

export async function ensureUserExists(userId: string, message: string) {
    const result = await query('SELECT id FROM users WHERE id = $1', [userId])
    if (!result.rows || result.rows.length === 0) {
        throw new ApiError(message, 404)
    }
}

export async function ensureRecipeExists(recipeId: string, message: string) {
    const result = await query('SELECT id FROM receitas WHERE id = $1', [recipeId])
    if (!result.rows || result.rows.length === 0) {
        throw new ApiError(message, 404)
    }
}
