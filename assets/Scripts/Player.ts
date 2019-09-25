import { Game } from './Game'
import { ClaSound } from './Sound'

const { ccclass, property } = cc._decorator

@ccclass
export class Player extends cc.Component {

    static instance: Player

    //加速度
    @property(cc.Integer)
    private accel: number = 0
    @property(cc.Integer)
    public maxMoveSpeedY: number = 0
    @property(cc.Integer)
    public maxMoveSpeedX: number = 0
    @property(cc.Integer)
    public maxMoveSpeed: number = 0
    //速度
    public xSpeed: number = 0
    public ySpeed: number = 0
    //加速度方向
    public accLeft: boolean = false
    public accRight: boolean = false
    public accUp: boolean = false
    public accDown: boolean = false
    private animation: cc.Animation = null

    //初始化
    protected onLoad() {
        Player.instance = this
        //速度
        this.xSpeed = 0
        this.ySpeed = 0
        //加速度
        this.accLeft = false
        this.accRight = false
        this.accUp = false
        this.accDown = false
        //初始化按钮监听
        this.AddEventListeners()
        //加载主角动画
        this.animation = this.node.getComponent(cc.Animation)
        this.animation.play('playeridle').repeatCount = Infinity
    }

    protected onDestroy() {
        Player.instance = null
    }

    //添加事件
    private AddEventListeners() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.OnKeyDown, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.OnKeyUp, this)
    }

    //按钮按下
    private OnKeyDown(event: cc.Event.EventKeyboard) {
        //左右检测
        switch ((event as any).keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this.MoveLeft()
                break
            case cc.KEY.d:
            case cc.KEY.right:
                this.MoveRight()
                break
        }
        //上下检测
        switch ((event as any).keyCode) {
            case cc.KEY.w:
            case cc.KEY.up:
                this.MoveUp()
                break
            case cc.KEY.s:
            case cc.KEY.down:
                this.MoveDown()
                break
        }
    }

    //向左加速度
    private MoveLeft() {
        this.accLeft = true
        this.xSpeed = -this.maxMoveSpeedX
        this.accRight = false
    }

    //向右加速度
    private MoveRight() {
        this.accLeft = false
        this.accRight = true
        this.xSpeed = +this.maxMoveSpeedX
    }

    //向上加速度
    private MoveUp() {
        this.accUp = true
        this.ySpeed = +this.maxMoveSpeedY
        this.accDown = false
    }

    //向下加速度
    private MoveDown() {
        this.accDown = true
        this.ySpeed = -this.maxMoveSpeedY
        this.accUp = false
    }

    //按钮松开
    private OnKeyUp() {
        switch ((event as any).keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this.XstopMove()
                break
            case cc.KEY.d:
            case cc.KEY.right:
                this.XstopMove()
                break
            case cc.KEY.w:
            case cc.KEY.up:
                this.YstopMove()
                break
            case cc.KEY.s:
            case cc.KEY.down:
                this.YstopMove()
                break
        }
    }

    //停止运动的方法
    private XstopMove() {
        this.accLeft = false
        this.accRight = false
    }

    //停止上下运动
    private YstopMove() {
        this.accUp = false
        this.accDown = false
    }

    //检测碰撞
    protected onCollisionEnter(other, self) {
        if (other.node.group == 'enemy') {
            //删除
            other.node.destroy()
            //执行游戏结束
            Game.instance.Gameover()
            this.GameOver()
        }
    }

    //玩家死亡
    private GameOver() {
        ClaSound.instance.AudioPlayerDie()
        //死亡就不要暂停游戏了
        // cc.director.pause()
    }

    protected update(dt) {
        if (this.accDown == false && this.accUp == false) {
            this.ySpeed = 0
        }
        if (this.accLeft == false && this.accRight == false) {
            this.xSpeed = 0
        }
        //限制速度不能太大
        if (Math.abs(this.xSpeed) >= this.maxMoveSpeed) {
            this.xSpeed = this.xSpeed / Math.abs(this.xSpeed) * this.maxMoveSpeed
        }
        if (Math.abs(this.ySpeed) >= this.maxMoveSpeed) {
            this.ySpeed = this.ySpeed / Math.abs(this.ySpeed) * this.maxMoveSpeed
        }
        //改变位移
        this.node.x += this.xSpeed * dt
        this.node.y += this.ySpeed * dt
        //限制不能出屏幕
        if (this.node.x <= -this.node.parent.width / 2) {
            this.node.x = this.node.parent.width / 2
        }
        if (this.node.x > this.node.parent.width / 2) {
            this.node.x = -this.node.parent.width / 2
        }
        if (this.node.y >= this.node.parent.height / 2 - this.node.height / 2 - 15) {
            this.node.y = this.node.parent.height / 2 - this.node.height / 2 - 15
        }
        if (this.node.y <= -this.node.parent.height / 2 + this.node.height / 2) {
            this.node.y = -this.node.parent.height / 2 + this.node.height / 2
        }
    }

}
