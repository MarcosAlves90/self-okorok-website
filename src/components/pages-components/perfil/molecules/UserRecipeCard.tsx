import RecipeCard from '@/components/pages-components/home/molecules/RecipeCard'
import type { Recipe } from '@/types/recipe'

interface UserRecipeCardProps {
    recipe: Recipe
    isSelected: boolean
    onSelect: (id: string) => void
}

export default function UserRecipeCard({ recipe, isSelected, onSelect }: UserRecipeCardProps) {
    return (
        <div className="relative">
            {/* Checkbox de seleção */}
            <div className="absolute top-2 left-2 z-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(recipe.id)}
                    className="w-4 h-4 text-foreground bg-white border-2 border-foreground rounded focus:ring-foreground focus:ring-2"
                />
            </div>

            {/* Card da receita */}
            <div className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-foreground ring-offset-2' : ''}`}>
                <RecipeCard recipe={recipe} />
            </div>
        </div>
    )
}
