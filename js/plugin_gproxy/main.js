import { util } from "../common/util.js"
import { gproxy } from "./gproxy.js"
import { LANG } from "../common/translate.js"

// Init

export function nekoInit(b64Str) {
    let args = util.decodeB64Str(b64Str)

    //TODO
    console.log(args)

    LANG = args.lang

    let plgConfig = {
        "ok": true,
        "reason": "",
        "minVersion": 1,
        "protocols": [
            {
                "protocolId": "gproxy",
                "links": ["gp://"],
                "haveStandardLink": false,
                "canShare": false,
                "canMux": false,
                "canMapping": true,
                "canTCPing": true,
                "canICMPing": true,
                "needBypassRootUid": false,
            }
        ]
    }
    return JSON.stringify(plgConfig)
}

export function nekoProtocol(protocolId) {
    if (protocolId == "gproxy") {
        return gproxy
    }
}

// export interface to browser
global_export("nekoInit", nekoInit)
global_export("nekoProtocol", nekoProtocol)
