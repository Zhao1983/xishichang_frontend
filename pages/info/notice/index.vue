<template>
<div id="notice" style="height: 100%;">
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">消息({{ noticeCount }})</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <div class="space background-white">
            <div class="border-btm-3 pt-15 pb-15 mb-15">
                <b-row>
                    <nuxt-link :to="'/info/notice/notice_detail'">
                        <div class="pos-re fl" style="width: 48px; height: 48px;">
                            <img class="fl" src="../../../assets/images/ico_alarm.png" alt="" style="width: 48px; height: 48px;">
                            <div v-show="noticeCount !== 0" class="icon-cnt" style="top: -6px; right: -8px; width: 20px; height: 20px; padding-top: 4px;">{{ noticeCount }}</div>
                        </div>
                        <div class="fl ml-16">
                            <div class="font-222-16 pt-3">系统消息</div>
                            <div class="font-9292-13 mt-10">进来看看吧</div>
                        </div>
                    </nuxt-link>
                </b-row>
            </div>
            <div class="border-btm-3 pb-15">
                <b-row>
                    <a href="https://chat16.live800.com/live800/chatClient/chatbox.jsp?companyID=1431825&configID=153858&jid=2924429018&s=1">
                        <img class="fl" src="../../../assets/images/ico_service_2.png" alt="" style="width: 48px; height: 48px;">
                        <div class="fl ml-16">
                            <div class="font-222-16 pt-3">在线客服</div>
                            <div class="font-9292-13 mt-10">早 8:30 ~ 晚 22:00</div>
                        </div>
                    </a>
                </b-row>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    getMessageCount
} from '@/api/notice'

export default {
    name: "notice",
    components: {

    },
    head() {
        return {
            title: '消息'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', true)
        this.$nuxt.$emit('handleOtherMenu', false, false)
        this.$nuxt.$emit('handleNoticeShow', false)
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()

        this.$nuxt.$emit('handleLoading', true)

        getMessageCount().then(response => {
            if (response.res !== undefined) {
                this.noticeCount = parseInt(response.res.data)
            }

            this.$nuxt.$emit('handleLoading', false)
        })
    },
    data() {
        return {
            noticeCount: 0 // 메시지 개수
        }
    },
    methods: {

    }
}
</script>

<style scoped>
.space {
    padding: 50px 15px 70px 15px;
}
</style>
