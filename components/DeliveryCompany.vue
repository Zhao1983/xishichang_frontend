<template>
<div id="deliverycompany">
    <div class="back_overlay" v-show="isShowOverlay" @click="closeView"></div>
    <div class="company-content" ref="deliveryCompany">
        <div class="padding-default">
            <b-row>
                <div class="col-xs-6">
                    <div class="font-222-17 font-weight">选择配送方式</div>
                </div>
                <div class="col-xs-6">
                    <img class="fr" src="../assets/images/ico_cancel_3.png" alt="" style="width: 17px; height: 17px;" @click="closeView">
                </div>
            </b-row>
        </div>
        <div class="padding-default">
            <div v-for="(item, index) in companies" :key="index" class="row-item">
                <img v-if="item.companyCode === 'jtexpress'" class="icon-company" src="../assets/images/ico_delivery_company_3.png" alt="">
                <img v-else-if="item.companyCode === 'yunda'" class="icon-company" src="../assets/images/ico_delivery_company_1.png" alt="">
                <img v-else-if="item.companyCode === 'youzhengguonei'" class="icon-company" src="../assets/images/ico_delivery_company_2.png" alt="">
                <img v-else-if="item.companyCode === 'ems'" class="icon-company" src="../assets/images/ico_delivery_company_2.png" alt="">
                <img v-else-if="item.companyCode === 'ems_2'" class="icon-company" src="../assets/images/ico_delivery_company_2.png" alt="">
                <img v-else-if="item.companyCode === 'shunfeng'" class="icon-company" src="../assets/images/ico_delivery_company_5.png" alt="">
                <img v-else-if="item.companyCode === 'jingdongkuaiyun'" class="icon-company" src="../assets/images/ico_delivery_company_6.png" alt="">
                <div v-else style="width: 50px;"></div>
                <p v-if="deliveryCompanyCode === item.companyCode" class="company-name active">{{ item.companyName }}</p>
                <p v-else class="company-name">{{ item.companyName }}</p>
                <p class="company-price">¥{{ item.salesPrice | addComma }}</p>
                <img class="check-company" v-if="deliveryCompanyCode === item.companyCode" src="../assets/images/ico_check_selected_2.png" alt="" @click="closeView">
                <img class="check-company" v-else src="../assets/images/ico_check_unselected_2.png" alt="" @click="setDeliveryCompany(item.companyCode)">
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'DeliveryCompany',
    props: {
        isShowOverlay: {
            type: Boolean,
            required: true
        },
        companies: {
            type: Array,
            required: true
        },
        deliveryCompanyCode: {
            type: String,
            required: true
        }
    },
    data() {
        return {}
    },
    methods: {
        setDeliveryCompany(deliveryCode) {
            this.$nuxt.$emit('handleCompany', deliveryCode)
        },
        closeView() {
            this.$nuxt.$emit('handleCompany')
        }
    }
}
</script>

<style scoped>

</style>
