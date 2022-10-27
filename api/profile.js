import request from '@/utility/request'

/*
 * 사용자프로필 얻기
 *
 * */
export function getProfile() {
    return request({
        url: 'profile',
        method: 'get'
    })
}

/*
 * 아바타 이미지 업로드
 *
 * */
export function setUploadAvatarImage(data) {
    return request({
        url: 'upload/avatar',
        method: 'post',
        data
    })
}

/*
 * 아바타 이미지 수정
 *
 * */
export function setUpdateAvatarImage(data) {
    return request({
        url: 'profile/avatar',
        method: 'put',
        data
    })
}

/*
 * 성별 수정
 *
 * */
export function updateGender(data) {
    return request({
        url: 'profile/gender',
        method: 'put',
        data
    })
}

/*
 * 생년월일 수정
 *
 * */
export function updateBirthday(data) {
    return request({
        url: 'profile/birthday',
        method: 'put',
        data
    })
}

/*
 * 인증코드 받기
 *
 * */
export function getAuthCode(phone) {
    return request({
        url: `smsAuth?phoneNum=${phone}`,
        method: 'post'
    })
}

/*
 * 인증코드 받아서 폰번호 업데이트
 *
 * */
export function updatePhone(phone, code) {
    return request({
        url: `smsAuth?phoneNum=${phone}&authCode=${code}`,
        method: 'put'
    })
}