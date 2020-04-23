<template>
    <div id="app">
        <m-header></m-header>
        <tab-header></tab-header>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <!--播放器-->
        <player></player>
    </div>
</template>

<script>
    import MHeader from 'components/m-header/m-header'
    import TabHeader from 'components/tab/tab'
    import player from 'components/player/player'

    export default {
        name: 'App',
        components: {
            MHeader,
            TabHeader,
            player
        }
    }
</script>

<style lang="stylus">
@import 'common/stylus/variable.styl';

</style>
