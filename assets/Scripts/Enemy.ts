import { Game } from "./Game"

const { ccclass, property } = cc._decorator

@ccclass
export class Enemy extends cc.Component {

    @property(cc.Integer)
    private ySpeed: number = 0
    private animationDie: cc.Animation = null

    protected onLoad() {
        //获取animation组件
        this.animationDie = this.getComponent(cc.Animation)
    }

    protected update(dt) {
        this.node.y -= this.ySpeed * dt
        //游戏结束，自动删除自己，但是暂停了，可以动吗？
        if (Game.instance.stateGame == 0) {
            this.node.destroy()
        }
        //控制边界,超出后消失
        if (this.node.y <= -this.node.parent.height / 2) {
            // this.node.destroy()
            this.Disappear()
        }
    }

    //死亡方法
    public Die() {
        //需要等到动画播放完然后死亡
        this.animationDie.play('enenmDie')
    }

    //执行帧动画，在动画最后执行，放在动画最后一帧
    public Disappear() {
        //不死亡
        // this.node.destroy()
        //回池
        this.GoBackEnemyPool()
    }

    //出了边界需要回对象池，与子弹碰撞也是
    protected GoBackEnemyPool() {
        Game.instance.PutBackEnemyPool(this.node)
    }

    //END
}
