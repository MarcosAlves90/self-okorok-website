import type { Metadata } from "next";
import React from 'react';
import UsuariosClient from '@/components/pages-components/usuarios/organisms/UsuariosClient';

export const metadata: Metadata = {
    title: "Usuários",
};

export default function UsuariosPage(): React.ReactElement {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)] flex justify-center items-center">
            <UsuariosClient />
        </main>
    );
}
