'use client'

import { useEffect, useMemo, useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'

const STORAGE_KEY = 'okorok-theme'

type ThemeMode = 'light' | 'dark' | 'system'

type ResolvedTheme = 'light' | 'dark'

function getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ResolvedTheme) {
    const root = document.documentElement
    root.classList.toggle('theme-dark', mode === 'dark')
    root.classList.toggle('theme-light', mode === 'light')
    root.setAttribute('data-theme', mode)
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState<ThemeMode>('system')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            setTheme(stored)
        } else {
            setTheme('system')
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        const effective = theme === 'system' ? getSystemTheme() : theme
        applyTheme(effective)

        if (theme === 'system') {
            localStorage.removeItem(STORAGE_KEY)
        } else {
            localStorage.setItem(STORAGE_KEY, theme)
        }

        if (theme !== 'system') return

        const media = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = () => applyTheme(media.matches ? 'dark' : 'light')
        if (media.addEventListener) {
            media.addEventListener('change', onChange)
        } else {
            media.addListener(onChange)
        }

        return () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', onChange)
            } else {
                media.removeListener(onChange)
            }
        }
    }, [theme, mounted])

    const effectiveTheme = useMemo<ResolvedTheme>(() => {
        if (!mounted) return 'light'
        return theme === 'system' ? getSystemTheme() : theme
    }, [theme, mounted])

    const handleToggle = () => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
    }

    const toggleLabel = effectiveTheme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'
    const toggleTitle = effectiveTheme === 'dark' ? 'Tema claro' : 'Tema escuro'

    return (
        <div className="inline-flex items-center gap-2">
            <button
                type="button"
                onClick={handleToggle}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-colors hover:bg-foreground/10"
                aria-label={toggleLabel}
                title={toggleTitle}
                suppressHydrationWarning
            >
                {effectiveTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
                type="button"
                onClick={() => setTheme('system')}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    theme === 'system'
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-foreground/20 text-foreground/80 hover:bg-foreground/10'
                }`}
                aria-label="Usar tema automatico"
                title="Usar tema automatico"
            >
                <Monitor size={12} />
                Auto
            </button>
        </div>
    )
}
