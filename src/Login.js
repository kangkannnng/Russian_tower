var ModalDialogueBox = cc.LayerColor.extend({
    _listener: null,
    ctor: function() {
        this._super(cc.color.BLACK);
        this.setOpacity(128);
        this._initDialog();

        return true;
    },
    onEnter: function()
    {
        this._super();
        this._listener = new cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch, event)
            {
                return true;
            }
        });
        cc.eventManager.addListener(this._listener, this);
    },
    _initDialog: function()
    {
        var winSize = cc.winSize;
        var dialog = new cc.Scale9Sprite(res.modelwin);
        dialog.attr({
            x : winSize.width / 2, 
            y: winSize.height / 2+20
        });
        this.addChild(dialog, 0, 101);
    
        var tmp = new cc.Scale9Sprite(res.textwin);
        tmp.setScaleX(0.6);
        tmp.setScaleY(0.5);
        tmp.setPosition(cc.p(150,80));
        account = new cc.EditBox(cc.size(350,100),  null);
        account.addChild(tmp);
        account.setPlaceHolder("Your account");
        account.setMaxLength(20);
        account.setPlaceholderFontSize(35);
        account.setFontSize(35);
        account.setPosition(cc.p(dialog.width / 2 , dialog.height / 2));
        dialog.addChild(account);

        var tmp1 = new cc.Scale9Sprite(res.textwin);
        tmp1.setScaleX(0.6);
        tmp1.setScaleY(0.5);
        tmp1.setPosition(cc.p(150,75));
        pwd = new cc.EditBox(cc.size(350,100), null);
        pwd.addChild(tmp1); 
        pwd.setPlaceHolder("Your password");
        pwd.setMaxLength(20);
        pwd.setPlaceholderFontSize(35);
        pwd.setFontSize(35);
        pwd.setPosition(cc.p(dialog.width / 2, dialog.height/2 - 150));
        pwd.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        dialog.addChild(pwd);

        var OKLabel = new cc.Sprite(res.v);
        OKLabel.setScale(1.2);
        var OKMenuItem = new cc.MenuItemLabel(OKLabel, this.start, this);
        OKMenuItem.setPosition(cc.p(275, -180));
 
        var cancelLabel = new cc.Sprite(res.x);
        cancelLabel.setScale(1.2);
        var cancelMenuItem = new cc.MenuItemLabel(cancelLabel, this.hidden, this);
        cancelMenuItem.setPosition(cc.p(275, 160));
 
        var menu = new cc.Menu(OKMenuItem, cancelMenuItem);
        menu.setPosition(cc.p(dialog.width/2 , dialog.height / 2));
        dialog.addChild(menu);
    
        tip = new cc.EditBox(cc.size(0,0), null);
        tip.setPlaceholderFontColor(cc.color.WHITE);
        tip.setPlaceHolder("");
        tip.setPlaceholderFontSize(35);
        tip.setPosition(cc.p(dialog.width / 2-80, dialog.height/2 + 150));
        dialog.addChild(tip);

        this.setVisible(false);
    },
    popup: function()
    {
        this.setVisible(true);
        this._listener.setSwallowTouches(true);
        var dialog = this.getChildByTag(101);
        dialog.setScale(0.5);
        var scaleTo = new cc.ScaleTo(1, 0.5, 0.5);
        var rotateBy = new cc.RotateBy(1, 360, 0);
        var spawn = new cc.Spawn(scaleTo, rotateBy);
        dialog.runAction(spawn);
    },
    start: function()
    {
        console.log(tip.getString());
        errorfn = function(){
            if (account.getString() === "") {
                tip.setPlaceHolder("ID不能为空");
                return false;
            }
            if (pwd.getString() === "") {
                tip.setPlaceHolder("密码不能为空");
                return false;
            }
            tip.setPlaceHolder("账号和密码不匹配");
            pwd.setString("");
            return false;
        };
        let fn = (data) => { 
            localStorage.token = data["token"];
            tip.setPlaceHolder("");
            this.setVisible(false);
            this._listener.setSwallowTouches(false);
            cc.director.runScene(new HomeScene());
        }
        Fetch("http://127.0.0.1:81/login.php", "id="+account.getString()+"&password="+pwd.getString(),
                fn, errorfn);
    },
    hidden: function()
    {
        this.setVisible(false);
        this._listener.setSwallowTouches(false);
        account.setString("");
        pwd.setString("");
    },
    onExit: function()
    {
        this._super();
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE, true);
    }
});


