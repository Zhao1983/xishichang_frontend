<template>
<div class="spinner_overlay" v-show="isShowLoading">
    <svg class="loading-spinner">
        <circle :cx="circlePositions[index] && circlePositions[index].x" :cy="circlePositions[index] && circlePositions[index].y" :r="item.radius" :fill="item.color" v-for="(item, index) in circles" :key="index" />
    </svg>
</div>
</template>

<script>
const CENTER_X = 25
const CENTER_Y = 25
const RADIUS = 15

function positionOnCircle(radius, angle, center) {
    return {
        x: center.x + (radius * Math.cos(toRadians(angle))),
        y: center.y + (radius * Math.sin(toRadians(angle)))
    }
}

function toRadians(angle) {
    return angle * Math.PI / 180
}

function calculatePositions(component) {
    let angleIncrement = 360 / component.circles.length
    let positions = {}
    component.circles.forEach((circle, index) => {
        positions[index] = positionOnCircle(
            RADIUS,
            angleIncrement * index, {
                x: CENTER_X,
                y: CENTER_Y
            }
        )
    })
    return positions
}

export default {
    props: {
        isShowLoading: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            circles: [{
                    color: '#ff9da4',
                    radius: 0
                },
                {
                    color: '#fa8c94',
                    radius: 0
                },
                {
                    color: '#f88088',
                    radius: 0
                },
                {
                    color: '#f56b74',
                    radius: 0
                },
                {
                    color: '#f45661',
                    radius: 0
                },
                {
                    color: '#ee3e4a',
                    radius: 0
                },
                {
                    color: '#e8313e',
                    radius: 0
                },
                {
                    color: '#dd1e2b',
                    radius: 0
                },
                {
                    color: '#cf000e',
                    radius: 0
                },
            ],
            counter: 0,
            interval: null
        }
    },
    computed: {
        circlePositions: calculatePositions
    },
    created() {
        if (this.isShowLoading) {
            this.interval = setInterval(() => {
                this.counter++
                this.circles = this.circles.map((item, index) => ({
                    ...item,
                    radius: (this.counter + index) % 6
                }))
            }, 80)
        } else {
            clearInterval(this.interval)
        }
    }
}
</script>

<style scoped>
.loading-spinner {
    width: 50px;
    height: 50px;
    position: fixed;
    z-index: 500;
}
</style>
