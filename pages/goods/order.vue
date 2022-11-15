<template>
<div id="order" ref="order" style="height: 100%;">
    <div class="back_overlay" v-show="isShowPhoneBound" @click="setCancelView('bound')"></div>
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div class="font-222-18 pt-6 text-center">提交订单</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <div style="height: auto; padding-bottom: 60px !important; background-color: #f5f6fd;">
            <div class="pos-re space_1">
                <div class="top_background active"></div>
                <div class="pos-ab" style="top: 50px; width: 100%;">
                    <!-- 시장 마감시간전 경고메세지 부분 -->
                    <div v-show="isLimitTime" class="limit-time-content mb-10">
                        <b-row class="pl-10 pr-10">
                            <img class="fl" src="../../assets/images/ico_info_1.png" alt="" style="width: 15px; height: 15px;">
                            <div class="ml-3 fl mt-1" style="font-size: 12px; color: #846211;">如现在支付订单, 我们将在最近的工作时间内安排发货哟</div>
                        </b-row>
                    </div>
                    <div class="padding-default pt-0 pb-0">
                        <div class="pos-re">
                            <div v-if="isTab === '0'" class="text-left">
                                <img src="../../assets/images/btn_tab_left.png" alt="" style="width: 98%; height: auto;">
                            </div>
                            <div v-else class="text-right">
                                <img class="text-right" src="../../assets/images/btn_tab_right.png" alt="" style="width: 98%; height: auto;">
                            </div>
                            <b-row class="pos-ab" style="top: 0; width: 100%;">
                                <div class="col-xs-6 tab_heigth" :class="{active: isActiveTab('0')}" @click="setTabKind('0')">
                                    <div class="font-222-15">配送</div>
                                </div>
                                <div class="col-xs-6 tab_heigth" :class="{active: isActiveTab('1')}" @click="setTabKind('1')">
                                    <div class="font-222-15">到店自取</div>
                                </div>
                            </b-row>
                        </div>
                        <!-- 택배/배달 탭 -->
                        <div v-if="isTab === '0'" class="background-white padding-default radius-right-top-10 radius-left-bottom-10 radius-right-bottom-10" style="height: 160px;">
                            <nuxt-link :to="'/info/delivery/delivery_address?param=' + paramCart">
                                <b-row class="mb-7">
                                    <div class="col-xs-11">
                                        <div v-if="deliveryId === 0">
                                            <div class="font-b3b3-17 fl font-weight">选择收货地址</div>
                                            <img class="fl ml-4" src="../../assets/images/ico_right_2.png" alt="" style="width: 7px; height: 11px; margin-top: 3px;">
                                        </div>
                                        <div v-else>
                                            <div class="font-222-17 line-height-2 font-weight">{{ provinceName }} {{ cityName }} {{ countryName }} {{ address }} {{ houseNo }} <span class="font-b3b3-15">{{ userName }} {{ userPhone }}</span></div>
                                        </div>
                                    </div>
                                    <div class="col-xs-1" style="display: flex; align-items: center; justify-content: flex-end;">
                                        <img class="fr" src="../../assets/images/ico_right_2.png" alt="" style="width: 7px; height: 11px;">
                                    </div>
                                </b-row>
                            </nuxt-link>
                            <img class="mb-10" src="../../assets/images/order_delivery_line.png" alt="" style="width: 100%; height: 4px; margin-left: -5px;">
                            <div v-show="deliveryStatus === '0'" class="font-cf00-13 font-weight">很抱歉,当前《收货地址》暂时无法提供配送</div>
                            <div v-if="type === 'runner'" class="font-222-15 mt-5">跑腿配送</div>
                            <div v-else class="font-222-15 mt-5">快递配送</div>
                        </div>
                        <!-- 시장 직접 주문 탭 -->
                        <div v-else class="background-white padding-default radius-left-top-10 radius-left-bottom-10 radius-right-bottom-10" style="height: 160px;">
                            <div class="font-222-17 font-weight">延吉西市场一楼 电商服务台</div>
                            <div class="font-222-17 mb-10 font-weight">电话: 0433-265-1000</div>
                            <b-row class="mb-10">
                                <div class="col-xs-6">
                                    <div class="font-b3b3-13 mb-10">自取时间</div>
                                    <div @click="setShowTime">
                                        <div class="font-222-13 fl">{{ setTime }}</div>
                                        <img class="fl ml-6" src="../../assets/images/ico_right_2.png" alt="" style="width: 6px; height: 10px; margin-top: 1px;">
                                    </div>
                                </div>
                                <div class="col-xs-6">
                                    <div class="font-b3b3-13 mb-3">预留电话</div>
                                    <input id="selfPhone" ref="selfPhone" class="memo-input font-222-13 pl-7 pt-5" v-model="selfPhone" type="text" inputmode="numeric" name="" value="" style="width: 100px;">
                                    <img class="ml-3" src="../../assets/images/ico_pen.png" alt="" style="width: 9px; height: 13px;">
                                </div>
                            </b-row>
                            <b-row>
                                <div class="fl">
                                    <input id="check-1" v-model="isSelfAgree" class="radius-checkbox-1" type="checkbox" name="">
                                    <label for="check-1"></label>
                                </div>
                                <div class="font-8787-14 ml-6 mt-1">同意</div>
                                <div class="fl ml-8 mt-1" style="font-size: 14px; color: #ecb308;">《到店自取服务协议》</div>
                            </b-row>
                        </div>
                    </div>
                </div>
            </div>
            <div id="content" class="padding-default space_3" :class="{active: isActiveHeader(isLimitTime)}">
                <!-- 배달, 직접 시장에서의 구매인 경우 점포별 주문상품 리스트 -->
                <div v-if="deliveryItems.length === 0 && !freeItems[0] && !eventItems" class="radius-7 padding-default background-white">
                    <div v-for="shop in cartItems" :key="shop.shopId" class="pb-15">
                        <div class="border-btm-3 pb-10" style="width: 100%;">
                            <b-row>
                                <img class="fl mt-2" src="../../assets/images/ico_shop_1.png" alt="" style="width: 17px; height: 15px;">
                                <div class="font-222-16 fl ml-2">{{ shop.shopName }}</div>
                            </b-row>
                        </div>
                        <div v-for="goods in shop.goods" :key="goods.id" class="padding-default border-btm-3">
                            <b-row>
                                <div class="col-xs-4">
                                    <div class="pos-re">
                                        <img class="prod-thumbnail" :data-src="goods.imgUri" alt="" src="" v-lazy-load />
                                        <img class="pos-ab radius-right-top-7" v-show="goods.goodsIconUrl !== ''" :src="goods.goodsIconUrl" alt="" style="width: 40px; height: 40px; top: 0; right: 10%;">
                                        <img v-show="goods.status === '0'" class="pos-ab" src="../../assets/images/ico_outside.png" alt="" style="width: 90%; left: 0; opacity: 0.7;">
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <div class="font-222-14 title-width">{{ goods.name }}</div>
                                    <div v-show="goods.sizeName !== ''" class="font-b8b8-12 title-width mt-3">{{ goods.sizeName }}</div>
                                    <b-row class="mt-3">
                                        <div class="col-xs-10">
                                            <div>
                                                <span class="font-cf00-12 font-weight">¥</span>
                                                <span class="font-cf00-14 font-weight" style="margin-left: -4px;">{{ goods.salesPrice | addComma }}</span>
                                                <span class="font-b8b8-13" style="margin-left: -3px;">/{{ goods.unit }}</span>
                                                <span v-show="goods.originalPrice !== 0" class="font-b8b8-13 text-through mt-5">¥{{ goods.originalPrice | addComma }}</span>
                                            </div>
                                        </div>
                                        <div class="col-xs-2">
                                            <div class="font-222-15 font-weight fr">x{{ goods.num }}</div>
                                        </div>
                                    </b-row>
                                </div>
                            </b-row>
                        </div>
                    </div>
                </div>
                <!-- 택배인 경우 택배회사별 주문상품 리스트 -->
                <div v-else>
                    <!-- 유료배송인 경우 -->
                    <div v-for="(item, index) in deliveryItems" :key="index" class="radius-7 padding-default background-white mb-15">
                        <div class="order-goods-content">
                            <div class="content-header">
                                <div class="left-item">
                                    <img v-if="item.deliveryType === 2" class="icon-1" src="../../assets/images/ico_air.png" alt="">
                                    <img v-else class="icon-2" src="../../assets/images/ico_delivery_4.png" alt="">
                                    <p class="title ml-3">包裹{{ (index + 1) }}</p>
                                </div>
                                <div class="right-item"></div>
                            </div>
                            <div class="goods-content">
                                <div class="goods-list">
                                    <swiper :options="swiperOption" style="width: 100%;">
                                        <swiper-slide class="swiper-item" v-for="itm in item.goodsImgs" :key="itm.id">
                                            <img :data-src="itm.imgUri" alt="" src="../../assets/images/image_placeholder.png" style="width: 100%; height: 100%;" v-lazy-load />
                                        </swiper-slide>
                                    </swiper>
                                </div>
                                <nuxt-link :to="'/goods/order_goods?param=' + paramCart + '&deliveryid=' + deliveryId + '&index=' + index + '&kind=delivery'">
                                    <div class="goods-cnt">
                                        <p>共{{ item.goodsImgs.length }}件 ></p>
                                    </div>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="order-item-info">
                            <div class="row-item">
                                <p class="font-222-15">商品金额</p>
                                <p class="font-222-15 font-weight">¥{{ item.totalGoodsPrice | addComma }}</p>
                            </div>
                            <div class="row-item">
                                <p class="font-222-15">配送费</p>
                                <div v-if="item.deliverySalePrice > 0">
                                    <span v-if="item.deliveryCostPrice > item.deliverySalePrice" class="font-b3b3-15 text-through">¥{{ item.companyPrices[0].costPrice | addComma }}</span>
                                    <span class="font-222-15 font-weight">¥{{ item.deliverySalePrice | addComma }}</span>
                                </div>
                                <div v-else>
                                    <span class="font-222-15 font-weight">免运费</span>
                                </div>
                            </div>
                        </div>
                        <div class="padding-default text-right pb-0">
                            <span class="font-b3b3-13">(包裹{{ (index + 1) }}重量:{{ (item.totalGoodsWeight + item.totalPackageWeight) | addCommaTwo }}kg)</span>
                            <span class="font-222-16 font-weight">小计 : ¥{{ (item.deliverySalePrice + item.totalGoodsPrice) | addComma }}</span>
                        </div>
                    </div>
                    <!-- 무료배송인 경우(공장인 조건) -->
                    <div v-if="freeItems[0]" class="radius-7 padding-default background-white mb-15">
                        <div class="order-goods-content">
                            <div class="content-header">
                                <div class="left-item">
                                    <img class="icon-2" src="../../assets/images/ico_delivery_4.png" alt="">
                                    <p class="title ml-3" style="color: #cf000e;">免运费</p>
                                    <p class="sub-title ml-2">(包裹{{ (deliveryItems.length + 1) }})</p>
                                </div>
                                <div class="right-item"></div>
                            </div>
                            <div class="goods-content">
                                <div class="goods-list">
                                    <swiper :options="swiperOption" style="width: 100%;">
                                        <swiper-slide class="swiper-item" v-for="itm in freeItems[0].goodsImgs" :key="itm.id">
                                            <img :data-src="itm.imgUri" alt="" src="../../assets/images/image_placeholder.png" style="width: 100%; height: 100%;" v-lazy-load />
                                        </swiper-slide>
                                    </swiper>
                                </div>
                                <nuxt-link :to="'/goods/order_goods?param=' + paramCart + '&deliveryid=' + deliveryId + '&index=0&kind=free'">
                                    <div class="goods-cnt">
                                        <p>共{{ freeItems[0].goodsImgs.length }}件 ></p>
                                    </div>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="order-item-info">
                            <div class="row-item">
                                <p class="font-222-15">商品金额</p>
                                <p class="font-222-15 font-weight">¥{{ freeItems[0].totalGoodsPrice | addComma }}</p>
                            </div>
                            <div class="row-item">
                                <p class="font-222-15">配送费</p>
                                <p class="font-222-15 font-weight">免运费</p>
                            </div>
                        </div>
                        <div class="padding-default text-right pb-0">
                            <span class="font-b3b3-13">(包裹{{ (deliveryItems.length + 1) }}重量:{{ freeItems[0].totalGoodsWeight | addCommaTwo }}kg)</span>
                            <span class="font-222-16 font-weight">小计 : ¥{{ freeItems[0].totalGoodsPrice | addComma }}</span>
                        </div>
                    </div>
                    <!-- 이벤트가 적용된 경우 -->
                    <div v-if="eventItems && eventItems.goodsImgs.length !== 0" class="radius-7 padding-default background-white mb-15">
                        <div class="order-goods-content">
                            <div class="content-header">
                                <div class="left-item">
                                    <img class="icon-2" src="../../assets/images/ico_delivery_4.png" alt="">
                                    <p class="title ml-3" style="color: #cf000e;">免运费</p>
                                    <p class="sub-title ml-2">(包裹{{ (deliveryItems.length + freeItems.length + 1) }})</p>
                                </div>
                                <div class="right-item"></div>
                            </div>
                            <div class="goods-content">
                                <div class="goods-list">
                                    <swiper :options="swiperOption" style="width: 100%;">
                                        <swiper-slide class="swiper-item" v-for="itm in eventItems.goodsImgs" :key="itm.id">
                                            <img :data-src="itm.imgUri" alt="" src="../../assets/images/image_placeholder.png" style="width: 100%; height: 100%;" v-lazy-load />
                                        </swiper-slide>
                                    </swiper>
                                </div>
                                <nuxt-link :to="'/goods/order_goods?param=' + paramCart + '&deliveryid=' + deliveryId + '&index=0&kind=event'">
                                    <div class="goods-cnt">
                                        <p>共{{ eventItems.goodsImgs.length }}件 ></p>
                                    </div>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="order-item-info">
                            <div class="row-item">
                                <p class="font-222-15">商品金额</p>
                                <p class="font-222-15 font-weight">¥{{ eventItems.totalGoodsPrice | addComma }}</p>
                            </div>
                            <div class="row-item">
                                <p class="font-222-15">配送费</p>
                                <p class="font-222-15 font-weight">免运费</p>
                            </div>
                        </div>
                        <div class="padding-default text-right pb-0">
                            <span class="font-b3b3-13">(包裹{{ (deliveryItems.length + freeItems.length + 1) }}重量:{{ eventItems.totalGoodsWeight + eventItems.packageWeight | addCommaTwo }}kg)</span>
                            <span class="font-222-16 font-weight">小计 : ¥{{ eventItems.totalGoodsPrice | addComma }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 주문 상세 정보 -->
            <div id="info" class="padding-default">
                <div class="background-white radius-7 padding-default">
                    <b-row class="mb-15">
                        <div class="col-xs-6">
                            <div class="font-222-15">备注</div>
                        </div>
                        <div class="col-xs-6">
                            <input id="remark" v-model="remark" class="memo-input" type="text" name="" value="">
                        </div>
                    </b-row>
                    <!-- 배송탭을 클릭했으면 아래의 내용 로출, 매장에서 직접 주문탭을 클릭했으면 비로출 -->
                    <div class="mb-20" v-if="isTab === '0'">
                        <b-row class="mb-15">
                            <div class="col-xs-3">
                                <div class="font-222-15">包装费</div>
                            </div>
                            <div class="col-xs-6">
                                <div v-if="freePackageNeededPrice !== 0" class="font-cf00-13 pt-2 order-condition-price custom-tooltip">
                                    <span class="tooltiptext tooltip-top">该活动仅限指定商品哦！</span>
                                    <span>免包装费还差 {{ freePackageNeededPrice | addComma }} 元</span>
                                    <img class="ml-3" src="../../assets/images/ico_help.png" alt="" style="width: 13px; height: 13px;">
                                </div>
                                <div v-else-if="type !== 'runner' && freePackageStatus === '1' && freeEventPackageStatus === '1'" class="font-222-13 text-right" style="text-decoration: line-through;">{{ packageOldPrice | addComma }} 元</div>
                            </div>
                            <div class="col-xs-3">
                                <div v-if="deliveryItems.length !== 0 || freePackageNeededPrice !== 0 || freePackageStatus === '0'" class="font-222-14 fr font-weight">¥{{ packagePrice | addComma }}</div>
                                <div v-else class="font-222-14 fr font-weight">免包装费</div>
                            </div>
                        </b-row>
                        <b-row>
                            <div class="col-xs-3">
                                <div class="font-222-15 fl">配送费</div>
                                <div v-if="type === 'runner'">
                                    <img class="fl ml-3 mt-2" src="../../assets/images/ico_help.png" alt="" style="width: 13px; height: 13px;" @click="setShowHelp">
                                </div>
                                <div v-else-if="deliveryItems.length !== 0">
                                    <img v-if="!isShowDeliveryInfo" class="fl ml-3 mt-1" src="../../assets/images/ico_bottom_1.png" alt="" style="width: 15px; height: 15px;" @click="isShowDeliveryInfo = !isShowDeliveryInfo">
                                    <img v-else class="fl ml-3 mt-1" src="../../assets/images/ico_top_1.png" alt="" style="width: 15px; height: 15px;" @click="isShowDeliveryInfo = !isShowDeliveryInfo">
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <div v-if="freeShippingNeededPrice !== 0" class="font-cf00-13 pt-2 order-condition-price custom-tooltip">
                                    <span class="tooltiptext tooltip-top">该活动仅限指定商品哦！</span>
                                    <span>免运费还差 {{ freeShippingNeededPrice | addComma }} 元</span>
                                    <img class="ml-3" src="../../assets/images/ico_help.png" alt="" style="width: 13px; height: 13px;">
                                </div>
                                <div v-else-if="type !== 'runner' && freeEventShippingStatus === '1'" class="font-222-13 text-right" style="text-decoration: line-through;">
                                    {{ (totalDeliveryEventPrice + totalDeliveryCompanyPrice) | addComma }} 元
                                </div>
                            </div>
                            <div class="col-xs-3">
                                <!-- 배달배송이면 배달비만 로출 -->
                                <div v-if="type === 'runner'" class="fr">
                                    <span v-show="deliveryOriginPrice !== deliverySalesPrice" class="font-b8b8-15 text-through">¥{{ deliveryOriginPrice | addComma }}</span>&nbsp;&nbsp;
                                    <span class="font-222-15 font-weight">¥{{ deliverySalesPrice | addComma }}</span>
                                </div>
                                <!-- 택배배송이면 택배회사배송비 로출 -->
                                <div v-else-if="totalDeliveryCompanyPrice > 0 && deliveryItems.length !== 0" class="font-222-14 fr font-weight">¥{{ totalDeliveryCompanyPrice | addComma }}</div>
                                <div v-else class="font-222-14 fr font-weight">免运费</div>
                            </div>
                        </b-row>
                        <div class="mt-5" v-show="isShowDeliveryInfo">
                            <b-row v-for="(item, index) in useDeliveryCompany" :key="index" class="mb-5">
                                <div class="col-xs-8" style="display: flex; align-content: center; justify-content: flex-end;">
                                    <div class="font-b3b3-14">{{ item.name }}</div>
                                </div>
                                <div class="col-xs-4" style="display: flex; align-content: center; justify-content: flex-end;">
                                    <div v-if="item.price > 0" class="font-222-15 font-weight">¥{{ item.price | addComma }}</div>
                                    <div v-else class="font-222-15 font-weight">免运费</div>
                                </div>
                            </b-row>
                        </div>
                    </div>
                    <b-row class="pb-15 border-btm-3 mb-15">
                        <div class="col-xs-6">
                            <div class="font-222-15">商品总额</div>
                        </div>
                        <div class="col-xs-6">
                            <div class="font-222-15 fr font-weight">¥{{ totalGoodsPrice | addComma }}</div>
                        </div>
                    </b-row>
                    <b-row>
                        <div class="col-xs-2">
                            <div class="font-222-18 font-weight">合计:</div>
                        </div>
                        <div class="col-xs-10">
                            <div class="fr">
                                <span class="font-cf00-16 font-weight">¥</span>
                                <!-- 배송이면서 택배인 경우 -->
                                <span v-if="isTab === '0' && type === ''" class="font-cf00-20 font-weight" style="margin-left: -2px;">{{ parseFloat(totalGoodsPrice) + parseFloat(packagePrice) + parseFloat(totalDeliveryCompanyPrice) | addComma }}</span>
                                <!-- 배송이면서 배달인 경우 -->
                                <span v-else-if="isTab === '0' && type === 'runner'" class="font-cf00-20 font-weight" style="margin-left: -2px;">{{ parseFloat(totalGoodsPrice) + parseFloat(deliverySalesPrice) | addComma }}</span>
                                <!-- 시장직접구입인 경우 -->
                                <span v-else class="font-cf00-20 font-weight" style="margin-left: -2px;">{{ totalGoodsPrice | addComma }}</span>
                            </div>
                            <div class="fr mr-3 font-222-13 pt-5">(总重量:{{ (totalGoodsWeight + totalPackageWeight) | addCommaTwo }}kg)</div>
                        </div>
                    </b-row>
                </div>
                <div class="text-center font-222-12 pt-10">ICP证: <a style="color: dodgerblue; text-decoration: underline;" href="https://beian.miit.gov.cn/" target="_blank">吉ICP备20003633号-1</a></div>
            </div>
        </div>
    </div>
    <div :class="{'space_order_android': isPhone, 'space_order_iphone': !isPhone}">
        <b-row>
            <div class="col-xs-9"></div>
            <div class="col-xs-3 text-center">
                <div v-if="type === 'runner'">
                    <div class="radius-20 font-222-14 pt-13 pb-11 font-weight" style="background-color: #ffcc33;" @click="setPaymentData">提交订单</div>
                </div>
                <div v-else>
                    <div v-if="deliveryStatus === '1' && isTab === '0'" class="radius-20 font-222-14 pt-13 pb-11 font-weight" style="background-color: #ffcc33;" @click="setPaymentData">提交订单</div>
                    <div v-else-if="isTab === '1'" class="radius-20 font-222-14 pt-13 pb-11 font-weight" style="background-color: #ffcc33;" @click="setPaymentData">提交订单</div>
                    <div v-else class="radius-20 font-222-14 pt-13 pb-11 font-weight" style="background-color: #bfbfbf; color: #fff !important;">提交订单</div>
                </div>
            </div>
        </b-row>
    </div>
    <!-- 폰번호인증다이얼로그 -->
    <div ref="phone_dialog" class="dialog-delivery" v-show="isShowPhoneBound">
        <div class="text-center font-222-16 border-btm-3 font-weight" style="padding: 14px; background-color: #ffcc33; border-top-left-radius: 10px; border-top-right-radius: 10px;">绑定手机</div>
        <div class="pl-15 pr-15">
            <div class="border-btm-3 pt-15 pb-8">
                <input id="phone" ref="phone" type="text" v-model="phone" inputmode="numeric" class="delivery-input" name="" value="" placeholder="请输入手机号" style="width: 100%;" @input="setValueData">
            </div>
            <b-row class="border-btm-3 pt-15 pb-7">
                <div class="col-xs-6">
                    <input id="authCode" ref="authCode" type="text" v-model="authCode" inputmode="numeric" class="delivery-input" name="" value="" placeholder="请输入验证码" style="width: 100%;" @input="setValueData">
                </div>
                <div class="col-xs-6 text-center">
                    <div v-if="isActiveCode === ''" class="btn_1 fr pt-7">获取验证码</div>
                    <div v-else-if="isActiveCode === 'active'" class="btn_1 fr pt-7 active" @click="setSendCode">获取验证码</div>
                    <div v-else-if="isActiveCode === 'submit'" class="btn_1 fr pt-7">{{ second }}s后重新发送</div>
                </div>
            </b-row>
        </div>
        <div class="text-center" style="padding: 25px;">
            <div v-if="!isActiveUpdate" class="btn_2">立即绑定</div>
            <div v-else class="btn_2 active" @click="setUpdatePhone">立即绑定</div>
        </div>
    </div>

    <DeliveryInfo ref="help" :isShowOverlay="isShowHelp" :kind="deliveryHelpKind" :basicPrice="basicPrice" :totalStreet="totalStreet" :overStreet="overStreet" :overStreetPrice="overStreetPrice" :totalOverStreet="totalOverStreet" :totalOverStreetPrice="totalOverStreetPrice" :totalWeight="parseFloat(totalGoodsWeight)" :overWeight="overWeight" :overWeightPrice="overWeightPrice" :totalOverWeight="totalOverWeight" :totalOverWeightPrice="totalOverWeightPrice" :styles="styles" />
    <DeliveryCompany ref="deliveryCompany" :isShowOverlay="isShowDeliveryCompany" :companies="deliveryCompanies" :deliveryCompanyCode="deliveryCompanyCode" />
    <OrderTime ref="time" :isShowOverlay="isShowTime" :orderTime="selfTime" :setTime="setTime" />
</div>
</template>

<script>
import DeliveryInfo from '@/components/DeliveryInfo'
import DeliveryCompany from '@/components/DeliveryCompany'
import OrderTime from '@/components/OrderTime'
import {
    numberPad
} from "~/utility/utility"

import {
    getProfile,
    getAuthCode,
    updatePhone
} from '@/api/profile'

import {
    getDelivery,
    getSelfShop,
    setOrderDelivery,
    setOrderSelf,
    setPayment,
    cancelPay
} from '@/api/order'

import {
    getCartCount
} from '@/api/cart'

export default {
    name: "order",
    components: {
        DeliveryInfo,
        DeliveryCompany,
        OrderTime
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, true)
        this.$nuxt.$emit('handleNoticeShow', false)

        // 주문페지에서 시장운영시간이 지나면 택배인 경우 주문여부요청이 오는 경우(컴포넌트간 요청, 응답)
        this.$nuxt.$on('handleOrderLimitTime', () => {
            this.setPayDelivery()
        })

        // 주문페지에서 결제요청
        this.$nuxt.$on('handleConfirmPay', () => {
            this.setContinuePay()
        })

        this.$nuxt.$on('handleCancelPay', () => {
            this.setOnlyOrder()
        })

        // 택배회사별 선택요청
        this.$nuxt.$on('handleCompany', (deliveryCode) => {
            this.setCancelCompany(deliveryCode)
        })

        // 배송정보팝업에서 요청
        this.$nuxt.$on('handleHelp', () => {
            this.setCancelView('help')
        })

        // 시장에서 직접구매시간팝업 요청
        this.$nuxt.$on('handleTime', (index) => {
            this.selectTime(index)
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('handleOrderLimitTime')
        this.$nuxt.$off('handleConfirmPay')
        this.$nuxt.$off('handleCompany')
        this.$nuxt.$off('handleHelp')
        this.$nuxt.$off('handleTime')
        this.$nuxt.$off('handleCancelPay')
    },
    head() {
        return {
            title: '提交订单'
        }
    },
    mounted() {
        window.document.body.setAttribute('style', '') // 아이폰 스크롤 바운딩 효과를 막기 위해 준것을 풀기
        this.$utility.removeWechatOptionTool()
        window.addEventListener('keyup', this.setFilterValue)

        // 배송지 쿠키정보 지우기
        localStorage.removeItem('provinceid')
        localStorage.removeItem('cityid')
        localStorage.removeItem('countryid')
        localStorage.removeItem('delivery_addr')
        localStorage.removeItem('delivery_addr_detail')
        localStorage.removeItem('delivery_houseno')
        localStorage.removeItem('delivery_username')
        localStorage.removeItem('delivery_phone')
        localStorage.removeItem('delivery_map')
        localStorage.removeItem('delivery_pos')

        if (navigator.userAgent.match(/android/i)) {
            this.isPhone = true
            this.$nextTick(() => {
                if (this.$refs.phone_dialog) {
                    this.$refs.phone_dialog.style.marginLeft = '7.5%'
                }
            })
        } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
            this.isPhone = false

            this.$nextTick(() => {
                if (this.$refs.phone_dialog) {
                    this.$refs.phone_dialog.style.marginLeft = '7.5%'
                }
            })
        } else {
            this.$nextTick(() => {
                if (this.$refs.phone_dialog) {
                    this.$refs.phone_dialog.style.marginLeft = '1.5%'
                }
            })
        }

        this.paramCart = this.$route.query && this.$route.query.param
        this.totalGoodsPrice = this.$route.query && this.$route.query.price
        this.deliveryId = localStorage.getItem('deliveryid') && localStorage.getItem('deliveryid') === '' ? 0 : localStorage.getItem('deliveryid') // 배송지변경페지에서 설정한 배송지아이디쿠키정보 얻기
        this.freeEventPackageStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeEventPackageStatus : '0'
        this.freeEventShippingStatus = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).freeEventShippingStatus : '0'

        this.checkRunTimeMarket()
        this.getProfileData()
        this.getDeliveryData()
    },
    data() {
        return {
            isClicked: false,
            isShowPhoneBound: false,
            isShowHelp: false,
            isShowTime: false,
            isPhone: true,
            isLimitTime: false, // 시장이 끝나는 시간 체크여부
            paramCart: '', // 장바구니에서 넘어오는 파라메터
            deliveryId: 0, // 배송지아이디
            isTab: '0', // 탭선택된 여부(0: 배송/1: 매장에서 직접 주문)
            userName: '', // 사용자명
            userPhone: '', // 사용자폰번호
            provinceName: '', // 성
            cityName: '', // 시
            countryName: '', // 지역
            address: '', // 주소
            houseNo: '', // 상세주소
            packageNum: 0, // 포장수량
            packagePrice: 0, // 포장가격
            packageOldPrice: 0, // 이전포장가격
            freePackageStatus: '0', // 무료포장상태여부
            freeShippingStatus: '0', // 무료배송상태여부
            freePackageNeededPrice: 0, // 무료포장기준필요가격
            freeShippingNeededPrice: 0, // 무료배송기준필요가격
            airPrice: 0, // 항공운비
            normalPrice: 0, // 정상운비
            airIds: [], // 항공편배송용 상품아이디 배렬
            cartItems: [], // 장바구니 정보 배렬
            deliveryItems: [], // 택배배송회사에 따르는 주문상품배렬
            type: '', // 배송형태
            doneDt: '', // 도착예정시간
            deliverySalesPrice: 0, // 배송비
            deliveryOriginPrice: 0, // 배송원가
            totalWeight: 0, // 주문상품 총무게
            selfTime: [], // 매장에서 직접 구매하는 시간
            selfPhone: '', // 매장에서 직접 구매할 때 입력하는 폰번호
            isSelfAgree: false, // 매장구매여부
            isShowDeliveryInfo: false, // 택배배송일 때 구체적인 배송가격 로출 여부
            isShowDeliveryCompany: false, // 택배배송일 때 배송회사팝업 로출여부
            totalGoodsPrice: 0, // 주문상품총가격
            totalGoodsWeight: 0, // 주문상품총무게
            totalPackageWeight: 0, // 주문상품포장무게
            styles: {}, // 배송정보팝업 스타일 정의
            deliveryHelpKind: '', // 배송정보팝업 종류
            basicPrice: 0, // 배송총기본배송가격
            setTime: '', // 서시장에서 직접 구매할 때 주문 후 서시장 도착시간 설정값
            messageDialog: '', // 경고다이얼로그 내용
            remark: '', // 고객의 첨부사항내용
            orderId: 0, // 주문아이디
            orderNumber: '', // 주문번호
            isRedirect: undefined, // 배송지변경으로 리다이렉트를 했는지 상태여부(뒤로가기를 체크하기 위함)
            overWeight: 0, // 초과무게
            overWeightPrice: 0, // 초과무게에 따르는 가격
            totalOverWeight: 0, // 초과된 총무게
            totalOverWeightPrice: 0, // 초과된 총무게에 따르는 가격
            totalStreet: 0, // 총배달거리
            overStreet: 0, // 초과거리
            overStreetPrice: 0, // 초과된 거리에 따르는 가격
            totalOverStreet: 0, // 초과된 총거리
            totalOverStreetPrice: 0, // 초과된 총거리에 따르는 가격
            airWeight: 0, // 항공배송무게
            normalWeight: 0, // 일반배송무게
            initDistance: 0, // 첫 배달거리
            initWeight: 0, // 첫 배달무게
            distance: 0, // 총배달거리
            weight: 0, // 총배달무게
            isShowOtherMenu: true,
            isShowDistanceWarning: false,
            phoneBound: '', // 앱에 바운딩된 폰번호
            phone: '', // 바운딩을 할 폰번호
            authCode: '', // 인증코드
            resAuthCode: '', // 결과코드
            interval: 0,
            second: 60,
            isActiveCode: '',
            isActiveUpdate: false,
            deliveryStatus: '', // 배송가능여부
            swiperOption: {
                spaceBetween: 5,
                slidesPerView: 'auto',
                direction: 'horizontal',
                freeMode: true
            },
            useDeliveryCompany: [], // 주문상품의 배송회사배렬
            totalDeliveryCompanyPrice: 0, // 배송회사배송비
            totalDeliveryCompanyOldPrice: 0, // 배송회사실지배송비
            deliveryCompanies: [], // 택배배송회사배렬
            deliveryCompanyCode: '', // 택배배송회사코드
            deliveryCompanyIndex: 0, // 택배배송회사배렬인덱스값
            freeItems: [], // 무료배송상품배렬
            eventItems: null, // 이벤트상품
            totalDeliveryEventPrice: 0, // 이벤트상품일 때의 이전배송가격(무료배송조건이 되였을 때)
            freeEventPackageStatus: '0', // 포장무료이벤트설정상태
            freeEventShippingStatus: '0' // 배송무료이벤트설정상태
        }
    },
    methods: {
        checkRunTimeMarket() {
            this.selfTime = []
            // 서시장 운영시간 설정(시작시간~마감시간)
            const startTime = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).starttime : '' // 서시장 운영시작시간
            const endTime = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).endtime.split(':') : '' // 서시장 운영마감시간
            const timeDelta = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).timedelta : '' // 운영시간 허용오차(마감시간 X시간전)
            const today = new Date() // 현재의 날자
            const todayDate = this.$moment(new Date()).format('YYYY/MM/DD') // 현재의 년,월,일

            const compareStartTime = new Date(todayDate + ' ' + startTime) // 서시장 운영시작시간 밀리초단위
            const compareEndTime = new Date(todayDate + ' ' + (parseInt(endTime[0]) - parseInt(timeDelta)) + ':' + endTime[1]) // 서시장 마감시간 밀리초단위

            const selfMinuteBegin = sessionStorage.getItem('site_info') ? parseInt(JSON.parse(sessionStorage.getItem('site_info')).selfMinuteBegin) : 0 // 시장에서 직접 주문할 때의 시작시간 구간
            const selfMinuteInterval = sessionStorage.getItem('site_info') ? parseInt(JSON.parse(sessionStorage.getItem('site_info')).selfMinuteInterval) : 0 // 시장에서 직접 주문할 때의 시간선택구간
            const selfEndTime = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).selfEndTime : '' // 시장 직접 주문 마감시간
            const compareEndSelfTime = new Date(todayDate + ' ' + selfEndTime + ':00')

            // 하루 24시간을 서버에서 내려오는 구간분단위로 분리하여 배렬에 저장한다.
            let tempTime = []

            // 20분단위로 분리되였을 때
            if (selfMinuteInterval === 20) {
                for (let i = 0; i < 24; i++) {
                    let value = i + ':20'
                    let value1 = i + ':40'
                    let value2 = (i + 1) + ':00'

                    tempTime.push(value)
                    tempTime.push(value1)
                    tempTime.push(value2)
                }
            }

            // 30분단위로 분리되였을 때
            if (selfMinuteInterval === 30) {
                for (let i = 0; i < 24; i++) {
                    let value = i + ':30'
                    let value1 = (i + 1) + ':00'

                    tempTime.push(value)
                    tempTime.push(value1)
                }
            }

            if (today < compareStartTime || today >= compareEndTime) { // 현재의 시간이 서시장 운영시작시간보다 작거나 운영마감시간과 같거나 크다면 알림 띄우기
                this.isLimitTime = true
            } else { // 서시장 운영시간내라면 직접 서시장에 와서 구매할 시간을 배렬에 저장한다.
                today.setMinutes(today.getMinutes() + selfMinuteBegin)

                for (let i = 0; i < tempTime.length; i++) {
                    const tmpCompare = new Date(todayDate + ' ' + tempTime[i]) // 분단위로 분리한 시간을 밀리초단위로 변환

                    // 분단위시간이 현재의 시간보다 큰값과 서시장 마감시간과 같거나 작은 구간을 배렬에 저장한다.
                    if (tmpCompare >= today && tmpCompare <= compareEndSelfTime) {
                        this.selfTime.push(tempTime[i])
                    }
                }

                this.setTime = this.selfTime[0]
            }
        },
        countTime() {
            this.second--

            if (this.second <= 0) {
                clearInterval(this.interval)
                this.authCode = ''
                this.isActiveCode = 'active'
                this.second = 60
                this.isActiveUpdate = false
            }
        },
        setFilterValue(element) {
            if (element.target.id === 'phone') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 11)
                this.phone = element.target.value
                this.isActiveCode = element.target.value.length === 11 ? 'active' : ''
                this.isActiveUpdate = element.target.value.length === 11 && this.authCode.length === 4
            }

            if (element.target.id === 'authCode') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 4)
                this.authCode = element.target.value
                this.isActiveUpdate = element.target.value.length === 4 && this.phone.length === 11
            }

            if (element.target.id === 'remark') { // 상품명 길이 50자로 제한
                element.target.value = element.target.value.substr(0, 50)
                this.remark = element.target.value
            }

            if (element.target.id === 'selfPhone') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 11)
                this.selfPhone = element.target.value
            }
        },
        getProfileData() {
            this.$nuxt.$emit('handleLoading', true)

            getProfile().then(response => {
                if (response.res !== undefined) {
                    this.phoneBound = response.res.data.phone
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        getSelfShopData() { // 직접 매장에서 구매하는 정보
            this.deliveryItems = []
            this.totalGoodsWeight = 0
            this.totalPackageWeight = 0
            this.$nuxt.$emit('handleLoading', true)
            const query = {
                nums: this.paramCart
            }

            getSelfShop(query).then(response => {
                if (response.res !== undefined) {
                    this.packageNum = response.res.data.packageNum
                    this.packagePrice = response.res.data.packagePrice
                    this.totalGoodsWeight = response.res.data.totalWeight
                    this.cartItems = response.res.data.cartItems
                    const icon = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).goodsIconBeans : ''
                    let icons = []

                    if (icon !== null && icon !== '') {
                        icons = icon.split(',')
                    }

                    this.cartItems.filter(res => {
                        res.goods.filter(prod => {
                            let exist = ''

                            icons.filter(icon => {
                                const goodsIconName = icon.split('-')[0]
                                const goodsIconUrl = icon.split('-')[1]

                                if (prod.goodsIconName === goodsIconName && prod.goodsIconName !== '' && prod.goodsIconName !== null) {
                                    exist = goodsIconUrl
                                }
                            })

                            prod.goodsIconUrl = exist
                        })
                    })
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        getDeliveryData() { // 배송에 의한 주문정보
            this.deliveryItems = []
            this.totalGoodsWeight = 0
            this.totalPackageWeight = 0
            this.$nuxt.$emit('handleLoading', true)
            const query = {
                nums: this.paramCart,
                deliveryId: this.deliveryId ? parseInt(this.deliveryId) : 0
            }

            getDelivery(query).then(response => {
                if (response.res !== undefined) {
                    this.type = response.res.data.type !== undefined ? response.res.data.type : ''
                    this.cartItems = response.res.data.cartItems
                    this.userName = response.res.data.userName
                    this.userPhone = response.res.data.userPhone
                    this.provinceName = response.res.data.provinceName
                    this.cityName = response.res.data.cityName
                    this.countryName = response.res.data.countryName
                    this.address = response.res.data.address
                    this.houseNo = response.res.data.houseNo
                    this.deliveryStatus = response.res.data.deliveryStatus
                    this.deliveryId = parseInt(response.res.data.deliveryId)
                    this.deliveryItems = response.res.data.deliveryItems !== undefined ? response.res.data.deliveryItems : []
                    this.freePackageStatus = response.res.data.freePackageStatus
                    this.freeShippingStatus = response.res.data.freeShippingStatus
                    this.freePackageNeededPrice = response.res.data.freePackageNeededPrice ? response.res.data.freePackageNeededPrice : 0
                    this.freeShippingNeededPrice = response.res.data.freeShippingNeededPrice ? response.res.data.freeShippingNeededPrice : 0
                    this.eventItems = response.res.data.eventItems ? response.res.data.eventItems : null

                    // 무료배송상품이 있는 경우
                    if (response.res.data.freeItems !== null && response.res.data.freeItems !== undefined) {
                        this.freeItems.push(response.res.data.freeItems)
                        this.totalGoodsWeight += response.res.data.freeItems.totalGoodsWeight
                    }

                    const icon = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).goodsIconBeans : ''
                    let icons = []

                    if (icon !== null && icon !== '') {
                        icons = icon.split(',')
                    }

                    this.cartItems.filter(res => {
                        res.goods.filter(prod => {
                            let exist = ''

                            icons.filter(icon => {
                                const goodsIconName = icon.split('-')[0]
                                const goodsIconUrl = icon.split('-')[1]

                                if (prod.goodsIconName === goodsIconName && prod.goodsIconName !== '' && prod.goodsIconName !== null) {
                                    exist = goodsIconUrl
                                }
                            })

                            prod.goodsIconUrl = exist
                        })
                    })

                    if (this.type === 'runner') { // 배달이면
                        this.doneDt = response.res.data.doneDt
                        this.deliverySalesPrice = response.res.data.deliverySalesPrice
                        this.deliveryOriginPrice = response.res.data.deliveryOriginPrice
                        this.initDistance = response.res.data.initDistance !== undefined ? response.res.data.initDistance : 0
                        this.initWeight = response.res.data.initWeight !== undefined ? response.res.data.initWeight : 0
                        this.distance = response.res.data.distance
                        this.weight = response.res.data.weight
                        this.totalGoodsWeight += response.res.data.weight
                        this.packagePrice = response.res.data.packagePrice

                        if (response.res.data.distance < 0) {
                            this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '您的收货地址定位获取失败<br>请重新选取定位', '', '', '', '确认', 'white', false, false, '')
                        }
                    } else { // 택배이면
                        this.deliveryItems.filter(res => {
                            let key = -1
                            this.totalGoodsWeight += res.totalGoodsWeight
                            this.packagePrice += res.totalPackagePrice
                            this.totalPackageWeight += res.totalPackageWeight

                            if (!res.deliverySalePrice) {
                                res.deliverySalePrice = res.companyPrices[0].salesPrice
                                res.deliveryCostPrice = res.companyPrices[0].costPrice
                                res.deliveryType = res.companyPrices[0].deliveryType
                                res.deliveryOldPrice = res.companyPrices[0].salesOriPrice
                            }

                            this.totalDeliveryCompanyPrice += res.deliverySalePrice
                            this.totalDeliveryCompanyOldPrice += res.deliveryOldPrice

                            this.useDeliveryCompany.filter((value, index) => {
                                if (value.name === res.deliveryName) {
                                    key = index
                                }
                            })

                            if (key !== -1) {
                                this.useDeliveryCompany[key].price += res.deliverySalePrice
                            } else {
                                const value = {
                                    name: res.deliveryName,
                                    price: res.deliverySalePrice,
                                    deliveryType: res.deliveryType
                                }
                                this.useDeliveryCompany.push(value)
                            }
                        })

                        if (this.eventItems && this.eventItems.goodsImgs.length !== 0) {
                            this.totalGoodsWeight += this.eventItems.totalGoodsWeight
                            this.packagePrice += this.eventItems.packagePrice
                            this.packageOldPrice += this.eventItems.packageOriPrice + this.packagePrice
                            this.totalPackageWeight += this.eventItems.packageWeight
                            this.totalDeliveryEventPrice = this.eventItems.totalDeliveryPrice
                        } else {
                            this.packageOldPrice += this.packagePrice
                        }
                    }
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setRedirectAddress() {
            this.$router.push({
                path: '/info/delivery/delivery_address?param=' + this.paramCart
            })
        },
        setTabKind(status) { // 주문하기탭 선택
            // 배송으로 주문
            if (status === '0' && this.isTab !== '0') {
                this.getDeliveryData()
            }

            // 서시장에 직접 주문
            if (status === '1' && this.isTab !== '1') {
                this.checkRunTimeMarket()

                if (this.isLimitTime || this.selfTime.length === 0) {
                    this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '该时间段无法以<br>《到店自取》方式下单', '', '', '', '确认', 'white', false, false, '')
                    return
                }

                this.getSelfShopData()
            }

            this.isTab = status
        },
        isActiveTab(status) { // 탭 선택 시 글자설정(active 추가)
            return this.isTab === status
        },
        isActiveHeader(status) {
            return status
        },
        setShowHelp(index) { // 배송정보팝업 로출
            this.isShowHelp = true
            this.deliveryHelpKind = index
            this.styles = {
                height: '345px'
            }
            this.basicPrice = this.deliverySalesPrice
            this.overStreet = this.initDistance
            this.overWeight = this.initWeight
            this.totalStreet = this.distance

            this.$nextTick(() => {
                if (this.$refs.help) {
                    this.$refs.help.$refs.help.classList.toggle('collapsed')
                }
            })

            // 스크롤 막기
            this.$nextTick(() => {
                if (this.$refs.order) {
                    this.$refs.order.style.overflowY = 'hidden'
                }
            })
        },
        setShowTime() { // 서시장에 도착할 시간 팝업 로출
            this.isShowTime = true

            this.$nextTick(() => {
                if (this.$refs.time) {
                    this.$refs.time.$refs.time.classList.toggle('collapsed')
                }

                // 스크롤 막기
                if (this.$refs.order) {
                    this.$refs.order.style.overflowY = 'hidden'
                    window.document.body.setAttribute('style', 'position: fixed; overflow: hidden')
                }
            })
        },
        selectTime(index) { // 서시장에 도착할 시간 설정
            if (index !== undefined) {
                this.setTime = this.selfTime[index]
            }

            this.setCancelView('time')
        },
        setShowDeliveryCompany(deliveryCode, index, companies) {
            this.deliveryCompanyCode = deliveryCode
            this.deliveryCompanyIndex = index
            this.deliveryCompanies = companies
            this.isShowDeliveryCompany = true

            this.$nextTick(() => {
                if (this.$refs.deliveryCompany.$refs.deliveryCompany) {
                    this.$refs.deliveryCompany.$refs.deliveryCompany.classList.toggle('collapsed')
                }

                // 스크롤 막기
                if (this.$refs.order) {
                    this.$refs.order.style.overflowY = 'hidden'
                }
            })
        },
        setCancelCompany(deliveryCode) {
            if (deliveryCode !== undefined) {
                this.deliveryCompanies.filter(res => {
                    if (res.companyCode === deliveryCode) {
                        this.deliveryItems[this.deliveryCompanyIndex].deliveryName = res.companyName
                        this.deliveryItems[this.deliveryCompanyIndex].deliveryCode = res.companyCode
                        this.deliveryItems[this.deliveryCompanyIndex].deliverySalePrice = res.salesPrice
                        this.deliveryItems[this.deliveryCompanyIndex].deliveryCostPrice = res.costPrice
                        this.deliveryItems[this.deliveryCompanyIndex].deliveryType = res.deliveryType
                    }
                })

                this.totalDeliveryCompanyPrice = 0
                this.useDeliveryCompany = []
                this.packagePrice = 0
                this.packageOldPrice = 0
                this.totalGoodsWeight = 0
                this.totalPackageWeight = 0
                this.totalDeliveryEventPrice = 0

                this.deliveryItems.filter(res => {
                    let key = -1
                    this.totalGoodsWeight += res.totalGoodsWeight
                    this.packagePrice += res.totalPackagePrice
                    this.totalPackageWeight += res.totalPackageWeight
                    this.totalDeliveryCompanyOldPrice += res.salesOriPrice

                    if (!res.deliverySalePrice) {
                        res.deliverySalePrice = res.companyPrices[0].salesPrice
                        res.deliveryCostPrice = res.companyPrices[0].costPrice
                        res.deliveryType = res.companyPrices[0].deliveryType
                        res.deliveryOldPrice = res.companyPrices[0].salesOriPrice
                    }

                    this.totalDeliveryCompanyPrice += res.deliverySalePrice
                    this.totalDeliveryCompanyOldPrice += res.deliveryOldPrice

                    this.useDeliveryCompany.filter((value, index) => {
                        if (value.name === res.deliveryName) {
                            key = index
                        }
                    })

                    if (key !== -1) {
                        this.useDeliveryCompany[key].price += res.deliverySalePrice
                    } else {
                        const value = {
                            name: res.deliveryName,
                            price: res.deliverySalePrice,
                            deliveryType: res.deliveryType
                        }
                        this.useDeliveryCompany.push(value)
                    }
                })

                if (this.eventItems && this.eventItems.goodsImgs.length !== 0) {
                    this.totalGoodsWeight += this.eventItems.totalGoodsWeight
                    this.packagePrice += this.eventItems.packagePrice
                    this.packageOldPrice += this.eventItems.packageOriPrice + this.packagePrice
                    this.totalPackageWeight += this.eventItems.packageWeight
                    this.totalDeliveryEventPrice = this.eventItems.totalDeliveryPrice
                } else {
                    this.packageOldPrice += this.packagePrice
                }
            }

            this.isShowDeliveryCompany = false
            this.$nextTick(() => {
                if (this.$refs.deliveryCompany) {
                    this.$refs.deliveryCompany.$refs.deliveryCompany.classList.toggle('collapsed')
                }

                // 스크롤 허용
                if (this.$refs.order) {
                    this.$refs.order.style.overflowY = 'visible'
                }
            })
        },
        setCancelView(index) { // 모든 뷰 닫기
            if (index === 'bound') {
                this.isShowPhoneBound = false
                clearInterval(this.interval)
                this.second = 60
            }

            if (index === 'help') {
                this.isShowHelp = false
                this.styles = {
                    height: '0px'
                }

                this.$nextTick(() => {
                    if (this.$refs.help) {
                        this.$refs.help.$refs.help.classList.toggle('collapsed')
                    }
                })
            }

            if (index === 'time') {
                this.isShowTime = false
                window.document.body.setAttribute('style', '')
                this.$nextTick(() => {
                    if (this.$refs.time) {
                        this.$refs.time.$refs.time.classList.toggle('collapsed')
                    }
                })
            }

            // 스크롤 허용
            this.$nextTick(() => {
                if (this.$refs.order) {
                    this.$refs.order.style.overflowY = 'visible'
                }
            })
        },
        setContinuePay() { // 결제다시하기
            this.setPayWechat()
        },
        setOnlyOrder() { // 주문만 하기
            localStorage.setItem('route', 'payment')

            cancelPay(this.orderNumber).then(() => {
                this.$router.replace({
                    path: '/info/order/order_detail?orderid=' + this.orderId
                })
            })
        },
        setPayDelivery() { // 택배이면서 시장 영업시간이 지난 경우 지불하기
            // 앱에 사용자의 폰이 바운딩 안되어있으면 폰바운딩 팝업 로출
            if (this.phoneBound === '') {
                this.setShowPhoneBoundDialog()
                return
            }

            this.setOrderData()
        },
        setPaymentData() { // 결제하기
            if (this.isClicked) {
                return
            }

            this.checkRunTimeMarket()

            if (this.isTab === '0') { // 배송으로 주문
                // 시장운영시간이 지나면 택배인 경우 계속 주문을 하겠는지 팝업 띄우기
                if (this.deliveryItems.length !== 0 && this.isLimitTime) {
                    this.$nuxt.$emit('handleWarningDialog', true, true, false, 'setting', '当前为西市场非营业时间<br>是否同意下一个工作日安排派送?', '', '放弃下单', '继续下单', '', 'white', false, false, 'order_limittime')
                    return
                }

                // 시장운영시간이 지나면 배달인 경우 주문 불가
                if (this.type === 'runner' && this.isLimitTime) {
                    this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '同城市场配送时间<br>(' + sessionStorage.getItem('starttime') + '~' + sessionStorage.getItem('endtime') + ')', '', '', '', '确认', 'white', false, false, '')
                    return
                }

                // 배송지가 없으면 배송지를 추가하라는 메세지 띄우기
                if (this.deliveryId === 0) {
                    this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '请添加收货地址', '', '', '', '确认', 'white', false, false, '')
                    return
                }
            }

            if (this.isTab === '1') { // 서시장에서 직접 주문
                if (this.isLimitTime || this.selfTime.length === 0) {
                    this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '该时间段无法以<br>《到店自取》方式下单', '', '', '', '确认', 'white', false, false, '')
                    return
                }

                if (!this.isSelfAgree) {
                    this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '请先同意《到店自取服务协议》', '', '', '', '确认', 'white', false, false, '')
                    return
                }

                if (this.selfPhone.trim() === '') {
                    this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '请输入预留电话', '', '', '', '确认', 'white', false, false, '')
                    return
                } else if (this.selfPhone.length > 11 || this.selfPhone.length < 11) {
                    this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '请正确输入电话号码', '', '', '', '确认', 'white', false, false, '')
                    return
                }
            }

            // 앱에 사용자의 폰이 바운딩 안되어있으면 폰바운딩 팝업 로출
            if (this.phoneBound.trim() === '') {
                this.setShowPhoneBoundDialog()
                return
            }

            this.setOrderData()
        },
        setPayWechat() { // 위챗결제하기
            setPayment(this.orderNumber).then(response => {
                if (response.res !== undefined) {
                    if (typeof WeixinJSBridge === 'undefined') {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
                            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
                        }
                    } else {
                        setTimeout(() => {
                            this.onBridgeReady(response.res.data)
                        }, 500)
                    }
                } else {
                    this.isClicked = false
                }
            })
        },
        onBridgeReady(params) {
            let that = this

            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    'appId': params.appId,
                    'timeStamp': params.timeStamp.toString(),
                    'nonceStr': params.nonceStr,
                    'package': 'prepay_id=' + params.prepayId,
                    'signType': params.signType,
                    'paySign': params.paySign
                },
                function (res) { // response 결과값
                    that.isClicked = false

                    if (res.err_msg === 'get_brand_wcpay_request:ok') { // 결제완료
                        localStorage.setItem('orderNumber', that.orderNumber) // 결제성공 상태값 설정
                        localStorage.setItem('orderId', that.orderId) // 주문아이디 설정

                        that.$router.replace({
                            path: '/main'
                        })
                    } else if (res.err_msg === 'get_brand_wcpay_request:fail') { // 결제실패
                        that.$utility.showToast('支付失败')
                        that.$nuxt.$emit('handleWarningDialog', true, true, true, 'setting', '确认要放弃本次付款', '您的订单将保留一段时间,到时间后将被自动取消', '确认离开', '继续支付', '', 'white', false, false, 'order_pay')
                    } else if (res.err_msg === 'get_brand_wcpay_request:cancel') { // 결제취소
                        that.$utility.showToast('取消支付')
                        that.$nuxt.$emit('handleWarningDialog', true, true, true, 'setting', '确认要放弃本次付款', '您的订单将保留一段时间,到时间后将被自动取消', '确认离开', '继续支付', '', 'white', false, false, 'order_pay')
                    }
                }
            )
        },
        setOrderData() { // 주문하기
            this.$nuxt.$emit('handleLoading', true)
            this.isClicked = true
            let orderGoods = []
            const data = this.paramCart.split('|')
            let deliveryCompanyCode = []
            let airCompanyCode = []

            data.filter(res => {
                let value = res.split(',')
                let val = {
                    id: parseInt(value[0]),
                    num: parseInt(value[1])
                }

                orderGoods.push(val)
            })

            this.deliveryItems.filter(res => {
                // 택배배송회사를 수정가능한 상품의 택배배송회사코드만 배렬에 담기
                if (res.canChangeDelivery === '1') {
                    if (res.deliveryType === 1) {
                        deliveryCompanyCode.push(res.deliveryCode)
                    } else {
                        airCompanyCode.push(res.deliveryCode)
                    }
                }
            })

            if (this.isTab === '0') { // 배송에 의한 주문
                const query = {
                    deliveryId: parseInt(this.deliveryId),
                    remark: this.remark,
                    clientType: 1,
                    goods: orderGoods,
                    deliveryCompanyCode: deliveryCompanyCode.join(),
                    airCompanyCode: airCompanyCode.join()
                }

                setOrderDelivery(query).then(response => {
                    if (response.res !== undefined) {
                        getCartCount().then(resp => {
                            this.$nuxt.$emit('handleCart', resp.res.data) // 상속된 어미엘리멘트에 장바구니수를 넘기기

                            this.orderId = response.res.data.id
                            this.orderNumber = response.res.data.no
                            this.$nuxt.$emit('handleLoading', false)
                            this.setPayWechat()
                        })
                    } else {
                        this.isClicked = false
                        this.$nuxt.$emit('handleLoading', false)
                    }
                })
            }

            if (this.isTab === '1') { // 직접 주문
                const todayDate = this.$moment(new Date()).format('YYYY-MM-DD') // 현재의 년,월,일
                const hour = this.setTime.split(':')[0]
                const minute = this.setTime.split(':')[1]
                const time = numberPad(hour, 2) + ':' + minute
                const query = {
                    phoneNum: this.selfPhone,
                    takeDt: todayDate + ' ' + time + ':00',
                    clientType: 1,
                    remark: this.remark,
                    goods: orderGoods
                }

                setOrderSelf(query).then(response => {
                    if (response.res !== undefined) {
                        getCartCount().then(resp => {
                            this.$nuxt.$emit('handleCart', resp.res.data) // 상속된 어미엘리멘트에 장바구니수를 넘기기
                            this.orderId = response.res.data.id
                            this.orderNumber = response.res.data.no
                            this.$nuxt.$emit('handleLoading', false)
                            this.setPayWechat()
                        })
                    } else {
                        this.isClicked = false
                        this.$nuxt.$emit('handleLoading', false)
                    }
                })
            }
        },
        setValueData() {
            if (this.isActiveCode !== 'submit') {
                this.isActiveCode = this.phone.length === 11 ? 'active' : ''
            }

            this.isActiveUpdate = this.phone.length === 11 && this.authCode.length === 4
        },
        setShowPhoneBoundDialog() {
            this.isShowPhoneBound = true
            this.phone = ''
            this.authCode = ''
            this.isActiveCode = ''
            this.isActiveUpdate = false

            this.$nextTick(() => {
                if (this.$refs.phone) {
                    this.$refs.phone.focus()
                }
            })

            // 스크롤 막기
            this.$nextTick(() => {
                if (this.$refs.order) {
                    this.$refs.order.style.overflowY = 'hidden'
                }
            })
        },
        setSendCode() { // 인증코드 받기
            this.$nuxt.$emit('handleLoading', true)

            getAuthCode(this.phone).then(response => {
                if (response.res !== undefined) {
                    this.resAuthCode = response.res.data.value
                    this.isActiveCode = 'submit'
                    this.interval = setInterval(this.countTime, 1000)
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        setUpdatePhone() { // 폰번호를 바인딩 한후에 결제진행
            if (this.resAuthCode === this.authCode) {
                this.$nuxt.$emit('handleLoading', true)

                updatePhone(this.phone, this.authCode).then(() => {
                    this.$nuxt.$emit('handleLoading', false)
                    this.phoneBound = this.phone
                    this.setCancelView('bound')
                    this.setOrderData()
                })
            } else {
                this.$utility.showToast('验证失败')
            }
        }
    }
}
</script>

<style scoped>
.space_order_android {
    max-width: 500px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    padding: 7px 9px;
    z-index: 100;
    border-top: 1px solid #e7e7e7;
    margin: 0 auto;
}

.space_order_iphone {
    max-width: 500px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 67px;
    background-color: #fff;
    padding: 7px 9px;
    z-index: 100;
    border-top: 1px solid #e7e7e7;
    margin: 0 auto;
}

.limit-time-content {
    width: 100%;
    height: 40px;
    background-color: #ffd87a;
    display: flex;
    align-items: center;
}

.space_1 {
    padding-top: 50px;
}

.space_2 {
    top: 50px;
}

.space_2.active {
    top: 100px;
}

.space_3 {
    padding: 50px 15px 0 15px;
}

.space_3.active {
    padding: 45px 15px 0 15px;
}

.top_background {
    width: 100%;
    height: 170px;
    background: linear-gradient(to bottom, #ffcc33, #ffcc33 0%, #f6e7bc 70%, #f5f6fd);
}

.top_background.active {
    height: 210px;
}

.cancel_set {
    width: 28px;
    height: 28px;
    right: -14px;
    top: -15px;
}

.btn_1 {
    width: 102px;
    height: 29px;
    background-color: #f0f4f3;
    font-size: 13px;
    color: #bebebe;
    border-radius: 5px;
}

.btn_1.active {
    color: #222222;
    background-color: #ffcc33;
}

.btn_2 {
    border-radius: 30px;
    padding: 12px;
    background-color: #ededed;
    border: 1px solid #eaeaea;
    color: #8c8c8c;
    font-size: 16px;
    font-weight: bold;
}

.btn_2.active {
    border: 1px solid #ffcc33;
    color: #222222;
    background-color: #ffcc33;
    font-weight: bold;
}
</style>
