import { query } from '@/lib/database'
import {
    assertParam,
    assertString,
    ensureRecipeExists,
    ensureUserExists,
    handleApiError,
    success,
    failure
} from '@/lib/api-utils'
import { ensureSameUser } from '@/lib/auth'

const MSG = {
    SUCCESS_LIKE: 'Receita curtida com sucesso',
    SUCCESS_UNLIKE: 'Curtida removida com sucesso',
    SUCCESS_GET: 'Curtidas obtidas com sucesso',
    ALREADY_LIKED: 'Receita já foi curtida por este usuário',
    NOT_LIKED: 'Receita não foi curtida por este usuário',
    INVALID_USER_ID: 'ID do usuário é obrigatório',
    INVALID_RECIPE_ID: 'ID da receita é obrigatório',
    USER_NOT_FOUND: 'Usuário não encontrado',
    RECIPE_NOT_FOUND: 'Receita não encontrada',
    SERVER_ERROR: 'Erro interno do servidor',
} as const

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const receitaId = assertParam(searchParams.get('receitaId'), MSG.INVALID_RECIPE_ID)
        const userId = searchParams.get('userId')

        await ensureRecipeExists(receitaId, MSG.RECIPE_NOT_FOUND)

        if (userId !== null) {
            const userIdValue = assertString(userId, MSG.INVALID_USER_ID)
            await ensureSameUser(userIdValue)
            const userLike = await query(
                'SELECT id FROM curtidas WHERE user_id = $1 AND receita_id = $2',
                [userIdValue, receitaId]
            )

            const hasLiked = userLike.rows && userLike.rows.length > 0

            return success({ hasLiked }, MSG.SUCCESS_GET)
        }

        const totalLikes = await query(
            'SELECT COUNT(*) as total FROM curtidas WHERE receita_id = $1',
            [receitaId]
        )

        const total = parseInt(totalLikes.rows[0].total) || 0

        return success({ total }, MSG.SUCCESS_GET)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota GET /api/curtidas:')
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}))
        const userId = assertString(body.userId, MSG.INVALID_USER_ID)
        const receitaId = assertString(body.receitaId, MSG.INVALID_RECIPE_ID)

        await ensureSameUser(userId)
        await ensureUserExists(userId, MSG.USER_NOT_FOUND)
        await ensureRecipeExists(receitaId, MSG.RECIPE_NOT_FOUND)

        const existingLike = await query(
            'SELECT id FROM curtidas WHERE user_id = $1 AND receita_id = $2',
            [userId, receitaId]
        )

        if (existingLike.rows && existingLike.rows.length > 0) {
            return failure(MSG.ALREADY_LIKED, 409)
        }

        await query(
            'INSERT INTO curtidas (user_id, receita_id) VALUES ($1, $2)',
            [userId, receitaId]
        )

        return success(undefined, MSG.SUCCESS_LIKE)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota POST /api/curtidas:')
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json().catch(() => ({}))
        const userId = assertString(body.userId, MSG.INVALID_USER_ID)
        const receitaId = assertString(body.receitaId, MSG.INVALID_RECIPE_ID)

        await ensureSameUser(userId)
        await ensureUserExists(userId, MSG.USER_NOT_FOUND)
        await ensureRecipeExists(receitaId, MSG.RECIPE_NOT_FOUND)

        const existingLike = await query(
            'SELECT id FROM curtidas WHERE user_id = $1 AND receita_id = $2',
            [userId, receitaId]
        )

        if (!existingLike.rows || existingLike.rows.length === 0) {
            return failure(MSG.NOT_LIKED, 404)
        }

        await query(
            'DELETE FROM curtidas WHERE user_id = $1 AND receita_id = $2',
            [userId, receitaId]
        )

        return success(undefined, MSG.SUCCESS_UNLIKE)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota DELETE /api/curtidas:')
    }
}
