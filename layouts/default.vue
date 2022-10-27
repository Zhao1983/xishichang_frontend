<template>
<div ref="layout" id="default" style="height: 100%;">
    <LoadingBar :isShowLoading="pageLoading" />
    <nuxt />
    <!-- 하단 메뉴 -->
    <Menu ref="mainmenu" v-show="isShowMainMenu" :redirectUrl="key" :cartCount="cartCount" />
    <!-- END -->
    <!-- 스크롤 톱 -->
    <div ref="scroll_top" class="scroll-top">
        <img class="image" :src="imageTop" alt="" style="width: 48px; height: 48px;" @click="scrollTop">
    </div>
    <!-- END -->
    <!-- 장바구니/메뉴팝업 애니메이션 및 로출 -->
    <div ref="other_menu" class="other-menu">
        <div v-show="isShowCartMenu">
            <transition name="slide-fade-left">
                <div v-show="isShowOtherTotalMenu" class="left-menu">
                    <div class="pos-re" @click="redirectCart">
                        <img class="image-menu" :src="cartIcon" alt="">
                        <div v-show="cartCount !== 0" class="font-white-9 font-weight text-center pt-2 pos-ab basket_icon">{{ cartCount }}</div>
                    </div>
                </div>
            </transition>
        </div>
        <div v-show="isShowOtherMenu">
            <transition name="slide-fade-right">
                <div v-show="isShowOtherTotalMenu" class="right-menu" @click="setShowMenu">
                    <img class="image-menu" :src="imageSetting" alt="">
                </div>
            </transition>
        </div>
    </div>
    <!-- END -->
    <!-- 메뉴팝업 컴포넌트 -->
    <ListMenu ref="menu" :isShowOverlay="isShowMenu" :menu="key" />
    <!-- END -->
    <!-- 일반경고다이얼로그 -->
    <WarningDialog :isShowDialog="isShowWarningDialog" :isShowTitle="isDialogShowTitle" :isShowContent="isDialogShowContent" :kind="dialogKind" :title="dialogTitle" :content="dialogContent" :leftText="dialogLeftTxt" :rightText="dialogRightTxt" :normalText="dialogNormalTxt" :isStatus="isDialogStatus" :isShowClose="isDialogShowClose" :isClose="isDialogClose" />
    <!-- END -->
    <!-- 알림다이얼로그(휴일, 공지, 기타) -->
    <NoticeDialog :isShowDialog="isShowNoticeDialog" />
    <!-- END -->
</div>
</template>

<script>
import LoadingBar from '@/components/LoadingBar' //로딩 프로그레스
import Menu from '@/components/Menu' // 메뉴 컴포넌트
import ListMenu from '@/components/ListMenu'
import WarningDialog from '@/components/WarningDialog'
import NoticeDialog from '@/components/NoticeDialog'
import {
    getCartCount
} from "~/api/cart"
import imageTop from '@/assets/images/ico_top.png'
import cartIcon from '@/assets/images/ico_cart_2.png'
import imageSetting from '@/assets/images/ico_setting.png'
import define from '@/utility/define'
import {
    setCalcTimeNotice
} from "~/utility/utility"

