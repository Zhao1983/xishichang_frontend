<template>
<div class="ordertime">
    <div class="back_overlay" v-show="isShowOverlay" @click="closeView"></div>
    <div class="time-content" ref="time">
        <div class="padding-default">
            <b-row>
                <div class="col-xs-11">
                    <div class="font-222-17 font-weight text-center">选择预计到达时间</div>
                </div>
                <div class="col-xs-1">
                    <img class="fr" src="../assets/images/ico_cancel_3.png" alt="" style="width: 17px; height: 17px;" @click="closeView">
                </div>
            </b-row>
        </div>
        <b-row>
            <div class="col-xs-4 background-default" style="height: 250px;">
                <div class="font-222-15 text-center background-white" style="padding: 10px;">今天(周五)</div>
            </div>
            <div class="col-xs-7 ml-15" style="height: 250px; overflow-y: auto;">
                <b-row v-for="(item, index) in orderTime" :key="index" class="border-btm-3">
                    <div class="col-xs-10" @click="selectTime(index)">
                        <div v-if="setTime !== item" class="font-222-15" style="padding: 10px 10px 10px 0;">{{ item }}</div>
                        <div v-else style="font-size: 15px; color: #ecb308; padding: 10px 10px 10px 0;">{{ item }}</div>
                    </div>
                    <div class="col-xs-2">
                        <img v-if="setTime === item" class="mt-13" src="../assets/images/ico_check_1.png" alt="" style="width: 15px; height: 10px;">
                    </div>
                </b-row>
            </div>
        </b-row>
    </div>
</div>
</template>

<script>
export default {
    name: 'OrderTime',
    props: {
        isShowOverlay: {
            type: Boolean,
            required: true
        },
        orderTime: {
            type: Array,
            required: true
        },
        setTime: {
            type: String,
            required: true
        }
    },
    data() {
        return {}
    },
    methods: {
        closeView() {
            this.$nuxt.$emit('handleTime')
        },
        selectTime(index) {
            this.$nuxt.$emit('handleTime', index)
        }
    }
}
</script>
