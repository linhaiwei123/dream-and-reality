cc.Class({
    extends: cc.Component,

    properties: {
        _anim: null,
        speedValue: 5,
        _directionArray: null,
        _moveNum: 0,

        _up: false,
        _down: false,
        _left: false,
        _right: false,

        _leftBlock: 0,
        _rightBlock: 0,
        _upBlock: 0,
        _downBlock: 0,
        _initCanvasZ:null,
    },

    onLoad() {
        let canvas = cc.find('Canvas');
        this._initCanvasZ = canvas.height * canvas.anchorY;
        this._directionArray = ['left','right','up','down'];
        this._speed = cc.v2();
        this._anim = this.getComponent(cc.Animation);
        cc.systemEvent.on('keydown',this.onKeyDown,this);
        cc.systemEvent.on('keyup',this.onKeyUp,this);

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //this.node.on('position-changed',this.onPositionChanged,this)
    },

    //onPositionChanged(){
        //this.node.zIndex = this.node.y + this._initCanvasZ;
    //},

    onCollisionEnter(other,self){
        if(other.node.group == 'wall'){
            let selfAabb = self.world.aabb;
            let selfPreAabb = self.world.preAabb;
            let otherAabb = other.world.aabb;
            let otherPreAabb = other.world.preAabb;

            let localArray = [];
            if(selfPreAabb.xMin > otherPreAabb.xMax && selfAabb.xMin <= otherAabb.xMax){
                //leftBlock
                this._leftBlock++;
                localArray.push('_leftBlock');
                this.node.x += Math.abs(selfAabb.xMin - otherPreAabb.xMax);
            }
            if(selfPreAabb.xMax < otherPreAabb.xMin && selfAabb.xMax >= otherAabb.xMin){
                //rightBlock
                this._rightBlock++;
                localArray.push('_rightBlock');
                this.node.x -= Math.abs(selfAabb.xMax - otherPreAabb.xMin);
            }
            if(selfPreAabb.yMax < otherPreAabb.yMin && selfAabb.yMax >= otherAabb.yMin){
                //upBlock
                this._upBlock++;
                localArray.push('_upBlock');
                this.node.y -= Math.abs(selfAabb.yMax - otherPreAabb.yMin);
            }
            if(selfPreAabb.yMin > otherPreAabb.yMax && selfAabb.yMin <= otherAabb.yMax){
                //downBlock
                this._downBlock++;
                localArray.push('_downBlock');
                this.node.y += Math.abs(selfAabb.yMin - otherPreAabb.yMax);
            }
            if(other.blockArray == undefined){
                other.blockArray = [];
            }
            other.blockArray[self.uuid] = localArray;
        }
    },

    onCollisionExit(other,self){
        if(other.node.group == 'wall'){
            if(other.blockArray && other.blockArray[self.uuid] != undefined){
                for(let item of other.blockArray[self.uuid]){
                    this[item]--;
                }
                delete other.blockArray[self.uuid];
            }
        }
    },

    onKeyDown(e){
        switch(e.keyCode){
            case cc.KEY.w : if(!this._up){this._up = true;this.orderDirectionArray('up',false);this._moveNum++;this.updateAnim()}break;
            case cc.KEY.s : if(!this._down){this._down = true;this.orderDirectionArray('down',false);this._moveNum++;this.updateAnim()}break;
            case cc.KEY.a : if(!this._left){this._left = true;this.orderDirectionArray('left',false);this._moveNum++;this.updateAnim()}break;
            case cc.KEY.d : if(!this._right){this._right = true;this.orderDirectionArray('right',false);this._moveNum++;this.updateAnim()}break;
        }
    },

    onKeyUp(e){
        switch(e.keyCode){
            case cc.KEY.w : this._up = false;this._moveNum--;this.orderDirectionArray('up',true);this.updateAnim();break;
            case cc.KEY.s : this._down = false;this._moveNum--;this.orderDirectionArray('down',true);this.updateAnim();break;
            case cc.KEY.a : this._left = false;this._moveNum--;this.orderDirectionArray('left',true);this.updateAnim();break;
            case cc.KEY.d : this._right = false;this._moveNum--;this.orderDirectionArray('right',true);this.updateAnim();break;
        }
    },

    orderDirectionArray(direction,reverse){
        let item = this._directionArray.splice(this._directionArray.indexOf(direction),1)[0];
        if(!reverse){
            this._directionArray.unshift(item);
        }else{
            this._directionArray.push(item);
        }
    },

    updateAnim(){
        if(!!this._moveNum){
            let direction = this._directionArray[0];
            this._anim.play('player-move-' + direction);
            this.node.emit('direction',direction);
        }else{
            let direction = this._directionArray[3];
            this._anim.play('player-idle-' + direction);
            this.node.emit('direction',direction);
        }
    },


    update(dt){
       if(!!this._moveNum){
           let direction = this._directionArray[0];
           switch(direction){
               case 'left': if(!this._leftBlock){this.node.x -=this.speedValue;}break;
               case 'right': if(!this._rightBlock){this.node.x +=this.speedValue;}break;
               case 'up': if(!this._upBlock){this.node.y +=this.speedValue;}break;
               case 'down': if(!this._downBlock){this.node.y -=this.speedValue;}break;
           }
       }
    }



});
