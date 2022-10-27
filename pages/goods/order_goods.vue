<template>
<div id="order_goods" style="height: 100%;">
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">商品清单</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <div class="background-default space">
            <div v-for="shop in cartItems" :key="shop.shopId" class="radius-7 padding-default background-white mb-15">
                <div class="border-btm-3 pb-10" style="width: 100%;">
                    <b-row>
                        <img class="fl mt-2" src="../../assets/images/ico_shop_1.png" alt="" style="width: 17px; height: 15px;">
                        <div class="font-222-16 fl ml-2">{{ shop.shopName }}</div>
                    </b-row>
                </div>
                <div v-for="goods in shop.goods" :key="goods.id" class="padding-default border-btm-3">
                    <b-row>
                        <div class="col-xs-4">
                            <div class="pos-re">
                                <img class="prod-thumbnail" :data-src="goods.imgUri" alt="" src="" v-lazy-load />
                                <img class="pos-ab radius-right-top-7" v-show="goods.goodsIconUrl !== ''" :src="goods.goodsIconUrl" alt="" style="width: 40px; height: 40px; top: 0; right: 10%;">
                                <img v-show="goods.status === '0'" class="pos-ab" src="../../assets/images/ico_outside.png" alt="" style="width: 90%; left: 0; opacity: 0.7;">
                            </div>
                        </div>
                        <div class="col-xs-8">
                            <div class="font-222-14 title-width">{{ goods.name }}</div>
                            <div v-show="goods.sizeName !== ''" class="font-b8b8-12 title-width mt-3">{{ goods.sizeName }}</div>
                            <b-row class="mt-3">
                                <div class="col-xs-10">
                                    <div>
                                        <span class="font-cf00-12 font-weight">¥</span>
                                        <span class="font-cf00-14 font-weight" style="margin-left: -4px;">{{ goods.salesPrice | addComma }}</span>
                                        <span class="font-b8b8-13" style="margin-left: -3px;">/{{ goods.unit }}</span>
                                        <span v-show="goods.originalPrice !== 0" class="font-b8b8-13 text-through mt-5">¥{{ goods.originalPrice | addComma }}</span>
                                    </div>
                                </div>
                                <div class="col-xs-2">
                                    <div class="font-222-15 font-weight fr">x{{ goods.num }}</div>
                                </div>
                            </b-row>
                            <div class="mt-5" v-if="goods.eventStatus === '1'">
                                <div v-if="freeShippingStatus === '1'" class="free-price-item red" style="display: inline-block;">满 {{ freeShippingNeededPrice | addComma }} 包邮</div>
                                <div v-if="freePackageStatus === '1'" class="free-price-item green" style="display: inline-block;">满 {{ freePackageNeededPrice | addComma }} 免包装费</div>
                            </div>
                        </div>
                    </b-row>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    getDelivery
} from '@/api/order'

export default {
    name: "order_goods",
    head() {
        return {
            title: '商品清单'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, false)
        this.$nuxt.$emit('handleNoticeShow', false)

        this.paramCart = this.$route.query && this.$route.query.param
        this.deliveryId = this.$route.query && this.$route.query.deliveryid
        this.deliveryCompanyIndex = this.$route.query && this.$route.query.index
        this.kind = this.$route.query && this.$route.query.kind
    },
    mounted() {
        this.freeShippingStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeShippingStatus : '0'
        this.freeShippingNeededPrice = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeShippingNeededPrice : 0
        this.freePackageStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freePackageStatus : '0'
        this.freePackageNeededPrice = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freePackageNeededPrice : 0

        this.getDeliveryData()
    },
    data() {
        return {
            paramCart: '', // 장바구니페지에서 넘어오는 파라메터
            deliveryId: 0, // 배송아이디
            deliveryItems: [], // 택배배송회사애 따르는 주문상품배렬
            cartItems: [], // 장바구니에 담겨진 상품 배렬
            deliveryCompanyIndex: 0, // 택배배송회사주문상품배렬인덱스
            kind: '', // 무료배송/유료배송분류값
            freePackageStatus: '0',
            freePackageNeededPrice: 0,
            freeShippingStatus: '0',
            freeShippingNeededPrice: 0
        }
    },
    methods: {
        getDeliveryData() { // 배송에 의한 주문정보
            this.$nuxt.$emit('handleLoading', true)
            const query = {
                nums: this.paramCart,
                deliveryId: parseInt(this.deliveryId)
            }

            getDelivery(query).then(response => {
                if (response.res !== undefined) {
                    const icon = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).goodsIconBeans : ''
                    let icons = []

                    if (icon !== null && icon !== '') {
                        icons = icon.split(',')
                    }

                    response.res.data.cartItems.filter(res => {
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

                    response.res.data.cartItems.filter(shop => {
                        let shopInfo = {
                            shopId: shop.shopId,
                            shopName: shop.shopName
                        }
                        let tmpGoods = []

                        shop.goods.filter(goods => {
                            if (this.kind === 'delivery') { // 유료배송
                                response.res.data.deliveryItems[this.deliveryCompanyIndex].goodsImgs.filter(res => {
                                    if (goods.id === res.id) {
                                        tmpGoods.push(goods)
                                    }
                                })
                            } else if (this.kind === 'free') { // 무료배송
                                response.res.data.freeItems.goodsImgs.filter(res => {
                                    if (goods.id === res.id) {
                                        tmpGoods.push(goods)
                                    }
                                })
                            } else {
                                response.res.data.eventItems.goodsImgs.filter(res => {
                                    if (goods.id === res.id) {
                                        tmpGoods.push(goods)
                                    }
                                })
                            }
                        })

                        if (tmpGoods.length !== 0) {
                            shopInfo.goods = tmpGoods
                            this.cartItems.push(shopInfo)
                        }
                    })
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        }
    }
}
</script>

<style scoped>
.space {
    height: auto;
    padding: 65px 15px;
}
</style>
