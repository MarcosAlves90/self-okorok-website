export interface Recipe {
    id: string
    titulo: string
    ingredientes: string
    modo: string
    tempo?: string | null
    rendimento?: string | null
    categoria?: string | null
    observacoes?: string | null
    imagemUrl?: string | null
    authorId?: string | null
    authorName?: string | null
    createdAt?: string | null
}
