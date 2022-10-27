<template>
<div id="user_warning" style="height: 100%;">
    <div class="container text-center">
        <img :src="backImage" alt="" style="width: 135px; height: 152px; margin-top: 40%;">
        <div class="font-222-20 font-weight mt-30">您的账户已被停用</div>
        <div class="font-b8b8-14 mt-12">{{ reason }}</div>
    </div>
</div>
</template>

<script>
import backImage from '@/assets/images/image_user_warning.png'

export default {
    name: "user_warning",
    components: {},
    created() {},
    mounted() {
        this.reason = this.$route.query && this.$route.query.reason
    },
    data() {
        return {
            backImage: backImage,
            reason: ''
        }
    },
    methods: {}
}
</script>

<style scoped>

</style>
