"use client"
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { useUser } from '@/hooks/UserContext'
import { fetchJson } from '@/lib/fetch-json'

interface LikeButtonProps {
    recipeId: string
    className?: string
}

type LikeStatusResponse = { hasLiked: boolean }

type LikeCountResponse = { total: number }

export default function LikeButton({ recipeId, className = "" }: LikeButtonProps) {
    const { user } = useUser()
    const [isLiked, setIsLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const controller = new AbortController()

        const fetchLikeData = async () => {
            setIsFetching(true)
            try {
                const userId = user?.id ? String(user.id) : undefined

                const totalPromise = fetchJson<LikeCountResponse>(
                    `/api/curtidas?receitaId=${recipeId}`,
                    { signal: controller.signal },
                    'Erro ao carregar curtidas'
                )

                const statusPromise = userId
                    ? fetchJson<LikeStatusResponse>(
                        `/api/curtidas?receitaId=${recipeId}&userId=${userId}`,
                        { signal: controller.signal },
                        'Erro ao carregar curtidas'
                    )
                    : Promise.resolve(null)

                const [totalResult, statusResult] = await Promise.all([totalPromise, statusPromise])

                if (statusResult?.data) {
                    setIsLiked(statusResult.data.hasLiked)
                }

                if (totalResult?.data) {
                    setLikesCount(totalResult.data.total)
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Falha ao carregar dados de curtida:', err)
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsFetching(false)
                }
            }
        }

        fetchLikeData()

        return () => {
            controller.abort()
        }
    }, [recipeId, user?.id])

    const handleLike = async () => {
        if (!user?.id || loading) return

        setLoading(true)
        try {
            const method = isLiked ? 'DELETE' : 'POST'
            await fetchJson(
                '/api/curtidas',
                {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: String(user.id),
                        receitaId: String(recipeId)
                    })
                },
                'Erro ao atualizar curtida'
            )

            setIsLiked(!isLiked)
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
        } catch (err) {
            console.error('Falha na operação de curtir:', err)
        } finally {
            setLoading(false)
        }
    }

    if (user?.id) {
        if (isFetching) {
            return (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-md bg-background/20 animate-pulse ${className}`} aria-hidden="true">
                    <div className="w-4 h-4 bg-foreground/30 rounded" />
                    <div className="w-6 h-4 bg-foreground/30 rounded" />
                </div>
            )
        }

        return (
            <button
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center cursor-pointer gap-2 px-3 py-2 rounded-md transition-colors ${
                    isLiked
                        ? 'bg-red-500 text-white'
                        : 'bg-background text-foreground hover:bg-background/30'
                } disabled:opacity-50 ${className}`}>
                <Heart strokeWidth={3} className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-bold">{likesCount}</span>
            </button>
        )
    }

    if (isFetching) {
        return (
            <div className={`flex items-center gap-2 px-3 py-2 bg-background/20 rounded-md animate-pulse ${className}`} aria-hidden="true">
                <div className="w-4 h-4 bg-foreground/30 rounded" />
                <div className="w-6 h-4 bg-foreground/30 rounded" />
            </div>
        )
    }

    return (
        <div className={`flex items-center cursor-pointer gap-2 px-3 py-2 bg-background/20 rounded-md ${className}`}>
            <Heart className="h-4 w-4 text-background" />
            <span className="text-sm text-background">{likesCount}</span>
        </div>
    )
}
