<template>
<div id="delivery_info" style="height: 100%;">
    <div class="back_overlay" v-show="isShowAddressList" @click="setCancelView()"></div>
    <div class="container">
        <div class="header-tool">
            <b-row>
                <div class="col-xs-2">
                    <div @click="$router.go(-1)" style="width: 17px; height: 27px;">
                        <img class="mt-6" src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                    </div>
                </div>
                <div class="col-xs-8">
                    <div v-if="deliveryId === 0" class="font-222-18 pt-6 text-center">新增收货地址</div>
                    <div v-else class="font-222-18 pt-6 text-center">修改收货地址</div>
                </div>
                <div class="col-xs-2"></div>
            </b-row>
        </div>
        <div id="content" class="space pl-12 pr-12 background-white">
            <div class="border-btm-3" style="padding: 15px 0;">
                <b-row>
                    <div class="col-xs-3">
                        <div class="font-222-15 font-weight">收货地址:</div>
                    </div>
                    <div class="col-xs-8" @click="setShowDialog">
                        <div v-if="address === ''" class="title-width" style="font-size: 15px; color: #b1b1b1;">点击选择收货地址</div>
                        <div v-else class="title-width font-222-15">{{ address }}</div>
                    </div>
                    <div class="col-xs-1">
                        <img class="fr mt-4" src="../../../assets/images/ico_right_1.png" alt="" style="width: 6px; height: 10px;">
                    </div>
                </b-row>
            </div>
            <div v-show="isShowMap" class="border-btm-3" style="padding: 15px 0;">
                <b-row>
                    <div class="col-xs-3">
                        <div class="font-222-15 font-weight">详细地址:</div>
                    </div>
                    <div class="col-xs-8">
                        <input id="addressDetail" ref="addressDetail" type="text" v-model="addressDetail" class="delivery-input pl-0" name="" value="" placeholder="请输入详细地址" :readonly="true" @click="redirectMap">
                    </div>
                    <div class="col-xs-1">
                        <img class="fr" src="../../../assets/images/ico_position.png" alt="" style="width: 14px; height: 19px;" @click="redirectMap">
                    </div>
                </b-row>
            </div>
            <div class="border-btm-3" style="padding: 15px 0;">
                <b-row>
                    <div class="col-xs-3">
                        <div class="font-222-15 font-weight">门牌地址:</div>
                    </div>
                    <div class="col-xs-9">
                        <input id="houseNo" ref="houseNo" type="text" v-model="houseNo" class="delivery-input pl-0" name="" value="" placeholder="请输入门牌地址">
                    </div>
                </b-row>
            </div>
            <div class="border-btm-3" style="padding: 15px 0;">
                <b-row>
                    <div class="col-xs-3">
                        <div class="font-222-15 font-weight">收货人:</div>
                    </div>
                    <div class="col-xs-9">
                        <input id="userName" ref="userName" type="text" v-model="userName" class="delivery-input pl-0" name="" value="" placeholder="请输入收货人姓名">
                    </div>
                </b-row>
            </div>
            <div class="border-btm-3" style="padding: 15px 0;">
                <b-row>
                    <div class="col-xs-3">
                        <div class="font-222-15 font-weight">手机号:</div>
                    </div>
                    <div class="col-xs-9">
                        <input id="phoneNum" ref="phoneNum" type="text" inputmode="numeric" v-model="phoneNum" class="delivery-input pl-0" name="" value="" placeholder="请输入收货人手机号码">
                    </div>
                </b-row>
            </div>
            <div v-show="deliveryId !== 0" class="border-btm-3" style="padding: 15px 0;">
                <b-row>
                    <div class="col-xs-10">
                        <div class="font-222-15 font-weight mb-5">设置默认地址:</div>
                        <div class="font-222-12">提醒:每次下单会默认推荐使用该地址</div>
                    </div>
                    <div class="col-xs-2" style="height: 37px; justify-content: flex-end; display: flex; align-items: center;">
                        <label class="switch">
                            <input type="checkbox" v-model="isAddressDefault">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </b-row>
            </div>
            <div class="text-center mt-24">
                <div class="btn-radius font-weight" style="width: 100%;" @click="setDelivery">保存地址</div>
            </div>
        </div>
    </div>
    <!-- 배송지 선택 팝업 -->
    <div class="address-content" ref="address" v-show="isShowAddressList">
        <div class="border-btm-1 pos-fix background-white" style="width: 100%; z-index: 100; max-width: 500px;">
            <!-- 선택된 성, 시, 구를 표시하기 위한 스와이프 -->
            <b-row>
                <div class="col-xs-11 pl-15 pr-10">
                    <swiper :options="swiperResult">
                        <swiper-slide class="swiper-slide" v-for="(item, index) in locationResult" :key="index" style="width: auto">
                            <div class="tab-menu" :class="{active: isActiveResult(item)}" @click="setResutItem(index)">{{ item }}</div>
                        </swiper-slide>
                    </swiper>
                </div>
                <div class="col-xs-1 text-right pr-13 pt-11">
                    <img src="../../../assets/images/ico_cancel_3.png" alt="" style="width: 12px; height: 12px;" @click="setCancelView('address')">
                </div>
            </b-row>
        </div>
        <div style="padding-top: 44px;">
            <!-- 해당 정보에 따르는 성, 시, 구를 보여주는 스와이프 -->
            <swiper ref="location" :options="swiperProvince" @slideChangeTransitionStart="onSwiperSlideChangeTransitionStart">
                <!-- 성 정보 -->
                <swiper-slide class="swiper-slide">
                    <div v-for="province in provinceData" :key="province.id" class="border-btm-1">
                        <b-row @click="setProvince(province.name, province.districts, province.adcode)">
                            <div class="col-xs-11">
                                <div class="font-222-14 pl-15" style="padding: 10px;">{{ province.name }}</div>
                            </div>
                            <div class="col-xs-1 text-right pr-13 pt-7">
                                <img src="../../../assets/images/ico_right_2.png" alt="" style="width: 7px; height: 12px;">
                            </div>
                        </b-row>
                    </div>
                </swiper-slide>
                <!-- 시 정보 -->
                <swiper-slide class="swiper-slide">
                    <div v-for="city in cityData" :key="city.id" class="border-btm-1">
                        <b-row @click="setCity(city.name, city.districts, city.adcode)">
                            <div class="col-xs-11">
                                <div class="font-222-14 pl-15" style="padding: 10px;">{{ city.name }}</div>
                            </div>
                            <div class="col-xs-1 text-right pr-13 pt-7">
                                <img src="../../../assets/images/ico_right_2.png" alt="" style="width: 7px; height: 12px;">
                            </div>
                        </b-row>
                    </div>
                </swiper-slide>
                <!-- 지역 정보 -->
                <swiper-slide class="swiper-slide">
                    <div v-for="country in countryData" :key="country.id" class="border-btm-1">
                        <b-row @click="setCountry(country.name, country.adcode, country.center)">
                            <div class="col-xs-11">
                                <div class="font-222-14 pl-15" style="padding: 10px;">{{ country.name }}</div>
                            </div>
                            <div class="col-xs-1 text-right pr-13 pt-7">
                                <img src="../../../assets/images/ico_right_2.png" alt="" style="width: 7px; height: 12px;">
                            </div>
                        </b-row>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</div>
