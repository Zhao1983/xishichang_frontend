<template>
<div id="phone_update" style="height: 100%;">
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">更换绑定手机号</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <div class="space text-center background-white">
            <div style="height: 31px;"></div>
            <img class="mb-26" src="../../../assets/images/ico_phone.png" alt="" style="width: 78px; height: 116px;">
            <div class="font-222-15 mb-22">已绑定手机号:&nbsp;&nbsp;&nbsp;{{ phone }}</div>
            <nuxt-link :to="'/info/myinfo/auth_update'" replace>
                <div class="font-222-17 radius-5 pt-11 btn_control">更换绑定</div>
            </nuxt-link>
        </div>
    </div>
</div>
</template>

<script>
import {
    getProfile
} from '@/api/profile'

export default {
    name: "phone_update",
    components: {},
    head() {
        return {
            title: '更换绑定手机号'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, false)
        this.$nuxt.$emit('handleNoticeShow', false)
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()

        this.$nuxt.$emit('handleLoading', true)
        getProfile().then(response => {
            if (response.res !== undefined) {
                this.phone = response.res.data.phone.slice(0, 3) + '****' + response.res.data.phone.slice(7, 11)
            }

            this.$nuxt.$emit('handleLoading', false)
        })
    },
    data() {
        return {
            phone: ''
        }
    },
    methods: {}
}
</script>

<style scoped>
.space {
    padding: 50px 0;
}

.btn_control {
    width: 70%;
    height: 43px;
    border: 1px solid #929292;
    padding-left: 10%;
    padding-right: 10%;
    margin: 0 auto;
}
</style>
