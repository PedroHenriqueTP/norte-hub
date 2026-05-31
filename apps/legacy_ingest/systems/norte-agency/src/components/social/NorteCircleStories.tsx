"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, Share2, Zap } from "lucide-react";

type Story = {
  id: string;
  username: string;
  avatar: string;
  imageUrl: string;
  title: string;
  metric: string;
};

// Mock data based on the Affinity & Performance logic
const MOCK_STORIES: Story[] = [
  {
    id: "1",
    username: "Pedrão",
    avatar: "https://i.pravatar.cc/150?u=pedrao",
    imageUrl: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&q=80&w=600",
    title: "Córtex Neural Online",
    metric: "Deploy Concluído",
  },
  {
    id: "2",
    username: "Maria.Data",
    avatar: "https://i.pravatar.cc/150?u=maria",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    title: "Treino na Bluefit",
    metric: "Affinity Match: Alta",
  },
  {
    id: "3",
    username: "Cogitare B2B",
    avatar: "https://i.pravatar.cc/150?u=cogitare",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    title: "SaaS Maker Dashboard",
    metric: "R$ 10k Processados",
  }
];

export function NorteCircleStories() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  return (
    <div className="w-full">
      {/* Story Rings */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {MOCK_STORIES.map((story) => (
          <div 
            key={story.id} 
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => setActiveStory(story)}
          >
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-cyan-500 to-violet-500 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full border-2 border-slate-950 overflow-hidden">
                <img src={story.avatar} alt={story.username} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs font-medium text-slate-300">{story.username}</span>
          </div>
        ))}
      </div>

      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {activeStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="absolute top-6 right-6">
              <button 
                onClick={() => setActiveStory(null)}
                className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm h-[80vh] relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
            >
              <img src={activeStory.imageUrl} alt="Story" className="w-full h-full object-cover" />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              {/* Header */}
              <div className="absolute top-4 left-4 right-4 flex items-center gap-3">
                <img src={activeStory.avatar} className="w-10 h-10 rounded-full border border-white/20" alt="Avatar"/>
                <div>
                  <h4 className="text-white font-bold text-sm shadow-black">{activeStory.username}</h4>
                  <span className="text-cyan-400 text-xs font-medium flex items-center gap-1">
                    <Zap size={12} /> {activeStory.metric}
                  </span>
                </div>
              </div>

              {/* Title Content */}
              <div className="absolute bottom-20 left-6 right-6">
                <h2 className="text-white text-2xl font-black mb-2 leading-tight shadow-black drop-shadow-md">
                  {activeStory.title}
                </h2>
              </div>

              {/* Actions */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="relative flex-1 mr-4">
                  <input 
                    type="text" 
                    placeholder="Enviar mensagem via DM..."
                    className="w-full bg-black/40 border border-white/20 text-white placeholder-slate-400 text-sm rounded-full py-3 px-4 backdrop-blur-md focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-red-500 hover:bg-white/10 transition-colors">
                    <Heart size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-cyan-400 hover:bg-white/10 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
