const { ccclass, property } = cc._decorator

@ccclass
export class ButtonUI extends cc.Component {

    //开始按钮
    public ButStart() {
        cc.director.loadScene('game')
    }

    //退出按钮
    public ButQuit() {
        cc.game.end()
    }

    //END
}
