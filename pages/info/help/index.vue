<template>
<div id="help" ref="help" style="height: 100%;">
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">帮助中心</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <div class="space background-default">
            <b-row class="padding-default background-white border-btm-2">
                <div class="col-xs-9">
                    <div class="font-222-14">在线客服 (服务时间: 早 8:30 ~ 晚 22:00)</div>
                </div>
                <a href="https://chat16.live800.com/live800/chatClient/chatbox.jsp?companyID=1431825&configID=153858&jid=2924429018&s=1" class="col-xs-3">
                    <img class="fr ml-7 mt-3 ml-3" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                    <div class="font-a4a4-13 fr">点击咨询</div>
                </a>
            </b-row>
            <b-row class="padding-default background-white border-btm-2 mb-15">
                <div class="col-xs-9">
                    <div class="font-222-14">电话客服 (服务时间: 早 8:30 ~ 晚 22:00)</div>
                </div>
                <a :href="'tel:04332651000'" class="col-xs-3">
                    <img class="fr ml-7 mt-3 ml-3" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                    <div class="font-a4a4-13 fr">点击拨打</div>
                </a>
            </b-row>
            <b-row class="padding-default background-white border-btm-2">
                <div class="col-xs-11">
                    <div class="font-222-14">账户问题</div>
                </div>
                <div class="col-xs-1">
                    <img class="fr ml-7 mt-3 ml-3" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                </div>
            </b-row>
            <b-row class="padding-default background-white border-btm-2">
                <div class="col-xs-11">
                    <div class="font-222-14">订单问题</div>
                </div>
                <div class="col-xs-1">
                    <img class="fr ml-7 mt-3 ml-3" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                </div>
            </b-row>
            <b-row class="padding-default background-white">
                <div class="col-xs-11">
                    <div class="font-222-14">配送费说明</div>
                </div>
                <div class="col-xs-1">
                    <img class="fr ml-7 mt-3 ml-3" src="../../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px;">
                </div>
            </b-row>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: "help",
    components: {

    },
    head() {
        return {
            title: '帮助中心'
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
    },
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>

<style scoped>
.space {
    padding: 50px 0 0 0;
}
</style>
