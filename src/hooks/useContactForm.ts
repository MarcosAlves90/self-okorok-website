import { useState, useRef, FormEvent } from 'react'
import { fetchJson } from '@/lib/fetch-json'

interface ContactFormData {
    name: string
    email: string
    subject: string
    message: string
}

interface UseContactFormReturn {
    loading: boolean
    error: string
    success: string
    handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

const ENDPOINTS = {
    SEND_TICKET: '/api/email/ticket',
} as const

// Mensagens de feedback
const MESSAGES = {
    SUCCESS: 'Mensagem enviada com sucesso!',
    NETWORK_ERROR: 'Erro de rede',
    UNKNOWN_ERROR: 'Erro ao enviar a mensagem',
} as const

type TicketResponse = {
    message?: string
}

export function useContactForm(): UseContactFormReturn {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    // Ref para evitar duplo envio
    const submittingRef = useRef(false)

    // Limpa mensagens de erro e sucesso
    const resetMessages = () => {
        setError('')
        setSuccess('')
    }

    // Extrai os dados do formulário para o formato correto
    const extractFormData = (form: FormData): ContactFormData => ({
        name: String(form.get('nome') ?? '').trim(),
        email: String(form.get('email') ?? '').trim().toLowerCase(),
        subject: String(form.get('assunto') ?? '').trim(),
        message: String(form.get('mensagem') ?? '').trim(),
    })

    // Envia os dados para o endpoint
    const sendTicket = async (data: ContactFormData) => {
        const json = await fetchJson<TicketResponse>(
            ENDPOINTS.SEND_TICKET,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            },
            MESSAGES.UNKNOWN_ERROR
        )

        return json?.message ?? MESSAGES.SUCCESS
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Evita múltiplos envios simultâneos
        if (loading || submittingRef.current) return

        submittingRef.current = true
        resetMessages()
        setLoading(true)

        const form = e.currentTarget

        try {
            const formData = new FormData(form)
            const contactData = extractFormData(formData)
            const successMessage = await sendTicket(contactData)

            setSuccess(successMessage)
            form.reset()
        } catch (error) {
            console.error('Erro ao enviar ticket:', error)
            setError(error instanceof Error ? error.message : MESSAGES.NETWORK_ERROR)
        } finally {
            setLoading(false)
            submittingRef.current = false
        }
    }

    return {
        loading,
        error,
        success,
        handleSubmit,
    }
}
