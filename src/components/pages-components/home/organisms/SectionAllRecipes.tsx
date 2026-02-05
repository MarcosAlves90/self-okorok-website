'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Drumstick } from 'lucide-react'
import FilterSidebar from '../molecules/FilterSidebar'
import RecipeCard from '../molecules/RecipeCard'
import { RecipeEmptyState, RecipeErrorState, RecipeLoadingGrid } from '@/components/pages-components/perfil/shared/RecipeListFeedback'
import { useRecipes } from '@/hooks/useRecipes'
import { filterRecipes } from '@/lib/recipe-utils'

export default function AllRecipes() {
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('q') || ''

    const { recipes, loading, error } = useRecipes({
        endpoint: '/api/receitas',
        errorMessage: 'Erro ao carregar receitas'
    })

    const filteredRecipes = useMemo(() => {
        return filterRecipes(recipes, searchQuery, ['titulo', 'ingredientes', 'categoria', 'modo'])
    }, [recipes, searchQuery])

    return (
        <section id="todas-receitas" className="px-[var(--pc-padding)] py-15 space-y-10">
            <h2 className="font-protest-strike text-foreground text-3xl sm:text-4xl lg:text-5xl flex items-center gap-3">
                <span>
                    {searchQuery
                        ? `Resultados para "${searchQuery}"`
                        : 'Todas as Receitas'
                    }
                </span>
                <Drumstick className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 text-foreground fill-current" aria-hidden="true" stroke="none" fill="currentColor" />
            </h2>

            {searchQuery && (
                <div className="text-foreground/70 text-lg">
                    {filteredRecipes.length} receita(s) encontrada(s)
                </div>
            )}

            <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
                <aside className="w-full lg:w-72 flex-shrink-0">
                    <FilterSidebar />
                </aside>

                <div className="flex-1">
                    {loading ? (
                        <RecipeLoadingGrid
                            count={18}
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                        />
                    ) : error ? (
                        <RecipeErrorState
                            error={error}
                            loginMessage="Você precisa estar logado para ver receitas."
                            fallbackMessage="Erro:"
                        />
                    ) : filteredRecipes.length === 0 ? (
                        <RecipeEmptyState
                            searchTerm={searchQuery}
                            emptyMessage="Nenhuma receita encontrada"
                            emptySearchMessage={`Nenhuma receita encontrada para "${searchQuery}"`}
                        />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {filteredRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )

}
