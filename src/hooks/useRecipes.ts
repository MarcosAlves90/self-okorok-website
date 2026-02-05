import { useEffect, useState } from 'react'
import type { Recipe } from '@/types/recipe'
import { fetchJson } from '@/lib/fetch-json'

interface UseRecipesOptions {
    endpoint: string
    errorMessage: string
    enabled?: boolean
}

export function useRecipes({ endpoint, errorMessage, enabled = true }: UseRecipesOptions) {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(enabled)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!enabled) {
            setLoading(false)
            return
        }

        const controller = new AbortController()

        async function fetchRecipes() {
            setLoading(true)
            setError(null)

            try {
                const data = await fetchJson<Recipe[]>(endpoint, { signal: controller.signal }, errorMessage)
                setRecipes(data.data || [])
            } catch (err) {
                if (controller.signal.aborted) return
                setError(err instanceof Error ? err.message : 'Erro desconhecido')
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchRecipes()

        return () => {
            controller.abort()
        }
    }, [enabled, endpoint, errorMessage])

    return { recipes, setRecipes, loading, error }
}
