'use client';

import { ArrowRight, ArrowUpRight, List, X } from '@phosphor-icons/react';
import { useState } from 'react';

const links = [
    {
        name: 'Articles',
        href: '/articles',
    },
    {
        name: 'Features',
        href: '/#features',
    },
    {
        name: 'Discord Server',
        href: 'https://support.eturn.app/',
        external: true,
    },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="flex items-center justify-between py-5 px-6 md:px-12 border-b border-neutral-800 background-bg">
            <div
                className="flex items-center space-x-1 hover:cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => (window.location.href = '/')}
            >
                <img
                    src="/images/logo_no_background.png"
                    alt="Eturn Logo"
                    className="w-9 h-9"
                />
                <h1 className="text-xl font-[Coolvetica] tracking-wide">
                    eturn
                </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
                {links.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className="hover:text-neutral-300 transition-colors"
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                        {link.name}{' '}
                        {link.external && (
                            <ArrowUpRight
                                size={14}
                                weight="bold"
                                className="inline-block -mt-2 -ml-0.5"
                            />
                        )}
                    </a>
                ))}
            </div>
            <a href="https://invite.eturn.app">
                <button className="hidden md:flex px-4 py-2 text-white bg-primary/20 border border-primary rounded-lg items-center hover:bg-primary/15 hover:border-primary/50 transition-colors">
                    Invite
                    <ArrowRight
                        size={16}
                        weight="bold"
                        style={{ marginLeft: '0.3rem' }}
                    />
                </button>
            </a>
            <div className="md:hidden">
                <button onClick={toggleMenu}>
                    {menuOpen ? (
                        <X size={24} weight="bold" />
                    ) : (
                        <List size={24} weight="bold" />
                    )}
                </button>
            </div>
            {menuOpen && (
                <div className="md:hidden absolute top-[4.75rem] left-0 right-0 border-b border-t border-neutral-800 background-bg flex flex-col items-center space-y-4 py-4">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="hover:text-neutral-400 transition-colors"
                            target={link.external ? '_blank' : undefined}
                            rel={
                                link.external
                                    ? 'noopener noreferrer'
                                    : undefined
                            }
                            onClick={toggleMenu}
                        >
                            {link.name}{' '}
                            {link.external && (
                                <ArrowUpRight
                                    size={14}
                                    weight="bold"
                                    className="inline-block -mt-2 -ml-0.5"
                                />
                            )}
                        </a>
                    ))}
                    <a href="https://invite.eturn.app">
                        <button className="flex px-4 py-2 text-white bg-primary/20 border border-primary rounded-lg items-center hover:bg-primary/15 hover:border-primary/50 transition-colors">
                            Invite
                            <ArrowRight
                                size={16}
                                weight="bold"
                                style={{ marginLeft: '0.3rem' }}
                            />
                        </button>
                    </a>
                </div>
            )}
        </nav>
    );
}
