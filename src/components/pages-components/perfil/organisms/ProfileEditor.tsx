
'use client'


import Link from 'next/link'
import AvatarDisplay from '@/components/atoms/AvatarDisplay'
import { Save, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/UserContext'
import { useRouter } from 'next/navigation'


type Props = { className?: string }


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
            const response = await fetch(`/api/usuarios/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bio }),
            })
            if (!response.ok) throw new Error('Erro ao salvar bio')
            const data = await response.json()
            if (data.success && data.data) setUser(data.data)
        } catch (error) {
            console.error('Erro ao salvar bio:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        setUser(null)
        setName('Usuário')
        setAvatar(null)
        setBio('')
        setUserId(null)
        router.push('/login')
    }

    return (
        <div className={`flex flex-col items-center gap-4 mt-2 sm:mt-4 ${className}`}>
            <div className='flex flex-col items-center'>
                <AvatarDisplay size={140} src={avatar} />
                <h3 className="text-base sm:text-lg font-semibold text-foreground mt-2">{name}</h3>
            </div>

            <div className="flex gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={handleSaveBio}
                    disabled={isLoading}
                    aria-label="Salvar bio"
                    title={isLoading ? 'Salvando...' : 'Salvar'}
                    className="p-2 cursor-pointer rounded-md hover:bg-foreground/10 disabled:opacity-50"
                >
                    <Save size={28} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Deslogar"
                    title="Deslogar"
                    className="p-2 cursor-pointer rounded-md hover:bg-foreground/10"
                >
                    <LogOut size={28} aria-hidden="true" />
                </button>
            </div>

            <div className="w-full max-w-md mt-4 text-left">
                <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
                    Bio
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={6}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Insira sua biografia"
                    autoComplete="off"
                    aria-describedby="bio-help"
                    className="w-full bg-background-gray placeholder:text-foreground/60 border-2 border-foreground rounded-md px-4 py-3 text-sm text-foreground resize-vertical focus:outline-none"
                />
                <span id="bio-help" className="sr-only">
                    Escreva sua biografia. Mínimo de 0 caracteres.
                </span>
            </div>

            <div className="w-full max-w-md mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-7 font-protest-strike text-xl sm:text-2xl text-start">
                <Link
                    href="/perfil/minhas-receitas"
                    className="min-h-28 sm:min-h-35 transition-colors duration-200 ease-in-out hover:bg-foreground/30 hover:border-foreground/30 hover:text-foreground cursor-pointer bg-foreground text-background rounded-md pb-1 px-3 flex justify-start items-end w-full text-left"
                >
                    Minhas Receitas
                </Link>
                <Link
                    href="/perfil/receitas-marcadas"
                    className="min-h-28 sm:min-h-35 transition-colors duration-200 ease-in-out hover:bg-foreground/30 cursor-pointer border-2 border-foreground rounded-md pb-1 px-3 flex justify-start items-end w-full text-left"
                >
                    Receitas Marcadas
                </Link>
            </div>
        </div>
    )
}
