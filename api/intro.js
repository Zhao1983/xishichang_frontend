import request from '@/utility/request'
import define from '@/utility/define'

/*
 * 쇼핑몰이용토큰 얻기
 *
 * */
export function getSiteTokenData(key) {
    return request({
        url: 'token?key=' + key,
        method: 'get'
    })
}

/*
 * 위쳇 공유
 *
 * */
export function getWechatData(url) {
    return request({
        url: '',
        method: 'get',
        baseURL: define.SHARE_URL + '?url=' + url
    })
}