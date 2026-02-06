import Link from "next/link";
import type { ReactElement } from "react";

import CloudinaryImage from "@/components/shared/CloudinaryImage";
import { CLOUDINARY_ASSETS } from "@/lib/cloudinary";

export default function Hero(): ReactElement {
    return (
        <section
            className="hero relative overflow-hidden text-[#FEFCED] px-[var(--pc-padding)] pt-20 pb-10 sm:pt-24 sm:pb-12 lg:pt-32 lg:pb-20"
            role="region"
            aria-label="Área de destaque"
        >
            <CloudinaryImage
                publicId={CLOUDINARY_ASSETS.heroBackground}
                alt=""
                fill
                priority
                sizes="100vw"
                transformation={{ width: 2500 }}
                className="absolute inset-0 object-cover z-[1]"
            />
            <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/70 via-black/45 to-black/30" aria-hidden="true" />
            <div className="absolute -top-20 right-[-10%] h-64 w-64 rounded-full bg-foreground/40 blur-3xl z-[2]" aria-hidden="true" />
            <div className="absolute bottom-0 left-[-10%] h-64 w-64 rounded-full bg-foreground-dark/50 blur-3xl z-[2]" aria-hidden="true" />

            <div className="relative z-[3] mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 text-center lg:flex-row lg:items-center lg:text-left">
                <div className="flex-1">
                    <span className="inline-flex items-center rounded-full border border-[#FEFCED]/25 bg-[#FEFCED]/10 px-3 py-1 text-[11px] sm:text-sm uppercase tracking-[0.2em]">
                        Receitas caseiras e criativas
                    </span>
                    <h2 className="mt-4 font-protest-strike text-4xl leading-[0.95] sm:mt-5 sm:text-6xl lg:text-7xl xl:text-8xl">
                        SUCULENTA E<br /> SABOROSA!
                    </h2>
                    <p className="mt-3 text-sm sm:mt-4 sm:text-lg lg:text-2xl text-[#FEFCED]/90">
                        Descubra pratos que impressionam no primeiro olhar e conquistam no primeiro garfo.
                    </p>

                    <div className="mt-5 flex flex-col items-center gap-3 sm:mt-6 sm:flex-row sm:justify-center lg:justify-start">
                        <Link
                            href="/#todas-receitas"
                            className="hero-primary-cta inline-flex h-11 sm:h-12 items-center justify-center rounded-full bg-foreground px-5 sm:px-6 text-sm font-semibold shadow-lg shadow-foreground/40 transition-colors hover:bg-foreground/90"
                        >
                            Explorar receitas
                        </Link>
                        <Link
                            href="/#mais-votadas"
                            className="inline-flex h-11 sm:h-12 items-center justify-center rounded-full border border-[#FEFCED]/50 px-5 sm:px-6 text-sm font-semibold text-[#FEFCED] transition-colors hover:bg-[#FEFCED]/10"
                        >
                            Ver mais votadas
                        </Link>
                    </div>

                    <ul className="mt-6 hidden flex-wrap items-center justify-center gap-3 text-xs sm:flex sm:text-sm text-[#FEFCED]/80 lg:justify-start">
                        <li className="rounded-full border border-[#FEFCED]/20 px-3 py-1">Passo a passo claro</li>
                        <li className="rounded-full border border-[#FEFCED]/20 px-3 py-1">Ingredientes do dia a dia</li>
                        <li className="rounded-full border border-[#FEFCED]/20 px-3 py-1">Dicas da comunidade</li>
                    </ul>
                </div>

                <div className="flex w-full flex-1 items-center justify-center lg:justify-end">
                    <div className="relative">
                        <CloudinaryImage
                            publicId={CLOUDINARY_ASSETS.heroHighlight}
                            alt="Ilustração em destaque relacionada às receitas"
                            width={600}
                            height={600}
                            sizes="(min-width: 1024px) 34rem, (min-width: 640px) 24rem, 18rem"
                            transformation={{ width: 1400 }}
                            className="h-auto w-[16rem] sm:w-[24rem] lg:w-[34rem] drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)]"
                            priority
                        />
                        <div className="absolute -bottom-6 left-1/2 hidden w-[85%] -translate-x-1/2 rounded-2xl border border-[#FEFCED]/15 bg-black/40 px-4 py-3 text-left text-xs sm:block sm:text-sm backdrop-blur-md">
                            <p className="font-semibold">Receita do dia</p>
                            <p className="text-[#FEFCED]/80">Uma combinação simples com sabor de restaurante.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-foreground h-3 absolute bottom-0 left-0 right-0 z-[4]" aria-hidden="true" />
            <div
                className="bg-foreground h-6 w-[min(32rem,90vw)] absolute bottom-3 left-1/2 -translate-x-1/2 z-[4] rounded-t-xl"
                aria-hidden="true"
            />
        </section>
    );
}
