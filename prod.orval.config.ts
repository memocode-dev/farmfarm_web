module.exports = {
    'farmfarm': {
        input: 'https://api.farmfarm.me/v3/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/api',
            schemas: 'src/openapi/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/axios_instance.ts',
                    name: 'farmfarmAxiosInstance',
                },
            },
        },
    },
};