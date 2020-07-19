import { get as httpGet } from "http";
import { Setup } from "..";

export function httpRequest(path: string) {
    return new Promise((resolve) => {
        let data = "";
        httpGet(Setup.restUrl + Setup.restPort + "/" + path, (res) => {
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                resolve(JSON.parse(data));
            });
        });
    });
}
