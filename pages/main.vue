<template>
<div id="main" ref="main_detail" style="height: 100%;">
    <div class="back_overlay" v-show="isShowOverlay" @click="cancelPaySuccessDialog"></div>
    <div ref="container" class="container">
        <transition name="fade">
            <div class="search-tool" v-show="isFixedSearch" style="background-color: #fff;" @click="redirectSearch">
                <div class="pos-re">
                    <div id="search" class="search-input pt-11 pb-0 background-white" style="color: #b1b1b1;">请输入关键字</div>
                    <img class="pos-ab search_icon" src="../assets/images/ico_search_1.png" alt="">
                </div>
            </div>
        </transition>
        <div ref="top" class="pos-re background-default">
            <img class="back_size" src="../assets/images/main_top_background.jpg" alt="">
            <!-- 검색부분 -->
            <div ref="search" class="pos-ab search" @click="redirectSearch">
                <div id="search" class="search-input pt-11 pb-0 background-white" style="color: #b1b1b1;">请输入关键字</div>
                <img class="pos-ab search_icon" src="../assets/images/ico_search_1.png" alt="">
            </div>
            <!-- 태그부분 -->
            <div ref="tag" class="main_tag pos-ab">
                <div v-for="(item, index) in tagData" :key="index" class="tag_item" @click="redirectResult(item)">{{ item }}</div>
            </div>
            <!-- 배너부분 -->
            <div class="banner pos-ab">
                <swiper ref="banner_swiper" class="swiper" :options="swiperBanner" @click-slide="handleSwiper">
                    <swiper-slide class="swiper-slide" v-for="item in bannerData" :key="item.imgUri">
                        <img class="radius-10 banner_size" data-src="" :src="item.imgUri" alt="" />
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <!-- 대분류부분 -->
        <div ref="type" class="type_space">
            <div class="type_content">
                <swiper :options="swiperCategory">
                    <swiper-slide class="swiper-slide" v-for="(items, index) in typeData" :key="index">
                        <b-row>
                            <div class="category-item" v-for="(item, idx) in items" :key="idx">
                                <div @click="redirectType(item.id)">
                                    <img class="radius-12 caticon_size" :src="item.iconUri" alt="" />
                                    <div class="font-5252-13 mt-5">{{ item.typeName }}</div>
                                </div>
                            </div>
                        </b-row>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <!-- 이벤트이미지 -->
        <div ref="event" v-show="adValue !== ''" class="event_space">
            <img class="radius-10" src="" alt="" style="width: 100%; height: 150px;">
        </div>
        <!-- 점포부분 -->
        <div ref="shop" class="shop_space">
            <b-row>
                <div class="col-xs-6">
                    <b-row class="mt-7">
                        <img class="fl" src="../assets/images/main_icon_1.png" alt="" style="width: 30px; height: 30px;">
                        <div class="fl ml-6 font-222-18 mt-3 font-weight">商户推荐</div>
                    </b-row>
                </div>
                <div class="col-xs-6">
                    <img class="fr" src="../assets/images/back_1.png" alt="" style="width: 65px; height: 47px;">
                </div>
            </b-row>
            <ShopItem v-for="item in shopData" :key="item.id" :shopId="item.id" :shopName="item.shopName" :age="item.age" :starNum="item.starNum" :shopIntro="item.shopIntro" :goods="item.goods" :avatarUri="item.avatarUri" :view="'load_main'" :shopData="shopData" style="margin-bottom: 15px;" />
            <b-row>
                <b-spinner v-show="loading" variant="primary" small label="Small Spinner" style="margin: 0 auto;"></b-spinner>
            </b-row>
            <div v-show="(page - 1) >= totalPage">
                <div class="text-center font-222-12 mt-15">商户陆续上架中, 合作热线 0433-2651000</div>
                <div class="text-center font-222-12 mt-5">ICP证: <a style="color: dodgerblue; text-decoration: underline;" href="https://beian.miit.gov.cn/" target="_blank">吉ICP备20003633号-1</a></div>
            </div>
        </div>
    </div>
    <!-- 결제완료 다이얼로그 -->
    <div class="dialog-payment text-center" style="padding: 35px 15px 30px 15px;" v-show="isShowDialog">
        <div class="pos-re">
            <img class="pos-ab cancel_set" src="../assets/images/ico_cancel_4.png" alt="" @click="cancelPaySuccessDialog">
        </div>
        <img v-if="isPayStatus" src="../assets/images/ico_success.gif" alt="" style="width: 63px; height: 63px; margin-bottom: 31px;">
        <img v-else src="../assets/images/ico_info.png" alt="" style="width: 73px; height: 63px; margin-bottom: 31px;">
        <div v-if="isPayStatus" class="font-weight mb-15" style="font-size: 25px; color: #cf000e;">支付成功!</div>
        <div v-else class="font-weight mb-15" style="font-size: 25px; color: #50b674;">正在处理...</div>
        <div class="font-5252-12" style="margin-bottom: 24px;">本次支付已成功，详细信息请进入我的订单查看</div>
        <div class="btn_ctrl" @click="redirectOrderDetail">我的订单</div>
    </div>
