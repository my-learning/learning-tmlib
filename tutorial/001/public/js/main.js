var SCREEN_WIDTH = 680
  , SCREEN_HEIGHT = 960
  , SCREEN_CENTER_Y = SCREEN_WIDTH / 2
  , SCREEN_CENTER_X = SCREEN_HEIGHT / 2;

tm.main(function() {
  var app = tm.app.CanvasApp("#world");
  app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);

  app.fitWindow();
  app.background = "rgba(250, 250, 250, 1.0)";
  app.replaceScene( GameScene() );
});

tm.define("GameScene", {
  superClass: "tm.app.Scene",

  init: function() {
    this.superInit();
  }
});
