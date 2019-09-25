import { Game } from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export class Bullet extends cc.Component {

    //子弹速度
    @property(cc.Integer)
    private ySpeed: number = 0

    //与其他物体碰撞，打开了碰撞器，并且层次直接可以碰撞
    protected onCollisionEnter(other, self) {
        if (other.node.group == 'enemy') {
            Game.instance.GetScore()
            other.node.getComponent('Enemy').Die()
            // this.node.destroy()
            Game.instance.BulletPoolPutback(this.node);
        }
    }

    protected update(dt) {
        //移动
        this.node.y += this.ySpeed * dt
        //控制边界,超出后消失
        if (this.node.y >= this.node.parent.height / 2) {
            // this.node.destroy()
            Game.instance.BulletPoolPutback(this.node);

        }
        if (Game.instance.stateGame == 0) {
            // this.node.destroy()
            Game.instance.BulletPoolPutback(this.node);
        }
    }

    //END
}
