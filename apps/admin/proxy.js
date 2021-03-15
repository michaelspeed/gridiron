const host = 'localhost'

const proxyArray = {
    '/admin-api': `http://megatron.assammart.shop`,
    '/shop-api': `http://optimus.assammart.shop`,
    '/controllers': `http://bumble.assammart.shop`,
    '/images': `http://jazz.assammart.shop/**`
}

const nuxtProdConfig = {
    host: '0.0.0.0',
    port: 8080,
    proxy: proxyArray
}

module.exports = nuxtProdConfig;
