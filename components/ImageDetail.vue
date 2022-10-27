<template>
<div id="imagedetail">
    <div class="back_overlay" style="z-index: 5000; background-color: #000;"></div>
    <img class="pos-fix" src="../assets/images/ico_cancel_6.png" alt="" @click="handleCancelView" style="width: 20px; height: 20px; top: 15px; right: 15px; z-index: 6000;">
    <div ref="swiper_content" class="mod_slider_viewer">
        <swiper class="swiper" :options="swiperImage">
            <swiper-slide class="swiper-slide" v-for="(item, index) in imgData" :key="index" style="display: flex; align-items: center;">
                <img :src="item.uri" alt="" style="width: 100%; height: auto; object-fit: fill;" />
            </swiper-slide>
        </swiper>
        <div class="page-number" slot="pagination"></div>
    </div>
</div>
</template>

<script>
export default {
    name: 'ImageDetail',
    components: {},
    props: {
        imgData: {
            type: Array,
            required: true
        }
    },
    created() {

    },
    data() {
        return {
            swiperImage: {
                spaceBetween: 5,
                zoom: true,
                pagination: {
                    el: '.page-number',
                    type: 'fraction'
                }
            }
        }
    },
    methods: {
        handleCancelView() {
            this.$nuxt.$emit('handleCancelView')
        }
    }
}
</script>

<style scoped>
.mod_slider_viewer {
    height: 100% !important;
    padding: 0;
    background: transparent;
    position: fixed !important;
    top: 20%;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 5100 !important;
}
</style>
