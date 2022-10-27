<template>
<div id="delivery_status" ref="delivery_status" style="height: 100%;">
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">查看物流</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <div class="space background-white">
            <div class="padding-default border-btm-3">
                <div class="font-cf00-15 mb-11">{{ deliveryName }}</div>
                <b-row>
                    <div class="col-xs-10 pt-4">
                        <div class="font-5051-15">快递单号: {{ deliveryNo }}</div>
                    </div>
                    <div class="col-xs-2">
                        <div class="text-center font-222-13 btn_clipboard" @click="copyDeliveryNumber(deliveryNo)">复制</div>
                    </div>
                </b-row>
            </div>
            <div class="padding-default border-btm-3">
                <b-row>
                    <div class="col-xs-2" style="display: flex; align-items: center;">
                        <img src="../../../assets/images/ico_delivery_3.png" alt="" style="width: 21px; height: 19px;">
                    </div>
                    <div class="col-xs-10">
                        <div class="font-5051-15 mb-10">订单编号: {{ orderNo }}</div>
                        <div class="font-5051-15 title-width">收货地址: {{ address }}</div>
                    </div>
                </b-row>
            </div>
            <div class="padding-default">
                <b-row v-for="(item, index) in tracks" :key="index" class="mb-28">
                    <div class="col-xs-2">
                        <img v-if="index === 0" src="../../../assets/images/ico_point.png" alt="" style="width: 16px; height: 16px;">
                        <img v-else src="../../../assets/images/ico_point_disable.png" alt="" style="width: 16px; height: 16px;">
                        <div v-if="index !== tracks.length - 1" class="line ml-6" style="height: 118%;"></div>
                    </div>
                    <div class="col-xs-10">
                        <div class="mb-5" v-if="index === 0">
                            <div class="font-cf00-13 mb-5">{{ item.context }}</div>
                            <div class="font-cf00-11">{{ item.ftime }}</div>
                        </div>
                        <div class="mb-5" v-else>
                            <div class="font-222-13 mb-5">{{ item.context }}</div>
                            <div class="font-222-11">{{ item.time }}</div>
                        </div>
                    </div>
                </b-row>
            </div>
        </div>
    </div>
    <div class="btn_control">
        <div class="col-xs-12">
            <div class="btn-radius-ffcc fr" @click="setShowReceiveDialog">确认收货</div>
        </div>
    </div>
</div>
</template>

<script>
import {
    deliveryStatus,
    setReceive
} from '@/api/order'

export default {
    name: "delivery_status",
    components: {

    },
    head() {
        return {
            title: '查看物流'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, true)
        this.$nuxt.$emit('handleNoticeShow', false)

        // 수화요청인 경우
        this.$nuxt.$on('handleConfirmOrderReceive', () => {
            this.setReceiveOrder()
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('handleConfirmOrderReceive')
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()
        this.orderNo = this.$route.params && this.$route.query.orderno
        this.orderId = this.$route.params && this.$route.query.orderid
        this.deliveryNo = this.$route.params && this.$route.query.deliveryno

        this.getDeliveryData()
    },
    data() {
        return {
            orderId: 0, // 주문아이디
            orderNo: 0, // 주문번호
            deliveryNo: '', // 배송번호
            deliveryName: '', // 배송명
            address: '', // 배송주소
            tracks: [] // 배송상태 배렬
        }
    },
    methods: {
        getDeliveryData() {
            this.$nuxt.$emit('handleLoading', true)

            deliveryStatus(this.orderNo, this.deliveryNo).then(response => {
                if (response.res !== undefined) {
                    this.deliveryName = response.res.data.deliveryName
                    this.address = response.res.data.address
                    this.tracks = response.res.data.tracks
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        copyDeliveryNumber(number) { // 배송회사번호 복사
            this.$utility.clipboardCopy(number)
        },
        setReceiveOrder() {
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
        setShowReceiveDialog() {
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '是否要确认收货?', '', '否', '是', '', 'white', false, false, 'order_receive')
        }
    }
}
</script>

<style scoped>
.space {
    padding: 50px 0 70px 0;
    height: auto;
}

.line {
    background-color: #f5f6fd;
    width: 3px;
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
</style>
