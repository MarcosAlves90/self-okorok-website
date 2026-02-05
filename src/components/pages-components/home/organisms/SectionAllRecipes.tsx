'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Drumstick } from 'lucide-react'
import FilterSidebar, { type FilterGroup, type SelectedFilters } from '../molecules/FilterSidebar'
import RecipeCard from '../molecules/RecipeCard'
import { RecipeEmptyState, RecipeErrorState, RecipeLoadingGrid } from '@/components/pages-components/perfil/shared/RecipeListFeedback'
import { useRecipes } from '@/hooks/useRecipes'
import { filterRecipes } from '@/lib/recipe-utils'
import type { Recipe } from '@/types/recipe'

const FILTER_FIELDS: Array<keyof Recipe> = ['titulo', 'ingredientes', 'categoria', 'modo']

function normalizeValue(value: string) {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
}

function parseMinutes(value?: string | null) {
    if (!value) return null
    const match = value.match(/\d+/)
    if (!match) return null
    const minutes = Number(match[0])
    return Number.isNaN(minutes) ? null : minutes
}

function getTimeBucket(minutes: number | null) {
    if (minutes === null) return null
    if (minutes <= 15) return 'ate-15'
    if (minutes <= 30) return '15-30'
    if (minutes <= 60) return '30-60'
    return 'mais-60'
}

function buildCategoryGroup(recipes: Recipe[]): FilterGroup | null {
    const categories = Array.from(
        new Set(recipes.map((recipe) => recipe.categoria).filter((value): value is string => !!value))
    ).sort((a, b) => a.localeCompare(b))

    if (categories.length === 0) return null

    return {
        id: 'categoria',
        label: 'Categoria',
        items: categories.map((label) => ({
            id: normalizeValue(label),
            label
        }))
    }
}

function buildTimeGroup(recipes: Recipe[]): FilterGroup | null {
    const buckets = new Map<string, { label: string; count: number }>([
        ['ate-15', { label: 'Ate 15 min', count: 0 }],
        ['15-30', { label: '15-30 min', count: 0 }],
        ['30-60', { label: '30-60 min', count: 0 }],
        ['mais-60', { label: 'Acima de 60 min', count: 0 }]
    ])
    let hasMissing = false

    recipes.forEach((recipe) => {
        const minutes = parseMinutes(recipe.tempo)
        const bucket = getTimeBucket(minutes)
        if (!bucket) {
            hasMissing = true
            return
        }
        const entry = buckets.get(bucket)
        if (entry) entry.count += 1
    })

    const items = Array.from(buckets.entries())
        .filter(([, value]) => value.count > 0)
        .map(([id, value]) => ({ id, label: value.label, count: value.count }))

    if (hasMissing) {
        items.push({ id: 'sem-tempo', label: 'Sem informacao', count: recipes.filter((r) => !parseMinutes(r.tempo)).length })
    }

    if (items.length === 0) return null

    return {
        id: 'tempo',
        label: 'Tempo de preparo',
        items
    }
}

function applyFilters(recipes: Recipe[], filters: SelectedFilters, groups: FilterGroup[]) {
    if (groups.length === 0) return recipes

    return recipes.filter((recipe) => {
        return groups.every((group) => {
            const selected = filters[group.id]
            if (!selected || selected.size === 0) return true

            if (group.id === 'categoria') {
                const value = recipe.categoria ? normalizeValue(recipe.categoria) : ''
                return value && Array.from(selected).some((itemId) => value.includes(itemId))
            }

            if (group.id === 'tempo') {
                const minutes = parseMinutes(recipe.tempo)
                const bucket = getTimeBucket(minutes)
                if (!bucket) return selected.has('sem-tempo')
                return selected.has(bucket)
            }

            const searchable = FILTER_FIELDS.map((field) => recipe[field]).filter(Boolean).join(' ')
            const normalized = normalizeValue(searchable)
            return Array.from(selected).some((itemId) => normalized.includes(itemId))
        })
    })
}

export default function AllRecipes() {
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('q') || ''

    const { recipes, loading, error } = useRecipes({
        endpoint: '/api/receitas',
        errorMessage: 'Erro ao carregar receitas'
    })

    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    const filterGroups = useMemo(() => {
        const groups: FilterGroup[] = []
        const categoryGroup = buildCategoryGroup(recipes)
        if (categoryGroup) groups.push(categoryGroup)
        const timeGroup = buildTimeGroup(recipes)
        if (timeGroup) groups.push(timeGroup)
        return groups
    }, [recipes])

    const filteredRecipes = useMemo(() => {
        const filteredBySearch = filterRecipes(recipes, searchQuery, FILTER_FIELDS)
        return applyFilters(filteredBySearch, selectedFilters, filterGroups)
    }, [recipes, searchQuery, selectedFilters, filterGroups])

    const totalSelected = useMemo(
        () => Object.values(selectedFilters).reduce((total, set) => total + (set?.size ?? 0), 0),
        [selectedFilters]
    )

    const toggleFilter = (groupId: string, itemId: string) => {
        setSelectedFilters((prev) => {
            const current = prev[groupId] ?? new Set<string>()
            const next = new Set(current)
            if (next.has(itemId)) {
                next.delete(itemId)
            } else {
                next.add(itemId)
            }
            return { ...prev, [groupId]: next }
        })
    }

    const clearFilters = () => setSelectedFilters({})

    return (
        <section id="todas-receitas" className="px-[var(--pc-padding)] py-15 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-protest-strike text-foreground text-3xl sm:text-4xl lg:text-5xl flex items-center gap-3">
                    <span>
                        {searchQuery
                            ? `Resultados para \"${searchQuery}\"`
                            : 'Todas as Receitas'
                        }
                    </span>
                    <Drumstick className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 text-foreground fill-current" aria-hidden="true" stroke="none" fill="currentColor" />
                </h2>
                <div className="text-sm text-foreground/70">
                    {filteredRecipes.length} receita(s)
                </div>
            </div>

            {searchQuery && (
                <div className="text-foreground/70 text-sm">
                    {filteredRecipes.length} receita(s) encontrada(s)
                </div>
            )}

            <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-6 lg:gap-8">
                <aside className="w-full lg:w-80 flex-shrink-0">
                    <FilterSidebar
                        groups={filterGroups}
                        selected={selectedFilters}
                        totalSelected={totalSelected}
                        collapsed={sidebarCollapsed}
                        onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
                        onToggleItem={toggleFilter}
                        onClearAll={clearFilters}
                    />
                </aside>

                <div className="w-full flex-1 min-w-0">
                    {loading ? (
                        <RecipeLoadingGrid
                            count={18}
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
                        />
                    ) : error ? (
                        <RecipeErrorState
                            error={error}
                            loginMessage="Voce precisa estar logado para ver receitas."
                            fallbackMessage="Erro:"
                        />
                    ) : filteredRecipes.length === 0 ? (
                        <RecipeEmptyState
                            searchTerm={searchQuery}
                            emptyMessage="Nenhuma receita encontrada"
                            emptySearchMessage={`Nenhuma receita encontrada para \"${searchQuery}\"`}
                        />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full">
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
