<template>
<div id="cart" ref="cart" class="height_100">
    <div class="container" :style="isCart ? 'background-color: #fff;' : ''">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="goBack" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-7">
                    <div class="font-222-18 pt-6 text-center" style="margin-left: 20%;">购物车</div>
                </div>
                <div class="col-xs-3">
                    <div v-show="isCart === false" class="font-222-17 fl pt-7" @click="setShowDialog('all')">清空</div>
                    <div v-if="isShowEdit === false" class="font-222-17 pt-7 fr" @click="setEdit">编辑</div>
                    <div v-else class="font-222-17 pt-7 fr" @click="setEdit">完成</div>
                </div>
            </b-row>
        </div>
        <!-- 장바구니 비여있을 때 -->
        <div v-if="isCart" class="text-center">
            <div style="height: 150px;"></div>
            <img class="mb-23" src="../../assets/images/ico_cart_back.png" alt="" style="width: 81px; height: 81px;">
            <div class="font-222-18 mb-12">购物车空空如也</div>
            <div class="font-b3b3-12">赶紧挑一些中意的商品吧</div>
            <div style="height: 74px;"></div>
            <nuxt-link :to="'/main'">
                <div class="btn-radius">逛一逛</div>
            </nuxt-link>
        </div>
        <!-- 장바구니 내용 -->
        <div v-else class="background-default space">
            <!-- 장바구니 알림 내용 -->
            <div v-if="freeStatus === '1'" class="background-white padding-default radius-7 mb-15">
                <div style="display: flex; align-items: center;">
                    <div style="width: 16.6%; height: 23px; display: flex; align-items: center; justify-content: center; border-radius: 20px; background-color: #4aaa35;">
                        <p class="font-white-13">活动</p>
                    </div>
                    <div class="pl-5" style="width: 83.33%;">
                        <p class="font-222-14">全场满39元可免运费 (同城:重量15kg 距离2 km以内;外地:冷鲜商品除外)</p>
                    </div>
                </div>
                <b-row>
                    <div class="col-xs-1">
                        <img src="../../assets/images/ico_speaker.png" alt="" style="width: 14px; height: 14px;">
                    </div>
                    <div class="col-xs-11 pt-5">
                        <marquee-text class="font-ffb7-12" :duration="10" :repeat="3">请慎重选购商品,超过15kg延吉市内可能无法配送。</marquee-text>
                    </div>
                </b-row>
            </div>
            <!-- 무료배송상태 알림 -->
            <div v-if="freeShippingStatus === '1'" class="background-white padding-default radius-7 mb-15" style="display: flex; align-items: center;">
                <div style="display: flex; align-items: center; justify-content: center; border-radius: 20px; height: 23px; border: 1px solid #4aaa35;">
                    <p class="pl-6 pr-6" style="color: #4aaa35; font-size: 12px;">免运费活动</p>
                </div>
                <p class="font-222-14 pl-6">活动商品满 {{ freeShippingNeededPrice | addComma }} 元免运费</p>
            </div>
            <!-- 장바구니 상품 -->
            <div v-for="(item, index) in cartItems" :key="item.shopId" class="background-white padding-default radius-7 mb-15">
                <b-row>
                    <div class="col-xs-1">
                        <input :id="'check-shop-' + index" v-model="item.checked" class="radius-checkbox" type="checkbox" name="" @click="setShop(item.shopId)">
                        <label :for="'check-shop-' + index"></label>
                    </div>
                    <div class="col-xs-11 pl-5">
                        <b-row>
                            <div class="border-btm-3 pb-10" style="width: 100%;">
                                <img class="fl mt-2" src="../../assets/images/ico_shop_1.png" alt="" style="width: 17px; height: 15px;">
                                <div class="font-222-16 font-weight fl ml-2 pt-1">{{ item.shopName }}</div>
                                <img class="fl mt-5 ml-4" src="../../assets/images/ico_right_1.png" alt="" style="width: 8px; height: 11px;">
                            </div>
                        </b-row>
                    </div>
                </b-row>
                <b-row v-for="(prod, idx) in item.goods" :key="prod.id">
                    <div class="col-xs-1 align-center">
                        <div v-if="prod.status === '1'">
                            <input :id="'check-prod-' + index + '-' + idx" class="radius-checkbox" type="checkbox" v-model="prod.checked" name="" value="" @click="setGoods(item.shopId, prod.id)">
                            <label :for="'check-prod-' + index + '-' + idx"></label>
                        </div>
                        <div v-else-if="isShowEdit">
                            <input :id="'check-prod-' + index + '-' + idx" class="radius-checkbox" type="checkbox" v-model="prod.checked" name="" value="" @click="setGoods(item.shopId, prod.id)">
                            <label :for="'check-prod-' + index + '-' + idx"></label>
                        </div>
                    </div>
                    <div class="col-xs-11 pl-5 pt-15">
                        <b-row class="border-btm-3 pb-15">
                            <div class="col-xs-4" @click="redirectGoodsDetail(item.shopId, prod.goodsId)">
                                <div class="pos-re">
                                    <img class="prod-thumbnail" :data-src="prod.imgUri" alt="" src="" v-lazy-load />
                                    <img class="pos-ab radius-right-top-7" v-show="prod.goodsIconUrl !== ''" :src="prod.goodsIconUrl" alt="" style="width: 40px; height: 40px; top: 0; right: 10%;">
                                    <img v-show="prod.status === '0'" class="pos-ab" src="../../assets/images/ico_outside.png" alt="" style="width: 90%; left: 0; opacity: 0.7;">
                                </div>
                            </div>
                            <div class="col-xs-8">
                                <div class="font-222-14 title-width" @click="redirectGoodsDetail(item.shopId, prod.goodsId)">{{ prod.name }}</div>
                                <div v-show="prod.sizeName !== ''" class="font-b8b8-12 title-width mt-3" @click="redirectGoodsDetail(item.shopId, prod.goodsId)">{{ prod.sizeName }}</div>
                                <b-row class="mt-3" style="display: flex; align-items: center;">
                                    <div class="col-xs-7" @click="redirectGoodsDetail(item.shopId, prod.goodsId)">
                                        <div v-show="prod.originalPrice !== 0" class="font-b8b8-13 text-through">¥{{ prod.originalPrice | addComma }}</div>
                                        <div>
                                            <span class="font-cf00-14 font-weight">¥</span>
                                            <span class="font-cf00-16 font-weight" style="margin-left: -4px;">{{ prod.salesPrice | addComma }}</span>
                                            <span class="font-b8b8-14" style="margin-left: -3px;">/{{ prod.unit }}</span>
                                        </div>
                                    </div>
                                    <div class="col-xs-5">
                                        <div v-show="isShowEdit === false && prod.status === '1'">
                                            <div class="font-222-12 text-center pb-2">{{ prod.weight | addCommaTwo }}kg</div>
                                            <div class="count-quantity">
                                                <b-row>
                                                    <div class="minus" @click="setMinuse(item.shopId, prod.id, prod.num)">
                                                        <img src="../../assets/images/ico_minus.png" alt="" style="width: 10px; height: 1px;">
                                                    </div>
                                                    <div class="number">
                                                        <input class="number-input" :data-shopid="item.shopId" :data-cartid="prod.id" :id="'number-' + item.shopId + '-' + prod.id" type="text" v-model="prod.num" inputmode="numeric" name="" value="" @input="setNumberValue">
                                                    </div>
                                                    <div class="plus" @click="setPlus(item.shopId, prod.id, prod.num)">
                                                        <img src="../../assets/images/ico_plus.png" alt="" style="width: 10px; height: 10px;">
                                                    </div>
                                                </b-row>
                                            </div>
                                        </div>
                                    </div>
                                </b-row>
                                <div class="mt-5" v-if="prod.eventStatus === '1'">
                                    <div v-if="freeShippingNeededPrice !== 0" class="free-price-item red" style="display: inline-block;">满 {{ freeShippingNeededPrice | addComma }} 包邮</div>
                                    <div v-if="freePackageNeededPrice !== 0" class="free-price-item green" style="display: inline-block;">满 {{ freePackageNeededPrice | addComma }} 免包装费</div>
                                </div>
                            </div>
                        </b-row>
                    </div>
                </b-row>
            </div>
            <div class="text-center font-222-12 pt-10">ICP证: <a style="color: dodgerblue; text-decoration: underline;" href="https://beian.miit.gov.cn/" target="_blank">吉ICP备20003633号-1</a></div>
        </div>
    </div>
    <!-- 주문하기 -->
    <div v-show="!isCart" :class="{'space_order_android': isPhone, 'space_order_iphone': !isPhone}">
        <b-row>
            <div class="col-xs-9">
                <b-row style="height: 100%;">
                    <div class="col-xs-3 align-center" style="height: 40px;">
                        <div class="fl pt-2">
                            <input id="check-all" v-model="isCheckAll" class="radius-checkbox" type="checkbox" name="" value="" @click="setAll">
                            <label for="check-all"></label>
                        </div>
                        <div class="font-8787-13 fl pl-3" @click="setAll">全选</div>
                    </div>
                    <div class="col-xs-9 pl-5" style="height: 40px;">
                        <div v-show="!isShowEdit" style="height: 100%;">
                            <div style="display: flex; flex-direction: column; justify-content: center; height: 100%;">
                                <div>
                                    <span class="font-222-15 font-weight">合计: </span>
                                    <span class="font-cf00-16 font-weight">{{ totalPrice | addComma }}</span>
                                    <span class="font-cf00-13 font-weight">¥</span>
                                </div>
                                <p v-if="totalPriceByEvent < freeShippingNeededPrice" class="font-222-13 mt-3">免运费还差 {{ freeShippingPrice | addComma }} 元</p>
                                <p v-else-if="freePackageNeededPrice !== 0 && freeShippingNeededPrice === 0" class="font-222-13 mt-3">(总重量:{{ totalWeight | addCommaTwo }}kg)</p>
                                <p v-else-if="freePackageNeededPrice === 0 && freeShippingNeededPrice === 0" class="font-222-13 mt-3">(总重量:{{ totalWeight | addCommaTwo }}kg)</p>
                                <p v-else class="font-222-13 mt-3">免运费</p>
                            </div>
                        </div>
                    </div>
                </b-row>
            </div>
            <div class="col-xs-3 text-center">
                <div v-if="isShowEdit === false">
                    <div v-if="totalGoods !== 0" class="radius-20 font-222-14 pt-13 pb-11 font-weight" style="background-color: #ffcc33;" @click="setOrder">去结算 ({{ totalGoods }})</div>
                    <div v-else class="radius-20 font-222-14 pt-13 pb-11 font-weight" style="background-color: #bfbfbf; color: #fff !important;">去结算 ({{ totalGoods }})</div>
                </div>
                <div v-else>
                    <div v-if="totalGoods !== 0" class="radius-20 pt-13 pb-11 font-weight" style="font-size: 14px; color: #cf000e; border: 1px solid #cf000e;" @click="setShowDialog('select')">删除</div>
                    <div v-else class="radius-20 pt-13 pb-11 font-weight" style="font-size: 14px; color: #bfbfbf; border: 1px solid #bfbfbf;">删除</div>
                </div>
            </div>
        </b-row>
    </div>
