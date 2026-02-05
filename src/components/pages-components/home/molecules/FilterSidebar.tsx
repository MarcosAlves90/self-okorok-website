'use client'

import React, { useState, useMemo } from "react";
import { PanelLeft } from 'lucide-react';

// filtros
const FILTERS = [
    { title: "Tipo de carne", items: ["Picanha", "Tomahawk", "Coxinha", "Bisteca", "Bacon", "Acém"] },
    { title: "Tipo de receita", items: ["Grelhado", "Churrasco", "Fogueira", "Espeto", "Chapa", "Acompanh."] },
    { title: "Cortes especiais", items: ["Angus","Wagyu","Prime","Sashi","Fraldinha","Alcatra","Cupim"] },
    { title: "Região", items: ["Brasileira", "Argentina", "Americana", "Italiana", "Portuguesa", "Ásia"] },
    { title: "Nível de dificuldade", items: ["Fácil", "Médio", "Difícil"] },
    { title: "Tempo de preparo", items: ["<= 15 min", "15-30 min", "30-60 min", "> 60 min"] },
    { title: "Dietas", items: ["Vegetariano", "Vegano", "Low Carb", "Sem glúten", "Sem lactose"] },
    { title: "Ocasião", items: ["Churrasco", "Jantar especial", "Almoço rápido", "Happy hour"] },
];

export default function FilterSidebar(): React.ReactElement {
    return (
        <aside className="bg-[#8a3b1a] rounded-lg text-sm text-white flex flex-col h-auto max-h-[70vh] lg:h-[40rem] lg:max-h-none">
            <SidebarHeader />
            <div className="space-y-6 px-5 overflow-y-auto flex-1">
                {FILTERS.map((filter) => (
                    <FilterSection key={filter.title} title={filter.title} items={filter.items} />
                ))}
            </div>
        </aside>
    );
}

type FilterSectionProps = { title: string; items: string[] };

// cabeçalho
function SidebarHeader() {
    return (
        <div className="flex items-center justify-between mb-4 px-5 py-3 rounded-t-lg bg-foreground-dark flex-none">
            <h3 className="font-semibold">Filtros</h3>
            <button aria-label="toggle-filters" className="w-7 h-7 flex items-center justify-center text-white">
                <PanelLeft size={25} />
            </button>
        </div>
    );
}

function FilterSection({ title, items }: FilterSectionProps): React.ReactElement {
    const [collapsed, setCollapsed] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const sliceLimit = 5;
    const visibleItems = useMemo(() => (showAll ? items : items.slice(0, sliceLimit)), [items, showAll]);

    return (
        <section>
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{title}</h4>
                <button
                    aria-label={`${collapsed ? "expand" : "collapse"}-${title}`}
                    className="w-7 h-7 flex items-center justify-center cursor-pointer text-white/90 text-2xl"
                    onClick={() => setCollapsed((v) => !v)}
                    title={collapsed ? "Expandir seção" : "Colapsar seção"}
                >
                    {collapsed ? "+" : "−"}
                </button>
            </div>
            <div className={"overflow-hidden " + (collapsed ? "hidden" : "")}>  
                <ul className="space-y-2">
                    {visibleItems.map((item) => (
                        <FilterCheckbox key={item} title={title} item={item} />
                    ))}
                </ul>
                {items.length > sliceLimit && (
                    <button
                        className="mt-2 text-xs cursor-pointer text-white/70"
                        onClick={() => setShowAll((v) => !v)}
                        aria-expanded={showAll}
                    >
                        {showAll ? "− Ver menos" : "+ Ver mais"}
                    </button>
                )}
            </div>
        </section>
    );
}

function FilterCheckbox({ title, item }: { title: string; item: string }) {
    const safeTitle = title.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9\-]/g, "");
    const safeItem = item.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9\-]/g, "");
    const id = `${safeTitle}-${safeItem}`;
    return (
        <li className="flex items-center gap-2">
            <input id={id} type="checkbox" className="w-3 h-3 accent-white" />
            <label htmlFor={id} className="text-white/90 text-xs">{item}</label>
        </li>
    );
}
