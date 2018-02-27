require = function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++) s(r[o]);
    return s;
}({
    "@akashic/pdi-browser": [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var Platform_1 = require("./Platform");
        exports.Platform = Platform_1.Platform;
        var ResourceFactory_1 = require("./ResourceFactory");
        exports.ResourceFactory = ResourceFactory_1.ResourceFactory;
        // akashic-engine内部でresourceを使えるように初期設定
        var g = require("@akashic/akashic-engine");
        exports.g = g;
        var AudioPluginRegistry_1 = require("./plugin/AudioPluginRegistry");
        exports.AudioPluginRegistry = AudioPluginRegistry_1.AudioPluginRegistry;
        var AudioPluginManager_1 = require("./plugin/AudioPluginManager");
        exports.AudioPluginManager = AudioPluginManager_1.AudioPluginManager;
        // TODO: Audio Pluginの実態は別リポジトリに切り出す事を検討する
        var HTMLAudioPlugin_1 = require("./plugin/HTMLAudioPlugin/HTMLAudioPlugin");
        exports.HTMLAudioPlugin = HTMLAudioPlugin_1.HTMLAudioPlugin;
        var WebAudioPlugin_1 = require("./plugin/WebAudioPlugin/WebAudioPlugin");
        exports.WebAudioPlugin = WebAudioPlugin_1.WebAudioPlugin;
    }, {
        "./Platform": 4,
        "./ResourceFactory": 6,
        "./plugin/AudioPluginManager": 21,
        "./plugin/AudioPluginRegistry": 22,
        "./plugin/HTMLAudioPlugin/HTMLAudioPlugin": 25,
        "./plugin/WebAudioPlugin/WebAudioPlugin": 29,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    1: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var AudioManager = /** @class */ function() {
            function AudioManager() {
                this.audioAssets = [], this._masterVolume = 1;
            }
            return AudioManager.prototype.registerAudioAsset = function(asset) {
                -1 === this.audioAssets.indexOf(asset) && this.audioAssets.push(asset);
            }, AudioManager.prototype.removeAudioAsset = function(asset) {
                var index = this.audioAssets.indexOf(asset);
                -1 === index && this.audioAssets.splice(index, 1);
            }, AudioManager.prototype.setMasterVolume = function(volume) {
                this._masterVolume = volume;
                for (var i = 0; i < this.audioAssets.length; i++) this.audioAssets[i]._lastPlayedPlayer && this.audioAssets[i]._lastPlayedPlayer.notifyMasterVolumeChanged();
            }, AudioManager.prototype.getMasterVolume = function() {
                return this._masterVolume;
            }, AudioManager;
        }();
        exports.AudioManager = AudioManager;
    }, {} ],
    2: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), RenderingHelper_1 = require("./canvas/RenderingHelper"), InputHandlerLayer_1 = require("./InputHandlerLayer"), ContainerController = /** @class */ function() {
            function ContainerController() {
                this.container = null, this.surface = null, this.inputHandlerLayer = null, this.rootView = null, 
                this.useResizeForScaling = !1, this.pointEventTrigger = new g.Trigger(), this._rendererReq = null, 
                this._disablePreventDefault = !1;
            }
            return ContainerController.prototype.initialize = function(param) {
                this._rendererReq = param.rendererRequirement, this._disablePreventDefault = !!param.disablePreventDefault, 
                this._loadView();
            }, ContainerController.prototype.setRootView = function(rootView) {
                rootView !== this.rootView && (// 一つのContainerは一つのrootしか持たないのでloadし直す
                this.rootView && (this.unloadView(), this._loadView()), this.rootView = rootView, 
                this._appendToRootView(rootView));
            }, ContainerController.prototype.resetView = function(rendererReq) {
                this.unloadView(), this._rendererReq = rendererReq, this._loadView(), this._appendToRootView(this.rootView);
            }, ContainerController.prototype.getRenderer = function() {
                if (!this.surface) throw new Error("this container has no surface");
                // TODO: should be cached?
                return this.surface.renderer();
            }, ContainerController.prototype.changeScale = function(xScale, yScale) {
                this.useResizeForScaling ? this.surface.changePhysicalScale(xScale, yScale) : this.surface.changeVisualScale(xScale, yScale), 
                this.inputHandlerLayer._inputHandler.setScale(xScale, yScale);
            }, ContainerController.prototype.unloadView = function() {
                if (// イベントを片付けてから、rootViewに所属するElementを開放する
                this.inputHandlerLayer.disablePointerEvent(), this.rootView) for (;this.rootView.firstChild; ) this.rootView.removeChild(this.rootView.firstChild);
            }, ContainerController.prototype._loadView = function() {
                var _a = this._rendererReq, width = _a.primarySurfaceWidth, height = _a.primarySurfaceHeight, rc = _a.rendererCandidates, disablePreventDefault = this._disablePreventDefault;
                // DocumentFragmentはinsertした時点で開放されているため毎回作る
                // https://dom.spec.whatwg.org/#concept-node-insert
                this.container = document.createDocumentFragment(), // 入力受け付けレイヤー - DOM Eventの管理
                this.inputHandlerLayer ? (// Note: 操作プラグインに与えた view 情報を削除しないため、 inputHandlerLayer を使いまわしている
                this.inputHandlerLayer.setViewSize({
                    width: width,
                    height: height
                }), this.inputHandlerLayer.pointEventTrigger.removeAll(), this.inputHandlerLayer.view.removeChild(this.surface.canvas), 
                this.surface.destroy()) : this.inputHandlerLayer = new InputHandlerLayer_1.InputHandlerLayer({
                    width: width,
                    height: height,
                    disablePreventDefault: disablePreventDefault
                }), // 入力受け付けレイヤー > 描画レイヤー
                this.surface = RenderingHelper_1.RenderingHelper.createPrimarySurface(width, height, rc), 
                this.inputHandlerLayer.view.appendChild(this.surface.getHTMLElement()), // containerController -> input -> canvas
                this.container.appendChild(this.inputHandlerLayer.view);
            }, ContainerController.prototype._appendToRootView = function(rootView) {
                rootView.appendChild(this.container), this.inputHandlerLayer.enablePointerEvent(), 
                // Viewが追加されてから設定する
                this.inputHandlerLayer.pointEventTrigger.add(this.pointEventTrigger.fire, this.pointEventTrigger);
            }, ContainerController;
        }();
        exports.ContainerController = ContainerController;
    }, {
        "./InputHandlerLayer": 3,
        "./canvas/RenderingHelper": 16,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    3: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), MouseHandler_1 = require("./handler/MouseHandler"), TouchHandler_1 = require("./handler/TouchHandler"), InputHandlerLayer = /** @class */ function() {
            /**
     * @example
     *
     * var inputHandlerLayer = new InputHandlerLayer();
     * inputHandlerLayer.pointEventTrigger.add(function(pointEvent){
     *   console.log(pointEvent);
     * });
     * containerController.appendChild(inputHandlerLayer.view);
     */
            function InputHandlerLayer(param) {
                this.view = this._createInputView(param.width, param.height), this._inputHandler = void 0, 
                this.pointEventTrigger = new g.Trigger(), this._disablePreventDefault = !!param.disablePreventDefault;
            }
            // 実行環境でサポートしてるDOM Eventを使い、それぞれonPoint*Triggerを関連付ける
            // DOMイベントハンドラを開放する
            return InputHandlerLayer.prototype.enablePointerEvent = function() {
                var _this = this;
                TouchHandler_1.TouchHandler.isSupported() ? this._inputHandler = new TouchHandler_1.TouchHandler(this.view, this._disablePreventDefault) : this._inputHandler = new MouseHandler_1.MouseHandler(this.view, this._disablePreventDefault), 
                // 各種イベントのTrigger
                this._inputHandler.pointTrigger.add(function(e) {
                    _this.pointEventTrigger.fire(e);
                }), this._inputHandler.start();
            }, InputHandlerLayer.prototype.disablePointerEvent = function() {
                this._inputHandler && this._inputHandler.stop();
            }, InputHandlerLayer.prototype.setOffset = function(offset) {
                var inputViewStyle = "position:relative; left:" + offset.x + "px; top:" + offset.y + "px";
                this._inputHandler.inputView.setAttribute("style", inputViewStyle);
            }, InputHandlerLayer.prototype.setViewSize = function(size) {
                var view = this.view;
                view.style.width = size.width + "px", view.style.height = size.height + "px";
            }, InputHandlerLayer.prototype._createInputView = function(width, height) {
                var view = document.createElement("div");
                return view.setAttribute("tabindex", "1"), view.className = "input-handler", view.setAttribute("style", "display:inline-block; outline:none;"), 
                view.style.width = width + "px", view.style.height = height + "px", view;
            }, InputHandlerLayer;
        }();
        exports.InputHandlerLayer = InputHandlerLayer;
    }, {
        "./handler/MouseHandler": 19,
        "./handler/TouchHandler": 20,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    4: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var RafLooper_1 = require("./RafLooper"), ResourceFactory_1 = require("./ResourceFactory"), ContainerController_1 = require("./ContainerController"), AudioPluginManager_1 = require("./plugin/AudioPluginManager"), AudioManager_1 = require("./AudioManager"), AudioPluginRegistry_1 = require("./plugin/AudioPluginRegistry"), XHRTextAsset_1 = require("./asset/XHRTextAsset"), Platform = /** @class */ function() {
            function Platform(param) {
                this.containerView = param.containerView, this.containerController = new ContainerController_1.ContainerController(), 
                this.audioPluginManager = new AudioPluginManager_1.AudioPluginManager(), param.audioPlugins && this.audioPluginManager.tryInstallPlugin(param.audioPlugins), 
                // TODO: make it deprecated
                this.audioPluginManager.tryInstallPlugin(AudioPluginRegistry_1.AudioPluginRegistry.getRegisteredAudioPlugins()), 
                this._audioManager = new AudioManager_1.AudioManager(), this.amflow = param.amflow, 
                this._platformEventHandler = null, this._resourceFactory = param.resourceFactory || new ResourceFactory_1.ResourceFactory({
                    audioPluginManager: this.audioPluginManager,
                    platform: this,
                    audioManager: this._audioManager
                }), this._rendererReq = null, this._disablePreventDefault = !!param.disablePreventDefault;
            }
            /**
     * 最終的に出力されるマスター音量を変更する
     *
     * @param volume マスター音量
     */
            /**
     * 最終的に出力されるマスター音量を取得する
     */
            return Platform.prototype.setPlatformEventHandler = function(handler) {
                this.containerController && (this.containerController.pointEventTrigger.removeAll({
                    owner: this._platformEventHandler
                }), this.containerController.pointEventTrigger.add(handler.onPointEvent, handler)), 
                this._platformEventHandler = handler;
            }, Platform.prototype.loadGameConfiguration = function(url, callback) {
                var a = new XHRTextAsset_1.XHRTextAsset("(game.json)", url);
                a._load({
                    _onAssetLoad: function(asset) {
                        callback(null, JSON.parse(a.data));
                    },
                    _onAssetError: function(asset, error) {
                        callback(error, null);
                    }
                });
            }, Platform.prototype.getResourceFactory = function() {
                return this._resourceFactory;
            }, Platform.prototype.setRendererRequirement = function(requirement) {
                if (!requirement) return void (this.containerController && this.containerController.unloadView());
                // Note: this.containerController.inputHandlerLayer の存在により this.containerController が初期化されているかを判定
                if (this._rendererReq = requirement, this._resourceFactory._rendererCandidates = this._rendererReq.rendererCandidates, 
                this.containerController && !this.containerController.inputHandlerLayer) this.containerController.initialize({
                    rendererRequirement: requirement,
                    disablePreventDefault: this._disablePreventDefault
                }), this.containerController.setRootView(this.containerView), this._platformEventHandler && this.containerController.pointEventTrigger.add(this._platformEventHandler.onPointEvent, this._platformEventHandler); else {
                    var surface = this.getPrimarySurface();
                    surface && !surface.destroyed() && surface.destroy(), this.containerController.resetView(requirement);
                }
            }, Platform.prototype.getPrimarySurface = function() {
                return this.containerController.surface;
            }, Platform.prototype.getOperationPluginViewInfo = function() {
                var _this = this;
                return {
                    type: "pdi-browser",
                    view: this.containerController.inputHandlerLayer.view,
                    getScale: function() {
                        return _this.containerController.inputHandlerLayer._inputHandler.getScale();
                    }
                };
            }, Platform.prototype.createLooper = function(fun) {
                return new RafLooper_1.RafLooper(fun);
            }, Platform.prototype.sendToExternal = function(playId, data) {}, Platform.prototype.registerAudioPlugins = function(plugins) {
                return this.audioPluginManager.tryInstallPlugin(plugins);
            }, Platform.prototype.setScale = function(xScale, yScale) {
                this.containerController.changeScale(xScale, yScale);
            }, Platform.prototype.notifyViewMoved = function() {}, Platform.prototype.setMasterVolume = function(volume) {
                this._audioManager && this._audioManager.setMasterVolume(volume);
            }, Platform.prototype.getMasterVolume = function() {
                return this._audioManager ? this._audioManager.getMasterVolume() : void 0;
            }, Platform;
        }();
        exports.Platform = Platform;
    }, {
        "./AudioManager": 1,
        "./ContainerController": 2,
        "./RafLooper": 5,
        "./ResourceFactory": 6,
        "./asset/XHRTextAsset": 12,
        "./plugin/AudioPluginManager": 21,
        "./plugin/AudioPluginRegistry": 22
    } ],
    5: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var RafLooper = /** @class */ function() {
            function RafLooper(fun) {
                this._fun = fun, this._timerId = void 0, this._prev = 0;
            }
            return RafLooper.prototype.start = function() {
                var _this = this, onAnimationFrame = function(deltaTime) {
                    null != _this._timerId && (_this._timerId = requestAnimationFrame(onAnimationFrame), 
                    _this._fun(deltaTime - _this._prev), _this._prev = deltaTime);
                }, onFirstFrame = function(deltaTime) {
                    _this._timerId = requestAnimationFrame(onAnimationFrame), _this._fun(0), _this._prev = deltaTime;
                };
                this._timerId = requestAnimationFrame(onFirstFrame);
            }, RafLooper.prototype.stop = function() {
                cancelAnimationFrame(this._timerId), this._timerId = void 0, this._prev = 0;
            }, RafLooper;
        }();
        exports.RafLooper = RafLooper;
    }, {} ],
    6: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), HTMLImageAsset_1 = require("./asset/HTMLImageAsset"), HTMLVideoAsset_1 = require("./asset/HTMLVideoAsset"), XHRTextAsset_1 = require("./asset/XHRTextAsset"), XHRScriptAsset_1 = require("./asset/XHRScriptAsset"), RenderingHelper_1 = require("./canvas/RenderingHelper"), GlyphFactory_1 = require("./canvas/GlyphFactory"), ResourceFactory = /** @class */ function(_super) {
            function ResourceFactory(param) {
                var _this = _super.call(this) || this;
                return _this._audioPluginManager = param.audioPluginManager, _this._audioManager = param.audioManager, 
                _this._platform = param.platform, _this;
            }
            return __extends(ResourceFactory, _super), ResourceFactory.prototype.createAudioAsset = function(id, assetPath, duration, system, loop, hint) {
                var activePlugin = this._audioPluginManager.getActivePlugin(), audioAsset = activePlugin.createAsset(id, assetPath, duration, system, loop, hint);
                return audioAsset.onDestroyed && (this._audioManager.registerAudioAsset(audioAsset), 
                audioAsset.onDestroyed.add(this._onAudioAssetDestroyed, this)), audioAsset;
            }, ResourceFactory.prototype.createAudioPlayer = function(system) {
                var activePlugin = this._audioPluginManager.getActivePlugin();
                return activePlugin.createPlayer(system, this._audioManager);
            }, ResourceFactory.prototype.createImageAsset = function(id, assetPath, width, height) {
                return new HTMLImageAsset_1.HTMLImageAsset(id, assetPath, width, height);
            }, ResourceFactory.prototype.createVideoAsset = function(id, assetPath, width, height, system, loop, useRealSize) {
                return new HTMLVideoAsset_1.HTMLVideoAsset(id, assetPath, width, height, system, loop, useRealSize);
            }, ResourceFactory.prototype.createTextAsset = function(id, assetPath) {
                return new XHRTextAsset_1.XHRTextAsset(id, assetPath);
            }, ResourceFactory.prototype.createScriptAsset = function(id, assetPath) {
                return new XHRScriptAsset_1.XHRScriptAsset(id, assetPath);
            }, ResourceFactory.prototype.createSurface = function(width, height) {
                return RenderingHelper_1.RenderingHelper.createBackSurface(width, height, this._platform, this._rendererCandidates);
            }, ResourceFactory.prototype.createGlyphFactory = function(fontFamily, fontSize, baseline, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) {
                return new GlyphFactory_1.GlyphFactory(fontFamily, fontSize, baseline, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight);
            }, ResourceFactory.prototype._onAudioAssetDestroyed = function(asset) {
                this._audioManager.removeAudioAsset(asset);
            }, ResourceFactory;
        }(g.ResourceFactory);
        exports.ResourceFactory = ResourceFactory;
    }, {
        "./asset/HTMLImageAsset": 8,
        "./asset/HTMLVideoAsset": 9,
        "./asset/XHRScriptAsset": 11,
        "./asset/XHRTextAsset": 12,
        "./canvas/GlyphFactory": 15,
        "./canvas/RenderingHelper": 16,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    7: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var RuntimeInfo;
        !function(RuntimeInfo) {
            /**
     * pointer eventが現在実行中のブラウザで有効かどうか識別
     * @returns {boolean} true: 有効
     */
            function pointerEnabled() {
                return "pointerEnabled" in window.navigator;
            }
            /**
     * pointer eventのmsプリフィックスバージョンが現在実行中のブラウザで有効かどうか識別
     * @returns {boolean} true: 有効
     */
            function msPointerEnabled() {
                return "msPointerEnabled" in window.navigator;
            }
            /**
     * touch eventが現在実行中のブラウザで有効かどうか識別
     * @returns {boolean} true: 有効
     */
            function touchEnabled() {
                return "ontouchstart" in window;
            }
            RuntimeInfo.pointerEnabled = pointerEnabled, RuntimeInfo.msPointerEnabled = msPointerEnabled, 
            RuntimeInfo.touchEnabled = touchEnabled;
        }(RuntimeInfo = exports.RuntimeInfo || (exports.RuntimeInfo = {}));
    }, {} ],
    8: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), ImageAssetSurface = /** @class */ function(_super) {
            function ImageAssetSurface(width, height, drawable) {
                return _super.call(this, width, height, drawable) || this;
            }
            return __extends(ImageAssetSurface, _super), ImageAssetSurface.prototype.renderer = function() {
                throw g.ExceptionFactory.createAssertionError("ImageAssetSurface cannot be rendered.");
            }, ImageAssetSurface.prototype.isPlaying = function() {
                return !1;
            }, ImageAssetSurface;
        }(g.Surface);
        exports.ImageAssetSurface = ImageAssetSurface;
        var HTMLImageAsset = /** @class */ function(_super) {
            function HTMLImageAsset(id, path, width, height) {
                var _this = _super.call(this, id, path, width, height) || this;
                return _this.data = void 0, _this._surface = void 0, _this;
            }
            return __extends(HTMLImageAsset, _super), HTMLImageAsset.prototype.destroy = function() {
                this._surface && !this._surface.destroyed() && this._surface.destroy(), this.data = void 0, 
                this._surface = void 0, _super.prototype.destroy.call(this);
            }, HTMLImageAsset.prototype._load = function(loader) {
                var _this = this, image = new Image();
                image.onerror = function() {
                    loader._onAssetError(_this, g.ExceptionFactory.createAssetLoadError("HTMLImageAsset unknown loading error"));
                }, image.onload = function() {
                    _this.data = image, loader._onAssetLoad(_this);
                }, image.src = this.path;
            }, HTMLImageAsset.prototype.asSurface = function() {
                if (!this.data) throw g.ExceptionFactory.createAssertionError("ImageAssetImpl#asSurface: not yet loaded.");
                return this._surface ? this._surface : (this._surface = new ImageAssetSurface(this.width, this.height, this.data), 
                this._surface);
            }, HTMLImageAsset;
        }(g.ImageAsset);
        exports.HTMLImageAsset = HTMLImageAsset;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    9: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), HTMLVideoPlayer_1 = require("./HTMLVideoPlayer"), VideoAssetSurface = /** @class */ function(_super) {
            function VideoAssetSurface(width, height, drawable) {
                return _super.call(this, width, height, drawable, !0) || this;
            }
            return __extends(VideoAssetSurface, _super), VideoAssetSurface.prototype.renderer = function() {
                throw g.ExceptionFactory.createAssertionError("VideoAssetSurface cannot be rendered.");
            }, VideoAssetSurface.prototype.isPlaying = function() {
                return !1;
            }, VideoAssetSurface;
        }(g.Surface), HTMLVideoAsset = /** @class */ function(_super) {
            function HTMLVideoAsset(id, assetPath, width, height, system, loop, useRealSize) {
                var _this = _super.call(this, id, assetPath, width, height, system, loop, useRealSize) || this;
                return _this._player = new HTMLVideoPlayer_1.HTMLVideoPlayer(), _this._surface = new VideoAssetSurface(width, height, null), 
                _this;
            }
            return __extends(HTMLVideoAsset, _super), HTMLVideoAsset.prototype.inUse = function() {
                return !1;
            }, HTMLVideoAsset.prototype._load = function(loader) {
                var _this = this;
                setTimeout(function() {
                    loader._onAssetLoad(_this);
                }, 0);
            }, HTMLVideoAsset.prototype.getPlayer = function() {
                return this._player;
            }, HTMLVideoAsset.prototype.asSurface = function() {
                return this._surface;
            }, HTMLVideoAsset;
        }(g.VideoAsset);
        exports.HTMLVideoAsset = HTMLVideoAsset;
    }, {
        "./HTMLVideoPlayer": 10,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    10: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), HTMLVideoPlayer = /** @class */ function(_super) {
            function HTMLVideoPlayer(loop) {
                var _this = _super.call(this, loop) || this;
                return _this.isDummy = !0, _this;
            }
            return __extends(HTMLVideoPlayer, _super), HTMLVideoPlayer.prototype.play = function(videoAsset) {}, 
            HTMLVideoPlayer.prototype.stop = function() {}, HTMLVideoPlayer.prototype.changeVolume = function(volume) {}, 
            HTMLVideoPlayer;
        }(g.VideoPlayer);
        exports.HTMLVideoPlayer = HTMLVideoPlayer;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    11: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), XHRLoader_1 = require("../utils/XHRLoader"), XHRScriptAsset = /** @class */ function(_super) {
            function XHRScriptAsset(id, path) {
                var _this = _super.call(this, id, path) || this;
                return _this.script = void 0, _this;
            }
            return __extends(XHRScriptAsset, _super), XHRScriptAsset.prototype._load = function(handler) {
                var _this = this, loader = new XHRLoader_1.XHRLoader();
                loader.get(this.path, function(error, responseText) {
                    return error ? void handler._onAssetError(_this, error) : (_this.script = responseText + "\n", 
                    void handler._onAssetLoad(_this));
                });
            }, XHRScriptAsset.prototype.execute = function(execEnv) {
                // TODO: この方式では読み込んだスクリプトがcookie参照できる等本質的な危険性がある
                // 信頼できないスクリプトを読み込むようなケースでは、iframeに閉じ込めて実行などの方式を検討する事。
                var func = this._wrap();
                return func(execEnv), execEnv.module.exports;
            }, XHRScriptAsset.prototype._wrap = function() {
                var func = new Function("g", XHRScriptAsset.PRE_SCRIPT + this.script + XHRScriptAsset.POST_SCRIPT);
                return func;
            }, XHRScriptAsset.PRE_SCRIPT = "(function(exports, require, module, __filename, __dirname) {", 
            XHRScriptAsset.POST_SCRIPT = "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);", 
            XHRScriptAsset;
        }(g.ScriptAsset);
        exports.XHRScriptAsset = XHRScriptAsset;
    }, {
        "../utils/XHRLoader": 30,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    12: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), XHRLoader_1 = require("../utils/XHRLoader"), XHRTextAsset = /** @class */ function(_super) {
            function XHRTextAsset(id, path) {
                var _this = _super.call(this, id, path) || this;
                return _this.data = void 0, _this;
            }
            return __extends(XHRTextAsset, _super), XHRTextAsset.prototype._load = function(handler) {
                var _this = this, loader = new XHRLoader_1.XHRLoader();
                loader.get(this.path, function(error, responseText) {
                    return error ? void handler._onAssetError(_this, error) : (_this.data = responseText, 
                    void handler._onAssetLoad(_this));
                });
            }, XHRTextAsset;
        }(g.TextAsset);
        exports.XHRTextAsset = XHRTextAsset;
    }, {
        "../utils/XHRLoader": 30,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    13: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), Context2DRenderer_1 = require("./Context2DRenderer"), CanvasSurface = /** @class */ function(_super) {
            function CanvasSurface(width, height) {
                var _this = this, canvas = document.createElement("canvas");
                return _this = _super.call(this, width, height, canvas) || this, canvas.width = width, 
                canvas.height = height, _this.canvas = canvas, _this._context = canvas.getContext("2d"), 
                _this._renderer = void 0, _this;
            }
            /**
     * 描き込み時の拡大率(と描画領域のサイズ)を変更する。
     * このメソッドによって描画領域のサイズは変化し、それにより表示上のサイズも変化するが、
     * 「ゲームコンテンツから見たサーフェスとしてのサイズ」(生成時に指定されたサイズ)は変わらない点に注意。
     *
     * このメソッドと `changeVisualScale()` との違いは、拡大時、高解像度の画像の縮小して描き込む時に現れる。
     * このメソッドによる拡大は、表示上の拡大率のみを変更する `changeVisualScale()` と異なり、
     * 「縮小と拡大の変換行列をかけて大きなcanvasに描き込む」ことになるため、描画元の解像度を活かすことができる。
     *
     * このメソッドは、このサーフェスへの描画中(`this.renderer().begin()` から `end()` までの間)に呼び出してはならない。
     */
            /**
     * 表示上の拡大率を変更する。
     * `changeRawSize()` との差異に注意。
     */
            return __extends(CanvasSurface, _super), CanvasSurface.prototype.renderer = function() {
                return this._renderer || (this._renderer = new Context2DRenderer_1.Context2DRenderer(this, this._context)), 
                this._renderer;
            }, CanvasSurface.prototype.getHTMLElement = function() {
                return this.canvas;
            }, CanvasSurface.prototype.changePhysicalScale = function(xScale, yScale) {
                this.canvas.width = this.width * xScale, this.canvas.height = this.height * yScale, 
                this._context.scale(xScale, yScale);
            }, CanvasSurface.prototype.changeVisualScale = function(xScale, yScale) {
                /*
         Canvas要素のリサイズをCSS transformで行う。
         CSSのwidth/height styleによるリサイズはおかしくなるケースが存在するので、可能な限りtransformを使う。
         - https://twitter.com/uupaa/status/639002317576998912
         - http://havelog.ayumusato.com/develop/performance/e554-paint_gpu_acceleration_problems.html
         - http://buccchi.jp/blog/2013/03/android_canvas_deathpoint/
         */
                var canvasStyle = this.canvas.style;
                "transform" in canvasStyle ? (canvasStyle.transformOrigin = "0 0", canvasStyle.transform = "scale(" + xScale + "," + yScale + ")") : "webkitTransform" in canvasStyle ? (canvasStyle.webkitTransformOrigin = "0 0", 
                canvasStyle.webkitTransform = "scale(" + xScale + "," + yScale + ")") : (canvasStyle.width = Math.floor(xScale * this.width) + "px", 
                canvasStyle.height = Math.floor(yScale * this.width) + "px");
            }, CanvasSurface.prototype.isPlaying = function() {
                throw g.ExceptionFactory.createAssertionError("CanvasSurface#isPlaying() is not implemented");
            }, CanvasSurface;
        }(g.Surface);
        exports.CanvasSurface = CanvasSurface;
    }, {
        "./Context2DRenderer": 14,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    14: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), RenderingHelper_1 = require("./RenderingHelper"), Context2DRenderer = /** @class */ function(_super) {
            function Context2DRenderer(surface, context) {
                var _this = _super.call(this) || this;
                return _this.surface = surface, _this.context = context, _this;
            }
            return __extends(Context2DRenderer, _super), Context2DRenderer.prototype.clear = function() {
                this.context.clearRect(0, 0, this.surface.width, this.surface.height);
            }, Context2DRenderer.prototype.drawImage = function(surface, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY) {
                this.context.drawImage(surface._drawable, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, width, height);
            }, Context2DRenderer.prototype.drawSprites = function(surface, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, count) {
                for (var i = 0; count > i; ++i) this.drawImage(surface, offsetX[i], offsetY[i], width[i], height[i], canvasOffsetX[i], canvasOffsetY[i]);
            }, Context2DRenderer.prototype.drawSystemText = function(text, x, y, maxWidth, fontSize, textAlign, textBaseline, textColor, fontFamily, strokeWidth, strokeColor, strokeOnly) {
                RenderingHelper_1.RenderingHelper.drawSystemTextByContext2D(this.context, text, x, y, maxWidth, fontSize, textAlign, textBaseline, textColor, fontFamily, strokeWidth, strokeColor, strokeOnly);
            }, Context2DRenderer.prototype.translate = function(x, y) {
                this.context.translate(x, y);
            }, Context2DRenderer.prototype.transform = function(matrix) {
                this.context.transform.apply(this.context, matrix);
            }, Context2DRenderer.prototype.opacity = function(opacity) {
                // Note:globalAlphaの初期値が1であることは仕様上保証されているため、常に掛け合わせる
                this.context.globalAlpha *= opacity;
            }, Context2DRenderer.prototype.save = function() {
                this.context.save();
            }, Context2DRenderer.prototype.restore = function() {
                this.context.restore();
            }, Context2DRenderer.prototype.fillRect = function(x, y, width, height, cssColor) {
                var _fillStyle = this.context.fillStyle;
                this.context.fillStyle = cssColor, this.context.fillRect(x, y, width, height), this.context.fillStyle = _fillStyle;
            }, Context2DRenderer.prototype.setCompositeOperation = function(operation) {
                this.context.globalCompositeOperation = RenderingHelper_1.RenderingHelper.toTextFromCompositeOperation(operation);
            }, Context2DRenderer.prototype.setOpacity = function(opacity) {
                throw g.ExceptionFactory.createAssertionError("Context2DRenderer#setOpacity() is not implemented");
            }, Context2DRenderer.prototype.setTransform = function(matrix) {
                throw g.ExceptionFactory.createAssertionError("Context2DRenderer#setTransform() is not implemented");
            }, Context2DRenderer.prototype._getImageData = function(sx, sy, sw, sh) {
                return this.context.getImageData(sx, sy, sw, sh);
            }, Context2DRenderer.prototype._putImageData = function(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
                void 0 === dirtyX && (dirtyX = 0), void 0 === dirtyY && (dirtyY = 0), void 0 === dirtyWidth && (dirtyWidth = imageData.width), 
                void 0 === dirtyHeight && (dirtyHeight = imageData.height), this.context.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
            }, Context2DRenderer;
        }(g.Renderer);
        exports.Context2DRenderer = Context2DRenderer;
    }, {
        "./RenderingHelper": 16,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    15: [ function(require, module, exports) {
        "use strict";
        function createGlyphRenderedSurface(code, fontSize, cssFontFamily, baselineHeight, marginW, marginH, needImageData, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) {
            // 要求されたフォントサイズが描画可能な最小フォントサイズ以下だった場合、必要なスケーリング係数
            var scale = fontSize < GlyphFactory._environmentMinimumFontSize ? fontSize / GlyphFactory._environmentMinimumFontSize : 1, surfaceWidth = Math.ceil((fontSize + 2 * marginW) * scale), surfaceHeight = Math.ceil((fontSize + 2 * marginH) * scale), surface = new CanvasSurface_1.CanvasSurface(surfaceWidth, surfaceHeight), canvas = surface.canvas, context = canvas.getContext("2d"), str = 4294901760 & code ? String.fromCharCode((4294901760 & code) >>> 16, 65535 & code) : String.fromCharCode(code), fontWeightValue = fontWeight === g.FontWeight.Bold ? "bold " : "";
            context.save(), // CanvasRenderingContext2D.font
            // see: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
            // > This string uses the same syntax as the CSS font specifier. The default font is 10px sans-serif.
            context.font = fontWeightValue + fontSize + "px " + cssFontFamily, context.textAlign = "left", 
            context.textBaseline = "alphabetic", context.lineJoin = "bevel", // 描画可能な最小フォントサイズ以下のフォントサイズはスケーリングで実現する
            1 !== scale && context.scale(scale, scale), strokeWidth > 0 && (context.lineWidth = strokeWidth, 
            context.strokeStyle = strokeColor, context.strokeText(str, marginW, marginH + baselineHeight)), 
            strokeOnly || (context.fillStyle = fontColor, context.fillText(str, marginW, marginH + baselineHeight));
            var advanceWidth = context.measureText(str).width;
            context.restore();
            var result = {
                surface: surface,
                advanceWidth: advanceWidth,
                imageData: needImageData ? context.getImageData(0, 0, canvas.width, canvas.height) : void 0
            };
            return result;
        }
        function calcGlyphArea(imageData) {
            for (var sx = imageData.width, sy = imageData.height, ex = 0, ey = 0, currentPos = 0, y = 0, height = imageData.height; height > y; y = y + 1 | 0) for (var x = 0, width = imageData.width; width > x; x = x + 1 | 0) {
                var a = imageData.data[currentPos + 3];
                // get alpha value
                0 !== a && (sx > x && (sx = x), x > ex && (ex = x), sy > y && (sy = y), y > ey && (ey = y)), 
                currentPos += 4;
            }
            var glyphArea = void 0;
            return glyphArea = sx === imageData.width ? {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            } : {
                x: sx,
                y: sy,
                width: ex - sx + 1,
                height: ey - sy + 1
            };
        }
        function isGlyphAreaEmpty(glyphArea) {
            return 0 === glyphArea.width || 0 === glyphArea.height;
        }
        function fontFamily2FontFamilyName(fontFamily) {
            switch (fontFamily) {
              case g.FontFamily.Monospace:
                return "monospace";

              case g.FontFamily.Serif:
                return "serif";

              default:
                return "sans-serif";
            }
        }
        // ジェネリックフォントファミリでない時クォートする。
        // > Font family names must either be given quoted as strings, or unquoted as a sequence of one or more identifiers.
        // > Generic family names are keywords and must not be quoted.
        // see: https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
        function quoteIfNotGeneric(name) {
            return -1 !== genericFontFamilyNames.indexOf(name) ? name : '"' + name + '"';
        }
        function fontFamily2CSSFontFamily(fontFamily) {
            return "number" == typeof fontFamily ? fontFamily2FontFamilyName(fontFamily) : "string" == typeof fontFamily ? quoteIfNotGeneric(fontFamily) : fontFamily.map(function(font) {
                return "string" == typeof font ? quoteIfNotGeneric(font) : fontFamily2FontFamilyName(font);
            }).join(",");
        }
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), CanvasSurface_1 = require("./CanvasSurface"), genericFontFamilyNames = [ "serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui" ], GlyphFactory = /** @class */ function(_super) {
            function GlyphFactory(fontFamily, fontSize, baselineHeight, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) {
                var _this = _super.call(this, fontFamily, fontSize, baselineHeight, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) || this;
                _this._glyphAreas = {}, _this._cssFontFamily = fontFamily2CSSFontFamily(fontFamily);
                // Akashicエンジンは指定されたフォントに利用可能なものが見つからない時
                // `g.FontFamily.SansSerif` を利用する、と仕様して定められている。
                var fallbackFontFamilyName = fontFamily2FontFamilyName(g.FontFamily.SansSerif);
                // `this.fontSize`の大きさの文字を描画するためのサーフェスを生成する。
                // 一部の文字は縦横が`this.fontSize`幅の矩形に収まらない。
                // そこで上下左右にマージンを設ける。マージン幅は`this.fontSize`に
                // 0.3 を乗じたものにする。0.3に確たる根拠はないが、検証した範囲では
                // これで十分であることを確認している。
                //
                // strokeWidthサポートに伴い、輪郭線の厚みを加味している。
                return -1 === _this._cssFontFamily.indexOf(fallbackFontFamilyName) && (_this._cssFontFamily += "," + fallbackFontFamilyName), 
                _this._marginW = Math.ceil(.3 * _this.fontSize + _this.strokeWidth / 2), _this._marginH = Math.ceil(.3 * _this.fontSize + _this.strokeWidth / 2), 
                void 0 === GlyphFactory._environmentMinimumFontSize && (GlyphFactory._environmentMinimumFontSize = _this.measureMinimumFontSize()), 
                _this;
            }
            // 実行環境の描画可能なフォントサイズの最小値を返す
            return __extends(GlyphFactory, _super), GlyphFactory.prototype.create = function(code) {
                var result, glyphArea = this._glyphAreas[code];
                // g.Glyphに格納するサーフェスを生成する。
                // glyphAreaはサーフェスをキャッシュしないため、描画する内容を持つグリフに対しては
                // サーフェスを生成する。もし前段でcalcGlyphArea()のためのサーフェスを生成して
                // いればここでは生成せずにそれを利用する。
                return glyphArea || (result = createGlyphRenderedSurface(code, this.fontSize, this._cssFontFamily, this.baselineHeight, this._marginW, this._marginH, !0, this.fontColor, this.strokeWidth, this.strokeColor, this.strokeOnly, this.fontWeight), 
                glyphArea = calcGlyphArea(result.imageData), glyphArea.advanceWidth = result.advanceWidth, 
                this._glyphAreas[code] = glyphArea), isGlyphAreaEmpty(glyphArea) ? (result && result.surface.destroy(), 
                new g.Glyph(code, 0, 0, 0, 0, 0, 0, glyphArea.advanceWidth, void 0, !0)) : (result || (result = createGlyphRenderedSurface(code, this.fontSize, this._cssFontFamily, this.baselineHeight, this._marginW, this._marginH, !1, this.fontColor, this.strokeWidth, this.strokeColor, this.strokeOnly, this.fontWeight)), 
                new g.Glyph(code, glyphArea.x, glyphArea.y, glyphArea.width, glyphArea.height, glyphArea.x - this._marginW, glyphArea.y - this._marginH, glyphArea.advanceWidth, result.surface, !0));
            }, GlyphFactory.prototype.measureMinimumFontSize = function() {
                var fontSize = 1, str = "M", canvas = document.createElement("canvas"), context = canvas.getContext("2d");
                context.textAlign = "left", context.textBaseline = "alphabetic", context.lineJoin = "bevel";
                var preWidth;
                context.font = fontSize + "px sans-serif";
                var width = context.measureText(str).width;
                do preWidth = width, fontSize += 1, context.font = fontSize + "px sans-serif", width = context.measureText(str).width; while (preWidth === width || fontSize > 50);
                // フォントサイズに対応しない動作環境の場合を考慮して上限値を設ける
                return fontSize;
            }, GlyphFactory;
        }(g.GlyphFactory);
        exports.GlyphFactory = GlyphFactory;
    }, {
        "./CanvasSurface": 13,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    16: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var RenderingHelper, g = require("@akashic/akashic-engine"), SurfaceFactory_1 = require("./SurfaceFactory");
        !function(RenderingHelper) {
            function toTextFromCompositeOperation(operation) {
                var operationText;
                switch (operation) {
                  case g.CompositeOperation.SourceAtop:
                    operationText = "source-atop";
                    break;

                  case g.CompositeOperation.Lighter:
                    operationText = "lighter";
                    break;

                  case g.CompositeOperation.Copy:
                    operationText = "copy";
                    break;

                  case g.CompositeOperation.ExperimentalSourceIn:
                    operationText = "source-in";
                    break;

                  case g.CompositeOperation.ExperimentalSourceOut:
                    operationText = "source-out";
                    break;

                  case g.CompositeOperation.ExperimentalDestinationAtop:
                    operationText = "destination-atop";
                    break;

                  case g.CompositeOperation.ExperimentalDestinationIn:
                    operationText = "destination-in";
                    break;

                  case g.CompositeOperation.DestinationOut:
                    operationText = "destination-out";
                    break;

                  case g.CompositeOperation.DestinationOver:
                    operationText = "destination-over";
                    break;

                  case g.CompositeOperation.Xor:
                    operationText = "xor";
                    break;

                  default:
                    operationText = "source-over";
                }
                return operationText;
            }
            function drawSystemTextByContext2D(context, text, x, y, maxWidth, fontSize, textAlign, textBaseline, textColor, fontFamily, strokeWidth, strokeColor, strokeOnly) {
                var fontFamilyValue, textAlignValue, textBaselineValue;
                switch (context.save(), fontFamily) {
                  case g.FontFamily.Monospace:
                    fontFamilyValue = "monospace";
                    break;

                  case g.FontFamily.Serif:
                    fontFamilyValue = "serif";
                    break;

                  default:
                    fontFamilyValue = "sans-serif";
                }
                switch (context.font = fontSize + "px " + fontFamilyValue, textAlign) {
                  case g.TextAlign.Right:
                    textAlignValue = "right";
                    break;

                  case g.TextAlign.Center:
                    textAlignValue = "center";
                    break;

                  default:
                    textAlignValue = "left";
                }
                switch (context.textAlign = textAlignValue, textBaseline) {
                  case g.TextBaseline.Top:
                    textBaselineValue = "top";
                    break;

                  case g.TextBaseline.Middle:
                    textBaselineValue = "middle";
                    break;

                  case g.TextBaseline.Bottom:
                    textBaselineValue = "bottom";
                    break;

                  default:
                    textBaselineValue = "alphabetic";
                }
                context.textBaseline = textBaselineValue, context.lineJoin = "bevel", strokeWidth > 0 && (context.lineWidth = strokeWidth, 
                context.strokeStyle = strokeColor, "undefined" == typeof maxWidth ? context.strokeText(text, x, y) : context.strokeText(text, x, y, maxWidth)), 
                strokeOnly || (context.fillStyle = textColor, "undefined" == typeof maxWidth ? context.fillText(text, x, y) : context.fillText(text, x, y, maxWidth)), 
                context.restore();
            }
            function createPrimarySurface(width, height, rendererCandidates) {
                return SurfaceFactory_1.SurfaceFactory.createPrimarySurface(width, height, rendererCandidates);
            }
            function createBackSurface(width, height, platform, rendererCandidates) {
                return SurfaceFactory_1.SurfaceFactory.createBackSurface(width, height, platform, rendererCandidates);
            }
            RenderingHelper.toTextFromCompositeOperation = toTextFromCompositeOperation, RenderingHelper.drawSystemTextByContext2D = drawSystemTextByContext2D, 
            RenderingHelper.createPrimarySurface = createPrimarySurface, RenderingHelper.createBackSurface = createBackSurface;
        }(RenderingHelper = exports.RenderingHelper || (exports.RenderingHelper = {}));
    }, {
        "./SurfaceFactory": 17,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    17: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var SurfaceFactory, CanvasSurface_1 = require("./CanvasSurface");
        !function(SurfaceFactory) {
            function createPrimarySurface(width, height, rendererCandidates) {
                return new CanvasSurface_1.CanvasSurface(width, height);
            }
            function createBackSurface(width, height, platform, rendererCandidates) {
                return new CanvasSurface_1.CanvasSurface(width, height);
            }
            SurfaceFactory.createPrimarySurface = createPrimarySurface, SurfaceFactory.createBackSurface = createBackSurface;
        }(SurfaceFactory = exports.SurfaceFactory || (exports.SurfaceFactory = {}));
    }, {
        "./CanvasSurface": 13
    } ],
    18: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), InputAbstractHandler = (require("@akashic/akashic-pdi"), 
        /** @class */ function() {
            /**
     * @param inputView inputViewはDOMイベントを設定するHTMLElement
     */
            function InputAbstractHandler(inputView, disablePreventDefault) {
                if (Object.getPrototypeOf && Object.getPrototypeOf(this) === InputAbstractHandler.prototype) throw new Error("InputAbstractHandler is abstract and should not be directly instantiated");
                this.inputView = inputView, this.pointerEventLock = {}, this._xScale = 1, this._yScale = 1, 
                this._disablePreventDefault = !!disablePreventDefault, this.pointTrigger = new g.Trigger();
            }
            // `start()` で設定するDOMイベントをサポートしているかを返す
            // 継承したクラスにおいて、適切なDOMイベントを設定する
            // start() に対応するDOMイベントを開放する
            return InputAbstractHandler.isSupported = function() {
                return !1;
            }, InputAbstractHandler.prototype.start = function() {
                throw new Error("This method is abstract");
            }, InputAbstractHandler.prototype.stop = function() {
                throw new Error("This method is abstract");
            }, InputAbstractHandler.prototype.setScale = function(xScale, yScale) {
                void 0 === yScale && (yScale = xScale), this._xScale = xScale, this._yScale = yScale;
            }, InputAbstractHandler.prototype.pointDown = function(identifier, pagePosition) {
                this.pointTrigger.fire({
                    type: 0,
                    identifier: identifier,
                    offset: this.getOffsetFromEvent(pagePosition)
                }), // downのイベントIDを保存して、moveとupのイベントの抑制をする(ロックする)
                this.pointerEventLock[identifier] = !0;
            }, InputAbstractHandler.prototype.pointMove = function(identifier, pagePosition) {
                this.pointerEventLock.hasOwnProperty(identifier + "") && this.pointTrigger.fire({
                    type: 1,
                    identifier: identifier,
                    offset: this.getOffsetFromEvent(pagePosition)
                });
            }, InputAbstractHandler.prototype.pointUp = function(identifier, pagePosition) {
                this.pointerEventLock.hasOwnProperty(identifier + "") && (this.pointTrigger.fire({
                    type: 2,
                    identifier: identifier,
                    offset: this.getOffsetFromEvent(pagePosition)
                }), // Upが完了したら、Down->Upが完了したとしてロックを外す
                delete this.pointerEventLock[identifier]);
            }, InputAbstractHandler.prototype.getOffsetFromEvent = function(e) {
                // windowの左上を0,0とした時のinputViewのoffset取得する
                var bounding = this.inputView.getBoundingClientRect();
                return {
                    x: (e.pageX - Math.round(window.pageXOffset + bounding.left)) / this._xScale,
                    y: (e.pageY - Math.round(window.pageYOffset + bounding.top)) / this._yScale
                };
            }, InputAbstractHandler.prototype.getScale = function() {
                return {
                    x: this._xScale,
                    y: this._yScale
                };
            }, InputAbstractHandler;
        }());
        exports.InputAbstractHandler = InputAbstractHandler;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine",
        "@akashic/akashic-pdi": 31
    } ],
    19: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var InputAbstractHandler_1 = require("./InputAbstractHandler"), MouseHandler = /** @class */ function(_super) {
            function MouseHandler(inputView, disablePreventDefault) {
                var _this = _super.call(this, inputView, disablePreventDefault) || this, identifier = 1;
                return _this.onMouseDown = function(e) {
                    0 === e.button && (// NOTE: 左クリック以外を受け付けない
                    _this.pointDown(identifier, e), window.addEventListener("mousemove", _this.onMouseMove, !1), 
                    window.addEventListener("mouseup", _this.onMouseUp, !1), _this._disablePreventDefault || (e.stopPropagation(), 
                    e.preventDefault()));
                }, _this.onMouseMove = function(e) {
                    _this.pointMove(identifier, e), _this._disablePreventDefault || (e.stopPropagation(), 
                    e.preventDefault());
                }, _this.onMouseUp = function(e) {
                    _this.pointUp(identifier, e), window.removeEventListener("mousemove", _this.onMouseMove, !1), 
                    window.removeEventListener("mouseup", _this.onMouseUp, !1), _this._disablePreventDefault || (e.stopPropagation(), 
                    e.preventDefault());
                }, _this;
            }
            return __extends(MouseHandler, _super), MouseHandler.isSupported = function() {
                return !0;
            }, MouseHandler.prototype.start = function() {
                this.inputView.addEventListener("mousedown", this.onMouseDown, !1);
            }, MouseHandler.prototype.stop = function() {
                this.inputView.removeEventListener("mousedown", this.onMouseDown, !1);
            }, MouseHandler;
        }(InputAbstractHandler_1.InputAbstractHandler);
        exports.MouseHandler = MouseHandler;
    }, {
        "./InputAbstractHandler": 18
    } ],
    20: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var MouseHandler_1 = require("./MouseHandler"), RuntimeInfo_1 = require("../RuntimeInfo"), TouchHandler = /** @class */ function(_super) {
            function TouchHandler(inputView, disablePreventDefault) {
                var _this = _super.call(this, inputView, disablePreventDefault) || this;
                return _this.onTouchDown = function(e) {
                    for (var touches = e.changedTouches, i = 0, len = touches.length; len > i; i++) {
                        var touch = touches[i];
                        _this.pointDown(touch.identifier, touch);
                    }
                    _this._disablePreventDefault || (e.stopPropagation(), e.preventDefault());
                }, _this.onTouchMove = function(e) {
                    for (var touches = e.changedTouches, i = 0, len = touches.length; len > i; i++) {
                        var touch = touches[i];
                        _this.pointMove(touch.identifier, touch);
                    }
                    _this._disablePreventDefault || (e.stopPropagation(), e.preventDefault());
                }, _this.onTouchUp = function(e) {
                    for (var touches = e.changedTouches, i = 0, len = touches.length; len > i; i++) {
                        var touch = touches[i];
                        _this.pointUp(touch.identifier, touch);
                    }
                    _this._disablePreventDefault || (e.stopPropagation(), e.preventDefault());
                }, _this;
            }
            return __extends(TouchHandler, _super), TouchHandler.isSupported = function() {
                return RuntimeInfo_1.RuntimeInfo.touchEnabled();
            }, TouchHandler.prototype.start = function() {
                _super.prototype.start.call(this), this.inputView.addEventListener("touchstart", this.onTouchDown), 
                this.inputView.addEventListener("touchmove", this.onTouchMove), this.inputView.addEventListener("touchend", this.onTouchUp);
            }, TouchHandler.prototype.stop = function() {
                _super.prototype.stop.call(this), this.inputView.removeEventListener("touchstart", this.onTouchDown), 
                this.inputView.removeEventListener("touchmove", this.onTouchMove), this.inputView.removeEventListener("touchend", this.onTouchUp);
            }, TouchHandler;
        }(MouseHandler_1.MouseHandler);
        exports.TouchHandler = TouchHandler;
    }, {
        "../RuntimeInfo": 7,
        "./MouseHandler": 19
    } ],
    21: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        /*
 Audioプラグインを登録し、現在登録しているプラグインを管理するクラス
 仕様は docs/audio-plugin.md を参照

 TODO: 各Gameインスタンスが一つのAudioプラグインしか持たないので、
 PluginManagerが状態をもたずにGame自体にpluginを登録する方式もあり
 */
        var AudioPluginManager = /** @class */ function() {
            function AudioPluginManager() {
                this._activePlugin = void 0;
            }
            // Audioプラグインに登録を行い、どれか一つでも成功ならtrue、それ以外はfalseを返す
            return AudioPluginManager.prototype.getActivePlugin = function() {
                return void 0 === this._activePlugin ? null : this._activePlugin;
            }, AudioPluginManager.prototype.tryInstallPlugin = function(plugins) {
                var PluginConstructor = this.findFirstAvailablePlugin(plugins);
                return PluginConstructor ? (this._activePlugin = new PluginConstructor(), !0) : !1;
            }, AudioPluginManager.prototype.findFirstAvailablePlugin = function(plugins) {
                for (var i = 0, len = plugins.length; len > i; i++) {
                    // Step 1
                    var plugin = plugins[i];
                    // Step 2
                    if (plugin.isSupported()) return plugin;
                }
            }, AudioPluginManager;
        }();
        exports.AudioPluginManager = AudioPluginManager;
    }, {} ],
    22: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var audioPlugins = [];
        exports.AudioPluginRegistry = {
            addPlugin: function(plugin) {
                -1 === audioPlugins.indexOf(plugin) && audioPlugins.push(plugin);
            },
            getRegisteredAudioPlugins: function() {
                return audioPlugins;
            },
            clear: function() {
                audioPlugins = [];
            }
        };
    }, {} ],
    23: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), HTMLAudioAsset = /** @class */ function(_super) {
            function HTMLAudioAsset() {
                return null !== _super && _super.apply(this, arguments) || this;
            }
            return __extends(HTMLAudioAsset, _super), HTMLAudioAsset.prototype._load = function(loader) {
                var _this = this;
                if (null == this.path) // 再生可能な形式がない。実際には鳴らない音声としてロード成功しておく
                return this.data = null, void setTimeout(function() {
                    return loader._onAssetLoad(_this);
                }, 0);
                var audio = new Audio(), startLoadingAudio = function(path, handlers) {
                    // autoplay は preload よりも優先されるため明示的にfalseとする
                    audio.autoplay = !1, audio.preload = "none", audio.src = path, _this._attachAll(audio, handlers), 
                    /* tslint:disable */
                    // Firefoxはpreload="auto"でないと読み込みされない
                    // preloadはブラウザに対するHint属性なので、どう扱うかはブラウザの実装次第となる
                    // https://html.spec.whatwg.org/multipage/embedded-content.html#attr-media-preload
                    // https://developer.mozilla.org/ja/docs/Web/HTML/Element/audio#attr-preload
                    // https://github.com/CreateJS/SoundJS/blob/e2d4842a84ff425ada861edb9f6e9b57f63d7caf/src/soundjs/htmlaudio/HTMLAudioSoundInstance.js#L147-147
                    /* tslint:enable:max-line-length */
                    audio.preload = "auto", setAudioLoadInterval(audio, handlers), audio.load();
                }, handlers = {
                    success: function() {
                        _this._detachAll(audio, handlers), _this.data = audio, loader._onAssetLoad(_this), 
                        window.clearInterval(_this._intervalId);
                    },
                    error: function() {
                        _this._detachAll(audio, handlers), _this.data = audio, loader._onAssetError(_this, g.ExceptionFactory.createAssetLoadError("HTMLAudioAsset loading error")), 
                        window.clearInterval(_this._intervalId);
                    }
                }, setAudioLoadInterval = function(audio, handlers) {
                    // IE11において、canplaythroughイベントが正常に発火しない問題が確認されたため、その対処として以下の処理を行っている。
                    // なお、canplaythroughはreadyStateの値が4になった時点で呼び出されるイベントである。
                    // インターバルとして指定している100msに根拠は無い。
                    _this._intervalCount = 0, _this._intervalId = window.setInterval(function() {
                        4 === audio.readyState ? handlers.success() : (++_this._intervalCount, // readyStateの値が4にならない状態が1分（100ms×600）続いた場合、
                        // 読み込みに失敗したとする。1分という時間に根拠は無い。
                        600 === _this._intervalCount && handlers.error());
                    }, 100);
                };
                // 暫定対応：後方互換性のため、aacファイルが無い場合はmp4へのフォールバックを試みる。
                // この対応を止める際には、HTMLAudioPluginのsupportedExtensionsからaacを除外する必要がある。
                if (".aac" === this.path.slice(-4) && -1 !== HTMLAudioAsset.supportedFormats.indexOf("mp4")) {
                    var altHandlers = {
                        success: handlers.success,
                        error: function() {
                            _this._detachAll(audio, altHandlers), window.clearInterval(_this._intervalId);
                            var altPath = _this.path.slice(0, _this.path.length - 4) + ".mp4";
                            startLoadingAudio(altPath, handlers);
                        }
                    };
                    return void startLoadingAudio(this.path, altHandlers);
                }
                startLoadingAudio(this.path, handlers);
            }, HTMLAudioAsset.prototype.cloneElement = function() {
                return this.data ? new Audio(this.data.src) : null;
            }, HTMLAudioAsset.prototype._assetPathFilter = function(path) {
                return -1 !== HTMLAudioAsset.supportedFormats.indexOf("ogg") ? g.PathUtil.addExtname(path, "ogg") : -1 !== HTMLAudioAsset.supportedFormats.indexOf("aac") ? g.PathUtil.addExtname(path, "aac") : null;
            }, HTMLAudioAsset.prototype._attachAll = function(audio, handlers) {
                handlers.success && /* tslint:disable:max-line-length */
                // https://developer.mozilla.org/en-US/docs/Web/Events/canplaythrough
                // https://github.com/goldfire/howler.js/blob/1dad25cdd9d6982232050454e8b45411902efe65/howler.js#L372
                // https://github.com/CreateJS/SoundJS/blob/e2d4842a84ff425ada861edb9f6e9b57f63d7caf/src/soundjs/htmlaudio/HTMLAudioSoundInstance.js#L145-145
                /* tslint:enable:max-line-length */
                audio.addEventListener("canplaythrough", handlers.success, !1), handlers.error && (// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
                // stalledはfetchして取れなかった時に起きるイベント
                audio.addEventListener("stalled", handlers.error, !1), audio.addEventListener("error", handlers.error, !1), 
                audio.addEventListener("abort", handlers.error, !1));
            }, HTMLAudioAsset.prototype._detachAll = function(audio, handlers) {
                handlers.success && audio.removeEventListener("canplaythrough", handlers.success, !1), 
                handlers.error && (audio.removeEventListener("stalled", handlers.error, !1), audio.removeEventListener("error", handlers.error, !1), 
                audio.removeEventListener("abort", handlers.error, !1));
            }, HTMLAudioAsset;
        }(g.AudioAsset);
        exports.HTMLAudioAsset = HTMLAudioAsset;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    24: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), HTMLAudioPlayer = /** @class */ function(_super) {
            function HTMLAudioPlayer(system, manager) {
                var _this = _super.call(this, system) || this;
                return _this._manager = manager, _this._endedEventHandler = function() {
                    _this._onAudioEnded();
                }, _this._onPlayEventHandler = function() {
                    _this._onPlayEvent();
                }, _this._dummyDurationWaitTimer = null, _this;
            }
            // audio.play() は非同期なので、 play が開始される前に stop を呼ばれた場合はこのハンドラ到達時に停止する
            return __extends(HTMLAudioPlayer, _super), HTMLAudioPlayer.prototype.play = function(asset) {
                this.currentAudio && this.stop();
                var audio = asset.cloneElement();
                audio ? (audio.volume = this.volume * this._system.volume * this._manager.getMasterVolume(), 
                audio.play(), audio.loop = asset.loop, audio.addEventListener("ended", this._endedEventHandler, !1), 
                audio.addEventListener("play", this._onPlayEventHandler, !1), this._isWaitingPlayEvent = !0, 
                this._audioInstance = audio) : // 再生できるオーディオがない場合。duration後に停止処理だけ行う(処理のみ進め音は鳴らさない)
                this._dummyDurationWaitTimer = setTimeout(this._endedEventHandler, asset.duration), 
                _super.prototype.play.call(this, asset);
            }, HTMLAudioPlayer.prototype.stop = function() {
                this.currentAudio && (this._clearEndedEventHandler(), this._audioInstance && (this._isWaitingPlayEvent ? this._isStopRequested = !0 : (// _audioInstance が再び play されることは無いので、 removeEventListener("play") する必要は無い
                this._audioInstance.pause(), this._audioInstance = null)), _super.prototype.stop.call(this));
            }, HTMLAudioPlayer.prototype.changeVolume = function(volume) {
                this._audioInstance && (this._audioInstance.volume = volume * this._system.volume * this._manager.getMasterVolume()), 
                _super.prototype.changeVolume.call(this, volume);
            }, HTMLAudioPlayer.prototype.notifyMasterVolumeChanged = function() {
                this._audioInstance && (this._audioInstance.volume = this.volume * this._system.volume * this._manager.getMasterVolume());
            }, HTMLAudioPlayer.prototype._onAudioEnded = function() {
                this._clearEndedEventHandler(), _super.prototype.stop.call(this);
            }, HTMLAudioPlayer.prototype._clearEndedEventHandler = function() {
                this._audioInstance && this._audioInstance.removeEventListener("ended", this._endedEventHandler, !1), 
                null != this._dummyDurationWaitTimer && (clearTimeout(this._dummyDurationWaitTimer), 
                this._dummyDurationWaitTimer = null);
            }, HTMLAudioPlayer.prototype._onPlayEvent = function() {
                this._isWaitingPlayEvent && (this._isWaitingPlayEvent = !1, this._isStopRequested && (this._isStopRequested = !1, 
                // _audioInstance が再び play されることは無いので、 removeEventListener("play") する必要は無い
                this._audioInstance.pause(), this._audioInstance = null));
            }, HTMLAudioPlayer;
        }(g.AudioPlayer);
        exports.HTMLAudioPlayer = HTMLAudioPlayer;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    25: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var HTMLAudioAsset_1 = require("./HTMLAudioAsset"), HTMLAudioPlayer_1 = require("./HTMLAudioPlayer"), HTMLAudioPlugin = /** @class */ function() {
            function HTMLAudioPlugin() {
                this._supportedFormats = this._detectSupportedFormats(), HTMLAudioAsset_1.HTMLAudioAsset.supportedFormats = this.supportedFormats;
            }
            // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
            // https://github.com/CreateJS/SoundJS/blob/master/src/soundjs/htmlaudio/HTMLAudioPlugin.js
            /* tslint:enable:typedef */
            return HTMLAudioPlugin.isSupported = function() {
                // Audio要素を実際に作って、canPlayTypeが存在するかで確認する
                var audioElement = document.createElement("audio"), result = !1;
                try {
                    result = void 0 !== audioElement.canPlayType;
                } catch (e) {}
                return result;
            }, Object.defineProperty(HTMLAudioPlugin.prototype, "supportedFormats", {
                get: function() {
                    return this._supportedFormats;
                },
                // TSLintのバグ - setterはreturn typeを書くとコンパイルエラー
                /* tslint:disable:typedef */
                // HTMLAudioAssetへ反映させるためsetterとする
                set: function(supportedFormats) {
                    this._supportedFormats = supportedFormats, HTMLAudioAsset_1.HTMLAudioAsset.supportedFormats = supportedFormats;
                },
                enumerable: !0,
                configurable: !0
            }), HTMLAudioPlugin.prototype.createAsset = function(id, assetPath, duration, system, loop, hint) {
                return new HTMLAudioAsset_1.HTMLAudioAsset(id, assetPath, duration, system, loop, hint);
            }, HTMLAudioPlugin.prototype.createPlayer = function(system, manager) {
                return new HTMLAudioPlayer_1.HTMLAudioPlayer(system, manager);
            }, HTMLAudioPlugin.prototype._detectSupportedFormats = function() {
                // Edgeは再生できるファイル形式とcanPlayTypeの結果が一致しないため、固定でAACを利用する
                if (-1 !== navigator.userAgent.indexOf("Edge/")) return [ "aac" ];
                // Audio要素を実際に作って、canPlayTypeで再生できるかを判定する
                var audioElement = document.createElement("audio"), supportedFormats = [];
                try {
                    for (var supportedExtensions = [ "ogg", "aac", "mp4" ], i = 0, len = supportedExtensions.length; len > i; i++) {
                        var ext = supportedExtensions[i], supported = "no" !== audioElement.canPlayType("audio/" + ext) && "" !== audioElement.canPlayType("audio/" + ext);
                        supported && supportedFormats.push(ext);
                    }
                } catch (e) {}
                return supportedFormats;
            }, HTMLAudioPlugin;
        }();
        exports.HTMLAudioPlugin = HTMLAudioPlugin;
    }, {
        "./HTMLAudioAsset": 23,
        "./HTMLAudioPlayer": 24
    } ],
    26: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), XHRLoader_1 = require("../../utils/XHRLoader"), helper = require("./WebAudioHelper"), WebAudioAsset = /** @class */ function(_super) {
            function WebAudioAsset() {
                return null !== _super && _super.apply(this, arguments) || this;
            }
            // _assetPathFilterの判定処理を小さくするため、予めサポートしてる拡張子一覧を持つ
            return __extends(WebAudioAsset, _super), WebAudioAsset.prototype._load = function(loader) {
                var _this = this;
                if (null == this.path) // 再生可能な形式がない。実際には鳴らない音声としてロード成功しておく
                return this.data = null, void setTimeout(function() {
                    return loader._onAssetLoad(_this);
                }, 0);
                var successHandler = function(decodedAudio) {
                    _this.data = decodedAudio, loader._onAssetLoad(_this);
                }, errorHandler = function() {
                    loader._onAssetError(_this, g.ExceptionFactory.createAssetLoadError("WebAudioAsset unknown loading error"));
                }, onLoadArrayBufferHandler = function(response) {
                    var audioContext = helper.getAudioContext();
                    audioContext.decodeAudioData(response, successHandler, errorHandler);
                }, xhrLoader = new XHRLoader_1.XHRLoader(), loadArrayBuffer = function(path, onSuccess, onFailed) {
                    xhrLoader.getArrayBuffer(path, function(error, response) {
                        error ? onFailed(error) : onSuccess(response);
                    });
                };
                // 暫定対応：後方互換性のため、aacファイルが無い場合はmp4へのフォールバックを試みる。
                // この対応を止める際には、WebAudioPluginのsupportedExtensionsからaacを除外する必要がある。
                return ".aac" === this.path.slice(-4) ? void loadArrayBuffer(this.path, onLoadArrayBufferHandler, function(error) {
                    var altPath = _this.path.slice(0, _this.path.length - 4) + ".mp4";
                    loadArrayBuffer(altPath, function(response) {
                        _this.path = altPath, onLoadArrayBufferHandler(response);
                    }, errorHandler);
                }) : void loadArrayBuffer(this.path, onLoadArrayBufferHandler, errorHandler);
            }, WebAudioAsset.prototype._assetPathFilter = function(path) {
                return -1 !== WebAudioAsset.supportedFormats.indexOf("ogg") ? g.PathUtil.addExtname(path, "ogg") : -1 !== WebAudioAsset.supportedFormats.indexOf("aac") ? g.PathUtil.addExtname(path, "aac") : null;
            }, WebAudioAsset.supportedFormats = [], WebAudioAsset;
        }(g.AudioAsset);
        exports.WebAudioAsset = WebAudioAsset;
    }, {
        "../../utils/XHRLoader": 30,
        "./WebAudioHelper": 27,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    27: [ function(require, module, exports) {
        "use strict";
        // WebAudioのブラウザ間の差を吸収する
        // Compatible Table: http://compatibility.shwups-cms.ch/en/home?&property=AudioParam.prototype
        // http://qiita.com/mohayonao/items/d79e9fc56b4e9c157be1#polyfill
        // https://github.com/cwilso/webkitAudioContext-MonkeyPatch
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Porting_webkitAudioContext_code_to_standards_based_AudioContext
        var WebAudioHelper, AudioContext = window.AudioContext || window.webkitAudioContext, singleContext = null;
        !function(WebAudioHelper) {
            // AudioContextをシングルトンとして取得する
            // 一つのページに一つのContextが存在すれば良い
            function getAudioContext() {
                return singleContext || (singleContext = new AudioContext()), singleContext;
            }
            function createGainNode(context) {
                return context.createGain ? context.createGain() : context.createGainNode();
            }
            function createBufferNode(context) {
                var sourceNode = context.createBufferSource();
                // startがあるなら問題ないので、拡張しないで返す
                // startがあるなら問題ないので、拡張しないで返す
                // start/stopがない環境へのエイリアスを貼る
                return sourceNode.start ? sourceNode : (sourceNode.start = sourceNode.noteOn, sourceNode.stop = sourceNode.noteOff, 
                sourceNode);
            }
            WebAudioHelper.getAudioContext = getAudioContext, WebAudioHelper.createGainNode = createGainNode, 
            WebAudioHelper.createBufferNode = createBufferNode;
        }(WebAudioHelper || (WebAudioHelper = {})), module.exports = WebAudioHelper;
    }, {} ],
    28: [ function(require, module, exports) {
        "use strict";
        var __extends = this && this.__extends || function() {
            var extendStatics = Object.setPrototypeOf || {
                __proto__: []
            } instanceof Array && function(d, b) {
                d.__proto__ = b;
            } || function(d, b) {
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
            };
            return function(d, b) {
                function __() {
                    this.constructor = d;
                }
                extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                new __());
            };
        }();
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), helper = require("./WebAudioHelper"), WebAudioPlayer = /** @class */ function(_super) {
            function WebAudioPlayer(system, manager) {
                var _this = _super.call(this, system) || this;
                return _this._audioContext = helper.getAudioContext(), _this._manager = manager, 
                _this._gainNode = helper.createGainNode(_this._audioContext), _this._gainNode.connect(_this._audioContext.destination), 
                _this._sourceNode = void 0, _this._dummyDurationWaitTimer = null, _this._endedEventHandler = function() {
                    _this._onAudioEnded();
                }, _this;
            }
            return __extends(WebAudioPlayer, _super), WebAudioPlayer.prototype.changeVolume = function(volume) {
                this._gainNode.gain.value = volume * this._system.volume * this._manager.getMasterVolume(), 
                _super.prototype.changeVolume.call(this, volume);
            }, WebAudioPlayer.prototype.play = function(asset) {
                if (this.currentAudio && this.stop(), asset.data) {
                    var bufferNode = helper.createBufferNode(this._audioContext);
                    bufferNode.loop = asset.loop, bufferNode.buffer = asset.data, this._gainNode.gain.value = this.volume * this._system.volume * this._manager.getMasterVolume(), 
                    bufferNode.connect(this._gainNode), this._sourceNode = bufferNode, // Chromeだとevent listerで指定した場合に動かないことがある
                    // https://github.com/mozilla-appmaker/appmaker/issues/1984
                    this._sourceNode.onended = this._endedEventHandler, this._sourceNode.start(0);
                } else // 再生できるオーディオがない場合。duration後に停止処理だけ行う(処理のみ進め音は鳴らさない)
                this._dummyDurationWaitTimer = setTimeout(this._endedEventHandler, asset.duration);
                _super.prototype.play.call(this, asset);
            }, WebAudioPlayer.prototype.stop = function() {
                this.currentAudio && (this._clearEndedEventHandler(), this._sourceNode && this._sourceNode.stop(0), 
                _super.prototype.stop.call(this));
            }, WebAudioPlayer.prototype.notifyMasterVolumeChanged = function() {
                this._gainNode.gain.value = this.volume * this._system.volume * this._manager.getMasterVolume();
            }, WebAudioPlayer.prototype._onAudioEnded = function() {
                this._clearEndedEventHandler(), _super.prototype.stop.call(this);
            }, WebAudioPlayer.prototype._clearEndedEventHandler = function() {
                this._sourceNode && (this._sourceNode.onended = null), null != this._dummyDurationWaitTimer && (clearTimeout(this._dummyDurationWaitTimer), 
                this._dummyDurationWaitTimer = null);
            }, WebAudioPlayer;
        }(g.AudioPlayer);
        exports.WebAudioPlayer = WebAudioPlayer;
    }, {
        "./WebAudioHelper": 27,
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    29: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var WebAudioAsset_1 = require("./WebAudioAsset"), WebAudioPlayer_1 = require("./WebAudioPlayer"), WebAudioPlugin = /** @class */ function() {
            /* tslint:enable:typedef */
            function WebAudioPlugin() {
                this.supportedFormats = this._detectSupportedFormats();
            }
            // AudioContextが存在するかどうかで判定する
            // http://mohayonao.hatenablog.com/entry/2012/12/12/103009
            // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio/webaudio.js
            return WebAudioPlugin.isSupported = function() {
                return "AudioContext" in window ? !0 : "webkitAudioContext" in window ? !0 : !1;
            }, Object.defineProperty(WebAudioPlugin.prototype, "supportedFormats", {
                get: function() {
                    return this._supportedFormats;
                },
                // TSLintのバグ - setterはreturn typeを書くとコンパイルエラーとなる
                /* tslint:disable:typedef */
                // WebAudioAssetへサポートしているフォーマット一覧を渡す
                set: function(supportedFormats) {
                    this._supportedFormats = supportedFormats, WebAudioAsset_1.WebAudioAsset.supportedFormats = supportedFormats;
                },
                enumerable: !0,
                configurable: !0
            }), WebAudioPlugin.prototype.createAsset = function(id, assetPath, duration, system, loop, hint) {
                return new WebAudioAsset_1.WebAudioAsset(id, assetPath, duration, system, loop, hint);
            }, WebAudioPlugin.prototype.createPlayer = function(system, manager) {
                return new WebAudioPlayer_1.WebAudioPlayer(system, manager);
            }, WebAudioPlugin.prototype._detectSupportedFormats = function() {
                // Edgeは再生できるファイル形式とcanPlayTypeの結果が一致しないため、固定でAACを利用する
                if (-1 !== navigator.userAgent.indexOf("Edge/")) return [ "aac" ];
                // Audio要素を実際に作って、canPlayTypeで再生できるかを判定する
                var audioElement = document.createElement("audio"), supportedFormats = [];
                try {
                    for (var supportedExtensions = [ "ogg", "aac", "mp4" ], i = 0, len = supportedExtensions.length; len > i; i++) {
                        var ext = supportedExtensions[i], supported = "no" !== audioElement.canPlayType("audio/" + ext) && "" !== audioElement.canPlayType("audio/" + ext);
                        supported && supportedFormats.push(ext);
                    }
                } catch (e) {}
                return supportedFormats;
            }, WebAudioPlugin;
        }();
        exports.WebAudioPlugin = WebAudioPlugin;
    }, {
        "./WebAudioAsset": 26,
        "./WebAudioPlayer": 28
    } ],
    30: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var g = require("@akashic/akashic-engine"), XHRLoader = /** @class */ function() {
            function XHRLoader(options) {
                void 0 === options && (options = {}), // デフォルトのタイムアウトは15秒
                // TODO: タイムアウト値はこれが妥当であるか後日詳細を検討する
                this.timeout = options.timeout || 15e3;
            }
            return XHRLoader.prototype.get = function(url, callback) {
                this._getRequestObject({
                    url: url,
                    responseType: "text"
                }, callback);
            }, XHRLoader.prototype.getArrayBuffer = function(url, callback) {
                this._getRequestObject({
                    url: url,
                    responseType: "arraybuffer"
                }, callback);
            }, XHRLoader.prototype._getRequestObject = function(requestObject, callback) {
                var request = new XMLHttpRequest();
                request.open("GET", requestObject.url, !0), request.responseType = requestObject.responseType, 
                request.timeout = this.timeout, request.addEventListener("timeout", function() {
                    callback(g.ExceptionFactory.createAssetLoadError("loading timeout"));
                }, !1), request.addEventListener("load", function() {
                    if (request.status >= 200 && request.status < 300) {
                        // "text" とそれ以外で取得方法を分類する
                        var response = "text" === requestObject.responseType ? request.responseText : request.response;
                        callback(null, response);
                    } else callback(g.ExceptionFactory.createAssetLoadError("loading error. status: " + request.status));
                }, !1), request.addEventListener("error", function() {
                    callback(g.ExceptionFactory.createAssetLoadError("loading error. status: " + request.status));
                }, !1), request.send();
            }, XHRLoader;
        }();
        exports.XHRLoader = XHRLoader;
    }, {
        "@akashic/akashic-engine": "@akashic/akashic-engine"
    } ],
    31: [ function(require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, {} ]
}, {}, []);