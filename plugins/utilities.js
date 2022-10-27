/**
 * 유틸리티 플러그인
 *
 */

import VueCookies from 'vue-cookies'
import Vue from 'vue'
import { nanoid } from 'nanoid'
import moment from 'moment'

const utilities = {
    /*
     * 쿠키 설정
     *
     * */
    setCookie(key, value) {
        VueCookies.set(key, value, '7d')
    },
    /*
     * 쿠키 얻기
     *
     * */
    getCookie(key) {
        return VueCookies.isKey(key) === true ? VueCookies.get(key) : ''
    },
    /*
     * 쿠키 삭제
     *
     * */
    removeCookie(key) {
        VueCookies.remove(key)
    },
    /*
     * 토스트 띄우기
     *
     * */
    showToast(msg) {
        Vue.toasted.show(msg, {
            theme: 'bubble',
            position: 'bottom-center',
            duration: 2000
        })
    },
    /*
     * 스크롤 맨우로 올리기
     *
     * */
    scrollToTop() {
        window.scrollTo(0, 0)
    },
    /*
     * 클립보드 복사
     *
     * */
    clipboardCopy(value) {
        const element = document.createElement('textarea')
        document.body.appendChild(element)
        element.value = value
        element.select()

        try {
            document.execCommand('copy')
            this.showToast('复制成功!')
        } catch (err) {
            console.log('copy failed')
        }

        document.body.removeChild(element)
    },
    /*
     * 위챗 네트워크 상태 확인
     *
     * */
    checkNetworkStatus() {
        let that = this

        if (typeof WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', () => {
                    WeixinJSBridge.invoke(
                        'getNetworkType', {},
                        function(e) { // response 결과값
                            localStorage.setItem('network_status', e.err_msg)
                        }
                    )
                }, false)
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', () => {
                    WeixinJSBridge.invoke(
                        'getNetworkType', {},
                        function(e) { // response 결과값
                            localStorage.setItem('network_status', e.err_msg)
                        }
                    )
                })
                document.attachEvent('onWeixinJSBridgeReady', () => {
                    WeixinJSBridge.invoke(
                        'getNetworkType', {},
                        function(e) { // response 결과값
                            localStorage.setItem('network_status', e.err_msg)
                        }
                    )
                })
            }
        } else {
            WeixinJSBridge.invoke(
                'getNetworkType', {},
                function(e) { // response 결과값
                    localStorage.setItem('network_status', e.err_msg)
                }
            )
        }
    },
    /*
     * 앱 탈퇴
     *
     * */
    exitApp() {
        if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
            WeixinJSBridge.call('closeWindow')
        } else {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', () => {
                    WeixinJSBridge.call('closeWindow')
                }, false)
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', () => {
                    WeixinJSBridge.call('closeWindow')
                })
            }
        }
    },
    /*
     * 위챗옵션메뉴 비로출(공유 등)
     *
     * */
    removeWechatOptionTool() {
        if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
            WeixinJSBridge.call('hideOptionMenu')
        } else {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', () => {
                    WeixinJSBridge.call('hideOptionMenu')
                }, false)
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', () => {
                    WeixinJSBridge.call('hideOptionMenu')
                })
            }
        }
    },
    /*
     * 위챗옵션메뉴 로출
     *
     * */
    addWechatOptionTool() {
        if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
            WeixinJSBridge.call('showOptionMenu')
        } else {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', () => {
                    WeixinJSBridge.call('showOptionMenu')
                }, false)
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', () => {
                    WeixinJSBridge.call('showOptionMenu')
                })
            }
        }
    },
    /*
     * 위챗폰트변경 금지
     *
     * */
    setDisableFontResize() {
        if (typeof WeixinJSBridge == 'object' && typeof WeixinJSBridge.invoke == 'function') {
            handleFontSize()
        } else {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', handleFontSize, false)
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', handleFontSize)
                document.attachEvent('onWeixinJSBridgeReady', handleFontSize)
            }
        }

        function handleFontSize() {
            // 设置网页字体为默认大小
            WeixinJSBridge.invoke('setFontSizeCallback', {
                    'fontSize': 0
                })
                // 重写设置网页字体大小的事件
            WeixinJSBridge.on('menu:setfont', function() {
                WeixinJSBridge.invoke('setFontSizeCallback', {
                    'fontSize': 0
                })
            })
        }
    },
    /*
     * 바이두 자동푸시스크립트
     *
     * */
    setPushBaiduScript() {
        (function() {
            var s = document.getElementsByTagName("script")[0]

            if (s.src.search('push.js') !== -1) {
                s.remove()
            }

            var bp = document.createElement('script')
            var curProtocol = window.location.protocol.split(':')[0]

            if (curProtocol === 'https') {
                bp.src = 'https://zz.bdstatic.com/linksubmit/push.js'
            } else {
                bp.src = 'http://push.zhanzhang.baidu.com/push.js'
            }

            var s = document.getElementsByTagName("script")[0]
            s.parentNode.insertBefore(bp, s)
        })()
    },
    /*
     * 쇼핑몰 쿠키 및 스토레이지정보 클리어
     *
     * */
    setAllClearCookieAndStorageData(kind) {
        if (kind === 'all') {
            localStorage.removeItem('load_main') // 메인뷰로딩상태값 클리어
            localStorage.removeItem('main_shop')
            localStorage.removeItem('pageMainCount')
        }

        localStorage.removeItem('load_type') // 카테고리뷰로딩상태값 클리어
        localStorage.removeItem('load_shop') // 점포로딩상태값 클리어
        localStorage.removeItem('load_search') // 검색결과로딩상태값 클리어
        localStorage.removeItem('load_favority') // 즐겨찾기로딩상태값 클리어
        localStorage.removeItem('load_history') // 최근본상품로딩상태값 클리어
        localStorage.removeItem('isRecommend') // 카테고리뷰에서 추천카테고리상태값 클리어
        localStorage.removeItem('type_pos') // 카테고리뷰에서 상품리스트 스크롤 위치값 클리어
        localStorage.removeItem('pageCount') // 상품리스트들에서 로딩한 페지수 클리어
        localStorage.removeItem('isViewKind') // 점포뷰에서 상품리스트 보임상태값 클리어
        localStorage.removeItem('typePageCount') // 분류페지에서 로딩한 페지수 클리어
        localStorage.removeItem('refresh_page')
        localStorage.removeItem('shop_even')
        localStorage.removeItem('shop_odd')
        localStorage.removeItem('type_list')
        localStorage.removeItem('subTypeData')
        localStorage.removeItem('shop_list')
        localStorage.removeItem('history_list')
        localStorage.removeItem('search_even')
        localStorage.removeItem('search_odd')
        localStorage.removeItem('order_product')
    },
    /*
     * 방문 ACCES ID 할당
     * 
     * */
    setVisitAccessId() {
        const todayDate = moment(new Date()).format('YYYY/MM/DD')
        const accessId = sessionStorage.getItem('visit_id')
        const compareDate = sessionStorage.getItem('visit_date')

        if (!accessId) {
            sessionStorage.setItem('visit_id', 'g' + nanoid(32))
            sessionStorage.setItem('visit_date', moment(new Date()).format('YYYY/MM/DD'))
        } else if (todayDate !== compareDate) {
            sessionStorage.setItem('visit_id', 'g' + nanoid(32))
            sessionStorage.setItem('visit_date', moment(new Date()).format('YYYY/MM/DD'))
        }
    }
}

export default ({ app }, inject) => {
    inject('utility', utilities)
}