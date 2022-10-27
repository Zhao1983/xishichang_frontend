<template>
<div id="order_detail" ref="order_detail" style="height: 100%;">
    <div class="back_overlay" v-if="isShowPhoneBound" @click="setCancelView('bound')"></div>
    <div class="back_overlay" v-else-if="isShowOverlay" @click="setCancelView('company')"></div>
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div v-if="orderStatus === 1 && refundDt === ''" class="font-222-18 pt-6 text-center">待支付</div>
                    <div v-else-if="(orderStatus === 2 || orderStatus === 7) && refundDt === ''" class="font-222-18 pt-6 text-center">待发货</div>
                    <div v-else-if="orderStatus === 3 && refundDt === ''" class="font-222-18 pt-6 text-center">待收货</div>
                    <div v-else-if="orderStatus === 4 && refundDt === ''" class="font-222-18 pt-6 text-center">已取消</div>
                    <div v-else-if="orderStatus === 5 && refundDt === ''" class="font-222-18 pt-6 text-center">交易成功</div>
                    <div v-else-if="orderStatus === 6 && refundDt === ''" class="font-222-18 pt-6 text-center">部分发货</div>
                    <div v-else-if="orderStatus === 8 && refundDt === ''" class="font-222-18 pt-6 text-center">待自取</div>
                    <div v-else-if="orderStatus === 9" class="font-222-18 pt-6 text-center">已退款</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <div v-show="isShowOrderLimitTime" class="pos-fix" style="top: 50px; width: 100%; height: 40px; background-color: #ffd87a; z-index: 100; display: flex; align-items: center; max-width: 500px; margin: 0 auto;">
            <b-row class="pl-10 pr-10">
                <img class="fl" src="../../../assets/images/ico_info_1.png" alt="" style="width: 15px; height: 15px;">
                <div class="order_info">如现在支付订单, 我们将在最近的工作时间内安排发货哟</div>
            </b-row>
        </div>
        <div class="space" :class="{active: isActiveSpace(isShowOrderLimitTime)}">
            <!-- 지불대기이면 주문시간 카운트 -->
            <div v-show="orderStatus === 1" class="font-5859-11 text-center mb-15">请您尽快完成支付，否则订单会自动取消!支付剩余时间: <span class="font-cf00-11">{{ countDate }}</span></div>
            <!-- 수화대기 혹은 주문완료일 때 로출(직접주문 제외) -->
            <div v-show="(orderStatus === 3 || orderStatus === 5) && deliveryType !== 4 && refundDt === ''" class="pt-15 pb-15 pl-8 pr-8 background-white radius-7 mb-15">
                <b-row v-show="orderStatus === 5">
                    <div class="col-xs-1" style="display: flex; align-items: center;">
                        <img v-if="deliveryType === 3" src="../../../assets/images/ico_delivery_2.png" alt="" style="width: 21px; height: 19px;">
                        <img v-else src="../../../assets/images/ico_delivery_1.png" alt="" style="width: 21px; height: 19px;">
                    </div>
                    <div class="col-xs-11">
                        <div class="font-01bd-14 mb-6 ml-3">已签收</div>
                        <div class="font-4e4e-15 mb-10 ml-3">{{ province }} {{ city }} {{ country }} {{ address }} {{ houseNo }}</div>
                        <div class="font-9292-12 ml-3">{{ doneDt }}</div>
                    </div>
                </b-row>
                <b-row v-show="orderStatus === 3 && deliveryType !== 4">
                    <div class="col-xs-1" style="display: flex; align-items: center;">
                        <img v-if="deliveryType === 3" src="../../../assets/images/ico_delivery_2.png" alt="" style="width: 21px; height: 19px;">
                        <img v-else src="../../../assets/images/ico_delivery_1.png" alt="" style="width: 21px; height: 19px;">
                    </div>
                    <div class="col-xs-10">
                        <div class="font-01bd-13 mb-10 ml-3">商家已发货，正在通知快递公司区间。</div>
                        <div class="font-9292-12 ml-3">{{ deliveryDt }}</div>
                    </div>
                    <div class="col-xs-1" style="display: flex; align-items: center; justify-content: flex-end;">
                        <img src="../../../assets/images/ico_right_2.png" alt="" style="width: 9px; height: 14px;">
                    </div>
                </b-row>
            </div>
            <div class="pt-15 pb-15 pl-8 pr-8 background-white radius-7 mb-15">
                <!-- 직접구매가 아니면 -->
                <b-row v-if="deliveryType !== 4">
                    <div class="col-xs-1" style="display: flex; align-items: center;">
                        <img src="../../../assets/images/ico_gps_1.png" alt="" style="width: 15px; height: 18px;">
                    </div>
                    <div class="col-xs-11">
                        <div class="font-4e4e-15 mb-10">{{ province }} {{ city }} {{ country }} {{ address }}</div>
                        <div class="font-4e4e-15">{{ userName }}先生 {{ userPhone }}</div>
                    </div>
                </b-row>
                <b-row v-else>
                    <div class="col-xs-1" style="display: flex; align-items: center;">
                        <img src="../../../assets/images/ico_gps_1.png" alt="" style="width: 15px; height: 18px;">
                    </div>
                    <div class="col-xs-11">
                        <div class="font-4e4e-15">延吉西市场一楼 电商服务台</div>
                        <div class="font-4e4e-15 mb-5">电话: 0433-265-1000</div>
                        <b-row>
                            <div class="col-xs-6">
                                <div class="font-b3b3-13 mb-5">自取时间</div>
                                <div class="font-222-13">{{ selfTime }}</div>
                            </div>
                            <div class="col-xs-6">
                                <div class="font-b3b3-13 mb-3">预留电话</div>
                                <div class="font-222-13">{{ userPhone }}</div>
                            </div>
                        </b-row>
                    </div>
                </b-row>
            </div>
            <OrderItem class="mb-15" :orderId="orderId" :orderStatus="orderStatus" :orderPrice="orderPrice" :orderNumber="orderNo" :shops="shopData" :viewKind="'detail'" :deliveries="useDeliveryCompany" :deliveryType="deliveryType" :isShowDeliveryInfo="isShowDeliveryInfo" :totalDeliveryPrice="totalDeliveryPrice" :packagePrice="packagePrice" :totalGoodsPrice="totalGoodsPrice" :refundDt="refundDt" />
            <div class="padding-default background-white radius-7">
                <b-row class="mb-15">
                    <div class="col-xs-10 pt-7">
                        <div class="font-9292-13">订单编号: {{ orderNo }}</div>
                    </div>
                    <div class="col-xs-2">
                        <div class="text-center font-222-14 btn_clipboard" @click="copyOrderNumber">复制</div>
                    </div>
                </b-row>
                <div class="font-9292-13">下单时间: {{ createDt }}</div>
                <!-- 환불인 경우 -->
                <div v-if="orderStatus === 9 || refundDt !== ''" class="font-9292-13 mt-15">退款时间: {{ refundDt }}</div>
                <!-- 주문취소인 경우 -->
                <div v-show="orderStatus === 4" class="font-9292-13 mt-15">取消时间: {{ cancelDt }}</div>
                <!-- 직접주문인 경우 -->
                <div v-show="deliveryType === 4" class="mt-15">
                    <b-row v-show="orderStatus === 3" class="mb-15">
                        <div class="col-xs-9 pt-7">
                            <div class="font-9292-13 mb-15">客服电话: deliveries[0].deliveryPhone }}</div>
                        </div>
                        <div class="col-xs-3">
                            <a :href="'tel:04332651000'">
                                <div class="text-center font-222-13 btn_clipboard">打电话</div>
                            </a>
                        </div>
                    </b-row>
                    <div class="font-9292-13">自取时间: {{ deliveryDt }}</div>
                </div>
                <!-- 수화대기인 경우 -->
                <div v-show="(orderStatus === 3 || orderStatus === 8) && refundDt === '' && deliveryType !== 4" class="mt-15">
                    <!-- 배송인 경우 -->
                    <div v-if="deliveryType !== 3">
                        <div class="font-9292-13 mb-15">发货时间: {{ deliveryDt }}</div>
                        <div v-for="(item, index) in useDeliveryCompany" :key="index" class="mb-15">
                            <div class="font-9292-13">物流公司: {{ item.name }}</div>
                            <b-row>
                                <div class="col-xs-10 pt-10">
                                    <div class="font-9292-13">快递单号: {{ item.no }}</div>
                                </div>
                                <div class="col-xs-2">
                                    <div class="text-center font-222-13 btn_clipboard" @click="copyDeliveryNumber(item.no)">复制</div>
                                </div>
                            </b-row>
                        </div>
                    </div>
                    <!-- 배달인 경우 -->
                    <div v-else>
                        <div class="font-9292-13 mb-15">发货时间: {{ deliveryDt }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-show="orderStatus === 1 || (orderStatus === 3 && refundDt === '') || (orderStatus === 2 && refundDt === '')" class="btn_control">
        <!-- 미지불 -->
        <b-row v-show="orderStatus === 1">
            <div class="col-xs-12">
                <div class="btn-radius-ffcc fr ml-7" @click="setPayOrder">付款</div>
                <div class="btn-border-bdbd fr" @click="setShowOrderCancelDialog">取消订单</div>
            </div>
        </b-row>
        <!-- 수화대기 -->
        <b-row v-show="orderStatus === 3 && refundDt === ''">
            <div class="col-xs-12">
                <div class="btn-radius-ffcc fr ml-7" @click="setShowOrderReceiveDialog">确认收货</div>
                <div class="btn-border-bdbd fr" @click="setShowCompany">查看物流</div>
            </div>
        </b-row>
        <!-- 환불요청 -->
        <b-row v-show="orderStatus === 2 && refundDt === ''">
            <div class="col-xs-12">
                <div class="btn-border-bdbd fr" @click="setShowRefundDialog">退款</div>
            </div>
        </b-row>
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
                <div v-show="deliveryType !== 3 && deliveryType !== 4">
                    <div v-for="(item, index) in useDeliveryCompany" :key="index" class="padding-default border-btm-3">
                        <b-row>
                            <div class="col-xs-4">
                                <div class="font-222-15">{{ item.name }}</div>
                            </div>
                            <div class="col-xs-8">
                                <nuxt-link :to="'/info/delivery/delivery_status?orderid=' + orderId + '&deliveryno=' + item.no + '&orderno=' + item.orderNo">
                                    <div class="font-cf00-15 text-underline">{{ item.no }}</div>
                                </nuxt-link>
                            </div>
                        </b-row>
                    </div>
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
                    <div v-else-if="isActiveCode === 'submit'" class="btn_1 fr pt-7">{{ secondAuth }}s后重新发送</div>
                </div>
            </b-row>
        </div>
        <div class="text-center" style="padding: 25px;">
            <div v-if="!isActiveUpdate" class="btn_2">立即绑定</div>
            <div v-else class="btn_2 active" @click="setUpdatePhone">立即绑定</div>
        </div>
    </div>

    <DeliveryInfo ref="help" :isShowOverlay="isShowHelp" :basicPrice="basicPrice" :totalStreet="totalStreet" :overStreet="overStreet" :overStreetPrice="overStreetPrice" :totalOverStreet="totalOverStreet" :totalOverStreetPrice="totalOverStreetPrice" :totalWeight="parseFloat(totalGoodsWeight)" :overWeight="overWeight" :overWeightPrice="overWeightPrice" :totalOverWeight="totalOverWeight" :totalOverWeightPrice="totalOverWeightPrice" :styles="styles" />
</div>
</template>

<script>
import OrderItem from '@/components/OrderItem'
import DeliveryInfo from '@/components/DeliveryInfo'
import {
    numberPad
} from "~/utility/utility"

import {
    getProfile,
    getAuthCode,
    updatePhone
} from '@/api/profile'

import {
    cancelOrder,
    setReceive,
    getOrderDetail,
    setPayment,
    refundOrder
} from '@/api/order'

export default {
    name: "order_detail",
    components: {
        OrderItem,
        DeliveryInfo
    },
    head() {
        return {
            title: this.title
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, true)
        this.$nuxt.$emit('handleNoticeShow', false)

        // 시장운영시간이 지나면 택배인 경우 주문여부요청이 오는 경우
        this.$nuxt.$on('handleOrderLimitTime', () => {
            this.setPayment()
        })

        // 주문취소요청인 경우
        this.$nuxt.$on('handleConfirmOrderCancel', () => {
            this.setCancelOrder()
        })

        // 환불요청인 경우
        this.$nuxt.$on('handleConfirmRefundOrder', () => {
            this.setRefundOrder()
        })

        this.$nuxt.$on('handleConfirmOrderReceive', () => {
            this.setReceiveOrder()
        })

        // 택배인 경우 택배항목 더보기 요청인 경우
        this.$nuxt.$on('handleOptionHelp', () => {
            this.setDeliveryOptionHelp()
        })

        // 택배/배달 세부정보 요청인 경우
        this.$nuxt.$on('handleShowHelp', () => {
            this.setShowHelp()
        })

        // 택배/배달 세부정보 닫기 요청인 경우
        this.$nuxt.$on('handleHelp', () => {
            this.setCancelView('help')
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('handleOrderLimitTime')
        this.$nuxt.$off('handleConfirmOrderCancel')
        this.$nuxt.$off('handleConfirmOrderReceive')
        this.$nuxt.$off('handleOptionHelp')
        this.$nuxt.$off('handleShowHelp')
        this.$nuxt.$off('handleHelp')
        clearInterval(this.interval)
        clearInterval(this.intervalAuth)
    },
    destroyed() {
        clearInterval(this.interval)
        clearInterval(this.intervalAuth)
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()
        window.addEventListener('keyup', this.setFilterValue)
        localStorage.setItem('load_order', 1)
        this.orderId = parseInt(this.$route.params && this.$route.query.orderid)

        if (navigator.userAgent.match(/android/i)) {
            this.$nextTick(() => {
                if (this.$refs.phone_dialog) {
                    this.$refs.phone_dialog.style.marginLeft = '7.5%'
                }
            })
        } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.isPhone = false
            this.$nextTick(() => {
                if (this.$refs.phone_dialog) {
                    this.$refs.phone_dialog.style.marginLeft = '7.5%'
                }
            })
        } else {
            this.$nextTick(() => {
                if (this.$refs.phone_dialog) {
                    this.$refs.phone_dialog.style.marginLeft = '1.5%'
                }
            })
        }

        /* 서시장 운영시간 설정(시작시간~마감시간) */
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

        this.getOrderData()
        this.getProfileData()
    },
    data() {
        return {
            title: '',
            isShowOrderLimitTime: false, // 시장운영시간여부
            isShowDeliveryInfo: false, // 택배배송일 때 구체적인 배송가격 로출 여부
            isShowHelp: false,
            isShowOverlay: false,
            isShowPhoneBound: false,
            isClicked: false,
            scrollEvent: false,
            isShowOtherMenu: true,
            orderId: 0, // 주문아이디
            userName: '', // 주문자명
            userPhone: '', // 주문자폰번호
            province: '', // 배송지 성명
            city: '', // 배송지 시명
            country: '', // 배송지 지역명
            address: '', // 배송지 상세주소
            houseNo: '', // 상세주소
            orderNo: '', // 주문번호
            payNo: '', // 결제번호
            createDt: '', // 주문날자
            expireDt: '', // 미결제일 때 주문취소되는 시간
            cancelDt: '', // 주문취소날자
            doneDt: '', // 주문완료날자
            refundDt: '', // 환불날자
            deliveryDt: '', // 배송날자
            deliveryType: 0, // 배송형태
            orderStatus: 0, // 주문상태
            orderPrice: 0, // 주문가격
            shopData: [], // 주문한 상품정보
            interval: 0,
            countDate: '00:00:00', // 주문마감시간
            selfTime: '', // 직접구매할 때 시장에서 주문물푼 가져가는 시간
            styles: {}, // 배송정보팝업 스타일 정의
            basicPrice: 0, // 배송총기본배송가격
            totalGoodsWeight: 0, // 주문상품총무게
            totalStreet: 0, // 총배달거리
            packagePrice: 0, // 포장금액
            totalGoodsPrice: 0, // 총주문상품금액
            totalStreet: 0, // 총배달거리
            deliveries: [], // 배송정보배렬
            totalDeliveryPrice: 0, // 총배송비
            useDeliveryCompany: [], // 주문상품의 배송회사배렬

            phoneBound: '', // 앱에 바운딩된 폰번호
            phone: '', // 바운딩을 할 폰번호
            authCode: '', // 인증코드
            intervalAuth: 0,
            secondAuth: 60,
            isActiveCode: '',
            isActiveUpdate: false,

            overStreet: 0, // 초과거리
            overStreetPrice: 0, // 초과된 거리에 따르는 가격
            totalOverStreet: 0, // 초과된 총거리
            totalOverStreetPrice: 0, // 초과된 총거리에 따르는 가격
            overWeight: 0, // 초과무게
            overWeightPrice: 0, // 초과무게에 따르는 가격
            totalOverWeight: 0, // 초과된 총무게
            totalOverWeightPrice: 0, // 초과된 총무게에 따르는 가격

            livingAirDeliveryNames: [],
            livingAirDeliveryNumbers: [],
            livingAirDeliveryPhone: '',
            freshAirDeliveryNames: [],
            freshAirDeliveryNumbers: [],
            freshAirDeliveryPhone: '',
            normalDeliveryNames: [], // 정상배송일 때 배송회사명
            normalDeliveryNumbers: [], // 정상배송일 때 배송번호
            normalDeliveryPhone: '', // 배달일 때 배달자 폰번호
            normalDeliveryPrice: 0, // 정상배송일 때 배송가격
            airDeliveryPrice: 0,
        }
    },
    methods: {
        countTimeAuth() {
            this.secondAuth--

            if (this.secondAuth <= 0) {
                clearInterval(this.intervalAuth)
                this.authCode = ''
                this.isActiveCode = 'active'
                this.secondAuth = 60
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
        getProfileData() {
            this.$nuxt.$emit('handleLoading', true)

            getProfile().then(response => {
                if (response.res !== undefined) {
                    this.phoneBound = response.res.data.phone
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        isActiveSpace(value) { // active 클라스 추가여부
            return value
        },
        countTime() {
            const second = 1000
            const minute = second * 60
            const hour = minute * 60
            const day = hour * 24

            const nowTime = new Date()
            const expireDate = this.expireDt.getTime() - nowTime.getTime()

            if (this.expireDt - nowTime <= 0) {
                clearInterval(this.interval)
                this.countDate = '00:00:00'
                this.setCancelOrder()
            } else {
                const hours = Math.floor((expireDate % day) / hour)
                const minutes = Math.floor((expireDate % hour) / minute)
                const seconds = Math.floor((expireDate % minute) / second)

                this.countDate = numberPad(hours, 2) + ':' + numberPad(minutes, 2) + ':' + numberPad(seconds, 2)
            }

            if (this.expireDt - nowTime <= 0) {
                clearInterval(this.interval)
                this.countDate = '00:00:00'
                this.setCancelOrder()
            } else {
                const hours = Math.floor((expireDate % day) / hour)
                const minutes = Math.floor((expireDate % hour) / minute)
                const seconds = Math.floor((expireDate % minute) / second)

                this.countDate = numberPad(hours, 2) + ':' + numberPad(minutes, 2) + ':' + numberPad(seconds, 2)
            }
        },
        getOrderData() { // 주문상세 정보 얻기
            this.$nuxt.$emit('handleLoading', true)

            getOrderDetail(this.orderId).then(response => {
                if (response.res !== undefined) {
                    if (response.res.data.orderStatus === 1 && response.res.data.refundDt === '') {
                        this.title = '待支付'
                    }

                    if (response.res.data.orderStatus === 2 && response.res.data.refundDt === '') {
                        this.title = '待发货'
                    }

                    if (response.res.data.orderStatus === 3 && response.res.data.refundDt === '') {
                        this.title = '待收货'
                    }

                    if (response.res.data.orderStatus === 4 && response.res.data.refundDt === '') {
                        this.title = '已取消'
                    }

                    if (response.res.data.orderStatus === 5 && response.res.data.refundDt === '') {
                        this.title = '已完成'
                    }

                    if (response.res.data.orderStatus === 6 && response.res.data.refundDt === '') {
                        this.title = '部分发货'
                    }

                    if (response.res.data.refundDt !== '') {
                        this.title = '已退款'
                    }

                    if (response.res.data.orderStatus === 8 && response.res.data.refundDt === '') {
                        this.title = '待自取'
                    }

                    this.userName = response.res.data.userName
                    this.userPhone = response.res.data.userPhone
                    this.province = response.res.data.province
                    this.city = response.res.data.city
                    this.country = response.res.data.country
                    this.address = response.res.data.address
                    this.houseNo = response.res.data.houseNo
                    this.orderNo = response.res.data.orderNo
                    this.payNo = response.res.data.payNo
                    this.createDt = response.res.data.createDt
                    this.expireDt = response.res.data.expireDt === null ? '' : new Date(response.res.data.expireDt.replace(/-/g, '/'))
                    this.cancelDt = response.res.data.cancelDt
                    this.doneDt = response.res.data.doneDt
                    this.refundDt = response.res.data.refundDt
                    this.deliveryDt = response.res.data.deliveryDt
                    this.deliveryType = response.res.data.deliveryType
                    this.orderStatus = response.res.data.orderStatus
                    this.orderPrice = response.res.data.orderPrice
                    this.shopData = response.res.data.shops
                    this.totalStreet = response.res.data.deliveryDistance

                    response.res.data.deliveries.filter(res => {
                        const value = {
                            deliveryName: res.deliveryName,
                            deliveryNo: res.deliveryNo,
                            deliveryPhone: res.deliveryPhone === null ? '' : res.deliveryPhone,
                            deliveryPrice: res.deliveryPrice,
                            deliveryWeight: res.deliveryWeight,
                            packagePrice: res.packagePrice,
                            orderNo: res.orderNo
                        }

                        this.deliveries.push(value)
                    })

                    const icon = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).goodsIconBeans : ''
                    let icons = []

                    if (icon !== null) {
                        icons = icon.split(',')
                    }

                    this.shopData.filter(res => {
                        res.goods.filter(prod => {
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

                    this.deliveries.filter(res => {
                        this.packagePrice += res.packagePrice
                        this.totalGoodsWeight += res.deliveryWeight
                        this.totalDeliveryPrice += res.deliveryPrice

                        // 배달 혹은 직접 주문이 아니라면
                        if (this.deliveryType !== 3 && this.deliveryType !== 4) {
                            let key = -1

                            this.useDeliveryCompany.filter((value, index) => {
                                res.deliveryName.split(',').filter(val => {
                                    if (value.name === val) {
                                        key = index
                                    }
                                })
                            })

                            if (key !== -1) {
                                this.useDeliveryCompany[key].price += res.deliveryPrice
                            } else {
                                res.deliveryName.split(',').filter((val, idx) => {
                                    const value = {
                                        name: val,
                                        price: res.deliveryPrice,
                                        no: res.deliveryNo.split(',')[idx],
                                        orderNo: res.orderNo
                                    }

                                    this.useDeliveryCompany.push(value)
                                })
                            }
                        }
                    })

                    if (response.res.data.shops !== null) {
                        response.res.data.shops.filter(res => {
                            res.goods.filter(val => {
                                if (val.salesPrice.toString().indexOf('.') !== -1) {
                                    const temp = val.salesPrice.toString().split('.')[1]

                                    if (temp.length === 1) {
                                        this.totalGoodsPrice = (parseInt(parseFloat(this.totalGoodsPrice) * 10) + (parseInt(parseFloat(val.salesPrice) * 10) * parseInt(val.num))) / 10
                                    } else if (temp.length === 2) {
                                        this.totalGoodsPrice = (parseInt(parseFloat(this.totalGoodsPrice) * 100) + (parseInt(parseFloat(val.salesPrice) * 10) * parseInt(val.num))) / 100
                                    }
                                } else {
                                    this.totalGoodsPrice += (val.salesPrice * val.num)
                                }
                            })
                        })
                    }

                    // 미지불이면 지불대기시간 카운팅
                    if (response.res.data.orderStatus === 1) {
                        this.interval = setInterval(this.countTime, 1000)
                    }

                    // 직접주문이면 도착시간 로출
                    if (response.res.data.deliveryType === 4) {
                        const temp = response.res.data.deliveryDt.split(' ')[1]
                        this.selfTime = temp.split(':')[0] + ':' + temp.split(':')[1]
                    }
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        copyOrderNumber() { // 주문번호 복사
            this.$utility.clipboardCopy(this.orderNo)
        },
        copyDeliveryNumber(number) { // 배송회사번호 복사
            this.$utility.clipboardCopy(number)
        },
        setPayOrder() { // 주문결제
            if (this.isClicked) {
                return
            }

            const startTime = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).starttime : '' // 서시장 운영시작시간
            const endTime = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).endtime.split(':') : '' // 서시장 운영마감시간

            // 배달이면서 시장마감시간이 지났으면 결제여부 팝업 로출
            if (this.deliveryType === 3 && this.isShowOrderLimitTime) {
                this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '同城市场配送时间<br>(' + startTime + '~' + endTime + ')', '', '', '', '确认', 'white', false, false, '')
                return
            }

            // 택배이면서 시장마감시간이 지났으면 결제여부 팝업 로출
            if (this.deliveryType !== 3 && this.deliveryType !== 4 && this.isShowOrderLimitTime) {
                this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '当前为西市场非营业时间<br>是否同意下一个工作日安排派送?', '', '放弃下单', '继续下单', '', 'white', false, false, 'order_limittime')
                return
            }

            this.setPayment()
        },
        setPayment() {
            if (this.phoneBound === '') {
                this.setShowPhoneBoundDialog()
                return
            }

            this.$nuxt.$emit('handleLoading', true)
            this.isClicked = true

            setPayment(this.orderNo).then(response => {
                if (response.res !== undefined) {
                    if (typeof WeixinJSBridge === 'undefined') {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
                            this.isClicked = false
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
                            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
                            this.isClicked = false
                        }
                    } else {
                        setTimeout(() => {
                            this.onBridgeReady(response.res.data)
                            this.isClicked = false
                        }, 500)
                    }
                } else {
                    this.$nuxt.$emit('handleLoading', false)
                    this.isClicked = false
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
                    that.isClicked = false

                    if (res.err_msg === 'get_brand_wcpay_request:ok') { // 결제완료
                        localStorage.setItem('orderNumber', that.orderNo) // 결제성공 상태값 설정
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
        setCancelOrder() { // 주문취소
            this.$nuxt.$emit('handleLoading', true)

            cancelOrder(this.orderId).then(response => {
                if (response.res !== undefined) {
                    this.$router.replace({
                        path: '/info/order/order_info'
                    })
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
                        setTimeout(() => {
                            this.$router.replace({
                                path: '/info/order/order_info'
                            })
                        }, 2100)
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
        setDeliveryOptionHelp() { // 택배일 때 택배팝업종류선택
            this.isShowDeliveryInfo = !this.isShowDeliveryInfo
        },
        setShowHelp() { // 배송정보팝업 로출
            this.isShowHelp = true
            this.$nextTick(() => {
                if (this.$refs.help) {
                    this.$refs.help.$refs.help.classList.toggle('collapsed')
                }
            })

            this.styles = {
                height: '418px'
            }
            this.basicPrice = this.deliveries[0].deliveryPrice

            // 스크롤 막기
            this.$nextTick(() => {
                if (this.$refs.order_detail) {
                    this.$refs.order_detail.style.overflowY = 'hidden'
                    this.$refs.order_detail.style.height = '100%'
                }
            })
        },
        setShowCompany() { // 배송종류선택
            if (this.useDeliveryCompany.length === 1) {
                this.$router.push({
                    path: '/info/delivery/delivery_status?orderid=' + this.orderId + '&deliveryno=' + this.useDeliveryCompany[0].no + '&orderno=' + this.useDeliveryCompany[0].orderNo
                })
                return
            }

            this.isShowOverlay = true
            this.$nextTick(() => {
                if (this.$refs.company) {
                    this.$refs.company.classList.toggle('collapsed')

                    if (this.$refs.company_content) {
                        const element = this.$refs.company_content.getElementsByClassName('collapsed')
                        element[0].setAttribute('style', 'height: ' + this.$refs.company.scrollHeight + 'px')
                    }
                }

                if (this.$refs.order_detail) {
                    // 스크롤 막기
                    this.$refs.order_detail.style.overflowY = 'hidden'
                    this.$refs.order_detail.style.height = '100%'
                }
            })
        },
        setCancelView(index) { // 모든 뷰 닫기
            if (index === 'bound') {
                this.isShowPhoneBound = false
                clearInterval(this.intervalAuth)
                this.secondAuth = 60

                // 스크롤 허용
                this.$nextTick(() => {
                    if (this.$refs.order_detail) {
                        this.$refs.order_detail.style.overflowY = 'visible'
                    }
                })
            }

            if (index === 'help') {
                this.isShowHelp = false
                this.styles = {
                    height: '0px'
                }

                this.$nextTick(() => {
                    if (this.$refs.help) {
                        this.$refs.help.$refs.help.classList.toggle('collapsed')
                    }

                    if (this.$refs.order_detail) {
                        // 스크롤 허용
                        this.$refs.order_detail.style.overflowY = 'visible'
                    }
                })
            }

            if (index === 'company') {
                this.isShowOverlay = false
                this.$nextTick(() => {
                    if (this.$refs.company) {
                        this.$refs.company.classList.toggle('collapsed')

                        if (this.$refs.company_content) {
                            const element = this.$refs.company_content.getElementsByClassName('company-tool')
                            element[0].setAttribute('style', 'height: 0px')
                        }
                    }

                    if (this.$refs.order_detail) {
                        // 스크롤 허용
                        this.$refs.order_detail.style.overflowY = 'visible'
                    }
                })
            }
        },
        goBack() {
            if (window.history.length === 1) {
                this.$router.replace({
                    path: '/main'
                })
            } else {
                this.$router.go(-1)
            }
        },
        setShowPhoneBoundDialog() {
            this.isShowPhoneBound = true
            this.phone = ''
            this.authCode = ''
            this.isActiveCode = ''
            this.isActiveUpdate = false

            this.$nextTick(() => {
                if (this.$refs.phone) {
                    this.$refs.phone.focus()
                }

                if (this.$refs.order_detail) {
                    // 스크롤 막기
                    this.$refs.order_detail.style.overflowY = 'hidden'
                }
            })
        },
        setSendCode() { // 인증코드 받기
            this.$nuxt.$emit('handleLoading', true)

            getAuthCode(this.phone).then(response => {
                if (response.res !== undefined) {
                    this.code = response.res.data.value
                    this.isActiveCode = 'submit'
                    this.intervalAuth = setInterval(this.countTimeAuth, 1000)
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
        setShowOrderCancelDialog() { // 주문취소다이얼로그 로출
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '是否要取消订单?', '', '否', '是', '', 'white', false, false, 'order_cancel')
        },
        setShowOrderReceiveDialog() { // 수화확인다이얼로그 로출
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '是否要确认收货?', '', '否', '是', '', 'white', false, false, 'order_receive')
        },
        setShowRefundDialog() { // 환불요청다이얼로그 로출
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '确定要退款吗?', '', '否', '是', '', 'white', false, false, 'refund_order')
        }
    }
}
</script>

<style scoped>
.space {
    padding: 65px 15px 70px 15px;
    height: auto;
    background-color: #f5f6fd;
}

.space.active {
    padding: 105px 15px 70px 15px;
}

.btn_clipboard {
    border: 1px solid #b0b0b0;
    border-radius: 20px;
    padding: 4px;
}

.btn_control {
    bottom: 0;
    width: 100%;
    background-color: #fff;
    z-index: 100;
    border-top: 1px solid #f1f2f6;
    padding: 15px;
    position: fixed;
    max-width: 500px;
    margin: 0 auto;
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
