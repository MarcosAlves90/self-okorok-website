'use client'

import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import Link from 'next/link';
import Button from '@/components/atoms/Button';
import { useUser } from '@/hooks/UserContext';
import UsersSkeleton from '../molecules/UsersSkeleton';
import UserCard from '../molecules/UserCard';
import PagePanel from '@/components/pages-components/shared/PagePanel';
import { fetchJson } from '@/lib/fetch-json';

type User = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    avatarUrl?: string | null;
    bio?: string | null;
};

function resolveUserId(user: Record<string, unknown> | null): number | string | null {
    if (!user) return null;
    const id = user.id;
    if (typeof id === 'number' || typeof id === 'string') return id;
    return null;
}

export default function UsuariosClient(): ReactElement {
    const [users, setUsers] = useState<User[]>([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useUser();

    const currentUserId = resolveUserId(currentUser as Record<string, unknown> | null);

    useEffect(() => {
        const controller = new AbortController();

        const loadUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchJson<User[]>(
                    '/api/usuarios',
                    { signal: controller.signal },
                    'Falha ao carregar usuários'
                );
                setUsers(response.data || []);
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Erro ao buscar usuários:', err);
                    setError(err instanceof Error ? err.message : 'Falha ao carregar usuários');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadUsers();

        return () => {
            controller.abort();
        };
    }, []);

    const filtered = useMemo(() => {
        return (Array.isArray(users) ? users : [])
            .filter((u) => u.name.toLowerCase().includes(q.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [q, users]);

    return (
        <PagePanel
            title="Usuários"
            description="Explore a comunidade de usuários da plataforma. Encontre outros entusiastas da culinária e descubra suas receitas."
            toolbar={
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between max-w-5xl">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                        <input
                            id="search"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Pesquisar por nome..."
                            aria-label="Pesquisar usuários por nome"
                            className="w-full h-11 bg-background-gray placeholder:text-foreground/60 border-2 border-foreground rounded-xl px-4 text-sm focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        {currentUser ? (
                            <Link href="/perfil">
                                <Button variant="primary" size="sm" className="w-full sm:w-auto h-11 whitespace-nowrap">Meu Perfil</Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button variant="primary" size="sm" className="w-full sm:w-auto h-11 whitespace-nowrap">Fazer login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            {loading ? (
                <UsersSkeleton />
            ) : error ? (
                <div className="w-full max-w-5xl mt-6 flex justify-center items-center py-12">
                    <div className="text-red-500 text-center">
                        <p className="text-lg font-medium">Ops! Algo deu errado</p>
                        <p className="text-sm mt-2">{error}</p>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="w-full max-w-5xl mt-6 flex justify-center items-center py-12">
                    <div className="text-foreground/60 text-center">
                        <p className="text-lg font-medium">Nenhum usuário encontrado</p>
                        <p className="text-sm mt-2">Tente ajustar sua pesquisa ou filtro</p>
                    </div>
                </div>
            ) : (
                <section className="w-full max-w-5xl mt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {filtered.map((user) => (
                            <UserCard key={user.id} user={user} currentUserId={currentUserId} />
                        ))}
                    </div>
                </section>
            )}
        </PagePanel>
    );
}
