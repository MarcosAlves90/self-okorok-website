'use client'

import { Heart, Search, Menu, X } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@/hooks/UserContext';
import NavItem from '@/components/atoms/NavItem';
import ThemeToggle from '@/components/atoms/ThemeToggle';

export default function Navbar(): React.ReactElement {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const isLogged = !!user;

    const [searchOpen, setSearchOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const handleAccountClick = () => router.push(isLogged ? '/perfil' : '/login');
    const toggleSearch = () => setSearchOpen((s) => !s);
    const toggleMenu = () => setMenuOpen((m) => !m);
    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [searchOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página ao enviar o formulário.
        const q = searchQuery.trim(); // Remove espaços extras do início e fim da busca.
        if (q) router.push(`/?q=${encodeURIComponent(q)}`); // Se houver texto, redireciona para a home com o termo de busca na URL.
        setSearchOpen(false); // Fecha o campo de busca.
        setSearchQuery(''); // Limpa o campo de busca.
    };
    
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [menuOpen]);

    const navClass = `py-3 px-[var(--pc-padding)] fixed w-full top-0 right-0 left-0 z-50 text-xs md:text-sm lg:text-base transition-all duration-200 ease-in-out border-b-2 bg-background/70 backdrop-blur-2xl text-foreground border-foreground`;
    const accountBtnClass = `py-1 font-medium px-3 sm:px-4 rounded-md cursor-pointer text-xs md:text-sm lg:text-base transition-colors duration-300 ease-in-out bg-foreground text-background hover:bg-foreground/30 hover:text-foreground`;
    const searchInputClass = `transition-all duration-300 ease-in-out text-sm rounded-md h-8 bg-transparent outline-none focus:ring-0 border-2 border-foreground text-foreground ${searchOpen ? 'w-40 sm:w-48 px-3' : 'w-0 px-0 invisible opacity-0'} overflow-hidden`;
    const searchIconClass = `text-foreground transition-colors duration-300 ease-in-out cursor-pointer`;

    const navItems = [
        ['/', 'Início'],
        ['/#mais-votadas', 'Mais votadas'],
        ['/#todas-receitas', 'Categorias'],
        ['/sobre', 'Sobre'],
        ['/contato', 'Contato'],
        ['/usuarios', 'Usuários'],
    ] as const;

    return (
        <>
            <nav role="navigation" aria-label="Navegação principal" className={navClass}>
                <div className="flex w-full items-center justify-between gap-4 md:gap-8">
                    <div className="h-10 md:h-12 lg:h-14 flex items-center">
                        <Link href="/" aria-label="Ir para a página inicial" className="flex items-center cursor-pointer">
                            <Image src="/logo.png" alt="Logotipo Okorok" width={60} height={60} className="h-full w-auto object-contain" priority />
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 items-center justify-center">
                        <ul className="flex flex-row items-center gap-8" role="list" aria-label="Menu principal">
                            {navItems.map(([href, label]) => (
                                <NavItem key={href} href={href} label={label} ariaLabel={label} />
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            type="button"
                            aria-label={isLogged ? 'Minha conta' : 'Login'}
                            title={isLogged ? 'Minha conta' : 'Login'}
                            onClick={handleAccountClick}
                            className={`${accountBtnClass} hidden md:inline-flex`}
                        >
                            {isLogged ? 'Minha conta' : 'Login'}
                        </button>

                        <button
                            type="button"
                            className="hidden md:inline-flex items-center justify-center"
                            aria-label="Favoritos"
                            title="Favoritos"
                        >
                            <Link href={"/perfil/receitas-marcadas"} aria-label="Botão de receitas marcadas">
                                <Heart className="text-[#FF5353] fill-none hover:fill-[#FF5353] transition-colors duration-300 ease-in-out cursor-pointer stroke-current" size={24} aria-hidden="true" />
                            </Link>
                        </button>

                        <form onSubmit={handleSearchSubmit} className="hidden md:inline-flex items-center justify-center">
                            <input
                                ref={searchInputRef}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Escape') setSearchOpen(false); }}
                                type="search"
                                aria-label="Pesquisar receitas"
                                placeholder="Pesquisar..."
                                className={searchInputClass}
                            />

                            <button
                                type="button"
                                onClick={toggleSearch}
                                aria-label={searchOpen ? 'Fechar pesquisa' : 'Pesquisar'}
                                aria-expanded={searchOpen}
                                title="Pesquisar"
                                className="ml-2 inline-flex items-center justify-center"
                            >
                                <Search className={searchIconClass} size={24} aria-hidden="true" />
                            </button>
                        </form>

                        <div className="hidden md:inline-flex">
                            <ThemeToggle />
                        </div>

                        <button
                            type="button"
                            onClick={toggleMenu}
                            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                            aria-expanded={menuOpen}
                            className="inline-flex items-center justify-center md:hidden"
                        >
                            {menuOpen ? (
                                <X className={searchIconClass} size={26} aria-hidden="true" />
                            ) : (
                                <Menu className={searchIconClass} size={26} aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`md:hidden fixed inset-0 z-40 ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeMenu}
                />
                <div
                    className={`absolute left-0 right-0 top-0 mt-[6.25rem] origin-top transition-all duration-200 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                >
                    <div className="mx-[var(--pc-padding)] rounded-xl border border-foreground/20 bg-background text-foreground shadow-xl overflow-hidden">
                        <div className="px-4 py-3 flex items-center justify-between border-b border-foreground/15">
                            <span className="font-medium">Menu</span>
                        </div>
                        <nav aria-label="Menu mobile">
                            <div className="p-3 space-y-3">
                                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Escape') setSearchOpen(false); }}
                                        type="search"
                                        aria-label="Pesquisar receitas"
                                        placeholder="Pesquisar..."
                                        className="h-10 w-full rounded-lg border-2 border-foreground/20 bg-transparent px-3 text-sm text-foreground outline-none focus:border-foreground"
                                    />
                                    <button
                                        type="submit"
                                        aria-label="Pesquisar"
                                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background"
                                    >
                                        <Search size={18} aria-hidden="true" />
                                    </button>
                                </form>
                                <div className="flex items-center justify-between rounded-lg border border-foreground/20 px-3 py-2">
                                    <span className="text-xs font-medium text-foreground">Tema</span>
                                    <ThemeToggle />
                                </div>
                            </div>
                            <div className="px-3 pb-2">
                                <button
                                    type="button"
                                    aria-label={isLogged ? 'Minha conta' : 'Login'}
                                    title={isLogged ? 'Minha conta' : 'Login'}
                                    onClick={() => {
                                        closeMenu();
                                        handleAccountClick();
                                    }}
                                    className="w-full rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
                                >
                                    {isLogged ? 'Minha conta' : 'Login'}
                                </button>
                                <Link
                                    href={"/perfil/receitas-marcadas"}
                                    onClick={closeMenu}
                                    aria-label="Botão de receitas marcadas"
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-foreground/20 px-3 py-2 text-sm font-medium text-foreground hover:bg-foreground/10 transition-colors"
                                >
                                    <Heart className="text-[#FF5353] fill-none stroke-current" size={18} aria-hidden="true" />
                                    Favoritos
                                </Link>
                            </div>
                            <ul className="flex flex-col gap-1 px-2 pb-2">
                                {navItems.map(([href, label]) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            onClick={closeMenu}
                                            className="block rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-foreground/10 transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="px-4 py-3 border-t border-foreground/15 text-xs text-foreground/70">
                            Dica: toque fora para fechar
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
