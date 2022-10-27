import Vue from 'vue'
import define from '@/utility/define'

import Toasted from 'vue-toasted' // toast
import AMap from 'vue-amap'

AMap.initAMapApiLoader({
    // 高德key
    key: define.FRONT_MAP_KEY,
    plugin: ['AMap.Geolocation'],
    uiVersion: '1.0'
})

Vue.use(Toasted)
Vue.use(AMap)