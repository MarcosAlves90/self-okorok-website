import { query } from '@/lib/database'
import { handleApiError, success, failure, assertString } from '@/lib/api-utils'

const isValidEmail = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)

const MSG = {
    SUCCESS: 'Login realizado com sucesso',
    INVALID_EMAIL: 'E-mail é obrigatório e deve ser válido',
    INVALID_PASSWORD: 'Senha é obrigatória',
    USER_NOT_FOUND: 'Usuário não encontrado',
    WRONG_PASSWORD: 'Senha incorreta',
    SERVER_ERROR: 'Erro interno do servidor',
} as const

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}))
        const email = assertString(body.email, MSG.INVALID_EMAIL)
        const password = assertString(body.password, MSG.INVALID_PASSWORD)

        if (!isValidEmail(email)) {
            return failure(MSG.INVALID_EMAIL, 400)
        }

        const result = await query(
            'SELECT id, name, email, password, avatar_url, bio, created_at FROM users WHERE email = $1',
            [email.toLowerCase()]
        )

        if (!result.rows || result.rows.length === 0) {
            return failure(MSG.USER_NOT_FOUND, 401)
        }

        const user = result.rows[0]

        if (user.password !== password) {
            return failure(MSG.WRONG_PASSWORD, 401)
        }

        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatar_url || null,
            bio: user.bio || null,
            createdAt: user.created_at,
        }

        return success(safeUser, MSG.SUCCESS)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota POST /api/usuarios/login:')
    }
}
