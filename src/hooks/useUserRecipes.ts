import { useEffect, useState } from 'react'
import type { Recipe } from '@/types/recipe'
import { fetchJson } from '@/lib/fetch-json'

type User = Record<string, unknown> | null

interface UseUserRecipesOptions {
    user: User
    endpoint: string
    errorMessage: string
}

function resolveUserId(user: User): string | null {
    if (!user || typeof user !== 'object') return null
    const id = (user as { id?: unknown }).id
    if (typeof id !== 'string') return null
    const trimmed = id.trim()
    return trimmed.length > 0 ? trimmed : null
}

export function useUserRecipes({ user, endpoint, errorMessage }: UseUserRecipesOptions) {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const userId = resolveUserId(user)

        if (!user) {
            setRecipes([])
            setError('Usuário não logado')
            setLoading(false)
            return
        }

        if (!userId) {
            setRecipes([])
            setError('ID do usuário não encontrado')
            setLoading(false)
            return
        }

        const controller = new AbortController()

        async function fetchUserRecipes() {
            setLoading(true)
            setError(null)

            try {
                const data = await fetchJson<Recipe[]>(`${endpoint}?userId=${userId}`, { signal: controller.signal }, errorMessage)
                setRecipes(data.data || [])
            } catch (err) {
                if (controller.signal.aborted) return
                setError(err instanceof Error ? err.message : 'Erro desconhecido')
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchUserRecipes()

        return () => {
            controller.abort()
        }
    }, [endpoint, errorMessage, user])

    return { recipes, setRecipes, loading, error }
}
