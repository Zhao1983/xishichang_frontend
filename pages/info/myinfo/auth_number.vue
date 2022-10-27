<template>
<div id="auth_number" style="height: 100%;">
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">绑定手机号</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <div class="space background-white">
            <div class="" style="padding: 14px 20px;">
                <div class="font-222-16 mb-12">请输入验证码</div>
                <div class="font-6262-14">输入 {{ phone }} 收到的验证码</div>
                <div style="height: 40px;"></div>
                <b-row class="mb-16">
                    <div class="col-xs-3 text-center">
                        <input id="number-0" ref="number_0" class="auth-input" type="text" inputmode="numeric" name="" value="" maxlength="1" style="width: 80%;" @input="setValue">
                    </div>
                    <div class="col-xs-3 text-center">
                        <input id="number-1" ref="number_1" class="auth-input" type="text" inputmode="numeric" name="" value="" maxlength="1" style="width: 80%;" @input="setValue">
                    </div>
                    <div class="col-xs-3 text-center">
                        <input id="number-2" ref="number_2" class="auth-input" type="text" inputmode="numeric" name="" value="" maxlength="1" style="width: 80%;" @input="setValue">
                    </div>
                    <div class="col-xs-3 text-center">
                        <input id="number-3" ref="number_3" class="auth-input" type="text" inputmode="numeric" name="" value="" maxlength="1" style="width: 80%;" @input="setValue">
                    </div>
                </b-row>
                <div class="font-9292-13 text-right">{{ second }}s后重新发送</div>
            </div>
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
    name: "auth_number",
    components: {},
    head() {
        return {
            title: '绑定手机号'
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
        this.interval = setInterval(this.countTime, 1000)
        this.phone = localStorage.getItem('phone_number')

        getAuthCode(localStorage.getItem('phone_number')).then(response => {
            if (response.res !== undefined) {
                this.authCode = response.res.data.value
            }
        })
    },
    data() {
        return {
            phone: '',
            interval: 0,
            second: 60,
            authKey: [], // 입력되는 인증코드
            index: 0,
            authCode: '' // 서버에서 내려오는 인증코드
        }
    },
    methods: {
        setValue(element) {
            element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 1)
            this.index = element.target.id.split('-')[1]

            // back키 눌렀을 때
            if (element.data === null) {
                if (element.target.id === 'number-' + this.index) {
                    this.authKey.splice(this.index, 1)

                    this.$nextTick(() => {
                        if (parseInt(this.index) - 1 >= 0) {
                            if (this.$refs['number_' + (parseInt(this.index) - 1)]) {
                                this.$refs['number_' + (parseInt(this.index) - 1)].focus()
                            }
                        }
                    })
                }
            } else { // 값을 입력했을 때
                if (element.target.id === 'number-' + this.index) {
                    this.authKey[this.index] = element.target.value

                    if (this.$refs['number_' + this.index]) {
                        if (this.$refs['number_' + this.index].value !== '') {
                            this.$nextTick(() => {
                                if (parseInt(this.index) + 1 <= 3) {
                                    this.$refs['number_' + (parseInt(this.index) + 1)].focus()
                                }
                            })
                        }
                    }
                }
            }

            // 4자리키가 입력되었다면
            if (this.authKey.length === 4) {
                let code = ''

                this.authKey.filter(res => {
                    code += res
                })

                if (code === this.authCode) {
                    this.$nuxt.$emit('handleLoading', true)

                    updatePhone(this.phone, code).then(() => {
                        this.$nuxt.$emit('handleLoading', false)
                        this.$router.replace({
                            path: '/info/myinfo'
                        })
                    })
                }
            }
        },
        countTime() {
            this.second--

            if (this.second <= 0) {
                clearInterval(this.interval)
                this.authCode = ''
                this.authKey = []
                this.second = 60
            }
        }
    }
}
</script>

<style scoped>
.space {
    padding: 50px 0;
}
</style>