export default {
    name: "default",
    components: {
        LoadingBar,
        Menu,
        ListMenu,
        WarningDialog,
        NoticeDialog
    },
    created() {
        // 메뉴 로출여부설정
        this.$nuxt.$on('handleMenu', (value) => {
            this.isShowMainMenu = value

            if (this.key.search('main') === -1 && this.key.search('goods/goods_detail') === -1 && this.key.search('type/type_detail') === -1 &&
                this.key.search('info/mypage') === -1 && this.key.search('info/notice') === -1 && this.key.search('info/delivery/delivery_info') === -1) {
                this.interval = setInterval(this.setAnimationTime, 500)
            } else {
                clearInterval(this.interval)
            }
        })

        // 로딩 로출여부 설정(자식컴포넌트에서 상태값을 받기)
        this.$nuxt.$on('handleLoading', (value) => {
            this.pageLoading = value
        })

        //  장바구니개수 업데이트(자식컴포넌트에서 개수 받기)
        this.$nuxt.$on('handleCart', (value) => {
            this.cartCount = Number(value)
        })

        // 메뉴팝업 로출여부설정
        this.$nuxt.$on('handleOtherMenu', (leftStatus, rightStatus) => {
            this.isShowCartMenu = leftStatus
            this.isShowOtherMenu = rightStatus
        })

        // 일반팝업 설정
        this.$nuxt.$on('handleWarningDialog', (isShowWarningDialog, isShowTitle, isShowContent, kind, title, content, leftText, rightText, normalText, isStatus, isShowClose, isClose, dialogIndex) => {
            this.isShowWarningDialog = isShowWarningDialog
            this.isDialogShowTitle = isShowTitle
            this.isDialogShowContent = isShowContent
            this.dialogKind = kind
            this.dialogTitle = title
            this.dialogContent = content
            this.dialogLeftTxt = leftText
            this.dialogRightTxt = rightText
            this.dialogNormalTxt = normalText
            this.isDialogStatus = isStatus
            this.isDialogShowClose = isShowClose
            this.isDialogClose = isClose
            this.dialogIndex = dialogIndex
        })

        // 일반팝업 확인 버튼 설정
        this.$nuxt.$on('handleConfirm', () => {
            this.isShowWarningDialog = false

            // 장바구니페지의 경우 장바구니의 상품삭제요청
            if (this.dialogIndex === 'cart') {
                this.$nuxt.$emit('handleCartConfirm')
            }

            // 주문페지에서 시장운영시간이 지나면 택배인 경우 주문여부요청
            if (this.dialogIndex === 'order_limittime') {
                this.$nuxt.$emit('handleOrderLimitTime')
            }

            // 주문페지에서 결제요청
            if (this.dialogIndex === 'order_pay') {
                this.$nuxt.$emit('handleConfirmPay')
            }

            // 주문리스트페지에서 주문취소요청
            if (this.dialogIndex === 'order_cancel') {
                this.$nuxt.$emit('handleConfirmOrderCancel')
            }

            // 주문리스트페지에서 환불요청
            if (this.dialogIndex === 'refund_order') {
                this.$nuxt.$emit('handleConfirmRefundOrder')
            }

            // 주문리스트페지에서 수화확인요청
            if (this.dialogIndex === 'order_receive') {
                this.$nuxt.$emit('handleConfirmOrderReceive')
            }

            // 배송지리스트페지에서 삭제요청
            if (this.dialogIndex === 'delivery_delete') {
                this.$nuxt.$emit('handleConfirmDeleteAddress')
            }

            // 히스토리페지에서 삭제요청
            if (this.dialogIndex === 'history_delete') {
                this.$nuxt.$emit('handleConfirmDeleteHistory')
            }

            // 알림페지에서 삭제요청
            if (this.dialogIndex === 'notice_delete') {
                this.$nuxt.$emit('handleConfirmDeleteNotice')
            }
        })

        // 일반팝업 취소 버튼 설정
        this.$nuxt.$on('handleCancel', () => {
            this.isShowWarningDialog = false

            // 주문페지에서 결제요청
            if (this.dialogIndex === 'order_pay') {
                this.$nuxt.$emit('handleCancelPay')
            }
        })

        // NUXT 클라이언트 호출인 경우
        if (process.client) {
            // 알림다이얼로그 로출여부설정
            this.$nuxt.$on('handleNoticeShow', (value) => {
                if (value) {
                    const isShowNoticeDialog = setCalcTimeNotice(define.START_DATE, define.END_DATE, this.$moment(new Date()).format('YYYY/MM/DD'), localStorage.getItem('notice_popup'))
                    this.isShowNoticeDialog = isShowNoticeDialog

                    if (isShowNoticeDialog) {
                        // 스크롤 막기
                        this.$nextTick(() => {
                            if (this.$refs.layout) {
                                this.$refs.layout.style.overflowY = 'hidden'
                            }
                        })
                    }
                }
            })

            // 알림다이얼로그 닫기설정
            this.$nuxt.$on('handleNoticeCancel', () => {
                this.isShowNoticeDialog = false
                this.$nextTick(() => {
                    if (this.$refs.layout) {
                        this.$refs.layout.style.overflowY = 'visible'
                    }
                })
            })

            // 알림다이얼로그 오늘그만보기 설정
            this.$nuxt.$on('handleNoticeVisible', () => {
                localStorage.setItem('notice_popup', this.$moment(new Date()).format('YYYY/MM/DD'))
                this.isShowNoticeDialog = false
                this.$nextTick(() => {
                    if (this.$refs.layout) {
                        this.$refs.layout.style.overflowY = 'visible'
                    }
                })
            })

            //  메뉴팝업 로출여부(자식컴포넌트에서 받기)
            this.$nuxt.$on('cancelMenu', () => {
                this.isShowMenu = false

                this.$nextTick(() => {
                    if (this.$refs.menu) {
                        this.$refs.menu.$refs.menu.classList.value = 'menu-content'

                        if (this.$refs.layout) {
                            this.$refs.layout.style.overflowY = 'visible'
                        }
                    }
                })
            })

            setTimeout(() => {
                // 장바구니에 담긴 상품개수 얻기
                if (sessionStorage.getItem('token') !== '' && sessionStorage.getItem('token')) {
                    getCartCount().then(response => {
                        if (response.res !== undefined) {
                            this.cartCount = response.res.data
                        }
                    })
                }
            }, 500)
        }
    },
    beforeDestroy() {
        this.$nuxt.$off('handleMenu')
        this.$nuxt.$off('handleLoading')
        this.$nuxt.$off('handleCart')
        this.$nuxt.$off('handleOtherMenu')
        this.$nuxt.$off('handleWarningDialog')
        this.$nuxt.$off('handleConfirm')
        this.$nuxt.$off('handleCancel')
        this.$nuxt.$off('handleNoticeShow')
        this.$nuxt.$off('handleNoticeCancel')
        this.$nuxt.$off('handleNoticeVisible')
        this.$nuxt.$off('cancelMenu')
        clearInterval(this.interval)
    },
    destroyed() {
        clearInterval(this.interval)
    },
    mounted() {
        this.$utility.setDisableFontResize() // 위챗폰트사이즈변경금지
        window.addEventListener('scroll', this.setScrollValue) // 스크롤 이벤트
    },
    computed: {
        key() {
            // 장바구니아이콘, 메뉴아이콘의 위치값을 호출된 페지에 따라 배치하기
            const callUrl = this.$route.path.slice(1, this.$route.path.length)

            this.$nextTick(() => {
                if (this.$refs.other_menu) {
                    if (callUrl.search('search/search_result') !== -1 || callUrl.search('goods/cart') !== -1 || callUrl.search('goods/order') !== -1 || callUrl.search('info/order/order_detail') !== -1) {
                        this.$refs.other_menu.style.bottom = '115px';
                    } else if (callUrl.search('info/favority') !== -1) {
                        this.$refs.other_menu.style.bottom = '90px';
                    } else {
                        this.$refs.other_menu.style.bottom = '70px';
                    }
                }
            })

            return callUrl
        }
    },
    data() {
        return {
            pageLoading: false,
            interval: null,
            cartIcon: cartIcon,
            imageTop: imageTop,
            imageSetting: imageSetting,
            isShowMainMenu: false, // 메뉴로출여부
            cartCount: 0, // 장바구니에 담긴 상품종류수
            isScroll: false, // 스크롤 진행여부
            isShowOtherTotalMenu: false,
            isShowOtherMenu: false, // 메뉴아이콘 로출여부
            isShowCartMenu: false, // 장바구니아이콘 로출여부
            isShowMenu: false, // 메뉴팝업 로출여부
            isShowWarningDialog: false, // 일반팝업 로출여부
            isShowNoticeDialog: false, // 알림다이얼로그 로출여부
            isDialogShowTitle: false, // 팝업타이틀 로출여부
            isDialogShowContent: false, // 팝업컨텐트 로출여부
            dialogKind: '', // 팝업종류(경고/설정)
            dialogTitle: '', // 팝업타이틀내용
            dialogContent: '', // 팝업컨텐트내용
            dialogLeftTxt: '', // 팝업왼쪽버튼텍스트
            dialogRightTxt: '', // 팝업오른쪽버튼텍스트
            dialogNormalTxt: '', // 팝업일반버튼텍스트
            isDialogShowClose: false, // 팝업닫기이미지 로출여부
            isDialogStatus: '', // 팝업백그라운드상태 여부
            isDialogClose: false, // 팝업백그라운드클릭 시 팝업닫기설정여부
            dialogIndex: '', // 팝업인덱스
            lastScrollMenu: 0, // 스크롤을 진행한 마지막 위치값
        }
    },
    methods: {
        menuSetting() { // 메뉴툴바 로출/비노출
            this.$nextTick(() => {
                if (this.$refs.mainmenu) {
                    if (Math.abs(this.lastScrollMenu - window.scrollY) <= 5) {
                        return
                    }

                    if (navigator.userAgent.match(/android/i)) {
                        let element = this.$refs.mainmenu.$refs.mainmenu.getElementsByClassName('menu_container_android')

                        if (element[0]) {
                            if (window.scrollY > this.lastScrollMenu && window.scrollY > element[0].offsetHeight) {
                                element[0].style.bottom = '-55px'
                            } else {
                                element[0].style.bottom = '0px'
                            }

                            element[0].style.transition = 'all .2s'
                        }
                    } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                        let element = this.$refs.mainmenu.$refs.mainmenu.getElementsByClassName('menu_container_iphone')

                        if (element[0]) {
                            if (window.scrollY > this.lastScrollMenu && window.scrollY > element[0].offsetHeight) {
                                element[0].style.bottom = '-67px'
                            } else {
                                element[0].style.bottom = '0px'
                            }

                            element[0].style.transition = 'all .2s'
                        }
                    } else {
                        let element = this.$refs.mainmenu.$refs.mainmenu.getElementsByClassName('menu_container_android')

                        if (element[0]) {
                            if (window.scrollY > this.lastScrollMenu && window.scrollY > element[0].offsetHeight) {
                                element[0].style.bottom = '-55px'
                            } else {
                                element[0].style.bottom = '0px'
                            }

                            element[0].style.transition = 'all .2s'
                        }
                    }
                }

                this.lastScrollMenu = window.scrollY
            })
        },
        setScrollValue() {
            if (window.scrollY > 0) {
                this.isScroll = true
            }

            this.$nextTick(() => {
                // 스크롤시에 스크롤톱 로출설정
                if (this.$refs.scroll_top) {
                    if (window.scrollY > 200) {
                        if (this.key === 'main' || this.key.search('search/search_result') !== -1 || this.key.search('goods/goods_detail') !== -1 ||
                            this.key.search('shop/shop_detail') !== -1 || this.key.search('info/order/order_info') !== -1) {
                            this.$refs.scroll_top.style.bottom = '80px';
                        } else if (this.key.search('info/favoriry') !== -1) {
                            this.$refs.scroll_top.style.bottom = '100px';
                        } else {
                            this.$refs.scroll_top.style.bottom = '120px';
                        }

                        this.$refs.scroll_top.style.transition = 'all .3s'
                    } else {
                        this.$refs.scroll_top.style.bottom = '-48px';
                        this.$refs.scroll_top.style.transition = 'all .3s'
                    }
                }
            })
        },
        scrollTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        },
        redirectCart() {
            if (sessionStorage.getItem('token') === '' || !sessionStorage.getItem('token')) {
                if (navigator.userAgent.match(/android/i) || navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                    window.location.href = define.AUTH_URL + '?id=0-0&type=cart'
                } else {
                    this.$router.push({
                        path: '/qr_view'
                    })
                }
            } else {
                this.$router.push({
                    path: '/goods/cart'
                })
            }
        },
        setShowMenu() {
            this.isShowMenu = true
            this.$refs.menu.$refs.menu.classList.value = 'menu-content collapsed'
            // 스크롤 막기
            this.$nextTick(() => {
                if (this.$refs.layout) {
                    this.$refs.layout.style.overflowY = 'hidden'
                }
            })
        },
        setAnimationTime() { // 장바구니아이콘, 메뉴아이콘, 하단메뉴툴 애니메이션용 타임
            if (this.isScroll) {
                this.isScroll = false
                this.isShowOtherTotalMenu = false

                if (this.key === 'search/search_result') {
                    this.menuSetting()
                }
            } else {
                this.isShowOtherTotalMenu = true

                if (this.key === 'search/search_result') {
                    this.$nextTick(() => {
                        if (this.$refs.mainmenu) {
                            if (navigator.userAgent.match(/android/i)) {
                                let element = this.$refs.mainmenu.$refs.mainmenu.getElementsByClassName('menu_container_android')

                                if (element[0]) {
                                    element[0].style.bottom = '0px'
                                }
                            } else if (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i)) {
                                let element = this.$refs.mainmenu.$refs.mainmenu.getElementsByClassName('menu_container_iphone')

                                if (element[0]) {
                                    element[0].style.bottom = '0px'
                                }
                            } else {
                                let element = this.$refs.mainmenu.$refs.mainmenu.getElementsByClassName('menu_container_android')

                                if (element[0]) {
                                    element[0].style.bottom = '0px'
                                }
                            }
                        }
                    })
                }
            }
        }
    }
}
</script>

<style scoped>
.scroll-top {
    position: fixed;
    bottom: -48px;
    max-width: 500px;
    display: flex;
    justify-content: flex-end;
    z-index: 1000;
    width: 100%;
    padding-right: 20px;
}

.scroll-top .image {
    position: absolute;
    width: 48px;
    height: 48px;
    bottom: 0;
}

.other-menu {
    position: fixed;
    bottom: 70px;
    max-width: 500px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
}

.other-menu .left-menu {
    position: absolute;
    left: 20px;
    width: 36px;
    height: 36px;
}

.other-menu .right-menu {
    position: absolute;
    right: 20px;
    width: 42px;
    height: 42px;
}

.other-menu .image-menu {
    width: 100%;
    height: 100%;
}

.slide-fade-right-enter-active {
    transition: all .3s ease;
}

.slide-fade-right-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-right-enter,
.slide-fade-right-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

.slide-fade-left-enter-active {
    transition: all .3s ease;
}

.slide-fade-left-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-left-enter,
.slide-fade-left-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}
</style>
