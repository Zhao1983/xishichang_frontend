<template>
<div id="productverticalitem">
    <div class="background-white radius-7 mb-10 pos-re" :style="styles">
        <div class="pos-re image-height mb-10" style="display: flex; align-items: center; justify-content: center;" @click="setGoods">
            <img class="radius-left-top-7 radius-right-top-7 image-height" :data-src="goodsImg" alt="" v-lazy-load src="../assets/images/image_placeholder.png" />
            <img class="pos-ab radius-right-top-7" v-show="goodsIconUrl !== ''" :src="goodsIconUrl" alt="" style="width: 40px; height: 40px; top: 0; right: 0;">
            <img class="pos-ab" v-show="goodsVideo !== '' && goodsVideo !== null && goodsVideo !== undefined" src="../assets/images/ico_play_1.png" alt="" style="width: 40px; height: 40px;">
            <img v-show="goodsStatus === '0'" class="pos-ab" src="../assets/images/ico_outside.png" alt="" style="width: 100%; height: 100%; left: 0; opacity: 0.7;">
        </div>
        <div class="font-222-15 pl-7 pr-7 title-width mb-3" @click="setGoods">{{ goodsName }}</div>
        <div class="font-b8b8-15 pl-7 pr-7 title-width" @click="setGoods">{{ goodsIntro }}</div>
        <b-row v-show="shopName !== ''" class="mt-3 pl-7 pr-7" @click="setGoods">
            <img class="fl" src="../assets/images/ico_shop_1.png" alt="" style="width: 12px; height: 12px;">
            <div class="font-222-12 ml-2 fl mr-5 title-width" style="width: 84%;">{{ shopName }}</div>
        </b-row>
        <div ref="price_info" style="padding: 10px 7px 13px 7px;">
            <div v-show="originalPrice !== 0" class="font-b8b8-13 text-through">¥{{ originalPrice | addComma }}</div>
            <div ref="price">
                <span class="font-cf00-12 font-weight mt-3" @click="setGoods">¥&nbsp;</span>
                <span class="font-cf00-16 font-weight" style="margin-left: -6px;" @click="setGoods">{{ salesPrice | addComma }}</span>
                <span class="font-b8b8-15" style="margin-left: -2px;" @click="setGoods">/{{ goodsUnit }}</span>
                <span v-show="goodsStatus === '1'">
                    <img v-if="sizeStatus === '0'" class="fr" src="../assets/images/ico_cart_enabled.png" alt="" style="width: 27px; height: 27px; margin-top: -6px;" @click="setAddCart">
                    <img v-else class="fr" src="../assets/images/ico_cart_enabled.png" alt="" style="width: 27px; height: 27px; margin-top: -6px;" @click="setGoods">
                </span>
            </div>
            <div class="mt-5" v-if="eventStatus === '1'">
                <div v-if="freeShippingStatus === '1'" class="free-price-item red" style="display: inline-block;">满 {{ freeShippingNeededPrice | addComma }} 包邮</div>
                <div v-if="freePackageStatus === '1'" class="free-price-item green" style="display: inline-block;">满 {{ freePackageNeededPrice | addComma }} 免包装费</div>
            </div>
        </div>
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
    name: 'ProductVerticalItem',
    props: {
        shopId: {
            type: Number
        },
        prodId: {
            type: Number,
            required: true
        },
        goodsIconName: {
            type: null,
            required: true,
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
        styles: {
            type: Object,
            required: true
        },
        balls: {
            type: Array
        },
        dropBall: {
            type: Array
        },
        searchWord: {
            type: String
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
        goodsData: {
            type: Array
        },
        goodsStatus: {
            type: String,
            default: '1'
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
    computed: {},
    data() {
        return {
            cartCount: 0,
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
                // 검색결과페지인 경우
                if (this.view === 'load_search') {
                    localStorage.setItem('search_even', JSON.stringify(this.goodsEvenData))
                    localStorage.setItem('search_odd', JSON.stringify(this.goodsOddData))
                }

                // 점포상세페지인 경우
                if (this.view === 'load_shop') {
                    localStorage.setItem('shop_even', JSON.stringify(this.goodsEvenData))
                    localStorage.setItem('shop_odd', JSON.stringify(this.goodsOddData))
                }
            }

            if (this.goodsData) {
                // 점포상세페지인 경우
                if (this.view === 'load_shop') {
                    localStorage.setItem('shop_list', JSON.stringify(this.goodsData))
                }
            }

            this.$router.push({
                path: '/goods/goods_detail?shopid=' + this.shopId + '&productid=' + this.prodId
            })
        },
        setAddCart(element) {
            if (sessionStorage.getItem('token') === '' || !sessionStorage.getItem('token')) {
                if (this.searchWord !== '') {
                    if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                        window.location.href = define.AUTH_URL + '?id=' + this.searchWord + '&type=' + this.$route.path.split('/')[1]
                    } else {
                        this.$router.push({
                            path: '/qr_view'
                        })
                    }
                } else {
                    const id = this.$route.query.shopid === undefined ? 0 : this.$route.query.shopid
                    const subid = this.$route.query.productid === undefined ? 0 : this.$route.query.productid

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
                            getCartCount().then(resp => {
                                setTimeout(() => {
                                    this.$nuxt.$emit('handleCart', parseInt(resp.res.data)) // 상속된 어미엘리멘트에 장바구니수를 넘기기
                                }, 600)
                            })
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
