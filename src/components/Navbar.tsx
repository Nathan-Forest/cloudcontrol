'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Activity, Code2, Wrench, Shield, Menu, X, Leaf, ChevronDown, LayoutDashboard, Target, FolderKanban, BookOpen, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [lifeOSOpen, setLifeOSOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const links = [
        { href: '/', label: 'Home', icon: Activity },
        { href: '/about', label: 'About', icon: User },
        { href: '/projects', label: 'Projects', icon: Code2 },
        { href: '/tools', label: 'Server Control Centre', icon: Wrench },
    
    ];

    const lifeOSLinks = [
        { href: '/lifeos/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/lifeos/habits', label: 'Habits', icon: Activity },
        { href: '/lifeos/goals', label: 'Goals', icon: Target },
        { href: '/lifeos/projects', label: 'Projects', icon: FolderKanban },
        { href: '/lifeos/study', label: 'Study', icon: BookOpen },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const isLifeOSActive = pathname.startsWith('/lifeos');

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setLifeOSOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setLifeOSOpen(false);
        router.push('/');
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
                        <div className="hidden sm:flex flex-col">
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

                        {/* LifeOS — plain link or dropdown depending on auth */}
                        {!isAuthenticated ? (
                            <Link
                                href="/lifeos/login"
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                                    ${isLifeOSActive
                                        ? 'bg-green-700 text-white'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    }
                                `}
                            >
                                <Leaf className="h-4 w-4" />
                                LifeOS
                            </Link>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setLifeOSOpen(!lifeOSOpen)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                                        ${isLifeOSActive
                                            ? 'bg-green-700 text-white'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                        }
                                    `}
                                >
                                    <Leaf className="h-4 w-4" />
                                    LifeOS
                                    <ChevronDown className={`h-3 w-3 transition-transform ${lifeOSOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {lifeOSOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-green-900/40 rounded-xl shadow-xl overflow-hidden">
                                        <div className="py-1">
                                            {lifeOSLinks.map((link) => {
                                                const Icon = link.icon;
                                                const active = isActive(link.href);
                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setLifeOSOpen(false)}
                                                        className={`
                                                            flex items-center gap-3 px-4 py-2.5 text-sm transition-all
                                                            ${active
                                                                ? 'bg-green-800/40 text-green-400'
                                                                : 'text-slate-300 hover:bg-green-900/20 hover:text-green-400'
                                                            }
                                                        `}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                        {link.label}
                                                    </Link>
                                                );
                                            })}

                                            {/* Divider */}
                                            <div className="border-t border-green-900/30 my-1"/>

                                            {/* Logout */}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-all"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
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

                        {/* LifeOS mobile */}
                        <div className="border-t border-slate-800 pt-2">
                            <p className="px-4 py-1 text-xs text-green-600 font-medium uppercase tracking-wider">
                                LifeOS
                            </p>
                            {!isAuthenticated ? (
                                <Link
                                    href="/lifeos/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                                >
                                    <Leaf className="h-5 w-5" />
                                    Sign in to LifeOS
                                </Link>
                            ) : (
                                <>
                                    {lifeOSLinks.map((link) => {
                                        const Icon = link.icon;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-green-400 hover:bg-green-900/20 transition-all"
                                            >
                                                <Icon className="h-5 w-5" />
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Sign out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}