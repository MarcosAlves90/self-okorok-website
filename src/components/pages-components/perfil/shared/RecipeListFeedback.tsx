import Link from 'next/link'
import Button from '@/components/atoms/Button'
import RecipeCardSkeleton from '@/components/pages-components/home/molecules/RecipeCardSkeleton'

interface RecipeLoadingGridProps {
    count?: number
    className?: string
}

export function RecipeLoadingGrid({ count = 12, className }: RecipeLoadingGridProps) {
    return (
        <div className={className ?? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'}>
            {Array.from({ length: count }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
            ))}
        </div>
    )
}

interface RecipeErrorStateProps {
    error: string
    loginMessage: string
    fallbackMessage: string
    loginHref?: string
    loginCta?: string
}

export function RecipeErrorState({
    error,
    loginMessage,
    fallbackMessage,
    loginHref = '/login',
    loginCta = 'Fazer Login'
}: RecipeErrorStateProps) {
    const isAuthError = error === 'Usuário não logado'

    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-red-600 text-center">
                {isAuthError ? (
                    <>
                        <p className="mb-2">{loginMessage}</p>
                        <Link href={loginHref}>
                            <Button variant="primary" size="sm">{loginCta}</Button>
                        </Link>
                    </>
                ) : (
                    <p>{fallbackMessage} {error}</p>
                )}
            </div>
        </div>
    )
}

interface RecipeEmptyStateProps {
    searchTerm: string
    emptyMessage: string
    emptySearchMessage?: string
    ctaHref?: string
    ctaLabel?: string
}

export function RecipeEmptyState({
    searchTerm,
    emptyMessage,
    emptySearchMessage = 'Nenhuma receita encontrada com esse termo',
    ctaHref,
    ctaLabel
}: RecipeEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-foreground/60 text-center">
                {searchTerm ? emptySearchMessage : emptyMessage}
            </div>
            {!searchTerm && ctaHref && ctaLabel ? (
                <Link href={ctaHref}>
                    <Button variant="primary" size="sm">{ctaLabel}</Button>
                </Link>
            ) : null}
        </div>
    )
}
