<template>
<div id="found" style="height: 100%;">
    <div class="container" style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <!-- <img :src="backImage" alt="" style="width: 240px; height: auto;"> -->
        <div class="font-222-16 mt-12 font-weight">{{ reason }}</div>
        <nuxt-link :to="'/main'">
            <div class="btn-radius text-center" style="margin-top: 30px; background-color: #cf000e; color: #fff;">返回首页</div>
        </nuxt-link>
    </div>
</div>
</template>

<script>
import backImage from '@/assets/images/404.png'

export default {
    name: "found",
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
