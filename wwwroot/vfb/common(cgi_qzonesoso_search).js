var qsbase = QzoneSosoBase = {
	tmpl: function() {
		var cache = {};
		return function tmpl(str, data) {
			var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);}; with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
			return data ?
				fn(data) : fn
		}
	}(),
	dateFormat: function(date, fmt) {
		if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";
		var o = {
			"M+": date.getMonth() + 1,
			"d+": date.getDate(),
			"h+": date.getHours(),
			"m+": date.getMinutes(),
			"s+": date.getSeconds(),
			"q+": Math.floor((date.getMonth() + 3) / 3),
			"S": date.getMilliseconds()
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o) if ((new RegExp("(" + k + ")")).test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		return fmt
	},
	isUndefined: function(obj) {
		return typeof obj == "undefined"
	},
	presentDate: function(time) {
		var date = new Date(time * 1E3);
		return appDateFormat(date, new Date)
	},
	removeHTMLTag: function(str) {
		if (!str) return "";
		var reg_htmltag = /<.*?>/g;
		return str.replace(reg_htmltag, "")
	},
	removeHighlightHTMLTag: function(str) {
		if (!str) return "";
		var reg_htmltag = /<span class=\"c_tx4\">(.*?)<\/span>/g;
		return str.replace(reg_htmltag, "$1")
	},
	escHighlightHTML: function(content) {
		content = content.replace(/<span class=\"c_tx4\">(.*?)<\/span>/g,
			"{highlight_tag_start}$1{highlight_tag_end}");
		content = QZFL.string.escHTML(content);
		content = content.replace(/{highlight_tag_start}(.*?){highlight_tag_end}/g, '<span class="c_tx4">$1</span>');
		return content
	},
	isDeepStyle: function() {
		if (QZONE.FP) return QZONE.FP.checkIsDeepColor();
		return false
	},
	removeUBB: function(s) {
		if (QZONE.FP) return QZONE.FP.removeUBB(s);
		else return s
	},
	replaceIconTag: function(textContent) {
		if (QZONE.FP) return QZONE.FP.replaceIconTag(textContent);
		else return textContent
	},
	replaceAtData: function(content) {
		var reg =
			/\@{uin:([^,]*),nick:([^\}]*?)(,who:([0-9])(,auto[^\}]*)*){0,1}\}/g;
		return content.replace(reg, function(atWords, uin, nick, iswho, whotype, other) {
			if (iswho) if (1 == whotype) return format('<a href="http://user.qzone.qq.com/{0}" class="q_namecard q_des c_tx" link="nameCard_{0} des_{0}" target="_blank"> @{1}</a>', uin, decodeURIComponent(nick));
				else
			if (2 == whotype) return format('<a href="http://profile.pengyou.com/index.php?mod=profile&u={0}&ADTAG=QZONESOSO" class="c_tx" link="" target="_blank"> @{1}</a>', uin,
					decodeURIComponent(nick));
			else {
				if (3 == whotype) return format('<a href="http://rc.qzone.qq.com/myhome/weibo/profile/{0}" class="c_tx" link="" target="_blank"> @{1}</a>', uin, decodeURIComponent(nick))
			} else return format('<a href="http://user.qzone.qq.com/{0}" class="q_namecard q_des c_tx" link="nameCard_{0} des_{0}" target="_blank"> @{1}</a>', uin, decodeURIComponent(nick))
		})
	},
	replaceUrl: function(content) {
		var reg = /(https?:\/\/)(([-A-Za-z0-9]+(\.[-A-Za-z0-9]+)*(\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\.[0-9]{1,3}){3}))(:[0-9]*)?(\/[-A-Za-z0-9_\$\.\+\!\*\(\),;:@&=\?\/~\#\%]*)*/g;
		return content.replace(reg, '<a href="$&" class="c_tx" target="_blank">$&</a>')
	},
	appDateFormat: function(date, nowDate) {
		if (date.getTime() == 0) return "\u521a\u521a";
		var now = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
		now.setHours(nowDate.getHours());
		now.setMinutes(nowDate.getMinutes());
		now.setSeconds(nowDate.getSeconds());
		var timelag = now.getTime() - date.getTime();
		if (timelag <= 0) return "\u521a\u521a";
		if (timelag < 18E5) return Math.ceil(timelag / (60 * 1E3)) + "\u5206\u949f\u524d";
		now.setDate(now.getDate() -
			1);
		now.setHours(23);
		now.setMinutes(59);
		now.setSeconds(59);
		if (date.getTime() > now.getTime()) return "\u4eca\u5929" + dateFormat(date, "hh:mm");
		now.setDate(now.getDate() - 1);
		if (date.getTime() > now.getTime()) return "\u6628\u5929" + dateFormat(date, "hh:mm");
		now.setFullYear(now.getFullYear() - 1);
		now.setMonth(11);
		now.setDate(31);
		if (date.getTime() > now.getTime()) return dateFormat(date, "MM-dd hh:mm");
		return dateFormat(date, "yyyy-MM-dd hh:mm")
	},
	MoodComment: function(conf) {
		var comment = new Comment(conf);
		comment.ptid = conf.ptid;
		comment.puin = conf.puin;
		return comment
	},
	MoodReply: function(conf) {
		var reply = new Reply(conf);
		reply.ptid = conf.ptid;
		reply.puin = conf.puin;
		reply.ctid = conf.ctid;
		reply.cuin = conf.cuin;
		return reply
	},
	XMLselectSingleNode: function() {
		function BlogXMLselectSingleNode(data, xpath) {
			var x = BlogXMLselectNodes(data, xpath);
			if (!x || x.length < 1) return null;
			return x[0]
		}
		function BlogXMLselectNodes(data, xpath) {
			var xpe = new XPathEvaluator;
			var nsResolver = xpe.createNSResolver(data.ownerDocument == null ? data.documentElement : data.ownerDocument.documentElement);
			var result = xpe.evaluate(xpath, data, nsResolver, 0, null);
			var found = [];
			var res;
			while (res = result.iterateNext()) found.push(res);
			return found
		}
		function XMLSelectNodes(data, path) {
			if (QZFL.userAgent.ie) return data.selectNodes(path);
			else return BlogXMLselectNodes(data, path)
		}
		function XMLselectSingleNode(data, path) {
			if (QZFL.userAgent.ie) return data.selectSingleNode(path);
			else return BlogXMLselectSingleNode(data, path)
		}
		function isXMLDoc(data) {
			try {
				XMLselectSingleNode(data, "/");
				return true
			} catch (err) {
				return false
			}
		}
		return XMLselectSingleNode
	}(),
	getXMLNodeText: function(node) {
		if (!node) return null;
		if (typeof node.innerText != "undefined") return node.innerText;
		else if (typeof node.textContent != "undefined") return node.textContent;
		return node.text
	},
	ImageViewer: {
		h: {
			w: 0,
			h: 0,
			css: ";"
		},
		v: {
			w: 0,
			h: 0,
			css: ";"
		}
	},
	loadImage: function(c, b, g, f, w, h) {
		c.style.width = c.width = w;
		c.style.height = c.height = h;
		var d = c.getContext("2d");
		d.save();
		if (f <= Math.PI / 2) d.translate(g * c.oImage.height, 0);
		else if (f <= Math.PI) d.translate(c.width, -b * c.oImage.height);
		else if (f <= 1.5 * Math.PI) d.translate(-b * c.oImage.width, c.height);
		else d.translate(0, -g * c.oImage.width);
		try {
			d.rotate(f);
			d.drawImage(c.oImage, 0, 0, c.oImage.width, c.oImage.height);
			d.restore()
		} catch (i) {
			console && console.log(i.message)
		}
	},
	resizeOrgImage: function(img) {
		var maxWidth = 430;
		var finger = img.getAttribute("param");
		ImageViewer[finger] = {
			h: {
				w: 0,
				h: 0,
				css: ";"
			},
			v: {
				w: 0,
				h: 0,
				css: ";"
			}
		};
		ImageViewer[finger].h.w = ImageViewer[finger].v.w = img.width;
		ImageViewer[finger].h.h = ImageViewer[finger].v.h = img.height;
		if (img.height >
			maxWidth) {
			ImageViewer[finger].v.w = parseInt(maxWidth * img.width / img.height);
			ImageViewer[finger].v.h = maxWidth;
			ImageViewer[finger].v.css = ";width:auto;height:" + maxWidth + "px;"
		}
		if (img.width > maxWidth) {
			ImageViewer[finger].h.w = maxWidth;
			ImageViewer[finger].h.h = parseInt(maxWidth * img.height / img.width);
			ImageViewer[finger].h.css = ";width:" + maxWidth + "px;height:auto;";
			img.style.cssText += ImageViewer[finger].h.css
		}
	},
	rotateImage: function(i, j, d, finger) {
		var info = ImageViewer[finger];
		if (!info) return;
		if (d) i.angle = ((i.angle ==
				undefined ? 0 : i.angle) + j) % 360;
		else i.angle = j; if (i.angle >= 0) var f = Math.PI * i.angle / 180;
		else var f = Math.PI * (360 + i.angle) / 180;
		var m = i.angle % 180 ? "v" : "h";
		var b = Math.cos(f);
		var g = Math.sin(f);
		if (document.uniqueID !== document.uniqueID) {
			var c = new Image;
			c.style.cssText += info[m].css;
			c.src = i.src;
			c.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + b + ",M12=" + -g + ",M21=" + g + ",M22=" + b + ",SizingMethod='auto expand')"
		} else {
			var c = document.createElement("canvas");
			if (!i.oImage) {
				c.oImage = new Image;
				c.oImage.src = i.src;
				c.oImage.width = info[m].w;
				c.oImage.height = info[m].h;
				c.oImage.onload = function() {
					loadImage(c, b, g, f, m === "h" ? info.h.w : info.v.h, m === "h" ? info.h.h : info.v.w)
				}
			} else {
				c.oImage = i.oImage;
				c.oImage.width = info[m].w;
				c.oImage.height = info[m].h;
				loadImage(c, b, g, f, m === "h" ? info.h.w : info.v.h, m === "h" ? info.h.h : info.v.w)
			}
		}
		c.id = i.id;
		c.title = i.title;
		c.angle = i.angle;
		c.angle = c.angle < 0 ? 360 + c.angle : c.angle;
		i.parentNode.replaceChild(c, i);
		if (document.uniqueID !== document.uniqueID) {
			c.parentNode.style.width = (m === "h" ? info[m].w : info[m].h) +
				"px";
			c.parentNode.style.height = (m === "h" ? info[m].h : info[m].w) + "px";
			c.style.width = info[m].w + "px";
			c.style.height = info[m].h + "px"
		}
	},
	getHomeLink: function(uin, tar, opt) {
		var isCampus = isNaN(uin),
			opt = opt || {}, target;
		target = isCampus ? "http://xiaoyou.qq.com/index.php?mod=profile&u=" + uin : "http://user.qzone.qq.com/" + uin;
		window.open(target)
	},
	shuffleArray: function(ar) {
		var rnd, tmp;
		if (typeof ar != "undefined") {
			for (var i = 0; i < ar.length; i++) {
				rnd = Math.floor(Math.random() * ar.length);
				tmp = ar[i];
				ar[i] = ar[rnd];
				ar[rnd] = tmp
			}
			return ar
		} else return []
	},
	inArray: function(e, a) {
		if ("object" != typeof a || 0 == a.length) return false;
		for (var i = 0; i < a.length && a[i] != e; i++);
		return !(i == a.length)
	},
	resizeBySmallEdge: function(img, width, height) {
		var ratio;
		if (img.height <= img.width) {
			ratio = height / img.height;
			img.width = img.width * ratio;
			img.height = height
		} else {
			ratio = width / img.width;
			img.height = img.height * ratio
		}
		img.width = width
	},
	sendClickStream: function(selector, opts) {
		return function(s, o) {
			var opt = o || {};
			opt.searchid = qs.searchid;
			$e(s).find(".j_clickreport").onClick(function() {
				var _this =
					$e(this),
					val;
				var key = ["path", "businesstype", "actiontype", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"];
				var args = {};
				for (var i = 0, len = key.length; i < len; i++) {
					val = _this.getAttr("data-" + key[i]);
					if (!isUndefined(val) && val) args[key[i]] = val
				}
				args = QZFL.extend(opt, args);
				qs.PV(args.path, args)
			})
		}(selector, opts)
	},
	getClosest: function(ele, closestClassName) {
		var closestEle;
		if ($e(ele).hasClass(closestClassName)) closestEle = ele;
		else {
			closestEle = $e(ele);
			while (closestEle && closestEle.eq(0)) {
				closestEle = closestEle.getParent();
				if (closestEle.hasClass(closestClassName)) break
			}
		} if (!closestEle.hasClass(closestClassName)) closestEle = null;
		return closestEle
	},
	prevAll: function(ele) {
		var ret = [];
		while ((ele = QZFL.dom.getPreviousSibling(ele)) && ele != null) ret.push(ele);
		return ret
	}
};
var g_Parent, g_Uin, g_Nickname, g_LoginInfo, g_isAlpha, g_BaseUrl;
var qs = QzoneSoso = {
	MaxSearchTime: "1",
	searchid: "",
	entryMap: {
		"FROM_QZONE_BLOG": "64"
	},
	businesstypeMap: {
		7: "7",
		"all": "7",
		"home": "7",
		1: "1",
		"blog": "1",
		2: "2",
		"mood": "2",
		"-1": "-1",
		"friend": "-1",
		"soren": "-1",
		"-2": "-2",
		"hotsearch": "-2"
	},
	pageCanvas: {
		7: "home",
		1: "home",
		2: "home",
		"-1": "new_soren",
		"-2": "hotsearch"
	},
	URL: {
		search: "http://search.qzone.qq.com/cgi-bin/qzonesoso/cgi_qzonesoso_search",
		snapshot: "http://search.qzone.qq.com/cgi-bin/qzonesoso/cgi_qzonesoso_snapshot",
		errlog: "http://search.qzone.qq.com/cgi-bin/qzonesoso/cgi_qzonesoso_erroranaly",
		sosopv: "http://search.qzone.qq.com/cgi-bin/qzonesoso/cgi_qzonesoso_clickstream",
		morefriend: "http://search.qzone.qq.com/cgi-bin/qzonesoso/cgi_qzonesoso_more",
		hotsearch: "http://" + QZONE.FP._t.g_R_Domain + "/cgi-bin/qzonesoso/cgi_qzonesoso_hotword",
		searchtrend: "http://" + QZONE.FP._t.imgcacheDomain + "/qzone/v6/v6_config/qzonesoso_searchtrend.js",
		interestedpeople: "http://r.qzone.qq.com/cgi-bin/potential/potentialpeople.cgi",
		sorensearch: "http://search.qzone.qq.com/cgi-bin/qzonesoso/cgi_qzonesoso_soren",
		appscore: "http://appstore.qzone.qq.com/cgi-bin/qzapps/qz_appstore_getrank.cgi"
	},
	initBase: function() {
		setTimeout(function() {
			qs.scrollToPageTop(true)
		}, 400);
		qs.initGlobal();
		qs.initParameters();
		qs.initBaseModules();
		qs.setReturnURL()
	},
	initGlobal: function() {
		g_Parent = QZONE.FP._t;
		g_Uin = g_Parent.g_iLoginUin;
		QZONE.FP.getPortraitList([g_Uin], function(o) {
			g_LoginInfo = o[g_Uin];
			g_Nickname = g_LoginInfo[6]
		}, {
			customTime: 100
		});
		g_isAlpha = !! QZONE.FP.getBitMapFlag(58);
		g_BaseUrl = !! g_Uin ? "http://user.qzone.qq.com/" + g_Uin : "http://rc.qzone.qq.com/"
	},
	Parameters: {
		search: "",
		sort: 0,
		start: 0,
		entry: 0,
		businesstype: 7
	},
	initParameters: function() {
		var p = QZFL.extend({}, ENV.get("queryString"), ENV.get("queryHash")),
			params = qs.Parameters;
		for (var k in p) params[k] = decodeURIComponent(p[k]);
		params.businesstype = qs.businesstypeMap[params.businesstype] || "7";
		if (qs.entryMap.FROM_QZONE_BLOG == params.entry) if (g_Parent.ownermode) {
				params.resultset = 3;
				qs.PV("myblog-txt")
			} else {
				params.resultset = 4;
				qs.PV("otherblog-txt")
			}
	},
	initBaseModules: function() {
		qs.NavigationBar.init();
		qs.Extend.TopSearch.init();
		qs.Extend.BottomSearch.init();
		qs._initSearchInputToggleStyle();
		qs.PageNav.init();
		qs.SearchHistory.init()
	},
	initNamecard: function(el) {
		if (el) {
			var jsBaseURL = "http://" + g_Parent.siDomain;
			var namecardJS = [jsBaseURL + "/qzone/v5/namecardv2.js"];
			QZFL.object.each($e(el).elements, function() {
				var e = $e(this).elements[0];
				setTimeout(function() {
					QZFL.imports(namecardJS, function() {
						QZONE.namecard.init(e)
					})
				}, 100)
			})
		}
		return
	},
	_initSearchInputToggleStyle: function() {
		$e("#search_keyword, #search_bottom_keyword").onFocus(function() {
			$e(this).getParent().getParent().addClass("search_bar_focus")
		}).onBlur(function() {
			$e(this).getParent().getParent().removeClass("search_bar_focus")
		})
	},
	doSearch: QZFL.emptyFn,
	isCgiReturnCodeOk: function(cgiReturnCode) {
		var res = true;
		cgiReturnCode = cgiReturnCode - 0;
		switch (cgiReturnCode) {
			case 0:
			case -102:
			case -103:
			case -105:
			case -300:
			case -301:
				res = true;
				break;
			default:
				res = false;
				break
		}
		return res
	},
	getPURL: function(uin, size) {
		return QZONE.FP.getPURL(uin, size)
	},
	presentUserInfo: function(dom, type, opt) {
		qs.UserInfo.presentUserInfo($e(dom), type, opt)
	},
	setCommentStatus: function(elBtn, finger) {
		var txt = elBtn.innerHTML,
			elComment = $("comment_" + finger);
		if (txt == "\u6536\u8d77\u8bc4\u8bba") {
			setTimeout(function() {
				QZFL.css.addClassName(elComment,
					"none")
			}, 5);
			elBtn.innerHTML = "\u8bc4\u8bba"
		} else {
			QZFL.css.removeClassName(elComment, "none");
			elBtn.innerHTML = "\u6536\u8d77\u8bc4\u8bba"
		}
	},
	sendClickRequest: function(opt) {
		var opt = opt || {};
		if ("undefined" == typeof opt.entry) opt.entry = 35;
		var data = {
			uin: g_Uin,
			entry: opt.entry
		};
		var jg = new QZFL.JSONGetter(qs.URL.snapshot, null, data, "utf-8");
		jg.onSuccess = function(o) {};
		jg.onError = function() {};
		jg.send("callback")
	},
	brStat: function() {
		var v = 0,
			brType = "",
			b = {};
		if (v = QZFL.userAgent.ie) brType = "IE";
		else if (v = QZFL.userAgent.firefox) brType =
				"Firefox";
		else if (v = QZFL.userAgent.chrome) brType = "Chrome";
		else if (v = QZFL.userAgent.opera) brType = "Opera";
		else if (v = QZFL.userAgent.safari) brType = "Safari";
		b.type = brType;
		b.version = v;
		return b
	},
	errorLog: function(data) {
		var b;
		b = qs.brStat();
		data.browserType = b.type;
		data.browserVersion = b.version;
		qs._sendLogRequest(data)
	},
	_sendLogRequest: function(params) {
		var data = {
			uin: isUndefined(params.uin) ? g_Parent.g_iLoginUin : params.uin,
			searchtype: isUndefined(params.searchType) ? 0 : params.searchType,
			searchid: isUndefined(params.searchID) ? "0" : params.searchID,
			errorcode: isUndefined(params.errorCode) ? 0 : params.errorCode,
			msg: isUndefined(params.msg) ? "UNDEFINED_MSG" : encodeURIComponent(params.msg),
			errorcode_soso: isUndefined(params.errorCodeSoso) ? 0 : params.errorCodeSoso,
			msg_soso: isUndefined(params.msgSoso) ? "UNDEFINED_MSG" : encodeURIComponent(params.msgSoso),
			browsertype: isUndefined(params.browserType) ? "OTHER" : encodeURIComponent(params.browserType),
			browserversion: isUndefined(params.browserVersion) ? "0" : encodeURIComponent(params.browserVersion)
		};
		var jg = new QZFL.JSONGetter(qs.URL.errlog, null, data, "utf-8");
		jg.onSuccess = function(o) {};
		jg.onError = function() {};
		jg.send("callback")
	},
	PV: function(path, opt) {
		if (path) {
			qs.tcssPV(path);
			qs.sosoPV(qs.searchid, path, opt)
		}
	},
	tcssPV: function(path, domain) {
		domain = domain || "searchact";
		g_Parent.TCISD.pv(domain + ".qzone.qq.com", "/" + path)
	},
	sosoPV: function(searchid, path, opt) {
		var data = {
			uin: g_Uin,
			searchid: searchid || "",
			path: path || ""
		};
		if ("object" == typeof opt) for (var key in opt) data[key] = opt[key];
		var jg = new QZFL.JSONGetter(qs.URL.sosopv,
			null, data, "utf-8");
		jg.onSuccess = function(o) {};
		jg.onError = function() {};
		jg.send("callback")
	},
	setEntry: function(id) {
		qs.Parameters.entry = id
	},
	setLogo: function(dom) {
		var styleNonIE6 = "background:url(http://{siDomain}/qzonestyle/qzone_client_v5/proj_search/{logo}.png);",
			styleIE6 = "background:none;filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=noscale, src='http://{siDomain}/qzonestyle/qzone_client_v5/proj_search/{logo}.png');",
			style, a, b, isDeepStyleFlag;
		isDeepStyleFlag =
			isDeepStyle();
		style = QZFL.userAgent.ie == 6 ? styleIE6 : styleNonIE6;
		style = format(style, {
			siDomain: g_Parent.siDomain,
			logo: isDeepStyleFlag ? "logo_soso_dark" : "logo_soso"
		});
		if (a = $("logo_top")) a.style.cssText = style;
		if (b = $("logo_bottom")) b.style.cssText = style;
		if (c = $("soso_logo_top")) if (isDeepStyleFlag) QZFL.css.addClassName(c, "logo_dark");
			else QZFL.css.removeClassName(c, "logo_dark")
	},
	search: function(keyword, option, keepparam) {
		var params = qs.Parameters,
			oldBusinesstype = params.businesstype,
			isPagerSearch = true,
			isPageChanged =
				false,
			isBusinesstypeChanged = false;
		if (typeof keyword == "boolean") {
			keepparam = keyword;
			option = null;
			keyword = null
		} else if (typeof keyword == "object") {
			keepparam = option;
			option = keyword;
			keyword = null
		}
		option = option || {};
		if (!keepparam && qs.Filter.getDefaultParameters) QZFL.extend(params, qs.Filter.getDefaultParameters());
		if (typeof option.start == "undefined" || typeof option.end == "undefined") {
			isPagerSearch = false;
			qs.PageNav.reset();
			option.start = qs.PageNav.rStart;
			option.end = qs.PageNav.rEnd
		}
		if ( !! option && typeof option == "object") QZFL.extend(params,
				option);
		if ( !! keyword || keyword == "") params.search = keyword;
		params.search = QZFL.string.trim(params.search);
		if (params.search.length > 60) params.search = params.search.substr(0, 60);
		params.businesstype = qs.businesstypeMap[params.businesstype] || "7";
		isBusinesstypeChanged = oldBusinesstype != params.businesstype;
		isPageChanged = !((params.businesstype == 7 || params.businesstype == 1 || params.businesstype == 2) && qs.Home || params.businesstype == -1 && qs.Soren || params.businesstype == -2 && qs.HotSearch);
		if (!keepparam && !isPageChanged) qs.Filter.reset();
		if (isPageChanged) location.href = qs.pageCanvas[params.businesstype] + ".html?" + genHttpParamString(params);
		else {
			if (!isPagerSearch) setTimeout(function() {
					qs.scrollToPageTop(isBusinesstypeChanged)
				}, 400);
			qs.Extend.TopSearch.setValue(params.search);
			qs.Extend.BottomSearch.setValue(params.search);
			if (isBusinesstypeChanged) qs.SearchHistory.init();
			qs.SearchHistory.insert(params.search);
			qs.NavigationBar.switchTab();
			qs.doSearch(params)
		}
	},
	getStr: function(str) {
		return "'" + str + "'"
	},
	getMaxStr: function(str, max) {
		str = QZFL.string.restHTML(str);
		if (QZFL.string.getRealLen(str) < max) return escHTML(str);
		var newStr = escHTML(QZFL.string.cut(str, max - 3)) + "&hellip;";
		return newStr
	},
	_formatNum: function(num) {
		var re1, re2;
		re1 = /^(\+|-)?\d+(\.\d+)?$/;
		if (!re1.test(num)) return num;
		var re2 = new RegExp;
		re2.compile("(\\d)(\\d{3})(,|\\.|$)");
		num += "";
		while (re2.test(num)) num = num.replace(re2, "$1,$2$3");
		return num
	},
	formatCount: function(num) {
		if ("number" != typeof num) return;
		var count = "";
		if (num <= 1E4) count = qs._formatNum(num);
		else if (num > 1E4 && num <= 1E8) count = qs._formatNum((num /
				1E4).toFixed(1)) + "\u4e07";
		else count = qs._formatNum((num / 1E8).toFixed(1)) + "\u4ebf";
		return count
	},
	setReturnURL: function() {
		var p = qs.Parameters;
		if ("undefined" != p.appname && "undefined" != p.backurl && undefined != p.appname && undefined != p.backurl) {
			var olink = $e("#return_link");
			olink.setHtml(decodeURIComponent("\u8fd4\u56de" + p.appname));
			olink.unBind("click");
			olink.bind("click", function() {
				QZONE.FP.toApp(decodeURIComponent(p.backurl));
				return false
			})
		}
	},
	scrollToPageTop: function(forceToTop) {
		var frameTop = $e(frameElement).getXY()[1],
			scrollY = QZFL.dom.getScrollTop(top.document);
		if (6 != QZFL.userAgent.ie) frameTop = frameTop - 34;
		if (forceToTop || scrollY > frameTop) QZONE.FP.setScrollTop(frameTop)
	},
	getSearchId: function() {
		return g_Uin + "_" + (new Date).getTime() + "_" + Math.floor(Math.random() * 1E10)
	},
	hideModules: QZFL.emptyFn
};
qs.Extend = {
	ResultCount: {
		el: null,
		show: function(count) {
			var resultNumText = "";
			count = count || 0;
			this.el = $("result_count");
			if (!this.el) return;
			if (count) {
				resultNumText = (count == 0 ? count : "\u7ea6" + qs._formatNum(count)) + "\u6761\u7ed3\u679c";
				this.el.innerHTML = resultNumText;
				$e(this.el).removeClass("none")
			} else;
		},
		hide: function() {
			this.el && (this.el.innerHTML = "&nbsp;");
			$e(this.el).addClass("none")
		}
	},
	GuessWords: {
		el: null,
		init: function(o) {
			this.el = $("search_guess");
			if (!this.el) return;
			if (o.data && o.data.data && o.data.data.fixWords &&
				o.data.data.fixWords.length > 0) {
				this.el.innerHTML = tmpl("tmpl_guess", {
					data: o.data.data.fixWords
				});
				$e(this.el).find(".j_link").onClick(function() {
					qs.PV("qc");
					qs.search($e(this).getHtml(), {
						entry: 13
					})
				});
				this.show()
			} else this.hide()
		},
		show: function() {
			$e(this.el).removeClass("none")
		},
		hide: function() {
			this.el && (this.el.innerHTML = "");
			$e(this.el).addClass("none")
		}
	},
	SimilarWords: {
		container: null,
		ishotwords: false,
		init: function(o, showHotwords) {
			var _this = qs.Extend.SimilarWords,
				data = o.data && o.data.data && o.data.data.similarWords &&
					o.data.data.similarWords.length > 0 ? o.data.data.similarWords : null,
				type = 0;
			_this.ishotwords = false;
			_this.container = $("related_container");
			if (!_this.container) return;
			if (showHotwords !== false) {
				showHotwords = true;
				_this.ishotwords = true
			}
			if (true == showHotwords) if (qs.HotWords.data) {
					data = _this._genDataFromHotwords(qs.HotWords.data);
					type = 1
				}
			if (data && data.length > 0) {
				_this._present(data, type);
				_this._bindEvent();
				_this.show()
			} else _this.hide()
		},
		_genDataFromHotwords: function(data) {
			var _this = qs.Extend.SimilarWords,
				list = shuffleArray(data).slice(0,
					10),
				ar = [];
			for (var i = 0, len = list.length; i < len; i++) if (_this.ishotwords) ar.push({
						word: list[i].title,
						key: list[i].keyword
					});
				else ar.push({
						word: list[i].title
					});
			return ar
		},
		_present: function(data, type) {
			var _this = qs.Extend.SimilarWords,
				_data = QZFL.extend([], data),
				arr = [],
				type = type || 0;
			for (var i = 0, len = _data.length; i < len; i++) arr.push(_data[i]);
			_this.container.innerHTML = tmpl("tmpl_similarwords", {
				data: arr,
				type: type,
				ishotwords: _this.ishotwords
			})
		},
		_bindEvent: function() {
			var _this = qs.Extend.SimilarWords;
			$e(this.container).find(".j_link").onClick(function() {
				qs.PV("hint");
				if (_this.ishotwords) qs.search($e(this).getAttr("data-key"), {
						entry: 14,
						businesstype: 7
					});
				else qs.search($e(this).getHtml(), {
						entry: 14
					})
			})
		},
		show: function() {
			var _this = qs.Extend.SimilarWords;
			$e(_this.container).removeClass("none")
		},
		hide: function() {
			var _this = qs.Extend.SimilarWords;
			if (_this.container) {
				_this.container.innerHTML = "";
				$e(_this.container).addClass("none")
			}
		}
	},
	BottomSearch: {
		mainContainer: $("main_container"),
		element: $("search_bottom_bar"),
		inputBox: $("search_bottom_keyword"),
		pvMap: {
			"home": ["search-bottom",
					"results-bottom"
			],
			"soren": ["search-bottom", "results-bottom"]
		},
		entryMap: {
			"home": 15,
			"soren": 403
		},
		pageLoad: "",
		init: function() {
			var b = qs.Extend.BottomSearch;
			if (b.element) {
				if (qs.Home) b.pageLoad = "home";
				else if (qs.Soren) b.pageLoad = "soren";
				else if (qs.HotSearch) b.pageLoad = "hotsearch";
				$e(this.inputBox).onKeyDown(function() {
					b.searchInputKeydown(event)
				});
				$e("#search_bottom_btn").onClick(function() {
					b.search();
					var pv = b.pvMap[b.pageLoad];
					for (var i in pv) qs.PV(pv[i])
				})
			}
		},
		hide: function() {
			QZFL.css.addClassName(this.element,
				"none")
		},
		show: function() {
			var b = qs.Extend.BottomSearch;
			if (b.mainContainer.offsetHeight > 700) QZFL.css.removeClassName(this.element, "none");
			else b.hide()
		},
		search: function(opt) {
			var b = qs.Extend.BottomSearch;
			var keywords = b.inputBox.value;
			opt = opt || {};
			if (typeof opt.entry === "undefined") opt.entry = b.entryMap[b.pageLoad];
			qs.PV("results-bottom", {
				businesstype: 1
			});
			qs.search(keywords, opt)
		},
		searchInputKeydown: function() {
			var b = qs.Extend.BottomSearch,
				e = QZFL.event.getEvent(event);
			if (e.keyCode == "13") {
				qs.PV("results-bottom");
				b.search()
			}
		},
		setValue: function(val) {
			var b = qs.Extend.BottomSearch;
			if (b.inputBox) b.inputBox.value = val
		},
		getValue: function(val) {
			var b = qs.Extend.BottomSearch;
			if (b.inputBox) return b.inputBox.value
		}
	},
	TopSearch: {
		inputBox: $("search_keyword"),
		smartBox: null,
		pvMap: {
			"home": ["search-top", "results-top"],
			"soren": ["search-top", "results-top"],
			"hotsearch": ["hotwords-search"]
		},
		entryMap: {
			"home": 15,
			"soren": 64,
			"hotsearch": 31
		},
		pageLoad: "",
		init: function() {
			var t = qs.Extend.TopSearch;
			if (qs.Home) t.pageLoad = "home";
			else if (qs.Soren) t.pageLoad =
					"soren";
			else if (qs.HotSearch) t.pageLoad = "hotsearch";
			if (t.pageLoad == "home") {
				var smartType = "home";
				if (t.smartBox != null) return;
				QZFL.imports("http://" + g_Parent.siDomain + "/qzone/v6/navigation/navigation_search_2.0.js", function() {
					var smartOpt = {
						"id": "result_top",
						"smartType": smartType,
						"searchBtn": $("search_btn"),
						"inputBox": $("search_keyword"),
						"offsetLeft": ua && ua.ie ? -1 : -1,
						"offsetTop": ua && ua.ie ? 1 : 1,
						"showMore": false,
						"containerWidth": 523,
						"doSearch": function(keywords, entry) {
							qs.search(keywords, {
								entry: entry
							})
						},
						searchidObj: qs
					};
					t.smartBox = new QZONE.Search;
					t.smartBox.init(smartOpt)
				})
			} else if (t.pageLoad == "soren" || t.pageLoad == "hotsearch") {
				$e(t.inputBox).onKeyDown(function() {
					t.searchInputKeydown(event)
				});
				$e("#search_btn").onClick(function() {
					if ("" == QZFL.string.trim(t.inputBox.value)) t.inputBox.focus();
					else {
						t.search();
						var pv = t.pvMap[t.pageLoad];
						for (var i in pv) qs.PV(pv[i])
					}
				})
			}
		},
		search: function(opt) {
			var t = qs.Extend.TopSearch,
				keywords = t.inputBox.value;
			opt = opt || {};
			if (typeof opt.entry === "undefined") opt.entry = t.entryMap[t.pageLoad];
			if (t.pageLoad === "hotsearch") opt.businesstype = 7;
			var pvBusinesstype = 0;
			if (t.pageLoad === "home");
			else if (t.pageLoad === "soren") pvBusinesstype = 2;
			else if (t.pageLoad === "hotsearch") pvBusinesstype = 9;
			qs.PV("results-top", {
				businesstype: pvBusinesstype
			});
			qs.search(keywords, opt)
		},
		searchInputKeydown: function() {
			var t = qs.Extend.TopSearch,
				e = QZFL.event.getEvent(event);
			if (e.keyCode == "13") t.search()
		},
		setValue: function(val) {
			var t = qs.Extend.TopSearch;
			if (t.inputBox) t.inputBox.value = val
		},
		getValue: function() {
			var t = qs.Extend.TopSearch;
			if (t.inputBox) return t.inputBox.value;
			else return ""
		}
	},
	Tips: {
		element: $("search_no_result"),
		show: function(msg) {
			var d = qs.Extend.Tips.element;
			d && (d.innerHTML = msg);
			$e(d).removeClass("none")
		},
		hide: function() {
			var d = qs.Extend.Tips.element;
			d && (d.innerHTML = "");
			$e(d).addClass("none")
		}
	},
	noResult: {
		init: function() {
			qs.Extend.Error.init()
		},
		transMatrix: {
			"-100": "-900",
			"-101": "-900",
			"-102": "-102",
			"-103": "-103",
			"-104": "-900",
			"-105": "-105",
			"-106": "-900",
			"-200": "-900",
			"-201": "-900",
			"-202": "-900",
			"-203": "-900",
			"-204": "-900",
			"-205": "-900",
			"-300": "-900",
			"-301": "-900",
			"-302": "-900",
			"-3000": "-900",
			"-3001": "-900",
			"-3002": "-900",
			"-900": "-900",
			"-901": "-901",
			"-902": "-902",
			"-700": "-700"
		},
		showTips: function(code, type) {
			qs.hideModules();
			var m;
			if (undefined == code) code = -102;
			code = qs.Extend.noResult.transMatrix[code];
			if (undefined == type) type = "other";
			if (-102 == code) if (128 < QZFL.string.getRealLen(qs.Parameters.search)) m = "\u641c\u7d22\u8bcd\u8d85\u8fc7\u89c4\u5b9a\u957f\u5ea6\uff0c\u8bf7\u7f29\u51cf\u5185\u5bb9\u540e\u518d\u6b21\u641c\u7d22";
				else {
					var tmpl_noResult = '\t\t\t\t\t     <p>\u62b1\u6b49\uff0c\u672a\u641c\u5230\u4e0e\u201c<span class="c_tx4">{0}</span>\u201d\u5339\u914d\u7684\u7ed3\u679c</p>\t\t\t\t\t     <p>\u5982\u679c\u60a8\u9009\u62e9\u4e86\u7b5b\u9009\u6761\u4ef6\uff0c\u8bf7\u5c1d\u8bd5<a href="javascript:;" class="j_clear_filter">\u6e05\u7a7a\u7b5b\u9009\u6761\u4ef6</a></p>\t\t\t\t\t     <p class="suggest ui_pt5">\u5efa\u8bae\u60a8\uff1a</p>\t\t\t\t\t     <p class="suggest"><span class="point_one">\u25cf </span>\u7b80\u5316\u60a8\u8f93\u5165\u7684\u8bcd\u6c47&nbsp;\u6216&nbsp;\u4f7f\u7528\u5176\u4ed6\u76f8\u5173\u8bcd\u8bed</p>\t\t\t\t\t     <p class="suggest"><span class="point_two">\u25cf </span>\u4ecd\u7136\u60f3\u77e5\u9053\uff1f\u8fdb\u884c\u7f51\u9875\u641c\u7d22\uff1a<a href="http://www.soso.com/" target="_blank">SOSO\u66f4\u61c2\u4f60</a></p>\t\t\t\t\t     ';
					var key = qs.Parameters.search !== "" ? qs.Parameters.search : qs.Extend.TopSearch.getValue();
					m = format(tmpl_noResult, escHTML(key))
				} else
			if (-103 == code) m = "\u62b1\u6b49\uff0c\u641c\u7d22\u7ed3\u679c\u53ef\u80fd\u4e0d\u7b26\u5408\u76f8\u5173\u6cd5\u89c4\u3001\u653f\u7b56\uff0c\u672a\u4e88\u663e\u793a";
			else if (-105 == code) {
				if ("soren" == type) m = "\u62b1\u6b49\uff0c\u60a8\u7684\u641c\u7d22\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5"
			} else if (-900 == code) {
				var error = qs.Extend.Error;
				error.show($e(".search_sidebar"),
					$e("#bingo_container"), $e(".search_top"), $e(".search_main"));
				return
			} else if (-901 == code) m = "\u8bf7\u5148\u586b\u5199\u641c\u7d22\u8bcd\u6216\u9009\u62e9\u7b5b\u9009\u6761\u4ef6";
			else if (-902 == code) m = "\u641c\u7d22\u8bcd\u4e3a\u7a7a\uff0c\u8bf7\u8f93\u5165\u5185\u5bb9\u540e\u518d\u6b21\u641c\u7d22";
			else if (-700 == code) m = "";
			else if ("soren" == type) m = "\u62b1\u6b49\uff0c\u627e\u4e0d\u5230\u4e0e\u201c" + escHTML(qs.Parameters.search) + "\u201d\u76f8\u7b26\u7684\u7528\u6237";
			else m = "\u62c9\u53d6\u6570\u636e\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5";
			qs.Extend.Tips.show(m);
			$e(".j_clear_filter").onClick(function() {
				qs.Filter.resetCondition({
					entry: 59
				});
				qs.PV("history", {
					actiontype: 1
				})
			})
		},
		hideTips: function() {
			qs.Extend.Tips.hide();
			qs.Extend.Error.hide()
		}
	},
	Error: {
		container: $("error_out_container"),
		init: function() {
			var _this = qs.Extend.Error;
			qsbase.sendClickStream(_this.container)
		},
		show: function() {
			var _this = qs.Extend.Error,
				el = $e(_this.container);
			for (var i = arguments.length - 1; i >= 0; i--) arguments[i].hide();
			el.removeClass("none")
		},
		hide: function() {
			var _this =
				qs.Extend.Error,
				el = $e(_this.container);
			el.addClass("none")
		}
	}
};
qs.Interface = {
	Share: {
		sendShareFeed: function(shareData, opt, succCallback, errCallback) {
			shareData.uin = shareData.uin ? shareData.uin : g_Uin;
			shareData.site = shareData.site ? shareData.site : "\u7a7a\u95f4\u641c\u7d22";
			shareData.type = shareData.type ? shareData.type : 21;
			shareData.url = shareData.url ? shareData.url : "http://rc.qzone.qq.com/qzonesoso/isfromic=1&businesstype=all&entry=" + (opt.entryID ? opt.entryID : "72") + "&search=" + encodeURIComponent(shareData.keyword);
			var fs = new QZFL.FormSender("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshareadd_url2",
				"post", shareData, "utf-8");
			fs.onSuccess = function(o) {
				if (succCallback) succCallback()
			};
			fs.onError = function() {
				if (errCallback) errCallback()
			};
			fs.send()
		}
	}
};
qs.UserInfo = {
	queue: {
		nickname: [],
		qqremark: [],
		vip: [],
		vip2: [],
		mood: []
	},
	presentUserInfo: function(el, type, opt) {
		var arrEl = [],
			arrUin = [],
			regx_link = /nameCard_(\d{5,10})/,
			arrUinPool = [],
			arrElPool = [],
			els = el.find(".q_" + type).elements,
			tmp, uin;
		for (var i = 0, len = els.length; i < len; i++) if (tmp = regx_link.exec(els[i].getAttribute("link"))) {
				arrEl.push(els[i]);
				uin = parseInt(tmp[1], 10);
				els[i].uin = uin;
				arrUin.push(uin)
			}
		arrUinPool = arrUin.splice(0, 30);
		arrElPool = arrEl.splice(0, 30);
		this.queue[type].push([arrElPool, arrUinPool]);
		while (arrUin.length >
			0) {
			arrUinPool = arrUin.splice(0, 30);
			arrElPool = arrEl.splice(0, 30);
			this.queue[type].push([arrElPool, arrUinPool])
		}
		this._makePresent(type, opt)
	},
	_makePresent: function(type, opt) {
		var arr, th = qs.UserInfo;
		if (arr = th.queue[type].shift()) th["_" + type](arr[0], arr[1], type, opt)
	},
	_qqremark: function(els, arrUin, type, opt) {
		var reg, highlightWord = opt.searchWord || "";
		QZONE.FP.getRemarkList(function(rmks) {
			rmks = rmks || {};
			var uin;
			QZFL.object.each(els, function(el) {
				uin = el.uin, rmk = rmks[uin];
				if (rmk) {
					rmk = escHTML(QZFL.string.trim(rmks[uin]));
					reg = new RegExp(highlightWord, "i");
					if ("" != highlightWord) rmk = rmk.replace(reg, '<span class="c_tx4">' + highlightWord + "</span>");
					if ("" != rmk) {
						parentTitle = el.parentNode.title;
						var tmpArr = parentTitle.split(" ");
						if (0 < tmpArr.length) {
							el.parentNode.title = tmpArr[0] + " [" + rmk + "] ";
							if (tmpArr[1]) el.parentNode.title += tmpArr[1]
						} else el.parentNode.title = parentTitle + " [" + rmk + "]";
						el.innerHTML = "[" + rmk + "]"
					}
				}
			}, {
				customTime: 250
			});
			setTimeout(function() {
				qs.UserInfo._makePresent(type)
			}, 500)
		})
	},
	_nickname: function(els, arrUin, type) {
		QZONE.FP.getRemarkList(function(rmks) {
			rmks =
				rmks || {};
			QZONE.FP.getPortraitList(arrUin, function(data) {
				if (data) {
					var uin, info;
					QZFL.object.each(els, function(el) {
						uin = el.uin, info = data[uin], rmk = rmks[uin];
						if (rmk) el.innerHTML = QZFL.string.escHTML(rmk);
						else if (info && info[6] != undefined) el.innerHTML = info[6]
					}, {
						customTime: 250
					})
				}
				setTimeout(function() {
					qs.UserInfo._makePresent(type)
				}, 500)
			})
		})
	},
	_vip: function(els, arrUin, type) {
		QZONE.FP.getPortraitList(arrUin, function(data) {
			if (data) {
				var uin, info;
				QZFL.object.each(els, function(el) {
					uin = el.uin, info = data[uin];
					if (info &&
						info[3] != undefined && info[3] != 0) if (type == "vip2") el.innerHTML = format('<i class="qz_vip_icon_m_{0}"></i>', info[3]);
						else el.innerHTML = format('<i class="qz_vip_icon_s_{0}"></i>', info[3], uin)
				}, {
					customTime: 250
				})
			}
			setTimeout(function() {
				qs.UserInfo._makePresent(type)
			}, 500)
		})
	},
	_vip2: function(els, arrUin, type) {
		qs.UserInfo._vip(els, arrUin, "vip2")
	},
	_mood: function(els, arrUin, type) {
		qs.Mood.getMoodList(arrUin, function(data) {
			var uin;
			QZFL.object.each(els, function(el) {
				var html = "";
				if (data.update[el.uin] || data.emotion[el.uin]) return el.innerHTML =
						tmpl("tmpl_userupdate", {
						emotion: data.emotion[el.uin],
						update: data.update[el.uin]
					})
			})
		})
	}
};
qs.Filter = {
	item: null,
	init: QZFL.emptyFn,
	reset: QZFL.emptyFn,
	resetCondition: QZFL.emptyFn,
	getDefaultParameters: QZFL.emptyFn
};
qs.SearchHistory = {
	type: null,
	item: null,
	data: null,
	init: function() {
		var _this = qs.SearchHistory,
			page = qs.Parameters.businesstype - 0 + 12;
		_this.type = "qzone_soso_history_" + page + "_";
		try {
			QZONE.FP.synSORead("so", 5E3, function() {
				qs.SearchHistory._init()
			})
		} catch (err) {
			return
		}
	},
	_init: function() {
		var el = $("history_container"),
			th = qs.SearchHistory;
		if (el) {
			th.item = el;
			th.getData();
			th.show()
		}
	},
	_parseData: function(o, parser) {
		var data = [];
		for (var k in o) data[k] = o[k];
		return data
	},
	getData: function() {
		var th = qs.SearchHistory,
			so = g_Parent.QZFL.shareObject,
			soKey = th.type + g_Uin,
			arrData;
		var data = null;
		try {
			data = so.get(soKey)
		} catch (err) {
			return
		}
		if (data && typeof data == "object") {
			arrData = th._parseData(data);
			th.data = arrData;
			th.present();
			th.bindEvent()
		}
	},
	present: function() {
		var tmpl = '<div class="section">\t\t\t\t\t<div class="section_header">\t\t\t\t\t\t<h3>\u641c\u7d22\u5386\u53f2</h3>\t\t\t\t\t\t<a class="more" href="javascript:;">\u6e05\u7a7a</a>\t\t\t\t\t</div>\t\t\t\t\t<div class="sidebar_recent_search">\t\t\t\t\t\t<ul>{0}</ul>\t\t\t\t\t</div>\t\t\t\t</div>',
			tmplItem = '<li><a class="item textoverflow" href="javascript:;" data-keyword="{0}">{1}<i class="ui_x" title="\u5220\u9664\u8bb0\u5f55">\u00d7</i></a></li>';
		var th = qs.SearchHistory,
			data = th.data,
			tmp, txtShow, arrLi = [];
		if (th.item == null) return;
		for (var i = 0, len = data.length; i < len; i++) {
			tmp = data[i];
			txtShow = QZFL.string.getRealLen(tmp) > 44 ? escHTML(QZFL.string.cut(tmp, 42, "")) + "&hellip;" : escHTML(tmp);
			arrLi.push(format(tmplItem, escHTML(tmp), txtShow))
		}
		th.item.innerHTML = format(tmpl, arrLi.length > 0 ? arrLi.join("") : '<span class="c_tx3">\u6682\u65e0\u641c\u7d22\u8bb0\u5f55</span>')
	},
	bindEvent: function() {
		var th = qs.SearchHistory;
		$e(th.item).find("a.more").onClick(function() {
			th.clear();
			th.getData()
		});
		$e(th.item).find("a.item").onClick(function() {
			th.doSearch(this);
			QZFL.event.preventDefault()
		});
		$e(th.item).find("a.item i").onClick(function() {
			th.deleteItem(this);
			QZFL.event.cancelBubble()
		});
		if (6 == QZFL.userAgent.ie) {
			$e(th.item).find("a.item").bind("mouseover", function() {
				$e(this).find("i").eq(0).style.display = "block";
				return false
			});
			$e(th.item).find("a.item").bind("mouseout", function() {
				$e(this).find("i").eq(0).style.display =
					"";
				return false
			})
		}
	},
	insert: function(key) {
		var so = g_Parent.QZFL.shareObject,
			th = qs.SearchHistory,
			soKey = th.type + g_Uin,
			data, arrData = [];
		try {
			data = so.get(soKey)
		} catch (err) {
			return
		}
		if (key && key.length == 0 || key == "") {
			th.getData();
			return
		}
		if (data && typeof data == "object") arrData = th._parseData(data);
		arrData.unshift(key);
		try {
			so.set(soKey, uniqueArray(arrData).slice(0, 5))
		} catch (err) {}
		th.getData()
	},
	deleteItem: function(el) {
		var so = g_Parent.QZFL.shareObject,
			th = qs.SearchHistory,
			soKey = th.type + g_Uin,
			data, arrData = [],
			key = el.parentNode.getAttribute("data-keyword");
		try {
			data = so.get(soKey)
		} catch (err) {
			return
		}
		if (data && typeof data == "object") {
			arrData = th._parseData(data);
			var n = -1;
			for (var i = 0; i < arrData.length; i++) if (arrData[i] == key) {
					n = i;
					break
				}
			if (n > -1) arrData.splice(n, 1)
		}
		try {
			so.set(soKey, uniqueArray(arrData).slice(0, 5))
		} catch (err) {}
		th.getData()
	},
	doSearch: function(el) {
		var keyword;
		qs.PV("history");
		if (el && (keyword = el.getAttribute("data-keyword"))) {
			qs.search(keyword, {
				entry: 12
			});
			return
		}
	},
	clear: function() {
		var _this = qs.SearchHistory,
			so = g_Parent.QZFL.shareObject,
			soKey = _this.type +
				g_Uin;
		try {
			so.set(soKey, [])
		} catch (err) {}
	},
	itemOver: function(el) {
		var obj = el.childNodes[el.childNodes.length - 1];
		QZFL.css.removeClassName(obj, "none")
	},
	itemOut: function(el) {
		var obj = el.childNodes[el.childNodes.length - 1];
		QZFL.css.addClassName(obj, "none")
	},
	show: function() {
		var _this = qs.SearchHistory;
		$e(_this.item).removeClass("none")
	},
	hide: function() {
		var _this = qs.SearchHistory;
		$e(_this.item).addClass("none")
	}
};
qs.HotWords = {
	container: null,
	data: null,
	tipsShow: null,
	init: function(id) {
		var el = $(id),
			_this = qs.HotWords;
		if (el && (_this.container = el)) _this.getData()
	},
	getData: function(callback) {
		var _this = qs.HotWords;
		var jg = new QZFL.JSONGetter(qs.URL.hotsearch, "hotsearch", {
			uin: g_Uin
		}, "utf-8");
		var ts = new Date;
		jg.onSuccess = function(o) {
			var te = new Date;
			if (qs.isCgiReturnCodeOk(o.ret)) g_Parent.TCISD.valueStat(400519, 1, 13, {
					duration: te - ts
				});
			else g_Parent.TCISD.valueStat(400519, 3, 15, {
					duration: te - ts
				});
			_this.data = o && o.data && o.data.resultdata ?
				o.data.resultdata : [];
			if (0 < _this.data.length) {
				_this.present();
				_this.addEvents();
				_this.show();
				if (typeof callback == "function") callback()
			} else _this.hide()
		};
		jg.onError = function() {
			var te = new Date;
			g_Parent.TCISD.valueStat(400519, 2, 14, {
				duration: te - ts
			});
			_this.hide()
		};
		jg.send("callback")
	},
	present: function() {
		var _this = qs.HotWords,
			tmpl = '<div class="section">\t\t\t\t\t<div class="section_header">\t\t\t\t\t\t<h3>\u70ed\u95e8\u8bdd\u9898</h3>\t\t\t\t\t\t<a href="javascript:;" class="more j_more j_clickreport" title="\u67e5\u770b\u66f4\u591a" data-path="hotwords-result" data-type="-2">\u66f4\u591a&gt;&gt;</a>\t\t\t\t\t</div>\t\t\t\t\t<div class="sidebar_hot_topic">\t\t\t\t\t\t<ul>{0}</ul>\t\t\t\t\t</div>\t\t\t\t</div>',
			tmplItem = '<li data-order="{0}"><a href="javascript:;" class="j_hotword" data-key="{1}" data-islink="{2}" data-istip="{3}" >{4}</a>{5}</li>',
			tmplTip = '<div class="bubble bor3 breakword j_hotword {0} {1}" data-key="{2}" data-islink="{3}" data-istip="{4}" >\t\t\t\t\t<div class="arr bor3"><div class="bor_bg"></div></div>\t\t\t\t\t<div class="cont">{5}</div>\t\t\t\t\t<div class="bless like j_cancelBubble"></div>\t\t\t\t</div>',
			data = _this.data,
			tmp, arrLi = [],
			tipTmpl, key = "";
		var tips, style, css, text, itemHtml,
			max = 48,
			searchWords = qs.Parameters.search,
			matchIndex = 0;
		for (var i = 0, len = data.length; i < len; i++) {
			tmp = data[i];
			key = tmp.keyword;
			if (QZFL.string.trim(key) == QZFL.string.trim(searchWords)) {
				matchIndex = i;
				break
			}
		}
		for (var i = 0, len = data.length; i < len; i++) {
			tmp = data[i];
			key = tmp.keyword ? tmp.keyword : tmp.title;
			tipTmpl = tmplTip;
			if (tmp.tip) {
				text = tmp.tip;
				if (QZFL.string.getRealLen(text) > max) text = escHTML(QZFL.string.cut(text, max - 2)) + "&hellip;";
				else text = escHTML(text);
				style = "none";
				css = "";
				if (i == matchIndex) {
					style = "";
					css = "default"
				}
				tips =
					format(tipTmpl, css, style, key, !! tmp.link, true, text)
			} else tips = "";
			itemHtml = format(tmplItem, tmp.order, key, !! tmp.link, false, tmp.title.replace(/\s/g, ""), tips);
			arrLi.push(itemHtml)
		}
		_this.container.innerHTML = format(tmpl, arrLi.join(""))
	},
	addEvents: function() {
		var _this = qs.HotWords,
			moreBtn = $e(_this.container).find(".j_more"),
			hotword = $e(_this.container).find(".j_hotword"),
			cancelBub = $e(_this.container).find(".j_cancelBubble");
		var elContainer = _this.container,
			itemElements = $e(elContainer).find("li"),
			itemShow;
		_this.tipsShow =
			$e(elContainer).find("div.default").eq(0), itemShow = $e(_this.tipsShow).getParent();
		_this.getLike(itemShow, function(o) {
			!o && $e(_this.tipsShow).setStyle("height", "auto")
		});
		var idSettimeout, text;
		itemElements.bind("mouseover", function() {
			var currentItem = this,
				currentTipsElem = $e(currentItem).find("div.bubble").eq(0);
			if (currentTipsElem != _this.tipsShow) if (0 < $e(currentTipsElem).elements.length) {
					text = QZFL.userAgent.firefox ? currentTipsElem.contentText : currentTipsElem.innerText;
					if ("" != QZFL.string.trim(text)) {
						idSettimeout =
							setTimeout(function() {
							qs.PV("hotwords-result-mouseover");
							_this.getLike($e(currentItem), function(o) {
								!o && $e(currentTipsElem).setStyle("height", "auto");
								$e(_this.tipsShow).addClass("none");
								$e(currentTipsElem).removeClass("none");
								_this.tipsShow = currentTipsElem
							})
						}, 500);
						$e(this).bind("mouseout", function() {
							clearTimeout(idSettimeout)
						})
					}
				}
		});
		moreBtn.onClick(function() {
			var type = $e(this).getAttr("data-type");
			qs.search({
				businesstype: type
			});
			return false
		});
		hotword.onClick(function() {
			var currentItem = $e(this).getParent(),
				currentTipsElem = $e(currentItem).find("div.bubble").eq(0);
			if (currentTipsElem != _this.tipsShow) if (0 < $e(currentTipsElem).elements.length) {
					text = QZFL.userAgent.firefox ? currentTipsElem.contentText : currentTipsElem.innerText;
					if ("" != QZFL.string.trim(text)) _this.getLike($e(currentItem), function(o) {
							!o && $e(currentTipsElem).setStyle("height", "auto");
							$e(_this.tipsShow).addClass("none");
							$e(currentTipsElem).removeClass("none");
							_this.tipsShow = currentTipsElem
						})
				}
			var key = $e(this).getAttr("data-key"),
				islink = $e(this).getAttr("data-islink") ===
					"true",
				istip = $e(this).getAttr("data-istip") === "true";
			_this.doSearch(key, islink, istip);
			return false
		});
		cancelBub.onClick(function() {
			QZFL.event.cancelBubble();
			return false
		});
		qsbase.sendClickStream(_this.container)
	},
	getItemData: function(order) {
		var _this = qs.HotWords,
			itemData;
		for (var i = 0, len = _this.data.length; i < len; i++) if (_this.data[i].order == order) {
				itemData = _this.data[i];
				break
			}
		return itemData
	},
	doSearch: function(keyword, isLink, isTip) {
		var _this = qs.HotWords;
		if (isTip) qs.PV("hotwords-result-tips-click");
		if (isLink) {
			qs.PV("hotwords-url");
			window.open(keyword)
		} else {
			qs.PV("hotwords");
			qs.search(keyword, {
				entry: 11,
				businesstype: 7
			})
		}
	},
	getLikeData: function(keys, callback) {
		var url = "http://" + QZONE.FP._t.g_R_Domain + "/cgi-bin/qzonesoso/cgi_qzonesoso_showlike",
			jg = new QZFL.JSONGetter(url, "hotsearch_getlike", {
				uin: g_Uin,
				keys: keys,
				t: (new Date).getTime()
			}, "utf-8");
		var ts = new Date;
		jg.onSuccess = function(o) {
			var te = new Date;
			if (qs.isCgiReturnCodeOk(o.ret)) g_Parent.TCISD.valueStat(400520, 1, 13, {
					duration: te - ts
				});
			else g_Parent.TCISD.valueStat(400520, 3, 15, {
					duration: te - ts
				});
			var data = o && o.ret == 0 && o.data && o.data.length > 0 ? o.data : null;
			if (typeof callback == "function") callback(data)
		};
		jg.onError = function() {
			var te = new Date;
			g_Parent.TCISD.valueStat(400520, 2, 14, {
				duration: te - ts
			});
			if (typeof callback == "function") callback()
		};
		jg.send("callback")
	},
	setLikeData: function(key, callback) {
		var url = "http://" + QZONE.FP._t.g_W_Domain + "/cgi-bin/qzonesoso/cgi_qzonesoso_dolike",
			jg = new QZFL.JSONGetter(url, "hotsearch_setlike", {
				uin: g_Uin,
				key: key,
				t: (new Date).getTime()
			}, "utf-8");
		var ts = new Date;
		jg.onSuccess = function(o) {
			var te = new Date;
			if (qs.isCgiReturnCodeOk(o.ret)) g_Parent.TCISD.valueStat(400521, 1, 13, {
					duration: te - ts
				});
			else g_Parent.TCISD.valueStat(400521, 3, 15, {
					duration: te - ts
				});
			var data = o && o.ret == 0 && o.data ? o.data : null;
			if (typeof callback == "function") callback(data)
		};
		jg.onError = function() {
			var te = new Date;
			g_Parent.TCISD.valueStat(400521, 2, 14, {
				duration: te - ts
			})
		};
		jg.send("callback")
	},
	getLike: function(item, callback) {
		if (item.eq(0)) {
			var _this = qs.HotWords,
				order = item.getAttr("data-order"),
				itemData = _this.getItemData(order);
			_this.getLikeData(itemData.likekey, function(likeData) {
				if (likeData) _this.updateLike(item, itemData, likeData[0]);
				if (typeof callback == "function") callback( !! likeData)
			})
		}
	},
	setLike: function(item, itemData, likeData) {
		var _this = qs.HotWords,
			likePanel = item.find("div.like"),
			likeBtn = likePanel.find("span.btn"),
			likeCount = likePanel.find("span.count"),
			likeFriends = likePanel.find("span.friends"),
			curCount = parseInt(likeCount.getHtml(), 10);
		likeBtn.setHtml("\u770b\u4e00\u770b").addClass("liked");
		likeFriends.setHtml(_this.formatFriends(likeData.friends,
			true));
		likeCount.setHtml(_this.formatCount(curCount + 1, likeData.friends.length == 0 ? -1 : 0));
		_this.setLikeData(itemData.likekey, function(likeData) {})
	},
	updateLike: function(item, itemData, likeData) {
		var _this = qs.HotWords;
		_this.presentLike(item, itemData, likeData);
		_this.addLikeEvents(item, itemData, likeData)
	},
	presentLike: function(item, itemData, likeData) {
		var _this = qs.HotWords,
			likeContainer = item.find("div.like"),
			tmplLike = '<div class="op"><span class="btn {4}"><i class="ui_ico {0}"></i><span class="op_name">{1}</span></span></div><div class="c_tx3"><span class="friends">{2}</span><span class="count">{3}</span>\u4eba{5}</div>',
			liked = likeData.liked - 0;
		likeContainer.setHtml(format(tmplLike, liked ? "" : "ico_" + itemData.likeicon, liked ? "\u770b\u4e00\u770b" : itemData.liketext, _this.formatFriends(likeData.friends, liked), _this.formatCount(likeData.count, liked && likeData.friends.length == 0 ? -1 : 0, true), liked ? "c_tx liked" : "c_tx", itemData.liketext))
	},
	addLikeEvents: function(item, itemData, likeData) {
		var _this = qs.HotWords,
			likeBtn = item.find("div.like span.btn");
		likeBtn.onClick(function() {
			if (!likeBtn.hasClass("liked")) {
				qs.PV("hotwords-like");
				_this.setLike(item,
					itemData, likeData);
				_this.sendShareFeed(itemData, likeData)
			} else {
				var currentItem = likeBtn.getParent().getParent().getParent().getParent(),
					currentTipsElem = $e(currentItem).find("div.bubble").eq(0);
				if (currentTipsElem != _this.tipsShow) if (0 < $e(currentTipsElem).elements.length) {
						text = QZFL.userAgent.firefox ? currentTipsElem.contentText : currentTipsElem.innerText;
						if ("" != QZFL.string.trim(text)) _this.getLike($e(currentItem), function(o) {
								!o && $e(currentTipsElem).setStyle("height", "auto");
								$e(_this.tipsShow).addClass("none");
								$e(currentTipsElem).removeClass("none");
								_this.tipsShow = currentTipsElem
							})
					}
				var key = $e(currentTipsElem).getAttr("data-key"),
					islink = $e(currentTipsElem).getAttr("data-islink") === "true",
					istip = $e(currentTipsElem).getAttr("data-istip") === "true";
				_this.doSearch(key, islink, istip);
				return false
			}
			QZFL.event.cancelBubble();
			return false
		})
	},
	formatFriends: function(friends, liked) {
		var tmp, realLen, displayName, friendsArr = [],
			likeFriends;
		liked = liked - 0;
		friends = friends.slice(0, 1);
		for (var i = 0, len = friends.length; i < len; i++) {
			tmp =
				friends[i];
			realLen = QZFL.string.getRealLen(tmp);
			if (realLen > 4) displayName = QZFL.string.escHTML(QZFL.string.cut(tmp, 4)) + "&hellip;";
			else displayName = QZFL.string.escHTML(tmp);
			friendsArr.push(format('<span title="{0}">{1}</span>', QZFL.string.escHTML(tmp), displayName))
		}
		likeFriends = (liked ? "\u6211\u548c" : "") + (friendsArr.length > 0 ? friendsArr.join("\u3001") + "\u7b49" : liked ? "\u5176\u4ed6" : "\u5df2\u6709");
		return likeFriends
	},
	formatCount: function(count, offset, isRealVal, num) {
		num = num - 0 || 7;
		var f = Math.pow(10, num - 1) - 1,
			c = !! isRealVal ? Math.floor(count * 9.13) : count;
		c += offset - 0 || 0;
		return num > 0 && c > f ? f + "+" : c
	},
	sendShareFeed: function(itemData, likeData) {
		var jumpUrl = itemData.link ? itemData.keyword : "http://rc.qzone.qq.com/qzonesoso/isfromic=1&businesstype=all&entry=72&search=" + encodeURIComponent(itemData.keyword),
			picUrl = itemData.picurl,
			dotIndex = picUrl.lastIndexOf("."),
			picUrl = picUrl ? picUrl.substr(0, dotIndex) + "_l" + picUrl.substr(dotIndex) : "";
		var data = {
			uin: g_Uin,
			site: "\u7a7a\u95f4\u641c\u7d22",
			type: 21,
			url: jumpUrl,
			title: itemData.title,
			comment: itemData.liketext,
			summary: itemData.sharetext || itemData.tip,
			images: picUrl,
			keyword: itemData.keyword
		};
		qs.Interface.Share.sendShareFeed(data, {
			entryId: 72
		}, function() {}, function() {})
	},
	show: function() {
		var _this = qs.HotWords;
		$e(_this.container).removeClass("none")
	},
	hide: function() {
		var _this = qs.HotWords;
		$e(_this.container).addClass("none")
	}
};
qs.PageNav = {
	el: $("more_search"),
	pIndex: 1,
	pSize: 15,
	rStart: 0,
	rEnd: 0,
	rCount: 0,
	onMorePage: QZFL.emptyFn,
	init: function() {
		var _this = qs.PageNav;
		_this.refreshStartEnd();
		_this.el && $e(_this.el).onClick(function() {
			_this.pIndex++;
			_this.refreshStartEnd();
			_this.onMorePage(_this.pIndex, _this.rStart, _this.rEnd, _this.rCount)
		})
	},
	refreshStartEnd: function() {
		var _this = qs.PageNav;
		_this.rStart = (_this.pIndex - 1) * _this.pSize;
		_this.rEnd = _this.pIndex * _this.pSize - 1;
		_this.rCount = _this.rEnd + 1
	},
	reset: function() {
		var _this = qs.PageNav;
		_this.pIndex = 1;
		_this.refreshStartEnd()
	},
	prev: function() {
		var _this = qs.PageNav;
		if (_this.pIndex > 1) _this.pIndex--;
		_this.refreshStartEnd()
	},
	hide: function() {
		var _this = qs.PageNav;
		$e(_this.el).addClass("none")
	},
	show: function() {
		var _this = qs.PageNav;
		$e(_this.el).removeClass("none")
	}
};
qs.Weibo = {};
(function() {
	var emList = {
		"\u5fae\u7b11": 100,
		"\u6487\u5634": 101,
		"\u8272": 102,
		"\u53d1\u5446": 103,
		"\u767c\u5446": 103,
		"\u5f97\u610f": 104,
		"\u6d41\u6cea": 105,
		"\u6d41\u6dda": 105,
		"\u5bb3\u7f9e": 106,
		"\u95ed\u5634": 107,
		"\u9589\u5634": 107,
		"\u7761": 108,
		"\u5927\u54ed": 109,
		"\u5c34\u5c2c": 110,
		"\u5c37\u5c2c": 110,
		"\u53d1\u6012": 111,
		"\u767c\u6012": 111,
		"\u8c03\u76ae": 112,
		"\u8abf\u76ae": 112,
		"\u5472\u7259": 113,
		"\u60ca\u8bb6": 114,
		"\u9a5a\u8a1d": 114,
		"\u96be\u8fc7": 115,
		"\u96e3\u904e": 115,
		"\u9177": 116,
		"\u51b7\u6c57": 117,
		"\u6293\u72c2": 118,
		"\u5410": 119,
		"\u5077\u7b11": 120,
		"\u53ef\u7231": 121,
		"\u53ef\u611b": 121,
		"\u767d\u773c": 122,
		"\u50b2\u6162": 123,
		"\u9965\u997f": 124,
		"\u98e2\u9913": 124,
		"\u56f0": 125,
		"\u60ca\u6050": 126,
		"\u9a5a\u6050": 126,
		"\u6d41\u6c57": 127,
		"\u61a8\u7b11": 128,
		"\u5927\u5175": 129,
		"\u594b\u6597": 130,
		"\u596e\u9b25": 130,
		"\u5492\u9a82": 131,
		"\u5492\u7f75": 131,
		"\u7591\u95ee": 132,
		"\u7591\u554f": 132,
		"\u5618": 133,
		"\u5653": 133,
		"\u6655": 134,
		"\u6688": 134,
		"\u6298\u78e8": 135,
		"\u8870": 136,
		"\u9ab7\u9ac5": 137,
		"\u9ab7\u9acf": 137,
		"\u6572\u6253": 138,
		"\u518d\u89c1": 139,
		"\u518d\u898b": 139,
		"\u64e6\u6c57": 140,
		"\u62a0\u9f3b": 141,
		"\u6473\u9f3b": 141,
		"\u9f13\u638c": 142,
		"\u7cd7\u5927\u4e86": 143,
		"\u574f\u7b11": 144,
		"\u5de6\u54fc\u54fc": 145,
		"\u53f3\u54fc\u54fc": 146,
		"\u54c8\u6b20": 147,
		"\u9119\u89c6": 148,
		"\u9119\u8996": 148,
		"\u59d4\u5c48": 149,
		"\u5feb\u54ed\u4e86": 150,
		"\u9634\u9669": 151,
		"\u9670\u96aa": 151,
		"\u4eb2\u4eb2": 152,
		"\u89aa\u89aa": 152,
		"\u5413": 153,
		"\u5687": 153,
		"\u53ef\u601c": 154,
		"\u53ef\u6190": 154,
		"\u83dc\u5200": 155,
		"\u897f\u74dc": 156,
		"\u5564\u9152": 157,
		"\u7bee\u7403": 158,
		"\u7c43\u7403": 158,
		"\u4e52\u4e53": 159,
		"\u5496\u5561": 160,
		"\u996d": 161,
		"\u98ef": 161,
		"\u732a\u5934": 162,
		"\u8c6c\u982d": 162,
		"\u73ab\u7470": 163,
		"\u51cb\u8c22": 164,
		"\u51cb\u8b1d": 164,
		"\u793a\u7231": 165,
		"\u793a\u611b": 165,
		"\u7231\u5fc3": 166,
		"\u611b\u5fc3": 166,
		"\u5fc3\u788e": 167,
		"\u86cb\u7cd5": 168,
		"\u95ea\u7535": 169,
		"\u9583\u96fb": 169,
		"\u70b8\u5f39": 170,
		"\u70b8\u5f48": 170,
		"\u5200": 171,
		"\u8db3\u7403": 172,
		"\u74e2\u866b": 173,
		"\u74e2\u87f2": 173,
		"\u4fbf\u4fbf": 174,
		"\u6708\u4eae": 175,
		"\u592a\u9633": 176,
		"\u592a\u967d": 176,
		"\u793c\u7269": 177,
		"\u79ae\u7269": 177,
		"\u62e5\u62b1": 178,
		"\u64c1\u62b1": 178,
		"\u5f3a": 179,
		"\u5f37": 179,
		"\u5f31": 180,
		"\u63e1\u624b": 181,
		"\u80dc\u5229": 182,
		"\u52dd\u5229": 182,
		"\u62b1\u62f3": 183,
		"\u52fe\u5f15": 184,
		"\u62f3\u5934": 185,
		"\u62f3\u982d": 185,
		"\u5dee\u52b2": 186,
		"\u5dee\u52c1": 186,
		"\u7231\u4f60": 187,
		"\u611b\u4f60": 187,
		"NO": 188,
		"no": 188,
		"OK": 189,
		"ok": 189,
		"\u7231\u60c5": 190,
		"\u611b\u60c5": 190,
		"\u98de\u543b": 191,
		"\u98db\u543b": 191,
		"\u8df3\u8df3": 192,
		"\u53d1\u6296": 193,
		"\u767c\u6296": 193,
		"\u6004\u706b": 194,
		"\u616a\u706b": 194,
		"\u8f6c\u5708": 195,
		"\u8f49\u5708": 195,
		"\u78d5\u5934": 196,
		"\u78d5\u982d": 196,
		"\u56de\u5934": 197,
		"\u56de\u982d": 197,
		"\u8df3\u7ef3": 198,
		"\u8df3\u7e69": 198,
		"\u6325\u624b": 199,
		"\u63ee\u624b": 199,
		"\u6fc0\u52a8": 200,
		"\u6fc0\u52d5": 200,
		"\u8857\u821e": 201,
		"\u732e\u543b": 202,
		"\u737b\u543b": 202,
		"\u5de6\u592a\u6781": 203,
		"\u5de6\u592a\u6975": 203,
		"\u53f3\u592a\u6781": 204,
		"\u53f3\u592a\u6975": 204
	};

	function exchange(word) {
		for (var i = word.length; i > 1; --i) {
			var key = word.substring(1,
				i);
			if (emList[key]) {
				word = '<img src="http://' + parent.siDomain + "/qzone/em/e" + emList[key] + '.gif" />' + word.substring(i, word.length);
				break
			}
		}
		return word
	}
	function ubbReplace(content) {
		var fn = QZONE.FP.removeUBB || QZONE.FP._t.removeUBB;
		if (typeof fn == "function") return fn(content);
		else return content.replace(/\[em\]e(3\d{2,}|5\d{2,})\[\/em\]/, "")
	}
	qs.Weibo.replaceEm = function(content) {
		content = content.replace(/\/[a-z\u4e00-\u9fa5]{1,3}/ig, exchange);
		return ubbReplace(content)
	}
})();
qs.Common = {};
qs.NavigationBar = {
	_container: null,
	init: function() {
		this._container = $e("#top_search_nav");
		this.switchTab();
		this._bindEvent()
	},
	switchTab: function(type) {
		var type = type || qs.Parameters.businesstype;
		if (type == "-2") type = 7;
		this._container.find("ul li").removeClass("now_tab");
		var nowTab = this._container.find("ul li[data-type=" + type + "]");
		nowTab.addClass("now_tab")
	},
	_bindEvent: function() {
		var _this = qs.NavigationBar;
		this._container.find("li[data-type]").onClick(function() {
			var keyword = _this._getLatestKeyword(),
				type =
					$e(this).getAttr("data-type"),
				entry = $e(this).getAttr("data-entry"),
				pvkey = $e(this).getAttr("data-pvkey");
			qs.PV(pvkey);
			_this.switchTab(type);
			qs.search(keyword, {
				businesstype: type,
				entry: entry
			});
			QZFL.event.preventDefault()
		});
		this._container.find(".more_tab").onClick(function() {
			$e(this).addClass("none");
			_this._container.find(".hide_tab").removeClass("none")
		});
		this._container.find(".more_tab_back").onClick(function() {
			_this._container.find(".more_tab").removeClass("none");
			_this._container.find(".hide_tab").addClass("none")
		});
		this._container.find(".app_tab_link").onClick(function() {
			var keyword = _this._getLatestKeyword();
			qs.PV("result-app");
			window.open(g_BaseUrl + "/appstoresoso?search=" + encodeURIComponent(keyword) + "&domain=1&type=0")
		});
		this._container.find(".movie_tab_link").onClick(function() {
			var keyword = _this._getLatestKeyword();
			qs.PV("result-video");
			window.open(g_BaseUrl + "/appsetup/video/search/" + encodeURIComponent(keyword) + "?source=hottopic")
		});
		this._container.find(".famous_tab_link").onClick(function() {
			var keyword = _this._getLatestKeyword();
			qs.PV("result-auth");
			window.open(g_BaseUrl + "/spacesoso?keyword=" + encodeURIComponent(keyword))
		})
	},
	_getLatestKeyword: function() {
		return qs.Extend.TopSearch.getValue() || qs.Parameters.search
	}
};
qs.FilterSelector = function() {
	var selector_type, select_container, text_value_list, select_index, change_callback, closest_wraper, template;

	function initData() {
		var arg = initData.caller.arguments;
		selector_container = arg[0] ? $e(arg[0]) : null;
		selector_type = arg[1] === "top" || arg[1] === "inner" ? arg[1] : "top";
		text_value_list = arg[2] || null;
		select_index = arg[3] || 0;
		change_callback = arg[4] || null;
		if (text_value_list != null) for (var i in text_value_list) if (!(text_value_list[i] instanceof Array)) text_value_list[i] = [text_value_list[i],
						text_value_list[i]
					];
		template = {
			"top": '<a class="op_arrow bor j_item_p">{0} \t\t\t\t\t\t<b class="ui_trigbox ui_trigbox_b"> \t\t\t\t\t\t\t<b class="ui_trig c_tx3"></b> \t\t\t\t\t\t\t<b class="ui_trig ui_trig_up bor_bg"></b> \t\t\t\t\t\t</b></a> \t\t\t\t\t<div class="op_list bor j_list"><ul>{1}</ul></div>',
			"inner": '<div class="detail_inner j_inner"> \t\t\t\t\t\t\t<a class="op_arrow j_item_p">{0}<b class="ui_trig ui_trig_b c_tx"></b></a> \t\t\t\t\t\t\t<div class="op_list bor j_list"><ul>{1}</ul></div> \t\t\t\t\t\t</div>',
			"li": '<li><a href="javascript:;" class="bg6_hover j_item">{0}</a></li>'
		}
	}
	function getIndexByText(text) {
		var i, ri = 0;
		for (i in text_value_list) if (text_value_list[i][0] === text) {
				ri = i;
				break
			}
		return ri
	}
	function getIndexByValue(val) {
		var i;
		for (i in text_value_list) if (text_value_list[i][1] == val) break;
		return i >= text_value_list.length ? 0 : i
	}
	function present() {
		var html_tmpl = template[selector_type];
		li_tmpl = template["li"];
		list_html = "";
		for (var i in text_value_list) list_html += format(li_tmpl, text_value_list[i][0]);
		html_tmpl =
			format(html_tmpl, text_value_list[select_index][0], list_html);
		selector_container.setHtml(html_tmpl);
		if (selector_type == "top") {
			selector_container.addClass("search_sort_op");
			closest_wraper = selector_container
		} else {
			selector_container.addClass("option_detail ui_mr10");
			closest_wraper = $e(selector_container.find("div.j_inner"))
		}
		setWraperWidth()
	}
	function bindEvents() {
		selector_container.onClick(function() {
			if (closest_wraper.hasClass("sort_op_show")) {
				closest_wraper.removeClass("sort_op_show");
				if (selector_type ==
					"top") $e(closest_wraper.find("b").eq(0)).removeClass("ui_trigbox_t").addClass("ui_trigbox_b")
			} else {
				closest_wraper.addClass("sort_op_show");
				closest_wraper.find("div.j_list").setAttr("scrollTop", 0);
				if (selector_type == "top") $e(closest_wraper.find("b").eq(0)).removeClass("ui_trigbox_b").addClass("ui_trigbox_t")
			}
		});
		selector_container.onMouseLeave(function() {
			closest_wraper.removeClass("sort_op_show");
			if (selector_type == "top") $e(closest_wraper.find("b").eq(0)).removeClass("ui_trigbox_t").addClass("ui_trigbox_b")
		});
		selector_container.find("a.j_item").onClick(function() {
			select_index = getIndexByText($e(this).getHtml());
			selectChange();
			QZFL.event.cancelBubble()
		})
	}
	function selectChange(triger_callback) {
		if ("undefined" == typeof triger_callback) triger_callback = true;
		var anchor_show_key = $e(closest_wraper.find("a.j_item_p").eq(0));
		var icon_html = $e(anchor_show_key.find("b").eq(0)).eq(0).outerHTML;
		anchor_show_key.setHtml(text_value_list[select_index][0] + icon_html);
		closest_wraper.removeClass("sort_op_show");
		setWraperWidth();
		triger_callback && change_callback && change_callback(select_index, text_value_list[select_index][0], text_value_list[select_index][1])
	}
	function setWraperWidth() {
		var txt = text_value_list[select_index][0],
			wordCount = QZFL.string.getRealLen(txt) / 2,
			width = selector_type == "top" ? 82 : 90,
			wordLimit = selector_type == "top" ? 4 : 5,
			lenIncPerWord = 12;
		width = wordCount > wordLimit ? width + lenIncPerWord * (wordCount - wordLimit) : width;
		closest_wraper.setStyle("width", width + "px")
	}
	initData();
	present();
	bindEvents();
	return {
		getSelectIndex: function() {
			return select_index
		},
		getSelectText: function() {
			return text_value_list[select_index][0]
		},
		getSelectValue: function() {
			return text_value_list[select_index][1]
		},
		setSelectIndex: function(index, triger_callback) {
			if ("undefined" == typeof triger_callback) triger_callback = true;
			select_index = index;
			selectChange(triger_callback)
		},
		setSelectText: function(text, triger_callback) {
			if ("undefined" == typeof triger_callback) triger_callback = true;
			select_index = getIndexByText(text);
			selectChange(triger_callback)
		},
		setSelectValue: function(val, triger_callback) {
			if ("undefined" ==
				typeof triger_callback) triger_callback = true;
			select_index = getIndexByValue(val);
			selectChange(triger_callback)
		},
		hideItemByIndex: function(index) {
			index = index - 0;
			$e($e(closest_wraper).find("ul li").eq(index)).addClass("none")
		},
		hideItemByText: function(text) {
			var index = getIndexByText(text);
			this.hideItemByIndex(index)
		},
		hideItemByValue: function(val) {
			var index = getIndexByValue(val);
			this.hideItemByIndex(index)
		},
		showItemByIndex: function(index) {
			index = index - 0;
			$e($e(closest_wraper).find("ul li").eq(index)).removeClass("none")
		},
		showItemByText: function(text) {
			var index = getIndexByText(text);
			this.showItemByIndex(index)
		},
		showItemByValue: function(val) {
			var index = getIndexByValue(val);
			this.showItemByIndex(index)
		}
	}
};
var __slice = [].slice;
qs.FilterSelectorRow = function() {
	var args, bindEvents, change_callback, getIndexByText, getIndexByValue, initData, present, selectChange, select_index, selector_container, selector_type, template, text_value_list;
	args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	selector_container = null;
	selector_type = "default";
	text_value_list = null;
	select_index = 0;
	change_callback = null;
	template = {
		"default": '<a class="{0}">{1}</a>'
	};
	initData = function() {
		var arg, i, val, _i, _len;
		arg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
		if (arg[0]) selector_container =
				$e(arg[0]);
		if (arg[2]) text_value_list = arg[2];
		if (arg[3]) select_index = arg[3];
		if (arg[4]) change_callback = arg[4];
		if (text_value_list !== null) for (i = _i = 0, _len = text_value_list.length; _i < _len; i = ++_i) {
				val = text_value_list[i];
				if (!val instanceof Array) text_value_list[i] = [val, val]
		}
	};
	getIndexByText = function(text) {
		var i, value, _i, _len;
		for (i = _i = 0, _len = text_value_list.length; _i < _len; i = ++_i) {
			value = text_value_list[i];
			if (text === value[0]) break
		}
		if (i < text_value_list.length) return i;
		else return 0
	};
	getIndexByValue = function(val) {
		var i,
			value, _i, _len;
		for (i = _i = 0, _len = text_value_list.length; _i < _len; i = ++_i) {
			value = text_value_list[i];
			if (val === value[1]) break
		}
		if (i < text_value_list.length) return i;
		else return 0
	};
	present = function() {
		var htmltmpl, i, listhtml, val, _i, _len;
		htmltmpl = template[selector_type];
		listhtml = "";
		for (i = _i = 0, _len = text_value_list.length; _i < _len; i = ++_i) {
			val = text_value_list[i];
			if (i === 0) listhtml += format(htmltmpl, "aleft selected", val[0]);
			else if (i === text_value_list.length - 1) listhtml += format(htmltmpl, "aright", val[0]);
			else listhtml +=
					format(htmltmpl, "", val[0])
		}
		selector_container.setHtml(listhtml)
	};
	bindEvents = function() {
		selector_container.find(">a").onClick(function() {
			select_index = getIndexByText($e(this).getHtml());
			selectChange()
		})
	};
	selectChange = function(triger_callback) {
		if ("undefined" === typeof triger_callback) triger_callback = true;
		selector_container.find(">a.selected").removeClass("selected");
		$e(selector_container.find(">a").eq(select_index)).addClass("selected");
		triger_callback && change_callback && change_callback(select_index, text_value_list[select_index][0],
			text_value_list[select_index][1])
	};
	initData.apply(null, args);
	present();
	bindEvents();
	return {
		getSelectIndex: function() {
			return select_index
		},
		getSelectText: function() {
			return text_value_list[select_index][0]
		},
		getSelectValue: function() {
			return text_value_list[select_index][1]
		},
		setSelectIndex: function(index, triger_callback) {
			if ("undefined" === typeof triger_callback) triger_callback = true;
			select_index = index;
			selectChange(triger_callback)
		},
		setSelectText: function(text, triger_callback) {
			if ("undefined" === typeof triger_callback) triger_callback =
					true;
			select_index = getIndexByText(text);
			selectChange(triger_callback)
		},
		setSelectValue: function(val, triger_callback) {
			if ("undefined" === typeof triger_callback) triger_callback = true;
			select_index = getIndexByValue(val);
			selectChange(triger_callback)
		},
		hideItemByIndex: function(index) {
			index = index - 0;
			$e(selector_container.find(">a").eq(index)).addClass("none")
		},
		hideItemByText: function(text) {
			var index;
			index = getIndexByText(text);
			this.hideItemByIndex(index)
		},
		hideItemByValue: function(val) {
			var index;
			index = getIndexByValue(val);
			this.hideItemByIndex(index)
		},
		showItemByIndex: function(index) {
			index = index - 0;
			$e(selector_container.find(">a").eq(index)).removeClass("none")
		},
		showItemByText: function(text) {
			var index;
			index = getIndexByText(text);
			this.showItemByIndex(index)
		},
		showItemByValue: function(val) {
			var index;
			index = getIndexByValue(val);
			this.showItemByIndex(index)
		}
	}
};
QZFL.extend(window, qsbase);
/*  |xGv00|5d42ea5d537b3e790fceed36061fe3ca */