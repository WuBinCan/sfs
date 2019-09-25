import { ClaSound } from './Sound'
import { DataControl } from './DataControl'
import { UIGame } from './UIGame'

const { ccclass, property } = cc._decorator

enum StateGame {
    GAMEOVER,
    RUN,
    PAUSE,
    NORMAL
}

@ccclass
export class Game extends cc.Component {

    //单例模式
    static instance: Game

    //背景移动速度
    @property(cc.Integer)
    private ySpeed: number = 0
    //背景
    @property(cc.Node)
    private backGround1: cc.Node = null
    @property(cc.Node)
    private backGround2: cc.Node = null
    //子弹预制体
    @property(cc.Prefab)
    private preBullet: cc.Prefab = null
    //子弹发射间隔
    @property(cc.Integer)
    private fireTime: number = 0
    @property(cc.Node)
    private player: cc.Node = null
    //敌人预制体
    @property(cc.Prefab)
    private preEnemy: cc.Prefab = null
    //出生间隔
    @property(cc.Integer)
    public spawnTime: number = 0
    //分数文本
    @property(cc.Label)
    private scoreLabel: cc.Label = null
    //简单模式的分数文本排行榜
    @property(cc.Label)
    private scoreLabelEasy: Array<cc.Label> = []
    //困难模式的分数文本排行榜
    @property(cc.Label)
    private scoreLabelHard: Array<cc.Label> = []
    //简单分数窗口
    @property(cc.Node)
    public viewEnd: cc.Node = null
    //声音大小轮滑
    @property(cc.Slider)
    private sliderNodeBGM: cc.Slider = null
    //bgm声音大小显示
    @property(cc.Label)
    private labelBGMValue: cc.Label = null
    //音效滑轮
    // @property(cc.Slider)
    // private sliderNodeAudio: cc.Slider = null

    private xenemyPos: number = 0
    private yenemyPos: number = 0
    //出生计时器
    private timesEnemy: number = 0
    private newEnemy: cc.Node = null
    private endY: number = 0
    private startY: number = 0
    private newBullet: cc.Node = null
    private times: number = 0
    private score: number = 0
    public scoreEasy: Array<number> = []
    public scoreHard: Array<number> = []
    public ifAudioOn: boolean = true
    public ifSoundOn: boolean = true
    //枚举
    public LevelType = cc.Enum({ EASY: 1, HARD: 2, NORMAL: 3 })
    public level: number = 3
    //游戏状态
    public stateGame: StateGame
    //对象池类型成员变量
    private bulletPool: cc.NodePool
    //敌人对象池
    private enemyPool: cc.NodePool

    //加载资源
    protected onLoad() {
        //实现单例
        Game.instance = this
        //设置游戏参数
        this.stateGame = StateGame.NORMAL
        this.score = 0
        this.times = 0
        this.timesEnemy = 0
        this.SetBGPos()
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true
        //难度默认设置
        this.level = this.LevelType.EASY
        this.ifAudioOn = true
        this.ifSoundOn = true
        //先实例化一个对象池初始化对象池
        this.bulletPool = new cc.NodePool()
        this.BulletPoolSet()
        //实例化和初始化敌人对象池
        this.enemyPool = new cc.NodePool()
        this.EnemyPoolBuild();
    }

    //设置数值
    protected start() {
        //开启背景音乐
        ClaSound.instance.AudioBGM()
        this.viewEnd.active = false
        //获取等级信息
        this.spawnTime = DataControl.instance.GetSpawnTime()
        this.level = DataControl.instance.Getleve()
        this.StartGetSet()
    }

    //资源释放，销毁时候执行
    protected onDestroy() {
        Game.instance = null
        this.bulletPool.clear();
    }

    protected update(dt) {
        //开火计时器
        if (this.times >= this.fireTime) {

            //实例化
            this.BulletSpawn()
            this.times = 0
        }
        this.times += dt
        //敌人计时器
        if (this.timesEnemy >= this.spawnTime) {
            this.EnemySpawn()
            this.timesEnemy = 0
        }
        this.timesEnemy += dt
        //背景1移动
        if (this.backGround1.y <= this.endY) {
            this.backGround1.y = this.startY + this.endY - this.backGround1.y
        }
        this.backGround1.y -= this.ySpeed * dt
        //背景2移动
        if (this.backGround2.y <= this.endY) {
            this.backGround2.y = this.startY + this.endY - this.backGround2.y
        }
        this.backGround2.y -= this.ySpeed * dt
    }

