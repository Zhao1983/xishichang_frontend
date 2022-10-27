<template>
<div id="search" ref="search" style="height: 100%;">
    <div class="container">
        <div class="search-tool">
            <b-row>
                <div class="col-xs-1" style="display: flex; align-items: center;" @click="setBackBtn">
                    <img src="../../assets/images/ico_back_2.png" alt="" style="width: 10px; height: 17px;">
                </div>
                <div class="col-xs-11">
                    <div class="pos-re">
                        <input v-focus ref="search_value" class="search-input pt-0 pb-0" type="search" name="" :value="searchWord" placeholder="请输入关键字" @keypress="redirectResult" @input="inputWord">
                        <img class="pos-ab search_icon" src="../../assets/images/ico_search_1.png" alt="">
                        <img v-show="searchWord !== ''" class="pos-ab search_cancel" src="../../assets/images/ico_cancel_2.png" alt="" @click="setClearWord">
                    </div>
                </div>
            </b-row>
        </div>
        <div class="space">
            <div class="padding-default pb-0">
                <b-row>
                    <div class="col-xs-11">
                        <img class="fl" src="../../assets/images/ico_timer.png" alt="" style="width: 17px; height: 17px;">
                        <div class="fl ml-13 font-222-15">历史搜索</div>
                    </div>
                    <div class="col-xs-1">
                        <img class="fr" src="../../assets/images/ico_recycle_1.png" alt="" style="width: 17px; height: 19px;" @click="setDeletRecent">
                    </div>
                </b-row>
            </div>
            <div class="pl-5 pr-5">
                <b-row ref="history_content" style="overflow-y: hidden;">
                    <div class="col-xs-10">
                        <nuxt-link v-for="(item, index) in recentData" :key="index" class="search-item" :to="'/search/search_result?word=' + item.trim() + '&typeid=' + typeId">{{ item.trim() }}</nuxt-link>
                    </div>
                    <div ref="btn_history" class="col-xs-2" style="display: flex; align-items: flex-end; justify-content: center;">
                        <div v-show="isBtnHistoryShow" class="search-item pt-1">
                            <img :src="imageBottom" alt="" style="width: 10px; height: 6px;" @click="setShowHistoryWord">
                        </div>
                    </div>
                </b-row>
            </div>
            <div class="padding-default pb-0 pt-30">
                <b-row>
                    <div class="col-xs-12">
                        <img class="fl" src="../../assets/images/ico_search_favority.png" alt="" style="width: 15px; height: 17px;">
                        <div class="fl ml-13 font-222-15">热门搜索</div>
                    </div>
                </b-row>
            </div>
            <div class="pl-5 pr-5">
                <b-row ref="popular_content" style="overflow-y: hidden;">
                    <div class="col-xs-10">
                        <nuxt-link v-for="(item, index) in recommendData" :key="index" class="search-item" :to="'/search/search_result?word=' + item.trim() + '&typeid=' + typeId">{{ item.trim() }}</nuxt-link>
                    </div>
                    <div ref="btn_popular" class="col-xs-2" style="display: flex; align-items: flex-end; justify-content: center;">
                        <div v-show="isBtnPopularShow" class="search-item pt-1">
                            <img :src="imageBottom" alt="" style="width: 10px; height: 6px;" @click="setShowPopularWord">
                        </div>
                    </div>
                </b-row>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import imageBottom from '@/assets/images/ico_bottom.png'
import imageUp from '@/assets/images/ico_up.png'

