import request from '@/utility/request'

/*
 * 상품 상세 얻기
 *
 * */
export function getGoodsDetail(productid) {
    return request({
        url: `goods/${productid}`,
        method: 'get'
    })
}

/*
 * 상품이 포함된 점포 정보 얻기
 *
 * */
export function getShops(shopid, productid) {
    if (process.client) {
        return request({
            url: `shops/${shopid}/${productid}`,
            method: 'get'
        })
    } else {
        return request({
            url: `shops/${shopid}/${productid}`,
            method: 'get'
        })
    }
}

/*
 * 상품 즐겨찾기에 추가/삭제
 *
 * */
export function setCollectionStatus(productid) {
    return request({
        url: `goodsCollections/${productid}`,
        method: 'post'
    })
}

/*
 * 검색하기
 *
 * */
export function getSearch(word) {
    if (process.client) {
        return request({
            url: 'goodsSearch',
            method: 'get',
            params: word
        })
    } else {
        return request({
            url: 'goodsSearch',
            method: 'get',
            params: word
        })
    }
}