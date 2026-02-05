import { success, handleApiError } from '@/lib/api-utils'
import { clearAuthCookie } from '@/lib/auth'

const MSG = {
    SUCCESS: 'Logout realizado com sucesso',
    SERVER_ERROR: 'Erro interno do servidor',
} as const

export async function POST() {
    try {
        const response = success(undefined, MSG.SUCCESS)
        clearAuthCookie(response)
        return response
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota POST /api/usuarios/logout:')
    }
}
