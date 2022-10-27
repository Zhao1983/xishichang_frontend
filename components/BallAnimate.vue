<template>
<div id="ballanimate">
    <div class="ball-container">
        <transition v-on:after-enter="afterEnter" v-on:enter="enter" v-on:before-enter="beforeEnter" name="drop" v-for="(litterBall, indexBall) in balls" :key="indexBall">
            <div v-show="litterBall.show" class="ball" :style="styles">
                <div class="inner" :class="indexBall"></div>
            </div>
        </transition>
    </div>
</div>
</template>

<script>
export default {
    name: 'BallAnimate',
    components: {},
    props: {
        ball: {
            type: Array,
            required: true
        },
        pos_x: {
            type: Number,
            required: true
        },
        pos_y: {
            type: Number,
            required: true
        },
        dropBall: {
            type: Array,
            required: true
        },
        styles: {
            type: Object,
            required: true
        }
    },
    computed: {
        balls() {
            return this.ball
        }
    },
    methods: {
        beforeEnter(els) {
            const count = this.dropBall.length - 1 // 카운터를 하나 감소하기
            const ball = this.dropBall[count] // ball 오브젝트얻기
            const rect = ball.el.getBoundingClientRect() // 버튼오브젝트의 위치좌표 얻기
            const tempx = (window.innerWidth * this.pos_x) / 100 // 볼이 떨어지는 시작 포인터 X좌표(%)
            const x = rect.left - tempx //이동점의 X 좌표의 설정
            const y = -(window.innerHeight - rect.top - this.pos_y) // 볼이 떨어지는 시작 포인터 Y좌표(px)
            els.style.opacity = 1
            els.style.webkitTransform = `translate3d(0,${y}px, 0)`
            els.style.transform = `translate3d(0, ${y}px, 0)` // 변형의 값을 설정
            const inner = els.getElementsByClassName('inner')[0]
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
            inner.style.transform = `translate3d(${x}px, 0, 0)`
        },
        enter(els) {
            const rf = els.offsetHeight

            this.$nextTick(function () { // 데이터변경후의 동작을 설정
                els.style.webkitTransform = 'translate3d(0, 0, 0)'
                els.style.transform = 'translate3d(0, 0, 0)'
                const inner = els.getElementsByClassName('inner')[0]
                inner.style.webkitTransform = 'translate3d(0, 0, 0)'
                inner.style.transform = 'translate3d(0, 0, 0)'
                els.style.opacity = 0.4
            })
        },
        afterEnter(els) {
            els.style.opacity = 0
            const ball = this.dropBall.shift()

            if (ball) {
                ball.show = false
                els.style.display = 'none' //여기가 아주 중요함
            }
        }
    }
}
</script>

<style scoped>
.ball-container .ball {
    position: fixed;
    z-index: 5000;
    -webkit-transition: all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41);
    transition: all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41);
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
}

.ball-container .inner {
    width: 16px;
    height: 16px;
    border-radius: 100%;
    background: rgb(235, 91, 34);
    transition: all 0.6s linear;
    -webkit-transition: all 0.6s linear;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
}
</style>
