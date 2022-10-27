module.exports = {
    apps: [{
        name: 'Xishichang',
        port: 3000,
        exec_mode: 'cluster',
        instances: 'max',
        max_memory_restart: '4096M',
        script: './node_modules/nuxt/bin/nuxt.js',
        args: 'start',
        watch: ['.nuxt', 'api', 'utility', 'static', 'plugins', 'api']
    }]
}