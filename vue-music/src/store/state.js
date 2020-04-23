import {playMode} from 'common/js/config'
const state = {
    singer: {}, //歌手信息（头像，名字，id）
    playing: false, //播放状态，播放/暂停
    fullScreen: false, //是否全屏
    playList: [],//播放列表歌曲集合，点击上一首，下一首用
    sequenceList: [],//迷你播放器右下角按钮点击后，出现一个歌曲列表
    currentIndex: -1,//当前播放或点击歌曲的index值
    mode: playMode.sequence //播放模式，随机、单曲循环、顺序
}
export default state
