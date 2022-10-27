<template>
<div id="auth_update" style="height: 100%;">
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
        <div class="space background-white">
            <div class="border-btm-2 pb-15">
                <input v-focus id="phone" ref="phone" type="text" v-model="phone" inputmode="numeric" class="delivery-input" name="" value="" placeholder="请输入手机号" style="width: 100%;" @input="setValueData">
            </div>
            <b-row class="pb-4 border-btm-2 pt-4">
                <div class="col-xs-6">
                    <input id="authCode" ref="authCode" type="text" v-model="authCode" inputmode="numeric" class="delivery-input" name="" value="" placeholder="请输入验证码" style="width: 100%;" @input="setValueData">
                </div>
                <div class="col-xs-6 text-center">
                    <div v-if="isActiveCode === ''" class="btn_1 fr pt-7">发送验证码</div>
                    <div v-else-if="isActiveCode === 'active'" class="btn_1 fr pt-7 active" @click="setSendCode">发送验证码</div>
                    <div v-else-if="isActiveCode === 'submit'" class="btn_1 fr pt-7">{{ second }}s后重新发送</div>
                </div>
            </b-row>
            <div v-if="!isActiveUpdate" class="mt-30 text-center btn_2">立即绑定</div>
            <div v-else class="mt-30 text-center btn_2 active" @click="setUpdatePhone">立即绑定</div>
        </div>
    </div>
</div>
</template>

<script>
import {
    getAuthCode,
    updatePhone
} from '@/api/profile'

export default {
    name: "auth_update",
    components: {},
    head() {
        return {
            title: '更换绑定手机号'
        }
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
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
        this.$nuxt.$emit('handleNoticeShow', false)
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()
        window.addEventListener('keyup', this.setFilterValue)

    },
    data() {
        return {
            phone: '',
            code: '',
            authCode: '',
            interval: 0,
            second: 60,
            isActiveCode: '',
            isActiveUpdate: false
        }
    },
    methods: {
        countTime() {
            this.second--

            if (this.second <= 0) {
                clearInterval(this.interval)
                this.authCode = ''
                this.isActiveCode = 'active'
                this.second = 60
                this.isActiveUpdate = false
            }
        },
        setFilterValue(element) {
            if (element.target.id === 'phone') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 11)
                this.phone = element.target.value
                this.isActiveCode = element.target.value.length === 11 ? 'active' : ''
            }

            if (element.target.id === 'authCode') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 4)
                this.authCode = element.target.value
                this.isActiveUpdate = element.target.value.length === 4
            }
        },
        setSendCode() { // 인증코드 받기
            this.$nuxt.$emit('handleLoading', true)

            getAuthCode(this.phone).then(response => {
                if (response.res !== undefined) {
                    this.code = response.res.data.value
                    this.isActiveCode = 'submit'
                    this.interval = setInterval(this.countTime, 1000)
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setUpdatePhone() {
            if (this.code === this.authCode) {
                this.$nuxt.$emit('handleLoading', true)

                updatePhone(this.phone, this.authCode).then(() => {
                    this.$nuxt.$emit('handleLoading', false)

                    this.$router.replace({
                        path: '/info/myinfo'
                    })
                })
            } else {
                this.$utility.showToast('验证失败')
            }
        },
        setValueData() {
            if (this.isActiveCode !== 'submit') {
                this.isActiveCode = this.phone.length === 11 ? 'active' : ''
            }

            this.isActiveUpdate = this.phone.length === 11 && this.authCode.length === 4
        }
    }
}
</script>

<style scoped>
.space {
    padding: 65px 15px;
}

.btn_1 {
    width: 102px;
    height: 29px;
    border: 1px solid #eaeaea;
    font-size: 13px;
    color: #cbcbcb;
    border-radius: 3px;
}

.btn_1.active {
    border: 1px solid #ffcc33;
    color: #222222;
    background-color: #ffcc33;
}

.btn_2 {
    border-radius: 30px;
    padding: 12px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    color: #cbcbcb;
    font-size: 16px;
}

.btn_2.active {
    border: 1px solid #ffcc33;
    color: #222222;
    background-color: #ffcc33;
    font-weight: bold;
}
</style>