var SignDialogueBox = cc.LayerColor.extend({
    _listener: null,
    ctor: function() {
        this._super(cc.color.BLACK);
        this.setOpacity(128);
        this._initDialog();

        return true;
    },
    onEnter: function()
    {
        this._super();
        this._listener = new cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch, event)
            {
                return true;
            }
        });
        cc.eventManager.addListener(this._listener, this);
    },
    _initDialog: function()
    {
        var winSize = cc.winSize;
        var dialog0 = new cc.Scale9Sprite(res.modelwin);
        dialog0.attr({
            x : winSize.width / 2, 
            y: winSize.height / 2+20
        });
        this.addChild(dialog0, 0, 101);
        
        var tmp0 = new cc.Scale9Sprite(res.textwin);
        tmp0.setScaleX(0.6);
        tmp0.setScaleY(0.5);
        tmp0.setPosition(cc.p(150,80));
        account0 = new cc.EditBox(cc.size(350,100),  null);
        account0.addChild(tmp0);
        account0.setPlaceHolder("Your account");
        account0.setMaxLength(20);
        account0.setPlaceholderFontSize(35);
        account0.setFontSize(35);
        account0.setPosition(cc.p(dialog0.width / 2 , dialog0.height / 2));
        dialog0.addChild(account0);

        var tmp2 = new cc.Scale9Sprite(res.textwin);
        tmp2.setScaleX(0.6);
        tmp2.setScaleY(0.5);
        tmp2.setPosition(cc.p(150,75));
        pwd0 = new cc.EditBox(cc.size(350,100), null);
        pwd0.addChild(tmp2); 
        pwd0.setPlaceHolder("Your password");
        pwd0.setMaxLength(20);
        pwd0.setPlaceholderFontSize(35);
        pwd0.setFontSize(35);
        pwd0.setPosition(cc.p(dialog0.width / 2, dialog0.height/2 - 150));
        pwd0.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        dialog0.addChild(pwd0);

        var OKLabel0 = new cc.Sprite(res.v);
        OKLabel0.setScale(1.2);
        var OKMenuItem0 = new cc.MenuItemLabel(OKLabel0, this.start, this);
        OKMenuItem0.setPosition(cc.p(275, -180));
 
        var cancelLabel0 = new cc.Sprite(res.x);
        cancelLabel0.setScale(1.2);
        var cancelMenuItem0 = new cc.MenuItemLabel(cancelLabel0, this.hidden, this);
        cancelMenuItem0.setPosition(cc.p(275, 160));
 
        var menu0 = new cc.Menu(OKMenuItem0, cancelMenuItem0);
        menu0.setPosition(cc.p(dialog0.width/2 , dialog0.height / 2));
        dialog0.addChild(menu0);

        tip0 = new cc.EditBox(cc.size(0,0), null);
        tip0.setPlaceholderFontColor(cc.color.WHITE);
        tip0.setPlaceHolder("");
        tip0.setPlaceholderFontSize(35);
        tip0.setPosition(cc.p(dialog0.width / 2-80, dialog0.height/2 + 150));
        dialog0.addChild(tip0);

        this.setVisible(false);
    },
    popup: function()
    {
        this.setVisible(true);
        this._listener.setSwallowTouches(true);
        var dialog = this.getChildByTag(101);
        dialog.setScale(0.5);
        var scaleTo = new cc.ScaleTo(1, 0.5, 0.5);
        var rotateBy = new cc.RotateBy(1, 360, 0);
        var spawn = new cc.Spawn(scaleTo, rotateBy);
        dialog.runAction(spawn);
    },
    start: function()
    {
        errorfn0 = function(){
            tip0.setPlaceHolder("用户已存在");
            account0.setString("");
        };
        let fn0 = (data) => { 
            this.setVisible(false);
            this._listener.setSwallowTouches(false);
            account0.setString("");
            pwd0.setString("");
        }
        let Reg = /([-_a-zA-Z0-9])$/;
        if (account0.getString() === "") {
            tip0.setPlaceHolder("ID不能为空");
            return false;
        }
        if (pwd0.getString() === "") {
            tip0.setPlaceHolder("密码不能为空");
            return false;
        }
        if (!Reg.test(pwd0.getString())) {
            tip0.setPlaceHolder("密码只能包含英文字母、数字和下划线");
            return false;
        }
        Fetch("http://127.0.0.1:81/register.php", "id="+account0.getString()+"&password="+pwd0.getString(),
            fn0 , errorfn0);
    },
    hidden: function()
    {
        this.setVisible(false);
        this._listener.setSwallowTouches(false);
        account0.setString("");
        pwd0.setString("");
    },
    onExit: function()
    {
        this._super();
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE, true);
    }
});

var MenuLayer = cc.Layer.extend({
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

        var title = new cc.Sprite(res.russiantower);
        title.attr({
            x:this.size.width/2-10,
            y:this.size.height/3*2,
            scale:0.25
        });
        this.addChild(title);

        var s0 = new Selection(res.login);      // login button
        s0.father = this;
        s0.attr({
            x:this.size.width/2,
            y:this.size.height/3,
            key:0,
            scale: 0.8
        });
        this.addChild(s0);

        var s1 = new Selection(res.signup);       // sign button
        s1.father = this;
        s1.attr({
            x:this.size.width/2,
            y:this.size.height/6,
            scale:0.8,
            key:1
            });
        this.addChild(s1);
    }
});

var LoginScene = cc.Scene.extend({
    onEnter:function(){
      this._super();
      this.layer = new MenuLayer();
      this.layer.father=this;
      this.addChild(this.layer);
      this.box = new ModalDialogueBox();
      this.addChild(this.box);
      this.sbox = new SignDialogueBox();
      this.addChild(this.sbox);
    },
})

var Selection = cc.Sprite.extend({
    key:0,
    onEnter:function(){
      this._super();
      this.addTouchListener();
    },

    onTouch:function(){
        if (this.key == 0){
            console.log("0");
            this.father.father.box.popup();
        }else if(this.key == 1){
            console.log("1");
            this.father.father.sbox.popup();
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