<template>
<div id="search_result" ref="search_result" class="height_100">
    <div class="container">
        <div class="search-tool">
            <b-row>
                <div class="col-xs-1" style="display: flex; align-items: center;" @click="$router.go(-1)">
                    <img src="../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                </div>
                <div class="col-xs-11">
                    <div class="pos-re">
                        <input class="search-input pt-0 pb-0" type="search" name="" :value="searchWord" placeholder="请输入关键字" @keypress="redirectResult" @input="inputWord">
                        <img class="pos-ab search_icon" src="../../assets/images/ico_search_1.png" alt="">
                        <img v-show="searchWord !== ''" class="pos-ab search_cancel" src="../../assets/images/ico_cancel_2.png" alt="" @click="setClearWord">
                    </div>
                </div>
            </b-row>
        </div>
        <div v-if="isSearch" class="text-center">
            <div style="height: 150px;"></div>
            <img class="mb-15" src="../../assets/images/ico_search_1.png" alt="" style="width: 35px; height: 35px;">
            <div class="font-9292-15">没有找到与“ <span class="font-cf00-15">{{ searchWord }}</span> ”相关的商品</div>
        </div>
        <div v-else class="background-default" ref="search_content" style="padding-top: 60px;">
            <div class="padding-default">
                <div class="font-222-15">商品 ({{ totalNum | addComma }})</div>
            </div>
            <div class="space">
                <b-row>
                    <div class="col-xs-6">
                        <ProductVerticalItem v-for="item in goodsEvenData" :key="item.id" :shopId="item.shopId" :prodId="item.id" :goodsName="item.goodsName" :goodsImg="item.goodsImg" :goodsIconName="item.goodsIconName" :goodsUnit="item.goodsUnit" :goodsIntro="item.goodsIntro" :goodsStatus="item.goodsStatus" :salesPrice="item.salesPrice" :shopName="item.shopName" :originalPrice="item.originalPrice" :styles="style1" :balls="balls" :dropBall="dropBall" :sizeStatus="item.sizeStatus" :sizeId="item.sizeId" :searchWord="searchWord" :goodsVideo="item.goodsVideo" :view="'load_search'" :goodsEvenData="goodsEvenData" :goodsOddData="goodsOddData" :eventStatus="item.eventStatus" />
                    </div>
                    <div class="col-xs-6">
                        <ProductVerticalItem v-for="item in goodsOddData" :key="item.id" :shopId="item.shopId" :prodId="item.id" :goodsName="item.goodsName" :goodsImg="item.goodsImg" :goodsIconName="item.goodsIconName" :goodsUnit="item.goodsUnit" :goodsIntro="item.goodsIntro" :goodsStatus="item.goodsStatus" :salesPrice="item.salesPrice" :shopName="item.shopName" :originalPrice="item.originalPrice" :styles="style2" :balls="balls" :dropBall="dropBall" :sizeStatus="item.sizeStatus" :sizeId="item.sizeId" :searchWord="searchWord" :goodsVideo="item.goodsVideo" :view="'load_search'" :goodsEvenData="goodsEvenData" :goodsOddData="goodsOddData" :eventStatus="item.eventStatus" />
                    </div>
                </b-row>
                <b-row>
                    <b-spinner v-show="loading" variant="primary" small label="Small Spinner" style="margin: 0 auto;"></b-spinner>
                </b-row>
                <b-row v-show="(page - 1) >= totalPage && totalNum > 0" class="mt-5">
                    <div class="font-222-12" style="margin: 0 auto;">商品陆续上架中, 合作热线 0433-2651000</div>
                </b-row>
            </div>
        </div>
    </div>

    <!-- 애니메이션 볼 -->
    <BallAnimate :ball="balls" :dropBall="dropBall" :pos_x="pos_x" :pos_y="80" :styles="ball_style" />
</div>
</template>

<script>
import BallAnimate from '@/components/BallAnimate' // 장바구니 클릭시 애니메이션
import ProductVerticalItem from '@/components/ProductVerticalItem' // 상품세로컴포넌트

import {
    getSearch
} from '@/api/goods'

