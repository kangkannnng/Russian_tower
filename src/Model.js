var ModelLayer = cc.Layer.extend({
    size:null,
    ctor:function(){
        this._super();
        this.size = cc.director.getWinSize();
        var bgSprite = new cc.Sprite(res.bg);
        bgSprite.attr({
            x:this.size.width/2,
            y:this.size.height/2,
            scale:0.5
        });
        this.addChild(bgSprite);

        var title_model = new cc.Sprite(res.mode_select);
        title_model.attr({
            x:this.size.width/2,
            y:this.size.height*3/4,
            scale:1
        });
        this.addChild(title_model);

        var easy = new Selection0(res.endless);
        easy.attr({
            x:this.size.width/2,
            y:this.size.height/2+50,
            key:0,
            scale: 0.8
        });
        this.addChild(easy);

        var medium = new Selection0(res.limited);
        medium.attr({
            x:this.size.width/2,
            y:this.size.height*3/8+50,
            scale:0.8,
            key:1
            });
        this.addChild(medium);

        var hard = new Selection0(res.challenge);
        hard.attr({
            x:this.size.width/2,
            y:this.size.height/4+50,
            scale:0.8,
            key:2
            });
        this.addChild(hard);

        var back = new Selection0(res.back);
        back.attr({
            x: this.size.width/8,
            y: this.size.height/8,
            scale: 0.8,
            key: 3
        });
        this.addChild(back);
    }
});

var ModelScene = cc.Scene.extend({
    onEnter:function(){
      this._super();
      this.layer = new ModelLayer();
      this.addChild(this.layer);
    },
})

var Selection0 = cc.Sprite.extend({
    key:0,
    onEnter:function(){
      this._super();
      this.addTouchListener();
    },

    onTouch:function(){
        if (this.key == 0){
            config.deadRule = 1;
            cc.director.runScene(new GameScene());
        }else if(this.key == 1){
            config.deadRule = 3;
            cc.director.runScene(new GameScene());
        }else if(this.key == 2){
            config.deadRule = 2;
            cc.director.runScene(new GameScene());
        }else if(this.key == 3){
            cc.director.runScene(new HomeScene());
        }else{
            console.log("null");
        }
    },
    addTouchListener:function(){
        this.touchListener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch,event){
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();
                if(cc.rectContainsPoint(target.getBoundingBox(),pos)){
                    target.onTouch();
                    return true;
                }
                return false;
            }
        });
        cc.eventManager.addListener(this.touchListener,this);
    }
})