    private SetBGPos() {
        //设定起点和终点
        if (this.backGround1.y > this.backGround2.y) {
            this.startY = this.backGround1.y
        } else {
            this.startY = this.backGround2.y
        }
        this.endY = this.startY - 2 * Math.abs(this.backGround1.y - this.backGround2.y)
    }

    private BulletSpawn() {
        //生成一个新的子弹节点
        // this.newBullet = cc.instantiate(this.preBullet)
        //放在canvas下面,zIndex设置为5
        // this.node.addChild(this.newBullet, 5)
        //设置位置
        //  this.newBullet.setPosition(this.player.position.x, this.player.height / 2 + this.player.y)

        // //对象池生成
        let bulletGet = this.BulletPoolGet();
        bulletGet.setPosition(this.player.position.x, this.player.height / 2 + this.player.y)
    }

    private EnemySpawn() {
        // //生成新节点
        // this.newEnemy = cc.instantiate(this.preEnemy)
        // //放到canvas下
        // this.node.addChild(this.newEnemy, 5)
        // //调整位置
        // this.xenemyPos = cc.randomMinus1To1() * this.node.width / 2
        // this.yenemyPos = this.node.height / 2 + this.newEnemy.height * 1.5
        // //设置坐标
        // this.newEnemy.setPosition(this.xenemyPos, this.yenemyPos)
        //使用对象池
        let enemy = this.GetEnemyPool();
        //随机位置
        this.xenemyPos = cc.randomMinus1To1() * this.node.width / 2
        this.yenemyPos = this.node.height / 2 + enemy.height * 1.5
        enemy.setPosition(this.xenemyPos, this.yenemyPos)
    }

    //得分，打死敌机
    public GetScore() {
        ClaSound.instance.AudioEnemyDie()
        this.score += 1
        this.scoreLabel.string = 'SCORE:' + this.score.toString()
    }

    // 游戏结束
    public Gameover() {
        ClaSound.instance.AudioPause()
        if (this.level == this.LevelType.EASY) {
            this.RankEasyScore()
        }
        if (this.level == this.LevelType.HARD) {
            this.RankHardScore()
        }
        this.viewEnd.active = true
        this.ShowEasyScore()
        this.ShowHardScore()
        this.stateGame = StateGame.GAMEOVER
    }

    //结算简单模式排名
    private RankEasyScore() {
        //获取已经存储的简单模式排名,返回空
        DataControl.instance.GetEasyScoreRank()
        if (this.scoreEasy.length <= 0) {
            this.scoreEasy.push(this.score)
            this.SortEasy()
        } else {
            if (this.scoreEasy.length < 6) {
                this.scoreEasy.push(this.score)
                this.SortEasy()
            } else {
                if (this.scoreEasy[this.scoreEasy.length - 1] >= this.score) {
                    let n = this.scoreEasy[this.scoreEasy.length - 1]
                    this.SortEasy()
                } else {
                    this.scoreEasy[this.scoreEasy.length - 1] = this.score
                    this.SortEasy()
                }
            }
        }
        DataControl.instance.SetEasyScoreRank()
    }

    //展示简单模式排名
    private ShowEasyScore() {
        // console.log("展示了简单没")   
        DataControl.instance.GetEasyScoreRank()
        let i: number = 0
        let long: number = 0
        let num: number = 0
        long = this.scoreLabelEasy.length
        // console.log(long)   
        for (; i < long; i++) {
            if (this.scoreEasy[i] != null) {
                num = i + 1
                this.scoreLabelEasy[i].string = '第' + num + '名  ' + this.scoreEasy[i]
            } else {
                this.scoreLabelEasy[i].string = " "
            }
        }
    }

    //结算困难模式排名
    private RankHardScore() {
        //获取已经存储的简单模式排名,返回空
        DataControl.instance.getHardScoreRank()
        if (this.scoreHard.length <= 0) {
            this.scoreHard.push(this.score)
            this.SortHard()
        } else {
            if (this.scoreHard.length < 6) {
                this.scoreHard.push(this.score)
                this.SortHard()
            } else {
                if (this.scoreHard[this.scoreHard.length - 1] >= this.score) {
                    this.SortHard()
                } else {
                    this.scoreHard[this.scoreHard.length - 1] = this.score
                    this.SortHard()
                }
            }
        }
        DataControl.instance.SetHardScoreRank()
    }

    //展示困难分数排行
    private ShowHardScore() {
        // console.log("展示了简单没")   
        DataControl.instance.getHardScoreRank()
        // this.viewEnd.active = true   
        let i: number = 0
        let long: number = 0
        let num: number = 0
        //分数文本数组大小，控制显示的数量
        long = this.scoreLabelHard.length
        for (; i < long; i++) {
            if (this.scoreHard[i] != null) {
                num = i + 1
                this.scoreLabelHard[i].string = '第' + num + '名  ' + this.scoreHard[i]
            } else {
                this.scoreLabelHard[i].string = " "
            }
        }
    }

