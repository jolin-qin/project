import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'


export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/recommend'
        },
        {
            path: '/rank',
            name: 'rank',
            component: Rank
        },
        {
            path: '/recommend',
            name: 'recommend',
            component: Recommend
        },
        {
            path: '/singer',
            name: 'singer',
            component: Singer,
            children: [
                {
                    path: ':id',
                    component: SingerDetail
                }
            ]
        },
        {
            path: '/search',
            name: 'search',
            component: Search
        }
    ]
})
