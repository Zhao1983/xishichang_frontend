/**
 * 유틸리티
 *
 */

/*
 * 3자리마다 콤마 추가
 *
 * */
export function addComma(value) {
    return value.toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (value.toString().split('.')[1] ? '.' + value.toString().split('.')[1] : '')
}

/*
 * 콤마 제거
 *
 * */
export function removeComma(value) {
    return parseInt(value.replace(/,/g, ''))
}

/*
 * 수자앞붙이에 0 추가하기
 *
 * */
export function numberPad(n, width) {
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n
}

/*
 * 휴식일 팝업 시간계산
 *
 * */
export function setCalcTimeNotice(startdate, enddate, today, showDate) {
    let ret = false
    const todayDate = new Date()
    const compareStartDate = new Date(startdate)
    const compareEndDate = new Date(enddate)

    if (todayDate >= compareStartDate && todayDate <= compareEndDate && showDate !== today) {
        ret = true
    }

    return ret
}