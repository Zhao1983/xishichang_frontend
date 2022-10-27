<template>
<div id="noticedialog">
    <div v-show="isShowDialog" class="notice-overlay">
        <div class="notice-dialog">
            <div class="notice-dialog-content">
                <img class="notice-dialog-image" :data-src="background" src="../assets/images/image_placeholder.png" alt="" v-lazy-load />
                <div class="notice-dialog-option">
                    <p class="left-item" @click="setVisible">今日内不在弹出</p>
                    <img class="right-item" src="../assets/images/ico_cancel_6.png" alt="" @click="handleCancel">
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import background from '@/assets/images/notice_back.png'

export default {
    name: 'NoticeDialog',
    props: {
        isShowDialog: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            background: background
        }
    },
    methods: {
        handleCancel() {
            this.$nuxt.$emit('handleNoticeCancel')
        },
        setVisible() {
            this.$nuxt.$emit('handleNoticeVisible')
        }
    }
}
</script>

<style scoped>
</style>
