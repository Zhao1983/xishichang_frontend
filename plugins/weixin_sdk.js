import wx from 'weixin-js-sdk'
import {
    getWechatData
} from '@/api/intro'

const weixin = {
    setWechatShare(url, title, image) {
        // 위챗공유하루회수가 제한된 조건에서 그것을 처리하기 위해 첫 공유호출시 사용자위챗정보를 림시보관하여 그것을 활용
        if (!sessionStorage.getItem('shareInfo')) {
            getWechatData(encodeURI(url)).then(response => {
                if (response.res !== undefined) {
                    const values = {
                        debug: false, // 开启调试模式,
                        appId: response.res.data.appId,
                        timestamp: response.res.data.timestamp.toString(),
                        nonceStr: response.res.data.nonceStr,
                        signature: response.res.data.signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'updateTimelineShareData', 'updateAppMessageShareData'],
                        openTagList: ["wx-open-launch-weapp"]
                    }

                    sessionStorage.setItem('shareInfo', JSON.stringify(values))
                    wx.config(values)

                    wx.ready(function() {
                        // 위쳇 즐겨찾기에 공유
                        wx.updateTimelineShareData({
                            title: title,
                            desc: '【延吉西市场】 延边朝鲜族特产集散地',
                            link: encodeURI(url),
                            imgUrl: image,
                            success: function(res) {}
                        })
                        wx.updateAppMessageShareData({
                            title: title,
                            desc: '【延吉西市场】 延边朝鲜族特产集散地',
                            link: encodeURI(url),
                            imgUrl: image, // 分享图标
                            success: function(res) {}
                        })

                        wx.onMenuShareTimeline({
                            title: title,
                            desc: '【延吉西市场】 延边朝鲜族特产集散地',
                            imgUrl: image,
                            link: encodeURI(url),
                            type: 'link',
                            dataUrl: '',
                            success: function(res) {}
                        })
                        wx.onMenuShareAppMessage({
                            title: title,
                            desc: '【延吉西市场】 延边朝鲜族特产集散地',
                            link: encodeURI(url),
                            imgUrl: image,
                            type: 'link',
                            dataUrl: '',
                            success: function(res) {}
                        })
                    })
                }
            })
        } else {
            const value = JSON.parse(sessionStorage.getItem('shareInfo'))
            wx.config(value)

            wx.ready(function() {
                // 위쳇 즐겨찾기에 공유
                wx.updateTimelineShareData({
                    title: title,
                    desc: '【延吉西市场】 延边朝鲜族特产集散地',
                    link: encodeURI(url),
                    imgUrl: image,
                    success: function(res) {}
                })
                wx.updateAppMessageShareData({
                    title: title,
                    desc: '【延吉西市场】 延边朝鲜族特产集散地',
                    link: encodeURI(url),
                    imgUrl: image, // 分享图标
                    success: function(res) {}
                })

                wx.onMenuShareTimeline({
                    title: title,
                    desc: '【延吉西市场】 延边朝鲜族特产集散地',
                    imgUrl: image,
                    link: encodeURI(url),
                    type: 'link',
                    dataUrl: '',
                    success: function(res) {}
                })
                wx.onMenuShareAppMessage({
                    title: title,
                    desc: '【延吉西市场】 延边朝鲜族特产集散地',
                    link: encodeURI(url),
                    imgUrl: image,
                    type: 'link',
                    dataUrl: '',
                    success: function(res) {}
                })
            })
        }
    }
}

export default ({ app }, inject) => {
    inject('weixin', weixin)
}