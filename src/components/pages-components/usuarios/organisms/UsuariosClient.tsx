'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/atoms/Button';
import { useUser } from '@/hooks/UserContext';
import UsersSkeleton from '../molecules/UsersSkeleton';
import UserCard from '../molecules/UserCard';

type User = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    avatarUrl?: string | null;
    bio?: string | null;
};


export default function UsuariosClient(): React.ReactElement {
    const [users, setUsers] = useState<User[]>([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useUser();

    const currentUserId: number | string | null = (() => {
        if (!currentUser) return null;
        const userData = currentUser as Record<string, unknown>;
        const id = userData.id;
        if (typeof id === 'number' || typeof id === 'string') return id;
        return null;
    })();

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetch('/api/usuarios')
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((response: { success: boolean; data: User[]; message: string }) => {
                if (mounted) {
                    setUsers(response.data || []);
                    setError(null);
                }
            })
            .catch((err) => {
                console.error('Erro ao buscar usuários:', err);
                if (mounted) setError('Falha ao carregar usuários');
            })
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, []);

    const filtered = (Array.isArray(users) ? users : [])
        .filter((u) => u.name.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="border-2 border-foreground px-6 sm:px-10 lg:px-20 py-10 sm:py-14 lg:py-17 max-w-6xl w-full flex flex-col gap-6 rounded-xl h-full text-center text-foreground mx-auto">
            <div className="flex flex-col items-center text-center gap-6">
                <div className="flex flex-col items-center gap-4">
                    <h1 className="font-protest-strike text-3xl sm:text-4xl">Usuários</h1>
                    <p className="text-sm sm:text-base text-foreground/80 max-w-2xl">
                        Explore a comunidade de usuários da plataforma. Encontre outros entusiastas da culinária e descubra suas receitas.
                    </p>
                </div>

                <div className="w-full flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between max-w-5xl">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                        <input
                            id="search"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Pesquisar por nome..."
                            aria-label="Pesquisar usuários por nome"
                            className="w-full bg-background-gray placeholder:text-foreground/60 border-2 border-foreground rounded-xl px-4 py-3 text-sm focus:outline-none"
                        />
                    </div>

                    <div className="w-full sm:w-auto">
                        {currentUser ? (
                            <Link href="/perfil">
                                <Button variant="primary" size="sm">Perfil</Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button variant="primary" size="sm">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>

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
                    <>
                        <section className="w-full max-w-5xl mt-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                                {filtered.map((user) => (
                                    <UserCard key={user.id} user={user} currentUserId={currentUserId} />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
