import { useCallback, useEffect, useMemo, useState } from 'react'

export function useSelectableIds<T extends { id: string }>(items: T[]) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    const itemIds = useMemo(() => new Set(items.map(item => item.id)), [items])

    useEffect(() => {
        setSelectedIds(prev => {
            const next = new Set<string>()
            for (const id of prev) {
                if (itemIds.has(id)) next.add(id)
            }
            return next
        })
    }, [itemIds])

    const toggle = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, [])

    const toggleAll = useCallback((targetItems: T[] = items) => {
        setSelectedIds(prev => {
            if (prev.size === targetItems.length) return new Set<string>()
            return new Set(targetItems.map(item => item.id))
        })
    }, [items])

    const clear = useCallback(() => {
        setSelectedIds(new Set())
    }, [])

    return {
        selectedIds,
        selectedCount: selectedIds.size,
        toggle,
        toggleAll,
        clear,
        setSelectedIds
    }
}
