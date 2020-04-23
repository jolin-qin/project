<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <!--歌手背景图片-->
        <div class="bg-image" :style="bgimg" ref="bgImage">
            <!--播放按钮-->
            <div class="play-wrapper" ref="playBtn">
                <div ref="playBtn" v-show="songs.length>0" class="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
        </div>
        <!--图层-->
        <div class="bg-layer" ref="layer"></div>
        <!--歌曲列表-->
        <scroll @scroll="scroll"
                :data="songs"
                :probe-type="probeType"
                :listen-scroll="listenScroll"
                class="list" ref="list">
            <!--套个div就是为了控制css样式，因为这是song-list,还有其他的列表布局是一样的，尺寸需要有个类单独给些样式-->
            <div class="song-list-wrapper">
                <song-list @select="selectItem" :songs="songs"></song-list>
            </div>
            <!--loading-->
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
    import Scroll from 'base/scroll'
    import SongList from 'base/song-list/song-list'
    import loading from 'base/loading/loading'
    const RESERVED_HEIGHT = 40
    import { mapActions } from 'vuex'
    export default {
        name: 'music-list',
        props: {
            songs: {
                type: Array,
                default: []
            },
            title: {
                type: String,
                default: ''
            },
            bgImg: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                scrollY: 0
            }
        },
        created() {
            // 定义传给scroll的参数
            this.probeType = 3
            this.listenScroll = true
        },
        mounted() {
            //获取背景图的高度，scroll的top设置为背景图的高度，记得加‘px’
            this.imageHeight = this.$refs.bgImage.clientHeight
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
            //图层的最大滚动距离也是背景图高度，所以得出极限值，也就是说图层translate值只能在（-this.imageHeight，0）区间
            this.minHeight = -this.imageHeight + RESERVED_HEIGHT
        },
        methods: {
            scroll(pos) {
                this.scrollY = pos.y   //pos.y为负数，better-scroll规定的，没有原因
            },
            back() {
                this.$router.back()
            },
            // 点击某首歌曲，把歌手的songs列表与歌曲的index经过actions修改了vuex里相关的state参数
            selectItem(item, index) {
                this.selectPlay({
                    list: this.songs,
                    index: index
                })
            },
            ...mapActions([
                'selectPlay'
            ])
        },
        computed: {
            bgimg() {
                return `background-image:url(${this.bgImg})`
            }
        },
        watch: {
            scrollY(newY) {
                // 不管是上拉或者下拉，图层layer都需要随滚动而发生Y轴上的偏移
                let scrollValue = Math.max(this.minHeight, newY)  //取二者当中大的值
                this.$refs.layer.style['transform'] = `translate3d(0,${scrollValue}px,0)` // 记得加‘px’,不然没有效果
                this.$refs.layer.style['-webkit-transform'] = `translate3d(0,${scrollValue}px,0)`
                // 当向上滚动距离大于限制距离时，改变背景图的height,padding-top,z-index，出现顶部导航栏效果
                let zIndex = 0 //上拉控制背景图的层级
                if (newY < this.minHeight) {
                    zIndex = 10
                    this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
                    this.$refs.bgImage.style.paddingTop = 0
                    this.$refs.playBtn.style.display = 'none' //播放按钮
                } else {
                    this.$refs.bgImage.style.height = 0
                    this.$refs.bgImage.style.paddingTop = '70%'
                    this.$refs.playBtn.style.display = '' //播放按钮
                }


                // 下拉逻辑(为什么下拉的时候需要设置zIndex，因为scroll不会发生Y轴上的偏移，要想出现背景图放大效果必须设置zIndex)
                if (newY > 0) {
                    zIndex = 10
                    let scale = 1  //下拉时控制背景图的放大倍数
                    let percent = Math.abs(newY / this.minHeight)
                    scale = 1 + percent
                    this.$refs.bgImage.style['transform'] = `scale(${scale})`
                    this.$refs.bgImage.style['-webkit-transform'] = `scale(${scale})`
                }

                this.$refs.bgImage.style.zIndex = zIndex
            }
        },
        components: {
            Scroll,
            SongList,
            loading
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'
    .music-list
        position: fixed
        left: 0
        right: 0
        top: 0
        bottom: 0
        z-index: 100
        background-color: $color-background
        .back
            position: absolute
            top: 0
            left: 6px
            z-index: 50
            .icon-back
                display: block
                padding: 10px
                font-size: $font-size-large-x
                color: $color-theme
        .title
            position: absolute
            top: 0
            left: 10%
            z-index: 40
            width: 80%
            no-wrap()
            text-align: center
            line-height: 40px
            font-size: $font-size-large
            color: $color-text
        .bg-image
            position: relative
            width: 100%
            height: 0
            padding-top: 70%
            transform-origin: top
            background-size: cover
            .play-wrapper
                position: absolute
                bottom: 20px
                z-index: 50
                width: 100%
                .play
                    box-sizing: border-box
                    width: 135px
                    padding: 7px 0
                    margin: 0 auto
                    text-align: center
                    border: 1px solid $color-theme
                    color: $color-theme
                    border-radius: 100px
                    font-size: 0
                    .icon-play
                        display: inline-block
                        vertical-align: middle
                        margin-right: 6px
                        font-size: $font-size-medium-x
                    .text
                        display: inline-block
                        vertical-align: middle
                        font-size: $font-size-small
        .bg-layer
            position: relative
            height: 100%
            background: $color-background
        .list
            position: absolute
            top: 0
            bottom: 0
            width: 100%
            background: $color-background
            .song-list-wrapper
                padding: 20px 30px
            .loading-container
                position: absolute
                top: 50%
                left: 50%
                transform: translate(-50%, -50%)
</style>
