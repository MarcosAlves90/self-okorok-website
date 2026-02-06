import Link from 'next/link'
import Image from 'next/image'

interface Props {
    imageSrc: string
    title: string
    href?: string
    alt?: string
}

export default function MostVotedCard({ imageSrc, title, href = "#" }: Props) {
    return (
        <Link href={href}>
            <div className="w-full pt-[100%] relative group cursor-pointer hover:opacity-80 transition-opacity duration-200">
                <div className="absolute inset-0 bg-[#a66b58] rounded-lg shadow-inner overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/85" />

                    <div className="recipe-card-content absolute inset-0 p-3 flex flex-col justify-between">
                        <div className="flex justify-end">
                            <div className="bg-foreground rounded px-2 py-1 text-xs">
                                ⭐ Mais Votada
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                                {title}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
