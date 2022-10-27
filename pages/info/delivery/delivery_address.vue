<template>
<div id="delivery_address" ref="delivery_address" class="height_100">
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">收货地址</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <!-- 배송지가 없을 때 -->
        <div v-if="isDelivery === true" class="text-center">
            <div style="height: 150px;"></div>
            <img class="mb-23" src="../../../assets/images/ico_gps_2.png" alt="" style="width: 104px; height: 134px;">
            <div class="font-222-18">没有获取到地址信息</div>
        </div>
        <div v-else id="content" class="space">
            <div v-for="item in deliveryData" :key="item.id" class="mb-12 background-white" style="padding: 12px;">
                <b-row class="border-btm-3 pb-15 mb-15" @click="setChangeDeliveryAddress(item.id)">
                    <div class="col-xs-11">
                        <div class="font-222-15 mb-10">{{ item.userName }}，{{ item.phoneNum }}</div>
                        <div class="font-222-15 title-width">{{ item.province }} {{ item.city }} {{ item.country }} {{ item.address }} {{ item.houseNo }}</div>
                    </div>
                    <div class="col-xs-1" style="display: flex; align-items: center; justify-content: flex-end;">
                        <img src="../../../assets/images/ico_right_1.png" alt="" style="width: 6px; height: 10px;">
                    </div>
                </b-row>
                <b-row>
                    <div class="col-xs-9">
                        <div v-show="item.isDefault === '1'" class="font-white-14 fl" style="background-color: #afafaf; padding: 2px;">默认</div>
                    </div>
                    <div class="col-xs-3">
                        <b-row>
                            <div class="col-xs-6">
                                <div class="font-9292-15 fl" @click="setShowDeleteDialog(item.id)">删除</div>
                            </div>
                            <div class="col-xs-6">
                                <nuxt-link :to="'/info/delivery/delivery_info?deliveryid=' + item.id">
                                    <div class="font-9292-15 fr">修改</div>
                                </nuxt-link>
                            </div>
                        </b-row>
                    </div>
                </b-row>
            </div>
        </div>
        <nuxt-link v-show="isAddBtn === true" :to="'/info/delivery/delivery_info?deliveryid=0'">
            <div class="btn-radius mt-24 text-center font-weight" style="width: 238px;">+ 添加收货地址</div>
        </nuxt-link>
    </div>
</div>
</template>

<script>
import {
    getDelivery,
    setDeleteDelivery,
    setChangeAddress
} from '@/api/delivery'

export default {
    name: "delivery_address",
    components: {

    },
    head() {
        return {
            title: '收货地址'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, true)
        this.$nuxt.$emit('handleNoticeShow', false)

        // 배송지주소삭제요청인 경우
        this.$nuxt.$on('handleConfirmDeleteAddress', () => {
            this.setDeleteAddress()
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('handleConfirmDeleteAddress')
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()
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
        localStorage.removeItem('delivery_default')
        localStorage.removeItem('provinceName')
        localStorage.removeItem('cityName')
        localStorage.removeItem('countryName')

        this.getDeliveryData()
    },
    data() {
        return {
            isDelivery: false,
            deliveryId: 0, // 배송지아이디
            deliveryData: [], // 배송지 배렬
            isAddBtn: false
        }
    },
    methods: {
        getDeliveryData() { // 배송지 정보 얻기
            this.$nuxt.$emit('handleLoading', true)

            getDelivery().then(response => {
                if (response.res !== undefined) {
                    this.isDelivery = response.res.data.length === 0
                    this.deliveryData = response.res.data
                    this.isAddBtn = true
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setDeleteAddress() { // 배송지 삭제
            if (this.deliveryId !== 0) {
                if (this.deliveryData.length > 1) {
                    setDeleteDelivery(this.deliveryId).then(response => {
                        if (response.res !== undefined) {
                            this.getDeliveryData()
                        }
                    })
                } else {
                    this.$utility.showToast('该地址不能删除，只需编辑！')
                }
            }
        },
        setChangeDeliveryAddress(deliveryid) { // 배송지 변경
            const param = this.$route.query && this.$route.query.param

            if (param) { // 주문하기페지에서의 요청
                localStorage.setItem('deliveryid', deliveryid)

                if (this.$route.query.price) { // 장바구니페지에서의 요청
                    this.$router.replace('/goods/order?param=' + param + '&price=' + this.$route.query.price + '&weight=' + this.$route.query.weight)
                } else { // 주문하기 페지에서 요청
                    this.$router.go(-1)
                }
            } else { // 나의정보에서 요청
                const orderid = this.$route.params && this.$route.query.orderid

                if (orderid !== undefined) {
                    setChangeAddress(deliveryid, orderid).then(response => {
                        this.$router.go(-1)
                    })
                }
            }
        },
        setShowDeleteDialog(deliveryid) {
            this.deliveryId = deliveryid
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '确定要删除该地址吗?', '', '否', '是', '', 'white', false, false, 'delivery_delete')
        }
    }
}
</script>

<style scoped>
.space {
    padding-top: 50px;
    background-color: #f5f6fd;
    height: auto;
}

.height_100 {
    height: 100%;
}

.height_auto {
    height: auto;
}
</style>
