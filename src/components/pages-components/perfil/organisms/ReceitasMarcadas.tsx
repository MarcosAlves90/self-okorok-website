'use client'

import { useCallback, useMemo, useState } from 'react'
import { useUser } from '@/hooks/UserContext'
import UserRecipeCard from '@/components/pages-components/perfil/molecules/UserRecipeCard'
import ReceitasMarcadasToolbar from '@/components/pages-components/perfil/molecules/ReceitasMarcadasToolbar'
import PagePanel from '@/components/pages-components/shared/PagePanel'
import { RecipeEmptyState, RecipeErrorState, RecipeLoadingGrid } from '@/components/pages-components/perfil/shared/RecipeListFeedback'
import { useUserRecipes } from '@/hooks/useUserRecipes'
import { useSelectableIds } from '@/hooks/useSelectableIds'
import { filterRecipes } from '@/lib/recipe-utils'
import { fetchJson } from '@/lib/fetch-json'

function resolveUserId(user: Record<string, unknown> | null): string | null {
    if (!user || typeof user !== 'object') return null
    const id = (user as { id?: unknown }).id
    return typeof id === 'string' && id.trim().length > 0 ? id : null
}

export default function ReceitasMarcadas() {
    const { user } = useUser()
    const userId = resolveUserId(user)

    const { recipes, setRecipes, loading, error } = useUserRecipes({
        user,
        endpoint: '/api/receitas/marcadas',
        errorMessage: 'Erro ao carregar receitas marcadas'
    })
    const { selectedIds, selectedCount, toggle, toggleAll, clear, setSelectedIds } = useSelectableIds(recipes)
    const [deleting, setDeleting] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredRecipes = useMemo(() => {
        return filterRecipes(recipes, searchTerm)
    }, [recipes, searchTerm])

    const allVisibleSelected = useMemo(() => {
        return filteredRecipes.length > 0 && filteredRecipes.every(recipe => selectedIds.has(recipe.id))
    }, [filteredRecipes, selectedIds])

    const toggleAllVisible = useCallback(() => {
        toggleAll(filteredRecipes)
    }, [filteredRecipes, toggleAll])

    const removeBookmark = useCallback(async (receitaId: string, uid: string) => {
        try {
            await fetchJson('/api/marcados', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: uid, receitaId })
            }, 'Erro ao remover receitas dos favoritos')
            return { id: receitaId, ok: true, message: '' }
        } catch (err) {
            return { id: receitaId, ok: false, message: err instanceof Error ? err.message : 'Erro ao remover receitas dos favoritos' }
        }
    }, [])

    const removeSelected = useCallback(async () => {
        if (selectedIds.size === 0 || !userId) return

        const count = selectedIds.size
        const recipeWord = count === 1 ? 'receita' : 'receitas'
        const ok = window.confirm(
            `Tem certeza de que deseja remover ${count} ${recipeWord} dos seus favoritos?`
        )
        if (!ok) return

        setDeleting(true)
        try {
            const ids = Array.from(selectedIds)
            const results = await Promise.all(ids.map(id => removeBookmark(id, userId)))
            const failed = results.filter(result => !result.ok)
            const succeededIds = results.filter(result => result.ok).map(result => result.id)

            if (succeededIds.length > 0) {
                setRecipes(prev => prev.filter(r => !succeededIds.includes(r.id)))
            }

            if (failed.length === 0) {
                clear()
                alert(count === 1 ? 'Receita removida dos favoritos.' : 'Receitas removidas dos favoritos.')
                return
            }

            setSelectedIds(new Set(failed.map(item => item.id)))
            if (succeededIds.length > 0) {
                alert('Algumas receitas foram removidas, mas outras falharam. Tente novamente.')
            } else {
                alert('Erro ao remover receitas dos favoritos. Verifique sua conexão e tente novamente.')
            }
        } catch (err) {
            console.error('Falha ao remover receitas dos favoritos:', err)
            alert('Erro ao remover algumas receitas dos favoritos. Verifique sua conexão e tente novamente.')
        } finally {
            setDeleting(false)
        }
    }, [clear, removeBookmark, selectedIds, setRecipes, setSelectedIds, userId])

    return (
        <PagePanel
            title="Receitas Marcadas"
            description="Aqui estão as receitas que você marcou como favoritas. Você pode visualizar ou remover dos favoritos."
            toolbar={
                <ReceitasMarcadasToolbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCount={selectedCount}
                    allVisibleSelected={allVisibleSelected}
                    onSelectAll={toggleAllVisible}
                    onRemoveSelected={removeSelected}
                    removing={deleting}
                />
            }
        >
            <section className="w-full max-w-5xl mt-6">
                {loading ? (
                    <RecipeLoadingGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" />
                ) : error ? (
                    <RecipeErrorState
                        error={error}
                        loginMessage="Você precisa estar logado para ver suas receitas marcadas."
                        fallbackMessage="Erro:"
                    />
                ) : filteredRecipes.length === 0 ? (
                    <RecipeEmptyState
                        searchTerm={searchTerm}
                        emptyMessage="Você ainda não marcou nenhuma receita como favorita"
                        ctaHref="/"
                        ctaLabel="Explorar receitas"
                    />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredRecipes.map(recipe => (
                            <UserRecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                isSelected={selectedIds.has(recipe.id)}
                                onSelect={toggle}
                            />
                        ))}
                    </div>
                )}
            </section>
        </PagePanel>
    )
}
