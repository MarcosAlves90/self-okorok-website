'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Clock, Users } from 'lucide-react'
import RecipeViewSkeleton from '../molecules/RecipeViewSkeleton'
import LikeButton from '../molecules/LikeButton'
import BookmarkButton from '../molecules/BookmarkButton'
import BackLink from '../atoms/BackLink'
import type { Recipe } from '@/types/recipe'
import { fetchJson } from '@/lib/fetch-json'

export default function RecipeViewClient() {
    const params = useParams()
    const [recipe, setRecipe] = useState<Recipe | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const recipeId = Array.isArray(params.id) ? params.id[0] : params.id

        const fetchRecipe = async () => {
            try {
                const result = await fetchJson<Recipe>(`/api/receitas/${recipeId}`, undefined, 'Receita não encontrada')
                setRecipe(result.data || null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar receita')
                console.error('Erro ao buscar receita:', err)
            } finally {
                setLoading(false)
            }
        }

        if (recipeId) {
            fetchRecipe()
        }
    }, [params.id])

    if (loading) {
        return <RecipeViewSkeleton />
    }

    if (error || !recipe) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center">
                <div className="text-center text-foreground">
                    <p className="text-lg text-red-500">{error || 'Receita não encontrada'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-6xl flex flex-col gap-6 relative">
            <BackLink className="absolute -top-10 left-0" />
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex flex-col gap-6 w-full lg:w-[55%]">
                    <section
                        id="bloco-1"
                        className={`min-h-[16rem] sm:min-h-[20rem] rounded-xl overflow-hidden relative ${!recipe.imagemUrl ? 'bg-placeholder' : ''}`}
                    >
                        {recipe.imagemUrl && (
                            <Image
                                src={recipe.imagemUrl}
                                alt={recipe.titulo}
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                                className="absolute inset-0 w-full h-full"
                                priority
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            />
                        )}
                        {recipe.imagemUrl && <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/85 z-10" />}
                        <div className="relative z-20 h-full flex flex-col p-5">
                            <div className="w-full mt-auto">
                                <h1 className="w-full text-xl sm:text-2xl text-background font-semibold">
                                    {recipe.titulo}
                                </h1>
                                <div className="flex items-center gap-3 mt-3">
                                    <LikeButton recipeId={recipe.id} />
                                    <BookmarkButton recipeId={recipe.id} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="bloco-2" className="bg-foreground rounded-xl flex flex-col p-5">
                        <div className="w-full flex flex-col items-start gap-4">
                            <h3 className="text-base font-semibold">Detalhes</h3>
                            {recipe.categoria && (
                                <div className="w-full">
                                    <p className="text-xs text-background/80">Categoria</p>
                                    <div className="mt-2 w-full rounded-md bg-foreground-dark text-sm text-background p-2">
                                        {recipe.categoria}
                                    </div>
                                </div>
                            )}

                            {recipe.observacoes && (
                                <div className="w-full">
                                    <p className="text-xs text-background/80">Observações</p>
                                    <div className="mt-2 w-full rounded-md bg-foreground-dark text-sm text-background p-3">
                                        {recipe.observacoes}
                                    </div>
                                </div>
                            )}

                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {recipe.tempo && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4" />
                                        <span>{recipe.tempo}</span>
                                    </div>
                                )}

                                {recipe.rendimento && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4" />
                                        <span>{recipe.rendimento}</span>
                                    </div>
                                )}
                            </div>

                            {recipe.authorName && recipe.authorId && (
                                <Link className="w-full text-xs text-background/70 mt-2 hover:underline" href={`/usuarios/${recipe.authorId}`}>
                                    Por: {recipe.authorName}
                                </Link>
                            )}
                        </div>
                    </section>
                </div>

                <section id="bloco-3" className="h-full bg-foreground w-full lg:w-[45%] rounded-xl flex flex-col items-start gap-4 p-5">
                    <h3 className="text-base sm:text-lg font-semibold">Ingredientes</h3>
                    <div className="w-full rounded-md bg-foreground-dark text-sm text-background p-3">
                        <pre className="whitespace-pre-wrap font-sans">{recipe.ingredientes}</pre>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold">Modo de preparo</h3>
                    <div className="w-full rounded-md bg-foreground-dark text-sm text-background p-3 flex-1">
                        <pre className="whitespace-pre-wrap font-sans">{recipe.modo}</pre>
                    </div>
                </section>
            </div>
        </div>
    )
}
