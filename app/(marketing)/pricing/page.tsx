import { Metadata } from "next";
import PricingSection from "@/components/main/sections/pricing";
import { HelpCircle, ShieldCheck, Cpu, Globe } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";

export const metadata: Metadata = {
    title: "Pricing | Brainy",
    description: "Flexible plans for students, institutions, and enterprise organizations.",
};

export default function PricingPage() {
    return (
        <div className="pt-20">
            <PricingSection />

            {/* Extended FAQ for Dedicated Page */}
            <div className="bg-muted/30 py-24 sm:py-32 border-t border-border/50">
                <Wrapper>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                            <HelpCircle className="h-3 w-3" />
                            Common Questions
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            { q: "Can I upgrade my plan later?", a: "Yes, you can upgrade from Student to Institution at any time. Your existing data will be migrated." },
                            { q: "What is your refund policy?", a: "We offer a 14-day complete satisfaction guarantee for Institutional Pro subscriptions." },
                            { q: "Do you offer education discounts?", a: "Institutional Pro is already priced for education. For non-profits, contact our sales team." },
                            { q: "Is my institutional data safe?", a: "Absolutely. We use enterprise-grade encryption and follow strict Nigerian and international data laws." },
                            { q: "Can I use Brainy for exams?", a: "Yes. Our proctoring and verification tools are designed specifically for high-stakes examinations." },
                            { q: "Do you support integration with LMS?", a: "Yes, our Enterprise plan supports LTI integration with Moodle, Canvas, and Blackboard." },
                        ].map((faq, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-card border border-border backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-foreground mb-3 leading-snug">{faq.q}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </Wrapper>
            </div>
        </div>
    );
}
