<template>
<div id="mainshopitem" ref="shop_item">
    <div class="shop_item">
        <b-row class="mb-20" @click="setShop">
            <div class="col-xs-3">
                <img class="thumbnail_1" :data-src="avatarUri" alt="" src="../assets/images/image_placeholder.png" v-lazy-load />
            </div>
            <div class="col-xs-9">
                <b-row>
                    <div class="col-xs-7">
                        <div class="fl font-222-15 font-weight title-width">{{ shopName }}</div>
                    </div>
                    <div class="col-xs-5">
                        <img class="fr mt-2" :src="shopIcon" alt="" style="width: 45px; height: 13px;">
                    </div>
                </b-row>
                <b-row class="mt-5">
                    <img class="fl" src="../assets/images/year_icon.png" alt="" style="width: 13px; height: 13px;">
                    <div v-if="age < 1" class="fl font-222-13 ml-2">新开店铺</div>
                    <div v-else-if="age >= 1 && age < 5" class="fl font-222-13 ml-2">{{ age }}年店铺</div>
                    <div v-else class="fl font-222-13 ml-2">{{ age }}年老店</div>
                    <div class="fl font-222-13 ml-10">销量:</div>
                    <img class="fl mt-1 ml-3" v-for="(item, index) in starNum" :key="index" src="../assets/images/ico_diamond.png" alt="" style="width: 11px; height: 11px;">
                </b-row>
                <b-row class="mt-10">
                    <div class="font-b8b8-13 content-width mb-0">{{ shopIntro }}</div>
                </b-row>
            </div>
        </b-row>
        <b-row v-show="view === 'goods_detail'" class="mb-10">
            <div class="col-xs-6">
                <div class="font-222-16 font-weight mt-4">该摊位还在卖—</div>
            </div>
            <div class="col-xs-6">
                <div class="border-all radius-12 pb-2 fr text-center" style="width: 40%;" @click="setShop">
                    <span class="font-222-12">全部</span>
                    <span class="font-222-12" style="margin-left: -4px;">商品</span>
                </div>
            </div>
        </b-row>
        <b-row>
            <div style="width: 100%">
                <swiper id="mainshop-swiper" :options="swiperOption">
                    <swiper-slide class="swiper-slide" v-for="item in goodsData" :key="item.id">
                        <div @click="setGoods(item.id)">
                            <div class="pos-re thumbnail_2 mb-5" style="display: flex; align-items: center; justify-content: center;">
                                <img class="thumbnail_2" :data-src="item.goodsImg" src="../assets/images/image_placeholder.png" alt="" v-lazy-load />
                                <img class="pos-ab" v-show="item.goodsIconUrl !== ''" :src="item.goodsIconUrl" alt="" style="width: 40px; height: 40px; top: 0; right: 0; border-top-right-radius: 8px;">
                                <img class="pos-ab" v-show="item.goodsVideo !== '' && item.goodsVideo !== null && item.goodsVideo !== undefined" src="../assets/images/ico_play_1.png" alt="" style="width: 40px; height: 40px;">
                            </div>
                            <div class="font-222-15 title-width mb-3">{{ item.goodsName }}</div>
                            <div>
                                <span class="font-cf00-13 font-weight">¥</span>
                                <span class="font-cf00-16 font-weight" style="margin-left: -4px;">{{ item.salesPrice | addComma }}</span>
                                <span class="font-b8b8-13" style="margin-left: -3px;">/{{ item.goodsUnit }}</span>
                                <span v-show="item.originalPrice !== 0" class="font-b8b8-13 text-through">¥{{ item.originalPrice | addComma }}</span>
                            </div>
                            <div class="mt-5" v-if="item.eventStatus === '1'">
                                <div v-if="freeShippingStatus === '1'" class="free-price-item red mb-3">满 {{ freeShippingNeededPrice | addComma }} 包邮</div>
                                <div v-if="freePackageStatus === '1'" class="free-price-item green">满 {{ freePackageNeededPrice | addComma }} 免包装费</div>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </b-row>
    </div>
</div>
</template>

