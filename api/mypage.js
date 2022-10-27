import request from '@/utility/request'

/*
 * 즐겨찾기 얻기
 *
 * */
export function getFavority() {
    return request({
        url: 'goodsCollections',
        method: 'get'
    })
}

/*
 * 즐겨찾기 삭제
 *
 * */
export function deleteFavority(data) {
    return request({
        url: 'goodsCollections',
        method: 'delete',
        data
    })
}

/*
 * 상품리력 데이터 얻기
 *
 * */
export function getHistory() {
    return request({
        url: 'goodsHistories',
        method: 'get'
    })
}

/*
 * 상품리력 데이터 삭제
 *
 * */
export function setDeleteHistory() {
    return request({
        url: 'goodsHistories',
        method: 'delete'
    })
}