<template>
<div id="qr_view" style="height: 100%;">
    <div class="container" style="display: flex; align-items: center; background-color: #fff;">
        <img :src="qr_image" alt="" style="width: 100%; height: auto;">
    </div>
</div>
</template>

<script>
import qr_image from '@/assets/images/qr_image.jpg'

export default {
    name: 'Inspect',
    components: {},
    created() {},
    data() {
        return {
            qr_image: qr_image
        }
    },
    methods: {}
}
</script>

<style scoped>
</style>
