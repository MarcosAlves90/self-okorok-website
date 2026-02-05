import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidade",
};

export default function Privacy() {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] flex justify-center items-center py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)]">
            <div className="border-2 border-foreground px-6 sm:px-10 lg:px-20 py-10 sm:py-14 lg:py-17 max-w-6xl w-full flex flex-col gap-6 rounded-xl h-full text-center text-foreground">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-protest-strike leading-tight mb-6 sm:mb-8 lg:mb-10">Política de Privacidade</h2>
                <p className="text-base sm:text-lg md:text-xl font-bold">Como coletamos e usamos suas informações</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">No <span className="font-bold">Okorok</span>, valorizamos sua privacidade e estamos comprometidos em proteger suas informações pessoais. Esta política explica como coletamos, usamos e protegemos seus dados quando você utiliza nosso site.<br/><br/>Coletamos informações que você nos fornece diretamente, como nome, e-mail e preferências de receitas. Também podemos coletar dados automaticamente, como seu endereço IP e cookies para melhorar sua experiência.</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">Uso de cookies</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">Utilizamos cookies para personalizar seu conteúdo, analisar o tráfego do site e melhorar nossa plataforma. Você pode controlar o uso de cookies através das configurações do seu navegador.</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">Compartilhamento de dados</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">Não vendemos ou alugamos suas informações pessoais a terceiros. Podemos compartilhar dados apenas quando necessário para operar o site ou cumprir obrigações legais.</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">Seus direitos</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Entre em contato conosco através da página de contato para exercer esses direitos.</p>
            </div>
        </main>
    )
}
