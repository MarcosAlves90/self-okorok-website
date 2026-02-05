import { query } from '@/lib/database'
import { assertParam, ensureUserExists, handleApiError, success } from '@/lib/api-utils'
import { ensureSameUser } from '@/lib/auth'

const MSG = {
    SUCCESS: 'Receitas marcadas obtidas com sucesso',
    INVALID_USER_ID: 'ID do usuário é obrigatório',
    USER_NOT_FOUND: 'Usuário não encontrado',
    SERVER_ERROR: 'Erro interno do servidor',
} as const

interface DatabaseRecipe {
    id: number | string
    titulo: string
    ingredientes: string
    modo: string
    tempo?: string | null
    rendimento?: string | null
    categoria?: string | null
    observacoes?: string | null
    imagem_url?: string | null
    author_id?: string | null
    created_at?: string
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = assertParam(searchParams.get('userId'), MSG.INVALID_USER_ID)

        await ensureSameUser(userId)
        await ensureUserExists(userId, MSG.USER_NOT_FOUND)

        const queryText = `
            SELECT 
                r.id, r.titulo, r.ingredientes, r.modo, r.tempo, 
                r.rendimento, r.categoria, r.observacoes, r.imagem_url, 
                r.author_id, r.created_at
            FROM receitas r
            INNER JOIN marcados m ON r.id = m.receita_id
            WHERE m.user_id = $1
            ORDER BY m.created_at DESC
        `

        const result = await query(queryText, [userId])

        const receitas = result.rows.map((r: DatabaseRecipe) => ({
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
            createdAt: r.created_at || null,
        }))

        return success(receitas, MSG.SUCCESS)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota GET /api/receitas/marcadas:')
    }
}
