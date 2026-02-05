"use client"
import { useEffect, useRef, useState } from 'react'
import type { ChangeEventHandler } from 'react'
import Image from 'next/image'
import Button from '@/components/atoms/Button'
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/UserContext'
import { fetchJson } from '@/lib/fetch-json'

export default function CreateRecipeClient() {
    const fileRef = useRef<HTMLInputElement | null>(null)
    const formRef = useRef<HTMLFormElement | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const router = useRouter()
    const { user } = useUser()

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user, router])

    const openFile = () => fileRef.current?.click()

    const onFile: ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (preview) URL.revokeObjectURL(preview)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async () => {
        if (loading) return

        const form = formRef.current
        if (!form) return

        if (!user?.id) {
            setError('Usuário não identificado. Faça login novamente.')
            return
        }

        const formData = new FormData(form)
        formData.append('authorId', String(user.id))

        const imageFile = fileRef.current?.files?.[0]
        if (imageFile) {
            formData.append('imagem', imageFile)
        }

        setLoading(true)
        setError('')

        try {
            await fetchJson('/api/receitas', { method: 'POST', body: formData }, 'Erro ao criar receita')
            router.push('/')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro de rede. Tente novamente.')
            console.error('Falha na criação da receita:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview) }
    }, [preview])

    if (!user) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center">
                <div className="text-center text-foreground">
                    <p className="text-lg">Redirecionando para o login...</p>
                </div>
            </div>
        )
    }

    return (
        <form ref={formRef} className="w-full max-w-6xl flex flex-col gap-6" aria-label="Criar receita">
            <header className="text-foreground text-center">
                <h1 className="font-protest-strike text-3xl sm:text-4xl lg:text-5xl">Criar receita</h1>
                <p className="text-sm sm:text-base text-foreground/80 mt-2">
                    Compartilhe sua melhor receita e inspire a comunidade.
                </p>
            </header>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex flex-col gap-6 w-full lg:w-[55%]">
                    <section className="rounded-xl overflow-hidden relative bg-placeholder border-2 border-foreground">
                        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />

                        {preview && (
                            <div className="absolute inset-0">
                                <Image
                                    src={preview}
                                    alt="Pré-visualização da receita"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/85" />
                            </div>
                        )}

                        <div className="relative z-10 min-h-[16rem] sm:min-h-[20rem] flex flex-col p-5">
                            <div className="flex-1 flex items-center justify-center">
                                <div className="mb-3 bg-background/30 rounded-md">
                                    <Button variant="icon" size="md" onClick={openFile} className="inline-flex items-center gap-2">
                                        <Upload className="h-6 w-6" />
                                        {preview ? 'Trocar imagem' : 'Enviar imagem'}
                                    </Button>
                                </div>
                            </div>

                            <div className="w-full mt-auto">
                                <label htmlFor="titulo-receita" className="sr-only">Título</label>
                                <input
                                    id="titulo-receita"
                                    name="titulo"
                                    type="text"
                                    placeholder="Digite o título da receita"
                                    className="w-full rounded-md bg-transparent text-xl text-background border-0 ring-0 focus:outline-none focus:ring-0"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-foreground rounded-xl flex flex-col p-5 border-2 border-foreground">
                        <div className="w-full flex flex-col items-start gap-4">
                            <h3 className="text-base font-semibold">Detalhes</h3>
                            <div className="w-full">
                                <label className="text-xs font-medium">Categoria</label>
                                <input
                                    name="categoria"
                                    placeholder="Ex: Sobremesa, Principal, Entrada"
                                    className="mt-2 w-full rounded-md bg-foreground-dark text-sm text-background border-0 ring-0 p-2 focus:outline-none focus:ring-0"
                                />
                            </div>

                            <div className="w-full">
                                <label className="text-xs font-medium">Observações</label>
                                <textarea
                                    name="observacoes"
                                    placeholder="Dicas, substituições ou notas adicionais"
                                    className="mt-2 w-full h-24 rounded-md bg-foreground-dark text-sm text-background border-0 ring-0 p-3 resize-vertical focus:outline-none focus:ring-0"
                                />
                            </div>

                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium">Tempo de preparo</label>
                                    <input
                                        name="tempo"
                                        placeholder="Ex: 30 min"
                                        className="mt-2 w-full rounded-md bg-foreground-dark text-sm text-background border-0 ring-0 p-2 focus:outline-none focus:ring-0"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium">Rendimento</label>
                                    <input
                                        name="rendimento"
                                        placeholder="Ex: 4 porções"
                                        className="mt-2 w-full rounded-md bg-foreground-dark text-sm text-background border-0 ring-0 p-2 focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="w-full p-3 bg-red-500/20 border border-red-500 rounded-md">
                                    <p className="text-sm text-red-200">{error}</p>
                                </div>
                            )}

                            <Button
                                variant="primary"
                                size="md"
                                className="w-full mt-2"
                                loading={loading}
                                loadingText={"Enviando..."}
                                onClick={handleSubmit}
                                type="button"
                            >
                                Enviar receita
                            </Button>
                        </div>
                    </section>
                </div>

                <section className="h-full bg-foreground w-full lg:w-[45%] rounded-xl flex flex-col items-start gap-4 p-5 border-2 border-foreground">
                    <h3 className="text-base sm:text-lg font-semibold">Ingredientes *</h3>
                    <textarea
                        name="ingredientes"
                        placeholder="Liste os ingredientes, um por linha"
                        className="w-full h-28 sm:h-36 rounded-md bg-foreground-dark text-sm text-background border-0 ring-0 p-3 resize-vertical focus:outline-none focus:ring-0"
                        required
                    />

                    <h3 className="text-base sm:text-lg font-semibold">Modo de preparo *</h3>
                    <textarea
                        name="modo"
                        placeholder="Descreva o passo a passo"
                        className="w-full h-64 sm:h-80 rounded-md bg-foreground-dark text-sm text-background border-0 ring-0 p-3 resize-vertical focus:outline-none focus:ring-0"
                        required
                    />
                </section>
            </div>
        </form>
    )
}
