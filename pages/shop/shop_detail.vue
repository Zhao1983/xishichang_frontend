<template>
<div id="shop_detail" ref="shop_detail" style="height: 100%;">
    <div class="container" ref="container">
        <div class="pos-re" ref="shop_top">
            <img class="pos-ab" src="../../assets/images/shop_line.png" alt="" style="width: 100%; height: 4px; top: 0;">
            <div class="pos-fix padding-default" @click="goBack" style="z-index: 500; top: 0;">
                <img src="../../assets/images/ico_back_1.png" alt="" style="width: 32px; height: 32px;">
            </div>
            <img class="shop_back" ref="shop_back" :data-src="bannerUri" alt="" v-lazy-load src="../../assets/images/image_placeholder.png" />
            <div class="pos-ab radius-3" ref="shop_info" style="padding: 3px 7px; background-color: rgba(0, 0, 0, 0.4); top: 17px; left: 55px;">
                <b-row>
                    <img class="fl" src="../../assets/images/year_icon.png" alt="" style="width: 20px; height: 20px; z-index: 100;">
                    <div v-if="age < 1" class="fl font-white-14 ml-1 mt-2 font-weight">新开店铺</div>
                    <div v-else-if="age >= 1 && age < 5" class="fl font-white-14 ml-1 mt-2 font-weight">{{ age }}年店铺</div>
                    <div v-else class="fl font-white-14 ml-1 mt-2 font-weight">{{ age }}年老店</div>
                    <div class="fl font-white-14 ml-8 mt-2 font-weight">销量:</div>
                    <img class="fl mt-3 ml-3" v-for="(item, index) in starNum" :key="index" src="../../assets/images/ico_diamond.png" alt="" style="width: 13px; height: 13px;">
                    <img class="fl ml-8 mt-3" :src="shopIcon" alt="" style="width: 45px; height: 13px;">
                </b-row>
            </div>
            <div v-if="collectionStatus === '0'" @click="setCollection" class="pos-ab text-center" style="top: 13px; right: 10px; width: 39px;">
                <img class="mb-2" src="../../assets/images/shop_heart_unselected.png" alt="" style="width: 25px; height: 25px;">
                <div class="font-8787-13 font-weight" style="color: #d00a17 !important;">关注</div>
            </div>
            <div v-else @click="setCollection" class="pos-ab text-center" style="top: 13px; right: 10px; width: 39px;">
                <img class="mb-2" src="../../assets/images/shop_heart_selected.png" alt="" style="width: 25px; height: 25px;">
                <div class="font-8787-13 font-weight" style="color: #d00a17 !important;">已关注</div>
            </div>
        </div>
        <div ref="product_content" style="width: 100%; margin-top: -65px;">
            <div class="pl-15 pr-15">
                <b-row>
                    <div class="col-xs-6">
                        <div class="radius-3" style="background-color: rgba(0, 0, 0, 0.4); padding: 5px; display: inline-block;">
                            <div class="font-white-16 font-weight">全部商品({{ totalNum }})</div>
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <div class="radius-3 fr" style="background-color: rgba(0, 0, 0, 0.4); padding: 5px; display: inline-block;" @click="setViewGoods">
                            <img class="fr" src="../../assets/images/ico_list.png" alt="" style="width: 19px; height: 19px;">
                        </div>
                    </div>
                </b-row>
            </div>
            <div class="shop_content" ref="prod_content">
                <b-row v-if="isViewKind">
                    <div class="col-xs-6">
                        <verticalItem v-for="item in goodsEvenData" :key="item.id" :shopId="shopId" :prodId="item.id" :goodsName="item.goodsName" :goodsImg="item.goodsImg" :goodsIconName="item.goodsIconName" :goodsVideo="item.goodsVideo" :goodsUnit="item.goodsUnit" :goodsIntro="item.goodsIntro" :salesPrice="item.salesPrice" :shopName="shopName" :originalPrice="item.originalPrice" :styles="style1" :balls="balls" :dropBall="dropBall" :sizeStatus="item.sizeStatus" :sizeId="item.sizeId" :searchWord="''" :view="'load_shop'" :goodsEvenData="goodsEvenData" :goodsOddData="goodsOddData" :eventStatus="item.eventStatus" />
                    </div>
                    <div class="col-xs-6">
                        <verticalItem v-for="item in goodsOddData" :key="item.id" :shopId="shopId" :prodId="item.id" :goodsName="item.goodsName" :goodsImg="item.goodsImg" :goodsIconName="item.goodsIconName" :goodsVideo="item.goodsVideo" :goodsUnit="item.goodsUnit" :goodsIntro="item.goodsIntro" :salesPrice="item.salesPrice" :shopName="shopName" :originalPrice="item.originalPrice" :styles="style2" :balls="balls" :dropBall="dropBall" :sizeStatus="item.sizeStatus" :sizeId="item.sizeId" :searchWord="''" :view="'load_shop'" :goodsEvenData="goodsEvenData" :goodsOddData="goodsOddData" :goodsData="goodsData" :eventStatus="item.eventStatus" />
                    </div>
                </b-row>
                <b-row v-else>
                    <div class="col-xs-12">
                        <horizontalItem class="mb-10 padding-default background-white radius-7" v-for="item in goodsData" :key="item.id" :shopId="shopId" :prodId="item.id" :goodsName="item.goodsName" :goodsImg="item.goodsImg" :goodsIconName="item.goodsIconName" :goodsVideo="item.goodsVideo" :goodsUnit="item.goodsUnit" :goodsIntro="item.goodsIntro" :salesPrice="item.salesPrice" :shopName="shopName" :originalPrice="item.originalPrice" :balls="balls" :dropBall="dropBall" :sizeStatus="item.sizeStatus" :sizeId="item.sizeId" :goodsStatus="'1'" :view="'load_shop'" :goodsEvenData="goodsEvenData" :goodsOddData="goodsOddData" :goodsData="goodsData" :eventStatus="item.eventStatus" />
                    </div>
                </b-row>
                <b-row>
                    <b-spinner v-show="loading" :variant="isBgUri ? 'light' : 'primary'" small label="Small Spinner" style="margin: 0 auto;"></b-spinner>
                </b-row>
                <b-row v-show="(page - 1) >= totalPage" class="mt-5">
                    <div class="font-white-12 font-weight" style="margin: 0 auto;">商品陆续上架中, 合作热线 0433-2651000</div>
                    <div class="text-center font-222-12 pt-15" style="width: 100%;">ICP证: <a style="color: dodgerblue; text-decoration: underline;" href="https://beian.miit.gov.cn/" target="_blank">吉ICP备20003633号-1</a></div>
                </b-row>
            </div>
        </div>
    </div>

    <!-- 애니메이션 볼 -->
    <BallAnimate :ball="balls" :dropBall="dropBall" :pos_x="pos_x" :pos_y="50" :styles="ball_style" />
