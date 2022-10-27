<template>
<div id="receive_complete" style="height: 100%;">
    <div class="container text-center">
        <div style="height: 150px;"></div>
        <img class="mb-20" src="../../../assets/images/ico_complete.png" alt="" style="width: 90px; height: 90px;">
        <div class="font-222-20 font-weight mb-20">交易成功</div>
        <div class="font-8a8a-14 line-height-2 mb-24">感谢您对我们的支持与信任，<br>有您的支持我们会努力做到最好!</div>
        <b-row>
            <div class="col-xs-4"></div>
            <div class="col-xs-4">
                <nuxt-link :to="'/main'" replace>
                    <div class="btn_style">返回首页</div>
                </nuxt-link>
            </div>
            <div class="col-xs-4"></div>
        </b-row>
    </div>
</div>
</template>

<script>
export default {
    name: "receive_complete",
    components: {

    },
    head() {
        return {
            title: '交易成功'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, false)
    },
    mounted() {
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
.btn_style {
    color: #6b6a6a;
    font-size: 16px;
    border: 1px solid #dedede;
    border-radius: 20px;
    padding: 7px 15px;
}
</style>
