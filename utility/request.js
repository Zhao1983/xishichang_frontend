import axios from 'axios'
import define from '@/utility/define'
import Vue from 'vue'

const service = axios.create({
    baseURL: define.SERVER_URL, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

service.interceptors.request.use(
    config => {
        config.headers['token'] = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''
        config.headers['access-id'] = sessionStorage.getItem('visit_id') ? sessionStorage.getItem('visit_id') : ''
        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject('网络异常')
    }
)

service.interceptors.response.use(
    response => {
        const values = {
            'token': response.headers.token,
            'res': response.data
        }

        switch (response.status) {
            case 200:
            case 201:
            case 204:
                if (response.data.code === 503) {
                    return
                } else {
                    return values
                }
        }
    },
    error => {
        let messageData = ''

        if (error.response) {
            switch (error.response.status) {
                case 403:
                    window.location.replace('/user_warning?reason=' + error.response.data.msg)
                    return
                case 500:
                    messageData = '操作失败,错误编号:10002'

                    if (error.response.data) {
                        if (error.response.data.message !== undefined) {
                            messageData = error.response.data.message
                        } else if (error.response.data.msg !== undefined) {
                            messageData = error.response.data.msg
                        }
                    } else {
                        messageData = error.response.statusText
                    }
                    break
                case 400:
                    messageData = '操作失败,错误编号:10003'

                    if (error.response.data) {
                        if (error.response.data.message !== undefined) {
                            messageData = error.response.data.message
                        } else if (error.response.data.msg !== undefined) {
                            messageData = error.response.data.msg
                        }
                    } else {
                        messageData = error.response.statusText
                    }
                    break
                case 503:
                case 501:
                    window.location.replace('/inspect?reason=' + error.response.data.msg)
                    return
                case 401:
                    if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                        window.location.replace(define.AUTH_URL + '?id=0-0&type=main')
                    } else {
                        window.location.replace('/qr_view')
                    }
                    return
                case 404:
                    window.location.replace('/404?reason=' + error.response.data.msg)
                    return
                default:
                    if (error.response.data) {
                        if (error.response.data.message !== undefined) {
                            messageData = error.response.data.message
                        } else if (error.response.data.msg !== undefined) {
                            messageData = error.response.data.msg
                        }
                    } else {
                        messageData = error.response.statusText
                    }
                    break
            }
        } else {
            // messageData = '网络异常'
            messageData = ''
        }

        if (Vue.toasted) {
            Vue.toasted.show(messageData, {
                theme: 'bubble',
                position: 'bottom-center',
                duration: 4000
            })
        }

        return messageData
    }
)

export default service