var SCREEN_WIDTH = 680
  , SCREEN_HEIGHT = 960
  , SCREEN_CENTER_X = SCREEN_WIDTH / 2
  , SCREEN_CENTER_Y = SCREEN_HEIGHT / 2;

var PIECE_NUM_X    = 5
  , PIECE_NUM_Y    = 5
  , PIECE_NUM      = PIECE_NUM_X * PIECE_NUM_Y
  , PIECE_OFFSET_X = 90
  , PIECE_OFFSET_Y = 240
  , PIECE_WIDTH    = 120
  , PIECE_HEIGHT   = 120;

var FONT_FAMILY_FLAT = "'Helvetica-Light' 'Meiryo' sans-serif";

tm.main(function() {
  var app = tm.app.CanvasApp("#world");
  app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);

  app.fitWindow();
  app.background = "rgba(250, 250, 250, 1.0)";
  app.replaceScene( TitleScene() );

  app.run();
});

tm.define("GameScene", {
  superClass: "tm.app.Scene",

  init: function() {
    this.superInit();

    var self = this;
    self.currentNumber = 1;

    this.pieceGroup = tm.app.CanvasElement();
    this.addChild(this.pieceGroup);

    var nums = [].range(1, PIECE_NUM + 1);
    nums.shuffle();

    for (var i = 0; i < PIECE_NUM_Y; ++i) {
      for (var j = 0; j < PIECE_NUM_X; ++j) {
        var number = nums[i * PIECE_NUM_X + j];
        var piece = Piece(number).addChildTo(this.pieceGroup);
        piece.x = j * 125 + PIECE_OFFSET_X;
        piece.y = i * 125 + PIECE_OFFSET_Y;

        piece.onpointingstart = function() {
          if (this.number === self.currentNumber) {
            if (self.currentNumber === PIECE_NUM) {
              self.app.replaceScene(ResultScene({
                time: self.timerLabel.text
              }));
            }
            self.currentNumber += 1;
            this.disable();
          }
        };
      }
    }

    this.timerLabel = tm.app.Label("").addChildTo(this);
    this.timerLabel
        .setPosition(650, 160)
        .setFillStyle("#444")
        .setAlign("right")
        .setBaseline("bottom")
        .setFontFamily(FONT_FAMILY_FLAT)
        .setFontSize(128);

    var titleBtn = tm.app.FlatButton({
      width: 300,
      height: 100,
      text: "TITLE",
      bgColor: "#888"
    }).addChildTo(this);

    titleBtn.position.set(180, 880);
    titleBtn.onpointingend = function() { 
      self.app.replaceScene(TitleScene());
    };

    var restartBtn = tm.app.FlatButton({
      width: 300,
      height: 100,
      text: "RESTART",
      bgColor: "#888"
    }).addChildTo(this);
 
    restartBtn.position.set(500, 880);
    restartBtn.onpointingend = function() {
     self.app.replaceScene(GameScene());
    };
  },

  onenter: function(e) {
    e.app.pushScene(CountdownScene());
    this.onenter = null;
  },

  update: function(app) {
    var time = ((app.frame / app.fps) * 1000) | 0;
    var timeStr = time + "";
    this.timerLabel.text = timeStr.replace(/(\d)?=(\d\d\d)+$/g, "$1.");
  }
});

tm.define("Piece", {
  superClass: "tm.app.Shape",

  init: function(number) {
    this.superInit(PIECE_WIDTH, PIECE_HEIGHT);
    this.number = number;

    this.setInteractive(true);
    this.setBoundingType("rect");

    var angle = tm.util.Random.randint(0, 360);
    this.canvas.clearColor("hsl({0}, 80%, 70%)".format(angle));

    this.label = tm.app.Label(number).addChildTo(this);
    this.label
        .setFontSize(70)
        .setFontFamily(FONT_FAMILY_FLAT)
        .setAlign("center")
        .setBaseline("middle");
  },
  disable: function() {
    this.setInteractive(false);

    var self = this;
    this.tweener
        .clear()
        .to({scaleX: 0}, 100)
        .call(function() {
          self.canvas.clearColor("rgb(100, 100, 100)");
        }.bind(this))
        .to({scaleX: 1, alpha: 0.5}, 100);
  }
});

tm.define("CountdownScene", {
  superClass: "tm.app.Scene",

  init: function() {
    this.superInit();
    var self = this;

    var filter = tm.app.Shape(SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this)
    filter.origin.set(0, 0);
    filter.canvas.clearColor("rgba(250, 250, 250, 1.0)");

    var label = tm.app.Label(3).addChildTo(this);
    label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y)
         .setFillStyle("#888")
         .setFontFamily(FONT_FAMILY_FLAT)
         .setFontSize(512)
         .setAlign("center")
         .setBaseline("middle");

    label.tweener
         .set({
           scaleX: 0.5,
           scaleY: 0.5,
           text: 3
         })
         .scale(1)
         .set({
           scaleX: 0.5,
           scaleY: 0.5,
           text: 2
         })
         .scale(1)
         .set({
           scaleX: 0.5,
           scaleY: 0.5,
           text: 1
         })
         .scale(1)
         .call(function() {
           self.app.frame = 0;
           self.app.popScene();
         });
  }
});

tm.define("TitleScene", {
  superClass: "tm.app.Scene",

  init: function() {
    this.superInit();

    this.fromJSON({
      children: [ 
        {
          type: "Label", 
          name: "titleLabel",
          text: "FlaTM Touch",
          x: SCREEN_CENTER_X,
          y: 200,
          fillStyle: "#444",
          fontSize: 60,
          fontFamily: FONT_FAMILY_FLAT,
          align: "center",
          baseline: "middle"
        },
        {
          type: "Label",
          name: "nextLabel",
          text: "TOUCH START",
          x: SCREEN_CENTER_X,
          y: 650,
          fillStyle: "#444",
          fontSize: 26,
          fontFamily: FONT_FAMILY_FLAT,
          align: "center",
          baseline: "middle"
        }
      ]
    });

    this.nextLabel.tweener
        .fadeOut(500)
        .fadeIn(1000)
        .setLoop(true);

   },

   onpointingstart: function() {
     this.app.replaceScene(GameScene());
   }
});

tm.define("ResultScene", {
  superClass: "tm.app.Scene",

  init: function(param) {
    this.superInit();

    this.fromJSON({
      children: [
        {
          type: "Label",
          name: "timeLabel",
          x: SCREEN_CENTER_X,
          y: 320,
          fillStyle: "#888",
          fontSize: 128,
          fontFamily: FONT_FAMILY_FLAT,
          text: "99.999",
          align: "center"
        },
        {
          type: "FlatButton",
          name: "tweetButton",
          init: [
            {
              text: "TWEET",
              bgColor: "hsl(240, 80%, 70%)"
            }
          ],
          x: SCREEN_CENTER_X - 160,
          y: 650
        },
        {
          type: "FlatButton",
          name: "backButton",
          init: [
            {
              text: "BACK",
              bgColor: "hsl(240, 0%, 70%)"
            }
          ],
          x: SCREEN_CENTER_X + 160,
          y: 650
        }
      ]
    });

    this.timeLabel.text = param.time;

    var self = this;
    this.tweetButton.onclick = function() {
      var twitterURL = tm.social.Twitter.createURL({
        type: "tweet",
        text: "tmlib.js tutorial game. Time: {time}".format(param),
        hashtags: "tmlib,javascript,game",
        url: "http://tmlife.net/?p=9781"
      });
      window.open(twitterURL);
    };

    this.backButton.onpointingstart = function() {
      self.app.replaceScene(TitleScene());
    };
  }
});
