export type ApiResponse<T> = {
    success: boolean
    data?: T
    message?: string
}

export async function fetchJson<T>(
    input: RequestInfo | URL,
    init: RequestInit | undefined,
    errorMessage: string
): Promise<ApiResponse<T>> {
    const response = await fetch(input, init)
    const data = await response.json().catch(() => null) as ApiResponse<T> | null

    if (!response.ok) {
        throw new Error(data?.message || errorMessage)
    }

    if (!data || !data.success) {
        throw new Error(data?.message || errorMessage)
    }

    return data
}
