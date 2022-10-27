<template>
<div id="inspect" style="height: 100%;">
    <div class="container text-center">
        <img :src="backImage" alt="" style="width: 194px; height: 129px; margin-top: 40%;">
        <div class="font-222-20 font-weight mt-30">系统升级维护中...</div>
        <div class="font-b8b8-14 mt-12">{{ reason }}</div>
    </div>
</div>
</template>

<script>
import backImage from '@/assets/images/image_inspect.png'

export default {
    name: "inspect",
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
