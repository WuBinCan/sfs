import { ClaSound } from './Sound'

const { ccclass, property } = cc._decorator

@ccclass
export class SetMenu extends cc.Component {

    //动画帧事件
    //设置面板移动到最后
    public MoveMenuEnd() {
        cc.director.pause()
        ClaSound.instance.AudioPause()
    }

    //设置按钮回退
    public BackMenuEnd() {
        ClaSound.instance.AudioResume()
    }
    //END
}