export default {
    name: "Search_result",
    components: {
        BallAnimate,
        ProductVerticalItem
    },
    async asyncData(context) {
        const searchWord = context.query.word === undefined ? '' : context.query.word // 검색어
        const typeId = context.query.typeid === undefined ? 0 : parseInt(context.query.typeid)
        let tempEvenData = []
        let tempOddData = []
        let resData = {}
        const query = {
            q: searchWord.trim(),
            page: 1,
            size: 10
        }

        if (typeId !== 0) {
            query.typeId = typeId
        }

        const searchData = await getSearch(query)

        if (searchData.res !== undefined) {
            if (searchData.res.data.list !== null) {
                searchData.res.data.list.filter((res, index) => {
                    if (index % 2 === 0) {
                        tempEvenData.push(res)
                    } else {
                        tempOddData.push(res)
                    }
                })
            }

            resData.totalNum = searchData.res.data.totalNum
            resData.size = searchData.res.data.size
            resData.page = searchData.res.data.page
            resData.totalPage = searchData.res.data.totalNum % searchData.res.data.size === 0 ? searchData.res.data.totalNum / searchData.res.data.size : parseInt(searchData.res.data.totalNum / searchData.res.data.size) + 1
            resData.goodsEvenData = tempEvenData
            resData.goodsOddData = tempOddData
            resData.isSearch = searchData.res.data.totalNum === 0
        }

        resData.searchWord = searchWord
        resData.typeId = typeId

        return resData
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', true)
        this.$nuxt.$emit('handleOtherMenu', true, false)
        this.$nuxt.$emit('handleNoticeShow', true)
    },
    head() {
        return {
            title: '搜索'
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
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기

        // 검색결과페지를 방문하였다면
        if (localStorage.getItem('load_search') === '1' && localStorage.getItem('search_even')) {
            this.goodsEvenData = JSON.parse(localStorage.getItem('search_even'))
            this.goodsOddData = JSON.parse(localStorage.getItem('search_odd'))
            this.page = localStorage.getItem('pageCount') ? parseInt(localStorage.getItem('pageCount')) : 1
        } else {
            this.$utility.scrollToTop()
        }

        window.addEventListener('scroll', this.setScrollValue)
        this.$utility.addWechatOptionTool()
        this.$utility.setPushBaiduScript()

        if (this.goodsEvenData.length === 0) {
            await this.getSearchData()
        }

        // 위챗공유로 해당 페지를 방문하는 경우 이전 정보들 초기화
        if (this.$route.query.flag) {
            this.$utility.setAllClearCookieAndStorageData('all')
        }

        const tmpUrl = window.location.href.split('/')
        const logo = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).logo : ''
        const url = tmpUrl[0] + '//' + tmpUrl[2] + '/search/search_result?word=' + this.searchWord + '&typeid=0&flag=2'
        this.$weixin.setWechatShare(url, '搜索' + ' - ' + this.searchWord, logo, '')

        if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.ball_style.left = '7%'
            this.pos_x = 7.5
        } else {
            this.ball_style.left = '41.5%'
            this.pos_x = 41.5
        }
    },
    data() {
        return {
            typeId: 0,
            isSearch: false,
            searchWord: '', // 검색어
            goodsEvenData: [], // 점포에 포함된 상품배렬(짝수)
            goodsOddData: [], // 점포에 포함된 상품배렬(홀수)
            totalNum: 0, // 총 상품수
            totalPage: 1, // 총 페지수
            page: 1, // 페지수
            size: 10, // 표시되는 상품수
            scrollEvent: false,
            loading: false,
            lastScrollMenu: 0,
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
                bottom: '80px'
            },
            pos_x: 0
        }
    },
    methods: {
        setScrollValue() {
            this.$nextTick(() => {
                if (this.$refs.search_content) {
                    // 스크롤 위치값
                    const scrollPos = window.document.body.offsetHeight + window.scrollY
                    const height_elem = this.$refs.search_content.clientHeight

                    if (this.scrollEvent) {
                        return
                    }

                    if (parseInt(scrollPos) + 1 >= height_elem) {
                        this.scrollEvent = true
                        this.page += 1

                        if (this.page > this.totalPage) {
                            this.scrollEvent = false
                            return
                        }

                        this.loading = true
                        const query = {
                            q: this.searchWord,
                            page: this.page,
                            size: this.size
                        }

                        if (this.typeId !== 0) {
                            query.typeId = this.typeId
                        }

                        localStorage.getItem('pageCount', this.page)

                        setTimeout(() => {
                            getSearch(query).then(response => {
                                if (response.res !== undefined) {
                                    if (response.res.data.list !== null) {
                                        response.res.data.list.filter((res, index) => {
                                            if (index % 2 === 0) {
                                                this.goodsEvenData.push(res)
                                            } else {
                                                this.goodsOddData.push(res)
                                            }
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
        async getSearchData() {
            let tempEvenData = []
            let tempOddData = []

            const query = {
                q: this.searchWord.trim(),
                page: 1,
                size: 10
            }

            if (this.typeId !== 0) {
                query.typeId = this.typeId
            }

            const searchData = await getSearch(query)

            if (searchData.res !== undefined) {
                if (searchData.res.data.list !== null) {
                    searchData.res.data.list.filter((res, index) => {
                        if (index % 2 === 0) {
                            tempEvenData.push(res)
                        } else {
                            tempOddData.push(res)
                        }
                    })
                }

                this.totalNum = searchData.res.data.totalNum
                this.size = searchData.res.data.size
                this.page = searchData.res.data.page
                this.totalPage = searchData.res.data.totalNum % searchData.res.data.size === 0 ? searchData.res.data.totalNum / searchData.res.data.size : parseInt(searchData.res.data.totalNum / searchData.res.data.size) + 1
                this.goodsEvenData = tempEvenData
                this.goodsOddData = tempOddData
                this.isSearch = searchData.res.data.totalNum === 0
            }
        },
        setClearWord() { // 입력된 검색어 삭제
            this.searchWord = ''
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
        inputWord(e) {
            this.searchWord = e.target.value
        },
        redirectResult(event) { // 엔터키 클릭을 할 때 검색결과페지로 리다이렉트
            if (event.keyCode === 13) {
                if (this.searchWord.trim() === '') {
                    this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '请输入关键字', '', '', '', '确认', 'white', true, true, '')
                    return
                }

                if (this.$route.query.word === this.searchWord.trim()) {
                    return
                }

                localStorage.removeItem('load_search')
                localStorage.removeItem('pageCount')
                this.addSearchWord(this.searchWord)

                const tmpUrl = window.location.href.split('/')
                const url = tmpUrl[0] + '//' + tmpUrl[2] + '/search_result?word=' + this.searchWord + '&typeid=0&flag=2'
                const logo = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).logo : ''
                this.$weixin.setWechatShare(url, '搜索' + ' - ' + this.searchWord, logo, '')

                this.$router.replace('/search/search_result?word=' + this.searchWord + '&typeid=' + this.typeId)
            }
        }
    }
}
</script>

<style scoped>
.space {
    padding: 15px 15px 75px 15px;
    height: 100%;
}

.height_100 {
    height: 100%;
}

.height_auto {
    height: auto;
}
</style>
