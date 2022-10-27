<template>
<div id="notice_detail" style="height: 100%;">
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">系统消息</div>
                </div>
                <div v-show="messageData.length !== 0" class="col-xs-2 text-right pt-5" @click="setShowDialog">清空</div>
            </b-row>
        </div>
        <div class="space background-default">
            <div v-if="messageData.length === 0" class="text-center">
                <div style="height: 150px;"></div>
                <img class="mb-13" src="../../../assets/images/ico_empty_message.png" alt="" style="width: 85px; height: 85px;">
                <div class="font-6666-15">当前没有任何消息哦</div>
            </div>
            <div class="pt-15" v-else v-for="item in messageData" :key="item.id">
                <div class="font-white-11 radius-3 mb-7 space_1 text-center">{{ item.createDt }}</div>
                <div class="background-white radius-5" style="padding: 15px;">
                    <div class="font-222-15 line-height-2 text-left">{{ item.msgContent }}</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    getMessage,
    deleteMessages,
    setMessageStatus
} from '@/api/notice'

export default {
    name: "notice_detail",
    components: {

    },
    head() {
        return {
            title: '系统消息'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, true)
        this.$nuxt.$emit('handleNoticeShow', false)

        // 알림 삭제요청
        this.$nuxt.$on('handleConfirmDeleteNotice', () => {
            this.setDelete()
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('handleConfirmDeleteNotice')
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()

        this.getMessageData()
    },
    data() {
        return {
            messageData: [] // 메세지 배렬
        }
    },
    methods: {
        getMessageData() { // 메세지 내용 얻기
            this.$nuxt.$emit('handleLoading', true)

            getMessage().then(response => {
                if (response.res !== undefined) {
                    setMessageStatus().then(() => {
                        this.messageData = response.res.data
                    })
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setDelete() { // 메세지 내용 삭제
            this.$nuxt.$emit('handleLoading', true)

            deleteMessages().then(() => {
                this.getMessageData()
            })

            this.$nuxt.$emit('handleLoading', false)
        },
        setShowDialog() {
            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '確定要刪除嗎？', '', '否', '是', '', 'white', false, true, 'notice_delete')
        }
    }
}
</script>

<style scoped>
.space {
    height: auto;
    padding: 50px 15px 15px 15px;
}

.space_1 {
    background-color: #dadada;
    width: 130px;
    margin: 0 auto;
    padding: 3px;
}
</style>
