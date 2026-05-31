export default function Footer() {
    return (
        <footer className="w-full bg-black text-white py-8 px-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center z-10 relative">
            <div className="mb-4 md:mb-0">
                <p className="text-xs font-bold tracking-widest text-gray-500">
                    © 2025 ANTIGRAVITY AGENCY
                </p>
            </div>

            <div className="flex gap-6">
                <a href="#" className="text-xs font-bold tracking-widest hover:text-gray-400 transition-colors">INSTAGRAM</a>
                <a href="#" className="text-xs font-bold tracking-widest hover:text-gray-400 transition-colors">LINKEDIN</a>
                <a href="#" className="text-xs font-bold tracking-widest hover:text-gray-400 transition-colors">TWITTER</a>
            </div>
        </footer>
    );
}
