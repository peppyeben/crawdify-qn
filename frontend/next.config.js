const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/v0",
                // source: "api/v0/:path*",
                destination: "http://localhost:4000/api/v0",
            },
        ];
    },
};

module.exports = nextConfig;
