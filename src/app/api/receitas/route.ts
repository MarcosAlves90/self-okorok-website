import { query } from '@/lib/database'
import { uploadImage } from '@/lib/uploadImage'
import { assertString, handleApiError, success, failure } from '@/lib/api-utils'

const MSG = {
    SUCCESS: 'Receita criada com sucesso',
    INVALID_TITLE: 'Título é obrigatório e deve ter pelo menos 2 caracteres',
    INVALID_INGREDIENTS: 'Ingredientes são obrigatórios e devem ter pelo menos 3 caracteres',
    INVALID_INSTRUCTIONS: 'Modo de preparo é obrigatório e deve ter pelo menos 3 caracteres',
    INVALID_AUTHOR: 'Author ID é obrigatório',
    INVALID_IMAGE: 'Falha ao processar imagem',
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

async function parseRequest(request: Request) {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
        const form = await request.formData()
        const file = form.get('imagem') as File | null
        return {
            titulo: String(form.get('titulo') || '').trim(),
            ingredientes: String(form.get('ingredientes') || '').trim(),
            modo: String(form.get('modo') || '').trim(),
            tempo: String(form.get('tempo') || '').trim() || null,
            rendimento: String(form.get('rendimento') || '').trim() || null,
            categoria: String(form.get('categoria') || '').trim() || null,
            observacoes: String(form.get('observacoes') || '').trim() || null,
            authorId: String(form.get('authorId') || '').trim() || null,
            imagemFile: file && file.size > 0 ? file : null,
        }
    }

    const body = await request.json().catch(() => ({}))
    return {
        titulo: String(body.titulo || body.title || '').trim(),
        ingredientes: String(body.ingredientes || body.ingredients || '').trim(),
        modo: String(body.modo || body.steps || '').trim(),
        tempo: String(body.tempo || '').trim() || null,
        rendimento: String(body.rendimento || '').trim() || null,
        categoria: String(body.categoria || '').trim() || null,
        observacoes: String(body.observacoes || '').trim() || null,
        authorId: String(body.authorId || '').trim() || null,
        imagemFile: null,
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        let queryText = 'SELECT id, titulo, ingredientes, modo, tempo, rendimento, categoria, observacoes, imagem_url, author_id, created_at FROM receitas'
        const queryParams: string[] = []

        if (userId) {
            queryText += ' WHERE author_id = $1'
            queryParams.push(userId)
        }

        queryText += ' ORDER BY created_at DESC'

        const result = await query(queryText, queryParams)

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

        return success(receitas)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota GET /api/receitas:')
    }
}

export async function POST(request: Request) {
    try {
        const {
            titulo,
            ingredientes,
            modo,
            tempo,
            rendimento,
            categoria,
            observacoes,
            authorId,
            imagemFile,
        } = await parseRequest(request)

        if (!titulo || titulo.length < 2) {
            return failure(MSG.INVALID_TITLE, 400)
        }
        if (!ingredientes || ingredientes.length < 3) {
            return failure(MSG.INVALID_INGREDIENTS, 400)
        }
        if (!modo || modo.length < 3) {
            return failure(MSG.INVALID_INSTRUCTIONS, 400)
        }

        const authorIdValue = assertString(authorId, MSG.INVALID_AUTHOR)

        let imagemUrl: string | null = null
        if (imagemFile) {
            try {
                imagemUrl = await uploadImage(imagemFile, 'imagens-de-receitas')
            } catch (err) {
                console.error('Erro ao fazer upload da imagem:', err)
                return failure(MSG.INVALID_IMAGE, 400)
            }
        }

        const res = await query(
            `INSERT INTO receitas (titulo, ingredientes, modo, tempo, rendimento, categoria, observacoes, imagem_url, author_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, titulo, ingredientes, modo, tempo, rendimento, categoria, observacoes, imagem_url, created_at`,
            [titulo, ingredientes, modo, tempo, rendimento, categoria, observacoes, imagemUrl, authorIdValue]
        )

        const r: DatabaseRecipe = res.rows[0]
        const safeRecipe = {
            id: r.id,
            titulo: r.titulo,
            ingredientes: r.ingredientes,
            modo: r.modo,
            tempo: r.tempo || null,
            rendimento: r.rendimento || null,
            categoria: r.categoria || null,
            observacoes: r.observacoes || null,
            imagemUrl: r.imagem_url || null,
            createdAt: r.created_at || null,
        }

        return success(safeRecipe, MSG.SUCCESS, 201)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota POST /api/receitas:')
    }
}
