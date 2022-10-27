import request from '@/utility/request'
import define from '@/utility/define'

/*
 * 배송정보 얻기
 *
 * */
export function getDelivery(data) {
    return request({
        url: 'carts/selected/delivery',
        method: 'get',
        params: data
    })
}

/*
 * 매장에 와서 직접 구매하기
 *
 * */
export function getSelfShop(data) {
    return request({
        url: 'carts/selected/self',
        method: 'get',
        params: data
    })
}

/*
 * 배송으로 주문하기
 *
 * */
export function setOrderDelivery(data) {
    return request({
        url: 'orders/delivery',
        method: 'post',
        data
    })
}

/*
 * 시장에서 직접 주문하기
 *
 * */
export function setOrderSelf(data) {
    return request({
        url: 'orders/self',
        method: 'post',
        data
    })
}

/*
 * 주문상태별 주문개수 얻기
 *
 * */
export function getOrderNumber() {
    return request({
        url: 'orders/num',
        method: 'get'
    })
}

/*
 * 주문상태별 정보 얻기
 *
 * */
export function getOrders(data) {
    return request({
        url: 'orders',
        method: 'get',
        params: data
    })
}

/*
 * 주문취소
 *
 * */
export function cancelOrder(orderid) {
    return request({
        url: `orders/cancel/${orderid}`,
        method: 'put'
    })
}

/*
 * 환불요청
 * 
 * */
export function refundOrder(orderid) {
    return request({
        url: `orders/refund/${orderid}`,
        method: 'put'
    })
}

/*
 * 수화확인
 *
 * */
export function setReceive(orderid) {
    return request({
        url: `orders/done/${orderid}`,
        method: 'put'
    })
}

/*
 * 주문상세 정보 얻기
 *
 * */
export function getOrderDetail(orderid) {
    return request({
        url: `orders/${orderid}`,
        method: 'get'
    })
}

/*
 * 결제하기
 *
 * */
export function setPayment(ordernumber) {
    return request({
        url: 'toWxPay?orderNo=' + ordernumber,
        method: 'get',
        baseURL: define.PAY_URL
    })
}

/*
 * 결제취소
 *
 * */
export function cancelPay(ordernumber) {
    return request({
        url: `orders/payCancel/${ordernumber}`,
        method: 'put'
    })
}

/*
 * 주문상태 확인
 *
 * */
export function getOrderStatus(ordernumber) {
    return request({
        url: `orders/status/${ordernumber}`,
        method: 'get'
    })
}

/*
 * 배송상태확인
 *
 * */
export function deliveryStatus(ordernumber, deliverynumber) {
    return request({
        url: `orders/delivery/${ordernumber}/${deliverynumber}`,
        method: 'get'
    })
}

/*
 * 해당 주문에 따르는 배송정보 얻기
 *
 * */
export function getDeliveryInfo(ordernumber) {
    return request({
        url: `orders/deliveries/${ordernumber}`,
        method: 'get'
    })
}