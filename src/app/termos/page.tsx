import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Termos de Uso",
};

export default function Terms() {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] flex justify-center items-center py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)]">
            <div className="border-2 border-foreground px-6 sm:px-10 lg:px-20 py-10 sm:py-14 lg:py-17 max-w-6xl w-full flex flex-col gap-6 rounded-xl h-full text-center text-foreground">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-protest-strike leading-tight mb-6 sm:mb-8 lg:mb-10">Termos de Uso</h2>
                <p className="text-base sm:text-lg md:text-xl font-bold">Aceitação dos termos</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">Ao acessar e usar o <span className="font-bold">Okorok</span>, você concorda em cumprir estes termos de uso. Se você não concordar com estes termos, por favor, não use nosso site.<br/><br/>Estes termos se aplicam a todos os usuários do site, incluindo aqueles que contribuem com conteúdo, como receitas e comentários.</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">Uso do conteúdo</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">O conteúdo do site, incluindo receitas, textos e imagens, é fornecido para fins informativos e de entretenimento. Você pode usar o conteúdo para uso pessoal, mas não pode copiar, distribuir ou usar comercialmente sem permissão.</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">Responsabilidades do usuário</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">Você é responsável por manter a confidencialidade de sua conta e senha. Não deve compartilhar conteúdo que viole direitos autorais, seja ofensivo ou ilegal. Reservamo-nos o direito de remover conteúdo inadequado.</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">Limitação de responsabilidade</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">O Okorok não se responsabiliza por danos diretos, indiretos ou consequenciais decorrentes do uso do site. As receitas são fornecidas como sugestões e o usuário assume os riscos associados à preparação de alimentos.</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">Alterações nos termos</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">Podemos atualizar estes termos periodicamente. As alterações entrarão em vigor imediatamente após a publicação no site. Recomendamos revisar os termos regularmente.</p>
            </div>
        </main>
    )
}
