<template>
<div id="mypage" style="height: 100%;">
    <div class="container">
        <div class="pos-re">
            <img src="../../assets/images/mypage_top_bg.png" alt="" style="width: 100%; height: 150px; background-color: #f5f6fd;">
            <div class="pos-ab space padding-default">
                <div id="avatar" class="mb-20">
                    <b-row>
                        <nuxt-link :to="'/info/myinfo'">
                            <img v-if="userAvatar === ''" class="fl" src="../../assets/images/ico_avatar.png" alt="" style="width: 58px; height: 58px; border-radius: 50px;">
                            <img v-else class="fl" :src="userAvatar" alt="" style="width: 58px; height: 58px; border-radius: 50px;">
                            <div class="font-white-18 font-weight ml-10 pt-17 fl">{{ nickName }}</div>
                        </nuxt-link>
                    </b-row>
                </div>
                <div id="content" class="">
                    <div class="background-white radius-8 mb-15 padding-default">
                        <div class="font-222-15 font-weight mb-25">我的订单</div>
                        <b-row>
                            <div class="col-xs-3 text-center" @click="redirectOrder('payment')">
                                <img class="mb-8" src="../../assets/images/ico_payment.png" alt="" style="width: 39px; height: 30px;">
                                <div class="font-222-14">待付款</div>
                                <div v-show="payCount !== 0" class="icon-cont-1" style="top: -4px; left: 37px;">{{ payCount }}</div>
                            </div>
                            <div class="col-xs-3 text-center" @click="redirectOrder('sending')">
                                <img class="mb-8" src="../../assets/images/ico_send.png" alt="" style="width: 31px; height: 30px;">
                                <div class="font-222-14">待发货</div>
                                <div v-show="deliveryCount !== 0" class="icon-cont-1" style="top: -4px; left: 30px;">{{ deliveryCount }}</div>
                            </div>
                            <div class="col-xs-3 text-center" @click="redirectOrder('receive')">
                                <img class="mb-8" src="../../assets/images/ico_receive.png" alt="" style="width: 42px; height: 30px;">
                                <div class="font-222-14">待收货</div>
                                <div v-show="receiveCount !== 0" class="icon-cont-1" style="top: -4px; left: 37px;">{{ receiveCount }}</div>
                            </div>
                            <div class="col-xs-3 text-center" @click="redirectOrder('all')">
                                <img class="mb-8" src="../../assets/images/ico_order.png" alt="" style="width: 29px; height: 30px;">
                                <div class="font-222-14">全部订单</div>
                            </div>
                        </b-row>
                    </div>
                    <div class="background-white radius-8 padding-default">
                        <div class="font-222-15 font-weight mb-25">我的服务</div>
                        <b-row class="mb-28">
                            <div class="col-xs-3 text-center">
                                <nuxt-link :to="'/info/delivery/delivery_address'">
                                    <img class="mb-8" src="../../assets/images/ico_address.png" alt="" style="width: 30px; height: 33px;">
                                    <div class="font-222-14">收货地址</div>
                                </nuxt-link>
                            </div>
                            <div class="col-xs-3 text-center">
                                <nuxt-link :to="'/info/favority'">
                                    <img class="mb-8" src="../../assets/images/ico_favority_1.png" alt="" style="width: 31px; height: 33px;">
                                    <div class="font-222-14">收藏夹</div>
                                </nuxt-link>
                            </div>
                            <div class="col-xs-3 text-center">
                                <nuxt-link :to="'/info/history'">
                                    <img class="mb-8" src="../../assets/images/ico_history.png" alt="" style="width: 30px; height: 33px;">
                                    <div class="font-222-14">浏览历史</div>
                                </nuxt-link>
                            </div>
                            <div class="col-xs-3 text-center">
                                <nuxt-link :to="'/info/notice'">
                                    <img class="mb-8" src="../../assets/images/ico_alarm_1.png" alt="" style="width: 30px; height: 33px;">
                                    <div class="font-222-14">消息</div>
                                    <div v-show="messageCount !== 0" class="icon-cnt" style="top: -9px; left: 24px; margin: 0 auto;">{{ messageCount }}</div>
                                </nuxt-link>
                            </div>
                        </b-row>
                        <b-row>
                            <div class="col-xs-3 text-center">
                                <nuxt-link :to="'/info/help'">
                                    <img class="mb-8" src="../../assets/images/ico_help_1.png" alt="" style="width: 29px; height: 33px;">
                                    <div class="font-222-14">帮助中心</div>
                                </nuxt-link>
                            </div>
                            <div class="col-xs-3 text-center"></div>
                            <div class="col-xs-3 text-center"></div>
                            <div class="col-xs-3 text-center"></div>
                        </b-row>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="text-center font-222-12 pos-fix" style="bottom: 80px; width: 100%; max-width: 500px; margin: 0 auto;">ICP证: <a style="color: dodgerblue; text-decoration: underline;;" href="https://beian.miit.gov.cn/" target="_blank">吉ICP备20003633号-1</a></div>
