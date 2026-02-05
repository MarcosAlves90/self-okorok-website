import Link from 'next/link'
import Button from '@/components/atoms/Button'

interface Props {
    searchTerm: string
    setSearchTerm: (v: string) => void
    selectedCount: number
    allVisibleSelected: boolean
    onSelectAll: () => void
    onDeleteSelected: () => void
    deleting: boolean
}

export default function MinhasReceitasToolbar({
    searchTerm,
    setSearchTerm,
    selectedCount,
    allVisibleSelected,
    onSelectAll,
    onDeleteSelected,
    deleting
}: Props) {
    return (
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between max-w-5xl">
            <div className="flex items-center gap-3 w-full">
                <input
                    aria-label="Pesquisar minhas receitas"
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
                            {allVisibleSelected ? 'Desmarcar todas' : 'Selecionar todas'}
                        </button>
                        <button
                            onClick={onDeleteSelected}
                            disabled={deleting}
                            className="h-11 w-full sm:w-auto px-3 text-sm bg-red-600 text-white border border-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {deleting ? 'Deletando...' : `Deletar (${selectedCount})`}
                        </button>
                    </>
                )}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <Link href="/receitas/criar" className="w-full sm:w-auto">
                        <Button variant="primary" size="sm" className="w-full sm:w-auto whitespace-nowrap h-11">Criar receita</Button>
                    </Link>
                    <Link href="/perfil" className="w-full sm:w-auto">
                        <Button variant="primary" size="sm" className="w-full sm:w-auto whitespace-nowrap h-11">Voltar ao perfil</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
