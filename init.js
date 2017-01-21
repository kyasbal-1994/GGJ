const sound = new Howl({
    src: ['./audio/wind.mp3'],
    loop: true,
    volume: 0.5
});
gr(function() {
    const $$ = gr("#sea");
    const waveContainer = $$(".wave-container").get(0);
    const itemContainer = $$(".item-container").get(0);
    WAVES = [];
    ITEMS = [];
    for (let i = 0; i < 110; i++) {
        WAVES.push(waveContainer.addChildByName("wave-cube", {
            position: `${Math.random()*3},0,-${i}`,
            color: "#0084cf",
            offset: i,
            id: "wave-" + i
        }));
    }
    const apple = new ItemManager('apple');
    apple.init();
    setInterval(function() {
        apple.set(3);
    }, 5000);

});

function ItemManager(name) {
    this.name = name;
    this.ITEMS = [];
}
ItemManager.prototype.init = function() {
    const $$ = gr("#sea");
    const itemContainer = $$(".item-container").first();
    for (var j = 0; j < 10; j++) {
        this.ITEMS.push({
            node: itemContainer.addChildByName(this.name, {
                position: "0,0,100",
                id: j
            }).on("reset", (e) => {
                const n = e.getAttribute("id");
                this.ITEMS[n]._flag = false;
                this.ITEMS[n].node.setAttribute("position", `0,0,100`);
            }),
            _flag: false
        });
    }
};
ItemManager.prototype.set = function(x) {
    const $$ = gr("#sea");
    const camera = $$("#main-camera").first();
    const pos = camera.getAttribute("position");
    const far = camera.getAttribute("far");
    for (var i = 0; i < this.ITEMS.length; i++) {
        if (this.ITEMS[i]._flag === false) {
            this.ITEMS[i].node.setAttribute("position", x + `,0,${pos.Z - far -10}`);
            this.ITEMS[i]._flag = true;
            break;
        } else if (i === this.ITEMS.length - 1) {
          console.error("All items are in use!");
        }
    }
}