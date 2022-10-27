import request from '@/utility/request'

/*
 * 읽지 않은 메세지 개수
 *
 * */
export function getMessageCount() {
    return request({
        url: 'msg/unreadNum',
        method: 'get'
    })
}

/*
 * 메세지 내용 얻기
 *
 * */
export function getMessage() {
    return request({
        url: 'msg',
        method: 'get'
    })
}

/*
 * 메세지 삭제
 *
 * */
export function deleteMessages() {
    return request({
        url: 'msg',
        method: 'delete'
    })
}

/*
 * 메세지 상태 선택
 *
 * */
export function setMessageStatus() {
    return request({
        url: 'msg',
        method: 'put'
    })
}