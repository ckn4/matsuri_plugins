import { util } from "../common/util.js"
import { commomClass } from "../common/common.js"
import { TR } from "../common/translate.js"

const yaml = require('js-yaml');

class gproxyClass {
    constructor() {
        this.sharedStorage = {}
        this.defaultSharedStorage = {}
        this.common = new commomClass()
    }

    _initDefaultSharedStorage() {
        // start of default keys
        this.defaultSharedStorage.jsVersion = 1
        this.defaultSharedStorage.name = ""
        this.defaultSharedStorage.serverAddress = "127.0.0.1"
        this.defaultSharedStorage.serverPort = "2087"
        // end of default keys
        this.defaultSharedStorage.serverPassword = ""
        this.defaultSharedStorage.serversni = ""

        for (var k in this.defaultSharedStorage) {
            let v = this.defaultSharedStorage[k]
            this.common._setType(k, typeof v)

            if (!this.sharedStorage.hasOwnProperty(k)) {
                this.sharedStorage[k] = v
            }
        }

    }

    _onSharedStorageUpdated() {
        // not null
        for (var k in this.sharedStorage) {
            if (this.sharedStorage[k] == null) {
                this.sharedStorage[k] = ""
            }
        }
        this._setShareLink()
    }

    _setShareLink() { }

    // UI Interface

    requirePreferenceScreenConfig() {
        let sb = [
            {
                "title": TR("serverSettings"),
                "preferences": [
                    {
                        "type": "EditTextPreference",
                        "key": "serverAddress",
                        "icon": "ic_hardware_router",
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverPort",
                        "icon": "ic_maps_directions_boat",
                        "EditTextPreferenceModifiers": "Port",
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serversni",
                        "icon": "ic_notification_enhanced_encryption",
                    },
                    {
                        "type": "EditTextPreference",
                        "key": "serverPassword",
                        "icon": "ic_baseline_person_24",
                        "summaryProvider": "PasswordSummaryProvider",
                    },
                ]
            }
        ]
        this.common._applyTranslateToPreferenceScreenConfig(sb, TR)
        return JSON.stringify(sb)
    }

    // 开启设置界面时调用
    setSharedStorage(b64Str) {
        this.sharedStorage = util.decodeB64Str(b64Str)
        this._initDefaultSharedStorage()
    }

    // 开启设置界面时调用
    requireSetProfileCache() {
        for (var k in this.defaultSharedStorage) {
            this.common.setKV(k, this.sharedStorage[k])
        }
    }

    // 设置界面创建后调用
    onPreferenceCreated() { }

    // 保存时调用（混合编辑后的值）
    sharedStorageFromProfileCache() {
        for (var k in this.defaultSharedStorage) {
            this.sharedStorage[k] = this.common.getKV(k)
        }
        this._onSharedStorageUpdated()
        return JSON.stringify(this.sharedStorage)
    }

    // Interface

    parseShareLink(b64Str) { }

    buildAllConfig(b64Str) {
        try {
            let args = util.decodeB64Str(b64Str)
            let ss = util.decodeB64Str(args.sharedStorage)
            let remote = args.finalAddress + ":" + args.finalPort
            let listen = "127.0.0.1:" + args.port

            let t0 = {
                "mode": "client",
                "log": { 
                    "level": "ERROR"
                },
                "pool": { 
                    "minSize": 16, 
                    "maxSize": 32, 
                    "maxAge": "24h", 
                    "gcInterval": "1m" 
                },
                "clients": 
                    [ { "name": "Mikoto",
                        "remote": remote,
                        "listen": listen,
                        "secret": ss.serverPassword,
                        "protocol": "tls",
                        "wspath": "/Mikoto",
                        "sni": ss.serversni,
                        "verify": false 
                    } ]
            }

            let v = {}
            v.nekoCommands = ["%exe%", "-c", "config.yaml"]

            v.nekoRunConfigs = [
                {
                    "name": "config.yaml",
                    "content": yaml.dump(JSON.stringify(t0))
                }
            ]

            return JSON.stringify(v)
        } catch (error) {
            neko.logError(error.toString())
        }
    }
}

export const gproxy = new gproxyClass()