</div>
</template>

<script>
import verticalItem from '@/components/ProductVerticalItem' // 상품세로컴포넌트
import horizontalItem from '@/components/ProductHorizontalItem' // 상품가로컴포넌트
import BallAnimate from '@/components/BallAnimate' // 장바구니 클릭시 애니메이션

import {
    getShopDetail,
    getGoodsData,
    setCollectionStatus
} from '@/api/shop'

export default {
    name: "Shop_detail",
    components: {
        verticalItem,
        horizontalItem,
        BallAnimate
    },
    head() {
        return {
            title: this.shopName
        }
    },
    async asyncData(context) {
        let tempEvenData = []
        let tempOddData = []
        const shopId = context.query.shopid === undefined ? 1 : parseInt(context.query.shopid)
        const goodsId = context.query.productid === undefined ? 0 : parseInt(context.query.productid)
        const shopDetail = await getShopDetail(shopId)
        const query = {
            orderType: 0,
            page: 1,
            size: 10
        }
        let resData = {}
        const goodsData = await getGoodsData(shopId, goodsId, query)

        if (goodsData.res !== undefined) {
            if (goodsData.res.data.list !== null) {
                goodsData.res.data.list.filter((res, index) => {
                    if (index % 2 === 0) {
                        tempEvenData.push(res)
                    } else {
                        tempOddData.push(res)
                    }
                })
            }

            resData.totalNum = goodsData.res.data.totalNum
            resData.size = goodsData.res.data.size
            resData.page = goodsData.res.data.page
            resData.totalPage = goodsData.res.data.totalNum % goodsData.res.data.size === 0 ? goodsData.res.data.totalNum / goodsData.res.data.size : parseInt(goodsData.res.data.totalNum / goodsData.res.data.size) + 1
            resData.goodsData = goodsData.res.data.list
            resData.goodsEvenData = tempEvenData
            resData.goodsOddData = tempOddData
        }

        resData.shopId = shopId
        resData.goodsId = goodsId
        resData.shopName = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.shopName : ''
        resData.age = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.age : 0
        resData.starNum = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.starNum : 0
        resData.avatarUri = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.avatarUri : ''
        resData.bannerUri = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.bannerUri : ''
        resData.bgImgUri = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.bgImgUri : ''
        resData.shopIntro = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.shopIntro : ''
        resData.collectionStatus = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.collectionStatus : ''
        resData.isBgUri = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.bgImgUri !== null && shopDetail.res.data.bgImgUri !== '' : false

        return resData
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', true, true)
        this.$nuxt.$emit('handleNoticeShow', true)
    },
    async mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.addWechatOptionTool()
        this.$utility.setPushBaiduScript()

        // 점포페지를 방문하였다면
        if (localStorage.getItem('load_shop') === '1' && localStorage.getItem('shop_even')) {
            this.goodsEvenData = JSON.parse(localStorage.getItem('shop_even'))
            this.goodsOddData = JSON.parse(localStorage.getItem('shop_odd'))
            this.goodsData = JSON.parse(localStorage.getItem('shop_list'))
            this.page = localStorage.getItem('pageCount') ? 1 : parseInt(localStorage.getItem('pageCount'))
            this.isViewKind = localStorage.getItem('isViewKind') === '1'
        } else {
            localStorage.setItem('isViewKind', 1)
            this.$utility.scrollToTop()
        }

        window.addEventListener('scroll', this.setScrollValue)
        this.$weixin.setWechatShare(window.location.href + '&flag=2', this.shopName + ' - ' + this.shopIntro + ' - 【延吉西市场】 延边朝鲜族特产集散地', this.avatarUri, '')

        if (this.shopName === '') {
            await this.getShopDetailData()
        }

        // 점포페지백그라운드이미지가 존재하면 점포페지백그라운드에 설정
        if (this.isBgUri) {
            window.document.body.setAttribute('style', 'background-image: url("' + this.bgImgUri + '"); height: auto;')
            this.$nextTick(() => {
                if (this.$refs.container) {
                    this.$refs.container.style.backgroundColor = 'unset'
                }

                if (this.$refs.prod_content) {
                    this.$refs.prod_content.style.backgroundColor = 'unset'
                }
            })
        }

        // 위챗공유로 해당 페지를 방문하는 경우 이전 정보들 초기화
        if (this.$route.query.flag) {
            this.$utility.setAllClearCookieAndStorageData('all')
        }

        if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.ball_style.left = '7%'
            this.pos_x = 7.5
        } else {
            this.ball_style.left = '41.5%'
            this.pos_x = 41.5
        }

        this.shopIcon = sessionStorage.getItem('shop_image') ? sessionStorage.getItem('shop_image') : ''
    },
    data() {
        return {
            shopId: 0, // 점포아이디
            goodsId: 0, // 상품아이디
            shopName: '', // 점포명
            age: 0, // 점포오픈년도,
            starNum: 0, // 점포등급
            avatarUri: '', // 점포이미지
            bannerUri: '', // 점포배너이미지
            bgImgUri: '', // 점포백그라운드이미지
            shopIntro: '', // 점포소,
            collectionStatus: '0', // 점포추천여부
            goodsEvenData: [], // 점포에 포함된 상품배렬(짝수)
            goodsOddData: [], // 점포에 포함된 상품배렬(홀수)
            goodsData: [], // 점포에 포함된 상품배렬
            shopIcon: '',
            isViewKind: true,
            totalNum: 0, // 총 상품수
            totalPage: 1, // 총 페지수
            page: 1, // 페지수
            size: 10, // 표시되는 상품수
            loading: false,
            scrollEvent: false,
            isBgUri: false,
            style1: {
                width: '96.5%',
                float: 'left'
            },
            style2: {
                width: '96.5%',
                float: 'right'
            },
            balls: [{
                show: false,
                index: 0
            }],
            dropBall: [],
            ball_style: {
                left: '7%',
                bottom: '50px'
            },
            pos_x: 0,
            modal_style: {
                padding: '1px'
            }
        }
    },
    methods: {
        setScrollValue() {
            this.$nextTick(() => {
                if (this.$refs.shop_top) {
                    let pos = 0
                    let scrollHeight = 0
                    let clientHeight = 0

                    if (this.$refs.shop_detail) {
                        pos = Math.abs(this.$refs.shop_detail.getBoundingClientRect().top)
                        scrollHeight = this.$refs.shop_detail.scrollHeight
                        clientHeight = this.$refs.shop_detail.clientHeight
                    }

                    if (this.scrollEvent) {
                        return
                    }

                    if (pos >= scrollHeight - clientHeight - 5) {
                        this.scrollEvent = true
                        this.page += 1

                        if (this.page > this.totalPage) {
                            this.scrollEvent = false
                            return
                        }

                        this.loading = true
                        const query = {
                            orderType: 0,
                            page: this.page,
                            size: this.size
                        }
                        localStorage.setItem('pageCount', this.page)

                        setTimeout(() => {
                            getGoodsData(this.shopId, this.goodsId, query).then(response => {
                                if (response.res !== undefined) {
                                    if (response.res.data.list !== null) {
                                        response.res.data.list.filter((res, index) => {
                                            if (index % 2 === 0) {
                                                this.goodsEvenData.push(res)
                                            } else {
                                                this.goodsOddData.push(res)
                                            }

                                            this.goodsData.push(res)
                                        })
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
        async getShopDetailData() {
            let tempEvenData = []
            let tempOddData = []

            const shopDetail = await getShopDetail(this.shopId)
            const query = {
                orderType: 0,
                page: 1,
                size: 10
            }
            const goodsData = await getGoodsData(this.shopId, this.goodsId, query)

            if (goodsData.res !== undefined) {
                if (goodsData.res.data.list !== null) {
                    goodsData.res.data.list.filter((res, index) => {
                        if (index % 2 === 0) {
                            tempEvenData.push(res)
                        } else {
                            tempOddData.push(res)
                        }
                    })
                }

                this.totalNum = goodsData.res.data.totalNum
                this.size = goodsData.res.data.size
                this.page = goodsData.res.data.page
                this.totalPage = goodsData.res.data.totalNum % goodsData.res.data.size === 0 ? goodsData.res.data.totalNum / goodsData.res.data.size : parseInt(goodsData.res.data.totalNum / goodsData.res.data.size) + 1
                this.goodsData = goodsData.res.data.list
                this.goodsEvenData = tempEvenData
                this.goodsOddData = tempOddData
            }

            this.shopName = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.shopName : ''
            this.age = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.age : 0
            this.starNum = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.starNum : 0
            this.avatarUri = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.avatarUri : ''
            this.bannerUri = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.bannerUri : ''
            this.bgImgUri = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.bgImgUri : ''
            this.shopIntro = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.shopIntro : ''
            this.collectionStatus = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.collectionStatus : ''
            this.isBgUri = shopDetail !== undefined && shopDetail.res ? shopDetail.res.data.bgImgUri !== null && shopDetail.res.data.bgImgUri !== '' : false
        },
        setViewGoods() {
            this.isViewKind = !this.isViewKind

            if (this.isViewKind) {
                localStorage.setItem('isViewKind', 1)
            } else {
                localStorage.setItem('isViewKind', 0)
            }
        },
        setCollection() { // 점포 즐겨찾기 추가
            if (sessionStorage.getItem('token') === '' || !sessionStorage.getItem('token')) {
                if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                    window.location.href = define.AUTH_URL + '?id=' + this.shopId + '-0&type=shop_detail'
                } else {
                    this.$router.push({
                        path: '/qr_view'
                    })
                }
                return
            }

            this.$nuxt.$emit('handleLoading', true)

            setCollectionStatus(this.shopId).then(response => {
                if (response.res !== undefined) {
                    if (this.collectionStatus === '0') {
                        this.collectionStatus = '1'
                    } else {
                        this.collectionStatus = '0'
                    }
                }

                this.$nuxt.$emit('handleLoading', false)
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
        }
    }
}
</script>

<style scoped>

</style>
