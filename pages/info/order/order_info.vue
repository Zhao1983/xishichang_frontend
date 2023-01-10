<template>
<div id="order_info" ref="order_info" style="height: 100%;">
    <div class="back_overlay" v-show="isShowPhoneBound" @click="setCancelView('bound')"></div>
    <div class="back_overlay" v-show="isShowOverlayDelivery" @click="setCancelView('company')"></div>
    <div class="container">
        <div v-show="isShowOrderLimitTime" class="pos-fix" style="top: 0; width: 100%; height: 40px; background-color: #ffd87a; z-index: 100; display: flex; align-items: center; max-width: 500px; margin: 0 auto;">
            <b-row class="pl-10 pr-10">
                <img class="fl" src="../../../assets/images/ico_info_1.png" alt="" style="width: 15px; height: 15px;">
                <div class="order_info">如现在支付订单, 我们将在最近的工作时间内安排发货哟</div>
            </b-row>
        </div>
        <div class="background-white top_menu" :class="{active: isActiveSpace(isShowOrderLimitTime)}">
            <b-row>
                <div class="col-xs-3 text-center">
                    <div class="tab-menu pos-re" @click="setViewItem('all')" :class="{active: isActiveItem('all')}">全部</div>
                </div>
                <div class="col-xs-3 text-center">
                    <div class="tab-menu pos-re" @click="setViewItem('payment')" :class="{active: isActiveItem('payment')}">待付款
                        <div v-show="prePayOrderCnt !== 0" class="icon-cnt" style="top: 5px; right: -10px;">{{ prePayOrderCnt }}</div>
                    </div>
                </div>
                <div class="col-xs-3 text-center">
                    <div class="tab-menu pos-re" @click="setViewItem('sending')" :class="{active: isActiveItem('sending')}">待发货
                        <div v-show="preDeliveryOrderCnt !== 0" class="icon-cnt" style="top: 5px; right: -10px;">{{ preDeliveryOrderCnt }}</div>
                    </div>
                </div>
                <div class="col-xs-3 text-center">
                    <div class="tab-menu pos-re" @click="setViewItem('receive')" :class="{active: isActiveItem('receive')}">待收货
                        <div v-show="preReceiveOrderCnt !== 0" class="icon-cnt" style="top: 5px; right: -10px;">{{ preReceiveOrderCnt }}</div>
                    </div>
                </div>
            </b-row>
        </div>
        <div class="space" ref="content" :class="{active: isActiveSpace(isShowOrderLimitTime)}">
            <div v-show="isOrder">
                <div style="height: 150px;"></div>
                <div class="font-8787-16 text-center">您还没有相关的订单</div>
            </div>
            <div v-for="item in orderData" :key="item.id" class="mb-15">
                <OrderItem :orderId="item.id" :orderStatus="item.orderStatus" :orderPrice="item.orderPrice" :orderNumber="item.orderNo" :shops="item.shops" :viewKind="'list'" :refundDt="''" :pageCount="item.page" />
            </div>
            <b-row>
                <b-spinner v-show="loading" variant="primary" small label="Small Spinner" style="margin: 0 auto;"></b-spinner>
            </b-row>
        </div>
    </div>

    <!-- 배송종류선택(일반/항공) -->
    <div ref="company_content">
        <div class="company-tool" ref="company">
            <div class="padding-default">
                <b-row>
                    <div class="col-xs-11">
                        <div class="font-222-17 text-center">选择查看物流公司</div>
                    </div>
                    <div class="col-xs-1 text-right">
                        <img class="fr" src="../../../assets/images/ico_cancel_3.png" alt="" style="width: 17px; height: 17px;" @click="setCancelView('company')">
                    </div>
                </b-row>
                <div v-for="(item, index) in deliveryData" :key="index" class="padding-default border-btm-3">
                    <b-row>
                        <div class="col-xs-4">
                            <div class="font-222-15">{{ item.deliveryCompanyName }}</div>
                        </div>
                        <div class="col-xs-8">
                            <nuxt-link :to="'/info/delivery/delivery_status?orderid=' + orderId + '&deliveryno=' + item.deliveryNo + '&orderno=' + item.orderNo">
                                <div class="font-cf00-15 text-underline">{{ item.deliveryNo }}</div>
                            </nuxt-link>
                        </div>
                    </b-row>
                </div>
            </div>
        </div>
    </div>

    <!-- 폰번호인증다이얼로그 -->
    <div ref="phone_dialog" class="dialog-delivery" v-show="isShowPhoneBound">
        <div class="text-center font-222-16 border-btm-3 font-weight" style="padding: 14px; background-color: #ffcc33; border-top-left-radius: 10px; border-top-right-radius: 10px;">绑定手机</div>
        <div class="pl-15 pr-15">
            <div class="border-btm-3 pt-15 pb-8">
                <input id="phone" ref="phone" type="text" v-model="phone" inputmode="numeric" class="delivery-input" name="" value="" placeholder="请输入手机号" style="width: 100%;" @input="setValueData">
            </div>
            <b-row class="border-btm-3 pt-15 pb-7">
                <div class="col-xs-6">
                    <input id="authCode" ref="authCode" type="text" v-model="authCode" inputmode="numeric" class="delivery-input" name="" value="" placeholder="请输入验证码" style="width: 100%;" @input="setValueData">
                </div>
                <div class="col-xs-6 text-center">
                    <div v-if="isActiveCode === ''" class="btn_1 fr pt-7">获取验证码</div>
                    <div v-else-if="isActiveCode === 'active'" class="btn_1 fr pt-7 active" @click="setSendCode">获取验证码</div>
                    <div v-else-if="isActiveCode === 'submit'" class="btn_1 fr pt-7">{{ second }}s后重新发送</div>
                </div>
            </b-row>
        </div>
        <div class="text-center" style="padding: 25px;">
            <div v-if="!isActiveUpdate" class="btn_2">立即绑定</div>
            <div v-else class="btn_2 active" @click="setUpdatePhone">立即绑定</div>
        </div>
    </div>
