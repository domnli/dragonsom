if (!window.QZONE) QZONE = {};
QZONE.qzEvent = {
	_eventList: {},
	_callbackList: {},
	_checkEvent: function(eventLabel) {
		var el = QZONE.qzEvent._eventList;
		if (!el[eventLabel]) return false;
		return true
	},
	register: function(eventLabel, description) {
		var el = QZONE.qzEvent._eventList;
		if (el[eventLabel]) return false;
		el[eventLabel] = {
			"label": eventLabel,
			"description": description
		};
		return true
	},
	dispatch: function(eventLabel, dataObj) {
		setTimeout(function() {
			var p = QZONE.qzEvent,
				o = {
					type: eventLabel
				};
			if (p._checkEvent(eventLabel)) {
				var l = p._callbackList[eventLabel];
				if (l) for (var i =
						0, len = l.length; i < len; i++) if (typeof l[i] == "function") l[i](o, dataObj)
			}
		}, 0)
	},
	fire: function(eventLabel, dataObj) {
		try {
			var p = QZONE.qzEvent,
				o = {
					type: eventLabel
				};
			if (p._checkEvent(eventLabel)) {
				var l = p._callbackList[eventLabel];
				if (l) for (var i = 0, len = l.length; i < len; i++) if (typeof l[i] == "function") l[i](o, dataObj)
			}
		} catch (ex) {}
	},
	addEventListener: function(eventLabel, callback) {
		QZONE.qzEvent.register(eventLabel);
		var p = QZONE.qzEvent._callbackList;
		if (typeof callback != "function") return false;
		if (!p[eventLabel]) p[eventLabel] =
				[];
		p[eventLabel].push(callback);
		return true
	},
	removeEventListener: function(eventLabel, callback) {
		var p = QZONE.qzEvent._callbackList;
		if (typeof callback != "function") return false;
		if (!p[eventLabel]) return true;
		var l = p[eventLabel];
		for (var i = 0, len = l.length; i < len; i++) if (l[i] == callback) l.splice(i, 1);
		return true
	}
};
if (!window.QZONE) QZONE = {};
QZONE.QZBuffer = function(delay, maxNum, flushCB) {
	this._delay = delay || 5E3;
	this._max_num = maxNum || 10;
	this._buffer = [];
	this._timer = "";
	this._flushCallBack = flushCB || function() {};
	this.push = function(item) {
		this._buffer.push(item);
		if (this._buffer.length == this._max_num) {
			clearTimeout(this._timer);
			this.flush()
		} else this._countDown()
	};
	this.flush = function() {
		this._flushCallBack(this._buffer);
		this._buffer = []
	};
	this._countDown = function() {
		clearTimeout(this._timer);
		var th = this;
		this._timer = setTimeout(function() {
			th.flush()
		},
			this._delay)
	};
	this.clear = function() {
		this._buffer = [];
		clearTimeout(this._timer)
	}
};
if (typeof self.g_iUin == "undefined") var g_iUin = -1,
g_iLoginUin = 0, g_UserBitmap = "0000000000000000", g_LoginBitmap = "0000000000000000", g_isAlpha_iUin = 0, g_V = {
	"ci": "_20130110_1"
}, g_isAlpha_iLoginUin = 0, ownermode = -1, g_StyleID = 0, g_fullMode = 0, siDomain = "qzonestyle.gtimg.cn", imgcacheDomain = "qzs.qq.com";
(function(_w) {
	var qz = "qzone.qq.com",
		sp = _w.g_SPrefix || "",
		dp = (_w.g_DPrefix || "") + qz,
		sdp = (_w.g_Set || _w.g_DPrefix || "") + qz,
		sdpic = (_w.g_ICSet || "") + qz;
	_w.g_W_Domain = "w." + dp;
	_w.g_R_Domain = "r." + dp;
	_w.g_Base_Domain = "base." + sdp;
	_w.g_My_Main_Domain = _w.g_Main_Domain = "users." + dp;
	_w.g_My_Music_Domain = _w.g_Music_Domain = "qzone-music.qq.com";
	_w.g_Photo_Domain = "photo.qq.com";
	_w.g_Static_Photo_Domain = "p" + (g_iUin % 13 + 1) + ".photo.qq.com";
	_w.g_MsgBoard_Domain = "m." + dp;
	_w.g_Ic_Domain = "ic." + sdp;
	_w.g_Ic2_Domain = "ic2." + sdpic;
	_w.g_Emotion_Domain =
		"e." + dp;
	_w.g_NewBlog_Domain = "b." + dp;
	_w.g_Statistic_Domain = "g." + dp;
	_w.g_Src_Domain = "u." + sdp;
	_w.iiDomain = sp + "i.gtimg.cn";
	_w.g_Apps_Domain = "appsupport.qq.com";
	_w.g_isAlpha_iUin = !! (parseInt(g_UserBitmap.charAt(1), 16) & 2) ? 1 : 0;
	_w.g_isAlpha_iLoginUin = !! (parseInt(g_LoginBitmap.charAt(1), 16) & 2) ? 1 : 0
})(window);
QZONE.FP = QZONE.FrontPage = QZONE.FrontPage || {};
QZONE.space = QZONE.space || {};
QZONE.deprecated = QZONE.deprecated || {
	OldFunctions: {}
};
QZONE.FrontPage.dataSave = function(key, va) {
	return QZFL.dataCenter.save.call(QZFL.dataCenter, key, va)
};
QZONE.FrontPage.dataLoad = function(key) {
	return QZFL.dataCenter.get.call(QZFL.dataCenter, key)
};
QZONE.FrontPage.dataDelete = function(key) {
	return QZFL.dataCenter.del.call(QZFL.dataCenter, key)
};
(function(qfp) {
	qfp.synSORead = function(key, timeout, callback, fail_callback) {
		if (!key || !callback) return;
		var startTime = (new Date).getTime(),
			endTime = startTime,
			ret = null;
		var soReadFn = function() {
			var so;
			if (so = QZFL.shareObject.getValidSO()) try {
					ret = so.get(key);
					return true
			} catch (ex) {}
			return false
		}, synReadFn = function() {
				if (!soReadFn()) {
					endTime = (new Date).getTime();
					if (endTime - startTime >= timeout) {
						typeof fail_callback == "function" && fail_callback(ret);
						return
					}
					setTimeout(synReadFn, 500)
				} else typeof callback == "function" &&
						callback(ret)
			};
		timeout = timeout || 0;
		synReadFn()
	};
	qfp.synSOWrite = function(key, value, trytimes, callback, fail_callback) {
		if (!key) return;
		var startTime = (new Date).getTime(),
			endTime = startTime,
			times = 1;
		var soWriteFn = function() {
			var so;
			if (so = QZFL.shareObject.getValidSO()) try {
					so.set(key, value);
					return true
			} catch (ex) {}
			return false
		}, synWriteFn = function() {
				if (!soWriteFn()) {
					if (++times > trytimes) typeof fail_callback == "function" && fail_callback();
					setTimeout(synWriteFn, 500)
				} else typeof callback == "function" && callback()
			};
		trytimes =
			trytimes || 1;
		synWriteFn()
	}
})(QZONE.FrontPage);
QZONE.FrontPage.getNickname = function() {
	return QZONE.FrontPage._getSummary(0)
};
QZONE.FrontPage.getGender = function() {
	var res = QZONE.FrontPage._getSummary(1);
	return !(typeof res == "string" || res == 2)
};
QZONE.FrontPage.getAge = function() {
	var res = QZONE.FrontPage._getSummary(2);
	return typeof res == "string" ? 0 : res
};
QZONE.FrontPage.getCity = function() {
	var res = QZONE.FrontPage._getSummary(3);
	if (res.length == 0) return {};
	else {
		res = res.split("@");
		if (res.length < 2) return {};
		else return {
				country: res[0],
				province: res[1],
				city: res[2]
		}
	}
};
QZONE.FrontPage.getQzoneName = QZONE.FrontPage.getQzonename = function() {
	return QZONE.FrontPage._getSummary(4)
};
QZONE.FrontPage.getDescription = function() {
	return QZONE.FrontPage._getSummary(5)
};
QZONE.FrontPage.getMallBitmap = function(bit) {
	var t = QZONE.FrontPage._getSummary(7) || "0000000000000000",
		_t = parseInt(t.charAt(15 - Math.floor((bit - 1) / 4)), 16) >> (bit - 1) % 4 & 1;
	return _t
};
QZONE.FrontPage.getBirthday = QZONE.FrontPage.getBirthDay = function() {
	var s = QZONE.FrontPage._getSummary(6);
	s = s.split("-");
	return s && s.length && s.length == 3 ? new Date(s[0], s[1] - 1, s[2]) : null
};
QZONE.FrontPage._getSummary = function(offset) {
	var t;
	return (t = window.ownerProfileSummary) ? t[offset] : ""
};
QZONE.FrontPage.openChatbox = function(uin) {
	var baseDomain = window.g_R_Domain || "r.qzone.qq.com",
		p = QZONE.FrontPage.openChatbox;
	if (!p.ifr) {
		p.ifr = document.createElement("iframe");
		p.ifr.id = "_ifrm_ht";
		document.body.appendChild(p.ifr)
	}
	p.ifr && (p.ifr.contentWindow.location = QZFL.string.format("http://{baseDomain}/cgi-bin/user/cgi_tmp_talk?qzone_uin={g_iUin}&to_uin={tarUin}&g_tk={g_tk}", {
		baseDomain: baseDomain,
		g_iUin: g_iUin,
		tarUin: uin,
		g_tk: QZONE.FrontPage.getACSRFToken()
	}));
	if (TCISD && typeof TCISD.pv == "function") TCISD.pv("wpa.qzone.qq.com",
			"/")
};
QZONE.FrontPage.showMsgbox = function() {
	QZFL.widget.msgbox.show.apply(QZFL.widget.msgbox, arguments)
};
QZONE.FrontPage.hideMsgbox = function() {
	QZFL.widget.msgbox.hide.apply(QZFL.widget.msgbox, arguments)
};
QZONE.FrontPage.showTips = function(text, icontype, opts) {
	QZONE.space.showTips(escHTML(text), icontype, opts)
};
QZONE.FrontPage.hideTips = function() {
	QZONE.space.hideTips()
};
QZONE.FrontPage.showTopTips = function(html, h, tween, opts) {
	if (!(opts && opts.dress)) if (QZONE.custom && QZONE.custom.isDressMode() || QZFL.cookie.get("qzv6up") || location.href.indexOf("/preview") > -1) return;
	var o = QZONE.FrontPage.showTopTips,
		onshow = o._onshow;
	if (!onshow) o._show(html, h, tween, opts);
	else if (html.indexOf("\u7eed\u8d39\u9ec4\u94bb") > -1) {
		o._data.splice(0, 0, o._curr);
		o._data.splice(0, 0, [html, h, tween, opts]);
		QZONE.FrontPage.hideTopTips()
	} else o._data.push([html, h, tween, opts])
};
QZONE.FrontPage.showTopTips._timer = null;
QZONE.FrontPage.showTopTips._data = [];
QZONE.FrontPage.showTopTips._onshow = false;
QZONE.FrontPage.showTopTips._height = 0;
QZONE.FrontPage.showTopTips._curr = [];
QZONE.FrontPage.showTopTips._cssed = false;
QZONE.FrontPage.showTopTips._show = function(html, h, tween, opts) {
	var ele = $("top_tips_seat"),
		c = $("top_tips_container"),
		t = $e("div.gb_toolbar").eq(0),
		o = QZONE.FrontPage.showTopTips;
	h = h || 80;
	preh = o._height;
	if (!o._cssed) {
		QZFL.css.insertCSSLink("http://" + (window.siDomain || "qzonestyle.gtimg.cn") + "/qzone_v6/gb_hintbar.css");
		o._cssed = true
	}
	if (!ele) {
		ele = document.createElement("div");
		ele.id = "top_tips_seat";
		document.body.insertBefore(ele, $e("div.lay_topfixed").eq(0))
	}
	ele.style.height = (tween ? o._height : h) + "px";
	if (!c) {
		c =
			document.createElement("div");
		c.id = "top_tips_container";
		c.style.cssText = "position:" + (QZFL.userAgent.ie && QZFL.userAgent.ie < 7 ? "absolute" : "fixed") + ";display:none;top:0;left:0;height:" + h + "px;width:99.9%;z-index:" + (opts && opts.zIndex != undefined ? opts.zIndex : 499) + ";overflow:hidden;";
		document.body.appendChild(c)
	}
	if (!tween) {
		t && !(QZFL.userAgent.ie && QZFL.userAgent.ie < 7) && (t.style.marginTop = h + "px");
		c.style.height = h + "px";
		c.style.display = ""
	} else {
		var tw = new QZFL.tweenMaker(0, 100, 300);
		tw.onChange = function(p) {
			ele.style.height =
				preh - (preh - h) * p / 100 + "px";
			t && !(QZFL.userAgent.ie && QZFL.userAgent.ie < 7) && (t.style.marginTop = preh - (preh - h) * p / 100 + "px")
		};
		tw.onEnd = function() {
			preh == 0 && QZFL.effect.show(c, 300);
			c.style.height = h + "px"
		};
		tw.start()
	}
	c.innerHTML = html;
	o._onshow = true;
	o._curr = [html, h, tween, opts];
	if (opts && opts.duration) o._timer = setTimeout(QZONE.FrontPage.hideTopTips, opts.duration)
};
QZONE.FrontPage.hideTopTips = function() {
	var c = $("top_tips_container"),
		s = $("top_tips_seat"),
		o = QZONE.FrontPage.showTopTips,
		d = o._data;
	o._timer && clearTimeout(o._timer);
	if (d.length == 0) {
		QZFL.effect.hide(c, 300, function() {
			QZFL.dom.removeElement(c);
			QZFL.dom.removeElement(s);
			var lt = $e("div.lay_topfixed").eq(0),
				gt = $e("div.gb_toolbar").eq(0),
				tw = new QZFL.tweenMaker(0, 100, 300);
			tw.onChange = function(p) {
				var hlt = parseInt(QZFL.dom.getStyle(lt, "height")),
					hgt = parseInt(QZFL.dom.getStyle(gt, "marginTop"));
				lt.style.height =
					hlt - (hlt - 34) * p / 100 + "px";
				gt.style.marginTop = hgt - (hgt - 0) * p / 100 + "px"
			};
			tw.onEnd = function() {
				lt.style.height = "34px";
				gt.style.marginTop = ""
			};
			tw.start()
		});
		o._height = 0;
		o._onshow = false
	} else {
		var s = d[0];
		o._height = o._curr[1];
		o._show(s[0], s[1], s[2], s[3]);
		o._data.splice(0, 1)
	}
};
QZONE.FrontPage.tips = function(html, aim, opts) {
	if (aim) {
		var doc = aim.ownerDocument,
			w, f, p, tmp;
		if (doc) {
			w = doc.defaultView || aim.document.parentWindow;
			if (w) {
				p = w.QZFL.dom.getXY(aim);
				while (w.parent !== w) {
					f = w.frameElement;
					w = w.parent;
					tmp = w.QZFL.dom.getXY(f);
					p[1] += tmp[1];
					p[0] += tmp[0]
				}
				opts._aimPos = p;
				return QZFL.widget.tips.show(html, aim, opts)
			}
		}
		return null
	}
	return null
};
QZONE.FrontPage.closeTips = function(id) {
	if (id) QZFL.widget.tips.close(id);
	else QZFL.widget.tips.closeAll()
};
QZONE.FrontPage.resizeTips = function(id, param) {
	QZFL.widget.tips.resize && QZFL.widget.tips.resize(id, param)
};
QZONE.FrontPage.showBubble = function() {
	QZFL.widget.bubble.show.apply(QZFL.widget.bubble, arguments)
};
QZONE.FrontPage.hideBubble = function(bid) {
	QZFL.widget.bubble.show.call(QZFL.widget.bubble, bid)
};
QZONE.FrontPage.getScrollTop = function() {
	var c = QZONE.FrontPage.getQzoneConfig(),
		d;
	return c && c.full ? QZFL.dom.getScrollTop() : (d = QZONE.FrontPage._getScrollContainer()) ? d.scrollTop : 0
};
QZONE.FrontPage._getScrollContainer = function() {
	var ctnName = "mainContainer",
		ca = QZONE.space.getCurrApp();
	if (ca && ca.length) if (ca[0] == "myhome") ctnName = "mode_main";
		else
	if (ca[0] != "main") ctnName = "frameContainer";
	return $(ctnName)
};
QZONE.FrontPage.setScrollTop = function(n) {
	var c = QZONE.FrontPage.getQzoneConfig(),
		d, els, currT, gt;
	if (n === undefined) if (c.full) {
			els = QZFL.dom.getElementsByClassName("op", "div");
			if (els && els.length) n = QZFL.dom.getPosition(els[0]).top + 5;
			gt = QZONE.FrontPage.getScrollTop();
			if (gt < n) return
		} else n = 0;
	if (c && c.full) return QZFL.dom.setScrollTop(n);
	else if (d = QZONE.FrontPage._getScrollContainer()) {
		n = n - 0;
		return d.scrollTop = isNaN(n) ? 0 : n
	}
};
QZONE.FrontPage.getAppWindowPosition = function() {
	var t = QZONE.FrontPage.getCurrentAppWindow(true);
	return t ? QZFL.dom.getPosition(t) : {
		top: 0,
		left: 0
	}
};
QZONE.FrontPage.getMedals = function(uin, callback, appid, opts) {
	uin = uin || g_iUin;
	callback = callback || QZFL.emptyFn;
	appid = appid || 0;
	opts = opts || {};
	var _s = QZONE.FrontPage.getMedals,
		t = new QZFL.JSONGetter("http://" + g_Main_Domain + "/cgi-bin/medalinfo/cgi_user_medal_get_list", "medalGetter", {
			nuin: uin,
			nappid: appid,
			nnum: 0,
			sds: Math.random()
		}, "utf-8");
	t.addOnSuccess(function(o) {
		_s._callbackHandler(o, uin, appid, callback, opts.errorCallback)
	});
	if (typeof opts.errorCallback == "function") t.addOnError(opts.errorCallback);
	t.send("_Callback")
};
QZONE.FrontPage.getMedals._db = QZONE.FrontPage.getMedals._index = null;
QZONE.FrontPage.getMedals._iconURLHandler = function(icurl, resl) {
	if (typeof resl != "number") resl = 50;
	return icurl.replace(/\.(gif|png|jpg|jpeg)$/i, "_" + resl + ".$1")
};
QZONE.FrontPage.getMedals._callbackHandler = function(od, uin, aid, cb, ecb) {
	var _s = QZONE.FrontPage.getMedals,
		t, y, x;
	if (!od || od.error) {
		if (typeof ecb == "function") ecb(od.error);
		return
	}
	_s._db = od;
	y = _s._index = {};
	for (var i = 0, len = _s._db.length; i < len; ++i) if (t = _s._db[i]) {
			if (!y[x = t._app_id]) y[x] = {};
			y[x][t._medal_id] = t;
			t.icon16 = _s._iconURLHandler(t._medal_icon, 16);
			t.icon60 = _s._iconURLHandler(t._medal_icon, 60)
		}
	cb(_s._index)
};
QZONE.FrontPage.getPortraitType = function(arrUin, callback, errorCallback) {
	if (!arrUin || !arrUin.length) return;
	var c = QZONE.FrontPage.getPortraitType._cache,
		tl = [],
		res = {};
	for (var i = 0, len = arrUin.length; i < len; ++i) if (c[arrUin[i]] === undefined) tl.push(arrUin[i]);
		else res[arrUin[i]] = c[arrUin[i]];
	if (tl.length) {
		var jg = new QZFL.JSONGetter("http://qzonebit.store.qq.com/qlogo_list.cgi", undefined, {
			count: tl.length,
			uins: tl.join(",")
		}, "utf-8");
		jg.addOnSuccess(function(data) {
			if (!data) if (typeof errorCallback == "function") errorCallback();
			for (var k in data) c[k] = data[k];
			if (typeof callback == "function") callback(data)
		});
		jg.addOnError(function() {
			if (typeof errorCallback == "function") errorCallback()
		});
		jg.send()
	} else if (typeof callback == "function") setTimeout(function() {
			callback(res)
		}, 0)
};
QZONE.FrontPage.getPortraitType._cache = {};
QZONE.FrontPage.getPortraitList = function(uinAry, callback, _paramObj) {
	if (typeof uinAry != "object" || !uinAry.length) return null;
	var paramObj = QZFL.lang.objectClone(_paramObj || {}),
		mk;
	if (typeof paramObj != "object") paramObj = {};
	paramObj.needScore = paramObj.needScore === undefined ? 0 : 8;
	paramObj.needVIP = paramObj.needVIP === undefined ? 2 : 0;
	paramObj.needNick = paramObj.needNick === undefined ? 4 : 0;
	paramObj.needPortrait = paramObj.needPortrait === undefined ? 1 : 0;
	paramObj.needBitmap = paramObj.needBitmap === undefined ? 0 : 16;
	mk = paramObj.mk =
		paramObj.needScore + paramObj.needVIP + paramObj.needNick + paramObj.needPortrait + paramObj.needBitmap;
	var _s = QZONE.FrontPage.getPortraitList,
		list = uniqueArray(uinAry),
		m = _s._portraitPool,
		tmp, t, alrd = [],
		p = [];
	for (var i = 0, len = list.length; i < len; ++i) if (tmp = list[i]) if (typeof m[tmp] == "object") if (paramObj.needScore && m[tmp][1] - 0 == 0) p.push(tmp);
				else
	if (paramObj.needVIP && m[tmp][3] - 0 == -1) p.push(tmp);
	else if (paramObj.needNick && m[tmp][6] - 0 == -1) p.push(tmp);
	else if (paramObj.needPortrait && m[tmp][0] - 0 == -1) p.push(tmp);
	else if (paramObj.needBitmap &&
		m[tmp][9] - 0 == -1) p.push(tmp);
	else alrd.push(tmp);
	else p.push(tmp); if (p.length < 1) {
		if (alrd.length < 1) return null;
		if (typeof callback == "function") {
			var fn = function(cb, al, sz) {
				return function(ro) {
					for (var k in t) t[k][0] = QZONE.FrontPage.getPURLByType(k, sz);
					if (cb) if (QZFL.userAgent.ie) setTimeout(function() {
								cb(t)
							}, 0);
						else cb(t)
				}
			}(callback, alrd, paramObj.size);
			QZONE.FrontPage.getPortraitType(QZFL.lang.objectClone(list), fn, fn)
		}
	} else if (_s._requesting) setTimeout(function() {
			QZONE.FrontPage.getPortraitList(uinAry, callback,
				_paramObj)
		}, 500);
	else if (typeof callback == "function") {
		callback.__FP_gpl_list = QZFL.lang.objectClone(list);
		if (paramObj.size) callback.__FP_gpl_size = paramObj.size;
		var cbs = _s._callbackFnQueue[mk],
			_toGet = _s._toGet[mk];
		!cbs && (cbs = _s._callbackFnQueue[mk] = []);
		!_toGet && (_toGet = _s._toGet[mk] = {});
		cbs.push(callback);
		for (var i = 0, len = p.length; i < len; ++i) _toGet[p[i]] = true;
		_s._getControl(paramObj)
	}
	if (alrd.length > 0) {
		t = {};
		for (var i = 0, len = alrd.length; i < len; ++i) t[alrd[i]] = m[alrd[i]];
		return t
	}
	return null
};
QZONE.FrontPage.getPortraitList.clearOneNode = function(uin) {
	delete QZONE.FrontPage.getPortraitList._portraitPool[uin];
	if (QZONE.FrontPage.getPortraitType._cache) delete QZONE.FrontPage.getPortraitType._cache[uin];
	return true
};
QZONE.FrontPage.getPortraitList._getControl = function(paramObj) {
	var _s = QZONE.FrontPage.getPortraitList,
		tLength = 0,
		_t, _mk = paramObj.mk;
	for (var k in _s._toGet)++tLength;
	if (tLength < 1) return;
	clearTimeout(_s.timers[_mk]);
	if (tLength > _s._MAX_NUM) _s._flush(_mk);
	else {
		_t = paramObj.customTime || _s._TIME_OUT;
		_s.timers[_mk] = setTimeout(function() {
			_s._flush(_mk)
		}, _t)
	}
};
QZONE.FrontPage.getPortraitList.timers = [];
QZONE.FrontPage.getPortraitList._flush = function(mk) {
	var _s = QZONE.FrontPage.getPortraitList;
	_s._requesting = true;
	_s._do(_s._flushFn, mk)
};
QZONE.FrontPage.getPortraitList._flushFn = function(o, mk) {
	var fn, t, tmp, _s = QZONE.FrontPage.getPortraitList,
		cbs = _s._callbackFnQueue[mk] || [],
		callee = arguments.callee,
		c;
	t = cbs[0];
	if (t && !t.checked) {
		c = function() {
			callee.apply(window, [o, mk])
		};
		QZONE.FrontPage.getPortraitType(t.__FP_gpl_list, c, c);
		t.checked = true;
		return
	}
	try {
		while (cbs.length > 0) {
			fn = cbs.shift();
			t = {};
			for (var i = 0, len = fn.__FP_gpl_list.length; i < len; ++i) {
				tmp = fn.__FP_gpl_list[i];
				t[tmp] = _s._portraitPool[tmp];
				_s._portraitPool[tmp][0] = QZONE.FrontPage.getPURLByType(tmp,
					fn.__FP_gpl_size)
			}
			fn.__FP_gpl_list = null;
			delete fn.__FP_gpl_list;
			if (fn) fn(t)
		}
	} catch (ign) {} finally {
		_s._toGet[mk] = _s._callbackFnQueue[mk] = null;
		_s._toGet[mk] = {};
		_s._callbackFnQueue[mk] = []
	}
};
QZONE.FrontPage.getPortraitList._do = function(callback, mk) {
	var _s = QZONE.FrontPage.getPortraitList,
		l = [],
		tmp, _toGet = _s._toGet[mk] || {};
	for (var k in _toGet) l.push(k - 0);
	if (l.length > 0 && typeof callback == "function") {
		tmp = new QZFL.JSONGetter("http://" + g_R_Domain + "/fcg-bin/cgi_get_score.fcg", null, {
			uins: l.join(","),
			mask: mk
		}, "gb2312");
		tmp.onSuccess = function(o) {
			var t;
			if (o) {
				for (var k in o) if (!(t = _s._portraitPool[k])) {
						o[k][9] != -1 && (o[k][9] = QZFL.string.fillLength(o[k][9], 16));
						_s._portraitPool[k] = o[k]
					} else {
						for (var i =
							0; i < 7; ++i) if (i == 1) {
								if (t[i] == 0) t[i] = o[k][i]
							} else
						if (o[k][i] != -1 && t[i] == -1) t[i] = o[k][i];
						if (t[9] < 0 && o[k][9] != -1) t[9] = QZFL.string.fillLength(o[k][9], 16)
					}
				_s._requesting = false;
				callback(o, mk)
			}
		};
		tmp.onError = function(o) {
			_s._requesting = false;
			if (typeof pgvMainV5 == "function") pgvMainV5("homeact.qzone.qq.com", "portrait_net_error")
		};
		if (mk == 1) setTimeout(function() {
				var _d = {};
				for (var i = 0, len = l.length; i < len; ++i) _d[l[i]] = [undefined, 0, -1, -1, -1, -1, -1, -1];
				tmp.onSuccess(_d)
			}, 0);
		else tmp.send("portraitCallBack")
	} else _s._requesting =
			false
};
QZONE.FrontPage.getPortraitList._portraitPool = {};
QZONE.FrontPage.getPortraitList._callbackFnQueue = {};
QZONE.FrontPage.getPortraitList._toGet = {};
QZONE.FrontPage.getPortraitList._MAX_NUM = 9;
QZONE.FrontPage.getPortraitList._TIME_OUT = 1E3;
QZONE.FrontPage.getPortraitList._timer = null;
QZONE.FrontPage.getPortraitList._requesting = false;
QZONE.FrontPage.getRemarkList = function(callback) {
	if (typeof callback != "function") return;
	var p = QZONE.FrontPage.getRemarkList,
		_jg, sUrl = "http://" + g_R_Domain + "/cgi-bin/tfriend/friend_hat_get.cgi?" + "hat_seed=" + QZFL.widget.seed.get("hat_seed", {
			useCookie: 1
		}),
		uID = "getRemarks",
		data = {
			uin: g_iLoginUin,
			fupdate: 1
		};
	if (p._data && p._origData) {
		setTimeout(function() {
			QZFL.lang.isFunction(callback) && callback(p._data, p._origData)
		}, 0);
		return
	}
	_jg = new QZFL.JSONGetter(sUrl, uID, data, "utf-8");
	_jg.addOnSuccess(function(o) {
		if (o &&
			o.code == 0) {
			o = o.data;
			p._origData = o;
			p._data = QZONE.FrontPage.getRemarkList._refactorData(o);
			QZFL.lang.isFunction(callback) && callback(p._data, p._origData)
		} else {
			p._origData = o;
			p._data = QZONE.FrontPage.getRemarkList._refactorData(o);
			QZFL.lang.isFunction(callback) && callback(p._data, p._origData)
		}
	});
	_jg.addOnError(function(o) {
		p._data = {};
		p._origData = {};
		QZFL.lang.isFunction(callback) && callback(o)
	});
	_jg.send("_Callback")
};
QZONE.FrontPage.getRemarkList._data = null;
QZONE.FrontPage.getRemarkList._origData = null;
QZONE.FrontPage.getRemarkList._refactorData = function(_o) {
	var ret = {};
	QZFL.object.each(_o, function(_t, _i) {
		_t["realname"] && (ret[_i] = _t["realname"])
	});
	return ret
};
QZONE.FrontPage.presentRemark = function(dom) {
	if (!ownermode) return;
	var p = QZONE.FrontPage.presentRemark,
		data = ENV.get("Friend_Remarks");
	if (data) p._present(dom, data);
	else {
		p._queue.push(dom);
		QZONE.FrontPage.getRemarkList(p._callback)
	}
};
QZONE.FrontPage.presentRemark._callback = function(o) {
	if (!o) return;
	var p = QZONE.FrontPage.presentRemark,
		data = ENV.get("Friend_Remark"),
		d;
	if (!data) ENV.set("Friend_Remark", o);
	while (p._queue.length > 0) {
		d = p._queue.shift();
		if (d) p._present(d, o)
	}
};
QZONE.FrontPage.presentRemark._present = function(dom, o) {
	var r, els = QZFL.dom.getElementsByClassName("q_des", "a", dom),
		uin, re = /.*des_(\d{5,10}).*/,
		tmp;
	for (var i = 0; i < els.length; i++) if (tmp = re.exec(els[i].getAttribute("link"))) {
			uin = parseInt(tmp[1], 10);
			if (uin == g_iLoginUin) continue;
			r = o[uin];
			if (r && trim(r) != "") {
				els[i].innerHTML = escHTML(r);
				QZFL.css.addClassName(els[i], "c_tx")
			}
		}
};
QZONE.FrontPage.presentRemark._queue = [];
QZONE.FrontPage.getQZLevelIconHTML = function(score, isMini, needTips, opts) {
	return QZONE.Global.Score.getQZLevelIconHTML(score, isMini, needTips, opts)
};
QZONE.FrontPage.getOwnerQZLevelIconHTMLAsyn = function(callback, isMini) {
	QZONE.Global.Score.getOwnerQZLevelIconHTMLAsyn(callback, isMini)
};
QZONE.FrontPage.getUserGrade = function(score) {
	return QZONE.Global.Score.getUserGrade(score)
};
QZONE.FrontPage.getFriendList = function(uin, cb, reload, opts) {
	opts = opts || {};
	cb = cb || QZFL.emptyFn;
	reload = reload || false;
	if (typeof cb != "function") return;
	var p = QZONE.FrontPage.getFriendList,
		_jg, sUrl = "http://" + g_R_Domain + "/cgi-bin/tfriend/friend_mngfrd_get.cgi",
		uID = "getFriendList",
		data = {
			uin: uin,
			fupdate: 1
		}, cacheKey = opts.lite ? "lite" : "all";
	if (opts.lite) data.scene = 21;
	if (p._data[cacheKey] && !reload) {
		setTimeout(function() {
			QZFL.lang.isFunction(cb) && cb(p._data[cacheKey])
		}, 0);
		return
	}
	reload && (data.rd = Math.random());
	_jg = new QZFL.JSONGetter(sUrl, uID, data, "utf-8");
	_jg.onSuccess = function(o) {
		if (o && (o.code === 0 || typeof o.error == "undefined")) {
			o = o.data;
			p._data[cacheKey] = o
		}
		QZFL.lang.isFunction(cb) && cb(o)
	};
	_jg.onError = function(o) {
		QZFL.lang.isFunction(cb) && cb(o)
	};
	_jg.send("_Callback")
};
QZONE.FrontPage.getFriendList._data = {};
QZONE.FrontPage.getFriendBirthDay = function(callback) {
	var p = QZONE.FrontPage.getFriendBirthDay,
		_jg, url = "http://drift.qzone.qq.com/cgi-bin/getbirthday",
		data = {
			"uin": g_iLoginUin,
			"day": 7,
			"bm": g_LoginBitmap,
			"rd": Math.random()
		};
	if (p._data) {
		setTimeout(function() {
			QZFL.lang.isFunction(callback) && callback(p._data)
		}, 0);
		return
	}
	_jg = new QZFL.JSONGetter(url, "getFriendBirthday", data, "utf-8");
	_jg.addOnSuccess(function(o) {
		if (o && o.friends) p._data = o;
		else p._data = {};
		QZFL.lang.isFunction(callback) && callback(o)
	});
	_jg.addOnError(function(o) {
		p._data = {};
		QZFL.lang.isFunction(callback) && callback(o)
	});
	_jg.send("_Callback")
};
QZONE.FrontPage.getFriendBirthDay._data = null;
QZONE.FrontPage.setFriendGifState = function(uin) {
	var recvuins = QZONE.FrontPage.getFriendBirthDay._data.recvuins || "",
		uins = recvuins.split("|");
	for (var i = 0, len = uins.length; i < len; i++) if (uins[i] == uin) return;
	recvuins += uins.length > 0 ? "|" + uin : uin;
	QZONE.FrontPage.getFriendBirthDay._data.recvuins = recvuins
};
QZONE.FrontPage.getWeather = function(callback, forceRefresh) {
	var p = QZONE.FrontPage.getWeather,
		url = "http://" + g_R_Domain + "/cgi-bin/user/qzone_msgtunnel_geoinfo",
		data = {
			"uin": g_iLoginUin,
			"r": Math.random()
		}, jg;
	if (!forceRefresh && p._data && p._data.uin) return setTimeout(function() {
			QZFL.lang.isFunction(callback) && callback(p._data)
		}, 0);
	jg = new QZFL.JSONGetter(url, "getWeather", data, "utf-8");
	jg.addOnSuccess(function(o) {
		QZFL.lang.isFunction(callback) && callback(p._data = o)
	});
	jg.addOnError(function(o) {
		QZFL.lang.isFunction(callback) &&
			callback(null)
	});
	jg.send("_Callback")
};
QZONE.FrontPage.appInvite = function(appid, opt) {
	var s = "/open/dialog/invite/invite.htm#pf=qzone&platform=qzone&appid=" + appid,
		opt = opt || {}, defaultW = 560,
		defaultH = 485,
		w, h, t = opt.title || "\u9080\u8bf7QQ\u597d\u53cb\u4e00\u8d77\u73a9(\u4ec5\u663e\u793a\u672a\u5b89\u88c5\u5e94\u7528\u7684\u597d\u53cb)",
		_ifrmTmp = '<iframe id="popup_dialog_frame" frameborder="no" scrolling="no" allowtransparency="yes"__p__></iframe>';
	if (QZFL.userAgent.ie === 6) {
		defaultW = 575;
		defaultH = 495
	}
	w = defaultW;
	h = defaultH;
	if (opt.extend) {
		var html =
			_ifrmTmp.replace(/__p__/g, [' src="', s, "&extend=1", '" height="', h, '" width="', w - 2, '"'].join(""));
		QZONE.FrontPage.appInvite._extendPopup = QZFL.dialog.create(t, html, {
			width: w,
			height: h
		});
		if (typeof opt.closeCallback == "function") QZONE.FrontPage.appInvite._extendPopup.onUnload = function() {
				try {
					opt.closeCallback()
				} catch (ign) {}
		}
	} else QZONE.FrontPage.popupDialog(t, {
			src: s
		}, w, h); if (window.TCISD && typeof TCISD.pv == "function") TCISD.pv("user.qzone.qq.com", "app_invite")
};
QZONE.FrontPage.appInvite._extendPopup = null;
QZONE.FrontPage.appInvite.closeExtendPopup = function() {
	var _s = QZONE.FrontPage.appInvite._extendPopup;
	if (_s) {
		_s.unload();
		_s = null
	}
};
(function(qfp) {
	var cgiUrl = "http://" + window.g_Apps_Domain + "/cgi-bin/qzapps/appinvite_invite.cgi",
		allowApp = {
			"app_216": 1
		};
	qfp.batchAppInvite = qfp.patchAppInvite = function(uin, appid, inviteIds, cb, ecb) {
		if (!uin || !appid || !allowApp["app_" + appid] || !inviteIds) return;
		var fs = new QZFL.FormSender(cgiUrl, "post", {
			"uin": uin,
			"appid": appid,
			"fuins": inviteIds
		}, "utf-8");
		fs.onSuccess = typeof cb == "function" ? cb : QZFL.emptyFn;
		fs.onError = typeof ecb == "function" ? ecb : QZFL.emptyFn;
		fs.send()
	}
})(QZONE.FrontPage);
(function(qfp, each, isFunction) {
	var queue = [],
		musicLoaded = false,
		mc = qfp.musicControler = function() {};
	qfp.triggerMusicLoaded = function() {
		if (QZONE.music && !musicLoaded) {
			musicLoaded = true;
			each(QZONE.music, function(fn, name) {
				isFunction(fn) && (mc[name] = fn)
			});
			var fn;
			while (queue.length) isFunction(fn = queue.shift()) && fn(mc);
			fn = queue = null
		}
	};
	qfp.whenMusicLoaded = function(fn) {
		if (musicLoaded) isFunction(fn) && setTimeout(function() {
				fn(mc)
			}, 0);
		else isFunction(fn) && queue.push(fn);
		return mc
	}
})(QZONE.FrontPage, QZFL.object.each,
	QZFL.lang.isFunction);
QZONE.FrontPage.getLikeInfo = function(uin, successFn, errorFn, uinlist) {
	if (uinlist && QZFL.object.getType(uinlist) == "array" && uinlist.length > 0) {
		var url = "http://r.qzone.qq.com/cgi-bin/tfriend/cgi_like_check_and_getfansnum.cgi",
			data = {
				uin: 200050606,
				mask: 3,
				uinlist: uinlist.join("_"),
				r: Math.random(),
				g_tk: QZONE.FrontPage.getACSRFToken(),
				fupdate: 1
			}, js = new QZFL.JSONGetter(url, void 0, data, "utf-8");
		js.onSuccess = function(o) {
			successFn(o)
		};
		js.onError = errorFn;
		js.send("_Callback");
		return
	}
	if (Number(uin) < 1E4) return null;
	var _info, _infoStore = QZONE.FrontPage.getLikeInfo._infoStore;
	if (_info = _infoStore[uin]) if (_info.waitting) {
			_info.waitSuccList ? null : _info.waitSuccList = [];
			_info.waitErrorList ? null : _info.waitErrorList = [];
			_info.waitSuccList.push(successFn && typeof successFn == "function" ? successFn : null);
			_info.waitErrorList.push(errorFn && typeof errorFn == "function" ? errorFn : null)
		} else successFn(_info, uin);
		else {
			_infoStore[uin] = {
				waitting: true,
				waitSuccList: [successFn],
				waitErrorList: [errorFn]
			};
			var _action = "http://r.qzone.qq.com/cgi-bin/tfriend/cgi_like_check_and_getfansnum.cgi",
				_SUCCFN = function(key) {
					return function(o) {
						var info = QZONE.FrontPage.getLikeInfo._infoStore[key],
							callbacks = info.waitSuccList,
							len = callbacks.length,
							data = o.data.data,
							cb;
						if (data) {
							info.liked = data.liked;
							info.total = data.total;
							info.today = data.today
						}
						for (var i = 0; i < len; i++) {
							cb = callbacks.shift();
							if (cb) setTimeout(function(fn, i, k) {
									return function() {
										fn(i, k)
									}
								}(cb, info, key), 0)
						}
						delete info.waitSuccList;
						delete info.waitErrorList;
						delete info.waitting
					}
				}(uin),
				_ERRORFN = function(key) {
					return function(o) {
						var info = QZONE.FrontPage.getLikeInfo._infoStore[key],
							callbacks = info.waitErrorList,
							len = callbacks.length,
							cb;
						for (var i = 0; i < len; i++) {
							cb = callbacks.shift();
							if (cb) setTimeout(function(fn, r) {
									return function() {
										fn(r)
									}
								}(cb, o), 0)
						}
						delete QZONE.FrontPage.getLikeInfo._infoStore[key]
					}
				}(uin),
				_sdata = {
					uin: uin,
					mask: 3,
					r: Math.random(),
					g_tk: QZONE.FrontPage.getACSRFToken(),
					fupdate: 1
				}, _load = new QZFL.JSONGetter(_action, void 0, _sdata, "utf-8");
			_load.onSuccess = _SUCCFN;
			_load.onError = _ERRORFN;
			_load.send("_Callback")
		}
};
QZONE.FrontPage.getLikeInfo._infoStore = {};
QZONE.FrontPage._onLike = [];
QZONE.FrontPage._addILikeListener = function(queue, fn) {
	var _lookfor = QZONE.FrontPage._ILikelookfor;
	if (QZFL.lang.isFunction(fn) && _lookfor(queue, fn) < 0) queue.push(fn)
};
QZONE.FrontPage._removeILikeListener = function(queue, fn) {
	var _lookfor = QZONE.FrontPage._ILikelookfor;
	if (QZFL.lang.isFunction(fn)) {
		var index = _lookfor(queue, fn);
		if (index > -1) queue.splice(index, 1)
	}
};
QZONE.FrontPage.addOnLikeQueue = function(fn) {
	QZONE.FrontPage._addILikeListener(QZONE.FrontPage._onLike, fn)
};
QZONE.FrontPage.removeOnLikeQueue = function(fn) {
	QZONE.FrontPage._removeILikeListener(QZONE.FrontPage._onLike, fn)
};
QZONE.FrontPage._ILikelookfor = function(_onLike, fn) {
	var len = _onLike.length,
		re = -1;
	for (var i = len - 1; i > -1; i--) if (fn === _onLike[i]) {
			re = i;
			break
		}
	return re
};
QZONE.FrontPage._onCancelLike = [];
QZONE.FrontPage.addCancelLikeQueue = function(fn) {
	QZONE.FrontPage._addILikeListener(QZONE.FrontPage._onCancelLike, fn)
};
QZONE.FrontPage.removeCancelLikeQueue = function(fn) {
	QZONE.FrontPage._removeILikeListener(QZONE.FrontPage._onCancelLike, fn)
};
(function(qfp) {
	var ifrmTemp = '<iframe id="popup_dialog_frame{popupID}" frameborder="no" allowtransparency="yes"{attr}></iframe>',
		popupQueue = [],
		fnBfUnload = null,
		oCallback = {};
	var ppd = qfp.popupDialog = function(title, html, width, height, useTween, isKeepAlive) {
		var popupID;
		if (title && typeof title == "number") {
			if (ppd._cpp = find(popupID = title)) ppd._cpp.show()
		} else {
			popupQueue.push(ppd._cpp = QZFL.dialog.create(String(title), "", {
				width: width || 430,
				height: height || 300,
				useTween: !! useTween,
				isKeepAlive: !! isKeepAlive,
				position: ua && ua.ie != 6 ? "fixed" : "absolute",
				showMask: true,
				onLoad: qfp.popupOnLoad._ref
			}));
			popupID = ppd._cpp.uniqueID;
			ppd._cpp.fillContent(html && typeof html == "object" ? QZFL.string.format(ifrmTemp, {
				popupID: isKeepAlive ? popupID : "",
				attr: ' class="qz_popup_inner_iframe" src="' + html.src + '" height="' + height + '" width="' + width + '"'
			}) : String(html));
			ppd._cpp.show();
			if (oCallback.temp && oCallback.temp.length) {
				oCallback[popupID] = oCallback.temp;
				oCallback.temp.length = 0
			}
			if (fnBfUnload) {
				ppd._cpp.onBeforeUnload = fnBfUnload;
				fnBfUnload = null
			}
			ppd._cpp.onUnload = function(dialog) {
				return function() {
					if (QZFL.lang.isFunction(window.popupCallback)) {
						qfp.appendPopupFn(window.popupCallback, popupID);
						window.popupCallback = null
					}
					if (oCallback[popupID]) for (var f, i = 0, l = oCallback[popupID].length; i < l; i++) typeof(f = oCallback[popupID][i]) == "function" && f();
					if (!dialog.isKeepAlive) {
						ppd._cpp = find(popupID, true);
						delete oCallback[popupID];
						fnBfUnload = dialog = dialog.onUnload = null
					}
				}
			}(ppd._cpp)
		}
		return popupID
	};
	ppd._ifrmTmp = '<iframe id="popup_dialog_frame" frameborder="no" allowtransparency="yes"__p__></iframe>';
	qfp.closePopup = function(popupID) {
		var dialog = popupID ? find(popupID) : ppd._cpp;
		if (dialog) {
			dialog.unload();
			if (!dialog.isKeepAlive) {
				if (ppd._cpp == dialog) ppd._cpp = null;
				dialog = null
			}
		}
	};
	qfp.appendPopupFn = function(fn, popupID) {
		var dialog = popupID ? find(popupID) : ppd._cpp,
			popupID = dialog ? dialog.uniqueID : "temp";
		(oCallback[popupID] || (oCallback[popupID] = [])).unshift(fn)
	};
	qfp.popupOnLoad = function(fn) {
		typeof fn == "function" && (qfp.popupOnLoad._ref = fn)
	};
	qfp.clearPopupFn = function(popupID) {
		popupID = popupID || ppd._cpp && ppd._cpp.uniqueID ||
			"temp";
		oCallback[popupID] && delete oCallback[popupID]
	};
	qfp.popupOnBeforeUnload = function(fn, popupID) {
		if (typeof fn == "function") {
			var dialog = popupID ? find(popupID) : ppd._cpp;
			if (dialog) dialog.onBeforeUnload = fn;
			else fnBfUnload = fn
		}
	};
	qfp.resizePopupDialog = function(width, height, popupID) {
		var dialog = popupID ? find(popupID) : ppd._cpp,
			ifrm, b;
		if (dialog) {
			width = parseInt(width, 10), height = parseInt(height, 10);
			if (ifrm = $("popup_dialog_frame" + (dialog.isKeepAlive ? dialog.uniqueID : ""))) try {
					b = ifrm.contentWindow.document.body;
					ifrm.width =
						width = width || QZFL.dom.getScrollWidth(b);
					ifrm.height = height = height || QZFL.dom.getScrollHeight(b)
			} catch (ex) {}
			dialog.setSize(width || 430, height || 300)
		}
	};

	function find(popupID, isRemove) {
		for (var p, i = popupQueue.length - 1; i > -1 && (p = popupQueue[i]); i--) if (p.uniqueID == popupID) if (isRemove) {
					popupQueue.splice(i, 1);
					return popupQueue.length && popupQueue[popupQueue.length - 1]
				} else return p
	}
})(QZONE.FrontPage);
QZONE.FrontPage.getQzoneConfig = function(param) {
	var oRtn = {
		ownerUin: g_iUin,
		isOwner: ownermode,
		styleId: g_StyleID,
		full: g_fullMode > 0,
		wide: !(g_fullMode < 3),
		center: !(g_fullMode % 2),
		frame: window.g_frameStyle > 0,
		loginUin: checkLogin(),
		isLite: typeof g_isLite != "undefined" && g_isLite == true,
		version: 6,
		isScene: window.g_Mode == "gfp_scene"
	};
	return typeof param == "string" ? oRtn[param] : oRtn
};
QZONE.FrontPage.sendGift = function(uin, argu) {
	var iu = checkLogin();
	if (iu < 10001) {
		QZONE.FrontPage.showLoginBox("mall");
		return
	}
	if (ownermode && !uin) return;
	if (uin == iu) {
		QZFL.widget.msgbox.show("\u4e0d\u80fd\u9009\u62e9\u60a8\u81ea\u5df1\u4f5c\u4e3a\u793c\u7269\u63a5\u6536\u5bf9\u8c61", 1, 2E3);
		return
	}
	if (!uin) uin = g_iUin;
	var url = ["http://", siDomain, "/qzone/gift/script/qzone.gift.js"].join("");
	QZFL.imports(url, function() {
		QZONE.Gift && QZONE.Gift.sendGift && QZONE.Gift.sendGift(uin == "any" ? null : uin)
	})
};
QZONE.FrontPage.getLikeList = function(unikey) {
	if (unikey) QZONE.FrontPage.popupDialog("\u8d5e\u8fc7\u7684\u4eba", {
			src: "http://qzs.qq.com/qzone/v6/interface/fm/like_list.html?unikey=" + unikey
		}, 380, 310)
};
QZONE.FrontPage.getSvrTime = function() {
	var _self = QZONE.FrontPage.getSvrTime,
		t = new Date,
		s = t.getTime();
	if (typeof _self._deltaTime == "undefined") _self._deltaTime = _s_.getTime() - g_NowTime * 1E3;
	t.setTime(s - _self._deltaTime);
	return t
};
QZONE.FrontPage.getSvrTime._deltaTime = void 0;
QZONE.FrontPage.checkIsDeepColor = function() {
	var d = $("QzoneDeepColorDom"),
		c, _a, grayLevel;
	if (!d) {
		d = document.createElement("DIV");
		d.id = "QzoneDeepColorDom";
		d.className = "bg_deep_dom";
		d.style.display = "none";
		document.body.appendChild(d)
	}
	c = QZFL.dom.getStyle(d, "backgroundColor");
	if (!c) c = "#FFFFFF";
	else if (c.indexOf("rgba") >= 0) {
		c = c.slice(5, c.length - 1);
		_a = c.split(",", 3)
	} else if (c.indexOf("rgb") >= 0) {
		c = c.slice(4, c.length - 1);
		_a = c.split(",", 3)
	} else _a = QZFL.css.convertHexColor(c); if (_a && _a.length == 3) {
		grayLevel = _a[0] *
			0.299 + _a[1] * 0.587 + _a[2] * 0.114;
		return grayLevel < 192
	} else return false
};
QZONE.FrontPage.getPURLByType = function(uin, size, flag) {
	flag = flag || QZONE.FrontPage.getPortraitType._cache[uin];
	if (typeof size != "number") size = 50;
	else if (size > 50) size = 100;
	else if (size <= 30) size = 30;
	else size = 50; if (flag > 1E3) return "http://" + siDomain + "/ac/qzone_v5/avatar/" + size + "/" + flag + ".jpg";
	else if (flag == 0) return "http://" + siDomain + "/ac/qzone_v5/avatar/" + size + "/5001.jpg";
	else return QZONE.FrontPage.getPURL(uin, size)
};
QZONE.FrontPage.getPURL = function(uin, size) {
	uin = parseInt(uin, 10);
	if (isNaN(uin) || uin < 1E4) uin = g_iUin;
	if (typeof size != "number") size = 50;
	else if (size > 50) size = 100;
	else if (size <= 30) size = 30;
	else size = 50;
	return "http://qlogo" + (uin % 4 + 1) + "." + (qlogoDomain || "store.qq.com") + "/qzone/" + uin + "/" + uin + "/" + size
};
QZONE.FrontPage.removeUBB = function(s) {
	var p = QZONE.FrontPage.removeUBB;
	p.regexTmp.lastIndex = p.regexEm.lastIndex = p.regexQS.lastIndex = 0;
	return s.replace(p.regexTmp, "").replace(p.regexEm, function(a, b) {
		var emId = b,
			prefix = b >= 2E3 ? "v" : "";
		if ((b >= 300 && b <= 700 || b >= 2E3) && QZONE.FrontPage.checkIsDeepColor()) emId += "_b";
		return '<img src="http://' + siDomain + "/qzone/em/" + prefix + "e" + emId + '.gif">';
		return '<img src="http://' + siDomain + "/qzone/em/e" + emId + '.gif">'
	}).replace(p.regexQS, "\u3010QQ\u79c0\u6ce1\u6ce1\u3011$2")
};
QZONE.FrontPage.removeUBB.regexTmp = /\[(img|flash|video|audio)\].*?\[\/\1\]|\[\/?(?:b|url|img|flash|video|audio|ftc|ffg|fts|ft|email|center|u|i|marque|m|r|quote)[^\]]*\]/ig;
QZONE.FrontPage.removeUBB.regexEm = /\[em\]e(\d{1,6})\[\/em\]/ig;
QZONE.FrontPage.removeUBB.regexQS = /\[qqshow(,\d*){4},?([^\]]*)\][^\[]*\[\/qqshow\]/ig;
QZONE.FrontPage.getACSRFToken = function() {
	return arguments.callee._DJB(QZFL.cookie.get("skey"))
};
QZONE.FrontPage.getACSRFToken._DJB = function(str) {
	var hash = 5381;
	for (var i = 0, len = str.length; i < len; ++i) hash += (hash << 5) + str.charAt(i).charCodeAt();
	return hash & 2147483647
};
(function(qfp) {
	var container = ['<img class="qzone_replace_icon" style="vertical-align:middle;" src="http://', siDomain, "/qzonestyle/qzone_app/app_replace_v1/", undefined, '.png" title="', undefined, '" alt="', undefined, '" />'],
		map = window.g_EmoticonsMap || {
			vip: 1,
			soso: 1,
			jia: 1,
			dyh: 1,
			dream: 1,
			tg: 1,
			love: 1,
			wennuan: 1,
			panda: 1,
			ggj: 1,
			weiai: 1,
			lol: 1,
			dl: 1,
			mum: 1,
			joy: 1,
			sea: 1
		}, tipMap = {}, r = null;
	qfp.replaceIconTag = function(srcTxt) {
		if (typeof srcTxt != "string") return "";
		var o = {}, p, a_cnt = 0;
		(p = srcTxt.indexOf("/")) > -1 && srcTxt.indexOf("/",
			p + 1) > -1 && (srcTxt = srcTxt.replace(r || (r = /<[a-z:]+\s[^>]*?>|\/([\d\w]+)\/|<\/[a-z:]+>/ig), function(ori, key) {
			if (ori == "</a>" || ori == "</qz:popup>") a_cnt = a_cnt > 0 ? a_cnt - 1 : 0;
			else if (ori.indexOf("<a ") == 0 || ori.indexOf("<qz:popup") == 0) a_cnt++;
			else if (map[key] && !o[key]) {
				container[7] = container[3] = key;
				container[5] = tipMap[key] || "/" + key + "/";
				return container.join("")
			}
			return ori
		}));
		return srcTxt
	}
})(QZONE.FrontPage);
(function(qfp) {
	var _pinyinLoaded = false;
	qfp.pinyin = function(str, callback) {
		var args = arguments,
			retStr;
		if (_pinyinLoaded) {
			callback && setTimeout(function() {
				QZFL.lang.isFunction(callback) && callback(retStr)
			}, 0);
			return retStr = QZFL.widget.pinyin.convertPYs(str)
		}
		QZFL.imports("http://" + siDomain + "/qzone/friends/selector/pinyin.js?max_age=360000&v=" + g_V.ci, function() {
			_pinyinLoaded = true;
			qfp.pinyin.apply(qfp, args)
		});
		return null
	};
	qfp.pinyin.checkIsLoaded = function() {
		return _pinyinLoaded
	}
})(QZONE.FrontPage);
QZONE.FrontPage.Search = function(keyword, opt) {
	opt = opt || {};
	if (!keyword) return;
	var data = {
		search: keyword,
		entry: opt.entryid || 99,
		appname: opt.appname,
		businesstype: opt.type
	};
	if (opt.backurl) data.backurl = opt.backurl;
	QZONE.FrontPage.toApp("/qzonesoso/?" + genHttpParamString(data))
};
QZONE.FrontPage.getUnActiveUsers = function() {
	var cache = {}, dm = g_R_Domain;
	return function(opts) {
		var uin = g_iLoginUin,
			callback, ret = {}, url;
		opts = opts || {};
		if (typeof opts == "function") opts = {
				callback: opts
		};
		opts = QZFL.object.extend({
			callback: function() {},
			iscache: true,
			errcallback: function() {}
		}, opts || {});
		callback = opts["callback"];
		if (uin) {
			if (cache[uin] && true === opts.iscache) {
				callback(cache[uin]);
				return
			}
			bm = 1;
			url = "http://" + dm + "/cgi-bin/tfriend/friend_olduser_get.cgi";
			var json = new QZFL.JSONGetter(url, undefined, {
				uin: uin,
				bm: bm,
				sds: Math.random()
			});
			json.onSuccess = function(o) {
				if (o.items && o.items.length) {
					var uins = [];
					for (var i = 0; i < o.items.length; i++) uins.push(o.items[i].uin);
					var ret = [];
					QZONE.FrontPage.getPortraitList(uins, function(o) {
						for (var i = 0; i < uins.length; i++) {
							var info = o[uins[i]];
							ret.push({
								uin: uins[i],
								img: info[0],
								name: info[6]
							})
						}
						callback(ret);
						cache[uin] = ret
					})
				} else callback([]); if (o.error) opts["errcallback"](o.error);
				if (typeof opts.statId == "number") TCISD.valueStat(opts.statId, 1, 1)
			};
			json.send("_Callback")
		} else callback([], {
				"error": {
					"type": "login",
					"msg": "\u8bf7\u5148\u767b\u5f55\u3002"
				}
			})
	}
}();
QZFL.object.each("showReportBox,showLoginBox,showVerifyBox,_specialPopup,addFriend,confirm,addILike,cancelILike".split(","), function(n) {
	QZONE.FrontPage[n] = function() {
		QZONE.FrontPage._applyImports(n, QZFL.object.makeArray(arguments))
	}
});
QZONE.FrontPage.addLoginCallback = function(fn) {
	if (typeof fn == "function") {
		var _self = QZONE.FrontPage.addLoginCallback;
		_self._fnl ? _self._fnl.push(fn) : _self._fnl = [fn]
	}
};
QZONE.FrontPage.delLoginCallback = function(fn) {
	var _self = QZONE.FrontPage.addLoginCallback;
	if (typeof fn == "function" && _self._fnl instanceof Array) {
		var a = _self._fnl;
		for (var i = a.length - 1; i > -1; i--) a[i] === fn && a.splice(i, 1)
	}
};
QZONE.FrontPage._staticServer = "http://" + siDomain + "/qzone/v6/interface/fm/";
QZONE.FrontPage._applyImports = function(func, args) {
	QZFL.imports(QZONE.FrontPage._staticServer + "_specialPopup.js?ver=" + g_V.ci, function() {
		QZONE.FrontPage[func].apply(QZONE.FrontPage, args)
	})
};
QZONE.FrontPage.fullscreenDialog = function(html, gametype, liveid) {
	var _s = QZONE.FrontPage.fullscreenDialog,
		_d = QZONE.FrontPage.fullscreenOnLoad;
	if (liveid) {
		var cnt = $("_qz_" + liveid),
			ifr = $("_ifr_" + liveid),
			hd = QZFL.dom.getClientHeight(document);
		if (!cnt) cnt = QZFL.dom.createElementIn("div", document.body, false, {
				id: "_qz_" + liveid,
				style: "position:absolute;top:" + QZFL.dom.getScrollTop() + "px;left:0px;z-index:5500;width:" + (QZFL.dom.getClientWidth() + _s._scrollbarWidth) + "px;height:" + hd + "px;"
			});
		else {
			QZFL.css.removeClassName(cnt,
				"none");
			cnt.style.top = QZFL.dom.getScrollTop() + "px";
			cnt.style.width = QZFL.dom.getClientWidth() + _s._scrollbarWidth + "px";
			cnt.style.height = QZFL.dom.getClientHeight(document) + "px"
		} if (!ifr) {
			cnt.innerHTML = '<iframe style="display:none;" width="100%" height="100%" frameborder="no" allowtransparency="yes" id="_ifr_' + liveid + '" ></iframe>';
			ifr = $("_ifr_" + liveid)
		}
		ifr.src = html.src;
		ifr.style.display = "";
		QZFL.lang.isFunction(_d._ref) && _d._ref();
		gametype = "hpfs";
		ifr.contentWindow.focus()
	} else {
		_cw = QZFL.dom.getClientWidth(),
		_ch = QZFL.dom.getClientHeight();
		html = typeof html == "object" ? _s.template_iframe.replace(/__p__/g, ' src="' + html.src + '" height="' + _ch + '" width="' + _cw + '"') : String(html);
		_s._fnl = null;
		_s._fnl = [];
		_s._cp = QZFL.dialog.create(null, html, {
			onLoad: _d._ref,
			width: _cw,
			height: _ch,
			top: QZFL.dom.getScrollTop(),
			left: 0,
			noBorder: true,
			noIframeMask: true
		})
	} if ((gametype || "thpfsmr").indexOf("s") > -1) {
		var sp;
		if (QZFL.userAgent.firefox && QZFL.userAgent.firefox >= 3.6) sp = QZONE.FrontPage.getScrollTop();
		var ds = document.documentElement.style,
			rt = $("_returnTop_layout"),
			qztc = $("QZ_Toolbar_Container"),
			_bw = _s._scrollbarWidth;
		qztc && (qztc.style.marginRight = _bw + "px");
		rt && (rt.style.marginRight = _bw + "px");
		ds.paddingRight = _bw + "px";
		ds.overflow = "hidden";
		if (sp !== undefined) QZONE.FrontPage.setScrollTop(sp)
	}
	var _now_t = new Date;
	QZFL.imports(QZONE.FrontPage._staticServer + "fullscreenDialog.js?max_age=15552000", function() {
		QZFL.event.addEvent(window, "resize", QZONE.FrontPage.fullscreenDialog._reSize, [liveid]);
		QZONE.FrontPage.toggleDisplay(false, gametype || "thpfsmr");
		window.TCISD && TCISD.valueStat(400667, 1, 11, {
			duration: new Date - _now_t,
			reportRate: 20
		})
	}, function() {
		window.TCISD && TCISD.valueStat(400667, 2, 14, {
			duration: new Date - _now_t,
			reportRate: 20
		})
	})
};
QZONE.FrontPage.fullscreenDialog._scrollbarWidth = navigator.userAgent.indexOf("Mac OS X") > -1 ? 0 : 17;
QZONE.FrontPage.fullscreenOnLoad = function(fn) {
	typeof fn == "function" && (QZONE.FrontPage.fullscreenOnLoad._ref = fn)
};
QZONE.FrontPage.addFullscreenCallback = function(fn) {
	var _s;
	typeof fn == "function" && (_s = QZONE.FrontPage.fullscreenDialog, _s._fnl = _s._fnl || [], _s._fnl.push(fn))
};
QZONE.FrontPage.closeFullScreenDialog = function() {
	var args = arguments;
	QZFL.imports(QZONE.FrontPage._staticServer + "fullscreenDialog.js?max_age=15552000", function() {
		QZONE.FrontPage.closeFullScreenDialog.apply(QZONE.FrontPage, args);
		var _now_t = new Date;
		window.TCISD && TCISD.valueStat(400667, 1, 12, {
			duration: new Date - _now_t,
			reportRate: 20
		})
	}, function() {
		window.TCISD && TCISD.valueStat(400667, 2, 14, {
			duration: new Date - _now_t,
			reportRate: 20
		})
	})
};
QZONE.FrontPage.toggleDisplay = function() {
	var args = arguments;
	QZFL.imports(QZONE.FrontPage._staticServer + "fullscreenDialog.js?max_age=15552000", function() {
		QZONE.FrontPage.toggleDisplay.apply(QZONE.FrontPage, args);
		var _now_t = new Date;
		window.TCISD && TCISD.valueStat(400667, 1, 13, {
			duration: new Date - _now_t,
			reportRate: 20
		})
	}, function() {
		window.TCISD && TCISD.valueStat(400667, 2, 16, {
			duration: new Date - _now_t,
			reportRate: 20
		})
	})
};
QZONE.FrontPage.fullscreenDialog.template_iframe = '<iframe id="fullscreen_dialog_frame" frameborder="no" allowtransparency="yes"__p__></iframe>';
QZFL.object.each("openMailDialog,updateAllMailCnt,closeMailDialog".split(","), function(n) {
	QZONE.FrontPage[n] = function() {
		var args = arguments;
		QZFL.imports(QZONE.FrontPage._staticServer + "mail.js?ver=" + g_V.ci, function() {
			QZONE.mailBox[n].apply(QZONE.mailBox, args)
		})
	}
});
QZONE.FrontPage.sendMessage = function(uin) {
	QZONE.FrontPage.toApp(["myhome/postmsg?email=", uin, "@qq.com"].join(""))
};
QZONE.FrontPage && (QZONE.FrontPage.getVIPLevel = function(callback) {
	var t = QZFL.dataCenter.get("yellowDiamondInfo"),
		_p = QZONE.FrontPage.getVIPLevel;
	if (!t) {
		if (_p.waiting) {
			setTimeout(function(fncb) {
				return function() {
					QZONE.FrontPage.getVIPLevel(fncb)
				}
			}(callback), 1E3);
			return
		}
		var __getter = new QZFL.JSONGetter("http://vip.qzone.qq.com/fcg-bin/v2/fcg_get_mall_ex", null, {
			uin: g_iLoginUin,
			vip: QZONE.FrontPage.getVipStatus(1),
			nf: QZONE.FrontPage.isUserVIPExpress(1) ? 1 : 0,
			mode: 1,
			tips: 1,
			svip: QZONE.FrontPage.getBitMapFlag(29),
			sds: Math.random()
		}, "gbk");
		__getter.onSuccess = __getter.onError = function(o) {
			_p.waiting = false;
			var __data = null;
			if (o && !~~o.code) {
				__data = o.data;
				QZONE.dataCenter.save("yellowDiamondInfo", __data)
			}
			callback && callback(__data)
		};
		__getter.send("_Callback");
		_p.waiting = true
	} else callback && callback(t)
}, QZONE.FrontPage.getVIPLevel.waiting = false);
QZONE.FrontPage.getDailyNum = function(callback) {
	var p = QZONE.FrontPage.getDailyNum,
		_jg, url = "http://msg.qzone.qq.com/cgi-bin/v5/fcg_get_daysndnum",
		data = {
			"uin": g_iLoginUin,
			"rd": Math.random()
		};
	if (p._data) {
		setTimeout(function() {
			callback(p._data)
		}, 0);
		return
	}
	_jg = new QZFL.JSONGetter(url, "getDailyNum", data, "utf-8");
	_jg.addOnSuccess(function(o) {
		if (o) p._data = o;
		else p._data = {};
		callback(o)
	});
	_jg.addOnError(function(o) {
		p._data = {};
		callback(o)
	});
	_jg.send("_Callback")
};
QZONE.FrontPage.getParameter = function(url, name) {
	var r = new RegExp("(\\?|#|&)" + name + "=([^&#]*)(&|#|$)"),
		m = url.match(r);
	return !m ? "" : m[2]
};
QZONE.FrontPage.getPosition = function() {
	var posX, posY;
	if (g_fullMode == 0) {
		posX = parseInt(QZFL.dom.getStyle("contentBody", "left")) || 0;
		posY = parseInt(QZFL.dom.getStyle("contentBody", "top")) || 0
	} else {
		posX = parseInt(QZFL.dom.getStyle("outerBox", "paddingLeft")) || 0;
		posY = parseInt(QZFL.dom.getStyle("outerBox", "paddingTop")) || 0
	}
	ENV.set("spacePositionX", posX);
	ENV.set("spacePositionY", posY);
	return [posX, posY]
};
(function(qdd) {
	window.g_Dressup = window.g_Dressup || {};
	var modeMap = {
		"gfp_module": 5,
		"gfp_fixed": 6,
		"gfp_scene": 7,
		"gfp_blog_lite": 7,
		"gfp_photo_lite": 7,
		"gfp_template": 15,
		"gfp_timeline_scene": 99
	}, stringModeMap = {
			5: "gfp_module",
			6: "gfp_fixed",
			7: "gfp_scene",
			8: "gfp_blog_lite",
			9: "gfp_photo_lite",
			15: "gfp_template",
			99: "gfp_timeline_scene"
		}, inner = {
			styleid: (window.g_StyleID + "").replace("v6/", ""),
			scene: window.g_SceneID,
			framestyle: window.g_frameStyle,
			mode: modeMap[window.g_Mode] || window.g_fullMode,
			icstyle: window.g_icLayout,
			ishidetitle: window.g_isHideTitle,
			xpos: window.g_fullMode ? QZONE.FrontPage.getPosition()[0] : 0,
			ypos: 0,
			diystyle: 0,
			inshop: 0,
			transparence: window.g_TransparentLevel,
			diytitle: window.g_diyTitle,
			isBGScroll: window.g_isBGScroll,
			ddressno: window.g_7DDressNo,
			neatstyle: window.g_neatstyle,
			items: g_Dressup.items || [],
			diyitems: g_Dressup.diyitems || [],
			windows: g_Dressup.windows || []
		};
	qdd.init = function(data) {
		var _p = QZONE.FrontPage.getPosition();
		inner.styleid = data && data.styleid || (g_StyleID + "").replace("v6/", "");
		inner.scene =
			data && data.scene || window.g_SceneID;
		inner.framestyle = data && data.framestyle || window.g_frameStyle;
		inner.mode = data && data.mode || modeMap[g_Mode] || g_fullMode;
		inner.icstyle = data && data.icstyle || window.g_icLayout;
		inner.ishidetitle = data && data.ishidetitle || window.g_isHideTitle;
		inner.xpos = data && data.xpos || (g_fullMode ? _p[0] : 0);
		inner.ypos = 0;
		inner.diystyle = data && data.diystyle || 0;
		inner.inshop = data && data.inshop || 0;
		inner.transparence = data && data.transparence || window.g_TransparentLevel;
		inner.diytitle = data && data.diytitle ||
			window.g_diyTitle;
		inner.isBGScroll = data && data.isBGScroll || window.g_isBGScroll;
		inner.ddressno = data && data.ddressno || window.g_7DDressNo;
		inner.neatstyle = data && data.neatstyle || window.g_neatstyle;
		inner.windows = data && data.windows || QZFL.lang.objectClone(g_Dressup.windows) || [];
		inner.items = data && data.items || QZFL.lang.objectClone(g_Dressup.items) || [];
		inner.diyitems = data && data.diyitems || QZFL.lang.objectClone(g_Dressup.diyitems) || []
	};
	qdd.getStringMode = function(mode) {
		return stringModeMap[mode || inner.mode]
	};
	qdd.isOldXWMode = function(original) {
		var t, i, l, isXW = false;
		if (window.g_Dressup && (t = g_Dressup.items)) for (i = 0, l = t.length; i < l; i++) if (t[i] && t[i].type == 28 && t[i].flag == 1) {
					isXW = true;
					break
				}
		if (!original && QZONE.shop && QZONE.shop.shopLib && (t = QZONE.shop.shopLib.searchItem("28"))) t.length > 0 && t[0].flag == 1 ? isXW = true : isXW = false;
		return isXW
	};
	qdd.isXWMode = function(original) {
		var t, i, l, isXW = false;
		if (window.g_Dressup && (t = g_Dressup.items)) for (i = 0, l = t.length; i < l; i++) if (t[i] && t[i].type == 28) {
					isXW = true;
					break
				}
		if (!original && QZONE.shop && QZONE.shop.shopLib &&
			(t = QZONE.shop.shopLib.searchItem("28"))) t.length > 0 ? isXW = true : isXW = false;
		return isXW
	};
	qdd.bindGetterSetter = function() {
		qdd["getFullMode"] = function() {
			return g_fullMode
		};
		var re = /[a-z]/;
		QZFL.object.each(inner, function(v, k) {
			var name = k.replace(re, function(m) {
				return m.toUpperCase()
			});
			qdd["get" + name] = function(f) {
				if (!f && k == "transparence") {
					var s = QZONE.shop && QZONE.shop.shopLib && QZONE.shop.shopLib.searchItem(26),
						val;
					if (s && s.length && (s = s[0])) val = (inner[k] >> 8) % 101;
					else val = (inner[k] & 255) % 101;
					return val
				}
				return inner[k]
			};
			qdd["set" + name] = function(val) {
				if (k == "mode") typeof val == "string" && val.indexOf("gfp_") > -1 && (val = modeMap[val] || g_fullMode);
				if (k == "transparence") {
					var s = QZONE.shop && QZONE.shop.shopLib && QZONE.shop.shopLib.searchItem(26);
					if (s && s.length && (s = s[0])) {
						inner[k] = inner[k] & 255;
						inner[k] |= val % 101 << 8
					} else {
						inner[k] = inner[k] & 65280;
						inner[k] |= val % 101
					}
					return
				}
				inner[k] = val
			}
		})
	};
	qdd.itemCheck = function(item) {
		var ddc = QZONE.dressDataCenter,
			mode = ddc.getMode();
		if (mode == 7) {
			if (item.type == 26 || item.type == 28) return false
		} else if (mode ==
			5) {
			if (item.type == 27) return false;
			if (ddc.isOldXWMode() || ddc.isXWMode()) {
				if (item.type == 26) return false
			} else if (item.type == 28) return false
		} else if (mode == 6) if (item.type == 27 || item.type == 28) return false;
		return true
	};
	qdd.convert2XWMode = function(frameStyle, windows) {
		if (!windows) return windows;
		if (frameStyle > 128) frameStyle -= 128;
		var ar = [
			[],
			[],
			[]
		];
		var layout_id_map = {
			"-1": [1, 3],
			1: [1, 3],
			2: [1, 3, 1],
			3: [1, 2, 2],
			4: [1, 2, 1],
			5: [1, 4],
			6: [2, 2],
			7: [3, 2],
			8: [1, 1, 2],
			9: [1, 1, 3],
			"0": null
		};
		var minMH = {
			4: {
				w: 180,
				h: 300
			}
		};
		var layout = layout_id_map[frameStyle];
		var dR = {
			x: 0,
			y: 0,
			w: 708,
			h: 480
		};
		var minH = 180;
		var minW = 180;
		var pading = {
			x: 6,
			y: 6
		};
		var l, i, s, t, k, h;
		var calcSum = function(arr, idx) {
			for (var i = 0, l = Math.min(idx, arr.length), s = 0; i < l; i++) s += arr[i];
			return s
		};
		if (frameStyle == -1 && windows && windows.length > 0) {
			var o;
			for (var i = 0; i < windows.length; i++) if (o = windows[i]) {
					o.posx = i % 2;
					o.posy = Math.floor(i / 2)
				}
		}
		if (layout) {
			l = layout.length;
			s = calcSum(layout, layout.length);
			QZFL.object.each(windows, function(o) {
				if (o && o.appid) {
					i = Math.min(o.posx, l - 1);
					t = QZFL.lang.objectClone(o);
					t.posx = dR.x +
						Math.round(calcSum(layout, i) / s * dR.w);
					k = layout[i];
					t.width = Math.round(k / s * dR.w);
					ar[i].push(t)
				}
			});
			for (i = 0; i < l; i++) {
				ar[i].sort(function(a, b) {
					return a.posy - b.posy
				});
				for (k = 0, s = ar[i].length; k < s; k++) {
					t = ar[i][k];
					t.posx += i * pading.x;
					h = Math.max(t.height, Math.floor(dR.h / s));
					t.height = Math.max(h, minMH[t.appid] && minMH[t.appid].h || minH);
					t.posy = k > 0 ? ar[i][k - 1].posy + ar[i][k - 1].height : dR.y;
					k > 0 && (t.posy += pading.y)
				}
			}
			t = ar[0].concat(ar[1]).concat(ar[2])
		} else {
			t = QZFL.lang.objectClone(windows);
			t.sort(function(a, b) {
				return a.posx +
					a.width - b.posx - b.width
			});
			if (l = t.length) {
				k = parseInt(t[l - 1].posx) + parseInt(t[l - 1].width);
				if (k != 0 && dR.w + 12 < k) QZFL.object.each(t, function(o) {
						if (o && o.appid) {
							o.posx = dR.x + Math.round(o.posx * dR.w / k);
							o.width = Math.round(o.width * dR.w / k)
						}
					})
			}
		}
		return t
	};
	qdd.restore = function() {
		qdd.init(null)
	};
	var _from = "";
	qdd.setDressSrc = function(from) {
		_from = from
	};
	qdd.getDressSrc = function() {
		return _from
	};
	var _aid = "";
	qdd.setDressAid = function(aid) {
		_aid = aid
	};
	qdd.getDressAid = function() {
		return _aid
	};
	qdd.getDefaultTitlebarHeight = function() {
		return 220
	};
	qdd.bindGetterSetter()
})(QZONE.dressDataCenter = QZONE.dressDataCenter || {});
QZONE.FrontPage.get7DDressNo = function() {
	return QZONE.dressDataCenter.getDdressno()
};
QZONE.FrontPage.addUGCLike = function(_dom, _sources, _opts, _cb) {
	if (_sources) {
		_sources.unikey = _sources.uniKey = _sources["unikey"] || _sources["uniKey"];
		_sources.curkey = _sources.curKey = _sources["curkey"] || _sources["curKey"]
	}
	var _callee = arguments.callee;
	if (!QZONE.FrontPage.addUGCLike._namespace) {
		if (_callee._loadStarted && _sources) {
			_callee.update(_dom, _sources);
			arguments[1] = null;
			_callee._imports(arguments)
		} else _callee._imports(arguments);
		return
	}
	_opts = _opts || {};
	var _onGetData = _opts["onGetData"],
		_onLike = _opts["onLike"],
		_onCancelLike = _opts["onCancelLike"],
		_template = _opts["template"],
		_btnStyle = _opts["btnStyle"],
		_cacheData = _opts["cacheData"],
		_groupId = _opts["groupId"],
		_face = _opts["face"],
		_onNoPermite = _opts["onNoPermite"],
		_onUpdateBefore = _opts["onUpdateBefore"],
		_onCacheData = _opts["onCacheData"];
	var btn = _callee._namespace.create(_btnStyle, _template, _dom, _cacheData, _groupId, _face).bind(_dom).registerCallBack(_onLike, _onCancelLike, _onNoPermite, _onUpdateBefore, _onCacheData, _onGetData);
	if (QZFL.object.getType(_cb) == "function") _cb(btn);
	arguments.callee.update(_dom, _sources)
};
QZONE.FrontPage.addUGCLike.update = function(_dom, _sources) {
	if (!_sources) return;
	if (_sources) {
		_sources.unikey = _sources.uniKey = _sources["unikey"] || _sources["uniKey"];
		_sources.curkey = _sources.curKey = _sources["curkey"] || _sources["curKey"]
	}
	var _callee = arguments.callee;
	var para = {
		_dom: _dom,
		_sources: QZFL.object.getType(_sources) == "array" ? _sources : [_sources]
	};
	if (!QZONE.FrontPage.addUGCLike._namespace) _callee._invokePool = _callee._invokePool || [];
	if (_callee._invokePool) {
		if (!QZONE.FrontPage.addUGCLike._namespace) _callee._invokePool.push(para);
		else {
			_callee._invokePool.unshift(para);
			_callee._invokePool.reverse();
			_callee._batUpdate(_callee._invokePool);
			_callee._invokePool = null
		}
		return
	} else if (_callee._timerPool) {
		_callee._timerPool.push(para);
		clearTimeout(_callee._timer);
		_callee._timer = setTimeout(function() {
			_callee._batUpdate(_callee._timerPool);
			_callee._timerPool = []
		}, 100);
		return
	}
	var btn = QZONE.FrontPage.addUGCLike._namespace.getLikeButton(_dom);
	if (btn) btn.update(_sources);
	else QZFL.console.print(":: UGC\u6309\u94ae\u83b7\u53d6\u5931\u8d25  id: " + _dom)
};
QZONE.FrontPage.addUGCLike.update._invokePool = null;
QZONE.FrontPage.addUGCLike.update._timerPool = null;
QZONE.FrontPage.addUGCLike.update._batUpdate = function(_pool) {
	var queue = [],
		_jBreak = false;
	for (var i = 0; i < _pool.length; i++) {
		var __dom = _pool[i]._dom;
		var __sources = _pool[i]._sources;
		if (QZFL.object.getType(__sources) != "array") __sources = [__sources];
		for (var j = 0; j < queue.length; j++) if (__dom == queue[j]._dom) {
				queue[j]._sources = queue[j]._sources.concat(__sources);
				_jBreak = true;
				break
			}
		if (_jBreak) {
			_jBreak = false;
			continue
		}
		queue.push(_pool[i])
	}
	QZONE.FrontPage.addUGCLike._namespace.packageSend(queue)
};
QZONE.FrontPage.addUGCLike.dispose = function(_dom) {
	if (!QZONE.FrontPage.addUGCLike._namespace) return;
	QZONE.FrontPage.addUGCLike._namespace.disposeByDom(_dom)
};
QZONE.FrontPage.addUGCLike.openBathMode = function() {
	QZONE.FrontPage.addUGCLike.update._timerPool = []
};
QZONE.FrontPage.addUGCLike.openBathMode();
QZONE.FrontPage.addUGCLike._imports = function(_args) {
	QZONE.FrontPage.addUGCLike._loadStarted = true;
	QZFL.imports(QZONE.FrontPage._staticServer + "UGCLikeButton.js?ver=" + g_V.ci, function() {
		_args.callee.apply(null, _args)
	})
};
QZONE.FrontPage.addUGCLike._loadStarted = false;
QZONE.FrontPage.getFeedVersion = function() {
	return 1
};
QZONE.FrontPage.getDomainSafeLevel = function() {
	var SAFE_LEVEL = {
		SAFE: 1,
		DEFAULT: 0,
		FORBID: -1,
		UNKNOWN: -999
	};
	var reg = /^(?:[a-z]+:\/\/)((?:\w+\.)*(?:[\w-]+\.)+(?:(com\.cn)|(net\.cn)|(gov\.cn)|(org\.cn)|([a-z]+)))/i,
		subReg = /^\.?[\w]+\./,
		safeDict = null,
		invokePoll = [],
		getSafeDict = function(cb) {
			var jg = new QZFL.JSONGetter("http://" + imgcacheDomain + "/qzone/v6/v6_config/domain_white_list.json", "safeDict", null, "utf-8");
			jg.onSuccess = function(o) {
				safeDict = o;
				cb(0)
			};
			jg.onError = function() {
				cb(-1)
			};
			jg.send("_Callback")
		}, checkDomain = function(url) {
			var matcher = url.match(reg),
				domain4chk, subCheck, ret;
			if (domain4chk = matcher && matcher[1]) {
				ret = safeDict[domain4chk] || safeDict["." + domain4chk];
				while (!ret && domain4chk) {
					subCheck = domain4chk.replace(subReg, ".");
					ret = safeDict[subCheck];
					if (domain4chk != subCheck) domain4chk = subCheck;
					else domain4chk = ""
				}
			}
			return ret || SAFE_LEVEL.DEFAULT
		}, checkSafe = function(url, cb) {
			var arg = arguments,
				ivk;
			if (safeDict) cb(checkDomain(url));
			else {
				invokePoll.push({
					url: url,
					cb: cb
				});
				getSafeDict(function(errCode) {
					while (ivk = invokePoll.shift()) if (!errCode) ivk.cb(checkDomain(ivk.url));
						else ivk.cb(SAFE_LEVEL.UNKNOWN)
				})
			}
		};
	return function(url, callBack) {
		checkSafe(url, callBack)
	}
}();
QZONE.FrontPage.insertButtonRB = function(opts) {
	if (!opts || typeof opts != "object" || !opts.text) return false;
	var c, hid, b, l, t, sw = false;
	if (!(c = $("_returnTop_layout"))) {
		hid = QZONE.fixLayout.create("", true, "_returnTop_layout", false, {
			style: "right:0;z-index:5000" + (QZONE.userAgent.ie ? ";width:300px" : "")
		});
		c = $("_returnTop_layout")
	}
	b = document.createElement("div");
	b.className = "right" + (opts.bClassName ? " " + opts.bClassName : "");
	opts.bid && (b.id = opts.bid);
	if (typeof opts.seq == "number") {
		l = c.childNodes;
		if (l && l.length && (t = l[opts.seq])) {
			c.insertBefore(b,
				t);
			sw = true
		}
	}!sw && c.appendChild(b);
	b.innerHTML = "<a" + (opts.title ? ' title="' + QZFL.string.escHTML(opts.title) + '"' : "") + ' href="' + (opts.href ? QZFL.string.escHTML(opts.href) : "javascript:void(0);") + '"' + (opts.target ? ' target="' + QZFL.string.escHTML(opts.target) + '"' : ' target="_blank"') + (opts.className ? ' class="' + QZFL.string.escHTML(opts.className) + '"' : ' class="index_tips_to_top"') + (opts.cssText ? ' style="' + opts.cssText + '"' : "") + (opts.id ? ' id="' + QZFL.string.escHTML(opts.id) + '"' : "") + '><span class="none">' + QZFL.string.escHTML(opts.text) +
		"</span></a>";
	typeof opts.clickCall == "function" && QZFL.event.addEvent(b.firstChild, "click", opts.clickCall);
	return hid
};
QZONE.FrontPage.getUserVipHTML = function(size, plusArgs) {
	var isVip = QZONE.FrontPage.getVipStatus(),
		lv = QZONE.FrontPage.getUserBitmap(18, 4),
		isYearVip = QZONE.FrontPage.isUserVIPExpress(),
		isSuper = QZONE.FrontPage.getUserBitmap(29, 1),
		isYearExpire = QZONE.FrontPage.getUserBitmap(39, 1);
	return QZONE.FrontPage.getVipHTML({
		"lv": lv,
		"isVip": isVip,
		"isYearVip": isYearVip,
		"isSuper": isSuper,
		"isYearExpire": isYearExpire
	}, size, plusArgs)
};
QZONE.FrontPage.getVipHTML = function(dataArgs, size, plusArgs) {
	var dataArgs = dataArgs || {}, lv = dataArgs.lv || 0,
		isSuper = dataArgs.isSuper,
		isVip = isSuper || (dataArgs.isVip != undefined ? dataArgs.isVip : + !! lv),
		isYearVip = isVip && dataArgs.isYearVip,
		isYearExpire = !isYearVip && dataArgs.isYearExpire,
		map, meta, tmpl, html = "",
		yearHTML, yearTag = "",
		yearGrayTag = "",
		link = "http://vip.qzone.com/?login=qq";
	isVip && lv == 0 && (lv = 1);
	var _genClass = function(data) {
		var tmpl = "qz_vip_icon_{sizeTag}{yearTag} qz_vip_icon{flashTag}_{sizeTag}{greyTag}{yearTag}{yearGrayTag}_{lv}";
		return QZFL.string.format(tmpl, data)
	}, _class;
	plusArgs = plusArgs || {};
	tmpl = '<a href="{link}" target="_blank" title="\u70b9\u51fb\u67e5\u770b\u9ec4\u94bb\u7279\u6743\u8be6\u60c5" {onClick} class="{_class} {className}"></a>{yearHTML}';
	yearHTML = '<img src="http://' + window.siDomain + '/ac/qzone_v5/client/year_vip_icon.png" width="16" height="16" style="vertical-align: text-bottom;">';
	map = {
		"s": [1, 0],
		"m": [0, 1],
		"l": [1, 0],
		"xl": [0, 1]
	};
	size = size && size.toLowerCase && size.toLowerCase();
	meta = map[size];
	if (meta && lv > 0) {
		plusArgs.withYear =
			typeof plusArgs.withYear == "number" ? plusArgs.withYear : + !! plusArgs.withYear;
		if (plusArgs.withYear && meta[0] && (isYearVip || isYearExpire)) {
			link = "http://vip.qzone.com/year.html?login=qq";
			yearTag = plusArgs.withYear == 1 ? "_year" : "_year_fee";
			isYearExpire && (yearGrayTag = "_gray")
		}
		_class = _genClass({
			"lv": lv,
			"yearTag": yearTag,
			"yearGrayTag": yearGrayTag,
			"flashTag": isSuper ? "_fla" : "",
			"sizeTag": size,
			"greyTag": isVip ? "" : "_gray"
		});
		if (plusArgs.returnClass) return _class;
		html = QZFL.string.format(tmpl, {
			"_class": _class,
			"link": link,
			"yearHTML": plusArgs.withYear && isYearVip && meta[1] ? yearHTML : "",
			"className": plusArgs.className ? plusArgs.className : "",
			"onClick": plusArgs.click ? 'onclick="' + plusArgs.click + '"' : ""
		})
	}
	return html
};
QZONE.FrontPage.getEmojiHTML = function(emojiArr, className) {
	var _html = [],
		_genEmoji, ua = QZFL.userAgent,
		iOs = ua.isiPod || ua.isiPad || ua.isiPhone,
		className = className ? ' class="' + className + '"' : "";
	_genEmoji = function(emojiStr) {
		var _i_tag_emoji = "<img" + className + ' src="http://' + window.siDomain + '/qzone_v6/img/emoji/{0}.png" />',
			_htmlMeta = "&#x{0};";
		if (typeof emojiStr == "string" && emojiStr.length > 0) if (iOs) if (emojiStr.length == 10) {
					var emoji_1 = emojiStr.slice(0, 5),
						emoji_2 = emojiStr.slice(5, 10);
					return format(_htmlMeta, emoji_1) +
						format(_htmlMeta, emoji_2)
				} else
		if (emojiStr.length == 6 && emojiStr.indexOf("2e03") > 0) {
			var emoji_1 = emojiStr.slice(0, 2),
				emoji_2 = emojiStr.slice(2, 6);
			return format(_htmlMeta, emoji_1) + format(_htmlMeta, emoji_2)
		} else return format(_htmlMeta, emojiStr);
		else return format(_i_tag_emoji, emojiStr);
		return ""
	};
	if (QZFL.lang.isArray(emojiArr)) for (var i = 0, len = emojiArr.length; i < len; i++) _html.push(_genEmoji(emojiArr[i]));
	return _html.join("")
};
QZONE.FrontPage.showNotification = function() {
	var args = arguments;
	QZFL.imports(QZONE.FrontPage._staticServer + "tools.js?ver=" + g_V.ci, function() {
		QZONE.FrontPage.showNotification.apply(QZONE.FrontPage, args)
	})
};
QZONE.FrontPage.Vip = function() {
	var INVALID_PARAM = -1;

	function _get(sBitmap, bit, length) {
		length = length || 1;
		var type = typeof bit,
			k, rslt = {}, _l;
		if (type == "object") {
			for (k in bit) rslt[k] = _getBit(sBitmap, bit[k]);
			return rslt
		}
		if (type == "number") {
			length = length || 1;
			rslt = "";
			for (k = bit, _l = bit + length; k < _l; k++) rslt = _getBit(sBitmap, k) + rslt;
			return parseInt(rslt, 2)
		}
		return INVALID_PARAM
	}
	function _getBit(sBitmap, bit) {
		return parseInt(sBitmap.charAt(15 - Math.floor((bit - 1) / 4)), 16) >> (bit - 1) % 4 & 1
	}
	var ret = function() {};
	return QZFL.object.extend(ret, {
		_getClass: function(level, isVip, isAnnual, opts) {
			isVip = isVip || 0;
			isAnnual = isAnnual || 0;
			opts = opts || {};
			opts = QZFL.object.extend({}, opts);
			opts.returnClass = 1;
			opts.withYear = 1;
			return QZONE.FrontPage.getVipHTML({
				lv: level,
				isVip: isVip > 0,
				isYearVip: isAnnual == 1,
				isYearExpire: isAnnual == -1,
				isSuper: opts.isSuper
			}, opts.size, opts)
		},
		_getIcon: function(level, isVip, isAnnual, opts) {
			isVip = isVip || 0;
			isAnnual = isAnnual || 0;
			opts = opts || {};
			opts = QZFL.object.extend({}, opts);
			opts.withYear = 1;
			return QZONE.FrontPage.getVipHTML({
				lv: level,
				isVip: isVip > 0,
				isYearVip: isAnnual == 1,
				isYearExpire: isAnnual == -1,
				isSuper: opts.isSuper
			}, opts.size, opts)
		},
		fillIcon: function(uin, opts, fun) {
			var uins = [];
			var owner = uin == checkLogin();
			var _fillByBitmap = QZONE.FrontPage.Vip.fillByBitmap;
			if (owner) fun && _fillByBitmap(window.g_LoginBitmap, opts, fun, uin);
			else {
				QZFL.lang.isArray(uin) ? uins = uin : uins = [uin];
				QZONE.FrontPage.getPortraitList(uins, function(o) {
					QZFL.object.each(uins, function(uu) {
						var dt = o[uu],
							bitmap = dt[9];
						if (!bitmap || (bitmap + "").length < 16) {
							QZFL.console.print("get_scroe.cgi mask error : uin->" +
								uu + " bitmap->" + bitmap);
							return
						}
						fun && _fillByBitmap(bitmap, opts, fun, uu)
					})
				}, {
					needBitmap: 1
				})
			}
		},
		fillByBitmap: function(bitmap, opts, cb, uin) {
			if (!bitmap || bitmap.length < 16) {
				QZFL.console.print("bitmap\u53c2\u6570\u9519\u8bef", 0);
				return false
			}
			var lv = _get(bitmap, 18, 4),
				isInVip = _get(bitmap, 27),
				isInYear = _get(bitmap, 17),
				isSuper = _get(bitmap, 29),
				isYearEver = _get(bitmap, 39);
			var _getClass = QZONE.FrontPage.Vip._getClass,
				_getIcon = QZONE.FrontPage.Vip._getIcon;
			var isVip = isInVip == 1 ? 1 : lv > 0 ? -1 : 0,
				isAnnual = isInYear == 1 ? 1 : isYearEver ==
					1 ? -1 : 0;
			opts = opts || {};
			opts.isSuper = isSuper;
			var _class = _getClass(lv, isVip, isAnnual, opts);
			var _iconStr = _getIcon(lv, isVip, isAnnual, opts);
			cb && cb(_class, _iconStr, uin);
			return _class
		}
	})
}();
(function(qfp) {
	g_LoginBitmap = g_LoginBitmap == "0" ? "0000000000000000" : g_LoginBitmap;
	var cgiGetBitmap = "http://" + g_Base_Domain + "/cgi-bin/user/cgi_getunimbitmap",
		gmb, INVALID_PARAM = -1;
	qfp.getUserBitmap = function(bit, length) {
		return _get(g_UserBitmap, bit, length)
	};
	qfp.setUserBitmap = function(data, bit) {
		return g_UserBitmap = _set(g_UserBitmap, data, bit)
	};
	qfp.getLoginBitmap = function(bit, length) {
		return g_iLoginUin == checkLogin() ? _get(g_LoginBitmap, bit, length) : "error:login user changed"
	};
	qfp.setLoginBitmap = function(data,
		bit) {
		if (g_iLoginUin == checkLogin()) return g_LoginBitmap = _set(g_LoginBitmap, data, bit);
		return false
	};
	gmb = qfp.getMinorBitmap = function(uin, callback, bit, length) {
		uin = parseInt(uin, 10);
		if (uin < 10001) return false;
		uin = uin + "";
		if (typeof callback != "function") return false;
		bit = parseInt(bit, 10) || 1;
		length = parseInt(length, 10) || 1;
		var uinBm = gmb._cache[uin],
			_fn, _cb;
		if (!uinBm && g_iLoginUin == g_iUin && g_iLoginUin == uin && window.g_UserunimBitmap_flag == 0 && typeof window.g_UserunimBitmap == "string" && window.g_UserunimBitmap.length ==
			16) {
			gmb._cache[uin] = window.g_UserunimBitmap;
			uinBm = gmb._cache[uin]
		}
		if (uinBm) callback(uinBm, _get(uinBm, bit, length));
		else {
			_fn = function(b, l) {
				return function(bitmap) {
					callback(bitmap, _get(bitmap, b, l))
				}
			}(bit, length);
			if (!gmb._cbQueue[uin]) gmb._cbQueue[uin] = [];
			gmb._cbQueue[uin].push(_fn);
			if (gmb._requesting[uin]) return false;
			gmb._requesting[uin] = true;
			_cb = function(bitmap) {
				gmb._cache[uin] = typeof bitmap == "string" && bitmap.length == 16 ? bitmap : null;
				gmb._requesting[uin] = false;
				gmb._execCallback(uin)
			};
			qfp._loadMinorBitmap(uin,
				_cb, _cb)
		}
	};
	gmb._cache = {};
	gmb._cbQueue = {};
	gmb._requesting = {};
	gmb._execCallback = function(uin) {
		var _arCb = gmb._cbQueue[uin],
			bitmap = gmb._cache[uin];
		while (_arCb.length) _arCb.shift()(bitmap)
	};
	qfp._loadMinorBitmap = function(uin, callback, errCallback) {
		qfp._loadData(cgiGetBitmap, {
			uin: uin,
			ryan: Math.random()
		}, callback, errCallback)
	};
	qfp._loadData = function(url, data, callback, errCallback) {
		var t = new QZFL.JSONGetter(url, void 0, data, "utf-8");
		t.onSuccess = callback;
		t.onError = errCallback;
		t.send("_Callback")
	};
	qfp.setMinorBitmap = function(uin, data, bit) {
		if (gmb._cache[uin]) {
			uin = uin + "";
			gmb._cache[uin] = _set(gmb._cache[uin], data, bit)
		}
	};

	function _get(sBitmap, bit, length) {
		var type = typeof bit,
			k, rslt = {}, _l;
		if (type == "object") {
			for (k in bit) rslt[k] = _getBit(sBitmap, bit[k]);
			return rslt
		}
		if (type == "number") {
			length = length || 1;
			rslt = "";
			for (k = bit, _l = bit + length; k < _l; k++) rslt = _getBit(sBitmap, k) + rslt;
			return parseInt(rslt, 2)
		}
		return INVALID_PARAM
	}
	function _set(sBitmap, data, bit) {
		var type = typeof data,
			k, sRslt;
		if (type == "object") {
			sRslt = sBitmap;
			for (k in data) sRslt =
					_setBit(sRslt, k - 0, !! data[k]);
			return sRslt
		}
		data = + !! data;
		return _setBit(sBitmap, bit, data)
	}
	function _getBit(sBitmap, bit) {
		return parseInt(sBitmap.charAt(15 - Math.floor((bit - 1) / 4)), 16) >> (bit - 1) % 4 & 1
	}
	function _setBit(sBitmap, bit, value) {
		value = value - 0;
		var pos = 15 - Math.floor((bit - 1) / 4),
			c = sBitmap.charAt(pos),
			n = parseInt(c, 16),
			idx = 3 - (bit - 1) % 4,
			added = (value ? [8, 4, 2, 1] : [7, 11, 13, 14])[idx];
		n = (value ? n | added : n & added).toString(16);
		return sBitmap.slice(0, pos) + n + sBitmap.slice(pos + 1)
	}
})(QZONE.FrontPage);
(function(qfp) {
	function leftPad(_r, len) {
		if (len && len > 1) {
			_r = _r.toString(2);
			_r = (new Array(len - _r.length + 1)).join("0") + _r
		}
		return _r
	}
	qfp.getBitMapFlag = function(bit, len) {
		var _r = qfp.getUserBitmap(bit, len);
		_r = leftPad(_r, len);
		return _r
	};
	qfp.getLoginUserBitMap = function(callback, bit, len) {
		var _r = qfp.getLoginBitmap(bit, len);
		_r = leftPad(_r, len);
		if (typeof callback == "function") setTimeout(function() {
				callback(window.g_LoginBitmap, _r)
			}, 0);
		else return window.g_LoginBitmap ? _r : 0
	};
	qfp.getSecondaryBitMapFlag = function(callback,
		bit, len, uin) {
		uin = (uin || g_iUin) + "";
		qfp.getMinorBitmap(uin, function(o, _r) {
			_r = leftPad(_r, len);
			callback(o, _r)
		}, bit, len)
	};
	qfp.setSecondaryBitMapFlag = function(i, bV, uin) {
		qfp.setMinorBitmap(uin || g_iUin, bV, i)
	};
	qfp.setBitMapFlag = function(i, bV, bitmapSrc) {
		qfp.setUserBitmap(bV, i)
	}
})(QZONE.FrontPage);
QZFL.object.each({
	isZoneOpened: [1],
	isCheckingZone: [2],
	isInvalidZone: [3],
	isBrandZone: [5],
	isEverLogoff: [6],
	isFamousZone: [7],
	isNetbarTalent: [8],
	getVisitPermit: [9, 3],
	getReplyPermit: [12, 3],
	isHaveBlackList: [15],
	isJoinFiveAnniversary: [16],
	isUserVIPExpress: [17],
	getUserVIPLevel: [18, 4],
	isCustomICModules: [23],
	isSuperSimpleMode: [24],
	isCityTalent: [25],
	isAccountProtected: [26],
	isVipUser: [27],
	getVipStatus: [27],
	isOpenHotTips: [28],
	isSuperVIP: [29],
	isClubMember: [30],
	isWebQQAutoLoad: [31],
	isWorldExpoVolunteer: [32],
	isFashionIC: [43],
	getCrediteLevel: [44, 3],
	isSimpleMode: [47],
	isEnterIC: [48],
	isWhiteCollar: [49],
	isHighWhiteCollar: [50],
	isCustomMenu: [51],
	isInteractZone: [52],
	isHaveBGMusic: [53],
	isIncubationUser: [54],
	isFriendSNSUser: [55],
	isPotentialFriendSNSUser: [56],
	isAlphaWhiteListUser: [57],
	isAlphaUser: [58]
}, function(p, n) {
	QZONE.FrontPage[n] = function(isLoginUser) {
		return QZONE.FrontPage[isLoginUser ? "getLoginBitmap" : "getUserBitmap"].apply(null, p)
	}
});
QZONE.FrontPage.sendPV = function(domain, path) {
	if (!domain) return;
	if (typeof pgvMainV5 == "function") {
		function _s() {
			pgvMainV5(domain, "/" + path)
		}
		setTimeout(_s, 50)
	}
};
QZONE.appPlatform = function(w) {
	var isQzone = QZONE.FrontPage && QZONE.FrontPage.getBitMapFlag(1),
		g_BD = w.g_Base_Domain || "base.qzone.qq.com",
		g_RD = w.g_R_Domain || "r.qzone.qq.com",
		g_WD = w.g_W_Domain || "w.qzone.qq.com",
		g_IMGD = w.imgcacheDomain || "qzs.qq.com",
		urlPrefix = "http://" + g_BD + "/cgi-bin/qzapp/",
		urlPrefix_W = "http://" + g_WD + "/cgi-bin/qzapp/",
		urlPrefix_R = "http://appsupport.qq.com/cgi-bin/appstage/",
		cgiSuffix = isQzone ? "" : "_izone",
		urls = {
			u: urlPrefix + "userapp_getuserapp.cgi",
			a: urlPrefix + "appinfo_all_list.cgi",
			i: "http://appsupport.qq.com/cgi-bin/qzapps/userapp_addapp.cgi",
			o: urlPrefix_R + "userapp_getopeninfo.cgi",
			f: "http://appsupport.qq.com/cgi-bin/qzapps/is_fixapp"
		}, _iaic = false,
		allDataBase = {}, userDataBase = {}, canvasUrlPool = {}, lastUAList = null,
		lastAAList = null,
		appListView = null,
		openKeyList = {}, hasRefreshed = false,
		surlRE = /http\:\/\/imgcache.qq.com\//i;

	function resolveAid(aid) {
		return isNaN(parseInt(aid, 10)) ? aid : "_" + aid
	}
	function getGeoInfo(cb) {
		QZONE.FrontPage && QZONE.FrontPage.getWeather(function(o) {
			if (o && o.uin) cb({
					countryid: o.country,
					provinceid: o.province,
					cityid: o.city
				});
			else cb(null)
		})
	}

	function getDataSeed() {
		return QZFL.widget.seed.get("_appDataSeed", getDataSeed._opt)
	}
	getDataSeed._opt = {
		"useCookie": 1,
		"domain": "qzone.qq.com"
	};

	function refreshDataSeed() {
		return QZFL.widget.seed.update("_appDataSeed", getDataSeed._opt)
	}
	function setAppInfo(aid, value, userInstalled) {
		var _aname = value.app_name.toLowerCase();
		oAppIdMap[_aname] = parseInt(aid, 10);
		aid = "_" + aid;
		allDataBase[aid] = allDataBase[_aname] = value;
		if (typeof value.app_canvasurl != "undefined") canvasUrlPool[aid] = canvasUrlPool[_aname] = value.app_canvasurl;
		if (userInstalled) userDataBase[aid] = userDataBase[_aname] = value
	}
	function showAppErrorTip(k, type) {
		if (!w.ownermode) return;
		var msgList = ["\u7531\u4e8e\u60a8\u5f53\u524d\u7f51\u7edc\u4e0d\u7a33\u5b9a\uff0c\u5bfc\u81f4QQ\u7a7a\u95f4\u5e94\u7528\u5217\u8868", "\u7531\u4e8e\u5e94\u7528\u5217\u8868\u6b63\u5728\u7ef4\u62a4\uff0c\u5c06\u6682\u65f6\u51fa\u73b0\u5e94\u7528\u5217\u8868"],
			s = '<span style="color:red;"> \u5c0a\u656c\u7684\u7528\u6237\uff1a__msg__\u663e\u793a\u4e0d\u5168\u3001\u65e0\u6cd5\u6dfb\u52a0\u3001\u7f16\u8f91\u7b49\u73b0\u8c61\uff0c\u8bf7\u60a8\u7a0d\u5019\u518d\u5c1d\u8bd5\u6253\u5f00\u7a7a\u95f4\u3002</span>',
			msg = s.replace("__msg__", msgList[type]);
		if (type == 0) QZFL.enviroment.set("deaultAppList", true);
		if (!showAppErrorTip.shown) if (k == "u") {
				QZONE.space.showTips(msg);
				showAppErrorTip.shown = true;
				setTimeout(function() {
					if (window.QOM && QOM.AppList && QOM.AppList.popupDIYAppList) {
						QOM.AppList.popupDIYAppList = QZFL.emptyFn;
						QOM.AppList.disableEdit && QOM.AppList.disableEdit()
					}
					QZONE.appPlatform.installApp = QZFL.emptyFn
				}, 3E3)
			}
	}
	function getter(u, k, ps, cb, eb, cbn) {
		ps.sd = getDataSeed();
		ps.isalpha = (QZONE.FrontPage && QZONE.FrontPage.getBitMapFlag(58)) ==
			1 ? 1 : 0;
		var t = new QZFL.JSONGetter(u, k, ps, "utf-8");
		var e_b, succ_cb = function(od, av) {
				if (!od || od.code != 0 && od.code != 1) {
					TCISD.valueStat(400180, 2, 13);
					e_b && e_b()
				} else {
					if (od.code == 1) {
						TCISD.valueStat(400180, 2, 12);
						showAppErrorTip(k, 1)
					}
					od.code == 0 && TCISD.valueStat(400180, 1, 15, {
						reportRate: 1E3
					});
					getter.solve(od, av, k);
					cb.apply(t, arguments)
				}
			};
		if (k == "u") {
			var _w = window;
			if (!hasRefreshed) if (_w.OFPLite && _w.g_Data && !_w.g_Data.applist) TCISD.valueStat(400184, 2, 11);
				else
			if (_w.g_Data && _w.g_Data.applist) {
				succ_cb(_w.g_Data.applist[0],
					_w.g_Data.applist[1]);
				return
			}
			ps.ic = 1
		} else if (k != "a") delete ps.uin;
		if (typeof cb == "function") {
			e_b = function() {
				var s = new QZFL.JSONGetter("http://" + g_IMGD + "/qzone/v6/app/errorback/" + (k + ".js"), "app_err", null, "utf-8");
				s.onSuccess = function(od) {
					TCISD.valueStat(400180, 2, 16, {
						reportRate: 1E3
					});
					getter.solve(od, null, k);
					cb(od)
				};
				s.onError = function() {};
				s.send(cbn);
				showAppErrorTip(k, 0)
			};
			t.addOnSuccess(succ_cb);
			t.addOnError(function() {
				e_b()
			});
			if (k == "u") t.onTimeout = function() {
					t.clear(t);
					e_b()
			}
		}
		t.send(cbn)
	}
	getter.solve = function(od, av, kn) {
		var isU = kn == "u",
			data, tmp = [];
		isU ? data = od.data.topapp.concat(od.data.commapp).concat(od.data.defaultapp) : data = od.data.items;
		var recommend_apps = od.data.recommendapp_kp || [];
		for (var i = 0; i < recommend_apps.length; i++) recommend_apps[i].isRecommendApp = 1;
		for (var id, o, i = 0, len = data.length; i < len; ++i) {
			o = data[i];
			o && !o.recommend && (id = o.app_id) && o.app_name && setAppInfo(id, o, isU) && tmp.push(o)
		}
		if (isU) {
			lastUAList = od.data;
			lastUAList.recommendapp = [];
			var tmp2 = [];
			for (var i = 0; i < lastUAList.commapp.length; i++) lastUAList.commapp[i].recommend ?
					lastUAList.recommendapp.push(lastUAList.commapp[i]) : tmp2.push(lastUAList.commapp[i]);
			lastUAList.commapp = tmp2;
			if (recommend_apps && recommend_apps.length) {
				var max_comm_length = 24 - recommend_apps.length - od.data.topapp.length,
					max_last_length = 24 - recommend_apps.length;
				if (lastUAList.lastPlayApp.length > max_last_length) lastUAList.lastPlayApp = lastUAList.lastPlayApp.slice(0, max_last_length).concat(recommend_apps).concat(lastUAList.lastPlayApp.slice(max_last_length));
				else if (lastUAList.lastPlayApp.length >= 10) lastUAList.lastPlayApp =
						lastUAList.lastPlayApp.concat(recommend_apps);
				lastUAList.recommend_length = recommend_apps.length;
				if (max_comm_length > 0 && od.data.commapp.length + od.data.topapp.length >= 10) if (lastUAList.commapp.length > max_comm_length) lastUAList.commapp = lastUAList.commapp.slice(0, max_comm_length).concat(recommend_apps).concat(lastUAList.commapp.slice(max_comm_length));
					else lastUAList.commapp = lastUAList.commapp.concat(recommend_apps)
			}
		} else if (kn == "a") lastAAList = tmp;
		if (av && av.dftorder == 0) appListView = av
	};

	function getFixedUrl(appid,
		cb, eb) {
		var t = new QZFL.JSONGetter(urls["f"], "getFixedUrl_" + appid, {
			uin: g_iUin,
			appid: appid,
			pf: "qzone"
		}, "utf-8"),
			ecb = function(o) {
				typeof eb == "function" && eb(o)
			};
		t.addOnSuccess(function(o) {
			if (o && o.ret == 0) {
				onAddNewApp("QZ_ADD_NEW_APP", o.data);
				typeof cb == "function" && cb(o.data)
			} else ecb(o)
		});
		t.addOnError(ecb);
		t.send("_Callback")
	}
	var appInfoKeys = ["app_id", "fix_state", "fix_time", "app_name", "app_setupflag", "app_iconurl", "app_alias", "app_canvasurl", "app_comm", "app_size", "app_tag", "app_stat", "app_jumpflag"];

	function packageAppInfo(preApp,
		newApp) {
		var i, j, k, v, o = {};
		for (i = 0, l = appInfoKeys.length; i < l; i++) {
			k = appInfoKeys[i];
			v = k == "fix_state" || k == "fix_time" ? newApp[k] || preApp && preApp[k] || 0 : newApp[k];
			o[k] = v
		}
		return o
	}
	function onAddNewApp(evt, o) {
		var t, ao, i, l, id;
		if (lastUAList && (t = lastUAList.commapp)) {
			ao = packageAppInfo((l = t.length) > 0 ? t[0] : null, o);
			if (ao.app_id) {
				for (i = 0; i < l; i++) if (ao.app_id == t[i].app_id) break;
				if (i == l) {
					(id = ao.app_id) && ao.app_name && setAppInfo(id, ao, true);
					if (lastUAList.recommendapp) for (var i = 0, j = lastUAList.recommendapp.length; i < j; i++) if (id ==
								lastUAList.recommendapp[i].app_id) {
								lastUAList.recommendapp.splice(i, 1);
								break
							}
					if (lastUAList.lastPlayApp) for (var i = 0, j = lastUAList.lastPlayApp.length; i < j; i++) if (id == lastUAList.lastPlayApp[i].app_id && lastUAList.lastPlayApp[i].recommend) {
								lastUAList.lastPlayApp[i].recommend = 0;
								break
							}
					if (ao.fix_state != 2) {
						t.unshift(ao);
						setTimeout(function() {
							QZONE.qzEvent && QZONE.qzEvent.dispatch("QZ_AFTER_ADD_NEW_APP")
						}, 0);
						refreshDataSeed()
					}
				}
			}
		} else;
	}
	function onTopAppOK(evt, o) {
		if (o && o.commapp && o.topapp) if (lastUAList) {
				lastUAList.commapp =
					o.commapp.slice();
				lastUAList.topapp = o.topapp.slice();
				setTimeout(function() {
					QZONE.qzEvent && QZONE.qzEvent.dispatch("QZ_AFTER_TOP_APP_OK")
				}, 0);
				refreshDataSeed()
			}
	}
	function getal(callback, ecb, sw) {
		sw = sw || "u";
		if (sw == "u" ? lastUAList : lastAAList) setTimeout(function() {
				var o;
				o = sw == "u" ? {
					code: 0,
					data: lastUAList
				} : {
					code: 0,
					items: lastAAList
				};
				callback(o, appListView)
			}, 0);
		else getter(urls[sw], sw, {
				uin: g_iUin,
				type: 4,
				fupdate: 1
			}, function(o) {
				if (typeof callback == "function") callback.apply(null, arguments)
			}, function(o) {
				if (typeof ecb ==
					"function") ecb.apply(null, arguments)
			}, "_Callback")
	}
	function findAppInfo(aid, aname, callback) {
		var t = allDataBase["_" + aid] || allDataBase[aname],
			as = arg2arr(arguments, 3);
		if (t) {
			if (typeof callback == "function") setTimeout(function() {
					_faiCallback(as, t, callback)
				}, 0);
			return t
		} else {
			if (typeof callback == "function") getal(function() {
					_faiCallback(as, allDataBase["_" + aid] || allDataBase[aname], callback)
				}, null, "a");
			return null
		}
	}
	function _faiCallback(as, d, c) {
		as.unshift(d);
		try {
			c.apply(null, as)
		} catch (e) {}
	}
	function appimg_dir(appid) {
		var imgpath,
			appid = appid.toString();
		if (appid.length < 8) appid = QZFL.string.fillLength(appid, 8);
		else appid = appid.slice(-8);
		return appid.substr(0, 2) + "/" + appid.substr(2, 2) + "/" + appid.substr(4, 2) + "/" + appid.substr(6, 4)
	}
	function gih(icurl, aid, resl) {
		if (typeof resl != "number") resl = 16;
		if (resl == 32) {
			if (!icurl && !aid) return '<img src="http://' + siDomain + '/ac/qzone_v5/client/app_default.png" />';
			return "<img" + (icurl == "tmp" || !icurl ? ' src="/ac/b.gif" class="appicon_' + resl + "_" + aid + '"' : /^https?\:\/\//i.test(icurl) ? ' src="' + (resl == 16 ? icurl :
				icurl.replace(/\.(gif|png|jpg|jpeg)$/i, resl + ".$1")).replace(surlRE, "http://" + siDomain + "/") + '"' : ' src="/ac/b.gif" class="' + icurl + '"') + " />"
		}
		return ['<img src="http://', window.g_SPrefix ? window.g_SPrefix : "", "i.gtimg.cn", "/open/app_icon/", appimg_dir(aid), "/", aid, "_", resl, '.png" />'].join("")
	}
	function sip(aid, type, params) {
		QZONE.FrontPage.popupDialog("\u6dfb\u52a0\u5e94\u7528", {
			src: "/qzone/v5/app/setup/one.htm?type=" + (type ? type : "") + "&aid=" + aid + (params ? params.replace(/^\?/, "&") : "")
		}, 560, 395)
	}
	function sip4p(aid,
		type, params, from) {
		try {
			setTimeout(function() {
				sip(aid, type, params)
			}, 50);
			QZONE.mailBox.closeMailDialog(from || 1)
		} catch (ex) {}
	}
	function sd4p(appid, from) {
		try {
			setTimeout(function() {
				if (typeof appid == "string" && appid.index("http:") > -1) location.href = appid;
				else QZONE.FrontPage.toApp("/myhome/" + appid)
			}, 50);
			QZONE.mailBox.closeMailDialog(from || 1)
		} catch (ex) {}
	}
	function ifAppInstalled(aid, callback) {
		var t = resolveAid(aid);
		if (typeof callback == "function") {
			var cb = function(o) {
				callback( !! userDataBase[t])
			};
			getal(cb)
		}
		return lastUAList ? !! userDataBase[t] : void 0
	}
	function insertAppIconCSS() {
		if (!_iaic) {
			QZFL.css.insertCSSLink("http://" + siDomain + "/qzone_v5/app/app_icon.css");
			_iaic = true
		}
	}
	function getUIAL() {
		var o = {};
		for (var k in userDataBase) o[k.replace(getUIAL.re, "")] = userDataBase[k];
		return o
	}
	getUIAL.re = /^_/;

	function installApp(aid, cb, eb, ob) {
		function callback(o) {
			if (!o) appAct(aid, cb, eb, ob, "i");
			else appAct(aid, cb, eb, ob, "i", o)
		}
		getGeoInfo(callback)
	}
	function appAct(aid, callback, errorback, timeoutback, type, geoinfo) {
		var data = {
			uin: g_iUin,
			appid: aid,
			via: "QZ.ONEHTM.v6"
		}, fs = new QZFL.FormSender(urls[type], "post", data),
			k;
		if (geoinfo) for (k in geoinfo) data[k] = geoinfo[k];
		fs.onSuccess = function(o) {
			clearDirty();
			callback(o, aid)
		};
		if (errorback) fs.onError = errorback;
		if (timeoutback) fs.onTimeout = timeoutback;
		fs.send()
	}
	function clearDirty() {
		hasRefreshed = true;
		refreshDataSeed()
	}
	var oAppCanvasUrl = {
		owneritems: "/qzone/mall/v5/web/myitem/host_scenario_item.htm",
		yellowgrade: "/qzone/mall/v5/web/vip/yellowgrade_v5.htm",
		act: "/qzone/biz/act/act.htm",
		notice: "/qzone/biz/comm/web/brand/noticejump.html",
		more: "/qzone/v5/app/applist.htm",
		applist: "/qzone/v5/app/applist.htm",
		betaapp: "/qzone/v5/app/beta/index.htm",
		appdev: "/qzone/v5/app/dev/index.htm",
		appsetup: "http://appstore.qzone.qq.com/cgi-bin/comm/appstore_home_v3",
		appassistant: "http://appstore.qzone.qq.com/cgi-bin/comm/appstore_home_v3?params=assistant&adtag=home",
		appmng: "/qzone/v5/app/config/mng.htm",
		appfeeds: "http://" + g_RD + "/cgi-bin/feeds/get_appfeeds",
		netbar: "/ACT/free/netbar/app_netbar.htm",
		cityhero: "/city_v1/static/appqzone/index.html",
		xiaoyou: "http://qzone.xiaoyou.qq.com/qzone.api.php?mod=qzoneapi",
		potentialfriends: "/qzone/app/potential_friends/potential_friends.html",
		friendfeeds: "/qzone/v5/owner2/friendfeeds/friend_feeds.html",
		qzonesoso: "/qzone/v6/qzonesoso/index.html",
		appstoresoso: "http://appstore.qzone.qq.com/cgi-bin/comm/appstore_search_info_v3",
		spacesoso: "/qzone/v5/interactSpace/pageapp_search.html",
		qzscore: "http://" + imgcacheDomain + "/qzone/app/points/index.html",
		fans: "/qzone/biz/act/fanslist.html",
		_mall: "http://" + g_IMGD + "/qzone/mall/v7/index.html",
		tasks: "/qzone/v6/task_system/alltasks.html",
		216: "http://z.t.qq.com/mb/qzone/index.html",
		217: "http://pageapp.qzone.qq.com/cgi-bin/pageapp_liked.cgi",
		902: "/qzone/app/qun/portal.html",
		1: "/qzone/profile/profile.html?qz_width=760",
		2: "/qzone/newblog/blogcanvas.html",
		4: "/qzone/client/photo/pages/photocanvas.html",
		311: "/qzone/app/mood_v6/html/index.html",
		847: "/qzone/app/video/videocanvas.html",
		305: "/music/qzone/musiccanvas.html",
		202: "/qzone/app/qzshare/index.html",
		334: "/qzone/msgboard/msgbcanvas.html",
		details: "http://appstore.qzone.qq.com/cgi-bin/qzapps/qz_appstore_app_lite_v3.cgi",
		usermsg: "http://mail.qq.com/cgi-bin/login?target=maillist&vt=passport&folderid=9&f=xhtml&from=qzone&sfrom=qzone",
		sysmsg: "http://msgopt.mail.qq.com/cgi-bin/smslist_sale?f=xhtml&t=qzone_smslist&from=qzone&pagesize=20",
		postmsg: "http://mail.qq.com/cgi-bin/login?target=writesms&vt=passport&f=xhtml&from=qzone&sfrom=qzone",
		appdefault: "http://appsupport.qq.com/cgi-bin/qzapps/unite_user_enter_app.cgi",
		"activity": "/qzone/v6/activity/christmas/index.html",
		"events": "/qzone/v6/activity/canvas.html",
		"profile": "/qzone/v6/profile/profile.html?qz_width=760",
		3: "/qzone/newfriend/friendcanvas.html",
		310: "/music/qzone/musiccanvas.html?qz_width=760",
		333: "/qzone/gift/guest_list.html",
		337: "/city_v1/static/appqzone/jump.html?qz_width=760",
		710: "http://tshop.qq.com/qzone_index.xhtml",
		"onekeydressup": "/qzone/mall/v8/html/onekeydressup.htm",
		guangjie: "http://appstore.qzone.qq.com/cgi-bin/comm/appstore_home_v3?params=guangjie",
		"snake": "/qzone/v6/activity/2013.html",
		"pointmall": "/qzone/pointmall/v1/index.html",
		"board": "/qzone/app/board/dist/index.htm",
		"findfriend": "/qzone/v6/friend_manage/find_friends.html",
		"vipmallact": "/qzone/mall/v8/module/act/index.html"
	};
	oAppCanvasUrl.blog = oAppCanvasUrl.bloglist = oAppCanvasUrl["2"];
	oAppCanvasUrl.photo = oAppCanvasUrl["4"];
	oAppCanvasUrl.taotao = oAppCanvasUrl["311"];
	oAppCanvasUrl.music = oAppCanvasUrl["305"];
	oAppCanvasUrl.share = oAppCanvasUrl["202"];
	oAppCanvasUrl.weibo = oAppCanvasUrl["216"];
	oAppCanvasUrl.qzvideo = oAppCanvasUrl["847"];
	oAppCanvasUrl.mall = oAppCanvasUrl._mall;
	oAppCanvasUrl.groupzone = oAppCanvasUrl["902"];
	oAppCanvasUrl.friendvistor = oAppCanvasUrl["3"];
	oAppCanvasUrl.mcollection =
		oAppCanvasUrl["310"];
	oAppCanvasUrl.gift = oAppCanvasUrl["333"];
	oAppCanvasUrl.cityman = oAppCanvasUrl["337"];
	oAppCanvasUrl.tshop = oAppCanvasUrl["710"];
	QZONE.space && (QZONE.space.setCanvasUrl = function(kname, url) {
		oAppCanvasUrl[kname] = (url.indexOf("://") < 0 ? "http://" : "") + url.replace(/^imgcache\.qq\.com/, g_IMGD)
	});
	var oAppIdMap = {
		owneritems: -100,
		yellowgrade: -101,
		act: -102,
		notice: -103,
		more: -104,
		applist: -105,
		betaapp: -106,
		appdev: -107,
		appsetup: -108,
		appmng: -109,
		appfeeds: -110,
		netbar: -111,
		cityhero: -112,
		xiaoyou: -113,
		weibo: 216,
		potentialfriends: -114,
		friendfeeds: -115,
		qzonesoso: -116,
		fans: -117,
		_mall: -118,
		tasks: -119,
		recentvisitor: -120,
		appvideo: -121,
		groupzone: -122,
		snake: -124,
		vipmallact: -124,
		onekeydressup: -125,
		board: -126
	};
	var oAlias = {
		home: "minihome",
		showworld: "minihome",
		blog: "bloglist",
		interact: "friendvistor",
		friends: "friendvistor",
		msgboard: "msg",
		mood: "taotao",
		driftbottle: "gift",
		infocenter: "myhome",
		music: "musicbox",
		mall: "_mall",
		appstore: "appsetup",
		n3: "yellowgrade"
	};
	var oShort = {
		admin: "profile/admin",
		tipssetting: "profile/tipssetting",
		mail: "profile/mail",
		qqtx: "profile/qqtx",
		appvideo: "appsetup/video",
		vphoto: "photo/vphoto",
		uploadphoto: "photo/upload",
		addnewblog: "bloglist/add"
	};

	function getShortName(s) {
		return oShort[s]
	}
	function getAppId(app) {
		var appid = parseInt(app, 10);
		appid = isNaN(appid) ? oAppIdMap[oAlias[app] || app] || -99 : appid;
		return appid
	}
	var extendWidthApp = {
		372: 1
	};

	function adjustAppCanvasUrl(appid, url) {
		return url
	}
	function getAppCanvasUrl(app, callback, ecb) {
		app = oAlias[app] || app;
		var t = oAppCanvasUrl[app];
		t = t ? t.slice(0, 4) == "http" ? t : "http://" +
			g_IMGD + t : resolveCanvasUrl(canvasUrlPool[resolveAid(app)]);
		if (!t) if (typeof callback == "function") getal(function() {
					var tmp = resolveCanvasUrl(canvasUrlPool[resolveAid(app)]),
						appid = getAppId(app);
					if (tmp) callback(adjustAppCanvasUrl(appid, tmp), appid, app);
					else getFixedUrl(app, function(o) {
							if (o) callback(adjustAppCanvasUrl(o.app_id, resolveCanvasUrl(o.app_canvasurl)), o.app_id, app)
						}, function(o) {
							var u;
							if (appid == -99) u = app && app.length && app.length > 1 ? [oAppCanvasUrl["details"], "?appid=0&appname=", app].join("") : "";
							else u =
									[oAppCanvasUrl["details"], "?appid=", appid].join("");
							callback(u, appid, app)
						})
				}, ecb, "u");
			else return null;
			else
		if (typeof callback == "function") {
			var appid = getAppId(app);
			callback(adjustAppCanvasUrl(appid, t), appid, app)
		} else return t
	}
	function isNarrowApp(appid) {
		if (!appid || appid == -99) return false;
		var t = findAppInfo(appid);
		if (t && t.app_jumpflag == 1) return false;
		return t && t.app_size && t.app_size == 780
	}
	function resolveCanvasUrl(u) {
		if (u) if (u.charAt(0) == "/") u = ["http://", g_IMGD, u].join("");
			else
		if (u.slice(0, 4).toLowerCase() !=
			"http") u = ["http://", u.indexOf("imgcache.qq.com") == 0 ? u.replace(/^imgcache\.qq\.com/, g_IMGD) : u].join("");
		return u
	}
	function setAppCanvasUrl(app, url) {
		var t = resolveAid(app);
		canvasUrlPool[t] = url;
		return true
	}
	var routeApps = [{
			app_id: 2,
			app_name: "bloglist",
			app_iconurl: "tmp",
			app_alias: "\u65e5\u5fd7"
		}, {
			app_id: 4,
			app_name: "photo",
			app_iconurl: "tmp",
			app_alias: "\u76f8\u518c"
		}, {
			app_id: 311,
			app_name: "taotao",
			app_iconurl: "tmp",
			app_alias: "\u8bf4\u8bf4"
		}, {
			app_id: 847,
			app_name: "qzvideo",
			app_iconurl: "tmp",
			app_alias: "\u89c6\u9891"
		}, {
			app_id: 202,
			app_name: "share",
			app_iconurl: "tmp",
			app_alias: "\u5206\u4eab"
		}, {
			app_id: 305,
			app_name: "musicbox",
			app_iconurl: "tmp",
			app_alias: "\u97f3\u4e50"
		}, {
			app_id: 334,
			app_name: "msg",
			app_iconurl: "tmp",
			app_alias: "\u7559\u8a00\u677f"
		}, {
			app_id: 1,
			app_name: "profile",
			app_iconurl: "tmp",
			app_alias: "\u4e2a\u4eba\u6863"
		}
	];
	(function() {
		for (var i = 0, l = routeApps.length; i < l; i++) oAppIdMap[routeApps[i].app_name] = routeApps[i].app_id;
		var p;
		if (p = QZONE.qzEvent) {
			p.register("QZ_ADD_NEW_APP");
			p.addEventListener("QZ_ADD_NEW_APP",
				onAddNewApp);
			p.register("QZ_AFTER_ADD_NEW_APP");
			p.register("QZ_TOP_APP_OK");
			p.addEventListener("QZ_TOP_APP_OK", onTopAppOK)
		}
	})();

	function getRouteApps(callback) {
		typeof callback == "function" && callback(routeApps);
		return routeApps
	}
	function isRouteApp(app) {
		oAlias[app] && (app = oAlias[app]);
		if (app == 334 || app == 1 || app == -118 || app == -100 || app == -104) return app;
		for (var i = 0, l = routeApps.length, o; i < l; i++) {
			o = routeApps[i];
			if (o.app_id == app || o.app_name == app) return o.app_id
		}
		return 0
	}
	function getOpenId(callback, errorback, opts) {
		var appid,
			sdata, t, openKeyData;
		if (opts != undefined) appid = opts.appid;
		openKeyData = retrieveOpenId(appid);
		if (!openKeyData) {
			data = {
				uin: g_iUin,
				s: Math.random(),
				g_tk: QZONE.FrontPage.getACSRFToken(),
				appid: appid
			};
			t = new QZFL.JSONGetter(urls.o, "getOpenId", data, "utf-8");
			t.addOnSuccess(function(op) {
				updateOpenId(op, appid);
				callback.call(t, op)
			});
			t.addOnError(errorback);
			t.send("_Callback")
		} else setTimeout(function() {
				callback(openKeyData)
			}, 0)
	}
	function retrieveOpenId(appId) {
		if (openKeyList[appId] != undefined) return openKeyList[appId];
		return false
	}
	function updateOpenId(data, appid) {
		openKeyList[appid] = {
			openid: data.openid,
			openkey: data.openkey
		}
	}
	return {
		"ifAppInstalled": ifAppInstalled,
		"loadAppIconList": insertAppIconCSS,
		"getUserAppList": function(callback, ecb) {
			getal(callback, ecb, "u")
		},
		"getAllAppList": function(callback, ecb) {
			getal(callback, ecb, "a")
		},
		"getAppListView": function() {
			return appListView
		},
		"findAppInfo": findAppInfo,
		"getIconHtml": gih,
		"showInstallPanel": sip,
		"showInstallPanel4Paper": sip4p,
		"showDetail4Paper": sd4p,
		"getListUserInstalled": getUIAL,
		"installApp": function(aid, cb, eb, ob) {
			installApp(aid, cb, eb, ob)
		},
		"clearUserApp": clearDirty,
		"getAppCanvasUrl": getAppCanvasUrl,
		"setAppCanvasUrl": setAppCanvasUrl,
		"getOpenId": getOpenId,
		"getBaseApps": getRouteApps,
		"isBaseApp": isRouteApp,
		"isNarrowApp": isNarrowApp,
		"getAppId": getAppId,
		"getShortName": getShortName,
		"refreshDataSeed": refreshDataSeed
	}
}(window);
window.QZONE = window.QZONE || {};
QZONE.appNavEngine = function() {
	var _s = QZONE.appNavEngine;
	if (!_s.appContainer) {
		QZONE.qzEvent && (QZONE.qzEvent.register("QZ_JUMP_ENTER_BASE_APP"), QZONE.qzEvent.register("QZ_JUMP_ENTER_APP"), QZONE.qzEvent.register("QZ_JUMP_ENTER_DEFAULT"), QZONE.qzEvent.register("QZ_JUMP_LEAVE_DEFAULT"), QZONE.qzEvent.register("QZ_JUMP_CANVAS_PAGE_COMPLETE"));
		_s.registerAppFrameContainer(document.getElementById("app_container"));
		_s._3rdAppContainer = document.getElementById("page3rdApp")
	}
	return QZONE.appNavEngine
};
QZONE.appNavEngine.appFrameDefHeight = 1E3;
QZONE.appNavEngine.appFrameMinHeight = 500;
QZONE.appNavEngine.title = document.title;
QZONE.appNavEngine.appContainer = null;
QZONE.appNavEngine.appCanvasFrame = null;
QZONE.appNavEngine.qzoneFrameworkDomainNameRE = /(\d{5,10}|\w{2,})\.qzone\.qq\.com/i;
QZONE.appNavEngine.qzoneFamusBlogDomainNameRE = /^http:\/\/blog.qq.com\/qzone\/\d{5,10}\//i;
QZONE.appNavEngine.httpRE = /^http:\/\//i;
QZONE.appNavEngine.qqDomainNameRE = /\.qq\.com$/i;
QZONE.appNavEngine.cgiUrlCheckRE = /\/cgi_qzshare_urlcheck/i;
QZONE.appNavEngine.pathRE = /^\//;
QZONE.appNavEngine.registerAppFrameContainer = function(ele) {
	return ele && ele.tagName ? QZONE.appNavEngine.appContainer = ele : false
};
QZONE.appNavEngine.fixShortName = function(sn) {
	var tmp = QZONE.appPlatform.getShortName(sn);
	return tmp ? tmp.split("/") : null
};
QZONE.appNavEngine.getUrlInfo = function(surl) {
	var _s = QZONE.appNavEngine,
		objUri, t, sn, t0, uid, ar;
	surl = String(surl);
	ar = surl.split("?");
	surl = ar.length == 2 ? ar[1] == "" ? surl.replace(/\?$/, "") : surl : surl;
	ar = surl.split("#");
	surl = ar.length == 2 ? ar[1] == "" ? surl.replace(/#$/, "") : surl : surl;
	objUri = new URI(_s.httpRE.test(surl) ? surl : "http://user.qzone.qq.com/" + window.g_iUin + (_s.pathRE.test(surl) ? "" : "/") + surl);
	uid = objUri.host.replace(_s.qzoneFrameworkDomainNameRE, "$1");
	objUri.qzUseFrameName = (t = uid.toLowerCase()) == "user" ||
		t == "rc" || t == "new" || t == "test";
	objUri.qzCustomDomainName = uid == window.g_dns_name;
	objUri.qzNumberDomainName = uid - 0 > 1E4;
	objUri.qzUseCustomName = objUri.qzCustomDomainName || objUri.qzNumberDomainName;
	objUri.qzPathArray = (objUri.pathname.charAt(0) === "/" ? objUri.pathname.substring(1) : objUri.pathname).split("/");
	if (t == "rc") if (window.g_iLoginUin && window.g_iUin == window.g_iLoginUin) objUri.qzOuterJump = false;
		else objUri.qzOuterJump = true;
		else
	if (objUri.qzUseFrameName) {
		if (window.g_iUin != objUri.qzPathArray[0] && window.g_dns_name !=
			objUri.qzPathArray[0]) if (objUri.hash && objUri.hash.indexOf("passby=qzane") > -1) objUri.qzNoJump = true;
			else {
				objUri.href += (objUri.hash ? "&" : "#") + "passby=qzane";
				objUri.qzOuterJump = true
			}
	} else if (uid == objUri.host) if (location.href == objUri.href && _s.qzoneFamusBlogDomainNameRE.test(objUri.href)) objUri.qzOuterJump = false;
		else objUri.qzOuterJump = true;
	if (!objUri.qzOuterJump && !objUri.qzUseCustomName && t != "rc") objUri.qzPathArray.shift();
	if (sn = objUri.qzPathArray.length && objUri.qzPathArray[0].toLowerCase())(sn = QZONE.appNavEngine.fixShortName(sn)) &&
			(objUri.qzPathArray.shift(), objUri.qzPathArray = sn.concat(objUri.qzPathArray));
	if ((objUri.isCanvasTypeHome = objUri.qzPathArray.length && (t0 = (t = objUri.qzPathArray[0].toLowerCase()) == "myhome" || t == "infocenter")) || window.ownermode && QZONE.FrontPage && QZONE.FrontPage.getBitMapFlag(48) && t != "main") {
		objUri.qzOFPJump = true;
		if (t0) objUri.qzPathArray.shift()
	}
	if (objUri.qzPathArray.length == 1 && (t = objUri.qzPathArray[0].toLowerCase()) && t == "main") objUri.qzBackToDefault = true;
	else if (objUri.qzPathArray.length) {
		if (t = objUri.qzPathArray[0].toLowerCase()) objUri.qzAppIdentifier =
				t
	} else objUri.qzBackToDefault = true;
	return objUri
};
QZONE.appNavEngine.splitQzoneUrl = function(surl) {
	return QZONE.appNavEngine.getUrlInfo(surl).qzPathArray
};
QZONE.appNavEngine.isDirectIn = function() {
	var qzp = QZONE.appNavEngine.splitQzoneUrl(location.href);
	if (qzp && qzp.length > 0 && (t = qzp[0]) && (t == "myhome" || t == "infocenter" || t == "main")) qzp.shift();
	var hs = location.hash;
	hs = hs.indexOf("#!") == 0 ? hs.substring(2) != "" : false;
	return qzp && qzp.length > 0 && qzp[0] || hs
};
QZONE.appNavEngine.isAllowTheJump = function(cb, surl, opts) {
	var caid = QZONE.appNavEngine.getCurrentAppID(),
		leaveMall = true,
		t;
	if (opts && opts.noNeedMallConfirm) leaveMall = false;
	if (caid == -118) {
		t = QZONE.appNavEngine.splitQzoneUrl(surl);
		if (t && t.length > 0 && (t[0] == "main" || t[0] == "myhome")) t.shift();
		if (t && t.length > 0 && (t[0] == "mall" || t[0] == "_mall")) leaveMall = false;
		QZONE.shop && QZONE.shop.allowLeaveMall ? QZONE.shop.allowLeaveMall(cb, leaveMall) : cb && cb(true)
	} else cb && cb(true)
};
QZONE.appNavEngine.toApp = function(surl, opts) {
	function _cb(allow) {
		if (allow) QZONE.appNavEngine._toApp(surl);
		else return
	}
	QZONE.appNavEngine.isAllowTheJump(_cb, surl, opts)
};
QZONE.appNavEngine.plugin3rdAppSys = function(appinfo, objUri, showApp, disableApp) {
	var url = ["http://", siDomain, "/open/canvas/qzone/appCanvas_2.0.js"].join(""),
		entertime = QZONE.FrontPage.getSvrTime().getTime();
	QZFL.imports(url, function() {
		var dom;
		(dom = QZONE.appNavEngine.plugin3rdAppSys.divDom) || (dom = QZONE.appNavEngine.plugin3rdAppSys.divDom = $("page3rdApp"));
		QZONE.appCanvas && QZONE.appCanvas.toApp({
			container: dom,
			appIframe: QZONE.appNavEngine.appCanvasFrame,
			appInfo: appinfo,
			entertime: entertime,
			paras: objUri,
			showApp: showApp,
			disableApp: disableApp,
			setAppCanvasWidth: QZONE.Controller.setPositionWidth
		})
	})
};
QZONE.appNavEngine._toApp = function(surl) {
	QZONE.appNavEngine();
	QZONE.appNavEngine.pluginsDispatcher && (surl = QZONE.appNavEngine.pluginsDispatcher(surl));
	var _s = QZONE.appNavEngine,
		f, p, objUri = _s.getUrlInfo(surl),
		lastApp, lastAppid = 0;
	if (!objUri.qzNoJump) {
		if (objUri.qzOuterJump) _s.jumpOut(objUri.href);
		else {
			clearTimeout(_s._ajTimer);
			if (!ENV.get("urlHashLoaded")) {
				var hs = location.hash,
					t, bs = "";
				if ((t = hs.indexOf("#!")) == 0) {
					hs = hs.substring(2);
					t = QZFL.util.commonDictionarySplit(hs);
					if (t.app == objUri.qzAppIdentifier) bs =
							objUri.search;
					if (t.app) {
						objUri.qzAppIdentifier = t.app;
						objUri.qzBackToDefault = false
					}
					if (t.app == 2 || t.app == 4) {
						objUri.qzPathArray = [];
						objUri.hash = ""
					}
					objUri.search = bs + (bs ? "&" : "?") + "via=" + (t.via || "QZ.HashRefresh");
					objUri.hash = ""
				}
			}
			if (objUri.qzBackToDefault) _s.goDefaultPage(objUri);
			else {
				if (typeof window.g_SeoAppId != "undefined" && window.g_SeoAppId != "0") {
					_s.getCurrentAppID._currentAppID = window.g_SeoAppId;
					QZONE.qzEvent && QZONE.qzEvent.dispatch(QZONE.appPlatform && QZONE.appPlatform.isBaseApp(window.g_SeoAppId) ? "QZ_JUMP_ENTER_BASE_APP" :
						"QZ_JUMP_ENTER_APP", {
						appid: window.g_SeoAppId
					});
					_s.restoreTitle();
					return
				}
				if (!_s.createdAppFrame) {
					f = _s.prepareAppFrame();
					_s.createdAppFrame = true
				}
				_s.getJumpUrl(objUri, function(canvasUrl, aid, aname) {
					var throughAppStore = false,
						oInfo = QZONE.appPlatform.findAppInfo(aid, aname);
					if (oInfo && oInfo.app_jumpflag == 1 && !QZONE.appPlatform.isBaseApp(aid)) throughAppStore = true;
					var loadApp = function(u, aid, aname, f) {
						lastApp = _s.getCurrentAppID._lastFrameApp;
						lastAppid = _s.getCurrentAppID._currentAppID;
						_s.getCurrentAppID._lastFrameApp =
							_s.getCurrentAppID._currentAppID ? {
							appid: _s.getCurrentAppID._currentAppID,
							url: u
						} : _s.getCurrentAppID._lastFrameApp;
						_s.getCurrentAppID._currentAppID = aid;
						_s.getCurrentAppID._currentAppUrl = u;
						if (objUri) {
							objUri.appid = aid;
							objUri.throughAppStore = throughAppStore;
							objUri.lastAppid = lastAppid
						}
						QZONE.qzEvent && QZONE.qzEvent.dispatch(QZONE.appPlatform && QZONE.appPlatform.isBaseApp(aid) ? "QZ_JUMP_ENTER_BASE_APP" : "QZ_JUMP_ENTER_APP", objUri);
						if (lastAppid) QZONE.qzEvent && QZONE.qzEvent.dispatch(QZONE.appPlatform && QZONE.appPlatform.isBaseApp(lastAppid) ?
								"QZ_JUMP_LEAVE_BASE_APP" : "QZ_JUMP_LEAVE_APP", objUri);
						else QZONE.qzEvent && QZONE.qzEvent.dispatch("QZ_JUMP_LEAVE_DEFAULT", objUri); if (!ENV.get("urlHashLoaded")) {
							var t, ul, hs = QZFL.userAgent.firefox ? (t = location.href.split("#!")) && t[1] ? "#!" + t[1] : "" : location.hash;
							if ((t = hs.indexOf("#!")) == 0) {
								hs = hs.substring(2);
								t = QZFL.util.commonDictionarySplit(hs);
								var tt = t;
								_s.getCurrentAppID._currentAppID = t.app;
								if (t.url && (t = decodeURIComponent(t.url)) && t.indexOf("http://") == 0) {
									ul = new QZFL.util.URI(t);
									var len = ul.host.indexOf("?");
									len > -1 && (ul.host = ul.host.substr(0, len));
									len = ul.host.indexOf("#");
									len > -1 && (ul.host = ul.host.substr(0, len));
									if (ul && _s.qqDomainNameRE.test(ul.host)) if (!_s.cgiUrlCheckRE.test(t)) u = t
								} else {
									_s.getCurrentAppID._currentAppID = aid;
									if (tt.pos && (tt = decodeURIComponent(tt.pos))) u += "&pos=" + tt
								}
							}
							ENV.set("urlHashLoaded", 1)
						}
						if (objUri.search || objUri.hash || _s.checkBeforeEnter(lastApp, u)) {
							throughAppStore && QZONE.FrontPage.setFrameAround(_s.getCurrentAppID._currentAppID);
							_s.setFrameSrc(u, f, oInfo && oInfo.app_setupflag & 2048, _s.getCurrentAppID._currentAppID)
						}
						delay(_s.appFrameAjustHeight,
							500)
					}, makeUrl = function(f, _opss, params) {
							if (params && objUri) {
								if (params.search) if (objUri.search) objUri.search += params.search.replace("?", "&");
									else objUri.search = params.search;
								if (params.hash) if (objUri.hash) objUri.hash += params.hash.replace("#", "&");
									else objUri.hash = params.hash
							}
							QZONE.appNavEngine.makeJumpUrl(objUri, function(u, aid, aname) {
								loadApp(u, aid, aname, f)
							}, canvasUrl, aid, aname, oInfo && oInfo.app_setupflag & 2048 ? _opss : null, throughAppStore)
						}, getRightContainer = function() {
							var d = $("app_right_container");
							if (!d) {
								d =
									QZFL.dom.createElementIn("div", $("pageContent"), false, {
									"class": "col_main bg lbor2",
									"id": "app_right_container"
								});
								if (QZFL.userAgent.ie < 8) QZFL.dom.setStyle(d, "width", "786px")
							}
							return d
						};
					if (QZONE.appNavEngine.isSaveLeftMemu(aid)) {
						var _con = getRightContainer();
						_s.prepareAppFrame(_con, makeUrl)
					} else if (!throughAppStore) _s.prepareAppFrame(null, makeUrl);
					else _s.plugin3rdAppSys(oInfo, objUri, function(dom, openinfo, params) {
							_s.delDHashConfig(aid);
							_s.prepareAppFrame(dom, function(f) {
								makeUrl(f, openinfo, params)
							})
						}, function(dom,
							obj) {
							_s.setDHashConfig(aid, 0, 1);
							_s.getCurrentAppID._currentAppID = objUri.appid = aid;
							objUri.throughAppStore = throughAppStore;
							QZONE.qzEvent && QZONE.qzEvent.dispatch("QZ_JUMP_ENTER_APP", objUri);
							if (obj && obj.url) _s.prepareAppFrame(dom, function(f) {
									if (!ENV.get("urlHashLoaded")) ENV.set("urlHashLoaded", 1);
									QZONE.appNavEngine.setFrameSrc(obj.url, f)
								});
							else _s.clearFrameContainer()
						})
				})
			}
			QZFL.event.preventDefault()
		} if (objUri.appid) QZONE.appNavEngine.speedStat.setZero(new Date, objUri.appid)
	}
};
QZONE.appNavEngine.getCurrentAppID = function() {
	var aid = arguments.callee._currentAppID;
	if (aid == -108) {
		var u = QZONE.FrontPage.getParameter(arguments.callee._currentAppUrl, "params");
		if (u) aid = -121
	}
	return aid
};
QZONE.appNavEngine.getCurrentAppID._lastFrameApp = {
	appid: null,
	url: ""
};
QZONE.appNavEngine.getCurrentAppID._currentAppID = 0;
QZONE.appNavEngine.getCurrentAppID._currentAppUrl = "";
QZONE.appNavEngine.remainAppMap = {
	"-118": 1
};
QZONE.appNavEngine.clearFrameContainer = function() {
	var _s = QZONE.appNavEngine,
		l = _s.getCurrentAppID._lastFrameApp.appid,
		f;
	if (f = QZONE.appNavEngine.appCanvasFrame) {
		if (_s.remainAppMap[l]) return;
		_s.setFrameSrc("about:blank", f);
		f.removeAttribute("height")
	}
};
QZONE.appNavEngine.checkBeforeEnter = function(lastApp, u) {
	var _s = QZONE.appNavEngine,
		caid = _s.getCurrentAppID._currentAppID;
	if (_s.remainAppMap[lastApp.appid] && (caid == 0 || lastApp.appid == caid && u == lastApp.url)) return false;
	return true
};
QZONE.appNavEngine.isSaveLeftMemu = function() {
	var saveLeftMemu = {
		"-113": "OFP_LEFT_Society_Entry_PengYou",
		216: "OFP_LEFT_Society_Entry_Weibo",
		"-122": "OFP_LEFT_Society_Entry_GroupZone"
	};
	return function(aid) {
		if (window.g_Mode && (window.g_Mode == "ofp" || window.g_Mode == "ofp_dowson")) return saveLeftMemu[aid];
		return false
	}
}();
QZONE.appNavEngine.goDefaultPage = function(objUri) {
	var _s = QZONE.appNavEngine,
		f, lastAppid;
	lastAppid = _s.getCurrentAppID._currentAppID;
	_s.getCurrentAppID._lastFrameApp = _s.getCurrentAppID._currentAppID ? {
		appid: _s.getCurrentAppID._currentAppID,
		url: _s.getCurrentAppID._currentAppUrl
	} : _s.getCurrentAppID._lastFrameApp;
	_s.getCurrentAppID._currentAppID = 0;
	_s.getCurrentAppID._currentAppUrl = "";
	QZONE.qzEvent && QZONE.qzEvent.dispatch("QZ_JUMP_ENTER_DEFAULT", objUri);
	if (lastAppid) QZONE.qzEvent && QZONE.qzEvent.dispatch(QZONE.appPlatform &&
			QZONE.appPlatform.isBaseApp(lastAppid) ? "QZ_JUMP_LEAVE_BASE_APP" : "QZ_JUMP_LEAVE_APP", objUri);
	_s.clearFrameContainer();
	if (ENV.get("urlHashLoaded")) QZONE.appNavEngine.setHash(_s.makeHash(0), 0);
	_s.restoreTitle();
	delay(_s.restoreTitle, 5E3);
	delay(_s.restoreTitle, 1E4)
};
var notUseParsMap = {
	"postmsg": 1,
	"usermsg": 1,
	"appassistant": 1
};
QZONE.appNavEngine.fixUrlParas = function(u, aid, aname) {
	return notUseParsMap[aname] || notUseParsMap[aid]
};
QZONE.appNavEngine.setNotUseParsMap = function(app, flag) {
	if (app == -99) return;
	notUseParsMap[app] = flag
};
QZONE.appNavEngine.noUsingHashMap = {
	348: 1,
	"-118": 1
};
QZONE.appNavEngine.makeJumpUrl = function(objUri, callback, canvasUrl, aid, aname, opss, throughAppStore) {
	var t = new URI(canvasUrl),
		buff, st, f, ps, tmp;
	if (!canvasUrl || !t) QZONE.appNavEngine.goDefaultPage(objUri);
	else {
		st = !QZONE.appNavEngine.noUsingHashMap[aid] && /\.html?$/i.test(t.pathname);
		f = t.host.indexOf(t.search) >= 0 ? t.host.replace(t.search, "") : t.host;
		buff = [];
		buff.push(t.protocol, t.protocol.indexOf(":") > -1 ? "//" : "://", f, t.pathname);
		if (st) {
			if (t.hash) buff.push(t.hash, "&");
			else buff.push("#"); if (t.search) {
				buff.push(t.search.replace("?",
					""));
				buff.push("&")
			}
		} else if (t.search) buff.push(t.search, "&");
		else buff.push("?");
		ps = objUri.qzPathArray.slice();
		if (ps[0]) {
			tmp = ps[0].toLowerCase();
			if (tmp == objUri.qzAppIdentifier || QZONE.appPlatform.getAppId(tmp) == objUri.qzAppIdentifier) ps.shift()
		}
		if (!QZONE.appNavEngine.fixUrlParas("", aid, aname)) if (!opss) buff.push("uin=", window.g_iUin, "&pfid=2", "&qz_ver=", 6, "&appcanvas=", throughAppStore ? 1 : 0, "&qz_style=", window.g_StyleID, "&params=", ps.join(), "&entertime=", (new Date).getTime(), "&canvastype=", objUri.isCanvasTypeHome ?
					"home" : "");
			else buff.push("openid=", opss.openid || "", "&openkey=", opss.openkey || "", "&pf=", opss.pf || "", "&pfkey=", opss.pfkey || "", "&qz_ver=", 6, "&appcanvas=", throughAppStore ? 1 : 0, "&params=", ps.join());
			else;
		if (st) {
			objUri.search && buff.push(objUri.search.replace("?", "&"));
			objUri.hash && buff.push(objUri.hash.replace("#", "&"))
		} else {
			objUri.search && buff.push(objUri.search.replace("?", "&"));
			if (t.hash) {
				buff.push(t.hash);
				objUri.hash && buff.push(objUri.hash.replace("#", "&"))
			} else objUri.hash && buff.push(objUri.hash)
		}
		callback(!opss ?
			buff.join("") : QZONE.appNavEngine.parameterMonster(buff.join("")), aid, aname)
	}
};
QZONE.appNavEngine.eatingParaEx = /[&#?](detail|uin)=[^&#]*/ig;
QZONE.appNavEngine.parameterMonster = function(u) {
	return u.replace(QZONE.appNavEngine.eatingParaEx, "")
};
QZONE.appNavEngine.getJumpUrl = function(objUri, callback) {
	if (!objUri.qzAppIdentifier) QZONE.appNavEngine.goDefaultPage(objUri);
	else QZONE.appPlatform.getAppCanvasUrl(objUri.qzAppIdentifier, function(canvasUrl, aid, aname) {
			callback(canvasUrl, aid, aname)
		})
};
QZONE.appNavEngine.redirectUrl = ["http://", imgcacheDomain, "/qzone/v6/app/app_redirect.html"].join("");
QZONE.appNavEngine.rcDomainEx = /^http:\/\/rc.qzone.qq.com/i;
QZONE.appNavEngine.setFrameSrc = function(surl, frm, is3rdApp, appid) {
	var _s = QZONE.appNavEngine;
	if (window.g_hasSetFrameSrc && g_hasSetFrameSrc["app" + appid]) {
		g_hasSetFrameSrc["app" + appid] = false;
		return
	}
	if ( !! is3rdApp && !_s.rcDomainEx.test(location.href)) {
		window._qz_curentAppCanvasUrl = surl;
		surl = QZONE.appNavEngine.redirectUrl
	}
	if (frm = frm || QZONE.appNavEngine.appCanvasFrame) {
		QZONE.FrontPage.initSpeedStat && QZONE.FrontPage.initSpeedStat(appid);
		window.ua && ua.firefox ? setTimeout(function() {
			frm.src = surl
		}, 50) : frm.src = surl
	}
	setTimeout(function() {
		frm &&
			frm.contentWindow && frm.contentWindow.focus()
	}, 500)
};
QZONE.appNavEngine.jumpOut = function(surl) {
	window.open(surl)
};
QZONE.appNavEngine.appFrameLoadListener = function(evt) {
	var fr = this;
	if (fr.readyState) {
		if (fr.readyState == "complete") {
			QZONE.appNavEngine.appFrameScan(evt);
			QZONE.appNavEngine.speedStat.setPageReady(new Date)
		}
	} else QZONE.appNavEngine.appFrameScan(evt)
};
QZONE.appNavEngine.appFrameAjustHeight = function() {
	var _s = QZONE.appNavEngine,
		fw, h, src, appDoc, host, isPengyou;
	try {
		fw = _s.appCanvasFrame.contentWindow;
		appDoc = fw.document;
		h = _s.getAppCanvasViewHeight(appDoc)
	} catch (err) {
		src = _s.appCanvasFrame.src.toLowerCase();
		if (src == _s.redirectUrl) {
			src = window._qz_curentAppCanvasUrl || src;
			src = src.toLowerCase()
		}
		h = parseInt(QZONE.FrontPage.getParameter(src, "qz_height"));
		isPengyou = document.domain == "pengyou.com";
		host = src.split("/", 3).pop().slice(isPengyou ? -12 : -7);
		if (src.slice(0,
			4) != "http" || host == (isPengyou ? ".pengyou.com" : ".qq.com")) {
			if (QZONE.FrontPage.getParameter(_s.appCanvasFrame.src, "params") == "guangjie") return false;
			_s._ajTimer = delay(_s.appFrameAjustHeight, 1E3)
		} else {
			h = h || 2500;
			_s.setAppFrameHeight(h)
		}
		return
	}
	_s.setAppFrameHeight(h);
	_s._ajTimer = delay(_s.appFrameAjustHeight, 1E3)
};
QZONE.appNavEngine.UrlHashConfig = {
	"0": {
		noid: 1,
		nourl: 1
	},
	2: {
		noid: 0,
		nourl: 1
	},
	4: {
		noid: 0,
		nourl: 1
	},
	305: {
		noid: 0,
		nourl: 1
	},
	847: {
		noid: 0,
		nourl: 1
	},
	appstore: {
		noid: 0,
		nourl: 1
	},
	board: {
		noid: 0,
		nourl: 1
	}
};
QZONE.appNavEngine.DynamicUrlHashConfig = {};
QZONE.appNavEngine.setDHashConfig = function(aid, noid, nourl) {
	QZONE.appNavEngine.DynamicUrlHashConfig[aid] = {
		noid: noid || 0,
		nourl: nourl || 0
	}
};
QZONE.appNavEngine.delDHashConfig = function(aid) {
	var p = QZONE.appNavEngine.DynamicUrlHashConfig;
	if (p[aid]) delete p[aid]
};
QZONE.appNavEngine.makeHash = function(aid, url) {
	var _s = QZONE.appNavEngine,
		c = _s.UrlHashConfig[aid] || _s.DynamicUrlHashConfig[aid],
		hs, surl = url || _s.getCurrentAppID._currentAppUrl;
	if (url) {
		var info = QZONE.appPlatform.findAppInfo(aid);
		if (info && info.app_setupflag & 2048) url = ""
	}
	if (c) hs = c.noid ? c.nourl ? "home" : "url=" + encodeURIComponent(url) : c.nourl ? ["!app=", aid, "&via=", QZONE.FrontPage.getParameter(surl, "via") || "QZ.HashRefresh"].join("") : ["!app=", aid, "&url=", encodeURIComponent(url)].join("");
	else if (!url || url == "about:blank") hs =
			["!app=", aid, "&via=", QZONE.FrontPage.getParameter(surl, "via") || "QZ.HashRefresh"].join("");
	else hs = "!app=" + aid + "&url=" + encodeURIComponent(url);
	return hs
};
QZONE.appNavEngine.appTitle = {};
QZONE.appNavEngine.setAppTitle = function(title) {
	var _s = QZONE.appNavEngine,
		aid = _s.getCurrentAppID();
	_s.appTitle[aid] = title;
	document.title = title || _s.title
};
QZONE.appNavEngine.appHash = {};
QZONE.appNavEngine.appendAppHash = function(appid, paras) {
	var _s = QZONE.appNavEngine,
		aid = _s.getCurrentAppID(),
		hs;
	if (aid == appid) {
		_s.appHash[aid] = "&pos=" + encodeURIComponent(paras);
		setTimeout(function() {
			var _s = QZONE.appNavEngine,
				hs = _s.makeHash(_s.getCurrentAppID());
			if (hs) {
				hs += _s.appHash[aid];
				_s.setHash(hs)
			}
		}, 0)
	}
};
QZONE.appNavEngine.getAppHash = function(appid) {
	var _s = QZONE.appNavEngine,
		aid = _s.getCurrentAppID(),
		hs;
	if (aid == appid) return aid > 0 ? _s.appHash[aid] : "";
	return ""
};
QZONE.appNavEngine.setHash = function(hs, aid) {
	aid > 0 && (hs += QZONE.appNavEngine.getAppHash(aid) || "");
	hs != location.hash && (location.hash = hs)
};
QZONE.appNavEngine.mustAppendHashWithAlias = {
	"a-108": "appstore",
	"a-121": "appvideo",
	"a-126": "board"
};
QZONE.appNavEngine.appFrameScan = function(evt) {
	var _s = QZONE.appNavEngine,
		fw, h, tgt, url, appDoc, href;
	try {
		fw = _s.appCanvasFrame.contentWindow;
		appDoc = fw.document;
		href = fw.location.href
	} catch (err) {
		setTimeout(function() {
			var aid = QZONE.appNavEngine.getCurrentAppID(),
				hs = QZONE.appNavEngine.makeHash(aid);
			if (aid > 0 && hs != location.hash) {
				QZONE.appNavEngine.setHash(hs, aid);
				QZONE.appNavEngine.restoreTitle()
			}
		}, 50);
		return
	}
	setTimeout(function() {
		var _s = QZONE.appNavEngine,
			aid = _s.getCurrentAppID(),
			hs;
		try {
			hs = _s.makeHash(_s.mustAppendHashWithAlias["a" +
				aid] || aid, href)
		} catch (ign) {}
		if ((aid > 0 || _s.mustAppendHashWithAlias["a" + aid]) && hs != location.hash) {
			_s.setHash(hs, aid);
			_s.restoreTitle()
		}
	}, 50)
};
QZONE.appNavEngine.restoreTitle = function() {
	var _s = QZONE.appNavEngine,
		_f = QZONE.appPlatform.findAppInfo,
		aid = _s.getCurrentAppID();
	if (ua && ua.ie) {
		clearTimeout(_s.restoreTitle.handler);
		_s.restoreTitle.handler = setTimeout(function() {
			QZONE.appNavEngine.restoreTitle()
		}, 1E3)
	}
	if (QZONE.appPlatform.isBaseApp(aid) != 0) document.title = _s.title;
	else document.title = _f(aid) && _f(aid).app_alias || _s.title
};
QZONE.appNavEngine.getCurrentAppWindow = function(ifIframeOnly) {
	var _s = QZONE.appNavEngine;
	try {
		return ifIframeOnly ? _s.appCanvasFrame || null : _s.appCanvasFrame && _s.appCanvasFrame.contentWindow
	} catch (err) {
		return null
	}
};
QZONE.appNavEngine.getAppCanvasViewHeight = function(adoc) {
	var _doc = adoc || QZONE.appNavEngine.appCanvasFrame.contentWindow.document,
		_docEl = _doc.documentElement,
		_bdy = _doc.body;
	return !ua.ie ? Math.min(_docEl.scrollHeight, _bdy.scrollHeight) : _bdy.scrollHeight
};
QZONE.appNavEngine.setAppFrameHeight = function(h) {
	var _s = QZONE.appNavEngine,
		ch = parseInt(_s.appCanvasFrame.height);
	if (Math.abs(h - ch) > 10) _s.appCanvasFrame.height = Math.max(h + 1, _s.appFrameMinHeight)
};
QZONE.appNavEngine.prepareAppFrame = function(iframeContainer, cb) {
	var _s = QZONE.appNavEngine,
		dv, df, f = $e("iframe.app_canvas_frame").eq(0);
	if (!f) {
		df = document.createDocumentFragment();
		dv = document.createElement("div");
		df.appendChild(dv);
		dv.innerHTML = '<iframe class="app_canvas_frame" scrolling="no" allowtransparency="yes" frameborder="no" width="100%"></iframe>';
		f = dv.firstChild;
		QZFL.event.addEvent(f, typeof f.readyState != "undefined" ? "readystatechange" : "load", _s.appFrameLoadListener)
	}
	var _doAsyCB = typeof cb ==
		"function";
	var container = iframeContainer || _s.appContainer;
	if (!$e("iframe.app_canvas_frame", container).eq(0)) {
		if (window.ua && ua.ie && ua.ie == 9) {
			_s.setFrameSrc("about:blank", f);
			if (_doAsyCB) {
				delay(function() {
					container.appendChild(f);
					f.height = _s.appFrameDefHeight;
					_s.appCanvasFrame = f;
					cb(f)
				}, 100);
				return
			}
		}
		container.appendChild(f)
	}
	f.height = _s.appFrameDefHeight;
	_s.appCanvasFrame = f;
	typeof cb == "function" && cb(f);
	return f
};
QZONE.open = function(surl) {
	var c = document.createElement("form");
	c.action = surl;
	c.method = "get";
	c.target = "_blank";
	c.style.cssText = "width:0;height:0;";
	document.body.appendChild(c);
	c.submit();
	setTimeout(function() {
		QZFL.dom.removeElement(c)
	}, 500)
};
QZONE.appNavEngine.speedStat = {
	flagArr: [],
	timeStatObj: null,
	isTurnOn: 0,
	currentAppid: 0,
	hasSetHeightFix: 0,
	hasSetReady: 0,
	timerID: null,
	appMap: {
		"a0": 15,
		"a2": 21,
		"a305": 23,
		"a4": 25,
		"a311": 27,
		"a1": 29,
		"a202": 31,
		"a334": 33,
		"a-118": 35
	},
	setup: function(flag1, flag2, flag3) {
		var p = QZONE.appNavEngine.speedStat;
		p.flagArr = [flag1, flag2, flag3];
		p.timeStatObj = TCISD.createTimeStat("appNavEngine", p.flagArr)
	},
	setZero: function(date, appid) {
		var p = QZONE.appNavEngine.speedStat;
		if (!p.timeStatObj) return;
		p.isTurnOn = 1;
		p.currentAppid = appid;
		p.timeStatObj.timeStamps = [];
		p.hasSetHeightFix = 0;
		p.hasSetReady = 0;
		p.timeStatObj.setZero(date);
		p.mark(11, new Date)
	},
	setHeightFix: function(date) {
		var p = QZONE.appNavEngine.speedStat;
		if (!p.isTurnOn) return;
		if (p.hasSetHeightFix) return;
		p.hasSetHeightFix = 1;
		p.mark(15, new Date);
		p.mark(p.appMap["a" + p.currentAppid], new Date);
		clearTimeout(p.timerID);
		p.timerID = setTimeout(function() {
			p.setPageReady(new Date);
			p.report()
		}, 8E3)
	},
	setPageReady: function(date) {
		var p = QZONE.appNavEngine.speedStat;
		if (!p.isTurnOn) return;
		if (p.hasSetReady) return;
		p.hasSetReady = 1;
		p.mark(18, new Date);
		p.mark(p.appMap["a" + p.currentAppid] + 1, new Date)
	},
	mark: function(index, date) {
		var p = QZONE.appNavEngine.speedStat;
		if (!p.isTurnOn) return;
		p.timeStatObj.mark(index, date)
	},
	report: function() {
		var p = QZONE.appNavEngine.speedStat;
		if (Math.random() < 0.05 || g_isAlpha_iUin) {
			p.timeStatObj.report();
			p.isTurnOn = 0
		}
	}
};
setTimeout(function() {
	QZONE.appNavEngine.speedStat.setup(175, 363, 3)
}, 1E3);
QZONE.il = {
	1: "\u7a7a\u95f4\u8bbe\u7f6e",
	2: "\u9000\u51fa\u5c06\u4e0d\u4f1a\u4fdd\u5b58\u60a8\u521a\u624d\u5bf9\u7a7a\u95f4\u7684\u8bbe\u7f6e\u3002\u662f\u5426\u786e\u8ba4\u9000\u51fa\uff1f",
	3: "\u8be5\u64cd\u4f5c\u4f1a\u5c06\u60a8\u7684\u7a7a\u95f4\u6062\u590d\u81f3\u521d\u59cb\u8bbe\u7f6e\uff0c\u786e\u8ba4\u64cd\u4f5c\u5417\uff1f",
	4: "\u5207\u6362\u81ea\u7531\u5e03\u5c40\u5c06\u6062\u590d\u5230\u7cfb\u7edf\u9ed8\u8ba4\u7684\u6a21\u5757\u65b9\u6848\u3002\u5982\u60a8\u5f53\u524d\u6709\u4e2a\u6027\u5316\u6a21\u5757\uff0c\u53ef\u4ee5\u5207\u6362\u5e03\u5c40\u540e\u518d\u5230\u201c\u6a21\u5757\u201d\u5185\u52fe\u9009\u5c55\u793a\u5230\u9996\u9875\u3002\u786e\u8ba4\u5207\u6362\u5417\uff1f",
	5: "\u5207\u6362\u5206\u680f\u5e03\u5c40\u5c06\u6062\u590d\u5230\u7cfb\u7edf\u9ed8\u8ba4\u7684\u6a21\u5757\u65b9\u6848\u3002\u5982\u60a8\u5f53\u524d\u6709\u4e2a\u6027\u5316\u6a21\u5757\uff0c\u53ef\u4ee5\u5207\u6362\u5e03\u5c40\u540e\u518d\u5230\u201c\u6a21\u5757\u201d\u5185\u52fe\u9009\u5c55\u793a\u5230\u9996\u9875\u3002\u786e\u8ba4\u5207\u6362\u5417\uff1f",
	6: "\u6570\u636e\u52a0\u8f7d\u4e2d",
	7: "\u670d\u52a1\u5668\u5fd9,\u8bf7\u7a0d\u5019\u518d\u8bd5.",
	8: "\u4e00\u952e\u6392\u7248\u4f1a\u66f4\u6539\u60a8\u5f53\u524d\u7684\u5e03\u5c40,\u662f\u5426\u7ee7\u7eed?",
	9: "\u6b63\u5728\u4e3a\u60a8\u51c6\u5907\u5e03\u5c40,\u8bf7\u7a0d\u5019",
	10: "\u8be5\u76ae\u80a4\u53ea\u80fd\u5728\u5c0f\u7a9d\u4e0b\u4f7f\u7528\u3002",
	11: "\u5207\u6362\u5230__mode__\u6a21\u5f0f\u5c06\u4f1a\u8fd8\u539f\u9ed8\u8ba4\u7684\u5e03\u5c40\u65b9\u6848\uff0c\u786e\u8ba4\u5207\u6362\u5417\uff1f",
	12: "\u5c0f\u7a9d\u4e0b\u53ea\u6709\u4e00\u79cd\u81ea\u7531\u5e03\u5c40\u65b9\u6848\uff0c\u786e\u8ba4\u5207\u6362\u5417\uff1f",
	modeName: {
		"0": "\u5c0f\u7a9d",
		1: "\u5168\u5c4f",
		3: "\u5bbd\u5c4f"
	},
	menu1: ["\u79fb\u52a8\u5230\u9876\u5c42",
			"\u79fb\u52a8\u5230\u4e0a\u4e00\u5c42", "\u79fb\u52a8\u5230\u4e0b\u4e00\u5c42", "\u79fb\u52a8\u5230\u5e95\u5c42", "\u79fb\u9664\u6302\u4ef6", "\u79fb\u9664\u6a21\u5757", "\u5207\u6362\u5bfc\u822a\u7eb5/\u6a2a\u5411\u98ce\u683c", "\u8fd8\u539f\u81f3\u521d\u59cb\u5bfc\u822a\u8bbe\u7f6e", "\u7f16\u8f91", "\u8fd8\u539f\u9ed8\u8ba4\u4f4d\u7f6e", '\u7f16\u8f91\u5bfc\u822a<span style="color:red;font-size:10px;">new</span>', "\u9690\u85cf"
	],
	menu2: ["\u8bbe\u7f6e", "\u79fb\u9664"],
	menu3: ["\u5c0f\u5c3a\u5bf8(150x300)",
			"\u4e2d\u5c3a\u5bf8(180x360)", "\u5927\u5c3a\u5bf8(230x460)"
	],
	dragTitle: {
		"0": "\u6309\u4f4f\u9f20\u6807\uff0c\u53ef\u968f\u610f\u62d6\u52a8",
		1: "\u8bbe\u7f6e\u6a21\u5757\u7684\u663e\u793a\u6a21\u5f0f\uff0c\u6216\u79fb\u9664\u6a21\u5757"
	},
	itemName: {
		1: "\u80cc\u666f\u76ae\u80a4",
		2: "\u6302\u4ef6",
		3: "banner",
		4: "\u9f20\u6807\u65b9\u6848",
		5: "\u6f02\u6d6e\u7269",
		6: "\u64ad\u653e\u56681.0",
		7: "\u4e2a\u6027\u82b1\u85e4",
		8: "\u4e2a\u6027\u6807\u5fd7",
		9: "\u5927\u5934\u8d34",
		11: "\u5927\u5934\u8d34",
		12: "\u516c\u544a\u680f",
		13: "\u5bfc\u822a\u680f",
		14: "\u6b22\u8fceFlash",
		15: "\u6f02\u6d41\u74f6",
		16: "Flash \u6302\u4ef6",
		17: "\u82b1\u8fb9",
		18: "\u64ad\u653e\u56682.0",
		19: "\u6807\u9898\u680f",
		20: "\u9ec4\u94bb\u5b9d\u8d1d",
		22: "\u9b54\u6cd5\u79c0",
		23: "\u82b1\u85e4",
		49: "QCC\u76ae\u80a4"
	},
	customModule: {
		ADD_OK: "\u6dfb\u52a0\u81ea\u5b9a\u4e49\u6a21\u5757\u6210\u529f",
		ADD_ERR: "\u6dfb\u52a0\u81ea\u5b9a\u4e49\u6a21\u5757\u5931\u8d25",
		EDIT_OK: "\u7f16\u8f91\u81ea\u5b9a\u4e49\u6a21\u5757\u6210\u529f",
		EDIT_ERR: "\u7f16\u8f91\u81ea\u5b9a\u4e49\u6a21\u5757\u5931\u8d25",
		NO_ENT: "\u60a8\u8fd8\u6ca1\u6709\u4efb\u4f55\u56fe\u6587\u9879",
		DEL_OK: "\u5220\u9664\u81ea\u5b9a\u4e49\u6a21\u5757\u6210\u529f",
		DEL_NTC1: "\u60a8\u8981\u5220\u9664\u7684\u81ea\u5b9a\u4e49\u6a21\u5757\u5df2\u7ecf\u88c5\u626e\u5728\u9996\u9875\n\u60a8\u771f\u7684\u8981\u5220\u9664\u5417?",
		DEL_NTC2: "\u60a8\u771f\u7684\u8981\u5220\u9664\u8be5\u81ea\u5b9a\u4e49\u6a21\u5757\u5417?",
		NO_ITEM: '<div style="padding-Top:74px;padding-left:143px;font-size:14px;">\u60a8\u8fd8\u6ca1\u6709\u9009\u8d2d\u7269\u54c1\u54e6,\u5feb\u53bb\u5546\u57ce\u770b\u770b\u5427! <a href="#" onclick="QZONE.customMode.loadModule(\'mall\');return false">\u901b\u901b\u5546\u57ce</a></div>'
	},
	commonError: {
		CON_ERR: "\u4e0e\u670d\u52a1\u5668\u7684\u7f51\u7edc\u901a\u4fe1\u51fa\u73b0\u95ee\u9898",
		SYNTEX_ERR: "\u7531\u4e8e\u60a8\u4f7f\u7528\u4e86\u4e0d\u89c4\u8303\u7684\u6807\u7b7e,\u81ea\u5b9a\u4e49\u6a21\u5757\u65e0\u6cd5\u6dfb\u52a0",
		MF_NOTICE: "\u8fd1\u671f\u591a\u540d\u7528\u6237\u4e3e\u62a5\u60a8\u7684\u7a7a\u95f4\u6709\u8fdd\u89c4\u64cd\u4f5c, \u5efa\u8bae1\u5c0f\u65f6\u540e\u518d\u5c1d\u8bd5"
	},
	toolbar: {
		LOGOUT_NTC: "\u60a8\u786e\u5b9a\u9000\u51fa\u4e48?"
	},
	customMenu: {
		SAVE_OK: "\u4fdd\u5b58\u6210\u529f",
		SAVE_FAIL: "\u6570\u636e\u4fdd\u5b58\u5931\u8d25",
		TIPS_NO_CUSTOM_TITLE: "\u6b22\u8fce\u4f53\u9a8c\u5168\u65b0\u7684\u81ea\u5b9a\u4e49\u5bfc\u822a",
		TIPS_NO_CUSTOM: "\u4eb2\u7231\u7684\u7528\u6237\uff0c\u60a8\u5f53\u524d\u7684\u5bfc\u822a\u680f\u8fd8\u4e0d\u652f\u6301\u81ea\u5b9a\u4e49\u7f16\u8f91\uff0c\u5feb\u5230\u5546\u57ce\u9009\u62e9\u65b0\u7684\u5bfc\u822a\u680f\u5427\uff01",
		NO_SUPPORT: "\u5c0f\u7a9d\u6a21\u5f0f\u4e0d\u652f\u6301\u7f16\u8f91\u9ed8\u8ba4\u5bfc\u822a\uff0c\u60a8\u53ef\u4ee5\u5207\u6362\u5230\u5bbd\u7248\u6216\u5168\u5c4f\u6a21\u5f0f\u7f16\u8f91\u3002",
		TITLE: "\u7f16\u8f91\u5bfc\u822a",
		TIPS_NO_VIP: '<p>\u53ea\u6709\u9ec4\u94bb\u7528\u6237\u624d\u80fd\u7f16\u8f91\u5bfc\u822a\u83dc\u5355\uff0c\u60a8\u8fd8\u4e0d\u662f\u9ec4\u94bb\uff0c<a target="_blank" href="http://paycenter.qq.com/home?aid=zone.navi">\u7acb\u5373\u53bb\u5f00\u901a\u9ec4\u94bb>></a></p>',
		TOO_MUCH_NUM: "\u4f60\u53ea\u80fd\u9009\u62e99\u4e2a\u4ee5\u5185\u7684\u680f\u76ee",
		OLNY_WORD: "\u540d\u79f0\u53ea\u80fd\u8f93\u5165\u6587\u5b57\u548c\u6570\u5b57",
		NO_NULLL: "\u540d\u79f0\u4e0d\u80fd\u4e3a\u7a7a",
		SAVING: "\u6b63\u5728\u5411\u670d\u52a1\u5668\u63d0\u4ea4\u8bf7\u6c42..."
	}
};

function checkLogin() {
	var g = QZFL.cookie.get,
		u, uin;
	uin = g_iLoginUin > 1E4 ? g_iLoginUin : (u = g("uin").replace(checkLogin.r, "") - 0) && g("skey") && u > 1E4 && u || 0;
	!uin && clearSession();
	return uin
}
checkLogin.r = /\D/g;

function clearSession() {
	QZFL.object.each(["zzpaneluin", "zzpanelkey", "uin", "skey"], function(ck) {
		QZFL.cookie.del(ck)
	})
}
function updateLoginView(tb, cl) {
	(tb = QZONE.toolbar) && (cl = tb.checkLogin) && cl()
}

function delay(fn, delayTime) {
	var arr = Array.prototype.slice.call(arguments),
		isNum = typeof delayTime == "number";
	delayTime = isNum ? delayTime : 0;
	arr.splice(0, isNum ? 2 : 1);
	return setTimeout(function() {
		typeof fn == "function" && fn.apply(null, arr)
	}, delayTime)
}
function isOwnerMode() {
	return g_iUin == checkLogin()
}
QZONE.space.getL2Window = QZONE.FrontPage.getCurrentAppWindow = QZONE.appNavEngine.getCurrentAppWindow;
QZONE.FrontPage.importDressupAction = function(cb) {
	if (!QZONE.preview) QZFL.imports(["http://", siDomain, "/qzone/v6/promotion/preview/previewer.js"].join(""));
	if (QZONE.shop && QZONE.shop.DressupModel) typeof cb == "function" && cb();
	else if (!QZONE.shop || !QZONE.shop.initDressUp) QZFL.imports("http://" + siDomain + "/c/=" + g_V.view, function() {
			QZONE.shop.initDressUp();
			QZFL.imports(["http://" + siDomain + "/qzone/v6/nshop/action.js"], function() {
				typeof cb == "function" && cb()
			})
		});
	else QZFL.imports(["http://" + siDomain + "/qzone/v6/nshop/action.js"], function() {
			typeof cb == "function" && cb()
		})
};
QZONE.FrontPage.toApp = function() {
	if (QZONE.OFP && QZONE.OFP.newbieSearch && QZONE.OFP.newbieSearch.show == 1) QZONE.OFP.newbieSearch.hidePanel();
	var args = arguments,
		url = (args && args.length && args[0]) + "",
		uri, ar;
	uri = QZONE.appNavEngine.getUrlInfo(url);
	ar = uri.qzPathArray;
	if (g_Mode == "gfp_timeline") {
		var para = ["http://user.qzone.qq.com/", g_iUin, "/", ar.join("/")];
		uri.search && para.push(uri.search);
		uri.hash && para.push(uri.hash);
		return location.href = para.join("")
	}
	if (url.indexOf("custom") > -1) {
		if (ar && ar.length && ar[0] == "main") ar.shift();
		if (ar && ar.length && ar[0] == "custom") {
			ar.shift();
			url = ar.join("/");
			if (ownermode) QZONE.FrontPage.importDressupAction(function() {
					QZONE.FrontPage.toCustom(url)
				});
			return
		}
	} else if (url.indexOf("mall") > -1 || url.indexOf("_mall") > -1) {
		if (ar && ar.length && ar[0] == "main") ar.shift();
		if (ar && ar.length && (ar[0] == "mall" || ar[0] == "_mall")) {
			if (ownermode && !QZONE.FrontPage.getLoginBitmap(1)) {
				QZFL.dialog.create("\u63d0\u793a", "<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\u5f00\u901aQQ\u7a7a\u95f4\u624d\u80fd\u4f53\u9a8c\u88c5\u626e\u529f\u80fd", {
					width: 250,
					height: 50,
					showMask: true,
					buttonConfig: [{
							text: "\u53d6\u6d88",
							tips: "\u53d6\u6d88",
							type: QZFL.dialog.BUTTON_TYPE.Cancel,
							clickFn: function() {}
						}, {
							text: "\u7acb\u5373\u5f00\u901a",
							tips: "\u7acb\u5373\u5f00\u901a",
							type: QZFL.dialog.BUTTON_TYPE.Confirm,
							clickFn: function() {
								location.href = "http://dynamic.qzone.qq.com/cgi-bin/portal/cgi_select_activity"
							}
						}
					]
				});
				return
			}
			if (g_isOFP != "0") {
				var para = ["http://user.qzone.qq.com/", g_iUin, "/main/mall"];
				uri.search && para.push(uri.search);
				uri.hash && para.push(uri.hash);
				return location.href =
					para.join("")
			}
			url = ar.join("/") + (uri.search || uri.hash || "");
			if (ownermode) QZONE.FrontPage.importDressupAction(function() {
					if (QZONE.custom && QZONE.custom.isDressMode && QZONE.custom.isDressMode());
					else QZONE.FrontPage.toCustom("mall", true);
					QZONE.appNavEngine.toApp(url)
				});
			return
		}
	} else if (url.indexOf("305") > -1) {
		if (ar && ar.length && ar[0] == "main") ar.shift();
		if (ar && ar.length && (ar[0] == "305" || ar[0] == "305")) {
			QZONE.FrontPage.importDressupAction(function() {
				QZONE.appNavEngine.toApp(url)
			});
			return
		}
	}
	QZONE.appNavEngine.toApp.apply(QZONE.appNavEngine,
		args)
};
QZONE.space.toApp = QZONE.FrontPage.toApp;
QZONE.space.showTips = function(html, icon, opts) {
	QZFL.css.insertCSSLink("http://" + (window.imgcacheDomain || "imgcache.qq.com") + "/qzone_v6/gb_hintbar.css ");
	var _s = QZONE.space.showTips,
		n;
	if (typeof opts == "undefined" || typeof opts == "boolean" && opts) opts = {
			autoHide: 3E4
	};
	opts = opts || {};
	opts.fullClose = opts.fullClose || true;
	opts.tween = opts.tween || false;
	if (typeof opts.autoHide != "number") opts.autoHide = opts.autoHide ? 3E4 : 0;
	html = opts.customInnerHTML || html;
	for (var k in _s._data) if (_s._data[k] == html) return;
	html = '<div class="gb_hintbar"><div class="inner"><i class="ui_ico ui_hint_warn"></i><div class="hintbar_txt">' +
		html + '</div></div><a title="\u70b9\u51fb\u9000\u51fa" class="text_close" href="javascript:;" onclick="QZONE.space.hideTips();return false;">\u00d7</a></div>';
	QZONE.FrontPage.showTopTips(html, 60, opts.tween);
	opts.autoHide && setTimeout(function() {
		QZONE.space.hideTips()
	}, Math.max(opts.autoHide, 1E3))
};
QZONE.space.hideTips = function(evt) {
	QZONE.FrontPage.hideTopTips()
};
QZONE.space.killTips = function(n) {};
QZONE.space.getCurrApp = QZONE.FrontPage.getCurrApp = function() {
	return [QZONE.appNavEngine.getCurrentAppID()]
};
QZONE.FrontPage.pathSplit = function(url) {
	return QZONE.appNavEngine.splitQzoneUrl(url)
};

function loadMusicAll(callback) {
	QZFL.imports("http://" + siDomain + "/music/qzone/music_qzone.js", function() {
		ENV.set("musicAllLoaded", true);
		if (QZFL.lang.isFunction(callback)) callback()
	}, "utf-8")
}
QZONE.FrontPage.loadMusicAll = function(callback) {
	loadMusicAll(callback)
};
var Browser = {
	isMozilla: !! ua.firefox,
	isIE: !! ua.ie,
	isIE7: ua.ie >= 7,
	isFirefox: !! ua.firefox,
	isSafari: !! ua.safari,
	isOpera: !! ua.opera
}, g_XDoc = {};
QZONE.FrontPage.setPageAnchor = function(spath) {
	return QZONE.space.setPageAnchor(spath)
};
(function(qfp) {
	qfp.toCustom = function(tabName, nojump) {
		if (!nojump) if (window["g_isOFP"] == "0" && ownermode) QZONE.FrontPage.toApp("/main");
			else {
				window.location.href = ["http://user.qzone.qq.com/", g_iLoginUin, "/main/custom", typeof tabName == "undefined" ? "" : "/" + tabName].join("");
				return
			}
		QZFL.imports("http://" + siDomain + "/qzone/v6/custom/custom.js?max_age=2592002", function() {
			QZONE.FrontPage.hideTopTips();
			QZONE.custom && QZONE.custom.bootstrap(tabName, nojump);
			QZONE.qzEvent && QZONE.qzEvent.dispatch("QZ_CUSTOMIZE_ENTER")
		},
			"utf-8")
	}
})(QZONE.FrontPage);
QZONE.FrontPage.checkLogin = checkLogin;
(function(qfp) {
	var bfn = QZFL.emptyFn,
		regexTmp = /\[(img|flash|video|audio)\].*?\[\/\1\]|\[\/?(?:b|url|img|flash|video|audio|ftc|ffg|fts|ft|email|center|u|i|marque|m|r|quote)[^\]]*\]/ig,
		regexEm = /\[em\]e(\d{1,6})\[\/em\]/ig,
		regexQS = /\[qqshow(,\d*){4},?([^\]]*)\][^\[]*\[\/qqshow\]/ig;
	qfp.removeUBB = function(s) {
		regexTmp.lastIndex = regexEm.lastIndex = regexQS.lastIndex = 0;
		return s.replace(regexTmp, "").replace(regexEm, function(a, b) {
			var emId = b;
			if (b >= 300 && b <= 700 && QZONE.FrontPage.checkIsDeepColor()) emId += "_b";
			return '<img src="http://' +
				siDomain + "/qzone/em/ve" + emId + '.gif">'
		}).replace(regexQS, "\u3010QQ\u79c0\u6ce1\u6ce1\u3011$2")
	};
	qfp.getMode = function() {
		return g_fullMode
	};
	var w = window;
	w.removeUBB = qfp.removeUBB
})(QZONE.FrontPage);
QZONE.FrontPage.saveDressUp = function() {
	var args = arguments;
	QZFL.imports(["http://", siDomain, "/qzone/v6/custom/dressup.js?max_age=2592004"].join(""), function() {
		QZONE.dressUp.save.apply(QZONE.dressUp, args)
	})
};
QZONE.FrontPage.save7DDressUp = function() {
	var args = arguments;
	QZFL.imports(["http://", siDomain, "/qzone/v6/custom/dressup.js?max_age=2592004"].join(""), function() {
		QZONE.dressUp.save7DDressup.apply(QZONE.dressUp, args)
	})
};
QZONE.FrontPage.cancelDressUp = function() {
	var args = arguments;
	QZFL.imports(["http://", siDomain, "/qzone/v6/custom/dressup.js?max_age=2592004"].join(""), function() {
		QZONE.dressUp.cancel.apply(QZONE.dressUp, args)
	})
};
QZONE.FrontPage.previewDressUp = function(iteminfo, opt) {
	if (!QZONE.preview) return;
	var args = arguments;
	var d = {};
	var t, fix4scene = {};
	var _fix = function(t) {
		fix4scene["g_Mode"] = "gfp_scene";
		fix4scene["g_fullMode"] = 7;
		fix4scene["g_SceneID"] = t.itemno
	};
	d["g_Dressup"] = g_Dressup;
	var items = QZONE.shop.getItemList(0, 1),
		diyItems = QZONE.shop.getDiyItem && QZONE.shop.getDiyItem(true, true) || g_Dressup.diyitems,
		ar = [],
		styleid = 0,
		xwitem = null;
	if (iteminfo) {
		var convert = function(d) {
			if (d.type) return d;
			var s = d.style,
				data = {
					type: d.typeid,
					itemno: d.id,
					posx: s.x,
					posy: s.y,
					posz: s.z,
					width: s.w,
					height: s.h,
					flag: s.f
				};
			s.id && (data.styleid = s.id);
			return data
		};
		if (!iteminfo.suit) {
			if (QZONE.shop.DressupConfig.nature[iteminfo.typeid] & 1) for (var i = 0; i < items.length;) {
					if (items[i].type == iteminfo.typeid) {
						items.splice(i, 1);
						continue
					}
					i++
			}
			if (27 == iteminfo.typeid) {
				for (var i = 0; i < items.length;) {
					if (1 == items[i].type) {
						items.splice(i, 1);
						continue
					}
					i++
				}
				_fix(convert(iteminfo))
			}
			if (28 == iteminfo.typeid) xwitem = iteminfo;
			items.push(iteminfo)
		} else {
			var suit = iteminfo.suit;
			for (var i =
				0; i < suit.length; i++) {
				if (QZONE.shop.DressupConfig.nature[suit[i].typeid] & 1) for (var j = 0; j < items.length;) {
						if (items[j].type == suit[i].typeid) {
							items.splice(j, 1);
							continue
						}
						j++
				}
				if (27 == suit[i].typeid) {
					for (var j = 0; j < items.length;) {
						if (1 == items[j].type) {
							items.splice(j, 1);
							continue
						}
						j++
					}
					_fix(convert(suit[i]))
				}
				if (28 == suit[i].typeid) {
					xwitem = suit[i];
					for (var j = 0; j < items.length;) {
						if (13 == items[j].type || 26 == items[j].type || 1 == items[j].type || 25 == items[j].type) {
							items.splice(j, 1);
							continue
						}
						j++
					}
				}
				suit[i] = convert(suit[i])
			}
			items =
				items.concat(suit);
			styleid = iteminfo.style.id
		}
	}
	d["g_Dressup"].items = opt && opt.g_Dressup && opt.g_Dressup["items"] || items;
	if (!(opt && opt.g_Dressup && opt.g_Dressup["diyitems"])) for (var i = 0, suit = d["g_Dressup"].items; i < suit.length; i++) {
			var typeid = suit[i].typeid || suit[i].type;
			if (QZONE.shop.DressupConfig.nature[typeid] & 1) for (j = 0; j < diyItems.length;) {
					if (diyItems[j].type == typeid || diyItems[j].type == 51 && typeid == 1 || diyItems[j].type == 54 && typeid == 14) {
						diyItems.splice(j, 1);
						continue
					}
					j++
			}
	}
	d["g_Dressup"].diyitems = opt && opt.g_Dressup &&
		opt.g_Dressup["diyitems"] || diyItems;
	d.g_SceneID = opt && opt["g_SceneID"] || fix4scene["g_SceneID"] || QZONE.dressDataCenter.getScene();
	d.g_frameStyle = opt && typeof opt["g_frameStyle"] != "undefined" ? opt["g_frameStyle"] : QZONE.dressDataCenter.getFramestyle();
	d.g_fullMode = opt && opt["g_fullMode"] || fix4scene["g_fullMode"] || QZONE.dressDataCenter.getMode();
	d.g_StyleID = opt && typeof opt["g_StyleID"] != "undefined" ? opt["g_StyleID"] : styleid || QZONE.dressDataCenter.getStyleid();
	d.g_Mode = opt && opt["g_Mode"] || fix4scene["g_Mode"] ||
		QZONE.dressDataCenter.getStringMode(opt ? opt["g_fullMode"] : "");
	d.g_TransparentLevel = opt && opt["g_TransparentLevel"] || QZONE.dressDataCenter.getTransparence();
	var windowlist = null;
	if (d.g_Mode == "gfp_module" && window.QME && window.QME.getModuleLayout) {
		windowlist = [];
		var _modules = QME.getModuleLayout();
		QZFL.object.each(_modules, function(o) {
			var id, wid, tmp;
			id = o.appid + "";
			id = id.split("_");
			wid = id.length > 1 ? id[1] : o.wndid;
			tmp = {
				appid: id.length > 1 ? 99 : o.appid,
				mode: o.mode || 2,
				posx: o.posx,
				posy: o.posy,
				posz: o.posz,
				width: o.width || 0,
				height: o.height || 0,
				wndid: wid
			};
			windowlist.push(tmp)
		});
		d["g_Dressup"] && d["g_Dressup"].windows && QZONE.dressDataCenter.setWindows(windowlist);
		windowlist = null
	}
	if (xwitem) {
		xwitem = convert(xwitem);
		d.g_Mode = "gfp_module";
		d.g_frameStyle = 0;
		d.g_fullMode = 5;
		d.g_xwMode = xwitem.flag == 1 || xwitem.itemno == 65538 ? 5 : 6;
		d.g_TransparentLevel = 50;
		windowlist = QZONE.dressDataCenter.convert2XWMode(-1, QZONE.dressDataCenter.getWindows())
	}
	d["g_Dressup"].windows = opt && opt.g_Dressup && opt.g_Dressup["windows"] || windowlist || QZONE.dressDataCenter.getWindows();
	d.g_isHideTitle = opt && opt["g_isHideTitle"] || QZONE.dressDataCenter.getIshidetitle();
	d.g_diyTitle = opt && opt["g_diyTitle"];
	d.g_IsHideTitle = opt && opt.g_IsHideTitle;
	d.g_icLayout = opt && opt.g_icLayout;
	d.g_isBGScroll = opt && opt.g_isBGScroll;
	d["nobar"] = 1;
	QZONE.preview.goPreview(null, window, d, null, opt)
};
QZONE.FrontPage.set7DPlanDressHistoryData = function(d) {
	QZONE.FrontPage.set7DPlanDressHistoryData._data = d
};
QZONE.FrontPage.get7DPlanDressHistoryData = function() {
	return QZONE.FrontPage.set7DPlanDressHistoryData._data
};
(function(qdb) {
	var ins = null,
		isInited = 0,
		callers = [],
		savers = [],
		illegalHead = /^[^_a-zA-Z]/,
		illegalChar = /[^_0-9a-z]/ig;

	function clean() {
		var o;
		while (o = callers.shift()) qdb.get(o.key, o.fn);
		while (o = savers.shift()) qdb.set(o.key, o.value)
	}
	function init() {
		if (isInited != 0) return;
		isInited = 1;
		QZONE.Storage.create(function(obj) {
			ins = obj;
			isInited = 2;
			clean()
		}, {
			dbname: "__simple_db"
		})
	}
	function fix(key) {
		if (illegalHead.test(key)) key = "__qzf_" + key;
		key = key.replace(illegalChar, function(a) {
			return "_" + a.charCodeAt(0).toString(16)
		});
		return key
	}
	qdb.set = function(key, value) {
		init();
		key = fix(key);
		if (isInited != 2) {
			savers.push({
				key: key,
				value: value
			});
			return
		}
		ins && ins.set(key, value)
	};
	qdb.get = function(key, fn) {
		init();
		key = fix(key);
		if (isInited != 2) {
			callers.push({
				key: key,
				fn: fn
			});
			return
		}
		if (typeof fn == "function") ins && ins.get(key, fn);
		else return ins ? ins.get(key) : undefined
	}
})(QZONE.FrontPage.noShareDb = {});
(function(qdb) {
	var ins = null,
		isInited = 0,
		callers = [],
		savers = [],
		illegalHead = /^[^_a-zA-Z]/,
		illegalChar = /[^_0-9a-z]/ig;

	function clean() {
		var o;
		while (o = callers.shift()) qdb.get(o.key, o.fn);
		while (o = savers.shift()) qdb.set(o.key, o.value)
	}
	function init() {
		if (isInited != 0) return;
		isInited = 1;
		QZONE.Storage.create(function(obj) {
			ins = obj;
			isInited = 2;
			clean()
		}, {
			dbname: "__share_db",
			share: true
		})
	}
	function fix(key) {
		if (illegalHead.test(key)) key = "__qzf_" + key;
		key = key.replace(illegalChar, function(a) {
			return "_" + a.charCodeAt(0).toString(16)
		});
		return key
	}
	qdb.set = function(key, value) {
		init();
		key = fix(key);
		if (isInited != 2) {
			savers.push({
				key: key,
				value: value
			});
			return
		}
		ins && ins.set(key, value)
	};
	qdb.get = function(key, fn) {
		init();
		key = fix(key);
		if (isInited != 2) {
			callers.push({
				key: key,
				fn: fn
			});
			return
		}
		if (typeof fn == "function") ins && ins.get(key, fn);
		else return ins ? ins.get(key) : undefined
	}
})(QZONE.FrontPage.shareDb = {});
(function(qfp) {
	var _d = {};
	qfp.hasFrameAround = function(appid) {
		return _d[appid + ""] || 0
	};
	qfp.setFrameAround = function(appid) {
		_d[appid + ""] = 1
	}
})(QZONE.FrontPage);
QZONE.FrontPage.initSpeedStat = function(appid) {
	if (appid) {
		var key = "a" + appid;
		window.g_T && (window.g_T.app = g_T.app || {}, g_T.app[key] = [], g_T.app[key][0] = new Date)
	}
};
QZONE.FrontPage.getAppSpeedStatZero = function(appid) {
	if (appid) return window.g_T && window.g_T.app && window.g_T.app[appid] && window.g_T.app[appid][0] || null;
	return null
};
QZONE.FrontPage.appendHash = QZONE.appNavEngine.appendAppHash;
QZONE.FrontPage.setAppTitle = QZONE.appNavEngine.setAppTitle;
QZONE.FrontPage.isInDressing = function() {
	return window.g_app_identifier == "custom" || window.g_app_identifier == "mall" || QZFL.cookie.get("qz_inDressMode")
};
(function(qzs) {
	var sufix = "_ttix";
	var TTIPool = {};
	var DownloadPool = {};
	var ReportPool = {};

	function isOwnerMode() {
		return window.g_iLoginUin && g_iLoginUin == window.g_iUin
	}
	function getSmartTime(key, minDelay, maxDelay) {
		var t = QZONE.FrontPage.noShareDb.get(key) || 0,
			mint = typeof minDelay == "undefined" ? 0 : minDelay,
			maxt = typeof maxDelay == "undefined" ? 1800 * 1E3 : maxDelay,
			ttit = QZONE.FrontPage.noShareDb.get(key + sufix) || mint;
		t = Math.min(Math.max(mint, t), maxt);
		if (t > ttit) {
			if (ttit > mint) t = Math.round(t + (ttit - t) * Math.random());
			else t =
					mint;
			ReportPool[key] = {
				tag: 1,
				t: t,
				ttit: ttit
			}
		} else {
			if (ttit < maxt) t = Math.round(t + (ttit - t) * Math.random());
			else t = maxt;
			ReportPool[key] = {
				tag: 2,
				t: t,
				ttit: ttit
			}
		}
		return t
	}
	function setSmartTime(key, time) {
		QZONE.FrontPage.noShareDb.set(key, time)
	}
	qzs.delay = function(key, callback, filter, minDelay, maxDelay) {
		var checkResult = filter & 1 ? isOwnerMode() : true,
			st = minDelay,
			usedt = new Date - window._s_,
			delayt = minDelay;
		if (filter & 2) {
			st = getSmartTime(key, minDelay, maxDelay);
			if (st > usedt) {
				delayt = st - usedt;
				TTIPool[key + "_start_proper"] = usedt
			} else {
				delayt =
					0;
				TTIPool[key + "_start_late"] = usedt
			}
		}
		if (checkResult) {
			var h = delay(function() {
				typeof callback == "function" && callback()
			}, delayt);
			setSmartTime(key, st)
		}
	};
	qzs.fixSmartTime = function(key, time, isDownloadTime) {
		var sp = isDownloadTime ? DownloadPool : TTIPool;
		if (sp[key]) return;
		var s = isDownloadTime ? "" : sufix;
		deltat = (time || new Date) - window._s_, ot = QZONE.FrontPage.noShareDb.get(key + s);
		sp[key] = deltat;
		typeof ot != "undefined" && (deltat = (+ot + deltat) / 2);
		deltat = Math.round(deltat);
		deltat != ot && setSmartTime(key + s, deltat)
	};
	qzs.TTIPool =
		TTIPool;
	qzs.ReportPool = ReportPool
})(QZONE.FrontPage.smart = QZONE.FrontPage.smart || {});
try {
	document.domain = location.href.indexOf("qq.com") == -1 ? "pengyou.com" : "qq.com"
} catch (err) {
	throw new Error("For qq.com domain only!");
}
window.QZONE = window.QZONE || {};
QZONE.FP = QZONE.FP || {};
QZONE.AP = QZONE.AP || {};
(function() {
	var _fp = window,
		found = 0,
		appid = "",
		where;
	try {
		do {
			_fp = _fp.parent;
			if (_fp.QZONE && _fp.QZONE.FrontPage && _fp.g_iUin) {
				found = 5;
				break
			}
		} while (_fp != top);
		appid = _fp.QZONE.space.getCurrApp();
		appid = appid[0] == "myhome" || appid[0] == "main" ? appid[1] : appid[0] || ""
	} catch (ex) {
		found = 0
	}
	QZONE.FP._t = _fp;
	if (found < 5) return false;

	function addEvent(dom, type, fun) {
		if (!dom) return;
		if (dom.addEventListener) dom.addEventListener(type, fun, false);
		else if (dom.attachEvent) dom.attachEvent("on" + type, fun)
	}
	function extend(source, target) {
		for (var k in source) if (k.charAt(0) !=
				"_" && typeof source[k] == "function") target[k] = source[k]
	}
	extend(_fp.QZONE.OFP || {}, QZONE.FP);
	extend(_fp.QZONE.FrontPage, QZONE.FP);
	extend({
		activateOFPIframe: function() {
			if (frameElement) if (typeof frameElement.activate == "function") frameElement.activate()
		}
	}, QZONE.FP);
	extend(_fp.QZONE.appPlatform || {}, QZONE.AP);
	setTimeout(function() {
		if (window.QZFL && QZFL.config && QZFL.config.FSHelperPage) QZFL.config.FSHelperPage = "http://" + _fp.imgcacheDomain + "/qzone/v5/toolpages/fp_gbk.html"
	}, 2E3);

	function checkAllow(appid) {
		if (frameElement &&
			frameElement.id === "frameFeedList") {
			where = 1;
			return true
		}
		if (typeof g_version != "undefined" && g_version == "6") return true;
		if (!appid) return false;
		if (appid == 2 || appid == "blog" || appid == "bloglist") {
			appid = 2;
			where = 2;
			return true
		}
		if (appid == 334 || appid == 7 || appid == "msg" || appid == "msgboard") return true
	}
	if (!checkAllow(appid)) return;
	var ignoreTags = makeMap("ADDRESS,APPLET,BLOCKQUOTE,BODY,BUTTON,CENTER,DD,DEL,DIR,DIV,DL,DT,FIELDSET,FORM,FRAMESET,HR,IFRAME,INS,ISINDEX,LI,MAP,MENU,NOFRAMES,NOSCRIPT,OBJECT,OL,P,PRE,SCRIPT,TABLE,TBODY,TD,TFOOT,TH,THEAD,TR,UL");
	var rCDN = /(?:^|\.)(?:qq\.com|qzonestyle\.gtimg\.cn)$/i;
	var CGI = "http://www.urlshare.cn/cgi-bin/qzshare/cgi_qzshare_urlcheck";
	var goUser = /(?:^|\.)(?:user\.qzone\.qq\.com\/\d+)$/i;
	if (document.domain == "qq.com") if (document.addEventListener) document.addEventListener("click", firewall, false);
		else
	if (document.attachEvent) document.attachEvent("onclick", firewall);

	function firewall(evt) {
		evt = evt || window.event;
		var elem = evt.target || evt.srcElement,
			deepCounter = 3,
			tagName, href, target, meteor, mj;
		while (elem && deepCounter > -1) {
			deepCounter--;
			tagName = elem.nodeName;
			if (!elem.getAttribute) break;
			href = elem.getAttribute("href") || "";
			if (isGoUser(href)) {
				elem.hrefbak = href;
				elem.href = href + "/profile";
				setTimeout(function(el) {
					return function() {
						el.href = el.hrefbak
					}
				}(elem), 50)
			} else if (tagName == "A" && !elem.onclick) {
				href = elem.getAttribute("href") || "";
				if (href.slice(0, 4) == "http" && !isCDNDomain(href) && href.slice(0, 34) != CGI) {
					elem.hrefbak = href;
					if (window.ActiveXObject && elem.innerHTML.indexOf("<") == -1) {
						meteor = document.createComment("");
						elem.appendChild(meteor)
					}
					if (g_isBrandQzone !=
						"1" && typeof g_isOFP != "undefined" && g_isOFP == "0" && typeof QZ != "undefined" && QZ.G && !QZ.G.inApp) mj = "&mj=1";
					else mj = "";
					var currApp = 0;
					var feedLi = QZFL.dom.searchElementByClassName(elem, "f_single");
					if (feedLi) try {
							currApp = feedLi.getAttribute("id").split("_")[2]
					} catch (ex) {}
					elem.href = CGI + "?appid=" + currApp + "&rappid=" + appid + mj + "&url=" + encodeURIComponent(href) + (where ? "&where=" + where : "");
					var tc_qz_original = null;
					var fitem = QZFL.dom.searchElementByClassName(elem, "f_item");
					var sx = $e(".feed_log_data", fitem);
					if (sx && sx.elements[0] &&
						sx.elements[0].getAttribute("data-original")) tc_qz_original = sx.elements[0].getAttribute("data-original");
					if (tc_qz_original) elem.href = elem.href + "&tc_qz_original=" + tc_qz_original;
					setTimeout(function(el) {
						return function() {
							el.href = el.hrefbak
						}
					}(elem), 50)
				}
				break
			}
			if (ignoreTags[tagName]) break;
			elem = elem.parentNode
		}
	}
	function isCDNDomain(href) {
		var h = href.split("://");
		if (h[1]) {
			h = h[1].split("/")[0];
			return rCDN.test(h)
		}
	}
	function isGoUser(href) {
		return false;
		if (!href) return false;
		var h = href.split("://");
		if (h[1]) return goUser.test(h[1])
	}

	function makeMap(str) {
		var obj = {}, items = str.split(","),
			i = 0,
			l = items.length;
		for (; i < l; i++) obj[items[i]] = true;
		return obj
	}
})();
QZONE.FrontPage.popupFlashGame = function() {
	QZFL.imports("http://" + window.imgcacheDomain + "/qzone/v6/flash/doomsday/doomsday_flash.js", function() {
		QZONE.Doomsday.initDoomsDay()
	})
};
QZ = {};
QZ.G = {
	isAlpha: 0,
	inApp: false,
	s: function(target, isHidden) {
		var d = typeof target == "string" ? $(target) : target;
		if (d) QZFL.css[(isHidden ? "add" : "remove") + "ClassName"](d, "none")
	},
	toApp: function() {
		QZONE.FrontPage.toApp.apply(null, arguments)
	},
	initNamecard: function() {
		QZONE.Global.initNamecard.apply(QZONE.Global, arguments)
	},
	initRemark: function() {
		QZONE.Global.Remark.init.apply(QZONE.Global, arguments)
	},
	getDiamondHTML: function(callback, type) {
		QZONE.Global.Diamond.init(callback, type)
	},
	holdMusic: function() {
		if (QZONE.music &&
			typeof QZONE.music.switchPage == "function") QZONE.music.switchPage()
	},
	checkMLoaderURLAvailable: function(url) {
		var exp = /^http:\/\/(?:[\d\w-]+)?(?:\.s\d\d?)?(?:\.)?(?:(?:(?:qzs|qzone)\.qq\.com)|(?:(?:qzonestyle|i|pgdt)\.gtimg\.cn))\//i;
		return exp.test(url)
	},
	init: function() {
		QZ.G.isAlpha = !! QZONE.FrontPage.getBitMapFlag(58)
	}
};
QZ.G.init();
QZONE.Controller = {
	bootstrap: function() {
		this.initEvent();
		this.page.init();
		this.nav.init()
	},
	initEvent: function() {
		QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_APP", function(evtObj, dataObj) {
			QZONE.Controller.enterAppPage(dataObj.appid, dataObj)
		});
		QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_BASE_APP", function(evtObj, dataObj) {
			QZONE.Controller.enterBaseAppPage(dataObj.appid)
		});
		QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_DEFAULT", function(evtObj, dataObj) {
			QZONE.Controller.enterDefaultPage()
		});
		QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_APP", function(evt, data) {
			var _s = QZONE.appNavEngine,
				f, p, aid = data && data.appid,
				t;
			if (aid == -124) _s.appContainer && QZFL.dom.setScrollTop(QZFL.dom.getPosition(_s.appContainer).top - 37);
			else if (aid == -125) QZONE.Controller.ajustFrameWidth(0, aid);
			else if (data && data.throughAppStore) _s._3rdAppContainer && QZFL.dom.setScrollTop(QZFL.dom.getPosition(_s._3rdAppContainer).top - 37);
			else QZONE.Controller.ajustFrameWidth(1);
			QZONE.dressDataCenter.getMode() == 7 && QZONE.Controller.page.pageContent.show(1);
			delay(QZONE.Controller.jumpFromScenePage,
				500, data);
			delay(QZONE.Controller.jumpFromXWPage, 500, data);
			QZONE.Controller.appFailReport(aid)
		});
		QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_BASE_APP", function(evtObj, data) {
			var _s = QZONE.appNavEngine,
				f, p, aid = data && data.appid;
			if (_s.appContainer) QZFL.dom.setScrollTop();
			QZONE.Controller.ajustFrameWidth(1);
			QZONE.dressDataCenter.getMode() == 7 && QZONE.Controller.page.pageContent.show(1);
			delay(QZONE.Controller.jumpFromScenePage, 500, data);
			if (aid == -118) _s.appContainer && QZFL.dom.setScrollTop(QZFL.dom.getPosition(_s.appContainer).top -
					37);
			else QZFL.css.removeClassName(document.body, "mode_custom");
			delay(QZONE.Controller.jumpFromXWPage, 500, data)
		});
		QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_DEFAULT", function(evtObj, dataObj) {
			var _s = QZONE.appNavEngine;
			if (_s.appContainer && (p = _s.appContainer.parentNode)) QZFL.dom.setScrollTop();
			QZONE.Controller.jumpToScenePage(dataObj);
			QZONE.Controller.ajustFrameWidth(1);
			QZONE.Controller.jumpToXWPage(dataObj)
		});
		QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_APP", function(evtObj, dataObj) {
			QZONE.Controller.appErrorReport(dataObj.appid)
		});
		delay(function() {
			QZONE.Controller.appErrorReport(window.g_isOFP == 1 ? "N1" : "N2")
		}, 8E3)
	},
	appFailReport: function(appid) {
		QZFL.imports("http://" + siDomain + "/qzone/v6/app/app_fail_report.js", function() {
			QZONE.appFailReport.report(appid)
		})
	},
	appErrorReport: function(appid) {
		QZFL.imports("http://" + siDomain + "/qzone/v5/fragment/error_report.js", function() {
			QZONE.errorReport.load(appid)
		})
	},
	pluginPromoteApps: function(containId, appId) {
		var url = ["http://", siDomain, "/qzone/vas/marketing/platform_app.js"].join("");
		QZFL.imports(url, function() {
			QZONE.appMarketing && QZONE.appMarketing.bootstrap(containId, appId)
		})
	},
	ajustFrameWidth: function(f, aid) {
		var p = QZONE.Controller,
			t = p.ajustFrameWidth.frame || $("pageApp"),
			w = window.screen.width,
			rw = aid == -125 ? !f ? "100%" : "" : !f ? w >= 1280 ? "1150px" : "960px" : "";
		if (t) {
			t.style.width = rw;
			p.ajustFrameWidth.frame = t
		}
		if (t = p.ajustFrameWidth.position) t.style.width = rw;
		else {
			t = QZFL.dom.getElementsByClassName("lay_position");
			if (t && t.length > 0 && (t = t[0])) {
				t.style.width = rw;
				p.ajustFrameWidth.position = t
			}
		}
	},
	setPositionWidth: function(w) {
		var p =
			QZONE.Controller,
			t;
		if (t = p.setPositionWidth.position);
		else {
			t = QZFL.dom.getElementsByClassName("lay_position");
			if (t && t.length > 0 && (t = t[0])) p.setPositionWidth.position = t
		}
		t && (t.style.width = typeof w == "number" ? w + "px" : "")
	},
	jumpFromScenePage: function(data) {
		var isScene = g_Mode == "gfp_scene",
			t, qzca = QZFL.css.addClassName,
			qzcr = QZFL.css.removeClassName,
			qzch = QZFL.css.hasClassName;
		if (isScene)(t = $("QZ_Body")) && qzch(t, "mode_home_scene_index") && qzcr(t, "mode_home_scene_index")
	},
	jumpToScenePage: function(data) {
		var isScene =
			g_Mode == "gfp_scene",
			t, c, qzca = QZFL.css.addClassName,
			qzcr = QZFL.css.removeClassName,
			qzch = QZFL.css.hasClassName;
		if (isScene) {
			c = QME.config.addon;
			c = c && c["QZ_Body"];
			c && (t = $("QZ_Body")) && !qzch(t, "mode_home_scene_index") && qzca(t, "mode_home_scene_index")
		}
	},
	jumpFromXWPage: function() {
		var isXW = QZONE.dressDataCenter.isXWMode(),
			t, qzca = QZFL.css.addClassName,
			qzcr = QZFL.css.removeClassName,
			qzch = QZFL.css.hasClassName;
		if (isXW)(t = $("QZ_Body")) && qzch(t, "mode_home_xiaowo_index") && qzcr(t, "mode_home_xiaowo_index")
	},
	jumpToXWPage: function() {
		var isXW =
			QZONE.dressDataCenter.isXWMode(),
			t, qzca = QZFL.css.addClassName,
			qzcr = QZFL.css.removeClassName,
			qzch = QZFL.css.hasClassName;
		if (isXW && !QZONE.dressDataCenter.isOldXWMode() && window.g_isOFP != "1")(t = $("QZ_Body")) && !qzch(t, "mode_home_xiaowo_index") && qzca(t, "mode_home_xiaowo_index")
	},
	enterAppPage: function(appid, data) {
		var p = QZONE.Controller.page;
		if (typeof window.g_SeoAppId != "undefined" && window.g_SeoAppId != "0") {
			p.seo.show(0);
			p.app.show(1);
			p._3rdapp.show(1);
			p.pageContent.show(1);
			window.g_SeoAppId = "0"
		} else {
			if (data &&
				data.throughAppStore) {
				p.app.show(1);
				p._3rdapp.show(0)
			} else {
				p.app.show(0);
				p._3rdapp.show(1)
			}
			p.seo.show(1);
			p.pageContent.show(1);
			p.setPageTitle(appid)
		}
	},
	enterBaseAppPage: function(appid) {
		var p = QZONE.Controller.page;
		if (typeof window.g_SeoAppId != "undefined" && window.g_SeoAppId != "0") {
			p.seo.show(0);
			p.app.show(1, 1);
			p._3rdapp.show(1);
			p.pageContent.show(1);
			p.setPageTitle(appid);
			window.g_SeoAppId = "0"
		} else {
			p.seo.show(1);
			p.app.show(0, 1);
			p._3rdapp.show(1);
			p.pageContent.show(1);
			p.setPageTitle(appid)
		}
	},
	enterDefaultPage: function() {
		var p =
			QZONE.Controller.page;
		p.seo.show(1);
		p.app.show(1);
		p._3rdapp.show(1);
		p.pageContent.show()
	},
	page: {
		init: function() {
			var p = QZONE.Controller.page;
			p.pageContent.init();
			p.app.init();
			p._3rdapp.init();
			p.seo.init()
		},
		setPageTitle: function(appid) {
			var info = QZONE.appPlatform.findAppInfo(appid, ""),
				aname = info && info.app_alias || "";
			if (aname) {
				var d = $("pageAppTitle");
				if (d) d.innerHTML = aname
			}
		},
		pageContent: {
			container: null,
			init: function() {
				QZONE.Controller.page.pageContent.container = $("pageContent")
			},
			show: function(isHidden) {
				var target =
					QZONE.appNavEngine.isSaveLeftMemu(QZONE.appNavEngine.getCurrentAppID());
				if (target) {
					try {
						QZONE.OFP.Controller.Entry.dispatchHighLightEvent($(target))
					} catch (e) {}
					QZ.G.s(QZONE.Controller.page.pageContent.container, 0)
				} else QZ.G.s(QZONE.Controller.page.pageContent.container, isHidden)
			}
		},
		seo: {
			container: null,
			init: function() {
				QZONE.Controller.page.seo.container = $("pageSeo")
			},
			show: function(isHidden) {
				var p = QZONE.Controller.page.seo;
				QZ.G.s(p.container, isHidden)
			}
		},
		app: {
			container: null,
			init: function() {
				QZONE.Controller.page.app.container =
					$("pageApp")
			},
			show: function(isHidden, isBaseApp) {
				if (QZONE.appNavEngine.isSaveLeftMemu(QZONE.appNavEngine.getCurrentAppID())) {
					QZFL.css.addClassName($("colMain"), "none");
					QZFL.css.removeClassName($("app_right_container"), "none");
					QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_DEFAULT", function(evtObj, dataObj) {
						QZFL.css.removeClassName($("colMain"), "none");
						QZFL.css.addClassName($("app_right_container"), "none")
					});
					QZ.G.s(QZONE.Controller.page.pageContent.container, 0)
				} else {
					var p = QZONE.Controller.page.app;
					p.container.className =
						isBaseApp ? "page_app_base mod_wrap" : "page_app mod_wrap";
					QZ.G.s(p.container, isHidden)
				}
			}
		},
		_3rdapp: {
			container: null,
			init: function() {
				QZONE.Controller.page._3rdapp.container = $("page3rdApp")
			},
			show: function(isHidden, isBaseApp) {
				var p = QZONE.Controller.page._3rdapp;
				QZ.G.s(p.container, isHidden)
			}
		}
	},
	nav: {
		config: {
			"c0": 1,
			"c2": 1,
			"c4": 1,
			"c311": 1,
			"c202": 1,
			"c305": 1,
			"c334": 1,
			"c1": 1
		},
		curAppid: 0,
		init: function() {
			var c = $("QZ_Nav_Container"),
				a, appid;
			if (c) QZFL.event.addEvent(c, "click", function() {
					var e = QZFL.event.getTarget();
					if (e && e.tagName == "A") {
						appid = e.id.replace("QZ_Nav_", "");
						if (appid == "0") if (g_isOFP == "1") {
								location.href = "http://user.qzone.qq.com/" + g_iLoginUin + "/main";
								QZFL.event.preventDefault();
								return
							} else QZ.G.toApp("/main");
							else
						if (appid == "More") QZONE.qzEvent.dispatch("QZN_DISPLAY_BASE_APP");
						else QZ.G.toApp(g_isOFP ? "/" + appid : "/main/" + appid);
						QZFL.event.preventDefault()
					}
				});
			if (g_isOFP != "1") QZONE.Controller.nav.activeItem(0);
			this.initEvent()
		},
		initEvent: function() {
			var id = "QZ_Nav_Container";
			QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_APP", function(evtObj, dataObj) {
				var appid = QZONE.appNavEngine.getCurrentAppID();
				QZONE.Controller.nav.setCurItem(appid);
				QZ.G.s(id);
				if (QZONE.OFP) QZONE.OFP.inApp = true;
				QZ.G.inApp = true
			});
			QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_BASE_APP", function(evtObj, dataObj) {
				var appid = QZONE.appNavEngine.getCurrentAppID();
				QZONE.Controller.nav.setCurItem(appid);
				QZ.G.s(id);
				if (QZONE.OFP) QZONE.OFP.inApp = true;
				QZ.G.inApp = true
			});
			QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_DEFAULT", function(evtObj, dataObj) {
				QZONE.Global.directApp.check();
				QZONE.Controller.nav.setCurItem(0);
				if (g_isOFP == "1") QZONE.Controller.nav.activeItem(0, 1);
				QZ.G.s(id);
				if (QZONE.OFP) QZONE.OFP.inApp = false;
				QZ.G.inApp = false
			})
		},
		setCurItem: function(appid) {
			var p = QZONE.Controller.nav;
			if (appid == p.curAppid) return;
			else if (!p.config["c" + appid]) {
				p.activeItem(p.curAppid, 1);
				p.curAppid = appid;
				return
			}
			p.activeItem(appid);
			p.activeItem(p.curAppid, 1);
			p.curAppid = appid
		},
		activeItem: function(appid, isDeactive) {
			var d = $("QZ_Nav_" + appid);
			if (d && d.parentNode.tagName == "LI") QZFL.css[(isDeactive ? "remove" :
					"add") + "ClassName"](d.parentNode, "cur")
		}
	}
};
QZONE.Global = {
	bootstrap: null,
	init: function() {
		if (!window.g_PreData) g_PreData = {
				app: {
					data: {},
					flag: 1,
					ret: 999
				},
				icmoudule: {
					data: {},
					flag: 1,
					ret: 999
				}
		};
		var p = QZONE.Global;
		p.initGlobalParam();
		QZONE.Controller.bootstrap();
		p.setupQZFL();
		p.directApp.check(p.bootstrap);
		var t = 2E3;
		if (ua.ie <= 7) t = 5E3;
		setTimeout(function() {
			p.initVipItems()
		}, t);
		p.initDressUp();
		setTimeout(p.loadStatistic, 3E3);
		if (!QZONE.FrontPage.isInDressing()) setTimeout(p.loadAccessory, t + 4E3);
		else setTimeout(function() {
				QZFL.imports("http://" + (window.siDomain ||
					"qzonestyle.gtimg.cn") + "/qzone/v6/accessory/accessory_lite.js", function() {
					ENV.set("accessoryLoaded", true);
					QZONE.Accessory.bootstrap()
				})
			}, t + 4E3);
		p.Event.init();
		if (window.location.href.indexOf("doomsday") != -1) {
			var mask = QZFL.maskLayout.create(7500, document, {
				"css": {
					opacity: "0.75"
				}
			});
			QZONE.FP.showMsgbox("\u6e38\u620f\u6b63\u5728\u52a0\u8f7d\u4e2d", 6, 7500);
			setTimeout(function() {
				QZFL.maskLayout.remove(mask);
				QZONE.FP.popupFlashGame()
			}, 8E3)
		}
	},
	modeBootstrap: function(bootstrap) {
		QZONE.Global.bootstrap = bootstrap
	},
	directApp: {
		isDirect: 0,
		bootstrap: null,
		check: function(bootstrap) {
			var p = QZONE.Global.directApp;
			if (typeof bootstrap == "function") p.bootstrap = bootstrap;
			if (QZONE.appNavEngine.isDirectIn() && !p.isDirect) {
				QZ.G.toApp(location.href);
				p.isDirect = 1;
				var hs = location.hash,
					t;
				if ((t = hs.indexOf("#!")) == 0) {
					hs = hs.substring(2);
					t = QZFL.util.commonDictionarySplit(hs);
					if (QZONE.appNavEngine.isSaveLeftMemu(t.app)) p.bootstrap(p.isDirect)
				} else if (window.g_app_identifier == "weibo" || window.g_app_identifier == "xiaoyou") p.bootstrap(p.isDirect)
			} else if (typeof p.bootstrap ==
				"function") {
				p.bootstrap(p.isDirect);
				QZONE.Controller.page.pageContent.show();
				p.bootstrap = null;
				QZONE.appNavEngine.restoreTitle()
			}
		}
	},
	initSideModeIcon: function() {
		try {
			if (window.external.msIsSiteMode()) window.external.msSiteModeSetIconOverlay("http://" + window.siDomain + "/qzonestyle/act/qzone_app_img/album.ico", "test")
		} catch (e) {}
	},
	initGlobalParam: function() {
		window.g_XDoc = {};
		window.g_JData = {};
		if (window.g_FrameStyle == 12) window.g_FrameStyle = 9;
		else if (window.g_FrameStyle == 14) window.g_FrameStyle = 2
	},
	initNamecard: function(dom,
		opt) {
		if (QZFL.userAgent.isiPad) return false;
		var d = ENV.get("namecardLoaded"),
			dom = dom || document.body;
		if (!d) {
			d = new QZONE.JsLoader;
			d.onload = function() {
				ENV.set("namecardLoaded", true);
				QZONE.namecard.init(dom, opt)
			};
			d.load("http://" + siDomain + "/qzone/v5/namecardv2.js?max_age=31104001", null, "utf-8")
		} else QZONE.namecard.init(dom, opt)
	},
	Remark: {
		_queue: [],
		_getData: function(dom, opts) {
			var p = QZONE.Global.Remark;
			p._queue.push(dom);
			QZONE.FrontPage.getRemarkList(function(o) {
				p._callback(o, opts)
			})
		},
		init: function(dom, opts) {
			var o =
				ENV.get("Friend_Remarks"),
				p = QZONE.Global.Remark;
			if (!o) p._getData(dom, opts);
			else p._makePresent(dom, o, opts)
		},
		_callback: function(o, opts) {
			var _e = ENV.get("Friend_Remarks");
			if (!_e) ENV.set("Friend_Remarks", o);
			var d, p = QZONE.Global.Remark;
			while (p._queue.length > 0) {
				d = p._queue.shift();
				if (d) QZONE.Global.Remark._makePresent(d, o, opts)
			}
		},
		_makePresent: function(dom, o, opts) {
			var _d = dom;
			var r, els;
			els = QZFL.dom.getElementsByClassName("q_des", "a", _d);
			var uin, re = /.*des_(\d{5,10}).*/,
				tmp;
			for (var i = 0; i < els.length; i++) if (tmp =
					re.exec(els[i].getAttribute("link"))) {
					uin = parseInt(tmp[1], 10);
					if (uin == g_iLoginUin) continue;
					r = o[uin];
					if (r && trim(r) != "") {
						if (opts && opts.maxLength > 0) r = QZFL.string.cut(r, opts.maxLength);
						els[i].innerHTML = escHTML(r);
						QZFL.css.addClassName(els[i], "c_tx")
					}
				}
		}
	},
	SpaceTips: {
		html: '<div class="inner" id="QZ_Space_Content"></div>\t\t\t\t<a href="javascript:;" onclick="QZONE.Global.SpaceTips.hide();" class="text_close" title="\u70b9\u51fb\u5173\u95ed">\u00d7</a>',
		callback: null,
		show: function(html, callback) {
			var d = $("QZ_Space_Tips");
			if (!d) {
				d = document.createElement("DIV");
				d.className = "gb_upgrade gb_upgrade_hint";
				d.id = "QZ_Space_Tips";
				d.innerHTML = QZONE.Global.SpaceTips.html;
				var d2 = $("QZ_Toolbar_Container");
				if (d2) d2.parentNode.insertBefore(d, d2);
				QZFL.css.insertCSSLink("http://" + siDomain + "/qzone_v6/act/20110520_upgrade/upgrade.css")
			}
			if (html) {
				d = $("QZ_Space_Content");
				if (d) {
					d.innerHTML = html;
					QZ.G.s("QZ_Space_Tips")
				}
			}
			QZONE.Global.SpaceTips.callback = callback
		},
		hide: function() {
			QZ.G.s("QZ_Space_Tips", 1);
			var c = QZONE.Global.SpaceTips.callback;
			if (typeof c == "function") c()
		}
	},
	Score: {
		LEVEL_STEP: 4,
		getScoreByGrade: function(level) {
			var _level = parseInt(level);
			if (_level < 1) return;
			if (_level <= 10) return [5, 10, 15, 20, 30, 40, 50, 60, 75, 90][_level - 1];
			else return Math.pow(_level - 7, 2) * 10
		},
		getUserGrade: function(score) {
			var o = {};
			if (score < 5) {
				o.level = 0;
				o.nextLevelScore = 5;
				return o
			} else {
				var t = [0, 0, 10, 15, 20, 30, 40, 50, 60, 75, 90];
				if (score < 90) for (var i = t.length - 2; i >= 0; i--) {
						if (score - t[i] >= 0) {
							o.level = i;
							o.nextLevelScore = t[i + 1];
							return o
						}
				} else {
					o.level = Math.floor(Math.sqrt(score /
						10)) + 7;
					o.nextLevelScore = Math.pow(o.level - 6, 2) * 10;
					return o
				}
			}
		},
		getQZLevelIconHTML: function(score, isMini, needTips, opts) {
			var p = QZONE.Global.Score,
				lvObj = p.getUserGrade(score),
				level = lvObj.level,
				nextLevelScore = lvObj.nextLevelScore,
				opts = opts || {
					clickable: true
				}, domain = opts.domain || "flower.qzone.qq.com",
				path = opts.path || "point_ic_image",
				iconTemp = '<a href="javascript:;" onclick="QZONE.FP.toApp(&#39;/qzscore&#39;);window.TCISD && window.TCISD.hotClick(\'' + path + "', '" + domain + '\');return false;" class="' + (isMini ?
					"qz_qzone_lv_s" : "") + ' qz_qzone_lv qz_qzone_lv_{icon_level}" {tips}>{num_container}</a>',
				iconTemp2 = '<span class="' + (isMini ? "qz_qzone_lv_s" : "") + ' qz_qzone_lv qz_qzone_lv_{icon_level}" {tips}>{num_container}</span>',
				tips = needTips ? ' title="\u5f53\u524d\u7a7a\u95f4\u7b49\u7ea7\uff1a' + level + "\u7ea7\uff1b \u79ef\u5206\uff1a" + score + '\u5206"' : "";
			opts.clickable = typeof opts.clickable == "undefined" ? true : opts.clickable;
			iconTemp = opts.clickable ? iconTemp : iconTemp2;
			if (isMini) {
				var iconLevel = p.getIconLevel(level),
					numHTML =
						p.getNumHTML(level);
				return format(iconTemp, {
					"icon_level": iconLevel,
					"num_container": numHTML,
					"tips": tips
				})
			} else {
				var iconLvList = p.getIconLvList(level),
					arr = [];
				for (var i = 0, len = iconLvList.length; i < len; i++) arr.push(format(iconTemp, {
						"icon_level": iconLvList[i],
						"num_container": "",
						"tips": tips
					}));
				return arr.join("")
			}
		},
		getScoreByFlowerData: function(o) {
			if (window.g_PreData && g_PreData.flower && g_PreData.flower.ret == 0) return g_PreData.flower.score || 0;
			return 0
		},
		waitingPool: [],
		flowerData: null,
		setData: function(data) {
			var p =
				QZONE.Global.Score,
				o;
			if (data) {
				p.flowerData = data;
				while (p.waitingPool.length > 0) {
					o = p.waitingPool.shift();
					if (o) p._doOneWaitingRequest(o)
				}
			}
		},
		_doOneWaitingRequest: function(o) {
			var p = QZONE.Global.Score;
			if (o && typeof o.callback != "undefined" && typeof o.isMini != "undefined") {
				var score = p.getScoreByFlowerData(p.flowerData),
					h = p.getQZLevelIconHTML(score, o.isMini, true, {
						"clickable": g_iUin == g_iLoginUin
					});
				if (typeof o.callback == "function") o.callback(h)
			}
		},
		getOwnerQZLevelIconHTMLAsyn: function(callback, isMini) {
			var o = {
				"callback": callback,
				"isMini": isMini
			}, p = QZONE.Global.Score;
			p._doOneWaitingRequest(o)
		},
		getIconLvList: function(level) {
			var arr = [],
				p = QZONE.Global.Score,
				lv;
			for (var i = 0; i < 40 && level > 0; i++) {
				lv = p.getIconLevel(level);
				level -= Math.pow(p.LEVEL_STEP, lv - 1);
				arr.push(lv)
			}
			return arr
		},
		getNumHTML: function(level) {
			if (!level) return "";
			var arr = level.toString().split(""),
				arr2 = [],
				isGreen = level > 3 ? "" : "_g",
				numTemp = '<b class="d{level}{is_green}"></b>';
			for (var i = 0, len = arr.length; i < len; i++) arr2.push(format(numTemp, {
					level: arr[i],
					is_green: isGreen
				}));
			return '<span class="no">' +
				arr2.join("") + "</span>"
		},
		getIconLevel: function(level) {
			if (level == 0) return 0;
			var lv, s = QZONE.Global.Score.LEVEL_STEP,
				v;
			for (var i = 1; i <= 4; i++) if (level < Math.pow(s, i)) return i;
			return 4
		}
	},
	Diamond: {
		init: function(callback, type) {
			if (ownermode)(function(cb, t) {
					QZONE.FrontPage.getVIPLevel(function(o) {
						QZONE.Global.Diamond.initVipItemsCallback(o, cb, t)
					})
				})(callback, type);
			else if (typeof callback == "function") {
				var lv = QZONE.FrontPage.getUserBitmap(18, 4),
					tmp = QZONE.Global.Diamond._getDiamondLevelHTML(lv, 0, 0, type);
				callback(tmp)
			}
		},
		initVipItemsCallback: function(o, callback, type) {
			var _ydi = o,
				tmp, t = type || 1;
			if (_ydi && typeof _ydi.level != "undefined") {
				lv = _ydi.level;
				if (lv >= 1) {
					tmp = QZONE.Global.Diamond._getDiamondLevelHTML(lv, _ydi.charmpercent, _ydi.charm, t);
					if (typeof callback == "function") callback(tmp)
				}
			}
		},
		_getDiamondLevelHTML: function(lv, per, charm, type) {
			var tinyDiamonTmp = ' <a href="http://vip.qzone.com/?login=qq" target="_blank"><i class="qz_vip_icon_s qz_vip_icon_s{isGray}_{lv}"></i></a>',
				progressDiamonTmp = '<a href="http://vip.qzone.com/?login=qq" target="_blank" title="{title}" style="cursor:pointer"><span class="progress {cName} {expired}"><b style="width:{per}%"></b></span></a>',
				bigDiamonTmp = '<a href="http://vip.qzone.com/?login=qq" target="_blank"><i class="qz_vip_icon_l{isYearVip}{isGray}_{lv}"></i></a>';
			isVip = QZONE.FrontPage.getVipStatus(), cName = isVip == 1 ? "" : "vip_none", tmp = "", MAX_LEVEL = 8, title = lv < MAX_LEVEL ? "\u5f53\u524d\u7b49\u7ea7:LV" + lv + "\uff0c\u4e0b\u4e00\u7b49\u7ea7:LV" + (lv + 1) + "\u3002\u70b9\u51fb\u67e5\u770b\u8be6\u60c5" : "\u70b9\u51fb\u67e5\u770b\u8be6\u60c5", o = {
				"lv": lv,
				"lv2": lv + 1,
				"per": per,
				"expired": isVip ? "" : "expired",
				"isVipCName": isVip ? "" : "_n",
				"isVipCName2": isVip ? "" : "n",
				"isGray": isVip ? "" : "_gray",
				"cName": cName,
				"cName2": lv < MAX_LEVEL ? "" : "none",
				"title": title,
				"isYearVip": isVip && QZONE.FP.isUserVIPExpress() ? "_year" : ""
			};
			if (type == 1) tmp = progressDiamonTmp + " " + tinyDiamonTmp;
			else if (type == 2) tmp = progressDiamonTmp;
			else if (type == 3) tmp = bigDiamonTmp;
			else if (type == 4) tmp = tinyDiamonTmp;
			else if (type == -404) return per;
			else return "";
			return format(tmp, o)
		}
	},
	setupQZFL: function() {
		QZFL.config.gbEncoderPath = "http://" + window.imgcacheDomain + "/qzone/v5/toolpages/";
		QZFL.config.FSHelperPage =
			"/qzone/v5/toolpages/fp_gbk.html";
		QZFL.config.staticServer = "http://" + siDomain + "/ac/qzone/qzfl/lc/";
		QZFL.widget.seed.domain = "qzone.qq.com";
		QZONE.flashVersion = QZFL.media.getFlashVersion();
		delay(function() {
			var d = "qzs.qq.com";
			QZFL.shareObject.create("http://" + d + "/qzone/v5/toolpages/getset.swf")
		}, 800);
		QZFL.pageEvents.pageBaseInit()
	},
	initDressUp: function() {
		if (!QZONE.shop) QZONE.FrontPage.smart.delay("_qz_dressbase_js_load", function() {
				QZFL.imports("http://" + siDomain + "/c/=" + g_V.view, function() {
					QZONE.shop.initDressUp()
				})
			},
				2, 0, 3E3);
		else if (QZONE.shop.initDressUp) QZONE.shop.initDressUp()
	},
	initVipItems: function() {
		var isVip = QZONE.FrontPage.getVipStatus(),
			lv = QZONE.FrontPage.getUserBitmap(18, 4),
			isYearVip = QZONE.FrontPage.isUserVIPExpress(),
			diamon_str, d, isEverYear = QZONE.FrontPage.getUserBitmap(39);
		if (isVip) lv = Math.max(1, lv);
		if (lv > 0) if (d = $("diamon")) {
				QZFL.event.addEvent(d, "click", function() {
					var tag;
					if (isYearVip || isEverYear) tag = "isd.vip.year.qzonename";
					else tag = "isd.vip.normal.qzonename";
					window.TCISD && TCISD.hotClick(tag, "mall.qzone.qq.com");
					QZFL.event.preventDefault()
				});
				var _href;
				if (isYearVip || isEverYear) _href = "http://vip.qzone.com/year.html";
				else _href = "http://vip.qzone.com";
				d.href = _href;
				d.target = "_blank";
				QZ.G.s(d)
			}
	},
	createFeedback: function() {},
	createReport: function() {},
	showReportBox: function(uin) {
		if (QZONE.FP.showReportBox) QZONE.FP.showReportBox({
				appname: "qzone",
				subapp: "toolbar",
				jubaotype: "uin",
				uin: uin
			})
	},
	loadAccessory: function() {
		QZFL.imports("http://" + siDomain + "/qzone/v6/accessory/accessory.js", function() {
			ENV.set("accessoryLoaded",
				true);
			QZONE.Accessory.bootstrap()
		})
	},
	loadStatistic: function(callback) {
		var s = new QZFL.JSONGetter("http://" + g_Statistic_Domain + "/fcg-bin/cgi_emotion_list.fcg", "statistic", {
			uin: g_iUin,
			loginUin: g_iLoginUin,
			s: QZFL.widget.seed.get(),
			num: 3,
			noflower: 1
		}, "utf-8");
		s.onSuccess = QZFL.lang.isFunction(callback) ? callback : QZONE.Global.loadStatisticDefaultCallback;
		s.onError = function() {
			ENV.set("statisticDataLoaded", true)
		};
		s.send("visitCountCallBack")
	},
	loadStatisticDefaultCallback: function(o, o1, o2) {
		if (o && typeof o.firstlogin ==
			"number" && (g_NowTime - o.firstlogin < 60 * 60 * 24 * 30 * 3 || o.firstlogin == 0)) {
			if (location.href.indexOf("beginnerguide") == -1 && window.ownermode) {
				QZFL.imports("http://" + window.imgcacheDomain + "/qzone/v6/promotion/act/newuser_guide.js?max_age=2592000");
				QZONE.isNewUser = true
			}
		} else if (QZONE.OFP && QZONE.OFP.newbieSearch) {
			QZONE.OFP.newbieSearch.newuser_guide_loaded = 1;
			QZONE.OFP.newbieSearch.init()
		}
		ENV.set("statisticDataLoaded", true);
		ENV.set("firstlogin", o.firstlogin);
		if (o.firstlogin == 0) QZFL.widget.seed.update();
		QZFL.dataCenter.save("flowerScore",
			o);
		window.g_FlowerXDoc = o;
		QZFL.dataCenter.save("latest3Medal", o1);
		QZFL.dataCenter.save("feedsCount", o2);
		if (ENV.get("ownerInfoAppReady")) QZONE.App.OwnerInfoApp.showStatistic(o, o1, o2);
		if (ENV.get("flowerReady")) QZONE.shop.flower.showData();
		(function(o) {
			if (g_iUin == checkLogin()) {
				var fes = o["festival"] || 0;
				if (+fes) {
					window["festival_" + g_iUin] = 1;
					setTimeout(function() {
						if (window["festivalLoaded"]) for (var i in window["festivalLoaded"]) {
								if (+i < 0) continue;
								if (typeof window["festivalLoaded"][i] == "function") {
									window["festivalLoaded"][i]();
									try {
										delete window["festivalLoaded"][i]
									} catch (e) {}
								}
						}
					}, 1E3);
					var sp = document.createElement("span");
					sp.title = "\u5f00\u901a\u9ec4\u94bb\uff0c\u53c2\u4e0e\u9ec4\u94bb\u4efb\u52a1\uff0c\u83b7\u5f97\u611a\u4eba\u8282\u5c0f\u4e11\u5934\u50cf\uff01";
					sp.className = "skin_portrait_hat";
					sp.innerHTML = '<b style="display:none;">\u9690\u85cf\u5e3d\u5b50</b>';
					var my_pro = $e(sp).insertAfter($e("#my_portrait"));
					var my_portrait = $e("#div_ic_myinfo").find(".my_portrait");
					my_portrait.onMouseOver(function() {
						$e(sp).find("b").show()
					});
					my_portrait.onMouseOut(function() {
						$e(sp).find("b").hide()
					});
					$e(sp).find("b").onClick(function(e) {
						$e(sp).hide();
						var url = "http://w.qzone.qq.com/cgi-bin/tfriend/friend_close_festival.cgi";
						if (g_iUin == checkLogin()) {
							var s = new QZFL.FormSender(url, "post", {
								uin: g_iUin
							}, "gb2312");
							s.onSuccess = function(re) {
								if (re.ret == "succ") {
									$e(sp).remove();
									QZFL.widget.seed.update();
									window["festival_" + g_iUin] = undefined
								} else $e(sp).show(); if (window["festivalLoaded"]) for (var i in window["festivalLoaded"]) {
										if (+i > 0) continue;
										if (typeof window["festivalLoaded"][i] ==
											"function") {
											window["festivalLoaded"][i]();
											try {
												delete window["festivalLoaded"][i]
											} catch (e) {}
										}
								}
							};
							s.onError = function() {
								$e(sp).show()
							};
							s.send()
						}
					})
				}
			}
		})(o)
	},
	Event: {
		init: function() {
			QZONE.Global.Event.scrollEvent.init();
			QZONE.Global.Event.shakeEvent.init()
		},
		shakeEvent: {
			lock: false,
			count: 0,
			lastDirect: 1,
			timer: null,
			init: function() {
				var p = QZONE.Global.Event.shakeEvent;
				QZFL.event.addEvent(document, ua.firefox ? "DOMMouseScroll" : "mousewheel", function(e) {
					var d = e.wheelDelta || e.detail;
					d = d > 0 ? 1 : -1;
					if (p.lastDirect * d < 0 && p.lock) {
						p.count++;
						if (p.count > 6) {
							p.count = 0;
							clearTimeout(p.timer);
							p.lock = false;
							QZONE.qzEvent.dispatch("QZ_SHAKE")
						}
					}
					p.lastDirect = d;
					if (!p.lock) {
						p.timer = setTimeout(function() {
							p.count = 0;
							p.lock = false
						}, 1E3);
						p.lock = true
					}
				})
			}
		},
		scrollEvent: {
			dom: window,
			init: function() {
				var d;
				if (QZONE.dressDataCenter.isOldXWMode()) QZONE.Global.Event.scrollEvent.dom = $("LayPageContainer");
				d = QZONE.Global.Event.scrollEvent.dom;
				QZONE.qzEvent.register("QZ_SCROLL");
				QZFL.event.addEvent(d, "scroll", QZONE.Global.Event.scrollEvent._doScroll)
			},
			_doScroll: function() {
				var p =
					QZONE.Global.Event.scrollEvent,
					t = QZONE.FrontPage.getScrollTop(),
					isXW = QZONE.dressDataCenter.isOldXWMode(),
					tmp, d, w, h, ch, heightToBottom;
				if (isXW) t = QZONE.Global.Event.scrollEvent.dom.scrollTop;
				if (!p._lastHeight) p._lastHeight = t;
				w = QZONE.FrontPage.getCurrentAppWindow();
				if (Math.abs(t - p._lastHeight) > 40) {
					h = QZFL.dom.getScrollHeight();
					if (isXW) h = QZONE.Global.Event.scrollEvent.dom.scrollHeight;
					ch = QZFL.dom.getClientHeight();
					if (isXW) ch = 450;
					heightToBottom = h - (t + ch);
					if (w) try {
							if (w.QZONE && (tmp = w.QZONE.FP) && tmp.scrollNotify) tmp.scrollNotify(heightToBottom)
					} catch (e) {}
					QZONE.qzEvent.dispatch("QZ_SCROLL", {
						"heightToBottom": heightToBottom
					});
					p._lastHeight = t
				}
			}
		}
	}
};
(function() {
	QZONE.space._shortCutMap = {
		66: function() {
			QZONE.space.toApp("/blog")
		},
		71: function() {
			intoDressUpMode()
		},
		74: function() {
			intoDressUpMode()
		},
		77: function() {
			QZONE.space.toApp("/profile")
		},
		57: function() {
			QZONE.FrontPage.hideTopTips && QZONE.FrontPage.hideTopTips()
		}
	};
	var intoDressUpMode = function() {
		if (QZONE.custom && QZONE.custom.isDressMode()) {
			QZONE.custom.cancelModify();
			return false
		} else QZONE.space.toApp(!QZONE.FrontPage.isVipUser(1) ? "/custom/layout" : "/mall")
	};
	QZONE.space.shortCut = function(e) {
		var e =
			QZFL.event.getEvent(e),
			map;
		if (e && (e.ctrlKey || e.altKey)) {
			map = QZONE.space._shortCutMap;
			if (map[e.keyCode]) map[e.keyCode]()
		}
	};
	QZFL.event.addEvent(document, "keydown", QZONE.space.shortCut)
})();

function xExtend() {
	var args = arguments,
		a0 = args[0],
		a1 = args[1],
		a2 = args[2];
	if (typeof a0 == "function") {
		a1 = a1 || {};
		if (/function|number|string|undefined/.test(typeof a1)) return;
		var f, de, c, spargs;
		if ("function" != typeof a1["_constructor"]) f = function() {
				a0.apply(this, arguments)
		};
		else f = function() {
				spargs = arguments;
				a0.apply(this, spargs);
				a1["_constructor"].apply(this, spargs)
		};
		for (var i in a0.prototype) f.prototype[i] = a0.prototype[i];
		f.prototype.base = a0;
		var grap = /^name|_constructor|static|base$/;
		for (var i in a1) {
			if (grap.test(i)) continue;
			f.prototype[i] = a1[i]
		}
		if (a1["static"]) for (var i in a1["static"]) f[i] = a1["static"][i];
		if ("undefined" != typeof a1["name"] && /^[a-zA-Z]\w*$/.test(a1["name"])) {
			var s = "object" == typeof a1["scope"] && a1["scope"] || window;
			s[a1["name"]] = f
		}
		return f
	}
}
(function() {
	var cache = {};
	var each = QZFL.object.each,
		extend = QZFL.object.extend,
		format = QZFL.string.format,
		getXY = QZFL.dom.getXY,
		getSize = QZFL.dom.getSize;
	var JsonRequest = xExtend(function() {}, {
		_constructor: function(url, conf) {
			var t = this,
				jg;
			if (conf.iscache && cache[url]) {
				conf.callback.apply(null, cache[url]);
				return
			} else conf.params["_"] = +new Date;
			this.conf = conf;
			jg = new QZFL.JSONGetter(url, null, conf.params, conf.charset);
			jg.onSuccess = function() {
				cache[url] = arguments;
				conf.callback.apply(null, arguments)
			};
			jg.onError = function() {
				if (t.exception instanceof Exception) t.exception.handle(t)
			};
			this.sender = jg
		},
		request: function() {
			this.sender && this.sender.send(this.conf.fnname || "_Callback")
		}
	});
	var IframeRequest = xExtend(function() {}, {
		_constructor: function(url, conf) {
			var t = this,
				iframe;
			if (cache[url]) iframe = cache[url];
			iframe = document.createElement("iframe");
			iframe.frameBorder = 0;
			iframe.width = conf.width || "100%";
			iframe.height = conf.height || "100%";
			iframe.setAttribute("allowTransparency", true);
			iframe.scrolling = "no";
			t.iframe = iframe;
			t.conf = conf;
			t.url = url
		},
		request: function() {
			var t = this;
			t.conf.renderTo.innerHTML = "";
			if (ua.firefox) setTimeout(function() {
					t.iframe.src = t.url;
					t.conf.renderTo.appendChild(t.iframe)
				}, 100);
			else {
				t.iframe.src = t.url;
				t.conf.renderTo.appendChild(t.iframe)
			}
		}
	});
	var XMLRequest = xExtend(function() {}, {
		_xhr: null,
		_constructor: function(url, conf) {
			if (conf.params) {
				var a = [];
				for (var i in conf.params) a.push(i + "=" + conf.params[i]);
				url = url + (url.indexOf("?") > 0 ? "&" : "?") + a.join("&")
			}
			this.xhr = new QZFL.XHR(url, null, conf["method"] ||
				"GET");
			this.xhr.onSuccess = function(t) {
				conf.callback(t.xmlDom, {})
			}
		},
		request: function() {
			var t = this;
			if (ua.firefox) setTimeout(function() {
					t.xhr.send()
				}, 100);
			else t.xhr.send()
		}
	});
	var RequestFactory = xExtend(function() {}, {
		"name": "RequestFactory",
		"static": {
			create: function(url, conf) {
				conf = extend({
					charset: "utf-8",
					dataType: "js",
					params: {},
					iscache: true,
					callback: function() {}
				}, conf || {});
				if (typeof conf.params === "string");
				var t = this;
				switch (conf.dataType) {
					case "xml":
						return new XMLRequest(url, conf);
					case "iframe":
						return new IframeRequest(url,
							conf);
					case "js":
					default:
						return new JsonRequest(url, conf)
				}
			}
		}
	})
})();
(function(document) {
	var each = QZFL.object.each,
		extend = QZFL.object.extend,
		format = QZFL.string.format,
		getXY = QZFL.dom.getXY,
		getSize = QZFL.dom.getSize,
		E = QZFL.event;
	var EventManager = xExtend(function() {}, {
		_constructor: function() {
			this.list = []
		},
		addFirst: function(fn) {
			this.list.unshift(fn)
		},
		add: function(fn) {
			this.list.push(fn)
		},
		fire: function() {
			var a = arguments,
				r;
			QZFL.object.each(this.list, function(fn) {
				r = fn.apply(a[0] || this, Array.prototype.slice.call(a, 1))
			});
			return r
		},
		remove: function(fn) {
			var t = this;
			QZFL.object.each(this.list, function(f, i) {
				if (fn == f) {
					t.list.splice(i, 1);
					return false
				}
			})
		},
		clear: function() {
			this.list = []
		},
		"name": "EventManager"
	})
})(document);
(function(document) {
	var each = QZFL.object.each,
		extend = QZFL.object.extend,
		format = QZFL.string.format,
		getXY = QZFL.dom.getXY,
		getSize = QZFL.dom.getSize,
		E = QZFL.event;
	var Sprite = xExtend(function() {}, {
		_constructor: function(name, conf) {
			var t = this;
			t.name = name;
			t.conf = extend({
				autoShow: 1
			}, conf);
			each(["onMove", "onDestroy", "onRightBoundary", "onLeftBoundary", "onTopBoundary", "onBottomBoundary"], function(n) {
				t[n] = new EventManager
			})
		},
		setContent: function(html) {
			this.dom.innerHTML = html
		},
		dom: null,
		create: function() {
			var t = this,
				conf = t.conf;
			if (this.dom && this.dom.nodeType == 1) return this.dom.style.display = "block", this.dom;
			var s = document.createElement("div");
			s.style.cssText = "position:absolute; z-index:10000;" + (conf["cssText"] || "");
			if ("string" == typeof conf["class"] && conf["class"] != "") s.className = conf["class"];
			if (1 == conf["autoShow"]) s.style.display = "block";
			document.body.appendChild(s);
			this.dom = s;
			return s
		},
		hide: function() {
			if (this.dom) this.dom.style.display = "none"
		},
		"name": "Sprite"
	});
	var MouseSprite = xExtend(Sprite, {
		_constructor: function(name,
			conf) {
			var t = this,
				xy = getXY(document.body),
				size = getSize(document.body);
			t.conf = extend({
				scope: window,
				rect: {
					x: [xy[0], size[0]],
					y: [xy[1], size[1]]
				}
			}, conf)
		},
		working: 0,
		outofX: function(x) {},
		work: function() {
			var t = this,
				s = t.dom,
				sx, sy, E = QZFL.event;
			if (!s) return;

			function getPos(e) {
				var x = e.clientX + QZFL.dom.getScrollLeft(),
					y = e.clientY + QZFL.dom.getScrollTop();
				if (x > t.conf.rect.x[1]) {
					x = t.conf.rect.x[1];
					t.onRightBoundary.fire(t, x)
				}
				if (x < t.conf.rect.x[0]) {
					x = t.conf.rect.x[0];
					t.onLeftBoundary.fire(t, x)
				}
				if (y > t.conf.rect.y[1]) {
					y =
						t.conf.rect.y[1];
					t.onBottomBoundary.fire(t, y)
				}
				if (y < t.conf.rect.y[0]) {
					y = t.conf.rect.y[0];
					t.onTopBoundary.fire(t, y)
				}
				return [x, y]
			}
			var movefn = function(e) {
				if (!t.working) return;
				var xy = getPos(e);
				s.style.display = "block";
				s.style.left = xy[0] + "px";
				s.style.top = xy[1] + "px";
				t.onMove.fire(t, xy[0], xy[1], e.clientX, e.clientY);
				window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
			};
			var upfn = function(e) {
				t.destroy(sx, sy)
			};
			E.addEvent(document, "mousemove", movefn);
			E.addEvent(document, "mouseup",
				upfn);
			t.working = 1;
			t.destroy = function(x, y) {
				this.working = 0;
				this.dom.style.display = "none";
				E.removeEvent(document, "mousemove", movefn);
				E.removeEvent(document, "mouseup", upfn);
				this.onDestroy.fire(this, x, y)
			}
		},
		"name": "MouseSprite"
	})
})(document);
(function(document) {
	var each = QZFL.object.each,
		extend = QZFL.object.extend,
		format = QZFL.string.format,
		getXY = QZFL.dom.getXY,
		getSize = QZFL.dom.getSize,
		E = QZFL.event;
	var DragDropRect = xExtend(function() {}, {
		_constructor: function(container, conf) {
			var con = $(container),
				rule;
			conf = conf || {};
			this.conf = conf || {};
			this.region = con;
			this.atBoundary = -1;
			var t = this;
			each(["onDragging", "onDragStart", "onDragEnd"], function(n) {
				t[n] = new EventManager
			});
			t.fix = true;
			if (typeof conf.fix == "boolean") t.fix = conf.fix;
			t.startPos = [0, 0];
			t.mouseSprite =
				t.conf.needSprite || new MouseSprite("dragdrop_module", {
				scope: t,
				"class": "mod_wrap_hd_ondrag mod_wrap_hd",
				cssText: ""
			});
			t.mouseSprite.onMove.add(function(x, y, ex, ey) {
				t.onDragging.fire(t, t.dragItems[t.current], x, y, ex, ey)
			});
			t.mouseSprite.onDestroy.add(function(x, y) {
				t.onDragEnd.fire(t, t.dragItems[t.current], x, y);
				t.mouseSprite.hide();
				t.current = null
			});
			t.mouseSprite.onRightBoundary.add(function(x) {
				t.atBoundary = 1
			});
			t.mouseSprite.onLeftBoundary.add(function(x) {
				t.atBoundary = 0
			});
			t.setupDrag();
			DragDropRect.list[container] =
				t
		},
		dragItems: [],
		setupDrag: function() {
			var t = this,
				r = t.region,
				conf = this.conf,
				dragitems, sel, dragitems, curr;
			dragitems = conf.items || $e(conf.selector || conf.items, r).elements;
			each(dragitems, function(n, i) {
				t.dragItems[i] = n;
				n.style.cursor = "move";
				E.addEvent(n, "mousedown", function(e) {
					var el = e.target || e.srcElement;
					if (el.nodeName == "A" || el.nodeName == "BUTTON") return;
					t.current = i;
					n.setAttribute("draggable", true);
					var p = getParent(n, function(nn) {
						return nn.id.indexOf("QM_Container_") == 0
					});
					t.startPos = getXY(p);
					t.onDragStart.fire(t,
						this, e.clientX, e.clientY);
					var xy = getXY(t.region),
						size = getSize(t.region);
					t.mouseSprite.create();
					t.mouseSprite.hide();
					t.mouseSprite.setContent("<strong>" + el.innerHTML.replace(/<[^>]*>/g, "") + "</strong>");
					t.mouseSprite.work()
				})
			})
		},
		addDragItem: function(n) {
			var t = this,
				r = t.region,
				conf = this.conf,
				dragitems, sel, dragitems, curr, i;
			t.dragItems.push(n);
			i = t.dragItems.length - 1;
			n.style.cursor = "move";
			E.addEvent(n, "mousedown", function(e) {
				E.preventDefault(e);
				var el = e.target || e.srcElement;
				if (el.nodeName == "A" || el.nodeName ==
					"BUTTON") return;
				t.current = i;
				n.setAttribute("draggable", true);
				var p = getParent(n, function(nn) {
					return nn.id.indexOf("QM_Container_") == 0
				});
				t.startPos = getXY(p);
				t.onDragStart.fire(t, this, e.clientX, e.clientY);
				var xy = getXY(t.region),
					size = getSize(t.region);
				t.mouseSprite.create();
				t.mouseSprite.hide();
				t.mouseSprite.setContent("<strong>" + el.innerHTML.replace(/<[^>]*>/g, "") + "</strong>");
				t.mouseSprite.work()
			})
		},
		"name": "DragDropRect",
		"static": {
			list: {},
			getInstance: function(name) {
				return DragDropRect.list[name]
			}
		}
	})
})();
window.QZONE = window.QZONE || {};
(function() {
	if (!window.ua) {
		window.ua = {};
		window.ua.ie = 6;
		var agent = navigator.userAgent;
		(window.XMLHttpRequest || agent.indexOf("MSIE 7.0") > -1) && (window.ua.ie = 7);
		(window.XDomainRequest || agent.indexOf("Trident/4.0") > -1) && (window.ua.ie = 8);
		agent.indexOf("Trident/5.0") > -1 && (window.ua.ie = 9);
		agent.indexOf("Trident/6.0") > -1 && (window.ua.ie = 10)
	}
})();
QZONE.CPU = QZONE.CPU || function() {
	this._pointArr = [];
	this._timer = null;
	this._config = {
		MAX: 3,
		DELAY: 50,
		DELAY_MAX_DEFAULT: 100,
		DELAY_HACK: 0,
		DELAY_MAX_REAL: 100
	};
	if (ua && ua.ie && ua.ie < 9) this._config.DELAY_HACK = 13;
	this._count = 1;
	this._lastPer = 0;
	this._count_sum = this._config.DELAY_MAX_DEFAULT;
	this._lock = false;
	this._detect = function(callback) {
		var p = this,
			c = p._config;
		if (p._lock) {
			callback(p._lastPer);
			return
		}
		p._lock = true;
		p._pointArr.push(new Date);
		p._timer = setInterval(function() {
			p._pointArr.push(new Date);
			if (p._pointArr.length >
				c.MAX) {
				p._output(callback);
				p._pointArr = [];
				clearInterval(p._timer);
				p._lock = false
			}
		}, this._config.DELAY)
	};
	this._output = function(callback) {
		var p = this,
			sum = 0,
			d, c = this._config;
		for (var i = p._pointArr.length; i--;) if (i > 0) sum += p._pointArr[i] - p._pointArr[i - 1] - c.DELAY_HACK;
		d = sum / (p._pointArr.length - 1);
		if (d > c.DELAY_MAX_DEFAULT && d < c.DELAY_MAX_DEFAULT + c.DELAY) {
			p._count++;
			p._count_sum += d;
			c.DELAY_MAX_REAL = Math.round(p._count_sum / p._count)
		}
		if (d > c.DELAY_MAX_DEFAULT + c.DELAY) d = c.DELAY_MAX_DEFAULT + c.DELAY;
		var per = Math.round((d -
			c.DELAY) / (c.DELAY_MAX_REAL - c.DELAY) * 100) / 100;
		per = per > 1 ? 1 : per;
		per = per < 0 ? 0 : per;
		if (d < p.DELAY) per = 0;
		p._lastPer = per;
		callback(per)
	};
	this.getPercent = function(callback) {
		this._detect(callback)
	}
};
QZONE.TaskManager = QZONE.TaskManager || {
	pool: [],
	FREE_CPU_PER: 20,
	CPU_PER_MISSION: 1,
	LAST_CPU_PER: 0,
	lock: false,
	cpu: null,
	hasInit: false,
	DELAY: 50,
	init: function() {
		var p = QZONE.TaskManager;
		p.cpu = new QZONE.CPU;
		p.hasInit = true;
		p.adjustNum.doit()
	},
	adjustNum: {
		cpu: null,
		lock: false,
		timer: null,
		doit: function() {
			var p = QZONE.TaskManager.adjustNum;
			if (!p.cpu) p.cpu = new QZONE.CPU;
			p.stop();
			p.timer = setInterval(function() {
				if (p.lock) return;
				p.lock = true;
				p.cpu.getPercent(function(cpuPer) {
					p.lock = false;
					QZONE.TaskManager.mission.adjustNum(cpuPer)
				})
			},
				QZONE.TaskManager.DELAY)
		},
		stop: function() {
			clearInterval(QZONE.TaskManager.adjustNum.timer)
		}
	},
	load: function(callback) {
		var p = QZONE.TaskManager;
		if (!p.hasInit) p.init();
		p.pool.push(callback);
		p.run()
	},
	run: function() {
		var p = QZONE.TaskManager;
		if (p.lock) return;
		p.lock = true;
		p.cpu.getPercent(p.doit)
	},
	doMission: function(count) {
		var p = QZONE.TaskManager,
			fn, count = count || 1;
		for (var i = count; i--;) {
			if (p.pool.length == 0) break;
			fn = p.pool.shift();
			if (typeof fn == "function") fn()
		}
	},
	doit: function(cpuPer) {
		var p = QZONE.TaskManager,
			fn;
		p.lock = false;
		if (!p.mission.lock) p.mission.lock = true;
		var freePer = p.FREE_CPU_PER / 100 - cpuPer,
			c;
		if (freePer > 0) {
			c = p.mission.getNum();
			p.doMission(c)
		} else;
		var time = cpuPer * 100 > p.FREE_CPU_PER ? 1E3 : 50;
		if (p.pool.length > 0) setTimeout(p.run, time);
		else return
	},
	mission: {
		index_plus: 1,
		index_minus: 1,
		lock: false,
		num: 1,
		step: 2,
		statPool: [],
		STAT_POOL_MAX: 100,
		currentCPUPer: 0,
		meetErrorFlag: 0,
		numCosHighCPU: [],
		lastChangeObj: {
			act: "plus",
			per: 0
		},
		plus: function(currentCPUPer) {
			var p = QZONE.TaskManager.mission,
				currentCPUUsedPer = Math.round(currentCPUPer /
					QZONE.TaskManager.FREE_CPU_PER * 100);
			if (currentCPUUsedPer < 25) {
				p.index_plus++;
				p.num += Math.pow(p.step, p.index_plus)
			} else if (currentCPUUsedPer < 50) {
				var i = p.index_plus - 1;
				if (i < 0) i = 0;
				p.num += Math.pow(p.step, i)
			} else if (currentCPUUsedPer < 100) {
				var i = p.index_plus - 2;
				if (i < 0) i = 0;
				p.num += Math.pow(p.step, i)
			}
			p.lock = false;
			p.currentCPUPer = currentCPUPer;
			p.lastChangeObj = {
				act: "plus",
				num: p.num,
				per: currentCPUPer
			}
		},
		minus: function(currentCPUPer, isError) {
			var p = QZONE.TaskManager.mission,
				currentCPUUsedPer = Math.round(currentCPUPer /
					QZONE.TaskManager.FREE_CPU_PER * 100);
			if (isError) p.num -= 1;
			else if (currentCPUUsedPer > 80) {
				p.num /= 4;
				p.numCosHighCPU.push(p.lastChangeObj.num)
			} else if (currentCPUUsedPer > 50) p.num /= 3;
			else p.num /= 1.1;
			p.index_plus -= 2;
			if (p.index_plus < 0) p.index_plus = 0;
			if (p.num <= 0) p.num = 1;
			p.lock = false;
			p.currentCPUPer = currentCPUPer;
			p.lastChangeObj = {
				act: "minus",
				num: p.num,
				per: currentCPUPer
			}
		},
		getNum: function() {
			var p = QZONE.TaskManager.mission;
			p.num = Math.ceil(p.num);
			return p.num
		},
		calculateMissionPer: function() {
			var p = QZONE.TaskManager.mission,
				perSum = 0,
				numSum = 0,
				po = p.statPool,
				a = [];
			if (po.length < p.STAT_POOL_MAX) return 0;
			else {
				for (var i = po.length; i--;) if (po[i] && po[i - 1]) {
						perSum += Math.round(po[i].per);
						numSum += Math.round(po[i - 1].num);
						a.push("per:" + i + "_" + Math.round(po[i].per) + "     num:" + i + "_" + po[i - 1].num + "    <br/>")
					}
				return 40 * numSum / perSum
			}
		},
		adjustNum: function(per) {
			var p = QZONE.TaskManager.mission,
				_per = Math.round(per * 100);
			if (p.lock) {
				var o = p.lastChangeObj,
					_lastUsePer = p.lastChangeObj.per / QZONE.TaskManager.FREE_CPU_PER;
				if (!p.meetErrorFlag && (o.act ==
					"plus" && _per < o.per || o.act == "minus" && _per > o.per)) {
					p.minus(_per, 1);
					p.meetErrorFlag = 1
				} else {
					p.meetErrorFlag = 0;
					if (_per < QZONE.TaskManager.FREE_CPU_PER) p.plus(_per);
					else p.minus(_per)
				}
			}
		}
	}
};
QZONE.CPUMonitorAccessory = QZONE.CPUMonitorAccessory || {
	container: null,
	btnContainer: null,
	isHidden: false,
	init: function() {
		var p = QZONE.CPUMonitorAccessory;
		p.container = $("qz_cpu_view_container");
		p.initBtnContainer();
		p.CloseBtn.init();
		p.PauseBtn.init();
		p.ZoomBtn.init()
	},
	initBtnContainer: function() {
		var p = QZONE.CPUMonitorAccessory;
		var div = document.createElement("div");
		div.id = "qz_cpu_btn_container";
		p.btnContainer = div;
		div.style.cssText = "position:absolute;width:300px;top:75px;float:right;";
		p.container.parentNode.appendChild(div)
	},
	addBtn: function(name, ns) {
		var b = document.createElement("button");
		b.innerHTML = name;
		b.id = "qz_cpu_btn_" + name;
		b.style.cssText = "text-align:center;display:inline-block;border:1px solid;width:50px;background-color:black;color:#00FF00;";
		ns.btnDom = b;
		QZONE.CPUMonitorAccessory.btnContainer.appendChild(b);
		QZFL.event.addEvent(b, "click", ns[name])
	},
	CloseBtn: {
		btnDom: null,
		init: function() {
			QZONE.CPUMonitorAccessory.addBtn("hide", QZONE.CPUMonitorAccessory.CloseBtn)
		},
		hide: function() {
			var p = QZONE.CPUMonitorAccessory;
			p.isHidden =
				true;
			p.container.style.display = p.container.style.display == "none" ? "" : "none";
			p.PauseBtn.isPause = !p.PauseBtn.isPause;
			p.CloseBtn.btnDom.innerHTML = p.container.style.display == "none" ? "show" : "hide"
		},
		show: function() {
			var p = QZONE.CPUMonitorAccessory;
			p.isHidden = false;
			p.container.style.display = "";
			p.PauseBtn.isPause = false
		}
	},
	PauseBtn: {
		btnDom: null,
		init: function() {
			QZONE.CPUMonitorAccessory.addBtn("pause", QZONE.CPUMonitorAccessory.PauseBtn)
		},
		isPause: false,
		pause: function() {
			var p = QZONE.CPUMonitorAccessory.PauseBtn;
			p.isPause = !p.isPause;
			if (p.isPause) QZONE.CPUMonitor.clear();
			else QZONE.CPUMonitor.run();
			p.btnDom.innerHTML = p.isPause ? "resume" : "pause"
		}
	},
	ZoomBtn: {
		btnDom: null,
		zoomLevel: 0,
		init: function() {
			if (ua.ie && ua.ie < 9) return;
			QZONE.CPUMonitorAccessory.addBtn("zoom", QZONE.CPUMonitorAccessory.ZoomBtn)
		},
		zoom: function() {
			var map = [1, 2, 3, 0.5],
				p = QZONE.CPUMonitorAccessory.ZoomBtn;
			p.zoomLevel++;
			p.zoomLevel %= map.length;
			var d = $("qz_cpu_view_container");
			if (d) {
				d.style.zoom = map[p.zoomLevel];
				var p1 = QZFL.dom.getPosition(d);
				QZONE.CPUMonitorAccessory.btnContainer.style.top =
					p1.height + "px"
			}
		}
	},
	Stat: {
		dataArray: [],
		timeArray: [],
		sizeArray: [],
		flagArr: [],
		cpuRangeArr: [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0],
		timeRangeArr: [0, 1E4],
		COUNT: 0,
		totalSize: 0,
		init: function() {
			setTimeout(function() {
				if (p.COUNT == 0) QZONE.CPUMonitor.clear()
			}, 2E4)
		},
		doCPUStat: function(flagArr, opt) {
			var a = [],
				p = QZONE.CPUMonitorAccessory.Stat;
			if (flagArr && flagArr.length > 0) p.flagArr = flagArr;
			else return;
			p.COUNT++;
			if (QZONE.CPUMonitor.isPause) QZONE.CPUMonitor.runStat();
			if (opt) {
				if (typeof opt.cpuRangeArr != "undefined" && opt.cpuRangeArr.length >
					0) p.cpuRangeArr = opt.cpuRangeArr;
				if (typeof opt.timeRangeArr != "undefined" && opt.timeRangeArr.length == 2) p.timeRangeArr = opt.timeRangeArr
			}
			setTimeout(function(b, e) {
				return function() {
					for (var i = 0, len = p.cpuRangeArr.length; i < len; i++) a.push(p.getOverPerAmount(p.cpuRangeArr[i], b, e));
					var totalSize = Math.round(p.getTotalSize(b, e));
					a.push(totalSize);
					p.report(a);
					p.COUNT--;
					if (p.COUNT == 0) QZONE.CPUMonitor.clearStat()
				}
			}(p.timeRangeArr[0], p.timeRangeArr[1]), p.timeRangeArr[1] - p.timeRangeArr[0])
		},
		mark: function(per) {
			var p =
				QZONE.CPUMonitorAccessory.Stat;
			p.dataArray.push(per);
			p.timeArray.push(new Date);
			var len = p.timeArray.length;
			if (len >= 2) {
				p.totalSize += (p.dataArray[len - 1] + p.dataArray[len - 2]) * (p.timeArray[len - 1] - p.timeArray[len - 2]) / 2;
				p.sizeArray.push(p.totalSize)
			} else p.sizeArray.push(0)
		},
		getTimeIndex: function(time, isEndTime) {
			var p = QZONE.CPUMonitorAccessory.Stat.timeArray;
			for (var i = 0; i < p.length; i++) if (!isEndTime) {
					if (p[i] - p[0] >= time) return i
				} else
			if (p[i] - p[0] > time) return i - 1;
			return p.length
		},
		getTotalSize: function(beginTime,
			endTime) {
			var p = QZONE.CPUMonitorAccessory.Stat,
				d = QZONE.CPUMonitor.DELAY * 2,
				begin = p.getTimeIndex(beginTime),
				end = p.getTimeIndex(endTime, 1),
				totalSize = 0,
				_e;
			_e = p.sizeArray[end];
			if (!_e) _e = p.sizeArray[p.sizeArray.length - 1];
			totalSize = _e - p.sizeArray[begin];
			return totalSize
		},
		getTotalSizeAsyn: function(beginTime, duration, callback) {},
		getOverPerAmount: function(per, beginTime, endTime) {
			var p = QZONE.CPUMonitorAccessory.Stat,
				d = QZONE.CPUMonitor.DELAY * 2,
				begin = p.getTimeIndex(beginTime),
				end = p.getTimeIndex(endTime, 1),
				da = p.dataArray,
				sum = 0;
			for (var i = begin; i < end; i++) if (typeof da[i] != "undefined" && da[i] >= per) sum++;
			return sum
		},
		report: function(dataArray) {
			var p = QZONE.CPUMonitorAccessory.Stat,
				url = [],
				t, flagStr = p.flagArr,
				n;
			if ((t = dataArray).length < 1) return;
			url.push("http://isdspeed.qq.com/cgi-bin/r.cgi?");
			for (var i = 0, len = t.length; i < len; i++) if (typeof t[i] != "undefined") {
					if (i < len - 1) n = t[i] * 1E3;
					else n = t[i] * 10;
					url.push(i + 1, "=", n, "&")
				}
			url.push("13=", t[0] / t[10] * 100 * 1E3, "&");
			t = flagStr;
			for (var i = 0, len = 6; i < len; ++i) if (t[i]) url.push("flag", i + 1, "=",
						t[i], "&");
			url.push("grz_cpu_stat=", Math.random());
			QZFL.pingSender && QZFL.pingSender(url.join(""))
		},
		lagOPT: {
			per_line: [],
			time_line: [],
			size_line: [],
			averageTime: 200,
			totalSize: 0,
			getLagCount: function(time) {
				var p = QZONE.CPUMonitorAccessory.Stat.lagOPT;
				p.time_line.push(time)
			},
			getStepPer: function(time, per) {
				var p = QZONE.CPUMonitorAccessory.Stat.lagOPT,
					cd;
				p.time_line.push(time);
				var len = p.time_line.length;
				if (len == 1) cd = p.averageTime;
				else cd = time - p.time_line[len - 2]; if (cd < p.averageTime) cd = p.averageTime;
				var _stepPer =
					(cd - p.averageTime) / p.averageTime;
				return _stepPer
			}
		}
	}
};
QZONE.CPUMonitor = QZONE.CPUMonitor || {
	PANEL_WIDTH: 200,
	PANEL_HEIGHT: 35,
	MAX_NUM: 100,
	STEP_WIDTH: 3,
	ZOOM: 1,
	CURRENT_X: 0,
	LAST_X: 0,
	LAST_Y: 0,
	CPUMonitorCanvas: [],
	point_list: [],
	point_line: [],
	DELAY: 100,
	canvasDom: null,
	canvas: null,
	lock: false,
	cpu: null,
	container: null,
	hasInit: false,
	debugMode: false,
	statDebugMode: false,
	CPUMoniterCounter: 0,
	timerID: null,
	isPause: false,
	init: function() {
		var p = QZONE.CPUMonitor;
		if (location.href.indexOf("CPU_DEBUGGER_TURN_ON") > 0) p.debugMode = true;
		if (location.href.indexOf("CPU_STAT_DEBUGGER_TURN_ON") >
			0) p.statDebugMode = true;
		if (QZONE.CPUMonitorAccessory.isHidden) {
			QZONE.CPUMonitorAccessory.CloseBtn.show();
			return
		}
		if (p.debugMode && !p.canvas) {
			p.ZOOM = window.CPU_DEBUGGER_ZOOM;
			p.PANEL_WIDTH *= p.ZOOM;
			p.PANEL_HEIGHT *= p.ZOOM;
			p.STEP_WIDTH = p.PANEL_WIDTH / p.MAX_NUM;
			p.LAST_Y = p.PANEL_HEIGHT;
			p.initContainer();
			if (!p.Drawer.initCanvas()) return;
			QZONE.CPUMonitorAccessory.init()
		}
		if (p.hasInit) return;
		p.cpu = new QZONE.CPU;
		p.run();
		p.hasInit = true
	},
	run: function() {
		var p = QZONE.CPUMonitor;
		if (QZONE.CPUMonitorAccessory.PauseBtn.isPause) return;
		clearInterval(QZONE.CPUMonitor.timerID);
		p.timerID = setInterval(function() {
			if (p.lock) return;
			p.lock = true;
			p.cpu.getPercent(function(per) {
				p.lock = false;
				var stepPer = QZONE.CPUMonitorAccessory.Stat.lagOPT.getStepPer(new Date, per);
				var n = Math.floor(stepPer / 0.5) + 1;
				for (var i = 0; i < n; i++) p.beginToDraw(per)
			})
		}, p.DELAY);
		QZONE.CPUMonitor.isPause = false
	},
	clear: function() {
		clearInterval(QZONE.CPUMonitor.timerID);
		QZONE.CPUMonitor.isPause = true
	},
	clearStat: function() {
		var p = QZONE.CPUMonitor;
		if (!p.debugMode) p.clear()
	},
	runStat: function() {
		QZONE.CPUMonitor.run()
	},
	beginToDraw: function(per) {
		var p = QZONE.CPUMonitor,
			po;
		QZONE.CPUMonitorAccessory.Stat.mark(per);
		if (p.statDebugMode) {
			if (!p.CPUMoniterCounter) p.CPUMoniterCounter = 1;
			else p.CPUMoniterCounter++;
			console.log("CPUMoniterCounter:" + p.CPUMoniterCounter)
		}
		if (p.debugMode) {
			var y = p.PANEL_HEIGHT - per * p.PANEL_HEIGHT,
				x = p.CURRENT_X + p.STEP_WIDTH;
			p.Drawer.PercentNum.show(Math.round(per * 100));
			if (p.point_list.length == p.MAX_NUM) {
				po = p.point_list.shift();
				p.LAST_X = po[0];
				p.LAST_Y = po[1];
				p.point_list.push([p.PANEL_WIDTH, y]);
				p.Drawer.drawline()
			} else {
				p.Drawer.drawPoint(x,
					y);
				p.point_list.push([x, y])
			}
		}
	},
	initContainer: function() {
		var c = document.createElement("DIV");
		c.id = "qz_cpu_container";
		document.body.appendChild(c);
		c.style.cssText = "position:fixed;left:0px;top:0px;z-index:99999;cursor:pointer";
		var c1 = document.createElement("DIV");
		c1.id = "qz_cpu_view_container";
		c.appendChild(c1);
		QZONE.CPUMonitor.container = c1;
		QZFL.dragdrop.registerDragdropHandler(c, c)
	},
	Drawer: {}
};
QZONE.CPUMonitorCanvas = QZONE.CPUMonitorCanvas || {
	initCanvas: function() {
		var p = QZONE.CPUMonitor;
		p.canvasDom = document.createElement("CANVAS");
		if (p.canvasDom && typeof p.canvasDom.getContext == "function") {
			p.canvasDom.id = "qz_canvas";
			p.canvasDom.width = p.PANEL_WIDTH;
			p.canvasDom.height = p.PANEL_HEIGHT;
			p.container.appendChild(p.canvasDom);
			p.canvas = p.canvasDom.getContext("2d");
			var c = p.canvas;
			c.fillStyle = "rgb(0,0,0)";
			c.lineWidth = p.ZOOM;
			c.lineCap = "round";
			c.lineJoin = "round";
			c.fillRect(0, 0, p.PANEL_WIDTH, p.PANEL_HEIGHT);
			c.beginPath();
			c.strokeStyle = "rgb(0,255,0)";
			c.stroke();
			p.Drawer.PercentNum.init();
			return true
		}
		return false
	},
	drawPoint: function(x, y) {
		var p = QZONE.CPUMonitor,
			c = p.canvas;
		var g = c.createLinearGradient(0, 0, 0, p.PANEL_HEIGHT);
		g.addColorStop(0, "rgb(255,0,0)");
		g.addColorStop(0.6, "#FFFF00");
		g.addColorStop(1, "rgb(0,255,0)");
		c.strokeStyle = g;
		c.beginPath();
		c.moveTo(p.LAST_X, p.LAST_Y);
		c.lineTo(x, y);
		p.CURRENT_X = x;
		p.LAST_X = x;
		p.LAST_Y = y;
		c.stroke()
	},
	drawline: function() {
		var p = QZONE.CPUMonitor,
			po;
		p.canvas.fillRect(0, 0, p.PANEL_WIDTH,
			p.PANEL_HEIGHT);
		for (var i = 0, len = p.point_list.length; i < len; i++) {
			po = p.point_list[i];
			QZONE.CPUMonitor.Drawer.drawPoint(po[0], po[1]);
			po[0] -= p.STEP_WIDTH
		}
	},
	PercentNum: {
		PANEL_WIDTH: 50,
		PANEL_HEIGHT: 35,
		canvasDom: null,
		canvas: null,
		init: function() {
			var p = QZONE.CPUMonitor.Drawer.PercentNum;
			p.PANEL_WIDTH *= QZONE.CPUMonitor.ZOOM;
			p.PANEL_HEIGHT *= QZONE.CPUMonitor.ZOOM;
			p.canvasDom = document.createElement("CANVAS");
			if (p.canvasDom && typeof p.canvasDom.getContext == "function") {
				p.canvasDom.id = "qz_canvas_per_num";
				p.canvasDom.style.cssText =
					"left:" + QZONE.CPUMonitor.PANEL_WIDTH + "px;top:0px;";
				p.canvasDom.width = p.PANEL_WIDTH;
				p.canvasDom.height = p.PANEL_HEIGHT;
				QZONE.CPUMonitor.container.appendChild(p.canvasDom);
				p.canvas = p.canvasDom.getContext("2d");
				var c = p.canvas;
				c.fillStyle = "rgb(0,0,0)";
				c.lineWidth = p.ZOOM;
				c.lineCap = "round";
				c.lineJoin = "round";
				c.fillRect(0, 0, p.PANEL_WIDTH, p.PANEL_HEIGHT);
				c.beginPath();
				c.stroke();
				var fontSize = "40",
					fontWeight = "normal",
					fontStyle = "normal",
					fontFace = "arial";
				c.font = fontWeight + " " + fontStyle + " " + fontSize + "px " + fontFace;
				c.fillStyle = "#ff0000";
				c.textBaseLine = "middle";
				c.textAlign = "center";
				c.fillText("abc", 0, 0);
				return true
			}
			return false
		},
		clear: function() {
			var p = QZONE.CPUMonitor.Drawer.PercentNum;
			p.canvas.fillStyle = "rgb(0,0,0)";
			p.canvas.fillRect(0, 0, p.PANEL_WIDTH, p.PANEL_HEIGHT)
		},
		show: function(num) {
			var p = QZONE.CPUMonitor.Drawer.PercentNum;
			p.clear();
			p.canvas.fillStyle = "#00ff00";
			if (num > 25) p.canvas.fillStyle = "#FFFF00";
			if (num > 50) p.canvas.fillStyle = "#FF6600";
			if (num > 80) p.canvas.fillStyle = "#FF0000";
			p.canvas.fillText(num + "%", p.PANEL_WIDTH /
				2, p.PANEL_HEIGHT / 2 + 20)
		}
	}
};
QZONE.CPUMonitorVML = QZONE.CPUMonitorVML || {
	initCanvas: function() {
		var p = QZONE.CPUMonitor;
		document.namespaces && document.namespaces.add && document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
		QZFL.css.insertStyleSheet("qz_canvas_vml", "v\\:* { behavior: url(#default#VML);} v\\:shape { behavior: url(#default#VML);} v\\:line { behavior: url(#default#VML);} v\\:path { behavior: url(#default#VML);} v\\:textpath { behavior: url(#default#VML);} v\\:fill { behavior: url(#default#VML);}");
		p.canvasDom = document.createElement("div");
		p.canvasDom.id = "qz_canvas";
		p.canvasDom.innerHTML = '<v:shape id="qz_canvas_shape"\t\t  fillcolor="black"\t\t  coordorigin="0 0"\t\t  coordsize="200 200"\t\t  strokecolor="black"\t\t  strokeweight="0pt"\t\t  style="position:absolute;top:0px;left:0px;z-index:99999;width:' + p.PANEL_WIDTH + "px;height:" + p.PANEL_HEIGHT + 'px;">\t\t  <v:path v="m 1,1 l 1,200, 200,200, 200,1 x e" />\t\t</v:shape>';
		p.container.appendChild(p.canvasDom);
		p.Drawer.PercentNum.init();
		return true
	},
	drawPoint: function(x, y, index) {
		var p = QZONE.CPUMonitor,
			c = p.canvas,
			l;
		if (typeof index != "undefined" && p.CPUMonitorCanvas[index]) {
			l = p.CPUMonitorCanvas[index];
			l.from = p.LAST_X + "," + p.LAST_Y;
			l.to = x + "," + y
		} else {
			l = document.createElement("p");
			l.innerHTML = '<v:line style="position:absolute;left:0px;top:0px;z-index:99999;" id="' + "QZ_CPU_VML_LINE_" + p.line_index + '" strokecolor="#00FF00" strokeweight="' + p.ZOOM + 'px" from="' + p.LAST_X + "," + p.LAST_Y + '" to="' + x + "," + y + '" ></v:line>';
			p.canvasDom.appendChild(l);
			p.CPUMonitorCanvas.push(l.firstChild);
			p.line_index++
		}
		p.CURRENT_X = x;
		p.LAST_X = x;
		p.LAST_Y = y
	},
	drawline: function() {
		var p = QZONE.CPUMonitor,
			po;
		for (var i = 0, len = p.point_list.length; i < len; i++) {
			po = p.point_list[i];
			p.Drawer.drawPoint(po[0], po[1], i);
			po[0] -= p.STEP_WIDTH
		}
	},
	PercentNum: {
		PANEL_WIDTH: 50,
		PANEL_HEIGHT: 35,
		canvasDom: null,
		canvas: null,
		init: function() {
			var p = QZONE.CPUMonitor.Drawer.PercentNum;
			p.PANEL_WIDTH = 50;
			p.PANEL_HEIGHT = 35;
			p.PANEL_WIDTH *= QZONE.CPUMonitor.ZOOM;
			p.PANEL_HEIGHT *= QZONE.CPUMonitor.ZOOM;
			p.canvasDom = document.createElement("div");
			p.canvasDom.id = "qz_canvas_per_num";
			p.canvasDom.style.zIndex = 1E5;
			p.canvasDom.innerHTML = '<v:shape id="qz_canvas_shape_per_num"\t\t\t  fillcolor="black"\t\t\t  coordorigin="0 0"\t\t\t  coordsize="200 200"\t\t\t  strokecolor="black"\t\t\t  strokeweight="0pt"\t\t\t  style="position:absolute;top:0px;left:' + QZONE.CPUMonitor.PANEL_WIDTH + "px;z-index:99999;width:" + p.PANEL_WIDTH + "px;height:" + p.PANEL_HEIGHT + 'px;">\t\t\t  <v:path v="m 1,1 l 1,200, 200,200, 200,1 x e" />\t\t\t</v:shape>';
			QZONE.CPUMonitor.container.appendChild(p.canvasDom)
		},
		show: function(num) {
			var p =
				QZONE.CPUMonitor.Drawer.PercentNum;
			var d = $("qz_canvas_shape_per_num_text");
			if (!d) {
				d = document.createElement("p");
				d.style.cssText = "position:absolute;top:0px;left:0px;z-index:100000;";
				d.id = "qz_canvas_shape_per_num_text";
				p.canvasDom.insertBefore(d, p.canvasDom.firstChild)
			}
			var color = "#00FF00";
			if (num > 25) color = "#FFFF00";
			if (num > 50) color = "#FF6600";
			if (num > 80) color = "#FF0000";
			if (d) {
				var h = '<v:line from="' + QZONE.CPUMonitor.PANEL_WIDTH + "," + (p.PANEL_HEIGHT / 2 - 1) + '" to="' + (QZONE.CPUMonitor.PANEL_WIDTH + p.PANEL_WIDTH) +
					"," + p.PANEL_HEIGHT / 2 + '"><v:fill on="True" color="' + color + '"/><v:path textpathok="True"/><v:textpath on="True" string="' + num + '%" style="font:normal normal normal 40pt Tahoma"/></v:line>';
				d.innerHTML = h
			}
		}
	}
};
QZONE.CPUMonitor.initialize = function() {
	var count = 0;
	if (window.CPU_DEBUGGER_TURN_ON || location.href.indexOf("CPU_DEBUGGER_TURN_ON") > 0) window.CPU_INIT_WAITING_TIMER = setInterval(function() {
			count++;
			if (count > 50) {
				clearInterval(window.CPU_INIT_WAITING_TIMER);
				return
			}
			if (typeof window.QZFL != "undefined" && typeof window.ua != "undefined") {
				window.CPU_DEBUGGER_ZOOM = 2;
				clearInterval(window.CPU_INIT_WAITING_TIMER);
				if (ua && ua.ie && ua.ie < 9) QZONE.CPUMonitor.Drawer = QZONE.CPUMonitorVML;
				else QZONE.CPUMonitor.Drawer = QZONE.CPUMonitorCanvas;
				QZONE.CPUMonitor.debugMode = true;
				QZONE.CPUMonitor.init()
			}
		}, 200);
	else {
		QZONE.CPUMonitor.debugMode = false;
		QZONE.CPUMonitor.init()
	}
};
QZONE.CPUMonitor.initialize();
QZONE.Gift4Visitor = QZONE.Gift4Visitor || {
	init: function() {
		if (QZONE.FrontPage.getCurrApp() != 0) return;
		if (QZONE.Gift4Visitor.check()) {
			if ($("welcomeflash") || window.wSwf_obj_swf_visitor_click) return;
			if (ownermode) {
				if (QZONE.Gift4Visitor._fromsettingpage()) QZONE.Gift4Visitor.createFlash();
				else QZONE.Gift4Visitor.rightTopPic();
				return
			}
			if (!QZONE.FrontPage.getVipStatus()) return;
			var jg = new QZFL.JSONGetter("http://activity.qzone.qq.com/cgi-bin/v2/fcg_check_host_gift_res", "fcg_check_host_gift_res", {
				"uin": g_iLoginUin,
				"act_id": 20176,
				"host": g_iUin
			}, "utf-8");
			jg.onSuccess = function(o) {
				if (o && o.code == 0) if (o.data.lottery_left > 0 && o.data.is7dayfriend == true) QZONE.Gift4Visitor.createFlash();
					else QZONE.Gift4Visitor.rightTopPic();
					else QZONE.Gift4Visitor.rightTopPic()
			};
			jg.send("_Callback")
		}
	},
	createFlash: function() {
		if (!QZFL.userAgent.ie) {
			QZONE.Gift4Visitor.replaceFlash();
			return
		}
		var s = document.createElement("div");
		s.id = "divgift4visitorflash";
		s.style.cssText = "width:100%;position:absolute;right:0;top:0;height:100%;z-index:30000;";
		document.body.appendChild(s);
		window.wSwf_obj_swf_visitor_click = function() {
			wSwf_obj_swf_visitor_close();
			QZONE.Gift4Visitor.showPopup("flash")
		};
		window.wSwf_obj_swf_visitor_close = function() {
			QZONE.Gift4Visitor.effect()
		};
		QZFL.media.insertFlash(s, {
			id: "gift4visitorflash",
			src: "http://" + siDomain + "/qzone/v6/promotion/act/gift4visitorflash.swf?max_age=31536000",
			width: "100%",
			height: "100%",
			allowScriptAccess: "always",
			allownetworking: "all",
			wmode: "transparent",
			menu: false
		});
		window.visitor_gift_flash_timer = setTimeout(wSwf_obj_swf_visitor_close,
			11500)
	},
	showPopup: function(_from) {
		if (ownermode) {
			QZONE.FrontPage.toApp("/myhome/friends/visitor?tab=giftforvisitor");
			if (!QZONE.FrontPage.getVipStatus()) TCISD && TCISD.hotClick("isd.qzone.gift.hui", "mall.qzone.qq.com");
			return
		}
		var _path = '<iframe id="popup__dialog__frame" scrolling="no" allowtransparency="yes" frameborder="no" src="http://' + window.imgcacheDomain + '/qzone/mall/app/guest_award/get_award.html" style="width:550px;height:325px;border:none;overflow:hidden;" frameBorder="no"/>';
		window._guestAwardDialog =
			QZFL.dialog.create("", _path, {
			width: 550,
			height: 325,
			useTween: true,
			noBorder: true,
			showMask: true,
			noCustom: true,
			noShadow: true
		});
		TCISD && TCISD.hotClick("isd.qzone.gift." + (_from || ""), "mall.qzone.qq.com")
	},
	hide: function() {
		$("divGif4Visitor") && ($("divGif4Visitor").style.display = "none")
	},
	_fromsettingpage: function() {
		if (location.href.indexOf("settingpage") > -1) return true;
		return false
	},
	rightTopPic: function() {
		if (QZONE.Gift4Visitor.check()) {
			if ($("divGif4Visitor")) return;
			var s = document.createElement("div"),
				_html;
			s.id =
				"divGif4Visitor";
			s.style.cssText = "top: 70px; z-index: 100; width: 70px; height: 70px; right: 100px; position:absolute;";
			$("layBackground").appendChild(s);
			_html = '<a href="javascript:;" id="aGif4Visitor" title="' + (ownermode ? "\u70b9\u51fb\u8fdb\u5165\u8bbe\u7f6e\u9875\u9762" : "\u70b9\u51fb\u6709\u60ca\u559c") + '"><img src="http://' + siDomain + "/qzone/v6/promotion/act/gift4visitorflash" + (QZONE.FrontPage.getVipStatus() ? "" : "_gray") + '.png?max_age=31536000"/></a>' + (QZONE.FrontPage.getVipStatus() ? "" : '<a class="edit_title_link" id="ahidegraygiftpng" style="position: absolute;top: 0;right: -70px;display:none;" href="javascript:;">\u9690\u85cf</a>');
			s.innerHTML = _html;
			QZFL.event.addEvent($("aGif4Visitor"), "click", function(evt) {
				QZONE.Gift4Visitor.showPopup("pic");
				QZFL.event.preventDefault(evt);
				return false
			});
			if (!QZONE.FrontPage.getVipStatus()) {
				QZFL.event.delegate(s, ".edit_title_link", "click", function(evt) {
					$("divGif4Visitor") && $e("#divGif4Visitor").remove();
					QZFL.event.preventDefault(evt);
					return false
				});
				QZFL.event.addEvent($("aGif4Visitor"), "mouseover", function(evt) {
					$("ahidegraygiftpng") && ($("ahidegraygiftpng").style.display = "")
				});
				QZFL.event.addEvent($("aGif4Visitor"),
					"mouseout", function(evt) {
					$("ahidegraygiftpng") && ($("ahidegraygiftpng").style.display = "none")
				});
				QZFL.event.addEvent($("ahidegraygiftpng"), "mouseover", function(evt) {
					$("ahidegraygiftpng") && ($("ahidegraygiftpng").style.display = "")
				});
				QZFL.event.addEvent($("ahidegraygiftpng"), "mouseout", function(evt) {
					$("ahidegraygiftpng") && ($("ahidegraygiftpng").style.display = "none")
				})
			}
		}
	},
	replaceFlash: function() {
		var _h = 190,
			_x = (QZFL.dom.getClientWidth() - _h) / 2,
			_y = QZFL.dom.getClientHeight() / 2 + 150,
			s;
		QZFL.css.insertStyleSheet("replacevisitorflash",
			".replacevisitorflash{-webkit-transform:translate(0px," + _y + "px);-webkit-transition:all 0.5s ease;-moz-transform:translate(0px," + _y + "px);-moz-transition:all 0.5s ease;-o-transform:translate(0px," + _y + "px);-o-transition:all 0.5s ease;}");
		s = document.createElement("a");
		s.id = "divgift4visitorflash";
		s.style.cssText = "left:" + _x + "px;top:-" + _h + "px;position:absolute;z-index:40000;width:" + _h + "px;height:" + _h + 'px;cursor:pointer;background-image: url("http://' + window.siDomain + '/qzone_v6/img/gift/gift_box_360.png?max_age=19830210&d=201212191800");background-repeat:no-repeat;';
		s.href = "javascript:;";
		document.body.appendChild(s);
		setTimeout(function() {
			$("divgift4visitorflash").className = "replacevisitorflash"
		}, 1500);
		window.wSwf_obj_swf_visitor_click = function(evt) {
			wSwf_obj_swf_visitor_close();
			QZONE.Gift4Visitor.showPopup("flash");
			QZFL.event.preventDefault(evt);
			return false
		};
		QZFL.event.addEvent(s, "click", wSwf_obj_swf_visitor_click);
		window.wSwf_obj_swf_visitor_close = function() {
			QZONE.Gift4Visitor.effect()
		};
		window.visitor_gift_flash_timer = setTimeout(wSwf_obj_swf_visitor_close, 11E3)
	},
	effect: function() {
		var isIE6 = QZFL.userAgent.ie === 6;
		if (isIE6 || !QZFL.userAgent.ie) {
			var wel = $("divgift4visitorflash");
			wel && (wel.innerHTML = "");
			wel && document.body.removeChild(wel);
			QZONE.Gift4Visitor.rightTopPic()
		} else QZFL.effect.run($("divgift4visitorflash"), {
				"height": 170,
				"width": 170,
				"right": 100,
				"top": 70
			}, {
				duration: 500,
				complete: function() {
					var wel = $("divgift4visitorflash");
					wel && (wel.innerHTML = "");
					wel && document.body.removeChild(wel);
					QZONE.Gift4Visitor.rightTopPic()
				}
			})
	},
	check: function() {
		var ua = QZFL.userAgent || {};
		if (!window.g_UserunimBitmap || ua.isiPad || ua.isiPod || ua.isiPhone) return false;
		if (QZONE.Gift4Visitor._fromsettingpage()) return true;
		var _t = parseInt(window.g_UserunimBitmap.charAt(15 - Math.floor((30 - 1) / 4)), 16) >> (30 - 1) % 4 & 1,
			_p = g_Mode != "ofp" && g_Mode != "ofp_lite" && g_Mode != "gfp_timeline" && g_Mode != "gfp_qun" && g_Mode != "gfp_group";
		return _t && g_iLoginUin && _p
	}
};
if (QZONE.Gift4Visitor.check()) setTimeout(QZONE.Gift4Visitor.init, 800);
window.QZONE = window.QZONE || {};
window.QM = window.QM || {};
QME = {
	CONTAINER_ID_TEMP: "QM_Container_{index}",
	TITLE_ID_TEMP: "QM_{appid}_Title",
	BODY_ID_TEMP: "QM_{appid}_Body",
	BOTTOM_ID_TEMP: "QM_{appid}_Bottom",
	MODULE_PATH_PREFIX: "/qzone/v6/qm/qm_",
	FRAME_LAYOUT: ["0", "13", "131", "122", "121", "14", "22", "32", "112", "113"],
	oldHackMap: {
		"a7": "334",
		"a15": "152"
	},
	adapter: {
		1: {
			url: "F",
			cache: 1,
			delay: 0,
			minColumn: 1
		},
		2: {
			url: "F",
			cache: 1,
			delay: 0,
			minColumn: 1
		},
		3: {
			url: "F",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		4: {
			url: "F",
			cache: 1,
			delay: 0,
			minColumn: 2
		},
		847: {
			url: "F",
			cache: 1,
			delay: 0,
			minColumn: 1
		},
		7: {
			url: "F",
			cache: 1,
			delay: 0,
			minColumn: 1
		},
		15: {
			url: "F",
			cache: 0,
			delay: 0,
			minColumn: 2
		},
		152: {
			url: "F",
			cache: 0,
			delay: 0,
			minColumn: 2
		},
		99: {
			url: "F",
			cache: 0,
			delay: 1E3,
			minColumn: 1
		},
		306: {
			url: "F",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		310: {
			url: "F",
			cache: 1,
			delay: 0,
			minColumn: 1
		},
		311: {
			url: "F",
			cache: 1,
			delay: 0,
			minColumn: 1
		},
		333: {
			url: "F",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		334: {
			url: "F",
			cache: 1,
			delay: 0,
			minColumn: 1
		},
		305: {
			url: "O",
			cache: 1,
			delay: 0,
			minColumn: 1
		},
		308: {
			url: "O",
			cache: 1,
			delay: 0,
			minColumn: 1
		},
		317: {
			url: "O",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		324: {
			url: "O",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		326: {
			url: "O",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		332: {
			url: "O",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		349: {
			url: "O",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		331: {
			url: "O",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		204: {
			url: "S",
			cache: 0,
			delay: 500,
			minColumn: 1
		},
		207: {
			url: "",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		208: {
			url: "",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		209: {
			url: "",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		210: {
			url: "",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		211: {
			url: "",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		212: {
			url: "",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		213: {
			url: "",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		214: {
			url: "",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		215: {
			url: "",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		216: {
			url: "F",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		218: {
			url: "F",
			cache: 0,
			delay: 0,
			minColumn: 1
		},
		318: {
			url: "S",
			cache: 0,
			delay: 500,
			minColumn: 1
		},
		323: {
			url: "S",
			cache: 0,
			delay: 500,
			minColumn: 1
		},
		330: {
			url: "S",
			cache: 0,
			delay: 500,
			minColumn: 1
		},
		337: {
			url: "S",
			cache: 0,
			delay: 500,
			minColumn: 1
		},
		351: {
			url: "S",
			cache: 0,
			delay: 500,
			minColumn: 1
		},
		384: {
			url: "S",
			cache: 0,
			delay: 0,
			minColumn: 2
		},
		400: {
			url: "S",
			cache: 0,
			delay: 500,
			minColumn: 1
		},
		1003: {
			url: "S",
			cache: 0,
			delay: 500,
			minColumn: 1
		}
	},
	config: {},
	configPool: {},
	containerMapPool: {},
	tempPool: {},
	bootstrapPool: {},
	modulePool: {},
	extendedModulePool: {},
	stasticDataPool: {},
	needDynamicDataPool: {},
	MODULE_TEMP: "",
	bootstrap: function() {
		this._getStasticData()
	},
	setModuleTemplate: function(html) {
		QME.MODULE_TEMP = html
	},
	setConfig: function(config) {
		this.config = config
	},
	setModulePathPrefix: function(pathPrefix) {
		this.MODULE_PATH_PREFIX = pathPrefix
	},
	loadStasticData: function(callback, errCallback) {
		QME.GCTimeStat.mark(15);
		var jg, cgiStatic =
				"http://" + g_Src_Domain + "/cgi-bin/qzone_static_widget_v6?fs=" + QZONE.dressDataCenter.getFramestyle() + "&uin=" + g_iUin + "&timestamp=" + (window.g_timestamp || 0) + "&g_tk=" + QZONE.FrontPage.getACSRFToken(),
			t0;
		jg = new QZFL.JSONGetter(cgiStatic, "get_window_list_stastic", null, "utf-8");
		jg.onSuccess = function(o) {
			QME.GCTimeStat.mark(16);
			window.TCISD && TCISD.valueStat(400446, 1, 11, {
				reportRate: 1E3,
				duration: new Date - t0
			});
			if (typeof callback == "function") callback(o);
			QME.GCTimeStat.mark(17)
		};
		jg.onError = function() {
			window.TCISD &&
				TCISD.valueStat(400446, 2, 12, {
				reportRate: 1,
				duration: new Date - t0
			});
			if (typeof errCallback == "function") errCallback(o);
			else;
		};
		t0 = new Date;
		jg.send("staticData_Callback")
	},
	getContainerIndexByAppid: function(appid) {
		return QME.containerMapPool["container_map" + appid]
	},
	parseStasticData: function(dressupData) {
		var isDynamic = !( !! dressupData && dressupData.widgetdata),
			a = [],
			g_StaticFlag = dressupData.widgetdata && dressupData.widgetdata.g_StaticFlag || "",
			id;
		window.g_Needfix = dressupData.widgetdata && dressupData.widgetdata.g_Needfix;
		for (var k in dressupData) if (k.indexOf("_") == "0") {
				a = k.split("_");
				QME.stasticDataPool["a" + a[1]] = dressupData[k]
			}
		if (g_StaticFlag != "") {
			a = g_StaticFlag.split("_");
			for (var i = a.length; i--;) {
				id = a[i].replace(/\.\d*/, "");
				id = QME.oldHackMap["a" + id] || id;
				QME.needDynamicDataPool["a" + id] = 1
			}
			QME.loadDynamicData(dressupData, QME.parseStasticData)
		} else if (window.g_Needfix) QME.loadDynamicData(dressupData, QME.parseStasticData);
		if (isDynamic) QME.loadDynamicDataModule()
	},
	loadDynamicDataModule: function() {
		var appid, opt = null,
			t;
		for (var k in QME.needDynamicDataPool) {
			appid = k.substr(1);
			if (QZONE.dressDataCenter.getMode() == 7) if (t = QZONE.GFP && QZONE.GFP.needAdjustSrcQmMap && QZONE.GFP.needAdjustSrcQmMap[appid]) {
					opt = {};
					opt.src = ["http://", siDomain, t].join("")
				}
			QME.importQM(appid, opt)
		}
	},
	loadDynamicData: function(dressupData, callback, errCallback) {
		QME.GCTimeStat.mark(18);
		var jg, cgiStatic = "http://" + g_W_Domain + "/cgi-bin/widget/qzone_dynamic_v6?uin=" + g_iUin + "&newflag=" + dressupData.widgetdata.g_StaticFlag + "&fix=" + (window.g_Needfix || 0) + "&timestamp=" +
				g_timestamp;
		jg = new QZFL.JSONGetter(cgiStatic, "get_window_list_dynamic", null, "utf-8");
		jg.onSuccess = function(o) {
			QME.GCTimeStat.mark(19);
			if (o && typeof callback == "function") callback(o);
			QME.GCTimeStat.mark(20)
		};
		jg.onError = function() {
			if (typeof errCallback == "function") errCallback(o);
			else;
		}
	},
	loadOneModuleDynamicData: function(appid, mode) {
		setTimeout(function() {
			QME.bootstrapPool["a" + appid]()
		}, 50)
	},
	turnOldWindowListToNewConfig: function(dressupData, fs) {
		var layout, lyid = typeof fs != "undefined" ? fs : QZONE.dressDataCenter.getFramestyle(),
			index, wl = typeof fs != "undefined" ? dressupData && dressupData.widgetdata.g_Dressup : g_Dressup,
			sd, o, hm = QME.oldHackMap;
		if (g_frameStyle > 128) lyid = g_frameStyle - 128;
		layout = QME.FRAME_LAYOUT[lyid];
		if ("undefined" == typeof layout) layout = "13";
		if (g_frameStyle > 128) layout = layout.split("").reverse().join("");
		if ("0" == layout) {
			var wn = wl.windows || QZONE.dressDataCenter.getWindows();
			wn.sort(function(_1, _2) {
				return _1.posz - _2.posz
			})
		}
		if (!wl || !wl.windows) return;
		o = wl.windows, r = {};
		if (g_frameStyle != 0 || g_isOFP == "0" && QZONE.dressDataCenter.getMode() ==
			6) {
			var _sort = function(a, b) {
				if (a.posx != b.posx) return a.posx - b.posx;
				else if (a.posy != b.posy) return a.posy - b.posy;
				else return 0
			};
			o = o.sort(_sort)
		}
		r.group = {
			c1: [],
			c2: [],
			c3: []
		};
		r.container = {};
		for (var i = 0, len = o.length; i < len; i++) {
			index = "c" + (layout != "0" ? Math.min(layout.length - 1, o[i].posx) + 1 : "1");
			indey = layout != "0" ? o[i].posy : i + 1;
			r.group[index].push(index + indey);
			r.container[index + indey] = {
				appid: hm["a" + o[i].appid] ? hm["a" + o[i].appid] : o[i].appid,
				typeid: o[i].mode,
				mode: o[i].mode,
				height: o[i].height,
				width: o[i].width,
				wndid: o[i].wndid,
				posx: o[i].posx,
				posy: o[i].posy,
				posz: o[i].posz
			}
		}
		r.addon = {};
		r.addon["QM_Main_Container"] = "lay_grid_" + layout;
		return r
	},
	checkIsFreeMode: function(appid) {
		var c = QME.configPool["a" + appid];
		return Boolean(c && c.free)
	},
	getModuleConfig: function() {
		return QME.configPool
	},
	setStasticData: function() {},
	_getStasticData: function() {},
	_findStasticData: function(appid) {
		var o = this.stasticDataPool["a" + appid];
		return o || null
	},
	_getModuleDetail: function(type, appid) {
		var t = QME[type.toUpperCase() + "_ID_TEMP"];
		if (type != "container") if (t) return $(format(t, {
					"appid": appid
				}));
			else return null;
			else {
				var id = QME.getContainerIndexByAppid(appid),
					d = $(format(t, {
						"index": id
					}));
				if (!id || !d) return null;
				else return d
			}
	},
	loadDefaultModules: function() {
		var cache;

		function _build(d) {
			for (var k in QME.config.group);
		}
		return function(frameStyle) {
			if (typeof frameStyle == "undefined") return;
			if (!cache || !cache[frameStyle]) {
				var req = RequestFactory.create("/qzone/v6/old_qm/defaultLayout.js", {
					fnname: "callback",
					callback: function(o) {}
				});
				req.request()
			}
		}
	}(),
	getContainerHeight: function() {
		var con =
			$("QM_Main_Container"),
			frameStyle = QZONE.dressDataCenter.getFramestyle(),
			f, mh = 0,
			fi, mode = QZONE.dressDataCenter.getMode();
		if (0 != frameStyle || mode == 6) return QZFL.dom.getSize($("QM_Main_Container"));
		f = $("QM_Group_Container_1");
		fi = f.firstChild;
		while (fi) {
			if (fi.nodeType != 1) continue;
			if (fi.offsetTop + fi.offsetHeight > mh) mh = fi.offsetTop + fi.offsetHeight;
			fi = fi.nextSibling
		}
		if (QZONE.dressDataCenter.isXWMode()) mh = 456;
		return [con.offsetWidth, mh]
	},
	importQM: function(appid, opt, _cb) {
		QME.GCTimeStat.mark(5);
		var src = QME.MODULE_PATH_PREFIX +
			appid + ".js",
			typeid, delay;
		if (!QME.configPool["a" + appid]) return;
		typeid = QME.configPool["a" + appid].typeid;
		if (opt && opt.src) src = opt.src;
		if (g_Mode == "gfp_module" && parseInt(typeid, 10) > 100 && appid != 99) typeid = 0;
		delay = QME.configPool["a" + appid].delay || 0;
		if (parseInt(typeid, 10) > 100) src = QME.MODULE_PATH_PREFIX + appid + "_" + typeid + ".js";
		if (typeof QME.bootstrapPool["a" + appid] == "function") {
			setTimeout(function() {
				QME.bootstrapPool["a" + appid]();
				typeof _cb == "function" && setTimeout(function() {
					_cb(appid)
				}, 100)
			}, delay);
			QME.GCTimeStat.mark(31)
		} else setTimeout(function() {
				if (QZONE.dressDataCenter.getMode() ==
					6 && (appid == 2 || appid == 4 || appid == 218 || appid == 333 || appid == 847)) src = src.replace(/old_/, "");
				QZFL.imports(src, function() {
					QME.GCTimeStat.markByAppid(appid);
					if (typeof QME.bootstrapPool["a" + appid] == "function") QME.bootstrapPool["a" + appid]();
					typeof _cb == "function" && setTimeout(function() {
						_cb(appid)
					}, 100)
				})
			}, delay)
	},
	loadModules: function(loadCallback, config) {
		QME.GCTimeStat.mark(3);
		loadCallback = loadCallback || QZFL.emptyFn;
		var c = config || QME.config,
			g = c.group,
			d, index, con = c.container,
			arr = [],
			pre = "QM_Group_Container_",
			addon = c.addon,
			layout = QME.FRAME_LAYOUT[QZONE.dressDataCenter.getFramestyle()],
			mode = QZONE.dressDataCenter.getMode();
		var _fillContent = function(cot, html) {
			var md = g_PreData.icmoudule;
			if (cot == $("QM_Group_Container_3") && md.ret == 0 && !window._openList_flag && window.g_Mode != "ofp_lite" && g_app_identifier != "preview") return;
			var _tmp = arguments.callee._cache = arguments.callee._cache || document.createElement("div");
			_tmp.innerHTML = html;
			while (_tmp.firstChild) cot.appendChild(_tmp.firstChild)
		};
		var customercounter = 0;
		var mode =
			QZONE.dressDataCenter.getMode();
		var needStyle = layout == "0" && mode == 5;
		var excludeModuleIdMap = {
			"0": 1,
			128: 1,
			15: 1,
			306: 1,
			349: 1,
			305: 1,
			308: 1,
			318: 1,
			204: 1
		};
		if (mode != 6) excludeModuleIdMap["847"] = 1;
		else excludeModuleIdMap["152"] = 1;
		for (var k in g) {
			if (g[k] && g[k].length > 0) {
				for (var i = 0, len = g[k].length; i < len; i++) {
					if (!con[g[k][i]]) continue;
					if (excludeModuleIdMap[con[g[k][i]].appid]) continue;
					if (con[g[k][i]]) {
						index = g[k][i].substr(1);
						if (99 == con[g[k][i]].appid) customercounter++;
						if (!$("QM_Container_" + index) || g_Mode == "gfp_scene" ||
							g_fullMode == 7) {
							var module_type = con[g[k][i]].appid + (99 == con[g[k][i]].appid && "_" + con[g[k][i]].wndid || "");
							arr.push(format(QME.MODULE_TEMP, {
								index: index,
								appid: module_type,
								conClass: con[g[k][i]].conClass || "",
								left: !needStyle ? "" : "left:" + con[g[k][i]].posx + "px;",
								top: !needStyle ? "" : "top:" + con[g[k][i]].posy + "px;",
								width: !needStyle ? "" : "width:" + (con[g[k][i]].width == 0 ? 180 : con[g[k][i]].width) + "px;",
								height: !needStyle ? "" : "height:" + (con[g[k][i]].height == 0 ? 180 : con[g[k][i]].height) + "px;" + (module_type == 384 ? "overflow-y:auto;" :
									"")
							}))
						}
						QME.configPool["a" + con[g[k][i]].appid + (99 == con[g[k][i]].appid && "_" + con[g[k][i]].wndid || "")] = con[g[k][i]];
						QME.containerMapPool["container_map" + con[g[k][i]].appid + (99 == con[g[k][i]].appid && "_" + con[g[k][i]].wndid || "")] = g[k][i].substr(1);
						if (!QME.needDynamicDataPool["a" + con[g[k][i]].appid] && typeof con[g[k][i]].appid != "undefined" && "99" != con[g[k][i]].appid) QME.importQM(con[g[k][i]].appid, con[g[k][i]].opt, loadCallback)
					}
				}
				d = $(pre + k.substr(1));
				if (6 == mode && k == "c3" && window.g_isOFP == 0) d = $("GFP_SideBar");
				if (d) if (6 != mode || k == "c3") _fillContent(d, arr.join(""))
			}
			arr = []
		}
		if (needStyle) {
			var lasth, count = 10,
				d = (new Date).getTime(),
				con = $("QM_Group_Container_1");
			if (con && QZONE.dressDataCenter.isXWMode()) con.style.height = "456px";
			else(function() {
					if (!con) return;
					if (lasth != QME.getContainerHeight()[1]) {
						lasth = QME.getContainerHeight()[1];
						con.style.height = lasth + "px";
						count--;
						if (!count) return
					}
					if ((new Date).getTime() - d >= 10 * 1E3) return;
					setTimeout(arguments.callee, 1E3)
				})()
		}
		for (k in addon) {
			d = $(k);
			if (d && addon[k]) QZFL.css.addClassName(d,
					addon[k])
		}
		QZONE.qzEvent.dispatch("QME_MODULE_RENDERED");
		QME.GCTimeStat.mark(4);
		if ((g_Mode == "gfp_module" || g_Mode == "gfp_fixed") && customercounter) this.loadCustomModule()
	},
	loadCustomModule: function() {
		var u = "http://" + g_NewBlog_Domain + "/cgi-bin/custom/output_custom_window.cgi";
		var g = new QZFL.JSONGetter(u, "fp_customModuleList", {
			uin: g_iUin,
			type: "html",
			t: Math.random()
		}, "GB2312");
		g.onSuccess = function(ob) {
			if (!~~ob.ret) {
				var r = [],
					o = ob["items"];
				for (var i in o) if (o[i]) {
						o[i].idx = parseInt(i, 10) + 1;
						if (!o[i].type) continue;
						r.push(o[i]);
						QZFL.dataCenter.save("_99_" + i, o[i])
					}
				QZONE.qzEvent.dispatch("QME_CUSTOMMODULE_LOAD_OK", r)
			}
		};
		g.onError = function() {
			QZONE.qzEvent.dispatch("QME_CUSTOMMODULE_LOAD_ERROR")
		};
		g.send("_Callback")
	},
	_getModuleGroup: function(appid) {
		var col = this.adapter[String(appid).replace(/_.*$/, "")].minColumn;
		var p = $("QM_Group_Container_" + col);
		if (!p) p = $("QM_Group_Container_1");
		return p
	},
	createModule: function(conf) {
		if (!conf || !conf.appid) return;
		conf.appid = QME.oldHackMap["a" + conf.appid] || conf.appid;
		var layout = QZONE.dressDataCenter.getFramestyle();
		var needStyle = layout == "0" && QZONE.dressDataCenter.getMode() == 5;
		var p = this._getModuleGroup(conf.appid),
			t = document.createElement("body"),
			index = +new Date,
			frameStyle = +($("QM_Main_Container").getAttribute("layoutid") || g_frameStyle);
		var m = QME.getModuleObject(conf.appid);
		conf = QZFL.object.extend(conf, {
			index: index,
			conClass: conf.conClass || "",
			left: !needStyle ? "" : "left:" + (conf.posx || 0) + "px;",
			top: !needStyle ? "" : "top:" + (conf.posy || 0) + "px;",
			width: !needStyle ? "" : "width:" + (conf.width || 150) + "px;",
			height: !needStyle ? "" : "height:" + (conf.height || 150) + "px;",
			wndid: String(conf.appid).replace(/^99_/, ""),
			mode: String(conf.appid).split("_")[1] || 2,
			posx: (p.id.match(/_(\d+$)/) || [0, 1])[1] - 1,
			posy: 0,
			posz: 0,
			typeid: conf.typeid || 0
		});
		t.innerHTML = format(QME.MODULE_TEMP, conf);
		QME.configPool["a" + conf.appid] = conf;
		QME.containerMapPool["container_map" + conf.appid] = index;
		if (!QME.needDynamicDataPool["a" + conf.appid] && String(conf.appid).indexOf("99") < 0) if (QME.bootstrapPool["a" + conf.appid] && typeof QME.bootstrapPool["a" + conf.appid] == "function") if (QME.adapter[conf.appid].cache ==
					1) QME.loadOneModuleDynamicData(conf.appid, conf.mode);
				else setTimeout(QME.bootstrapPool["a" + conf.appid] || function() {}, 0);
				else setTimeout(function() {
						QME.importQM(conf.appid)
					}, 100);
		var c = t.firstChild;
		if (p.firstChild) p.insertBefore(c, p.firstChild);
		else p.appendChild(c); if (String(conf.appid).indexOf("99") > -1) {
			conf.appid = String(conf.appid).replace(/_.*$/, "");
			each(["index", "left", "top", "conClass"], function(n) {
				delete conf[n]
			});
			QZONE.qzEvent.dispatch("QME_ON_CREATE_CUSTOMER_MODULE", conf)
		}
		return c
	},
	runModule: function(appid,
		bootstrap) {},
	registerBootstrap: function(bootstrap, appid) {
		this.bootstrapPool["a" + appid] = bootstrap
	},
	registerTemp: function(appid, typeid, temp) {
		if (!this.tempPool["a" + appid]) this.tempPool["a" + appid] = {};
		this.tempPool["a" + appid]["a" + typeid] = temp
	},
	getModuleObject: function(appid, opt) {
		var c = QME.configPool["a" + appid];
		if (!c) return null;
		var stasticData = QME._findStasticData(appid),
			freeMode = opt && opt.freemode || QME.checkIsFreeMode(appid);
		var d = QME._getModuleDetail("container", appid),
			typeid = QME.configPool["a" + appid].typeid;
		var m = new QZONE.Module(appid, typeid, {
			stasticData: stasticData,
			title: QME._getModuleDetail("title", appid),
			body: QME._getModuleDetail("body", appid),
			bottom: QME._getModuleDetail("bottom", appid),
			container: QME._getModuleDetail("container", appid),
			freeMode: freeMode
		});
		QME.modulePool["a" + appid] = m;
		return m
	},
	getMergedData: function(data, appid, typeid) {
		var temp = QME.tempPool["a" + appid] && QME.tempPool["a" + appid]["a" + typeid];
		if (!temp) return "";
		return QME.merge(temp, data)
	},
	_cache: {},
	merge: function(temp, data) {
		var cache = QME._cache,
			fn = !/\W/.test(temp) ? cache[temp] = cache[temp] || QME.merge(temp) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);}; with(obj){p.push('" + temp.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
		return data ? fn(data) : fn
	},
	showModule: function(container) {
		QZ.G.s(container)
	},
	hideModule: function(container) {
		QZ.G.s(container,
			1)
	},
	getModuleLayout: function() {
		if (!(QZONE.GFP && QZONE.GFP.isInit)) return g_Dressup.windows;
		var mode = QZONE.dressDataCenter.getMode();
		if (mode == 5 || mode == 6) {
			var o = {};
			var main = $(mode == 6 && g_isOFP == "0" ? "GFP_SideBar" : "QM_Main_Container"),
				layout = 1,
				i = 0;
			var frameStyle = +QZONE.dressDataCenter.getFramestyle();

			function getIndex(el) {
				var p = el.parentNode,
					f = p.childNodes[0],
					i = 0;
				while (f) {
					if (f == el) return i;
					if (f.nodeType == 1) i++;
					f = f.nextSibling
				}
				return 0
			}
			for (var i in QME.configPool) {
				var d = $e("#QM_" + i.slice(1) + "_Title"),
					p,
					col, pos;
				if (d && (d = d.elements[0])) {
					p = getParent(d, function(n) {
						return n.id.indexOf("QM_Container") > -1
					});
					if (mode == 6 && g_isOFP == "0" && p.parentNode.id != "GFP_SideBar") continue;
					o[i] = QME.configPool[i];
					pos = getIndex(p);
					col = p.parentNode;
					o[i].posx = frameStyle === 0 ? p.offsetLeft || parseInt(p.style.left || 0) : col.id.replace(/\D/g, "") - 1;
					o[i].posy = frameStyle === 0 ? p.offsetTop || parseInt(p.style.top || 0) : pos;
					o[i].posz = frameStyle === 0 ? pos : 0;
					o[i].width = frameStyle === 0 ? p.offsetWidth || parseInt(p.style.width) : col.id.replace(/\D/g, "") -
						1;
					o[i].height = p.offsetHeight || parseInt(p.style.height);
					if (mode == 6) {
						o[i].posx = 2;
						o[i].wndid = o[i].wndid || 1
					}
				}
			}
			return o
		}
		return g_Dressup.windows
	}
};
QME.TimeStat = {
	timeStatObj: null,
	map: null,
	init: function(key, paramArr) {
		var p = QME.TimeStat;
		p.timeStatObj = TCISD.createTimeStat(key, paramArr);
		p.timeStatObj.setZero(_s_);
		setTimeout(QME.TimeStat.report, 15E3)
	},
	initMap: function(map) {
		QME.TimeStat.map = map
	},
	mark: function(index) {
		if (QME.TimeStat.timeStatObj) QME.TimeStat.timeStatObj.mark(index)
	},
	markByAppid: function(appid) {
		if (QME.TimeStat.map) {
			var index = QME.TimeStat.map["a" + appid];
			if (index) QME.TimeStat.mark(index, new Date)
		}
	},
	report: function() {
		var t = QME.TimeStat.timeStatObj;
		if (t && (Math.random() < 0.05 || g_isAlpha_iUin)) t.report()
	}
};
QME.GCTimeStat = {
	timeStatObj: null,
	map: null,
	init: function(key, paramArr) {
		var p = QME.GCTimeStat;
		p.timeStatObj = TCISD.createTimeStat(key, paramArr);
		p.timeStatObj.setZero(_s_);
		setTimeout(QME.GCTimeStat.report, 15E3)
	},
	initMap: function(map) {
		QME.GCTimeStat.map = map
	},
	mark: function(index) {
		if (QME.GCTimeStat.timeStatObj) QME.GCTimeStat.timeStatObj.mark(index)
	},
	markByAppid: function(appid, f) {
		if (QME.GCTimeStat.map) {
			var index = QME.GCTimeStat.map["a" + appid + (f ? "_" + f : "")];
			if (index) QME.GCTimeStat.mark(index, new Date)
		}
	},
	report: function() {
		var t =
			QME.GCTimeStat.timeStatObj;
		if (t && (Math.random() < 0.05 || g_isAlpha_iUin)) t.report()
	}
};
QZONE.Module = function(appid, typeid, opt) {
	this.appid = appid;
	this.typeid = typeid;
	this.isFreeMode = opt && opt.freeMode || false;
	this.stasticData = opt && opt.stasticData;
	this.title = opt && opt.title;
	this.body = opt && opt.body;
	this.bottom = opt && opt.bottom;
	this.container = opt && opt.container;
	this.setTitle = function(html, opt) {
		if (!this.isFreeMode && this.title) {
			var customTitleJump = opt && opt.customTitleJump || null;
			var noLink = opt && opt.noLink || null;
			if (!QZONE.custom || !QZONE.custom.isDressMode()) {
				var re = /<h3>([\s\S]*?)<\/h3>/;
				if ("gfp_module" ==
					g_Mode || "gfp_fixed" == g_Mode) if (re.test(html)) if (0 == String(appid).indexOf("99_") || true === noLink) html = html.replace(re, "<h3>$1</h3>");
						else html = html.replace(re, '<h3><a href="#" onclick="QZONE.FrontPage.toApp(\'' + (customTitleJump || appid) + "');return false;\">$1</a></h3>");
						else html = '<a href="#" onclick="QZONE.FrontPage.toApp(\'' + (customTitleJump || appid) + "');return false;\">" + html + "</a>"
			}
			this.title.innerHTML = html
		}
	};
	this.setBody = function(html) {
		if (!this.isFreeMode && this.body) this.body.innerHTML = html
	};
	this.setBottom = function(html) {
		if (!this.isFreeMode && this.bottom) this.bottom.innerHTML = html
	};
	this.setContainer = function(html) {
		if (this.isFreeMode && this.container) this.container.innerHTML = html
	};
	this.registerTemp = function(temp, typeid, name) {
		this.Temp = temp;
		var typeid = typeid || this.typeid;
		QME.registerTemp(this.appid, typeid, temp, name)
	};
	this.regisiterTemp = this.registerTemp;
	this.getMergedData = function(data, typeid) {
		return QME.getMergedData(data, this.appid, typeof typeid == "undefined" ? this.typeid : typeid)
	};
	this.showTitle = function() {
		QME.showModule(this.title)
	};
	this.hideTitle = function() {
		QME.hideModule(this.title)
	};
	this.showBody = function() {
		QME.showModule(this.body)
	};
	this.hideBody = function() {
		QME.hideModule(this.body)
	};
	this.showBottom = function() {
		QME.showModule(this.bottom)
	};
	this.hideBottom = function() {
		QME.hideModule(this.bottom)
	};
	this.show = function() {
		QME.showModule(this.container);
		QME.TimeStat.markByAppid(this.appid);
		QME.GCTimeStat.markByAppid(this.appid, 1)
	};
	this.hide = function() {
		QME.hideModule(this.container)
	};
	QZONE.Module.add(appid, this)
};
QZONE.Module.instances = {};
QZONE.Module.add = function(key, obj) {
	this.instances[key] = obj
};
QZONE.Module.getInstance = function(key) {
	return this.instances[key]
};
if (typeof window.TCISD == "undefined") window.TCISD = {};
TCISD.pv = function(sDomain, path, opts) {
	setTimeout(function() {
		TCISD.pv.send(sDomain, path, opts)
	}, 0)
};
(function() {
	var items = [],
		timer = null;
	var pvSender = {
		send: function(domain, url, rDomain, rUrl, flashVersion) {
			items.push({
				dm: domain,
				url: url,
				rdm: rDomain || "",
				rurl: rUrl || "",
				flashVersion: flashVersion
			});
			if (!timer) timer = setTimeout(pvSender.doSend, 5E3)
		},
		doSend: function() {
			timer = null;
			if (items.length) {
				var url;
				for (var i = 0; i < items.length; i++) {
					url = pvSender.getUrl(items.slice(0, items.length - i));
					if (url.length < 2E3) break
				}
				items = items.slice(Math.max(items.length - i, 1));
				if (i > 0) timer = setTimeout(pvSender.doSend, 5E3);
				QZFL.pingSender(url)
			}
		},
		getUrl: function(list) {
			var item = list[0];
			var data = {
				dm: escape(item.dm),
				url: escape(item.url),
				rdm: escape(item.rdm),
				rurl: escape(item.rurl),
				flash: item.flashVersion,
				pgv_pvid: pvSender.getId(),
				sds: Math.random()
			};
			var ext = [];
			for (var i = 1; i < list.length; i++) {
				var p = list[i];
				ext.push([escape(p.dm), escape(p.url), escape(p.rdm), escape(p.rurl)].join(":"))
			}
			if (ext.length) data.ex_dm = ext.join(";");
			var param = [];
			for (var p in data) param.push(p + "=" + data[p]);
			var url = [TCISD.pv.config.webServerInterfaceURL, "?cc=-&ct=-&java=1&lang=-&pf=-&scl=-&scr=-&tt=-&tz=-8&vs=3.3&",
				param.join("&")
			].join("");
			return url
		},
		getId: function() {
			var t, d, h, f;
			t = document.cookie.match(TCISD.pv._cookieP);
			if (t && t.length && t.length > 1) d = t[1];
			else {
				d = Math.round(Math.random() * 2147483647) * (new Date).getUTCMilliseconds() % 1E10;
				document.cookie = "pgv_pvid=" + d + "; path=/; domain=qq.com; expires=Sun, 18 Jan 2038 00:00:00 GMT;"
			}
			h = document.cookie.match(TCISD.pv._cookieSSID);
			if (!h) {
				f = Math.round(Math.random() * 2147483647) * (new Date).getUTCMilliseconds() % 1E10;
				document.cookie = "pgv_info=ssid=s" + f + "; path=/; domain=qq.com;"
			}
			return d
		}
	};
	TCISD.pv.send = function(sDomain, path, opts) {
		sDomain = sDomain || location.hostname || "-";
		path = path || location.pathname;
		opts = opts || {};
		opts.referURL = opts.referURL || document.referrer;
		var t, d, r;
		t = opts.referURL.split(TCISD.pv._urlSpliter);
		t = t[0];
		t = t.split("/");
		d = t[2] || "-";
		r = "/" + t.slice(3).join("/");
		opts.referDomain = opts.referDomain || d;
		opts.referPath = opts.referPath || r;
		pvSender.send(sDomain, path, opts.referDomain, opts.referPath, opts.flashVersion || "")
	}
})();
TCISD.pv._urlSpliter = /[\?\#]/;
TCISD.pv._cookieP = /(?:^|;+|\s+)pgv_pvid=([^;]*)/i;
TCISD.pv._cookieSSID = /(?:^|;+|\s+)pgv_info=([^;]*)/i;
TCISD.pv.config = {
	webServerInterfaceURL: "http://pingfore.qq.com/pingd"
};
window.TCISD = window.TCISD || {};
TCISD.createTimeStat = function(statName, flagArr, standardData) {
	var _s = TCISD.TimeStat,
		t, instance;
	flagArr = flagArr || _s.config.defaultFlagArray;
	t = flagArr.join("_");
	statName = statName || t;
	if (instance = _s._instances[statName]) return instance;
	else return new _s(statName, t, standardData)
};
TCISD.markTime = function(timeStampSeq, statName, flagArr, timeObj) {
	var ins = TCISD.createTimeStat(statName, flagArr);
	ins.mark(timeStampSeq, timeObj);
	return ins
};
TCISD.TimeStat = function(statName, flags, standardData) {
	var _s = TCISD.TimeStat;
	this.sName = statName;
	this.flagStr = flags;
	this.timeStamps = [null];
	this.zero = _s.config.zero;
	if (standardData) this.standard = standardData;
	_s._instances[statName] = this;
	_s._count++
};
TCISD.TimeStat.prototype.getData = function(seq) {
	var r = {}, t, d;
	if (seq && (t = this.timeStamps[seq])) {
		d = new Date;
		d.setTime(this.zero.getTime());
		r.zero = d;
		d = new Date;
		d.setTime(t.getTime());
		r.time = d;
		r.duration = t - this.zero;
		if (this.standard && (d = this.standard.timeStamps[seq])) r.delayRate = (r.duration - d) / d
	} else r.timeStamps = TCISD.TimeStat._cloneData(this.timeStamps);
	return r
};
TCISD.TimeStat._cloneData = function(obj) {
	if (typeof obj == "object") {
		var res = obj.sort ? [] : {};
		for (var i in obj) res[i] = TCISD.TimeStat._cloneData(obj[i]);
		return res
	} else if (typeof obj == "function") return Object;
	return obj
};
TCISD.TimeStat.prototype.mark = function(seq, timeObj) {
	seq = seq || this.timeStamps.length;
	this.timeStamps[Math.min(Math.abs(seq), 99)] = timeObj || new Date;
	return this
};
TCISD.TimeStat.prototype.merge = function(baseTimeStat) {
	var x, y;
	if (baseTimeStat && typeof baseTimeStat.timeStamps == "object" && baseTimeStat.timeStamps.length) this.timeStamps = baseTimeStat.timeStamps.concat(this.timeStamps.slice(1));
	else return this; if (baseTimeStat.standard && (x = baseTimeStat.standard.timeStamps)) {
		if (!this.standard) this.standard = {};
		if (!(y = this.standard.timeStamps)) y = this.standard.timeStamps = {};
		for (var key in x) if (!y[key]) y[key] = x[key]
	}
	return this
};
TCISD.TimeStat.prototype.setZero = function(od) {
	if (typeof od != "object" || typeof od.getTime != "function") od = new Date;
	this.zero = od;
	return this
};
TCISD.TimeStat.prototype.report = function(baseURL) {
	var _s = TCISD.TimeStat,
		url = [],
		t, z;
	if ((t = this.timeStamps).length < 1) return this;
	url.push(baseURL && baseURL.split("?")[0] || _s.config.webServerInterfaceURL);
	url.push("?");
	z = this.zero;
	for (var i = 1, len = t.length; i < len; ++i) if (t[i]) url.push(i, "=", t[i].getTime ? t[i] - z : t[i], "&");
	t = this.flagStr.split("_");
	for (var i = 0, len = _s.config.maxFlagArrayLength; i < len; ++i) if (t[i]) url.push("flag", i + 1, "=", t[i], "&");
	if (_s.pluginList && _s.pluginList.length) for (var i = 0, len = _s.pluginList.length; i <
			len; ++i) typeof _s.pluginList[i] == "function" && _s.pluginList[i](url);
	url.push("sds=", Math.random());
	QZFL.pingSender && QZFL.pingSender(url.join(""));
	return this
};
TCISD.TimeStat._instances = {};
TCISD.TimeStat._count = 0;
TCISD.TimeStat.config = {
	webServerInterfaceURL: "http://isdspeed.qq.com/cgi-bin/r.cgi",
	defaultFlagArray: [175, 115, 1],
	maxFlagArrayLength: 6,
	zero: window._s_ || new Date
};
window.TCISD = window.TCISD || {};
TCISD.valueStat = function(statId, resultType, returnValue, opts) {
	setTimeout(function() {
		TCISD.valueStat.send(statId, resultType, returnValue, opts)
	}, 0)
};
TCISD.valueStat.send = function(statId, resultType, returnValue, opts) {
	var _s = TCISD.valueStat,
		_c = _s.config,
		t = _c.defaultParams,
		p, url = [];
	statId = statId || t.statId;
	resultType = resultType || t.resultType;
	returnValue = returnValue || t.returnValue;
	opts = opts || t;
	if (typeof opts.reportRate != "number") opts.reportRate = 1;
	opts.reportRate = Math.round(Math.max(opts.reportRate, 1));
	if (!opts.fixReportRateOnly && !TCISD.valueStat.config.reportAll && opts.reportRate > 1 && Math.random() * opts.reportRate > 1) return;
	url.push(opts.reportURL || _c.webServerInterfaceURL,
		"?");
	url.push("flag1=", statId, "&", "flag2=", resultType, "&", "flag3=", returnValue, "&", "1=", TCISD.valueStat.config.reportAll ? 1 : opts.reportRate, "&", "2=", opts.duration, "&");
	if (typeof opts.extendField != "undefined") url.push("4=", opts.extendField, "&");
	if (_s.pluginList && _s.pluginList.length) for (var i = 0, len = _s.pluginList.length; i < len; ++i) typeof _s.pluginList[i] == "function" && _s.pluginList[i](url);
	url.push("sds=", Math.random());
	QZFL.pingSender(url.join(""))
};
TCISD.valueStat.config = {
	webServerInterfaceURL: "http://isdspeed.qq.com/cgi-bin/v.cgi",
	defaultParams: {
		statId: 1,
		resultType: 1,
		returnValue: 11,
		reportRate: 1,
		duration: 1E3
	},
	reportAll: false
};
if (typeof window.TCISD == "undefined") window.TCISD = {};
TCISD.hotClick = TCISD.hotClick || function(tag, domain, url, opt) {
	TCISD.hotClick.send(tag, domain, url, opt)
};
TCISD.hotClick.send = function(tag, domain, url, opt) {
	opt = opt || {};
	var _s = TCISD.hotClick,
		x = opt.x || 9999,
		y = opt.y || 9999,
		doc = opt.doc || document,
		w = doc.parentWindow || doc.defaultView,
		p = w._hotClick_params || {};
	url = url || p.url || w.location.pathname || "-";
	domain = domain || p.domain || w.location.hostname || "-";
	if (!_s.isReport()) return;
	url = [_s.config.webServerInterfaceURL, "?dm=", domain + ".hot", "&url=", escape(url), "&tt=-", "&hottag=", tag, "&hotx=", x, "&hoty=", y, "&rand=", Math.random()];
	QZFL.pingSender(url.join(""))
};
TCISD.hotClick._arrSend = function(arr, doc) {
	for (var i = 0, len = arr.length; i < len; i++) TCISD.hotClick.send(arr[i].tag, arr[i].domain, arr[i].url, {
			doc: doc
		})
};
TCISD.hotClick.click = function(event, doc) {
	var _s = TCISD.hotClick,
		tags = _s.getTags(QZFL.event.getTarget(event), doc);
	_s._arrSend(tags, doc)
};
TCISD.hotClick.clickElem = function(elem, doc) {
	if (elem && elem.nodeType) {
		var tags = TCISD.hotClick.getTags(elem, doc);
		TCISD.hotClick._arrSend(tags, doc)
	}
};
TCISD.hotClick.getTags = function(dom, doc) {
	var _s = TCISD.hotClick,
		tags = [],
		w = doc.parentWindow || doc.defaultView,
		rules = w._hotClick_params.rules,
		t;
	for (var i = 0, len = rules.length; i < len; i++) if (t = rules[i](dom)) tags.push(t);
	return tags
};
TCISD.hotClick.defaultRule = function(dom) {
	var tag, domain, t;
	tag = dom.getAttribute("hottag");
	if (tag && tag.indexOf("|") > -1) {
		t = tag.split("|");
		tag = t[0];
		domain = t[1]
	}
	if (tag) return {
			tag: tag,
			domain: domain
	};
	return null
};
TCISD.hotClick.config = TCISD.hotClick.config || {
	webServerInterfaceURL: "http://pinghot.qq.com/pingd",
	reportRate: 1,
	domain: null,
	url: null
};
TCISD.hotClick._reportRate = typeof TCISD.hotClick._reportRate == "undefined" ? -1 : TCISD.hotClick._reportRate;
TCISD.hotClick.isReport = function() {
	var _s = TCISD.hotClick,
		rate;
	if (_s._reportRate != -1) return _s._reportRate;
	rate = Math.round(_s.config.reportRate);
	if (rate > 1 && Math.random() * rate > 1) return _s._reportRate = 0;
	return _s._reportRate = 1
};
TCISD.hotClick.setConfig = function(opt) {
	opt = opt || {};
	var _sc = TCISD.hotClick.config,
		doc = opt.doc || document,
		w = doc.parentWindow || doc.defaultView;
	if (opt.domain) w._hotClick_params.domain = opt.domain;
	if (opt.url) w._hotClick_params.url = opt.url;
	if (opt.reportRate) w._hotClick_params.reportRate = opt.reportRate
};
TCISD.hotAddRule = function(handler, opt) {
	opt = opt || {};
	var _s = TCISD.hotClick,
		doc = opt.doc || document,
		w = doc.parentWindow || doc.defaultView;
	if (!w._hotClick_params) return;
	w._hotClick_params.rules.push(handler);
	return w._hotClick_params.rules
};
TCISD.hotClickWatch = function(opt) {
	opt = opt || {};
	var _s = TCISD.hotClick,
		w, l, doc;
	doc = opt.doc = opt.doc || document;
	w = doc.parentWindow || doc.defaultView;
	if (l = doc._hotClick_init) return;
	l = true;
	if (!w._hotClick_params) {
		w._hotClick_params = {};
		w._hotClick_params.rules = [_s.defaultRule]
	}
	_s.setConfig(opt);
	w.QZFL.event.addEvent(doc, "click", _s.click, [doc])
};
if (typeof window.TCISD == "undefined") window.TCISD = {};
TCISD.stringStat = function(dataId, hashValue, opts) {
	setTimeout(function() {
		TCISD.stringStat.send(dataId, hashValue, opts)
	}, 0)
};
TCISD.stringStat.send = function(dataId, hashValue, opts) {
	var _s = TCISD.stringStat,
		_c = _s.config,
		t = _c.defaultParams,
		url = [],
		isPost = false,
		htmlParam, sd;
	dataId = dataId || t.dataId;
	opts = opts || t;
	isPost = opts.method && opts.method == "post" ? true : false;
	if (typeof hashValue != "object") return;
	for (var i in hashValue) if (hashValue[i].length && hashValue[i].length > 1024) hashValue[i] = hashValue[i].substring(0, 1024);
	if (typeof opts.reportRate != "number") opts.reportRate = 1;
	opts.reportRate = Math.round(Math.max(opts.reportRate, 1));
	if (opts.reportRate >
		1 && Math.random() * opts.reportRate > 1) return;
	if (isPost && QZFL.FormSender) {
		hashValue.dataId = dataId;
		hashValue.sds = Math.random();
		var sd = new QZFL.FormSender(_c.webServerInterfaceURL, "post", hashValue, "UTF-8");
		sd.send()
	} else {
		htmlParam = TCISD.stringStat.genHttpParamString(hashValue);
		url.push(_c.webServerInterfaceURL, "?");
		url.push("dataId=", dataId);
		url.push("&", htmlParam, "&");
		url.push("ted=", Math.random());
		QZFL.pingSender(url.join(""))
	}
};
TCISD.stringStat.config = {
	webServerInterfaceURL: "http://s.isdspeed.qq.com/cgi-bin/s.fcg",
	defaultParams: {
		dataId: 1,
		reportRate: 1,
		method: "get"
	}
};
TCISD.stringStat.genHttpParamString = function(o) {
	var res = [];
	for (var k in o) res.push(k + "=" + window.encodeURIComponent(o[k]));
	return res.join("&")
};
QZONE.FrontPage.getStatPackage = function() {
	return window.TCISD
};
TCISD.hotClick.config.reportRate = 20;
window.TS_FIRST_PAGE_INTERFACE_READY = new Date;
QZONE.Storage = {
	helperUrl: "http://" + imgcacheDomain + "/ac/qzfl/release/widget/storage_helper.html",
	ifrCallback: null,
	instance: null,
	getInstance: function() {
		var _ins = this["instance"];
		if (_ins) return _ins;
		return null
	}
};
QZONE.Storage.create = function(cb, opt) {
	try {
		QZONE.Storage._create(cb, opt)
	} catch (ex) {
		typeof cb == "function" && cb(false)
	}
};
QZONE.Storage._create = function(cb, opt) {
	if (typeof cb != "function") return;
	opt = opt || {};
	var db = null,
		dbname = opt.dbname || "qzone_database",
		defaultDomain = opt.domain || document.domain,
		helperUrl = opt.helper || QZONE.Storage.helperUrl,
		share = opt.share || false,
		_clientStore = ["localStorage", "globalStorage", "userData"];
	if (!opt.noSO) _clientStore = _clientStore.concat(["so"]);
	var _cs = QZONE.Storage;
	var createHelper = function(th, type) {
		var i = document.createElement("iframe");
		i.id = "userData_iframe_" + dbname;
		i.style.display = "none";
		i.src = helperUrl;
		QZONE.Storage.ifrCallback = function() {
			db = i.contentWindow.create(dbname, type);
			if (db) cb(th);
			else cb(false)
		};
		document.body.appendChild(i)
	};
	var getExpireDate = function(days) {
		var d = new Date;
		days = days || 365 * 3;
		d.setDate(d.getDate() + days);
		return d.toUTCString()
	};
	var _backend = {};
	_backend.userData = {
		isSupport: !! window.ActiveXObject,
		type: 1,
		get: function(key, cb) {
			db.load(dbname);
			var val = db.getAttribute(key);
			typeof cb == "function" && cb(val);
			return val
		},
		set: function(key, value) {
			try {
				db.load(dbname);
				db.setAttribute(key,
					value);
				db.save(dbname);
				return true
			} catch (ex) {
				return false
			}
		},
		remove: function(key) {
			db.load(dbname);
			db.removeAttribute(key);
			db.save(dbname)
		},
		init: function() {
			try {
				if (share) {
					createHelper(this, "userData");
					return
				}
				var el = document.documentElement || document.body;
				el.addBehavior("#default#userdata");
				el.load(dbname);
				db = el;
				cb(this)
			} catch (ex) {
				cb(false)
			}
		},
		clear: function() {
			try {
				db.load(dbname);
				db.expires = (new Date(123456789E4)).toUTCString();
				db.save(dbname);
				db.load(dbname);
				db.expires = getExpireDate();
				db.save(dbname);
				return true
			} catch (ex) {
				return false
			}
		}
	};
	_backend.globalStorage = {
		isSupport: !! window.globalStorage,
		type: 2,
		get: function(key, cb) {
			var v = (v = db.getItem(key)) && v.value ? v.value : v;
			typeof cb == "function" && cb(v);
			return v
		},
		set: function(key, value) {
			try {
				db.setItem(key, value);
				return true
			} catch (ex) {
				return false
			}
		},
		remove: function(key) {
			db.removeItem(key)
		},
		init: function() {
			if (db = window.globalStorage[share ? defaultDomain : document.domain]) cb(this);
			else cb(false)
		},
		clear_flag: false,
		clear_arr: [],
		clear: function(cb) {
			var ar = this.clear_arr;
			if (this.clear_flag) return;
			this.clear_flag = true;
			for (var k in db) ar.push(k);
			var clearXItems = function(x) {
				x = x > ar.length ? ar.length : x;
				for (var i = 0; i < x; i++) {
					var k = ar.shift();
					db.removeItem(k)
				}
				if (ar.length > 0) {
					QZFL.console.print(ar.length);
					setTimeout(function() {
						clearXItems(x)
					}, 50)
				} else typeof cb == "function" && cb()
			};
			clearXItems(5)
		}
	};
	_backend.localStorage = {
		isSupport: !! window.localStorage,
		type: 3,
		get: _backend.globalStorage.get,
		set: _backend.globalStorage.set,
		remove: _backend.globalStorage.remove,
		init: function() {
			if (share) {
				createHelper(this,
					"localStorage");
				return
			}
			if (db = window.localStorage) cb(this);
			else cb(false)
		},
		clear: function() {
			db.clear()
		}
	};
	_backend.so = {
		isSupport: !! (QZONE.shareObject && QZONE.shareObject.getValidSO()),
		type: 4,
		get: function(key, cb) {
			var val = db.get(key);
			typeof cb == "function" && cb(val);
			return val
		},
		set: function(key, value) {
			try {
				db.set(key, value);
				return true
			} catch (ex) {
				return false
			}
		},
		remove: function(key) {
			db.del(key)
		},
		clear: function() {
			db.clear()
		},
		init: function() {
			if (db = QZONE.shareObject.getValidSO()) cb(this);
			else cb(null)
		}
	};
	(function() {
		for (var i =
			0, len = _clientStore.length; i < len; i++) if (_backend[_clientStore[i]].isSupport) {
				(_cs["instance"] = _backend[_clientStore[i]]).init();
				return
			}
		cb(false)
	})()
};
QZONE.FrontPage.internalLike = function() {
	var _loader = function(ns, cb) {
		return function() {
			var args = arguments;
			QZFL.imports(QZONE.FrontPage._staticServer + "internalLike.js?ver=" + g_V.ci, ns ? function() {
				var cNs = QZONE.FrontPage.internalLike,
					arr = [],
					c = "";
				if (ns) {
					arr = ns.split(".");
					while (c = arr.shift()) cNs = cNs[c]
				}
				cNs.apply(QZONE.FrontPage.internalLike, args)
			} : function() {
				cb && cb()
			})
		}
	};
	return {
		getData: _loader("getData"),
		getFaceData: _loader("getFaceData"),
		doLike: _loader("doLike"),
		unLike: _loader("unLike"),
		imports: function(cb) {
			_loader(null,
				cb)()
		},
		Component: {}
	}
}();
QZONE.FrontPage.enterFullScreenMode = function(cb, timeout, opts) {
	var p = QZONE.FrontPage.enterFullScreenMode,
		qzcss = QZFL.css,
		cssUrl = ["http://", window.siDomain || "qzonestyle.gtimg.cn", "/qzone_v6/", opts && opts.withNavigationBar ? "platform_app_fullscreen_topfixed.css" : "platform_app_fullscreen.css", "?max_age=172800"].join(""),
		cssName = opts && opts.withNavigationBar ? "mode_page_app_fullscreen_topfixed" : "mode_page_app_fullscreen",
		cssDom = $("mainFullScreenWithTopfixed");
	if (!p.loadCss && !cssDom) {
		p.loadCss = true;
		qzcss.insertCSSLink(cssUrl)
	}
	qzcss.addClassName(document.body,
		cssName);
	var t = $e(".lay_topfixed").eq(0),
		s, time = 0;
	if (t) {
		timeout = typeof timeout != "undefined" ? timeout : 2E3;

		function cssLoaded() {
			s = QZFL.dom.getStyle(t, "display");
			if (s == "none") {
				cb && cb();
				return
			}
			if (time < timeout) {
				setTimeout(cssLoaded, 200);
				time += 200
			} else cb && cb()
		}
		cssLoaded()
	} else cb && cb()
};
QZONE.FrontPage.withdrawFullScreenMode = function() {
	var qzcss = QZFL.css;
	qzcss.removeClassName(document.body, "mode_page_app_fullscreen_topfixed");
	qzcss.removeClassName(document.body, "mode_page_app_fullscreen")
};
QZONE.FrontPage.openViewer = function(params) {
	window.seajs && seajs.use(["photo.v7/common/viewer2/index", "photo.v7/lib/jquery", "photo.v7/lib/photo", "cssBase/qzone_v6/photo_scan_layer.css"], function(viewer, J) {
		viewer && viewer.get("./init").init(params)
	})
};

try {
	(function(_w) {
		_w._javascript_file_map = _w._javascript_file_map || {};
		_w._javascript_file_map['qzone/v6/interface/interface_v6_20130514.js'] = true;
	})(window);
} catch (ign) {}
/*  |xGv00|08c6c6a6508a48a1b7dfc2d9dcdd3582 */