<script>
export default {
    name: 'MainShopItem',
    components: {},
    props: {
        shopId: {
            type: Number,
            required: true
        },
        shopName: { // 점포명
            type: String,
            required: true
        },
        age: { // 점포오픈년도
            type: Number,
            required: true
        },
        starNum: { // 점포등급
            type: Number,
            required: true
        },
        shopIntro: {
            type: String,
            required: true
        },
        goods: {
            type: Array
        },
        avatarUri: { // 점포이미지
            type: String,
            required: true
        },
        view: {
            type: String
        },
        shopData: {
            type: Array
        }
    },
    computed: {
        getGoodsData() {
            return this.goods
        }
    },
    created() {},
    mounted() {
        this.freePackageStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freePackageStatus : '0'
        this.freePackageNeededPrice = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freePackageNeededPrice : 0
        this.freeShippingStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeShippingStatus : '0'
        this.freeShippingNeededPrice = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeShippingNeededPrice : 0
        this.shopIcon = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).shop_image : ''
        const icon = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).goodsIconBeans : ''
        let icons = []

        if (icon !== null && icon !== '') {
            icons = icon.split(',')
        }

        if (this.view === 'goods_detail') {
            setTimeout(() => {
                this.goods.filter(res => {
                    let value = {
                        goodsImg: res.goodsImg,
                        goodsIntro: res.goodsIntro,
                        goodsName: res.goodsName,
                        goodsUnit: res.goodsUnit,
                        id: res.id,
                        originalPrice: res.originalPrice,
                        salesPrice: res.salesPrice,
                        sizeId: res.sizeId,
                        sizeStatus: res.sizeStatus,
                        goodsIconUrl: '',
                        goodsVideo: res.goodsVideo,
                        eventStatus: res.eventStatus
                    }

                    icons.filter(val => {
                        const goodsIconName = val.split('-')[0]
                        const goodsIconUrl = val.split('-')[1]

                        if (res.goodsIconName === goodsIconName && res.goodsIconName !== '' && res.goodsIconName !== null) {
                            value.goodsIconUrl = goodsIconUrl
                        }
                    })

                    this.goodsData.push(value)
                })
            }, 500)
        } else {
            this.goods.filter(res => {
                let value = {
                    goodsImg: res.goodsImg,
                    goodsIntro: res.goodsIntro,
                    goodsName: res.goodsName,
                    goodsUnit: res.goodsUnit,
                    id: res.id,
                    originalPrice: res.originalPrice,
                    salesPrice: res.salesPrice,
                    sizeId: res.sizeId,
                    sizeStatus: res.sizeStatus,
                    goodsIconUrl: '',
                    goodsVideo: res.goodsVideo,
                    eventStatus: res.eventStatus
                }

                icons.filter(val => {
                    const goodsIconName = val.split('-')[0]
                    const goodsIconUrl = val.split('-')[1]

                    if (res.goodsIconName === goodsIconName && res.goodsIconName !== '' && res.goodsIconName !== null) {
                        value.goodsIconUrl = goodsIconUrl
                    }
                })

                this.goodsData.push(value)
            })
        }
    },
    data() {
        return {
            shopIcon: '',
            url: '',
            goodsData: [],
            freePackageStatus: '0',
            freePackageNeededPrice: 0,
            freeShippingStatus: '0',
            freeShippingNeededPrice: 0,
            swiperOption: {
                slidesPerView: 'auto',
                direction: 'horizontal',
                freeMode: true
            }
        }
    },
    methods: {
        setShop() { // 점포페지로 리다이렉트
            if (this.view === 'load_main') {
                localStorage.setItem('main_shop', JSON.stringify(this.shopData))
                localStorage.setItem(this.view, 1)
            }

            localStorage.removeItem('pageCount')
            localStorage.removeItem('totalPage')
            localStorage.removeItem('isViewKind')
            localStorage.removeItem('load_shop')
            localStorage.removeItem('shop_list')
            localStorage.removeItem('shop_even')
            localStorage.removeItem('shop_odd')

            this.$router.push({
                path: '/shop/shop_detail',
                query: {
                    shopid: this.shopId,
                    productid: 0
                }
            })
        },
        setGoods(productid) { // 상품상세페지로 리다이렉트
            if (this.view === 'load_main') {
                localStorage.setItem('main_shop', JSON.stringify(this.shopData))
                localStorage.setItem(this.view, 1)
            }

            localStorage.removeItem('pageCount')
            localStorage.removeItem('totalPage')
            localStorage.removeItem('isViewKind')
            localStorage.removeItem('load_shop')
            localStorage.removeItem('shop_list')
            localStorage.removeItem('shop_even')
            localStorage.removeItem('shop_odd')

            this.$router.push({
                path: '/goods/goods_detail',
                query: {
                    shopid: this.shopId,
                    productid: productid
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
