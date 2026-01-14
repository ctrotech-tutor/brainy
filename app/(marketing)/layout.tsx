"use server";

import Navbar from "@/components/core/nav-bar";
import Footer from "@/components/core/Footer";
import { BackgroundDecor } from "@/components/core/background-decor";
import { validateRequest } from "@/lib/auth";

export default async function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await validateRequest();

    return (
        <div className="relative min-h-screen bg-background">
            <BackgroundDecor />
            <Navbar user={user} />
            <main className="relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    );
}
