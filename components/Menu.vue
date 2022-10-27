<template>
<div id="menu" ref="mainmenu">
    <div :class="{'menu_container_android': isPhone, 'menu_container_iphone': !isPhone}">
        <div :class="{'menu_space_android': isPhone, 'menu_space_iphone': !isPhone}" style="border-right: 1px solid #e5e5e5;" @click="redirectPage('/main')">
            <img class="ml-13" v-if="redirectUrl === 'main'" src="../assets/images/ico_main_selected.png" alt="" style="width: 49px; height: 41px;">
            <img class="ml-13" v-else src="~/assets/images/ico_main_unselected.png" alt="" style="width: 49px; height: 41px;">
        </div>
        <div :class="{'menu_space_android': isPhone, 'menu_space_iphone': !isPhone}" style="border-right: 1px solid #e5e5e5;" @click="redirectPage('/type/type_detail')">
            <img class="ml-11" v-if="redirectUrl === 'type/type_detail'" src="../assets/images/ico_type_selected.png" alt="" style="width: 49px; height: 41px;">
            <img class="ml-11" v-else src="../assets/images/ico_type_unselected.png" alt="" style="width: 49px; height: 41px;">
        </div>
        <div :class="{'menu_space_android': isPhone, 'menu_space_iphone': !isPhone}" style="border-right: 1px solid #e5e5e5; padding-left: 0;">
            <div class="pos-re" style="width: 49px; height: 41px; display: flex; align-items: center; justify-content: center;">
                <a href="https://chat16.live800.com/live800/chatClient/chatbox.jsp?companyID=1431825&configID=153858&jid=2924429018&s=1">
                    <img src="../assets/images/ico_message.png" alt="" style="width: 24px; height: 40px;">
                </a>
            </div>
        </div>
        <div :class="{'menu_space_android': isPhone, 'menu_space_iphone': !isPhone}" style="border-right: 1px solid #e5e5e5;" @click="redirectPage('/goods/cart')">
            <div class="pos-re" style="width: 49px; height: 41px; display: flex; align-items: center; justify-content: center;">
                <img class="ml-12" v-if="redirectUrl === 'goods/cart'" src="../assets/images/ico_cart_selected.png" alt="" style="width: 49px; height: 41px;">
                <img class="ml-12" v-else src="../assets/images/ico_cart_unselected.png" alt="" style="width: 49px; height: 41px;">
                <div v-show="cartCount !== 0" class="icon-cnt" style="top: -6px; right: 5px;">{{ cartCount }}</div>
            </div>
        </div>
        <div :class="{'menu_space_android': isPhone, 'menu_space_iphone': !isPhone}" @click="redirectPage('/info/mypage')">
            <img class="ml-10" v-if="redirectUrl === 'info/mypage'" src="../assets/images/ico_user_selected.png" alt="" style="width: 49px; height: 41px;">
            <img class="ml-10" v-else src="../assets/images/ico_user_unselected.png" alt="" style="width: 49px; height: 41px;">
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
    name: 'Menu',
    components: {},
    props: {
        redirectUrl: {
            type: String,
            required: true
        },
        cartCount: {
            type: Number,
            required: true
        }
    },
    mounted() {
        if (navigator.userAgent.match(/android/i)) {
            this.isPhone = true
        } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.isPhone = false
        }
    },
    data() {
        return {
            isPhone: true
        }
    },
    methods: {
        redirectPage(url) {
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

<style scoped>
.menu_space_android {
    width: 20%;
    display: flex;
    height: 55px;
    align-items: center;
    justify-content: center;
}

.menu_space_iphone {
    width: 20%;
    display: flex;
    text-align: center;
    height: 67px;
    align-items: center;
    justify-content: center;
}

.menu_container_android {
    max-width: 500px;
    width: 100%;
    height: 55px;
    background: #fff;
    border-top: 1px solid #e4e4e4;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    margin: 0 auto;
}

.menu_container_iphone {
    max-width: 500px;
    width: 100%;
    height: 67px;
    background: #fff;
    border-top: 1px solid #e4e4e4;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    margin: 0 auto;
}

.icon-cnt {
    position: absolute;
    background: #cf000e;
    color: #fff;
    border-radius: 20px;
    width: 16px;
    height: 16px;
    font-size: 11px;
    right: 0;
    top: 0;
    padding-top: 2px;
    text-align: center;
}
</style>
