'use client';

import { useEffect, useState, FormEvent } from 'react';
import PasswordInput from '@/components/atoms/PasswordInput';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import Link from 'next/link';
import AvatarInput from '../molecules/AvatarInput';
import { useUser } from '@/hooks/UserContext';
import { fetchJson } from '@/lib/fetch-json';

export default function RegisterForm() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    // Redireciona se já estiver logado
    useEffect(() => {
        if (user) router.push('/perfil');
    }, [user, router]);

    // Valida e envia o formulário de cadastro
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const pwd = String(form.get('password') ?? '');
        const pwdConfirm = String(form.get('passwordConfirm') ?? '');

        if (pwd !== pwdConfirm) {
            setError('As senhas não coincidem');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await fetchJson('/api/usuarios', { method: 'POST', body: form }, 'Erro ao cadastrar');
            router.push('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de rede');
        } finally {
            setLoading(false);
        }
    }

    // Atualiza o campo de senha e valida confirmação
    function handlePasswordChange(value: string) {
        setPassword(value);
        if (passwordConfirm && value !== passwordConfirm) setError('As senhas não coincidem');
        else setError('');
    }

    // Atualiza o campo de confirmação de senha e valida
    function handlePasswordConfirmChange(value: string) {
        setPasswordConfirm(value);
        if (password && value !== password) setError('As senhas não coincidem');
        else setError('');
    }

    const inputClass =
        'w-full bg-background-gray placeholder:text-foreground/60 border-2 border-foreground rounded-xl px-4 py-3 focus:outline-none';

    return (
        <form
            className="w-full"
            action="#"
            method="POST"
            acceptCharset="UTF-8"
            role="form"
            aria-label="Formulário de cadastro"
            onSubmit={handleSubmit}
            aria-busy={loading}
        >
            <div className="grid grid-cols-1 gap-4">
                {/* Avatar do usuário */}
                <AvatarInput />

                {/* Campo nome */}
                <label htmlFor="name" className="flex flex-col text-left">
                    <span className="text-sm text-foreground mb-1 font-semibold">Nome</span>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Seu nome de usuário"
                        autoComplete="name"
                        required
                        aria-required="true"
                        className={inputClass}
                    />
                </label>

                {/* Campo e-mail */}
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
                        aria-required="true"
                        className={inputClass}
                    />
                </label>

                {/* Campos de senha e confirmação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label htmlFor="password" className="flex flex-col text-left">
                        <span className="text-sm text-foreground mb-1 font-semibold">Senha</span>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="Insira sua senha"
                            autoComplete="new-password"
                            required
                            ariaInvalid={!!error}
                            className={inputClass}
                            disabled={loading}
                        />
                    </label>

                    <label htmlFor="passwordConfirm" className="flex flex-col text-left">
                        <span className="text-sm text-foreground mb-1 font-semibold">Confirme a senha</span>
                        <PasswordInput
                            id="passwordConfirm"
                            name="passwordConfirm"
                            value={passwordConfirm}
                            onChange={(e) => handlePasswordConfirmChange(e.target.value)}
                            placeholder="Repita sua senha"
                            autoComplete="new-password"
                            required
                            ariaInvalid={!!error}
                            className={inputClass}
                            disabled={loading}
                        />
                    </label>
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <div role="alert" className="text-sm text-red-500 mt-1" aria-live="polite">
                        {error}
                    </div>
                )}

                {/* Botão de cadastro */}
                <div>
                    <Button
                        type="submit"
                        loading={loading}
                        loadingText="Cadastrando..."
                        className="w-full bg-foreground hover:bg-foreground-dark text-white font-bold py-3 rounded-xl"
                    >
                        Cadastrar
                    </Button>
                </div>

                {/* Link para login */}
                <div className="text-sm text-foreground/90 mt-2">
                    <span>Já tem conta? </span>
                    <Link
                        href="/login"
                        aria-label="Fazer login"
                        className="font-semibold underline-offset-2 hover:underline"
                    >
                        Entrar
                    </Link>
                </div>
            </div>
        </form>
    );
}
