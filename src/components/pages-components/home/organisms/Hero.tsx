import React from "react";
import Image from "next/image";

export default function Hero(): React.ReactElement {
    return (
        <section
            className="hero min-h-[calc(100vh-3rem)] flex items-center justify-center relative overflow-hidden text-background px-[var(--pc-padding)] py-10 lg:py-0"
            role="region"
            aria-label="Área de destaque"
        >
            {/* Desfoque e escurecimento */}
            <div className="bg-black/46 backdrop-blur-sm absolute inset-0 z-[2]" aria-hidden="true" />
            <Image
                src="https://res.cloudinary.com/dyenpzpcr/image/upload/v1755488141/hero-background_vmw9cp.png"
                alt=""
                fill
                priority
                className="absolute inset-0 object-cover z-[1]"
            />
            <div className="bg-foreground h-3 absolute bottom-0 left-0 right-0 z-[4]" aria-hidden="true" />
            <div
                className="bg-foreground h-6 w-[min(32rem,90vw)] absolute bottom-3 left-1/2 -translate-x-1/2 z-[4] rounded-t-xl"
                aria-hidden="true"
            />
            <div className="z-[3] flex w-full flex-col items-center justify-between gap-10 text-center lg:flex-row lg:items-start lg:text-left">
                <div className="pt-8 lg:pt-[6.25rem]">
                    <h2 className="font-protest-strike text-4xl sm:text-5xl lg:text-7xl xl:text-8xl">
                        SUCULENTA E<br /> SABOROSA!
                    </h2>
                    <p className="text-base sm:text-lg lg:text-2xl">as melhores receitas, só aqui.</p>
                </div>
                <div className="flex justify-center lg:justify-end w-full lg:w-auto">
                    <Image
                        src="https://res.cloudinary.com/dyenpzpcr/image/upload/v1755488143/hero-highlight_ydet61.png"
                        alt="Ilustração em destaque relacionada às receitas"
                        width={600}
                        height={600}
                        sizes="(min-width: 1024px) 32rem, (min-width: 640px) 22rem, 18rem"
                        className="h-auto w-[18rem] sm:w-[22rem] lg:w-[32rem]"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
