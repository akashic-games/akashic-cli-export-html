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
    "@akashic/akashic-engine": [ function(require, module, exports) {
        (function() {
            "use strict";
            var g, __extends = this && this.__extends || function(d, b) {
                function __() {
                    this.constructor = d;
                }
                for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
                d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
            };
            !function(g) {
                var AssetLoadErrorType;
                !function(AssetLoadErrorType) {
                    AssetLoadErrorType[AssetLoadErrorType.Unspecified = 0] = "Unspecified", AssetLoadErrorType[AssetLoadErrorType.RetryLimitExceeded = 1] = "RetryLimitExceeded", 
                    AssetLoadErrorType[AssetLoadErrorType.NetworkError = 2] = "NetworkError", AssetLoadErrorType[AssetLoadErrorType.ClientError = 3] = "ClientError", 
                    AssetLoadErrorType[AssetLoadErrorType.ServerError = 4] = "ServerError";
                }(AssetLoadErrorType = g.AssetLoadErrorType || (g.AssetLoadErrorType = {}));
            }(g || (g = {}));
            var g;
            !function(g) {
                var ExceptionFactory;
                !function(ExceptionFactory) {
                    function createPureVirtualError(methodName, cause) {
                        var e = new Error(methodName + " has no implementation.");
                        return e.name = "PureVirtualError", e.cause = cause, e;
                    }
                    function createAssertionError(message, cause) {
                        var e = new Error(message);
                        return e.name = "AssertionError", e.cause = cause, e;
                    }
                    function createTypeMismatchError(methodName, expected, actual, cause) {
                        var message = "Type mismatch on " + methodName + ", expected type is " + expected;
                        if (arguments.length > 2) try {
                            var actualString;
                            actualString = actual && actual.constructor && actual.constructor.name ? actual.constructor.name : typeof actual, 
                            message += ", actual type is " + (actualString.length > 40 ? actualString.substr(0, 40) : actualString);
                        } catch (ex) {}
                        message += ".";
                        var e = new Error(message);
                        return e.name = "TypeMismatchError", e.cause = cause, e.expected = expected, e.actual = actual, 
                        e;
                    }
                    function createAssetLoadError(message, retriable, type, cause) {
                        void 0 === retriable && (retriable = !0), void 0 === type && (type = g.AssetLoadErrorType.Unspecified);
                        var e = new Error(message);
                        return e.name = "AssetLoadError", e.cause = cause, e.retriable = retriable, e.type = type, 
                        e;
                    }
                    ExceptionFactory.createPureVirtualError = createPureVirtualError, ExceptionFactory.createAssertionError = createAssertionError, 
                    ExceptionFactory.createTypeMismatchError = createTypeMismatchError, ExceptionFactory.createAssetLoadError = createAssetLoadError;
                }(ExceptionFactory = g.ExceptionFactory || (g.ExceptionFactory = {}));
            }(g || (g = {}));
            var g;
            !function(g) {
                var ResourceFactory = function() {
                    function ResourceFactory() {}
                    return ResourceFactory.prototype.createImageAsset = function(id, assetPath, width, height) {
                        throw g.ExceptionFactory.createPureVirtualError("ResourceFactory#createImageAsset");
                    }, ResourceFactory.prototype.createVideoAsset = function(id, assetPath, width, height, system, loop, useRealSize) {
                        throw g.ExceptionFactory.createPureVirtualError("ResourceFactory#createVideoAsset");
                    }, ResourceFactory.prototype.createAudioAsset = function(id, assetPath, duration, system, loop, hint) {
                        throw g.ExceptionFactory.createPureVirtualError("ResourceFactory#createAudioAsset");
                    }, ResourceFactory.prototype.createTextAsset = function(id, assetPath) {
                        throw g.ExceptionFactory.createPureVirtualError("ResourceFactory#createTextAsset");
                    }, ResourceFactory.prototype.createAudioPlayer = function(system) {
                        throw g.ExceptionFactory.createPureVirtualError("ResourceFactory#createAudioPlayer");
                    }, ResourceFactory.prototype.createScriptAsset = function(id, assetPath) {
                        throw g.ExceptionFactory.createPureVirtualError("ResourceFactory#createScriptAsset");
                    }, ResourceFactory.prototype.createSurface = function(width, height) {
                        throw g.ExceptionFactory.createPureVirtualError("ResourceFactory#createSurface");
                    }, ResourceFactory.prototype.createGlyphFactory = function(fontFamily, fontSize, baselineHeight, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) {
                        throw g.ExceptionFactory.createPureVirtualError("ResourceFactory#createGlphFactory");
                    }, ResourceFactory.prototype.createSurfaceAtlas = function(width, height) {
                        return new g.SurfaceAtlas(this.createSurface(width, height));
                    }, ResourceFactory;
                }();
                g.ResourceFactory = ResourceFactory;
            }(g || (g = {}));
            var g;
            !function(g) {
                var RequireCachedValue = function() {
                    function RequireCachedValue(value) {
                        this._value = value;
                    }
                    return RequireCachedValue.prototype._cachedValue = function() {
                        return this._value;
                    }, RequireCachedValue;
                }();
                g.RequireCachedValue = RequireCachedValue;
            }(g || (g = {}));
            var g;
            !function(g) {
                var RandomGenerator = function() {
                    function RandomGenerator(seed) {
                        this.seed = seed;
                    }
                    return RandomGenerator.prototype.get = function(min, max) {
                        throw g.ExceptionFactory.createPureVirtualError("RandomGenerator#get");
                    }, RandomGenerator.prototype.serialize = function() {
                        throw g.ExceptionFactory.createPureVirtualError("RandomGenerator#serialize");
                    }, RandomGenerator;
                }();
                g.RandomGenerator = RandomGenerator;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Asset = function() {
                    function Asset(id, path) {
                        this.id = id, this.originalPath = path, this.path = this._assetPathFilter(path);
                    }
                    return Asset.prototype.destroy = function() {
                        this.id = void 0, this.originalPath = void 0, this.path = void 0;
                    }, Asset.prototype.destroyed = function() {
                        return void 0 === this.id;
                    }, Asset.prototype.inUse = function() {
                        return !1;
                    }, Asset.prototype._load = function(loader) {
                        throw g.ExceptionFactory.createPureVirtualError("Asset#_load");
                    }, Asset.prototype._assetPathFilter = function(path) {
                        return path;
                    }, Asset;
                }();
                g.Asset = Asset;
                var ImageAsset = function(_super) {
                    function ImageAsset(id, assetPath, width, height) {
                        var _this = _super.call(this, id, assetPath) || this;
                        return _this.width = width, _this.height = height, _this;
                    }
                    return __extends(ImageAsset, _super), ImageAsset.prototype.asSurface = function() {
                        throw g.ExceptionFactory.createPureVirtualError("ImageAsset#asSurface");
                    }, ImageAsset;
                }(Asset);
                g.ImageAsset = ImageAsset;
                var VideoAsset = function(_super) {
                    function VideoAsset(id, assetPath, width, height, system, loop, useRealSize) {
                        var _this = _super.call(this, id, assetPath, width, height) || this;
                        return _this.realWidth = 0, _this.realHeight = 0, _this._system = system, _this._loop = loop, 
                        _this._useRealSize = useRealSize, _this;
                    }
                    return __extends(VideoAsset, _super), VideoAsset.prototype.asSurface = function() {
                        throw g.ExceptionFactory.createPureVirtualError("VideoAsset#asSurface");
                    }, VideoAsset.prototype.play = function(loop) {
                        return this.getPlayer().play(this), this.getPlayer();
                    }, VideoAsset.prototype.stop = function() {
                        this.getPlayer().stop();
                    }, VideoAsset.prototype.getPlayer = function() {
                        throw g.ExceptionFactory.createPureVirtualError("VideoAsset#getPlayer");
                    }, VideoAsset.prototype.destroy = function() {
                        this._system = void 0, _super.prototype.destroy.call(this);
                    }, VideoAsset;
                }(ImageAsset);
                g.VideoAsset = VideoAsset;
                var AudioAsset = function(_super) {
                    function AudioAsset(id, assetPath, duration, system, loop, hint) {
                        var _this = _super.call(this, id, assetPath) || this;
                        return _this.duration = duration, _this.loop = loop, _this.hint = hint, _this._system = system, 
                        _this.data = void 0, _this;
                    }
                    return __extends(AudioAsset, _super), AudioAsset.prototype.play = function() {
                        var player = this._system.createPlayer();
                        return player.play(this), player;
                    }, AudioAsset.prototype.stop = function() {
                        for (var players = this._system.findPlayers(this), i = 0; i < players.length; ++i) players[i].stop();
                    }, AudioAsset.prototype.inUse = function() {
                        return this._system.findPlayers(this).length > 0;
                    }, AudioAsset.prototype.destroy = function() {
                        this._system && this.stop(), this.data = void 0, this._system = void 0, _super.prototype.destroy.call(this);
                    }, AudioAsset;
                }(Asset);
                g.AudioAsset = AudioAsset;
                var TextAsset = function(_super) {
                    function TextAsset(id, assetPath) {
                        var _this = _super.call(this, id, assetPath) || this;
                        return _this.data = void 0, _this;
                    }
                    return __extends(TextAsset, _super), TextAsset.prototype.destroy = function() {
                        this.data = void 0, _super.prototype.destroy.call(this);
                    }, TextAsset;
                }(Asset);
                g.TextAsset = TextAsset;
                var ScriptAsset = function(_super) {
                    function ScriptAsset() {
                        return null !== _super && _super.apply(this, arguments) || this;
                    }
                    return __extends(ScriptAsset, _super), ScriptAsset.prototype.execute = function(execEnv) {
                        throw g.ExceptionFactory.createPureVirtualError("ScriptAsset#execute");
                    }, ScriptAsset.prototype.destroy = function() {
                        this.script = void 0, _super.prototype.destroy.call(this);
                    }, ScriptAsset;
                }(Asset);
                g.ScriptAsset = ScriptAsset;
            }(g || (g = {}));
            var g;
            !function(g) {
                function normalizeAudioSystemConfMap(confMap) {
                    confMap = confMap || {};
                    var systemDefaults = {
                        music: {
                            loop: !0,
                            hint: {
                                streaming: !0
                            }
                        },
                        sound: {
                            loop: !1,
                            hint: {
                                streaming: !1
                            }
                        }
                    };
                    for (var key in systemDefaults) key in confMap || (confMap[key] = systemDefaults[key]);
                    return confMap;
                }
                var AssetLoadingInfo = function() {
                    function AssetLoadingInfo(asset, handler) {
                        this.asset = asset, this.handlers = [ handler ], this.errorCount = 0, this.loading = !1;
                    }
                    return AssetLoadingInfo;
                }(), AssetManager = function() {
                    function AssetManager(game, conf, audioSystemConfMap) {
                        this.game = game, this.configuration = this._normalize(conf || {}, normalizeAudioSystemConfMap(audioSystemConfMap)), 
                        this._assets = {}, this._liveAssetVirtualPathTable = {}, this._liveAbsolutePathTable = {}, 
                        this._refCounts = {}, this._loadings = {};
                    }
                    return AssetManager.prototype.destroy = function() {
                        for (var assetIds = Object.keys(this._refCounts), i = 0; i < assetIds.length; ++i) this._releaseAsset(assetIds[i]);
                        this.game = void 0, this.configuration = void 0, this._assets = void 0, this._liveAssetVirtualPathTable = void 0, 
                        this._liveAbsolutePathTable = void 0, this._refCounts = void 0, this._loadings = void 0;
                    }, AssetManager.prototype.destroyed = function() {
                        return void 0 === this.game;
                    }, AssetManager.prototype.retryLoad = function(asset) {
                        if (!this._loadings.hasOwnProperty(asset.id)) throw g.ExceptionFactory.createAssertionError("AssetManager#retryLoad: invalid argument.");
                        var loadingInfo = this._loadings[asset.id];
                        if (loadingInfo.errorCount > AssetManager.MAX_ERROR_COUNT) {
                            if (!this.configuration[asset.id]) return;
                            throw g.ExceptionFactory.createAssertionError("AssetManager#retryLoad: too many retrying.");
                        }
                        loadingInfo.loading || (loadingInfo.loading = !0, asset._load(this));
                    }, AssetManager.prototype.globalAssetIds = function() {
                        var ret = [], conf = this.configuration;
                        for (var p in conf) conf.hasOwnProperty(p) && conf[p].global && ret.push(p);
                        return ret;
                    }, AssetManager.prototype.requestAsset = function(assetIdOrConf, handler) {
                        var loadingInfo, assetId = "string" == typeof assetIdOrConf ? assetIdOrConf : assetIdOrConf.id, waiting = !1;
                        if (this._assets.hasOwnProperty(assetId)) ++this._refCounts[assetId], handler._onAssetLoad(this._assets[assetId]); else if (this._loadings.hasOwnProperty(assetId)) loadingInfo = this._loadings[assetId], 
                        loadingInfo.handlers.push(handler), ++this._refCounts[assetId], waiting = !0; else {
                            var a = this._createAssetFor(assetIdOrConf);
                            loadingInfo = new AssetLoadingInfo(a, handler), this._loadings[assetId] = loadingInfo, 
                            this._refCounts[assetId] = 1, waiting = !0, loadingInfo.loading = !0, a._load(this);
                        }
                        return waiting;
                    }, AssetManager.prototype.unrefAsset = function(assetOrId) {
                        var assetId = "string" == typeof assetOrId ? assetOrId : assetOrId.id;
                        --this._refCounts[assetId] > 0 || this._releaseAsset(assetId);
                    }, AssetManager.prototype.requestAssets = function(assetIdOrConfs, handler) {
                        for (var waitingCount = 0, i = 0, len = assetIdOrConfs.length; i < len; ++i) this.requestAsset(assetIdOrConfs[i], handler) && ++waitingCount;
                        return waitingCount;
                    }, AssetManager.prototype.unrefAssets = function(assetOrIds) {
                        for (var i = 0, len = assetOrIds.length; i < len; ++i) this.unrefAsset(assetOrIds[i]);
                    }, AssetManager.prototype._normalize = function(configuration, audioSystemConfMap) {
                        var ret = {};
                        if (!(configuration instanceof Object)) throw g.ExceptionFactory.createAssertionError("AssetManager#_normalize: invalid arguments.");
                        for (var p in configuration) if (configuration.hasOwnProperty(p)) {
                            var conf = Object.create(configuration[p]);
                            if (!conf.path) throw g.ExceptionFactory.createAssertionError("AssetManager#_normalize: No path given for: " + p);
                            if (!conf.virtualPath) throw g.ExceptionFactory.createAssertionError("AssetManager#_normalize: No virtualPath given for: " + p);
                            if (!conf.type) throw g.ExceptionFactory.createAssertionError("AssetManager#_normalize: No type given for: " + p);
                            if ("image" === conf.type) {
                                if ("number" != typeof conf.width) throw g.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong width given for the image asset: " + p);
                                if ("number" != typeof conf.height) throw g.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong height given for the image asset: " + p);
                            }
                            if ("audio" === conf.type) {
                                void 0 === conf.duration && (conf.duration = 0);
                                var audioSystemConf = audioSystemConfMap[conf.systemId];
                                void 0 === conf.loop && (conf.loop = !!audioSystemConf && !!audioSystemConf.loop), 
                                void 0 === conf.hint && (conf.hint = audioSystemConf ? audioSystemConf.hint : {});
                            }
                            if ("video" === conf.type && !conf.useRealSize) {
                                if ("number" != typeof conf.width) throw g.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong width given for the video asset: " + p);
                                if ("number" != typeof conf.height) throw g.ExceptionFactory.createAssertionError("AssetManager#_normalize: wrong height given for the video asset: " + p);
                                conf.useRealSize = !1;
                            }
                            conf.global || (conf.global = !1), ret[p] = conf;
                        }
                        return ret;
                    }, AssetManager.prototype._createAssetFor = function(idOrConf) {
                        var id, uri, conf;
                        if ("string" == typeof idOrConf) id = idOrConf, conf = this.configuration[id], uri = this.configuration[id].path; else {
                            var dynConf = idOrConf;
                            id = dynConf.id, conf = dynConf, uri = dynConf.uri;
                        }
                        var resourceFactory = this.game.resourceFactory;
                        if (!conf) throw g.ExceptionFactory.createAssertionError("AssetManager#_createAssetFor: unknown asset ID: " + id);
                        switch (conf.type) {
                          case "image":
                            return resourceFactory.createImageAsset(id, uri, conf.width, conf.height);

                          case "audio":
                            var system = conf.systemId ? this.game.audio[conf.systemId] : this.game.audio[this.game.defaultAudioSystemId];
                            return resourceFactory.createAudioAsset(id, uri, conf.duration, system, conf.loop, conf.hint);

                          case "text":
                            return resourceFactory.createTextAsset(id, uri);

                          case "script":
                            return resourceFactory.createScriptAsset(id, uri);

                          case "video":
                            return resourceFactory.createVideoAsset(id, uri, conf.width, conf.height, new g.VideoSystem(), conf.loop, conf.useRealSize);

                          default:
                            throw g.ExceptionFactory.createAssertionError("AssertionError#_createAssetFor: unknown asset type " + conf.type + " for asset ID: " + id);
                        }
                    }, AssetManager.prototype._releaseAsset = function(assetId) {
                        var path, asset = this._assets[assetId] || this._loadings[assetId] && this._loadings[assetId].asset;
                        if (asset) if (path = asset.path, asset.inUse()) if (asset instanceof g.AudioAsset) asset._system.requestDestroy(asset); else {
                            if (!(asset instanceof g.VideoAsset)) throw g.ExceptionFactory.createAssertionError("AssetManager#unrefAssets: Unsupported in-use " + asset.constructor.name);
                            asset.destroy();
                        } else asset.destroy();
                        if (delete this._refCounts[assetId], delete this._loadings[assetId], delete this._assets[assetId], 
                        this.configuration[assetId]) {
                            var virtualPath = this.configuration[assetId].virtualPath;
                            virtualPath && this._liveAssetVirtualPathTable.hasOwnProperty(virtualPath) && delete this._liveAssetVirtualPathTable[virtualPath], 
                            path && this._liveAbsolutePathTable.hasOwnProperty(path) && delete this._liveAbsolutePathTable[path];
                        }
                    }, AssetManager.prototype._countLoadingAsset = function() {
                        return Object.keys(this._loadings).length;
                    }, AssetManager.prototype._onAssetError = function(asset, error) {
                        if (!this.destroyed() && !asset.destroyed()) {
                            var loadingInfo = this._loadings[asset.id], hs = loadingInfo.handlers;
                            loadingInfo.loading = !1, ++loadingInfo.errorCount, loadingInfo.errorCount > AssetManager.MAX_ERROR_COUNT && error.retriable && (error = g.ExceptionFactory.createAssetLoadError("Retry limit exceeded", !1, g.AssetLoadErrorType.RetryLimitExceeded, error)), 
                            error.retriable || delete this._loadings[asset.id];
                            for (var i = 0; i < hs.length; ++i) hs[i]._onAssetError(asset, error, this);
                        }
                    }, AssetManager.prototype._onAssetLoad = function(asset) {
                        if (!this.destroyed() && !asset.destroyed()) {
                            var loadingInfo = this._loadings[asset.id];
                            if (loadingInfo.loading = !1, delete this._loadings[asset.id], this._assets[asset.id] = asset, 
                            this.configuration[asset.id]) {
                                var virtualPath = this.configuration[asset.id].virtualPath;
                                if (this._liveAssetVirtualPathTable.hasOwnProperty(virtualPath)) {
                                    if (this._liveAssetVirtualPathTable[virtualPath].path !== asset.path) throw g.ExceptionFactory.createAssertionError("AssetManager#_onAssetLoad(): duplicated asset path");
                                } else this._liveAssetVirtualPathTable[virtualPath] = asset;
                                this._liveAbsolutePathTable.hasOwnProperty(asset.path) || (this._liveAbsolutePathTable[asset.path] = virtualPath);
                            }
                            for (var hs = loadingInfo.handlers, i = 0; i < hs.length; ++i) hs[i]._onAssetLoad(asset);
                        }
                    }, AssetManager;
                }();
                AssetManager.MAX_ERROR_COUNT = 3, g.AssetManager = AssetManager;
            }(g || (g = {}));
            var g;
            !function(g) {
                function _require(game, path, currentModule) {
                    var targetScriptAsset, resolvedPath, resolvedVirtualPath, basedir = currentModule ? currentModule._dirname : game.assetBase, liveAssetVirtualPathTable = game._assetManager._liveAssetVirtualPathTable;
                    if (path.indexOf("/") === -1 && game._assetManager._assets.hasOwnProperty(path) && (targetScriptAsset = game._assetManager._assets[path]), 
                    /^\.\/|^\.\.\/|^\//.test(path)) {
                        if (resolvedPath = g.PathUtil.resolvePath(basedir, path), game._scriptCaches.hasOwnProperty(resolvedPath)) return game._scriptCaches[resolvedPath]._cachedValue();
                        if (game._scriptCaches.hasOwnProperty(resolvedPath + ".js")) return game._scriptCaches[resolvedPath + ".js"]._cachedValue();
                        if (currentModule) {
                            if (!currentModule._virtualDirname) throw g.ExceptionFactory.createAssertionError("g._require: require from DynamicAsset is not supported");
                            resolvedVirtualPath = g.PathUtil.resolvePath(currentModule._virtualDirname, path);
                        } else {
                            if ("./" !== path.substring(0, 2)) throw g.ExceptionFactory.createAssertionError("g._require: entry point must start with './'");
                            resolvedVirtualPath = path.substring(2);
                        }
                        targetScriptAsset || (targetScriptAsset = g.Util.findAssetByPathAsFile(resolvedVirtualPath, liveAssetVirtualPathTable)), 
                        targetScriptAsset || (targetScriptAsset = g.Util.findAssetByPathAsDirectory(resolvedVirtualPath, liveAssetVirtualPathTable));
                    } else if (!targetScriptAsset) {
                        var dirs = currentModule ? currentModule.paths : [];
                        dirs.push("node_modules");
                        for (var i = 0; i < dirs.length; ++i) {
                            var dir = dirs[i];
                            if (resolvedVirtualPath = g.PathUtil.resolvePath(dir, path), targetScriptAsset = g.Util.findAssetByPathAsFile(resolvedVirtualPath, liveAssetVirtualPathTable)) break;
                            if (targetScriptAsset = g.Util.findAssetByPathAsDirectory(resolvedVirtualPath, liveAssetVirtualPathTable)) break;
                        }
                    }
                    if (targetScriptAsset) {
                        if (game._scriptCaches.hasOwnProperty(targetScriptAsset.path)) return game._scriptCaches[targetScriptAsset.path]._cachedValue();
                        if (targetScriptAsset instanceof g.ScriptAsset) {
                            var context = new g.ScriptAssetContext(game, targetScriptAsset);
                            return game._scriptCaches[targetScriptAsset.path] = context, context._executeScript(currentModule);
                        }
                        if (targetScriptAsset instanceof g.TextAsset && targetScriptAsset && ".json" === g.PathUtil.resolveExtname(path)) {
                            var cache = game._scriptCaches[targetScriptAsset.path] = new g.RequireCachedValue(JSON.parse(targetScriptAsset.data));
                            return cache._cachedValue();
                        }
                    }
                    throw g.ExceptionFactory.createAssertionError("g._require: can not find module: " + path);
                }
                g._require = _require;
                var Module = function() {
                    function Module(game, id, path) {
                        var _this = this, dirname = g.PathUtil.resolveDirname(path), virtualPath = game._assetManager._liveAbsolutePathTable[path], virtualDirname = virtualPath ? g.PathUtil.resolveDirname(virtualPath) : void 0, _g = Object.create(g, {
                            game: {
                                value: game,
                                enumerable: !0
                            },
                            filename: {
                                value: path,
                                enumerable: !0
                            },
                            dirname: {
                                value: dirname,
                                enumerable: !0
                            },
                            module: {
                                value: this,
                                writable: !0,
                                enumerable: !0,
                                configurable: !0
                            }
                        });
                        this.id = id, this.filename = path, this.exports = {}, this.parent = null, this.loaded = !1, 
                        this.children = [], this.paths = virtualDirname ? g.PathUtil.makeNodeModulePaths(virtualDirname) : [], 
                        this._dirname = dirname, this._virtualDirname = virtualDirname, this._g = _g, this.require = function(path) {
                            return "g" === path ? _g : g._require(game, path, _this);
                        };
                    }
                    return Module;
                }();
                g.Module = Module;
            }(g || (g = {}));
            var g;
            !function(g) {
                var ScriptAssetContext = function() {
                    function ScriptAssetContext(game, asset) {
                        this._game = game, this._asset = asset, this._module = new g.Module(game, asset.path, asset.path), 
                        this._g = this._module._g, this._started = !1;
                    }
                    return ScriptAssetContext.prototype._cachedValue = function() {
                        if (!this._started) throw g.ExceptionFactory.createAssertionError("ScriptAssetContext#_cachedValue: not executed yet.");
                        return this._module.exports;
                    }, ScriptAssetContext.prototype._executeScript = function(currentModule) {
                        return this._started ? this._module.exports : (currentModule && (this._module.parent = currentModule, 
                        currentModule.children.push(this._module)), this._started = !0, this._asset.execute(this._g), 
                        this._module.loaded = !0, this._module.exports);
                    }, ScriptAssetContext;
                }();
                g.ScriptAssetContext = ScriptAssetContext;
            }(g || (g = {}));
            var g;
            !function(g) {
                var PlainMatrix = function() {
                    function PlainMatrix(widthOrSrc, height, scaleX, scaleY, angle) {
                        void 0 === widthOrSrc ? (this._modified = !1, this._matrix = [ 1, 0, 0, 1, 0, 0 ]) : "number" == typeof widthOrSrc ? (this._modified = !1, 
                        this._matrix = new Array(6), this.update(widthOrSrc, height, scaleX, scaleY, angle, 0, 0)) : (this._modified = widthOrSrc._modified, 
                        this._matrix = [ widthOrSrc._matrix[0], widthOrSrc._matrix[1], widthOrSrc._matrix[2], widthOrSrc._matrix[3], widthOrSrc._matrix[4], widthOrSrc._matrix[5] ]);
                    }
                    return PlainMatrix.prototype.update = function(width, height, scaleX, scaleY, angle, x, y) {
                        var r = angle * Math.PI / 180, _cos = Math.cos(r), _sin = Math.sin(r), a = _cos * scaleX, b = _sin * scaleX, c = _sin * scaleY, d = _cos * scaleY, w = width / 2, h = height / 2;
                        this._matrix[0] = a, this._matrix[1] = b, this._matrix[2] = -c, this._matrix[3] = d, 
                        this._matrix[4] = -a * w + c * h + w + x, this._matrix[5] = -b * w - d * h + h + y;
                    }, PlainMatrix.prototype.updateByInverse = function(width, height, scaleX, scaleY, angle, x, y) {
                        var r = angle * Math.PI / 180, _cos = Math.cos(r), _sin = Math.sin(r), a = _cos / scaleX, b = _sin / scaleY, c = _sin / scaleX, d = _cos / scaleY, w = width / 2, h = height / 2;
                        this._matrix[0] = a, this._matrix[1] = -b, this._matrix[2] = c, this._matrix[3] = d, 
                        this._matrix[4] = -a * (w + x) - c * (h + y) + w, this._matrix[5] = b * (w + x) - d * (h + y) + h;
                    }, PlainMatrix.prototype.multiply = function(matrix) {
                        var m1 = this._matrix, m2 = matrix._matrix, m10 = m1[0], m11 = m1[1], m12 = m1[2], m13 = m1[3];
                        m1[0] = m10 * m2[0] + m12 * m2[1], m1[1] = m11 * m2[0] + m13 * m2[1], m1[2] = m10 * m2[2] + m12 * m2[3], 
                        m1[3] = m11 * m2[2] + m13 * m2[3], m1[4] = m10 * m2[4] + m12 * m2[5] + m1[4], m1[5] = m11 * m2[4] + m13 * m2[5] + m1[5];
                    }, PlainMatrix.prototype.multiplyNew = function(matrix) {
                        var ret = this.clone();
                        return ret.multiply(matrix), ret;
                    }, PlainMatrix.prototype.reset = function(x, y) {
                        this._matrix[0] = 1, this._matrix[1] = 0, this._matrix[2] = 0, this._matrix[3] = 1, 
                        this._matrix[4] = x || 0, this._matrix[5] = y || 0;
                    }, PlainMatrix.prototype.clone = function() {
                        return new PlainMatrix(this);
                    }, PlainMatrix.prototype.multiplyInverseForPoint = function(point) {
                        var m = this._matrix, _id = 1 / (m[0] * m[3] + m[2] * -m[1]);
                        return {
                            x: m[3] * _id * point.x + -m[2] * _id * point.y + (m[5] * m[2] - m[4] * m[3]) * _id,
                            y: m[0] * _id * point.y + -m[1] * _id * point.x + (-m[5] * m[0] + m[4] * m[1]) * _id
                        };
                    }, PlainMatrix.prototype.scale = function(x, y) {
                        var m = this._matrix;
                        m[0] *= x, m[1] *= y, m[2] *= x, m[3] *= y, m[4] *= x, m[5] *= y;
                    }, PlainMatrix.prototype.multiplyPoint = function(point) {
                        var m = this._matrix, x = m[0] * point.x + m[2] * point.y + m[4], y = m[1] * point.x + m[3] * point.y + m[5];
                        return {
                            x: x,
                            y: y
                        };
                    }, PlainMatrix.prototype.multplyPoint = function(point) {
                        return this.multiplyPoint(point);
                    }, PlainMatrix;
                }();
                g.PlainMatrix = PlainMatrix;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Util;
                !function(Util) {
                    function distance(p1x, p1y, p2x, p2y) {
                        return Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));
                    }
                    function distanceBetweenOffsets(p1, p2) {
                        return Util.distance(p1.x, p1.y, p2.x, p2.y);
                    }
                    function distanceBetweenAreas(p1, p2) {
                        return Util.distance(p1.x - p1.width / 2, p1.y - p1.height / 2, p2.x - p2.width / 2, p2.y - p2.height / 2);
                    }
                    function createMatrix(width, height, scaleX, scaleY, angle) {
                        return void 0 === width ? new g.PlainMatrix() : new g.PlainMatrix(width, height, scaleX, scaleY, angle);
                    }
                    function createSpriteFromE(scene, e, camera) {
                        var oldX = e.x, oldY = e.y, x = 0, y = 0, width = e.width, height = e.height, boundingRect = e.calculateBoundingRect(camera);
                        if (!boundingRect) throw g.ExceptionFactory.createAssertionError("Util#createSpriteFromE: camera must look e");
                        width = boundingRect.right - boundingRect.left, height = boundingRect.bottom - boundingRect.top, 
                        boundingRect.left < e.x && (x = e.x - boundingRect.left), boundingRect.top < e.y && (y = e.y - boundingRect.top), 
                        e.moveTo(x, y), e._matrix && (e._matrix._modified = !0);
                        var surface = scene.game.resourceFactory.createSurface(Math.ceil(width), Math.ceil(height)), renderer = surface.renderer();
                        renderer.begin(), e.render(renderer, camera), renderer.end();
                        var s = new g.Sprite({
                            scene: scene,
                            src: surface,
                            width: width,
                            height: height
                        });
                        return s.moveTo(boundingRect.left, boundingRect.top), e.moveTo(oldX, oldY), e._matrix && (e._matrix._modified = !0), 
                        s;
                    }
                    function createSpriteFromScene(toScene, fromScene, camera) {
                        var surface = toScene.game.resourceFactory.createSurface(Math.ceil(fromScene.game.width), Math.ceil(fromScene.game.height)), renderer = surface.renderer();
                        renderer.begin();
                        for (var children = fromScene.children, i = 0; i < children.length; ++i) children[i].render(renderer, camera);
                        return renderer.end(), new g.Sprite({
                            scene: toScene,
                            src: surface,
                            width: fromScene.game.width,
                            height: fromScene.game.height
                        });
                    }
                    function asSurface(src) {
                        if (!src) return src;
                        if (src instanceof g.Surface) return src;
                        if (src instanceof g.ImageAsset) return src.asSurface();
                        throw g.ExceptionFactory.createTypeMismatchError("Util#asSurface", "ImageAsset|Surface", src);
                    }
                    function findAssetByPathAsFile(resolvedPath, liveAssetPathTable) {
                        return liveAssetPathTable.hasOwnProperty(resolvedPath) ? liveAssetPathTable[resolvedPath] : liveAssetPathTable.hasOwnProperty(resolvedPath + ".js") ? liveAssetPathTable[resolvedPath + ".js"] : void 0;
                    }
                    function findAssetByPathAsDirectory(resolvedPath, liveAssetPathTable) {
                        var path;
                        if (path = resolvedPath + "/package.json", liveAssetPathTable.hasOwnProperty(path) && liveAssetPathTable[path] instanceof g.TextAsset) {
                            var pkg = JSON.parse(liveAssetPathTable[path].data);
                            if (pkg && "string" == typeof pkg.main) {
                                var asset = Util.findAssetByPathAsFile(g.PathUtil.resolvePath(resolvedPath, pkg.main), liveAssetPathTable);
                                if (asset) return asset;
                            }
                        }
                        if (path = resolvedPath + "/index.js", liveAssetPathTable.hasOwnProperty(path)) return liveAssetPathTable[path];
                    }
                    function charCodeAt(str, idx) {
                        var code = str.charCodeAt(idx);
                        if (55296 <= code && code <= 56319) {
                            var hi = code, low = str.charCodeAt(idx + 1);
                            return hi << 16 | low;
                        }
                        return 56320 <= code && code <= 57343 ? null : code;
                    }
                    function setupAnimatingHandler(animatingHandler, surface) {
                        surface.isDynamic && (surface.animatingStarted.handle(animatingHandler, animatingHandler._onAnimatingStarted), 
                        surface.animatingStopped.handle(animatingHandler, animatingHandler._onAnimatingStopped), 
                        surface.isPlaying() && animatingHandler._onAnimatingStarted());
                    }
                    function migrateAnimatingHandler(animatingHandler, beforeSurface, afterSurface) {
                        animatingHandler._onAnimatingStopped(), !beforeSurface.destroyed() && beforeSurface.isDynamic && (beforeSurface.animatingStarted.remove(animatingHandler, animatingHandler._onAnimatingStarted), 
                        beforeSurface.animatingStopped.remove(animatingHandler, animatingHandler._onAnimatingStopped)), 
                        afterSurface.isDynamic && (afterSurface.animatingStarted.handle(animatingHandler, animatingHandler._onAnimatingStarted), 
                        afterSurface.animatingStopped.handle(animatingHandler, animatingHandler._onAnimatingStopped), 
                        afterSurface.isPlaying() && animatingHandler._onAnimatingStarted());
                    }
                    Util.distance = distance, Util.distanceBetweenOffsets = distanceBetweenOffsets, 
                    Util.distanceBetweenAreas = distanceBetweenAreas, Util.createMatrix = createMatrix, 
                    Util.createSpriteFromE = createSpriteFromE, Util.createSpriteFromScene = createSpriteFromScene, 
                    Util.asSurface = asSurface, Util.findAssetByPathAsFile = findAssetByPathAsFile, 
                    Util.findAssetByPathAsDirectory = findAssetByPathAsDirectory, Util.charCodeAt = charCodeAt, 
                    Util.setupAnimatingHandler = setupAnimatingHandler, Util.migrateAnimatingHandler = migrateAnimatingHandler;
                }(Util = g.Util || (g.Util = {}));
            }(g || (g = {}));
            var g;
            !function(g) {
                var Collision;
                !function(Collision) {
                    function intersect(x1, y1, width1, height1, x2, y2, width2, height2) {
                        return x1 <= x2 + width2 && x2 <= x1 + width1 && y1 <= y2 + height2 && y2 <= y1 + height1;
                    }
                    function intersectAreas(t1, t2) {
                        return Collision.intersect(t1.x, t1.y, t1.width, t1.height, t2.x, t2.y, t2.width, t2.height);
                    }
                    function within(t1x, t1y, t2x, t2y, distance) {
                        return void 0 === distance && (distance = 1), distance >= g.Util.distance(t1x, t1y, t2x, t2y);
                    }
                    function withinAreas(t1, t2, distance) {
                        return void 0 === distance && (distance = 1), distance >= g.Util.distanceBetweenAreas(t1, t2);
                    }
                    Collision.intersect = intersect, Collision.intersectAreas = intersectAreas, Collision.within = within, 
                    Collision.withinAreas = withinAreas;
                }(Collision = g.Collision || (g.Collision = {}));
            }(g || (g = {}));
            var g;
            !function(g) {
                var Trigger = function() {
                    function Trigger(chain) {
                        this.chain = chain, this._handlers = [];
                    }
                    return Trigger.prototype.handle = function(owner, handler, name) {
                        this._handlers.length || this._activateChain(), handler ? this._handlers.push({
                            owner: owner,
                            handler: handler,
                            name: name
                        }) : this._handlers.push({
                            owner: void 0,
                            handler: owner,
                            name: name
                        });
                    }, Trigger.prototype.destroy = function() {
                        this._deactivateChain(), this.chain = void 0, this._handlers = void 0;
                    }, Trigger.prototype.destroyed = function() {
                        return void 0 === this._handlers;
                    }, Trigger.prototype.hasHandler = function() {
                        return this._handlers && this._handlers.length > 0;
                    }, Trigger.prototype.handleInsert = function(index, owner, handler, name) {
                        this._handlers.length || this._activateChain(), handler ? this._handlers.splice(index, 0, {
                            owner: owner,
                            handler: handler,
                            name: name
                        }) : this._handlers.splice(index, 0, {
                            owner: void 0,
                            handler: owner,
                            name: name
                        });
                    }, Trigger.prototype.removeAll = function(owner) {
                        for (var tmp, handlers = []; tmp = this._handlers.shift(); ) tmp.owner !== owner && handlers.push(tmp);
                        this._handlers = handlers, this._handlers.length || this._deactivateChain();
                    }, Trigger.prototype.removeAllByHandler = function(handler) {
                        for (var tmp, handlers = []; tmp = this._handlers.shift(); ) tmp.handler !== handler && handlers.push(tmp);
                        this._handlers = handlers, this._handlers.length || this._deactivateChain();
                    }, Trigger.prototype.remove = function(owner, handler) {
                        var handlers = [];
                        handler || (handler = owner, owner = void 0);
                        for (var i = 0; i < this._handlers.length; ++i) {
                            var tmp = this._handlers[i];
                            tmp.handler === handler && tmp.owner === owner || handlers.push(tmp);
                        }
                        this._handlers = handlers, this._handlers.length || this._deactivateChain();
                    }, Trigger.prototype.removeByName = function(name) {
                        for (var handlers = [], i = 0; i < this._handlers.length; ++i) {
                            var tmp = this._handlers[i];
                            tmp.name !== name && handlers.push(tmp);
                        }
                        this._handlers = handlers, this._handlers.length || this._deactivateChain();
                    }, Trigger.prototype.isHandled = function(owner, handler) {
                        handler || (handler = owner, owner = void 0);
                        for (var i = 0; i < this._handlers.length; ++i) if (this._handlers[i].owner === owner && this._handlers[i].handler === handler) return !0;
                        return !1;
                    }, Trigger.prototype.fire = function(param) {
                        if (this._handlers && this._handlers.length) for (var handlers = this._handlers.concat(), i = 0; i < handlers.length; ++i) {
                            var handler = handlers[i];
                            handler.handler.call(handler.owner, param) && this._remove(handler);
                        }
                    }, Trigger.prototype._reset = function() {
                        this._handlers = [], this._deactivateChain();
                    }, Trigger.prototype._activateChain = function() {
                        this.chain && (this.chain.isHandled(this, this._onChainFire) || this.chain.handle(this, this._onChainFire));
                    }, Trigger.prototype._deactivateChain = function() {
                        this.chain && this.chain.isHandled(this, this._onChainFire) && this.chain.remove(this, this._onChainFire);
                    }, Trigger.prototype._remove = function(handler) {
                        var index = this._handlers.indexOf(handler);
                        index !== -1 && (this._handlers.splice(index, 1), this._handlers.length || this._deactivateChain());
                    }, Trigger.prototype._onChainFire = function(e) {
                        this.fire(e);
                    }, Trigger;
                }();
                g.Trigger = Trigger;
                var ConditionalChainTrigger = function(_super) {
                    function ConditionalChainTrigger(chain, filterOwner, filter) {
                        var _this = _super.call(this, chain) || this;
                        return _this.filterOwner = filterOwner, _this.filter = filter, _this;
                    }
                    return __extends(ConditionalChainTrigger, _super), ConditionalChainTrigger.prototype._onChainFire = function(e) {
                        this.filter && !this.filter.call(this.filterOwner, e) || this.fire(e);
                    }, ConditionalChainTrigger;
                }(Trigger);
                g.ConditionalChainTrigger = ConditionalChainTrigger;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Timer = function() {
                    function Timer(interval, fps) {
                        this.interval = interval, this._scaledInterval = Math.round(interval * fps), this.elapsed = new g.Trigger(), 
                        this._scaledElapsed = 0;
                    }
                    return Timer.prototype.tick = function() {
                        for (this._scaledElapsed += 1e3; this._scaledElapsed >= this._scaledInterval && this.elapsed; ) this.elapsed.fire(), 
                        this._scaledElapsed -= this._scaledInterval;
                    }, Timer.prototype.canDelete = function() {
                        return !this.elapsed.hasHandler();
                    }, Timer.prototype.destroy = function() {
                        this.interval = void 0, this.elapsed.destroy(), this.elapsed = void 0, this._scaledInterval = 0, 
                        this._scaledElapsed = 0;
                    }, Timer.prototype.destroyed = function() {
                        return void 0 === this.elapsed;
                    }, Timer;
                }();
                g.Timer = Timer;
            }(g || (g = {}));
            var g;
            !function(g) {
                var TimerIdentifier = function() {
                    function TimerIdentifier(timer, handler, handlerOwner, fired, firedOwner) {
                        this._timer = timer, this._handler = handler, this._handlerOwner = handlerOwner, 
                        this._fired = fired, this._firedOwner = firedOwner, this._timer.elapsed.handle(this, this._fire);
                    }
                    return TimerIdentifier.prototype.destroy = function() {
                        this._timer.elapsed.remove(this, this._fire), this._timer = void 0, this._handler = void 0, 
                        this._handlerOwner = void 0, this._fired = void 0, this._firedOwner = void 0;
                    }, TimerIdentifier.prototype.destroyed = function() {
                        return void 0 === this._timer;
                    }, TimerIdentifier.prototype._fire = function() {
                        this._handler.call(this._handlerOwner), this._fired && this._fired.call(this._firedOwner, this);
                    }, TimerIdentifier;
                }();
                g.TimerIdentifier = TimerIdentifier;
                var TimerManager = function() {
                    function TimerManager(trigger, fps) {
                        this._timers = [], this._trigger = trigger, this._identifiers = [], this._fps = fps, 
                        this._registered = !1;
                    }
                    return TimerManager.prototype.destroy = function() {
                        for (var i = 0; i < this._identifiers.length; ++i) this._identifiers[i].destroy();
                        for (var i = 0; i < this._timers.length; ++i) this._timers[i].destroy();
                        this._timers = void 0, this._trigger = void 0, this._identifiers = void 0, this._fps = void 0;
                    }, TimerManager.prototype.destroyed = function() {
                        return void 0 === this._timers;
                    }, TimerManager.prototype.createTimer = function(interval) {
                        if (this._registered || (this._trigger.handle(this, this._tick), this._registered = !0), 
                        interval < 0) throw g.ExceptionFactory.createAssertionError("TimerManager#createTimer: invalid interval");
                        interval < 1 && (interval = 1);
                        for (var acceptableMargin = Math.min(1e3, interval * this._fps), i = 0; i < this._timers.length; ++i) if (this._timers[i].interval === interval && this._timers[i]._scaledElapsed < acceptableMargin) return this._timers[i];
                        var timer = new g.Timer(interval, this._fps);
                        return this._timers.push(timer), timer;
                    }, TimerManager.prototype.deleteTimer = function(timer) {
                        if (timer.canDelete()) {
                            var index = this._timers.indexOf(timer);
                            if (index < 0) throw g.ExceptionFactory.createAssertionError("TimerManager#deleteTimer: can not find timer");
                            if (this._timers.splice(index, 1), timer.destroy(), !this._timers.length) {
                                if (!this._registered) throw g.ExceptionFactory.createAssertionError("TimerManager#deleteTimer: handler is not handled");
                                this._trigger.remove(this, this._tick), this._registered = !1;
                            }
                        }
                    }, TimerManager.prototype.setTimeout = function(milliseconds, owner, handler) {
                        void 0 === handler && (handler = owner, owner = null);
                        var timer = this.createTimer(milliseconds), identifier = new TimerIdentifier(timer, handler, owner, this._onTimeoutFired, this);
                        return this._identifiers.push(identifier), identifier;
                    }, TimerManager.prototype.clearTimeout = function(identifier) {
                        this._clear(identifier);
                    }, TimerManager.prototype.setInterval = function(interval, owner, handler) {
                        void 0 === handler && (handler = owner, owner = null);
                        var timer = this.createTimer(interval), identifier = new TimerIdentifier(timer, handler, owner);
                        return this._identifiers.push(identifier), identifier;
                    }, TimerManager.prototype.clearInterval = function(identifier) {
                        this._clear(identifier);
                    }, TimerManager.prototype._tick = function() {
                        for (var timers = this._timers.concat(), i = 0; i < timers.length; ++i) timers[i].tick();
                    }, TimerManager.prototype._onTimeoutFired = function(identifier) {
                        var index = this._identifiers.indexOf(identifier);
                        if (index < 0) throw g.ExceptionFactory.createAssertionError("TimerManager#_onTimeoutFired: can not find identifier");
                        this._identifiers.splice(index, 1);
                        var timer = identifier._timer;
                        identifier.destroy(), this.deleteTimer(timer);
                    }, TimerManager.prototype._clear = function(identifier) {
                        var index = this._identifiers.indexOf(identifier);
                        if (index < 0) throw g.ExceptionFactory.createAssertionError("TimerManager#_clear: can not find identifier");
                        if (identifier.destroyed()) throw g.ExceptionFactory.createAssertionError("TimerManager#_clear: invalid identifier");
                        this._identifiers.splice(index, 1);
                        var timer = identifier._timer;
                        identifier.destroy(), this.deleteTimer(timer);
                    }, TimerManager;
                }();
                g.TimerManager = TimerManager;
            }(g || (g = {}));
            var g;
            !function(g) {
                var AudioPlayer = function() {
                    function AudioPlayer(system) {
                        this.played = new g.Trigger(), this.stopped = new g.Trigger(), this.currentAudio = void 0, 
                        this.volume = system.volume, this._muted = system._muted, this._playbackRate = system._playbackRate, 
                        this._system = system;
                    }
                    return AudioPlayer.prototype.play = function(audio) {
                        this.currentAudio = audio, this.played.fire({
                            player: this,
                            audio: audio
                        });
                    }, AudioPlayer.prototype.stop = function() {
                        var audio = this.currentAudio;
                        this.currentAudio = void 0, this.stopped.fire({
                            player: this,
                            audio: audio
                        });
                    }, AudioPlayer.prototype.canHandleStopped = function() {
                        return !0;
                    }, AudioPlayer.prototype.changeVolume = function(volume) {
                        this.volume = volume;
                    }, AudioPlayer.prototype._changeMuted = function(muted) {
                        this._muted = muted;
                    }, AudioPlayer.prototype._changePlaybackRate = function(rate) {
                        this._playbackRate = rate;
                    }, AudioPlayer.prototype._supportsPlaybackRate = function() {
                        return !1;
                    }, AudioPlayer;
                }();
                g.AudioPlayer = AudioPlayer;
            }(g || (g = {}));
            var g;
            !function(g) {
                var AudioSystem = function() {
                    function AudioSystem(id, game) {
                        var audioSystemManager = game._audioSystemManager;
                        this.id = id, this.game = game, this._volume = 1, this._destroyRequestedAssets = {}, 
                        this._muted = audioSystemManager._muted, this._playbackRate = audioSystemManager._playbackRate;
                    }
                    return Object.defineProperty(AudioSystem.prototype, "volume", {
                        get: function() {
                            return this._volume;
                        },
                        set: function(value) {
                            if (value < 0 || value > 1 || isNaN(value) || "number" != typeof value) throw g.ExceptionFactory.createAssertionError("AudioSystem#volume: expected: 0.0-1.0, actual: " + value);
                            this._volume = value, this._onVolumeChanged();
                        },
                        enumerable: !0,
                        configurable: !0
                    }), AudioSystem.prototype.stopAll = function() {
                        throw g.ExceptionFactory.createPureVirtualError("AudioSystem#stopAll");
                    }, AudioSystem.prototype.findPlayers = function(asset) {
                        throw g.ExceptionFactory.createPureVirtualError("AudioSystem#findPlayers");
                    }, AudioSystem.prototype.createPlayer = function() {
                        throw g.ExceptionFactory.createPureVirtualError("AudioSystem#createPlayer");
                    }, AudioSystem.prototype.requestDestroy = function(asset) {
                        this._destroyRequestedAssets[asset.id] = asset;
                    }, AudioSystem.prototype._setMuted = function(value) {
                        var before = this._muted;
                        this._muted = !!value, this._muted !== before && this._onMutedChanged();
                    }, AudioSystem.prototype._setPlaybackRate = function(value) {
                        if (value < 0 || isNaN(value) || "number" != typeof value) throw g.ExceptionFactory.createAssertionError("AudioSystem#playbackRate: expected: greater or equal to 0.0, actual: " + value);
                        var before = this._playbackRate;
                        this._playbackRate = value, this._playbackRate !== before && this._onPlaybackRateChanged();
                    }, AudioSystem.prototype._onVolumeChanged = function() {
                        throw g.ExceptionFactory.createPureVirtualError("AudioSystem#_onVolumeChanged");
                    }, AudioSystem.prototype._onMutedChanged = function() {
                        throw g.ExceptionFactory.createPureVirtualError("AudioSystem#_onMutedChanged");
                    }, AudioSystem.prototype._onPlaybackRateChanged = function() {
                        throw g.ExceptionFactory.createPureVirtualError("AudioSystem#_onPlaybackRateChanged");
                    }, AudioSystem;
                }();
                g.AudioSystem = AudioSystem;
                var MusicAudioSystem = function(_super) {
                    function MusicAudioSystem(id, game) {
                        var _this = _super.call(this, id, game) || this;
                        return _this._player = void 0, _this._suppressingAudio = void 0, _this;
                    }
                    return __extends(MusicAudioSystem, _super), Object.defineProperty(MusicAudioSystem.prototype, "player", {
                        get: function() {
                            return this._player || (this._player = this.game.resourceFactory.createAudioPlayer(this), 
                            this._player.played.handle(this, this._onPlayerPlayed), this._player.stopped.handle(this, this._onPlayerStopped)), 
                            this._player;
                        },
                        set: function(v) {
                            this._player = v;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), MusicAudioSystem.prototype.findPlayers = function(asset) {
                        return this.player.currentAudio && this.player.currentAudio.id === asset.id ? [ this.player ] : [];
                    }, MusicAudioSystem.prototype.createPlayer = function() {
                        return this.player;
                    }, MusicAudioSystem.prototype.stopAll = function() {
                        this._player && this._player.stop();
                    }, MusicAudioSystem.prototype._onVolumeChanged = function() {
                        this.player.changeVolume(this._volume);
                    }, MusicAudioSystem.prototype._onMutedChanged = function() {
                        this.player._changeMuted(this._muted);
                    }, MusicAudioSystem.prototype._onPlaybackRateChanged = function() {
                        var player = this.player;
                        player._changePlaybackRate(this._playbackRate), player._supportsPlaybackRate() || this._onUnsupportedPlaybackRateChanged();
                    }, MusicAudioSystem.prototype._onUnsupportedPlaybackRateChanged = function() {
                        if (1 === this._playbackRate && this._suppressingAudio) {
                            var audio = this._suppressingAudio;
                            this._suppressingAudio = void 0, audio.destroyed() || this.player.play(audio);
                        }
                    }, MusicAudioSystem.prototype._onPlayerPlayed = function(e) {
                        if (e.player !== this._player) throw g.ExceptionFactory.createAssertionError("MusicAudioSystem#_onPlayerPlayed: unexpected audio player");
                        e.player._supportsPlaybackRate() || 1 !== this._playbackRate && (e.player.stop(), 
                        this._suppressingAudio = e.audio);
                    }, MusicAudioSystem.prototype._onPlayerStopped = function(e) {
                        this._destroyRequestedAssets[e.audio.id] && (delete this._destroyRequestedAssets[e.audio.id], 
                        e.audio.destroy());
                    }, MusicAudioSystem;
                }(AudioSystem);
                g.MusicAudioSystem = MusicAudioSystem;
                var SoundAudioSystem = function(_super) {
                    function SoundAudioSystem(id, game) {
                        var _this = _super.call(this, id, game) || this;
                        return _this.players = [], _this;
                    }
                    return __extends(SoundAudioSystem, _super), SoundAudioSystem.prototype.createPlayer = function() {
                        var player = this.game.resourceFactory.createAudioPlayer(this);
                        return player.canHandleStopped() && this.players.push(player), player.played.handle(this, this._onPlayerPlayed), 
                        player.stopped.handle(this, this._onPlayerStopped), player;
                    }, SoundAudioSystem.prototype.findPlayers = function(asset) {
                        for (var ret = [], i = 0; i < this.players.length; ++i) this.players[i].currentAudio && this.players[i].currentAudio.id === asset.id && ret.push(this.players[i]);
                        return ret;
                    }, SoundAudioSystem.prototype.stopAll = function() {
                        for (var players = this.players.concat(), i = 0; i < players.length; ++i) players[i].stop();
                    }, SoundAudioSystem.prototype._onMutedChanged = function() {
                        for (var players = this.players, i = 0; i < players.length; ++i) players[i]._changeMuted(this._muted);
                    }, SoundAudioSystem.prototype._onPlaybackRateChanged = function() {
                        for (var players = this.players, i = 0; i < players.length; ++i) players[i]._changePlaybackRate(this._playbackRate);
                    }, SoundAudioSystem.prototype._onPlayerPlayed = function(e) {
                        e.player._supportsPlaybackRate() || 1 !== this._playbackRate && e.player.stop();
                    }, SoundAudioSystem.prototype._onPlayerStopped = function(e) {
                        var index = this.players.indexOf(e.player);
                        index < 0 || (e.player.stopped.remove(this, this._onPlayerStopped), this.players.splice(index, 1), 
                        this._destroyRequestedAssets[e.audio.id] && (delete this._destroyRequestedAssets[e.audio.id], 
                        e.audio.destroy()));
                    }, SoundAudioSystem.prototype._onVolumeChanged = function() {
                        for (var i = 0; i < this.players.length; ++i) this.players[i].changeVolume(this._volume);
                    }, SoundAudioSystem;
                }(AudioSystem);
                g.SoundAudioSystem = SoundAudioSystem;
            }(g || (g = {}));
            var g;
            !function(g) {
                var VideoPlayer = function() {
                    function VideoPlayer(loop) {
                        this._loop = !!loop, this.played = new g.Trigger(), this.stopped = new g.Trigger(), 
                        this.currentVideo = void 0, this.volume = 1;
                    }
                    return VideoPlayer.prototype.play = function(videoAsset) {
                        this.currentVideo = videoAsset, this.played.fire({
                            player: this,
                            video: videoAsset
                        }), videoAsset.asSurface().animatingStarted.fire();
                    }, VideoPlayer.prototype.stop = function() {
                        var videoAsset = this.currentVideo;
                        this.stopped.fire({
                            player: this,
                            video: videoAsset
                        }), videoAsset.asSurface().animatingStopped.fire();
                    }, VideoPlayer.prototype.changeVolume = function(volume) {
                        this.volume = volume;
                    }, VideoPlayer;
                }();
                g.VideoPlayer = VideoPlayer;
            }(g || (g = {}));
            var g;
            !function(g) {
                var VideoSystem = function() {
                    function VideoSystem() {}
                    return VideoSystem;
                }();
                g.VideoSystem = VideoSystem;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Object2D = function() {
                    function Object2D(param) {
                        param ? (this.x = param.x || 0, this.y = param.y || 0, this.width = param.width || 0, 
                        this.height = param.height || 0, this.opacity = "opacity" in param ? param.opacity : 1, 
                        this.scaleX = "scaleX" in param ? param.scaleX : 1, this.scaleY = "scaleY" in param ? param.scaleY : 1, 
                        this.angle = param.angle || 0, this.compositeOperation = param.compositeOperation, 
                        this._matrix = void 0) : (this.x = 0, this.y = 0, this.width = 0, this.height = 0, 
                        this.opacity = 1, this.scaleX = 1, this.scaleY = 1, this.angle = 0, this.compositeOperation = void 0, 
                        this._matrix = void 0);
                    }
                    return Object2D.prototype.moveTo = function(posOrX, y) {
                        if ("number" == typeof posOrX && "number" != typeof y) throw g.ExceptionFactory.createAssertionError("Object2D#moveTo: arguments must be CommonOffset or pair of x and y as a number.");
                        "number" == typeof posOrX ? (this.x = posOrX, this.y = y) : (this.x = posOrX.x, 
                        this.y = posOrX.y);
                    }, Object2D.prototype.moveBy = function(x, y) {
                        this.x += x, this.y += y;
                    }, Object2D.prototype.resizeTo = function(sizeOrWidth, height) {
                        if ("number" == typeof sizeOrWidth && "number" != typeof height) throw g.ExceptionFactory.createAssertionError("Object2D#resizeTo: arguments must be CommonSize or pair of width and height as a number.");
                        "number" == typeof sizeOrWidth ? (this.width = sizeOrWidth, this.height = height) : (this.width = sizeOrWidth.width, 
                        this.height = sizeOrWidth.height);
                    }, Object2D.prototype.resizeBy = function(width, height) {
                        this.width += width, this.height += height;
                    }, Object2D.prototype.scale = function(scale) {
                        this.scaleX = scale, this.scaleY = scale;
                    }, Object2D.prototype.getMatrix = function() {
                        if (this._matrix) {
                            if (!this._matrix._modified) return this._matrix;
                        } else this._matrix = g.Util.createMatrix();
                        return this._updateMatrix(), this._matrix._modified = !1, this._matrix;
                    }, Object2D.prototype._updateMatrix = function() {
                        this.angle || 1 !== this.scaleX || 1 !== this.scaleY ? this._matrix.update(this.width, this.height, this.scaleX, this.scaleY, this.angle, this.x, this.y) : this._matrix.reset(this.x, this.y);
                    }, Object2D;
                }();
                g.Object2D = Object2D;
            }(g || (g = {}));
            var g;
            !function(g) {
                var E = function(_super) {
                    function E(sceneOrParam) {
                        var _this = this;
                        if (sceneOrParam instanceof g.Scene) {
                            var scene = sceneOrParam;
                            _this = _super.call(this) || this, _this.children = void 0, _this.parent = void 0, 
                            _this._touchable = !1, _this.state = 0, _this._hasTouchableChildren = !1, _this._update = void 0, 
                            _this._message = void 0, _this._pointDown = void 0, _this._pointMove = void 0, _this._pointUp = void 0, 
                            _this._targetCameras = void 0, _this.local = scene.local !== g.LocalTickMode.NonLocal, 
                            scene.register(_this), scene.game.logger.debug("[deprecated] E or Subclass of E: This constructor is deprecated. Refer to the API documentation and use each constructor(param: ParameterObject) instead.");
                        } else {
                            var param = sceneOrParam;
                            if (_this = _super.call(this, param) || this, _this.children = void 0, _this.parent = void 0, 
                            _this._touchable = !1, _this.state = 0, _this._hasTouchableChildren = !1, _this._update = void 0, 
                            _this._message = void 0, _this._pointDown = void 0, _this._pointMove = void 0, _this._pointUp = void 0, 
                            _this._targetCameras = void 0, _this.tag = param.tag, _this.local = param.scene.local !== g.LocalTickMode.NonLocal || !!param.local, 
                            param.children) for (var i = 0; i < param.children.length; ++i) _this.append(param.children[i]);
                            param.parent && param.parent.append(_this), param.targetCameras && (_this.targetCameras = param.targetCameras), 
                            "touchable" in param && (_this.touchable = param.touchable), param.hidden && _this.hide(), 
                            _this.id = param.id, param.scene.register(_this);
                        }
                        return _this;
                    }
                    return __extends(E, _super), Object.defineProperty(E.prototype, "update", {
                        get: function() {
                            return this._update || (this._update = new g.Trigger(this.scene.update)), this._update;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(E.prototype, "message", {
                        get: function() {
                            return this._message || (this._message = new g.Trigger(this.scene.message)), this._message;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(E.prototype, "pointDown", {
                        get: function() {
                            return this._pointDown || (this._pointDown = new g.ConditionalChainTrigger(this.scene.pointDownCapture, this, this._isTargetOperation)), 
                            this._pointDown;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(E.prototype, "pointUp", {
                        get: function() {
                            return this._pointUp || (this._pointUp = new g.ConditionalChainTrigger(this.scene.pointUpCapture, this, this._isTargetOperation)), 
                            this._pointUp;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(E.prototype, "pointMove", {
                        get: function() {
                            return this._pointMove || (this._pointMove = new g.ConditionalChainTrigger(this.scene.pointMoveCapture, this, this._isTargetOperation)), 
                            this._pointMove;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(E.prototype, "targetCameras", {
                        get: function() {
                            return this._targetCameras || (this._targetCameras = []);
                        },
                        set: function(v) {
                            this._targetCameras = v;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(E.prototype, "touchable", {
                        get: function() {
                            return this._touchable;
                        },
                        set: function(v) {
                            this._touchable !== v && (this._touchable = v, v ? this._enableTouchPropagation() : this._disableTouchPropagation());
                        },
                        enumerable: !0,
                        configurable: !0
                    }), E.prototype.render = function(renderer, camera) {
                        if (this.state &= -5, !(1 & this.state)) {
                            var cams = this._targetCameras;
                            if (!(cams && cams.length > 0) || camera && cams.indexOf(camera) !== -1) {
                                if (8 & this.state) {
                                    renderer.translate(this.x, this.y);
                                    var goDown = this.renderSelf(renderer, camera);
                                    if (goDown && this.children) for (var children = this.children, len = children.length, i = 0; i < len; ++i) children[i].render(renderer, camera);
                                    return void renderer.translate(-this.x, -this.y);
                                }
                                renderer.save(), this.angle || 1 !== this.scaleX || 1 !== this.scaleY ? renderer.transform(this.getMatrix()._matrix) : renderer.translate(this.x, this.y), 
                                1 !== this.opacity && renderer.opacity(this.opacity), void 0 !== this.compositeOperation && renderer.setCompositeOperation(this.compositeOperation);
                                var goDown = this.renderSelf(renderer, camera);
                                if (goDown && this.children) for (var children = this.children, i = 0; i < children.length; ++i) children[i].render(renderer, camera);
                                renderer.restore();
                            }
                        }
                    }, E.prototype.renderSelf = function(renderer, camera) {
                        return !0;
                    }, E.prototype.game = function() {
                        return this.scene.game;
                    }, E.prototype.append = function(e) {
                        this.insertBefore(e, void 0);
                    }, E.prototype.insertBefore = function(e, target) {
                        e.parent && e.remove(), this.children || (this.children = []), e.parent = this;
                        var index = -1;
                        void 0 !== target && (index = this.children.indexOf(target)) > -1 ? this.children.splice(index, 0, e) : this.children.push(e), 
                        (e._touchable || e._hasTouchableChildren) && (this._hasTouchableChildren = !0, this._enableTouchPropagation()), 
                        this.modified(!0);
                    }, E.prototype.remove = function(e) {
                        if (void 0 === e) return void this.parent.remove(this);
                        var index = this.children ? this.children.indexOf(e) : -1;
                        if (index < 0) throw g.ExceptionFactory.createAssertionError("E#remove: invalid child");
                        this.children[index].parent = void 0, this.children.splice(index, 1), (e._touchable || e._hasTouchableChildren) && (this._findTouchableChildren(this) || (this._hasTouchableChildren = !1, 
                        this._disableTouchPropagation())), this.modified(!0);
                    }, E.prototype.destroy = function() {
                        if (this.parent && this.remove(), this.children) {
                            for (;this.children.length; ) this.children[this.children.length - 1].destroy();
                            this.children = void 0;
                        }
                        this._update && (this._update.destroy(), this._update = void 0), this._message && (this._message.destroy(), 
                        this._message = void 0), this._pointDown && (this._pointDown.destroy(), this._pointDown = void 0), 
                        this._pointMove && (this._pointMove.destroy(), this._pointMove = void 0), this._pointUp && (this._pointUp.destroy(), 
                        this._pointUp = void 0), this.scene.unregister(this);
                    }, E.prototype.destroyed = function() {
                        return void 0 === this.scene;
                    }, E.prototype.modified = function(isBubbling) {
                        this._matrix && (this._matrix._modified = !0), this.angle || 1 !== this.scaleX || 1 !== this.scaleY || 1 !== this.opacity || void 0 !== this.compositeOperation ? this.state &= -9 : this.state |= 8, 
                        4 & this.state || (this.state |= 4, this.parent && this.parent.modified(!0));
                    }, E.prototype.shouldFindChildrenByPoint = function(point) {
                        return !0;
                    }, E.prototype.findPointSourceByPoint = function(point, m, force, camera) {
                        if (!(1 & this.state)) {
                            var cams = this._targetCameras;
                            if (!(cams && cams.length > 0) || camera && cams.indexOf(camera) !== -1) {
                                m = m ? m.multiplyNew(this.getMatrix()) : this.getMatrix().clone();
                                var p = m.multiplyInverseForPoint(point);
                                if ((this._hasTouchableChildren || force && this.children && this.children.length) && this.shouldFindChildrenByPoint(p)) for (var i = this.children.length - 1; i >= 0; --i) {
                                    var child = this.children[i];
                                    if (force || child._touchable || child._hasTouchableChildren) {
                                        var target = child.findPointSourceByPoint(point, m, force, camera);
                                        if (target) return target;
                                    }
                                }
                                if (force || this._touchable) return 0 <= p.x && this.width > p.x && 0 <= p.y && this.height > p.y ? {
                                    target: this,
                                    point: p
                                } : void 0;
                            }
                        }
                    }, E.prototype.visible = function() {
                        return 1 !== (1 & this.state);
                    }, E.prototype.show = function() {
                        1 & this.state && (this.state &= -2, this.parent && this.parent.modified(!0));
                    }, E.prototype.hide = function() {
                        1 & this.state || (this.state |= 1, this.parent && this.parent.modified(!0));
                    }, E.prototype.calculateBoundingRect = function(c) {
                        return this._calculateBoundingRect(void 0, c);
                    }, E.prototype._calculateBoundingRect = function(m, c) {
                        var matrix = this.getMatrix();
                        if (m && (matrix = m.multiplyNew(matrix)), this.visible() && (!c || this._targetCameras && this._targetCameras.indexOf(c) !== -1)) {
                            for (var thisBoundingRect = {
                                left: 0,
                                right: this.width,
                                top: 0,
                                bottom: this.height
                            }, targetCoordinates = [ {
                                x: thisBoundingRect.left,
                                y: thisBoundingRect.top
                            }, {
                                x: thisBoundingRect.left,
                                y: thisBoundingRect.bottom
                            }, {
                                x: thisBoundingRect.right,
                                y: thisBoundingRect.top
                            }, {
                                x: thisBoundingRect.right,
                                y: thisBoundingRect.bottom
                            } ], convertedPoint = matrix.multiplyPoint(targetCoordinates[0]), result = {
                                left: convertedPoint.x,
                                right: convertedPoint.x,
                                top: convertedPoint.y,
                                bottom: convertedPoint.y
                            }, i = 1; i < targetCoordinates.length; ++i) convertedPoint = matrix.multiplyPoint(targetCoordinates[i]), 
                            result.left > convertedPoint.x && (result.left = convertedPoint.x), result.right < convertedPoint.x && (result.right = convertedPoint.x), 
                            result.top > convertedPoint.y && (result.top = convertedPoint.y), result.bottom < convertedPoint.y && (result.bottom = convertedPoint.y);
                            if (void 0 !== this.children) for (var i = 0; i < this.children.length; ++i) {
                                var nowResult = this.children[i]._calculateBoundingRect(matrix, c);
                                nowResult && (result.left > nowResult.left && (result.left = nowResult.left), result.right < nowResult.right && (result.right = nowResult.right), 
                                result.top > nowResult.top && (result.top = nowResult.top), result.bottom < nowResult.bottom && (result.bottom = nowResult.bottom));
                            }
                            return result;
                        }
                    }, E.prototype._enableTouchPropagation = function() {
                        for (var p = this.parent; p instanceof E && !p._hasTouchableChildren; ) p._hasTouchableChildren = !0, 
                        p = p.parent;
                    }, E.prototype._disableTouchPropagation = function() {
                        for (var p = this.parent; p instanceof E && p._hasTouchableChildren && !this._findTouchableChildren(p); ) p._hasTouchableChildren = !1, 
                        p = p.parent;
                    }, E.prototype._isTargetOperation = function(e) {
                        return !(1 & this.state) && (e instanceof g.PointEvent && (this._touchable && e.target === this));
                    }, E.prototype._findTouchableChildren = function(e) {
                        if (e.children) for (var i = 0; i < e.children.length; ++i) {
                            if (e.children[i].touchable) return e.children[i];
                            var tmp = this._findTouchableChildren(e.children[i]);
                            if (tmp) return tmp;
                        }
                    }, E;
                }(g.Object2D);
                g.E = E;
            }(g || (g = {}));
            var g;
            !function(g) {
                var CacheableE = function(_super) {
                    function CacheableE(sceneOrParam) {
                        var _this = _super.call(this, sceneOrParam) || this;
                        return _this._shouldRenderChildren = !0, _this._cache = void 0, _this._renderer = void 0, 
                        _this._renderedCamera = void 0, _this;
                    }
                    return __extends(CacheableE, _super), CacheableE.prototype.invalidate = function() {
                        this.state &= -3, this.modified();
                    }, CacheableE.prototype.renderSelf = function(renderer, camera) {
                        if (this._renderedCamera !== camera && (this.state &= -3, this._renderedCamera = camera), 
                        !(2 & this.state)) {
                            var isNew = !this._cache || this._cache.width < Math.ceil(this.width) || this._cache.height < Math.ceil(this.height);
                            isNew && (this._cache && !this._cache.destroyed() && this._cache.destroy(), this._cache = this.scene.game.resourceFactory.createSurface(Math.ceil(this.width), Math.ceil(this.height)), 
                            this._renderer = this._cache.renderer()), this._renderer.begin(), isNew || this._renderer.clear(), 
                            this.renderCache(this._renderer, camera), this.state |= 2, this._renderer.end();
                        }
                        return this._cache && this.width > 0 && this.height > 0 && renderer.drawImage(this._cache, 0, 0, this.width, this.height, 0, 0), 
                        this._shouldRenderChildren;
                    }, CacheableE.prototype.renderCache = function(renderer, camera) {
                        throw g.ExceptionFactory.createPureVirtualError("CacheableE#renderCache");
                    }, CacheableE.prototype.destroy = function() {
                        this._cache && !this._cache.destroyed() && this._cache.destroy(), this._cache = void 0, 
                        _super.prototype.destroy.call(this);
                    }, CacheableE;
                }(g.E);
                g.CacheableE = CacheableE;
            }(g || (g = {}));
            var g;
            !function(g) {
                var StorageRegion;
                !function(StorageRegion) {
                    StorageRegion[StorageRegion.Slots = 1] = "Slots", StorageRegion[StorageRegion.Scores = 2] = "Scores", 
                    StorageRegion[StorageRegion.Counts = 3] = "Counts", StorageRegion[StorageRegion.Values = 4] = "Values";
                }(StorageRegion = g.StorageRegion || (g.StorageRegion = {}));
                var StorageOrder;
                !function(StorageOrder) {
                    StorageOrder[StorageOrder.Asc = 0] = "Asc", StorageOrder[StorageOrder.Desc = 1] = "Desc";
                }(StorageOrder = g.StorageOrder || (g.StorageOrder = {}));
                var StorageCondition;
                !function(StorageCondition) {
                    StorageCondition[StorageCondition.Equal = 1] = "Equal", StorageCondition[StorageCondition.GreaterThan = 2] = "GreaterThan", 
                    StorageCondition[StorageCondition.LessThan = 3] = "LessThan";
                }(StorageCondition = g.StorageCondition || (g.StorageCondition = {}));
                var StorageCountsOperation;
                !function(StorageCountsOperation) {
                    StorageCountsOperation[StorageCountsOperation.Incr = 1] = "Incr", StorageCountsOperation[StorageCountsOperation.Decr = 2] = "Decr";
                }(StorageCountsOperation = g.StorageCountsOperation || (g.StorageCountsOperation = {}));
                var StorageValueStore = function() {
                    function StorageValueStore(keys, values) {
                        this._keys = keys, this._values = values;
                    }
                    return StorageValueStore.prototype.get = function(keyOrIndex) {
                        if (void 0 === this._values) return [];
                        if ("number" == typeof keyOrIndex) return this._values[keyOrIndex];
                        var index = this._keys.indexOf(keyOrIndex);
                        if (index !== -1) return this._values[index];
                        for (var i = 0; i < this._keys.length; ++i) {
                            var target = this._keys[i];
                            if (target.region === keyOrIndex.region && target.regionKey === keyOrIndex.regionKey && target.userId === keyOrIndex.userId && target.gameId === keyOrIndex.gameId) return this._values[i];
                        }
                        return [];
                    }, StorageValueStore.prototype.getOne = function(keyOrIndex) {
                        var values = this.get(keyOrIndex);
                        if (values) return values[0];
                    }, StorageValueStore;
                }();
                g.StorageValueStore = StorageValueStore;
                var StorageLoader = function() {
                    function StorageLoader(storage, keys, serialization) {
                        this._loaded = !1, this._storage = storage, this._valueStore = new StorageValueStore(keys), 
                        this._handler = void 0, this._valueStoreSerialization = serialization;
                    }
                    return StorageLoader.prototype._load = function(handler) {
                        this._handler = handler, this._storage._load && this._storage._load.call(this._storage, this._valueStore._keys, this, this._valueStoreSerialization);
                    }, StorageLoader.prototype._onLoaded = function(values, serialization) {
                        this._valueStore._values = values, this._loaded = !0, serialization && (this._valueStoreSerialization = serialization), 
                        this._handler && this._handler._onStorageLoaded();
                    }, StorageLoader.prototype._onError = function(error) {
                        this._handler && this._handler._onStorageLoadError(error);
                    }, StorageLoader;
                }();
                g.StorageLoader = StorageLoader;
                var Storage = function() {
                    function Storage(game) {
                        this._game = game;
                    }
                    return Storage.prototype.write = function(key, value, option) {
                        this._write && this._write(key, value, option);
                    }, Storage.prototype.requestValuesForJoinPlayer = function(keys) {
                        this._requestedKeysForJoinPlayer = keys;
                    }, Storage.prototype._createLoader = function(keys, serialization) {
                        return new StorageLoader(this, keys, serialization);
                    }, Storage.prototype._registerWrite = function(write) {
                        this._write = write;
                    }, Storage.prototype._registerLoad = function(load) {
                        this._load = load;
                    }, Storage;
                }();
                g.Storage = Storage;
            }(g || (g = {}));
            var g;
            !function(g) {
                var SceneAssetHolder = function() {
                    function SceneAssetHolder(param) {
                        this.waitingAssetsCount = param.assetIds.length, this._scene = param.scene, this._assetManager = param.assetManager, 
                        this._assetIds = param.assetIds, this._assets = [], this._handler = param.handler, 
                        this._handlerOwner = param.handlerOwner || null, this._direct = !!param.direct, 
                        this._requested = !1;
                    }
                    return SceneAssetHolder.prototype.request = function() {
                        return 0 !== this.waitingAssetsCount && (!!this._requested || (this._requested = !0, 
                        this._assetManager.requestAssets(this._assetIds, this), !0));
                    }, SceneAssetHolder.prototype.destroy = function() {
                        this._requested && this._assetManager.unrefAssets(this._assets), this.waitingAssetsCount = 0, 
                        this._scene = void 0, this._assetIds = void 0, this._handler = void 0, this._requested = !1;
                    }, SceneAssetHolder.prototype.destroyed = function() {
                        return !this._scene;
                    }, SceneAssetHolder.prototype.callHandler = function() {
                        this._handler.call(this._handlerOwner);
                    }, SceneAssetHolder.prototype._onAssetError = function(asset, error, assetManager) {
                        if (!this.destroyed() && !this._scene.destroyed()) {
                            var failureInfo = {
                                asset: asset,
                                error: error,
                                cancelRetry: !1
                            };
                            this._scene.assetLoadFailed.fire(failureInfo), error.retriable && !failureInfo.cancelRetry ? this._assetManager.retryLoad(asset) : this._assetManager.configuration[asset.id] && this._scene.game.terminateGame(), 
                            this._scene.assetLoadCompleted.fire(asset);
                        }
                    }, SceneAssetHolder.prototype._onAssetLoad = function(asset) {
                        if (!this.destroyed() && !this._scene.destroyed()) {
                            if (this._scene.assets[asset.id] = asset, this._scene.assetLoaded.fire(asset), this._scene.assetLoadCompleted.fire(asset), 
                            this._assets.push(asset), --this.waitingAssetsCount, this.waitingAssetsCount < 0) throw g.ExceptionFactory.createAssertionError("SceneAssetHolder#_onAssetLoad: broken waitingAssetsCount");
                            this.waitingAssetsCount > 0 || (this._direct ? this.callHandler() : this._scene.game._callSceneAssetHolderHandler(this));
                        }
                    }, SceneAssetHolder;
                }();
                g.SceneAssetHolder = SceneAssetHolder;
                var SceneState;
                !function(SceneState) {
                    SceneState[SceneState.Destroyed = 0] = "Destroyed", SceneState[SceneState.Standby = 1] = "Standby", 
                    SceneState[SceneState.Active = 2] = "Active", SceneState[SceneState.Deactive = 3] = "Deactive", 
                    SceneState[SceneState.BeforeDestroyed = 4] = "BeforeDestroyed";
                }(SceneState = g.SceneState || (g.SceneState = {}));
                var SceneLoadState;
                !function(SceneLoadState) {
                    SceneLoadState[SceneLoadState.Initial = 0] = "Initial", SceneLoadState[SceneLoadState.Ready = 1] = "Ready", 
                    SceneLoadState[SceneLoadState.ReadyFired = 2] = "ReadyFired", SceneLoadState[SceneLoadState.LoadedFired = 3] = "LoadedFired";
                }(SceneLoadState = g.SceneLoadState || (g.SceneLoadState = {}));
                var Scene = function() {
                    function Scene(gameOrParam, assetIds) {
                        var game, local, tickGenerationMode;
                        if (gameOrParam instanceof g.Game) game = gameOrParam, local = g.LocalTickMode.NonLocal, 
                        tickGenerationMode = g.TickGenerationMode.ByClock, game.logger.debug("[deprecated] Scene:This constructor is deprecated. Refer to the API documentation and use Scene(param: SceneParameterObject) instead."); else {
                            var param = gameOrParam;
                            game = param.game, assetIds = param.assetIds, param.storageKeys ? (this._storageLoader = game.storage._createLoader(param.storageKeys, param.storageValuesSerialization), 
                            this.storageValues = this._storageLoader._valueStore) : (this._storageLoader = void 0, 
                            this.storageValues = void 0), local = void 0 === param.local ? g.LocalTickMode.NonLocal : param.local === !1 ? g.LocalTickMode.NonLocal : param.local === !0 ? g.LocalTickMode.FullLocal : param.local, 
                            tickGenerationMode = void 0 !== param.tickGenerationMode ? param.tickGenerationMode : g.TickGenerationMode.ByClock, 
                            this.name = param.name;
                        }
                        assetIds || (assetIds = []), this.game = game, this.local = local, this.tickGenerationMode = tickGenerationMode, 
                        this.loaded = new g.Trigger(), this._ready = new g.Trigger(), this.assets = {}, 
                        this._loaded = !1, this._prefetchRequested = !1, this._loadingState = SceneLoadState.Initial, 
                        this.update = new g.Trigger(), this._timer = new g.TimerManager(this.update, this.game.fps), 
                        this.assetLoaded = new g.Trigger(), this.assetLoadFailed = new g.Trigger(), this.assetLoadCompleted = new g.Trigger(), 
                        this.message = new g.Trigger(), this.pointDownCapture = new g.Trigger(), this.pointMoveCapture = new g.Trigger(), 
                        this.pointUpCapture = new g.Trigger(), this.operation = new g.Trigger(), this.children = [], 
                        this.state = SceneState.Standby, this.stateChanged = new g.Trigger(), this._assetHolders = [], 
                        this._sceneAssetHolder = new SceneAssetHolder({
                            scene: this,
                            assetManager: this.game._assetManager,
                            assetIds: assetIds,
                            handler: this._onSceneAssetsLoad,
                            handlerOwner: this,
                            direct: !0
                        });
                    }
                    return Scene.prototype.modified = function(isBubbling) {
                        this.game.modified = !0;
                    }, Scene.prototype.destroy = function() {
                        this.state = SceneState.BeforeDestroyed, this.stateChanged.fire(this.state);
                        var gameDb = this.game.db;
                        for (var p in gameDb) gameDb.hasOwnProperty(p) && gameDb[p].scene === this && gameDb[p].destroy();
                        var gameDb = this.game._localDb;
                        for (var p in gameDb) gameDb.hasOwnProperty(p) && gameDb[p].scene === this && gameDb[p].destroy();
                        this._timer.destroy(), this.update.destroy(), this.message.destroy(), this.pointDownCapture.destroy(), 
                        this.pointMoveCapture.destroy(), this.pointUpCapture.destroy(), this.operation.destroy(), 
                        this.loaded.destroy(), this.assetLoaded.destroy(), this.assetLoadFailed.destroy(), 
                        this.assetLoadCompleted.destroy(), this.assets = {};
                        for (var i = 0; i < this._assetHolders.length; ++i) this._assetHolders[i].destroy();
                        this._sceneAssetHolder.destroy(), this._storageLoader = void 0, this.game = void 0, 
                        this.state = SceneState.Destroyed, this.stateChanged.fire(this.state), this.stateChanged.destroy();
                    }, Scene.prototype.destroyed = function() {
                        return void 0 === this.game;
                    }, Scene.prototype.createTimer = function(interval) {
                        return this._timer.createTimer(interval);
                    }, Scene.prototype.deleteTimer = function(timer) {
                        this._timer.deleteTimer(timer);
                    }, Scene.prototype.setInterval = function(interval, owner, handler) {
                        return this._timer.setInterval(interval, owner, handler);
                    }, Scene.prototype.clearInterval = function(identifier) {
                        this._timer.clearInterval(identifier);
                    }, Scene.prototype.setTimeout = function(milliseconds, owner, handler) {
                        return this._timer.setTimeout(milliseconds, owner, handler);
                    }, Scene.prototype.clearTimeout = function(identifier) {
                        this._timer.clearTimeout(identifier);
                    }, Scene.prototype.isCurrentScene = function() {
                        return this.game.scene() === this;
                    }, Scene.prototype.gotoScene = function(next, toPush) {
                        if (!this.isCurrentScene()) throw g.ExceptionFactory.createAssertionError("Scene#gotoScene: this scene is not the current scene");
                        toPush ? this.game.pushScene(next) : this.game.replaceScene(next);
                    }, Scene.prototype.end = function() {
                        if (!this.isCurrentScene()) throw g.ExceptionFactory.createAssertionError("Scene#end: this scene is not the current scene");
                        this.game.popScene();
                    }, Scene.prototype.register = function(e) {
                        this.game.register(e), e.scene = this;
                    }, Scene.prototype.unregister = function(e) {
                        e.scene = void 0, this.game.unregister(e);
                    }, Scene.prototype.append = function(e) {
                        this.insertBefore(e, void 0);
                    }, Scene.prototype.insertBefore = function(e, target) {
                        e.parent && e.remove(), e.parent = this;
                        var index = -1;
                        void 0 !== target && (index = this.children.indexOf(target)) > -1 ? this.children.splice(index, 0, e) : this.children.push(e), 
                        this.modified(!0);
                    }, Scene.prototype.remove = function(e) {
                        var index = this.children.indexOf(e);
                        index !== -1 && (this.children[index].parent = void 0, this.children.splice(index, 1), 
                        this.modified(!0));
                    }, Scene.prototype.findPointSourceByPoint = function(point, force, camera) {
                        var mayConsumeLocalTick = this.local !== g.LocalTickMode.NonLocal, children = this.children, m = void 0;
                        camera && camera instanceof g.Camera2D && (m = camera.getMatrix());
                        for (var i = children.length - 1; i >= 0; --i) {
                            var ret = children[i].findPointSourceByPoint(point, m, force, camera);
                            if (ret) return ret.local = ret.target.local || mayConsumeLocalTick, ret;
                        }
                        return {
                            target: void 0,
                            point: void 0,
                            local: mayConsumeLocalTick
                        };
                    }, Scene.prototype.prefetch = function() {
                        this._loaded || this._prefetchRequested || (this._prefetchRequested = !0, this._sceneAssetHolder.request());
                    }, Scene.prototype.serializeStorageValues = function() {
                        if (this._storageLoader) return this._storageLoader._valueStoreSerialization;
                    }, Scene.prototype.requestAssets = function(assetIds, handler) {
                        if (this._loadingState < SceneLoadState.ReadyFired) throw g.ExceptionFactory.createAssertionError("Scene#requestAsset(): can be called after loaded.");
                        var holder = new SceneAssetHolder({
                            scene: this,
                            assetManager: this.game._assetManager,
                            assetIds: assetIds,
                            handler: handler
                        });
                        this._assetHolders.push(holder), holder.request();
                    }, Scene.prototype._activate = function() {
                        this.state = SceneState.Active, this.stateChanged.fire(this.state);
                    }, Scene.prototype._deactivate = function() {
                        this.state = SceneState.Deactive, this.stateChanged.fire(this.state);
                    }, Scene.prototype._needsLoading = function() {
                        return this._sceneAssetHolder.waitingAssetsCount > 0 || this._storageLoader && !this._storageLoader._loaded;
                    }, Scene.prototype._load = function() {
                        if (!this._loaded) {
                            this._loaded = !0;
                            var needsWait = this._sceneAssetHolder.request();
                            this._storageLoader && (this._storageLoader._load(this), needsWait = !0), needsWait || this._notifySceneReady();
                        }
                    }, Scene.prototype._onSceneAssetsLoad = function() {
                        this._loaded && (this._storageLoader && !this._storageLoader._loaded || this._notifySceneReady());
                    }, Scene.prototype._onStorageLoadError = function(error) {
                        this.game.terminateGame();
                    }, Scene.prototype._onStorageLoaded = function() {
                        0 === this._sceneAssetHolder.waitingAssetsCount && this._notifySceneReady();
                    }, Scene.prototype._notifySceneReady = function() {
                        this._loadingState = SceneLoadState.Ready, this.game._fireSceneReady(this);
                    }, Scene.prototype._fireReady = function() {
                        this._ready.fire(this), this._loadingState = SceneLoadState.ReadyFired;
                    }, Scene.prototype._fireLoaded = function() {
                        this.loaded.fire(this), this._loadingState = SceneLoadState.LoadedFired;
                    }, Scene;
                }();
                g.Scene = Scene;
            }(g || (g = {}));
            var g;
            !function(g) {
                var LoadingScene = function(_super) {
                    function LoadingScene(param) {
                        var _this = this;
                        return param.local = !0, _this = _super.call(this, param) || this, _this.targetReset = new g.Trigger(), 
                        _this.targetReady = new g.Trigger(), _this.targetAssetLoaded = new g.Trigger(), 
                        _this._explicitEnd = !!param.explicitEnd, _this._targetScene = void 0, _this;
                    }
                    return __extends(LoadingScene, _super), LoadingScene.prototype.destroy = function() {
                        this._clearTargetScene(), _super.prototype.destroy.call(this);
                    }, LoadingScene.prototype.reset = function(targetScene) {
                        this._clearTargetScene(), this._targetScene = targetScene, this._loadingState < g.SceneLoadState.LoadedFired ? this.loaded.handle(this, this._doReset) : this._doReset();
                    }, LoadingScene.prototype.getTargetWaitingAssetsCount = function() {
                        return this._targetScene ? this._targetScene._sceneAssetHolder.waitingAssetsCount : 0;
                    }, LoadingScene.prototype.end = function() {
                        if (!this._targetScene || this._targetScene._loadingState < g.SceneLoadState.Ready) {
                            var state = this._targetScene ? g.SceneLoadState[this._targetScene._loadingState] : "(no scene)", msg = "LoadingScene#end(): the target scene is in invalid state: " + state;
                            throw g.ExceptionFactory.createAssertionError(msg);
                        }
                        this.game.popScene(!0), this.game._fireSceneLoaded(this._targetScene), this._clearTargetScene();
                    }, LoadingScene.prototype._clearTargetScene = function() {
                        this._targetScene && (this._targetScene._ready.removeAll(this), this._targetScene.assetLoaded.removeAll(this), 
                        this._targetScene = void 0);
                    }, LoadingScene.prototype._doReset = function() {
                        return this.targetReset.fire(this._targetScene), this._targetScene._loadingState < g.SceneLoadState.ReadyFired ? (this._targetScene._ready.handle(this, this._fireTriggerOnTargetReady), 
                        this._targetScene.assetLoaded.handle(this, this._fireTriggerOnTargetAssetLoad), 
                        this._targetScene._load()) : this._fireTriggerOnTargetReady(this._targetScene), 
                        !0;
                    }, LoadingScene.prototype._fireTriggerOnTargetAssetLoad = function(asset) {
                        this._onTargetAssetLoad(asset), this.targetAssetLoaded.fire(asset);
                    }, LoadingScene.prototype._fireTriggerOnTargetReady = function(scene) {
                        this.targetReady.fire(scene), this._explicitEnd || this.end();
                    }, LoadingScene.prototype._onTargetAssetLoad = function(asset) {
                        return !0;
                    }, LoadingScene;
                }(g.Scene);
                g.LoadingScene = LoadingScene;
            }(g || (g = {}));
            var g;
            !function(g) {
                var CameraCancellingE = function(_super) {
                    function CameraCancellingE(param) {
                        var _this = _super.call(this, param) || this;
                        return _this._canceller = new g.Object2D(), _this;
                    }
                    return __extends(CameraCancellingE, _super), CameraCancellingE.prototype.renderSelf = function(renderer, camera) {
                        if (!this.children) return !1;
                        if (camera) {
                            var c = camera, canceller = this._canceller;
                            c.x === canceller.x && c.y === canceller.y && c.angle === canceller.angle && c.scaleX === canceller.scaleX && c.scaleY === canceller.scaleY || (canceller.x = c.x, 
                            canceller.y = c.y, canceller.angle = c.angle, canceller.scaleX = c.scaleX, canceller.scaleY = c.scaleY, 
                            canceller._matrix && (canceller._matrix._modified = !0)), renderer.save(), renderer.transform(canceller.getMatrix()._matrix);
                        }
                        for (var children = this.children, i = 0; i < children.length; ++i) children[i].render(renderer, camera);
                        return camera && renderer.restore(), !1;
                    }, CameraCancellingE;
                }(g.E), DefaultLoadingScene = function(_super) {
                    function DefaultLoadingScene(param) {
                        var _this = _super.call(this, {
                            game: param.game,
                            name: "akashic:default-loading-scene"
                        }) || this;
                        return _this._barWidth = Math.min(param.game.width, Math.max(100, param.game.width / 2)), 
                        _this._barHeight = 5, _this._gauge = void 0, _this._gaugeUpdateCount = 0, _this._totalWaitingAssetCount = 0, 
                        _this.loaded.handle(_this, _this._onLoaded), _this.targetReset.handle(_this, _this._onTargetReset), 
                        _this.targetAssetLoaded.handle(_this, _this._onTargetAssetLoaded), _this;
                    }
                    return __extends(DefaultLoadingScene, _super), DefaultLoadingScene.prototype._onLoaded = function() {
                        var gauge;
                        return this.append(new CameraCancellingE({
                            scene: this,
                            children: [ new g.FilledRect({
                                scene: this,
                                width: this.game.width,
                                height: this.game.height,
                                cssColor: "rgba(0, 0, 0, 0.8)",
                                children: [ new g.FilledRect({
                                    scene: this,
                                    x: (this.game.width - this._barWidth) / 2,
                                    y: (this.game.height - this._barHeight) / 2,
                                    width: this._barWidth,
                                    height: this._barHeight,
                                    cssColor: "gray",
                                    children: [ gauge = new g.FilledRect({
                                        scene: this,
                                        width: 0,
                                        height: this._barHeight,
                                        cssColor: "white"
                                    }) ]
                                }) ]
                            }) ]
                        })), gauge.update.handle(this, this._onUpdateGuage), this._gauge = gauge, !0;
                    }, DefaultLoadingScene.prototype._onUpdateGuage = function() {
                        var BLINK_RANGE = 50, BLINK_PER_SEC = 2 / 3;
                        ++this._gaugeUpdateCount;
                        var c = Math.round(255 - BLINK_RANGE + Math.sin(this._gaugeUpdateCount / this.game.fps * BLINK_PER_SEC * (2 * Math.PI)) * BLINK_RANGE);
                        this._gauge.cssColor = "rgb(" + c + "," + c + "," + c + ")", this._gauge.modified();
                    }, DefaultLoadingScene.prototype._onTargetReset = function(targetScene) {
                        this._gauge && (this._gauge.width = 0, this._gauge.modified()), this._totalWaitingAssetCount = targetScene._sceneAssetHolder.waitingAssetsCount;
                    }, DefaultLoadingScene.prototype._onTargetAssetLoaded = function(asset) {
                        var waitingAssetsCount = this._targetScene._sceneAssetHolder.waitingAssetsCount;
                        this._gauge.width = Math.ceil((1 - waitingAssetsCount / this._totalWaitingAssetCount) * this._barWidth), 
                        this._gauge.modified();
                    }, DefaultLoadingScene;
                }(g.LoadingScene);
                g.DefaultLoadingScene = DefaultLoadingScene;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Sprite = function(_super) {
                    function Sprite(sceneOrParam, src, width, height) {
                        var _this = this;
                        if (sceneOrParam instanceof g.Scene) {
                            var scene = sceneOrParam;
                            _this = _super.call(this, scene) || this, _this.surface = g.Util.asSurface(src), 
                            _this.width = void 0 !== width ? width : _this.surface.width, _this.height = void 0 !== height ? height : _this.surface.height, 
                            _this.srcWidth = _this.width, _this.srcHeight = _this.height, _this.srcX = 0, _this.srcY = 0, 
                            _this._stretchMatrix = void 0, _this._beforeSurface = _this.surface, g.Util.setupAnimatingHandler(_this, _this.surface);
                        } else {
                            var param = sceneOrParam;
                            _this = _super.call(this, param) || this, _this.surface = g.Util.asSurface(param.src), 
                            "width" in param || (_this.width = _this.surface.width), "height" in param || (_this.height = _this.surface.height), 
                            _this.srcWidth = "srcWidth" in param ? param.srcWidth : _this.width, _this.srcHeight = "srcHeight" in param ? param.srcHeight : _this.height, 
                            _this.srcX = param.srcX || 0, _this.srcY = param.srcY || 0, _this._stretchMatrix = void 0, 
                            _this._beforeSurface = _this.surface, g.Util.setupAnimatingHandler(_this, _this.surface), 
                            _this._invalidateSelf();
                        }
                        return _this;
                    }
                    return __extends(Sprite, _super), Sprite.prototype._onUpdate = function() {
                        this.modified();
                    }, Sprite.prototype._onAnimatingStarted = function() {
                        this.update.isHandled(this, this._onUpdate) || this.update.handle(this, this._onUpdate);
                    }, Sprite.prototype._onAnimatingStopped = function() {
                        this.destroyed() || this.update.remove(this, this._onUpdate);
                    }, Sprite.prototype.renderSelf = function(renderer, camera) {
                        return this.srcWidth <= 0 || this.srcHeight <= 0 || (this._stretchMatrix && (renderer.save(), 
                        renderer.transform(this._stretchMatrix._matrix)), renderer.drawImage(this.surface, this.srcX, this.srcY, this.srcWidth, this.srcHeight, 0, 0), 
                        this._stretchMatrix && renderer.restore(), !0);
                    }, Sprite.prototype.invalidate = function() {
                        this._invalidateSelf(), this.modified();
                    }, Sprite.prototype.destroy = function(destroySurface) {
                        this.surface && !this.surface.destroyed() && (destroySurface ? this.surface.destroy() : this.surface.isDynamic && (this.surface.animatingStarted.remove(this, this._onAnimatingStarted), 
                        this.surface.animatingStopped.remove(this, this._onAnimatingStopped))), this.surface = void 0, 
                        _super.prototype.destroy.call(this);
                    }, Sprite.prototype._invalidateSelf = function() {
                        this.width === this.srcWidth && this.height === this.srcHeight ? this._stretchMatrix = void 0 : (this._stretchMatrix = g.Util.createMatrix(), 
                        this._stretchMatrix.scale(this.width / this.srcWidth, this.height / this.srcHeight)), 
                        this.surface !== this._beforeSurface && (g.Util.migrateAnimatingHandler(this, this._beforeSurface, this.surface), 
                        this._beforeSurface = this.surface);
                    }, Sprite;
                }(g.E);
                g.Sprite = Sprite;
            }(g || (g = {}));
            var g;
            !function(g) {
                var FrameSprite = function(_super) {
                    function FrameSprite(sceneOrParam, src, width, height) {
                        var _this = this;
                        if (sceneOrParam instanceof g.Scene) {
                            var scene = sceneOrParam;
                            _this = _super.call(this, scene, src, width, height) || this, _this._lastUsedIndex = 0, 
                            _this.frameNumber = 0, _this.frames = [ 0 ], _this.interval = void 0, _this._timer = void 0;
                        } else {
                            var param = sceneOrParam;
                            _this = _super.call(this, param) || this, _this._lastUsedIndex = 0, _this.frameNumber = param.frameNumber || 0, 
                            _this.frames = "frames" in param ? param.frames : [ 0 ], _this.interval = param.interval, 
                            _this._timer = void 0, _this._modifiedSelf();
                        }
                        return _this;
                    }
                    return __extends(FrameSprite, _super), FrameSprite.createBySprite = function(sprite, width, height) {
                        var frameSprite = new FrameSprite({
                            scene: sprite.scene,
                            src: sprite.surface,
                            width: void 0 === width ? sprite.width : width,
                            height: void 0 === height ? sprite.height : height
                        });
                        return frameSprite.srcHeight = void 0 === height ? sprite.srcHeight : height, frameSprite.srcWidth = void 0 === width ? sprite.srcWidth : width, 
                        frameSprite;
                    }, FrameSprite.prototype.start = function() {
                        void 0 === this.interval && (this.interval = 1e3 / this.game().fps), this._timer && this._free(), 
                        this._timer = this.scene.createTimer(this.interval), this._timer.elapsed.handle(this, this._onElapsed);
                    }, FrameSprite.prototype.destroy = function(destroySurface) {
                        this.stop(), _super.prototype.destroy.call(this, destroySurface);
                    }, FrameSprite.prototype.stop = function() {
                        this._timer && this._free();
                    }, FrameSprite.prototype.modified = function(isBubbling) {
                        this._modifiedSelf(isBubbling), _super.prototype.modified.call(this, isBubbling);
                    }, FrameSprite.prototype._onElapsed = function() {
                        ++this.frameNumber >= this.frames.length && (this.frameNumber = 0), this.modified();
                    }, FrameSprite.prototype._free = function() {
                        this._timer && (this._timer.elapsed.remove(this, this._onElapsed), this._timer.canDelete() && this.scene.deleteTimer(this._timer), 
                        this._timer = void 0);
                    }, FrameSprite.prototype._changeFrame = function() {
                        var frame = this.frames[this.frameNumber], sep = Math.floor(this.surface.width / this.srcWidth);
                        this.srcX = frame % sep * this.srcWidth, this.srcY = Math.floor(frame / sep) * this.srcHeight, 
                        this._lastUsedIndex = frame;
                    }, FrameSprite.prototype._modifiedSelf = function(isBubbling) {
                        this._lastUsedIndex !== this.frames[this.frameNumber] && this._changeFrame();
                    }, FrameSprite;
                }(g.Sprite);
                g.FrameSprite = FrameSprite;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Tile = function(_super) {
                    function Tile(sceneOrParam, src, tileWidth, tileHeight, tileData) {
                        var _this = this;
                        if (sceneOrParam instanceof g.Scene) {
                            var scene = sceneOrParam;
                            _this = _super.call(this, scene) || this, _this.tileWidth = tileWidth, _this.tileHeight = tileHeight, 
                            _this.tileData = tileData, _this.tileChips = g.Util.asSurface(src), _this.height = _this.tileHeight * _this.tileData.length, 
                            _this.width = _this.tileWidth * _this.tileData[0].length, _this._tilesInRow = Math.floor(_this.tileChips.width / _this.tileWidth);
                        } else {
                            var param = sceneOrParam;
                            _this = _super.call(this, param) || this, _this.tileWidth = param.tileWidth, _this.tileHeight = param.tileHeight, 
                            _this.tileData = param.tileData, _this.tileChips = g.Util.asSurface(param.src), 
                            _this.height = _this.tileHeight * _this.tileData.length, _this.width = _this.tileWidth * _this.tileData[0].length;
                        }
                        return _this._beforeTileChips = _this.tileChips, g.Util.setupAnimatingHandler(_this, _this.tileChips), 
                        _this._invalidateSelf(), _this;
                    }
                    return __extends(Tile, _super), Tile.prototype._onUpdate = function() {
                        this.invalidate();
                    }, Tile.prototype._onAnimatingStarted = function() {
                        this.update.isHandled(this, this._onUpdate) || this.update.handle(this, this._onUpdate);
                    }, Tile.prototype._onAnimatingStopped = function() {
                        this.destroyed() || this.update.remove(this, this._onUpdate);
                    }, Tile.prototype.renderCache = function(renderer) {
                        if (!this.tileData) throw g.ExceptionFactory.createAssertionError("Tile#_renderCache: don't have a tile data");
                        if (!(this.tileWidth <= 0 || this.tileHeight <= 0)) for (var y = 0; y < this.tileData.length; ++y) for (var row = this.tileData[y], x = 0; x < row.length; ++x) {
                            var tile = row[x];
                            if (!(tile < 0)) {
                                var tileX = this.tileWidth * (tile % this._tilesInRow), tileY = this.tileHeight * Math.floor(tile / this._tilesInRow), dx = this.tileWidth * x, dy = this.tileHeight * y;
                                renderer.drawImage(this.tileChips, tileX, tileY, this.tileWidth, this.tileHeight, dx, dy);
                            }
                        }
                    }, Tile.prototype.invalidate = function() {
                        this._invalidateSelf(), _super.prototype.invalidate.call(this);
                    }, Tile.prototype.destroy = function(destroySurface) {
                        destroySurface && this.tileChips && !this.tileChips.destroyed() && this.tileChips.destroy(), 
                        this.tileChips = void 0, _super.prototype.destroy.call(this);
                    }, Tile.prototype._invalidateSelf = function() {
                        this._tilesInRow = Math.floor(this.tileChips.width / this.tileWidth), this.tileChips !== this._beforeTileChips && (g.Util.migrateAnimatingHandler(this, this._beforeTileChips, this.tileChips), 
                        this._beforeTileChips = this.tileChips);
                    }, Tile;
                }(g.CacheableE);
                g.Tile = Tile;
            }(g || (g = {}));
            var g;
            !function(g) {
                var EventType;
                !function(EventType) {
                    EventType[EventType.Unknown = 0] = "Unknown", EventType[EventType.Join = 1] = "Join", 
                    EventType[EventType.Leave = 2] = "Leave", EventType[EventType.Timestamp = 3] = "Timestamp", 
                    EventType[EventType.Seed = 4] = "Seed", EventType[EventType.PointDown = 5] = "PointDown", 
                    EventType[EventType.PointMove = 6] = "PointMove", EventType[EventType.PointUp = 7] = "PointUp", 
                    EventType[EventType.Message = 8] = "Message", EventType[EventType.Operation = 9] = "Operation";
                }(EventType = g.EventType || (g.EventType = {}));
                var PointEvent = function() {
                    function PointEvent(pointerId, target, point, player, local, priority) {
                        this.priority = priority, this.local = local, this.player = player, this.pointerId = pointerId, 
                        this.target = target, this.point = point;
                    }
                    return PointEvent;
                }();
                g.PointEvent = PointEvent;
                var PointDownEvent = function(_super) {
                    function PointDownEvent(pointerId, target, point, player, local, priority) {
                        var _this = _super.call(this, pointerId, target, point, player, local, priority) || this;
                        return _this.type = EventType.PointDown, _this;
                    }
                    return __extends(PointDownEvent, _super), PointDownEvent;
                }(PointEvent);
                g.PointDownEvent = PointDownEvent;
                var PointUpEvent = function(_super) {
                    function PointUpEvent(pointerId, target, point, prevDelta, startDelta, player, local, priority) {
                        var _this = _super.call(this, pointerId, target, point, player, local, priority) || this;
                        return _this.type = EventType.PointUp, _this.prevDelta = prevDelta, _this.startDelta = startDelta, 
                        _this;
                    }
                    return __extends(PointUpEvent, _super), PointUpEvent;
                }(PointEvent);
                g.PointUpEvent = PointUpEvent;
                var PointMoveEvent = function(_super) {
                    function PointMoveEvent(pointerId, target, point, prevDelta, startDelta, player, local, priority) {
                        var _this = _super.call(this, pointerId, target, point, player, local, priority) || this;
                        return _this.type = EventType.PointMove, _this.prevDelta = prevDelta, _this.startDelta = startDelta, 
                        _this;
                    }
                    return __extends(PointMoveEvent, _super), PointMoveEvent;
                }(PointEvent);
                g.PointMoveEvent = PointMoveEvent;
                var MessageEvent = function() {
                    function MessageEvent(data, player, local, priority) {
                        this.type = EventType.Message, this.priority = priority, this.local = local, this.player = player, 
                        this.data = data;
                    }
                    return MessageEvent;
                }();
                g.MessageEvent = MessageEvent;
                var OperationEvent = function() {
                    function OperationEvent(code, data, player, local, priority) {
                        this.type = EventType.Operation, this.priority = priority, this.local = local, this.player = player, 
                        this.code = code, this.data = data;
                    }
                    return OperationEvent;
                }();
                g.OperationEvent = OperationEvent;
                var JoinEvent = function() {
                    function JoinEvent(player, storageValues, priority) {
                        this.type = EventType.Join, this.priority = priority, this.player = player, this.storageValues = storageValues;
                    }
                    return JoinEvent;
                }();
                g.JoinEvent = JoinEvent;
                var LeaveEvent = function() {
                    function LeaveEvent(player, priority) {
                        this.type = EventType.Leave, this.priority = priority, this.player = player;
                    }
                    return LeaveEvent;
                }();
                g.LeaveEvent = LeaveEvent;
                var TimestampEvent = function() {
                    function TimestampEvent(timestamp, player, priority) {
                        this.type = EventType.Timestamp, this.priority = priority, this.player = player, 
                        this.timestamp = timestamp;
                    }
                    return TimestampEvent;
                }();
                g.TimestampEvent = TimestampEvent;
                var SeedEvent = function() {
                    function SeedEvent(generator, priority) {
                        this.type = EventType.Seed, this.priority = priority, this.generator = generator;
                    }
                    return SeedEvent;
                }();
                g.SeedEvent = SeedEvent;
            }(g || (g = {}));
            var g;
            !function(g) {
                var LogLevel;
                !function(LogLevel) {
                    LogLevel[LogLevel.Error = 0] = "Error", LogLevel[LogLevel.Warn = 1] = "Warn", LogLevel[LogLevel.Info = 2] = "Info", 
                    LogLevel[LogLevel.Debug = 3] = "Debug";
                }(LogLevel = g.LogLevel || (g.LogLevel = {}));
                var Logger = function() {
                    function Logger(game) {
                        this.game = game, this.logging = new g.Trigger();
                    }
                    return Logger.prototype.error = function(message, cause) {
                        this.logging.fire({
                            game: this.game,
                            level: LogLevel.Error,
                            message: message,
                            cause: cause
                        });
                    }, Logger.prototype.warn = function(message, cause) {
                        this.logging.fire({
                            game: this.game,
                            level: LogLevel.Warn,
                            message: message,
                            cause: cause
                        });
                    }, Logger.prototype.info = function(message, cause) {
                        this.logging.fire({
                            game: this.game,
                            level: LogLevel.Info,
                            message: message,
                            cause: cause
                        });
                    }, Logger.prototype.debug = function(message, cause) {
                        this.logging.fire({
                            game: this.game,
                            level: LogLevel.Debug,
                            message: message,
                            cause: cause
                        });
                    }, Logger;
                }();
                g.Logger = Logger;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Game = function() {
                    function Game(gameConfiguration, resourceFactory, assetBase, selfId, operationPluginViewInfo) {
                        gameConfiguration = this._normalizeConfiguration(gameConfiguration), this.fps = gameConfiguration.fps, 
                        this.width = gameConfiguration.width, this.height = gameConfiguration.height, this.renderers = [], 
                        this.scenes = [], this.random = [], this.age = 0, this.assetBase = assetBase || "", 
                        this.resourceFactory = resourceFactory, this.selfId = selfId || void 0, this.playId = void 0, 
                        this._audioSystemManager = new g.AudioSystemManager(this), this.audio = {
                            music: new g.MusicAudioSystem("music", this),
                            sound: new g.SoundAudioSystem("sound", this)
                        }, this.defaultAudioSystemId = "sound", this.storage = new g.Storage(this), this.assets = {}, 
                        this.join = new g.Trigger(), this.leave = new g.Trigger(), this.seed = new g.Trigger(), 
                        this._eventTriggerMap = {}, this._eventTriggerMap[g.EventType.Join] = this.join, 
                        this._eventTriggerMap[g.EventType.Leave] = this.leave, this._eventTriggerMap[g.EventType.Seed] = this.seed, 
                        this._eventTriggerMap[g.EventType.Message] = void 0, this._eventTriggerMap[g.EventType.PointDown] = void 0, 
                        this._eventTriggerMap[g.EventType.PointMove] = void 0, this._eventTriggerMap[g.EventType.PointUp] = void 0, 
                        this._eventTriggerMap[g.EventType.Operation] = void 0, this._loaded = new g.Trigger(), 
                        this._started = new g.Trigger(), this.isLoaded = !1, this.snapshotRequest = new g.Trigger(), 
                        this.external = {}, this.logger = new g.Logger(this), this._main = gameConfiguration.main, 
                        this._mainParameter = void 0, this._configuration = gameConfiguration, this._assetManager = new g.AssetManager(this, gameConfiguration.assets, gameConfiguration.audio);
                        var operationPluginsField = gameConfiguration.operationPlugins || [];
                        this._operationPluginManager = new g.OperationPluginManager(this, operationPluginViewInfo, operationPluginsField), 
                        this._operationPluginOperated = new g.Trigger(), this._operationPluginManager.operated.handle(this._operationPluginOperated, this._operationPluginOperated.fire), 
                        this._sceneChanged = new g.Trigger(), this._sceneChanged.handle(this, this._updateEventTriggers), 
                        this._initialScene = new g.Scene({
                            game: this,
                            assetIds: this._assetManager.globalAssetIds(),
                            local: !0,
                            name: "akashic:initial-scene"
                        }), this._initialScene.loaded.handle(this, this._onInitialSceneLoaded), this._reset({
                            age: 0
                        });
                    }
                    return Object.defineProperty(Game.prototype, "focusingCamera", {
                        get: function() {
                            return this._focusingCamera;
                        },
                        set: function(c) {
                            c !== this._focusingCamera && (this.modified && this.render(this._focusingCamera), 
                            this._focusingCamera = c);
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Game.prototype.pushScene = function(scene) {
                        this._sceneChangeRequests.push({
                            type: 0,
                            scene: scene
                        });
                    }, Game.prototype.replaceScene = function(scene, preserveCurrent) {
                        this._sceneChangeRequests.push({
                            type: 1,
                            scene: scene,
                            preserveCurrent: preserveCurrent
                        });
                    }, Game.prototype.popScene = function(preserveCurrent) {
                        this._sceneChangeRequests.push({
                            type: 2,
                            preserveCurrent: preserveCurrent
                        });
                    }, Game.prototype.scene = function() {
                        if (this.scenes.length) return this.scenes[this.scenes.length - 1];
                    }, Game.prototype.tick = function(advanceAge) {
                        var scene = void 0;
                        if (this._isTerminated) return !1;
                        if (this.scenes.length) {
                            if (scene = this.scenes[this.scenes.length - 1], this.events.length) {
                                var events = this.events;
                                this.events = [];
                                for (var i = 0; i < events.length; ++i) {
                                    var trigger = this._eventTriggerMap[events[i].type];
                                    trigger && trigger.fire(events[i]);
                                }
                            }
                            scene.update.fire(), (advanceAge === !0 || void 0 === advanceAge && scene.local !== g.LocalTickMode.FullLocal) && ++this.age;
                        }
                        return !!this._sceneChangeRequests.length && (this._flushSceneChangeRequests(), 
                        scene !== this.scenes[this.scenes.length - 1]);
                    }, Game.prototype.render = function(camera) {
                        camera || (camera = this.focusingCamera);
                        for (var renderers = this.renderers, i = 0; i < renderers.length; ++i) renderers[i].draw(this, camera);
                        this.modified = !1;
                    }, Game.prototype.findPointSource = function(point, camera) {
                        return camera || (camera = this.focusingCamera), this.scene().findPointSourceByPoint(point, !1, camera);
                    }, Game.prototype.register = function(e) {
                        if (e.local) {
                            if (void 0 === e.id) e.id = --this._localIdx; else {
                                if (e.id > 0) throw g.ExceptionFactory.createAssertionError("Game#register: invalid local id: " + e.id);
                                if (this._localDb.hasOwnProperty(String(e.id))) throw g.ExceptionFactory.createAssertionError("Game#register: conflicted id: " + e.id);
                                this._localIdx > e.id && (this._localIdx = e.id);
                            }
                            this._localDb[e.id] = e;
                        } else {
                            if (void 0 === e.id) e.id = ++this._idx; else {
                                if (e.id < 0) throw g.ExceptionFactory.createAssertionError("Game#register: invalid non-local id: " + e.id);
                                if (this.db.hasOwnProperty(String(e.id))) throw g.ExceptionFactory.createAssertionError("Game#register: conflicted id: " + e.id);
                                this._idx < e.id && (this._idx = e.id);
                            }
                            this.db[e.id] = e;
                        }
                    }, Game.prototype.unregister = function(e) {
                        e.local ? delete this._localDb[e.id] : delete this.db[e.id];
                    }, Game.prototype.leaveGame = function() {
                        this._leaveGame();
                    }, Game.prototype.terminateGame = function() {
                        this._leaveGame(), this._isTerminated = !0, this._terminateGame();
                    }, Game.prototype.raiseEvent = function(e) {
                        throw g.ExceptionFactory.createPureVirtualError("Game#raiseEvent");
                    }, Game.prototype.raiseTick = function(events) {
                        throw g.ExceptionFactory.createPureVirtualError("Game#raiseTick");
                    }, Game.prototype.addEventFilter = function(filter) {
                        throw g.ExceptionFactory.createPureVirtualError("Game#addEventFilter");
                    }, Game.prototype.removeEventFilter = function(filter) {
                        throw g.ExceptionFactory.createPureVirtualError("Game#removeEventFilter");
                    }, Game.prototype.shouldSaveSnapshot = function() {
                        throw g.ExceptionFactory.createPureVirtualError("Game#shouldSaveSnapshot");
                    }, Game.prototype.saveSnapshot = function(snapshot, timestamp) {
                        throw g.ExceptionFactory.createPureVirtualError("Game#saveSnapshot");
                    }, Game.prototype._fireSceneReady = function(scene) {
                        this._sceneChangeRequests.push({
                            type: 3,
                            scene: scene
                        });
                    }, Game.prototype._fireSceneLoaded = function(scene) {
                        scene._loadingState < g.SceneLoadState.LoadedFired && this._sceneChangeRequests.push({
                            type: 4,
                            scene: scene
                        });
                    }, Game.prototype._callSceneAssetHolderHandler = function(assetHolder) {
                        this._sceneChangeRequests.push({
                            type: 5,
                            assetHolder: assetHolder
                        });
                    }, Game.prototype._normalizeConfiguration = function(gameConfiguration) {
                        if (!gameConfiguration) throw g.ExceptionFactory.createAssertionError("Game#_normalizeConfiguration: invalid arguments");
                        if ("assets" in gameConfiguration || (gameConfiguration.assets = {}), "fps" in gameConfiguration || (gameConfiguration.fps = 30), 
                        "number" != typeof gameConfiguration.fps) throw g.ExceptionFactory.createAssertionError("Game#_normalizeConfiguration: fps must be given as a number");
                        if (!(0 <= gameConfiguration.fps && gameConfiguration.fps <= 60)) throw g.ExceptionFactory.createAssertionError("Game#_normalizeConfiguration: fps must be a number in (0, 60].");
                        if ("number" != typeof gameConfiguration.width) throw g.ExceptionFactory.createAssertionError("Game#_normalizeConfiguration: width must be given as a number");
                        if ("number" != typeof gameConfiguration.height) throw g.ExceptionFactory.createAssertionError("Game#_normalizeConfiguration: height must be given as a number");
                        return gameConfiguration;
                    }, Game.prototype._setAudioPlaybackRate = function(playbackRate) {
                        this._audioSystemManager._setPlaybackRate(playbackRate);
                    }, Game.prototype._setMuted = function(muted) {
                        this._audioSystemManager._setMuted(muted);
                    }, Game.prototype._decodeOperationPluginOperation = function(code, op) {
                        var plugins = this._operationPluginManager.plugins;
                        return plugins[code] && plugins[code].decode ? plugins[code].decode(op) : op;
                    }, Game.prototype._reset = function(param) {
                        if (this._operationPluginManager.stopAll(), this.scene()) {
                            for (;this.scene() !== this._initialScene; ) this.popScene(), this._flushSceneChangeRequests();
                            this.isLoaded || this.scenes.pop();
                        }
                        switch (param && (void 0 !== param.age && (this.age = param.age), void 0 !== param.randGen && (this.random[0] = param.randGen)), 
                        this._loaded.removeAllByHandler(this._start), this.join._reset(), this.leave._reset(), 
                        this.seed._reset(), this._idx = 0, this._localIdx = 0, this._cameraIdx = 0, this.db = {}, 
                        this._localDb = {}, this.events = [], this.modified = !0, this.loadingScene = void 0, 
                        this._focusingCamera = void 0, this._scriptCaches = {}, this.snapshotRequest._reset(), 
                        this._sceneChangeRequests = [], this._isTerminated = !1, this.vars = {}, this._configuration.defaultLoadingScene) {
                          case "none":
                            this._defaultLoadingScene = new g.LoadingScene({
                                game: this
                            });
                            break;

                          default:
                            this._defaultLoadingScene = new g.DefaultLoadingScene({
                                game: this
                            });
                        }
                    }, Game.prototype._loadAndStart = function(param) {
                        this._mainParameter = param || {}, this.isLoaded ? this._start() : (this._loaded.handle(this, this._start), 
                        this.pushScene(this._initialScene), this._flushSceneChangeRequests());
                    }, Game.prototype._startLoadingGlobalAssets = function() {
                        if (this.isLoaded) throw g.ExceptionFactory.createAssertionError("Game#_startLoadingGlobalAssets: already loaded.");
                        this.pushScene(this._initialScene), this._flushSceneChangeRequests();
                    }, Game.prototype._updateEventTriggers = function(scene) {
                        return this.modified = !0, scene ? (this._eventTriggerMap[g.EventType.Message] = scene.message, 
                        this._eventTriggerMap[g.EventType.PointDown] = scene.pointDownCapture, this._eventTriggerMap[g.EventType.PointMove] = scene.pointMoveCapture, 
                        this._eventTriggerMap[g.EventType.PointUp] = scene.pointUpCapture, this._eventTriggerMap[g.EventType.Operation] = scene.operation, 
                        void scene._activate()) : (this._eventTriggerMap[g.EventType.Message] = void 0, 
                        this._eventTriggerMap[g.EventType.PointDown] = void 0, this._eventTriggerMap[g.EventType.PointMove] = void 0, 
                        this._eventTriggerMap[g.EventType.PointUp] = void 0, void (this._eventTriggerMap[g.EventType.Operation] = void 0));
                    }, Game.prototype._onInitialSceneLoaded = function() {
                        this._initialScene.loaded.remove(this, this._onInitialSceneLoaded), this.assets = this._initialScene.assets, 
                        this.isLoaded = !0, this._loaded.fire();
                    }, Game.prototype._leaveGame = function() {
                        throw g.ExceptionFactory.createPureVirtualError("Game#_leaveGame");
                    }, Game.prototype._terminateGame = function() {}, Game.prototype._flushSceneChangeRequests = function() {
                        do {
                            var reqs = this._sceneChangeRequests;
                            this._sceneChangeRequests = [];
                            for (var i = 0; i < reqs.length; ++i) {
                                var req = reqs[i];
                                switch (req.type) {
                                  case 0:
                                    var oldScene = this.scene();
                                    oldScene && oldScene._deactivate(), this._doPushScene(req.scene);
                                    break;

                                  case 1:
                                    this._doPopScene(req.preserveCurrent, !1), this._doPushScene(req.scene);
                                    break;

                                  case 2:
                                    this._doPopScene(req.preserveCurrent, !0);
                                    break;

                                  case 3:
                                    req.scene._fireReady();
                                    break;

                                  case 4:
                                    req.scene._fireLoaded();
                                    break;

                                  case 5:
                                    req.assetHolder.callHandler();
                                    break;

                                  default:
                                    throw g.ExceptionFactory.createAssertionError("Game#_flushSceneChangeRequests: unknown scene change request.");
                                }
                            }
                        } while (this._sceneChangeRequests.length > 0);
                    }, Game.prototype._doPopScene = function(preserveCurrent, fireSceneChanged) {
                        var scene = this.scenes.pop();
                        if (scene === this._initialScene) throw g.ExceptionFactory.createAssertionError("Game#_doPopScene: invalid call; attempting to pop the initial scene");
                        preserveCurrent || scene.destroy(), fireSceneChanged && this._sceneChanged.fire(this.scene());
                    }, Game.prototype._start = function() {
                        if (this._operationPluginManager.initialize(), this.operationPlugins = this._operationPluginManager.plugins, 
                        !this._main) {
                            if (this._mainParameter.snapshot) {
                                if (!this.assets.snapshotLoader) throw g.ExceptionFactory.createAssertionError("Game#_start: global asset 'snapshotLoader' not found.");
                                var loader = g._require(this, "snapshotLoader");
                                loader(this._mainParameter.snapshot), this._flushSceneChangeRequests();
                            } else {
                                if (!this.assets.mainScene) throw g.ExceptionFactory.createAssertionError("Game#_start: global asset 'mainScene' not found.");
                                var mainScene = g._require(this, "mainScene")();
                                this.pushScene(mainScene), this._flushSceneChangeRequests();
                            }
                            return void this._started.fire();
                        }
                        var mainFun = g._require(this, this._main);
                        if (!mainFun || "function" != typeof mainFun) throw g.ExceptionFactory.createAssertionError("Game#_start: Entry point '" + this._main + "' not found.");
                        mainFun(this._mainParameter), this._flushSceneChangeRequests(), this._started.fire();
                    }, Game.prototype._doPushScene = function(scene, loadingScene) {
                        if (loadingScene || (loadingScene = this.loadingScene || this._defaultLoadingScene), 
                        this.scenes.push(scene), scene._needsLoading() && scene._loadingState < g.SceneLoadState.LoadedFired) {
                            if (this._defaultLoadingScene._needsLoading()) throw g.ExceptionFactory.createAssertionError("Game#_doPushScene: _defaultLoadingScene must not depend on any assets/storages.");
                            this._doPushScene(loadingScene, this._defaultLoadingScene), loadingScene.reset(scene);
                        } else this._sceneChanged.fire(scene), scene._loaded || (scene._load(), this._fireSceneLoaded(scene));
                        this.modified = !0;
                    }, Game;
                }();
                g.Game = Game;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Camera2D = function(_super) {
                    function Camera2D(gameOrParam) {
                        var _this = this;
                        if (gameOrParam instanceof g.Game) {
                            var game = gameOrParam;
                            _this = _super.call(this) || this, _this.game = game, _this.local = !1, _this.name = void 0, 
                            _this._modifiedCount = 0, _this.width = game.width, _this.height = game.height, 
                            game.logger.debug("[deprecated] Camera2D:This constructor is deprecated. Refer to the API documentation and use Camera2D(param: Camera2DParameterObject) instead.");
                        } else {
                            var param = gameOrParam;
                            _this = _super.call(this, param) || this, _this.game = param.game, _this.local = !!param.local, 
                            _this.name = param.name, _this._modifiedCount = 0, _this.width = param.game.width, 
                            _this.height = param.game.height;
                        }
                        return _this.id = _this.local ? void 0 : _this.game._cameraIdx++, _this;
                    }
                    return __extends(Camera2D, _super), Camera2D.deserialize = function(ser, game) {
                        var s = ser;
                        s.param.game = game;
                        var ret = new Camera2D(s.param);
                        return ret.id = s.id, ret;
                    }, Camera2D.prototype.modified = function() {
                        this._modifiedCount = (this._modifiedCount + 1) % 32768, this._matrix && (this._matrix._modified = !0), 
                        this.game.modified = !0;
                    }, Camera2D.prototype.serialize = function() {
                        var ser = {
                            id: this.id,
                            param: {
                                game: void 0,
                                local: this.local,
                                name: this.name,
                                x: this.x,
                                y: this.y,
                                width: this.width,
                                height: this.height,
                                opacity: this.opacity,
                                scaleX: this.scaleX,
                                scaleY: this.scaleY,
                                angle: this.angle,
                                compositeOperation: this.compositeOperation
                            }
                        };
                        return ser;
                    }, Camera2D.prototype._applyTransformToRenderer = function(renderer) {
                        this.angle || 1 !== this.scaleX || 1 !== this.scaleY ? renderer.transform(this.getMatrix()._matrix) : renderer.translate(-this.x, -this.y), 
                        1 !== this.opacity && renderer.opacity(this.opacity);
                    }, Camera2D.prototype._updateMatrix = function() {
                        this.angle || 1 !== this.scaleX || 1 !== this.scaleY ? this._matrix.updateByInverse(this.width, this.height, this.scaleX, this.scaleY, this.angle, this.x, this.y) : this._matrix.reset(-this.x, -this.y);
                    }, Camera2D;
                }(g.Object2D);
                g.Camera2D = Camera2D;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Renderer = function() {
                    function Renderer() {}
                    return Renderer.prototype.draw = function(game, camera) {
                        var scene = game.scene();
                        if (scene) {
                            this.begin(), this.clear(), camera && (this.save(), camera._applyTransformToRenderer(this));
                            for (var children = scene.children, i = 0; i < children.length; ++i) children[i].render(this, camera);
                            camera && this.restore(), this.end();
                        }
                    }, Renderer.prototype.begin = function() {}, Renderer.prototype.clear = function() {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#clear");
                    }, Renderer.prototype.drawImage = function(surface, offsetX, offsetY, width, height, destOffsetX, destOffsetY) {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#drawImage");
                    }, Renderer.prototype.drawSprites = function(surface, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, count) {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#drawSprites");
                    }, Renderer.prototype.drawSystemText = function(text, x, y, maxWidth, fontSize, textAlign, textBaseline, textColor, fontFamily, strokeWidth, strokeColor, strokeOnly) {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#drawSystemText");
                    }, Renderer.prototype.translate = function(x, y) {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#translate");
                    }, Renderer.prototype.transform = function(matrix) {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#transform");
                    }, Renderer.prototype.opacity = function(opacity) {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#opacity");
                    }, Renderer.prototype.save = function() {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#save");
                    }, Renderer.prototype.restore = function() {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#restore");
                    }, Renderer.prototype.fillRect = function(x, y, width, height, cssColor) {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#fillRect");
                    }, Renderer.prototype.setCompositeOperation = function(operation) {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#setCompositeOperation");
                    }, Renderer.prototype.setTransform = function(matrix) {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#setTransform");
                    }, Renderer.prototype.setOpacity = function(opacity) {
                        throw g.ExceptionFactory.createPureVirtualError("Renderer#setOpacity");
                    }, Renderer.prototype.end = function() {}, Renderer;
                }();
                g.Renderer = Renderer;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Surface = function() {
                    function Surface(width, height, drawable, isDynamic) {
                        if (void 0 === isDynamic && (isDynamic = !1), width % 1 !== 0 || height % 1 !== 0) throw g.ExceptionFactory.createAssertionError("Surface#constructor: width and height must be integers");
                        this.width = width, this.height = height, drawable && (this._drawable = drawable), 
                        this.isDynamic = isDynamic, this.isDynamic ? (this.animatingStarted = new g.Trigger(), 
                        this.animatingStopped = new g.Trigger()) : (this.animatingStarted = void 0, this.animatingStopped = void 0);
                    }
                    return Surface.prototype.renderer = function() {
                        throw g.ExceptionFactory.createPureVirtualError("Surface#renderer");
                    }, Surface.prototype.isPlaying = function() {
                        throw g.ExceptionFactory.createPureVirtualError("Surface#isPlaying()");
                    }, Surface.prototype.destroy = function() {
                        this.animatingStarted && this.animatingStarted.destroy(), this.animatingStopped && this.animatingStopped.destroy(), 
                        this._destroyed = !0;
                    }, Surface.prototype.destroyed = function() {
                        return !!this._destroyed;
                    }, Surface;
                }();
                g.Surface = Surface;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Label = function(_super) {
                    function Label(sceneOrParam, text, font, fontSize) {
                        var _this = this;
                        if (sceneOrParam instanceof g.Scene) {
                            var scene = sceneOrParam;
                            _this = _super.call(this, scene) || this, _this.text = text, _this.bitmapFont = font, 
                            _this.font = font, _this.textAlign = g.TextAlign.Left, _this.glyphs = new Array(text.length), 
                            _this.fontSize = fontSize, _this.maxWidth = void 0, _this.widthAutoAdjust = !0, 
                            _this.textColor = void 0, _this._textWidth = 0, _this._game = void 0, _this._invalidateSelf();
                        } else {
                            var param = sceneOrParam;
                            if (!param.font && !param.bitmapFont) throw g.ExceptionFactory.createAssertionError("Label#constructor: 'font' or 'bitmapFont' must be given to LabelParameterObject");
                            _this = _super.call(this, param) || this, _this.text = param.text, _this.bitmapFont = param.bitmapFont, 
                            _this.font = param.font ? param.font : param.bitmapFont, _this.textAlign = "textAlign" in param ? param.textAlign : g.TextAlign.Left, 
                            _this.glyphs = new Array(param.text.length), _this.fontSize = param.fontSize, _this.maxWidth = param.maxWidth, 
                            _this.widthAutoAdjust = !("widthAutoAdjust" in param) || param.widthAutoAdjust, 
                            _this.textColor = param.textColor, _this._textWidth = 0, _this._game = void 0, _this._invalidateSelf();
                        }
                        return _this;
                    }
                    return __extends(Label, _super), Label.prototype.aligning = function(width, textAlign) {
                        this.width = width, this.widthAutoAdjust = !1, this.textAlign = textAlign;
                    }, Label.prototype.invalidate = function() {
                        this._invalidateSelf(), _super.prototype.invalidate.call(this);
                    }, Label.prototype.renderCache = function(renderer) {
                        if (!(!this.fontSize || this.height <= 0 || this._textWidth <= 0)) {
                            var textSurface = this.scene.game.resourceFactory.createSurface(Math.ceil(this._textWidth), Math.ceil(this.height)), textRenderer = textSurface.renderer();
                            textRenderer.begin(), textRenderer.save();
                            for (var i = 0; i < this.glyphs.length; ++i) {
                                var glyph = this.glyphs[i], glyphScale = this.fontSize / this.font.size, glyphWidth = glyph.advanceWidth * glyphScale;
                                glyph.surface && (textRenderer.save(), textRenderer.transform([ glyphScale, 0, 0, glyphScale, 0, 0 ]), 
                                textRenderer.drawImage(glyph.surface, glyph.x, glyph.y, glyph.width, glyph.height, glyph.offsetX, glyph.offsetY), 
                                textRenderer.restore()), textRenderer.translate(glyphWidth, 0);
                            }
                            textRenderer.restore(), textRenderer.end();
                            var offsetX, scale = this.maxWidth > 0 && this.maxWidth < this._textWidth ? this.maxWidth / this._textWidth : 1;
                            switch (this.textAlign) {
                              case g.TextAlign.Center:
                                offsetX = this.width / 2 - this._textWidth / 2 * scale;
                                break;

                              case g.TextAlign.Right:
                                offsetX = this.width - this._textWidth * scale;
                                break;

                              default:
                                offsetX = 0;
                            }
                            renderer.save(), renderer.translate(offsetX, 0), 1 !== scale && renderer.transform([ scale, 0, 0, 1, 0, 0 ]), 
                            renderer.drawImage(textSurface, 0, 0, this._textWidth, this.height, 0, 0), textSurface.destroy(), 
                            this.textColor && (renderer.setCompositeOperation(g.CompositeOperation.SourceAtop), 
                            renderer.fillRect(0, 0, this._textWidth, this.height, this.textColor)), renderer.restore();
                        }
                    }, Label.prototype.destroy = function() {
                        _super.prototype.destroy.call(this);
                    }, Label.prototype._invalidateSelf = function() {
                        if (void 0 !== this.bitmapFont && (this.font = this.bitmapFont), this.glyphs.length = 0, 
                        this._textWidth = 0, !this.fontSize) return void (this.height = 0);
                        for (var maxHeight = 0, glyphScale = this.font.size > 0 ? this.fontSize / this.font.size : 0, i = 0; i < this.text.length; ++i) {
                            var code = g.Util.charCodeAt(this.text, i);
                            if (code) {
                                var glyph = this.font.glyphForCharacter(code);
                                if (glyph) {
                                    if (!(glyph.width < 0 || glyph.height < 0 || glyph.x < 0 || glyph.y < 0)) {
                                        this.glyphs.push(glyph), this._textWidth += glyph.advanceWidth * glyphScale;
                                        var height = glyph.offsetY + glyph.height;
                                        maxHeight < height && (maxHeight = height);
                                    }
                                } else {
                                    var str = 4294901760 & code ? String.fromCharCode((4294901760 & code) >>> 16, 65535 & code) : String.fromCharCode(code);
                                    this.game().logger.warn("Label#_invalidateSelf(): failed to get a glyph for '" + str + "' (BitmapFont might not have the glyph or DynamicFont might create a glyph larger than its atlas).");
                                }
                            }
                        }
                        this.widthAutoAdjust && (this.width = this._textWidth), this.height = maxHeight * glyphScale;
                    }, Label;
                }(g.CacheableE);
                g.Label = Label;
            }(g || (g = {}));
            var g;
            !function(g_1) {
                var Glyph = function() {
                    function Glyph(code, x, y, width, height, offsetX, offsetY, advanceWidth, surface, isSurfaceValid) {
                        void 0 === offsetX && (offsetX = 0), void 0 === offsetY && (offsetY = 0), void 0 === advanceWidth && (advanceWidth = width), 
                        void 0 === isSurfaceValid && (isSurfaceValid = !!surface), this.code = code, this.x = x, 
                        this.y = y, this.width = width, this.height = height, this.offsetX = offsetX, this.offsetY = offsetY, 
                        this.advanceWidth = advanceWidth, this.surface = surface, this.isSurfaceValid = isSurfaceValid, 
                        this._atlas = null;
                    }
                    return Glyph.prototype.renderingWidth = function(fontSize) {
                        return this.width && this.height ? fontSize / this.height * this.width : 0;
                    }, Glyph;
                }();
                g_1.Glyph = Glyph;
                var BitmapFont = function() {
                    function BitmapFont(srcOrParam, map, defaultGlyphWidth, defaultGlyphHeight, missingGlyph) {
                        if (srcOrParam instanceof g_1.Surface || srcOrParam instanceof g_1.Asset) this.surface = g_1.Util.asSurface(srcOrParam), 
                        this.map = map, this.defaultGlyphWidth = defaultGlyphWidth, this.defaultGlyphHeight = defaultGlyphHeight, 
                        this.missingGlyph = missingGlyph, this.size = defaultGlyphHeight; else {
                            var param = srcOrParam;
                            this.surface = g_1.Util.asSurface(param.src), this.map = param.map, this.defaultGlyphWidth = param.defaultGlyphWidth, 
                            this.defaultGlyphHeight = param.defaultGlyphHeight, this.missingGlyph = param.missingGlyph, 
                            this.size = param.defaultGlyphHeight;
                        }
                    }
                    return BitmapFont.prototype.glyphForCharacter = function(code) {
                        var g = this.map[code] || this.missingGlyph;
                        if (!g) return null;
                        var w = void 0 === g.width ? this.defaultGlyphWidth : g.width, h = void 0 === g.height ? this.defaultGlyphHeight : g.height, offsetX = g.offsetX || 0, offsetY = g.offsetY || 0, advanceWidth = void 0 === g.advanceWidth ? w : g.advanceWidth, surface = 0 === w || 0 === h ? void 0 : this.surface;
                        return new Glyph(code, g.x, g.y, w, h, offsetX, offsetY, advanceWidth, surface, !0);
                    }, BitmapFont.prototype.destroy = function() {
                        this.surface && !this.surface.destroyed() && this.surface.destroy(), this.map = void 0;
                    }, BitmapFont.prototype.destroyed = function() {
                        return !this.map;
                    }, BitmapFont;
                }();
                g_1.BitmapFont = BitmapFont;
            }(g || (g = {}));
            var g;
            !function(g) {
                var FilledRect = function(_super) {
                    function FilledRect(sceneOrParam, cssColor, width, height) {
                        var _this = this;
                        if (sceneOrParam instanceof g.Scene) {
                            var scene = sceneOrParam;
                            if (_this = _super.call(this, scene) || this, "string" != typeof cssColor) throw g.ExceptionFactory.createTypeMismatchError("ColorBox#constructor(cssColor)", "string", cssColor);
                            _this.cssColor = cssColor, _this.width = width, _this.height = height;
                        } else {
                            var param = sceneOrParam;
                            if (_this = _super.call(this, param) || this, "string" != typeof param.cssColor) throw g.ExceptionFactory.createTypeMismatchError("ColorBox#constructor(cssColor)", "string", cssColor);
                            _this.cssColor = param.cssColor;
                        }
                        return _this;
                    }
                    return __extends(FilledRect, _super), FilledRect.prototype.renderSelf = function(renderer) {
                        return renderer.fillRect(0, 0, this.width, this.height, this.cssColor), !0;
                    }, FilledRect;
                }(g.E);
                g.FilledRect = FilledRect;
            }(g || (g = {}));
            var g;
            !function(g) {
                var Pane = function(_super) {
                    function Pane(sceneOrParam, width, height, backgroundImage, padding, backgroundEffector) {
                        var _this = this;
                        if (sceneOrParam instanceof g.Scene) {
                            var scene = sceneOrParam;
                            _this = _super.call(this, scene) || this, _this.width = _this._oldWidth = width, 
                            _this.height = _this._oldHeight = height, _this.backgroundImage = g.Util.asSurface(backgroundImage), 
                            _this.backgroundEffector = backgroundEffector, _this._shouldRenderChildren = !1, 
                            _this._padding = padding, _this._initialize(), _this._paddingChanged = !1, _this._bgSurface = void 0, 
                            _this._bgRenderer = void 0;
                        } else {
                            var param = sceneOrParam;
                            _this = _super.call(this, param) || this, _this._oldWidth = param.width, _this._oldHeight = param.height, 
                            _this.backgroundImage = g.Util.asSurface(param.backgroundImage), _this.backgroundEffector = param.backgroundEffector, 
                            _this._shouldRenderChildren = !1, _this._padding = param.padding, _this._initialize(), 
                            _this._paddingChanged = !1, _this._bgSurface = void 0, _this._bgRenderer = void 0;
                        }
                        return _this;
                    }
                    return __extends(Pane, _super), Object.defineProperty(Pane.prototype, "padding", {
                        get: function() {
                            return this._padding;
                        },
                        set: function(padding) {
                            this._padding = padding, this._paddingChanged = !0;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Pane.prototype.modified = function(isBubbling) {
                        isBubbling && (this.state &= -3), _super.prototype.modified.call(this);
                    }, Pane.prototype.shouldFindChildrenByPoint = function(point) {
                        var p = this._normalizedPadding;
                        return p.left < point.x && this.width - p.right > point.x && p.top < point.y && this.height - p.bottom > point.y;
                    }, Pane.prototype.renderCache = function(renderer, camera) {
                        this.width <= 0 || this.height <= 0 || (this._renderBackground(), this._renderChildren(camera), 
                        this._bgSurface ? renderer.drawImage(this._bgSurface, 0, 0, this.width, this.height, 0, 0) : this.backgroundImage && renderer.drawImage(this.backgroundImage, 0, 0, this.width, this.height, 0, 0), 
                        this._childrenArea.width <= 0 || this._childrenArea.height <= 0 || (renderer.save(), 
                        0 === this._childrenArea.x && 0 === this._childrenArea.y || renderer.translate(this._childrenArea.x, this._childrenArea.y), 
                        renderer.drawImage(this._childrenSurface, 0, 0, this._childrenArea.width, this._childrenArea.height, 0, 0), 
                        renderer.restore()));
                    }, Pane.prototype.destroy = function(destroySurface) {
                        destroySurface && this.backgroundImage && !this.backgroundImage.destroyed() && this.backgroundImage.destroy(), 
                        this._bgSurface && !this._bgSurface.destroyed() && this._bgSurface.destroy(), this._childrenSurface && !this._childrenSurface.destroyed() && this._childrenSurface.destroy(), 
                        this.backgroundImage = void 0, this._bgSurface = void 0, this._childrenSurface = void 0, 
                        _super.prototype.destroy.call(this);
                    }, Pane.prototype._renderBackground = function() {
                        this._bgSurface && !this._bgSurface.destroyed() && this._bgSurface.destroy(), this.backgroundImage && this.backgroundEffector ? this._bgSurface = this.backgroundEffector.render(this.backgroundImage, this.width, this.height) : this._bgSurface = void 0;
                    }, Pane.prototype._renderChildren = function(camera) {
                        var isNew = this._oldWidth !== this.width || this._oldHeight !== this.height || this._paddingChanged;
                        if (isNew && (this._initialize(), this._paddingChanged = !1, this._oldWidth = this.width, 
                        this._oldHeight = this.height), this._childrenRenderer.begin(), isNew || this._childrenRenderer.clear(), 
                        this.children) for (var children = this.children, i = 0; i < children.length; ++i) children[i].render(this._childrenRenderer, camera);
                        this._childrenRenderer.end();
                    }, Pane.prototype._initialize = function() {
                        var r, p = void 0 === this._padding ? 0 : this._padding;
                        r = "number" == typeof p ? {
                            top: p,
                            bottom: p,
                            left: p,
                            right: p
                        } : this._padding, this._childrenArea = {
                            x: r.left,
                            y: r.top,
                            width: this.width - r.left - r.right,
                            height: this.height - r.top - r.bottom
                        };
                        var resourceFactory = this.scene.game.resourceFactory;
                        this._childrenSurface && !this._childrenSurface.destroyed() && this._childrenSurface.destroy(), 
                        this._childrenSurface = resourceFactory.createSurface(Math.ceil(this._childrenArea.width), Math.ceil(this._childrenArea.height)), 
                        this._childrenRenderer = this._childrenSurface.renderer(), this._normalizedPadding = r;
                    }, Pane.prototype._calculateBoundingRect = function(m, c) {
                        var matrix = this.getMatrix();
                        if (m && (matrix = m.multiplyNew(matrix)), this.visible() && (!c || this._targetCameras && this._targetCameras.indexOf(c) !== -1)) {
                            for (var thisBoundingRect = {
                                left: 0,
                                right: this.width,
                                top: 0,
                                bottom: this.height
                            }, targetCoordinates = [ {
                                x: thisBoundingRect.left,
                                y: thisBoundingRect.top
                            }, {
                                x: thisBoundingRect.left,
                                y: thisBoundingRect.bottom
                            }, {
                                x: thisBoundingRect.right,
                                y: thisBoundingRect.top
                            }, {
                                x: thisBoundingRect.right,
                                y: thisBoundingRect.bottom
                            } ], convertedPoint = matrix.multiplyPoint(targetCoordinates[0]), result = {
                                left: convertedPoint.x,
                                right: convertedPoint.x,
                                top: convertedPoint.y,
                                bottom: convertedPoint.y
                            }, i = 1; i < targetCoordinates.length; ++i) convertedPoint = matrix.multiplyPoint(targetCoordinates[i]), 
                            result.left > convertedPoint.x && (result.left = convertedPoint.x), result.right < convertedPoint.x && (result.right = convertedPoint.x), 
                            result.top > convertedPoint.y && (result.top = convertedPoint.y), result.bottom < convertedPoint.y && (result.bottom = convertedPoint.y);
                            return result;
                        }
                    }, Pane;
                }(g.CacheableE);
                g.Pane = Pane;
            }(g || (g = {}));
            var g;
            !function(g) {
                var TextInputMethod = function() {
                    function TextInputMethod(game) {
                        this.game = game;
                    }
                    return TextInputMethod.prototype.open = function(defaultText, callback) {
                        throw g.ExceptionFactory.createPureVirtualError("TextInputMethod#open");
                    }, TextInputMethod;
                }();
                g.TextInputMethod = TextInputMethod;
            }(g || (g = {}));
            var g;
            !function(g) {
                var OperationHandler = function() {
                    function OperationHandler(code, owner, handler) {
                        this._code = code, this._handler = handler, this._handlerOwner = owner;
                    }
                    return OperationHandler.prototype.onOperation = function(op) {
                        var iop;
                        op instanceof Array ? iop = {
                            _code: this._code,
                            data: op
                        } : (iop = op, iop._code = this._code), this._handler.call(this._handlerOwner, iop);
                    }, OperationHandler;
                }(), OperationPluginManager = function() {
                    function OperationPluginManager(game, viewInfo, infos) {
                        this.operated = new g.Trigger(), this.plugins = {}, this._game = game, this._viewInfo = viewInfo, 
                        this._infos = infos, this._initialized = !1;
                    }
                    return OperationPluginManager.prototype.initialize = function() {
                        this._initialized || (this._initialized = !0, this._loadOperationPlugins()), this._doAutoStart();
                    }, OperationPluginManager.prototype.destroy = function() {
                        this.stopAll(), this.operated.destroy(), this.operated = void 0, this.plugins = void 0, 
                        this._game = void 0, this._viewInfo = void 0, this._infos = void 0;
                    }, OperationPluginManager.prototype.stopAll = function() {
                        if (this._initialized) for (var i = 0; i < this._infos.length; ++i) {
                            var info = this._infos[i];
                            info._plugin && info._plugin.stop();
                        }
                    }, OperationPluginManager.prototype._doAutoStart = function() {
                        for (var i = 0; i < this._infos.length; ++i) {
                            var info = this._infos[i];
                            !info.manualStart && info._plugin && info._plugin.start();
                        }
                    }, OperationPluginManager.prototype._loadOperationPlugins = function() {
                        for (var i = 0; i < this._infos.length; ++i) {
                            var info = this._infos[i];
                            if (info.script) {
                                var pluginClass = g._require(this._game, info.script);
                                if (pluginClass.isSupported()) {
                                    var plugin = new pluginClass(this._game, this._viewInfo, info.option), code = info.code;
                                    if (this.plugins[code]) throw new Error("Plugin#code conflicted for code: " + code);
                                    this.plugins[code] = plugin, info._plugin = plugin;
                                    var handler = new OperationHandler(code, this.operated, this.operated.fire);
                                    plugin.operationTrigger.handle(handler, handler.onOperation);
                                }
                            }
                        }
                    }, OperationPluginManager;
                }();
                g.OperationPluginManager = OperationPluginManager;
            }(g || (g = {}));
            var g;
            !function(g) {}(g || (g = {}));
            var g;
            !function(g) {
                function getSurfaceAtlasSlot(slot, width, height) {
                    for (;slot; ) {
                        if (slot.width >= width && slot.height >= height) return slot;
                        slot = slot.next;
                    }
                    return null;
                }
                function calcAtlasSize(hint) {
                    var width = Math.ceil(Math.min(hint.initialAtlasWidth, hint.maxAtlasWidth)), height = Math.ceil(Math.min(hint.initialAtlasHeight, hint.maxAtlasHeight));
                    return {
                        width: width,
                        height: height
                    };
                }
                var FontWeight;
                !function(FontWeight) {
                    FontWeight[FontWeight.Normal = 0] = "Normal", FontWeight[FontWeight.Bold = 1] = "Bold";
                }(FontWeight = g.FontWeight || (g.FontWeight = {}));
                var SurfaceAtlasSlot = function() {
                    function SurfaceAtlasSlot(x, y, width, height) {
                        this.x = x, this.y = y, this.width = width, this.height = height, this.prev = null, 
                        this.next = null;
                    }
                    return SurfaceAtlasSlot;
                }();
                g.SurfaceAtlasSlot = SurfaceAtlasSlot;
                var SurfaceAtlas = function() {
                    function SurfaceAtlas(surface) {
                        this._surface = surface, this._emptySurfaceAtlasSlotHead = new SurfaceAtlasSlot(0, 0, this._surface.width, this._surface.height), 
                        this._accessScore = 0, this._usedRectangleAreaSize = {
                            width: 0,
                            height: 0
                        };
                    }
                    return SurfaceAtlas.prototype._acquireSurfaceAtlasSlot = function(width, height) {
                        width += 1, height += 1;
                        var slot = getSurfaceAtlasSlot(this._emptySurfaceAtlasSlotHead, width, height);
                        if (!slot) return null;
                        var left, right, remainWidth = slot.width - width, remainHeight = slot.height - height;
                        remainWidth <= remainHeight ? (left = new SurfaceAtlasSlot(slot.x + width, slot.y, remainWidth, height), 
                        right = new SurfaceAtlasSlot(slot.x, slot.y + height, slot.width, remainHeight)) : (left = new SurfaceAtlasSlot(slot.x, slot.y + height, width, remainHeight), 
                        right = new SurfaceAtlasSlot(slot.x + width, slot.y, remainWidth, slot.height)), 
                        left.prev = slot.prev, left.next = right, null === left.prev ? this._emptySurfaceAtlasSlotHead = left : left.prev.next = left, 
                        right.prev = left, right.next = slot.next, right.next && (right.next.prev = right);
                        var acquiredSlot = new SurfaceAtlasSlot(slot.x, slot.y, width, height);
                        return this._updateUsedRectangleAreaSize(acquiredSlot), acquiredSlot;
                    }, SurfaceAtlas.prototype._updateUsedRectangleAreaSize = function(slot) {
                        var slotRight = slot.x + slot.width, slotBottom = slot.y + slot.height;
                        slotRight > this._usedRectangleAreaSize.width && (this._usedRectangleAreaSize.width = slotRight), 
                        slotBottom > this._usedRectangleAreaSize.height && (this._usedRectangleAreaSize.height = slotBottom);
                    }, SurfaceAtlas.prototype.addSurface = function(surface, rect) {
                        var slot = this._acquireSurfaceAtlasSlot(rect.width, rect.height);
                        if (!slot) return null;
                        var renderer = this._surface.renderer();
                        return renderer.begin(), renderer.drawImage(surface, rect.x, rect.y, rect.width, rect.height, slot.x, slot.y), 
                        renderer.end(), slot;
                    }, SurfaceAtlas.prototype.destroy = function() {
                        this._surface.destroy();
                    }, SurfaceAtlas.prototype.destroyed = function() {
                        return this._surface.destroyed();
                    }, SurfaceAtlas.prototype.duplicateSurface = function(resourceFactory) {
                        var src = this._surface, dst = resourceFactory.createSurface(this._usedRectangleAreaSize.width, this._usedRectangleAreaSize.height), renderer = dst.renderer();
                        return renderer.begin(), renderer.drawImage(src, 0, 0, this._usedRectangleAreaSize.width, this._usedRectangleAreaSize.height, 0, 0), 
                        renderer.end(), dst;
                    }, SurfaceAtlas;
                }();
                g.SurfaceAtlas = SurfaceAtlas;
                var DynamicFont = function() {
                    function DynamicFont(fontFamilyOrParam, size, game, hint, fontColor, strokeWidth, strokeColor, strokeOnly) {
                        if (void 0 === hint && (hint = {}), void 0 === fontColor && (fontColor = "black"), 
                        void 0 === strokeWidth && (strokeWidth = 0), void 0 === strokeColor && (strokeColor = "black"), 
                        void 0 === strokeOnly && (strokeOnly = !1), "number" == typeof fontFamilyOrParam) this.fontFamily = fontFamilyOrParam, 
                        this.size = size, this.hint = hint, this.fontColor = fontColor, this.strokeWidth = strokeWidth, 
                        this.strokeColor = strokeColor, this.strokeOnly = strokeOnly, this._resourceFactory = game.resourceFactory, 
                        this._glyphFactory = this._resourceFactory.createGlyphFactory(fontFamilyOrParam, size, hint.baselineHeight, fontColor, strokeWidth, strokeColor, strokeOnly), 
                        game.logger.debug("[deprecated] DynamicFont: This constructor is deprecated. Refer to the API documentation and use constructor(param: DynamicFontParameterObject) instead."); else {
                            var param = fontFamilyOrParam;
                            this.fontFamily = param.fontFamily, this.size = param.size, this.hint = "hint" in param ? param.hint : {}, 
                            this.fontColor = "fontColor" in param ? param.fontColor : "black", this.fontWeight = "fontWeight" in param ? param.fontWeight : FontWeight.Normal, 
                            this.strokeWidth = "strokeWidth" in param ? param.strokeWidth : 0, this.strokeColor = "strokeColor" in param ? param.strokeColor : "black", 
                            this.strokeOnly = "strokeOnly" in param && param.strokeOnly, this._resourceFactory = param.game.resourceFactory, 
                            this._glyphFactory = this._resourceFactory.createGlyphFactory(this.fontFamily, this.size, this.hint.baselineHeight, this.fontColor, this.strokeWidth, this.strokeColor, this.strokeOnly, this.fontWeight);
                        }
                        if (this._glyphs = {}, this._atlases = [], this._currentAtlasIndex = 0, this._destroyed = !1, 
                        this.hint.initialAtlasWidth = this.hint.initialAtlasWidth ? this.hint.initialAtlasWidth : 2048, 
                        this.hint.initialAtlasHeight = this.hint.initialAtlasHeight ? this.hint.initialAtlasHeight : 2048, 
                        this.hint.maxAtlasWidth = this.hint.maxAtlasWidth ? this.hint.maxAtlasWidth : 2048, 
                        this.hint.maxAtlasHeight = this.hint.maxAtlasHeight ? this.hint.maxAtlasHeight : 2048, 
                        this.hint.maxAtlasNum = this.hint.maxAtlasNum ? this.hint.maxAtlasNum : 1, this._atlasSize = calcAtlasSize(this.hint), 
                        this._atlases.push(this._resourceFactory.createSurfaceAtlas(this._atlasSize.width, this._atlasSize.height)), 
                        hint.presetChars) for (var i = 0, len = hint.presetChars.length; i < len; i++) {
                            var code = g.Util.charCodeAt(hint.presetChars, i);
                            code && this.glyphForCharacter(code);
                        }
                    }
                    return DynamicFont.prototype.glyphForCharacter = function(code) {
                        var glyph = this._glyphs[code];
                        if (!glyph || !glyph.isSurfaceValid) {
                            if (glyph = this._glyphFactory.create(code), glyph.surface) {
                                if (glyph.width > this._atlasSize.width || glyph.height > this._atlasSize.height) return null;
                                var atlas_1 = this._addToAtlas(glyph);
                                if (!atlas_1 && (this._reallocateAtlas(), atlas_1 = this._addToAtlas(glyph), !atlas_1)) return null;
                                glyph._atlas = atlas_1;
                            }
                            this._glyphs[code] = glyph;
                        }
                        for (var i = 0; i < this._atlases.length; i++) {
                            var atlas = this._atlases[i];
                            atlas === glyph._atlas && (atlas._accessScore += 1), atlas._accessScore /= 2;
                        }
                        return glyph;
                    }, DynamicFont.prototype.asBitmapFont = function(missingGlyphChar) {
                        var _this = this;
                        if (1 !== this._atlases.length) return null;
                        var missingGlyphCharCodePoint;
                        missingGlyphChar && (missingGlyphCharCodePoint = g.Util.charCodeAt(missingGlyphChar, 0), 
                        this.glyphForCharacter(missingGlyphCharCodePoint));
                        var glyphAreaMap = {};
                        Object.keys(this._glyphs).forEach(function(_key) {
                            var key = Number(_key), glyph = _this._glyphs[key], glyphArea = {
                                x: glyph.x,
                                y: glyph.y,
                                width: glyph.width,
                                height: glyph.height,
                                offsetX: glyph.offsetX,
                                offsetY: glyph.offsetY,
                                advanceWidth: glyph.advanceWidth
                            };
                            glyphAreaMap[key] = glyphArea;
                        });
                        var missingGlyph = glyphAreaMap[missingGlyphCharCodePoint], surface = this._atlases[0].duplicateSurface(this._resourceFactory), bitmapFont = new g.BitmapFont(surface, glyphAreaMap, 0, this.size, missingGlyph);
                        return bitmapFont;
                    }, DynamicFont.prototype._removeLowUseAtlas = function() {
                        for (var minScore = Number.MAX_VALUE, lowScoreAtlasIndex = -1, i = 0; i < this._atlases.length; i++) this._atlases[i]._accessScore <= minScore && (minScore = this._atlases[i]._accessScore, 
                        lowScoreAtlasIndex = i);
                        var removedAtlas = this._atlases.splice(lowScoreAtlasIndex, 1)[0];
                        return removedAtlas;
                    }, DynamicFont.prototype._reallocateAtlas = function() {
                        if (this._atlases.length >= this.hint.maxAtlasNum) {
                            var atlas = this._removeLowUseAtlas(), glyphs = this._glyphs;
                            for (var key in glyphs) if (glyphs.hasOwnProperty(key)) {
                                var glyph = glyphs[key];
                                glyph.surface === atlas._surface && (glyph.surface = null, glyph.isSurfaceValid = !1, 
                                glyph._atlas = null);
                            }
                            atlas.destroy();
                        }
                        this._atlases.push(this._resourceFactory.createSurfaceAtlas(this._atlasSize.width, this._atlasSize.height)), 
                        this._currentAtlasIndex = this._atlases.length - 1;
                    }, DynamicFont.prototype._addToAtlas = function(glyph) {
                        for (var atlas = null, slot = null, area = {
                            x: glyph.x,
                            y: glyph.y,
                            width: glyph.width,
                            height: glyph.height
                        }, i = 0; i < this._atlases.length; i++) {
                            var index = (this._currentAtlasIndex + i) % this._atlases.length;
                            if (atlas = this._atlases[index], slot = atlas.addSurface(glyph.surface, area)) {
                                this._currentAtlasIndex = index;
                                break;
                            }
                        }
                        return slot ? (glyph.surface.destroy(), glyph.surface = atlas._surface, glyph.x = slot.x, 
                        glyph.y = slot.y, atlas) : null;
                    }, DynamicFont.prototype.destroy = function() {
                        for (var i = 0; i < this._atlases.length; i++) this._atlases[i].destroy();
                        this._glyphs = null, this._glyphFactory = null, this._destroyed = !0;
                    }, DynamicFont.prototype.destroyed = function() {
                        return this._destroyed;
                    }, DynamicFont;
                }();
                g.DynamicFont = DynamicFont;
            }(g || (g = {}));
            var g;
            !function(g) {
                var AudioSystemManager = function() {
                    function AudioSystemManager(game) {
                        this._game = game, this._muted = !1, this._playbackRate = 1;
                    }
                    return AudioSystemManager.prototype._setMuted = function(muted) {
                        if (this._muted !== muted) {
                            this._muted = muted;
                            var systems = this._game.audio;
                            for (var id in systems) systems.hasOwnProperty(id) && systems[id]._setMuted(muted);
                        }
                    }, AudioSystemManager.prototype._setPlaybackRate = function(rate) {
                        if (this._playbackRate !== rate) {
                            this._playbackRate = rate;
                            var systems = this._game.audio;
                            for (var id in systems) systems.hasOwnProperty(id) && systems[id]._setPlaybackRate(rate);
                        }
                    }, AudioSystemManager;
                }();
                g.AudioSystemManager = AudioSystemManager;
            }(g || (g = {}));
            var g;
            !function(g) {
                var CompositeOperation;
                !function(CompositeOperation) {
                    CompositeOperation[CompositeOperation.SourceOver = 0] = "SourceOver", CompositeOperation[CompositeOperation.SourceAtop = 1] = "SourceAtop", 
                    CompositeOperation[CompositeOperation.Lighter = 2] = "Lighter", CompositeOperation[CompositeOperation.Copy = 3] = "Copy";
                }(CompositeOperation = g.CompositeOperation || (g.CompositeOperation = {}));
            }(g || (g = {}));
            var g;
            !function(g) {
                var GlyphFactory = function() {
                    function GlyphFactory(fontFamily, fontSize, baselineHeight, fontColor, strokeWidth, strokeColor, strokeOnly, fontWeight) {
                        void 0 === baselineHeight && (baselineHeight = fontSize), void 0 === fontColor && (fontColor = "black"), 
                        void 0 === strokeWidth && (strokeWidth = 0), void 0 === strokeColor && (strokeColor = "black"), 
                        void 0 === strokeOnly && (strokeOnly = !1), void 0 === fontWeight && (fontWeight = g.FontWeight.Normal), 
                        this.fontFamily = fontFamily, this.fontSize = fontSize, this.fontWeight = fontWeight, 
                        this.baselineHeight = baselineHeight, this.fontColor = fontColor, this.strokeWidth = strokeWidth, 
                        this.strokeColor = strokeColor, this.strokeOnly = strokeOnly;
                    }
                    return GlyphFactory.prototype.create = function(code) {
                        throw g.ExceptionFactory.createPureVirtualError("GlyphFactory#create");
                    }, GlyphFactory;
                }();
                g.GlyphFactory = GlyphFactory;
            }(g || (g = {}));
            var g;
            !function(g) {
                var LocalTickMode;
                !function(LocalTickMode) {
                    LocalTickMode[LocalTickMode.NonLocal = 0] = "NonLocal", LocalTickMode[LocalTickMode.FullLocal = 1] = "FullLocal", 
                    LocalTickMode[LocalTickMode.InterpolateLocal = 2] = "InterpolateLocal";
                }(LocalTickMode = g.LocalTickMode || (g.LocalTickMode = {}));
            }(g || (g = {}));
            var g;
            !function(g) {
                var MultiLineLabel = function(_super) {
                    function MultiLineLabel(sceneOrParam, text, font, fontSize, width, lineBreak) {
                        void 0 === lineBreak && (lineBreak = !0);
                        var _this = this;
                        if (sceneOrParam instanceof g.Scene) {
                            var scene = sceneOrParam;
                            _this = _super.call(this, scene) || this, _this.text = text, _this.bitmapFont = font, 
                            _this.fontSize = fontSize, _this.width = width, _this.lineBreak = lineBreak, _this.lineGap = 0, 
                            _this.textAlign = g.TextAlign.Left, _this.textColor = void 0;
                        } else {
                            var param = sceneOrParam;
                            _this = _super.call(this, param) || this, _this.text = param.text, _this.bitmapFont = param.bitmapFont, 
                            _this.fontSize = param.fontSize, _this.width = param.width, _this.lineBreak = !("lineBreak" in param) || param.lineBreak, 
                            _this.lineGap = param.lineGap || 0, _this.textAlign = "textAlign" in param ? param.textAlign : g.TextAlign.Left, 
                            _this.textColor = param.textColor;
                        }
                        return _this._lines = [], _this._beforeText = void 0, _this._beforeLineBreak = void 0, 
                        _this._beforeBitmapFont = void 0, _this._beforeFontSize = void 0, _this._beforeTextAlign = void 0, 
                        _this._beforeWidth = void 0, _this._invalidateSelf(), _this;
                    }
                    return __extends(MultiLineLabel, _super), MultiLineLabel.prototype.invalidate = function() {
                        this._invalidateSelf(), _super.prototype.invalidate.call(this);
                    }, MultiLineLabel.prototype.renderCache = function(renderer) {
                        if (0 !== this.fontSize) {
                            renderer.save();
                            for (var i = 0; i < this._lines.length; ++i) this._lines[i].width <= 0 || renderer.drawImage(this._lines[i].surface, 0, 0, this._lines[i].width, this.fontSize, this._offsetX(this._lines[i].width), i * (this.fontSize + this.lineGap));
                            this.textColor && (renderer.setCompositeOperation(g.CompositeOperation.SourceAtop), 
                            renderer.fillRect(0, 0, this.width, this.height, this.textColor)), renderer.restore();
                        }
                    }, MultiLineLabel.prototype.destroy = function() {
                        this._destroyLines(), _super.prototype.destroy.call(this);
                    }, MultiLineLabel.prototype._offsetX = function(width) {
                        switch (this.textAlign) {
                          case g.TextAlign.Left:
                            return 0;

                          case g.TextAlign.Right:
                            return this.width - width;

                          case g.TextAlign.Center:
                            return (this.width - width) / 2;

                          default:
                            return 0;
                        }
                    }, MultiLineLabel.prototype._lineBrokenText = function() {
                        var splited = this.text.split(/\r\n|\r|\n/);
                        if (this.lineBreak) {
                            for (var lines = [], i = 0; i < splited.length; ++i) {
                                for (var t = splited[i], lineWidth = 0, start = 0, j = 0; j < t.length; ++j) {
                                    var glyph = this.bitmapFont.glyphForCharacter(t.charCodeAt(j)), w = glyph.renderingWidth(this.fontSize);
                                    lineWidth + w > this.width && (lines.push(t.substring(start, j)), start = j, lineWidth = 0), 
                                    lineWidth += w;
                                }
                                lines.push(t.substring(start, t.length));
                            }
                            return lines;
                        }
                        return splited;
                    }, MultiLineLabel.prototype._invalidateSelf = function() {
                        if (this.fontSize < 0) throw g.ExceptionFactory.createAssertionError("MultiLineLabel#_invalidateSelf: fontSize must not be negative.");
                        if (this.lineGap < -1 * this.fontSize) throw g.ExceptionFactory.createAssertionError("MultiLineLabel#_invalidateSelf: lineGap must be greater than -1 * fontSize.");
                        (this._beforeText !== this.text || this._beforeFontSize !== this.fontSize || this._beforeBitmapFont !== this.bitmapFont || this._beforeLineBreak !== this.lineBreak || this._beforeWidth !== this.width && this._beforeLineBreak === !0) && this._createLines(), 
                        this.height = this.fontSize + (this.fontSize + this.lineGap) * (this._lines.length - 1), 
                        this._beforeText = this.text, this._beforeTextAlign = this.textAlign, this._beforeFontSize = this.fontSize, 
                        this._beforeLineBreak = this.lineBreak, this._beforeBitmapFont = this.bitmapFont, 
                        this._beforeWidth = this.width;
                    }, MultiLineLabel.prototype._createLineInfo = function(str) {
                        if (0 === this.fontSize) return {
                            text: str,
                            width: 0
                        };
                        for (var lineWidth = 0, glyphs = [], i = 0; i < str.length; ++i) {
                            var glyph = this.bitmapFont.glyphForCharacter(str.charCodeAt(i));
                            glyph.width && glyph.height && (glyphs.push(glyph), lineWidth += glyph.renderingWidth(this.fontSize));
                        }
                        if (0 === lineWidth) return {
                            text: str,
                            width: 0
                        };
                        var textSurface = this.scene.game.resourceFactory.createSurface(Math.ceil(lineWidth), Math.ceil(this.fontSize)), textRenderer = textSurface.renderer();
                        textRenderer.begin(), textRenderer.save();
                        for (var i = 0; i < glyphs.length; ++i) {
                            var glyph = glyphs[i];
                            textRenderer.save();
                            var glyphScale = this.fontSize / glyph.height;
                            textRenderer.transform([ glyphScale, 0, 0, glyphScale, 0, 0 ]), textRenderer.drawImage(this.bitmapFont.surface, glyph.x, glyph.y, glyph.width, glyph.height, 0, 0), 
                            textRenderer.restore(), textRenderer.translate(glyph.renderingWidth(this.fontSize), 0);
                        }
                        return textRenderer.restore(), textRenderer.end(), {
                            text: str,
                            width: lineWidth,
                            surface: textSurface
                        };
                    }, MultiLineLabel.prototype._createLines = function() {
                        for (var lineText = this._lineBrokenText(), lines = [], i = 0; i < lineText.length; ++i) void 0 !== this._lines[i] && lineText[i] === this._lines[i].text && this._beforeBitmapFont === this.bitmapFont && this._beforeFontSize === this.fontSize ? lines.push(this._lines[i]) : (this._lines[i] && this._lines[i].surface && !this._lines[i].surface.destroyed() && this._lines[i].surface.destroy(), 
                        lines.push(this._createLineInfo(lineText[i])));
                        for (var i = lines.length; i < this._lines.length; i++) this._lines[i].surface && !this._lines[i].surface.destroyed() && this._lines[i].surface.destroy();
                        this._lines = lines;
                    }, MultiLineLabel.prototype._destroyLines = function() {
                        for (var i = 0; i < this._lines.length; i++) this._lines[i].surface && !this._lines[i].surface.destroyed() && this._lines[i].surface.destroy();
                        this._lines = void 0;
                    }, MultiLineLabel;
                }(g.CacheableE);
                g.MultiLineLabel = MultiLineLabel;
            }(g || (g = {}));
            var g;
            !function(g) {
                var NinePatchSurfaceEffector = function() {
                    function NinePatchSurfaceEffector(game, borderWidth) {
                        void 0 === borderWidth && (borderWidth = 4), this.game = game, "number" == typeof borderWidth ? this.borderWidth = {
                            top: borderWidth,
                            bottom: borderWidth,
                            left: borderWidth,
                            right: borderWidth
                        } : this.borderWidth = borderWidth;
                    }
                    return NinePatchSurfaceEffector.prototype.render = function(srcSurface, width, height) {
                        var surface = this.game.resourceFactory.createSurface(Math.ceil(width), Math.ceil(height)), renderer = surface.renderer();
                        renderer.begin();
                        var sx1 = this.borderWidth.left, sx2 = srcSurface.width - this.borderWidth.right, sy1 = this.borderWidth.top, sy2 = srcSurface.height - this.borderWidth.bottom, dx1 = this.borderWidth.left, dx2 = width - this.borderWidth.right, dy1 = this.borderWidth.top, dy2 = height - this.borderWidth.bottom, srcCorners = [ {
                            x: 0,
                            y: 0,
                            width: this.borderWidth.left,
                            height: this.borderWidth.top
                        }, {
                            x: sx2,
                            y: 0,
                            width: this.borderWidth.right,
                            height: this.borderWidth.top
                        }, {
                            x: 0,
                            y: sy2,
                            width: this.borderWidth.left,
                            height: this.borderWidth.bottom
                        }, {
                            x: sx2,
                            y: sy2,
                            width: this.borderWidth.right,
                            height: this.borderWidth.bottom
                        } ], destCorners = [ {
                            x: 0,
                            y: 0
                        }, {
                            x: dx2,
                            y: 0
                        }, {
                            x: 0,
                            y: dy2
                        }, {
                            x: dx2,
                            y: dy2
                        } ], i = 0;
                        for (i = 0; i < srcCorners.length; ++i) {
                            var c = srcCorners[i];
                            renderer.save(), renderer.translate(destCorners[i].x, destCorners[i].y), renderer.drawImage(srcSurface, c.x, c.y, c.width, c.height, 0, 0), 
                            renderer.restore();
                        }
                        var srcBorders = [ {
                            x: sx1,
                            y: 0,
                            width: sx2 - sx1,
                            height: this.borderWidth.top
                        }, {
                            x: 0,
                            y: sy1,
                            width: this.borderWidth.left,
                            height: sy2 - sy1
                        }, {
                            x: sx2,
                            y: sy1,
                            width: this.borderWidth.right,
                            height: sy2 - sy1
                        }, {
                            x: sx1,
                            y: sy2,
                            width: sx2 - sx1,
                            height: this.borderWidth.bottom
                        } ], destBorders = [ {
                            x: dx1,
                            y: 0,
                            width: dx2 - dx1,
                            height: this.borderWidth.top
                        }, {
                            x: 0,
                            y: dy1,
                            width: this.borderWidth.left,
                            height: dy2 - dy1
                        }, {
                            x: dx2,
                            y: dy1,
                            width: this.borderWidth.right,
                            height: dy2 - dy1
                        }, {
                            x: dx1,
                            y: dy2,
                            width: dx2 - dx1,
                            height: this.borderWidth.bottom
                        } ];
                        for (i = 0; i < srcBorders.length; ++i) {
                            var s = srcBorders[i], d = destBorders[i];
                            renderer.save(), renderer.translate(d.x, d.y), renderer.transform([ d.width / s.width, 0, 0, d.height / s.height, 0, 0 ]), 
                            renderer.drawImage(srcSurface, s.x, s.y, s.width, s.height, 0, 0), renderer.restore();
                        }
                        var sw = sx2 - sx1, sh = sy2 - sy1, dw = dx2 - dx1, dh = dy2 - dy1;
                        return renderer.save(), renderer.translate(dx1, dy1), renderer.transform([ dw / sw, 0, 0, dh / sh, 0, 0 ]), 
                        renderer.drawImage(srcSurface, sx1, sy1, sw, sh, 0, 0), renderer.restore(), renderer.end(), 
                        surface;
                    }, NinePatchSurfaceEffector;
                }();
                g.NinePatchSurfaceEffector = NinePatchSurfaceEffector;
            }(g || (g = {}));
            var g;
            !function(g) {
                var PathUtil;
                !function(PathUtil) {
                    function resolvePath(base, path) {
                        function split(str) {
                            var ret = str.split("/");
                            return "" === ret[ret.length - 1] && ret.pop(), ret;
                        }
                        if ("" === path) return base;
                        for (var baseComponents = PathUtil.splitPath(base), parts = split(baseComponents.path).concat(split(path)), resolved = [], i = 0; i < parts.length; ++i) {
                            var part = parts[i];
                            switch (part) {
                              case "..":
                                var popped = resolved.pop();
                                if (void 0 === popped || "" === popped || "." === popped) throw g.ExceptionFactory.createAssertionError("PathUtil.resolvePath: invalid arguments");
                                break;

                              case ".":
                                0 === resolved.length && resolved.push(".");
                                break;

                              case "":
                                resolved = [ "" ];
                                break;

                              default:
                                resolved.push(part);
                            }
                        }
                        return baseComponents.host + resolved.join("/");
                    }
                    function resolveDirname(path) {
                        var index = path.lastIndexOf("/");
                        return index === -1 ? path : path.substr(0, index);
                    }
                    function resolveExtname(path) {
                        for (var i = path.length - 1; i >= 0; --i) {
                            var c = path.charAt(i);
                            if ("." === c) return path.substr(i);
                            if ("/" === c) return "";
                        }
                        return "";
                    }
                    function makeNodeModulePaths(path) {
                        var pathComponents = PathUtil.splitPath(path), host = pathComponents.host;
                        path = pathComponents.path, "/" === path[path.length - 1] && (path = path.slice(0, path.length - 1));
                        for (var parts = path.split("/"), firstDir = parts.indexOf("node_modules"), root = firstDir > 0 ? firstDir - 1 : 0, dirs = [], i = parts.length - 1; i >= root; --i) if ("node_modules" !== parts[i]) {
                            var dirParts = parts.slice(0, i + 1);
                            dirParts.push("node_modules");
                            var dir = dirParts.join("/");
                            dirs.push(host + dir);
                        }
                        return dirs;
                    }
                    function addExtname(path, ext) {
                        var index = path.indexOf("?");
                        return index === -1 ? path + "." + ext : path.substring(0, index) + "." + ext + path.substring(index, path.length);
                    }
                    function splitPath(path) {
                        var host = "", doubleSlashIndex = path.indexOf("//");
                        if (doubleSlashIndex >= 0) {
                            var hostSlashIndex = path.indexOf("/", doubleSlashIndex + 2);
                            hostSlashIndex >= 0 ? (host = path.slice(0, hostSlashIndex), path = path.slice(hostSlashIndex)) : (host = path, 
                            path = "/");
                        } else host = "";
                        return {
                            host: host,
                            path: path
                        };
                    }
                    PathUtil.resolvePath = resolvePath, PathUtil.resolveDirname = resolveDirname, PathUtil.resolveExtname = resolveExtname, 
                    PathUtil.makeNodeModulePaths = makeNodeModulePaths, PathUtil.addExtname = addExtname, 
                    PathUtil.splitPath = splitPath;
                }(PathUtil = g.PathUtil || (g.PathUtil = {}));
            }(g || (g = {}));
            var g;
            !function(g) {
                var TextBaseline;
                !function(TextBaseline) {
                    TextBaseline[TextBaseline.Top = 0] = "Top", TextBaseline[TextBaseline.Middle = 1] = "Middle", 
                    TextBaseline[TextBaseline.Alphabetic = 2] = "Alphabetic", TextBaseline[TextBaseline.Bottom = 3] = "Bottom";
                }(TextBaseline = g.TextBaseline || (g.TextBaseline = {}));
                var FontFamily;
                !function(FontFamily) {
                    FontFamily[FontFamily.SansSerif = 0] = "SansSerif", FontFamily[FontFamily.Serif = 1] = "Serif", 
                    FontFamily[FontFamily.Monospace = 2] = "Monospace";
                }(FontFamily = g.FontFamily || (g.FontFamily = {}));
                var SystemLabel = function(_super) {
                    function SystemLabel(param) {
                        var _this = _super.call(this, param) || this;
                        return _this.text = param.text, _this.fontSize = param.fontSize, _this.textAlign = "textAlign" in param ? param.textAlign : g.TextAlign.Left, 
                        _this.textBaseline = "textBaseline" in param ? param.textBaseline : TextBaseline.Alphabetic, 
                        _this.maxWidth = param.maxWidth, _this.textColor = "textColor" in param ? param.textColor : "black", 
                        _this.fontFamily = "fontFamily" in param ? param.fontFamily : FontFamily.SansSerif, 
                        _this.strokeWidth = "strokeWidth" in param ? param.strokeWidth : 0, _this.strokeColor = "strokeColor" in param ? param.strokeColor : "black", 
                        _this.strokeOnly = "strokeOnly" in param && param.strokeOnly, _this;
                    }
                    return __extends(SystemLabel, _super), SystemLabel.prototype.renderSelf = function(renderer, camera) {
                        if (this.text) {
                            var offsetX;
                            switch (this.textAlign) {
                              case g.TextAlign.Right:
                                offsetX = this.width;
                                break;

                              case g.TextAlign.Center:
                                offsetX = this.width / 2;
                                break;

                              default:
                                offsetX = 0;
                            }
                            renderer.drawSystemText(this.text, offsetX, 0, this.maxWidth, this.fontSize, this.textAlign, this.textBaseline, this.textColor, this.fontFamily, this.strokeWidth, this.strokeColor, this.strokeOnly);
                        }
                        return !0;
                    }, SystemLabel;
                }(g.E);
                g.SystemLabel = SystemLabel;
            }(g || (g = {}));
            var g;
            !function(g) {
                var TextAlign;
                !function(TextAlign) {
                    TextAlign[TextAlign.Left = 0] = "Left", TextAlign[TextAlign.Center = 1] = "Center", 
                    TextAlign[TextAlign.Right = 2] = "Right";
                }(TextAlign = g.TextAlign || (g.TextAlign = {}));
            }(g || (g = {}));
            var g;
            !function(g) {
                var TickGenerationMode;
                !function(TickGenerationMode) {
                    TickGenerationMode[TickGenerationMode.ByClock = 0] = "ByClock", TickGenerationMode[TickGenerationMode.Manual = 1] = "Manual";
                }(TickGenerationMode = g.TickGenerationMode || (g.TickGenerationMode = {}));
            }(g || (g = {}));
            var g;
            !function(g) {
                // Copyright (c) 2014 Andreas Madsen & Emil Bay
                // From https://github.com/AndreasMadsen/xorshift
                // https://github.com/AndreasMadsen/xorshift/blob/master/LICENSE.md
                // Arranged by DWANGO Co., Ltd.
                var Xorshift = function() {
                    function Xorshift(seed) {
                        this.initState(seed);
                    }
                    return Xorshift.deserialize = function(ser) {
                        var ret = new Xorshift(0);
                        return ret._state0U = ser._state0U, ret._state0L = ser._state0L, ret._state1U = ser._state1U, 
                        ret._state1L = ser._state1L, ret;
                    }, Xorshift.prototype.initState = function(seed) {
                        var factor = 1812433253;
                        seed = factor * (seed ^ seed >> 30) + 1, this._state0U = seed, seed = factor * (seed ^ seed >> 30) + 2, 
                        this._state0L = seed, seed = factor * (seed ^ seed >> 30) + 3, this._state1U = seed, 
                        seed = factor * (seed ^ seed >> 30) + 4, this._state1L = seed;
                    }, Xorshift.prototype.randomInt = function() {
                        var s1U = this._state0U, s1L = this._state0L, s0U = this._state1U, s0L = this._state1L;
                        this._state0U = s0U, this._state0L = s0L;
                        var t1U = 0, t1L = 0, t2U = 0, t2L = 0, a1 = 23, m1 = 4294967295 << 32 - a1;
                        t1U = s1U << a1 | (s1L & m1) >>> 32 - a1, t1L = s1L << a1, s1U ^= t1U, s1L ^= t1L, 
                        t1U = s1U ^ s0U, t1L = s1L ^ s0L;
                        var a2 = 17, m2 = 4294967295 >>> 32 - a2;
                        t2U = s1U >>> a2, t2L = s1L >>> a2 | (s1U & m2) << 32 - a2, t1U ^= t2U, t1L ^= t2L;
                        var a3 = 26, m3 = 4294967295 >>> 32 - a3;
                        t2U = s0U >>> a3, t2L = s0L >>> a3 | (s0U & m3) << 32 - a3, t1U ^= t2U, t1L ^= t2L, 
                        this._state1U = t1U, this._state1L = t1L;
                        var sumL = (t1L >>> 0) + (s0L >>> 0);
                        return t2U = t1U + s0U + (sumL / 2 >>> 31) >>> 0, t2L = sumL >>> 0, [ t2U, t2L ];
                    }, Xorshift.prototype.random = function() {
                        var t2 = this.randomInt();
                        return (4294967296 * t2[0] + t2[1]) / 0x10000000000000000;
                    }, Xorshift.prototype.nextInt = function(min, sup) {
                        return Math.floor(min + this.random() * (sup - min));
                    }, Xorshift.prototype.serialize = function() {
                        return {
                            _state0U: this._state0U,
                            _state0L: this._state0L,
                            _state1U: this._state1U,
                            _state1L: this._state1L
                        };
                    }, Xorshift;
                }();
                g.Xorshift = Xorshift;
            }(g || (g = {}));
            var g;
            !function(g) {
                var XorshiftRandomGenerator = function(_super) {
                    function XorshiftRandomGenerator(seed, xorshift) {
                        var _this = this;
                        if (void 0 === seed) throw g.ExceptionFactory.createAssertionError("XorshiftRandomGenerator#constructor: seed is undefined");
                        return _this = _super.call(this, seed) || this, xorshift ? _this._xorshift = g.Xorshift.deserialize(xorshift) : _this._xorshift = new g.Xorshift(seed), 
                        _this;
                    }
                    return __extends(XorshiftRandomGenerator, _super), XorshiftRandomGenerator.deserialize = function(ser) {
                        return new XorshiftRandomGenerator(ser._seed, ser._xorshift);
                    }, XorshiftRandomGenerator.prototype.get = function(min, max) {
                        return this._xorshift.nextInt(min, max + 1);
                    }, XorshiftRandomGenerator.prototype.serialize = function() {
                        return {
                            _seed: this.seed,
                            _xorshift: this._xorshift.serialize()
                        };
                    }, XorshiftRandomGenerator;
                }(g.RandomGenerator);
                g.XorshiftRandomGenerator = XorshiftRandomGenerator;
            }(g || (g = {})), module.exports = g;
        }).call(this);
    }, {} ]
}, {}, []);