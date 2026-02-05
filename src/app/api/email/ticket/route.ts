import { TicketEmailService } from '@/lib/email/ticket-email-service'
import { extractTicketData, validateTicketData } from '@/lib/email/ticket-utils'
import { handleApiError, success, failure } from '@/lib/api-utils'

const MSG = {
    SUCCESS: 'E-mail enviado com sucesso!',
    VALIDATION_ERROR: 'Dados inválidos',
    SERVER_ERROR: 'Erro interno do servidor',
} as const

export async function POST(request: Request) {
    try {
        const contentType = request.headers.get('content-type') || ''
        const data = contentType.includes('multipart/form-data')
            ? extractTicketData(await request.formData())
            : extractTicketData(await request.json())

        const validation = validateTicketData(data)
        if (!validation.isValid) {
            return failure(MSG.VALIDATION_ERROR, 400, { errors: validation.errors })
        }

        await new TicketEmailService().sendTicketEmail(data)
        return success(undefined, MSG.SUCCESS)
    } catch (error) {
        return handleApiError(error, MSG.SERVER_ERROR, 'Erro na rota POST /api/email/ticket:')
    }
}
