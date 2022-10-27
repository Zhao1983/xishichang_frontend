import define from './utility/define'

export default {
    router: {
        middleware: 'router', // 미들웨어 라우팅 조종
    },
    head: {
        title: '延吉西市场官方商城',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { 'http-equiv': 'Content-Type', content: 'text/html', charset: 'utf-8' },
            { 'http-equiv': 'Content-Script-Type', content: 'text/javascript' },
            { 'http-equiv': 'Content-Style-Type', content: 'text/css' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
            { 'http-equiv': 'Pragma', content: 'no-cache' },
            { 'http-equiv': 'Cache-Control', content: 'no-cache' },
            { name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,viewport-fit=cover' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' },
            { name: 'apple-mobile-web-app-title', content: '延吉西市场官方商城' },
            { name: 'title', content: '延吉西市场官方商城' },
            { name: 'Description', content: '这里是延边特产集散地【延吉西市场】电商平台立足服务于西市场广大商户，为怀念家乡味道的延边人及全国游客朋友提供品类丰富物优价廉的网上购物渠道。' },
            { name: 'Keywords', content: '延吉西市场官方商城,延边,延吉,朝鲜族,西市场,延吉西市场,延边特产,朝鲜族饮食,辣白菜,泡菜,打糕,米肠,冷面,米酒,米糕,朝鲜,韩国,拌饭,明太鱼,牛板筋,咸菜,黄牛,长白山' },
            { name: 'robots', content: 'index,follow' },
            { name: 'author', content: '延吉市新西市场经营管理有限公司' },
            { name: 'copyright', content: 'https://yjxishi.com' },
            { property: 'og:title', content: '这里是延边特产集散地【延吉西市场】电商平台立足服务于西市场广大商户，为怀念家乡味道的延边人及全国游客朋友提供品类丰富物优价廉的网上购物渠道。' },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: 'https://yjxishi.com' },
            { property: 'og:image', content: 'https://yjxishi.com/static/logo.png' },
            { property: 'og:description', content: '延吉西市场官方商城 — 延边朝鲜族特产集散地' },
            { name: 'baidu-site-verification', content: 'code-zNHzIe8cCs' }
        ],
        link: [
            { rel: 'shortcut icon', type: 'image/png', href: '/favicon.png' }
        ],
        script: [
            { src: 'https://hm.baidu.com/hm.js?' + define.BAIDU_KEY } /*引入百度统计的js*/
        ]
    },

    css: [
        'bootstrap/dist/css/bootstrap.min.css',
        'bootstrap-vue/dist/bootstrap-vue.css',
        'swiper/css/swiper.css',
        'vodal/common.css',
        'vodal/zoom.css',
        './assets/css/common.css',
        './assets/css/parameters.css',
        './assets/css/custom.css'
    ],

    plugins: [
        { src: '@/plugins/plugins', mode: 'client' },
        { src: '@/plugins/swiper' },
        { src: '@/plugins/utilities' },
        { src: '@/plugins/filters' },
        { src: '@/plugins/weixin_sdk', mode: 'client' },
        { src: '@/plugins/baidu.js' }
    ],

    components: true,

    buildModules: [
        '@nuxtjs/moment'
    ],

    modules: [
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios', ['nuxt-lazy-load', {
            directiveOnly: true
        }]
    ],

    axios: {},

    build: {
        extend(config, ctx) {
            config.module.rules.push({
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                loader: 'url-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            })
        }
    },

    vue: {
        config: {
            ignoredElements: ['wx-open-launch-weapp']
        }
    },

    server: {
        port: define.PORT,
        host: define.BASE_URL // 로컬호스트
    },
    watchers: {
        webpack: {
            ignored: /node_modules/
        }
    }
}