import { DataControl } from './DataControl'
import { Game } from './Game'

const { ccclass, property } = cc._decorator

@ccclass
export class ClaSound extends cc.Component {

    // //控制所有声音的播放
    static instance: ClaSound

    //所有需要控制的声音
    @property(cc.AudioClip)
    private fire: cc.AudioClip = null
    @property(cc.AudioClip)
    private enemyDie: cc.AudioClip = null
    @property(cc.AudioClip)
    private playerDie: cc.AudioClip = null
    @property(cc.AudioClip)
    private bgm: cc.AudioClip = null

    public test: number = 2
    public audioValuebgm: number = 1
    public audioValueAudio: number = 1
    public audioBGMId: number = 0

    protected onLoad() {
        ClaSound.instance = this
        this.test = 5
    }

    protected onDestroy() {
        ClaSound.instance = null
        cc.audioEngine.uncacheAll()
    }

    //开火
    public AudioFire() {
        if (Game.instance.ifAudioOn == false) return
        DataControl.instance.GetAudio()
        cc.audioEngine.play(this.fire as any, false, this.audioValueAudio / 100)
    }

    //打死敌人
    public AudioEnemyDie() {
        if (Game.instance.ifAudioOn == false) return
        DataControl.instance.GetAudio()
        cc.audioEngine.play(this.enemyDie as any, false, this.audioValueAudio / 100)
    }

    //玩家死亡
    public AudioPlayerDie() {
        if (Game.instance.ifAudioOn == false) return
        DataControl.instance.GetAudio()
        cc.audioEngine.play(this.playerDie as any, false, this.audioValueAudio / 100)
    }

    //背景音乐开启
    public AudioBGM() {
        //获取声音数值
        DataControl.instance.GetBGM()
        this.audioBGMId = cc.audioEngine.play(this.bgm as any, true, this.audioValuebgm / 100)
        if (Game.instance.ifSoundOn == false) {
            this.AudioBGMOff()
        }
    }

    //修改bgm声音大小
    public AudioVolumeBGMChange() {
        DataControl.instance.GetBGM()
        cc.audioEngine.setVolume(this.audioBGMId, this.audioValuebgm / 100)
    }

    //恢复背景音乐
    public AudioBGMOn() {
        this.audioBGMId = cc.audioEngine.play(this.bgm as any, true, this.audioValuebgm / 100)
    }

    //关闭背景音乐
    public AudioBGMOff() {
        cc.audioEngine.stop(this.audioBGMId)
    }

    //暂停所有音乐
    public AudioPause() {
        cc.audioEngine.pauseAll()
    }

    //继续开启所有音乐
    public AudioResume() {
        cc.audioEngine.resumeAll()
    }

    //END
}
