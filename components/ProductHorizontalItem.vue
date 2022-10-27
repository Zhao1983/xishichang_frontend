<template>
<div id="producthorizontalitem">
    <div class="pos-re">
        <b-row v-if="isShowDelete">
            <div class="col-xs-1" style="display: flex; align-items: center; margin-top: -5px;">
                <input :id="'check-' + index" v-model="getCheckStatus" type="checkbox" name="" value="" class="radius-checkbox" @change="setCheckStatus">
                <label :for="'check-' + index"></label>
            </div>
            <div class="col-xs-3" @click="setGoods">
                <img class="radius-7" :data-src="goodsImg" alt="" src="../assets/images/image_placeholder.png" style="width: 90%;" v-lazy-load />
                <img class="pos-ab radius-right-top-7" v-show="goodsIconUrl !== ''" :src="goodsIconUrl" alt="" style="width: 40px; height: 40px; top: 0; right: 10%;">
                <img v-if="goodsStatus === '0'" class="pos-ab" src="../assets/images/ico_outside.png" alt="" style="width: 90%; height100%; left: 0; opacity: 0.7;">
            </div>
            <div class="col-xs-8">
                <div @click="setGoods">
                    <div class="font-222-15 title-width">{{ goodsName }}</div>
                    <div class="font-b8b8-13 title-width mt-3">{{ goodsIntro }}</div>
                    <b-row v-show="shopName !== ''" class="mt-3">
                        <img class="fl" src="../assets/images/ico_shop_1.png" alt="" style="width: 12px; height: 12px;">
                        <div class="font-222-12 ml-2 fl mr-5 title-width" style="width: 87%;">{{ shopName }}</div>
                    </b-row>
                </div>
                <b-row class="mt-6">
                    <div class="col-xs-9" @click="setGoods">
                        <div>
                            <span class="font-cf00-13 font-weight">¥</span>
                            <span class="font-cf00-16 font-weight" style="margin-left: -4px;">{{ salesPrice | addComma }}</span>
                            <span class="font-b8b8-15">/{{ goodsUnit }}</span>
                            <span v-show="originalPrice !== 0" class="font-b8b8-13 text-through">¥{{ originalPrice | addComma }}</span>
                        </div>
                    </div>
                    <div class="col-xs-3">
                        <div v-show="goodsStatus === '1'">
                            <img v-if="sizeStatus === '0'" class="fr" src="../assets/images/ico_cart_enabled.png" alt="" style="width: 27px; height: 27px; margin-top: -7px;" @click="setAddCart">
                            <img v-else class="fr" src="../assets/images/ico_cart_enabled.png" alt="" style="width: 27px; height: 27px; margin-top: -7px;" @click="setGoods">
                        </div>
                    </div>
                </b-row>
            </div>
        </b-row>
        <b-row v-else>
            <div class="col-xs-4" @click="setGoods">
                <img class="prod-thumbnail" :data-src="goodsImg" alt="" src="../assets/images/image_placeholder.png" v-lazy-load />
                <img class="pos-ab radius-right-top-7" v-show="goodsIconUrl !== ''" :src="goodsIconUrl" alt="" style="width: 40px; height: 40px; top: 0; right: 10%;">
                <div v-show="goodsStatus === '1'" class="prod-thumbnail pos-ab" style="display: flex; border: none; top: 0; align-items: center; justify-content: center;">
                    <img class="pos-ab" v-show="goodsVideo !== '' && goodsVideo !== null && goodsVideo !== undefined" src="../assets/images/ico_play_1.png" alt="" style="width: 30px; height: 30px; ">
                </div>
                <img v-show="goodsStatus === '0'" class="pos-ab" src="../assets/images/ico_outside.png" alt="" style="width: 90%; height: 100%; left: 0; opacity: 0.7;">
            </div>
            <div class="col-xs-8">
                <div @click="setGoods">
                    <div class="font-222-15 title-width">{{ goodsName }}</div>
                    <div class="font-b8b8-13 title-width mt-3">{{ goodsIntro }}</div>
                    <b-row v-show="shopName !== ''" class="mt-3">
                        <img class="fl" src="../assets/images/ico_shop_1.png" alt="" style="width: 12px; height: 12px;">
                        <div class="font-222-12 ml-2 fl mr-5 title-width" style="width: 87%;">{{ shopName }}</div>
                    </b-row>
                </div>
                <b-row class="mt-6">
                    <div class="col-xs-9" @click="setGoods">
                        <div>
                            <span class="font-cf00-13 font-weight">¥</span>
                            <span class="font-cf00-16 font-weight" style="margin-left: -4px;">{{ salesPrice | addComma }}</span>
                            <span class="font-b8b8-15">/{{ goodsUnit }}</span>
                            <span v-show="originalPrice !== 0" class="font-b8b8-13 text-through">¥{{ originalPrice | addComma }}</span>
                        </div>
                        <div class="mt-5" v-if="eventStatus === '1'">
                            <div v-if="freeShippingStatus === '1'" class="free-price-item red" style="display: inline-block;">满 {{ freeShippingNeededPrice | addComma }} 包邮</div>
                            <div v-if="freePackageStatus === '1'" class="free-price-item green" style="display: inline-block;">满 {{ freePackageNeededPrice | addComma }} 免包装费</div>
                        </div>
                    </div>
                    <div class="col-xs-3">
                        <div v-show="goodsStatus === '1'">
                            <img v-if="sizeStatus === '0'" class="fr" src="../assets/images/ico_cart_enabled.png" alt="" style="width: 27px; height: 27px; margin-top: -7px;" @click="setAddCart">
                            <img v-else class="fr" src="../assets/images/ico_cart_enabled.png" alt="" style="width: 27px; height: 27px; margin-top: -7px;" @click="setGoods">
                        </div>
                    </div>
                </b-row>
            </div>
        </b-row>
    </div>
