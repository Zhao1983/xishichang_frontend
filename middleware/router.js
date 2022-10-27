/**
 * 이전 프레임워크의 라우터설정으로 URL이 들어오는 경우
 * 현재의 라우터설정대로 리다이렉트 하기
 * 
 * @param {route} 라우팅값
 * @param {redirect} 리다이렉트 설정값 
 * @returns 
 */

export default function({ route, redirect }) {
    // 상품상세페지인 경우
    if (route.path === '/goods_detail') {
        return redirect('/goods/goods_detail?shopid=' + route.query.shopid + '&productid=' + route.query.productid)
    }

    // 점포상세페지인 경우
    if (route.path === '/shop_detail') {
        return redirect('/shop/shop_detail?shopid=' + route.query.shopid + '&productid=' + route.query.productid)
    }

    // 검색결과페지인 경우
    if (route.path === '/search_result') {
        return redirect('/search/search_result?word=' + route.query.word + '&typeid=' + route.query.typeid)
    }

    // 분류페지인 경우
    if (route.path === '/type_detail') {
        if (route.query.flag === undefined) {
            return redirect('/type/type_detail?id=' + route.query.id + '&typeid=' + route.query.subid)
        } else {
            return redirect('/type/type_detail?id=' + route.query.id + '&typeid=' + route.query.subid + '&flag=' + route.query.flag)
        }
    }

    return true
}