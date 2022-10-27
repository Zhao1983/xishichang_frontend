<template>
<div id="listmenu">
    <div class="back_overlay" v-show="isShowOverlay" @click="handleCancel"></div>
    <div class="menu-content" ref="menu">
        <div v-if="menu !== 'main'" class="border-btm-1 text-center" @click="redirectPage('/main')">
            <div class="font-222-17" style="padding: 13px;">首页</div>
        </div>
        <div v-else class="border-btm-1 text-center" @click="handleCancel">
            <div class="font-222-17" style="padding: 13px;">首页</div>
        </div>

        <div v-if="menu !== 'type'" class="border-btm-1 text-center" @click="redirectPage('/type/type_detail')">
            <div class="font-222-17" style="padding: 13px;">分类</div>
        </div>
        <div v-else class="border-btm-1 text-center" @click="handleCancel">
            <div class="font-222-17" style="padding: 13px;">分类</div>
        </div>

        <div v-if="menu !== 'message'" class="border-btm-1 text-center" @click="redirectPage('/info/notice')">
            <div class="font-222-17" style="padding: 13px;">消息</div>
        </div>
        <div v-else class="border-btm-1 text-center" @click="handleCancel">
            <div class="font-222-17" style="padding: 13px;">消息</div>
        </div>

        <div v-if="menu !== 'cart'" class="border-btm-1 text-center" @click="redirectPage('/goods/cart')">
            <div class="font-222-17" style="padding: 13px;">购物车</div>
        </div>
        <div v-else class="border-btm-1 text-center" @click="handleCancel">
            <div class="font-222-17" style="padding: 13px;">购物车</div>
        </div>

        <div v-if="menu !== 'mypage'" class="border-btm-1 text-center" @click="redirectPage('/info/mypage')">
            <div class="font-222-17" style="padding: 13px;">我的</div>
        </div>
        <div v-else class="border-btm-1 text-center" @click="handleCancel">
            <div class="font-222-17" style="padding: 13px;">我的</div>
        </div>

        <div style="height: 6px; width: 100%; background-color: #efeff4;"></div>
        <div class="text-center" @click="handleCancel">
            <div class="font-222-17" style="padding: 13px;">取消</div>
        </div>
    </div>
</div>
</template>

<script>
import define from '@/utility/define'
import {
    getType
} from '@/api/type'

export default {
    name: 'ListMenu',
    props: {
        isShowOverlay: {
            type: Boolean,
            required: true
        },
        menu: {
            type: String,
            required: true
        }
    },
    data() {
        return {}
    },
    methods: {
        handleCancel() {
            this.$nuxt.$emit('cancelMenu')
        },
        redirectPage(url) {
            this.$nuxt.$emit('cancelMenu')

            switch (url) {
                case '/main': // 메인페지
                    if (this.$route.path !== url) {
                        // 사이트의 이전 정보들 초기화
                        this.$utility.setAllClearCookieAndStorageData('all')
                        this.$router.push({
                            path: url
                        })
                    }
                    break
                case '/type/type_detail': // 분류페지
                    getType().then(response => {
                        if (response.res !== undefined) {
                            const typeId = response.res.data.length !== 0 ? response.res.data[0].id : 0

                            if (this.$route.path !== url + '?id=' + typeId + '&subid=0') {
                                // 사이트의 이전 정보들 초기화
                                this.$utility.setAllClearCookieAndStorageData('all')
                                this.$router.push({
                                    path: url + '?id=' + typeId + '&subid=0'
                                })
                            }
                        }
                    })
                    break
                case '/info/notice': // 공지사항페지
                case '/goods/cart': // 장바구니페지
                case '/info/mypage': // 나의정보페지
                    if (sessionStorage.getItem('token') === '' || !sessionStorage.getItem('token')) {
                        if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                            window.location.href = define.AUTH_URL + '?id=0-0&type=' + url.split('/')[2]
                        } else {
                            this.$router.push({
                                path: '/qr_view'
                            })
                        }
                    } else {
                        if (this.$route.path !== url) {
                            // 사이트의 이전 정보들 초기화
                            this.$utility.setAllClearCookieAndStorageData('all')
                            this.$router.push({
                                path: url
                            })
                        }
                    }
                    break
            }
        }
    }
}
</script>
