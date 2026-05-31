"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const Plan = ({ name, price, features, popular, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`
      relative p-8 rounded-2xl border flex flex-col
      ${popular
                ? "bg-zinc-900 border-violet-500/50 shadow-2xl shadow-violet-500/10"
                : "bg-black border-zinc-800"
            }
    `}
    >
        {popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
            </div>
        )}

        <h3 className="text-lg font-medium text-zinc-300 mb-2">{name}</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-white">${price}</span>
            <span className="text-zinc-500">/mo</span>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature: string) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-zinc-400">
                    <Check className={`w-4 h-4 mt-0.5 ${popular ? "text-violet-400" : "text-zinc-600"}`} />
                    {feature}
                </li>
            ))}
        </ul>

        <Button
            className={`w-full ${popular ? "bg-violet-600 hover:bg-violet-700 text-white" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}
        >
            Choose Plan
        </Button>
    </motion.div>
);

export function Pricing() {
    const [annual, setAnnual] = useState(false);

    return (
        <section id="pricing" className="py-24 border-t border-white/5 bg-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Investimento Simples</h2>
                    <p className="text-zinc-400 mb-8">Comece grátis. Escale conforme sua agência cresce.</p>

                    <div className="inline-flex items-center gap-2 bg-zinc-900 p-1 rounded-full border border-white/10">
                        <button
                            onClick={() => setAnnual(false)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!annual ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => setAnnual(true)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${annual ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}`}
                        >
                            Anual <span className="text-green-400 text-[10px] ml-1">-20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <Plan
                        name="Freelancer"
                        price={annual ? "0" : "0"}
                        features={["1 User", "Up to 3 Active Jobs", "Basic Financials", "Community Support"]}
                        delay={0.1}
                    />
                    <Plan
                        name="Agency Pro"
                        price={annual ? "39" : "49"}
                        features={["5 Users", "Unlimited Jobs", "Agency Copilot (AI)", "Talent Marketplace", "Priority Support"]}
                        popular
                        delay={0.2}
                    />
                    <Plan
                        name="Enterprise"
                        price={annual ? "99" : "129"}
                        features={["Unlimited Users", "Custom Domain", "SSO & Audit Logs", "Dedicated Success Manager", "API Access"]}
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
}
