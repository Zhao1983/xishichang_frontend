import request from '@/utility/request'

/*
 * 배너 데이터 얻기
 *
 * */
export function getBanners() {
    if (process.client) {
        return request({
            url: 'home/ads',
            method: 'get'
        })
    } else {
        return request({
            url: 'home/ads',
            method: 'get'
        })
    }
}

/*
 * 대분류 얻기
 *
 * */
export function getTypes() {
    return request({
        url: 'types',
        method: 'get'
    })
}

/*
 * 점포 얻기
 *
 * */
export function getShops(data) {
    return request({
        url: 'home/shops',
        method: 'get',
        params: data
    })
}