</div>
</template>

<script>
import {
    getProfile
} from '@/api/profile'

import {
    getOrderNumber
} from '@/api/order'

import {
    getMessageCount
} from '@/api/notice' // 읽지 않은 메세지수를 얻는 API

export default {
    name: "mypage",
    components: {},
    head() {
        return {
            title: '我的信息'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', true)
        this.$nuxt.$emit('handleOtherMenu', false, false)
        this.$nuxt.$emit('handleNoticeShow', false)
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()

        // 쿠키정보 지우기
        localStorage.removeItem('provinceid')
        localStorage.removeItem('cityid')
        localStorage.removeItem('countryid')
        localStorage.removeItem('delivery_addr')
        localStorage.removeItem('delivery_addr_detail')
        localStorage.removeItem('delivery_houseno')
        localStorage.removeItem('delivery_username')
        localStorage.removeItem('delivery_phone')
        localStorage.removeItem('delivery_map')
        localStorage.removeItem('delivery_pos')
        localStorage.removeItem('load_favority')
        localStorage.removeItem('load_history')
        localStorage.removeItem('provinceName')
        localStorage.removeItem('cityName')
        localStorage.removeItem('countryName')
        localStorage.removeItem('pageCount') // 상품리스트들에서 상품총페지수 클리어
        localStorage.removeItem('refresh_page')
        localStorage.removeItem('order_product')
        this.getMessageCount()
        this.getProfileData()
        this.getOrderNumber()
    },
    data() {
        return {
            userId: 0, // 사용자아이디
            nickName: '', // 사영자명
            userAvatar: '', // 아바타이미지
            payCount: 0, // 미지불주문수
            deliveryCount: 0, // 수화대기주문수
            receiveCount: 0, // 수거대기주문수
            messageCount: 0, // 수신된 푸시개수
        }
    },
    methods: {
        getMessageCount() {
            getMessageCount().then(response => {
                if (response.res !== undefined) {
                    this.messageCount = response.res.data
                }
            })
        },
        getProfileData() { // 사용자프로필 얻기
            this.$nuxt.$emit('handleLoading', true)

            getProfile().then(response => {
                if (response.res !== undefined) {
                    this.userId = response.res.data.id
                    this.nickName = response.res.data.nick
                    this.userAvatar = response.res.data.avatar
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        getOrderNumber() {
            this.$nuxt.$emit('handleLoading', true)

            getOrderNumber().then(response => {
                if (response.res !== undefined) {
                    response.res.data.filter(res => {
                        if (res.status === 1) { // 미지불
                            this.payCount = res.num
                        }

                        if (res.status === 2) { // 수화대기
                            this.deliveryCount = res.num
                        }

                        if (res.status === 3) { // 수거대기
                            this.receiveCount = res.num
                        }
                    })
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        redirectOrder(route) {
            localStorage.setItem('route', route)
            this.$router.push({
                path: '/info/order/order_info'
            })
        }
    }
}
</script>

<style scoped>
.space {
    top: 10px;
    left: 0;
    right: 0;
}
</style>
