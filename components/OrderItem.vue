<template>
<div id="orderitem">
    <div class="padding-default background-white radius-7">
        <div v-if="orderStatus === 1 && refundDt === ''" class="font-cf00-14 text-right mb-5">待付款</div>
        <div v-else-if="(orderStatus === 2 || orderStatus === 7) && refundDt === ''" class="font-cf00-14 text-right mb-5">待发货</div>
        <div v-else-if="orderStatus === 3 && refundDt === ''" class="font-cf00-14 text-right mb-5">待收货</div>
        <div v-else-if="orderStatus === 4 && refundDt === ''" class="font-cf00-14 text-right mb-5">已取消</div>
        <div v-else-if="orderStatus === 5 && refundDt === ''" class="font-cf00-14 text-right mb-5">交易成功</div>
        <div v-else-if="orderStatus === 6 && refundDt === ''" class="font-cf00-14 text-right mb-5">部分发货</div>
        <div v-else-if="orderStatus === 8 && refundDt === ''" class="font-cf00-14 text-right mb-5">待自取</div>
        <div v-else-if="orderStatus === 9" class="font-cf00-14 text-right mb-5">已退款</div>
        <div v-for="shop in shops" :key="shop.shopId" class="mb-15">
            <div class="border-btm-3 pb-10" style="width: 100%;">
                <b-row>
                    <img class="fl mt-2" src="../assets/images/ico_shop_1.png" alt="" style="width: 13px; height: 11px;">
                    <div class="font-222-13 fl ml-2">{{ shop.shopName }}</div>
                </b-row>
            </div>
            <div v-for="prod in shop.goods" :key="prod.id" class="pt-15 pb-15 border-btm-3">
                <b-row>
                    <div class="col-xs-4">
                        <div class="pos-re">
                            <div v-if="viewKind === 'list'">
                                <div @click="redirectDetail">
                                    <img class="prod-thumbnail" :data-src="prod.imgUri" alt="" src="../assets/images/image_placeholder.png" v-lazy-load style="width: 90%;" />
                                </div>
                            </div>
                            <div v-else>
                                <nuxt-link :to="'/goods/goods_detail?shopid=' + shop.shopId + '&productid=' + prod.id">
                                    <img class="prod-thumbnail" :data-src="prod.imgUri" alt="" src="../assets/images/image_placeholder.png" v-lazy-load style="width: 90%;" />
                                </nuxt-link>
                            </div>
                            <img class="pos-ab radius-right-top-7" v-show="prod.goodsIconUrl !== ''" :src="prod.goodsIconUrl" alt="" style="width: 40px; height: 40px; top: 0; right: 10%;">
                        </div>
                    </div>
                    <div class="col-xs-8">
                        <div v-if="viewKind === 'list'">
                            <div @click="redirectDetail">
                                <div class="font-222-14 title-width">{{ prod.name }}</div>
                                <div v-show="prod.sizeName !== ''" class="font-b8b8-12 title-width mt-3">{{ prod.sizeName }}</div>
                                <b-row class="mt-3">
                                    <div class="col-xs-10">
                                        <div>
                                            <span class="font-cf00-12 font-weight">¥</span>
                                            <span class="font-cf00-14 font-weight" style="margin-left: -4px;">{{ prod.salesPrice | addComma }}</span>
                                            <span class="font-b8b8-13" style="margin-left: -3px;">/{{ prod.unit }}</span>
                                            <span v-show="prod.originalPrice !== 0" class="font-b8b8-13 text-through mt-5">¥{{ prod.originalPrice | addComma }}</span>
                                        </div>
                                    </div>
                                    <div class="col-xs-2">
                                        <div class="font-222-15 font-weight fr">x{{ prod.num }}</div>
                                    </div>
                                </b-row>
                            </div>
                        </div>
                        <div v-else>
                            <nuxt-link :to="'/goods/goods_detail?shopid=' + shop.shopId + '&productid=' + prod.id">
                                <div class="font-222-14 title-width">{{ prod.name }}</div>
                                <div v-show="prod.sizeName !== ''" class="font-b8b8-12 title-width mt-3">{{ prod.sizeName }}</div>
                                <div v-show="prod.originalPrice !== 0" class="font-b8b8-13 text-through mt-5">¥{{ prod.originalPrice | addComma }}</div>
                                <b-row>
                                    <div class="col-xs-10">
                                        <div>
                                            <span class="font-cf00-12 font-weight">¥</span>
                                            <span class="font-cf00-14 font-weight" style="margin-left: -4px;">{{ prod.salesPrice | addComma }}</span>
                                            <span class="font-b8b8-13" style="margin-left: -3px;">/{{ prod.unit }}</span>
                                        </div>
                                    </div>
                                    <div class="col-xs-2">
                                        <div class="font-222-15 font-weight fr">x{{ prod.num }}</div>
                                    </div>
                                </b-row>
                            </nuxt-link>
                        </div>
                    </div>
                </b-row>
            </div>
        </div>
        <!-- 주문상세일 때 -->
        <div v-show="viewKind === 'detail'">
            <!-- 직접주문이 아니라면 -->
            <b-row v-if="deliveryType !== 4" class="mb-15">
                <div class="col-xs-6">
                    <div class="font-222-15">包装费</div>
                </div>
                <div class="col-xs-6">
                    <div class="font-222-15 fr">￥{{ packagePrice | addComma }}</div>
                </div>
            </b-row>
            <!-- 직접주문이 아니라면 -->
            <div v-if="deliveryType !== 4" class="mb-15">
                <b-row>
                    <div class="col-xs-6">
                        <div class="font-222-15 fl">配送费</div>
                        <!-- 택배배송이면 -->
                        <div v-if="deliveryType === 2 || deliveryType === 5 || deliveryType === 1">
                            <img v-if="!isShowDeliveryInfo" class="fl ml-3 mt-1" src="../assets/images/ico_bottom_1.png" alt="" style="width: 15px; height: 15px;" @click="setDeliveryOptionHelp">
                            <img v-else class="fl ml-3 mt-1" src="../assets/images/ico_top_1.png" alt="" style="width: 15px; height: 15px;" @click="setDeliveryOptionHelp">
                        </div>
                        <!-- 배달이면 -->
                        <div v-if="deliveryType === 3">
                            <img class="fl ml-3 mt-1" src="../assets/images/ico_help.png" alt="" style="width: 13px; height: 13px;" @click="setShowHelp">
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <div v-if="totalDeliveryPrice > 0" class="font-222-15 fr">￥{{ totalDeliveryPrice | addComma }}</div>
                        <div v-else class="font-222-15 fr">免运费</div>
                    </div>
                </b-row>
                <div class="mt-5" v-show="isShowDeliveryInfo">
                    <b-row v-for="(item, index) in deliveries" :key="index" class="mb-5">
                        <div class="col-xs-8" style="display: flex; align-content: center; justify-content: flex-end;">
                            <div class="font-b3b3-14">{{ item.name }}</div>
                        </div>
                        <div class="col-xs-4" style="display: flex; align-content: center; justify-content: flex-end;">
                            <div v-if="item.price > 0" class="font-222-15 font-weight">¥{{ item.price | addComma }}</div>
                            <div v-else class="font-222-15 font-weight">免运费</div>
                        </div>
                    </b-row>
                </div>
            </div>
            <b-row class="mb-15">
                <div class="col-xs-6">
                    <div class="font-222-15">商品总额</div>
                </div>
                <div class="col-xs-6">
                    <div class="font-222-15 fr">￥{{ totalGoodsPrice | addComma }}</div>
                </div>
            </b-row>
        </div>
        <b-row>
            <div class="col-xs-12">
                <div class="fr font-cf00-15 font-weight">￥ {{ orderPrice | addComma }}</div>
                <div v-if="orderStatus === 1" class="fr font-222-15 font-weight">需付款:&nbsp;&nbsp;</div>
                <div v-else-if="orderStatus === 2 || orderStatus === 3 || orderStatus === 4 || orderStatus === 5 || orderStatus === 6 || orderStatus === 7 || orderStatus === 8" class="fr font-222-15 font-weight">订单总价:&nbsp;&nbsp;</div>
                <div v-else-if="orderStatus === 9" class="fr font-222-15 font-weight">退款:&nbsp;&nbsp;</div>
            </div>
        </b-row>
        <!-- 주문리스트일 때 -->
        <div v-show="viewKind === 'list'" class="mt-15">
            <!-- 미지불 -->
            <div v-show="orderStatus === 1" class="pt-15 border-top-3">
                <b-row>
                    <div class="col-xs-12">
                        <div class="btn-radius-ffcc fr ml-7" @click="setPayOrder">付款</div>
                        <div class="btn-border-bdbd fr" @click="setCancelOrder">取消订单</div>
                    </div>
                </b-row>
            </div>
            <!-- 수화대기 -->
            <div v-show="orderStatus === 3 && refundDt === '' && deliveryType !== 3 && deliveryType !== 4" class="pt-15 border-top-3">
                <b-row>
                    <div class="col-xs-12">
                        <div class="btn-radius-ffcc fr ml-7" @click="setReceiveOrder">确认收货</div>
                        <div class="btn-border-bdbd fr" @click="getDeliveryInfo">查看物流</div>
                    </div>
                </b-row>
            </div>
            <!-- 발송대기 -->
            <div v-show="orderStatus === 2 && refundDt === ''" class="pt-15 border-top-3">
                <b-row>
                    <div class="col-xs-12">
                        <div class="btn-border-bdbd fr" @click="setRefundOrder">退款</div>
                    </div>
                </b-row>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'OrderItem',
    props: {
        orderId: {
            type: Number,
            required: true
        },
        orderStatus: {
            type: Number,
            required: true
        },
        orderPrice: {
            type: Number,
            required: true
        },
        orderNumber: {
            type: String,
            required: true
        },
        shops: {
            type: Array,
            required: true
        },
        deliveries: {
            type: Array
        },
        viewKind: {
            type: String
        },
        deliveryType: {
            type: Number
        },
        isShowDeliveryInfo: {
            type: Boolean
        },
        totalDeliveryPrice: {
            type: Number
        },
        packagePrice: {
            type: Number
        },
        totalGoodsPrice: {
            type: Number
        },
        refundDt: {
            type: String
        },
        pageCount: {
            type: Number
        }
    },
    data() {
        return {}
    },
    methods: {
        setCancelOrder() {
            this.$nuxt.$emit('handleOrderCancel', this.orderId)
        },
        setRefundOrder() {
            this.$nuxt.$emit('handleRefundOrder', this.orderId)
        },
        setReceiveOrder() {
            this.$nuxt.$emit('handleOrderReceive', this.orderId)
        },
        setPayOrder() {
            this.$nuxt.$emit('handleOrderPay', this.orderNumber, this.orderId)
        },
        setDeliveryOptionHelp() {
            this.$nuxt.$emit('handleOptionHelp')
        },
        setShowHelp() {
            this.$nuxt.$emit('handleShowHelp')
        },
        getDeliveryInfo() {
            this.$nuxt.$emit('handleDeliveryInfo', this.orderId, this.orderNumber)
        },
        redirectDetail() {
            localStorage.setItem('refresh_page', this.pageCount)
            this.$router.push({
                path: '/info/order/order_detail?orderid=' + this.orderId
            })
        }
    }
}
</script>
