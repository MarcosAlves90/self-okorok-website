'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import RecipeCardSkeleton from '@/components/pages-components/home/molecules/RecipeCardSkeleton'
import { useUser } from '@/hooks/UserContext'
import UserRecipeCard from '@/components/pages-components/perfil/molecules/UserRecipeCard'
import ReceitasMarcadasToolbar from '@/components/pages-components/perfil/molecules/ReceitasMarcadasToolbar'
import Button from '@/components/atoms/Button'
import PagePanel from '@/components/pages-components/shared/PagePanel'

type Recipe = {
    id: string
    titulo: string
    ingredientes: string
    modo: string
    tempo?: string | null
    rendimento?: string | null
    categoria?: string | null
    observacoes?: string | null
    imagemUrl?: string | null
    authorId?: string | null
    createdAt?: string | null
}

function LoadingGrid() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
            ))}
        </div>
    )
}

function ErrorState({ error }: { error: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-red-600 text-center">
                {error === 'Usuário não logado' ? (
                    <>
                        <p className="mb-2">Você precisa estar logado para ver suas receitas marcadas.</p>
                        <Link href="/login">
                            <Button variant="primary" size="sm">Fazer Login</Button>
                        </Link>
                    </>
                ) : (
                    <p>Erro: {error}</p>
                )}
            </div>
        </div>
    )
}

function EmptyState({ searchTerm }: { searchTerm: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-foreground/60 text-center">
                {searchTerm ? 'Nenhuma receita encontrada com esse termo' : 'Você ainda não marcou nenhuma receita como favorita'}
            </div>
            {!searchTerm && (
                <Link href="/">
                    <Button variant="primary" size="sm">Explorar receitas</Button>
                </Link>
            )}
        </div>
    )
}

export default function ReceitasMarcadas() {
    const { user } = useUser()

    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set())
    const [deleting, setDeleting] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        let cancelled = false

        async function fetchBookmarkedRecipes() {
            setLoading(true)
            setError(null)

            if (!user) {
                setError('Usuário não logado')
                setLoading(false)
                return
            }

            const userId = user.id
            if (!userId) {
                setError('ID do usuário não encontrado')
                setLoading(false)
                return
            }

            try {
                const res = await fetch(`/api/receitas/marcadas?userId=${userId}`)
                if (!res.ok) throw new Error('Erro ao carregar receitas marcadas')

                const data = await res.json()
                if (data.success) {
                    if (!cancelled) setRecipes(data.data || [])
                } else {
                    throw new Error(data.message || 'Erro ao carregar receitas marcadas')
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : 'Erro desconhecido')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchBookmarkedRecipes()

        return () => { cancelled = true }
    }, [user])

    const filteredRecipes = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        return recipes.filter(r =>
            r.titulo.toLowerCase().includes(term) ||
            (r.categoria ?? '').toLowerCase().includes(term)
        )
    }, [recipes, searchTerm])

    const toggle = useCallback((recipeId: string) => {
        setSelectedRecipes(prev => {
            const next = new Set(prev)
            if (next.has(recipeId)) next.delete(recipeId)
            else next.add(recipeId)
            return next
        })
    }, [])

    const toggleAll = useCallback(() => {
        setSelectedRecipes(prev => {
            if (prev.size === filteredRecipes.length) return new Set<string>()
            return new Set(filteredRecipes.map(r => r.id))
        })
    }, [filteredRecipes])

    const removeSelected = useCallback(async () => {
        if (selectedRecipes.size === 0 || !user?.id) return

        const count = selectedRecipes.size
        const recipeWord = count === 1 ? 'receita' : 'receitas'
        const ok = window.confirm(
            `Tem certeza de que deseja remover ${count} ${recipeWord} dos seus favoritos?`
        )
        if (!ok) return

        setDeleting(true)
        try {
            const ids = Array.from(selectedRecipes)
            const promises = ids.map(recipeId => 
                fetch('/api/marcados', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, receitaId: recipeId })
                })
            )
            const results = await Promise.all(promises)

            for (const res of results) {
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}))
                    throw new Error(err.message || 'Erro ao remover receitas dos favoritos')
                }
            }

            setRecipes(prev => prev.filter(r => !selectedRecipes.has(r.id)))
            setSelectedRecipes(new Set())
            alert(count === 1 ? 'Receita removida dos favoritos.' : 'Receitas removidas dos favoritos.')
        } catch (err) {
            console.error('Falha ao remover receitas dos favoritos:', err)
            alert('Erro ao remover algumas receitas dos favoritos. Verifique sua conexão e tente novamente.')
        } finally {
            setDeleting(false)
        }
    }, [selectedRecipes, user?.id])

    return (
        <PagePanel
            title="Receitas Marcadas"
            description="Aqui estão as receitas que você marcou como favoritas. Você pode visualizar ou remover dos favoritos."
            toolbar={
                <ReceitasMarcadasToolbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCount={selectedRecipes.size}
                    totalCount={filteredRecipes.length}
                    onSelectAll={toggleAll}
                    onRemoveSelected={removeSelected}
                    removing={deleting}
                />
            }
        >
            <section className="w-full max-w-5xl mt-6">
                {loading ? (
                    <LoadingGrid />
                ) : error ? (
                    <ErrorState error={error} />
                ) : filteredRecipes.length === 0 ? (
                    <EmptyState searchTerm={searchTerm} />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredRecipes.map(recipe => (
                            <UserRecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                isSelected={selectedRecipes.has(recipe.id)}
                                onSelect={toggle}
                            />
                        ))}
                    </div>
                )}
            </section>
        </PagePanel>
    )
}
