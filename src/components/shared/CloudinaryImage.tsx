import type { ComponentProps } from "react";
import Image from "next/image";
import { buildCloudinaryUrl, CloudinaryTransformationOptions } from "@/lib/cloudinary";

type CloudinaryImageProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
    publicId: string;
    transformation?: CloudinaryTransformationOptions;
    alt: string;
};

export default function CloudinaryImage({ publicId, transformation, alt, ...props }: CloudinaryImageProps) {
    const src = buildCloudinaryUrl(publicId, transformation);

    return <Image src={src} alt={alt} {...props} />;
}