</div>
</template>

<script>
import ShopItem from '@/components/MainShopItem' // 점포컴포넨트
import WarningDialog from '@/components/WarningDialog'
import soundFile from '@/assets/payment_success.mp3'
import {
    getBanners,
    getShops,
    getTypes
} from '@/api/main'
import {
    getOrderStatus
} from '@/api/order'

export default {
    name: 'Main',
    components: {
        ShopItem,
        WarningDialog
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', true)
        this.$nuxt.$emit('handleOtherMenu', false, false)
        this.$nuxt.$emit('handleNoticeShow', true)
    },
    head() {
        return {
            title: this.sitename
        }
    },
    async mounted() {
        this.sitename = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).sitename : ''
        const logo = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).logo : ''
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기

        // 메인페지를 방문하였다면
        if (localStorage.getItem('load_main') === '1' && localStorage.getItem('main_shop')) {
            this.shopData = JSON.parse(localStorage.getItem('main_shop'))
            this.page = localStorage.getItem('pageMainCount') ? parseInt(localStorage.getItem('pageMainCount')) : 1
        } else {
            this.$utility.scrollToTop()
            localStorage.removeItem('pageMainCount')
            localStorage.removeItem('main_shop')
        }

        window.addEventListener('scroll', this.setScrollValue)
        this.$utility.addWechatOptionTool()
        this.$utility.setPushBaiduScript()
        // 사이트의 이전 정보들 초기화
        this.$utility.setAllClearCookieAndStorageData('main')
        this.$weixin.setWechatShare(window.location.href, '【延吉西市场】- 延边朝鲜族特产集散地-米肠 荞麦面 林蛙 椴树蜜 榛子 糖稀 牛板筋 辣白菜 辣鸡爪 鱼籽酱 啤酒锅 泡菜 米酒 明太鱼 蜂蜜 煎饼 松子 蕨菜 大酱 延边大米 冷面 温面 沙参 牛肉汤 鱼子酱打糕 苏子叶 参鸡汤 辣椒酱', logo, '')

        if (this.bannerData.length === 0) {
            await this.getBannerData()
        }

        if (this.typeData.length === 0) {
            await this.getTypeData()
        }

        if (this.shopData.length === 0) {
            await this.getShopData()
        }

        this.orderNumber = localStorage.getItem('orderNumber') ? localStorage.getItem('orderNumber') : ''
        this.orderId = localStorage.getItem('orderId') ? localStorage.getItem('orderId') : ''
        this.tagData = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).tag.split(',') : [] // 키워드 얻기

        // 결제성공상태가 TRUE이면 결제성공 다이얼로그 로출
        if (this.orderNumber !== '') {
            this.showPaySuccessDialog()
        }
    },
    async asyncData() {
        let typeData = []
        let resData = {}

        const banner = await getBanners()

        if (banner.res !== undefined) {
            resData.bannerData = banner.res.data
        }

        const type = await getTypes()

        if (type.res !== undefined) {
            let tempData = []
            let count = 0

            type.res.data.filter(res => {
                if (count === 10) {
                    typeData.push(tempData)
                    tempData = []
                    count = 0
                }
                tempData.push(res)
                count++
            })

            if (tempData.length !== 0) {
                typeData.push(tempData)
            }

            resData.typeData = typeData
        }

        const query = {
            page: 1
        }
        const shop = await getShops(query)

        if (shop.res !== undefined) {
            resData.shopData = shop.res.data.list
            resData.totalNum = shop.res.data.totalNum
            resData.page = shop.res.data.page
            resData.size = shop.res.data.size
            resData.totalPage = shop.res.data.totalNum % shop.res.data.size === 0 ? shop.res.data.totalNum / shop.res.data.size : parseInt(shop.res.data.totalNum / shop.res.data.size) + 1
        }

        return resData
    },
    data() {
        return {
            sitename: '',
            isShowDialog: false,
            isPayStatus: false,
            isShowOverlay: false,
            isShowNotice: false,
            isShowWarning: false,
            soundFile: soundFile,
            tagData: [], // 키워드배렬
            bannerTempData: [],
            bannerData: [], // 메인배너배렬
            typeData: [], // 대분류배렬
            shopData: [], // 점포배렬
            adValue: '', // 광고
            orderNumber: 0, // 주문번호
            orderId: 0, // 주문아이디
            isFixedSearch: false,
            totalNum: 0, // 총 점포수
            totalPage: 1, // 총 페지수
            page: 1, // 페지수
            size: 10, // 페지당 점포수
            loading: false,
            scrollEvent: false,
            swiperBanner: { // 배너스와이프 옵션
                spaceBetween: 50,
                centeredSlides: true,
                slidesPerView: 1,
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
            },
            swiperTag: {
                direction: 'horizontal',
                slidesPerView: 'auto',
                freeMode: true,
                scrollbar: {
                    el: '.swiper-scrollbar'
                }
            },
            swiperCategory: { // 카테고리스와이프
                spaceBetween: 10
            }
        }
    },
    methods: {
        setScrollValue() {
            this.$nextTick(() => {
                if (this.$refs.search) {
                    const top = this.$refs.tag.getBoundingClientRect().top - this.$refs.search.offsetHeight
                    this.isFixedSearch = top <= 10
                }

                if (this.$refs.shop) {
                    const scrollPos = parseInt(window.document.body.offsetHeight + window.scrollY)
                    const elemHeight = this.$refs.shop.clientHeight + this.$refs.top.offsetHeight + this.$refs.type.offsetHeight + this.$refs.event.offsetHeight

                    if (this.scrollEvent) {
                        return
                    }

                    if (scrollPos >= elemHeight - 5) {
                        this.scrollEvent = true
                        this.page += 1

                        if (this.page > this.totalPage) {
                            this.scrollEvent = false
                            return
                        }

                        this.loading = true
                        localStorage.setItem('pageMainCount', this.page)
                        const query = {
                            page: this.page
                        }

                        setTimeout(() => {
                            getShops(query).then(response => {
                                if (response.res !== undefined) {
                                    if (response.res.data.list !== null) {
                                        response.res.data.list.filter(res => {
                                            this.shopData.push(res)
                                        })

                                        localStorage.setItem('main_shop', JSON.stringify(this.shopData))
                                    }
                                }

                                this.loading = false
                                this.scrollEvent = false
                            })
                        }, 1000)
                    }
                }
            })
        },
        async getBannerData() {
            const banner = await getBanners()

            if (banner.res !== undefined) {
                this.bannerData = banner.res.data
            }
        },
        async getTypeData() {
            const type = await getTypes()

            if (type.res !== undefined) {
                let tempData = []
                let count = 0

                type.res.data.filter(res => {
                    if (count === 10) {
                        this.typeData.push(tempData)
                        tempData = []
                        count = 0
                    }
                    tempData.push(res)
                    count++
                })

                if (tempData.length !== 0) {
                    this.typeData.push(tempData)
                }
            }
        },
        async getShopData() {
            const shop = await getShops({
                page: 1
            })

            if (shop.res !== undefined) {
                if (shop.res.data.list !== null) {
                    this.shopData = shop.res.data.list
                }
            }
        },
        handleSwiper() { // 메인배너스와이프 클릭이벤트
            this.$nextTick(() => {
                let position = 0

                if (this.$refs.banner_swiper) {
                    position = this.$refs.banner_swiper.$swiper.clickedSlide.dataset.swiperSlideIndex
                }

                const data = this.bannerData[position]
                localStorage.setItem('load_main', 1)
                localStorage.setItem('main_shop', JSON.stringify(this.shopData))

                switch (data.adType) {
                    case 2: // 상품
                        this.$router.push({
                            path: '/goods/goods_detail?shopid=' + data.additionalInfo + '&productid=' + data.entityId
                        })
                        break
                    case 3: // 점포
                        this.$router.push({
                            path: '/shop/shop_detail?shopid=' + data.entityId + '&productid=0'
                        })
                        break
                    case 4: // 이벤트
                    case 5: // 주제
                        break
                    case 6: // 검색키워드
                        this.addSearchWord(data.entityName)
                        this.$router.push({
                            path: '/search/search_result?word=' + data.entityName + '&typeid=0'
                        })
                        break
                }
            })
        },
        redirectResult(word) {
            this.addSearchWord(word)

            this.$router.push({
                path: '/search/search_result?word=' + word + '&typeid=0'
            })
        },
        addSearchWord(word) { // 최근검색어 등록
            let isExist = false
            const words = localStorage.getItem('words')
            const array = words ? words.split(',') : []

            array.filter(res => {
                if (word === unescape(res.trim())) {
                    isExist = true
                }
            })

            if (!isExist) {
                if (words === '') {
                    localStorage.setItem('words', escape(word.trim()))
                } else {
                    localStorage.setItem('words', escape(word.trim()) + ',' + words)
                }
            }
        },
        showPaySuccessDialog() { // 결제완료 다이얼로그 로출
            this.isShowOverlay = true
            this.isShowDialog = true

            getOrderStatus(this.orderNumber).then(response => {
                if (response.res !== undefined) {
                    if (response.res.data.status === 2 || response.res.data.status === 7 || response.res.data.status === 8) { // 결제완료이면
                        this.isPayStatus = true
                        localStorage.setItem('orderNumber', '') // 결제성공 상태값 설정
                        localStorage.setItem('orderId', '') // 주문아이디 설정
                        const sound = new Audio(this.soundFile)
                        const promise = sound.play()

                        if (promise !== undefined) {
                            promise.then(() => {
                                sound.play()
                            }).catch((err) => {
                                console.log(err)
                            })
                        }
                    } else {
                        setTimeout(() => {
                            getOrderStatus(this.orderNumber).then(response => {
                                if (response.res !== undefined) {
                                    if (response.res.data.status === 2 || response.res.data.status === 7 || response.res.data.status === 8) { // 결제완료이면
                                        this.isPayStatus = true
                                        localStorage.setItem('orderNumber', '') // 결제성공 상태값 설정
                                        localStorage.setItem('orderId', '') // 주문아이디 설정
                                        const sound = new Audio(this.soundFile)
                                        const promise = sound.play()

                                        if (promise !== undefined) {
                                            promise.then(() => {
                                                sound.play()
                                            }).catch((err) => {
                                                console.log(err)
                                            })
                                        }
                                    }
                                }
                            })
                        }, 5 * 1000)
                    }
                }
            })

            // 스크롤 막기
            this.$nextTick(() => {
                if (this.$refs.main_detail) {
                    this.$refs.main_detail.style.overflowY = 'hidden'
                }
            })
        },
        cancelPaySuccessDialog() { // 결제완료 다이얼로그 닫기
            this.isShowOverlay = false
            this.isShowDialog = false

            localStorage.setItem('orderNumber', '') // 결제성공 상태값 설정
            localStorage.setItem('orderId', '') // 주문아이디 설정

            // 스크롤 허용
            this.$nextTick(() => {
                if (this.$refs.main_detail) {
                    this.$refs.main_detail.style.overflowY = 'visible'
                }
            })
        },
        redirectOrderDetail() { // 주문상세페지로 리다이렉트
            localStorage.setItem('route', 'sending') // 배송대기로 선택

            this.$router.push({
                path: '/info/order/order_detail?orderid=' + parseInt(this.orderId)
            })
        },
        redirectType(typeId) {
            localStorage.setItem('typeId', typeId)
            localStorage.setItem('subTypeId', 0)

            this.$router.push({
                path: '/type/type_detail?id=' + parseInt(typeId) + '&subid=0'
            })
        },
        redirectSearch() {
            this.$router.push({
                path: '/search/search_input'
            })
        }
    }
}
</script>

<style scoped>
.back_size {
    width: 100%;
    height: 290px;
}

.btn_ctrl {
    padding: 15px 40px;
    border-radius: 30px;
    background-color: #ffca2f;
    color: #222222;
    font-size: 15px;
}

.cancel_set {
    width: 28px;
    height: 28px;
    right: -28px;
    top: -49px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
