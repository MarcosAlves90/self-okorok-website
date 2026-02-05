'use client';

import { useEffect, useState, FormEvent } from 'react';
import type { ChangeEvent } from 'react';
import Button from '@/components/atoms/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/hooks/UserContext';
import PasswordInput from '@/components/atoms/PasswordInput';
import { fetchJson } from '@/lib/fetch-json';

type FormState = {
    email: string;
    password: string;
};

type LoginResponse = {
    id: string | number;
    name: string;
    email: string;
    avatarUrl?: string | null;
    bio?: string | null;
    createdAt: string;
};

export default function LoginForm() {
    const [form, setForm] = useState<FormState>({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, setUser } = useUser();

    useEffect(() => {
        if (user) router.push('/perfil');
    }, [user, router]);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const json = await fetchJson<LoginResponse>(
                '/api/usuarios/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                },
                'Erro ao autenticar'
            );
            setUser(json.data || null);
            router.push('/perfil');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de rede');
        } finally {
            setLoading(false);
        }
    }

    const inputClass =
        'w-full bg-background-gray placeholder:text-foreground/60 border-2 border-foreground rounded-xl px-4 py-3 focus:outline-none';

    return (
        <form className="w-full" onSubmit={handleSubmit} aria-busy={loading}>
            <div className="grid grid-cols-1 gap-4">
                {/* Campo de e-mail */}
                <label htmlFor="email" className="flex flex-col text-left">
                    <span className="text-sm text-foreground mb-1 font-semibold">E-mail</span>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@exemplo.com"
                        autoComplete="email"
                        inputMode="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass}
                        disabled={loading}
                    />
                </label>

                {/* Campo de senha */}
                <label htmlFor="password" className="flex flex-col text-left">
                    <span className="text-sm text-foreground mb-1 font-semibold">Senha</span>
                    <PasswordInput
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Insira sua senha"
                        autoComplete="current-password"
                        required
                        ariaInvalid={!!error}
                        className={inputClass}
                        disabled={loading}
                    />
                </label>

                {/* Mensagem de erro */}
                {error && (
                    <div role="alert" className="text-sm text-red-500 mt-1" aria-live="polite">
                        {error}
                    </div>
                )}

                {/* Botão de envio */}
                <div>
                    <Button
                        type="submit"
                        loading={loading}
                        loadingText="Entrando..."
                        className="w-full bg-foreground hover:bg-foreground-dark text-white font-bold py-3 rounded-xl"
                    >
                        Entrar
                    </Button>
                </div>

                {/* Link para cadastro */}
                <div className="text-sm text-foreground/90 mt-2">
                    <span>Ainda não tem conta? </span>
                    <Link
                        href="/cadastro"
                        aria-label="Criar nova conta"
                        className="font-semibold underline-offset-2 hover:underline"
                    >
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </form>
    );
}
