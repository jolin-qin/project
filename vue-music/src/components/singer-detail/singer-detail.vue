<template>
    <transition name="slide">
        <music-list :songs="songs" :title="singer.name" :bg-img="singer.img"></music-list>
    </transition>

</template>
<script>
    import MusicList from 'components/music-list/music-list'
    import { getSingerDetail } from 'api/singer'
    import { ERR_OK } from 'api/config'
    import { mapGetters } from 'vuex'
    import { createSong } from 'common/js/song'

    export default {
        data() {
            return {
                songs: []
            }
        },
        computed: {
            ...mapGetters([
                'singer'
            ])
        },
        created() {
            // console.log(this.singer)
            this._getDetail()
        },
        methods: {
            _getDetail() {
                // console.log(this.singer.id);

                if (!this.singer.id) {
                    this.$router.push('/singer')
                    return false
                }
                //根据vuex里state参数singer,拿到ID获取歌手歌曲列表（列表是经过处理的，一首歌没用的信息被踢除掉了）
                getSingerDetail(this.singer.id).then((res) => {
                    if(res.code === ERR_OK) {
                        let ret = [];
                        res.data.list.forEach((item) => {
                            let { musicData } = item;
                            ret.push(createSong(musicData))
                        })
                        this.songs = ret;
                        // console.log(this.songs)
                    }
                })
            }
        },
        components: {
            MusicList
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"


    .slide-enter-active, .slide-leave-active
        transition: all .3s

    .slide-leave-to
        transform: translate3d(100%, 0, 0)
    .slide-enter
        transform: translate3d(100%, 0, 0)
</style>
