'use client'

import { useCallback, useMemo, useState } from 'react'
import { useUser } from '@/hooks/UserContext'
import UserRecipeCard from '@/components/pages-components/perfil/molecules/UserRecipeCard'
import MinhasReceitasToolbar from '@/components/pages-components/perfil/molecules/MinhasReceitasToolbar'
import PagePanel from '@/components/pages-components/shared/PagePanel'
import { RecipeEmptyState, RecipeErrorState, RecipeLoadingGrid } from '@/components/pages-components/perfil/shared/RecipeListFeedback'
import { useUserRecipes } from '@/hooks/useUserRecipes'
import { useSelectableIds } from '@/hooks/useSelectableIds'
import { filterRecipes } from '@/lib/recipe-utils'
import { fetchJson } from '@/lib/fetch-json'

export default function MinhasReceitasClient() {
    const { user } = useUser()

    const { recipes, setRecipes, loading, error } = useUserRecipes({
        user,
        endpoint: '/api/receitas',
        errorMessage: 'Erro ao carregar receitas'
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

    const selectAllToggle = useCallback(() => {
        toggleAll(filteredRecipes)
    }, [filteredRecipes, toggleAll])

    const deleteRecipe = useCallback(async (id: string) => {
        try {
            await fetchJson(`/api/receitas/${id}`, { method: 'DELETE' }, 'Erro ao deletar receitas')
            return { id, ok: true, message: '' }
        } catch (err) {
            return { id, ok: false, message: err instanceof Error ? err.message : 'Erro ao deletar receitas' }
        }
    }, [])

    const deleteSelected = useCallback(async () => {
        if (selectedIds.size === 0) return

        const count = selectedIds.size
        const recipeWord = count === 1 ? 'receita' : 'receitas'
        const ok = window.confirm(
            `Atenção!\n\nTem certeza de que deseja deletar ${count} ${recipeWord}?\n\nEsta ação é irreversível e todos os dados relacionados serão permanentemente removidos.`
        )
        if (!ok) return

        setDeleting(true)
        try {
            const ids = Array.from(selectedIds)
            const results = await Promise.all(ids.map(deleteRecipe))
            const failed = results.filter(result => !result.ok)
            const succeededIds = results.filter(result => result.ok).map(result => result.id)

            if (succeededIds.length > 0) {
                setRecipes(prev => prev.filter(r => !succeededIds.includes(r.id)))
            }

            if (failed.length === 0) {
                clear()
                alert(count === 1 ? 'Receita deletada com sucesso.' : 'Receitas deletadas com sucesso.')
                return
            }

            setSelectedIds(new Set(failed.map(item => item.id)))
            if (succeededIds.length > 0) {
                alert('Algumas receitas foram deletadas, mas outras falharam. Tente novamente.')
            } else {
                alert('Erro ao deletar receitas. Verifique sua conexão e tente novamente.')
            }
        } catch (err) {
            console.error('Erro ao deletar receitas:', err)
            alert('Erro ao deletar algumas receitas. Verifique sua conexão e tente novamente.')
        } finally {
            setDeleting(false)
        }
    }, [clear, deleteRecipe, selectedIds, setRecipes, setSelectedIds])

    return (
        <PagePanel
            title="Minhas Receitas"
            description="Aqui estão as receitas que você criou. Você pode editar, remover ou compartilhar cada uma delas."
            toolbar={
                <MinhasReceitasToolbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCount={selectedCount}
                    allVisibleSelected={allVisibleSelected}
                    onSelectAll={selectAllToggle}
                    onDeleteSelected={deleteSelected}
                    deleting={deleting}
                />
            }
        >
            <section className="w-full max-w-5xl mt-6">
                {loading ? (
                    <RecipeLoadingGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" />
                ) : error ? (
                    <RecipeErrorState
                        error={error}
                        loginMessage="Você precisa estar logado para ver suas receitas."
                        fallbackMessage="Erro:"
                    />
                ) : filteredRecipes.length === 0 ? (
                    <RecipeEmptyState
                        searchTerm={searchTerm}
                        emptyMessage="Você ainda não criou nenhuma receita"
                        ctaHref="/receitas/criar"
                        ctaLabel="Criar sua primeira receita"
                    />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
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
