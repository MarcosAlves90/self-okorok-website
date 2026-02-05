import Link from 'next/link'
import Button from '@/components/atoms/Button'
import { useUser } from '@/hooks/UserContext'

interface Props {
    searchTerm: string
    setSearchTerm: (v: string) => void
    selectedCount: number
    totalCount: number
    onSelectAll: () => void
    onRemoveSelected: () => void
    removing: boolean
}

export default function ReceitasMarcadasToolbar({
    searchTerm,
    setSearchTerm,
    selectedCount,
    totalCount,
    onSelectAll,
    onRemoveSelected,
    removing
}: Props) {
    const { user } = useUser()

    return (
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between max-w-5xl">
            <div className="flex items-center gap-3 w-full">
                <input
                    aria-label="Pesquisar receitas marcadas"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-11 bg-background-gray placeholder:text-foreground/60 border-2 border-foreground rounded-md px-4 text-sm focus:outline-none"
                />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                {selectedCount > 0 && (
                    <>
                        <button
                            onClick={onSelectAll}
                            className="h-11 w-full sm:w-auto px-3 text-sm bg-transparent text-foreground-dark border-2 border-foreground rounded-md hover:bg-foreground/10 transition-colors whitespace-nowrap"
                        >
                            {selectedCount === totalCount ? 'Desmarcar todas' : 'Selecionar todas'}
                        </button>
                        <button
                            onClick={onRemoveSelected}
                            disabled={removing}
                            className="h-11 w-full sm:w-auto px-3 text-sm bg-orange-600 text-white border border-orange-600 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {removing ? 'Removendo...' : `Remover dos favoritos (${selectedCount})`}
                        </button>
                    </>
                )}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button variant="primary" size="sm" className="w-full sm:w-auto whitespace-nowrap h-11">Explorar receitas</Button>
                    </Link>
                    {user && (
                        <Link href="/perfil" className="w-full sm:w-auto">
                            <Button variant="primary" size="sm" className="w-full sm:w-auto whitespace-nowrap h-11">Voltar ao perfil</Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
