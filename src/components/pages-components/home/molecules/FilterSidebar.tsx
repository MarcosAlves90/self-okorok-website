'use client'

import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, PanelLeft } from 'lucide-react'

export type FilterItem = {
    id: string
    label: string
    count?: number
}

export type FilterGroup = {
    id: string
    label: string
    items: FilterItem[]
}

export type SelectedFilters = Record<string, Set<string>>

interface FilterSidebarProps {
    groups: FilterGroup[]
    selected: SelectedFilters
    totalSelected: number
    collapsed: boolean
    onToggleCollapsed: () => void
    onToggleItem: (groupId: string, itemId: string) => void
    onClearAll: () => void
}

const DEFAULT_SLICE_LIMIT = 6

export default function FilterSidebar({
    groups,
    selected,
    totalSelected,
    collapsed,
    onToggleCollapsed,
    onToggleItem,
    onClearAll
}: FilterSidebarProps): React.ReactElement {
    return (
        <div className="rounded-2xl border border-foreground/15 bg-background shadow-[0_10px_30px_rgba(164,66,20,0.12)] overflow-hidden">
            <SidebarHeader
                totalSelected={totalSelected}
                collapsed={collapsed}
                onToggleCollapsed={onToggleCollapsed}
                onClearAll={onClearAll}
            />
            {!collapsed && (
                <div className="space-y-3 px-3 py-3">
                    {groups.length === 0 ? (
                        <div className="text-sm text-foreground/70">Nenhum filtro disponivel.</div>
                    ) : (
                        groups.map((group) => (
                            <FilterSection
                                key={group.id}
                                group={group}
                                selected={selected[group.id]}
                                onToggleItem={onToggleItem}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

interface SidebarHeaderProps {
    totalSelected: number
    collapsed: boolean
    onToggleCollapsed: () => void
    onClearAll: () => void
}

function SidebarHeader({
    totalSelected,
    collapsed,
    onToggleCollapsed,
    onClearAll
}: SidebarHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-foreground/10 px-5 py-4 bg-gradient-to-r from-foreground/10 via-background to-background">
            <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">Filtros</h3>
                <p className="text-xs text-foreground/70">
                    {totalSelected > 0 ? `${totalSelected} selecionado(s)` : 'Refine sua busca'}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {totalSelected > 0 && (
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="rounded-full border border-foreground/20 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-foreground/10"
                    >
                        Limpar
                    </button>
                )}
                <button
                    type="button"
                    aria-label={collapsed ? 'Expandir filtros' : 'Recolher filtros'}
                    aria-expanded={!collapsed}
                    onClick={onToggleCollapsed}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-all hover:bg-foreground/10 hover:rotate-6"
                >
                    <PanelLeft size={16} aria-hidden="true" />
                </button>
            </div>
        </div>
    )
}

interface FilterSectionProps {
    group: FilterGroup
    selected?: Set<string>
    onToggleItem: (groupId: string, itemId: string) => void
}

function FilterSection({ group, selected, onToggleItem }: FilterSectionProps): React.ReactElement {
    const [collapsed, setCollapsed] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const visibleItems = useMemo(
        () => (showAll ? group.items : group.items.slice(0, DEFAULT_SLICE_LIMIT)),
        [group.items, showAll]
    )

    return (
        <section className="rounded-xl border border-foreground/10 bg-gradient-to-br from-background via-background to-foreground/5 p-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">{group.label}</h4>
                <button
                    type="button"
                    aria-label={collapsed ? `Expandir ${group.label}` : `Recolher ${group.label}`}
                    aria-expanded={!collapsed}
                    onClick={() => setCollapsed((value) => !value)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-foreground/10 text-foreground/80 transition-all hover:bg-foreground/10"
                >
                    {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
            </div>

            {!collapsed && (
                <div className="mt-3 space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {visibleItems.map((item) => (
                            <FilterChip
                                key={item.id}
                                groupId={group.id}
                                item={item}
                                selected={selected?.has(item.id)}
                                onToggleItem={onToggleItem}
                            />
                        ))}
                    </div>

                    {group.items.length > DEFAULT_SLICE_LIMIT && (
                        <button
                            type="button"
                            onClick={() => setShowAll((value) => !value)}
                            className="text-xs font-medium text-foreground/70 transition-colors hover:text-foreground"
                            aria-expanded={showAll}
                        >
                            {showAll ? 'Ver menos' : 'Ver mais'}
                        </button>
                    )}
                </div>
            )}
        </section>
    )
}

interface FilterChipProps {
    groupId: string
    item: FilterItem
    selected?: boolean
    onToggleItem: (groupId: string, itemId: string) => void
}

function FilterChip({ groupId, item, selected = false, onToggleItem }: FilterChipProps) {
    const id = `${groupId}-${item.id}`
    return (
        <label
            htmlFor={id}
            className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                selected
                    ? 'border-foreground bg-foreground text-background shadow-sm'
                    : 'border-foreground/20 text-foreground/80 hover:border-foreground/50 hover:bg-foreground/10'
            }`}
        >
            <input
                id={id}
                type="checkbox"
                checked={selected}
                onChange={() => onToggleItem(groupId, item.id)}
                className="sr-only"
            />
            <span>{item.label}</span>
            {typeof item.count === 'number' && (
                <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                        selected ? 'bg-background/20 text-background' : 'bg-foreground/10 text-foreground/70'
                    }`}
                >
                    {item.count}
                </span>
            )}
        </label>
    )
}