</div>
</template>

<script>
import MarqueeText from 'vue-marquee-text-component/src/components/MarqueeText.vue'

import {
    getCartInfo,
    setDeleteCart,
    setDeleteCartAll,
    getCartCount,
    setCartCount
} from '@/api/cart'

export default {
    name: "cart",
    components: {
        MarqueeText
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, true)
        this.$nuxt.$emit('handleNoticeShow', false)
        // 삭제요청이 오는 경우 삭제(컴포넌트간 요청, 응답)
        this.$nuxt.$on('handleCartConfirm', () => {
            this.setDelete()
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('handleCartConfirm')
        clearInterval(this.interval)
    },
    destroyed() {
        clearInterval(this.interval)
    },
    head() {
        return {
            title: '购物车'
        }
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()
        window.addEventListener('focusout', this.setFocusValue)

        this.freeShippingStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeShippingStatus : '0'
        this.freeShippingNeededPrice = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeShippingNeededPrice : 0
        this.freePackageStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freePackageStatus : '0'
        this.freePackageNeededPrice = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freePackageNeededPrice : 0
        this.freeShippingPrice = this.freeShippingNeededPrice

        if (navigator.userAgent.match(/android/i)) {
            this.isPhone = true
        } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.isPhone = false
        }

        this.getCartData()

        this.interval = setInterval(() => {
            if (this.isModifyCount) {
                this.isModifyCount = false
            }
        }, 2000)
    },
    data() {
        return {
            isPhone: true,
            interval: null,
            freeStatus: '0', // 배송조건
            cartItems: [], // 장바구니 배렬
            isCheckAll: false, // 전체 선택
            isShowNotice: false,
            totalPrice: 0, // 총합계
            totalWeight: 0, // 총무게
            totalGoods: 0, // 총상품수
            isShowEdit: false, // 편집상태여부
            isCart: false, // 장바구니에 상품의 존재여부
            deleteKind: '', // 삭제종류(선택삭제/전체삭제)
            isModifyCount: false, // 장바구니에 담긴 상품개수변경 지연상태값
            originalGoodsNum: [], // 상품개수가 갱신되기전 배렬값
            freeShippingStatus: '0', // 가격에 따르는 무료배송상태
            freeShippingNeededPrice: 0, // 무료배송상태가 될수 있는 기준가격
            freePackageStatus: '0', // 패키지가격에 따르는 무료배송상태
            freePackageNeededPrice: 0, // 무료배송상태가 될수 있는 기준패키지가격
            freeShippingPrice: 0, // 무료배송상태가 될수 있는 기준배송가격
            deliveryStatus: '', // 배송지존재여부값
            totalPriceByEvent: 0
        }
    },
    methods: {
        setFocusValue(element) {
            let temp = []
            this.totalPrice = 0
            this.totalPriceByEvent = 0
            this.totalWeight = 0

            this.cartItems.filter(shop => {
                shop.goods.filter(prod => {
                    if (element.target.id === 'number-' + shop.shopId + '-' + prod.id) {
                        const val = parseInt(element.target.value) === 0 ? 1 : parseInt(element.target.value)
                        element.target.value = val
                        prod.num = val

                        if (parseInt(val) !== parseInt(this.originalGoodsNum[shop.shopId][prod.id])) {
                            this.setCartCount(prod.id, val)
                            this.$set(this.originalGoodsNum[shop.shopId], prod.id, val)
                        }
                    }
                })

                temp.push(shop)
            })

            this.cartItems = temp

            this.cartItems.filter(shop => {
                shop.goods.filter(prod => {
                    if (prod.checked) {
                        if (prod.salesPrice.toString().indexOf('.') !== -1) {
                            const temp = prod.salesPrice.toString().split('.')[1]

                            if (temp.length === 1) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10
                                }
                            } else if (temp.length === 2) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100
                                }
                            }
                        } else {
                            this.totalPrice += prod.salesPrice * prod.num

                            if (prod.eventStatus === '1') {
                                this.totalPriceByEvent += prod.salesPrice * prod.num
                            }
                        }

                        this.totalWeight += prod.weight * prod.num
                    }
                })
            })

            if (this.totalPriceByEvent.toString().indexOf('.') !== -1) {
                const temp = this.totalPriceByEvent.toString().split('.')[1]

                if (temp.length === 1) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 10) - (parseInt(parseFloat(this.totalPriceByEvent) * 10))) / 10
                } else if (temp.length === 2) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 100) - (parseInt(parseFloat(this.totalPriceByEvent) * 100))) / 100
                }
            } else {
                this.freeShippingPrice = this.freeShippingNeededPrice - this.totalPriceByEvent
            }
        },
        setNumberValue(element) { // 상품개수 설정
            let temp = []
            this.totalPrice = 0
            this.totalPriceByEvent = 0
            this.totalWeight = 0
            element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 2)
            const val = element.target.value === '' ? 0 : parseInt(element.target.value)
            element.target.value = val

            this.cartItems.filter(shop => {
                shop.goods.filter(prod => {
                    if (element.target.id === 'number-' + shop.shopId + '-' + prod.id) {
                        prod.num = val
                    }
                })

                temp.push(shop)
            })

            this.cartItems = temp

            this.cartItems.filter(shop => {
                shop.goods.filter(prod => {
                    if (prod.checked) {
                        if (prod.salesPrice.toString().indexOf('.') !== -1) {
                            const temp = prod.salesPrice.toString().split('.')[1]

                            if (temp.length === 1) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10
                                }
                            } else if (temp.length === 2) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100
                                }
                            }
                        } else {
                            this.totalPrice += prod.salesPrice * prod.num

                            if (prod.eventStatus === '1') {
                                this.totalPriceByEvent += prod.salesPrice * prod.num
                            }
                        }

                        this.totalWeight += prod.weight * prod.num
                    }
                })
            })

            if (this.totalPriceByEvent.toString().indexOf('.') !== -1) {
                const temp = this.totalPriceByEvent.toString().split('.')[1]

                if (temp.length === 1) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 10) - (parseInt(parseFloat(this.totalPriceByEvent) * 10))) / 10
                } else if (temp.length === 2) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 100) - (parseInt(parseFloat(this.totalPriceByEvent) * 100))) / 100
                }
            } else {
                this.freeShippingPrice = this.freeShippingNeededPrice - this.totalPriceByEvent
            }
        },
        setCartCount(cartid, num) { // 장바구니에 담긴 상품개수 서버에 저장
            const query = {
                id: parseInt(cartid),
                num: parseInt(num)
            }

            setCartCount(query).then(() => {})
        },
        getCartData() { // 장바구니 정보 얻기
            this.$nuxt.$emit('handleLoading', true)

            getCartInfo().then(response => {
                if (response.res !== undefined) {
                    const icon = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).goodsIconBeans : ''
                    let icons = []

                    if (icon !== null && icon !== '') {
                        icons = icon.split(',')
                    }

                    this.freeStatus = response.res.data.freeStatus
                    this.cartItems = response.res.data.cartItems
                    this.isCart = this.cartItems.length === 0
                    this.deliveryStatus = response.res.data.deliveryStatus ? response.res.data.deliveryStatus : '0'

                    this.cartItems.filter(res => {
                        let tempOrigin = []
                        res.checked = false
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
                            prod.checked = false
                            tempOrigin[prod.id] = prod.num
                        })

                        this.originalGoodsNum[res.shopId] = tempOrigin
                    })
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setShop(shopid) { // 점포 선택
            let temp = []
            let isCheck = false
            this.totalGoods = 0
            this.totalPrice = 0
            this.totalWeight = 0
            this.totalPriceByEvent = 0

            this.cartItems.filter(shop => {
                if (shop.shopId === shopid) {
                    shop.checked = !shop.checked

                    shop.goods.filter(prod => {
                        prod.checked = prod.status === '1' && shop.checked
                    })
                }

                temp.push(shop)
            })

            this.cartItems = temp

            this.cartItems.filter(shop => {
                if (!shop.checked) {
                    isCheck = true
                }

                shop.goods.filter(prod => {
                    if (prod.checked) {
                        this.totalGoods++

                        if (prod.salesPrice.toString().indexOf('.') !== -1) {
                            const temp = prod.salesPrice.toString().split('.')[1]

                            if (temp.length === 1) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10
                                }
                            } else if (temp.length === 2) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100
                                }
                            }
                        } else {
                            this.totalPrice += prod.salesPrice * prod.num

                            if (prod.eventStatus === '1') {
                                this.totalPriceByEvent += prod.salesPrice * prod.num
                            }
                        }

                        this.totalWeight += prod.weight * prod.num
                    }
                })
            })

            if (this.totalPriceByEvent.toString().indexOf('.') !== -1) {
                const temp = this.totalPriceByEvent.toString().split('.')[1]

                if (temp.length === 1) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 10) - (parseInt(parseFloat(this.totalPriceByEvent) * 10))) / 10
                } else if (temp.length === 2) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 100) - (parseInt(parseFloat(this.totalPriceByEvent) * 100))) / 100
                }
            } else {
                this.freeShippingPrice = this.freeShippingNeededPrice - this.totalPriceByEvent
            }

            this.isCheckAll = !isCheck
        },
        setGoods(shopid, cartid) { // 상품 선택
            let temp = []
            let isCheck = false
            let isCheckAll = false
            this.totalGoods = 0
            this.totalPrice = 0
            this.totalPriceByEvent = 0
            this.totalWeight = 0

            this.cartItems.filter(shop => {
                if (shop.shopId === shopid) {
                    shop.goods.filter(prod => {
                        if (prod.id === cartid) {
                            prod.checked = !prod.checked
                        }
                    })
                }

                temp.push(shop)
            })

            temp.filter(shop => {
                if (shop.shopId === shopid) {
                    shop.goods.filter(prod => {
                        if (!prod.checked) {
                            isCheck = true
                        }
                    })

                    shop.checked = !isCheck
                    if (isCheck) return
                }
            })

            this.cartItems = temp

            this.cartItems.filter(shop => {
                if (!shop.checked) {
                    isCheckAll = true
                }

                shop.goods.filter(prod => {
                    if (prod.checked) {
                        this.totalGoods++

                        if (prod.salesPrice.toString().indexOf('.') !== -1) {
                            const temp = prod.salesPrice.toString().split('.')[1]

                            if (temp.length === 1) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10
                                }
                            } else if (temp.length === 2) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100
                                }
                            }
                        } else {
                            this.totalPrice += prod.salesPrice * prod.num

                            if (prod.eventStatus === '1') {
                                this.totalPriceByEvent += prod.salesPrice * prod.num
                            }
                        }

                        this.totalWeight += prod.weight * prod.num
                    }
                })
            })

            if (this.totalPriceByEvent.toString().indexOf('.') !== -1) {
                const temp = this.totalPriceByEvent.toString().split('.')[1]

                if (temp.length === 1) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 10) - (parseInt(parseFloat(this.totalPriceByEvent) * 10))) / 10
                } else if (temp.length === 2) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 100) - (parseInt(parseFloat(this.totalPriceByEvent) * 100))) / 100
                }
            } else {
                this.freeShippingPrice = this.freeShippingNeededPrice - this.totalPriceByEvent
            }

            this.isCheckAll = !isCheckAll
        },
        setAll() { // 전체 선택
            this.isCheckAll = !this.isCheckAll
            let temp = []
            this.totalGoods = 0
            this.totalPrice = 0
            this.totalPriceByEvent = 0
            this.totalWeight = 0

            this.cartItems.filter(shop => {
                shop.checked = this.isCheckAll

                shop.goods.filter(prod => {
                    prod.checked = this.isCheckAll
                })

                temp.push(shop)
            })

            this.cartItems = temp

            this.cartItems.filter(shop => {
                shop.goods.filter(prod => {
                    if (prod.checked) {
                        this.totalGoods++

                        if (prod.salesPrice.toString().indexOf('.') !== -1) {
                            const temp = prod.salesPrice.toString().split('.')[1]

                            if (temp.length === 1) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10
                                }
                            } else if (temp.length === 2) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100
                                }
                            }
                        } else {
                            this.totalPrice += prod.salesPrice * prod.num

                            if (prod.eventStatus === '1') {
                                this.totalPriceByEvent += prod.salesPrice * prod.num
                            }
                        }

                        this.totalWeight += prod.weight * prod.num
                    }
                })
            })

            if (this.totalPriceByEvent.toString().indexOf('.') !== -1) {
                const temp = this.totalPriceByEvent.toString().split('.')[1]

                if (temp.length === 1) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 10) - (parseInt(parseFloat(this.totalPriceByEvent) * 10))) / 10
                } else if (temp.length === 2) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 100) - (parseInt(parseFloat(this.totalPriceByEvent) * 100))) / 100
                }
            } else {
                this.freeShippingPrice = this.freeShippingNeededPrice - this.totalPriceByEvent
            }
        },
        setEdit() { // 편집뷰 설정
            let temp = []
            this.totalGoods = 0
            this.totalPrice = 0
            this.totalPriceByEvent = 0
            this.totalWeight = 0

            if (this.isCart) {
                return
            }

            this.isShowEdit = !this.isShowEdit
            this.isCheckAll = false

            this.cartItems.filter(shop => {
                shop.checked = false

                shop.goods.filter(prod => {
                    prod.checked = false
                })

                temp.push(shop)
            })

            this.cartItems = temp
        },
        setShowDialog(kind) { // 다이얼로그 로출
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '确定要删除商品吗？', '', '否', '是', '', 'white', false, true, 'cart')
            this.deleteKind = kind
        },
        setDelete() { // 삭제 설정
            if (this.deleteKind === 'select') { // 선택 삭제
                let ids = []

                this.cartItems.filter(shop => {
                    shop.goods.filter(prod => {
                        if (prod.checked) {
                            ids.push(prod.id)
                        }
                    })
                })

                const query = {
                    ids: ids
                }

                setDeleteCart(query).then(response => {
                    if (response.res !== undefined) {
                        getCartCount().then(resp => {
                            this.$nuxt.$emit('handleCart', resp.res.data) // 상속된 어미엘리멘트에 장바구니수를 넘기기
                        })

                        this.totalGoods = 0
                        this.getCartData()
                    }
                })
            }

            if (this.deleteKind === 'all') { // 전체 삭제
                setDeleteCartAll().then(response => {
                    if (response.res !== undefined) {
                        getCartCount().then(resp => {
                            this.$nuxt.$emit('handleCart', resp.res.data) // 상속된 어미엘리멘트에 장바구니수를 넘기기
                        })

                        this.getCartData()
                    }
                })
            }
        },
        setPlus(shopid, cartid, currNum) { // 상품개수 증가
            if (parseInt(currNum) >= 99 || this.isModifyCount) {
                return
            }

            let temp = []
            this.totalPrice = 0
            this.totalPriceByEvent = 0
            this.totalWeight = 0
            this.isModifyCount = true

            this.cartItems.filter(shop => {
                if (shop.shopId === shopid) {
                    shop.goods.filter(prod => {
                        if (prod.id === cartid) {
                            prod.num = parseInt(currNum) + 1

                            if (parseInt(currNum) + 1 !== parseInt(this.originalGoodsNum[shop.shopId][prod.id])) {
                                this.setCartCount(prod.id, parseInt(currNum) + 1)
                                this.$set(this.originalGoodsNum[shop.shopId], prod.id, parseInt(currNum) + 1)
                            }
                        }
                    })
                }

                temp.push(shop)
            })

            this.cartItems = temp

            this.cartItems.filter(shop => {
                shop.goods.filter(prod => {
                    if (prod.checked) {
                        if (prod.salesPrice.toString().indexOf('.') !== -1) {
                            const temp = prod.salesPrice.toString().split('.')[1]

                            if (temp.length === 1) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10
                                }
                            } else if (temp.length === 2) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100
                                }
                            }
                        } else {
                            this.totalPrice += prod.salesPrice * prod.num

                            if (prod.eventStatus === '1') {
                                this.totalPriceByEvent += prod.salesPrice * prod.num
                            }
                        }

                        this.totalWeight += prod.weight * prod.num
                    }
                })
            })

            if (this.totalPriceByEvent.toString().indexOf('.') !== -1) {
                const temp = this.totalPriceByEvent.toString().split('.')[1]

                if (temp.length === 1) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 10) - (parseInt(parseFloat(this.totalPriceByEvent) * 10))) / 10
                } else if (temp.length === 2) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 100) - (parseInt(parseFloat(this.totalPriceByEvent) * 100))) / 100
                }
            } else {
                this.freeShippingPrice = this.freeShippingNeededPrice - this.totalPriceByEvent
            }
        },
        setMinuse(shopid, cartid, currNum) { // 상품개수 감소
            if (parseInt(currNum) === 1 || this.isModifyCount) {
                return
            }

            let temp = []
            this.totalPrice = 0
            this.totalPriceByEvent = 0
            this.totalWeight = 0
            this.isModifyCount = true

            this.cartItems.filter(shop => {
                if (shop.shopId === shopid) {
                    shop.goods.filter(prod => {
                        if (prod.id === cartid) {
                            prod.num = parseInt(currNum) - 1

                            if (parseInt(currNum) - 1 !== parseInt(this.originalGoodsNum[shop.shopId][prod.id])) {
                                this.setCartCount(prod.id, parseInt(currNum) - 1)
                                this.$set(this.originalGoodsNum[shop.shopId], prod.id, parseInt(currNum) - 1)
                            }
                        }
                    })
                }

                temp.push(shop)
            })

            this.cartItems = temp

            this.cartItems.filter(shop => {
                shop.goods.filter(prod => {
                    if (prod.checked) {
                        if (prod.salesPrice.toString().indexOf('.') !== -1) {
                            const temp = prod.salesPrice.toString().split('.')[1]

                            if (temp.length === 1) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 10) + (parseInt(parseFloat(prod.salesPrice) * 10) * parseInt(prod.num))) / 10
                                }
                            } else if (temp.length === 2) {
                                this.totalPrice = (parseInt(parseFloat(this.totalPrice) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100

                                if (prod.eventStatus === '1') {
                                    this.totalPriceByEvent = (parseInt(parseFloat(this.totalPriceByEvent) * 100) + (parseInt(parseFloat(prod.salesPrice) * 100) * parseInt(prod.num))) / 100
                                }
                            }
                        } else {
                            this.totalPrice += prod.salesPrice * prod.num

                            if (prod.eventStatus === '1') {
                                this.totalPriceByEvent += prod.salesPrice * prod.num
                            }
                        }

                        this.totalWeight += prod.weight * prod.num
                    }
                })
            })

            if (this.totalPriceByEvent.toString().indexOf('.') !== -1) {
                const temp = this.totalPriceByEvent.toString().split('.')[1]

                if (temp.length === 1) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 10) - (parseInt(parseFloat(this.totalPriceByEvent) * 10))) / 10
                } else if (temp.length === 2) {
                    this.freeShippingPrice = (parseInt(parseFloat(this.freeShippingNeededPrice) * 100) - (parseInt(parseFloat(this.totalPriceByEvent) * 100))) / 100
                }
            } else {
                this.freeShippingPrice = this.freeShippingNeededPrice - this.totalPriceByEvent
            }
        },
        setOrder() { // 주문하기페지로 가기
            let query = ''
            localStorage.removeItem('deliveryid')

            this.cartItems.filter(shop => {
                shop.goods.filter(prod => {
                    if (prod.checked) {
                        query += prod.id + ',' + prod.num + '|'
                    }
                })
            })

            if (this.deliveryStatus === '0') {
                this.$router.push({
                    path: '/info/delivery/delivery_address?param=' + query.slice(0, query.length - 1) + '&price=' + this.totalPrice + '&weight=' + this.totalWeight
                })
            } else {
                this.$router.push({
                    path: '/goods/order?param=' + query.slice(0, query.length - 1) + '&price=' + this.totalPrice + '&weight=' + this.totalWeight
                })
            }
        },
        redirectGoodsDetail(shopid, productid) { // 상품상세페이지 리다이렉트
            this.$router.push({
                path: '/goods/goods_detail?shopid=' + shopid + '&productid=' + productid
            })
        },
        goBack() {
            if (window.history.length === 1) {
                this.$router.replace({
                    path: '/main'
                })
            } else {
                this.$router.go(-1)
            }
        }
    }
}
</script>

<style scoped>
.space {
    height: auto;
    padding: 65px 15px;
}

.space_order_android {
    max-width: 500px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    padding: 7px 9px;
    z-index: 100;
    border-top: 1px solid #e7e7e7;
}

.space_order_iphone {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 67px;
    background-color: #fff;
    padding: 7px 9px;
    z-index: 100;
    border-top: 1px solid #e7e7e7;
}

.height_100 {
    height: 100%;
}

.height_auto {
    height: auto;
}
</style>
