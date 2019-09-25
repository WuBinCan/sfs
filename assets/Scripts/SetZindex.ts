const { ccclass, property } = cc._decorator

@ccclass
export default class SetZindex extends cc.Component {

    @property(cc.Node)
    private rocker: cc.Node = null
    @property(cc.Node)
    private end: cc.Node = null
    // @property(cc.Node)
    // private hardRank: cc.Node = null
    // @property(cc.Node)
    // private earyRank: cc.Node = null

    //用于设定参次
    protected onLoad() {
        this.rocker.zIndex = 8
        this.node.zIndex = 7
        this.end.zIndex = 10
        // this.hardRank.zIndex = 10;
        // this.earyRank.zIndex = 10;
    }

    //END
}
