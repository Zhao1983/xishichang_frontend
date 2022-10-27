<template>
<div id="map" style="height: 100%;">
    <div class="background-white" style="background-color: #fff; padding: 10px 15px; width: 100%;">
        <b-row>
            <div class="col-xs-1" style="display: flex; align-items: center;" @click="handleCancel">
                <img src="../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
            </div>
            <div class="col-xs-2" style="display: flex; align-items: center;">
                <div class="font-222-14 fl title-width" style="width: 82%;">延吉市</div>
            </div>
            <div class="col-xs-9">
                <div class="pos-re">
                    <input class="search-input pt-0 pb-0" type="search" name="" :value="searchWord" placeholder="请输入您的收货地址" @keypress="setResult" @input="inputWord">
                    <img class="pos-ab search_icon" src="../assets/images/ico_search_1.png" alt="">
                    <img class="pos-ab search_cancel" src="../assets/images/ico_cancel_2.png" alt="">
                </div>
            </div>
        </b-row>
    </div>
    <div style="height: 43%;">
        <client-only>
            <el-amap ref="maps" :plugin="plugin" :center="centerPos" :zoom="mapconf.zoom" :events="events">
                <el-amap-marker :position="centerPos" :icon="mapconf.icon"></el-amap-marker>
            </el-amap>
        </client-only>
    </div>
</div>
</template>

<script>
import markerIcon from '@/assets/images/marker_01.png'

export default {
    name: 'Map',
    props: {
        center: {
            type: String,
            required: true
        }
    },
    computed: {
        centerPos: {
            get() {
                if (!this.isDefaultPos) {
                    this.mapconf.position = this.center === '' ? ['129.51579', '42.906964'] : [this.center.split(',')[0], this.center.split(',')[1]]
                }

                return this.mapconf.position
            },
            set(val) {
                this.mapconf.position = val
            }
        }
    },
    created() {

    },
    data() {
        return {
            searchWord: '', // 위치검색어
            listData: [], // 검색결과배렬
            isDefaultPos: false,
            plugin: [{
                pName: 'Geolocation',
                events: {
                    complete: (result) => {
                        this.isDefaultPos = true
                        this.centerPos = [result.position.lng, result.position.lat]
                    }
                }
            }], // 고덕지도플러그인(지도고정위치얻기)
            events: {
                'dragging': () => { // 지도움직임 이벤트
                    this.mapconf.position = this.$refs.maps.$$getCenter()
                    this.getSearchPosData(this.$refs.maps.$$getCenter())
                },
                'dragend': () => { // 지도움직임 끝났을 때 이벤트
                    this.mapconf.position = this.$refs.maps.$$getCenter()
                    this.getSearchPosData(this.$refs.maps.$$getCenter())
                }
            }, // 고덕지도이벤트처리
            mapconf: { // 지도설정값
                position: this.center === '' ? ['129.51579', '42.906964'] : [this.center.split(',')[0], this.center.split(',')[1]],
                content: '',
                icon: markerIcon,
                zoom: 16
            },
        }
    },
    methods: {
        setResult(event) { // 엔터키 클릭을 할 때 검색결과페지로 리다이렉트
            if (event.keyCode === 13) {
                this.getSearchWordData()
            }
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
                        that.listData = result.regeocode.pois
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
                    pageSize: 30
                })

                placeSearch.search(that.searchWord, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        console.log(result)
                    } else {
                        this.$utility.showToast('定位失败!')
                    }
                })
            })
        },
        inputWord(e) {
            this.searchWord = e.target.value
        },
        handleCancel() {
            this.$nuxt.$emit('handleCancel')
        }
    }
}
</script>

<style>
.amap-icon img {
    width: 18px;
    height: 30px;
}
</style>
