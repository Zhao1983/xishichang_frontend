import request from '@/utility/request'

/*
 * 대분류 얻기
 *
 * */
export function getType() {
    if (process.client) {
        return request({
            url: 'types',
            method: 'get'
        })
    } else {
        return request({
            url: 'types',
            method: 'get'
        })
    }
}

/*
 * 대분류에 따르는 소분류얻기
 *
 * */
export function getSubType(id) {
    return request({
        url: `types/${id}`,
        method: 'get'
    })
}

/*
 * 분류에 따르는 상품 얻기
 *
 * */
export function getGoods(id, recommend, query) {
    return request({
        url: `types/${id}/${recommend}`,
        method: 'get',
        params: query
    })
}