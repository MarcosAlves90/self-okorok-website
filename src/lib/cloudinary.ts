export const CLOUDINARY_CLOUD_NAME = "dyenpzpcr";
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const CLOUDINARY_ASSETS = {
    heroBackground: "v1755488141/hero-background_vmw9cp.png",
    heroHighlight: "v1755488143/hero-highlight_ydet61.png",
} as const;

export type CloudinaryAssetId = (typeof CLOUDINARY_ASSETS)[keyof typeof CLOUDINARY_ASSETS];

export type CloudinaryTransformationOptions = {
    width?: number;
    height?: number;
    crop?: string;
    gravity?: string;
    background?: string;
    quality?: number | "auto";
    fetchFormat?: string;
    density?: number | "auto";
    extra?: string | string[];
};

const DEFAULT_TRANSFORMATIONS = ["f_auto", "q_auto", "dpr_auto"];

const normalizePublicId = (publicId: string) => publicId.replace(/^\/+/, "");

const mapTransformation = (options: CloudinaryTransformationOptions): string[] => {
    const entries: string[] = [];

    if (options.width) {
        entries.push(`w_${Math.round(options.width)}`);
    }

    if (options.height) {
        entries.push(`h_${Math.round(options.height)}`);
    }

    if (options.crop) {
        entries.push(`c_${options.crop}`);
    }

    if (options.gravity) {
        entries.push(`g_${options.gravity}`);
    }

    if (options.background) {
        entries.push(`b_${options.background}`);
    }

    if (options.quality) {
        entries.push(`q_${options.quality}`);
    }

    if (options.fetchFormat) {
        entries.push(`f_${options.fetchFormat}`);
    }

    if (options.density) {
        entries.push(`dpr_${options.density}`);
    }

    if (options.extra) {
        const extras = Array.isArray(options.extra) ? options.extra : [options.extra];
        entries.push(...extras.filter(Boolean) as string[]);
    }

    return entries;
};

export function buildCloudinaryUrl(publicId: string, options: CloudinaryTransformationOptions = {}) {
    const normalizedId = normalizePublicId(publicId);
    const customTransformations = mapTransformation(options);
    const transformationSegment = [...DEFAULT_TRANSFORMATIONS, ...customTransformations].join(",");

    return `${CLOUDINARY_BASE_URL}/${transformationSegment}/${normalizedId}`;
}
