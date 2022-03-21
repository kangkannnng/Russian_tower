var HomebaseLayer = cc.Layer.extend({
    size:null,
    ctor:function(){
        this._super();
        this.size = cc.director.getWinSize();
        var bgSprite_home = new cc.Sprite(res.bg);
        bgSprite_home.attr({
            x:this.size.width/2,
            y:this.size.height/2,
            scale:0.5
        });
        this.addChild(bgSprite_home);

        var ad_home = new Selection_home(res.ad); // ad pic
        ad_home.attr({
            x:this.size.width/2,
            y:this.size.height*7/8,
            scale:1,
            key: 4
        });
        this.addChild(ad_home);

        var title_home = new cc.Sprite(res.russiantower); // title pic
        title_home.attr({
            x:this.size.width/2-10,
            y:this.size.height*9/16,
            scale:0.25
        });
        this.addChild(title_home);

        var s0_home = new Selection_home(res.start);      // start game button
        s0_home.father = this;
        s0_home.attr({
            x:this.size.width/2,
            y:this.size.height*9/32,
            scale: 0.8,
            key:0
        });
        this.addChild(s0_home);

        var s1_home = new Selection_home(res.rank);       // rank button
        s1_home.father = this;
        s1_home.attr({
            x:this.size.width*5/8,
            y:this.size.height/8,
            scale:0.8,
            key:1
        });
        this.addChild(s1_home);

        var s2_home = new Selection_home(res.voice_on);       // voice button
        s2_home.father = this;
        s2_home.attr({
            x:this.size.width*3/8,
            y:this.size.height/8,
            scale:1,
            key:2,
            on: true
        });
        this.addChild(s2_home);

        var s3_home = new Selection_home(res.share);       // share button
        s3_home.father = this;
        s3_home.attr({
            x:this.size.width*7/8,
            y:this.size.height/8,
            scale:0.8,
            key:3
        });
        this.addChild(s3_home);

        var back_home = new Selection_home(res.back);      // back button
        back_home.attr({
            x: this.size.width/8,
            y: this.size.height/8,
            scale: 0.8,
            key: 5
        });
        this.addChild(back_home);

    }
});

var HomeScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        cc.audioEngine.playMusic(res.bgm, true);
        this.layer = new HomebaseLayer();
        this.layer.father=this;
        this.addChild(this.layer);
        this.shbox = new ShareDialogueBox();
        this.addChild(this.shbox);
        this.rkbox = new RankDialogueBox();
        this.addChild(this.rkbox);
    },
})