export default {
    name: "Search",
    components: {},
    created() {
        this.$nuxt.$emit('cancelMenu')
        this.$nuxt.$emit('handleMenu', false)
        this.$nuxt.$emit('handleOtherMenu', false, true)
        this.$nuxt.$emit('handleNoticeShow', false)
    },
    head() {
        return {
            title: '搜索'
        }
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    },
    mounted() {
        this.$utility.setAllClearCookieAndStorageData('all')
        this.typeId = this.$route.query.typeid ? parseInt(this.$route.query && this.$route.query.typeid) : 0
        this.recommendData = sessionStorage.getItem('site_info') ? JSON.parse(sessionStorage.getItem('site_info')).tag.split(',') : []

        if (localStorage.getItem('words') !== '' && localStorage.getItem('words')) {
            const array = localStorage.getItem('words').split(',')

            array.filter(res => {
                this.recentData.push(unescape(res.trim()))
            })
        }
    },
    data() {
        return {
            imageBottom: imageBottom,
            imageUp: imageUp,
            recentData: [], // 최근검색어 배렬
            recommendData: [], // 추천검색어 배렬
            searchWord: '', // 검색어
            isShowHistoryBtn: false,
            isBtnHistoryShow: false,
            isShowPopularBtn: false,
            isBtnPopularShow: false,
            typeId: 0
        }
    },
    methods: {
        setShowHistoryWord(element) {
            this.isShowHistoryBtn = !this.isShowHistoryBtn
            this.$nextTick(() => {
                if (this.isShowHistoryBtn) {
                    element.target.setAttribute('src', imageUp)

                    if (this.$refs.history_content) {
                        this.$refs.history_content.style.height = ''
                    }

                    if (this.$refs.btn_history) {
                        this.$refs.btn_history.style.height = ''
                    }
                } else {
                    element.target.setAttribute('src', imageBottom)

                    if (this.$refs.history_content) {
                        this.$refs.history_content.style.height = '82px'
                    }

                    if (this.$refs.btn_history) {
                        this.$refs.btn_history.style.height = '82px'
                    }
                }
            })
        },
        setShowPopularWord(element) {
            this.isShowPopularBtn = !this.isShowPopularBtn
            this.$nextTick(() => {
                if (this.isShowPopularBtn) {
                    element.target.setAttribute('src', imageUp)

                    if (this.$refs.popular_content) {
                        this.$refs.popular_content.style.height = ''
                    }

                    if (this.$refs.btn_popular) {
                        this.$refs.btn_popular.style.height = ''
                    }
                } else {
                    element.target.setAttribute('src', imageBottom)

                    if (this.$refs.popular_content) {
                        this.$refs.popular_content.style.height = '82px'
                    }

                    if (this.$refs.btn_popular) {
                        this.$refs.btn_popular.style.height = '82px'
                    }
                }
            })
        },
        setClearWord() { // 입력된 검색어 삭제
            this.searchWord = ''
        },
        inputWord(e) {
            this.searchWord = e.target.value
        },
        redirectResult(event) { // 엔터키 클릭을 할 때 검색결과페지로 리다이렉트
            if (event.keyCode === 13) {
                if (this.searchWord.trim() === '') {
                    this.$nuxt.$emit('handleWarningDialog', true, true, false, 'normal', '请输入关键字', '', '', '', '确认', 'white', true, true, '')
                    return
                }

                this.addSearchWord(this.searchWord)

                this.$router.push({
                    path: '/search/search_result?word=' + this.searchWord + '&typeid=' + this.typeId
                })
            }
        },
        setDeletRecent() { // 등록된 최근검색어 삭제
            localStorage.removeItem('words')
            this.recentData = []
            this.isBtnHistoryShow = false
            this.$nextTick(() => {
                if (this.$refs.history_content) {
                    this.$refs.history_content.style.height = ''
                }

                if (this.$refs.btn_history) {
                    this.$refs.btn_history.style.height = ''
                }
            })
        },
        addSearchWord(word) { // 최근검색어 등록
            let isExist = false
            const words = localStorage.getItem('words')
            const array = words ? words.split(',') : []

            array.filter(res => {
                if (word === unescape(res.trim())) {
                    isExist = true
                }
            })

            if (!isExist) {
                if (words === '') {
                    localStorage.setItem('words', escape(word.trim()))
                } else {
                    localStorage.setItem('words', escape(word.trim()) + ',' + words)
                }
            }
        },
        setBackBtn() {
            setTimeout(() => {
                this.$router.go(-1)
            }, 300)
        }
    }
}
</script>

<style scoped>
.space {
    padding: 60px 0;
    background-color: #fff;
}
</style>
