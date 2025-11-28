import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Agent", href: "/agent" },
    { label: "How It Works", href: "/how-it-works" },
];

export default function UnifiedHeader() {
    const [location] = useLocation();
    const { user } = useAuth();
    const isHome = location === "/";

    return (
        <nav className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
                <img
                    src="/logoria.gif"
                    alt="Ria logo"
                    className="h-[50px] w-[50px] object-contain"
                />
                <span className="text-2xl font-bold text-white drop-shadow">Ria</span>
            </Link>

            <div className="hidden md:flex items-center gap-6 md:gap-8">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className="text-white/90 hover:text-white transition-colors text-sm md:text-base font-medium drop-shadow cursor-pointer">
                        {item.label}
                    </Link>
                ))}

                {user ? (
                    <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer">
                        Dashboard
                    </Link>
                ) : (
                    <Link href="/signin" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer">
                        Sign In
                    </Link>
                )}
            </div>

            <div className="md:hidden">
                {user ? (
                    <Link href="/dashboard" className="inline-flex items-center rounded-full border border-white/30 bg-white/10 backdrop-blur px-4 py-2 text-sm font-semibold text-white cursor-pointer">
                        Dashboard
                    </Link>
                ) : (
                    <Link href="/signin" className="inline-flex items-center rounded-full border border-white/30 bg-white/10 backdrop-blur px-4 py-2 text-sm font-semibold text-white cursor-pointer">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
