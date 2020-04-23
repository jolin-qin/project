<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
    import BScroll from 'better-scroll'
    export default {
        props: {
            data: {
                type: Array,
                default: null
            },
            probeType: {
                type: Number,
                default: 1
            },
            click: {
                type: Boolean,
                default: true
            },
            scrollX: {
                type: Boolean,
                default: false
            },
            // 监听Bscroll滚动事件标识符
            listenScroll: {
                type: Boolean,
                default: false
            },
            pullUp: {
                type: Boolean,
                default: false
            },
            pullDown: {
                type: Boolean,
                default: false
            },

            beforeScroll: {
                type: Boolean,
                default: false
            },
            refreshDelay: {
                type: Number,
                default: 20
            }
        },
        mounted() {
            setTimeout(() => {
                this._initScroll();
            },20)
        },
        methods: {
            _initScroll() {
                if (!this.$refs.wrapper) {
                    return false
                }
                // 初始化BScroll
                this.scroll = new BScroll(this.$refs.wrapper, {
                    probeType: this.probeType,
                    click: this.click,
                    scrollX: this.scrollX
                })
                // console.log(this.scroll);
                // 外派上拉加载事件
                if(this.pullUp) {
                    this.scroll.on('scrollEnd', () => {
                        if((this.scroll.maxScrollY + 50) >= this.scroll.y) {
                            this.$emit('scrollToEnd');
                        }
                    })
                }
                // 外派下拉刷新事件
                if(this.pullDown) {
                    this.scroll.on('touchEnd', () => {
                        if(this.scroll.y > 50) {
                            this.$emit('pullDown')
                        }
                    })
                }
                // 外派Bscroll的滚动事件
                if (this.listenScroll) {
                    let me = this;
                    this.scroll.on('scroll', (pos) => {
                        me.$emit('scroll', pos)
                    })
                }
            },
            disable () {
                this.scroll && this.scroll.disable()
            },
            enable () {
                this.scroll && this.scroll.enable()
            },
            refresh () {
                this.scroll && this.scroll.refresh()
            },
            scrollToElement () {
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
            }
        },
        watch: {
            data() {
                setTimeout(()=>{
                    this.refresh()
                },this.refreshDelay)
            }
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
