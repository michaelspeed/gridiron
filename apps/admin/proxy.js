const host = '0.0.0.0'

const proxyArray = {
    '^/admin-api': `http://${host}:5588/admin-api/`,
    '^/shop-api': `http://${host}:5588/shop-api/`,
    '^/controllers': `http://${host}:5588/`,
    '^/images': `http://${host}:5002/`
}

const nuxtProdConfig = {
    host: '0.0.0.0',
    port: 8080,
    proxy: proxyArray
}

module.exports = nuxtProdConfig;