import { AuthBrandingPanel } from "./auth-layout";
import { BackgroundDecor } from "@/components/core/background-decor";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full lg:grid lg:grid-cols-2 bg-background overflow-hidden selection:bg-primary/20">
            {/* Shared Ambient Background */}
            <BackgroundDecor className="opacity-20" />

            {/* Branding Panel (Hidden on Mobile) */}
            <AuthBrandingPanel />

            {/* Auth Content Area */}
            <main className="relative z-10 flex min-h-screen items-center justify-center p-6 sm:p-12 lg:bg-transparent">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>
        </div>
    );
}
