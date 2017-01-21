function GameManager() {
    this.timeLimit = 60;
    this.timer = new Timer();
    this.endGameHandlers = [];
    this.onScoreChangeHandler = function () {};
    this.onChangeTime = function () {};
    this.score = 0;
    this.maxScoreList = [100, 200, 300, 400, 500];
    this.itemManager = new ItemManager();
    this.currentHina = 0;
}
GameManager.prototype.addScore = function (score) {
    this.score = Math.max(0, score + this.score);
    if (this.score > this.maxScoreList[this.currentHina]) {
        this.score -= this.maxScoreList[this.currentHina];
        this.currentHina++;
        this.onHinaGrown(this.currentHina);
    }
    this.onScoreChangeHandler(this.score);
};
GameManager.prototype.time = function () {
    return this.timer.getTime()
}
GameManager.prototype.init = function () {
    console.log("initilize game manager.");
    if (this._initialized) {
        console.error("GM init calld twice");
        return;
    }
    this._initialized = true;
    this.itemManager.register("apple", 100);
    this.itemManager.register("yacht", 50);
    this.itemManager.register("fish", 50);
    this.itemManager.register("lotusRoot", 100);
    this.itemManager.register("turtle", 100);
    this.itemManager.register("carrot", 100);
}
GameManager.prototype.gameStart = function () {
    this.timer.reset();
    var self = this;
    var stopId = setInterval(function () {
        var ct = self.timer.getTime();
        var leaveTime = Math.ceil(self.timeLimit - ct / 1000);
        $(".time-text").text(leaveTime);
        if (self.timeLimit * 1000 < ct) {
            clearInterval(stopId);
            Audios.timeup.play()
            self.endGameHandlers.forEach(function (h) {
                h();
            })
            return;
        }
        self.onChangeTime(ct, leaveTime);
    }, 100);

    //start gen items.
    self._itemGen = true;
    var putting = function () {
        self.itemManager.randomPut();
        if (self._itemGen) {
            setTimeout(putting, Math.random() * 300);
        }
    }
    putting();
}
GameManager.prototype.stopGenItem = function () {
    this._itemGen = false;
}
GameManager.prototype.addOnEndGameHandler = function (handler) {
    this.endGameHandlers.push(handler);
}
