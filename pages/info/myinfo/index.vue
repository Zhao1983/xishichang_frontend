<template>
<div id="myinfo" style="height: 100%;">
    <div class="back_overlay" v-show="isShowOverlay" @click="setCancelView('gender')"></div>
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="goBack" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">我的资料</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <div class="space">
            <b-row class="border-btm-3" style="padding: 10px 15px; display: flex; align-items: center;">
                <div class="col-xs-6">
                    <div class="font-222-15">头像</div>
                </div>
                <div class="col-xs-6 text-right">
                    <input type="file" ref="file" name="" value="" style="display: none;" accept="image/*" @change="setChangeAvatar">
                    <div @click="setAvatar">
                        <img v-if="userAvatar === ''" src="../../../assets/images/ico_avatar.png" alt="" style="width: 58px; height: 58px; border-radius: 50px;">
                        <img v-else :src="userAvatar" alt="" style="width: 58px; height: 58px; border-radius: 50px;">
                        <img class="ml-5" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                    </div>
                </div>
            </b-row>
            <b-row class="border-btm-3 padding-default">
                <div class="col-xs-4">
                    <div class="font-222-15">昵称</div>
                </div>
                <div class="col-xs-8 text-right">
                    <img class="ml-10 fr mt-4" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                    <div class="font-222-15 fr">{{ nickName }}</div>
                </div>
            </b-row>
            <b-row class="border-btm-3 padding-default">
                <div class="col-xs-4">
                    <div class="font-222-15">性别</div>
                </div>
                <div class="col-xs-8 text-right">
                    <div @click="setShowGenderMenu">
                        <img class="ml-10 fr mt-4" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                        <div class="font-222-15 fr">{{ gender }}</div>
                    </div>
                </div>
            </b-row>
            <b-row class="border-btm-3 padding-default">
                <div class="col-xs-4">
                    <div class="font-222-15">出生日期</div>
                </div>
                <div class="col-xs-8 text-right">
                    <div @click="setCalendar">
                        <img class="ml-10 fr mt-4" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                        <div class="font-222-15 fr">{{ birthday }}</div>
                    </div>
                </div>
            </b-row>
            <b-row class="border-btm-3 padding-default">
                <div class="col-xs-4">
                    <div class="font-222-15">绑定手机号</div>
                </div>
                <div class="col-xs-8 text-right">
                    <nuxt-link v-if="phone === ''" :to="'/info/myinfo/phone_input'">
                        <img class="ml-10 fr mt-5" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                        <div class="font-222-15 fr">防止账号丢失</div>
                    </nuxt-link>
                    <nuxt-link v-else :to="'/info/myinfo/phone_update'">
                        <img class="ml-10 fr mt-5" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                        <div class="font-222-15 fr">{{ phone.slice(0, 3) }}****{{ phone.slice(7, 11) }}</div>
                        <img class="fr mt-3 mr-3" src="../../../assets/images/ico_success_1.png" alt="" style="width: 13px; height: 13px;">
                    </nuxt-link>
                </div>
            </b-row>
        </div>
    </div>

    <!-- 아바타변경 -->
    <div class="avatarimg-change-wrap cropper_setting_1" v-show="isShowChangeAvatar">
        <div class="cropper_setting_2">
            <cropper style="flex: auto;" ref="cropper" :src="uploadImage" :stencil-props="cropperParam" stencil-component="circle-stencil"></cropper>
            <div class="">
                <label class="fl font-white-16" style="padding: 20px 15px;" @click="setCancelView('crop')">取消</label>
                <label class="fr font-white-16" style="padding: 20px 15px;" @click="setUploadAvatarImage">完成</label>
            </div>
        </div>
    </div>
    <!-- 성별선택 -->
    <div class="menu-content-1" ref="gender">
        <div class="border-btm-1 text-center">
            <div class="font-222-17" style="padding: 12px;" @click="setConfirmGender('1', '男')">男</div>
        </div>
        <div class="border-btm-1 text-center">
            <div class="font-222-17" style="padding: 12px;" @click="setConfirmGender('2', '女')">女</div>
        </div>
        <div style="height: 6px; width: 100%; background-color: #efeff4;"></div>
        <div class="text-center" @click="setCancelView('gender')">
            <div class="font-222-17" style="padding: 12px;">取消</div>
        </div>
    </div>

    <!--  달력  -->
    <input ref="calendar" type="date" name="" v-model="birthday" value="" @change="setBirthday" style="">
</div>
</template>

<script>
import {
    Cropper
} from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

import {
    getProfile,
    setUploadAvatarImage,
    setUpdateAvatarImage,
    updateGender,
    updateBirthday
} from '@/api/profile'

