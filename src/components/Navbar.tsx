'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Code2, Wrench, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const links = [
        { href: '/', label: 'Home', icon: Activity },
        { href: '/projects', label: 'Projects', icon: Code2 },
        { href: '/tools', label: 'Tools', icon: Wrench },
        { href: '/admin', label: 'Admin', icon: Shield },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        
                            <Image
                                src="/images/logo_icon.png"
                                alt="The Forest Den"
                                width={102}
                                height={102}
                                className="object-contain group-hover:scale-110 transition-transform brightness-0 invert"
                            />
                        
                        <div className="hidden sm:flex flex-col">  {/* Hide on mobile */}
                            <span className="font-bold text-white text-lg leading-none">The Forest Den</span>
                            <span className="text-xs text-slate-400 leading-none">Where Code Grows Wild</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                        }
                  `}
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-300 hover:text-white"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                    ${active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                        }
                  `}
                                >
                                    <Icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </nav>
    );
}