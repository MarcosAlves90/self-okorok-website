import { query } from '@/lib/database'
import { assertParam, handleApiError, success, failure } from '@/lib/api-utils'

const MSG = {
    SUCCESS_UPDATED: 'Usuário atualizado com sucesso',
    SUCCESS_FETCHED: 'Usuário encontrado com sucesso',
    INVALID_ID: 'ID do usuário é obrigatório',
    USER_NOT_FOUND: 'Usuário não encontrado',
    SERVER_ERROR: 'Erro interno do servidor',
} as const

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const userId = assertParam(id, MSG.INVALID_ID)
        const body = await request.json().catch(() => ({}))
        const { bio } = body

        const existingUser = await query(
            'SELECT id, name, email, avatar_url, bio FROM users WHERE id = $1',
            [userId]
        )

        if (!existingUser.rows || existingUser.rows.length === 0) {
            return failure(MSG.USER_NOT_FOUND, 404)
        }

        const updatedBio = bio !== undefined ? (bio ? String(bio).trim() : null) : null

        const result = await query(
            'UPDATE users SET bio = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, avatar_url, bio, created_at, updated_at',
            [updatedBio, userId]
        )

        const updatedUser = result.rows[0]
        const safeUser = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatarUrl: updatedUser.avatar_url || null,
            bio: updatedUser.bio || null,
            createdAt: updatedUser.created_at,
            updatedAt: updatedUser.updated_at,
        }

        return success(safeUser, MSG.SUCCESS_UPDATED)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota PUT /api/usuarios/[id]:')
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const userId = assertParam(id, MSG.INVALID_ID)

        const result = await query(
            'SELECT id, name, email, avatar_url, bio, created_at, updated_at FROM users WHERE id = $1',
            [userId]
        )

        if (!result.rows || result.rows.length === 0) {
            return failure(MSG.USER_NOT_FOUND, 404)
        }

        const user = result.rows[0]
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatar_url || null,
            bio: user.bio || null,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        }

        return success(safeUser, MSG.SUCCESS_FETCHED)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota GET /api/usuarios/[id]:')
    }
}
