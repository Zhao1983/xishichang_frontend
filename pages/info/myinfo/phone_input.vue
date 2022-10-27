<template>
<div id="phone_input" style="height: 100%;">
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
            <div class="pt-20 pl-20 pr-20 pb-30">
                <div class="border-btm-2 pb-15">
                    <input v-focus ref="phone_number" type="text" inputmode="numeric" class="delivery-input" v-model="phone" name="" value="" placeholder="请输入手机号" style="width: 100%;" @input="setValue">
                </div>
            </div>
            <div class="text-center pl-20 pr-20">
                <div class="font-222-16 btn_control font-weight" @click="setAuthPhoneNumber">下一步</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: "phon_input",
    components: {},
    head() {
        return {
            title: '绑定手机号'
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
    },
    data() {
        return {
            phone: '' // 폰번호
        }
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    },
    methods: {
        setValue(element) {
            element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 11)
            this.phone = element.target.value
        },
        setAuthPhoneNumber() {
            if (this.$refs.phone_number.value === '') {
                this.$utility.showToast('请输入电话号码')
                return
            }

            if (this.$refs.phone_number.value.length !== 11) {
                this.$utility.showToast('请正确输入电话号码')
                return
            }

            localStorage.setItem('phone_number', this.phone)
            this.$router.replace({
                path: '/info/myinfo/auth_number'
            })
        }
    }
}
</script>

<style scoped>
.space {
    padding: 50px 0;
}

.btn_control {
    border-radius: 30px;
    padding: 12px;
    background-color: #ffcc33;
    border: 1px solid #ffcc33;
}
</style>
