import type { Metadata } from "next";
import ReceitasMarcadas from '@/components/pages-components/perfil/organisms/ReceitasMarcadas'

export const metadata: Metadata = {
    title: "Receitas Marcadas",
};

export default function Page() {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)] flex items-center justify-center">
            <ReceitasMarcadas />
        </main>
    )
}
