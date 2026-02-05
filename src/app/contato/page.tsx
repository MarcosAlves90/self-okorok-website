import type { Metadata } from "next";

import ContactForm from "@/components/pages-components/contato/organisms/ContactForm";

export const metadata: Metadata = {
    title: "Contato",
};

export default function Contact() {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] flex justify-center items-center py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)]">
            <div className="border-2 border-foreground px-6 sm:px-10 lg:px-20 py-10 sm:py-14 lg:py-17 max-w-6xl w-full flex flex-col gap-6 rounded-xl h-full text-center text-foreground">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-protest-strike leading-tight mb-6 text-center">Formulário de contato</h2>
                <ContactForm/>
            </div>
        </main>
    )
}
