import { query } from '@/lib/database'
import { assertParam, ensureRecipeExists, handleApiError, success, failure } from '@/lib/api-utils'

const MSG = {
    SUCCESS: 'Receita deletada com sucesso',
    NOT_FOUND: 'Receita não encontrada',
    INVALID_ID: 'ID da receita é obrigatório',
    SERVER_ERROR: 'Erro interno do servidor',
} as const

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const recipeId = assertParam(id, MSG.INVALID_ID)

        await ensureRecipeExists(recipeId, MSG.NOT_FOUND)

        await query('DELETE FROM curtidas WHERE receita_id = $1', [recipeId])
        await query('DELETE FROM marcados WHERE receita_id = $1', [recipeId])
        await query('DELETE FROM receitas WHERE id = $1', [recipeId])

        return success(undefined, MSG.SUCCESS)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota DELETE /api/receitas/[id]:')
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const recipeId = assertParam(id, MSG.INVALID_ID)

        const result = await query(
            `SELECT 
                r.id, r.titulo, r.ingredientes, r.modo, r.tempo, r.rendimento, 
                r.categoria, r.observacoes, r.imagem_url, r.author_id, r.created_at,
                u.name as author_name
                FROM receitas r 
                LEFT JOIN users u ON r.author_id = u.id 
                WHERE r.id = $1`,
            [recipeId]
        )

        if (!result.rows || result.rows.length === 0) {
            return failure(MSG.NOT_FOUND, 404)
        }

        const r = result.rows[0]
        const receita = {
            id: r.id,
            titulo: r.titulo,
            ingredientes: r.ingredientes,
            modo: r.modo,
            tempo: r.tempo || null,
            rendimento: r.rendimento || null,
            categoria: r.categoria || null,
            observacoes: r.observacoes || null,
            imagemUrl: r.imagem_url || null,
            authorId: r.author_id || null,
            authorName: r.author_name || null,
            createdAt: r.created_at || null,
        }

        return success(receita)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota GET /api/receitas/[id]:')
    }
}
