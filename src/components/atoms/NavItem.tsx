'use client'

import React from 'react';
import Link from 'next/link';

type NavItemProps = {
    href: string;
    label: string;
    scrolled?: boolean;
    ariaLabel?: string;
};

export default function NavItem({ href, label, scrolled, ariaLabel }: NavItemProps): React.ReactElement {
    const hoverBorder = scrolled ? 'hover:border-foreground' : 'hover:border-background';
    const underlineClass = `border-b-2 border-transparent ${hoverBorder}`;

    return (
        <li className="text-xs md:text-sm lg:text-base">
            <Link
                href={href}
                className={`cursor-pointer font-medium pb-1 ease-in-out ${underlineClass}`}
                aria-label={ariaLabel}
            >
                {label}
            </Link>
        </li>
    );
}
