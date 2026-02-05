import { query } from '@/lib/database'
import { failure, handleApiError, success } from '@/lib/api-utils'
import { getAuthUserId } from '@/lib/auth'

const MSG = {
    NOT_AUTHENTICATED: 'Usuário não autenticado',
    USER_NOT_FOUND: 'Usuário não encontrado',
    SERVER_ERROR: 'Erro interno do servidor',
} as const

export async function GET() {
    try {
        const userId = await getAuthUserId()
        if (!userId) {
            return failure(MSG.NOT_AUTHENTICATED, 401)
        }

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

        return success(safeUser)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota GET /api/usuarios/me:')
    }
}
