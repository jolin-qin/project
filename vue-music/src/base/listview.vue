<template>
    <scroll
        :data="data"
        class="listview"
        :listenScroll="listenScroll"
        @scroll="scroll"
        :probeType="probeType"
        ref="listview">
        <ul>
            <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{ group.title }}</h2>
                <ul>
                    <li
                        v-for="(item, index) in group.items"
                        :key="index"
                        class="list-group-item"
                        @click="goSingerDetail(item)">
                        <img class="avatar" v-lazy="item.img" alt="">
                        <span class="name">{{ item.name }}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <!--快速入口-->
        <div class="list-shortcut">
            <ul>
                <li v-for="(item, index) in shortcutList"
                    :key="index"
                    class="item"
                    :data-index="index"
                    @click="onShortCut"
                    :class="{'current': currentIndex === index}">{{ item }}</li>
            </ul>
        </div>
        <!--fixedTitle-->
        <div class="list-fixed" v-show="fixedTitle">
            <div class="fixed-title">{{ fixedTitle }}</div>
        </div>
    </scroll>
</template>
<script>
    import Scroll from 'base/scroll'
    import {getData} from 'common/js/dom'

    export default {
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                scrollY: 0,
                listHeight: [], //每个分类歌手list的高度
                currentIndex: 0
            }
        },
        created() {
            this.probeType = 3;
            this.listenScroll = true;
        },
        methods: {
            goSingerDetail(item) {
                this.$emit('select', item)
            },
            onShortCut(e) {
                let index = getData(e.target, 'index');
                // 所有的首字符list别表
                let listGroup = this.$refs.listGroup;
                this.$refs.listview.scrollToElement(listGroup[index], 0)
                // 要想点击字母添加current类，不是直接设置currentIndex=index，而是设置滚动距离就好了
                this.scrollY = -this.listHeight[index];
                console.log(index);
            },
            scroll(pos) {
                this.scrollY = pos.y;
            },
            // 计算出listHeight
            _getListHeight() {
                let height = 0;
                let listHeight = [];
                listHeight.push(height);
                let item = this.$refs.listGroup;
                for(let i=0;i<item.length;i++) {
                    height += item[i].clientHeight;
                    listHeight.push(height);
                }
                this.listHeight = listHeight;
                // console.log(listHeight);
            }
        },
        mounted() {

        },
        computed: {
            shortcutList() {
                return this.data.map((arr) => {
                    return arr.title.substring(0, 1);
                })
            },
            fixedTitle() {
                if (this.scrollY > 0) {
                    return ''
                } else {
                    return this.data.length !== 0 ? this.data[this.currentIndex].title : ''
                }
            }
        },
        watch: {
            data() {
                setTimeout(() => {
                    this._getListHeight()
                },20)
            },
            scrollY(newY) {
                let height = this.listHeight;
                // 当滚动到顶部，再滚动时
                if (newY > 0) {
                    this.currentIndex = 0;
                    return
                }
                // 因为遍历到倒数第二个时，有个height[i + 1]，倒数第一个与倒数第二个组成一个区间段，所以相当于整个区间段都遍历出来了，因此为什么使height.length-1
                for(let i = 0;i < height.length - 1;i++) {
                    let height1 = height[i];
                    let height2 = height[i + 1];
                    if (-newY >= height1 && -newY < height2) {
                        this.currentIndex = i;
                        return
                    }
                }
                // 滑到低，最后一个歌手list高度与倒数第二个高度在同一页面时
                this.currentIndex = height.length - 2;
            }
        },
        components: {
            Scroll
        }
    }
</script>
<style scoped lang="stylus" ref="stylesheet/stylus">
    @import '~common/stylus/variable'
    .listview
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        background: $color-background
        .list-group
            padding-bottom: 30px
            .list-group-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
            .list-group-item
                display: flex
                align-items: center
                padding: 20px 0 0 30px
                .avatar
                    width: 50px
                    height: 50px
                    border-radius: 50%
                .name
                    margin-left: 20px
                    color: $color-text-l
                    font-size: $font-size-medium
        .list-shortcut
             position: absolute
             z-index: 30
             right: 0
             top: 50%
             transform: translateY(-50%)
             width: 20px
             padding: 20px 0
             border-radius: 10px
             text-align: center
             background: $color-background-d
             font-family: Helvetica
             .item
                 padding: 3px
                 line-height: 1
                 color: $color-text-l
                 font-size: $font-size-small
                 &.current
                     color: $color-theme
        .list-fixed
            position: absolute
            top: 0
            left: 0
            width: 100%
            .fixed-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
            color: $color-text-l
            background: $color-highlight-background
</style>