export default {
    name: "myinfo",
    components: {
        Cropper
    },
    head() {
        return {
            title: '我的资料'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, true)
        this.$nuxt.$emit('handleNoticeShow', false)
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()

        if (navigator.userAgent.match(/android/i)) {
            this.isPhone = true
        } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.isPhone = false
        }

        this.getProfileData()
    },
    data() {
        return {
            isPhone: false,
            isShowOverlay: false,
            userAvatar: '', // 사용자아바타 이미지
            nickName: '', // 사용자명
            gender: '', // 성별
            birthday: '', // 생년월일
            phone: '', // 폰번호
            isShowChangeAvatar: false, // 이미지크롭 로출 여부
            fileName: '',
            fileType: '',
            cropperParam: {
                aspectRatio: 1,
                previewClassname: 'preview'
            },
            uploadImage: ''
        }
    },
    methods: {
        getProfileData() {
            this.$nuxt.$emit('handleLoading', true)

            getProfile().then(response => {
                if (response.res !== undefined) {
                    this.userAvatar = response.res.data.avatar
                    this.nickName = response.res.data.nick
                    this.gender = response.res.data.gender
                    this.birthday = response.res.data.birthday
                    this.phone = response.res.data.phone
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setAvatar() {
            this.$refs.file.click()
        },
        setChangeAvatar(input) { // 이미지 미리보기
            if (input.target.files && input.target.files[0]) {
                if (input.target.files[0].type !== 'image/jpeg' && input.target.files[0].type !== 'image/png') {
                    this.$utility.showToast('请选择PNG,JPG照片格式文件')
                    return
                }

                this.fileName = input.target.files[0].name
                this.fileType = input.target.files[0].type
                this.uploadImage = URL.createObjectURL(input.target.files[0])
                this.isShowChangeAvatar = !this.isShowChangeAvatar
            }
        },
        setUploadAvatarImage() { // 이미지 업로드하기
            const {
                canvas
            } = this.$refs.cropper.getResult()

            this.userAvatar = canvas.toDataURL()
            const blob = this.base64ToBlob(this.userAvatar)

            if (canvas) {
                const file = new File([blob], this.fileName, {
                    type: this.fileType
                })
                let data = new FormData()
                data.append('file', file)
                this.$nuxt.$emit('handleLoading', true)

                setUploadAvatarImage(data).then(response => {
                    if (response.res !== undefined) {
                        const value = {
                            name: response.res.data.uri
                        }
                        setUpdateAvatarImage(value).then(() => {})
                    }

                    this.$nuxt.$emit('handleLoading', false)
                    this.isShowChangeAvatar = false
                })
            }
        },
        base64ToBlob(data) { // base64->Blob
            const arr = data.split(',')
            const mime = arr[0].match(/:(.*?);/)[1]
            const bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], {
                type: mime
            })
        },
        setConfirmGender(key, value) { // 성별 선택
            this.$nuxt.$emit('handleLoading', true)

            const query = {
                name: key
            }

            updateGender(query).then(() => {
                this.gender = value
                this.$nuxt.$emit('handleLoading', false)
                this.setCancelView('gender')
            })
        },
        setCalendar() { // 달력 선택
            if (this.isPhone) { // 안드로이드이면
                this.$refs.calendar.click()
            } else {
                this.$refs.calendar.focus()
            }
        },
        setBirthday(event) { // 생년월일 선택
            if (event.target.value !== '') {
                this.$nuxt.$emit('handleLoading', true)
                const value = {
                    name: event.target.value
                }

                updateBirthday(value).then(() => {
                    this.birthday = event.target.value
                    this.$nuxt.$emit('handleLoading', false)
                })
            }
        },
        setShowGenderMenu() { // 성별선택메뉴 로출
            this.isShowOverlay = true
            this.$refs.gender.classList.toggle('collapsed')
        },
        setCancelView(index) { // 뷰들 닫기
            if (index === 'crop') {
                this.isShowChangeAvatar = false
            }

            if (index === 'gender') {
                this.isShowOverlay = false
                this.$refs.gender.classList.toggle('collapsed')
            }
        },
        goBack() {
            if (window.history.length === 1) {
                this.$router.replace({
                    path: '/main'
                })
            } else {
                this.$router.go(-1)
            }
        }
    }
}
</script>

<style scoped>
.space {
    height: auto;
    padding: 50px 0 0 0;
    background-color: #fff;
}

.cropper_setting_1 {
    max-width: 500px;
    top: 0;
    width: 100%;
    height: 100%;
    background: #1b1616;
    position: fixed;
    z-index: 2000;
    margin: 0 auto;
}

.cropper_setting_2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
}

input[type=date] {
    -webkit-appearance: none;
    justify-content: flex-end;
    width: 0;
    height: 0;
    padding: 0;
    border: none;
    font-size: 0;
    background: transparent;
    display: block;
}

::-webkit-calendar-picker-indicator {
    display: none;
}
</style>
