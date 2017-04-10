cc.Class({
    extends: cc.Component,

    properties: {
       _currentTouch: null,
       _currentPick: null,
       _sensorOffsetValue: null,
       _sensor:null,
    },

    
    onLoad() {
        this._sensor = this.getComponent(cc.BoxCollider);
        this.node.parent.on('direction',this.onDirection,this);
        this._sensorOffsetValue = Math.abs(this._sensor.offset.x + this._sensor.offset.y);
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.systemEvent.on('keyup',this.onKeyUp,this);
    },

    onKeyUp(e){
        switch(e.keyCode){
            case cc.KEY.j: this.onPickOrDrop();break;
        }
    },

    onPickOrDrop(){
        if(this._currentPick){
            //check drop-able
            //drop
            this._currentPick.getComponent('pick-able-script').onDrop(this);
        }else if(this._currentTouch){
            //pick 
            this._currentTouch.getComponent('pick-able-script').onPick(this);
        }
    },

    onDirection(e){
        switch(e.detail){
            case 'left': this._sensor.offset = cc.v2(-this._sensorOffsetValue,0);break;
            case 'right': this._sensor.offset = cc.v2(this._sensorOffsetValue,0);break;
            case 'up': this._sensor.offset = cc.v2(0,this._sensorOffsetValue);break;
            case 'down': this._sensor.offset = cc.v2(0,-this._sensorOffsetValue);break;
        }
    },

    onCollisionEnter(other,self){
        if(this._currentPick){return;}
        if(other.node.group == 'pick-able' && other.node != this._currentPick){
            if(this._currentTouch){
                this._currentTouch.color = cc.Color.WHITE;
            }
            this._currentTouch = other.node;
            other.node.color = cc.Color.GREEN;
        }

    },

    onCollisionExit(other,self){
        if(this._currentPick){return;}
        if(other.node.group == 'pick-able' && other.node != this._currentPick){
            if(this._currentTouch == other.node){
                this._currentTouch = null;
                other.node.color = cc.Color.WHITE;
            }
        }
    }

   
});
