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
    SUCCESS_BOOKMARK: 'Receita marcada como favorita com sucesso',
    SUCCESS_UNBOOKMARK: 'Receita removida dos favoritos com sucesso',
    SUCCESS_GET: 'Marcados obtidos com sucesso',
    ALREADY_BOOKMARKED: 'Receita já foi marcada como favorita por este usuário',
    NOT_BOOKMARKED: 'Receita não foi marcada como favorita por este usuário',
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
            const userBookmark = await query(
                'SELECT id FROM marcados WHERE user_id = $1 AND receita_id = $2',
                [userIdValue, receitaId]
            )

            const hasBookmarked = userBookmark.rows && userBookmark.rows.length > 0

            return success({ hasBookmarked }, MSG.SUCCESS_GET)
        }

        const totalBookmarks = await query(
            'SELECT COUNT(*) as total FROM marcados WHERE receita_id = $1',
            [receitaId]
        )

        const total = parseInt(totalBookmarks.rows[0].total) || 0

        return success({ total }, MSG.SUCCESS_GET)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota GET /api/marcados:')
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

        const existingBookmark = await query(
            'SELECT id FROM marcados WHERE user_id = $1 AND receita_id = $2',
            [userId, receitaId]
        )

        if (existingBookmark.rows && existingBookmark.rows.length > 0) {
            return failure(MSG.ALREADY_BOOKMARKED, 409)
        }

        await query(
            'INSERT INTO marcados (user_id, receita_id) VALUES ($1, $2)',
            [userId, receitaId]
        )

        return success(undefined, MSG.SUCCESS_BOOKMARK)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota POST /api/marcados:')
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

        const existingBookmark = await query(
            'SELECT id FROM marcados WHERE user_id = $1 AND receita_id = $2',
            [userId, receitaId]
        )

        if (!existingBookmark.rows || existingBookmark.rows.length === 0) {
            return failure(MSG.NOT_BOOKMARKED, 404)
        }

        await query(
            'DELETE FROM marcados WHERE user_id = $1 AND receita_id = $2',
            [userId, receitaId]
        )

        return success(undefined, MSG.SUCCESS_UNBOOKMARK)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota DELETE /api/marcados:')
    }
}
