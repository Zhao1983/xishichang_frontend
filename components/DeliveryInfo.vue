<template>
<div id="deliveryinfo">
    <div class="back_overlay" v-show="isShowOverlay" @click="closeView"></div>
    <div class="help-content" ref="help" :style="styles">
        <div class="padding-default">
            <b-row>
                <div class="col-xs-6">
                    <div class="font-222-17 font-weight">配送信息</div>
                </div>
                <div class="col-xs-6">
                    <img class="fr" src="../assets/images/ico_cancel_3.png" alt="" style="width: 17px; height: 17px;" @click="closeView">
                </div>
            </b-row>
        </div>
        <div class="border-btm-3" style="padding: 15px 20px;">
            <b-row>
                <div class="col-xs-6">
                    <div class="font-222-15">跑腿费</div>
                </div>
                <div class="col-xs-6">
                    <div class="font-cf00-15 fr">{{ basicPrice | addComma }}元</div>
                </div>
            </b-row>
        </div>
        <div class="border-btm-3" style="padding: 15px 20px;">
            <b-row>
                <div class="col-xs-6">
                    <div class="font-222-15 mb-5">配送距离</div>
                </div>
                <div class="col-xs-6 text-right">
                    <div class="font-222-15 mb-5">{{ totalStreet / 1000 | addComma }}km</div>
                </div>
            </b-row>
        </div>
        <div class="border-btm-3" style="padding: 15px 20px;">
            <b-row>
                <div class="col-xs-7">
                    <div class="font-222-15 mb-5">配送重量</div>
                </div>
                <div class="col-xs-5 text-right">
                    <div class="font-222-15 mb-5">{{ totalWeight | addCommaTwo }}kg</div>
                </div>
            </b-row>
        </div>
        <div class="mb-8" style="padding: 15px 20px;">
            <b-row>
                <div class="col-xs-6">
                    <div class="font-cf00-15">合计</div>
                </div>
                <div class="col-xs-6">
                    <div class="font-cf00-15 fr">{{ basicPrice + totalOverStreetPrice + totalOverStreetPrice | addComma }}元</div>
                </div>
            </b-row>
        </div>
        <b-row>
            <div class="col-xs-3"></div>
            <div class="col-xs-6 text-center">
                <div class="radius-20 font-222-15 pt-13 pb-11 font-weight" style="background-color: #ffcc33;" @click="closeView">知道了</div>
            </div>
            <div class="col-xs-3"></div>
        </b-row>
    </div>
</div>
</template>

<script>
export default {
    name: 'DeliveryInfo',
    props: {
        isShowOverlay: {
            type: Boolean,
            required: true
        },
        basicPrice: {
            type: Number,
            required: true
        },
        totalStreet: {
            type: Number,
            required: true
        },
        overStreet: {
            type: Number,
            required: true
        },
        overStreetPrice: {
            type: Number,
            required: true
        },
        totalOverStreet: {
            type: Number,
            required: true
        },
        totalOverStreetPrice: {
            type: Number,
            required: true
        },
        totalWeight: {
            type: Number,
            required: true
        },
        overWeight: {
            type: Number,
            required: true
        },
        overWeightPrice: {
            type: Number,
            required: true
        },
        totalOverWeight: {
            type: Number,
            required: true
        },
        totalOverWeightPrice: {
            type: Number,
            required: true
        },
        styles: {
            type: Object,
            required: true
        }
    },
    data() {
        return {}
    },
    methods: {
        closeView() {
            this.$nuxt.$emit('handleHelp')
        }
    }
}
</script>

<style scoped>

</style>
