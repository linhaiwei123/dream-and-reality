cc.Class({
    extends: cc.Component,

    properties: {
        _block:0  
    },

    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },

    onCollisionEnter(other,self){
        if(other.node.group == 'wall'){
            this._block++;
            this.node.color = cc.Color.RED;
        }
    },

    onCollisionExit(other,self){
        if(other.node.group == 'wall'){
            this._block--;
            if(!this._block){
                this.node.color = cc.Color.GREEN;
            }
        }
    },

    onPick(pickDropControl){
        this.node.opacity = 140;
        pickDropControl._currentTouch = null;
        pickDropControl._currentPick = this.node;
        let targetPosition = pickDropControl.node.convertToNodeSpaceAR(this.node.parent.convertToWorldSpaceAR(this.node.position));
        this.node.parent = pickDropControl.node;
        this.node.position = targetPosition;
    },

    onDrop(pickDropControl){
        if(!!this._block){return;}
        this.node.opacity = 255;
        this.node.color = cc.Color.WHITE;
        pickDropControl._currentPick = null;
        //pickDropControl._currentTouch = this.node;
        let canvas = cc.find('Canvas');
        let targetPosition = canvas.convertToNodeSpaceAR(this.node.parent.convertToWorldSpaceAR(this.node.position));
        this.node.parent = canvas;
        this.node.position = targetPosition;
    }

});
