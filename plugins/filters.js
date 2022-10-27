/**
 * 필터 플러그인
 *
 */

import Vue from 'vue'
import { addComma } from "~/utility/utility"

Vue.filter('addComma', (value) => {
    return addComma(parseFloat(value))
})

Vue.filter('addCommaTwo', (value) => {
    return addComma(parseFloat(value).toFixed(2))
})