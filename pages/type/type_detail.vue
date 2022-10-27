<template>
<div id="type_detail" style="height: 100%;">
    <div class="container background-default">
        <div class="pos-fix" style="left: 0; right: 0; max-width: 499px; margin: 0 auto;">
            <div ref="search" class="pl-15 pr-15 pos-re pb-10 pt-10 type_search" @click="redirectSearch">
                <div id="search" class="search-input pt-11 pb-0 background-white" style="color: #b1b1b1;">请输入关键字</div>
                <img class="pos-ab search_icon" src="../../assets/images/ico_search_1.png" alt="" style="top: 22px; left: 28px;">
            </div>
            <div id="type-swiper" ref="type_content" style="width: 100%;">
                <swiper ref="swiper_type" :options="swiperOption">
                    <!-- 대분류액티브테두리 애니메이션 -->
                    <Motion :value="offset" tag="div" spring="stiff">
                        <div slot-scope="props" class="type_active_line" :style="{ transform: `translateX(${props.value}px)` }"></div>
                    </Motion>
                    <swiper-slide class="swiper-slide" v-for="(item, index) in typeData" :key="item.iconUri">
                        <div v-if="typeId === item.id" class="type_item">
                            <img class="radius-12 mb-5 type_image_item" :src="item.iconUri" alt="">
                            <div class="type_image_text" :class="{active: isActiveType(item.id, index)}">{{ item.typeName }}</div>
                        </div>
                        <div v-else class="type_item" @click="setType(item.id, item.typeName, index)">
                            <img class="radius-12 mb-5 type_image_item" :src="item.iconUri" alt="">
                            <div class="type_image_text">{{ item.typeName }}</div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <div ref="top_content" style="height: 154px; background-color: #f5f6fd;"></div>
        <div class="background-white pos-fix" id="content" style="left: 0; right: 0; z-index: 100; max-width: 499px; margin: 0 auto;">
            <b-row>
                <div ref="type_left" class="type_left_back" style="width: 21%; overflow-y: auto; padding-bottom: 80px; z-index: 100;" @scroll="setScrollLeft">
                    <div v-show="isRecommend === '1'" class="type_left_item" :class="{active: isActiveSubType('0', '推荐')}" @click="setSubType('0', '推荐')">推荐</div>
                    <div v-for="item in subTypeData" :key="item.id">
                        <div v-if="isRecommend === '0' && subTypeId === item.id" class="type_left_item" :class="{active: isActiveSubType(item.id, item.name)}">{{ item.name }}</div>
                        <div v-else class="type_left_item" :class="{active: isActiveSubType(item.id, item.name)}" @click="setSubType(item.id, item.name)">{{ item.name }}</div>
                    </div>
                </div>
                <div ref="type_right" style="width: 79%; padding: 9px 9px 80px 9px; overflow-y: auto; z-index: 100;" @scroll="setScrollValue">
                    <div v-for="item in goodsData" :key="item.id">
                        <ProductHorizontalItem class="pb-9 border-btm-3 mb-9" v-show="item.goodsStatus === '1'" :shopId="item.shopId" :prodId="item.id" :goodsName="item.goodsName" :goodsIconName="item.goodsIconName" :goodsImg="item.goodsImg" :goodsUnit="item.goodsUnit" :goodsIntro="item.goodsIntro" :salesPrice="item.salesPrice" :originalPrice="item.originalPrice" :balls="balls" :dropBall="dropBall" :sizeStatus="item.sizeStatus" :shopName="item.shopName" :sizeId="item.sizeId" :goodsStatus="item.goodsStatus" :goodsVideo="item.goodsVideo" :view="'load_type'" :goodsData="goodsData" :subTypeData="subTypeData" :eventStatus="item.eventStatus" />
                    </div>
                    <b-row>
                        <b-spinner v-show="loading" variant="primary" small label="Small Spinner" style="margin: 0 auto;"></b-spinner>
                    </b-row>
                    <b-row v-show="(page - 1) >= totalPage && goodsData.length !== 0" class="mt-5">
                        <div class="font-222-12" style="margin: 0 auto;">商品陆续上架中, 合作热线 0433-2651000</div>
                    </b-row>
                </div>
            </b-row>
        </div>
    </div>
    <!-- 애니메이션 볼 -->
    <BallAnimate :ball="balls" :dropBall="dropBall" :pos_x="pos_x" :pos_y="32" :styles="ball_style" />
</div>
</template>

