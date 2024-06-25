const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false,
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(__dirname, 'src');
        return config;
    },
};

module.exports = nextConfig;
