'use client'
import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import MostVotedCard from "../molecules/MostVotedCard";
import MostVotedCardSkeleton from "../molecules/MostVotedCardSkeleton";
import { Star } from "lucide-react";
import { fetchJson } from '@/lib/fetch-json';

type Item = {
    id: string;
    title: string;
    image: string;
    href?: string;
};

type MostVotedApiRecipe = {
    id: string;
    title: string;
    image: string;
    likes_count: number;
};

const sampleData: Item[] = [
    { id: "1", title: "Carne da Receita", image: "/local-images/linguica.png", href: "/receitas/1" },
    { id: "2", title: "Prato do Chef", image: "/local-images/linguica.png", href: "/receitas/2" },
    { id: "3", title: "Especial da Casa", image: "/local-images/linguica.png", href: "/receitas/3" },
    { id: "4", title: "Clássico", image: "/local-images/linguica.png", href: "/receitas/4" },
    { id: "5", title: "Sabor do Dia", image: "/local-images/linguica.png", href: "/receitas/5" },
    { id: "6", title: "Receita Tradicional", image: "/local-images/linguica.png", href: "/receitas/6" },
];

export default function MostVoted(): ReactElement {
    const [recipes, setRecipes] = useState<Item[]>(sampleData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController()

        const fetchMostVoted = async () => {
            try {
                const data = await fetchJson<MostVotedApiRecipe[]>(
                    '/api/receitas/mais-votadas',
                    { signal: controller.signal },
                    'Erro ao buscar receitas mais votadas'
                );

                const fetchedRecipes = (data.data || []).map((recipe) => ({
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    href: `/receitas/${recipe.id}`
                }));

                // Se não há receitas, mantém os dados mocados
                setRecipes(fetchedRecipes.length > 0 ? fetchedRecipes : sampleData);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Erro ao buscar receitas mais votadas:', error);
                    setRecipes(sampleData);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchMostVoted();

        return () => {
            controller.abort()
        }
    }, []);

    if (loading) {
        return (
            <section id="mais-votadas" className="px-[var(--pc-padding)] py-15 space-y-10">
                <h2 className="font-protest-strike text-foreground text-3xl sm:text-4xl lg:text-5xl flex items-center gap-3">
                    <span>As Mais Votadas</span>
                    <Star className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 text-foreground fill-current" aria-hidden="true" stroke="none" fill="currentColor" />
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <MostVotedCardSkeleton key={index} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="mais-votadas" className="px-[var(--pc-padding)] py-15 space-y-10">
            <h2 className="font-protest-strike text-foreground text-3xl sm:text-4xl lg:text-5xl flex items-center gap-3">
                <span>As Mais Votadas</span>
                <Star className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 text-foreground fill-current" aria-hidden="true" stroke="none" fill="currentColor" />
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {recipes.map((item) => (
                    <MostVotedCard key={item.id} imageSrc={item.image} title={item.title} href={item.href} />
                ))}
            </div>
        </section>
    );
}
