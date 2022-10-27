import request from "~/utility/request"
import VueCookies from "vue-cookies"

/*
 * 장바구니에 담긴 상품의 개수
 *
 * */
export function getCartCount() {
    return request({
        url: 'carts/num',
        method: 'get'
    })
}

/*
 * 장바구니에 담긴 상품개수 저장
 *
 * */
export function setCartCount(data) {
    return request({
        url: 'carts/num',
        method: 'put',
        data
    })
}

/*
 * 장바구니에 담긴 상품얻기
 *
 * */
export function getCartInfo() {
    return request({
        url: 'carts',
        method: 'get'
    })
}

/*
 * 장바구니에 상품 담기
 *
 * */
export function setAddCart(data) {
    return request({
        url: 'carts',
        method: 'post',
        data
    })
}

/*
 * 장바구니 상품삭제
 *
 * */
export function setDeleteCart(data) {
    return request({
        url: 'carts',
        method: 'delete',
        data
    })
}

/*
 * 장바구니 전체삭제
 *
 * */
export function setDeleteCartAll() {
    return request({
        url: 'carts/all',
        method: 'delete'
    })
}