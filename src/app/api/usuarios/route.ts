import { query } from '@/lib/database'
import { uploadImage } from '@/lib/uploadImage'
import { WelcomeEmailService } from '@/lib/email/welcome-email-service'
import { handleApiError, success, failure, assertString } from '@/lib/api-utils'

const isValidEmail = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)

const MSG = {
    SUCCESS_CREATED: 'Usuário criado com sucesso',
    SUCCESS_FETCHED: 'Usuários obtidos com sucesso',
    INVALID_NAME: 'Nome é obrigatório e deve ter pelo menos 2 caracteres',
    INVALID_EMAIL: 'E-mail inválido',
    INVALID_PASSWORD: 'Senha é obrigatória e deve ter pelo menos 6 caracteres',
    EMAIL_EXISTS: 'E-mail já cadastrado',
    INVALID_AVATAR: 'Falha ao processar avatar',
    SERVER_ERROR: 'Erro interno do servidor',
} as const

interface DatabaseUser {
    id: number
    name: string
    email: string
    created_at: string
    avatar_url?: string
    bio?: string
}

export async function GET() {
    try {
        const result = await query(
            'SELECT id, name, email, created_at, avatar_url, bio FROM users ORDER BY created_at DESC'
        )

        const users = result.rows.map((u: DatabaseUser) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.created_at,
            avatarUrl: u.avatar_url || null,
            bio: u.bio || null,
        }))

        return success(users, MSG.SUCCESS_FETCHED)
    } catch (err) {
        return handleApiError(err, MSG.SERVER_ERROR, 'Erro na rota GET /api/usuarios:')
    }
}

async function parseRequest(request: Request) {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
        const form = await request.formData()
        const file = form.get('avatar') as File | null
        return {
            name: String(form.get('name') || '').trim(),
            email: String(form.get('email') || '').trim().toLowerCase(),
            password: String(form.get('password') || ''),
            avatarFile: file && file.size > 0 ? file : null,
        }
    }

    const body = await request.json().catch(() => ({}))
    return {
        name: String(body.name || '').trim(),
        email: String(body.email || '').trim().toLowerCase(),
        password: String(body.password || ''),
        avatarFile: null as File | null,
    }
}

export async function POST(request: Request) {
    try {
        const { name, email, password, avatarFile } = await parseRequest(request)

        if (!name || name.length < 2) {
            return failure(MSG.INVALID_NAME, 400)
        }

        const emailValue = assertString(email, MSG.INVALID_EMAIL)
        if (!isValidEmail(emailValue)) {
            return failure(MSG.INVALID_EMAIL, 400)
        }

        if (!password || password.length < 6) {
            return failure(MSG.INVALID_PASSWORD, 400)
        }

        const exists = await query('SELECT id FROM users WHERE email = $1', [emailValue])
        if (exists.rows.length > 0) {
            return failure(MSG.EMAIL_EXISTS, 409)
        }

        let avatarUrl: string | null = null
        if (avatarFile) {
            try {
                avatarUrl = await uploadImage(avatarFile, 'imagens-de-perfil')
            } catch (err) {
                console.error('Erro ao fazer upload do avatar:', err)
                return failure(MSG.INVALID_AVATAR, 400)
            }
        }

        const res = await query(
            'INSERT INTO users (name, email, password, avatar_url, bio) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, created_at, avatar_url, bio',
            [name, emailValue, password, avatarUrl, null]
        )

        const u: DatabaseUser = res.rows[0]
        const safeUser = {
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.created_at,
            avatarUrl: u.avatar_url || null,
            bio: u.bio || null,
        }

        const emailService = new WelcomeEmailService()
        emailService.sendWelcomeEmail({ name: safeUser.name, email: safeUser.email }).catch((err) => {
            console.error('Erro ao enviar e-mail de boas-vindas:', err)
        })

        return success(safeUser, MSG.SUCCESS_CREATED, 201)
    } catch (err) {
        return handleApiError(err, MSG.SERVER_ERROR, 'Erro na rota POST /api/usuarios:')
    }
}
