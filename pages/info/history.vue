<template>
<div id="history" ref="history" class="height_100">
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">浏览历史</div>
                </div>
                <div class="col-xs-2">
                    <div v-if="historyData.length !== 0" class="font-222-17 fr pt-7" @click="setShowDialog">清空</div>
                    <div v-else class="font-222-17 fr pt-7">清空</div>
                </div>
            </b-row>
        </div>
        <div v-if="isHistory" class="text-center">
            <div style="height: 150px;"></div>
            <img class="mb-23" src="../../assets/images/ico_history_empty.png" alt="" style="width: 70px; height: 70px;">
            <div class="font-b3b3-15">您还没有浏览历史</div>
            <div style="height: 60px;"></div>
            <nuxt-link :to="'/main'">
                <div class="btn-radius">逛一逛</div>
            </nuxt-link>
        </div>
        <div v-else class="space background-default">
            <ProductHorizontalItem class="mb-10 padding-default background-white radius-7" v-for="item in historyData" :key="item.id" :shopId="item.shopId" :prodId="item.id" :goodsName="item.goodsName" :goodsIconName="item.goodsIconName" :goodsImg="item.goodsImg" :goodsUnit="item.goodsUnit" :goodsIntro="item.goodsIntro" :salesPrice="item.salesPrice" :shopName="item.shopName" :originalPrice="item.originalPrice" :balls="balls" :dropBall="dropBall" :sizeStatus="item.sizeStatus" :sizeId="item.sizeId" :goodsStatus="item.goodsStatus" :eventStatus="item.eventStatus" :view="'load_history'" :goodsData="historyData" />
        </div>
    </div>

    <!-- 애니메이션 볼 -->
    <BallAnimate :ball="balls" :dropBall="dropBall" :pos_x="pos_x" :pos_y="60" :styles="ball_style" />
</div>
</template>

<script>
import ProductHorizontalItem from '@/components/ProductHorizontalItem' // 상품가로컴포넌트
import BallAnimate from '@/components/BallAnimate' // 장바구니 클릭시 애니메이션

import {
    getHistory,
    setDeleteHistory
} from '@/api/mypage'

export default {
    name: "history",
    components: {
        ProductHorizontalItem,
        BallAnimate
    },
    head() {
        return {
            title: '浏览历史'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', true, true)
        this.$nuxt.$emit('handleNoticeShow', false)

        // 히스토리 삭제요청
        this.$nuxt.$on('handleConfirmDeleteHistory', () => {
            this.setDelete()
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('handleConfirmDeleteHistory')
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()

        if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.ball_style.left = '7%'
            this.pos_x = 7.5
        } else {
            this.ball_style.left = '41.5%'
            this.pos_x = 41.5
        }

        this.getHistoryData()
    },
    data() {
        return {
            isHistory: false,
            historyData: [], // 상품리력 배렬
            balls: [{
                show: false,
                index: 0
            }],
            dropBall: [],
            ball_style: {
                left: '7%',
                bottom: '50px'
            },
            pos_x: 0
        }
    },
    methods: {
        getHistoryData() { // 상품리력 얻기
            this.$nuxt.$emit('handleLoading', true)

            if (localStorage.getItem('load_history') === '1') {
                this.historyData = JSON.parse(localStorage.getItem('history_list'))
                this.$nuxt.$emit('handleLoading', false)
            }

            getHistory().then(response => {
                if (response.res !== undefined) {
                    this.historyData = response.res.data
                    this.isHistory = response.res.data.length === 0

                    this.$nuxt.$emit('handleLoading', false)
                }
            })
        },
        setDelete() { // 상품리력 삭제
            this.$nuxt.$emit('handleLoading', true)
            localStorage.removeItem('load_history')
            localStorage.removeItem('history_list')

            setDeleteHistory().then(response => {
                if (response.res !== undefined) {
                    this.getHistoryData()
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setShowDialog() {
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '确定要删除浏览历史吗？', '', '否', '是', '', 'white', false, true, 'history_delete')
        }
    }
}
</script>

<style scoped>
.space {
    padding: 65px 15px 15px 15px;
    height: auto;
}

.height_100 {
    height: 100%;
}

.height_auto {
    height: auto;
}
</style>
