import type { Metadata } from "next";
import ProfileEditor from '@/components/pages-components/perfil/organisms/ProfileEditor';

export const metadata: Metadata = {
    title: "Perfil",
};

export default function About() {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] flex justify-center items-center py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)]">
            <div className="max-w-6xl w-full text-foreground">
                <ProfileEditor />
            </div>
        </main>
    );
}
