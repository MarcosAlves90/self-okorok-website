import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ajuda",
};

export default function Help() {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] flex justify-center items-center py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)]">
            <div className="border-2 border-foreground px-6 sm:px-10 lg:px-20 py-10 sm:py-14 lg:py-17 max-w-6xl w-full flex flex-col gap-6 rounded-xl h-full text-center text-foreground">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-protest-strike leading-tight mb-6 sm:mb-8 lg:mb-10">Como podemos ajudar?</h2>

                <div className="text-left space-y-6">
                    <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Como criar uma conta?</h3>
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed">Acesse a página de cadastro, preencha seus dados e confirme seu e-mail. É rápido e gratuito!</p>
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Como compartilhar uma receita?</h3>
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed">Faça login, vá para &quot;Criar Receita&quot; e compartilhe sua criação. Inclua ingredientes, modo de preparo e fotos!</p>
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Como funciona o sistema de curtidas?</h3>
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed">Clique no coração nas receitas que você gostou. Isso ajuda outras pessoas a descobrirem as melhores receitas!</p>
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Como marcar receitas como favoritas?</h3>
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed">Use o ícone de marcador nas receitas. Você pode ver todas as suas receitas marcadas no seu perfil.</p>
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Problemas técnicos?</h3>
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed">Se você encontrou um bug ou tem dificuldades para usar o site, entre em contato conosco através da página de contato.</p>
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">Dicas para churrascos perfeitos</h3>
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed">Explore nossas receitas mais votadas e filtre por categorias. Cada receita inclui dicas dos nossos usuários!</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-foreground/20">
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                        Não encontrou o que procurava? <a href="/contato" className="font-bold hover:underline">Entre em contato conosco</a> e teremos prazer em ajudar!
                    </p>
                </div>
            </div>
        </main>
    )
}
