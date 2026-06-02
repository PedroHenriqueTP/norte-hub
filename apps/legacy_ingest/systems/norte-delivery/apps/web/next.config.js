/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['localhost'],
    },
    // Fix for potential issues with monorepo packages/transpilation
    transpilePackages: ['lucide-react'],
};

module.exports = nextConfig;
