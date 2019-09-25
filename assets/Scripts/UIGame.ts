import { ClaSound } from './Sound'
import { Game } from './Game'
import { DataControl } from './DataControl'

const { ccclass, property } = cc._decorator

@ccclass
export class UIGame extends cc.Component {

    static instance: UIGame

    @property(cc.Slider)
    private sliderNodeBGM: cc.Slider = null
    @property(cc.Label)
    private labelBGMValue: cc.Label = null
    @property(cc.Slider)
    public sliderNodeAudio: cc.Slider = null
    @property(cc.Label)
    public labelAudioValue: cc.Label = null
    @property(cc.Animation)
    private aniShowMenu: cc.Animation = null
    @property(cc.Node)
    private mask: cc.Node = null
    //两个模式的排行榜
    @property(cc.Node)
    private easyRank: cc.Node = null
    @property(cc.Node)
    private hardRank: cc.Node = null
    @property(cc.SpriteFrame)
    private picAudioOn: cc.SpriteFrame = null
    @property(cc.Sprite)
    private buttAudio: cc.Sprite = null
    @property(cc.SpriteFrame)
    private picAudioOff: cc.SpriteFrame = null
    @property(cc.Sprite)
    private buttSound: cc.Sprite = null

    protected onLoad() {
        UIGame.instance = this
        this.aniShowMenu.node.zIndex = 9
        this.mask.active = false
        this.mask.zIndex = 8
    }

    protected onDestroy() {
        UIGame.instance = null
    }

    //暂停按钮
    public ButPause() {
        //停止游戏逻辑，不会停止渲染和UI相应，需要编写暂停声音按钮
        if (cc.director.isPaused()) {
            cc.director.resume()
            ClaSound.instance.AudioResume()
        } else {
            cc.director.pause()
            ClaSound.instance.AudioPause()
        }

    }

    //重新开始
    public ButRestart() {
        cc.director.resume()
        Game.instance.viewEnd.active = false
        cc.director.loadScene('game')
    }

    //退出游戏
    public ButQuit() {
        cc.director.resume()
        cc.director.loadScene('start')
    }

    //简单模式按钮
    public ButEasy() {
        //调用修改数值，重新开始，分数自动结算
        Game.instance.EasyModel()
    }

    //困难模式按钮
    public ButHard() {
        //调用修改数值，重新开始，分数自动结算
        Game.instance.HardModel()
    }

    //声音滑块
    public SliderBGM() {
        //修改声音数值，保存声音数值，需要更新执行吗？
        ClaSound.instance.audioValuebgm = Math.round(this.sliderNodeBGM.progress * 100)
        let value: number = ClaSound.instance.audioValuebgm
        DataControl.instance.SetBGM()
        ClaSound.instance.AudioVolumeBGMChange()
        //修改文本显示
        this.labelBGMValue.string = '' + value
    }

    //滑动进入窗口
    public ButSet() {
        if (cc.director.isPaused()) {
            cc.director.resume()
            let aniClip1 = this.aniShowMenu.play('setMenuBack')
            this.mask.active = false
            aniClip1.speed = 1
        } else {
            this.mask.active = true
            let aniClip2 = this.aniShowMenu.play('setMenuShow')
            aniClip2.speed = 1
        }
    }

    //排行榜触发器
    public ToggleEasyRank() {
        //显示简单排行
        this.easyRank.active = true
        this.hardRank.active = false
    }

    public ToggleHardRank() {
        //显示困难排行
        this.easyRank.active = false
        this.hardRank.active = true
    }

    //点击周围，设置按钮退回
    public ButtSetMenuBack() {
        cc.director.resume()
        let aniClip1 = this.aniShowMenu.play('setMenuBack')
        aniClip1.speed = 1
        this.mask.active = false
    }

    //声音开关图片变化
    public PicChange() {
        if (Game.instance.ifAudioOn) {
            this.buttAudio.spriteFrame = this.picAudioOn
        } else {
            this.buttAudio.spriteFrame = this.picAudioOff
        }
        if (Game.instance.ifSoundOn) {
            console.log()
            this.buttSound.spriteFrame = this.picAudioOn
        } else {
            this.buttSound.spriteFrame = this.picAudioOff
        }
    }

    //音效开关
    public ButAudioSet() {
        //存储音效开关值，改变图片
        if (Game.instance.ifAudioOn) {
            Game.instance.ifAudioOn = false
            this.buttAudio.spriteFrame = this.picAudioOff
        } else {
            Game.instance.ifAudioOn = true
            this.buttAudio.spriteFrame = this.picAudioOn
        }
        DataControl.instance.SetAudio()
    }

    //背景声音开关
    public ButSoundSet() {
        //存储背景声音开关值，改变图片
        if (Game.instance.ifSoundOn) {
            Game.instance.ifSoundOn = false
            this.buttSound.spriteFrame = this.picAudioOff
            ClaSound.instance.AudioBGMOff()
        } else {
            Game.instance.ifSoundOn = true
            this.buttSound.spriteFrame = this.picAudioOn
            ClaSound.instance.AudioBGMOn()
        }
        DataControl.instance.SetBGM()
    }

    //滑块，用于控制音效大小
    public SliderAudio() {
        //修改文本
        let value: number = Math.round(this.sliderNodeAudio.progress * 100)
        this.labelAudioValue.string = '' + value
        //修改声音数值
        ClaSound.instance.audioValueAudio = value
        //存储数值
        DataControl.instance.SetAudio()
    }

    //END
}
