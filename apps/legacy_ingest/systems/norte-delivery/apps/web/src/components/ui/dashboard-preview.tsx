"use client";

import { motion } from "framer-motion";
import { BarChart3, Users, ShoppingBag, Clock, MoreHorizontal, ChefHat, Search, Bell } from "lucide-react";

export const DashboardPreview = () => {
    return (
        <div className="relative w-full max-w-[600px] aspect-[4/3] perspective-1000">
            <motion.div
                initial={{ rotateX: 10, rotateY: -10, rotateZ: 2, scale: 0.9 }}
                animate={{
                    rotateX: [10, 5, 10],
                    rotateY: [-10, -5, -10],
                    y: [0, -10, 0]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden flex flex-col relative z-20"
            >
                {/* Top Navigation */}
                <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <Search size={16} />
                        <Bell size={16} />
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200"></div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-16 border-r border-gray-100 flex flex-col items-center py-6 gap-6 bg-gray-50/50">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><ShoppingBag size={20} /></div>
                        <div className="p-2 text-gray-400 hover:text-gray-600"><Users size={20} /></div>
                        <div className="p-2 text-gray-400 hover:text-gray-600"><BarChart3 size={20} /></div>
                        <div className="p-2 text-gray-400 hover:text-gray-600"><Clock size={20} /></div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6 bg-gray-50/30">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium mb-1">Receita Hoje</p>
                                <p className="text-2xl font-bold text-gray-800">R$ 2.450</p>
                                <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full w-[70%] bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium mb-1">Pedidos Ativos</p>
                                <p className="text-2xl font-bold text-gray-800">12</p>
                                <div className="flex -space-x-2 mt-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h4 className="font-bold text-sm text-gray-700">Pedidos Recentes</h4>
                                <MoreHorizontal size={16} className="text-gray-400" />
                            </div>
                            <div className="p-2">
                                {[
                                    { name: "Burger King Jr", status: "Preparando", bg: "bg-orange-100 text-orange-600", time: "12min" },
                                    { name: "Pizza Hut", status: "Saiu para entrega", bg: "bg-blue-100 text-blue-600", time: "5min" },
                                    { name: "Sushi Express", status: "Novo", bg: "bg-green-100 text-green-600", time: "Just now" },
                                ].map((order, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                                <ChefHat size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{order.name}</p>
                                                <p className="text-xs text-gray-400">Order #20{20 + i}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${order.bg}`}>{order.status}</span>
                                            <p className="text-[10px] text-gray-400 mt-1">{order.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Tag */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute -right-8 top-20 bg-white p-3 rounded-xl shadow-xl flex items-center gap-3 z-30"
                >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <ShoppingBag size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold">Vendas +24%</p>
                        <p className="text-xs text-gray-400">vs. ontem</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Glow Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] -z-10 rounded-full" />
        </div>
    );
};
