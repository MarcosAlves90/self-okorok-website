import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sobre",
};

export default function About() {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] flex justify-center items-center py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)]">
            <div className="border-2 border-foreground px-6 sm:px-10 lg:px-20 py-10 sm:py-14 lg:py-17 max-w-6xl w-full flex flex-col gap-6 rounded-xl h-full text-center text-foreground">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-protest-strike leading-tight mb-6 sm:mb-8 lg:mb-10">Sobre nós</h2>
                <p className="text-base sm:text-lg md:text-xl font-bold">Quem somos?</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">No <span className="font-bold">Okorok</span>, o churrasco é mais do que uma refeição — é um ritual, uma celebração, uma paixão nacional. Criamos este espaço para reunir os amantes da carne, da fumaça e do sabor autêntico que só o fogo pode proporcionar.<br/><br/>Nossa jornada começou em uma varanda de domingo, entre amigos, cerveja gelada e uma costela suculenta. Foi ali que percebemos: cada corte, cada tempero, cada técnica tem uma história. E essas histórias merecem ser compartilhadas.</p>
                <p className="text-base sm:text-lg md:text-xl font-bold">Nossa missão</p>
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-justify">Queremos democratizar o churrasco. Seja você um mestre da grelha ou alguém que está acendendo o carvão pela primeira vez, aqui você encontra receitas testadas, dicas práticas e segredos que transformam qualquer churrasco em um evento memorável.</p>
            </div>
        </main>
    )
}
