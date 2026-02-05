import type { Metadata } from "next";
import MinhasReceitasClient from '@/components/pages-components/perfil/organisms/MinhasReceitasClient'

export const metadata: Metadata = {
    title: "Minhas receitas",
};

export default function Page() {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)] flex items-center justify-center">
            <MinhasReceitasClient />
        </main>
    )
}
