const { createClient, Setup } = require("./build/index");

(async () => {
    const client = await createClient("202917897176219648");

    try {
        const data = await client.action("warp", "Kalen");
        console.log(data.msg);
        console.log(JSON.parse(data.player));
    } catch (e) {
        console.log(e);
    }

    client.on("err", (msg) => {
        console.log(msg);
    });

    client.on("res", (msg) => {
        console.log(msg);
    });
})();
