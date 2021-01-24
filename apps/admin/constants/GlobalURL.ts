import nuxtProdConfig from "~/proxy"

export const assetsURL = nuxtProdConfig.proxy["^/images"]
export const mainAPI = 'http://megatron.oihelp.net:5588'