var Selection_home = cc.Sprite.extend({
    key:0,
    onEnter:function(){
        this._super();
        this.addTouchListener();
    },

    onTouch:function(){
        if (this.key == 0){
            cc.director.runScene(new ModelScene());
        }else if(this.key == 1){
            this.father.father.rkbox.popup();
        }else if(this.key == 2 && this.on){
            cc.audioEngine.pauseMusic();
            this.setTexture(res.voice_off);
            this.on = false;
        }else if(this.key == 2 && !this.on){
            cc.audioEngine.resumeMusic();
            this.setTexture(res.voice_on);
            this.on = true;
        }else if(this.key == 3){
            this.father.father.shbox.popup();
        }else if(this.key == 4){
            window.location.href = "https://www.nudt.edu.cn/";
        }else if(this.key == 5){
            cc.director.runScene(new LoginScene());
        }
        else{
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

var ShareDialogueBox = cc.LayerColor.extend({
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
        var shdialog = new cc.Scale9Sprite(res.modelwin);
        shdialog.attr({
            x : winSize.width / 2, 
            y: winSize.height / 2+20
        });
        this.addChild(shdialog, 0, 101);

        var link = new cc.LabelTTF("Game Link", "Arial", 36); 
        link.setPosition(cc.p(shdialog.width/2 , shdialog.height / 2));
        shdialog.addChild(link);

        var shOKLabel = new cc.Sprite(res.copy);
        shOKLabel.setScale(1.2);
        var shOKMenuItem = new cc.MenuItemLabel(shOKLabel, this.copy, this);
        shOKMenuItem.setPosition(cc.p(250, -150));
 
        var shcancelLabel = new cc.Sprite(res.x);
        shcancelLabel.setScale(1.2);
        var shcancelMenuItem = new cc.MenuItemLabel(shcancelLabel, this.hidden, this);
        shcancelMenuItem.setPosition(cc.p(275, 160));
 
        var shmenu = new cc.Menu(shOKMenuItem, shcancelMenuItem);
        shmenu.setPosition(cc.p(shdialog.width/2 , shdialog.height / 2));
        shdialog.addChild(shmenu);
        this.setVisible(false);
    },
    copy: function(){
        let input = "localhost: 5000";        // game link
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt';
        const selection = getSelection();
        let originalRange;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;
 
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {}
        document.body.removeChild(el);
        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
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
    hidden: function()
    {
        this.setVisible(false);
        this._listener.setSwallowTouches(false);
    },
    onExit: function()
    {
        this._super();
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE, true);
    }
});

var RankDialogueBox = cc.LayerColor.extend({
    _listener: null,
    text: "  Player          Score\n",
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
        var rkdialog = new cc.Scale9Sprite(res.modelwin);
        rkdialog.attr({
            x : winSize.width / 2,
            y: winSize.height / 2+20
        });
        this.addChild(rkdialog, 0, 101);

        var rkcancelLabel = new cc.Sprite(res.x);
        rkcancelLabel.setScaleX(1.2);
        rkcancelLabel.setScaleY(0.6);
        var rkcancelMenuItem = new cc.MenuItemLabel(rkcancelLabel, this.hidden, this);
        rkcancelMenuItem.setPosition(cc.p(275, 180));

        var mode0 = new cc.Sprite(res.endless);
        mode0.setScaleX(1.2);
        mode0.setScaleY(0.6);
        var mode0MenuItem = new cc.MenuItemLabel(mode0, this.mode0, this);
        mode0MenuItem.setPosition(cc.p(-20, 125));
        mode0MenuItem.setTag(000);

        var mode1 = new cc.Sprite(res.limited);
        mode1.setScaleX(1.2);
        mode1.setScaleY(0.6);
        var mode1MenuItem = new cc.MenuItemLabel(mode1, this.mode1, this);
        mode1MenuItem.setPosition(cc.p(-20, 25));
        mode1MenuItem.setTag(111);

        var mode2 = new cc.Sprite(res.challenge);
        mode2.setScaleX(1.2);
        mode2.setScaleY(0.6);
        var mode2MenuItem = new cc.MenuItemLabel(mode2, this.mode2, this);
        mode2MenuItem.setPosition(cc.p(-20, -75));
        mode2MenuItem.setTag(222);

        var rkback = new cc.Sprite(res.back);
        rkback.setScaleY(0.5);
        var rkbackMenuItem = new cc.MenuItemLabel(rkback, this.back, this);
        rkbackMenuItem.setPosition(cc.p(-220,-160));
        rkbackMenuItem.setTag(333);
        rkbackMenuItem.setVisible(false);

        var rkmenu = new cc.Menu(rkcancelMenuItem, mode0MenuItem, mode1MenuItem, mode2MenuItem, rkbackMenuItem);
        rkmenu.setPosition(cc.p(rkdialog.width/2 , rkdialog.height/2));
        rkdialog.addChild(rkmenu, 0, 102);
 
        var rankLabel = new cc.LabelTTF("", "Arial", 48, cc.TEXT_ALIGNMENT_LEFT);
        rankLabel.setFontFillColor(cc.color.WHITE);
        rankLabel.setPosition(cc.p(rkdialog.width/2 , rkdialog.height / 2))
        rankLabel.setScaleY(0.5);
        rkdialog.addChild(rankLabel, 0, 103);
        rankLabel.setVisible(false);
        
        this.setVisible(false);
    },
    mode0: function(){
        var rankLabel = this.getChildByTag(101).getChildByTag(103);
        let Rank = (data, rank) => {
            for (let i in data) {
                let player = `${data[i]["玩家名"]}`;
                this.text += `${parseInt(i) + 1}:` + player;
                for (j=0; j<=(16-player.length); j++)
                    this.text += " ";
                this.text += `${data[i]["分数"]}\n`;
            }
            rank.setString(this.text);
        }
        Fetch("http://127.0.0.1:81/rank.php", "mode=1", Rank, function(){}, rankLabel);
        this.rk2();
    },
    mode1: function(){
        var rankLabel = this.getChildByTag(101).getChildByTag(103);
        let Rank = (data, rank) => {
            for (let i in data) {
                let player = `${data[i]["玩家名"]}`;
                this.text += `${parseInt(i) + 1}:` + player;
                for (j=0; j<=(16-player.length); j++)
                    this.text += " ";
                this.text += `${data[i]["分数"]}\n`;
            }
            rank.setString(this.text);
        }
        Fetch("http://127.0.0.1:81/rank.php", "mode=2", Rank, function(){}, rankLabel);
        this.rk2();
    },
    mode2: function(){
        var rankLabel = this.getChildByTag(101).getChildByTag(103);
        let Rank = (data, rank) => {
            for (let i in data) {
                let player = `${data[i]["玩家名"]}`;
                this.text += `${parseInt(i) + 1}:` + player;
                for (j=0; j<=(16-player.length); j++)
                    this.text += " ";
                this.text += `${data[i]["分数"]}\n`;
            }
            rank.setString(this.text);
        }
        Fetch("http://127.0.0.1:81/rank.php", "mode=3", Rank, function(){}, rankLabel);
        this.rk2();
    },
    back: function(){
        this.rk1();
    },
    popup: function()
    {
        this.setVisible(true);
        this._listener.setSwallowTouches(true);
        var rkdialog = this.getChildByTag(101);
        rkdialog.setScale(0.5);
        var scaleTo = new cc.ScaleTo(1, 0.5, 1);
        var rotateBy = new cc.RotateBy(1, 360, 0);
        var spawn = new cc.Spawn(scaleTo, rotateBy);
        rkdialog.runAction(spawn);
        this.rk1();
    },
    hidden: function()
    {
        this.setVisible(false);
        this._listener.setSwallowTouches(false);
    },
    rk1: function(){
        this.text = "  Player          Score\n";
        var rkdialog = this.getChildByTag(101);
        var rkmenu = rkdialog.getChildByTag(102);
        var mode0 = rkmenu.getChildByTag(000);
        var mode1 = rkmenu.getChildByTag(111);
        var mode2 = rkmenu.getChildByTag(222);
        var rkback = rkmenu.getChildByTag(333);
        var rankLabel = rkdialog.getChildByTag(103);
        rkback.setVisible(false);
        mode0.setVisible(true);
        mode1.setVisible(true);
        mode2.setVisible(true);
        rankLabel.setVisible(false);
    },
    rk2: function(){
        var rkdialog = this.getChildByTag(101);
        var rkmenu = rkdialog.getChildByTag(102);
        var mode0 = rkmenu.getChildByTag(000);
        var mode1 = rkmenu.getChildByTag(111);
        var mode2 = rkmenu.getChildByTag(222);
        var rkback = rkmenu.getChildByTag(333);
        var rankLabel = rkdialog.getChildByTag(103);
        rkback.setVisible(true);
        mode0.setVisible(false);
        mode1.setVisible(false);
        mode2.setVisible(false);
        rankLabel.setVisible(true);
    },
    onExit: function()
    {
        this._super();
        cc.eventManager.removeListeners(cc.EventListener.TOUCH_ONE_BY_ONE, true);
    }
});