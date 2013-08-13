var SCREEN_WIDTH = 680
  , SCREEN_HEIGHT = 960
  , SCREEN_CENTER_X = SCREEN_WIDTH / 2
  , SCREEN_CENTER_Y = SCREEN_HEIGHT / 2;

var PIECE_NUM_X    = 5
  , PIECE_NUM_Y    = 5
  , PIECE_NUM      = PIECE_NUM * PIECE_NUM_Y
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
  app.replaceScene( GameScene() );

  app.run();
});

tm.define("GameScene", {
  superClass: "tm.app.Scene",

  init: function() {
    this.superInit();

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
      }
    }
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
  }
});
