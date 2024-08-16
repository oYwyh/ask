/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["@node-rs/argon2"],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: 'pub-103f51315d414e1499b8f0c080b640d9.r2.dev',
                port: '',
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;
