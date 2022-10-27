<template>
<div id="warning_dialog">
    <div v-if="isShowDialog && isStatus === 'white' && isClose" class="back_overlay" @click="handleCancel"></div>
    <div v-else-if="isShowDialog && isStatus === 'white' && !isClose" class="back_overlay"></div>
    <div v-else-if="isShowDialog" class="back_overlay_black"></div>
    <div v-show="isShowDialog" class="dialog-normal-warning">
        <div class="dialog-header">
            <img v-show="isShowClose" class="tag-close" src="../assets/images/ico_cancel_1.png" alt="" @click="handleCancel">
        </div>
        <div v-show="isShowTitle" class="dialog-title">
            <div class="tag-title" style="font-weight: bold;" v-html="title"></div>
        </div>
        <div v-show="isShowContent" class="dialog-content" v-html="content"></div>
        <div class="dialog-footer">
            <b-row v-show="kind === 'setting'">
                <div class="col-xs-6 text-center" @click="handleCancel">
                    <div class="btn-1 left_btn">{{ leftText }}</div>
                </div>
                <div class="col-xs-6 text-center" @click="handleConfirm">
                    <div class="btn-1 right_btn">{{ rightText }}</div>
                </div>
            </b-row>
            <b-row v-show="kind === 'normal'">
                <div class="col-xs-3 text-center"></div>
                <div class="col-xs-6 text-center" @click="handleConfirm">
                    <div class="btn-1 right_btn">{{ normalText }}</div>
                </div>
                <div class="col-xs-3 text-center"></div>
            </b-row>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'WarningDialog',
    props: {
        isShowDialog: {
            type: Boolean,
            required: true
        },
        isShowTitle: {
            type: Boolean,
            required: true
        },
        isShowContent: {
            type: Boolean,
            required: true
        },
        kind: {
            type: String,
            required: true
        },
        title: {
            type: String
        },
        content: {
            type: String
        },
        leftText: {
            type: String
        },
        rightText: {
            type: String
        },
        normalText: {
            type: String
        },
        isShowClose: {
            type: Boolean
        },
        isStatus: {
            type: String,
            required: true
        },
        isClose: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {}
    },
    methods: {
        handleConfirm() {
            this.$nuxt.$emit('handleConfirm')
        },
        handleCancel() {
            this.$nuxt.$emit('handleCancel')
        }
    }
}
</script>

<style scoped>
.left_btn {
    background: #ffffff;
    border: 1px solid #ffcc33;
    color: #222222;
    font-weight: bold;
}

.right_btn {
    background: #ffcc33;
    color: #222222;
    font-weight: bold;
}
</style>
