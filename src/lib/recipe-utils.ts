import type { Recipe } from '@/types/recipe'

const DEFAULT_FIELDS: Array<keyof Recipe> = ['titulo', 'categoria']

function getRecipeFieldValue(recipe: Recipe, field: keyof Recipe) {
    const value = recipe[field]
    return typeof value === 'string' ? value : ''
}

export function filterRecipes(
    recipes: Recipe[],
    searchTerm: string,
    fields: Array<keyof Recipe> = DEFAULT_FIELDS
) {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return recipes

    return recipes.filter(recipe =>
        fields.some(field => getRecipeFieldValue(recipe, field).toLowerCase().includes(term))
    )
}
