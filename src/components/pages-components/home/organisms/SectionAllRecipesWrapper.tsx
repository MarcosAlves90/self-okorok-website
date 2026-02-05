'use client'

import { Suspense } from 'react'
import AllRecipes from './SectionAllRecipes'

function AllRecipesFallback() {
    return (
        <section id="todas-receitas" className="px-[var(--pc-padding)] py-15 space-y-10">
            <h2 className="font-protest-strike text-foreground text-3xl sm:text-4xl lg:text-5xl flex items-center gap-3">
                <span>Carregando receitas...</span>
            </h2>
            <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
                <aside className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-background/50 h-96 rounded animate-pulse"></div>
                </aside>
                <div className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 18 }).map((_, i) => (
                            <div key={i} className="bg-background/50 h-48 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default function AllRecipesWrapper() {
    return (
        <Suspense fallback={<AllRecipesFallback />}>
            <AllRecipes />
        </Suspense>
    )
}
