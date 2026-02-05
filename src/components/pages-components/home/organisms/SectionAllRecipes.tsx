'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import FilterSidebar from '../molecules/FilterSidebar'
import RecipeCard from '../molecules/RecipeCard'
import RecipeCardSkeleton from '../molecules/RecipeCardSkeleton'
import { Drumstick } from "lucide-react";

interface Recipe {
    id: string
    titulo: string
    ingredientes: string
    modo: string
    tempo?: string | null
    rendimento?: string | null
    categoria?: string | null
    observacoes?: string | null
    imagemUrl?: string | null
    createdAt?: string | null
}

export default function AllRecipes() {
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('q') || ''
    
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([])
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchRecipes() {
            try {
                const response = await fetch('/api/receitas')
                if (!response.ok) {
                    throw new Error('Erro ao carregar receitas')
                }
                const data = await response.json()
                if (data.success) {
                    setAllRecipes(data.data)
                } else {
                    throw new Error(data.message || 'Erro ao carregar receitas')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido')
            } finally {
                setLoading(false)
            }
        }

        fetchRecipes()
    }, [])

    // Filtrar receitas baseado no termo de pesquisa
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredRecipes(allRecipes)
            return
        }

        const query = searchQuery.toLowerCase().trim()
        const filtered = allRecipes.filter(recipe => 
            recipe.titulo.toLowerCase().includes(query) ||
            recipe.ingredientes.toLowerCase().includes(query) ||
            recipe.categoria?.toLowerCase().includes(query) ||
            recipe.modo.toLowerCase().includes(query)
        )
        
        setFilteredRecipes(filtered)
    }, [allRecipes, searchQuery])

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
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {Array.from({ length: 18 }).map((_, i) => (
                                <RecipeCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-red-600">Erro: {error}</div>
                        </div>
                    ) : filteredRecipes.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-foreground/60">
                                {searchQuery 
                                    ? `Nenhuma receita encontrada para "${searchQuery}"` 
                                    : 'Nenhuma receita encontrada'
                                }
                            </div>
                        </div>
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
