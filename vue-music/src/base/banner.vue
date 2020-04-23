<template>
    <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide class="swiperSlide" v-for="(item, index) in bannerList" :key="index" v-if="bannerList != ''">
            <a :href="item.linkUrl" class="aLabel">
                <img :src="item.picUrl" alt="banner" class="needsclick imgLabel">
            </a>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
</template>

<script type="text/ecmascript-6">
    import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
    import 'swiper/css/swiper.css'
    export default {
        components: {
            Swiper,
            SwiperSlide
        },
        directives: {
            swiper: directive
        },
        props: ['bannerList'],
        data() {
            return {
                swiperOptions: {
                    pagination: {
                        el: '.swiper-pagination'
                    },
                    autoplay: false,
                    paginationClickable: true,
                    centeredSlides: true,
                    autoplayDisableOnInteraction: false,
                    preventClicks: false,
                    speed: 600,
                    observer:true,
                    loop: true,
                    observeParents:true
                    // Some Swiper option/callback...
                }
            }
        },
        created() {


        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.$swiper
            }
        },
        mounted() {
            this.swiper.slideTo(3, 1000, false)
        },
        methods: {

        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    .swiperSlide {
        width: 100%;
    }
    .aLabel {
        display: block;
        width: 100%;

    }
    .imgLabel {
        width: 100%;
        height: 100%;
        vertical-align: top;
    }
</style>
