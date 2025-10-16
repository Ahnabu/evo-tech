/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        qualities: [16, 32, 48, 64, 75, 90, 100],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.evo-techbd.com',
                port: '',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
            },
            {
                protocol: 'https',
                hostname: 'elegoo.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: '**.elegoo.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'unsplash.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: '**.unsplash.com',
                port: '',
            },
        ],
    },
};

export default nextConfig;