</div>
</template>

<script>
import OrderItem from '@/components/OrderItem'

import {
    getProfile,
    getAuthCode,
    updatePhone
} from '@/api/profile'

import {
    getOrderNumber,
    getOrders,
    cancelOrder,
    setReceive,
    setPayment,
    getOrderDetail,
    getDeliveryInfo,
    refundOrder
} from '@/api/order'

export default {
    name: "order_info",
    components: {
        OrderItem
    },
    head() {
        return {
            title: '我的订单'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, true)
        this.$nuxt.$emit('handleNoticeShow', false)

        /*
         * (컴포넌트간 요청, 응답)
         *
         * */

        // 주문취소요청인 경우
        this.$nuxt.$on('handleOrderCancel', (orderId) => {
            this.setShowOrderCancelDialog(orderId)
        })

        this.$nuxt.$on('handleConfirmOrderCancel', () => {
            this.setCancelOrder()
        })

        // 환불요청인 경우
        this.$nuxt.$on('handleRefundOrder', (orderId) => {
            this.setShowRefundOrderDialog(orderId)
        })

        this.$nuxt.$on('handleConfirmRefundOrder', () => {
            this.setRefundOrder()
        })

        // 결제요청인 경우
        this.$nuxt.$on('handleOrderPay', (orderNumber, orderId) => {
            this.setPayOrder(orderNumber, orderId)
        })

        // 시장운영시간이 지나면 택배인 경우 주문여부요청이 오는 경우
        this.$nuxt.$on('handleOrderLimitTime', () => {
            this.setPayment()
        })

        // 수화요청인 경우
        this.$nuxt.$on('handleOrderReceive', (orderId) => {
            this.setShowOrderReceiveDialog(orderId)
        })

        this.$nuxt.$on('handleConfirmOrderReceive', () => {
            this.setReceiveOrder()
        })

        // 배송정보요청인 경우
        this.$nuxt.$on('handleDeliveryInfo', (orderId, orderNumber) => {
            this.getDeliveryInfo(orderId, orderNumber)
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('handleOrderCancel')
        this.$nuxt.$off('handleConfirmOrderCancel')
        this.$nuxt.$off('handleRefundOrder')
        this.$nuxt.$off('handleConfirmRefundOrder')
        this.$nuxt.$off('handleOrderPay')
        this.$nuxt.$off('handleOrderLimitTime')
        this.$nuxt.$off('handleOrderReceive')
        this.$nuxt.$off('handleConfirmOrderReceive')
        this.$nuxt.$off('handleDeliveryInfo')
        clearInterval(this.interval)
    },
    destroyed() {
        clearInterval(this.interval)
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()
        window.addEventListener('keyup', this.setFilterValue)
        window.addEventListener('scroll', this.setScrollValue)

        if (navigator.userAgent.match(/android/i)) {
            this.$nextTick(() => {
                if (this.$refs.phone_dialog) {
                    this.$refs.phone_dialog.style.marginLeft = '7.5%'
                }
            })
        } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.isPhone = false
            if (this.$refs.phone_dialog) {
                this.$refs.phone_dialog.style.marginLeft = '7.5%'
            }
        } else {
            if (this.$refs.phone_dialog) {
                this.$refs.phone_dialog.style.marginLeft = '1.5%'
            }
        }

        // 서시장 운영시간 설정(시작시간~마감시간)
        const startTime = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).starttime : '' // 서시장 운영시작시간
        const endTime = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).endtime.split(':') : '' // 서시장 운영마감시간
        const timeDelta = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).timedelta : '' // 운영시간 허용오차(마감시간 X시간전)
        const today = new Date() // 현재의 날자
        const todayDate = this.$moment(new Date()).format('YYYY/MM/DD') // 현재의 년,월,일
        const compareStartTime = new Date(todayDate + ' ' + startTime) // 서시장 운영시작시간 밀리초단위
        const compareEndTime = new Date(todayDate + ' ' + (parseInt(endTime[0]) - parseInt(timeDelta)) + ':' + endTime[1]) // 서시장 마감시간 밀리초단위

        // 현재의 시간이 서시장 운영시작시간보다 작거나 운영마감시간과 같거나 크다면 알림 띄우기
        if (today < compareStartTime || today >= compareEndTime) {
            this.isShowOrderLimitTime = true
        }

        // 주문상세페지에서 뒤로가기를 했을 때 상세페지로 가기전의 페지수가 존재한다면 그 페지수로 설정
        if (localStorage.getItem('pageCount') && localStorage.getItem('refresh_page')) {
            this.page = parseInt(localStorage.getItem('pageCount'))
        }

        // 주문상세페지에서 뒤로가기를 했을 때 미리 보관된 데이터를 리용하기
        if (localStorage.getItem('order_product') && localStorage.getItem('refresh_page') !== '') {
            let pos = 0
            const tmpData = JSON.parse(localStorage.getItem('order_product'))
            this.orderData = tmpData

            // 다시 서버에서 얻어야 할 배렬의 위치값 얻기
            tmpData.filter(res => {
                if (parseInt(res.page) === parseInt(localStorage.getItem('refresh_page'))) {
                    if (res.pos) {
                        pos = res.pos
                    }
                }
            })

            this.tempOrderPos = pos
            // 다시 서버에서 얻어야 할 주문정보를 해당 배렬에서 제외하기
            this.tempOrderData = tmpData.filter((res) => parseInt(res.page) !== parseInt(localStorage.getItem('refresh_page')))
        }

        this.activeItem = localStorage.getItem('route')
        this.getOrderNumber()
        this.getOrderData()
        this.getProfileData()
    },
    data() {
        return {
            isShowOrderLimitTime: false,
            isShowPhoneBound: false,
            isShowOverlayDelivery: false,
            isOrder: false, // 주문데이터 존재여부
            activeItem: '', // 주문상태
            allOrderCnt: 0, // 전체주문수
            prePayOrderCnt: 0, // 결제전주문수
            preDeliveryOrderCnt: 0, // 배송대기주문수
            preReceiveOrderCnt: 0, // 수화대기주문수
            orderData: [], // 주문 배렬
            tempOrderData: [],
            tempOrderPos: 0,
            orderId: 0, // 주문아이디
            orderNumber: '', // 주문번호
            scrollEvent: false,
            phoneBound: '', // 앱에 바운딩된 폰번호
            phone: '', // 바운딩을 할 폰번호
            authCode: '', // 인증코드
            interval: 0,
            second: 60,
            isActiveCode: '',
            isActiveUpdate: false,
            deliveryData: [], // 주문에 따르는 배송정보배렬
            loading: false,
            totalNum: 0, // 총 주문수
            totalPage: 1, // 총 페지수
            page: 1, // 페지수
            size: 10, // 표시되는 주문수
            isOrderCancel: false
        }
    },
    methods: {
        countTime() {
            this.second--

            if (this.second <= 0) {
                clearInterval(this.interval)
                this.authCode = ''
                this.isActiveCode = 'active'
                this.second = 60
                this.isActiveUpdate = false
            }
        },
        setFilterValue(element) {
            if (element.target.id === 'phone') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 11)
                this.phone = element.target.value
                this.isActiveCode = element.target.value.length === 11 ? 'active' : ''
                this.isActiveUpdate = element.target.value.length === 11 && this.authCode.length === 4
            }

            if (element.target.id === 'authCode') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 4)
                this.authCode = element.target.value
                this.isActiveUpdate = element.target.value.length === 4 && this.phone.length === 11
            }
        },
        setValueData() {
            if (this.isActiveCode !== 'submit') {
                this.isActiveCode = this.phone.length === 11 ? 'active' : ''
            }

            this.isActiveUpdate = this.phone.length === 11 && this.authCode.length === 4
        },
        setScrollValue() {
            if (window.scrollY > 0) {
                this.$nextTick(() => {
                    if (this.$refs.content) {
                        const scrollHeight = this.$refs.content.offsetHeight

                        if (this.scrollEvent) {
                            return
                        }

                        if (parseInt(window.scrollY) + 1 >= scrollHeight - window.outerHeight) {
                            this.scrollEvent = true
                            this.page += 1

                            if (this.page > this.totalPage) {
                                this.scrollEvent = false
                                return
                            }

                            this.loading = true
                            setTimeout(() => {
                                this.getOrderData()
                            }, 1000)
                        }
                    }
                })
            }
        },
        getProfileData() {
            this.$nuxt.$emit('handleLoading', true)

            getProfile().then(response => {
                if (response.res !== undefined) {
                    this.phoneBound = response.res.data.phone
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        getOrderNumber() { // 주문상태에 따르는 주문개수 얻기
            this.$nuxt.$emit('handleLoading', true)
            this.prePayOrderCnt = 0
            this.preDeliveryOrderCnt = 0
            this.preReceiveOrderCnt = 0
            this.allOrderCnt = 0

            getOrderNumber().then(response => {
                if (response.res !== undefined) {
                    response.res.data.filter(res => {
                        if (res.status === 1) { // 미지불
                            this.prePayOrderCnt = res.num
                            this.allOrderCnt += parseInt(res.num)
                        }

                        if (res.status === 2) { // 발송대기
                            this.preDeliveryOrderCnt = res.num
                            this.allOrderCnt += parseInt(res.num)
                        }

                        if (res.status === 3) { // 수화대기
                            this.preReceiveOrderCnt = res.num
                            this.allOrderCnt += parseInt(res.num)
                        }
                    })
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        getOrderData() { // 주문 정보 얻기
            this.$nuxt.$emit('handleLoading', !this.loading)
            let refCount = 0 // 주문상세페지에서 뒤로가기를 했을 때 다시 얻어야 할 페지수 설정
            let value = ''
            let existPage = ''

            if (this.isOrderCancel) {
                refCount = this.tempOrderPos
            } else {
                refCount = localStorage.getItem('refresh_page') ? parseInt(localStorage.getItem('refresh_page')) : this.page
            }

            switch (this.activeItem) {
                case 'payment': // 미지불
                    value = 'notPay'
                    break
                case 'sending': // 배송대기
                    value = 'ready'
                    break
                case 'receive': // 수화대기
                    value = 'dispatched'
                    break
            }

            const query = {
                status: value,
                page: refCount,
                size: this.size
            }

            getOrders(query).then(response => {
                if (response.res !== undefined) {
                    this.totalNum = response.res.data.totalNum
                    this.size = response.res.data.size
                    this.totalPage = response.res.data.totalNum % response.res.data.size === 0 ? response.res.data.totalNum / response.res.data.size : parseInt(response.res.data.totalNum / response.res.data.size) + 1
                    this.isOrder = response.res.data.list.length === 0
                    localStorage.setItem('pageCount', this.page)

                    if (response.res.data.list.length === 0 && value !== '') {
                        this.tempOrderData = []
                    }

                    const icon = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).goodsIconBeans : ''
                    let icons = []

                    if (icon !== null) {
                        icons = icon.split(',')
                    }

                    response.res.data.list.filter(res => {
                        res.shops.filter(shop => {
                            shop.goods.filter(prod => {
                                let exist = ''

                                icons.filter(icon => {
                                    const goodsIconName = icon.split('-')[0]
                                    const goodsIconUrl = icon.split('-')[1]

                                    if (prod.goodsIconName === goodsIconName && prod.goodsIconName !== '' && prod.goodsIconName !== null) {
                                        exist = goodsIconUrl
                                    }
                                })

                                prod.goodsIconUrl = exist
                            })
                        })

                        res.page = refCount
                    })

                    // 마이페지에서 들어왔을 때 정상적으로 데이터 추가
                    if (!localStorage.getItem('refresh_page')) {
                        // 주문취소를 진행하는 경우
                        if (this.isOrderCancel) {
                            let pos = 0
                            const tmpData = JSON.parse(localStorage.getItem('order_product'))
                            // 다시 서버에서 얻어야 할 배렬의 위치값 얻기
                            tmpData.filter(res => {
                                if (parseInt(res.page) === parseInt(refCount)) {
                                    if (res.pos) {
                                        pos = res.pos
                                    }
                                }
                            })
                            this.tempOrderData = tmpData.filter((res) => parseInt(res.page) !== parseInt(refCount)) // 다시 서버에서 얻어야 할 주문정보를 해당 배렬에서 제외하기
                            // 주문상세에서 뒤로가기를 했을 때 해당 주문상품이 속한 배렬을 원래의 배렬위치에 추가하기
                            response.res.data.list.filter((res, index) => {
                                this.tempOrderData.splice(parseInt(pos) + index, 0, res)
                            })
                        } else {
                            response.res.data.list.filter(res => {
                                this.tempOrderData.push(res)
                            })
                        }
                    } else {
                        // 주문상세에서 뒤로가기를 했을 때 해당 주문상품이 속한 배렬을 원래의 배렬위치에 추가하기
                        response.res.data.list.filter((res, index) => {
                            this.tempOrderData.splice(parseInt(this.tempOrderPos) + index, 0, res)
                        })
                    }

                    // 해당 주문상품이 속한 페지만 얻기 위해 배렬의 위치를 얻기
                    this.tempOrderData.filter((res, index) => {
                        if (existPage.search(res.page) === -1) {
                            res.pos = index
                            existPage += res.page + ','
                        }
                    })

                    this.orderData = this.tempOrderData
                    localStorage.setItem('order_product', JSON.stringify(this.orderData))
                }

                this.loading = false
                this.$nuxt.$emit('handleLoading', false)
                this.scrollEvent = false
                this.isOrderCancel = false
                localStorage.removeItem('refresh_page')
            })
        },
        setCancelOrder() { // 주문취소
            this.$nuxt.$emit('handleLoading', true)

            cancelOrder(this.orderId).then(response => {
                if (response.res !== undefined) {
                    this.isOrderCancel = true

                    this.tempOrderData.filter(res => {
                        if (res.id === this.orderId) {
                            this.tempOrderPos = res.page
                        }
                    })

                    this.getOrderNumber()
                    this.getOrderData()
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setRefundOrder() { // 환불요청
            this.$nuxt.$emit('handleLoading', true)

            refundOrder(this.orderId).then(response => {
                if (response.res !== undefined) {
                    if (response.res.code === 0) {
                        this.$utility.showToast('退款成功！')
                        this.getOrderNumber()
                        this.getOrderData()
                    } else {
                        this.$utility.showToast(response.res.msg)
                    }
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setReceiveOrder() { // 수화확인
            this.$nuxt.$emit('handleLoading', true)

            setReceive(this.orderId).then(response => {
                if (response.res !== undefined) {
                    this.$router.replace({
                        path: '/info/order/receive_complete'
                    })
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setPayOrder(orderNumber, orderId) { // 주문결제
            this.orderId = orderId
            this.orderNumber = orderNumber
            this.$nuxt.$emit('handleLoading', true)

            getOrderDetail(orderId).then(response => {
                if (response.res !== undefined) {
                    this.$nuxt.$emit('handleLoading', false)
                    const startTime = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).starttime : '' // 서시장 운영시작시간
                    const endTime = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).endtime.split(':') : '' // 서시장 운영마감시간

                    // 배달이면서 시장마감시간이 지났으면 결제여부 팝업 로출
                    if (response.res.data.deliveryType === 3 && this.isShowOrderLimitTime) {
                        this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '同城市场配送时间<br>(' + startTime + '~' + endTime + ')', '', '', '', '确认', 'white', true, true, '')
                        return
                    }

                    // 택배이면서 시장마감시간이 지났으면 결제여부 팝업 로출
                    if (response.res.data.deliveryType !== 3 && response.res.data.deliveryType !== 4 && this.isShowOrderLimitTime) {
                        this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '当前为西市场非营业时间<br>是否同意下一个工作日安排派送?', '', '放弃下单', '继续下单', '', 'white', false, false, 'order_limittime')
                        return
                    }

                    this.setPayment() // 위쳇 결제wh
                } else {
                    this.$nuxt.$emit('handleLoading', false)
                }
            })
        },
        setPayment() { // 결제하기
            if (this.phoneBound === '') {
                this.setShowPhoneBoundDialog()
                return
            }

            this.$nuxt.$emit('handleLoading', true)

            setPayment(this.orderNumber).then(response => {
                if (response.res !== undefined) {
                    if (typeof WeixinJSBridge === 'undefined') {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
                            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
                        }
                    } else {
                        setTimeout(() => {
                            this.onBridgeReady(response.res.data)
                        }, 500)
                    }
                } else {
                    this.$nuxt.$emit('handleLoading', false)
                }
            })
        },
        onBridgeReady(params) {
            let that = this

            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    'appId': params.appId,
                    'timeStamp': params.timeStamp.toString(),
                    'nonceStr': params.nonceStr,
                    'package': 'prepay_id=' + params.prepayId,
                    'signType': params.signType,
                    'paySign': params.paySign
                },
                function (res) { // response 결과값
                    that.$nuxt.$emit('handleLoading', false)

                    if (res.err_msg === 'get_brand_wcpay_request:ok') { // 결제완료
                        localStorage.setItem('orderNumber', that.orderNumber) // 결제성공 상태값 설정
                        localStorage.setItem('orderId', that.orderId) // 주문아이디 설정

                        that.$router.replace({
                            path: '/main'
                        })
                    } else if (res.err_msg === 'get_brand_wcpay_request:fail') { // 결제실패
                        that.$utility.showToast('支付失败')
                    } else if (res.err_msg === 'get_brand_wcpay_request:cancel') { // 결제취소
                        that.$utility.showToast('取消支付')
                    }
                }
            )
        },
        isActiveSpace(value) { // active 클라스 추가여부
            return value
        },
        isActiveItem(item) { // active 클라스 추가여부
            return this.activeItem === item
        },
        setViewItem(item) { // 주문상태별 정보 로출
            if (this.activeItem !== item) {
                this.activeItem = item
                localStorage.setItem('route', item)
                this.page = 1
                localStorage.removeItem('pageCount') // 상품리스트들에서 상품총페지수 클리어
                localStorage.removeItem('order_product')
                this.$utility.scrollToTop()
                this.tempOrderData = []
                this.getOrderData()
            }
        },
        setShowOrderReceiveDialog(orderId) { // 수화확인다이얼로그 로출
            this.orderId = orderId
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '是否要确认收货?', '', '否', '是', '', 'white', false, false, 'order_receive')
        },
        setShowOrderCancelDialog(orderId) { // 주문취소다이얼로그 로출
            this.orderId = orderId
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '是否要取消订单?', '', '否', '是', '', 'white', false, false, 'order_cancel')
        },
        setShowRefundOrderDialog(orderId) { // 환불요청다이얼로그 로출
            this.orderId = orderId
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '确定要退款吗?', '', '否', '是', '', 'white', false, false, 'refund_order')
        },
        setCancelView(index) { // 뷰들 닫기
            if (index === 'company') {
                this.isShowOverlayDelivery = false
                this.$nextTick(() => {
                    if (this.$refs.company) {
                        this.$refs.company.classList.toggle('collapsed')

                        if (this.$refs.company_content) {
                            const element = this.$refs.company_content.getElementsByClassName('company-tool')
                            element[0].setAttribute('style', 'height: 0px')
                        }
                    }
                })
            }

            if (index === 'bound') {
                this.isShowPhoneBound = false
                clearInterval(this.interval)
                this.second = 60
            }

            // 스크롤 허용
            this.$nextTick(() => {
                if (this.$refs.order_info) {
                    this.$refs.order_info.style.overflowY = 'visible'
                }
            })
        },
        setShowPhoneBoundDialog() {
            this.isShowPhoneBound = true
            this.phone = ''
            this.authCode = ''
            this.isActiveCode = ''
            this.isActiveUpdate = false

            this.$nextTick(() => {
                this.$refs.phone.focus()
            })

            // 스크롤 막기
            this.$nextTick(() => {
                if (this.$refs.order_info) {
                    this.$refs.order_info.style.overflowY = 'hidden'
                }
            })
        },
        setSendCode() { // 인증코드 받기
            this.$nuxt.$emit('handleLoading', true)

            getAuthCode(this.phone).then(response => {
                if (response.res !== undefined) {
                    this.code = response.res.data.value
                    this.isActiveCode = 'submit'
                    this.interval = setInterval(this.countTime, 1000)
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setUpdatePhone() { // 폰번호를 바인딩 한후에 결제진행
            if (this.code === this.authCode) {
                this.$nuxt.$emit('handleLoading', true)

                updatePhone(this.phone, this.authCode).then(() => {
                    this.$nuxt.$emit('handleLoading', false)
                    this.setCancelView('bound')
                    this.phoneBound = this.phone
                    this.setPayment()
                })
            } else {
                this.$utility.showToast('验证失败')
            }
        },
        setShowCompany() { // 배송종류선택(일반/항공)
            this.isShowOverlayDelivery = true
            this.$nextTick(() => {
                if (this.$refs.company) {
                    this.$refs.company.classList.toggle('collapsed')

                    if (this.$refs.company_content) {
                        const element = this.$refs.company_content.getElementsByClassName('collapsed')
                        element[0].setAttribute('style', 'height: ' + this.$refs.company.scrollHeight + 'px')
                    }
                }

                // 스크롤 막기
                if (this.$refs.order_info) {
                    this.$refs.order_info.style.overflowY = 'hidden'
                }
            })
        },
        getDeliveryInfo(orderid, ordernumber) {
            this.orderId = orderid
            this.orderNumber = ordernumber

            getDeliveryInfo(ordernumber).then(response => {
                if (response.res !== undefined) {
                    if (response.res.data !== null) {
                        if (response.res.data.length !== 0) {
                            let existStr = ''
                            this.deliveryData = []

                            response.res.data.filter(res => {
                                this.deliveryData.push(res)
                                existStr += res.deliveryCompanyName + ','
                            })

                            // 배송회사가 한개 이상이면 배송회사선택팝업 로출
                            if (this.deliveryData.length > 1) {
                                this.setShowCompany()
                            } else { // 아니면 배송상태확인페지로 리다이렉트
                                this.$router.push({
                                    path: '/info/delivery/delivery_status?orderid=' + this.orderId + '&deliveryno=' + this.deliveryData[0].deliveryNo + '&orderno=' + this.deliveryData[0].orderNo
                                })
                            }
                        }
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.top_menu {
    max-width: 500px;
    position: fixed;
    width: 100%;
    z-index: 100;
    top: 0;
    border-bottom: 1px solid #f1f2f6;
    margin: 0 auto;
}

.top_menu.active {
    top: 40px;
}

.space {
    padding: 62px 15px 15px 15px;
    height: auto;
    background-color: #f5f6fd;
}

.space.active {
    padding: 102px 15px 15px 15px;
}

.btn_1 {
    width: 102px;
    height: 29px;
    background-color: #f0f4f3;
    font-size: 13px;
    color: #bebebe;
    border-radius: 5px;
}

.btn_1.active {
    color: #222222;
    background-color: #ffcc33;
}

.btn_2 {
    border-radius: 30px;
    padding: 12px;
    background-color: #ededed;
    border: 1px solid #eaeaea;
    color: #8c8c8c;
    font-size: 16px;
    font-weight: bold;
}

.btn_2.active {
    border: 1px solid #ffcc33;
    color: #222222;
    background-color: #ffcc33;
    font-weight: bold;
}
</style>