</template>

<script>
import locationData from '@/assets/location.json'

import {
    getDelivery,
    setRegisterDelivery,
    setUpdateDelivery,
    setDefaultAddress
} from '@/api/delivery'

export default {
    name: "delivery_info",
    components: {

    },
    head() {
        return {
            title: '收货地址'
        }
    },
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, false)
        this.$nuxt.$emit('handleNoticeShow', false)
    },
    mounted() {
        window.document.body.setAttribute('style', '')
        window.addEventListener('keyup', this.setEvent)
        this.$utility.removeWechatOptionTool()

        this.deliveryId = parseInt(this.$route.query && this.$route.query.deliveryid)
        this.provinceId = localStorage.getItem('provinceid') ? parseInt(localStorage.getItem('provinceid')) : 0
        this.cityId = localStorage.getItem('cityid') ? parseInt(localStorage.getItem('cityid')) : 0
        this.countryId = localStorage.getItem('countryid') ? parseInt(localStorage.getItem('countryid')) : 0
        this.address = localStorage.getItem('delivery_addr') ? localStorage.getItem('delivery_addr') : ''
        this.addressDetail = localStorage.getItem('delivery_addr_detail') ? localStorage.getItem('delivery_addr_detail') : ''
        this.houseNo = localStorage.getItem('delivery_houseno') ? localStorage.getItem('delivery_houseno') : ''
        this.userName = localStorage.getItem('delivery_username') ? localStorage.getItem('delivery_username') : ''
        this.phoneNum = localStorage.getItem('delivery_phone') ? localStorage.getItem('delivery_phone') : ''
        this.isAddressDefault = localStorage.getItem('delivery_default') === '1'
        this.provinceName = localStorage.getItem('provinceName') ? localStorage.getItem('provinceName') : ''
        this.cityName = localStorage.getItem('cityName') ? localStorage.getItem('cityName') : ''
        this.countryName = localStorage.getItem('countryName') ? localStorage.getItem('countryName') : ''
        this.gpsInfo = localStorage.getItem('delivery_pos') ? localStorage.getItem('delivery_pos') : ''
        this.isShowMap = localStorage.getItem('delivery_map') === '1'

        // 배송지 수정일 때 서버에서 배송지정보 얻기
        if (this.deliveryId !== 0) {
            this.getDeliveryData()
        }
    },
    data() {
        return {
            deliveryId: 0, // 수화주소아이디
            address: '', // 수화주소
            addressDetail: '', // 수화상세주소1
            houseNo: '', // 수화상세주소2
            userName: '', // 수화인
            phoneNum: '', // 수화인폰번호
            isAddressDefault: false, // 디폴트수화주소상태
            provinceData: locationData, // 전국의 성,시,지역정보
            provinceId: 0, // 수회주소 성아이디
            cityId: 0, // 수화주소 시아이디
            countryId: 0, // 수화주소 지역아이디
            provinceName: '', // 성명
            cityName: '', // 시명
            countryName: '', // 지역명
            isShowAddressList: false, // 주소선택팝업로출여부
            cityData: [], // 시배렬
            countryData: [], // 지역배렬
            locationResult: ['请选择'], // 주소선택결과
            activeItem: '请选择',
            gpsInfo: '', // 사용자지정위치정보(위도, 경도)
            isShowMap: false, // 지도사용여부
            swiperResult: {
                slidesPerView: 'auto',
                spaceBetween: 15
            },
            swiperProvince: {
                slidesPerView: 'auto',
                autoHeight: true
            }
        }
    },
    methods: {
        setEvent(element) {
            // 수화인 입력할 때 글자수를 20글자로 제한
            if (element.target.id === 'userName') {
                element.target.value = element.target.value.substr(0, 20)
                this.userName = element.target.value
            }

            // 수화인폰번호 입력할 때 수자만 허용
            if (element.target.id === 'phoneNum') {
                element.target.value = element.target.value.replace(/[^0-9]/g, '').substr(0, 11)
                this.phoneNum = element.target.value
            }

            if (element.target.id === 'houseNo') {
                element.target.value = element.target.value.substr(0, 30)
                this.houseNo = element.target.value
            }
        },
        getDeliveryData() { // 수화정보 얻기
            this.$nuxt.$emit('handleLoading', true)
            this.locationResult = []

            getDelivery().then(response => {
                if (response.res !== undefined) {
                    response.res.data.filter(res => {
                        if (res.id === this.deliveryId) {
                            if (localStorage.getItem('provinceid')) {
                                // 쿠키정보에 배송지정보가 존재한다면 쿠키정보 이용
                                this.address = localStorage.getItem('delivery_addr') ? localStorage.getItem('delivery_addr') : ''
                                this.addressDetail = localStorage.getItem('delivery_addr_detail') ? localStorage.getItem('delivery_addr_detail') : ''
                                this.houseNo = localStorage.getItem('delivery_houseno') ? localStorage.getItem('delivery_houseno') : ''
                                this.userName = localStorage.getItem('delivery_username') ? localStorage.getItem('delivery_username') : ''
                                this.phoneNum = localStorage.getItem('delivery_phone') ? localStorage.getItem('delivery_phone') : ''
                                this.isAddressDefault = localStorage.getItem('delivery_default') === '1'
                                this.provinceName = localStorage.getItem('provinceName') ? localStorage.getItem('provinceName') : ''
                                this.cityName = localStorage.getItem('cityName') ? localStorage.getItem('cityName') : ''
                                this.countryName = localStorage.getItem('countryName') ? localStorage.getItem('countryName') : ''
                                this.gpsInfo = localStorage.getItem('delivery_pos') ? localStorage.getItem('delivery_pos') : ''
                                this.isShowMap = localStorage.getItem('delivery_map') === '1'
                            } else {
                                // 쿠키정보에 배송지정보가 존재하지 않으면 서버정보 이용
                                this.address = res.province + ' ' + res.city + ' ' + res.country
                                this.provinceName = res.province
                                this.cityName = res.city
                                this.countryName = res.country
                                this.addressDetail = res.address
                                this.houseNo = res.country === '延吉市' ? res.houseNo : res.address
                                this.userName = res.userName
                                this.phoneNum = res.phoneNum
                                this.isAddressDefault = res.isDefault === '1'
                                this.gpsInfo = res.gpsInfo
                                this.isShowMap = res.country === '延吉市'
                            }

                            this.provinceData.filter(prov => {
                                if (prov.name === this.provinceName) {
                                    this.provinceId = prov.adcode
                                    this.cityData = prov.districts

                                    prov.districts.filter(city => {
                                        if (city.name === this.cityName) {
                                            this.cityId = city.adcode
                                            this.countryData = city.districts

                                            city.districts.filter(country => {
                                                if (country.name === this.countryName) {
                                                    this.countryId = country.adcode
                                                }
                                            })
                                        }
                                    })
                                }
                            })

                            this.locationResult.push(this.provinceName)
                            this.locationResult.push(this.cityName)
                            this.locationResult.push(this.countryName)
                        }
                    })
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        },
        onSwiperSlideChangeTransitionStart() {
            const index = this.$refs.location.$swiper.activeIndex

            if (this.cityData.length === 0 && this.countryData.length === 0) { // 시, 지역정보가 없으면 스와이프위치를 성 위치로 고정
                this.$refs.location.$swiper.slideTo(0)
            } else if (this.countryData.length === 0) { // 지역정보가 없으면 슬라이드 위치를 시 위치로 고정
                if (index === 2) {
                    this.$refs.location.$swiper.slideTo(index - 1)
                }
            }

            if (this.locationResult[index]) {
                this.activeItem = this.locationResult[index]
            }

            switch (index) {
                case 0: // 성 선택
                    // 선택된 성을 맨우로 올리기
                    this.provinceData.filter((res, index) => {
                        if (res.name === this.activeItem) {
                            const tmp = this.provinceData[index]
                            this.provinceData[index] = this.provinceData[0]
                            this.provinceData[0] = tmp
                        }
                    })
                    break
                case 1: // 시 선택
                    // 선택된 시를 맨우로 올리기
                    this.cityData.filter((res, index) => {
                        if (res.name === this.activeItem) {
                            let tmp = this.cityData[index]
                            this.cityData[index] = this.cityData[0]
                            this.cityData[0] = tmp
                        }
                    })
                    break
                case 2: // 구 선택
                    // 선택된 구를 맨우로 올리기
                    this.countryData.filter((res, index) => {
                        if (res.name === this.activeItem) {
                            let tmp = this.countryData[index]
                            this.countryData[index] = this.countryData[0]
                            this.countryData[0] = tmp
                        }
                    })
                    break
            }
        },
        isActiveResult(name) { // 배송지결과부분에 active 클라스 추가
            return this.activeItem === name
        },
        setProvince(name, city, id) { // 성 선택
            this.address = ''
            this.countryData = []
            this.locationResult = []
            this.provinceName = name

            this.cityData = city
            this.locationResult.push(name)
            this.provinceId = id

            if (city.length !== 0) {
                this.$nextTick(() => {
                    if (this.$refs.location) {
                        this.$refs.location.$swiper.slideTo(1)
                        this.$refs.address.scrollTo(0, 0)
                    }
                })

                this.locationResult.push('请选择')
                this.activeItem = '请选择'
            } else {
                this.locationResult.filter(res => {
                    this.address += res + ' '
                })

                this.setCancelView()
            }
        },
        setCity(name, country, id) { // 시 선택
            this.address = ''
            this.countryData = []
            this.countryData = country
            this.cityName = name

            const temp = this.locationResult
            this.locationResult = []
            this.locationResult.push(temp[0])
            this.locationResult.push(name)
            this.cityId = id

            if (country.length !== 0) {
                this.$nextTick(() => {
                    if (this.$refs.location) {
                        this.$refs.location.$swiper.slideTo(2)
                        this.$refs.address.scrollTo(0, 0)
                    }
                })

                this.locationResult.push('请选择')
                this.activeItem = '请选择'
            } else {
                this.locationResult.filter(res => {
                    this.address += res + ' '
                })

                this.setCancelView()
            }
        },
        setCountry(name, id) { // 지역 선택
            this.address = ''
            this.countryName = name

            const temp = this.locationResult
            this.locationResult = []
            this.locationResult.push(temp[0])
            this.locationResult.push(temp[1])
            this.locationResult.push(name)
            this.countryId = id
            this.isShowMap = id === '222401'
            this.addressDetail = ''
            this.houseNo = ''

            if (id !== '222401') {
                this.gpsInfo = ''
            }

            this.locationResult.filter(res => {
                this.address += res + ' '
            })

            this.setCancelView()
        },
        setResutItem(index) { // 선택된 결과의 성, 시, 지역을 클릭했을 때 해당 슬라이드위치로 이동
            this.activeItem = this.locationResult[index]
            this.$nextTick(() => {
                if (this.$refs.location) {
                    this.$refs.location.$swiper.slideTo(index)
                }
            })

            switch (index) {
                case 0: // 성 선택
                    // 선택된 시를 맨우로 올리기
                    this.provinceData.filter((res, index) => {
                        if (res.name === this.activeItem) {
                            const tmp = this.provinceData[index]
                            this.provinceData[index] = this.provinceData[0]
                            this.provinceData[0] = tmp
                        }
                    })
                    break
                case 1: // 시 선택
                    // 선택된 시를 맨우로 올리기
                    this.cityData.filter((res, index) => {
                        if (res.name === this.activeItem) {
                            let tmp = this.cityData[index]
                            this.cityData[index] = this.cityData[0]
                            this.cityData[0] = tmp
                        }
                    })
                    break
                case 2: // 구 선택
                    // 선택된 구를 맨우로 올리기
                    this.countryData.filter((res, index) => {
                        if (res.name === this.activeItem) {
                            let tmp = this.countryData[index]
                            this.countryData[index] = this.countryData[0]
                            this.countryData[0] = tmp
                        }
                    })
                    break
            }
        },
        setShowDialog() { // 배송지 선택팝업 로출
            window.document.body.setAttribute('style', 'position: fixed; overflow: hidden')
            this.isShowAddressList = true

            setTimeout(() => {
                this.$nextTick(() => {
                    if (this.$refs.address) {
                        this.$refs.address.classList.toggle('collapsed')
                    }
                })

                // 이미전에 배송주소가 설정이 되였다면 해당 배송주소를 가리키도록 스와이프 이동
                if (this.locationResult[2]) { // 구가 정해져있다면
                    this.activeItem = this.locationResult[2]

                    // 선택된 구를 맨우로 올리기
                    this.countryData.filter((res, index) => {
                        if (res.name === this.activeItem) {
                            let tmp = this.countryData[index]
                            this.countryData[index] = this.countryData[0]
                            this.countryData[0] = tmp
                        }
                    })

                    this.$nextTick(() => {
                        if (this.$refs.location) {
                            this.$refs.location.$swiper.slideTo(2)
                        }
                    })
                } else if (this.locationResult[1]) { // 시가 정해져있다면 스와이프 이동
                    this.activeItem = this.locationResult[1]
                    this.$nextTick(() => {
                        if (this.$refs.location) {
                            this.$refs.location.$swiper.slideTo(1)
                        }
                    })
                } else { // 성, 시, 구가 정해져있지 않다면 처음 위치
                    this.activeItem = this.locationResult[0]
                    this.$nextTick(() => {
                        if (this.$refs.location) {
                            this.$refs.location.$swiper.slideTo(0)
                        }
                    })
                }
            }, 50)
        },
        setCancelView() {
            this.isShowAddressList = false
            this.$nextTick(() => {
                if (this.$refs.address) {
                    this.$refs.address.classList.toggle('collapsed')
                }
            })
        },
        redirectMap() { // 지도설정인 경우 배송지정보들 쿠키에 보관
            localStorage.setItem('provinceid', this.provinceId)
            localStorage.setItem('cityid', this.cityId)
            localStorage.setItem('countryid', this.countryId)
            localStorage.setItem('delivery_addr', this.address)
            localStorage.setItem('delivery_addr_detail', this.addressDetail)
            localStorage.setItem('delivery_houseno', this.houseNo)
            localStorage.setItem('delivery_username', this.userName)
            localStorage.setItem('delivery_phone', this.phoneNum)
            localStorage.setItem('delivery_pos', this.gpsInfo)
            localStorage.setItem('provinceName', this.provinceName)
            localStorage.setItem('cityName', this.cityName)
            localStorage.setItem('countryName', this.countryName)

            if (this.isShowMap) {
                localStorage.setItem('delivery_map', '1')
            } else {
                localStorage.setItem('delivery_map', '0')
            }

            if (this.isAddressDefault) {
                localStorage.setItem('delivery_default', '1')
            } else {
                localStorage.setItem('delivery_default', '0')
            }

            this.$router.push({
                path: '/info/delivery/search_map?deliveryid=' + this.deliveryId
            })
        },
        setDelivery() {
            if (this.address.trim() === '') {
                this.$utility.showToast('请选择收货地址')
                return
            }

            if (this.addressDetail.trim() === '' && this.isShowMap === true) {
                this.$utility.showToast('请输入详细地址')
                return
            }

            if (this.houseNo.trim() === '' && this.isShowMap === false) {
                this.$utility.showToast('请输入门牌地址')
                return
            }

            if (this.userName.trim() === '') {
                this.$refs.userName.focus()
                this.$utility.showToast('请输入收货人姓名')
                return
            }

            if (this.phoneNum.trim() === '') {
                this.$refs.userName.focus()
                this.$utility.showToast('请输入收货人手机号码')
                return
            }

            const query = {
                userName: this.userName,
                phoneNum: this.phoneNum,
                provinceId: parseInt(this.provinceId),
                cityId: parseInt(this.cityId),
                countryId: parseInt(this.countryId),
                addressInfo: this.isShowMap === true ? this.addressDetail.replace(/(\s*)/g, '') : this.houseNo,
                houseNo: this.isShowMap === true ? this.houseNo : '',
                gpsInfo: this.gpsInfo,
                provinceName: this.provinceName,
                cityName: this.cityName,
                countryName: this.countryName
            }

            if (this.deliveryId === 0) { // 수화주소 등록
                setRegisterDelivery(query).then(response => {
                    if (response.res !== undefined) {
                        this.$router.go(-1)
                    }
                })
            }

            if (this.deliveryId !== 0) { // 수화주소 수정
                setUpdateDelivery(this.deliveryId, query).then(response => {
                    if (response.res !== undefined) {
                        if (this.isAddressDefault) {
                            setDefaultAddress(this.deliveryId).then(resp => {
                                if (resp.res !== undefined) {
                                    this.$router.go(-1)
                                }
                            })
                        } else {
                            this.$router.go(-1)
                        }
                    }
                })
            }
        }
    }
}
</script>

<style scoped>
.space {
    padding: 50px 0;
}
</style>
