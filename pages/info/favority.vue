<template>
<div id="favority" ref="favority" class="height_100">
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">我的收藏</div>
                </div>
                <div class="col-xs-2">
                    <div v-if="!isShowDelete" class="font-222-17 fr pt-7" @click="setEditDelete">编辑</div>
                    <div v-else class="font-222-17 fr pt-7" @click="setEditDelete">完成</div>
                </div>
            </b-row>
        </div>
        <div v-if="isFavority" class="text-center">
            <div style="height: 150px;"></div>
            <img class="mb-23" src="../../assets/images/ico_favority_2.png" alt="" style="width: 70px; height: 70px;">
            <div class="font-b3b3-15">没有收藏任何商品哦!</div>
            <div style="height: 60px;"></div>
            <nuxt-link :to="'/main'">
                <div class="btn-radius">逛一逛</div>
            </nuxt-link>
        </div>
        <div v-else class="space background-default">
            <ProductHorizontalItem class="mb-10 pt-12 pl-12 pr-12 pb-12 background-white radius-7" v-for="(item, index) in favorityData" :key="item.id" :shopId="item.shopId" :prodId="item.id" :goodsName="item.goodsName" :goodsIconName="item.goodsIconName" :goodsImg="item.goodsImg" :goodsUnit="item.goodsUnit" :goodsIntro="item.goodsIntro" :salesPrice="item.salesPrice" :shopName="item.shopName" :originalPrice="item.originalPrice" :balls="balls" :dropBall="dropBall" :sizeStatus="item.sizeStatus" :sizeId="item.sizeId" :isShowDelete="isShowDelete" :index="index" :isCheckStatus="isCheckStatus[index].checked" :goodsStatus="item.goodsStatus" :eventStatus="item.eventStatus" :view="'load_favority'" />
        </div>
    </div>

    <div v-show="isShowDelete && !isActiveDelete" class="pos-fix text-center pt-11 del_btn">删除</div>
    <div v-show="isShowDelete && isActiveDelete" class="pos-fix text-center pt-11 del_btn active" @click="setDelete">删除({{ delCount.length }})</div>

    <!-- 애니메이션 볼 -->
    <BallAnimate :ball="balls" :dropBall="dropBall" :pos_x="pos_x" :pos_y="70" :styles="ball_style" />
</div>
</template>

<script>
import ProductHorizontalItem from '@/components/ProductHorizontalItem' // 상품가로컴포넌트
import BallAnimate from '@/components/BallAnimate' // 장바구니 클릭시 애니메이션

import {
    getFavority,
    deleteFavority
} from '@/api/mypage'

export default {
    name: "favority",
    components: {
        ProductHorizontalItem,
        BallAnimate
    },
    head() {
        return {
            title: '我的收藏'
        }
    },
    created() {
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', true, true)
        this.$nuxt.$emit('handleNoticeShow', false)

        // 해당 상품이 체크된 경우
        this.$nuxt.$on('handleFavorityDelete', (productid, isCheck) => {
            this.setCheckStatus(productid, isCheck)
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('handleFavorityDelete')
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

        this.getFavorityData()
    },
    data() {
        return {
            isFavority: false,
            favorityData: [], // 즐겨찾기 배렬
            isShowDelete: false,
            isActiveDelete: false,
            isCheckStatus: [], // 선택된 상품 배렬
            delCount: [], // 삭제 상품 개수 배렬
            balls: [{
                show: false,
                index: 0
            }],
            dropBall: [],
            ball_style: {
                left: '7%',
                bottom: '60px'
            },
            pos_x: 0
        }
    },
    methods: {
        getFavorityData() { // 즐겨찾기 얻기
            this.$nuxt.$emit('handleLoading', true)

            getFavority().then(response => {
                if (response.res !== undefined) {
                    this.isCheckStatus = []
                    this.favorityData = response.res.data

                    if (response.res.data.length !== 0) {
                        response.res.data.filter(res => {
                            let value = {
                                goodsId: res.id,
                                checked: false
                            }

                            this.isCheckStatus.push(value)
                        })
                    }

                    this.isShowDelete = false
                    this.isActiveDelete = false
                    this.delCount = []
                    this.isFavority = response.res.data.length === 0
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setEditDelete() { // 삭제여부
            if (this.favorityData.length !== 0) {
                this.isShowDelete = !this.isShowDelete
                this.isActiveDelete = false
                this.delCount = []

                this.isCheckStatus.filter(res => {
                    res.checked = false
                })
            }
        },
        setCheckStatus(goodsId, isCheck) { // 상품 선택여부
            this.isCheckStatus.filter(res => {
                if (res.goodsId === goodsId) {
                    res.checked = isCheck
                }
            })

            if (isCheck) {
                this.delCount.push(goodsId)
            } else {
                this.delCount.filter((res, index) => {
                    if (res === goodsId) {
                        this.delCount.splice(index, 1)
                    }
                })
            }

            this.isActiveDelete = this.delCount.length !== 0
        },
        setDelete() {
            this.$nuxt.$emit('handleLoading', true)
            const query = {
                ids: this.delCount
            }

            deleteFavority(query).then(response => {
                if (response.res !== undefined) {
                    this.getFavorityData()
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        }
    }
}
</script>

<style scoped>
.space {
    padding: 65px 15px 15px 15px;
    height: auto;
}

.del_btn {
    height: 40px;
    width: 100%;
    background-color: #c4c4c4;
    bottom: 0;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    max-width: 500px;
    margin: 0 auto;
}

.del_btn.active {
    background-color: #ffcc33;
    color: #222222;
}

.height_100 {
    height: 100%;
}

.height_auto {
    height: auto;
}
</style>
