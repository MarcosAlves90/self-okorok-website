import React from 'react'
import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import RecipeViewClient from '@/components/pages-components/receitas/organisms/RecipeViewClient'
import { query } from '@/lib/database';

type Props = { params: Promise<{ id: string }> };

type Recipe = {
    id: string;
    titulo: string;
    ingredientes: string;
    modo: string;
    tempo?: string | null;
    rendimento?: string | null;
    categoria?: string | null;
    observacoes?: string | null;
    imagemUrl?: string | null;
    authorId?: string | null;
    authorName?: string | null;
    createdAt?: string | null;
};

async function fetchRecipe(id: string): Promise<Recipe | null> {
    try {
        if (!id) {
            return null;
        }

        const result = await query(
            `SELECT 
                r.id, r.titulo, r.ingredientes, r.modo, r.tempo, r.rendimento, 
                r.categoria, r.observacoes, r.imagem_url, r.author_id, r.created_at,
                u.name as author_name
                FROM receitas r 
                LEFT JOIN users u ON r.author_id = u.id 
                WHERE r.id = $1`,
            [id]
        );

        if (!result.rows || result.rows.length === 0) {
            return null;
        }

        const r = result.rows[0];
        return {
            id: r.id,
            titulo: r.titulo,
            ingredientes: r.ingredientes,
            modo: r.modo,
            tempo: r.tempo || null,
            rendimento: r.rendimento || null,
            categoria: r.categoria || null,
            observacoes: r.observacoes || null,
            imagemUrl: r.imagem_url || null,
            authorId: r.author_id || null,
            authorName: r.author_name || null,
            createdAt: r.created_at || null,
        };
    } catch (error) {
        console.error('Erro ao obter receita:', error);
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    if (!id) return { title: 'Receita' };

    const recipe = await fetchRecipe(id);
    if (!recipe) notFound();
    return { title: recipe.titulo || 'Receita' };
}

export default function Page() {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] flex justify-center items-center py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)] text-background">
            <RecipeViewClient />
        </main>
    )
}
