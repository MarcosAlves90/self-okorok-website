import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "@/components/pages-components/login/organisms/LoginForm";

export const metadata: Metadata = {
    title: "Login",
};

export default function Login() {
    return (
        <main className="min-h-[calc(100vh-82px)] mt-[82px] flex justify-center items-center py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)]">
            <div className="border-2 border-foreground px-0 py-0 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-xl overflow-hidden text-foreground bg-background">
                <div className="relative hidden lg:flex items-center justify-center bg-foreground text-background min-h-[32rem]">
                    <Image
                        src="https://res.cloudinary.com/dyenpzpcr/image/upload/v1755488141/hero-background_vmw9cp.png"
                        alt=""
                        fill
                        priority
                        className="object-cover opacity-30"
                    />
                    <div className="relative z-[1] px-10 text-center space-y-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-background/80">Okorok</p>
                        <h2 className="font-protest-strike text-4xl leading-tight">
                            Entre e acenda<br /> seu próximo churrasco
                        </h2>
                        <p className="text-sm text-background/90">
                            Receitas testadas, dicas de especialistas e curadoria semanal.
                        </p>
                    </div>
                </div>

                <div className="w-full h-full px-6 sm:px-10 lg:px-12 py-10 sm:py-14 min-h-[32rem] flex items-center justify-center text-center">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-protest-strike leading-tight mb-4 text-center">
                            Entre em sua conta
                        </h2>
                        <p className="text-sm sm:text-base text-foreground/80 mb-10">
                            Continue de onde parou e salve seus favoritos.
                        </p>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </main>
    )
}
