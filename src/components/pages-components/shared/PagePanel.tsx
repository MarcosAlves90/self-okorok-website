import React from 'react'

type Props = {
    title: string
    description?: string
    toolbar?: React.ReactNode
    children: React.ReactNode
    className?: string
}

export default function PagePanel({ title, description, toolbar, children, className = '' }: Props) {
    return (
        <div className={`relative w-full max-w-6xl mx-auto ${className}`}>
            <div className="absolute -top-6 left-8 hidden lg:block h-12 w-12 rounded-full bg-foreground/20 blur-2xl" aria-hidden="true" />
            <div className="rounded-xl border-2 border-foreground bg-background/80 backdrop-blur-sm px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-14 text-foreground">
                <div className="flex flex-col gap-6">
                    <header className="flex flex-col gap-4 text-center lg:text-left">
                        <div>
                            <h1 className="font-protest-strike text-3xl sm:text-4xl">{title}</h1>
                            {description && (
                                <p className="text-sm sm:text-base text-foreground/80 w-full mt-2 lg:max-w-2xl">{description}</p>
                            )}
                        </div>
                    </header>
                    {toolbar && (
                        <div className="w-full">{toolbar}</div>
                    )}
                    <div className="h-px w-full bg-foreground/10" aria-hidden="true" />
                    <div className="text-center">{children}</div>
                </div>
            </div>
        </div>
    )
}
