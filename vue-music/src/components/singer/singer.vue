<template>
    <div class="singer">
        <list-view :data="singers" @select="selectSinger"></list-view>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import { getSingerList } from 'api/singer'
    import {ERR_OK} from 'api/config'
    import {mapMutations} from 'vuex'
    const hot_name = '热门';
    const hot_nummber = 10; //热门歌手数量
    import ListView from 'base/listview'
    export default {
        data() {
            return {
                singers: []
            }
        },
        created() {
            this._getSingerList()

        },
        methods: {
            // 进入歌手详情页
            selectSinger(singer) {
                // console.log(singer)
                this.$router.push({
                    path: `/singer/${singer.id}`
                })
                this.setSinger(singer)
            },
            _getSingerList() {
                getSingerList().then((res) => {
                    if(res.code === ERR_OK) {
                        // console.log(res.data.list)
                        this.singers = this._normalizeSinger(res.data.list);
                        // console.log(this.singers)

                    }
                })
            },
            _normalizeSinger(arr) {
                let map = {
                    hot: {
                        title: hot_name,
                        items: []
                    }
                }
                arr.forEach((item, index) => {
                    // 取前10条数据当做“热门”歌手数据
                    if(index < hot_nummber) {
                        map.hot.items.push({
                            id: item.Fsinger_mid,
                            name: item.Fsinger_name,
                            img: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
                        })
                    }
                    // 根据歌手名首字符分类,map里没有此字符命名的属性时，创建一个这样的map属性
                    const key = item.Findex;
                    if(!map[key]) {
                        map[key] = {
                            title: key,
                            items: []
                        }
                    }
                    // 创建好之后，把一样首字符的项push到map[key].items数组里
                    map[key].items.push({
                        id: item.Fsinger_mid,
                        name: item.Fsinger_name,
                        img: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
                    })
                })
                // 为了得到我们需要的数据格式，我们需要对map进行处理
                let hot = [],ret = [];
                for(let key in map) {
                    const val = map[key];
                    if(val.title.match(/[a-zA-Z]/)) {
                        ret.push(val);
                    } else if (val.title === hot_name) {
                        hot.push(val);
                    }
                }
                // ret数组里的元素需要排序A-Z
                ret.sort((a, b) => {
                   return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                })
                return hot.concat(ret)
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            })
        },
        components: {
            ListView
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .singer
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
</style>
