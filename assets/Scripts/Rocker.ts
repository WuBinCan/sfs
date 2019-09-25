import { Game } from "./Game"
import { Player } from './Player'

const { ccclass, property } = cc._decorator

@ccclass
export class Rocker extends cc.Component {

    static instance: Rocker

    //摇杆内环
    @property(cc.Button)
    private rockerIn: cc.Button = null
    //摇杆外环
    @property(cc.Node)
    private rockerOut: cc.Node = null
    //摇杆控制距离
    @property(cc.Integer)
    private disMax: number = 0

    protected onLoad() {
        Rocker.instance = this
        this.rockerIn.node.on(cc.Node.EventType.TOUCH_MOVE, this.RockerMove, this)
        this.rockerIn.node.on(cc.Node.EventType.TOUCH_END, this.RockerEnd, this)
        this.rockerIn.node.on(cc.Node.EventType.TOUCH_CANCEL, this.RockerCancel, this)
    }

    protected onDestroy() {
        Rocker.instance = null
    }

    //跟随鼠标移动
    private RockerMove(event) {
        //获取鼠标当前位置，获取的是UI屏幕坐标
        let posMouse = new cc.Vec2(event.getLocationX(), event.getLocationY())
        //转换坐标,相对于摇杆位置为0，0，目标位置
        let posX = posMouse.x - Game.instance.node.width / 2 - this.rockerIn.node.parent.position.x
        let posY = posMouse.y - Game.instance.node.height / 2 - this.rockerIn.node.parent.position.y
        let targetPos = new cc.Vec2(posX, posY)
        //范围内，位置
        let posY0 = 0
        let posX0 = 0
        if (cc.pDistance(this.rockerOut.position, targetPos) >= this.disMax) {
            //超出范围移动
            posY0 = posY * this.disMax / (Math.sqrt(posX * posX + posY * posY))
            posX0 = posX * this.disMax / (Math.sqrt(posX * posX + posY * posY))
            targetPos = new cc.Vec2(posX0, posY0)
            this.rockerIn.node.position = targetPos
            //还是可以控制
            //更改速度
            Player.instance.xSpeed = Player.instance.maxMoveSpeed * posX0 / this.disMax
            Player.instance.ySpeed = Player.instance.maxMoveSpeed * posY0 / this.disMax
        } else {
            this.rockerIn.node.position = targetPos
            //更改速度
            Player.instance.xSpeed = Player.instance.maxMoveSpeed * posX / this.disMax
            Player.instance.ySpeed = Player.instance.maxMoveSpeed * posY / this.disMax
        }
        //设置加速度
        this.SetAccel()
    }

    //范围内松手
    private RockerEnd(event) {
        this.rockerIn.node.x = this.rockerOut.x
        this.rockerIn.node.y = this.rockerOut.y
        this.CancelAccel()
    }

    //范围外松手
    private RockerCancel(event) {
        this.rockerIn.node.x = this.rockerOut.x
        this.rockerIn.node.y = this.rockerOut.y
        this.CancelAccel()
    }

    //设置Player的属性，因为要在摇杆事件触发所以就在这里设置player的属性
    private SetAccel() {
        this.IfMoveUP()
        this.IfMoveDown()
        this.IfMoveLeft()
        this.IfMoveRight()
    }

    //释放按钮
    private CancelAccel() {
        Player.instance.accUp = false
        Player.instance.accDown = false
        Player.instance.accLeft = false
        Player.instance.accRight = false
    }

    private IfMoveUP() {
        if (this.rockerIn.node.y > this.rockerOut.y) {
            Player.instance.accUp = true
            Player.instance.accDown = false
        }
    }

    private IfMoveDown() {
        if (this.rockerIn.node.y < this.rockerOut.y) {
            Player.instance.accUp = false
            Player.instance.accDown = true
        }
    }

    private IfMoveLeft() {
        if (this.rockerIn.node.x < this.rockerOut.x) {
            Player.instance.accLeft = true
            Player.instance.accRight = false
        }
    }

    private IfMoveRight() {
        if (this.rockerIn.node.x > this.rockerOut.x) {
            Player.instance.accLeft = false
            Player.instance.accRight = true
        }
    }

    //END
}
