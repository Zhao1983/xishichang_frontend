import request from '@/utility/request'

/*
 * 점포 상세 얻기
 *
 * */
export function getShopDetail(shopid) {
    if (process.client) {
        return request({
            url: `shops/${shopid}`,
            method: 'get'
        })
    } else {
        return request({
            url: `shops/${shopid}`,
            method: 'get'
        })
    }
}

/*
 * 점포에 따르는 상품 얻기
 *
 * */
export function getGoodsData(shopid, productid, query) {
    if (productid === 0) {
        return request({
            url: `shops/goods/${shopid}`,
            method: 'get',
            params: query
        })
    } else {
        return request({
            url: `shops/goods/${shopid}/${productid}`,
            method: 'get',
            params: query
        })
    }
}

/*
 * 점포 좋아요 추가/삭제
 *
 * */
export function setCollectionStatus(shopid) {
    return request({
        url: `/shopCollections/${shopid}`,
        method: 'post'
    })
}