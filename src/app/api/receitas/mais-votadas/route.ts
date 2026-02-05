import { query } from '@/lib/database'
import { handleApiError, success } from '@/lib/api-utils'

const MSG = {
    SUCCESS: 'Receitas mais votadas obtidas com sucesso',
    SERVER_ERROR: 'Erro interno do servidor',
} as const

interface MostVotedRecipe {
    id: string
    title: string
    image: string
    likes_count: number
}

interface DatabaseRow {
    id: string
    titulo: string
    imagem_url?: string | null
    likes_count: string
}

export async function GET() {
    try {
        const queryText = `
            SELECT
                r.id,
                r.titulo,
                r.imagem_url,
                COUNT(c.id) as likes_count
            FROM receitas r
            LEFT JOIN curtidas c ON r.id = c.receita_id
            GROUP BY r.id, r.titulo, r.imagem_url
            ORDER BY likes_count DESC, r.created_at DESC
            LIMIT 6
        `

        const result = await query(queryText)

        const recipes: MostVotedRecipe[] = result.rows.map((row: DatabaseRow) => ({
            id: row.id,
            title: row.titulo,
            image: row.imagem_url || '/local-images/linguica.png',
            likes_count: parseInt(row.likes_count) || 0,
        }))

        return success(recipes, MSG.SUCCESS)
    } catch (err) {
        return handleApiError(err, MSG.SERVER_ERROR, 'Erro na rota GET /api/receitas/most-voted:')
    }
}
