//import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'
// import Vue from 'vue'
// Vue.prototype.$axios = axios  //把axios变成Vue实例的一个方法
// export function getRecommend () {
//     const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
//     // const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
//     // const url = debug ? '/api/getTopBanner' : 'http://ustbhuangyi.com/music/api/getTopBanner';
//     // 请求参数利用ES6方法合并成
//     const data = Object.assign({}, commonParams, {
//         platform: 'h5',
//         uin: 0,
//         needNewCode: 1
//     })
//     return jsonp(url, data, options)
// }
export function getRecommend () {
    const url = '/api/getTopBanner';
    const data = Object.assign({}, commonParams, {
        platform: 'yqq.json',
        uin: 0,
        needNewCode: 0,
        _: 1545886811612,
        // '-': 'recom' + (Math.random() + '').replace('0.', ''),
        format: 'json',
        data: {
            'comm': { 'ct': 24 },
            'category': { 'method': 'get_hot_category', 'param': { 'qq': '' }, 'module': 'music.web_category_svr' },
            'recomPlaylist': {
                'method': 'get_hot_recommend',
                'param': { 'async': 1, 'cmd': 2 },
                'module': 'playlist.HotRecommendServer'
            },
            'playlist': {
                'method': 'get_playlist_by_category',
                'param': { 'id': 8, 'curPage': 1, 'size': 40, 'order': 5, 'titleid': 8 },
                'module': 'playlist.PlayListPlazaServer'
            },
            'new_song': { 'module': 'newsong.NewSongServer', 'method': 'get_new_song_info', 'param': { 'type': 5 } },
            'new_album': {
                'module': 'newalbum.NewAlbumServer',
                'method': 'get_new_album_info',
                'param': { 'area': 1, 'sin': 0, 'num': 10 }
            },
            'new_album_tag': { 'module': 'newalbum.NewAlbumServer', 'method': 'get_new_album_area', 'param': {} },
            'toplist': { 'module': 'musicToplist.ToplistInfoServer', 'method': 'GetAll', 'param': {} },
            'focus': { 'module': 'QQMusic.MusichallServer', 'method': 'GetFocus', 'param': {} }
        }
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })

}

export function getDiscList () {
    const url = '/api/getDiscList';
    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd: Math.random(),
        format: 'json'
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    })
}