<script>
import ProductHorizontalItem from '@/components/ProductHorizontalItem' // 상품가로컴포넌트
import BallAnimate from '@/components/BallAnimate' // 장바구니 클릭시 애니메이션
import {
    Motion
} from 'vue-motion'

import {
    getType,
    getSubType,
    getGoods
} from '@/api/type'

export default {
    name: "type_detail",
    components: {
        ProductHorizontalItem,
        BallAnimate,
        Motion
    },
    head() {
        return {
            title: '分类'
        }
    },
    async asyncData(context) {
        let goodsData = []
        let typeId = parseInt(context.query.id) // 대분류아이디
        let subTypeId = parseInt(context.query.subid)
        let resData = {}
        const typeData = await getType() // 대분류데이터 얻기
        const subTypeData = await getSubType(typeId) // 대분류에 따르는 소분류데이터 얻기
        const query = {
            page: 1,
            size: 15
        }

        if (typeData.res !== undefined) {
            typeData.res.data.filter(res => {
                if (res.id === typeId) {
                    resData.typeName = res.typeName
                }
            })
        }

        if (subTypeId !== 0) {
            resData.subTypeId = subTypeId
            goodsData = await getGoods(subTypeId, '0', query)
            resData.goodsData = goodsData.res ? goodsData.res.data.list : []
        } else {
            goodsData = await getGoods(typeId, '1', query) // 추천상품데이터 얻기

            if (goodsData.res) {
                if (goodsData.res.data.list.length !== 0) { // 추천상품이 있는 경우
                    resData.goodsData = goodsData.res.data.list // 추천상품데이터 설정
                    resData.isRecommend = '1'
                    resData.subTypeId = context.query.flag ? 0 : subTypeId
                } else { // 추천상품이 없는 경우 소분류배렬의 첫번째소분류의 아이디를 소분류아이디로 설정
                    resData.isRecommend = '0'

                    if (subTypeData.res !== undefined) {
                        resData.subTypeId = subTypeData.res.data.length !== 0 ? parseInt(subTypeData.res.data[0].id) : 0

                        subTypeData.res.data.filter(res => {
                            if (res.id === resData.subTypeId) {
                                resData.subTypeName = res.name
                            }
                        })
                    }

                    goodsData = await getGoods(resData.subTypeId, '0', query)
                    resData.goodsData = goodsData.res ? goodsData.res.data.list : []
                }
            }
        }

        resData.typeId = typeId
        resData.typeData = typeData.res !== undefined ? typeData.res.data : []
        resData.subTypeData = subTypeData.res !== undefined ? subTypeData.res.data : []
        resData.totalNum = goodsData.res !== undefined ? goodsData.res.data.totalNum : 0
        resData.size = goodsData.res !== undefined ? goodsData.res.data.size : 10
        resData.page = goodsData.res !== undefined ? goodsData.res.data.page : 1
        resData.totalPage = goodsData.res !== undefined ? goodsData.res.data.totalNum % goodsData.res.data.size === 0 ? goodsData.res.data.totalNum / goodsData.res.data.size : parseInt(goodsData.res.data.totalNum / goodsData.res.data.size) + 1 : 0
        resData.isFlag = context.query.flag ? true : false

        return resData
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', true)
        this.$nuxt.$emit('handleOtherMenu', false, false)
        this.$nuxt.$emit('handleNoticeShow', true)
    },
    watch: { // 동일 라우터에서 호출하는 경우 새로운 데이터를 업데이트를 하기 위함(해당 라우팅이 변경되였는지 감지)
        $route(to, form) {
            if (to.fullPath !== form.fullPath) {
                if (this.$refs.type_right) {
                    this.$refs.type_right.scrollTop = 0
                }

                if (to.query.id !== form.query.id) { // 대분류변경을 진행했다면
                    this.getRecommendData('first')
                } else if (to.query.subid !== form.query.subid) {
                    if (parseInt(to.query.subid) === 0) {
                        this.getRecommendData('')
                    } else {
                        this.getGoodsData()
                    }
                }
            }
        }
    },
    async mounted() {
        window.document.body.setAttribute('style', 'position: fixed; overflow: hidden') // 아이폰 스크롤 바운딩 효과 막기

        this.$nextTick(() => {
            if (this.$refs.type_right) {
                // 오른쪽상품리스트뷰의 높이값 설정
                this.$refs.type_right.style.height = window.document.body.offsetHeight - this.$refs.top_content.clientHeight + 'px'

                // 분류페지에서 해당 상품의 상세로 갔다가 다시 돌아왔다면 해당 클릭한 상품에로 스크롤위치 이동시키기
                if (localStorage.getItem('load_type') === '1' && localStorage.getItem('type_list') && localStorage.getItem('subTypeData')) {
                    this.page = localStorage.getItem('typePageCount') ? parseInt(localStorage.getItem('typePageCount')) : 1
                    this.goodsData = JSON.parse(localStorage.getItem('type_list'))
                    this.subTypeData = JSON.parse(localStorage.getItem('subTypeData'))
                    this.$refs.type_right.scrollTop = parseInt(localStorage.getItem('type_pos'))
                }
            }
        })

        this.$utility.addWechatOptionTool()
        localStorage.removeItem('load_shop') // 점포로딩상태값 클리어
        this.$utility.setPushBaiduScript()
        localStorage.removeItem('shop_even')
        localStorage.removeItem('shop_odd')
        localStorage.removeItem('shop_list')

        await getType()

        // 위챗공유로 해당 페지를 방문할 때 URL에 상태값이 존재하면 상태값을 true로 설정하고 이전 정보들 초기화
        if (this.$route.query.flag) {
            this.$utility.setAllClearCookieAndStorageData('all')
        }

        if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.ball_style.left = '67%'
            this.pos_x = 65
        } else {
            this.ball_style.left = '53.5%'
            this.pos_x = 53.5
        }

        this.$nextTick(() => {
            if (this.$refs.type_left) {
                // 왼쪽서브카테고리메뉴뷰의 높이값 설정
                this.$refs.type_left.style.height = window.document.body.offsetHeight - this.$refs.top_content.clientHeight + 'px'
            }
        })

        const tmpUrl = window.location.href.split('/')
        const url = tmpUrl[0] + '//' + tmpUrl[2] + '/type/type_detail?id=' + this.typeId + '&subid=' + this.subTypeId + '&flag=2'
        const logo = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).logo : ''

        if (this.isRecommend === '1') {
            this.$weixin.setWechatShare(url, '推荐' + ' - ' + this.typeName, logo, '')
        } else {
            this.$weixin.setWechatShare(url, this.subTypeName + ' - ' + this.typeName, logo, '')
        }

        if (this.goodsData.length === 0) {
            await this.getCategoryData()
        }
    },
    data() {
        return {
            typeId: 0, // 대분류아이디
            subTypeId: 0, // 소분류아이디
            typeData: [], // 대분류배렬
            subTypeData: [], // 소분류 배렬
            goodsData: [], // 분류에 포함된 상품 배렬
            isFlag: false, // 호출되는 상태값(위챗공유URL로 호출 될 때 상태값)
            isRecommend: '0', // 추천상품상태 여부
            swiperOption: {
                slidesPerView: 'auto',
                direction: 'horizontal',
                freeMode: true
            },
            totalNum: 0, // 총 상품수
            totalPage: 1, // 총 페지수
            typeName: '',
            subTypeName: '',
            page: 1, // 페지수
            size: 15, // 표시되는 상품수
            scrollEvent: false,
            loading: false,
            isSwiperPos: false,
            balls: [{
                show: false,
                index: 0
            }],
            dropBall: [],
            ball_style: {
                left: '67%',
                bottom: '22px'
            },
            pos_x: 0,
            offset: 0, // 대분류액티브테두리 애니메이션 이동값
        }
    },
    methods: {
        setScrollLeft() {
            this.$nextTick(() => {
                if (this.$refs.type_left) {
                    this.$refs.type_left.style.height = window.document.body.offsetHeight - this.$refs.top_content.clientHeight + 'px'
                }

                if (this.$refs.type_right) {
                    this.$refs.type_right.style.height = window.document.body.offsetHeight - this.$refs.top_content.clientHeight + 'px'
                }
            })
        },
        setScrollValue(e) {
            this.$nextTick(() => {
                if (this.$refs.type_left) {
                    this.$refs.type_left.style.height = window.document.body.offsetHeight - this.$refs.top_content.clientHeight + 'px'
                }

                if (this.$refs.type_right) {
                    this.$refs.type_right.style.height = window.document.body.offsetHeight - this.$refs.top_content.clientHeight + 'px'
                }
            })

            let scrollHeight = e.target.scrollHeight
            let clientHeight = e.target.clientHeight
            let pos = e.target.scrollTop
            localStorage.setItem('type_pos', pos)

            if (this.scrollEvent) {
                return
            }

            if (pos >= scrollHeight - clientHeight - 10) {
                this.scrollEvent = true
                this.page += 1

                if (this.page > this.totalPage) {
                    this.scrollEvent = false
                    return
                }

                this.loading = true
                const query = {
                    page: this.page,
                    size: this.size
                }
                localStorage.setItem('typePageCount', this.page)

                setTimeout(() => {
                    if (this.subTypeId === 0) { // 추천분류상품
                        getGoods(this.typeId, '1', query).then(response => {
                            if (response.res !== undefined) {
                                if (response.res.data.list.length !== 0) {
                                    response.res.data.list.filter(res => {
                                        this.goodsData.push(res)
                                    })
                                }
                            }

                            this.loading = false
                            this.scrollEvent = false
                        })
                    } else { // 일반분류상품
                        getGoods(this.subTypeId, '0', query).then(response => {
                            if (response.res !== undefined) {
                                if (response.res.data.list.length !== 0) {
                                    response.res.data.list.filter(res => {
                                        this.goodsData.push(res)
                                    })
                                }
                            }

                            this.loading = false
                            this.scrollEvent = false
                        })
                    }
                }, 1000)
            }
        },
        isActiveType(typeid, pos) { // 대분류아이템액티브 처리
            if (!this.isSwiperPos) {
                this.$nextTick(() => {
                    if (this.$refs.swiper_type) {
                        this.$refs.swiper_type.$swiper.slideTo(pos)
                        this.offset = pos * 70
                    }
                })
            }

            return this.typeId === typeid
        },
        isActiveSubType(subtypeid, subname) { // 소분류아이템액티브 처리
            if (this.subTypeId === parseInt(subtypeid)) {
                this.subTypeName = subname
            }

            return this.subTypeId === parseInt(subtypeid)
        },
        async getCategoryData() {
            let goodsData = []
            const typeData = await getType() // 대분류데이터 얻기
            const subTypeData = await getSubType(this.typeId) // 대분류에 따르는 소분류데이터 얻기
            const query = {
                page: 1,
                size: 15
            }

            if (typeData.res !== undefined) {
                typeData.res.data.filter(res => {
                    if (res.id === this.typeId) {
                        this.typeName = res.typeName
                    }
                })
            }

            if (this.subTypeId !== 0) {
                goodsData = await getGoods(this.subTypeId, '0', query)
                this.goodsData = goodsData.res ? goodsData.res.data.list : []
            } else {
                goodsData = await getGoods(this.typeId, '1', query) // 추천상품데이터 얻기

                if (goodsData.res) {
                    if (goodsData.res.data.list.length !== 0) { // 추천상품이 있는 경우
                        this.goodsData = goodsData.res.data.list // 추천상품데이터 설정
                        this.isRecommend = '1'
                        this.subTypeId = this.isFlag ? 0 : this.subTypeId
                    } else { // 추천상품이 없는 경우 소분류배렬의 첫번째소분류의 아이디를 소분류아이디로 설정
                        this.isRecommend = '0'

                        if (subTypeData.res !== undefined) {
                            this.subTypeId = subTypeData.res.data.length !== 0 ? parseInt(subTypeData.res.data[0].id) : 0

                            subTypeData.res.data.filter(res => {
                                if (res.id === this.subTypeId) {
                                    this.subTypeName = res.name
                                }
                            })
                        }

                        goodsData = await getGoods(this.subTypeId, '0', query)
                        this.goodsData = goodsData.res ? goodsData.res.data.list : []
                    }
                }
            }

            this.typeData = typeData.res !== undefined ? typeData.res.data : []
            this.subTypeData = subTypeData.res !== undefined ? subTypeData.res.data : []
            this.totalNum = goodsData.res !== undefined ? goodsData.res.data.totalNum : 0
            this.size = goodsData.res !== undefined ? goodsData.res.data.size : 10
            this.page = goodsData.res !== undefined ? goodsData.res.data.page : 1
            this.totalPage = goodsData.res !== undefined ? goodsData.res.data.totalNum % goodsData.res.data.size === 0 ? goodsData.res.data.totalNum / goodsData.res.data.size : parseInt(goodsData.res.data.totalNum / goodsData.res.data.size) + 1 : 0
        },
        getRecommendData(status) { // 추천분류 상품 얻기
            this.$nuxt.$emit('handleLoading', true)
            const query = {
                page: this.page,
                size: this.size
            }

            // 추천상품얻기
            getGoods(this.typeId, '1', query).then(response => {
                if (response.res !== undefined) {
                    this.totalNum = response.res.data.totalNum
                    this.size = response.res.data.size
                    this.page = response.res.data.page
                    this.totalPage = response.res.data.totalNum % response.res.data.size === 0 ? response.res.data.totalNum / response.res.data.size : parseInt(response.res.data.totalNum / response.res.data.size) + 1
                    this.isRecommend = response.res.data.list.length !== 0 ? '1' : '0'

                    // 추천상품이 존재하면
                    if (this.isRecommend === '1') {
                        if (!this.isFlag) {
                            this.subTypeId = 0
                        }

                        this.goodsData = response.res.data.list
                        const tmpUrl = window.location.href.split('/')
                        const url = tmpUrl[0] + '//' + tmpUrl[2] + '/type/type_detail?id=' + this.typeId + '&subid=' + this.subTypeId + '&flag=2'
                        const logo = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).logo : ''
                        this.$weixin.setWechatShare(url, '推荐' + ' - ' + this.typeName, logo, '')
                    }

                    // 대분류별 선택이라면 소분류를 생성한다.
                    if (status === 'first') {
                        this.getSubTypeData(status)
                    }
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        getSubTypeData(status) { // 대분류에 따르는 소분류 얻기
            this.$nuxt.$emit('handleLoading', true)

            getSubType(this.typeId).then(response => {
                if (response.res !== undefined) {
                    this.subTypeData = response.res.data

                    // 대분류별 선택이면서 추천분류가 존재하면 소분류아이디를 0으로 설정
                    if (status === 'first' && this.isRecommend === '1' && !this.isFlag) {
                        this.subTypeId = 0
                    } else { // 아니면 선택된 소분류아이디로 설정
                        if (!this.isFlag) {
                            this.subTypeId = response.res.data.length !== 0 ? response.res.data[0].id : 0
                        }

                        if (response.res.data.length !== 0) {
                            response.res.data.filter(res => {
                                if (res.id === this.subTypeId) {
                                    this.subTypeName = res.name
                                }
                            })
                        }
                    }

                    // 소분류아이디가 0이 아니라면 소분류별 상품정보 얻기
                    if (this.subTypeId !== 0) {
                        this.getGoodsData()
                    }
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        getGoodsData() { // 분류에 따르는 상품 얻기
            this.$nuxt.$emit('handleLoading', true)
            const query = {
                page: this.page,
                size: this.size
            }

            getGoods(this.subTypeId, '0', query).then(response => {
                if (response.res !== undefined) {
                    this.totalNum = response.res.data.totalNum
                    this.size = response.res.data.size
                    this.page = response.res.data.page
                    this.totalPage = response.res.data.totalNum % response.res.data.size === 0 ? response.res.data.totalNum / response.res.data.size : parseInt(response.res.data.totalNum / response.res.data.size) + 1
                    this.goodsData = response.res.data.list
                }

                this.$nuxt.$emit('handleLoading', false)
                const tmpUrl = window.location.href.split('/')
                const url = tmpUrl[0] + '//' + tmpUrl[2] + '/type/type_detail?id=' + this.typeId + '&subid=' + this.subTypeId + '&flag=2'
                const logo = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).logo : ''
                this.$weixin.setWechatShare(url, this.subTypeName + ' - ' + this.typeName, logo, '')
            })
        },
        setType(typeid, name, pos) { // 대분류 클릭
            if (this.typeId === typeid) {
                return
            }

            this.offset = pos * 70
            this.isSwiperPos = true
            this.typeName = name
            this.typeId = typeid
            this.subTypeId = 0
            this.page = 1
            this.isFlag = false
            localStorage.removeItem('load_type')
            localStorage.removeItem('type_list')
            localStorage.removeItem('subTypeData')

            setTimeout(() => {
                this.$router.replace('/type/type_detail?id=' + this.typeId + '&subid=' + this.subTypeId)
            }, 500)
        },
        setSubType(subtypeid, name) { // 소분류 클릭
            if (this.subTypeId === parseInt(subtypeid)) {
                return
            }

            this.subTypeName = name
            this.subTypeId = parseInt(subtypeid)
            this.page = 1
            this.isFlag = false
            localStorage.removeItem('load_type')
            localStorage.removeItem('type_list')
            localStorage.removeItem('subTypeData')
            this.$router.replace('/type/type_detail?id=' + this.typeId + '&subid=' + this.subTypeId)
        },
        redirectSearch() {
            localStorage.setItem('load_type', 1)
            this.$router.push({
                path: '/search/search_input?typeid=' + this.typeId
            })
        }
    }
}
</script>

<style scoped>

</style>
