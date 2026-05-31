"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Briefing() {
    const [step, setStep] = useState(1);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <header className="p-6 flex justify-between items-center">
                <a href="/" className="text-xl font-bold font-heading">ANTIGRAVITY</a>
                <a href="/" className="text-sm uppercase tracking-widest hover:text-gray-300">Close</a>
            </header>

            <div className="flex-1 flex flex-col justify-center items-center px-4 max-w-3xl mx-auto w-full">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full"
                >
                    <div className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">Passo {step} de 3</div>

                    {step === 1 && (
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-12 leading-tight">Vamos começar. <br /> Qual é o seu nome?</h1>
                            <input
                                type="text"
                                placeholder="Seu nome"
                                className="w-full bg-transparent border-b border-gray-700 text-3xl py-4 focus:outline-none focus:border-white transition-colors placeholder:text-gray-800"
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-12 leading-tight">E o seu email corporativo?</h1>
                            <input
                                type="email"
                                placeholder="voce@empresa.com"
                                className="w-full bg-transparent border-b border-gray-700 text-3xl py-4 focus:outline-none focus:border-white transition-colors placeholder:text-gray-800"
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-12 leading-tight">O que você precisa?</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["Branding", "Web Design", "Marketing", "Outro"].map((opt) => (
                                    <button key={opt} className="p-6 border border-gray-700 text-left hover:bg-white hover:text-black transition text-xl font-bold font-heading uppercase">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-12 flex justify-between items-center">
                        {step > 1 && (
                            <button onClick={() => setStep(step - 1)} className="text-sm uppercase tracking-widest text-gray-500 hover:text-white">Voltar</button>
                        )}
                        <button
                            onClick={() => step < 3 ? setStep(step + 1) : setStep(4)}
                            className="ml-auto bg-white text-black rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition"
                        >
                            {step === 3 ? "Enviar" : "Próximo"}
                        </button>
                    </div>
                </motion.div>

                {step === 4 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            Recebido.
                        </h1>
                        <p className="text-xl text-gray-400 mb-12">
                            Entraremos em contato em breve. <br /> Prepare-se para a decolagem.
                        </p>
                        <a href="/" className="inline-block border-b border-white pb-1 text-sm font-bold uppercase tracking-widest hover:text-gray-300">
                            Voltar para a base
                        </a>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
