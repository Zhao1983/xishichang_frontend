<template>
<div id="search_map" style="height: 100%;">
    <div class="container">
        <div class="search-tool" style="background-color: #fff;">
            <b-row>
                <div class="col-xs-1" style="display: flex; align-items: center;" @click="$router.go(-1)">
                    <img src="../../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                </div>
                <div class="col-xs-2" style="display: flex; align-items: center;">
                    <div class="font-222-14 fl title-width" style="width: 82%;">延吉市</div>
                </div>
                <div class="col-xs-9">
                    <div class="pos-re">
                        <input class="search-input pt-0 pb-0" type="search" name="" :value="searchWord" placeholder="请输入您的收货地址" @keypress="setResult" @input="inputWord">
                        <img class="pos-ab search_icon" src="../../../assets/images/ico_search_1.png" alt="">
                        <img v-show="searchWord !== ''" class="pos-ab search_cancel" src="../../../assets/images/ico_cancel_2.png" alt="" @click="clearWord">
                    </div>
                </div>
            </b-row>
        </div>
        <div style="height: 45%; padding-top: 60px;">
            <client-only>
                <el-amap ref="maps" :zoom="mapconf.zoom" :center="mapconf.position" :plugin="plugin" :events="events">
                    <el-amap-marker :position="mapconf.position" :icon="mapconf.icon"></el-amap-marker>
                </el-amap>
            </client-only>
        </div>
        <div ref="result_content" style="padding: 0 12px; height: 55%;">
            <div style="height: 100%; overflow-y: auto;">
                <div v-show="listData.length === 0" class="font-b8b8-16" style="display: flex; align-items: center; justify-content: center; height: 100%;">暂无结果</div>
                <b-row v-for="(item, index) in listData" :key="index" class="border-btm-2" style="padding: 15px 0; height: 70px;">
                    <div class="col-xs-10" @click="setSelectItem(item.location, item.name, item.address)">
                        <div v-if="item.active" class="mb-5" style="font-size: 16px; color: #eeb200;">{{ item.name }}</div>
                        <div v-else class="font-222-16 mb-5">{{ item.name }}</div>
                        <div class="title-width" style="font-size: 13px; color: #7c7d7e;">吉林省 延边朝鲜族自治州 延吉市 {{ item.address }}</div>
                    </div>
                    <div class="col-xs-2" style="display: flex; align-items: center; justify-content: flex-end;" @click="setAddress(item.location, item.name, item.address)">
                        <div v-show="item.active" class="btn-radius text-center font-weight pt-5 font-222-14" style="width: 100%; height: 25px;">选择</div>
                    </div>
                </b-row>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import markerIcon from '@/assets/images/marker_01.png'

export default {
    name: "search_map",
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
        window.document.body.setAttribute('style', 'position: fixed; overflow: hidden')
        this.searchWord = localStorage.getItem('delivery_addr_detail') ? localStorage.getItem('delivery_addr_detail') : ''
    },
    data() {
        return {
            searchWord: '', // 위치검색어
            listData: [], // 검색결과배렬
            plugin: [{
                pName: 'Geolocation',
                events: {
                    init: () => {
                        // 쿠키에 보관된 위치정보가 없으면 연길시의 표준위치값을 리용하고 쿠키에 위치정보가 존재하면 쿠키의 위치값을 리용
                        if (!localStorage.getItem('delivery_pos')) {
                            this.mapconf.position = ['129.51579', '42.906964']
                        } else {
                            this.mapconf.position = [localStorage.getItem('delivery_pos').split(',')[0], localStorage.getItem('delivery_pos').split(',')[1]]
                        }

                        // 주소명에 따르는 주소결과 얻기
                        if (this.searchWord === '') {
                            this.getSearchPosData(this.mapconf.position)
                        } else {
                            this.getSearchWordData()
                        }
                    },
                    complete: () => {
                        this.mapconf.position = ['129.51579', '42.906964']
                        this.getSearchPosData(this.mapconf.position)
                    }
                }
            }], // 고덕지도플러그인(지도고정위치얻기)
            events: {
                'dragging': () => { // 지도움직임 이벤트
                    this.mapconf.position = this.$refs.maps.$getCenter()
                },
                'dragend': () => { // 지도움직임 끝났을 때 이벤트
                    this.mapconf.position = this.$refs.maps.$getCenter()
                    this.getSearchPosData(this.$refs.maps.$getCenter())
                }
            }, // 고덕지도이벤트처리
            mapconf: { // 지도설정값
                position: ['129.51579', '42.906964'],
                content: '',
                icon: markerIcon,
                zoom: 16
            }
        }
    },
    methods: {
        setResult(event) {
            if (event.keyCode === 13) {
                this.getSearchWordData()
            }
        },
        inputWord(e) {
            this.searchWord = e.target.value

            if (this.searchWord === '') {
                this.mapconf.position = ['129.51579', '42.906964']
                this.getSearchPosData(this.mapconf.position)
            } else {
                this.getSearchWordData()
            }
        },
        clearWord() {
            this.searchWord = ''
            this.mapconf.position = ['129.51579', '42.906964']
            this.getSearchPosData(this.mapconf.position)
        },
        getSearchPosData(position) {
            let that = this

            AMap.service('AMap.Geocoder', function () {
                const geocoder = new AMap.Geocoder({
                    extensions: 'all'
                })

                geocoder.getAddress(position, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        that.listData = []

                        if (result.regeocode.addressComponent.adcode !== '222401') {
                            that.mapconf.position = ['129.51579', '42.906964']
                            return
                        }

                        result.regeocode.pois.filter(res => {
                            const value = {
                                address: res.address,
                                location: res.location,
                                name: res.name,
                                active: false
                            }

                            if (res.name === localStorage.getItem('delivery_addr_detail')) {
                                value.active = true
                            }

                            that.listData.push(value)

                            that.listData.sort((a, b) => {
                                if (a.active > b.active) {
                                    return -1
                                }

                                return 0
                            })
                        })
                    } else {
                        that.listData = []
                    }
                })
            })
        },
        getSearchWordData() { // 검색어에 의한 검색결과
            let that = this

            AMap.service('AMap.PlaceSearch', function () {
                const placeSearch = new AMap.PlaceSearch({
                    city: '延吉市',
                    pageSize: 30,
                    extensions: 'all'
                })

                placeSearch.search(that.searchWord, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        that.listData = []

                        if (result.poiList.pois.length !== 0) {
                            that.mapconf.position = [result.poiList.pois[0].location.lng, result.poiList.pois[0].location.lat]
                        }

                        result.poiList.pois.filter(res => {
                            const value = {
                                address: res.address,
                                location: res.location,
                                name: res.name,
                                active: false
                            }

                            if (res.name === that.searchWord) {
                                value.active = true
                            }

                            that.listData.push(value)

                            that.listData.sort((a, b) => {
                                if (a.active > b.active) {
                                    return -1
                                }

                                return 0
                            })
                        })
                    } else {
                        that.listData = []
                    }
                })
            })
        },
        setSelectItem(position, name) {
            let temp = this.listData
            this.listData = []

            temp.filter(res => {
                const value = {
                    address: res.address,
                    location: res.location,
                    name: res.name,
                    active: res.name === name
                }

                if (res.name === name) {
                    this.mapconf.position = [position.lng, position.lat]
                }

                this.listData.push(value)
            })
        },
        setAddress(position, name) {
            localStorage.setItem('delivery_pos', position.lng + ',' + position.lat)
            localStorage.setItem('delivery_addr_detail', name)
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
.amap-icon img {
    width: 18px;
    height: 30px;
}
</style>
