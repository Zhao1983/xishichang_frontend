<template>
<div id="intro"></div>
</template>

<script>
import {
    getSiteTokenData
} from '@/api/intro'
import {
    setAddCart,
    getCartCount
} from "@/api/cart";
import jwtDecode from 'jwt-decode'

export default {
    name: "Intro",
    components: {},
    created() {},
    mounted() {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('wechat_info')
        sessionStorage.removeItem('site_info')
        this.$utility.setVisitAccessId()
        const key = this.$route.params && this.$route.query.key
        const type = this.$route.params && this.$route.query.type
        const id = this.$route.params && this.$route.query.id
        this.getWebInitData(key, id, type)
    },
    data() {
        return {}
    },
    methods: {
        getWebInitData(key, ids, type) {
            this.$nuxt.$emit('handleLoading', true)

            getSiteTokenData(key).then(response => {
                if (response.res !== undefined) {
                    let id = ''
                    let subid = ''
                    let value = ''
                    let isFlag = 0 // 분류용(0:일반상태값, 1:로그인상태값, 2:공유상태값)

                    if (ids !== '' && ids !== undefined) {
                        id = ids.split('-')[0]

                        if (ids.split('-')[1]) {
                            subid = ids.split('-')[1]
                        }

                        if (ids.split('-')[2]) {
                            isFlag = ids.split('-')[2]
                        }
                    }

                    if (key !== 0 && key !== '0' && key !== '') {
                        if (response.res.data.accessToken !== '' && response.res.data.accessToken !== null) {
                            const decodeToken = jwtDecode(response.res.data.accessToken)
                            // 디버깅용(디버깅을 하기 위해 위챗사용자의 아이디와 닉네임을 얻어 쿠키에 보관)
                            sessionStorage.setItem('token', response.res.data.accessToken)
                            sessionStorage.setItem('wechat_info', JSON.stringify({
                                'wechat_id': decodeToken.id,
                                'wechat_nickname': decodeToken.name
                            }))
                        }
                    }

                    if (response.res.data.goodsIconBeans !== null) {
                        if (response.res.data.goodsIconBeans.length !== 0) {
                            response.res.data.goodsIconBeans.filter(res => {
                                const index = res.iconName + '-' + res.iconUri
                                value += index + ','
                            })
                        }
                    }

                    sessionStorage.setItem('site_info', JSON.stringify({
                        'sitename': response.res.data.name,
                        'logo': response.res.data.logo,
                        'userphone': response.res.data.phone,
                        'wechat': response.res.data.wechat,
                        'useremail': response.res.data.mail,
                        'copyright': response.res.data.copy,
                        'icp': response.res.data.icp,
                        'shop_image': response.res.data.shopIcon,
                        'starttime': response.res.data.beginTime,
                        'endtime': response.res.data.endTime,
                        'timedelta': response.res.data.timeDelta,
                        'expired': response.res.data.expired,
                        'tag': response.res.data.tags,
                        'footer': response.res.data.salesStatement,
                        'selfMinuteBegin': response.res.data.selfMinuteBegin,
                        'selfMinuteInterval': response.res.data.selfMinuteInterval,
                        'selfEndTime': response.res.data.selfEndTime,
                        'watermarkPic': response.res.data.watermarkPic,
                        'watermarkWord': response.res.data.watermarkWord,
                        'freePackageStatus': response.res.data.freePackageDto ? response.res.data.freePackageDto.status : '0',
                        'freePackageNeededPrice': response.res.data.freePackageDto ? response.res.data.freePackageDto.price : 0,
                        'freeShippingStatus': response.res.data.freeShippingDto ? response.res.data.freeShippingDto.status : '0',
                        'freeShippingNeededPrice': response.res.data.freeShippingDto ? response.res.data.freeShippingDto.price : 0,
                        'freeShippingProfitRate': response.res.data.freeShippingDto ? response.res.data.freeShippingDto.profitRate : 0,
                        'goodsIconBeans': value
                    }))

                    // 상품상세페지, 점포상세페지, 분류페지, 즐겨찾기 페지가 아니라면 모든 쿠키정보 초기화
                    if (type !== 'goods_detail' && type !== 'shop_detail' && type !== 'type_detail' && type !== 'type' && type !== 'favority') {
                        localStorage.clear()
                        sessionStorage.removeItem('shareInfo')
                    }

                    switch (type) {
                        case 'orderDetail': // 주문상세페지
                            this.$router.replace('/info/order/order_detail?orderid=' + id)
                            break
                        case 'profile': // 나의정보페지
                            this.$router.replace('/info/myinfo')
                            break
                        case 'order': // 주문하기페지
                            this.$router.replace('/info/order/order_info')
                            break
                        case 'goods_detail': // 상품상세페지
                            this.$router.replace('/goods/goods_detail?shopid=' + id + '&productid=' + subid)
                            break
                        case 'search': // 검색페지
                            this.$router.replace('/search/search_input')
                            break
                        case 'search_result': // 검색결과페지
                            this.$router.replace('/search/search_result?word=' + id)
                            break
                        case 'shop_detail': // 점포상세페지
                            this.$router.replace('/shop/shop_detail?shopid=' + id + '&productid=' + subid)
                            break
                        case 'type_detail': // 분류상세페지
                            this.$router.replace('/type/type_detail?id=' + id + '&subid=' + subid + '&flag=' + isFlag)
                            break
                        case 'cart': // 장바구니페지
                            if (id !== 0 && id !== '0') {
                                const query = {
                                    goodsId: localStorage.getItem('prodId'),
                                    sizeId: localStorage.getItem('sizeId'),
                                    num: localStorage.getItem('goodsCount')
                                }

                                setAddCart(query).then(() => {
                                    getCartCount().then(resp => {
                                        this.$nuxt.$emit('handleCart', resp.res.data) // 상속된 어미엘리멘트에 장바구니수를 넘기기
                                        this.$router.replace('/goods/goods_detail?shopid=' + localStorage.getItem('shopId') + '&productid=' + localStorage.getItem('prodId'))
                                    })
                                })
                            } else {
                                this.$router.replace('/goods/cart')
                            }
                            break
                        case 'mypage': // 나의페지
                            this.$router.replace('/info/mypage')
                            break
                        case 'notice': // 공지사항페지
                            this.$router.replace('/info/notice')
                            break
                        case 'favority': // 즐겨찾기
                            this.$router.replace('/info/favority')
                            break
                        default:
                            this.$router.replace('/main')
                            break
                    }
                } else {
                    localStorage.clear()
                    sessionStorage.removeItem('shareInfo')
                    this.$router.replace('/main')
                }

                this.$nuxt.$emit('handleLoading', false)
            })
        }
    }
}
</script>
