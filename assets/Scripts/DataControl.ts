import { Game } from './Game'
import { ClaSound } from './Sound'

const { ccclass, property } = cc._decorator

@ccclass
export class DataControl extends cc.Component {

    static instance: DataControl

    protected onLoad() {
        DataControl.instance = this
    }

    protected onDestroy() {
        DataControl.instance = null
    }

    //清空两个排行榜的分数存储
    public CleanScore() {
        //清空
        let i: number = cc.sys.localStorage.getItem('length')
        let j: number = 0
        for (; j < i; j++) {
            cc.sys.localStorage.removeItem('list' + j)
        }
        cc.sys.localStorage.removeItem('length')
        i = cc.sys.localStorage.getItem('easyLength')
        for (j = 0; j < i; j++) {
            cc.sys.localStorage.removeItem('easyList' + j)
        }
        cc.sys.localStorage.removeItem('easyLength')
        i = cc.sys.localStorage.getItem('hardLength')
        for (j = 0; j < i; j++) {
            cc.sys.localStorage.removeItem('hardList' + j)
        }
        cc.sys.localStorage.removeItem('hardLength')
    }

    //存储分数
    public SaveScore() {
        //存储长度
        let i: number = Game.instance.scoreEasy.length
        let j: number = 0
        cc.sys.localStorage.setItem('length', i)
        for (; j < i; j++) {
            cc.sys.localStorage.setItem('list' + j, Game.instance.scoreEasy[j])
        }
    }

    //读取分数
    public GetScore() {
        if (cc.sys.localStorage.getItem('length') == null || cc.sys.localStorage.getItem('length') <= 0) {
            return
        }
        let i: number = 0
        for (; i < cc.sys.localStorage.getItem('length'); i++) {
            Game.instance.scoreEasy[i] = cc.sys.localStorage.getItem('list' + i)
        }
    }

    //获取简单排行
    public GetEasyScoreRank() {
        if (cc.sys.localStorage.getItem('easyLength') == null) {
            return
        }
        let i: number = 0
        for (; i < cc.sys.localStorage.getItem('easyLength'); i++) {
            //类型转换
            Game.instance.scoreEasy[i] = parseInt(cc.sys.localStorage.getItem('easyList' + i))
        }
    }

    //设置简单模式分数排行
    public SetEasyScoreRank() {
        let i: number = 0
        let long: number = 0
        long = Game.instance.scoreEasy.length
        if (long <= 0) { return }
        cc.sys.localStorage.setItem('easyLength', long)
        for (; i < long; i++) {
            cc.sys.localStorage.setItem('easyList' + i, Game.instance.scoreEasy[i])
        }
    }

    //设置困难分数排行
    public SetHardScoreRank() {
        let i: number = 0
        let long: number = 0
        long = Game.instance.scoreHard.length
        if (long <= 0) { return }
        cc.sys.localStorage.setItem('hardLength', long)
        for (; i < long; i++) {
            cc.sys.localStorage.setItem('hardList' + i, Game.instance.scoreHard[i])
        }
    }

    //获取困难分数排行
    public getHardScoreRank() {
        if (parseInt(cc.sys.localStorage.getItem('hardLength')) == null) {
            return;
        }
        let i: number = 0;
        for (; i < parseInt(cc.sys.localStorage.getItem('hardLength')); i++) {
            Game.instance.scoreHard[i] = parseInt(cc.sys.localStorage.getItem('hardList' + i))
        }
    }

    //设置敌人生成间隔
    public SetSpawnTime() {
        cc.sys.localStorage.setItem('spawnTime', Game.instance.spawnTime)
    }

    //得到敌人生成间隔
    public GetSpawnTime() {
        //设置默认值
        if (cc.sys.localStorage.getItem('spawnTime') == null) {
            return 1.5
        } else {
            return cc.sys.localStorage.getItem('spawnTime')
        }
    }

    //设置难度
    public SetLevel() {
        cc.sys.localStorage.setItem('level', Game.instance.level)
    }

    //获取难度
    public Getleve() {
        //处理未初始化的情况，设置默认值
        if (cc.sys.localStorage.getItem('level') == null) {
            return Game.instance.LevelType.EASY
        } else {
            return cc.sys.localStorage.getItem('level')
        }
    }

    //设置声音大小
    public SetBGM() {
        //存储数值
        cc.sys.localStorage.setItem('bgmValue', ClaSound.instance.audioValuebgm)
        cc.sys.localStorage.setItem('ifSoundOn', Game.instance.ifSoundOn)
    }

    //得到声音大小
    public GetBGM() {
        //处理没有初始化的情况
        if (cc.sys.localStorage.getItem('bgmValue') == null) {
            //设置默认值
            ClaSound.instance.audioValuebgm = 10
        } else {
            ClaSound.instance.audioValuebgm = parseInt(cc.sys.localStorage.getItem('bgmValue'))
        }
        if (cc.sys.localStorage.getItem('ifSoundOn') == null) {
            Game.instance.ifSoundOn = true
        } else {
            let str = cc.sys.localStorage.getItem('ifSoundOn')
            if (str == 'true') {
                Game.instance.ifSoundOn = true
            } else {
                Game.instance.ifSoundOn = false
            }
        }
    }

    public CleanBGM() {
        cc.sys.localStorage.removeItem('bgmValue')
        cc.sys.localStorage.removeItem('ifSoundOn')
    }

    //设置音效声音大小
    public SetAudio() {
        //存储音效大小
        cc.sys.localStorage.setItem('audioValue', ClaSound.instance.audioValueAudio)
        cc.sys.localStorage.setItem('ifAudioOn', Game.instance.ifAudioOn)
    }

    //得到音效声音大小
    public GetAudio() {
        //没有赋值的情况
        if (cc.sys.localStorage.getItem('audioValue') == null) {
            ClaSound.instance.audioValueAudio = 10
        } else {
            ClaSound.instance.audioValueAudio = parseInt(cc.sys.localStorage.getItem('audioValue'))
        }
        //存储开关
        if (cc.sys.localStorage.getItem('ifAudioOn') == null) {
            Game.instance.ifAudioOn = true
        } else {
            let str = cc.sys.localStorage.getItem('ifAudioOn')
            if (str == 'true') {
                Game.instance.ifAudioOn = true
            } else {
                Game.instance.ifAudioOn = false
            }
        }
    }

    //清空数据
    public CleanAudioValue() {
        //清空声音存储和声音开关
        cc.sys.localStorage.removeItem('audioValue')
        cc.sys.localStorage.removeItem('ifAudioOn')
    }
}