    //EASY模式
    public EasyModel() {
        //修改数值和难度
        this.spawnTime = 1.5
        this.level = this.LevelType.EASY
        DataControl.instance.SetSpawnTime()
        DataControl.instance.SetLevel()
        if (cc.director.isPaused) {
            cc.director.resume()
        }
        cc.director.loadScene('game')
    }

    //HARD模式
    public HardModel() {
        //敌人生成变快
        this.spawnTime = 0.5
        this.level = this.LevelType.HARD
        DataControl.instance.SetSpawnTime()
        DataControl.instance.SetLevel()
        if (cc.director.isPaused) {
            cc.director.resume()
        }
        cc.director.loadScene('game')
    }

    //重新开始，需要配置声音数值显示和轮滑数值显示
    public StartGetSet() {
        //改变背景音乐轮滑
        DataControl.instance.GetBGM()
        let value: number = ClaSound.instance.audioValuebgm
        this.sliderNodeBGM.progress = ClaSound.instance.audioValuebgm / 100
        this.labelBGMValue.string = '' + value
        //改变音效轮滑
        DataControl.instance.GetAudio()
        value = ClaSound.instance.audioValueAudio
        UIGame.instance.sliderNodeAudio.progress = ClaSound.instance.audioValueAudio / 100
        UIGame.instance.labelAudioValue.string = '' + value
        //修改按钮图片
        UIGame.instance.PicChange()
    }

    //冒泡排序
    private SortEasy() {
        let outN = this.scoreEasy.length - 1
        let inN = 0
        let num = 0
        for (; outN > 0; outN--) {
            for (inN = 0; inN < outN; inN++) {
                // console.log(this.scoreEasy[inN] + '+' + this.scoreEasy[inN + 1])   
                if (this.scoreEasy[inN] < this.scoreEasy[inN + 1]) {
                    num = this.scoreEasy[inN]
                    this.scoreEasy[inN] = this.scoreEasy[inN + 1]
                    this.scoreEasy[inN + 1] = num
                }
            }
        }
        DataControl.instance.SetEasyScoreRank()
    }

    private SortHard() {
        let outN = this.scoreHard.length - 1
        let inN = 0
        let num = 0
        for (; outN > 0; outN--) {
            for (inN = 0; inN < outN; inN++) {
                if (this.scoreHard[inN] < this.scoreHard[inN + 1]) {
                    console.log(this.scoreHard[inN] + '<' + this.scoreHard[inN + 1])
                    num = this.scoreHard[inN]
                    this.scoreHard[inN] = this.scoreHard[inN + 1]
                    this.scoreHard[inN + 1] = num
                }
            }
        }
        DataControl.instance.SetHardScoreRank()
    }

    //初始化子弹对象池大小
    protected BulletPoolSet() {
        let n = 5
        for (let i = 0; i < n; i++) {
            let newBullet = cc.instantiate(this.preBullet)
            this.bulletPool.put(newBullet);
            // console.log("设置了对象池的大小");
        }
    }

    //获取子弹对象池对象
    protected BulletPoolGet() {
        let bullet = null
        //剩余的
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get()
        } else {
            bullet = cc.instantiate(this.preBullet)
        }
        this.node.addChild(bullet, 5)
        return bullet
        //TODO初始化子弹
    }

    //放回子弹对象池对象
    public BulletPoolPutback(bullet) {
        //参数为节点
        this.bulletPool.put(bullet)
        // console.log(this.bulletPool.size())
    }

    //初始化敌人的对象池
    protected EnemyPoolBuild() {
        //实例化然后放进去
        let n = 5
        for (let i = 0; i < n; i++) {
            let enemyNew = cc.instantiate(this.preEnemy)
            this.enemyPool.put(enemyNew)
        }
    }

    // 获取对象池对象
    protected GetEnemyPool() {
        let enemy
        //如果没有对象时，需要重新实例化，添加进去
        if (this.enemyPool.size() <= 0) {
            enemy = cc.instantiate(this.preEnemy)
            this.enemyPool.put(enemy)
        }
        enemy = this.enemyPool.get()
        this.node.addChild(enemy, 5)
        return enemy
    }

    //回放敌人到对象池
    public PutBackEnemyPool(enemy) {
        this.enemyPool.put(enemy)
        // console.log(this.enemyPool.size())
    }
    //END
}
