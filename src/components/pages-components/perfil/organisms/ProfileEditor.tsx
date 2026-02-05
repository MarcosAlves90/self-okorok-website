'use client'

import Link from 'next/link'
import AvatarDisplay from '@/components/atoms/AvatarDisplay'
import { Save, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/UserContext'
import { useRouter } from 'next/navigation'
import { fetchJson } from '@/lib/fetch-json'

type Props = { className?: string }

type UserPayload = {
    id: string | number
    name: string
    email: string
    avatarUrl?: string | null
    bio?: string | null
    createdAt: string
}

export default function ProfileEditor({ className = '' }: Props) {
    const [name, setName] = useState('Usuário')
    const [avatar, setAvatar] = useState<string | null>(null)
    const [bio, setBio] = useState('')
    const [userId, setUserId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()
    const { user, setUser } = useUser()

    // Atualiza os estados ao carregar o usuário
    useEffect(() => {
        if (!user) {
            setName('Usuário')
            setAvatar(null)
            setBio('')
            setUserId(null)
            return
        }
        const userData = user as Record<string, unknown>
        setName(String(userData.name ?? 'Usuário'))
        setAvatar(userData.avatarUrl ? String(userData.avatarUrl) : null)
        setBio(String(userData.bio ?? ''))
        setUserId(userData.id ? String(userData.id) : null)
    }, [user])

    const handleSaveBio = async () => {
        if (!userId) {
            alert('Erro: usuário não identificado')
            return
        }
        setIsLoading(true)
        try {
            const data = await fetchJson<UserPayload>(
                `/api/usuarios/${userId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bio }),
                },
                'Erro ao salvar bio'
            )
            if (data.data) setUser(data.data)
        } catch (error) {
            console.error('Erro ao salvar bio:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/usuarios/logout', { method: 'POST' })
        } finally {
            setUser(null)
            setName('Usuário')
            setAvatar(null)
            setBio('')
            setUserId(null)
            router.push('/login')
        }
    }

    return (
        <div className={`w-full mt-2 sm:mt-4 ${className}`}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[18rem] border-2 border-foreground rounded-xl p-5 text-center bg-background/70">
                        <div className="flex flex-col items-center gap-3">
                            <AvatarDisplay size={140} src={avatar} />
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-foreground">{name}</h3>
                                <p className="text-xs sm:text-sm text-foreground/70">Seu perfil Okorok</p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-left">
                            <div className="rounded-lg border border-foreground/20 bg-background px-3 py-2">
                                <p className="text-xs text-foreground/70">Receitas</p>
                                <p className="text-lg font-semibold text-foreground">—</p>
                            </div>
                            <div className="rounded-lg border border-foreground/20 bg-background px-3 py-2">
                                <p className="text-xs text-foreground/70">Favoritas</p>
                                <p className="text-lg font-semibold text-foreground">—</p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={handleSaveBio}
                                disabled={isLoading}
                                aria-label="Salvar bio"
                                title={isLoading ? 'Salvando...' : 'Salvar'}
                                className="inline-flex items-center gap-2 rounded-lg border border-foreground/30 px-3 py-2 text-sm hover:bg-foreground/10 disabled:opacity-50"
                            >
                                <Save size={18} aria-hidden="true" />
                                {isLoading ? 'Salvando...' : 'Salvar'}
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                aria-label="Deslogar"
                                title="Deslogar"
                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/10"
                            >
                                <LogOut size={18} aria-hidden="true" />
                                Sair
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 border-2 border-foreground rounded-xl p-5 sm:p-6 bg-background/70">
                        <div className="flex items-center justify-between">
                            <h4 className="text-base sm:text-lg font-semibold text-foreground">Bio</h4>
                            <span className="text-xs text-foreground/60">Visível publicamente</span>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
                                Conte um pouco sobre você
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={6}
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                placeholder="Ex.: apaixonado por churrasco, especialista em cortes..."
                                autoComplete="off"
                                aria-describedby="bio-help"
                                className="w-full bg-background-gray placeholder:text-foreground/60 border-2 border-foreground rounded-md px-4 py-3 text-sm text-foreground resize-vertical focus:outline-none"
                            />
                            <span id="bio-help" className="sr-only">
                                Escreva sua biografia. Mínimo de 0 caracteres.
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 font-protest-strike text-xl sm:text-2xl text-start">
                    <Link
                        href="/perfil/minhas-receitas"
                        className="min-h-24 sm:min-h-32 transition-colors duration-200 ease-in-out hover:bg-foreground/30 hover:border-foreground/30 hover:text-foreground cursor-pointer bg-foreground text-background rounded-xl pb-2 px-4 flex justify-start items-end w-full text-left"
                    >
                        Minhas Receitas
                    </Link>
                    <Link
                        href="/perfil/receitas-marcadas"
                        className="min-h-24 sm:min-h-32 transition-colors duration-200 ease-in-out hover:bg-foreground/30 cursor-pointer border-2 border-foreground rounded-xl pb-2 px-4 flex justify-start items-end w-full text-left"
                    >
                        Receitas Marcadas
                    </Link>
                </div>
            </div>
        </div>
    )
}
