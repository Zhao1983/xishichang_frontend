<template>
<div id="goods_detail" ref="goods_detail" style="height: 100%;">
    <div v-show="isShowOverlay" class="back_overlay" @click="setCancelOption"></div>
    <div class="container background-default detail_padding">
        <div class="pos-fix padding-default" @click="goBack" style="z-index: 500;">
            <img src="../../assets/images/ico_back_1.png" alt="" style="width: 32px; height: 32px; cursor: pointer;">
        </div>
        <div id="goods-swiper" ref="goods_swiper" style="width: 100%;">
            <swiper :options="swiperGoods" @slideChangeTransitionStart="onSwiperSlideChangeMain">
                <swiper-slide class="swiper-slide" v-show="goodsVideo">
                    <video id="goods_video" ref="goods_video" class="goods-detail-thumbnail" playsinline muted="muted" @click="setVisibleImageDetail(0)"></video>
                    <img v-show="!isPlay" class="pos-ab" src="../../assets/images/ico_play_1.png" alt="" style="width: 70px; height: 70px; cursor: pointer;" @click="setVideoPlay">
                </swiper-slide>
                <swiper-slide class="swiper-slide" v-for="(item, index) in imgs" :key="index">
                    <div v-if="goodsVideo !== '' && goodsVideo !== null && goodsVideo !== undefined">
                        <img class="goods-detail-thumbnail" :src="item.uri" alt="" @click="setVisibleImageDetail(index + 1)" />
                        <img class="pos-ab" v-show="watermarkPic !== '' && watermarkPic != null" :src="watermarkPic" alt="" style="top: 0; left: 0; width: 100px; height: 100px;" @click="setVisibleImageDetail(index + 1)">
                        <img class="pos-ab" v-show="watermarkWord !== '' && watermarkWord != null" :src="watermarkWord" alt="" style="top: 0; left: 0; right: 0; height: 100%;" @click="setVisibleImageDetail(index + 1)">
                    </div>
                    <div v-else>
                        <img class="goods-detail-thumbnail" :src="item.uri" alt="" @click="setVisibleImageDetail(index)" />
                        <img class="pos-ab" v-show="watermarkPic !== '' && watermarkPic != null" :src="watermarkPic" alt="" style="top: 0; left: 0; width: 100px; height: 100px;" @click="setVisibleImageDetail(index)">
                        <img class="pos-ab" v-show="watermarkWord !== '' && watermarkWord != null" :src="watermarkWord" alt="" style="top: 0; left: 0; right: 0; height: 100%;" @click="setVisibleImageDetail(index)">
                    </div>
                </swiper-slide>
                <div class="page-number" slot="pagination"></div>
            </swiper>
        </div>
        <div class="padding-default background-white mb-15">
            <b-row style="height: 41px;">
                <div class="col-xs-6">
                    <div class="fl">
                        <span class="font-cf00-16 font-weight">¥</span>
                        <span class="font-cf00-22 font-weight" style="margin-left: -4px;">{{ salesPrice | addComma }}</span>
                        <span class="font-b8b8-16" style="margin-left: -3px;">/{{ unit }}</span>
                        <span v-show="originalPrice !== 0" class="font-b8b8-16 text-through ml-15">¥{{ originalPrice | addComma }}</span>
                    </div>
                </div>
                <div class="col-xs-6">
                    <transition name="slide-fade">
                        <div v-show="isAdWord" class="font-weight fr mt-5" style="font-size: 15px; color: #0084ff;">{{ adWords2 }}</div>
                    </transition>
                </div>
            </b-row>
            <div class="mb-15" v-if="eventStatus === '1'">
                <div v-if="freeShippingNeededPrice !== 0" class="free-price-item red" style="display: inline-block;">满 {{ freeShippingNeededPrice | addComma }} 包邮</div>
                <div v-if="freePackageNeededPrice !== 0" class="free-price-item green" style="display: inline-block;">满 {{ freePackageNeededPrice | addComma }} 免包装费</div>
            </div>
            <div class="font-222-20 font-weight mb-15">{{ name }}</div>
            <div class="font-8a8a-16 border-btm-3 pb-20 mb-15">{{ adWords }}</div>
            <b-row class="mb-10">
                <img class="fl" src="../../assets/images/ico_delivery_2.png" alt="" style="width: 22px; height: 18px;">
                <div class="font-222-15 ml-6">延吉市内预计1小时内送达</div>
            </b-row>
            <b-row class="mb-10">
                <img class="fl" src="../../assets/images/ico_delivery_1.png" alt="" style="width: 20px; height: 17px;">
                <div class="font-222-15 ml-6">全国72小时发货</div>
            </b-row>
        </div>
        <div v-show="props.length !== 0" class="padding-default background-white mb-15">
            <div class="font-222-16 mb-20">商品规格</div>
            <div class="mb-10" v-for="(item, index) in props" :key="index">
                <div v-if="item.status === '1'" style="display: flex; align-items: center;">
                    <div style="width: 35%;">
                        <div class="font-b8b8-15">{{ item.key }}</div>
                    </div>
                    <div style="width: 65%;">
                        <div class="font-222-15 pl-5">{{ item.value }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="background-white mb-15">
            <ShopItem class="mb-15" ref="shopItem" :shopId="shopId" :shopName="shopName" :age="age" :starNum="starNum" :shopIntro="shopIntro" :goods="goods" :avatarUri="avatarUri" :view="'goods_detail'" />
        </div>
        <div v-show="intro !== null && intro !== ''" class="padding-default background-white mb-15">
            <div class="font-222-16 mb-20">商品详情</div>
            <div ref="goodsIntro" class="mb-15 v-html" v-html="intro"></div>
        </div>
        <div class="padding-default background-white">
            <div ref="goodsFooter" class="v-html" v-html="footer"></div>
        </div>
        <div class="text-center font-222-12 pt-15">ICP证: <a style="color: dodgerblue; text-decoration: underline;" href="https://beian.miit.gov.cn/" target="_blank">吉ICP备20003633号-1</a></div>
    </div>
    <!-- 하단 메뉴바 -->
    <div :class="{'detail-menubar-android': isPhone, 'detail-menubar-iphone': !isPhone}">
        <b-row>
            <div class="col-xs-9">
                <b-row>
                    <div class="col-xs-3 text-center">
                        <nuxt-link :to="'/main'">
                            <img src="../../assets/images/ico_main_1.png" alt="" style="width: 32px; height: 38px;">
                        </nuxt-link>
                    </div>
                    <div class="col-xs-3 text-center">
                        <a href="https://chat16.live800.com/live800/chatClient/chatbox.jsp?companyID=1431825&configID=153858&jid=2924429018&s=1">
                            <img src="../../assets/images/ico_message.png" alt="" style="width: 22px; height: 38px;">
                        </a>
                    </div>
                    <div class="col-xs-3 text-center">
                        <img v-if="collectionStatus === '0'" src="../../assets/images/ico_favority_unselected.png" alt="" style="width: 25px; height: 38px;" @click="setFavority">
                        <img v-else src="../../assets/images/ico_favority_selected.png" alt="" style="width: 25px; height: 38px;" @click="setFavority">
                    </div>
                    <div class="col-xs-3">
                        <div class="pos-re" style="width: 28px; height: 38px; margin: 0 auto;" @click="redirectCart">
                            <img src="../../assets/images/ico_cart_1.png" alt="" style="width: 28px; height: 38px;">
                            <div v-if="cartCount !== 0" class="icon-cnt" style="top: -6px; right: -7px;">{{ cartCount }}</div>
                        </div>
                    </div>
                </b-row>
            </div>
            <div class="col-xs-3 text-center">
                <div v-if="status === '1'">
                    <div v-if="isShowOverlay === false" class="radius-20 font-222-14 pt-12 pb-11 font-weight" style="background-color: #ffcc33;" @click="setOptionBuying">加入购物车</div>
                    <div v-else-if="sizes.length !== 0 && activeId === 0" class="radius-20 font-222-14 pt-12 pb-11 font-weight" style="background-color: #bfbfbf; color: #fff !important;">加入购物车</div>
                    <div v-else class="radius-20 font-222-14 pt-12 pb-11 font-weight" style="background-color: #ffcc33;" @click="setBuying">加入购物车</div>
                </div>
                <div v-else>
                    <div class="radius-20 font-222-14 pt-12 pb-11 font-weight" style="background-color: #bfbfbf; color: #fff !important;">商品已下架</div>
                </div>
            </div>
        </b-row>
    </div>
    <!-- 옵션부분 -->
    <div ref="option" class="option-tool">
        <div class="text-right padding-default pb-0 pt-8">
            <img src="../../assets/images/ico_cancel_1.png" alt="" style="width: 18px;" @click="setCancelOption">
        </div>
        <b-row class="padding-default border-btm-3">
            <div class="col-xs-3">
                <img class="prod-thumbnail" :src="optGoodsUri" alt="">
            </div>
            <div class="col-xs-9">
                <div class="content-width font-222-15 line-height-2 mt-3 mb-8">{{ optGoodsName }}</div>
                <div v-if="sizes.length === 0" class="font-cf00-18 font-weight">¥{{ optSalePrice | addComma }}</div>
                <div v-if="activeId === 0 && sizes.length !== 0" class="font-cf00-18 font-weight">¥{{ optGoodsFirstPrice | addComma }} ~ {{ optGoodsLastPrice | addComma }}</div>
                <div v-else-if="activeId !== 0 && sizes.length !== 0" class="font-cf00-18 font-weight">¥{{ optSalePrice | addComma }}</div>
            </div>
        </b-row>
        <div class="padding-default">
            <div v-show="sizes.length !== 0" class="mb-10">
                <div class="font-222-15 font-weight mb-6">规格:</div>
                <b-row>
                    <div v-for="item in sizes" :key="item.id" class="option_item" @click="setOptionItem(item.id)" :class="{active: isActive(item.id)}">{{ item.sizeName }}</div>
                </b-row>
            </div>
            <div v-show="isShowGoodsCount">
                <div class="font-222-15 font-weight mb-10">购买数量:</div>
                <div class="font-222-14 text-center mb-5" style="width: 96px;">{{ optWeight | addCommaTwo }}kg</div>
                <div ref="count_quantity" class="count-quantity mb-18" style="width: 96px;">
                    <b-row>
                        <div class="minus" @click="setMinuse">
                            <img src="../../assets/images/ico_minus.png" alt="" style="width: 10px; height: 1px;">
                        </div>
                        <div class="number">
                            <input class="number-input" id="number" type="text" inputmode="numeric" v-model="goodsCount" name="" value="">
                        </div>
                        <div class="plus" @click="setPlus">
                            <img src="../../assets/images/ico_plus.png" alt="" style="width: 10px; height: 10px;">
                        </div>
                    </b-row>
                </div>
            </div>
        </div>
    </div>

    <!-- 애니메이션 볼 -->
    <BallAnimate :ball="balls" :dropBall="dropBall" :pos_x="pos_x" :pos_y="22" :styles="ball_style" />

    <!-- 상품이미지상세보기 -->
    <div v-show="isCancelImageDetail" style="display: flex; justify-content: flex-end;">
        <div class="back_overlay" style="z-index: 5000; background-color: #000;"></div>
        <div class="pos-fix padding-default" style="z-index: 6000; top: 0;" @click="setCancelImageDetail">
            <img src="../../assets/images/ico_cancel_6.png" alt="" style="width: 20px; height: 20px; cursor: pointer;">
        </div>
        <swiper ref="image_detail" class="swiper mod_slider_viewer" :options="swiperImage" @slideChangeTransitionStart="onSwiperSlideChangeDetail">
            <swiper-slide class="swiper-slide" v-if="goodsVideo !== '' && goodsVideo !== null && goodsVideo !== undefined" style="display: flex; align-items: center; justify-content: center;">
                <video ref="goods_video_detail" class="goods-detail-thumbnail" playsinline autoplay="false" preload="auto" controls poster="">
                    <source :src="goodsVideo" type="video/mp4">
                </video>
            </swiper-slide>
            <swiper-slide class="swiper-slide" v-for="(item, index) in imgs" :key="index" style="display: flex; align-items: center;">
                <div class="swiper-zoom-container">
                    <img class="goods-detail-thumbnail" :src="item.uri" alt="" />
                </div>
            </swiper-slide>
            <div class="page-number-1" slot="pagination"></div>
        </swiper>
    </div>
</div>
</template>

<script>
import define from '@/utility/define'
import ShopItem from '@/components/MainShopItem' // 점포컴포넨트
import BallAnimate from '@/components/BallAnimate' // 장바구니 클릭시 애니메이션

import {
    getGoodsDetail,
    getShops,
    setCollectionStatus
} from '@/api/goods'

import {
    getCartCount,
    setAddCart
} from '@/api/cart'

export default {
    name: "goods_detail",
    components: {
        ShopItem,
        BallAnimate
    },
    beforeDestroy() {
        clearInterval(this.interval)
    },
    destroyed() {
        clearInterval(this.interval)
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, false)
        this.$nuxt.$emit('handleNoticeShow', true)

    },
    head() {
        return {
            title: this.name
        }
    },
    watch: { // 동일 라우터에서 호출하는 경우 새로운 데이터를 업데이트를 하기 위함(해당 라우팅이 변경되였는지 감지)
        $route(to, form) {
            if (to.fullPath !== form.fullPath) {
                this.$router.go()
            }
        }
    },
    async mounted() {
        this.$utility.scrollToTop()
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        window.addEventListener('scroll', this.setScrollEvent)
        window.addEventListener('keyup', this.setFilterValue)
        window.addEventListener('focusout', this.setFocusValue)
        this.$utility.checkNetworkStatus()
        this.$utility.addWechatOptionTool()
        this.$utility.setPushBaiduScript()

        this.freePackageStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freePackageStatus : '0'
        this.freePackageNeededPrice = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freePackageNeededPrice : 0
        this.freeShippingStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeShippingStatus : '0'
        this.freeShippingNeededPrice = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeShippingNeededPrice : 0

        if (this.imgs.length !== 0) {
            this.$weixin.setWechatShare(window.location.href + '&flag=2', this.name + ' - ' + this.adWords + ' -  【延吉西市场】延边朝鲜族特产集散地', this.imgs[0].uri, '')
        }

        this.watermarkPic = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).watermarkPic : ''
        this.watermarkWord = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).watermarkWord : ''
        this.footer = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).footer : ''

        // 위챗공유로 해당 페지를 방문하는 경우 이전 정보들 초기화
        if (this.$route.query.flag) {
            this.$utility.setAllClearCookieAndStorageData('all')
        }

        this.$nextTick(() => {
            // 동영상플레이어 설정
            setTimeout(() => {
                if (this.$refs.goods_video) {
                    this.$refs.goods_video.src = this.goodsVideo

                    if (localStorage.getItem('network_status') === 'network_type:wifi') {
                        this.setVideoPlay()
                    } else {
                        this.setInitVideoMain()
                        this.setInitVideoDetail()
                    }
                }
            }, 200)
        })

        this.interval = setInterval(() => {
            this.isAdWord = !this.isAdWord
        }, 1000)

        if (navigator.userAgent.match(/android/i)) {
            this.isPhone = true
            this.ball_style.left = '61%'
            this.pos_x = 54
        } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.isPhone = false
            this.ball_style.left = '61%'
            this.pos_x = 54
        } else {
            this.ball_style.left = '52.5%'
            this.pos_x = 51.5

            this.$nextTick(() => {
                // 동영상플레이어 설정
                setTimeout(() => {
                    this.setVideoPlay()
                }, 300)
            })
        }

        if (sessionStorage.getItem('token') !== '' && sessionStorage.getItem('token')) {
            this.getCartCountData()
        }

        if (this.name === '') {
            await this.getGoodDetailData()
        }

        if (this.goods.length === 0) {
            await this.getShopData()
        }
    },
    async asyncData(context) {
        const prodId = context.query.productid === undefined ? 1 : context.query.productid
        const shopId = context.query.shopid === undefined ? 1 : context.query.shopid
        const prodData = await getGoodsDetail(prodId)
        const shopData = await getShops(shopId, prodId)

        return {
            prodId: parseInt(prodId),
            shopId: parseInt(shopId),
            sizeId: prodData.res !== undefined ? prodData.res.data.sizeId : 0,
            name: prodData.res !== undefined ? prodData.res.data.name : '',
            imgs: prodData.res !== undefined ? prodData.res.data.imgs : [],
            sizes: prodData.res !== undefined ? prodData.res.data.sizes : [],
            props: prodData.res !== undefined ? prodData.res.data.props : [],
            status: prodData.res !== undefined ? prodData.res.data.status : [],
            intro: prodData.res !== undefined ? prodData.res.data.intro : [],
            originalPrice: prodData.res !== undefined ? prodData.res.data.originalPrice : 0,
            salesPrice: prodData.res !== undefined ? prodData.res.data.salesPrice : 0,
            weight: prodData.res !== undefined ? prodData.res.data.weight : 0,
            adWords: prodData.res !== undefined ? prodData.res.data.adWords : '',
            adWords2: prodData.res !== undefined ? prodData.res.data.adWords2 : '',
            unit: prodData.res !== undefined ? prodData.res.data.unit : '',
            collectionStatus: prodData.res !== undefined ? prodData.res.data.collectionStatus : '',
            goodsVideo: prodData.res !== undefined ? prodData.res.data.video : '',
            shopName: shopData.res !== undefined ? shopData.res.data.shopName : '',
            age: shopData.res !== undefined ? shopData.res.data.age : 0,
            starNum: shopData.res !== undefined ? shopData.res.data.starNum : 0,
            goodsNum: shopData.res !== undefined ? shopData.res.data.goodsNum : 0,
            avatarUri: shopData.res !== undefined ? shopData.res.data.avatarUri : '',
            shopIntro: shopData.res !== undefined ? shopData.res.data.shopIntro : '',
            goods: shopData.res !== undefined ? shopData.res.data.goods : [],
            eventStatus: prodData.res !== undefined ? prodData.res.data.eventStatus ? prodData.res.data.eventStatus : '0' : '0'
        }
    },
    data() {
        return {
            isShowOverlay: false,
            interval: null,
            isPhone: true,
            isAdWord: true,
            prodId: 0, // 상품아이디
            shopId: 0, // 상품이 포함된 점포아이디
            sizeId: 0, // 옵션상품아이디
            name: '', // 상품명
            status: '', // 상품상태
            intro: '', // 상품소개글
            originalPrice: 0, // 이전판매가
            salesPrice: 0, // 판매가
            weight: 0, // 상품무게
            adWords: '', // 광고글1
            adWords2: '', // 광고글2
            unit: '', // 상품단위
            collectionStatus: '0', // 즐겨찾기 추가여부
            imgs: [], // 상품이미지배렬
            goodsVideo: '', // 상품동영상URL
            isPlay: false, // 동영상실행여부
            intervalPlay: 0, // 동영상실행카운트값
            sizes: [], // 옵션상품배렬
            props: [], //  상품속성배렬
            shopName: '', // 점포명
            age: 0, // 점포오픈년도
            starNum: 0, // 점포등급
            goodsNum: 0, // 점포에 속한 총상품수
            avatarUri: '', // 점포이미지
            shopIntro: '', // 점포소개글
            goods: [], // 점포에 속한 상품배렬
            optGoodsName: '', // 상품속성메뉴에서의 상품명
            optGoodsUri: '', // 상품속성메뉴에서의 썸네일
            optSalePrice: 0, // 상품속성메뉴에서 선택된 옵션상품의 판매가격
            optWeight: 0, // 상품속성메뉴에서 선택된 옵션상품의 무게
            optGoodsFirstPrice: 0, // 상품속성메뉴에서 옵션상품이 있는 경우 첫 옵션상품의 가격
            optGoodsLastPrice: 0, // 상품속성메뉴에서 옵션상품이 있는 경우 마지막 옵션상품의 가격
            activeId: 0, // 상품속성메뉴에서 옵션상품들을 선택했을 때 해당 옵션상품의 아이디
            isShowGoodsCount: false, // 상품개수설정부분 로출여부
            goodsCount: 1, // 상품구매개수
            cartCount: 0, // 장바구니에 담긴 상품개수
            footer: '',
            isCancelImageDetail: false, // 상품이미지상세보기 로출상태
            watermarkPic: '',
            watermarkWord: '',
            eventStatus: '0',
            freePackageStatus: '0',
            freePackageNeededPrice: 0,
            freeShippingStatus: '0',
            freeShippingNeededPrice: 0,
            swiperGoods: {
                spaceBetween: 7,
                centeredSlides: true,
                slidesPerView: 1,
                pagination: {
                    el: '.page-number',
                    type: 'fraction'
                }
            },
            swiperImage: {
                spaceBetween: 5,
                zoom: true,
                pagination: {
                    el: '.page-number-1',
                    type: 'fraction'
                }
            },
            balls: [{
                show: false,
                index: 0
            }],
            dropBall: [],
            ball_style: {
                left: '60%',
                bottom: '22px'
            },
            pos_x: 0,
            isProdStatus: ''
        }
    },
    methods: {
        setFilterValue(element) {
            if (element.target.id === 'number') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 2)
                this.goodsCount = element.target.value === '' ? 0 : parseInt(element.target.value)

                if (this.goodsCount !== 0) {
                    if (this.sizes.length === 0) { // 옵션상품이 아니라면
                        if (this.salesPrice.toString().indexOf('.') !== -1) {
                            const temp = this.salesPrice.toString().split('.')[1]

                            if (temp.length === 1) {
                                this.optSalePrice = (parseInt(parseFloat(this.salesPrice) * 10) * parseInt(this.goodsCount)) / 10
                            } else if (temp.length === 2) {
                                this.optSalePrice = (parseInt(parseFloat(this.salesPrice) * 100) * parseInt(this.goodsCount)) / 100
                            }
                        } else {
                            this.optSalePrice = parseInt(this.salesPrice) * parseInt(this.goodsCount)
                        }

                        this.optWeight = parseFloat(this.weight) * this.goodsCount
                    } else { // 옵션상품이면
                        this.sizes.filter(res => {
                            if (res.id === this.activeId) {
                                if (res.sizePrice.toString().indexOf('.') !== -1) {
                                    const temp = res.sizePrice.toString().split('.')[1]

                                    if (temp.length === 1) {
                                        this.optSalePrice = (parseInt(parseFloat(res.sizePrice) * 10) * parseInt(this.goodsCount)) / 10
                                    } else if (temp.length === 2) {
                                        this.optSalePrice = (parseInt(parseFloat(res.sizePrice) * 100) * parseInt(this.goodsCount)) / 100
                                    }
                                } else {
                                    this.optSalePrice = parseInt(res.sizePrice) * parseInt(this.goodsCount)
                                }

                                this.optWeight = parseFloat(res.sizeWeight) * this.goodsCount
                            }
                        })
                    }
                } else {
                    if (this.sizes.length === 0) { // 옵션상품이 아니라면
                        this.optSalePrice = this.salesPrice
                        this.optWeight = parseFloat(this.weight)
                    } else { // 옵션상품이면
                        this.sizes.filter(res => {
                            if (res.id === this.activeId) {
                                this.optSalePrice = res.sizePrice
                                this.optWeight = parseFloat(res.sizeWeight)
                            }
                        })
                    }
                }
            }
        },
        setFocusValue(element) {
            if (element.target.id === 'number') {
                this.goodsCount = parseInt(element.target.value) === 0 ? 1 : parseInt(element.target.value)
            }
        },
        setScrollEvent() {
            this.$nextTick(() => {
                // 상품소개부분(페지로딩할 때 width를 100%로 고정시키기)
                if (this.$refs.goodsIntro) {
                    const element = this.$refs.goodsIntro.getElementsByClassName('wscnph')

                    for (let i = 0; i < element.length; i++) {
                        element[i].setAttribute('width', '100%')
                        element[i].classList.add('v-lazy-image')
                        element[i].classList.add('v-lazy-image-loaded')
                    }
                }

                // 상품하단내용(페지로딩할 때 width를 100%로 고정시키기)
                if (this.$refs.goodsFooter) {
                    const footerElem = this.$refs.goodsFooter.getElementsByClassName('wscnph')

                    for (let i = 0; i < footerElem.length; i++) {
                        footerElem[i].setAttribute('width', '100%')
                        footerElem[i].classList.add('v-lazy-image')
                        footerElem[i].classList.add('v-lazy-image-loaded')
                    }
                }

                this.setInitVideoMain()
            })
        },
        async getGoodDetailData() {
            const prodData = await getGoodsDetail(this.prodId)

            this.sizeId = prodData.res !== undefined ? prodData.res.data.sizeId : 0
            this.name = prodData.res !== undefined ? prodData.res.data.name : ''
            this.imgs = prodData.res !== undefined ? prodData.res.data.imgs : []
            this.sizes = prodData.res !== undefined ? prodData.res.data.sizes : []
            this.props = prodData.res !== undefined ? prodData.res.data.props : []
            this.status = prodData.res !== undefined ? prodData.res.data.status : []
            this.intro = prodData.res !== undefined ? prodData.res.data.intro : []
            this.originalPrice = prodData.res !== undefined ? prodData.res.data.originalPrice : 0
            this.salesPrice = prodData.res !== undefined ? prodData.res.data.salesPrice : 0
            this.weight = prodData.res !== undefined ? prodData.res.data.weight : 0
            this.adWords = prodData.res !== undefined ? prodData.res.data.adWords : ''
            this.adWords2 = prodData.res !== undefined ? prodData.res.data.adWords2 : ''
            this.unit = prodData.res !== undefined ? prodData.res.data.unit : ''
            this.collectionStatus = prodData.res !== undefined ? prodData.res.data.collectionStatus : ''
            this.goodsVideo = prodData.res !== undefined ? prodData.res.data.video : ''
            this.eventStatus = prodData.res !== undefined ? prodData.res.data.eventStatus ? prodData.res.data.eventStatus : '0' : '0'
        },
        async getShopData() {
            const shopData = await getShops(this.shopId, this.prodId)

            this.shopName = shopData.res !== undefined ? shopData.res.data.shopName : ''
            this.age = shopData.res ? shopData.res.data.age : 0
            this.starNum = shopData.res ? shopData.res.data.starNum : 0
            this.goodsNum = shopData.res ? shopData.res.data.goodsNum : 0
            this.avatarUri = shopData.res ? shopData.res.data.avatarUri : ''
            this.shopIntro = shopData.res ? shopData.res.data.shopIntro : ''
            this.goods = shopData.res ? shopData.res.data.goods : []
        },
        getCartCountData() {
            this.$nuxt.$emit('handleLoading', true)

            getCartCount().then(response => {
                if (response.res !== undefined) {
                    this.cartCount = response.res.data
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setFavority() { // 즐겨찾기에 추가
            if (sessionStorage.getItem('token') === '' || !sessionStorage.getItem('token')) {
                if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                    window.location.href = define.AUTH_URL + '?id=' + this.shopId + '-' + this.prodId + '&type=goods_detail'
                } else {
                    this.$router.push({
                        path: '/qr_view'
                    })
                }

                return
            }

            this.$nuxt.$emit('handleLoading', true)

            setCollectionStatus(this.prodId).then(response => {
                if (response.res !== undefined) {
                    if (this.collectionStatus === '0') {
                        this.collectionStatus = '1'
                        this.$utility.showToast('已收藏')
                    } else {
                        this.collectionStatus = '0'
                        this.$utility.showToast('已取消收藏')
                    }
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        isActive(optionId) { // 옵션상품아이템 클릭 시 active 추가
            return this.activeId === optionId
        },
        setOptionItem(optionId) { // 옵션상품 선택 처리
            this.activeId = optionId

            this.sizes.filter(res => {
                if (res.id === optionId) {
                    this.optSalePrice = res.sizePrice
                    this.optGoodsUri = res.imgUri
                    this.optWeight = res.sizeWeight
                }
            })

            this.isShowGoodsCount = true
            this.goodsCount = 1
        },
        setPlus() { // 상품개수 증가
            if (parseInt(this.goodsCount) >= 99) {
                return
            }

            this.goodsCount = parseInt(this.goodsCount) + 1

            if (this.sizes.length === 0) { // 옵션상품이 아니라면
                if (this.salesPrice.toString().indexOf('.') !== -1) {
                    const temp = this.salesPrice.toString().split('.')[1]

                    if (temp.length === 1) {
                        this.optSalePrice = (parseInt(parseFloat(this.salesPrice) * 10) * parseInt(this.goodsCount)) / 10
                    } else if (temp.length === 2) {
                        this.optSalePrice = (parseInt(parseFloat(this.salesPrice) * 100) * parseInt(this.goodsCount)) / 100
                    }
                } else {
                    this.optSalePrice = parseInt(this.salesPrice) * parseInt(this.goodsCount)
                }

                this.optWeight = parseFloat(this.weight) * parseInt(this.goodsCount)
            } else { // 옵션상품이면
                this.sizes.filter(res => {
                    if (res.id === this.activeId) {
                        if (res.sizePrice.toString().indexOf('.') !== -1) {
                            const temp = res.sizePrice.toString().split('.')[1]

                            if (temp.length === 1) {
                                this.optSalePrice = (parseInt(parseFloat(res.sizePrice) * 10) * parseInt(this.goodsCount)) / 10
                            } else if (temp.length === 2) {
                                this.optSalePrice = (parseInt(parseFloat(res.sizePrice) * 100) * parseInt(this.goodsCount)) / 100
                            }
                        } else {
                            this.optSalePrice = parseInt(res.sizePrice) * parseInt(this.goodsCount)
                        }

                        this.optWeight = parseFloat(res.sizeWeight) * parseInt(this.goodsCount)
                    }
                })
            }
        },
        setMinuse() { // 상품개수 감소
            if (parseInt(this.goodsCount) === 1) {
                return
            }

            this.goodsCount = parseInt(this.goodsCount) - 1

            if (this.sizes.length === 0) { // 옵션상품이 아니라면
                if (this.salesPrice.toString().indexOf('.') !== -1) {
                    const temp = this.salesPrice.toString().split('.')[1]

                    if (temp.length === 1) {
                        this.optSalePrice = (parseInt(parseFloat(this.optSalePrice) * 10) - parseInt(parseFloat(this.salesPrice) * 10)) / 10
                    } else if (temp.length === 2) {
                        this.optSalePrice = (parseInt(parseFloat(this.optSalePrice) * 100) - parseInt(parseFloat(this.salesPrice) * 100)) / 100
                    }
                } else {
                    this.optSalePrice -= parseInt(this.salesPrice)
                }

                this.optWeight -= parseFloat(this.weight)
            } else { // 옵션상품이면
                this.sizes.filter(res => {
                    if (res.id === this.activeId) {
                        if (res.sizePrice.toString().indexOf('.') !== -1) {
                            const temp = res.sizePrice.toString().split('.')[1]

                            if (temp.length === 1) {
                                this.optSalePrice = (parseInt(parseFloat(this.optSalePrice) * 10) - parseInt(parseFloat(res.sizePrice) * 10)) / 10
                            } else if (temp.length === 2) {
                                this.optSalePrice = (parseInt(parseFloat(this.optSalePrice) * 100) - parseInt(parseFloat(res.sizePrice) * 100)) / 100
                            }
                        } else {
                            this.optSalePrice -= parseInt(res.sizePrice)
                        }

                        this.optWeight -= parseFloat(res.sizeWeight)
                    }
                })
            }
        },
        setOptionBuying() { // 상품메뉴 로출
            this.isShowOverlay = true
            this.optGoodsName = this.name
            this.optGoodsUri = this.imgs.length !== 0 ? this.imgs[0].uri : ''
            this.optSalePrice = this.sizes.length === 0 ? this.salesPrice : 0
            this.optWeight = this.sizes.length === 0 ? this.weight : 0
            this.optGoodsFirstPrice = this.sizes.length !== 0 ? this.sizes[0].sizePrice : 0
            this.optGoodsLastPrice = this.sizes.length !== 0 ? this.sizes[this.sizes.length - 1].sizePrice : 0
            this.isShowGoodsCount = this.sizes.length === 0

            this.$nextTick(() => {
                if (this.$refs.option) {
                    this.$refs.option.classList.toggle('collapsed')
                }

                // 스크롤 막기
                if (this.$refs.goods_detail) {
                    this.$refs.goods_detail.style.overflowY = 'hidden'
                }
            })
        },
        setCancelOption() { // 상품메뉴 닫기
            this.isShowOverlay = false
            this.activeId = 0

            this.$nextTick(() => {
                if (this.$refs.option) {
                    this.$refs.option.classList.toggle('collapsed')
                }

                // 스크롤 허용
                if (this.$refs.goods_detail) {
                    this.$refs.goods_detail.style.overflowY = 'visible'
                }
            })
        },
        async setBuying() { // 구매하기
            if (sessionStorage.getItem('token') === '' || !sessionStorage.getItem('token')) {
                const sizeid = this.sizes.length === 0 ? this.sizeId : this.activeId
                const cnt = this.goodsCount === 0 ? 1 : this.goodsCount
                localStorage.setItem('shopId', this.shopId)
                localStorage.setItem('prodId', this.prodId)
                localStorage.setItem('sizeId', sizeid)
                localStorage.setItem('goodsCount', cnt)

                if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                    window.location.href = define.AUTH_URL + '?id=1-0&type=cart'
                } else {
                    this.$router.push({
                        path: '/qr_view'
                    })
                }

                return
            }

            const prod = await getGoodsDetail(this.prodId)

            if (prod.res) {
                if (prod.res.data.status === '0') {
                    this.$utility.showToast('该商品已下架。')
                    return
                }
            }

            for (let i = 0; i < this.balls.length; i++) {
                if (!this.balls[i].show) { //볼의 보기가 할당이 안된 경우
                    let ball = this.balls[i] //빈배렬의 오브젝트 얻기
                    ball.show = true //보기를 true 로 설정
                    ball.el = this.$refs.count_quantity.getElementsByClassName('number')[0] //버튼을 누른 대상을 보관
                    this.dropBall.push(ball) //설정된 값을 가진 볼을 드롭다운 볼 배렬에 추가

                    const query = {
                        goodsId: this.prodId,
                        sizeId: this.sizes.length === 0 ? this.sizeId : this.activeId,
                        num: this.goodsCount === 0 ? 1 : this.goodsCount
                    }

                    setAddCart(query).then(() => {
                        getCartCount().then(resp => {
                            setTimeout(() => {
                                this.cartCount = resp.res.data
                                this.$utility.showToast('已成功加入购物车')
                            }, 600)
                            this.$nuxt.$emit('handleCart', resp.res.data) // 상속된 어미엘리멘트에 장바구니수를 넘기기
                        })
                    })
                }
            }
        },
        redirectCart() {
            if (sessionStorage.getItem('token') === '' || !sessionStorage.getItem('token')) {
                if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                    window.location.href = define.AUTH_URL + '?id=0-0' + '&type=cart'
                } else {
                    this.$router.push({
                        path: '/qr_view'
                    })
                }
                return
            }

            this.$router.push({
                path: '/goods/cart'
            })
        },
        goBack() {
            if (window.history.length === 1 && (sessionStorage.getItem('token') === '' || !sessionStorage.getItem('token'))) {
                this.$router.replace({
                    path: '/main'
                })
            } else {
                this.$router.go(-1)
            }
        },
        setVisibleImageDetail(pos) {
            this.isCancelImageDetail = true
            this.setInitVideoMain()

            this.$nextTick(() => {
                if (this.$refs.image_detail) {
                    this.$refs.image_detail.$swiper.slideTo(pos)
                }

                if (this.$refs.goods_detail) {
                    this.$refs.goods_detail.style.overflowY = 'hidden'
                }
            })
        },
        setCancelImageDetail() {
            this.isCancelImageDetail = false
            this.setInitVideoDetail()

            this.$nextTick(() => {
                if (this.$refs.image_detail) {
                    this.$refs.image_detail.$swiper.zoom.out()
                    this.$refs.image_detail.$swiper.slideTo(0)
                }

                // 스크롤 허용
                if (this.$refs.goods_detail) {
                    this.$refs.goods_detail.style.overflowY = 'visible'
                }
            })
        },
        setInitVideoMain() {
            this.$nextTick(() => {
                if (this.$refs.goods_video) {
                    this.$refs.goods_video.muted = true
                    this.$refs.goods_video.pause()
                    this.$refs.goods_video.currentTime = 0.5
                    this.isPlay = false
                    clearInterval(this.intervalPlay)
                }
            })
        },
        setInitVideoDetail() {
            this.$nextTick(() => {
                if (this.$refs.goods_video_detail) {
                    this.$refs.goods_video_detail.pause()
                    this.$refs.goods_video_detail.currentTime = 0.5
                }
            })
        },
        setVideoPlay() {
            this.$nextTick(() => {
                if (this.$refs.goods_video) {
                    if (this.$refs.goods_video.paused) {
                        this.$refs.goods_video.currentTime = 0.5
                    }

                    this.$refs.goods_video.muted = true
                    const promise = this.$refs.goods_video.play()

                    if (promise !== undefined) {
                        promise.then(_ => {
                            this.$refs.goods_video.play()
                        }).catch((e) => {

                        })
                    }

                    this.isPlay = !this.$refs.goods_video.paused
                    this.intervalPlay = setInterval(this.countTimePlay, 1000)
                }
            })
        },
        onSwiperSlideChangeMain() {
            this.setInitVideoMain()
        },
        onSwiperSlideChangeDetail() {
            this.setInitVideoDetail()
        },
        countTimePlay() {
            this.$nextTick(() => {
                if (this.$refs.goods_video) {
                    if (this.$refs.goods_video.currentTime >= this.$refs.goods_video.duration) {
                        this.setInitVideoMain()
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.detail-menubar-android {
    max-width: 500px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 55px;
    left: 0;
    right: 0;
    background-color: #fff;
    border-top: 1px solid #e7e7e7;
    z-index: 5000;
    padding: 8px 15px 8px 0;
    margin: 0 auto;
}

.detail-menubar-iphone {
    max-width: 500px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 67px;
    left: 0;
    right: 0;
    background-color: #fff;
    border-top: 1px solid #e7e7e7;
    z-index: 5000;
    padding: 8px 15px 8px 15px;
    margin: 0 auto;
}

.mod_slider_viewer {
    max-width: 500px;
    height: 100% !important;
    padding: 0;
    background: transparent;
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 5100 !important;
}

.detail_padding {
    padding-bottom: 70px !important;
}
</style>
