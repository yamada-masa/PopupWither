const systemServer = server.registerSystem(0, 0)

systemServer.initialize = function () {
    // turn on logging of information, warnings, and errors
    const scriptLoggerConfig = this.createEventData(
        'minecraft:script_logger_config'
    )
    scriptLoggerConfig.data.log_errors = true
    scriptLoggerConfig.data.log_information = true
    scriptLoggerConfig.data.log_warnings = true
    this.broadcastEvent('minecraft:script_logger_config', scriptLoggerConfig)

    // ボタンを押したときのイベント登録
    this.listenForEvent('minecraft:block_interacted_with', (e) => this.onInteracted(e));    
};

// ログ出力のおまじない
systemServer.log = function (...items) {
    const toString = (item) => {
        switch (Object.prototype.toString.call(item)) {
            case '[object Undefined]':
                return 'undefined'
            case '[object Null]':
                return 'null'
            case '[object String]':
                return `"${item}"`
            case '[object Array]':
                const array = item.map(toString)
                return `[${array.join(', ')}]`
            case '[object Object]':
                const object = Object.keys(item).map(
                    (key) => `${key}: ${toString(item[key])}`
                )
                return `{${object.join(', ')}}`
            case '[object Function]':
                return item.toString()
            default:
                return item
        }
    }
    // Join the string array items into a single string and print it to the world's chat.
    const chatEvent = this.createEventData('minecraft:display_chat_event')
    chatEvent.data.message = items.map(toString).join(' ')
    this.broadcastEvent('minecraft:display_chat_event', chatEvent)
};

systemServer.onInteracted = function (e) {
 
    // イベントが発生した座標でどの処理をするか決定
    x = e.data.block_position.x,
    y = e.data.block_position.y,
    z = e.data.block_position.z

    if (x === 0 && y === 5 && z === 0)
    {
        this.initUser();
    }
    
    if (x === 0 && y === 5 && z === 1)
    {
        this.initGame();
    }
 };

 const playerInitCommands = [
    "/give @p netherite_sword 1",
    "/give @p bow 1",
    "/give @p enchanted_golden_apple 64",
    '/give @p skull 128 1 {"minecraft:can_place_on":{"blocks":["soul_sand"]}}',
    "/give @p netherite_helmet 1",
    "/give @p netherite_chestplate 1",
    "/give @p netherite_leggings 1",
    "/give @p netherite_boots 1",
    "/give @p arrow 64",
]

systemServer.initUser = function () {
    playerInitCommands.forEach(function(x) {
        systemServer.executeCommand(x, (e) => {});
    });
};

const gameInitCommands = [
    "/fill 20 6 0 30 6 10 soul_sand",
    "/fill 20 7 0 30 7 10 air",
    "/fill 20 5 0 30 5 10 air",
]

systemServer.initGame = function () {
    // ソウルサンドの下にソウルサンドを配置する位置を計算する
    var x = Math.floor(Math.random() * 11) + 20;
    var z = Math.floor(Math.random() * 11);
    command = `/fill ${x} 5 ${z} ${x} 5 ${z} soul_sand`;

    gameInitCommands.forEach(function(x) {
        systemServer.executeCommand(x, (e) => {});
    });
    systemServer.executeCommand(command, (e) => {});
};