</div>
</template>

<script>
import {
    getCartCount,
    setAddCart
} from '@/api/cart'

import define from '@/utility/define'

export default {
    name: 'ProductHorizontalItem',
    props: {
        index: {
            type: Number
        },
        shopId: {
            type: Number
        },
        prodId: {
            type: Number,
            required: true
        },
        goodsIconName: {
            type: null,
            required: true
        },
        goodsName: {
            type: String,
            required: true
        },
        goodsImg: {
            type: String,
            required: true
        },
        goodsVideo: {
            type: String
        },
        goodsUnit: {
            type: String,
            required: true
        },
        goodsIntro: {
            type: String,
            required: true
        },
        originalPrice: {
            type: Number,
            required: false
        },
        salesPrice: {
            type: Number,
            required: true
        },
        sizeStatus: {
            type: String,
            required: true
        },
        shopName: {
            type: String,
            required: true
        },
        sizeId: {
            type: Number,
            required: true
        },
        eventStatus: {
            type: String,
            required: true
        },
        isShowDelete: {
            type: Boolean
        },
        isCheckStatus: {
            type: Boolean
        },
        goodsStatus: {
            type: String,
            default: '1'
        },
        balls: {
            type: Array
        },
        dropBall: {
            type: Array
        },
        view: {
            type: String
        },
        goodsEvenData: {
            type: Array
        },
        goodsOddData: {
            type: Array
        },
        subTypeData: {
            type: Array
        },
        goodsData: {
            type: Array
        }
    },
    created() {},
    mounted() {
        this.freeShippingStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeShippingStatus : '0'
        this.freeShippingNeededPrice = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeShippingNeededPrice : 0
        this.freePackageStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freePackageStatus : '0'
        this.freePackageNeededPrice = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freePackageNeededPrice : 0
        const icon = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).goodsIconBeans : ''
        let icons = []

        if (icon !== null && icon !== '') {
            icons = icon.split(',')
        }

        icons.filter(val => {
            const goodsIconName = val.split('-')[0]
            const goodsIconUrl = val.split('-')[1]

            if (this.goodsIconName === goodsIconName && this.goodsIconName !== '' && this.goodsIconName !== null) {
                this.goodsIconUrl = goodsIconUrl
            }
        })
    },
    computed: {
        getCheckStatus: {
            get() {
                return this.isCheckStatus
            },
            set(val) {
                this.isCheck = val
            }
        }
    },
    data() {
        return {
            cartCount: 0,
            isCheck: this.isCheckStatus,
            goodsIconUrl: '',
            freePackageStatus: '0',
            freePackageNeededPrice: 0,
            freeShippingStatus: '0',
            freeShippingNeededPrice: 0
        }
    },
    methods: {
        setGoods() {
            // 상품상태가 내린상품이라면
            if (this.goodsStatus === '0') {
                return
            }

            localStorage.setItem(this.view, 1)

            if (this.goodsEvenData) {
                if (this.view === 'load_shop') {
                    localStorage.setItem('shop_even', JSON.stringify(this.goodsEvenData))
                    localStorage.setItem('shop_odd', JSON.stringify(this.goodsOddData))
                }
            }

            if (this.goodsData) {
                if (this.view === 'load_type') {
                    localStorage.setItem('type_list', JSON.stringify(this.goodsData))
                    localStorage.setItem('subTypeData', JSON.stringify(this.subTypeData))
                }

                if (this.view === 'load_shop') {
                    localStorage.setItem('shop_list', JSON.stringify(this.goodsData))
                }

                if (this.view === 'load_history') {
                    localStorage.setItem('history_list', JSON.stringify(this.goodsData))
                }
            }

            if (this.view === 'load_type') {
                this.$router.push({
                    path: '/shop/shop_detail',
                    query: {
                        shopid: this.shopId,
                        productid: this.prodId
                    }
                })
            } else {
                this.$router.push({
                    path: '/goods/goods_detail',
                    query: {
                        shopid: this.shopId,
                        productid: this.prodId
                    }
                })
            }
        },
        setCheckStatus() { // 상품삭제
            this.$nuxt.$emit('handleFavorityDelete', this.prodId, this.isCheck)
        },
        setAddCart(element) {
            if (sessionStorage.getItem('token') === '' || !sessionStorage.getItem('token')) {
                if (this.$route.path.split('/')[1].search('type_detail') !== -1) { // 분류페지라면
                    const id = parseInt(localStorage.getItem('typeId'))
                    const subid = parseInt(localStorage.getItem('subTypeId'))
                    // 위챗로그인을 위해 리다이렉트
                    if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                        window.location.href = define.AUTH_URL + '?id=' + id + '-' + subid + '-1&type=' + this.$route.path.split('/')[1]
                    } else {
                        this.$router.push({
                            path: '/qr_view'
                        })
                    }
                } else { // 분류페지가 아니라면
                    const id = this.$route.query.shopid === undefined ? 0 : this.$route.query.shopid
                    const subid = this.$route.query.productid === undefined ? 0 : this.$route.query.productid
                    // 위챗로그인을 위해 리다이렉트
                    if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                        window.location.href = define.AUTH_URL + '?id=' + id + '-' + subid + '&type=' + this.$route.path.split('/')[1]
                    } else {
                        this.$router.push({
                            path: '/qr_view'
                        })
                    }
                }
            } else {
                for (let i = 0; i < this.balls.length; i++) {
                    if (!this.balls[i].show) { //볼의 보기가 할당이 안된 경우
                        let ball = this.balls[i] //빈배렬의 오브젝트 얻기
                        ball.show = true //보기를 true 로 설정
                        ball.el = element.target //버튼을 누른 대상을 보관
                        this.dropBall.push(ball) //설정된 값을 가진 볼을 드롭다운 볼 배렬에 추가
                        this.cartCount = 0
                        const query = {
                            goodsId: parseInt(this.prodId),
                            sizeId: this.sizeId,
                            num: this.cartCount + 1
                        }

                        setAddCart(query).then(() => { // 장바구니에 상품 추가
                            setTimeout(() => {
                                getCartCount().then(resp => {
                                    this.$nuxt.$emit('handleCart', resp.res.data) // 상속된 어미엘리멘트에 장바구니수를 넘기기
                                })
                            }, 600)
                        })

                        return
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
</style>
