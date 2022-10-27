import request from '@/utility/request'

/*
 * 배송주소 얻기
 *
 * */
export function getDelivery() {
    return request({
        url: 'delivery',
        method: 'get'
    })
}

/*
 * 배송주소 등록
 *
 * */
export function setRegisterDelivery(data) {
    return request({
        url: 'delivery',
        method: 'post',
        data
    })
}

/*
 * 배송주소 수정
 *
 * */
export function setUpdateDelivery(id, query) {
    return request({
        url: `delivery/${id}`,
        method: 'put',
        data: query
    })
}

/*
 * 배송주소 삭제
 *
 * */
export function setDeleteDelivery(id) {
    return request({
        url: `delivery/${id}`,
        method: 'delete'
    })
}

/*
 * 배송지 변경
 *
 * */
export function setChangeAddress(deliveryid, orderid) {
    return request({
        url: `orders/address/${orderid}?deliveryId=${deliveryid}`,
        method: 'put'
    })
}

/*
 * 배송지 디폴트 설정
 *
 * */
export function setDefaultAddress(deliveryid) {
    return request({
        url: `delivery/setDefault/${deliveryid}`,
        method: 'put'
    })
}