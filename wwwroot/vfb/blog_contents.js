var PAGE_EVENT = {
	EVENT_LIST: [],
	fireEvent: function(event, arg) {
		var result = [],
			_arg = QZFL.lang.arg2arr(arguments).slice(1),
			found = false;
		for (var i = 0; i < this.EVENT_LIST.length; i++) {
			var ev = this.EVENT_LIST[i];
			if (ev['event'] == event && ev['handler']) {
				result.push(ev['handler'].apply(this, _arg));
				this.EVENT_LIST[i].fired = true;
				this.EVENT_LIST[i].args = _arg;
				found = true;
			}
		}
		if (!found) {
			this.EVENT_LIST.push({
				'handler': null,
				'event': event,
				'fired': true,
				'args': _arg
			});
		}
		if (!result.length) {
			return null;
		}
		return result;
	},
	addEvent: function(ev, handler) {
		if (ev == '' || !handler) {
			throw ("event params error");
		}
		this.EVENT_LIST.push({
			'handler': handler,
			'event': ev
		});
		return this;
	},
	triggerEvent: function(event, handler) {
		for (var i = 0; i < this.EVENT_LIST.length; i++) {
			var ev = this.EVENT_LIST[i];
			if (ev['event'] == event && ev.fired == true) {
				handler.apply(this, ev.args);
				return -1;
			}
		}
		return this.addEvent(event, handler);
	},
	removeEvent: function(ev, handler) {
		for (var i = 0; i < this.EVENT_LIST.length; i++) {
			if (this.EVENT_LIST[i] && (this.EVENT_LIST[i]['event'] == ev)) {
				var hdl = this.EVENT_LIST[i]['handler'];
				if (!handler) {
					this.EVENT_LIST[i] = null;
				} else if (handler == hdl) {
					this.EVENT_LIST[i] = null;
				}
			}
		}
	}
};
(function() {
	if (window.PageScheduler) {
		throw ('PageScheduler ALREADY DEFINED');
	}
	var PS = QZFL.object.extend({
		CommentManager: {},
		EditorManager: null,
		blogInfo: null,
		init: function() {
			QZBlog.Util.jumpTop();
			this.initData();
		},
		initData: function() {
			var _this = this;
			if (parent && parent.BlogInfo) {
				var blogInfo = new parent.BlogInfo();
			} else {
				var blogInfo = new BlogInfo();
			}
			blogInfo.setCurCommentPage(1);
			!QZBlog.Logic.isSeoPage && QZBlog.Util.Statistic.addSpeedPoint(3);
			if (/privateblog_output_data/i.test(location.href) || getParameter('private')) {
				blogInfo.isPrivate = true;
				if (QZONE.FP.appendHash && !QZBlog.Logic.isSeoPage) {
					QZONE.FP.appendHash(2, 'catalog_private');
				}
			} else if (/draft_output_data/i.test(location.href)) {
				if (QZONE.FP.appendHash) {
					QZONE.FP.appendHash(2, (getParameter('audit') ? 'catalog_audit' : 'catalog_draft'));
				}
			} else {
				blogInfo.isPrivate = false;
				if (QZONE.FP.appendHash && !QZBlog.Logic.isSeoPage) {
					QZONE.FP.appendHash(2, g_oBlogData.data.blogid);
				}
			}
			if (!blogInfo.convertJsonObject(g_oBlogData.data) || !parent.g_oBlogInfoMgr.addBlogInfo(blogInfo)) {
				alert("无法获取日志全部信息，请刷新空间重试");
				return;
			}
			if ( !! getParameter("blogseed")) {
				blogInfo.setRandomSeed(getParameter("blogseed"));
			}
			this.blogInfo = blogInfo;
			if (QZONE.FP.setAppTitle) {
				var title = this.blogInfo.getTitle().toRealStr() + '|' + QZONE.FP.getQzoneName();
				QZONE.FP.setAppTitle(title);
			}
			QZFL.css.addClassName(document.body, 'mod_iteration');
			setTimeout(function() {
				_this.fireEvent("onStart");
			}, 0);
			setTimeout(QZBlog.Util.setPageAutoResize, 5000);
			this.launchClickSafeCheck();
			this.launchScriptSafeCheck();
			this.clickTrack();
		},
		clickTrack: function() {
			var k = 'QZONE_BLOG_CLICK_TRACK';
			if (parent[k] === undefined) {
				parent[k] = Math.random() < 0.0001;
			}
			if (parent[k]) {
				setTimeout(function() {
					var sc = document.createElement('script');
					sc.src = 'http://qzonestyle.gtimg.cn/qzone/app/tracer/lib/yom/require/require-built.js';
					sc.setAttribute('data-main', 'http://qzonestyle.gtimg.cn/qzone/app/tracer/tracer/main-built.js');
					sc.setAttribute('data-param', 'bid=1&pid=2');
					document.body.appendChild(sc);
				}, 1000);
			}
		},
		launchClickSafeCheck: function() {
			if (g_oBlogData.data.sus_flag) {
				setTimeout(function() {
					var limitTop = QZFL.dom.getXY($e('div.blog_cont').elements[0])[1];
					if (limitTop) {
						var nodes = $e('div.blog_cont').elements[0].getElementsByTagName('*');
						for (var i in nodes) {
							var posStyle;
							try {
								posStyle = QZFL.dom.getStyle(nodes[i], 'position');
							} catch (ex) {};
							if (posStyle == 'fixed' || posStyle == 'absolute') {
								var y = QZFL.dom.getXY(nodes[i])[1];
								if (y < limitTop) {
									nodes[i].style.top = limitTop + 'px';
									nodes[i].style.marginTop = '0px';
								}
							}
						}
					}
				}, 3000);
			}
		},
		launchScriptSafeCheck: function() {
			setTimeout(function() {
				var loader = new QZONE.jsLoader();
				loader.onload = function() {
					checkNonTxDomain(0.1, 1);
				}
				loader.load("http://" + IMGCACHE_DOMAIN + "/qzone/app/blog/api/domainscriptcheck.js", document, "utf-8");
			}, 5000);
		},
		refreshAreaRemarkName: function(oDiv) {
			if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
				return;
			}
			if (!oDiv) {
				return;
			}
			QZONE.FP.getRemarkList(QZONE.event.bind(this, function(rawdata) {
				var arr = oDiv.getElementsByTagName("a");
				for (var index = 0; index < arr.length; ++index) {
					if (!arr[index].getAttribute("link")) {
						continue;
					}
					if (arr[index].childNodes[0] && arr[index].childNodes[0].nodeName == "#text") {
						var uin = arr[index].getAttribute("link").replace(/nameCard_/gi, "");
						if (rawdata[uin]) {
							arr[index].innerHTML = rawdata[uin].toInnerHTML();
						}
					}
				}
			}));
		},
		resizeImg: function(obj, imgID) {
			obj = !! obj ? obj : $(imgID);
			if (!obj) return;
			var img = new Image;
			img.onload = function() {
				this.onload = null;
				if (this.height > 100) {
					this.height = 100;
					this.width = this.width * Math.ceil(1000 * 100 / this.height) / 1000;
				}
				if (this.width > 100) {
					this.width = 100;
					this.height = this.height * Math.ceil(1000 * 100 / this.width) / 1000;
				}
				obj.width = this.width;
				obj.height = this.height;
			};
			img.onerror = function() {
				this.onerror = null;
				obj.src = parent.DEFAULT_USER_PORTRAIT;
			};
			img.src = obj.src;
		},
		commonLoginCallback: function() {
			if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
				blogLoginFnList.push(function() {
					if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
						QZBlog.Util.clearAllCacheData();
					}
					PS.CommentScheduler.checkCommentSetting();
					var uin = QZBlog.Logic.SpaceHostInfo.getLoginUin();
					$("commentAuthorImg").src = QZBlog.Util.PortraitManager.getPortraitUrl(uin, 100);
				});
			}
		},
		reportStayTime: function() {
			var start = parent.blogSpeedBasePoint;
			var stayTime = 0;
			var params = [];
			var img;
			var url = QZBlog.CGI_URL.get('blog_recommend_statis', 'blognew');
			if (start && start.getTime) {
				console.log('上报停留时间');
				stayTime = new Date().getTime() - start.getTime();
				params[0] = 'uin=' + QZONE.FP.getQzoneConfig('loginUin');
				params[1] = 'hostuin=' + QZONE.FP.getQzoneConfig('ownerUin');
				params[2] = 'blogid=' + this.blogInfo.getID();
				params[3] = 'start=' + start.getTime();
				params[4] = 'end=' + new Date().getTime();
				params[5] = 'g_tk=' + QZBlog.Util.getToken();
				img = new parent.Image();
				img.src = url + '?' + params.join('&');
			}
		},
		onPageUnload: function() {
			this.reportStayTime();
			QZBlog.Util.TimerManager.clear();
			if (QZONE.FP.setAppTitle) {
				QZONE.FP.setAppTitle();
			}
			if ( !! parent.blogScrollEvent) {
				parent.QZONE.event.removeEvent(parent.window, "scroll", parent.blogScrollEvent);
			}
			QZBlog.Logic.clearMusicPlayer();
		}
	}, PAGE_EVENT);
	if (parent.BlogInfo) {
		PS.init();
	} else {
		var g_oJSLoader = new QZONE.jsLoader();
		g_oJSLoader.onload = function() {
			PS.init();
		}
		g_oJSLoader.load("http://" + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + "/script/basic.js", parent.document, "utf-8");
	}
	window.__qzoneFrameworkBeforeUnload = function() {
		PS.onPageUnload();
		return ":jump::true:";
	}
	if (QZONE.userAgent.ie) {
		document.body.onunload = function() {
			PS.onPageUnload();
		};
	} else {
		QZFL.event.addEvent(window, 'unload', function() {
			PS.onPageUnload();
		});
	}
	if (QZBlog.Logic.isSeoPage) {
		QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_BASE_APP", __qzoneFrameworkBeforeUnload);
		QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_APP", __qzoneFrameworkBeforeUnload);
		QZONE.qzEvent.addEventListener("QZ_JUMP_ENTER_DEFAULT", __qzoneFrameworkBeforeUnload);
	}
	window.PageScheduler = PS;
})();
(function(PS) {
	var BLOG_INFO, BLOG_ID;
	var InfoScheduler = {
		maxRecentBlogNum: 3,
		timmer: null,
		_recommendBlogData: null,
		_currentRecommendBlogPage: 1,
		start: function() {
			BLOG_INFO = PS.blogInfo;
			BLOG_ID = BLOG_INFO.getID();
			QZBlog.Logic.procBlogContent( !! BLOG_INFO.getPaperLetterInfo(), true);
			this._showPubTime();
			this._showBlogViewCnt();
			this._showNavigator();
			this._showLikeButton();
			this._showCommentButton();
			this._showQuoteInfo();
			this._showTweetButton();
			this._showCopyUrlButton();
			this._showCompaintBlogButton();
			this._showMoreSetting();
			this._showLetterPaper();
			this.bindMediaQuoteEvent();
			this._showCategoryInfo();
			this._showRightSettingInfo();
			this._showQuoteAuthorNickname();
			this._showMentionDiv();
			this._showSignature();
			this._showRecommenBlogList();
			!QZBlog.Logic.isSeoPage && QZBlog.Util.Statistic.addSpeedPoint(4);
			if (!QZBlog.Logic.isInPengyou) {
				this._showRecentBlog(QZBlog.Logic.SpaceHostInfo.isOwnerMode());
			}
			if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
				this._showOwnerView();
			} else {
				this._showGuestView();
			}
			this._fixView();
			if (typeof(parent.bDirectEnterBlog) == "undefined") {
				parent.bDirectEnterBlog = (/\/blog/i).test(parent.location.href);
				if (parent.bDirectEnterBlog) {
					try {
						parent.QZONE.statistic.stepTime.genTime(14);
					} catch (e) {}
				}
			}
			if (/^http:\/\/(www\.)?(google|baidu|soso)\.(com|cn)(\.cn)?\//i.test(parent.document.referrer)) {
				QZBlog.Util.Statistic.sendPV(RegExp.$2);
			} else {
				QZBlog.Util.Statistic.sendPV("readblog");
				if (QZBlog.Logic.SpaceHostInfo.isFamousUser() && QZBlog.Logic.isSeoPage) {
					QZBlog.Util.Statistic.sendPV('/static', 'blog.qq.com');
					if (window.g_pgvwhere) {
						(function() {
							var jsLoader = new QZFL.jsLoader(false);
							jsLoader.onload = function() {
								if (typeof(pgvMain) == 'function') {
									pvCurDomain = g_pgvwhere;
									pgvMain();
								}
							};
							jsLoader.load("http://pingjs.qq.com/ping.js", document, "utf-8");
						})();
					}
				}
			}
			if (BLOG_INFO.getEffectBit(32)) {
				QZBlog.Util.TimerManager.setTimeout(function() {
					try {
						if (parent.window.musicJSReady && parent.isPlaying()) {
							parent.Qpause();
						}
						window.bTopPageMusicStop = true;
						QZONE.cookie.set("pausemusic", "1");
					} catch (err) {}
				}, 1000);
			}
			PS.fireEvent("onContentNameCard");
			QZBlog.Util.TimerManager.setTimeout(QZBlog.Logic.initMusicPlayer, 3000);
			QZBlog.Util.Statistic.sendUPV(BLOG_ID);
		},
		_showOwnerView: function() {
			QZFL.css.removeClassName($("deleteBlogBtnContainer"), "none");
			QZFL.css.removeClassName($("editBlogBtnContainer"), "none");
			if (!QZBlog.Logic.isInPengyou) {
				QZFL.css.removeClassName($("setBlogRightBtnContainer"), "none");
				QZFL.css.removeClassName($("setTopBlogBtnContainer"), "none");
				QZFL.css.removeClassName($("setRecommendBtnContainer"), "none");
				if (BLOG_INFO.getEffectBit(8)) {
					QZFL.css.removeClassName($("appealBlogBtnContainer"), "none");
				}
			}
			QZFL.css.removeClassName($("setBlogCateBtnContainer"), "none");
			if (!BLOG_INFO.getEffectBit(52)) {
				QZFL.css.removeClassName($("setPrivateBlogBtnContainer"), "none");
			}
		},
		_showGuestView: function() {
			if (!QZBlog.Logic.isInPengyou) {
				QZFL.css.removeClassName($("upperComplaintInfoArea"), "none");
				QZFL.css.removeClassName($("footerComplaintInfoArea"), "none");
			}
		},
		_fixView: function() {
			if (BLOG_INFO.getEffectBit(52)) {
				QZFL.css.addClassName($("modSizeBtn"), "none");
			}
			var lis = $("modifyList").getElementsByTagName("li");
			var count = 0;
			var bottomLi = null;
			for (var i = 0, j = lis.length; i < j; i++) {
				if (QZFL.css.hasClassName(lis[i], "none") || lis[i].style.display == "none") {
					count++;
				} else {
					bottomLi = lis[i];
				}
			}
			if (count == lis.length) {
				QZFL.css.addClassName($("upperModifyInfoArea"), "none");
				QZFL.css.addClassName($("footerModifyInfoArea"), "none");
			}
			if (bottomLi && !! bottomLi.getElementsByTagName("hr")[0]) {
				bottomLi.removeChild(bottomLi.getElementsByTagName("hr")[0]);
			}
		},
		_showNavigator: function() {
			if (typeof QZONE.FP._t.BlogTagSearchNavigator == "object" && QZONE.FP._t.BlogTagSearchNavigator["active"]) {
				var tagReturn = '<p><a href="javascript:;" onclick="InfoManager.turnToList();return false;" title="返回搜索列表" class="c_tx">返回搜索列表</a></p>';
				$("navigatorSpan1").innerHTML = tagReturn;
				$("navigatorSpan2").innerHTML = tagReturn;
				$("navigatorSpan3").style.display = "none";
				$("navigatorSpan4").style.display = "none";
				QZONE.css.removeClassName($("navigatorSpan1").parentNode, "none");
				QZONE.css.removeClassName($("navigatorSpan2").parentNode, "none");
				return;
			}
			if (this.showNavigatorTitle()) {
				return;
			}
			var _this = this;
			var catehex = "";
			var cate = parent.BlogListNavigator.getCurrentCate() || "";
			try {
				var cateInfo = parent.g_oCateInfoMgr.getCateInfoByName(cate);
				if ( !! cateInfo) {
					catehex = cateInfo.getHexCode();
				}
				cate = encodeURIComponent(cate);
			} catch (err) {
				cate = "";
			}
			var url = QZBlog.CGI_URL.get("blog_get_specialtitle") + "?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&blogid=" + BLOG_ID + "&nextnum=" + parent.BlogListNavigator.getRollBlogNum() + "&prevnum=" + parent.BlogListNavigator.getRollBlogNum() + "&category=" + cate + ( !! catehex ? ("&catehex=" + catehex) : "") + "&sorttype=" + parent.BlogListNavigator.getSortType() + "&fupdate=1&r=" + parent.g_nBlogFirstPageRandSeed;
			var curDate = parent.BlogListNavigator.getCurrentDate();
			if (curDate && typeof(curDate["year"]) != "undefined" && typeof(curDate["month"]) != "undefined") {
				var spanTime = QZBlog.Util.getMonthSpanTime(curDate["year"], curDate["month"]);
				url += "&starttime=" + spanTime["start"];
				url += "&endtime=" + spanTime["end"];
			}
			var Request = new QZBlog.Util.NetRequest({
				url: url,
				method: 'get',
				uniqueCGI: true
			});
			Request.onSuccess = function(data) {
				var data = data.data;
				if (!data) {
					QZBlog.Util.DumpMsgFunc();
					return;
				}
				data["title"] = BLOG_INFO.getTitle();
				data["blogid"] = BLOG_ID;
				parent.BlogListNavigator.addBlogRelations(data);
				_this.showNavigatorTitle();
			};
			Request.onError = function() {
				QZONE.css.removeClassName($("navigatorSpan1").parentNode, "none");
				QZONE.css.removeClassName($("navigatorSpan2").parentNode, "none");
			}
			Request.send();
		},
		showNavigatorTitle: function() {
			var prevInfo = parent.BlogListNavigator.getPrevBlogInfo(BLOG_ID);
			var nextInfo = parent.BlogListNavigator.getNextBlogInfo(BLOG_ID);
			if (typeof(prevInfo) == "undefined" || typeof(nextInfo) == "undefined") {
				return false;
			}
			var prevHrefArr = [$("navigatorSpan3"), $("navigatorSpan4")];
			if (prevInfo === null) {
				QZONE.object.each(prevHrefArr, function(ele) {
					ele.innerHTML = "已经是第一篇";
					ele.title = "已经是第一篇";
					ele.onmouseover = ele.onmouseout = QZONE.emptyFn;
					ele.onclick = QZONE.emptyFn;
					ele.parentNode.innerHTML += "&nbsp;|";
				});
			} else if ( !! prevInfo) {
				QZONE.object.each(prevHrefArr, function(ele) {
					var oriTitle = prevInfo.title;
					oriTitle = oriTitle.replace(/&nbsp;/g, " ").toRealStr();
					var title = prevInfo.title.replace(/&nbsp;/g, " ").cutWord(16).toRealStr() + (prevInfo.title.toRealStr().getRealLength() > 16 ? "..." : "");
					ele.innerHTML = "上一篇";
					ele.parentNode.innerHTML += "&nbsp;|";
				});
			}
			var nextHrefArr = [$("navigatorSpan1"), $("navigatorSpan2")];
			if (nextInfo === null) {
				QZONE.object.each(nextHrefArr, function(ele) {
					ele.innerHTML = "已经是最后一篇";
					ele.title = "已经是最后一篇";
					ele.onmouseover = ele.onmouseout = QZONE.emptyFn;
					ele.onclick = QZONE.emptyFn;
				});
			} else if ( !! nextInfo) {
				QZONE.object.each(nextHrefArr, function(ele) {
					var oriTitle = nextInfo.title;
					oriTitle = oriTitle.replace(/&nbsp;/g, " ").toRealStr();
					var title = nextInfo.title.replace(/&nbsp;/g, " ").cutWord(16).toRealStr() + (nextInfo.title.toRealStr().getRealLength() > 16 ? "..." : "");
					ele.innerHTML = "下一篇：" + title.toInnerHTML();
					ele.title = "下一篇：" + oriTitle;
				});
			}
			QZONE.css.removeClassName($("navigatorSpan1").parentNode, "none");
			QZONE.css.removeClassName($("navigatorSpan2").parentNode, "none");
			PS.fireEvent('onShowNavigator');
			return true;
		},
		bindMediaQuoteEvent: function() {
			var commentDisable = QZBlog.Logic.isInPengyou || !QZBlog.Logic.SpaceHostInfo.getLoginUin() || BLOG_INFO.getRightInfo().getType() != parent.BlogRightInfo.RIGHTTYPE["PUBLIC"] || BLOG_INFO.isTemplateBlog();
			if (commentDisable) {
				return;
			}
			var regEM = /em\/e(\d{1,3}).gif/i;
			var regBlankImg = /\/b.gif/i;
			var _this = this;
			var _IMG_TIMER;
			var offset = 0;
			$e('#blogDetailDiv img').each(function(img, idx) {
				var src = img.getAttribute('orgSrc') || img.src;
				if (!src || regEM.test(src)) {
					offset++;
				} else {
					img.setAttribute('idx', idx - offset);
					QZFL.event.addEvent(img, 'mouseover', function() {
						clearTimeout(_IMG_TIMER);
						_this._showQuoteTip(img);
						if ($('qzblog_quoteImgTip') && !$('qzblog_quoteImgTip').getAttribute('_binded_')) {
							QZFL.event.addEvent($("qzblog_quoteImgTip"), 'mouseover', function() {
								clearTimeout(_IMG_TIMER);
							});
							QZFL.event.addEvent($("qzblog_quoteImgTip"), 'mouseout', function() {
								_IMG_TIMER = setTimeout(function() {
									$("qzblog_quoteImgTip").style.display = "none";
								}, 200);
							});
							$('qzblog_quoteImgTip').setAttribute('_binded_', 1);
						}
					});
					QZFL.event.addEvent(img, 'mouseout', function() {
						_IMG_TIMER = setTimeout(function() {
							if ($("qzblog_quoteImgTip")) {
								$("qzblog_quoteImgTip").style.display = "none";
							}
						}, 200);
					});
				}
			});
		},
		showQuoteTip: function(imgObj, showTweet, showQuote) {
			if (!showTweet && !showQuote) {
				return;
			}
			var oTip = $("qzblog_quoteImgTip");
			if (!oTip) {
				oTip = QZONE.dom.createElementIn("div", document.body, false, {
					"id": "qzblog_quoteImgTip",
					"class": "blog_quote_tip"
				});
				oTip.style.zIndex = 10;
				QZONE.event.addEvent(document.body, "mousedown", QZONE.event.bind(this, function() {
					var target = QZFL.event.getTarget(QZFL.event.getEvent());
					if ( !! target && (target.tagName.toLowerCase() == "a" || target.tagName.toLowerCase() == "i")) {
						return;
					}
					this._toHideQuoteTip();
				}));
				QZONE.event.addEvent(oTip, "mouseover", function() {
					clearTimeout(window.nQuoteTipTimer);
				});
			}
			var tip_str = (['<p class="">']).join('');
			if (showTweet) {
				tip_str += (['<a id="qzblog_twitter_img_btn" class="forward" href="javascript:void(0);" onclick="InfoManager.twitterImage(\'{0}\');return false;"><i class="icon_forward"></i>转发</a>']).join('');
			}
			if (showTweet && showQuote) {
				tip_str += '';
			}
			var imgUrl = imgObj.getAttribute("orgSrc") || imgObj.src;
			var imgIdx = imgObj.getAttribute('idx');
			if (showQuote) {
				tip_str += ('<a id="qzblog_comment_img_btn" class="comment" href="javascript:void(0);" onclick="InfoManager.replyImage(1, ' + QZBlog.Logic.SpaceHostInfo.getUin() + ', ' + BLOG_ID + ', ' + imgIdx + ');return false;"><i class="icon_review"></i>评论</a>');
			}
			tip_str += '</p>';
			oTip.innerHTML = QZBlog.Util.formatMsg(tip_str, [escape(imgObj.src)]);
			var node = imgObj;
			try {
				var pos = QZONE.dom.getPosition(node);
				var tipPos = QZONE.dom.getPosition(oTip);
				tipPos["width"] = (showTweet && showQuote) ? 109 : (showTweet ? 76 : 52);
				var frameTop = window.frameElement ? QZONE.dom.getPosition(window.frameElement)["top"] : 0;
				var scrollTop = (QZBlog.Util.isSmallMode() ? QZONE.dom.getScrollTop() : QZONE.dom.getScrollTop(parent.document));
				var docTop = (QZBlog.Util.isSmallMode() ? 0 : frameTop);
				var verticalAdjust = (QZONE.userAgent.ie ? 5 : 5);
				var horizontalAdjust = (QZONE.userAgent.ie ? -5 : -5);
				var top = Math.max(pos["top"], scrollTop - docTop) + verticalAdjust;
				var left = pos["left"] + pos["width"] - tipPos["width"] + horizontalAdjust;
				if (tipPos["width"] * 2 > pos["width"]) {
					left = pos["left"] + pos["width"];
				}
				oTip.style.left = left + "px";
				oTip.style.top = top + "px";
				oTip.style.display = "";
			} catch (e) {}
		},
		_showQuoteTip: function(imgObj) {
			var lev = QZBlog.Util.getCurrentSpaceUserCreditLevel();
			if (lev == QZBlog.Util.CreditLevel["A"] || lev == QZBlog.Util.CreditLevel["B_FIRST"] || lev == QZBlog.Util.CreditLevel["B_SECOND"] || lev == QZBlog.Util.CreditLevel["B_THIRD"] || lev == QZBlog.Util.CreditLevel["C_FIRST"]) {
				this.showQuoteTip(imgObj, QZBlog.Logic.getTweetStatus(), true);
			}
		},
		_toHideQuoteTip: function(evt) {
			var ele = QZONE.event.getTarget(evt);
			if (!ele) {
				return;
			}
			ele = getParentByClass(ele, "qzblog_quoteImgTip_class");
			if ( !! ele) {
				return;
			}
			this.hideQuoteTip();
		},
		hideQuoteTip: function() {
			$("qzblog_quoteImgTip").style.display = "none";
		},
		_showQuoteAuthorNickname: function() {
			var uin = BLOG_INFO.getQuoteUin();
			if (BLOG_INFO.getEffectBit(28) || BLOG_INFO.getEffectBit(35) || BLOG_INFO.getEffectBit(36)) {
				return;
			}
			var user_link = !(/\D/g.test(uin)) ? 'http://user.qzone.qq.com/' + uin : "http://xiaoyou.qq.com/index.php?mod=profile&u=" + uin;
			var namecard_link = !(/\D/g.test(uin)) ? ('nameCard_' + uin) : '';
			var html = '<a link="' + namecard_link + '" uin="' + uin + '" id="contentAuthorHref" onclick="QZBlog.Util.Statistic.sendPV(\'original_author_click\', \'rizhi.qzone.qq.com\');" class="c_tx3 q_namecard" target="_blank" href="' + user_link + '">' + ((/\D/g.test(uin)) ? '朋友网用户' : uin) + '</a>';
			var container;
			if (!BLOG_INFO.getEffectBit(3)) {
				container = $("contentAuthorSpan");
				$("quoteInfo").style.display = 'none';
				container.innerHTML = "原创：" + html;
				$("contentAuthorHref").innerHTML = QZBlog.Logic.SpaceHostInfo.getNickname().toInnerHTML().replace('$', '&#36;');
				QZONE.FP.getRemarkList(QZONE.event.bind(this, function(rawdata) {
					if (rawdata[uin]) {
						$("contentAuthorHref").innerHTML = rawdata[uin].toInnerHTML();
						return;
					}
				}));
				QZFL.css.removeClassName(container, "none");
			} else {
				container = $("quoteInfo");
				container.innerHTML = "转载自" + html;
				if (!(/\D/g.test(uin))) {
					if (uin == 177988688) {
						$("contentAuthorHref").parentNode.innerHTML = "本文由&nbsp;&nbsp;&nbsp;<span style='font-weight:bold'>手机腾讯网资讯编辑</span>&nbsp;&nbsp;&nbsp;发表在：&nbsp;<a href='http://3gqq.qq.com/portal/?fr=qzcopied' target='_blank' style='text-decoration:underline;font-weight:bold'>手机腾讯资讯频道</a><br />";
					} else {
						QZONE.FP.getRemarkList(QZONE.event.bind(this, function(rawdata) {
							if (rawdata[uin]) {
								$("contentAuthorHref").innerHTML = rawdata[uin].toInnerHTML();
								return;
							}
							var Request = new QZBlog.Util.NetRequest({
								url: QZBlog.CGI_URL.get('blog_get_userinfo'),
								data: {
									uin: uin,
									fupdate: 1
								},
								method: 'get',
								uniqueCGI: true
							});
							Request.onSuccess = function(data) {
								$("contentAuthorHref").innerHTML = data.data.nick;
							};
							Request.send();
						}));
					}
				} else {
					$("contentAuthorHref").href = "http://xiaoyou.qq.com/index.php?mod=profile&u=" + uin;
					var url = "http://qzone.xiaoyou.qq.com/userinfo_json.php?qq=" + uin;
					var portraitReq = new QZBlog.Util.BlogNetProcessor();
					portraitReq.create(url, "get", QZONE.event.bind(this, function(o) {
						if (!o || !o.data || !o.data[uin]) {
							return;
						}
						$("contentAuthorHref").innerHTML = o.data[uin].realname;
					}), QZONE.emptyFn, "UTF-8", true, "SchoolInfoCallback");
					portraitReq.excute();
				}
			}
		},
		_showSignature: function() {
			if (QZBlog.Logic.isInPengyou) {
				$e(".mod_signature").hide();
				return;
			}
			if (!PageScheduler.blogInfo.getEffectBit(9) || !$('signatureDIV')) {
				return;
			}
			QZBlog.Util.getSignature(null, function(str) {
				if (str.trim().length == 0) {
					$("signatureDIV").parentNode.style.display = "none";
				} else {
					$("signatureDIV").innerHTML = str;
				}
			});
		},
		showPrevPageRecommendBlog: function() {
			var self = this;
			self._currentRecommendBlogPage--;
			if (self._currentRecommendBlogPage < 1) {
				self._currentRecommendBlogPage = 1;
				return;
			}
			self._showRecommenBlogList(self._currentRecommendBlogPage);
		},
		showNextPageRecommendBlog: function() {
			var self = this;
			self._currentRecommendBlogPage++;
			self._showRecommenBlogList(self._currentRecommendBlogPage);
		},
		_loadRecommendBlogData: function(successCallback) {
			var self = this;
			setTimeout(function() {
				var url = QZBlog.CGI_URL.get('operation_get_recommend', 'operation') + '?pos=staticpage&recommendblog=' + (BLOG_INFO.isRecommend() ? 1 : 0) + '&uin=' + QZBlog.Logic.SpaceHostInfo.getUin();
				console.log(url);
				var neq = new QZBlog.Util.NetRequest({
					url: url,
					method: 'get',
					charset: 'gb2312',
					isSilenderMode: true
				});
				neq.onSuccess = function(responseData) {
					if (!responseData.data || !responseData.data.a_class || !responseData.data.a_class.length || !responseData.data.b_class || !responseData.data.b_class.length) {
						return;
					}
					successCallback && successCallback(responseData.data);
				}
				neq.send();
			}, 0);
		},
		_processRecommendBlogData: function(blogData, needResort) {
			var self = this;
			if (!blogData || !blogData.length) {
				console.log('推荐日志数据不存在');
				return [];
			}
			for (var i = 0, max = blogData.length; i < max; i++) {
				blogData[i].blogurl = blogData[i].url || 'http://user.qzone.qq.com/' + blogData[i].uin + '/blog/' + blogData[i].blogid + '?ot=seo';
				blogData[i].formatedTitle = blogData[i].formatedTitle || cut(restHTML(blogData[i].title), self.MAX_TITLE_LENGTH, '..');
			}
			if (needResort) {
				blogData = self._resortRecommendBlogList(blogData);
			}
			return blogData;
		},
		_resortRecommendBlogList: function(blogData) {
			var self = this;
			if (!blogData || !blogData.length) {
				return [];
			}
			var arr1 = [],
				arr2 = [];
			arr1.push(blogData[0]);
			for (var i = 1; i < blogData.length; i++) {
				if (!blogData[i].optag || blogData[i - 1].optag != blogData[i].optag) {
					arr1.push(blogData[i]);
				} else {
					arr2.push(blogData[i]);
				}
			}
			return arr1.concat(arr2);
		},
		_renderRecommendBlogList: function(pageNo) {
			var self = this;
			var RECOMMEND_BLOG_TPL = '<div class="mod_title"><h4>看过这篇日志的人还看了：</h4></div><div class="cont"><p class="mod_page_arr"><span class="<%if(pageNo==1){%>bor3 arr_disable<%}else{%>c_tx<%}%> mod_arr arr_l evt_click" data-type="prev" ><span class="bor_bg">上一页</span></span><span class="c_tx mod_arr arr_r evt_click" data-type="next" ><span class="bor_bg">下一页</span></span></p><ul><%for(var i =(pageNo-1)*aClassPageSize;i<pageNo*aClassPageSize;i++){  var blog = aClassBlogs[i%aClassBlogs.length]; %><li><div class="mod_media a_class_blog"><div class="hd"><a href="<%=blog.blogurl%>" target="_blank" title="<%=escHTML(restXHTML(blog.title))%>"><img src="<%=blog.img%>" onload="scaleAbsImg(this)"></a></div><p class="media_name"><a href="<%=blog.blogurl%>" target="_blank" title="<%=escHTML(restXHTML(blog.title))%>"><%=escHTML(blog.formatedTitle)%></a></p><%if(blog.optag && blog.optag!=VIP_OPTAG){%><a class="media_status" href="<%=blog.blogurl%>" target="_blank" title="<%=escHTML(restXHTML(blog.title))%>"><%=blog.optag%><span class="shadow"></span><span class="extra_arr_top"></span><span class="extra_arr_bottom"></span></a><%}%><div></li><%}%><%for(var i =(pageNo-1)*bClassPageSize;i<pageNo*bClassPageSize;i++){  var blog = bClassBlogs[i%bClassBlogs.length]; %><li><div class="mod_media b_class_blog"><div class="hd"><a href="<%=blog.blogurl%>" target="_blank" title="<%=escHTML(restXHTML(blog.title))%>"><img src="<%=blog.img%>" onload="scaleAbsImg(this)"></a></div><p class="media_name"><a href="<%=blog.blogurl%>" target="_blank" title="<%=escHTML(restXHTML(blog.title))%>"><%=escHTML(blog.formatedTitle)%></a></p><%if(blog.optag &&blog.optag!=VIP_OPTAG){%><a class="media_status" href="<%=blog.blogurl%>" target="_blank" title="<%=escHTML(restXHTML(blog.title))%>"><%=blog.optag%><span class="shadow"></span><span class="extra_arr_top"></span><span class="extra_arr_bottom"></span></a><%}%><div></li><%}%></ul></div>';
			var MAX_A_CLASS_COUNT = 2;
			var MAX_B_CLASS_COUNT = 4;
			var $recommendContainer = $e('.mod_recommend');
			if ($recommendContainer.elements[0]) {
				$recommendContainer.setHtml(tmpl(RECOMMEND_BLOG_TPL, {
					aClassBlogs: self._recommendBlogData.a_class,
					bClassBlogs: self._recommendBlogData.b_class,
					aClassPageSize: MAX_A_CLASS_COUNT,
					bClassPageSize: MAX_B_CLASS_COUNT,
					pageNo: pageNo,
					VIP_OPTAG: '黄钻'
				}));
			} else {
				console.log('推荐日志的显示容器不存在');
			}
		},
		_showRecommenBlogList: function(pageNo) {
			if (QZBlog.Logic.isInPengyou) {
				return;
			}
			var self = this;
			var pageNo = pageNo || 1;
			if (!self._recommendBlogData) {
				self._loadRecommendBlogData(function(recommendBlogData) {
					self._recommendBlogData = {
						a_class: self._processRecommendBlogData(recommendBlogData.a_class, true),
						b_class: self._processRecommendBlogData(recommendBlogData.b_class)
					};
					console.log(self._recommendBlogData);
					window.scaleAbsImg = function(img) {
						if (img.height > img.width) {
							img.style.width = '120px';
						} else {
							img.style.height = '120px';
						}
					}
					var div = document.createElement('div');
					div.className = 'mod_recommend bbor3';
					var ft = $e('div.blog_footer').elements[0];
					ft.insertBefore(div, ft.firstChild);
					self._bindEventsForRecommendBlogList(div);
					QZBlog.Util.Statistic.sendPV("ympbg");
					QZBlog.Logic.TCISDClick.batchBind({
						'.a_class_blog .media_name a': 'ympdj_aclass',
						'.a_class_blog img': 'ympdj_aclass',
						'.a_class_blog a.media_status': 'ympdj_aclass',
						'.b_class_blog .media_name a': 'ympdj_bclass',
						'.b_class_blog img': 'ympdj_bclass',
						'.b_class_blog a.media_status': 'ympdj_bclass',
						'.mod_page_arr .evt_click': 'ympdj_fanye'
					}, {
						url: '/BlogContent',
						prepare: true,
						container: div,
						eventType: 'click'
					});
					self._showRecommenBlogList(pageNo);
				})
				return;
			}
			self._renderRecommendBlogList(pageNo);
		},
		_bindEventsForRecommendBlogList: function(moduleContainer) {
			var self = this;
			QZFL.event.delegate(moduleContainer, '.evt_click', 'click', function(e) {
				var tar = QZFL.event.getTarget(e),
					type;
				QZFL.dom.searchChain(tar, 'parentNode', function(item) {
					if (item == moduleContainer) {
						return true;
					}
					if (QZFL.css.hasClassName(item, 'evt_click')) {
						tar = item;
						return true;
					}
				});
				type = tar.getAttribute('data-type');
				if (type == 'prev') {
					self.showPrevPageRecommendBlog();
				} else if (type == "next") {
					self.showNextPageRecommendBlog();
				}
			});
		},
		_showRecommendBlogQuoteCount: function() {
			var self = this;
			var $quoteCountContainers = $e('.mod_recommend .quote_count');
			var blogUrls = [];
			$quoteCountContainers.each(function(item) {
				blogUrls.push(item.getAttribute('data-url'));
			});
			self._loadQuoteCount(blogUrls, {
				onSuccess: function(responseData) {
					var data = responseData.data;
					for (var i = 0; i < data.length; i++) {
						if (data[i].current.cntdata.forward) {
							$quoteCountContainers.elements[i].innerHTML = '转载(' + data[i].current.cntdata.forward + ')';
						}
					}
				}
			});
		},
		_loadQuoteCount: function(urls, callbacks) {
			var COUNT_CGI_URL = 'http://r.qzone.qq.com/cgi-bin/user/qz_opcnt2';
			var DELIMITER = '<|>';
			if (!urls || !urls.length) {
				console.log('urls的长度为空');
				return;
			}
			var _netReq = new QZBlog.Util.BlogNetProcessor();
			var _url = COUNT_CGI_URL + "?unikey=" + encodeURIComponent(urls.join(DELIMITER));
			_netReq.create(_url, "get", function(responseData) {
				if (!responseData.data || !responseData.data) {
					return;
				}
				callbacks.onSuccess(responseData);
			}, QZONE.emptyFn, "GB2312", true, "_Callback");
			_netReq.excute();
		},
		_getEffectBit: function(bloginfo, nBit) {
			if (nBit < 0 || nBit > 63) {
				throw new Error('nBit param error');
			}
			if (nBit < 32) {
				return (bloginfo.effect1 & (1 << nBit));
			} else if (nBit < 64) {
				return (bloginfo.effect2 & (1 << nBit));
			}
		},
		_getBlogIcon: function(blog) {
			var blogIconList = {
				0: 'icon icon_img',
				13: 'icon icon_video'
			};
			for (var bit in blogIconList) {
				if (this._getEffectBit(blog, bit)) {
					return blogIconList[bit];
				}
			}
			return false;
		},
		_getRecentBlogList: function(isHost, cacheKey, callback) {
			var CGI_FILTER = {
				verbose: 0,
				cateHex: '',
				cateName: '',
				pos: 0,
				num: (this.maxRecentBlogNum + 1),
				sortType: 1,
				absType: 0,
				anonymous: isHost ? 1 : 0
			};
			var url = QZBlog.CGI_URL.get('get_abs') + '?' + QZBlog.Util.buildParam(QZBlog.Util.getNewBlogListUrlData(CGI_FILTER));
			var netProcessor = new QZBlog.Util.BlogNetProcessor();
			netProcessor.create(url, 'get', QZFL.object.bind(this, function(retData) {
				if (retData.data && retData.code == 0) {
					PAGE_CACHE.add(cacheKey, retData, 1 * 3600);
					callback && callback(isHost);
				} else {}
			}), function(retData) {}, 'GB2312', false);
			netProcessor.excute();
		},
		_showRecentBlog: function(isHost) {
			var _this = this;
			var cacheKey = isHost ? 'HostRecentBlogList' : 'GuestRecentBlogList';
			var recentBlogData = PAGE_CACHE.get(cacheKey);
			if (recentBlogData == null) {
				this._getRecentBlogList(isHost, cacheKey, function(isHost) {
					_this._showRecentBlog(isHost);
				});
				return;
			}
			var listTemplate = '<%repeat_0 match="/data/list"%><li style="<%=@blogDisplay%>"><div class="list_tit"><a onclick="InfoScheduler.jumpToRelatedBlog(<%=@blogId%>);return false;" href="<%=@url%>" class="c_tx2" title="<%=@title%> -- 发表于<%=@pubTime%>"><%=@title%></a><span id="icon_<%=@icon_id%>" class="<%=@icon%>" style="<%=@iconDisplay%>" img="<%=@icon_img%>"></span><span class="publish_time c_tx3"><%=@pubTime%></span></div></li><%_repeat_0%>';
			if ( !! $("recentBlogDIV") && !! $("recentBlogList")) {
				if ( !! recentBlogData.data && !! recentBlogData.data.list && !! recentBlogData.data.list.length > 0) {
					var showBlogCnt = 0;
					var iconArr = [];
					for (var i = 0; i < recentBlogData.data.list.length; ++i) {
						recentBlogData.data.list[i].url = "http://user.qzone.qq.com/" + QZBlog.Logic.SpaceHostInfo.getUin() + "/blog/" + recentBlogData.data.list[i].blogId;
						var icon = this._getBlogIcon(recentBlogData.data.list[i]);
						if (icon) {
							recentBlogData.data.list[i].icon_img = '';
							if (recentBlogData.data.list[i].img && recentBlogData.data.list[i].img.length > 0) {
								recentBlogData.data.list[i].icon_img = recentBlogData.data.list[i].img[0].url;
							}
							recentBlogData.data.list[i].icon = icon;
							recentBlogData.data.list[i].iconDisplay = "";
							if (icon.indexOf("img") >= 0) {
								var iconId = "icon_" + i;
								iconArr.push(iconId);
							}
						} else {
							recentBlogData.data.list[i].icon_img = "";
							recentBlogData.data.list[i].icon = "";
							recentBlogData.data.list[i].iconDisplay = "display:none";
						}
						recentBlogData.data.list[i].icon_id = i;
						if (BLOG_ID != recentBlogData.data.list[i].blogid && showBlogCnt < this.maxRecentBlogNum) {
							showBlogCnt++;
							recentBlogData.data.list[i].blogDisplay = "";
						} else {
							recentBlogData.data.list[i].blogDisplay = "display:none";
						}
					}
					if (showBlogCnt > 0) {
						$("recentBlogList").innerHTML = doFill(listTemplate, recentBlogData);
						$("recentBlogDIV").style.display = "";
						if (isHost) {
							$('recentBlogList').style.display = "none";
							$('ctrl_arr').title = '显示';
							QZFL.css.addClassName($('ctrl_arr'), 'arr_r');
						} else {
							$('recentBlogList').style.display = "";
							$('ctrl_arr').title = '收起';
							QZFL.css.addClassName($('ctrl_arr'), 'arr_t');
						}
						if (iconArr.length > 0) {
							for (var i = 0; i < iconArr.length; ++i) {
								var iconObj = $(iconArr[i]);
								this._bindIconMouseoverEvent(iconObj);
							}
						}
					}
				}
			}
		},
		_bindIconMouseoverEvent: function(iconObj) {
			var _this = this;
			QZONE.event.addEvent(iconObj, "mouseover", function(evt) {
				var icon = QZONE.event.getTarget(evt);
				var imgUrl = icon.getAttribute("img");
				if (imgUrl && imgUrl.length > 0) {
					_this.timmer = setTimeout(function() {
						var contianerLen = 100;
						var html = '<div id="img-contianer" style="position:relative;overflow:hidden;width:90px;height:90px;top:-1px;left:-1px;background-image:url(/qzone/newblog/v5/editor/css/loading.gif);background-repeat:no-repeat;background-position:center center;"></div>';
						QZFL.widget.bubble.show(icon, "", html, {
							"width": contianerLen,
							"height": contianerLen,
							"noCloseButton": true,
							"backgroundColor": '#FFFFFF',
							"timeout": 9999999,
							"x": -12,
							"y": 4
						});
						var img = new Image();
						img.onload = function() {
							var imgW = img.width;
							var imgH = img.height;
							var scale = _this._calculateScale(imgW, imgH, contianerLen - 10, contianerLen - 10, true);
							imgW = imgW * scale;
							imgH = imgH * scale;
							var midpoint = _this._calculateMidPoint(imgW, imgH, contianerLen - 10, contianerLen - 10);
							QZFL.dom.setStyle(img, "position", "relative");
							QZFL.dom.setStyle(img, "left", midpoint.x + "px");
							QZFL.dom.setStyle(img, "top", midpoint.y + "px");
							QZFL.dom.setStyle(img, "width", imgW + "px");
							QZFL.dom.setStyle(img, "height", imgH + "px");
							setTimeout(function() {
								if ($('img-contianer')) {
									$('img-contianer').appendChild(img);
								}
							}, 500);
						}
						img.src = imgUrl;
					}, 300);
				}
			});
			QZONE.event.addEvent(iconObj, "mouseout", function(evt) {
				if (_this.timmer) {
					clearTimeout(_this.timmer);
					_this.timmer = null;
				}
				QZFL.widget.bubble.hideAll();
			});
		},
		_calculateScale: function(width, height, maxW, maxH, fixContainerSize) {
			var scale = maxW / width;
			scale = Math.max(maxH / height, scale);
			if (fixContainerSize || width >= maxW || height >= maxH) {
				return scale;
			} else {
				return 1;
			}
		},
		_calculateMidPoint: function(width, height, containerW, containerH) {
			var point = {};
			point.x = 0.5 * (containerW - width);
			point.y = 0.5 * (containerH - height);
			return point;
		},
		hideShowRecentBlog: function(obj) {
			if (!obj) {
				return;
			}
			if (obj.title == '显示') {
				$('recentBlogList').style.display = "";
				obj.title = '收起';
				QZFL.css.removeClassName(obj, 'arr_r');
				QZFL.css.addClassName(obj, 'arr_t');
			} else {
				$('recentBlogList').style.display = "none";
				obj.title = '显示';
				QZFL.css.removeClassName(obj, 'arr_t');
				QZFL.css.addClassName(obj, 'arr_r');
			}
		},
		jumpToRelatedBlog: function(blogid) {
			if ( !! blogid) {
				QZBlog.Logic.TCISDClick('blogview.relatedblog.owner', InfoManager.TCISDURL);
				var extParam = {
					page: parseInt(getParameter('page'), 10) || 1
				}
				location.href = QZBlog.Util.getContentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), blogid, Math.random(), extParam);
			}
		},
		_showPubTime: function() {
			var pubDate = new Date(BLOG_INFO.getPubTime() * 1000);
			var hour = pubDate.getHours() >= 10 ? pubDate.getHours() : "0" + String(pubDate.getHours());
			var minute = pubDate.getMinutes() >= 10 ? pubDate.getMinutes() : "0" + String(pubDate.getMinutes());
			$("pubTime").innerHTML = pubDate.getFullYear() + "-" + (pubDate.getMonth() + 1) + "-" + pubDate.getDate() + " " + hour + ":" + minute;
		},
		quoteOriginBlog: function(ele, verifycode) {
			InfoManager.quoteBlog();
		},
		shareOriginBlog: function(ele) {
			InfoManager.shareBlog(BLOG_ID);
		},
		_showTweetButton: function() {
			if (QZBlog.Logic.isInPengyou) {
				return;
			}
			var lev = QZBlog.Util.getCurrentSpaceUserCreditLevel();
			if (lev == QZBlog.Util.CreditLevel["A"] || lev == QZBlog.Util.CreditLevel["B_FIRST"] || lev == QZBlog.Util.CreditLevel["B_SECOND"] || lev == QZBlog.Util.CreditLevel["B_THIRD"] || lev == QZBlog.Util.CreditLevel["C_FIRST"]) {
				if ((QZBlog.Logic.getTweetStatus() && BLOG_INFO.getRightInfo().getType() == parent.BlogRightInfo.RIGHTTYPE["PUBLIC"]) || QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
					QZFL.css.removeClassName($("tweetBlogContainer"), "none");
					this._showShareSelectBox();
				}
			}
		},
		_showShareSelectBox: function() {
			if ($e(".mod_arr", $("upperShareInfoAreaBtn")).elements.length == 0) {
				QZFL.css.addClassName($("upperShareInfoAreaBtn"), "drop_list");
				var span = document.createElement("span");
				span.className = "mod_arr";
				$("upperShareInfoAreaBtn").appendChild(span);
			}
			if ($e(".mod_arr", $("footerShareInfoAreaBtn")).elements.length == 0) {
				QZFL.css.addClassName($("footerShareInfoAreaBtn"), "drop_list");
				var span = document.createElement("span");
				span.className = "mod_arr";
				$("footerShareInfoAreaBtn").appendChild(span);
			}
		},
		_showLikeButton: function() {
			if (QZBlog.Logic.isInPengyou) {
				return;
			}
			var upperLike = QZFL.dom.createElementIn("li", $("upperInteractive"), false, {
				id: "upperLike",
				className: "adjust_praise"
			});
			var footerLike = QZFL.dom.createElementIn("li", $("footerInteractive"), false, {
				id: "footerLike",
				className: "adjust_praise"
			});
			var likeDetail = document.createElement("div");
			likeDetail.className = "c_tx3";
			likeDetail.id = "likeDetailArea";
			likeDetail.style.height = '12px';
			likeDetail.style.lineHeight = '0';
			var ele = $e('.mod_tags').elements[0];
			ele.parentNode.insertBefore(likeDetail, ele);
			var curkey = 'http://user.qzone.qq.com/' + QZBlog.Logic.SpaceHostInfo.getUin() + '/blog/' + BLOG_ID;
			var unikey = 'http://user.qzone.qq.com/' + BLOG_INFO.getQuoteUin() + '/blog/' + BLOG_INFO.getQuoteBlogId();
			QZONE.FP.addUGCLike(upperLike, {
				curkey: curkey,
				unikey: unikey,
				from: 2
			}, {
				template: {
					rewriteWithTemplate: {
						LOADING: ['<a class="c_tx rbor3" href="javascript:void(0)" onclick="return false;"><b><i class="icon icon_praise"></i></b><span class="adjust">赞<!--(0)--></span></a>'],
						LIKE_ABLE: ['<a class="c_tx rbor3" href="javascript:void(0)" onclick="return false;"><b><i class="icon icon_praise"></i></b><span class="adjust">赞<!--(0)--></span></a>'],
						LIKED: ['<a class="c_tx rbor3" href="javascript:void(0)" onclick="return false;"><b><i class="icon icon_praised"></i></b><span class="adjust">赞<!--(0)--></span></a>'],
						CANCEL_ABLE: ['<a class="c_tx rbor3" href="javascript:void(0)" onclick="return false;"><b><i class="icon icon_cancel"></i></b><span class="adjust">赞<!--(0)--></span></a>']
					},
					checkInnerHtml: true
				}
			});
			QZONE.FP.addUGCLike(footerLike, {
				curkey: curkey,
				unikey: unikey,
				from: 2
			}, {
				template: {
					rewriteWithTemplate: {
						LOADING: ['<a class="c_tx rbor3" href="javascript:void(0)" onclick="return false;"><b><i class="icon icon_praise"></i></b><span class="adjust">赞<!--(0)--></span></a>'],
						LIKE_ABLE: ['<a class="c_tx rbor3" href="javascript:void(0)" onclick="return false;"><b><i class="icon icon_praise"></i></b><span class="adjust">赞<!--(0)--></span></a>'],
						LIKED: ['<a class="c_tx rbor3" href="javascript:void(0)" onclick="return false;"><b><i class="icon icon_praised"></i></b><span class="adjust">赞<!--(0)--></span></a>'],
						CANCEL_ABLE: ['<a class="c_tx rbor3" href="javascript:void(0)" onclick="return false;"><b><i class="icon icon_cancel"></i></b><span class="adjust">赞<!--(0)--></span></a>']
					},
					refreshTipBack: function(likeNode, likeWord) {
						if (likeWord) {
							$('likeDetailArea').style.display = '';
							$('likeDetailArea').innerHTML = likeWord;
						} else {
							$('likeDetailArea').style.display = 'none';
						}
					},
					TIP: ['<span><i class="ui_ico icon_hand ui_ico_f qz_like_hand hand"></i>', '<?if {ilike}>"0"?>我<?/if?>', '<?if {ilike}>"0"?><? cif{rCnt}>"0"?>和<?/cif?><?/if?>', '<?loop times="2" ?><a href="http://user.qzone.qq.com/{uin}" target="_blank" class="c_tx" title="{nick}">{shortNick}</a><?if {count}<{length}?>、<?/if?>&nbsp;<?/loop?>', '{etc}', '<?if {rCnt}>"0"?>', '<a href="javascript:void(0);" onclick="QZONE.FP.getLikeList(\'', unikey, '\');return false;" class="c_tx">', '{peopleCount}</a>', '<?/if?>', '<?if {cnt}>"0"?>觉得很赞<?/if?>', '</span>'].join(''),
					checkInnerHtml: true
				}
			});
		},
		_showQuoteInfo: function(force_reload) {
			var _this = this;
			var li = QZFL.dom.createElementIn("li", $("upperInteractive"), false, {
				id: "upperQuoteInfoArea"
			});
			li.innerHTML = ['<a id="upperQuoteInfoAreaBtn" href="javascript:void(0)" onclick="return false;" class="c_tx rbor3">', '<span class="icon icon_reprint"></span><span class="adjust">转载</span>', '</a>'].join("");
			var li = QZFL.dom.createElementIn("li", $("footerInteractive"), false, {
				id: "footerQuoteInfoArea"
			});
			li.innerHTML = ['<a id="footerQuoteInfoAreaBtn" href="javascript:void(0)" onclick="return false;" class="c_tx rbor3">', '<span class="icon icon_reprint"></span><span class="adjust">转载</span>', '</a>'].join("");
			QZFL.css.removeClassName($("shareBlogContainer"), "none");
			var li = QZFL.dom.createElementIn("li", $("upperInteractive"), false, {
				id: "upperShareInfoArea"
			});
			li.innerHTML = ['<a id="upperShareInfoAreaBtn" href="javascript:void(0)" onclick="return false;" class="c_tx rbor3">', '<span class="icon icon_share"></span>', '<span class="adjust">分享</span>', '</a>'].join("");
			var li = QZFL.dom.createElementIn("li", $("footerInteractive"), false, {
				id: "footerShareInfoArea"
			});
			li.innerHTML = ['<a id="footerShareInfoAreaBtn" href="javascript:void(0)" onclick="return false;" class="c_tx rbor3">', '<span class="icon icon_share"></span>', '<span class="adjust">分享</span>', '</a>'].join("");
			var _netReq = new QZBlog.Util.BlogNetProcessor();
			var _url = "http://r.qzone.qq.com/cgi-bin/user/qz_opcnt2?unikey=" + encodeURIComponent("http://user.qzone.qq.com/" + BLOG_INFO.getQuoteUin() + "/blog/" + BLOG_INFO.getQuoteBlogId());
			_netReq.create(_url, "get", QZONE.event.bind(this, function(data) {
				if (!data.data || !data.data) {
					return;
				}
				data = data.data[0].current.cntdata;
				if (data.forward > 0) {
					$e(".adjust", $("upperQuoteInfoAreaBtn")).elements[0].innerHTML = '转载(' + _this.fixNum(data.forward) + ')';
					$e(".adjust", $("footerQuoteInfoAreaBtn")).elements[0].innerHTML = '转载(' + _this.fixNum(data.forward) + ')';
				}
				if (data.share > 0) {
					$e(".adjust", $("upperShareInfoAreaBtn")).elements[0].innerHTML = '分享(' + _this.fixNum(data.share) + ')';
					$e(".adjust", $("footerShareInfoAreaBtn")).elements[0].innerHTML = '分享(' + _this.fixNum(data.share) + ')';
					$e(".adjust", $("shareListTitle")).elements[0].innerHTML = '分享(' + _this.fixNum(data.share) + ')';
				}
			}), QZONE.emptyFn, "GB2312", true, "_Callback");
			_netReq.excute();
		},
		_showCommentButton: function() {
			var commentHtml = "";
			if (BLOG_INFO.getCommentCnt() > 0) {
				var commentNum = this.fixNum(BLOG_INFO.getCommentCnt());
				commentHtml = "(" + commentNum + ")";
			}
			var li = QZFL.dom.createElementIn("li", $("upperInteractive"), false, {
				id: "upperReplyInfoArea"
			});
			li.innerHTML = ['<a id="upperReplyInfoAreaBtn" href="javascript:void(0)" onclick="return false;" class="c_tx rbor3">', '<span class="icon icon_comment"></span>', '<span class="adjust">评论', commentHtml, '</span>', '</a>'].join("");
			var li = QZFL.dom.createElementIn("li", $("footerInteractive"), false, {
				id: "footerReplyInfoArea"
			});
			li.innerHTML = ['<a id="footerReplyInfoAreaBtn" href="javascript:void(0)" onclick="return false;" class="c_tx rbor3">', '<span class="icon icon_comment"></span>', '<span class="adjust">评论', commentHtml, '</span>', '</a>'].join("");
		},
		_showCopyUrlButton: function() {
			var li = QZFL.dom.createElementIn("li", $("upperInteractive"), false, {
				id: "upperCopyInfoArea"
			});
			li.innerHTML = ['<a id="upperCopyInfoAreaBtn" href="javascript:void(0)" onclick="return false;" class="c_tx rbor3">', '<span class="icon icon_copy"></span>', '<span class="adjust">复制地址</span>', '</a>'].join("");
			var li = QZFL.dom.createElementIn("li", $("footerInteractive"), false, {
				id: "footerCopyInfoArea"
			});
			li.innerHTML = ['<a id="footerCopyInfoAreaBtn" href="javascript:void(0)" onclick="return false;" class="c_tx rbor3">', '<span class="icon icon_copy"></span>', '<span class="adjust">复制地址</span>', '</a>'].join("");
			var _this = this;
			if (!QZFL.userAgent.safari && !(QZFL.userAgent.ie && QZFL.userAgent.ie <= 7) && QZFL.media.getFlashVersion().major >= 10) {
				setTimeout(function() {
					_this._showFlashCopyBtn();
				}, 0);
			}
		},
		_showFlashCopyBtn: function() {
			var size = QZFL.dom.getSize($('upperCopyInfoArea'));
			var flashWidth = (size[0] + 'px');
			var flashHeight = (size[1] + 'px');
			var upperFlashContainer = document.createElement("span");
			upperFlashContainer.style.cssText = 'background:url("http://' + IMGCACHE_DOMAIN + '/ac/b.gif");position:absolute;display:block;cursor:pointer;width:' + flashWidth + ';height:' + flashHeight;
			$('upperCopyInfoArea').insertBefore(upperFlashContainer, $('upperCopyInfoArea').childNodes[0]);
			var footFlashContainer = upperFlashContainer.cloneNode(true);
			$('footerCopyInfoArea').insertBefore(footFlashContainer, $('footerCopyInfoArea').childNodes[0]);
			var flashArguments = {
				"src": "http://" + IMGCACHE_DOMAIN + IMGCACHE_BLOG_V5_PATH + "/flash/flashCopy.swf",
				"width": flashWidth,
				"height": flashHeight,
				"allowScriptAccess": "always",
				"wmode": "transparent",
				"id": 'URLCopyBtn',
				"copyURL": 'flashcopyBtn'
			};
			QZFL.media.insertFlash(upperFlashContainer, flashArguments);
			flashArguments["id"] = "_URLCopyBtn";
			QZFL.media.insertFlash(footFlashContainer, flashArguments);
			$('URLCopyBtn').style.cssText = 'position:absolute;display:block;cursor:pointer;width:' + flashWidth + ';height:' + flashHeight;
			window._setCopyContentToFlash = function() {
				var URL = (QZBlog.Logic.isInPengyou ? 'http://baseapp.pengyou.com/' : 'http://user.qzone.qq.com/') + QZBlog.Logic.SpaceHostInfo.getUin() + '/blog/' + BLOG_ID;
				return URL;
			};
			window._flashCopySucCallback = function() {
				QZONE.FP.showMsgbox('本文网址已经复制到剪切板中', 4, 2000);
				QZBlog.Logic.TCISDClick('flashCopyBtnClick', '/BlogContent');
			};
		},
		_showCompaintBlogButton: function() {
			var li = QZFL.dom.createElementIn("li", $("upperInteractive"), false, {
				id: "upperComplaintInfoArea"
			});
			li.className = "none";
			li.innerHTML = ['<a href="javascript:void(0)" class="c_tx rbor3" id="upperComplaintBlogBtn">', '<span class="icon icon_policy"></span>', '<span class="adjust">举报</span>', '</a>'].join("");
			var li = QZFL.dom.createElementIn("li", $("footerInteractive"), false, {
				id: "footerComplaintInfoArea"
			});
			li.className = "none";
			li.innerHTML = ['<a href="javascript:void(0)" class="c_tx rbor3" id="footerComplaintBlogBtn">', '<span class="icon icon_policy"></span>', '<span class="adjust">举报</span>', '</a>'].join("");
		},
		_showMoreSetting: function() {
			var isEditable = QZBlog.Logic.SpaceHostInfo.isOwnerMode() && !(QZBlog.Logic.isInPengyou && (BLOG_INFO.getEffectBit(52) || BLOG_INFO.isPhotoBlog()));
			var li = QZFL.dom.createElementIn("li", $("upperInteractive"), false, {
				id: "upperModifyInfoArea"
			});
			li.innerHTML = ['<a id="upperModifyInfoAreaBtn" href="javascript:void(0)" onclick="return false;" class="c_tx drop_list">', (isEditable ? '<span class="icon icon_edit"></span>' : ''), '<span class="adjust">', (isEditable ? "编辑" : "更多"), '</span>', '<span class="mod_arr"></span>', '</a>'].join("");
			var li = QZFL.dom.createElementIn("li", $("footerInteractive"), false, {
				id: "footerModifyInfoArea"
			});
			li.innerHTML = ['<a id="footerModifyInfoAreaBtn" href="javascript:void(0)" onclick="return false;" class="c_tx drop_list">', (isEditable ? '<span class="icon icon_edit"></span>' : ''), '<span class="adjust">', (isEditable ? "编辑" : "更多"), '</span>', '<span class="mod_arr"></span>', '</a>'].join("");
			$("ModifyListAreaDesc").innerHTML = isEditable ? "编辑" : "更多";
			$("setTopBlogBtn").innerHTML = (BLOG_INFO.getTopFlag() ? "取消置顶" : "设为置顶");
			if (isEditable) {
				QZFL.dom.createElementIn("span", $("modifyList").getElementsByTagName("a")[0], true, {
					className: "icon icon_edit"
				});
			}
		},
		_showRightSettingInfo: function() {
			if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
				if (BLOG_INFO.getRightInfo().getType() == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"] || BLOG_INFO.getRightInfo().getType() == parent.BlogRightInfo.RIGHTTYPE["FRIEND"]) {
					$("rightSettingSpan").title = "QQ好友可见";
					$("rightSettingSpan").innerHTML = 'QQ好友可见&nbsp;|';
					QZFL.css.removeClassName($("rightSettingSpan"), "none");
				}
				return;
			}
			var html = "";
			if (BLOG_INFO.getEffectBit(22)) {
				$("rightSettingSpan").title = "仅自己可见";
				$("rightSettingSpan").innerHTML = '仅自己可见&nbsp;|';
				QZFL.css.removeClassName($("rightSettingSpan"), "none");
				return;
			}
			var info = BLOG_INFO.getRightInfo();
			if (info.getType() == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"]) {
				var arr = info.getUserIDList();
				QZBlog.Util.getPortraitList(arr, function(portraitInfo) {
					var str = "";
					var uin = -1;
					var userInfoList = info.getUserList();
					for (var index = 0; index < userInfoList.length; ++index) {
						uin = userInfoList[index].getUin();
						str += portraitInfo[uin][6] + "(" + uin + ")" + ",";
					}
					str = str.substr(0, str.length - 1);
					$("rightSettingSpan").title = str.toRealStr();
				});
				html = "指定好友可见";
			} else if (info.getType() == parent.BlogRightInfo.RIGHTTYPE["FRIEND"]) {
				$("rightSettingSpan").title = "QQ好友可见";
				html = "QQ好友可见";
			} else if (info.getType() == parent.BlogRightInfo.RIGHTTYPE["PRIVATE"]) {
				$("rightSettingSpan").title = "仅自己可见";
				html = "仅自己可见";
			} else {
				$("rightSettingSpan").title = "公开";
				html = "公开";
			}
			$("rightSettingSpan").innerHTML = html + '&nbsp;|';
			QZFL.css.removeClassName($("rightSettingSpan"), "none");
		},
		_showCategoryInfo: function() {
			if (BLOG_INFO.getEffectBit(22)) {
				return;
			}
			var cateName = BLOG_INFO.getCateName();
			if ( !! cateName) {
				$("categorySpan").innerHTML = '<a id="infoBlogCate" href="javascript:void(0)" onclick="return false;" class="c_tx3">' + cateName + '</a>&nbsp;|';
				QZFL.css.removeClassName($("categorySpan"), "none");
			}
		},
		_showLetterPaper: function() {
			if (BLOG_INFO.getPaperLetterInfo()) {
				QZBlog.Util.PaperLetterManager.doPaint(BLOG_INFO.getPaperLetterInfo(), BLOG_INFO.getTitle());
				QZFL.css.removeClassName($("useLetterPagerBtn"), "none");
			}
		},
		_showBlogViewCnt: function() {
			if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode() && BLOG_INFO.getEffectBit(8)) {
				return;
			}
			var _this = this;
			var rcPool = (parent.g_XDoc && parent.g_XDoc["blogCommentCount"]) ? parent.g_XDoc["blogCommentCount"] : {};
			if (!rcPool[BLOG_ID]) {
				rcPool[BLOG_ID] = {};
				rcPool[BLOG_ID].c = rcPool[BLOG_ID].reply = BLOG_INFO.getCommentCnt();
			}
			if (typeof(rcPool[BLOG_ID].read) == "undefined" || rcPool[BLOG_ID].read == "-") {
				var arr = new Array();
				arr.push(BLOG_ID);
				QZBlog.Logic.getBlogViewInfo(arr, QZONE.event.bind(this, function(data) {
					var rawData = data.data.itemList[0];
					if (typeof(rcPool[rawData.id]) == "undefined") {
						rcPool[rawData.id] = {};
					}
					rcPool[rawData.id].read = rawData.read;
					BLOG_INFO.setViewCnt(rcPool[rawData.id].read);
					if ($("readNum")) {
						$("readNum").innerHTML = "阅读(" + _this.fixNum(rcPool[rawData.id].read) + ")";
					}
				}));
			} else {
				$("readNum").innerHTML = "阅读(" + _this.fixNum(rcPool[BLOG_ID].read) + ")";
			}
		},
		_showMentionDiv: function() {
			if (QZBlog.Logic.isInPengyou) {
				return;
			}
			var bInfo = BLOG_INFO;
			var uinArr = bInfo.getFriendInformArray();
			if ( !! uinArr && uinArr.length > 0) {
				var flag = false;
				if ( !! QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
					flag = true;
				} else {
					var l = uinArr.length;
					for (var i = 0; i < l; i++) {
						if (uinArr[i] == QZBlog.Logic.SpaceHostInfo.getLoginUin()) {
							flag = true;
							break;
						}
					}
				}
				if (flag) {
					var param = {};
					QZONE.FP.getPortraitList(uinArr, function(data) {
						var _div = $("mentionDiv")
						var str = "";
						for (var key in data) {
							str += '<a class="q_namecard c_tx3" link="nameCard_' + key + '" href="http://user.qzone.qq.com/' + key + '" target="_blank">@' + data[key][6] + ' </a>';
						}
						str = str.slice(0, str.length - 1);
						_div.innerHTML = '<span>提到：</span>' + str;
						PS.fireEvent("onMentionNameCard");
						QZFL.css.removeClassName($("mentionDiv"), "none");
					}, param);
				}
			}
		},
		fixNum: function(num) {
			if (num >= 10000) {
				num = (num / 10000).toFixed(2) + "万";
			}
			return num;
		}
	};
	PS.triggerEvent('onStart', function() {
		InfoScheduler.start();
	});
	window.InfoScheduler = InfoScheduler;
})(PageScheduler);
(function(PS) {
	var BLOG_INFO, BLOG_ID;
	var QUOTED_FLAG = false;
	var InfoManager = {
		start: function() {
			var _this = this;
			BLOG_INFO = PS.blogInfo;
			BLOG_ID = BLOG_INFO.getID();
			var eventHash = {
				'returnBlogList': function() {
					_this.turnToList();
					QZBlog.Util.Statistic.sendPV('returnlist', 'rizhi.qzone.qq.com');
				},
				'nextBlog': function() {
					_this.turnPage(1);
				},
				'prevBlog': function() {
					_this.turnPage(-1);
				}
			};
			QZFL.event.addEvent(document.body, 'click', function(ev) {
				var tag = QZFL.event.getTarget(ev);
				var rel = tag.getAttribute('rel');
				if (rel && eventHash[rel]) {
					eventHash[rel]();
					QZFL.event.preventDefault();
					return false;
				}
			});
			if ( !! $("upperQuoteInfoAreaBtn")) {
				QZFL.event.addEvent($("upperQuoteInfoAreaBtn"), "click", function() {
					_this.quoteBlog();
					QZBlog.Util.Statistic.sendPV('reprint', 'rizhi.qzone.qq.com');
					return false;
				});
			}
			if ( !! $("footerQuoteInfoAreaBtn")) {
				QZFL.event.addEvent($("footerQuoteInfoAreaBtn"), "click", function() {
					_this.quoteBlog();
					QZBlog.Util.Statistic.sendPV('reprint', 'rizhi.qzone.qq.com');
					return false;
				});
			}
			if ( !! $("upperShareInfoAreaBtn") && QZFL.css.hasClassName($("upperShareInfoAreaBtn"), "drop_list")) {
				QZFL.event.addEvent($("upperShareInfoAreaBtn"), "mouseover", function() {
					_this.showShareList(true);
				});
			}
			if ( !! $("footerShareInfoAreaBtn") && QZFL.css.hasClassName($("footerShareInfoAreaBtn"), "drop_list")) {
				QZFL.event.addEvent($("footerShareInfoAreaBtn"), "mouseover", function() {
					_this.showShareList(false);
				});
			}
			if ( !! $("upperShareInfoAreaBtn")) {
				QZFL.event.addEvent($("upperShareInfoAreaBtn"), "click", function() {
					_this.shareBlog(BLOG_ID);
					QZBlog.Util.Statistic.sendPV('share', 'rizhi.qzone.qq.com');
					return false;
				});
			}
			if ( !! $("footerShareInfoAreaBtn")) {
				QZFL.event.addEvent($("footerShareInfoAreaBtn"), "click", function() {
					_this.shareBlog(BLOG_ID);
					QZBlog.Util.Statistic.sendPV('share', 'rizhi.qzone.qq.com');
					return false;
				});
			}
			QZFL.event.addEvent($("shareListTitle"), "click", function() {
				_this.shareBlog(BLOG_ID);
				QZBlog.Util.Statistic.sendPV('share', 'rizhi.qzone.qq.com');
				return false;
			});
			QZFL.event.addEvent($("shareBlogBtn"), "click", function() {
				_this.shareBlog(BLOG_ID);
				QZBlog.Util.Statistic.sendPV('share', 'rizhi.qzone.qq.com');
				return false;
			});
			QZFL.event.addEvent($("tweetBlogBtn"), "click", function() {
				_this.tweetBlog();
			});
			QZFL.event.addEvent($("upperReplyInfoAreaBtn"), "click", function() {
				CommentManager.jumpCommmentEditor();
			});
			QZFL.event.addEvent($("footerReplyInfoAreaBtn"), "click", function() {
				CommentManager.jumpCommmentEditor();
			});
			QZFL.event.addEvent($("upperCopyInfoAreaBtn"), "click", function() {
				_this.copyBlogUrl($("upperCopyInfoAreaBtn"));
				QZBlog.Util.Statistic.sendPV('copylink', 'rizhi.qzone.qq.com');
				return false;
			});
			QZFL.event.addEvent($("footerCopyInfoAreaBtn"), "click", function() {
				_this.copyBlogUrl($("footerCopyInfoAreaBtn"));
				QZBlog.Util.Statistic.sendPV('copylink', 'rizhi.qzone.qq.com');
				return false;
			});
			QZFL.event.addEvent($('upperModifyInfoAreaBtn'), 'focus', function() {
				_this.showModifyList(true);
			});
			QZFL.event.addEvent($('footerModifyInfoAreaBtn'), 'focus', function() {
				_this.showModifyList();
			});
			QZFL.event.addEvent($('upperModifyInfoAreaBtn'), 'mouseover', function() {
				_this.showModifyList(true);
			});
			QZFL.event.addEvent($('footerModifyInfoAreaBtn'), 'mouseover', function() {
				_this.showModifyList();
			});
			var isEditable = QZBlog.Logic.SpaceHostInfo.isOwnerMode() && !(QZBlog.Logic.isInPengyou && (BLOG_INFO.getEffectBit(52) || BLOG_INFO.isPhotoBlog()));
			if (isEditable) {
				QZFL.event.addEvent($("modifyListTitle"), "click", function() {
					_this.editBlog();
				});
				QZFL.event.addEvent($("editBlogBtn"), "click", function() {
					_this.editBlog();
				});
			}
			QZFL.event.addEvent($("deleteBlogBtn"), "click", function() {
				_this.deleteBlog();
			});
			QZFL.event.addEvent($("setTopBlogBtn"), "click", function() {
				_this.setBlogTop();
				QZBlog.Util.Statistic.sendPV('zhiding', 'rizhi.qzone.qq.com');
				return false;
			});
			QZFL.event.addEvent($("setBlogCateBtn"), "click", function() {
				_this.setBlogCate(BLOG_INFO.getCateName());
				return false;
			});
			QZFL.event.addEvent($("setBlogRightBtn"), "click", function() {
				_this.setBlogRight();
				QZBlog.Util.Statistic.sendPV('competence_set', 'rizhi.qzone.qq.com');
				return false;
				return false;
			});
			QZFL.event.addEvent($("setRecommendBlogBtn"), "click", function() {
				QZBlog.Logic.recommendBlog(BLOG_ID);
				QZBlog.Util.Statistic.sendPV('recommend', 'rizhi.qzone.qq.com');
				return false;
			});
			QZFL.event.addEvent($("setPrivateBlogBtn"), "click", function() {
				QZBlog.Logic.convertBlogToPrivate(BLOG_ID);
				QZBlog.Util.Statistic.sendPV('to_privateblog', 'rizhi.qzone.qq.com');
				return false;
			});
			QZFL.event.addEvent($("useLetterPagerBtn"), "click", function() {
				_this.selectPaper();
				QZBlog.Util.Statistic.sendPV('paperchoose', 'rizhi.qzone.qq.com');
				return false;
			});
			QZFL.event.addEvent($("bigFonts"), "click", function() {
				_this.switchFont();
			});
			QZFL.event.addEvent($("midFonts"), "click", function() {
				_this.switchFont();
			});
			QZFL.event.addEvent($("smallFonts"), "click", function() {
				_this.switchFont();
			});
			QZFL.event.addEvent($("upperComplaintBlogBtn"), "click", function() {
				_this.reportBlog();
			});
			QZFL.event.addEvent($("footerComplaintBlogBtn"), "click", function() {
				_this.reportBlog();
			});
			QZFL.event.addEvent($("categorySpan"), "click", function() {
				_this.jumpCategory();
				QZBlog.Util.Statistic.sendPV('class_click', 'rizhi.qzone.qq.com');
				return false;
			});
			if (BLOG_INFO.getEffectBit(8)) {
				QZFL.event.addEvent($("appealBlogBtnContainer"), "click", function() {
					QZBlog.Logic.appealBlog(BLOG_ID);
					return false;
				})
			}
			if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
				$e('.mod_signature .tit').find('a').setHtml('编辑签名档').removeClass('none');
			}
		},
		_curBlogID: null,
		TCISDURL: "/BlogContent",
		modifySignature: function() {
			QZONE.FP.toApp('/profile/qzinfo');
		},
		saveTag: function() {
			var tags = $("tags_input").value.trim();
			tags = tags.replace(/(\s|,|;|\||\\|，|；|、)+/gi, "|");
			tags = QZONE.lang.uniqueArray(tags.split("|")).splice(0, 5);
			for (var index = 0; index < tags.length; ++index) {
				if (tags[index].toInnerHTML().length != tags[index].length) {
					alert("对不起，搜索词不能使用\"，'，&，<，>字符");
					$("tags_input").focus();
					return;
				}
			}
			var blogid = getParameter("blogid");
			var param = {
				fupdate: 1,
				uin: QZBlog.Logic.SpaceHostInfo.getUin(),
				blogid: blogid,
				tags: tags.join("|")
			};
			var Request = new QZBlog.Util.NetRequest({
				url: QZBlog.CGI_URL.get('blog_modify_tag'),
				data: param,
				method: 'post',
				uniqueCGI: true
			});
			Request.onSuccess = function() {
				parent.g_oBlogInfoMgr.updateBlogInfoSeed(blogid);
				if (tags.join("").length == 0) {
					$("tags_disp").parentNode.style.display = "none";
					return;
				}
				var strHTML = "";
				$("tags_input").value = tags.join(" ");
				for (var index = 0; index < tags.length; ++index) {
					strHTML += "<a href='javascript:;' " + " title='查看其它\"" + tags[index] + "\"相关日志' onclick='QZBlog.Logic.searchTag(\"" + tags[index] + "\", \"" + BLOG_ID + "\");return false;'>" + tags[index].toInnerHTML() + "</a>&nbsp;";
				}
				strHTML += '<a class="c_tx" href="javascript:;" title="编辑搜索词" onclick="InfoManager.showTagEditArea();return false;">编辑</a>';
				$("tags_disp").innerHTML = strHTML;
				QZONE.css.toggleClassName($("tags_input").parentNode, "none");
				QZONE.css.toggleClassName($("tags_disp"), "none");
			};
			Request.send();
		},
		cancelEditTag: function() {
			QZONE.css.toggleClassName($("tags_input").parentNode, "none");
			QZONE.css.toggleClassName($("tags_disp"), "none");
			$("tags_input").value = this._originalTags;
		},
		showTagEditArea: function() {
			this._originalTags = $("tags_input").value;
			QZONE.css.toggleClassName($("tags_input").parentNode, "none");
			QZONE.css.toggleClassName($("tags_disp"), "none");
			$("tags_input").focus();
		},
		removeBlogTitle: function() {
			var blogid = getParameter("blogid");
			QZBlog.Logic.deleteBlog(blogid, function() {
				QZBlog.Logic.refreshTopData();
				parent.BlogListNavigator.removePageData();
				var totalCnt = parent.g_oCateInfoMgr.getBlogCntByCateName(parent.BlogListNavigator.getCurrentCate());
				if (totalCnt % LIST_TITLE_NUM == 1 && parent.BlogListNavigator.getCurrentPage() > 1) {
					parent.BlogListNavigator.setCurrentPage(parent.BlogListNavigator.getCurrentPage() - 1);
				}
				parent.g_oCateInfoMgr.clear();
				parent.g_oDraftListInfoMgr.clear();
				parent.g_oBlogInfoMgr.removeBlogInfo(blogid);
				QZBlog.Router.redirectTo('bloglist');
			}, function(msg) {
				QZBlog.Util.showLoginBox(msg, 5, 2000);
				QZBlog.Router.redirectTo('bloglist');
			}, 0);
		},
		_checkQuoteBlog: function() {
			var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(BLOG_ID);
			var _this = this;
			if (!blogInfo) {
				QZBlog.Util.showMsgbox("无法获取该篇日志信息，请刷新页面重试", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				return;
			}
			if (QUOTED_FLAG) {
				QZBlog.Util.showMsgbox("您已经转载了这篇日志", 3, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				return;
			}
			if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
				QZBlog.Util.showMsgbox("您不能转载自己的日志", 1, 2000);
				return;
			}
			if ( !! blogInfo.getEffectBit(6)) {
				QZBlog.Util.showMsgbox("对不起，此日志已被原作者禁止转载", 3, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				return;
			}
			var content = "";
			if (blogInfo.getEffectBit(29) || QZBlog.Logic.SpaceHostInfo.checkAuthorization()) {
				content = "此空间设置了访问权限。转载主人日志到您的空间，有可能导致主人隐私泄露。您是否确定转载？";
			}
			if (content.length == 0) {
				return true;
			}
			var dlg = new parent.QZONE.widget.Confirm("温馨提示", content, 3);
			dlg.onConfirm = QZONE.event.bind(this, function() {
				setTimeout(function() {
					_this.quoteBlog(true);
				}, 500);
			});
			dlg.show();
			QZBlog.Util.Statistic.sendPV("secretalert");
			return false;
		},
		quoteBlog: function(hasConfirm) {
			var _this = this;
			if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
				blogLoginFnList.splice(0, blogLoginFnList.length);
				PS.commonLoginCallback();
				blogLoginFnList.push(function() {
					_this.quoteBlog();
				});
				QZBlog.Util.showLoginBox("blogComment");
				return;
			}
			if (!hasConfirm && !this._checkQuoteBlog()) {
				return;
			}
			var _quoteOption, _cateValue, _rightValue, t = this;
			if (!QZBlog.Logic.isBlogPage) {
				_quoteOption = QZONE.FP._t.QZFL.shareObject.get(QZBlog.Logic.SpaceHostInfo.getLoginUin() + "_saveQuoteOption");
				_cateValue = QZONE.FP._t.QZFL.shareObject.get(QZBlog.Logic.SpaceHostInfo.getLoginUin() + "_saveCateValue");
				_rightValue = QZONE.FP._t.QZFL.shareObject.get(QZBlog.Logic.SpaceHostInfo.getLoginUin() + "_saveRightValue");
			}
			if ( !! _quoteOption && !! _cateValue && !! _rightValue) {
				t._doQuoteBlog(_cateValue, _rightValue);
			} else {
				QZONE.FP.dialog = QZONE.FP.dialog || QZONE.FP._t.QZFL.dialog;
				var _dialog = QZFL.FP.dialog.create("转载文章", {
					src: "/qzone/newblog/v5/quote_confirm.html"
				}, {
					showMask: true,
					width: 360,
					height: 130,
					buttonConfig: [{
							type: QZFL.dialog.BUTTON_TYPE.Confirm,
							text: '确定',
							tips: '确定'
						}, {
							type: QZFL.dialog.BUTTON_TYPE.Cancel,
							text: '取消',
							tips: '取消'
						}
					],
					onLoad: function(dialogInstance) {
						QZONE.FP.dialog.getById(dialogInstance.id).onConfirm = function() {
							var _dialogWindow = this.dialogContent.getElementsByTagName("iframe")[0].contentWindow;
							var category = _dialogWindow.getCategoryInfo();
							var rightInfo = _dialogWindow.getRightInfo();
							t._doQuoteBlog(category, rightInfo);
							QZONE.FP.getStatPackage().pv('blogtest.qzone.qq.com', '/quote_popup_confirm', {
								timeout: 1000
							});
							_dialogWindow.isConfirm = true;
							var _saveQuoteOption = _dialogWindow.getSaveQuoteOption();
							if ( !! _saveQuoteOption) {
								QZONE.FP.getStatPackage().pv('blogtest.qzone.qq.com', '/quote_option_saved', {
									timeout: 1000
								});
							}
						};
						QZONE.FP.dialog.getById(dialogInstance.id).onBeforeUnload = function() {
							var _dialogWindow = this.dialogContent.getElementsByTagName("iframe")[0].contentWindow;
							if (!_dialogWindow.isConfirm) {
								QZONE.FP.getStatPackage().pv('blogtest.qzone.qq.com', '/quote_popup_cancel', {
									timeout: 1000
								});
							}
							return true;
						};
					}
				});
			}
		},
		_doQuoteBlog: function(category, rightInfo, force) {
			var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(BLOG_ID);
			if (!blogInfo) {
				QZBlog.Util.showMsgbox("无法获取该篇日志信息，请刷新页面重试", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				return;
			}
			var _this = this;
			var data = function() {
				return {
					uin: QZBlog.Logic.SpaceHostInfo.getLoginUin(),
					hostUin: QZBlog.Logic.SpaceHostInfo.getUin(),
					blogId: BLOG_ID,
					cateName: category,
					rightType: rightInfo,
					force: force || 0,
					source: 34
				};
			};
			var req = new QZBlog.Util.NetRequest({
				url: QZBlog.CGI_URL.get('quote_blog'),
				data: data,
				method: 'post',
				uniqueCGI: true
			});
			req.onSuccess = function(responseData) {
				var quoteHtml = '<span class="icon icon_reprint"></span><span class="adjust">已成功转载</span>';
				$("upperQuoteInfoAreaBtn").innerHTML = quoteHtml;
				$("footerQuoteInfoAreaBtn").innerHTML = quoteHtml;
				_this._quoteBlogSucc(category, responseData);
				QZFL.event.removeEvent($("upperQuoteInfoAreaBtn"), "click");
				QZFL.event.removeEvent($("footerQuoteInfoAreaBtn"), "click");
				QUOTED_FLAG = true;
			};
			req.onError = function(msg, responseData) {
				if (responseData && responseData.code == -4018) {
					QZONE.FP.hideMsgbox();
					_this._showRepeatedQuoteConfirm(responseData.data.blogId, {
						okfn: function() {
							_this._doQuoteBlog(category, rightInfo, 1);
						},
						nofn: function() {}
					});
				} else {
					QZBlog.Util.showMsgbox(responseData.message || '服务器繁忙，请稍后再试', 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				}
			}
			req.send();
		},
		_quoteBlogSucc: function(newcate, responseData) {
			newcate = decodeURIComponent(newcate).toInnerHTML();
			var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(BLOG_ID);
			var paperInfo = blogInfo.getPaperLetterInfo();
			var popupWidth = 505;
			var popupHeight = !QZBlog.Logic.isInPengyou ? 305 : 165;
			if (ua.ie == 6) {
				popupHeight += 5;
			}
			if ( !! blogInfo) {
				var bPaperLetterState = null;
				var bSpecialFontState = null;
				if (paperInfo) {
					bPaperLetterState = parseInt(responseData.data.lp, 10) ? true : false;
				}
				if (blogInfo.getEffectBit(39)) {
					bSpecialFontState = responseData.data.sfont ? false : true;
				}
				var linkVIPExpress = '<a href="http://pay.qq.com/home?&aid=let.diy" target="_blank" style="color:red;">加入黄钻贵族</a>';
				var linkVIPYear = '<a href="http://pay.qq.com/home?&paytime=year&pageshow=bank&aid=let.diyy" target="_blank" style="color:red;">开通年费黄钻,制作DIY信纸</a>';
				var arrTips = [];
				var popContentHeight = 0;
				if (bPaperLetterState == false || bSpecialFontState == false) {
					QZBlog.Util.popupDialog('转载日志', '<iframe frameborder="0" height="' + popupHeight + '" width="' + popupWidth + '" src="http://' + IMGCACHE_DOMAIN + (QZBlog.Logic.isInPengyou ? IMGCACHE_BLOG_PENGYOU_PATH : IMGCACHE_BLOG_V6_PATH) + '/quote_success.html?' + 'showSpecialFontFailedTip=' + (bSpecialFontState ? 0 : 1) + '&showPaperLetterFailedTip=' + (bPaperLetterState ? 0 : 1) + '" scrolling="no" ></iframe>', popupWidth, popupHeight);
				} else {
					QZBlog.Util.popupDialog('转载日志', '<iframe frameborder="0" height="' + popupHeight + '" width="' + popupWidth + '" src="http://' + IMGCACHE_DOMAIN + (QZBlog.Logic.isInPengyou ? IMGCACHE_BLOG_PENGYOU_PATH : IMGCACHE_BLOG_V6_PATH) + '/quote_success.html" scrolling="no" ></iframe>', popupWidth, popupHeight);
				}
			} else {
				QZBlog.Util.showMsgbox(responseData.data.message, 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
			}
		},
		_showRepeatedQuoteConfirm: function(quoteBlogId, callbacks) {
			var blogUrl = 'http://' + (QZBlog.Logic.isInPengyou ? 'baseapp.pengyou.com' : 'user.qzone.qq.com') + '/' + QZBlog.Logic.SpaceHostInfo.getLoginUin() + '/blog/' + quoteBlogId;
			var confirmHTML = ['您最近已经转载过这篇文章，<br/>确定要重复转载吗？<br/><a href="', blogUrl, '" target="_blank">点此查看</a>'].join('');
			callbacks = QZFL.object.extend({
				okfn: QZFL.emptyFn
			}, callbacks);
			QZONE.FP.confirm('', confirmHTML, {
				type: '2',
				icontype: 'warn',
				okfn: function() {
					return callbacks.okfn();
				},
				nofn: function() {
					return callbacks.nofn();
				}
			});
		},
		copyBlogUrl: function(ele) {
			if (isNaN(parseInt(BLOG_ID, 10))) {
				alert("日志ID不正确，无法复制日志网址");
				return;
			}
			var url = QZBlog.Util.getSpaceUrl(QZBlog.Logic.SpaceHostInfo.getUin()) + "/blog/" + BLOG_ID;
			if (QZBlog.Logic.isInPengyou) {
				url = 'http://baseapp.pengyou.com/' + QZBlog.Logic.SpaceHostInfo.getUin() + '/blog/' + BLOG_ID;
			}
			if (QZONE.userAgent.ie) {
				if (parent.copyToClip(url)) {
					QZBlog.Util.showMsgbox("本文网址已经复制到剪贴板中", 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
					return;
				}
			}
			var pos = QZFL.dom.getXY(ele);
			var panel = $("qzblog_copyurl_tip");
			var offset = [0, 0];
			var tmp_p = QZFL.dom.searchChain(panel, 'parentNode', function(node) {
				if (QZFL.dom.getStyle(node, 'position') == 'relative' && node.tagName != 'BODY') {
					return true;
				}
			});
			if (tmp_p) {
				offset = QZFL.dom.getXY(tmp_p);
			}
			QZFL.dom.setXY(panel, pos[0] - offset[0], pos[1] - offset[1] + 20);
			$("copyUrlInput").value = url;
			QZFL.css.removeClassName(panel, "none");
			this._setSelection($("copyUrlInput"), 0, url.length);
			QZONE.event.addEvent(document, "mousedown", QZONE.event.bind(this, function() {
				var target = QZFL.event.getTarget(QZFL.event.getEvent());
				var isAncestor = QZFL.dom.isAncestor(panel, target);
				if (isAncestor || target == panel) {
					return;
				}
				QZFL.css.addClassName(panel, "none");
			}));
		},
		_setSelection: function(obj, s, e) {
			obj.focus();
			if (obj.setSelectionRange) {
				obj.setSelectionRange(s, e);
			} else if (obj.createTextRange) {
				m = obj.createTextRange();
				m.moveStart('character', s);
				m.moveEnd('character', e);
				m.select();
			}
		},
		switchFont: function() {
			var target = QZFL.event.getCurrentTarget(QZFL.event.getEvent());
			var size = !! $("blogDetailDiv").style.fontSize ? parseInt($("blogDetailDiv").style.fontSize) : 14;
			$("bigFonts").className = "c_tx2 bg6_hover";
			$("midFonts").className = "c_tx2 bg6_hover";
			$("smallFonts").className = "c_tx2 bg6_hover";
			switch (target) {
				case $("bigFonts"):
					size = 16;
					QZFL.css.addClassName($("bigFonts"), "current bg6");
					QZFL.css.removeClassName($("bigFonts"), "bg6_hover");
					break;
				case $("midFonts"):
					size = 14;
					QZFL.css.addClassName($("midFonts"), "current bg6");
					QZFL.css.removeClassName($("midFonts"), "bg6_hover");
					break;
				case $("smallFonts"):
					size = 12;
					QZFL.css.addClassName($("smallFonts"), "current bg6");
					QZFL.css.removeClassName($("smallFonts"), "bg6_hover");
					break;
			}
			$("blogDetailDiv").style.fontSize = size + "px";
			if (this._currentMoreListTarget) {
				var pos = QZFL.dom.getPosition(this._currentMoreListTarget);
				var targetSize = QZFL.dom.getSize(target);
				var menu = $("modifyList");
				var offset = [0, 0];
				var tmp_p = QZFL.dom.searchChain(menu, 'parentNode', function(node) {
					if (QZFL.dom.getStyle(node, 'position') == 'relative' && node.tagName != 'BODY') {
						return true;
					}
				});
				if (tmp_p) {
					offset = QZFL.dom.getXY(tmp_p);
				}
				QZFL.dom.setStyle(menu, {
					top: pos.top - offset[1],
					left: pos.left - offset[0]
				});
			}
			var data = {
				12: {
					"st": "smallfont",
					"text": "小"
				},
				14: {
					"st": "middlefont",
					"text": "中"
				},
				16: {
					"st": "largefont",
					"text": "大"
				}
			};
			QZBlog.Util.Statistic.sendPV(data[size].st, "rizhi.qzone.qq.com");
		},
		switchSpecialFont: function(enable) {
			if (!QZONE.userAgent.ie) {
				return;
			}
			var bMode = null;
			if (enable) {
				$("topHintArea").innerHTML = '<div class="hint"><strong class="icon_hint"><span>提示</span></strong> <span>您可以<a href="javascript:;" onclick="InfoManager.switchSpecialFont(false);return false;" class="c_tx4">使用普通字体</a>查看，使用个性字体的部分将恢复为宋体，此操作有可能打乱文字现有排版。</span> <a href="javascript:void(0)" title="关闭" onclick="$(\'topHintArea\').style.display = \'none\';return false;" class="hint_close">关闭</a></div>';
				QZBlog.Util.Statistic.sendPV("putong", "font.qzone.qq.com");
			} else {
				$("topHintArea").innerHTML = '<div class="hint"><strong class="icon_hint"><span>提示</span></strong> <span><a href="javascript:;" onclick="InfoManager.switchSpecialFont(true);return false;" class="c_tx4">查看个性字体效果</a></span> <a href="javascript:void(0)" title="关闭" onclick="$(\'topHintArea\').style.display = \'none\';return false;" class="hint_close">关闭</a></div>';
				QZBlog.Util.Statistic.sendPV("gexing", "font.qzone.qq.com");
			}
			QZBlog.Logic.enableSpeicialFontEffect(($("pagestyle").sheet || document.styleSheets["pagestyle"]), enable);
		},
		selectPaper: function() {
			if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
				blogLoginFnList.splice(0, blogLoginFnList.length);
				PS.commonLoginCallback();
				QZBlog.Util.showLoginBox("blogComment");
				return;
			}
			var info = parent.g_oBlogInfoMgr.getBlogInfo(BLOG_ID);
			info = info.getPaperLetterInfo();
			if ( !! info) {
				if (info.isDiy()) {
					var strTip;
					if (!QZBlog.Util.isLoginVIPExpress() && QZBlog.Util.getLoginVIPLevel() < 3) {
						strTip = '<div><a href="http://pay.qq.com/home?&aid=let.diy" target="_blank" style="color:red;">开通年费黄钻</a> 可制作DIY信纸</div>';
					} else {
						strTip = '<div><a href="http://user.qzone.qq.com/' + QZBlog.Logic.SpaceHostInfo.getLoginUin() + '/blog?secondary=1&&paperdialog=1" target="_blank" style="color:red;">制作DIY信纸</a></div>';
					}
					strTip = '<div style="padding:20px;"><div style="margin-bottom:10px;"><strong style="font-size:1.1em;">当前日志信纸为DIY信纸，不可选用</strong></div>' + strTip + '</div>';
					QZBlog.Util.popupDialog('温馨提示', strTip, 380, 100);
				} else {
					QZBlog.Router.redirectTo('addblog', {
						paperid: info.getID(),
						paperstyle: info.getStyle(),
						paperflag: info.getFlag()
					}, !QZBlog.Logic.SpaceHostInfo.isOwnerMode(), true);
				}
			} else {
				QZBlog.Util.showMsgbox("抱歉,暂时无法获取该信纸信息!", 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
			}
		},
		_checkCacheBlogID: function(curBlogID, direct) {
			var blogid = -1;
			if (direct < 0) {
				blogid = parent.BlogListNavigator.getPrevBlogID(curBlogID);
			} else if (direct > 0) {
				blogid = parent.BlogListNavigator.getNextBlogID(curBlogID);
			}
			if (blogid == -2) {
				QZBlog.Util.showMsgbox((direct < 0 ? "已经是第一篇" : "已经是最后一篇"), 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				return true;
			}
			if (blogid >= 0) {
				var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
				location.href = QZBlog.Util.getContentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), blogid, blogInfo ? blogInfo.getRandomSeed() : 0);
				QZBlog.Util.jumpTop();
				return true;
			}
			return false;
		},
		turnPage: function(direct) {
			var _this = this;
			if (_this._checkCacheBlogID(BLOG_ID, direct)) {
				return;
			}
			QZBlog.Util.showMsgbox("正在读取数据...", 6, 3000);
			var catehex = "";
			var cate = parent.BlogListNavigator.getCurrentCate();
			try {
				var cateInfo = parent.g_oCateInfoMgr.getCateInfoByName(cate);
				if ( !! cateInfo) {
					catehex = cateInfo.getHexCode();
				}
				cate = encodeURIComponent(cate);
			} catch (err) {
				cate = "";
			}
			var para = (direct == 1 ? "nextnum" : "prevnum") + "=" + parent.BlogListNavigator.getRollBlogNum();
			var url = QZBlog.CGI_URL.get("blog_get_specialtitle") + "?uin=" + QZBlog.Logic.SpaceHostInfo.getUin() + "&blogid=" + BLOG_ID + "&" + para + "&category=" + cate + ( !! catehex ? ("&catehex=" + catehex) : "") + "&sorttype=" + parent.BlogListNavigator.getSortType() + "&fupdate=1&r=" + parent.g_nBlogFirstPageRandSeed;
			var curDate = parent.BlogListNavigator.getCurrentDate();
			if (curDate && typeof(curDate["year"]) != "undefined" && typeof(curDate["month"]) != "undefined") {
				var spanTime = QZBlog.Util.getMonthSpanTime(curDate["year"], curDate["month"]);
				url += "&starttime=" + spanTime["start"];
				url += "&endtime=" + spanTime["end"];
			}
			var Request = new QZBlog.Util.NetRequest({
				url: url,
				method: 'get',
				uniqueCGI: true
			});
			Request.onSuccess = function(data) {
				QZBlog.Util.hideMsgbox();
				var data = data.data;
				if (!data) {
					QZBlog.Util.DumpMsgFunc();
					return;
				}
				data["title"] = BLOG_INFO.getTitle();
				data["blogid"] = BLOG_ID;
				parent.BlogListNavigator.addBlogRelations(data);
				var fieldName = (direct == 1 ? "next_list" : "prev_list");
				if (!data[fieldName] || data[fieldName].length == 0) {
					QZBlog.Util.showMsgbox((direct < 0 ? "已经是第一篇" : "已经是最后一篇"), 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
					return;
				}
				var blogid = -1;
				if (direct < 0) {
					blogid = parent.BlogListNavigator.getPrevBlogID(BLOG_ID);
				} else if (direct > 0) {
					blogid = parent.BlogListNavigator.getNextBlogID(BLOG_ID);
				}
				if (blogid >= 0) {
					var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(blogid);
					QZBlog.Util.jumpTop();
					setTimeout(function() {
						location.href = QZBlog.Util.getContentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), blogid, blogInfo ? blogInfo.getRandomSeed() : 0);
					}, 0);
				}
			};
			Request.send();
		},
		previewBlogTitle: function(target, currentBlogId, direct) {
			window.nPreviewTitleTimer = setTimeout(QZONE.event.bind(this, (function(target, currentBlogId, direct) {
				return function() {
					var tips = $("perviewTitleTips");
					if (!tips) {
						tips = QZONE.dom.createElementIn("span", document.body, false, {
							"id": "perviewTitleTips",
							"class": "simulate_tips",
							"style": "color:#999;"
						});
					}
					tips.innerHTML = "读取中...";
					this._showPreviewBlogTitleTips(target);
					this._getSiblingBlogTitle(currentBlogId, direct, QZONE.event.bind(this, function(tinfo) {
						if (!tinfo) {
							return;
						}
						tips.innerHTML = tinfo.title;
						if (tinfo.blogid > 0) {
							tips.style.cssText += ";color:infotext;";
						} else {
							tips.style.cssText += ";color:#999;";
						}
						this._showPreviewBlogTitleTips(target);
					}));
				};
			})(target, currentBlogId, direct)), 500);
		},
		_showPreviewBlogTitleTips: function(target) {
			var targetPos = QZFL.dom.getPosition(target);
			var tips = $("perviewTitleTips");
			var tipsX = targetPos.left;
			var tipsY = targetPos.height + targetPos.top + 10;
			if (tipsY > QZFL.dom.getScrollTop() + QZFL.dom.getClientHeight()) {
				tipsY = targetPos.top - tips.offsetHeight - 10;
			}
			if (tipsX + tips.offsetWidth > QZFL.dom.getScrollLeft() + QZFL.dom.getClientWidth()) {
				tipsX = Math.max(QZFL.dom.getScrollLeft(), QZFL.dom.getScrollLeft() + QZFL.dom.getClientWidth() - tips.offsetWidth);
			}
			tips.style.top = tipsY + "px";
			tips.style.left = tipsX + "px";
			tips.style.display = "";
		},
		cancelPreviewBlogTitle: function() {
			clearTimeout(window.nPreviewTitleTimer);
			if ($("perviewTitleTips")) {
				$("perviewTitleTips").style.display = "none";
			}
		},
		_getSiblingBlogTitle: function(currentBlogId, direct, callback) {
			currentBlogId = parseInt(currentBlogId, 10);
			currentBlogId = (isNaN(currentBlogId) ? BLOG_ID : currentBlogId);
			var info = (direct > 0 ? parent.BlogListNavigator.getNextBlogInfo(currentBlogId) : parent.BlogListNavigator.getPrevBlogInfo(currentBlogId));
			if ( !! info) {
				callback(info);
				return;
			}
		},
		turnToList: function() {
			QZBlog.Util.jumpTop();
			if (getParameter('refererurl')) {
				location.href = QZBlog.Logic.qqDomainFilter(decodeURIComponent(getParameter('refererurl')));
				return;
			}
			var param = {
				page: parseInt(getParameter('page'), 10) || 1
			};
			var cate = parent.BlogListNavigator.getCurrentCate() || null;
			try {
				var cate = parent.BlogListNavigator.getCurrentCate();
			} catch (err) {}
			if (cate) {
				param.cate = cate;
			}
			QZBlog.Router.redirectTo('bloglist', param);
		},
		jumpCategory: function() {
			var cateName = BLOG_INFO.getCateName();
			QZBlog.Util.jumpTop();
			parent.BlogListNavigator.clear();
			cateName = cateName.toInnerHTML();
			var param = {
				cate: cateName
			};
			QZBlog.Router.redirectTo('bloglist', param);
		},
		checkAuditBitmap: function() {
			if ( !! BLOG_INFO.getEffectBit(38) || !! BLOG_INFO.getEffectBit(50)) {
				var _div = $("hintAreaTop");
				if (!_div) {
					_div = QZFL.dom.createElementIn("div", document.body, true, {
						id: "hintAreaTop",
						"class": "hint-top"
					});
					_div.innerHTML = '<img src="/ac/b.gif" class="icon_hint" /> <span>尊敬的QQ空间用户：此日志因带有不符合互联网相关安全规范的信息，审核不通过，建议您及时删除。</span><a href="javascript:void(0);" title="关闭提示" class="bt-hint-close" onclick="$e(\'#hintAreaTop\').hide();return false;"></a>';
				} else {
					$e("#hintAreaTop").show();
				}
				return false;
			}
			return true;
		},
		editBlog: function() {
			if (BLOG_INFO.getEffectBit(8)) {
				QZBlog.Util.showMsgbox("审核未通过暂不支持编辑，请点击“申诉”处理。", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				return;
			}
			if (BLOG_INFO.getEffectBit(52)) {
				location.href = QZBlog.Util.getEditGridBlogUrl(['bid=' + BLOG_ID]);
			} else if (BLOG_INFO.isPhotoBlog()) {
				location.href = QZBlog.Util.getEditPhotoBlogUrl(['opener=content', 'bid=' + BLOG_ID])
			} else if (BLOG_INFO.isTemplateBlog()) {
				if (QZFL.dom.getSize(document.body)[0] < 895) {
					QZONE.FP.confirm("日志", "模板日志暂不支持当前版式下编辑，将跳转到普通编辑器继续编辑。<br />如要使用模板编辑器，请在空间主页排版中将版式调到宽版后重试。", {
						"hastitle": false,
						"tips": ["确认", "取消"],
						"height": 200,
						"type": 2,
						"okfn": function() {
							location.href = QZBlog.Util.getEditBlogUrl(['bid=' + BLOG_ID, 'opener=refererurl', 'refererurl=' + encodeURIComponent(location.href)]);
							return false;
						}
					});
					return false;
				}
				var params = {
					opener: "refererurl",
					bid: BLOG_ID,
					refererurl: location.href
				}
				location.href = QZBlog.Util.getEditTemplateBlogUrl(params);
			} else {
				var blogUrl = QZBlog.Util.getContentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), BLOG_ID, BLOG_INFO ? BLOG_INFO.getRandomSeed() : 0);;
				location.href = QZBlog.Util.getEditBlogUrl(['bid=' + BLOG_ID, 'opener=refererurl', 'refererurl=' + encodeURIComponent(blogUrl)]);
			}
			QZBlog.Util.jumpTop();
		},
		deleteBlog: function() {
			parent.blogPopupCallback = function() {
				QZBlog.Logic.refreshTopData();
				parent.BlogListNavigator.removePageData();
				var totalCnt = parent.g_oCateInfoMgr.getBlogCntByCateName(parent.BlogListNavigator.getCurrentCate());
				if (totalCnt % LIST_TITLE_NUM == 1 && parent.BlogListNavigator.getCurrentPage() > 1) {
					parent.BlogListNavigator.setCurrentPage(parent.BlogListNavigator.getCurrentPage() - 1);
				}
				parent.g_oCateInfoMgr.clear();
				parent.g_oDraftListInfoMgr.clear();
				parent.g_oBlogInfoMgr.removeBlogInfo(BLOG_ID);
				try {
					QZBlog.Util.closePopup();
				} catch (err) {}
				QZBlog.Router.redirectTo('bloglist');
			};
			QZBlog.Util.popupDialog('删除提示', '<iframe frameborder="no" id="delBlogFrame" style="width:398px;height:170px;" src="' + IMGCACHE_BLOG_V5_PATH + '/del_blog_dlg.html?blogid=' + BLOG_ID + '"></iframe>', 400, 170);
		},
		showModifyList: function(isTop) {
			var _this = this;
			var target = ua.ie ? QZFL.event.getTarget(QZFL.event.getEvent()) : QZFL.event.getCurrentTarget(QZFL.event.getEvent());
			if (target.tagName.toLowerCase() == "span") {
				target = target.parentNode;
			}
			this._currentMoreListTarget = target;
			var pos = QZFL.dom.getPosition(target);
			var size = QZFL.dom.getSize(target);
			var menu = $("modifyList");
			target.parentNode.appendChild(menu);
			var offset = [0, 0];
			var tmp_p = QZFL.dom.searchChain(menu, 'parentNode', function(node) {
				if (QZFL.dom.getStyle(node, 'position') == 'relative' && node.tagName != 'BODY') {
					return true;
				}
			});
			if (tmp_p) {
				offset = QZFL.dom.getXY(tmp_p);
			}
			QZFL.dom.setStyle(menu, {
				top: pos.top - offset[1],
				left: pos.left - offset[0]
			});
			QZFL.css.removeClassName(menu, "none");
			menu.setAttribute("isTop", isTop ? 1 : 0);
			QZFL.event.addEvent(document, "mousedown", QZFL.object.bind(this, _this.hideModifyList));
			QZFL.event.addEvent(document, "mouseover", QZFL.object.bind(this, _this.hideModifyList));
		},
		hideModifyList: function() {
			var _this = this;
			var target = QZFL.event.getTarget(QZFL.event.getEvent());
			var isAncestor = QZFL.dom.isAncestor($("modifyList"), target);
			if (isAncestor || target == $("modifyList")) {
				clearTimeout(window.modifyListTimer);
				return;
			}
			clearTimeout(window.modifyListTimer);
			window.modifyListTimer = setTimeout(function() {
				QZFL.event.removeEvent(document, "mousedown", _this.hideModifyList);
				QZFL.event.removeEvent(document, "mouseover", _this.hideModifyList);
				QZFL.css.addClassName($("modifyList"), "none");
				clearTimeout(window.modifyListTimer);
			}, 100);
		},
		showShareList: function(isTop) {
			var target = ua.ie ? QZFL.event.getTarget(QZFL.event.getEvent()) : QZFL.event.getCurrentTarget(QZFL.event.getEvent());
			if (target.tagName.toLowerCase() == "span") {
				target = target.parentNode;
			}
			$("shareListContainer").style.width = QZFL.dom.getSize($("upperShareInfoArea"))[0] + "px";
			var menu = $("shareList");
			var pos = QZFL.dom.getPosition(target);
			var offset = [0, 0];
			var tmp_p = QZFL.dom.searchChain(menu, 'parentNode', function(node) {
				if (QZFL.dom.getStyle(node, 'position') == 'relative' && node.tagName != 'BODY') {
					return true;
				}
			});
			if (tmp_p) {
				offset = QZFL.dom.getXY(tmp_p);
			}
			QZFL.css.removeClassName(menu, "none");
			QZFL.dom.setStyle(menu, {
				top: pos.top - offset[1],
				left: pos.left - offset[0]
			});
			menu.setAttribute("isTop", isTop ? 1 : 0);
			QZFL.event.addEvent(document, "mousedown", QZFL.event.bind(this, InfoManager.hideShareList));
			QZFL.event.addEvent(document, "mouseover", QZFL.event.bind(this, InfoManager.hideShareList));
		},
		hideShareList: function() {
			var target = QZFL.event.getTarget(QZFL.event.getEvent());
			var isAncestor = QZFL.dom.isAncestor($("shareList"), target);
			if (isAncestor || target == $("shareList")) {
				clearTimeout(window.shareListTimer);
				return;
			}
			clearTimeout(window.shareListTimer);
			window.shareListTimer = setTimeout(function() {
				QZFL.event.removeEvent(document, "mousedown", QZFL.event.bind(this, InfoManager.hideShareList));
				QZFL.event.removeEvent(document, "mouseover", QZFL.event.bind(this, InfoManager.hideShareList));
				QZFL.css.addClassName($("shareList"), "none");
				clearTimeout(window.shareListTimer);
			}, 100);
		},
		shareBlog: function() {
			var _this = this;
			var blogInfo = BLOG_INFO;
			if (!blogInfo) {
				alert("暂时无法分享该篇日志，请刷新空间重试");
				return;
			}
			if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
				blogLoginFnList.splice(0, blogLoginFnList.length);
				blogLoginFnList.push(function() {
					_this.shareBlog();
				});
				PS.commonLoginCallback();
				QZBlog.Util.showLoginBox("blogComment");
				return;
			}
			if ( !! blogInfo.getEffectBit(6)) {
				QZBlog.Util.showMsgbox("对不起，此日志已被原作者禁止分享", 3, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				return;
			}
			if (QZBlog.Logic.SpaceHostInfo.checkAuthorization()) {
				var title = blogInfo.getTitle();
				title = title.cutWord(10).toRealStr() + (title.getRealLength() > 10 ? "..." : "");
				var content = "当前空间不是对所有人公开的，您确认要将日志《" + title.toInnerHTML() + "》分享给朋友们吗？";
				var dlg = new parent.QZONE.widget.Confirm("温馨提示", content, 3);
				dlg.onConfirm = function() {
					_this._doShareBlog();
				}
				dlg.show();
			} else {
				this._doShareBlog();
			}
		},
		_doShareBlog: function() {
			var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(BLOG_ID);
			var title = blogInfo.getTitle();
			var content = "";
			if (typeof($("blogDetailDiv").innerText) != "undefined") {
				content = $("blogDetailDiv").innerText;
			} else if (typeof($("blogDetailDiv").textContent) != "undefined") {
				content = $("blogDetailDiv").textContent;
			} else if (typeof($("blogDetailDiv").text) != "undefined") {
				content = $("blogDetailDiv").text;
			}
			var imgArr = $("blogDetailDiv").getElementsByTagName("img");
			var summary = (content.getRealLength() > 100) ? (content.cutWord(100).toRealStr() + "...") : content;
			parent.blogFormParams = {
				"type": 1,
				"title": title,
				"blogid": BLOG_ID,
				"spaceuin": QZBlog.Logic.SpaceHostInfo.getUin(),
				"nickname": QZBlog.Logic.SpaceHostInfo.getNickname(),
				"totallen": content.getRealLength(),
				"summary": summary,
				"images": (imgArr.length > 0 ? imgArr[0].src : ""),
				"picnum": imgArr.length,
				"onSuccess": function() {
					var temHTML = $("upperShareInfoAreaBtn").innerHTML;
					shareNumInfo = !! (temHTML).match(/(\d+)/g) ? (temHTML).match(/(\d+)/g)[0] : 0;
					if (!temHTML.match(/\u4E07/)) {
						var shareNum = parseInt(shareNumInfo) + 1;
						var shareHtml = '<span class="icon icon_share"></span><span class="adjust">分享(' + shareNum + ')</span><span class="mod_arr"></span>';
						$("upperShareInfoAreaBtn").innerHTML = shareHtml;
						$("footerShareInfoAreaBtn").innerHTML = shareHtml;
						$("shareListTitle").innerHTML = shareHtml;
					}
				}
			};
			window.getShareInfo = function() {
				return parent.blogFormParams;
			};
			QZBlog.Util.popupDialog('添加到我的分享', '<iframe frameborder="no" height="175" width="408" src="http://' + IMGCACHE_DOMAIN + '/qzone/app/qzshare/popup.html"></iframe>', 410, 175);
		},
		setBlogCate: function(orgCate) {
			if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
				return;
			}
			QZBlog.Logic.setCategoryInfo(BLOG_ID, orgCate, function(cateName) {
				BLOG_INFO.setCateName(cateName);
				if ( !! $("categorySpan")) {
					$("infoBlogCate").innerHTML = QZFL.string.escHTML(cateName);
				}
			});
		},
		setBlogRight: function() {
			var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(BLOG_ID);
			if (!blogInfo) {
				alert("暂时无法获取该篇日志信息，请刷新空间重试");
				return;
			}
			if (!this.checkAuditBitmap()) {
				return;
			}
			if (blogInfo.getEffectBit(8) || blogInfo.getEffectBit(22)) {
				QZBlog.Logic.appealBlog(BLOG_ID);
				return false;
			}
			QZBlog.Logic.setBlogRight(blogInfo, function() {
				InfoScheduler._showRightSettingInfo();
				parent.g_oBlogInfoMgr.updateBlogInfoSeed(BLOG_ID);
				parent.BlogListNavigator.removePageData();
			});
		},
		setBlogTop: function() {
			var blogInfo = parent.g_oBlogInfoMgr.getBlogInfo(BLOG_ID);
			if (!blogInfo) {
				alert("无法获取该篇日志详细信息，请刷新空间重试");
				return;
			}
			QZBlog.Logic.setBlogTop(blogInfo, function() {
				var curCate = parent.BlogListNavigator.getCurrentCate();
				var sortType = parent.BlogListNavigator.getSortType();
				parent.BlogListNavigator.clear();
				parent.BlogListNavigator.setCurrentCate(curCate);
				parent.BlogListNavigator.setSortType(sortType);
				location.href = QZBlog.Util.getContentCGIUrl(QZBlog.Logic.SpaceHostInfo.getUin(), blogInfo.getID(), blogInfo.getRandomSeed());
			});
		},
		reportBlog: function() {
			QZONE.FP.showReportBox({
				"appname": "qzone",
				"subapp": "blog",
				"jubaotype": "article",
				"encoding": "GB2312",
				"uin": QZBlog.Logic.SpaceHostInfo.getUin(),
				"blogid": BLOG_ID,
				"blogtype": (QZBlog.Logic.SpaceHostInfo.isFamousUser() ? 1 : (QZBlog.Logic.SpaceHostInfo.isBizUser() || QZBlog.Logic.SpaceHostInfo.isInteractiveUser() ? 2 : 0))
			});
		},
		quoteImage: function(url) {
			if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
				var blogRightType = BLOG_INFO.getRightInfo().getType();
				var blog_acc_close = (blogRightType == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"] || blogRightType == parent.BlogRightInfo.RIGHTTYPE["FRIEND"] || blogRightType == parent.BlogRightInfo.RIGHTTYPE["PRIVATE"] || QZBlog.Logic.SpaceHostInfo.checkAuthorization());
				if (blog_acc_close) {
					QZBlog.Util.showMsgbox("该日志设置了显示权限，无法转载", 2, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
					return true;
				}
			}
			var loginUin = QZBlog.Logic.SpaceHostInfo.getLoginUin();
			window.getReprientData = function() {
				if (typeof(loginUin) == "undefined") {
					loginUin = QZONE.cookie.get("uin").replace(/o?(0?)+/, "");
				}
				return {
					"url": url,
					"from": "blog",
					"spaceuin": QZBlog.Logic.SpaceHostInfo.getUin(),
					"uin": loginUin,
					"title": "日志转载图片"
				};
			};
			var strHTML = {
				"src": "/qzone/photo/zone/reprint.html"
			};
			QZBlog.Util.popupDialog('转载到我的相册', strHTML, 470, QZONE.userAgent.ie ? 268 : 265);
		},
		replyImage: function(viewType, uin, blogid, imgIdx) {
			var b = QZONE.FP._t;
			var htmlSrc = '/qzone/photo/zone/icenter_popup.html?params=' + viewType + ',' + uin + ',' + blogid + ',' + imgIdx + ',1';
			QZONE.FP.fullscreenOnLoad(function() {
				var _iframe = b.$("fullscreen_dialog_frame");
				_iframe.G_Param = {
					'x': 300,
					'y': 300,
					'w': 400,
					'h': 300,
					'appid': 2
				};
			});
			QZBlog.Logic.TCISDClick('picpinglun', '/BlogContent');
			QZONE.FP.fullscreenDialog({
				src: htmlSrc
			});
		},
		tweetBlog: function() {
			if ( !! QZONE.FP._t.QZFL.dataCenter.get("blog_twitter_hint")) {
				this.doTweetBlog();
				return;
			}
			var blogRightType = BLOG_INFO.getRightInfo().getType();
			var blog_acc_close = (blogRightType == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"] || blogRightType == parent.BlogRightInfo.RIGHTTYPE["FRIEND"] || blogRightType == parent.BlogRightInfo.RIGHTTYPE["PRIVATE"] || QZBlog.Logic.SpaceHostInfo.checkAuthorization());
			if (blog_acc_close && !QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
				QZBlog.Util.showMsgbox("该日志设置了显示权限，无法转播", 2, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
			} else {
				this.doTweetBlog();
			}
		},
		doTweetBlog: function(msg, synShare, confirm) {
			var default_msg = msg;
			QZBlog.Util.closePopup();
			if (!confirm) {
				var nick = QZBlog.Logic.SpaceHostInfo.getNickname();
				var blogUrl = "http://user.qzone.qq.com/" + QZBlog.Logic.SpaceHostInfo.getUin() + "/blog/" + BLOG_ID;
				var spaceUrl = "http://user.qzone.qq.com/" + QZBlog.Logic.SpaceHostInfo.getUin();
				var content = "分享" + nick + "(" + spaceUrl + " )的日志：" + BLOG_INFO.getTitle().toRealStr() + "，" + blogUrl;
				var wbdata = {
					hostuin: QZBlog.Logic.SpaceHostInfo.getUin(),
					id: BLOG_ID,
					text: content,
					imgs: [],
					from: 'blog',
					callback: function() {
						QZONE.FP.closePopup();
					}
				};
				var imglist = $("blogDetailDiv").getElementsByTagName('img');
				var myReg = /\/b.gif$/;
				for (i = 0; i < imglist.length; i++) {
					if (imglist[i].getAttribute("orgsrc")) {
						if (myReg.test(imglist[i].getAttribute("orgsrc"))) {
							continue;
						} else {
							wbdata.imgs.push(imglist[i].getAttribute("orgsrc"));
						}
					} else if (imglist[i].getAttribute("src")) {
						if (myReg.test(imglist[i].getAttribute("src"))) {
							continue;
						} else {
							wbdata.imgs.push(imglist[i].getAttribute("src"));
						}
					}
				}
				if (BLOG_INFO.getEffectBit(52) && !! PS.gridBlogImgUrl && PS.gridBlogImgUrl != "") {
					wbdata.imgs.push(PS.gridBlogImgUrl);
				}
				var key = "wbdata";
				var _d = (parent.QZFL && parent.QZFL.dataCenter) ? parent.QZFL.dataCenter : QZFL.dataCenter;
				_d.save(key, wbdata);
				QZONE.FP.popupDialog("转播到我的微博", '<iframe frameborder="no" height="' + (wbdata.imgs.length == 0 ? 135 : 260) + '" width="410" src="http://' + IMGCACHE_DOMAIN + '/qzone/app/weibo/dialog/share2weibo.html"></iframe>', 412, wbdata.imgs.length == 0 ? 135 : 260);
				return;
			}
		},
		twitterImage: function(imgurl) {
			imgurl = unescape(imgurl);
			if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
				var blogRightType = BLOG_INFO.getRightInfo().getType();
				var blog_acc_close = (blogRightType == parent.BlogRightInfo.RIGHTTYPE["SPECIFIC"] || blogRightType == parent.BlogRightInfo.RIGHTTYPE["FRIEND"] || blogRightType == parent.BlogRightInfo.RIGHTTYPE["PRIVATE"] || QZBlog.Logic.SpaceHostInfo.checkAuthorization());
				if (blog_acc_close) {
					QZBlog.Util.showMsgbox("该日志设置了显示权限，无法转播", 2, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
					return true;
				}
			}
			var nick = QZBlog.Logic.SpaceHostInfo.getNickname();
			var blogUrl = "http://user.qzone.qq.com/" + QZBlog.Logic.SpaceHostInfo.getUin() + "/blog/" + BLOG_ID;
			var spaceUrl = "http://user.qzone.qq.com/" + QZBlog.Logic.SpaceHostInfo.getUin();
			var content = "分享" + nick + "(" + spaceUrl + " )的日志：" + BLOG_INFO.getTitle().toRealStr() + "，" + blogUrl;
			var wbdata = {
				hostuin: QZBlog.Logic.SpaceHostInfo.getUin(),
				id: BLOG_ID,
				text: content,
				imgs: [imgurl],
				from: 'blog',
				callback: QZONE.FP.closePopup
			};
			var key = "wbdata";
			var _d = (parent.QZFL && parent.QZFL.dataCenter) ? parent.QZFL.dataCenter : QZFL.dataCenter;
			_d.save(key, wbdata);
			QZBlog.Logic.TCISDClick('piczhuanfa', '/BlogContent');
			QZONE.FP.popupDialog("转播到我的微博", '<iframe frameborder="no" height="260" width="410" src="http://' + IMGCACHE_DOMAIN + '/qzone/app/weibo/dialog/share2weibo.html"></iframe>', 412, 260);
		},
		twitterImagePopupCallback: function(msg, share, imgurl) {
			var shareImg = function(msg, imgurl) {}
			var url = ([QZBlog.CGI_URL.get('blogimg_to_tweet'), '?uin=', QZBlog.Logic.SpaceHostInfo.getUin(), '&loginuin=', QZBlog.Logic.SpaceHostInfo.getLoginUin(), '&content=', msg, '&imgurl=', encodeURIComponent(imgurl), '&blogid=', BLOG_ID]).join('');
			var netProcessor = QZBlog.Util.NetProcessor.create(url, "post", function(data) {
				if (data && !data.error) {
					if (share) {
						shareImg(msg, imgurl);
					}
					QZBlog.Util.closePopup();
					QZBlog.Util.showMsgbox('图片转发成功', 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				} else {
					QZBlog.Util.showMsgbox(((data.error && data.error.msg) || '系统正忙，请稍后操作!'), 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				}
			}, function(data) {
				QZBlog.Util.showMsgbox(getXMLNodeText(XMLselectSingleNode(data, "/error")), 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
			}, "GB2312", false);
			netProcessor.loginHandler = function() {
				blogLoginFnList.splice(0, blogLoginFnList.length);
				PS.commonLoginCallback();
				QZBlog.Util.showLoginBox("blogComment");
			};
			netProcessor.setPostType('JSON');
			netProcessor.excute();
		}
	};
	PS.triggerEvent('onStart', function() {
		InfoManager.start();
	});
	window.InfoManager = InfoManager;
})(PageScheduler);
VISITOR_TPL = '<div class="mod_title"><h4>本文最近访客</h4><a href="javascript:;" style="display:none" id="visitorSettingSpan" title="设置" class="c_tx">设置</a><a href="javascript:;" style="display:none" id="showVisitorSpan" class="c_tx">  查看最近<strong id="recentVisitorCnt"></strong>位访客<span class="symbol">↓</span></a><a href="javascript:;" style="display:none" id="hideVisitorSpan" title="收起" class="c_tx">收起<span class="symbol">↑</span></a></div><div class="bbor3 cont"><div class="box_list_avatar_h clearfix" id="recentVisitorDiv"></div></div>';
var VisitorScheduler = {
	tpl_visitor_list: VISITOR_TPL,
	defaultVisitorNum: 8,
	visitorNumPerLine: 8,
	maxVisitorNum: 24,
	totalVisitorNum: 0,
	curUnfoldState: false,
	visitorModule: null,
	start: function() {;
		var info = PageScheduler.blogInfo.getRightInfo();
		var _this = this;
		if (PageScheduler.blogInfo.isPrivate || (QZBlog.Logic.SpaceHostInfo.isOwnerMode() && (info.getType() == parent.BlogRightInfo.RIGHTTYPE["PRIVATE"]))) {
			return;
		}
		if ((!QZBlog.Logic.SpaceHostInfo.isOwnerMode() && !QZBlog.Logic.SpaceHostInfo.isFamousUser() && !QZBlog.Logic.SpaceHostInfo.isBizUser() && !QZBlog.Logic.SpaceHostInfo.isInteractiveUser()) || QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
			$("visitorArea").innerHTML = tmpl(this.tpl_visitor_list, {});
			this.initVisitorModule();
			this.bindEvent();
		}
	},
	bindEvent: function() {
		var _this = this;
		QZFL.event.addEvent($('showVisitorSpan'), 'click', function() {
			_this.toggleRecentVisitor(true);
			QZFL.event.preventDefault();
			return false;
		});
		QZFL.event.addEvent($('hideVisitorSpan'), 'click', function() {
			_this.toggleRecentVisitor(false);
			QZFL.event.preventDefault();
			return false;
		});
		if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
			$('visitorSettingSpan').style.display = "";
			QZFL.event.addEvent($('visitorSettingSpan'), 'click', function() {
				_this.showVisitorSetting();
				QZFL.event.preventDefault();
				return false;
			});
		}
	},
	initVisitorModule: function() {
		var _this = this;
		var jsLoader = new QZONE.jsLoader();
		jsLoader.onload = function() {
			_this.visitorModule = QZONE.module.Visitor.setup({
				"type": "blog",
				"contentid": PageScheduler.blogInfo.getID(),
				"container": $('recentVisitorDiv'),
				"first_page_item": _this.defaultVisitorNum,
				"onLoad": _this.getVisitorCallback,
				"onDelete": _this.changeVisitotCallback
			});
		};
		jsLoader.load("/qzone/v6/friend_manage/module/visitor.js", document, "utf-8");
		PageScheduler.fireEvent("onVisitorNameCard");
	},
	getVisitorCallback: function(ins) {
		!QZBlog.Logic.isSeoPage && QZBlog.Util.Statistic.addSpeedPoint(6);
		if ( !! parent.bcSpeedBasePoint) {
			!QZBlog.Logic.isSeoPage && QZBlog.Util.Statistic.sendSpeedStatistic(112, 7);
		}
		VisitorScheduler.visitorModule = ins;
		var visitorNum = ins.length();
		VisitorScheduler.totalVisitorNum = ins.length();
		if (visitorNum) {
			$("visitorArea").style.display = '';
		} else {
			$("visitorArea").style.display = 'none';
		}
		if (VisitorScheduler.totalVisitorNum > VisitorScheduler.visitorNumPerLine) {
			$('showVisitorSpan').style.display = '';
			$('recentVisitorCnt').innerHTML = VisitorScheduler.totalVisitorNum;
		}
	},
	changeVisitotCallback: function(ins) {
		VisitorScheduler.visitorModule = ins;
		var visitorNum = ins.length();
		VisitorScheduler.totalVisitorNum = ins.length();
		if (visitorNum) {
			$("visitorArea").style.display = '';
		} else {
			$("visitorArea").style.display = 'none';
		}
		if (VisitorScheduler.totalVisitorNum > VisitorScheduler.visitorNumPerLine) {
			$('recentVisitorCnt').innerHTML = VisitorScheduler.totalVisitorNum;
		} else {
			$("showVisitorSpan").style.display = "none";
			$("hideVisitorSpan").style.display = "none";
		}
	},
	showVisitorSetting: function() {
		var _this = this;
		var nLoginUin = QZBlog.Logic.SpaceHostInfo.getLoginUin();
		if (!parent.g_oBlogSettingInfoMgr.isSettingInfoReady(nLoginUin)) {
			QZBlog.Util.showMsgbox("正在获取您的设置信息，请稍候...", 6, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
			QZBlog.Util.getSubLoginBitMapFlag(function(data, value) {
				if (!data) {
					return;
				}
				parent.g_oBlogSettingInfoMgr.createSettingInfo(nLoginUin, data);
				_this.showVisitorSetting();
			}, 1);
			return;
		}
		QZBlog.Util.popupDialog('设置', '<iframe frameborder="no" id="visitorSettingFrame" style="width:100%;height:115px;" src="' + IMGCACHE_BLOG_V5_PATH + '/visitor_setting.html"></iframe>', 400, 115);
	},
	toggleRecentVisitor: function(state) {
		$('showVisitorSpan').style.display = state ? 'none' : '';
		$('hideVisitorSpan').style.display = state ? '' : 'none';
		this.visitorModule.render(0, (state ? this.totalVisitorNum : this.visitorNumPerLine));
	}
}
PageScheduler.triggerEvent('onStart', function() {
	VisitorScheduler.start();
});
(function(PS) {
	var COMMENT_TPL = '<div class="blog_comment <%=noCommentClass%>"><div class="mod_tab"><div class="mode_menu_tag2"><ul><li class="nowtag"><a id="commentCnt" href="javascript:;">评论</a></li><li id="broadcastTitle" style="display:none"><a href="javascript:;" id="broadcastCnt">互动</a><i style="display:none;" id="newBroadcastDotBtn" class="icon icon_dot"></i></li></ul></div><div class="mod_tab_other"><p class="mod_title_other"><a href="javascript:;" id="switchSigHref" onclick="CommentManager.switchSignature(this);return false;" title="显示评论签名" class="c_tx <%=normalClass%>">显示评论签名</a></p><p class="mod_title_other" id="famousOperArea" style="display:none"><span id="leftDeleteComParag" style="display:none"><label for="batchSelAllInput">全选</label><input type="checkbox" id="batchSelAllInput" onclick="CommentManager.selectAllComments(this.checked);" /><button class="bt_tx2" style="margin-left:10px;" onclick="CommentManager.deleteBatchComments();">删除</button></span><a id="noBatchDelComHref" style="display:none" href="javascript:;" onclick="CommentManager.showCommentCheckBoxs(false, false); return false;" class="c_tx" title="取消批量删除评论">取消批量删除</a><a id="batchDelComHref" onclick="CommentManager.showCommentCheckBoxs(true, false); return false;" href="javascript:;" class="c_tx" title="批量删除评论">批量删除</a></p></div></div><p class="no_message" style="display:none" id="noCommentTip"><span class="c_tx3">还没有人发表评论</span>&nbsp;&nbsp;<a href="javascript:;" onclick="CommentManager.jumpCommmentEditor();QZBlog.Util.Statistic.sendPV(\'releasecomment_click\', \'rizhi.qzone.qq.com\');return false;" title="来坐第一个沙发" class="c_tx">来坐第一个沙发</a></p><div id="commentDiv" style="display:none"><div class="hint" id="cheatHintArea" style="display:none"><strong class="icon_hint"><span>提示</span></strong><span>QQ空间郑重承诺：致力于为用户提供绿色、健康的网络空间！坚决杜绝低俗、恶意、反动等不良信息，在此愿每位QQ空间用户共同参与维护！对您的举报信息我们将第一时间核查处理，请点击：<a href="http://blog.qq.com/qzone/20050606/1303195943.htm" class="c_tx4" target="_blank">了解QQ空间举报入口</a></span><a href="javascript:;" title="关闭提示" class="hint_close" onclick="document.getElementById(\'cheatHintArea\').style.display=\'none\';if(parent.UserBlogConfig){parent.UserBlogConfig.setCheatHintFlag(true);}"></a></div><ol id="commentListDiv" class="<%=famousCommentClass%>"></ol><div class="page_wrap"><div class="pagenav" id="commentPageIndexArea"></div></div><div id="broadCastArea" style="display:none;"><div class="interact_wrap" id = "broadcastListDiv"></div><div class="page_wrap"><div class="pagenav" id="broadCastPagination"></div></div></div></div></div>';;
	var COMMENT_LIST_TPL = '<%repeat_0 match="/data"%><li id="singleCommentDiv<%=@floornum%>"><div name="commentItemDiv" class="comment_wrap bbor3 <%=@isfamousblog%>"><div class="user_info"><a link="<%=@namecard%>" href="<%=@famousReplyHref%>" target="_blank" title="头像" onclick="QZBlog.Logic.TCISDClick(\'Comment.Picture\', InfoManager.TCISDURL);QZBlog.Util.Statistic.sendPV(\'guestportrait_comment\', \'rizhi.qzone.qq.com\');" class="avatar q_namecard"><img id="imgUrl<%=@floornum%>" src="<%=@imgurl%>" alt="<%=@replynick%>" /></a><p class="username"><span class="<%=@rainbowName%>"><a style="<%=@rainbowFilter%>" href="<%=@famousReplyHref%>" target="_blank" title="<%=@replynick%>" link="<%=@namecard%>" onclick="QZBlog.Logic.TCISDClick(\'Comment.Nick\', InfoManager.TCISDURL);" class="c_tx q_namecard"><%=@replynick%></a></span><%=@vipHTML%></p><p class="flower_info" id="flowerDiv<%=@floornum%>"></p></div><div class="comment_info"><div class="tit"><input name="commentCheckBox" type="checkbox" value="<%=@replyid%>_<%=@replyarch%>_<%=@replyuin%>" /><span class="floor"><%=@floornum%>楼 <span class="icon icon_angle_love <%=@angelClass%>" title="天使之爱"></span></span><span class="<%=@notRainbowClass%> username "><a href="<%=@famousReplyHref%>" target="_blank" title="<%=@replynick%>" link="<%=@namecard%>" class="c_tx q_namecard"><%=@replynick%></a><a href="javascript:;" style="display:none" id="yellowHref<%=@floornum%>" target="_blank" title="点击查看黄钻特权详情" onclick="QZBlog.Logic.gotoVipInfo(\'<%=@replyuin%>\');return false;"></a></span><span class="c_tx3 time"><%=@commentTime%></span><div id="op<%=@replyid%>" class="op"><%=@commentOPSpan%></div></div><div class="gift_pic"><a href="javascript:;" onclick="CommentManager.showGift(\'<%=@replyid%>\');return false;" title="<%=@giftName%>"><%=@giftImg%></a><p><a href="javascript:;" onclick="CommentManager.showGift(\'<%=@replyid%>\');return false;" class="c_tx" title="<%=@giftName%>"><%=@giftName%></a></p></div><table style="width:100%"><tbody><tr><td style="font-size:14px"><%=@replyContent%></td></tr></tbody></table><div class="mod_comment" style="width:400px; font-size:14px;" id="multiReplyDiv<%=@replyid%>"></div><div class="tbor3 c_tx3 signature <%=@signatureClass%>" id="signatureDIV<%=@floornum%>"><%=@replyautograph%></div></div></div></li><%_repeat_0%>';;
	var BLOG_INFO, BLOG_ID;
	var IS_FAMOUS = QZBlog.Logic.SpaceHostInfo.isFamousUser(),
		IS_BIZ = QZBlog.Logic.SpaceHostInfo.isBizUser(),
		IS_INTERACTIVE = QZBlog.Logic.SpaceHostInfo.isInteractiveUser(),
		IS_RECOMMEND, IS_SPECIAL_BLOG;
	var CommentScheduler = {
		start: function() {
			BLOG_INFO = PS.blogInfo;
			BLOG_ID = BLOG_INFO.getID();
			IS_RECOMMEND = BLOG_INFO.isRecommend();
			IS_SPECIAL_BLOG = IS_FAMOUS || IS_BIZ || IS_INTERACTIVE || IS_RECOMMEND;
			var _this = this;
			$("commentListContainer").innerHTML = tmpl(COMMENT_TPL, {
				normalClass: IS_SPECIAL_BLOG ? 'none' : '',
				noCommentClass: window.g_default_no_comment ? 'none' : '',
				famousCommentClass: IS_SPECIAL_BLOG ? 'list_without_avatar' : ''
			});
			QZBlog.Util.getSecureSettingInfo("forbidCommentAndReply", function(bFlag) {
				var sheet = ($("pagestyle").sheet || document.styleSheets["pagestyle"]);
				var rules = QZONE.css.getRulesBySheet(sheet);
				if ( !! bFlag) {
					QZBlog.Logic.showPageHintInfo("<font style='color:red;'>尊敬的QQ空间用户，现QQ空间日志需要进行临时维护，维护过程中暂不支持评论和回复，建议您休息一会再来尝试！</font>", $("commentListContainer"));
					if (QZONE.userAgent.ie) {
						sheet.cssText += "\n.qzCommentOption {display:none !important;}\n";
					} else {
						sheet.insertRule('.qzCommentOption {display:none !important;}', rules.length);
					}
				}
			});
			if (window.g_default_no_comment) {
				QZBlog.Logic.showPageHintInfo("<font style='color:red;'>尊敬的QQ空间用户，目前日志需要进行临时维护，维护过程中暂不支持显示评论，请您放心，维护完成后将会显示正常，建议您休息一会再来查看！</font>", $("commentListContainer"), "noCommentHintArea");
				!QZBlog.Logic.isSeoPage && QZBlog.Util.Statistic.addSpeedPoint(5);
				return;
			}
			var isStaticPage = location.host.toLowerCase() == 'blog.qq.com';
			if (isStaticPage) {
				BLOG_INFO.clearCommentListInfo();
				CommentManager._getCommentPageData(1, function(data) {
					BLOG_INFO.setCommentCnt(data.data.total);
					CommentManager.updateCommentCnt();
					var listInfo = CommentManager._procCommentPageData(data);
					_this.showCommentList(listInfo);
					_this.updateCommentPagination();
					if (data.data.total) {
						PS.fireEvent('COMMEND_LOAD');
					}
				}, true);
			} else {
				var pageIndex = 1;
				var indexOfReply = (g_oBlogData.data && g_oBlogData.data.indexofreply) ? g_oBlogData.data.indexofreply : null;
				if (indexOfReply) {
					pageIndex = Math.ceil(indexOfReply / CONTENT_COMMENT_NUM);
				}
				window.jumpCommentFloor = indexOfReply;
				CommentManager.showCommentPage(pageIndex);
			}
			this.updateCommentPagination();
			this.checkCommentSetting();
			this.loadExternalJS();
			PS.fireEvent("CommentContainerRendered");
			try {
				this.showFlashWarnTip();
			} catch (e) {}
		},
		showCommentList: function(listInfo) {
			if (!listInfo || listInfo.length == 0) {
				$("commentListDiv").innerHTML = "";
				$("commentDiv").style.display = "none";
				$("noCommentTip").style.display = "";
				$("switchSigHref").style.display = "none";
				if (BLOG_INFO.isPrivate) {
					QZFL.css.addClassName($("commentListContainer"), "none");
				}!QZBlog.Logic.isSeoPage && QZBlog.Util.Statistic.addSpeedPoint(5);
				return;
			}
			var arrCommentHTML = [];
			var floornum = (BLOG_INFO.getCurCommentPage() - 1) * CONTENT_COMMENT_NUM + 1;
			for (var index = 0; index < listInfo.length; ++index) {
				var info = listInfo[index];
				if (info) {
					info.setFloorNum(floornum++);
					var data = info.toJsonObject();
					this._procCommentInfo(info, data);
					arrCommentHTML.push(doFill(COMMENT_LIST_TPL, {
						"data": data
					}));
				}
			}
			$("commentListDiv").innerHTML = arrCommentHTML.join("");
			for (var index = 0; index < listInfo.length; ++index) {
				var info = listInfo[index];
				if (info) {
					var data = info.toJsonObject();
					this.showMixedReplyArea(info.getCommentID(), info.getReplyInfo(), data.replyeffect, info);
				}
			}!QZBlog.Logic.isSeoPage && QZBlog.Util.Statistic.addSpeedPoint(5);
			if (!IS_SPECIAL_BLOG) {
				this.renderPortrait(listInfo);
			}
			$("commentDiv").style.display = "";
			$("noCommentTip").style.display = "none";
			if (!QZBlog.Logic.isInPengyou && !IS_FAMOUS && !IS_BIZ && !IS_INTERACTIVE) {
				$("switchSigHref").style.display = "";
			}
			if (IS_RECOMMEND) {
				var avas = $e('#commentListDiv .info_guest p.avatar').elements;
				for (var i = 0; i < avas.length; i++) {
					avas[i].style.display = 'none';
				}
				var _nicks = $e('#commentListDiv .main span.userinfo').elements;
				for (var i = 0; i < _nicks.length; i++) {
					_nicks[i].style.top = '0';
				}
				var _signs = $e('#commentListDiv .main div.signature').elements;
				for (var i = 0; i < _signs.length; i++) {
					_signs[i].style.display = 'none';
				}
			}
			if (IS_FAMOUS) {
				if ( !! $("batchDelComHref") && $("batchDelComHref").style.display == "none") {
					CommentManager.showCommentCheckBoxs(true, $("batchSelAllInput").checked);
				}
				if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
					$("famousOperArea").style.display = "";
				}
			}
			PS.refreshAreaRemarkName($("commentListDiv"));
			if (!IS_RECOMMEND) {
				PS.fireEvent("onCommentNameCard");
			}
			if (window.jumpCommentFloor) {
				setTimeout(function() {
					QZBlog.Util.scrollToElement($("singleCommentDiv" + window.jumpCommentFloor));
					window.jumpCommentFloor = 0;
				}, QZBlog.Util.MSG_LIFTTIME.HIGH);
			}
		},
		showMixedReplyArea: function(commentID, info, effect, commentInfo) {
			var _this = this;
			if (!window.F4A || !window.F4A.controls || !F4A.controls.User) {
				setTimeout(QZONE.event.bind(this, this.showMixedReplyArea, commentID, info, effect, commentInfo), 100);
				return;
			}
			var _decodePengyouUin = function(str) {
				if (!/^d+$/.test(str) && str == QZBlog.Logic.SpaceHostInfo.getLoginUin()) {
					return QZBlog.Util.getPengyouDecodeUin();
				}
				return str;
			};
			var _protectMentionStr = function(str) {
				var s = str.replace(/(@\{uin:[^\}]*,\s*nick:)([^\}]*?)(,|})/g, function($0, $1, $2, $3) {
					return $1 + $2.toInnerHTML() + $3;
				});
				return s;
			};
			var _removeSelfAutoMention = function(authorUin, str, isPengyouReply) {
				var s = str.replace(/@\{uin:([^\},]*).*?,auto:([^\}]*)\}/ig, function($0, $1) {
					return _decodePengyouUin($1) == _decodePengyouUin(authorUin) ? '' : $0;
				});
				return s;
			};
			if (commentInfo) {
				var replyInfos = commentInfo.getReplyInfo();
				for (var i = 0; i < replyInfos.length; i++) {
					replyInfos[i].content = _protectMentionStr(replyInfos[i].content);
					replyInfos[i].content = _removeSelfAutoMention(replyInfos[i].poster.id, replyInfos[i].content);
				}
			}
			window.Control = F4A.controls.Base;
			if (!this.SensibleEditor) {
				var SensibleEditor = this.SensibleEditor = F4A.controls.SensibleEditor;
				this.MentionableEditor = SensibleEditor.derive(new function() {
					this.constructor = function() {
						if (SensibleEditor.apply(this, arguments)) {
							this.setResponsorLoaders({
								'@': SensibleEditor.friendSelectorLoader
							});
						}
					};
				});
			}
			var config = {
				id: "commentModule_" + commentID,
				emoticonSupported: true,
				showRepliesByDefault: false,
				CommentTextBox: this.MentionableEditor,
				ReplyTextBox: this.MentionableEditor,
				hideReplyAvatar: false,
				defaultPageNum: 1,
				maxCommentLength: 500,
				hideAvatar: IS_SPECIAL_BLOG
			};
			var commentModule = new window.F4A.controls.CommentModule(config);
			var able_comment = QZBlog.Logic.SpaceHostInfo.isOwnerMode() || commentInfo.getIsMyReply() || !IS_SPECIAL_BLOG && !BLOG_INFO.isPrivate;
			if (QZBlog.Logic.isInPengyou || (effect & (1 << 19))) {}
			commentModule.isAbleToComment = function() {
				return able_comment;
			}
			commentModule.loadComments = function(callbacks, pageNum) {
				var arrReply = [];
				for (var innerIndex = 0; innerIndex < info.length; ++innerIndex) {
					var item = info[innerIndex];
					item.uin = item.poster.id;
					item.nick = item.poster.name;
					item.postTime = item.postTime || item.time;
					var _py = /\D/g.test(item.uin);
					item.platform = _py ? 2 : 1;
					item.link = _py ? 'http://xiaoyou.qq.com/index.php?mod=profile&u=' + item.uin : 'http://user.qzone.qq.com/' + item.uin;
					item.nick = item.nick || item.uin + '';
					var user = new F4A.controls.User({
						"uin": item["uin"],
						"link": item.link,
						"nickname": item.nick.toRealStr(),
						"platform": item.platform
					});
					if (item.uin == QZBlog.Logic.SpaceHostInfo.getUin()) {
						user.setNickname('主人');
					}
					if (item.uin == QZBlog.Logic.SpaceHostInfo.getLoginUin()) {
						user.setNickname('我');
					}
					var reply = new F4A.controls.Reply({
						id: commentID + "_" + innerIndex,
						content: item["content"].toRealStr(),
						poster: user,
						orginalTime: item.postTime,
						postTime: QZBlog.Util.long2DateTime(item.postTime)
					})
					arrReply.push(reply);
				}
				this.answerid = commentID;
				callbacks.onSuccess(arrReply);
			};
			commentModule.isAbleToReply = function(comment) {
				return false;
			};
			commentModule.isAbleToRemove = function(comment) {
				if (BLOG_INFO.isPrivate) {
					return false;
				}
				var uin = comment.getPoster().getUin();
				if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
					return true;
				}
				return false;
			};
			commentModule.onError = function(code, data) {
				switch (code) {
					case 'comment-too-long':
					case 'reply-too-long':
						QZBlog.Util.showMsgbox('回复内容过长', 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
						break;
					case 'comment-no-content':
					case 'reply-no-content':
						QZBlog.Util.showMsgbox('请输入回复内容', 2, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
						break;
				}
			};
			commentModule.postComment = function(content, callbacks) {
				CommentManager.submitReply(commentModule.answerid, content, callbacks);
			};
			commentModule.removeComment = function(comment, callbacks) {
				CommentManager.removeCommentReply(this.answerid, comment.getPoster().getUin(), comment.getOrginalTime());
			};
			$("multiReplyDiv" + commentID).innerHTML = '';
			commentModule.init($("multiReplyDiv" + commentID));
			$("multiReplyDiv" + commentID).style.display = (info.length > 0 ? "" : "none");
			var bAllowReplyFlag = false;
			if (!QZBlog.Logic.SpaceHostInfo.isOwnerMode() && !(effect & (1 << 19)) && !(effect & (1 << 29)) && info.length > 0 && !IS_FAMOUS && !IS_BIZ) {
				bAllowReplyFlag = true;
			} else if (QZBlog.Logic.SpaceHostInfo.isOwnerMode() && info.length > 0) {
				bAllowReplyFlag = true;
			}
			if (BLOG_INFO.isPrivate) {
				bAllowReplyFlag = false;
				setTimeout(function() {
					$e('.mod_commnets_poster', $("multiReplyDiv" + commentID)).hide();
				}, 0);
			}
		},
		renderPortrait: function(listInfo) {
			var uinAry = [];
			var schoolUins = [];
			for (var index = 0; index < listInfo.length; ++index) {
				var info = listInfo[index];
				var userType = listInfo[index].getUserInfo().getUserType();
				if (info) {
					if (userType != 1) {
						var uin = parseInt(info.getUserInfo().getUin());
						var flag = false;
						for (var i = 0, j = uinAry.length; i < j; i++) {
							if (uin == uinAry[i]) {
								flag = true;
								break;
							}
						}
						if (!flag && uin) {
							uinAry.push(info.getUserInfo().getUin());
						}
					} else if (info.getUserInfo().getUin()) {
						schoolUins.push(info.getUserInfo().getUin());
					}
					var replyInfo = info.getReplyInfo();
					for (var innerIndex = 0; innerIndex < replyInfo.length; ++innerIndex) {
						if (BLOG_INFO.isPrivate) {
							replyInfo[innerIndex].poster = {};
							replyInfo[innerIndex].poster.id = replyInfo[innerIndex].uin;
						}
						var reg = /[A-Z|a-z]/g;
						var match = reg.exec(replyInfo[innerIndex].poster.id);
						if (match) {
							schoolUins.push(replyInfo[innerIndex].poster.id);
						} else {
							var uin = parseInt(replyInfo[innerIndex].poster.id)
							var flag = false;
							for (var i = 0, j = uinAry.length; i < j; i++) {
								if (uin == uinAry[i]) {
									flag = true;
									break;
								}
							}
							if (!flag && uin) {
								uinAry.push(parseInt(replyInfo[innerIndex].poster.id));
							}
						}
					}
				}
			}
			var param = {
				needScore: 1,
				size: 100
			};
			if (!QZBlog.Logic.isInPengyou) {
				QZONE.FP.getPortraitList(uinAry, QZFL.object.bind(this, this._showUserPortrait, listInfo), param);
			} else {
				this._showUserPortrait(listInfo, {});
			}
			this._getCampusPortraitList(listInfo, schoolUins);
		},
		updateCommentPagination: function() {
			var curPage = BLOG_INFO.getCurCommentPage();
			var totalPage = BLOG_INFO.getCommentPageLength();
			var totalCnt = BLOG_INFO.getCommentCnt();
			if (totalCnt == 0) {
				$("commentPageIndexArea").innerHTML = "";
				return;
			}
			$("commentCnt").innerHTML = "评论(" + totalCnt + ")";
			var containerArr = [];
			containerArr.push($("commentPageIndexArea"));
			QZBlog.Util.PageIndexManager.init(containerArr, totalPage, curPage, function(pageIndex) {
				CommentManager.showCommentPage(pageIndex);
			});
		},
		checkCommentSetting: function() {
			var nLoginUin = QZBlog.Logic.SpaceHostInfo.getLoginUin();
			if (!parent.g_oBlogSettingInfoMgr.isSettingInfoReady(nLoginUin)) {
				QZBlog.Util.getSubLoginBitMapFlag(function(data, value) {
					if (!data) return;
					parent.g_oBlogSettingInfoMgr.createSettingInfo(nLoginUin, data);
					CommentManager._updateSettingText();
				}, 1);
			} else {
				CommentManager._updateSettingText();
			}
		},
		loadExternalJS: function() {
			this._loadCommentModuleJS();
		},
		showFlashWarnTip: function() {
			var _sdb = QZONE.FP._t.QZONE.FP.noShareDb;
			if ((_sdb && _sdb.get('QZONE_BLOG_CONTENT_HIDE_FLASH_WARN_TIP')) || BLOG_INFO.getEffectBit(52) || $('cheatHintAreaA') || (window['g_qSafeLevel'] != 2)) {
				return;
			}
			var tip = (['<div class="hint"><strong class="icon_hint"><span>提示</span></strong>', '<span>最近有恶意用户借flash盗取他人QQ号。为保障您的利益，日志模块将进行全面升级优化，暂不支持展示没有审核的flash链接。', '<a href="http://service.qq.com/announce/54840.html" target="_blank">点击此处查看详情</a>', '</span>', '<a href="javascript:;" title="关闭提示" class="hint_close"></a>', '</div>']).join('');
			var div = document.createElement('div');
			div.innerHTML = tip;
			$e(div).insertBefore($('app_mod'));
			var a = $e('a', div).elements[1];
			QZFL.event.addEvent(a, 'click', function() {
				div.style.display = 'none';
				_sdb.set('QZONE_BLOG_CONTENT_HIDE_FLASH_WARN_TIP', 1);
			});
		},
		_procCommentInfo: function(info, data) {
			if (!info || !data) {
				return;
			}
			if (!BLOG_INFO.isPrivate) {
				data.replynick = data.replynick.toInnerHTML();
				data.nickname = data.nickname.toInnerHTML();
			}
			data.nickname = data.nickname.replace('$', '&#36;');
			data.replynick = data.replynick.replace('$', '&#36;');
			data.replyautograph = data.replyautograph || '';
			data.rainbowClass = "none";
			data.angelClass = "none";
			data.commentTime = QZBlog.Util.long2LongTime(data.replytime);
			if (data.emoji && QZONE.FP.getEmojiHTML) {
				data.emojiHTML = '<a href="http://rc.qzone.qq.com/profile/qzbase" target="' + (QZONE.FP.getQzoneConfig('isOwner') ? '_top' : '_blank') + '" class="qz_emoji" title="体验个性昵称">' + (QZBlog.Logic.isInPengyou ? '' : QZONE.FP.getEmojiHTML(data.emoji)) + '</a>';
			} else {
				data.emojiHTML = '';
			}
			if (data.platform == 1 && ((data.replyeffect & 1) == 0)) {
				var isVipUser = this._isVipUser(data.replybmp);
				var isYearVipUser = this._isUserVIPExpress(data.replybmp);
				var vipLevel = this._getUserVIPLevel(data.replybmp);
				var isYearVipExpire = this._isYearVipExpire(data.replybmp);
				data.vipHTML = QZONE.FP.getVipHTML({
					'lv': vipLevel,
					'isVip': isVipUser,
					'isYearVip': isYearVipUser,
					'isYearExpire': isYearVipExpire
				}, 'l', {
					withYear: 1,
					className: isYearVipUser ? 'year_vip' : 'normal_vip'
				});
			} else {
				data.vipHTML = '';
			}
			var replacew = "face egg quote qqshow" + (((IS_FAMOUS || IS_BIZ || IS_INTERACTIVE) && !(info.getUserInfo().getUin() == QZBlog.Logic.SpaceHostInfo.getUin())) ? " imageHide" : " anchor image email glow_limit font");
			var str = data.replycontent.replace('$', '&#36;');
			str = ubbReplace(str, replacew, null, null, IMGCACHE_DOMAIN);
			data.replyContent = QZBlog.Util.parseMentionStr(str);
			var _getReplySource = function(type) {
				if (QZBlog.Logic.isInPengyou && type == 1) {
					return '该评论来自QQ空间 <a href="http://qzone.qq.com" target="_blank">qzone.qq.com</a>';
				} else if (type == 2) {
					return '该评论来自朋友网  <a href="http://www.pengyou.com" target="_blank">www.pengyou.com</a>';
				}
				return '';
			};
			var isMobile = this._getReplyEffectBit(info, 1024) || this._getReplyEffectBit(info, 32768);
			if (data.platform == 2) {
				data.replyArea = '<a target="_blank" href="http://xiaoyou.qq.com/index.php?mod=profile&u=' + info.getUserInfo().getUin() + '" class="c_tx">' + data.replynick + '</a>';
				data.replyautograph = !isMobile ? _getReplySource(2) : '';
				data.hasReplyautograph = !QZBlog.Logic.isInPengyou;
				data.commentOPSpan = this._getCommentOperAreaHTML(info);
				data.namecard = "";
			} else {
				data.commentOPSpan = this._getCommentOperAreaHTML(info);
				this._parseQZoneCommentEffect(info, data);
				if (!isMobile) {
					data.replyautograph += _getReplySource(1);
				}
				data.namecard = "nameCard_" + data.replyuin;
			}
			data.commentTime = "评论时间: " + data.commentTime;
			if (data.platform == 2) {
				data.famousReplyHref = "http://xiaoyou.qq.com/index.php?mod=profile&u=" + info.getUserInfo().getUin();
			} else {
				data.famousReplyHref = "http://user.qzone.qq.com/" + info.getUserInfo().getUin();
			}
			if (IS_SPECIAL_BLOG) {
				data.isfamousblog = "no_avatar";
			}
			if ($("switchSigHref") && $("switchSigHref").innerHTML == "隐藏评论签名") {
				$("switchSigHref").innerHTML = "显示评论签名";
			}
			data.signatureClass = ((($("switchSigHref") && $("switchSigHref").innerHTML == "显示评论签名") || !data.hasReplyautograph) ? "none" : "");
			if (info.getGiftInfo()) {
				data.giftID = info.getGiftInfo().getID();
				data.giftName = info.getGiftInfo().getName();
				data.giftType = info.getGiftInfo().getType();
				data.giftUrl = info.getGiftInfo().getURL();
				data.giftMallList = info.getGiftInfo().getMallList();
				data.giftItemID = info.getGiftInfo().getItemID();
				data.giftImg = '<img src="' + data.giftUrl + '" style="width:65px;height:65px;" alt="' + data.giftName + '" />';
				if (QZONE.userAgent.ie == 6) {
					data.giftImg = '<img src="/ac/b.gif" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src=' + data.giftUrl + ', sizingmethod=scale);width:65px;height:65px;" alt="' + data.giftName + '" />';
				}
			}
		},
		_getCommentOperAreaHTML: function(info) {
			if (!info) {
				return "";
			}
			var arrHTML = [];
			if (QZBlog.Logic.SpaceHostInfo.isOwnerMode()) {
				if (!BLOG_INFO.isPrivate) {
					arrHTML.push(this._getCommentOperBtnHTML(info, 2));
					if (info.getQuoteFlag()) {
						arrHTML.push(this._getCommentOperBtnHTML(info, 3));
					}
				}
				arrHTML.push(this._getCommentOperBtnHTML(info, 5));
				if (info.getUserInfo().getUin() != QZBlog.Logic.SpaceHostInfo.getUin() && !info.getUserInfo().getUserType()) {
					if (!QZBlog.Logic.isInPengyou) {
						arrHTML.push(this._getCommentOperBtnHTML(info, 4));
					}
				}
				if (info.getEffect() & 1) {
					arrHTML.push(this._getCommentOperBtnHTML(info, 1));
				}
				if (!IS_FAMOUS && !IS_BIZ && !IS_INTERACTIVE && !(info.getEffect() & (1 << 19)) && !(info.getEffect() & (1 << 29))) {}
				if (info.getUserInfo().getUin() != QZBlog.Logic.SpaceHostInfo.getLoginUin() && !info.getUserInfo().getUserType() && !QZBlog.Logic.isInPengyou) {
					arrHTML.push(this._getCommentOperBtnHTML(info, 7));
				}
			} else {
				if (IS_SPECIAL_BLOG) {
					var specialBlogReplyFlag = (info.getEffect() & 0x20) != 0 && info.getIsMyReply();
					if (specialBlogReplyFlag) {
						arrHTML.push(this._getCommentOperBtnHTML(info, 2));
					}
				} else {
					arrHTML.push(this._getCommentOperBtnHTML(info, 2));
				}
				if (info.getQuoteFlag()) {
					arrHTML.push(this._getCommentOperBtnHTML(info, 3));
				}
				if (info.getUserInfo().getUin() != QZBlog.Logic.SpaceHostInfo.getUin()) {
					if (!info.getUserInfo().getUserType() && !QZBlog.Logic.isInPengyou) {
						arrHTML.push((info.getQuoteFlag() ? "  " : "") + this._getCommentOperBtnHTML(info, 4));
					}
				}
			}
			var strHTML = "";
			for (var index = 0; index < arrHTML.length; ++index) {
				if (index == 0) {
					strHTML += '<p class="op_normal">' + arrHTML[index];
					if (arrHTML.length == 1) {
						strHTML += "</p>";
						break;
					}
					strHTML += '<a href="javascript:;" onmouseout="CommentManager.toggleList(' + info.getCommentID() + ', true);" onmouseover="CommentManager.toggleList(' + info.getCommentID() + ', false);" id="commentMoreOP' + info.getCommentID() + '" title="更多" class="c_tx arr_wrap"><span class="mod_arr"></span></a>';
					strHTML += '<ul class="bg bor2" onmouseout="CommentManager.toggleList(' + info.getCommentID() + ', true);" onmouseover="CommentManager.toggleList(' + info.getCommentID() + ', false);" id="commentMoreOPList' + info.getCommentID() + '" style="width:75px">';
					continue;
				}
				strHTML += "<li onmouseover=\"this.className='bg2';\" onmouseout=\"this.className='';\">" + arrHTML[index] + "</li>";
			}
			if (arrHTML.length > 1) {
				strHTML += "</ul>";
			}
			if (QZBlog.Logic.SpaceHostInfo.isOwnerMode() && (IS_FAMOUS || IS_BIZ || IS_INTERACTIVE)) {
				strHTML += '<p class="op_delete">' + this._getCommentOperBtnHTML(info, 5) + '</p>';
			}
			if (QZBlog.Logic.SpaceHostInfo.isOwnerMode() && BLOG_INFO.isPrivate) {
				strHTML = '<p class="op_delete">' + this._getCommentOperBtnHTML(info, 5) + '</p>';
			}
			return strHTML;
		},
		_getCommentOperBtnHTML: function(info, type) {
			switch (type) {
				case 1:
					return '<a href="javascript:;" class="c_tx" onclick="CommentManager.mirrorComment(\'' + info.getCommentID() + '\', ' +
						info.getCommentArch() + ');return false;" title="您要拥有照妖镜道具才可以使用照妖镜，照妖镜道具请在藏宝阁兑换">照妖镜</a>';
				case 2:
					return '<a href="javascript:;" class="c_tx qzCommentOption" onclick="CommentManager.showCommentEditor(\'' + info.getCommentID() + '\');return false;" title="回复该评论">回复</a>';
				case 3:
					return '<a href="javascript:;" onclick="CommentManager.quoteCommentContent(\'' + info.getCommentID() + '\');return false;" class="c_tx qzCommentOption" title="引用该评论">引用</a>';
				case 4:
					return '<a href="javascript:;" class="c_tx" onclick="CommentManager.reportComment(\'' + info.getUserInfo().getUin() + '\', ' +
						info.getCommentID() + ', ' + info.getCommentArch() + ');return false;" title="举报该评论">举报</a>';
				case 5:
					return '<a href="javascript:;" class="c_tx" onclick="CommentManager.delComment(\'' + info.getUserInfo().getUin() + '\', \'' +
						info.getCommentID() + '\', ' + info.getCommentArch() + ');return false;" title="删除该评论">删除</a>';
				case 6:
					return '<a href="javascript:;" class="c_tx" onclick="QZONE.FP.sendMessage(\'' + info.getUserInfo().getUin() + '\',{ui:true});return false;" title="发送短消息">短消息</a>';
				case 7:
					return '<a href="javascript:;" class="c_tx" onclick="CommentManager.moveUinBlack(\'' + info.getUserInfo().getUin() + '\',\'' + escape(info.getUserInfo().getNickname().replace('$', '&#36;')) + '\');return false;" title="加黑禁言">加黑禁言</a>';
				default:
					return "";
			}
		},
		_parseQZoneCommentEffect: function(info, data) {
			var efl = QZBlog.Util.effectSplit(info.getEffect());
			var tmp;
			if (!info.getUserInfo().getUserType()) {
				data.replyArea = '<span><a link="nameCard_' + info.getUserInfo().getUin() + '" href="' +
					QZBlog.Util.getSpaceUrl(info.getUserInfo().getUin()) + '" target="_blank" onclick="QZBlog.Util.Statistic.sendPV(\'guestname_comment\', \'rizhi.qzone.qq.com\');" class="q_namecard c_tx">' +
					info.getUserInfo().getNickname().replace('$', '&#36;') + '</a></span>';
			}
			for (var i = 0; i < efl.length; ++i) {
				switch (parseInt(efl[i], 10)) {
					case 1:
						data.replyArea = '<span title="此用户使用隐身草,只有您使用照妖镜后,才可以点击这里进入其空间">匿名</span>';
						data.replyautograph = "";
						data.operClass = "display:none";
						break;
					case 2:
						if (QZONE.userAgent.ie) {
							QZONE.dom.createElementIn("div", document.body, false, {
								id: "rainbowDiv",
								"class": "bg3 none"
							});
							var rainbowColor = $("rainbowDiv").currentStyle.backgroundColor;
							data.rainbowFilter = 'filter:progid:DXImageTransform.Microsoft.MaskFilter(Color=' + rainbowColor + ');';
							data.rainbowName = "rainbow ie_show";
						}
						data.rainbowClass = "";
						break;
					case 4:
						data.angelClass = "";
						break;
					case 8:
						data.replyContent = '<div style="text-align:center;font-color:#EE1D24">评论内容已被管理员屏蔽</div>';
						info.setQuoteFlag(false);
						break;
					case 16:
						data.replyArea = '<span title="此用户使用匿名评论">' + data.replynick.replace('$', '&#36;') + '</span>';
						break;
					case 1024:
						data.replyContent += '<br /><br />-----------------------------------<br />该评论来自<a style="color:blue" target="_blank" href="http://z.qzone.com/?from=sjpl"><span class="hl">手机Qzone</span></a>';
						break;
					case 32768:
						data.replyContent += '<br /><br />-----------------------------------<br />该评论来自 <b>移动Qzone</b> 。<b>移动Qzone</b>，随时随地用手机看日志评论，轻松回复！<br /> <a style="color:blue" target="_blank" href="http://m-qzone.qq.com/?from=qzoneJD"><span class="mode_title">详情请进&gt;&gt;</span></a>';
						break;
				}
			}
		},
		_getReplyEffectBit: function(info, bit) {
			var efl = QZBlog.Util.effectSplit(info.getEffect());
			for (var i = 0; i < efl.length; ++i) {
				if (parseInt(efl[i], 10) == bit) {
					return true;
				}
			}
			return false;
		},
		_getCampusPortraitList: function(listInfo, schoolUins) {
			var rawData = {};
			for (var i = 0, j = schoolUins.length; i < j; i++) {
				rawData[schoolUins[i]] = {
					"midurl": "http://py.qlogo.cn/friend/" + schoolUins[i] + "/audited/100"
				};
			}
			this._showUserPortrait(listInfo, rawData);
		},
		_showUserPortrait: function(listInfo, rawData) {
			for (var i = 0; i < listInfo.length; i++) {
				switch (listInfo[i].getUserInfo().getUserType()) {
					case 0:
						var portraitInfo = rawData[listInfo[i].getUserInfo().getUin()];
						if (listInfo[i].getUserInfo().getUserType() != 0) {}
						var imgEle = $("imgUrl" + listInfo[i].getFloorNum());
						if ( !! imgEle) {
							var uin = parseInt(listInfo[i].getUserInfo().getUin());
							var portraitSrc = QZBlog.Util.PortraitManager.getPortraitUrl(uin, 100);
							var src = (( !! portraitInfo && portraitInfo[0] == "/qzone_v4/client/userinfo_icon/default.gif" || !uin) ? parent.DEFAULT_USER_PORTRAIT : portraitSrc);
							imgEle.onload = function() {
								imgEle.onload = null;
								PS.resizeImg(imgEle);
							};
							imgEle.src = ([src, ((/\?/).test(src) ? "&" : "?"), "sds=", QZBlog.Util.PortraitManager.portraitSeed]).join("");
						}
						var gradeEle = $("flowerDiv" + listInfo[i].getFloorNum());
						if ( !! gradeEle && !! portraitInfo) {
							var score = this._getUserGrade(portraitInfo[1]);
							gradeEle.innerHTML = QZONE.FP.getQZLevelIconHTML ? QZONE.FP.getQZLevelIconHTML(portraitInfo[1], (portraitInfo[1] ? 0 : 1), 0, {
								clickable: QZBlog.Logic.SpaceHostInfo.isOwnerMode()
							}) : this._getUserGradeHTML(score, false);
							gradeEle.onmouseover = (function(ele, score, grade) {
								return function() {
									CommentManager.showUserGradeTips(ele, score, grade);
								};
							})(gradeEle, score, portraitInfo[1]);
							gradeEle.onmouseout = CommentManager.hideUserTips;
						}
						break;
					case 1:
						var portraitInfo = rawData[listInfo[i].getUserInfo().getUin()];
						if (!portraitInfo) {
							continue;
						}
						var strHref = "http://xiaoyou.qq.com/index.php?mod=profile&u=" + listInfo[i].getUserInfo().getUin();
						var imgEle = $("imgUrl" + listInfo[i].getFloorNum());
						if ( !! imgEle) {
							imgEle.onload = function() {
								imgEle.onload = null;
								PS.resizeImg(imgEle);
							};
							imgEle.src = portraitInfo["midurl"];
							imgEle.onmouseout = CommentManager.hideUserTips;
							imgEle.parentNode.href = strHref;
						}
						var gradeEle = $("flowerDiv" + listInfo[i].getFloorNum());
						if ( !! gradeEle) {
							gradeEle.style.display = "none";
						}
						this._procCommentModuleCampusPlus(listInfo[i], portraitInfo, strHref);
						break;
					case 2:
						if (listInfo[i].getUserInfo().getUserType() != 2) {
							continue;
						}
						var strHref = "http://profile.bai.qq.com/index.php?mod=profile&u=" + listInfo[i].getUserInfo().getUin();
						var imgEle = $("imgUrl" + listInfo[i].getFloorNum());
						if ( !! imgEle) {
							imgEle.link = "";
							imgEle.onload = function() {
								imgEle.onload = null;
								PS.resizeImg(imgEle);
							};
							QZBlog.Util.ImageManager.loadObjectImage("http://work.store.qq.com/work/" + listInfo[i].getUinPic() + "/100", imgEle);
							imgEle.onmouseout = CommentManager.hideUserTips;
							imgEle.parentNode.href = strHref;
							imgEle.parentNode.link = "";
						}
						var gradeEle = $("flowerDiv" + listInfo[i].getFloorNum());
						if ( !! gradeEle) {
							gradeEle.style.display = "none";
						}
						break;
				}
			}
		},
		_isVipUser: function(userBitmap) {
			return this._getOneBit(userBitmap, 27);
		},
		_isUserVIPExpress: function(userBitmap) {
			return this._getOneBit(userBitmap, 17);
		},
		_isYearVipExpire: function(userBitmap) {
			return this._hadOpenYearVip(userBitmap) && !this._isUserVIPExpress(userBitmap);
		},
		_hadOpenYearVip: function(userBitmap) {
			return this._getOneBit(userBitmap, 39);
		},
		_getUserVIPLevel: function(userBitmap) {
			return this._getBitMap(userBitmap, 18, 4);
		},
		_getBitMap: function(sBitmap, bit, length) {
			var type = typeof(bit),
				k, rslt = {}, _l;
			if (type == 'object') {
				for (k in bit) {
					rslt[k] = this._getOneBit(sBitmap, bit[k]);
				}
				return rslt;
			}
			if (type == 'number') {
				length = length || 1;
				rslt = '';
				for (k = bit, _l = bit + length; k < _l; k++) {
					rslt = this._getOneBit(sBitmap, k) + rslt;
				}
				return parseInt(rslt, 2);
			}
			return INVALID_PARAM;
		},
		_getOneBit: function(sBitmap, bit) {
			return parseInt(sBitmap.charAt(15 - Math.floor((bit - 1) / 4)), 16) >> ((bit - 1) % 4) & 1;
		},
		_getUserGrade: function(score) {
			var t = [0, 5, 10, 15, 20, 30, 40, 50, 60, 75, 90];
			if (score < 90) {
				for (var i = t.length - 2; i >= 0; --i) {
					if (score - t[i] >= 0) {
						return i;
					}
				}
			} else {
				return Math.floor(Math.sqrt(score / 10)) + 7;
			}
		},
		_getUserGradeHTML: function(score) {
			if (score == 0) {
				return '<span class="icon icon_lv0"><span>0</span></span>';
			}
			var t;
			var tmp;
			var result = [];
			tmp = (score.toString(4)).split("");
			if (tmp.length > 3) {
				t = tmp.shift();
				tmp[0] = parseInt(tmp[0], 10) + parseInt(t, 10) * 4;
			}
			for (var i = 0; i < tmp.length; ++i) {
				t = parseInt(tmp[i], 10);
				if (t == 0) {
					continue;
				}
				result.push((new Array(t + 1)).join('<span class="icon icon_lv' + (4 - (i + (4 - tmp.length))) + '"><span>' + (4 - (i + (4 - tmp.length))) + '</span></span>'));
			}
			return result.join(" ");
		},
		_procCommentModuleCampusPlus: function(info, portraitInfo, strHref) {
			if (!window.F4A || !window.F4A.controls) {
				setTimeout(QZONE.event.bind(this, this._procCommentModuleCampusPlus, info, portraitInfo, strHref), 500);
				return;
			}
			var arr = document.getElementsByName("portraitImg_" + info.getUserInfo().getUin());
			for (var index = 0; index < arr.length; ++index) {
				QZBlog.Util.ImageManager.loadObjectImage(portraitInfo["midurl"], arr[index]);
			}
			arr = document.getElementsByName("specialHref_" + info.getUserInfo().getUin());
			for (var index = 0; index < arr.length; ++index) {
				arr[index].link = "";
				arr[index].href = strHref;
			}
		},
		_showSingleCommentInfo: function(info, comData) {
			this._procCommentInfo(info, comData);
			var commentDiv = $("singleCommentDiv" + info.getFloorNum());
			if (!commentDiv) {
				return;
			}
			commentDiv.outerHTML = doFill(COMMENT_LIST_TPL, {
				"data": comData
			});
			this.showMixedReplyArea(info.getCommentID(), info.getReplyInfo(), comData.replyeffect, info);
			PS.refreshAreaRemarkName($("commentListDiv"));
			try {
				QZONE.namecard.init(commentDiv);
			} catch (err) {}
			var tmpList = new Array();
			tmpList.push(info);
			this.renderPortrait(tmpList);
		},
		_loadCommentModuleJS: function() {
			QZFL.imports('/qzone/app/f4a/lite/lite_1.3.js', function() {
				QZFL.imports(['/qzone/app/controls/commentModule/commentModule_1.3.js', '/qzone/app/controls/sensibleEditor/sensibleEditor_2.1.js'], function() {
					F4A.controls.jsMVC = new function() {
						var $u = new function() {
								this.capitalize = function(string) {
									return [string.charAt(0).toUpperCase(), string.substring(1, string.length)].join('');
								};
							};
						this.Model = function() {};
						this.Model.prototype = new function() {
							this.genProperties = function() {
								var model = this;
								for (var i = arguments.length - 1; i >= 0; i--) {
									var property = arguments[i];
									var capitalized = $u.capitalize(property);
									new function() {
										var filedName = ['_', property].join('');
										var getterName = ['get', capitalized].join('');
										var setterName = ['set', capitalized].join('');
										model[getterName] = function() {
											return this[filedName];
										};
										model[setterName] = function(value) {
											this[filedName] = value;
										};
									}
								}
							};
							this.setProperties = function(values) {
								if (values) {
									for (var i in values) {
										var setMethod = this['set' + $u.capitalize(i)];
										if (setMethod) {
											var value = values[i];
											if (value && value.modelName) {
												value = new(eval(value.modelName))(value);
											}
											setMethod.call(this, value);
										}
									}
								}
							};
						};
					};
					F4A.controls.Reply = function(values) {
						this.setProperties(values);
					};
					F4A.controls.Reply.prototype = new F4A.controls.jsMVC.Model();
					F4A.controls.Reply.prototype.genProperties('id', 'content', 'poster', 'postTime', 'orginalTime');
					F4A.controls.User = function(values) {
						this.setProperties(values);
					};
					F4A.controls.User.prototype = new F4A.controls.jsMVC.Model();
					F4A.controls.User.prototype.genProperties('uin', 'nickname', 'avatarUrl', 'platform', 'link');
					F4A.controls.User.prototype.getAvatarUrl = function() {
						if (this._avatarUrl) {
							return this._avatarUrl;
						}
						var uin = this.getUin();
						switch (this.getPlatform()) {
							case 2:
								return ['http://py.qlogo.cn/friend/', uin, '/audited/50'].join('');
							case 1:
							default:
								return ['http://qlogo4.store.qq.com/qzone/', uin, '/', uin, '/50'].join('');
						}
					};
					F4A.controls.User.prototype.setAvatarUrl = function(avatarUrl) {
						return this._avatarUrl = avatarUrl;
					};
					window._originalConfirm = window.confirm;
					window.confirm = function(str) {
						if (str == "确定要删除该评论么？") {
							return window._originalConfirm("确定要删除该回复么？");
						}
						if (str == "您确认要放弃正在编辑的评论吗？") {
							return window._originalConfirm("您确认要放弃正在编辑的回复吗？");
						}
						return window._originalConfirm(str);
					}
				});
			});
		}
	};
	PS.triggerEvent('onStart', function() {
		CommentScheduler.start();
	});
	window.CommentScheduler = CommentScheduler;
})(PageScheduler);﻿
(function(PS, CM) {
	var EDITOR_TPL = COMMENT_EDITOR_TPL = '<div class="qzCommentOption post_comment <%=noCommentClass%>" id="commentArea"><div class="mod_title"><h4>发表评论</h4></div><div class="<%=allowCommentClass%> post_cont" style="padding-left:0px;"><div class="hint"><img src="/ac/b.gif" alt="提示" class="icon_hint_advise" /><span>系统正在进行升级维护中,暂不支持日志评论,敬请谅解!</span></div></div><div class="<%=forbidCommentClass%> post_cont"><div class="author"><p class="avatar"><a href="javascript:;" class=""><img src="<%=commentAuthorAvatarUrl%>" id="commentAuthorImg" style="width:100px; height:100px;" /></a></p></div><div class="post"><div class="post_wrap"><textarea class="editor_textarea" id="simpleCommentEditor" title="正在加载编辑器..."></textarea><div id="commentEditorCon" class="bor3"></div><div class="post_ft"><p class="post_publish"><button type="button" class="bt_tx2" id="submitCommentBtn">发表</button><a class="c_tx notice" id="registHrefEntry" href="http://dynamic.qzone.qq.com/cgi-bin/portal/cgi_select_activity" target="_blank">马上开通空间，体验权限日志、记事本等全新日志体验！</a></p><div class="op_toolbar_cont c_tx3 none" id="moreCommentOptionDiv"><p class="mod_arrange"><label id="shareArticleContainer" for="shareArticleCheck"><input type="checkbox" id="shareArticleCheck"/>分享此文章</label></p><p class="mod_arrange"><label title="隐身草道具" for="anonymcheck"><input type="checkbox" id="anonymcheck" />匿名评论(隐身草)</label></p></div></div></div></div></div></div><style type="text/css"> #commentEditorCon {background-color:white;} div.veStatusbarContainer {display:none} div.veToolbarContainer {border-bottom:1px solid #ddd;} .editor_textarea {width:750px; height:150px; border:none; padding:5px;} #soso_exp_platform_box {margin-top:-332px}</style>';;
	var EDITOR_PLACEHOLDER = '您可以在这里发表评论';
	var MASK_EDITOR, EDITOR_CON;
	var CommentEditor = (function() {
		var editor_obj;
		var editor_obj_building = false;
		var editor_builded = false;
		var clearDefaultText = function() {
			if (EDITOR_PLACEHOLDER && QZFL.string.trim(editor_obj.getTextContent()) == EDITOR_PLACEHOLDER) {
				editor_obj.setContent({
					content: ''
				});
			}
		};
		return {
			load: function(callback, opt) {
				var _this = this;
				callback = callback || QZFL.emptyFn;
				if (editor_obj && !editor_obj_building) {
					var h = (opt ? (opt.height || 130) : 130);
					editor_obj.setHeight(h);
					callback(editor_obj);
					return;
				}
				QZFL.css.removeClassName(MASK_EDITOR, 'none');
				MASK_EDITOR.title = '正在加载编辑器...';
				QZFL.css.addClassName(EDITOR_CON, 'none');
				QZFL.imports('/qzone/veditor/ve.qzoneblogcontent.js', function() {
					if (editor_obj_building) {
						editor_obj.onInitComplete.add(function(obj) {
							callback(obj);
						});
					} else {
						editor_obj_building = true;
						editor_obj = VEditor.create({
							container: 'commentEditorCon',
							normalToolbarText: '普通模式',
							toolbarMode: 'advance',
							adapter: 'qzfl',
							width: 'auto',
							domain: QZBlog.Logic.isInPengyou ? 'pengyou.com' : 'qq.com',
							height: (opt ? (opt.height || 130) : 130),
							plugins: 'history,linetag,xpaste,qzonemention,' + (QZBlog.Logic.isInPengyou ? 'emotion' : 'sosoemotion'),
							buttons: 'emotion'
						});
						editor_obj.onClick.add(function() {
							clearDefaultText();
						});
						editor_obj.onBeforeExecCommand.add(function(cmd) {
							if (cmd == 'insertHtml') {
								clearDefaultText();
							}
						});
						editor_obj.onKeyDown.addLast(function() {
							clearDefaultText();
						});
						editor_obj.addShortcut('ctrl+enter', function() {
							CommentManager.submitComment();
						});
						editor_obj.onInitComplete.add(function(obj) {
							editor_builded = true;
							if (EDITOR_PLACEHOLDER && MASK_EDITOR.value == EDITOR_PLACEHOLDER) {
								_this.setDefaultText();
							} else {
								_this.setContent(MASK_EDITOR.value);
							}
							QZFL.css.addClassName(MASK_EDITOR, 'none');
							QZFL.css.removeClassName(EDITOR_CON, 'none');
							editor_obj_building = false;
							callback(obj);
						});
					}
				});
			},
			setDefaultText: function() {
				var s = EDITOR_PLACEHOLDER ? '<span style="font-size:12px; color:gray;">' + EDITOR_PLACEHOLDER + '</span>' : '';
				editor_obj.setContent({
					content: s,
					addHistory: false
				});
			},
			setContent: function(str) {
				editor_obj.setContent({
					content: str
				});
			},
			insertContent: function(str) {
				editor_obj.insertHtml({
					content: str
				});
			},
			getContent: function() {
				var txt = QZFL.string.trim(editor_builded ? editor_obj.getTextContent() : MASK_EDITOR.value);
				if (EDITOR_PLACEHOLDER && txt == EDITOR_PLACEHOLDER) {
					return '';
				}
				return editor_builded ? editor_obj.getContent() : MASK_EDITOR.value;
			},
			getTextContent: function(bUseUbbEmotion) {
				var html = this.getContent();
				if (bUseUbbEmotion) {
					var reg = new RegExp('');
					reg.compile('<img[^>]+em\\/e(\\d{1,3}).gif[^>]*>', 'ig');
					html = html.replace(reg, "[em]e$1[/em]");
				}
				html = html.replace(/<\w[\s\S]*?>|<\/\w+>/g, '');
				html = html.replace(/&nbsp;/gi, ' ');
				return html;
			},
			getUbbContent: function() {
				return html2Ubb(this.getContent());
			},
			clearContent: function() {
				return editor_obj && editor_obj.clearContent();
			},
			focus: function() {
				return editor_obj.focus();
			},
			_renderBase: function() {
				var html = tmpl(EDITOR_TPL, {
					noCommentClass: window.g_default_no_comment ? 'none' : '',
					allowCommentClass: window.g_NonFriendReplyFlag ? '' : 'none',
					forbidCommentClass: !window.g_NonFriendReplyFlag ? '' : 'none',
					commentAuthorAvatarUrl: QZBlog.Logic.SpaceHostInfo.isValidLoginUin() ? QZONE.FP.getPURL(QZBlog.Logic.SpaceHostInfo.getLoginUin(), 100) : DEFAULT_PORTRAIT_IMGURL
				});
				var div = document.createElement('div');
				div.innerHTML = html;
				$('commentListContainer').appendChild(div);
				CommentManager._updateSettingText();
				if (!QZBlog.Logic.isInPengyou && !QZBlog.Logic.SpaceHostInfo.isFamousUser() && !QZBlog.Logic.SpaceHostInfo.isBizUser() && !QZBlog.Logic.SpaceHostInfo.isInteractiveUser()) {
					QZFL.css.removeClassName($("moreCommentOptionDiv"), "none");
					if (QZONE.FP.getQzoneConfig("isOwner")) {
						$("shareArticleContainer").style.display = "none";
					} else if (PageScheduler.blogInfo.getEffectBit(6) || PageScheduler.blogInfo.getEffectBit(29)) {
						$("shareArticleCheck").checked = false;
						$("shareArticleCheck").disabled = true;
						$("shareArticleContainer").title = "权限日志不能分享";
					}
				}
				QZBlog.Util.getLoginUserBitMap(function(data, value) {
					var isShow = !value && !QZBlog.Logic.isInPengyou;
					$("registHrefEntry").style.display = (isShow ? "" : "none");
				}, 1);
				QZFL.event.addEvent($('submitCommentBtn'), 'click', function() {
					CommentManager.submitComment();
				})
				EDITOR_CON = $('commentEditorCon');
				MASK_EDITOR = $('simpleCommentEditor');
				MASK_EDITOR.value = EDITOR_PLACEHOLDER;
				QZFL.event.addEvent(MASK_EDITOR, 'click', function() {
					if (!editor_builded && EDITOR_PLACEHOLDER && MASK_EDITOR.value && MASK_EDITOR.value == EDITOR_PLACEHOLDER) {
						MASK_EDITOR.value = '';
					}
				});
			},
			init: function() {
				var _this = this;
				this._renderBase();
				setTimeout(function() {
					_this.load();
				}, 500);
			}
		}
	})();
	window.EditorManager = CommentEditor;
	PS.triggerEvent('CommentContainerRendered', function() {
		CommentEditor.init();
	});
})(PageScheduler);
(function(PS, EditorManager, CommentScheduler) {
	var CommentManager = {
		commentEditor: null,
		jumpCommmentEditor: function() {
			setTimeout(QZONE.event.bind(this, function() {
				try {
					EditorManager.focus();
					QZBlog.Util.setScrollTop(QZONE.dom.getPosition("commentArea").top);
				} catch (err) {}
			}), 200);
		},
		_procCommentPageData: function(data) {
			if (data.length) {
				return data;
			}
			var rawData = data.data;
			if (rawData.replylist) {
				rawData.comments = rawData.replylist;
			}
			if (rawData.comments.length == 0 && rawData.pre_pos != -2) {
				return;
			}
			var listInfo = [];
			var blogInfo = PageScheduler.blogInfo;
			blogInfo.setCGIInfo({
				"pre_arch": rawData.pre_arch,
				"pre_pos": rawData.pre_pos,
				"next_arch": rawData.next_arch,
				"next_pos": rawData.next_pos
			});
			var len = rawData.comments.length;
			for (var index = 0; index < len; ++index) {
				var commentInfo = new parent.BlogCommentInfo();
				if (PageScheduler.blogInfo.isPrivate) {
					commentInfo.convertOldJsonObject(rawData.comments[index]);
				} else {
					commentInfo.convertJsonObject(rawData.comments[index]);
				}
				listInfo.push(commentInfo);
				blogInfo.addCommentInfo(listInfo[index]);
			}
			return listInfo;
		},
		_getCommentPageData: function(pageIndex, callback, isSilent) {
			var _this = this;
			if (PageScheduler.blogInfo.isPrivate) {
				this._getPrivateCommentPageData(pageIndex, callback);
				return;
			}
			if (!QZBlog.Logic.isBlogPage && (isNaN(pageIndex) || pageIndex <= 0)) {
				return;
			}
			var pos = CONTENT_COMMENT_NUM * (pageIndex - 1);
			var numperpage = CONTENT_COMMENT_NUM;
			var listInfo = PageScheduler.blogInfo.getCommentListInfo(pageIndex);
			if ( !! listInfo) {
				callback(listInfo);
				return;
			}
			if (!this._sendViewNumRecode && QZBlog.Logic.isBlogPage) {
				_this.addReaderNum();
			}
			this._sendViewNumRecode = true;
			var url = QZBlog.Util.getCommentCGIUrl(QZBlog.Logic.SpaceHostInfo.getLoginUin(), PageScheduler.blogInfo.getID(), numperpage, pos, Math.random());
			var netRequest = new QZBlog.Util.NetRequest({
				url: url,
				method: "get",
				uniqueCGI: true
			});
			netRequest.onSuccess = callback;
			netRequest.send();
		},
		addReaderNum: function() {
			var url = QZBlog.CGI_URL.get('add_count');
			var data = {
				uin: QZBlog.Logic.SpaceHostInfo.getUin(),
				blogId: PageScheduler.blogInfo.getID()
			};
			url = url + '?' + QZBlog.Util.buildParam(data);
			var netRequest = new QZBlog.Util.NetRequest({
				url: url,
				method: "get",
				uniqueCGI: true
			});
			netRequest.onSuccess = function() {};
			netRequest.send();
		},
		_getPrivateCommentPageData: function(pageIndex, callback) {
			var replylist = [];
			try {
				var replylist = g_oBlogData.data.replylist.slice((pageIndex - 1) * CONTENT_COMMENT_NUM, pageIndex * CONTENT_COMMENT_NUM);
			} catch (ex) {
				console.log('回复数据转换出错');
			}
			callback({
				data: {
					"pre_arch": g_oBlogData.data.pre_arch,
					"pre_pos": g_oBlogData.data.pre_pos,
					"next_arch": g_oBlogData.data.next_arch,
					"next_pos": g_oBlogData.data.next_pos,
					'replylist': replylist
				}
			});
		},
		showCommentPage: function(pageIndex) {
			var _this = this;
			var totalPage = PageScheduler.blogInfo.getCommentPageLength();
			if (typeof(pageIndex) === 'undefined') {
				pageIndex = PageScheduler.blogInfo.getCurCommentPage();
			}
			pageIndex = pageIndex > totalPage ? totalPage : pageIndex;
			pageIndex = pageIndex > 0 ? pageIndex : 1;
			PageScheduler.blogInfo.setCurCommentPage(pageIndex);
			this._getCommentPageData(pageIndex, function(data) {
				var listInfo = _this._procCommentPageData(data);
				if (listInfo && listInfo.length) {
					for (var i = 0; i < listInfo.length; i++) {
						if (!QZBlog.Logic.isInPengyou && (QZBlog.Logic.SpaceHostInfo.getUin() == QZBlog.Logic.SpaceHostInfo.getLoginUin()) && listInfo[i].getIsMyReply()) {
							listInfo[i].platform = 1;
							listInfo[i]._oUserInfo.setUserType(0);
						}
					}
				}
				CommentScheduler.showCommentList(listInfo);
				CommentScheduler.updateCommentPagination();
			});
			QZBlog.Util.Statistic.sendPV("comment_fanye", "blogtest.qzone.qq.com");
		},
		removeCommentCache: function(id) {
			var tmp_data = [];
			for (var i = 0; i < g_oBlogData.data.comments.length; i++) {
				if (g_oBlogData.data.comments[i].replyid != id) {
					tmp_data.push(g_oBlogData.data.comments[i]);
				}
			}
			g_oBlogData.data.comments = tmp_data;
		},
		mirrorComment: function(commentID) {
			var url = QZBlog.CGI_URL.get('blog_recover_nickname', 'blognew')
			var request = new QZBlog.Util.NetRequest({
				url: url,
				data: {
					hostUin: QZONE.FP.getQzoneConfig('ownerUin'),
					blogid: PageScheduler.blogInfo.getID(),
					replyid: commentID
				},
				method: 'post'
			});
			request.onSuccess = function(responseData) {
				var info = PageScheduler.blogInfo.getCommentInfo(commentID);
				if (!info) {
					alert("暂时无法使用照妖镜，请刷新空间重试");
					return;
				}
				var rawData = responseData.data;
				var userInfo = info.getUserInfo();
				userInfo.setNickname(rawData.comment_nick.toRealStr());
				userInfo.setUin(rawData.comment_uin);
				info.setEffect(info.getEffect() & (~1));
				var comData = info.toJsonObject();
				CommentScheduler._showSingleCommentInfo(info, comData);
				alert("该评论者是 " + rawData.comment_nick.toRealStr() + " (" + rawData.comment_uin + ") ，该评论的发表者昵称将显示为 " + rawData.comment_nick.toRealStr());
			};
			request.send();
		},
		showCommentEditor: function(id) {
			if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
				blogLoginFnList.splice(0, blogLoginFnList.length);
				PageScheduler.commonLoginCallback();
				QZBlog.Util.showLoginBox("blogComment");
				return;
			}
			try {
				$("multiReplyDiv" + id).style.display = "";
				var ele = $("commentModule_" + (id) + "_commentTip");
				var box = $("commentModule_" + (id) + "_commentBox");
				ele.onclick();
			} catch (err) {}
		},
		_doShowCommentEditor: function(commentID) {
			if (SelfReply.coreParam == commentID) {
				SelfReply.hideEditor(false);
				return;
			}
			var bNoMsgFlag = false;
			var info = PageScheduler.blogInfo.getCommentInfo(commentID);
			if ( !! info) {
				var effect = info.getEffect();
				if (effect & (1 << 19) || effect & (1 << 29)) {
					bNoMsgFlag = true;
				}
			}
			SelfReply.initialize("BLOG_TYPE", bNoMsgFlag);
			SelfReply.resetTarget($('masterComment' + commentID), $('mcEditor' + commentID), commentID);
		},
		_procQuote: function(str) {
			if (PageScheduler.blogInfo.isPrivate) {} else {
				str = str.toInnerHTML();
			}
			str = str.convHeaderSP().convSP().convCR();
			str = QZBlog.Util.parseMentionStr(str);
			str = str.replace(/\[quote\=引自：(.+?)(?:\x20|&nbsp;){1,2}于\x20(.+?)\x20发表的评论\]/g, "\x03引自：<cite>$1</cite>&nbsp;&nbsp;于 <ins>$2</ins> 发表的评论<br />\x02").replace(/\[\/quote\]/g, "\x01");
			for (var i = 0; i < 2; i++) {
				str = str.replace(/\x03([^\x03\x01\x02]*?)\x02([^\x03\x01\x02]*?)\x01/g, function(a, b, c) {
					return (!QZONE.userAgent.ie ? '<br />' : '') + '<blockquote style="overflow-x:hidden;font-size:12px;width:400px;border:dashed 1px gray;margin:10px;padding:10px">' + b + '引用内容：<br /><br /><q>' + c + '</q></blockquote>' + (!QZONE.userAgent.ie ? '<br />' : '');
				});
			}
			return str.replace(/[\x03\x02\x01]/g, "");
		},
		quoteCommentContent: function(commentID) {
			var _this = this;
			var info = PageScheduler.blogInfo.getCommentInfo(commentID);
			if (!info) {
				alert("暂时无法引用该用户评论，请刷新空间重试");
				return;
			}
			EditorManager.load(function(_commentEditor) {
				_commentEditor.focus();
				var quoteHtml = '引自：<cite>' + (((info.getEffect() & 1) > 0) ? '匿名' : info.getUserInfo().getNickname().toInnerHTML()) + '</cite>&nbsp;&nbsp;于 <ins>' +
					QZBlog.Util.long2time(info.getTime()) + '</ins> 发表的评论<br />引用内容：<br /><br /><q>' + _this._procQuote(info.getContent()) + '</q>';
				var str = EditorManager.getContent();
				if (str.toLowerCase().indexOf('<blockquote') >= 0) {
					str = str.replace(/(\<blockquote[^>]+>)(.*?)(<\/blockquote>)/gi, function() {
						return arguments[1] + quoteHtml + arguments[3];
					});
				} else {
					str = '<br /><blockquote style="overflow-x:hidden;font-size:12px;width:400px;border:dashed 1px gray;margin:10px;padding:10px">' + quoteHtml + '</blockquote><br />';
				}
				EditorManager.setContent(str);
			});
		},
		reportComment: function(uin, id, arch) {
			QZONE.FP.showReportBox({
				"appname": "qzone",
				"subapp": "blogcomment",
				"jubaotype": "article",
				"encoding": "GB2312",
				"uin": QZBlog.Logic.SpaceHostInfo.getUin(),
				"replyuin": uin,
				"blogid": PageScheduler.blogInfo.getID(),
				"commentid": id
			});
		},
		_checkCommentContent: function(content) {
			if (content.length == 0) {
				alert("请输入评论内容");
				return -1;
			}
			if (content.getRealLength() > MAX_COMMENT_LEN) {
				alert("很抱歉，您输入的内容字数过多，请删减后再重新提交");
				return -1;
			}
			var prop = new parent.ContentProperty(content);
			if (prop["image"] > 3 || prop["imagesize"] > 3) {
				alert("对不起，您只能插入3张图片或搜索表情");
				return -1;
			}
			if (prop["qqshow"] > 1) {
				alert("对不起，您只能插入一张QQ秀泡泡");
				return -1;
			}
			var re = /\[ffg,([a-zA-z#0-9]{1,10}),([a-zA-z&#=;0-9]{1,10})\]([^\[]{31,})\[\/ft\]/;
			if (re.test(content)) {
				if (!confirm("您设置发光的文字已超过30个，发光字效果将可能失效，确认发表此评论吗？")) {
					return -1;
				}
			}
			re = /\[ffg,([a-zA-z#0-9]{1,10}),[a-zA-z&#=;0-9]{1,10}\]/g;
			if (content.match(re) && content.match(re).length > 1) {
				if (!confirm("发光字回复中效果只能使用一次，更多的发光字将无法显示，确认发表此评论吗？")) {
					return -1;
				}
			}
			re = /\[ffg,([a-zA-z#0-9]{1,10}),([a-zA-z&#=;0-9]{1,10})\](.*\[f.*)\[\/ft\]/;
			if (re.test(content)) {
				if (!confirm("若发光字中使用了其它特效，发光字效果将可能失效，确认发表此评论吗？")) {
					return -1;
				}
			}
			if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
				blogLoginFnList.splice(0, blogLoginFnList.length);
				PageScheduler.commonLoginCallback();
				QZBlog.Util.showLoginBox("blogComment");
				return -3;
			}
			return 0;
		},
		_updateSettingText: function() {
			var arrMsg = [];
			if ( !! $("normalUseSignCheck") && $("normalUseSignCheck").checked && !$("normalUseSignCheck").disabled) {
				arrMsg.push("签名档");
			}
			if ( !! $("propertySelect")) {
				switch ($("propertySelect").selectedIndex) {
					case 0:
						break;
					case 1:
						arrMsg.push("道具：隐身草");
						break;
					case 2:
						arrMsg.push("道具：彩虹炫");
						break;
					case 3:
						arrMsg.push("道具：天使之爱");
						break;
				}
			}
		},
		showSetting: function() {
			$("_showCommentHref").style.display = "none";
			$("_hideCommentHref").style.display = "";
			$("moreCommentOptionDiv").style.display = "";
			$("_commentSettingHref").title = "收起附加功能";
			$("_commentSettingHref").onclick = this.hideSetting;
		},
		hideSetting: function() {
			var _this = this;
			$("_showCommentHref").style.display = "";
			$("_hideCommentHref").style.display = "none";
			$("moreCommentOptionDiv").style.display = "none";
			$("_commentSettingHref").title = "展开附加功能";
			$("_commentSettingHref").onclick = function() {
				_this.showSetting();
			};
		},
		showNotifyICSetting: function() {
			if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
				PageScheduler.commonLoginCallback();
				QZBlog.Util.showLoginBox("blogComment");
				return;
			}
			var _this = this;
			var nLoginUin = QZBlog.Logic.SpaceHostInfo.getLoginUin();
			if (!parent.g_oBlogSettingInfoMgr.isSettingInfoReady(nLoginUin)) {
				QZBlog.Util.showMsgbox("正在获取您的设置信息，请稍候...", 6, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				QZBlog.Util.getSubLoginBitMapFlag(function(data, value) {
					if (!data) {
						return;
					}
					parent.g_oBlogSettingInfoMgr.createSettingInfo(nLoginUin, data);
					_this._updateSettingText();
				}, 1);
				return;
			}
			QZBlog.Util.popupDialog('设置', '<iframe frameborder="no" id="commentSettingFrame" style="width:100%;height:115px;" src="' + IMGCACHE_BLOG_V5_PATH + '/comment_setting.html"></iframe>', 430, 115);
		},
		submitComment: function(flag) {
			var $anonymcheckDom = $('anonymcheck');
			if (flag) {
				$anonymcheckDom.checked = false;
			}
			$anonymcheckDom.checked ? QZBlog.Logic.TCISDClick('Comment.niming.post', '/BlogContent') : '';
			var content = EditorManager.getUbbContent().rtrim();
			if (!content || content.length == 0) {
				alert("您还没有填写任何评论内容");
				EditorManager.focus();
				return;
			}
			switch (this._checkCommentContent(content)) {
				case 0:
					break;
				case -1:
					EditorManager.focus();
					return;
				default:
					return;
			}
			this._doSubmitComment(content);
		},
		_doSubmitComment: function(content) {
			var _this = this;
			var data = {
				uin: QZBlog.Logic.SpaceHostInfo.getLoginUin(),
				content: content,
				topicId: QZBlog.Logic.SpaceHostInfo.getUin() + '_' + PageScheduler.blogInfo.getID(),
				yscProp: $("anonymcheck").checked ? 1 : 0,
				property: parent.g_Property,
				source: 45
			};
			var Request = new QZBlog.Util.NetRequest({
				url: QZBlog.CGI_URL.get("add_comment"),
				data: data,
				method: 'post',
				uniqueCGI: true
			});
			Request.onSuccess = function(responseData) {
				_this._postCommentSucc(responseData);
			}
			Request.onError = function(msg, responseData) {
				if (responseData) {
					_this._postCommentFail(responseData);
				} else {
					QZBlog.Util.showMsgbox('服务器繁忙，请稍候重试', 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				}
			}
			Request.send();
		},
		_postCommentFail: function(responseData) {
			if (responseData.code == -10043) {
				QZBlog.Util.popupDialog("温馨提示", '<iframe id="tools_dialog" frameborder="0" src="/qzone/newblog/v5/dialog/comment_need_tools.html?" style="width:100%;height:100%"></iframe>', 475, 205);
			} else if (responseData.code == -4017) {
				QZBlog.Util.showMsgbox(responseData.message || '服务器繁忙，请稍后重试', 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				EditorManager.clearContent();
				this.shareArticle(EditorManager.getTextContent(true).rtrim());
			} else {
				QZBlog.Util.showMsgbox(responseData.message || '服务器繁忙，请稍后重试', 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				this.shareArticle(EditorManager.getTextContent(true).rtrim());
			}
		},
		_postCommentSucc: function(responseData) {
			var _this = this;
			QZBlog.Util.showMsgbox(responseData.message || '评论成功！', 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
			PAGE_EVENT.fireEvent('COMMENT_ADDED');
			_this.shareArticle(EditorManager.getTextContent(true).rtrim());
			EditorManager.clearContent();
			$('shareArticleCheck').checked = false;
			$('anonymcheck').checked = false;
			PageScheduler.blogInfo.deleteCommentListInfoByPageIndex(PageScheduler.blogInfo.getCommentPageLength());
			var totalCommentCnt = parseInt(responseData.data.num, 10);
			if (isNaN(totalCommentCnt)) {
				totalCommentCnt = PageScheduler.blogInfo.getCommentCnt() + 1;
			} else {
				if (totalCommentCnt != PageScheduler.blogInfo.getCommentCnt() + 1) {
					PageScheduler.blogInfo.clearCommentListInfo();
				}
			}
			PageScheduler.blogInfo.setCommentCnt(totalCommentCnt);
			setTimeout(function() {
				_this.updateCommentCnt();
				QZBlog.Logic.refreshTopData();
				parent.BlogListNavigator.removePageData();
				parent.g_oBlogInfoMgr.updateBlogInfoSeed(PageScheduler.blogInfo.getID());
				window.jumpCommentFloor = PageScheduler.blogInfo.getCommentCnt();
				CommentScheduler.updateCommentPagination();
				if (PageScheduler.blogInfo.getCommentCnt() < CONTENT_COMMENT_NUM) {
					_this.showCommentPage(1);
				} else {
					_this.showCommentPage(PageScheduler.blogInfo.getCommentPageLength());
				}
			}, 1000);
		},
		postCommentSuccWithPic: function(totalCommentCnt) {
			PageScheduler.blogInfo.deleteCommentListInfoByPageIndex(PageScheduler.blogInfo.getCommentPageLength());
			if (isNaN(totalCommentCnt)) {
				totalCommentCnt = PageScheduler.blogInfo.getCommentCnt() + 1;
			} else {
				if (totalCommentCnt != PageScheduler.blogInfo.getCommentCnt() + 1) {
					PageScheduler.blogInfo.clearCommentListInfo();
				}
			}
			PageScheduler.blogInfo.setCommentCnt(totalCommentCnt);
			this.updateCommentCnt();
			QZBlog.Logic.refreshTopData();
			parent.BlogListNavigator.removePageData();
			parent.g_oBlogInfoMgr.updateBlogInfoSeed(PageScheduler.blogInfo.getID());
			QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, function() {
				window.jumpCommentFloor = PageScheduler.blogInfo.getCommentCnt();
				CommentScheduler.updateCommentPagination();
				if (PageScheduler.blogInfo.getCommentCnt() < CONTENT_COMMENT_NUM) {
					this.showCommentPage(1);
				} else {
					this.showCommentPage(PageScheduler.blogInfo.getCommentPageLength());
				}
			}), QZBlog.Util.MSG_LIFTTIME.MIDDLE);
		},
		updateCommentCnt: function() {
			var html = '<span class="icon icon_comment"></span><span class="adjust">评论(' + PageScheduler.blogInfo.getCommentCnt() + ')</span>';
			if ( !! $("upperReplyInfoArea") && !! $("footerReplyInfoArea")) {
				$("upperReplyInfoAreaBtn").innerHTML = html;
				$("footerReplyInfoAreaBtn").innerHTML = html;
			}
			$('commentCnt').innerHTML = '评论(' + PageScheduler.blogInfo.getCommentCnt() + ')';
		},
		shareArticle: function(textContent) {
			if ($("shareArticleCheck").checked && !$("shareArticleCheck").disabled) {
				var data = {
					'notice': 1,
					'fupdate': 1,
					'platform': (QZBlog.Logic.isInPengyou ? 2 : 1),
					'token': QZBlog.Util.getToken(),
					'auto': 0,
					'type': 'blog',
					'description': QZFL.string.restXHTML(textContent),
					'share2weibo': 0,
					'onekey': 0,
					'comment': 0,
					'entryuin': QZBlog.Logic.SpaceHostInfo.getLoginUin(),
					'spaceuin': QZBlog.Logic.SpaceHostInfo.getUin() || QZBlog.Logic.SpaceHostInfo.getLoginUin(),
					'id': PageScheduler.blogInfo.getID()
				};
				var url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_save?g_tk=' + QZBlog.Util.getToken();
				var fs = new QZFL.FormSender(url, 'post', data, 'utf-8');
				fs.onSuccess = function(re) {};
				fs.onError = function(data) {};
				fs.send();
			}
		},
		delComment: function(uin, id, arch) {
			if (!confirm("删除操作不可恢复，您确认要继续么?")) {
				return;
			}
			var _this = this;
			var url = QZBlog.CGI_URL.get('del_comment');
			var data = {
				uin: QZBlog.Logic.SpaceHostInfo.getLoginUin(),
				topicId: QZBlog.Logic.SpaceHostInfo.getUin() + '_' + PageScheduler.blogInfo.getID(),
				commentId: id,
				commentUin: uin
			};
			if (PageScheduler.blogInfo.isPrivate) {
				url = QZBlog.CGI_URL.get('privateblog_del_comment', 'private');
				data.pwd2sig = QZBlog.Util.getPwd2Sig()
			}
			var Request = new QZBlog.Util.NetRequest({
				url: url,
				data: data,
				method: 'post',
				uniqueCGI: true
			});
			Request.onSuccess = function(responseData) {
				QZBlog.Util.showMsgbox(responseData.data.message || '删除成功', 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				QZBlog.Logic.refreshTopData();
				PageScheduler.blogInfo.deleteCommmentInfo(id);
				var totalCommentCnt = PageScheduler.blogInfo.getCommentCnt() - 1;
				PageScheduler.blogInfo.setCommentCnt(totalCommentCnt || 0);
				_this.updateCommentCnt();
				CommentScheduler.updateCommentPagination();
				parent.g_oBlogInfoMgr.updateBlogInfoSeed(PageScheduler.blogInfo.getID());
				parent.BlogListNavigator.removePageData();
				_this.removeCommentCache(id);
				_this.showCommentPage();
			}
			Request.send();
		},
		moveUinBlack: function(uin, nickname) {
			if (!uin) {
				return;
			}
			nickname = unescape(nickname);
			if (uin == QZBlog.Logic.SpaceHostInfo.getLoginUin()) {
				QZBlog.Util.showMsgbox('您不能将自己加入黑名单中', 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				return;
			}
			if (!QZBlog.Logic.SpaceHostInfo.isValidLoginUin()) {
				blogLoginFnList.splice(0, blogLoginFnList.length);
				PageScheduler.commonLoginCallback();
				QZBlog.Util.showLoginBox("blogComment");
				return;
			}
			var c = new parent.QZONE.widget.Confirm('温馨提示', '提示,您准备将' + nickname + '(' + uin + ')加入您的黑名单，加入后该用户可以访问您的空间，不能在您的空间留言、回复。', 3);
			c.onConfirm = function() {
				var CGI_URL = "http://" + parent.g_W_Domain + "/cgi-bin/right/cgi_black_action_new",
					data = {
						uin: QZBlog.Logic.SpaceHostInfo.getLoginUin(),
						action: 1,
						act_uin: uin
					}, fs = new QZFL.FormSender(CGI_URL, "post", data, "utf-8");
				fs.onSuccess = function(re) {
					if (re) {
						msg = re.ret == 'succ' ? '该用户已加入您的黑名单' : re.msg;
					} else {
						msg = re.msg || '系统正忙，请稍后操作';
					}
					QZBlog.Util.showMsgbox(msg, 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				};
				fs.onError = function(re) {
					var msg = (re && re.msg) ? re.msg : '系统正忙，请稍后操作';
					QZBlog.Util.showMsgbox(re.msg, 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				};
				fs.send("_Callback");
			};
			c.show();
		},
		deleteBatchComments: function() {
			var oList = document.getElementsByName("commentCheckBox");
			if (oList.length == 0) {
				return;
			}
			var tmp;
			var arrCommentList = [];
			var arrArchList = [];
			var arrUinList = [];
			for (var i = 0; i < oList.length; ++i) {
				if (oList[i].checked) {
					tmp = oList[i].value.split('_');
					arrCommentList.push(tmp[0]);
					arrArchList.push(tmp[1]);
					arrUinList.push(tmp[2]);
				}
			}
			if (arrCommentList.length == 0) {
				QZBlog.Util.showMsgbox("请选择要删除的评论", 0, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				return;
			}
			QZFL.console.log("名博删除评论数大于总评论数");
			if (!confirm("您是否要删除选中的用户评论？")) {
				return;
			}
			var _this = this;
			var url = QZBlog.CGI_URL.get('batch_del_comment');
			var data = {
				uin: QZBlog.Logic.SpaceHostInfo.getLoginUin(),
				hostUin: QZBlog.Logic.SpaceHostInfo.getUin(),
				blogId: PageScheduler.blogInfo.getID(),
				blogType: PageScheduler.blogInfo.getType(),
				cmtIdList: (arrCommentList.join("_")),
				cmtUinList: (arrUinList.join("_"))
			};
			var Request = new QZBlog.Util.NetRequest({
				url: url,
				data: data,
				method: 'post',
				uniqueCGI: true
			});
			Request.onSuccess = function(responseData) {
				QZBlog.Util.showMsgbox(responseData.data.message, 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				QZBlog.Logic.refreshTopData();
				for (var index = 0; index < arrCommentList.length; ++index) {
					PageScheduler.blogInfo.deleteCommmentInfo(arrCommentList[index]);
				}
				var totalCommentCnt = parseInt(responseData.data.num, 10);
				if (isNaN(totalCommentCnt)) {
					totalCommentCnt = PageScheduler.blogInfo.getCommentCnt() - arrCommentList.length;
				} else {
					if (totalCommentCnt != (PageScheduler.blogInfo.getCommentCnt() - arrCommentList.length)) {
						PageScheduler.blogInfo.clearCommentListInfo();
					}
				}
				PageScheduler.blogInfo.setCommentCnt(totalCommentCnt);
				_this.updateCommentCnt();
				parent.g_oBlogInfoMgr.updateBlogInfoSeed(PageScheduler.blogInfo.getID());
				parent.BlogListNavigator.removePageData();
				_this.showCommentPage();
			};
			Request.send();
		},
		selectAllComments: function(bChecked) {
			var oList = document.getElementsByName("commentCheckBox");
			if (oList.length == 0)
				return;
			for (var i = 0; i < oList.length; ++i) {
				oList[i].checked = !! bChecked;
			}
		},
		showCommentCheckBoxs: function(bShow, bCheck) {
			var oList;
			var oList = $("commentListDiv").getElementsByTagName("li");
			for (var i = 0; i < oList.length; ++i) {
				var div = oList[i].getElementsByTagName("div")[0];
				if (!div) {
					continue;
				}
				if (bShow) {
					QZFL.css.addClassName(div, "show_delete");
				} else {
					QZFL.css.removeClassName(div, "show_delete");
				}
			}
			oList = document.getElementsByName("commentCheckBox");
			if (oList.length == 0) {
				return;
			}
			for (var i = 0; i < oList.length; ++i) {
				oList[i].checked = ( !! bCheck ? true : false);
			}
			$("batchSelAllInput").checked = ( !! bCheck ? true : false);
			$("leftDeleteComParag").style.display = (( !! bShow) ? "" : "none");
			$("batchDelComHref").style.display = (( !! bShow) ? "none" : "");
			$("noBatchDelComHref").style.display = (( !! bShow) ? "" : "none");
		},
		_addMentionInfoBreforeReply: function(str, commentID) {
			var info = PageScheduler.blogInfo.getCommentInfo(commentID);
			var userInfo = info.getUserInfo();
			var _encode = function(str) {
				return str.replace(/\%/g, '%25').replace(/\}/g, '%7D').replace(/\,/g, '%2C');
			}
			var uin = userInfo.getUin();
			if (uin != QZBlog.Logic.SpaceHostInfo.getLoginUin()) {
				return "@{uin:" + uin + ',nick:' + _encode(userInfo.getNickname()) + ',who:' + (/^\d+$/g.test(uin) ? '1' : '2') + ',auto:1}' + str;
			}
			return str;
		},
		submitReply: function(commentID, content, callbacks) {
			var _this = this;
			var url = QZBlog.CGI_URL.get('add_reply');
			content = this._addMentionInfoBreforeReply(content, commentID);
			var data = {
				uin: QZBlog.Logic.SpaceHostInfo.getLoginUin(),
				topicId: QZBlog.Logic.SpaceHostInfo.getUin() + '_' + PageScheduler.blogInfo.getID(),
				commentId: commentID,
				content: content
			};
			var Request = new QZBlog.Util.NetRequest({
				url: url,
				data: data,
				method: 'post',
				uniqueCGI: true
			});
			Request.onSuccess = function(responseData) {
				QZBlog.Util.showMsgbox("操作成功!", 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				var commentTime = responseData.data.postTime;
				var info = PageScheduler.blogInfo.getCommentInfo(commentID);
				var replyInfo = info.getReplyInfo();
				replyInfo.push({
					uin: QZBlog.Logic.SpaceHostInfo.getLoginUin(),
					id: commentTime,
					content: (PageScheduler.blogInfo.isPrivate ? content : content.toInnerHTML()),
					postTime: commentTime,
					time: commentTime,
					platform: (QZBlog.Logic.isInPengyou ? 2 : 1),
					poster: {
						id: QZBlog.Logic.SpaceHostInfo.getLoginUin(),
						name: "",
						platform: (QZBlog.Logic.isInPengyou ? 2 : 1)
					}
				});
				parent.g_oBlogInfoMgr.updateBlogInfoSeed(PageScheduler.blogInfo.getID());
				try {
					var innerIndex = replyInfo.length - 1;
					var item = replyInfo[innerIndex];
					var platform = 1;
					if (info.checkCommentPlatform()) {
						if (info.getIsMyReply()) {
							platform = 2;
						} else {
							platform = 1;
						}
					} else {
						if (QZBlog.Logic.isInPengyou) {
							platform = 2;
						} else {
							platform = 1;
						}
					}
					var user = new F4A.controls.User({
						"uin": item["uin"],
						"nickname": (typeof(item["nick"]) == "string" ? item["nick"].toRealStr() : item["nick"]),
						"platform": platform
					});
					if (info.checkCommentPlatform()) {
						if (!QZBlog.Logic.isInPengyou && info.getIsMyReply()) {
							user.setUin(PageScheduler.blogInfo.getCommentInfo(commentID).getUserInfo().getUin());
						} else {
							user.setAvatarUrl(QZBlog.Util.PortraitManager.getPortraitUrl(user.getUin(), 30));
						}
					} else {
						user.setAvatarUrl(QZBlog.Util.PortraitManager.getPortraitUrl(user.getUin(), 30));
					}
					if (item["uin"] == QZBlog.Logic.SpaceHostInfo.getUin()) {
						user.setNickname('主人');
					}
					if (item["uin"] == QZBlog.Logic.SpaceHostInfo.getLoginUin()) {
						user.setNickname('我');
					}
					var reply = new F4A.controls.Reply({
						id: commentID + "_" + innerIndex,
						content: item["content"].toRealStr(),
						poster: user,
						orginalTime: item["time"],
						postTime: QZBlog.Util.long2DateTime(item["time"])
					})
					callbacks.onSuccess(reply);
				} catch (err) {}
			};
			Request.onError = function(msg) {
				try {
					QZBlog.Util.showMsgbox(msg, 1, QZBlog.Util.MSG_LIFTTIME.HIGH);
					var info = PageScheduler.blogInfo.getCommentInfo(commentID);
					var replyInfo = info.getReplyInfo();
					window.setTimeout(QZFL.object.bind(_this, function() {
						callbacks.onError();
					}), QZBlog.Util.MSG_LIFTTIME.HIGH);
				} catch (err) {}
			};
			Request.requestFrequent = function() {
				QZBlog.Util.showMsgbox("发表回复频率不要太快哦", 2, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				return false;
			};
			Request.send();
		},
		removeCommentReply: function(commentID, replyUin, replyTime) {
			var info = PageScheduler.blogInfo.getCommentInfo(commentID);
			if (!info) {
				QZBlog.Util.showMsgbox("暂时无法删除该回复，请刷新空间重试", 1, QZBlog.Util.MSG_LIFTTIME.HIGH);
				return;
			}
			var arch = info.getCommentArch();
			if (typeof(arch) == 'undefined') {
				arch = 0;
			}
			var url = QZBlog.CGI_URL.get('del_reply');
			var data = {
				uin: QZBlog.Logic.SpaceHostInfo.getLoginUin(),
				topicId: QZBlog.Logic.SpaceHostInfo.getUin() + '_' + PageScheduler.blogInfo.getID(),
				commentId: commentID,
				replyId: replyTime,
				replyUin: replyUin
			};
			var netRequest = new QZBlog.Util.NetRequest({
				url: url,
				data: data,
				method: 'post',
				uniqueCGI: true
			});
			netRequest.onSuccess = function(data) {
				if (data.code != 0) {
					QZBlog.Util.showMsgbox(data.message, 1, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
					return;
				}
				QZBlog.Util.showMsgbox("删除成功", 4, QZBlog.Util.MSG_LIFTTIME.MIDDLE);
				var replyInfo = info.getReplyInfo();
				for (var index = 0; index < replyInfo.length; ++index) {
					if (replyInfo[index].uin == replyUin && replyInfo[index].postTime == replyTime) {
						replyInfo.splice(index, 1);
						break;
					}
				}
				CommentScheduler.showMixedReplyArea(commentID, replyInfo, info.getEffect());
			};
			netRequest.send();
		},
		toggleList: function(id, blnClose) {
			var wrapDiv = $("op" + id);
			var hrefEle = $("commentMoreOP" + id);
			var nav_item = $('op' + id).parentNode.parentNode.parentNode.parentNode;
			if (QZFL.css.hasClassName(wrapDiv, "list_drop" || !! blnClose)) {
				QZFL.css.removeClassName(nav_item, 'current_item');
				QZFL.css.removeClassName(hrefEle, "bor2 bg");
				QZFL.css.removeClassName(wrapDiv, "list_drop");
			} else {
				QZFL.css.addClassName(nav_item, 'current_item');
				QZFL.css.addClassName(hrefEle, "bor2 bg");
				QZFL.css.addClassName(wrapDiv, "list_drop");
			}
		},
		portraitTipsTimeout: null,
		showUserGradeTips: function(targetEle, score, grade) {
			clearTimeout(CommentManager.portraitTipsTimeout);
			var html = '<span style="color:black">等级:</span><span style="color:red">' + score + '</span> <span style="color:black">积分:</span><span style="color:red">' + grade + '</span> <a href="http://service.qq.com/info/42028.html" target="_blank" style="text-decoration:underline;color:blue">等级积分说明</a>';
			var offset = {
				w: 0,
				h: 25
			};
			var sT = CommentManager.getUserPortraitTipDiv();
			with(sT) {
				style.left = (QZONE.dom.getPosition(targetEle).left + offset.w) + "px";
				style.top = (QZONE.dom.getPosition(targetEle).top + offset.h) + "px";
				innerHTML = html;
				style.display = "";
			}
		},
		showUserCampusTips: function(ele, html) {
			clearTimeout(CommentManager.portraitTipsTimeout);
			var sT = CommentManager.getUserPortraitTipDiv();
			sT.style.left = QZONE.dom.getPosition(ele).left + QZONE.dom.getPosition(ele).width + 10 + "px";
			sT.style.top = QZONE.dom.getPosition(ele).top + "px";
			sT.innerHTML = html;
			sT.style.display = "";
		},
		getUserPortraitTipDiv: function() {
			var sT = $("sTitle");
			if (!sT) {
				sT = document.createElement("div");
				sT.id = "sTitle";
				sT.style.cssText = "position:absolute;border:solid 1px black;padding:2px;background-color:#FFC";
				document.body.appendChild(sT);
			}
			return sT;
		},
		hideUserTips: function() {
			CommentManager.portraitTipsTimeout = setTimeout(function() {
				var sT = $("sTitle");
				if ( !! sT) {
					sT.style.display = "none";
				}
			}, 2000);
		},
		switchSignature: function(btn) {
			if (!btn) {
				return;
			}
			var flag = false;
			if (btn.innerHTML == "隐藏评论签名") {
				btn.innerHTML = "显示评论签名";
				btn.title = "显示评论签名";
				flag = false;
				QZBlog.Util.Statistic.sendPV("hidewrite", "rizhi.qzone.qq.com");
			} else if (btn.innerHTML == "显示评论签名") {
				btn.innerHTML = "隐藏评论签名";
				btn.title = "隐藏评论签名";
				flag = true;
				QZBlog.Util.Statistic.sendPV("showwrite", "rizhi.qzone.qq.com");
			}
			var pageIndex = PageScheduler.blogInfo.getCurCommentPage();
			var listInfo = PageScheduler.blogInfo.getCommentListInfo(pageIndex);
			if (!listInfo) {
				return;
			}
			var index = (pageIndex - 1) * CONTENT_COMMENT_NUM + 1;
			for (; index < pageIndex * CONTENT_COMMENT_NUM; ++index) {
				if (!$("signatureDIV" + index)) {
					continue;
				}
				var tdTag = $("signatureDIV" + index).getElementsByTagName("td");
				var content = "";
				if (tdTag.length > 0) {
					content = tdTag[0].innerHTML.trim();
				} else {
					content = $("signatureDIV" + index).innerHTML == 'undefined' ? '' : $("signatureDIV" + index).innerHTML.trim();
				}
				if ( !! flag && !! content) {
					QZFL.css.removeClassName($("signatureDIV" + index), "none");
				} else {
					var tableTag = $("signatureDIV" + index).getElementsByTagName("table");
					if (tableTag.length > 0) {
						$("signatureDIV" + index).removeChild(tableTag[0]);
					}
					QZFL.css.addClassName($("signatureDIV" + index), "none");
				}
			}
			if ( !! flag) {
				var uinlist = "";
				for (var index = 0; index < listInfo.length; ++index) {
					var info = listInfo[index];
					if (info.getEffect() & (1 << 22)) {
						if ( !! uinlist) {
							uinlist += "-";
						}
						uinlist += info.getUserInfo().getUin();
					}
				}
				if (!uinlist) {
					return;
				}
				var Request = new QZBlog.Util.NetRequest({
					url: "http://r.qzone.qq.com/cgi-bin/user/cgi_sign_batchget",
					data: {
						uinlist: uinlist,
						notubb: 1,
						fupdate: 1
					},
					method: 'get',
					uniqueCGI: true
				});
				Request.onSuccess = function(responseData) {
					data = responseData.data;
					if (!data) {
						return;
					}
					var index = (pageIndex - 1) * CONTENT_COMMENT_NUM + 1;
					var infoIndex = 0;
					var listInfo = PageScheduler.blogInfo.getCommentListInfo(pageIndex);
					for (; index <= pageIndex * CONTENT_COMMENT_NUM && infoIndex < listInfo.length; ++index, ++infoIndex) {
						if (!$("signatureDIV" + index) || (listInfo[infoIndex].getEffect() & (1 << 22)) == 0) {
							continue;
						}
						for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
							if (data[dataIndex].uin == listInfo[infoIndex].getUserInfo().getUin()) {
								if ( !! data[dataIndex].sign.trim()) {
									var replyautograph = data[dataIndex].sign;
									var oldHTML = $("signatureDIV" + index).innerHTML;
									$("signatureDIV" + index).innerHTML = "<table style='width:100%;table-layout:fixed;WORD-BREAK:break-all;WORD-WRAP:break-word'><tr><td>" + replyautograph + "</td></tr></table>" + oldHTML;
									QZFL.css.removeClassName($("signatureDIV" + index), "none");
								}
								break;
							}
						}
					}
				};
				Request.send();
			}
		}
	};
	window.CommentManager = CommentManager;
})(window.PageScheduler, window.EditorManager, window.CommentScheduler);
var BroadCastManager = {
	pageIndex: 1,
	itemsPerPage: 15,
	itemTotal: 0,
	isNoComment: false,
	totalNumCacheHash: "",
	blogid: null,
	imgTipsTimerId: null,
	BROAD_CAST_IMG_TIP_ID: 'broadCastImgTip_1',
	platformLinkPrefixHash: {
		0: 'http://user.qzone.qq.com/',
		1: 'http://www.pengyou.com/index.php?mod=profile&u=',
		2: 'http://t.qq.com/'
	},
	actionTypeHash: {
		0: {
			0: '转载了这篇日志。',
			1: '分享了这篇日志。',
			2: '在<a class="nickname" href="http://user.qzone.qq.com/$fromuin" target="_blank">$fromspace</a>评论了这篇日志',
			3: '觉得这篇日志很赞。',
			4: '将这篇日志转播到腾讯微博。'
		},
		1: {
			0: '在朋友网转载了这篇日志。',
			1: '在朋友网分享了这篇日志。',
			2: '在朋友网评论了这篇日志。',
			3: '觉得这篇日志很赞。',
			4: '在朋友网将这篇日志转播到腾讯微博。'
		},
		2: {
			1: '转播了这篇文章到腾讯微博。',
			2: '在腾讯微博转播了这篇文章。'
		}
	},
	template: ['<ul class="interact_list">', '<%for(var i=0; data && i<data.length; i++){%>', '<li class="bbor3 evt_hover" rel="broadcastItem">', '<div class="avatar">', '<%if(data[i].platform !=2){%>', '<a class="q_namecard" link="nameCard_<%=data[i].author.uin%>" href="<%=data[i].author.link%>" target="_blank">', '<img src="<%=data[i].author.avatar%>" alt="">', '</a>', '<%}else{%>', '<img src="<%=data[i].author.avatar%>" alt="">', '<%}%>', '</div>', '<div class="interact_info">', '<div class="interact_tit">', '<span class="interact_tit_cont">', '<%if(data[i].platform !=2){%>', '<a class="nickname" href="<%=data[i].author.link%>" target="_blank">', '<%=data[i].author.nickname%>', '</a>', '<%}else{%>', '<span class="nickname"><%=data[i].author.nickname%></span>', '<%}%>', '<%=data[i].actionDescription%>', '</span>', '<span class="c_tx3 interact_time"><%=data[i].datetime%></span>', '<span class="interact_op">', '<a href="javascript:;" class="none" rel="report_btn" uin="<%=data[i].opuin%>" commentid="<%=data[i].commentid%>">举报</a>', '<a href="javascript:;" class="none" rel="delete_btn" uin="<%=data[i].opuin%>" commentid="<%=data[i].commentid%>">删除</a>', '</span>', '</div>', '<div class="interact_con" id="broadCastList_word_<%=i%>"><%=data[i].comment%></div>', '</div>', '</li>', '<% }%>', '</ul>'].join(''),
	init: function() {
		var self = this;
		if (QZBlog.Logic.isInPengyou || PageScheduler.blogInfo.getEffectBit(3)) {
			return;
		}
		self.isNoComment = ($("commentListDiv").style.display == "none" ? true : false);
		this.blogid = PageScheduler.blogInfo.getID();
		this.totalNumCacheHash = "content_broadcast_totalnum_" + '_' + QZBlog.Logic.SpaceHostInfo.getLoginUin() + QZBlog.Logic.SpaceHostInfo.getUin() + "_" + this.blogid;
		this.showPage(1);
		this.bindEvent();
		PAGE_EVENT.addEvent('COMMEND_LOAD', function() {
			self.isNoComment = false;
		});
		PAGE_EVENT.addEvent("COMMENT_ADDED", function() {
			self.isNoComment = false;
		});
	},
	bindEvent: function() {
		var _this = this;
		QZFL.event.addEvent($("broadcastTitle"), 'click', function() {
			$("broadcastCnt").parentNode.className = "nowtag";
			$("commentCnt").parentNode.className = "";
			$('commentListDiv').style.display = "none";
			$("commentDiv").style.display = "";
			$("noCommentTip").style.display = "none";
			$('commentPageIndexArea').style.display = "none";
			$('broadCastArea').style.display = "";
			$('newBroadcastDotBtn').style.display = "none";
			_this.showPage(_this.pageIndex);
			QZBlog.Util.Statistic.sendPV('Hudong', 'blog.qzone.qq.com');
			QZFL.event.preventDefault();
			return false;
		});
		QZFL.event.addEvent($('commentCnt'), 'click', function() {
			$("commentCnt").parentNode.className = "nowtag";
			$("commentDiv").style.display = _this.isNoComment ? "none" : "";
			$("noCommentTip").style.display = _this.isNoComment ? "" : "none";
			$("broadcastCnt").parentNode.className = "";
			$('commentListDiv').style.display = "";
			$('commentPageIndexArea').style.display = "";
			$('broadCastArea').style.display = "none";
			QZFL.event.preventDefault();
			return false;
		});
		QZFL.event.addEvent($('broadcastListDiv'), 'click', function(e) {
			var tag = QZFL.event.getTarget(e);
			if (tag.rel == 'delete_btn') {
				_this.deleteBroadCast(QZONE.FP.getQzoneConfig('loginUin'), tag.getAttribute('commentid'));
				QZBlog.Logic.TCISDClick('hudongdelete', '/BlogContent');
				QZFL.event.preventDefault();
				return false;
			} else if (tag.rel == 'report_btn') {
				QZONE.FP.showMsgbox('举报成功', 4, 2000);
				QZFL.event.preventDefault();
				return false;
			}
		});
		QZFL.event.delegate($('broadcastListDiv'), '.evt_hover', 'mouseenter', function(e) {
			var target = QZFL.event.getTarget(e),
				rel;
			QZFL.dom.searchChain(target, 'parentNode', function(el) {
				if (el.getAttribute('rel')) {
					target = el;
					return true;
				}
			});
			rel = target.getAttribute('rel');
			if (rel == 'broadcastItem') {
				_this._onMouseEnterBroadCastItem(target);
			}
		});
		QZFL.event.delegate($('broadcastListDiv'), '.evt_hover', 'mouseleave', function(e) {
			var target = QZFL.event.getTarget(e),
				rel;
			QZFL.dom.searchChain(target, 'parentNode', function(el) {
				if (el.getAttribute('rel')) {
					target = el;
					return true;
				}
			});
			rel = target.getAttribute('rel');
			if (rel == 'broadcastItem') {
				_this._onMouseLeaveBroadCastItem(target);
			}
		});
	},
	deleteBroadCast: function(uin, commentId) {
		var data = {
			uin: uin,
			blogid: this.blogid,
			id: commentId
		};
		var _this = this;
		var Request = new QZBlog.Util.NetRequest({
			url: QZBlog.CGI_URL.get('blog_del_interaction'),
			data: data,
			method: 'post',
			charset: 'gb2312'
		});
		Request.onSuccess = function() {
			QZONE.FP.showMsgbox('删除成功', 4, 2000);
			PAGE_CACHE.clean();
			var itemTotal = _this.itemTotal - 1;
			if (itemTotal) {
				var newPageTotal = Math.ceil(itemTotal / _this.itemsPerPage);
				if (newPageTotal == _this.pageIndex) {
					_this.showPage(_this.pageIndex);
				} else if (newPageTotal > _this.pageIndex) {
					_this.showPage(_this.pageIndex);
				} else {
					_this.showPage(_this.pageIndex - 1);
				}
			} else {
				_this.showPage(1);
			}
		}
		Request.send();
	},
	refreshTotalNum: function(num) {
		if (num) {
			$("broadcastCnt").parentNode.style.display = "";
		}
		$("broadcastCnt").innerHTML = '互动(' + (num > 9999 ? '9999+' : num) + ')';
	},
	showPage: function(pageIndex) {
		pageIndex = pageIndex > 0 ? pageIndex : 1;
		var _this = this;
		this.getPageData(pageIndex, function(o) {
			_this.updateNewMsgBtn(o.total_num);
			if (pageIndex == 1 && o.total_num) {
				$('broadcastCnt').parentNode.style.display = '';
			}
			$('broadcastListDiv').innerHTML = tmpl(_this.template, {
				data: o.listdata || []
			});
			_this.pageIndex = pageIndex;
			try {
				QZONE.namecard.init($('broadcastListDiv'));
			} catch (ex) {
				console.log(ex);
			}
			_this.itemTotal = o.total_num;
			_this.showPagination(pageIndex, o.total_num);
		});
	},
	_showedNewMsgBtn: false,
	updateNewMsgBtn: function(num) {
		if (this._showedNewMsgBtn) {
			return;
		}
		this._showedNewMsgBtn = true;
		QZFL.event.addEvent($('broadcastTitle'), 'click', function() {
			var tm = new Date();
			QZFL.event.addEvent($('commentCnt'), 'click', function() {
				if ((new Date()).getTime() - tm.getTime() < 3000) {
					QZBlog.Util.Statistic.sendPV('HudongLeftIn3Sec', 'blog.qzone.qq.com');
				}
				QZFL.event.removeEvent($('commentCnt'), 'click', arguments.callee);
			});
			QZFL.event.removeEvent($('broadcastTitle'), 'click', arguments.callee);
		});
		var _this = this;
		QZONE.FP._t.QZONE.FP.shareDb.get(_this.totalNumCacheHash, function(cacheNum) {
			if (cacheNum && num > cacheNum) {
				$('newBroadcastDotBtn').style.display = '';
				QZONE.FP._t.QZONE.FP.shareDb.set(_this.totalNumCacheHash, num);
			} else if (!cacheNum) {
				if (num) {
					$('newBroadcastDotBtn').style.display = '';
				}
				QZONE.FP._t.QZONE.FP.shareDb.set(_this.totalNumCacheHash, num);
			}
		});
	},
	getAvatar: function(uin, platform) {
		if (platform == 0) {
			return 'http://qlogo4.store.qq.com/qzone/' + uin + '/' + uin + '/30';
		} else if (platform == 1) {
			return 'http://py.qlogo.cn/friend/' + uin + '/audited/30';
		} else if (platform == 2) {
			return 'http://t0.qlogo.cn/mbloghead/' + uin + '/30';
		}
	},
	getPageData: function(pageIndex, callback) {
		var _this = this;
		var cache_key = 'blogcontent_broadcast_' + pageIndex + '_' + QZONE.FP.getQzoneConfig().ownerUin + '_' + BroadCastManager.blogid;
		var cache_data = PAGE_CACHE.get(cache_key);
		if (cache_data) {
			_this.refreshTotalNum(cache_data.total_num);
			callback(cache_data);
			return;
		}
		var url = QZBlog.CGI_URL.get('blog_get_interaction');
		var data = {
			uin: QZONE.FP.getQzoneConfig().ownerUin,
			blogid: this.blogid,
			from: (pageIndex - 1) * _this.itemsPerPage,
			num: _this.itemsPerPage
		};
		var netRequest = new QZBlog.Util.NetRequest({
			url: url,
			data: data,
			isSilenderMode: true,
			method: 'get',
			uniqueCGI: true
		});
		netRequest.onSuccess = function(data) {
			if (data.code == 0) {
				o = data.data;
				if (o && o.total_num) {
					var replacew = "face egg quote qqshow" + (((QZBlog.Logic.SpaceHostInfo.isFamousUser() || QZBlog.Logic.SpaceHostInfo.isBizUser() || QZBlog.Logic.SpaceHostInfo.isInteractiveUser()) && !(QZONE.FP.getQzoneConfig().loginUin == QZBlog.Logic.SpaceHostInfo.getUin())) ? " imageHide" : " anchor image email glow_limit font");
					for (var i = 0; i < o.listdata.length; i++) {
						var item = o.listdata[i];
						var str = item.comment.replace('$', '&#36;');
						item.commentid = item.id;
						item.blogid = _this.blogid;
						item.comment = _this._replaceImgToIcon(ubbReplace(str, replacew, null, null, IMGCACHE_DOMAIN));
						str = QZBlog.Util.parseMentionStr(str);
						if (item.platform == 2) {
							item.acttype = item.fromid ? 2 : 1
						}
						item.actionDescription = _this.getActionDescription(item.platform, item.acttype).replace('$fromspace', item.fromspace).replace('$fromuin', item.fromuin);
						item.datetime = _this.formatTime(item.time * 1000);
						item.author = {
							uin: item.platform == 0 ? item.opuin : '',
							link: _this.platformLinkPrefixHash[item.platform] + item.opuin,
							avatar: (item.platform == 2 ? (item.imgurl ? (item.imgurl + '/30') : "http://t.qlogo.cn/mbloghead/default/30") : _this.getAvatar((item.opuin || item.encUin), item.platform)),
							nickname: item.opnick
						};
					}
					PAGE_CACHE.add(cache_key, o);
				}
				_this.refreshTotalNum(o.total_num);
				callback(o);
			}
		};
		netRequest.send();
	},
	showPagination: function(pageIndex, itemTotal) {
		if (itemTotal < 1) {
			$('broadCastPagination').style.display = 'none';
			return;
		} else {
			$('broadCastPagination').style.display = '';
		}
		var pageTotal = Math.ceil(itemTotal / this.itemsPerPage);
		var _this = this;
		QZFL.imports("/qzone/app/controls/pager/pager.js", function() {
			new F4A.widget.Pager($("broadCastPagination"), {
				offsetPage: 3,
				pageSize: _this.itemsPerPage,
				currentPage: pageIndex,
				totalNum: itemTotal,
				onTurn: function() {
					pageIndex = this.currentPage;
					_this.showPage(pageIndex);
				},
				template: {
					CONTENT: '<div class="{style}" id="_pager_content_{id}">' + '<p class="mod_pagenav_main"><a href="javascript:void(0);" title="以下为分页" style="position:absolute;top:-999em" class="speak"></a>' + '{previous}{first}' + '{pager}' + '{last}{next}' + '</p>' + '<p class="mod_pagenav_option">' + '<span class="mod_pagenav_turn">到{goinput}页 {gobutton}' + '</p>' + '</div>',
					FIRST_DISABLE: '<span class="mod_pagenav_disable"><span>首页</span></span>',
					FIRST_ENABLE: '<a href="javascript:void(0);" title="首页" id="pager_first_{id}" class="c_tx"><span>1</span></a>',
					LAST_DISABLE: '<span class="mod_pagenav_disable"><span>末页</span></span>',
					LAST_ENABLE: '<a href="javascript:void(0);" title="{pagenum}" class="c_tx" id="pager_last_{id}"><span>{pagenum}</span></a>',
					PREVIOUS_DISABLE: '<span class="mod_pagenav_disable"><span>上一页</span></span>',
					PREVIOUS_ENABLE: '<a href="javascript:void(0);" title="上一页" id="pager_previous_{id}" class="c_tx"><span>上一页</span></a>',
					NEXT_DISABLE: '<span class="mod_pagenav_disable"><span>下一页</span></span>',
					NEXT_ENABLE: '<a href="javascript:void(0);" title="下一页" id="pager_next_{id}" class="c_tx"><span>下一页</span></a>',
					PAGE_NORMAL: '<a href="javascript:void(0);" title="{pagenum}" class="c_tx" id="pager_num_{id}_{pagenum}"><span>{pagenum}</span></a>',
					PAGE_CURRENT: '<span class="current"><span>{pagenum}</span></span>',
					GO_PAGE_INPUT: '<input type="text" id="pager_go_{id}" class="textinput" />',
					GO_PAGE_BUTTON: '<button id="pager_gobtn_{id}" type="button" class="bt_tx2"><span>确定</span></button>',
					ELLIPSIS: '<span class="mod_pagenav_more"><span>…</span></span>',
					CLASS_NAME: 'mod_pagenav'
				}
			});
		}, {
			charset: "utf-8",
			errCallback: function() {
				QZONE.FP.showMsgbox("加载分页组件失败", 5, 3000);
			}
		});
	},
	getActionDescription: function(platform, actionType) {
		if (this.actionTypeHash[platform] && this.actionTypeHash[platform][actionType]) {
			return this.actionTypeHash[platform][actionType];
		}
		return '';
	},
	formatTime: function(timestamp) {
		var dobj = timestamp ? new Date(timestamp) : new Date();
		var y = dobj.getFullYear(),
			m = dobj.getMonth() + 1,
			d = dobj.getDate(),
			h = dobj.getHours(),
			i = dobj.getMinutes(),
			s = dobj.getSeconds();
		return y + '-' + (m > 9 ? m : '0' + m) + '-' + (d > 9 ? d : '0' + d) + ' ' + (h > 9 ? h : '0' + h) + ':' + (i > 9 ? i : '0' + i) + ':' + (s > 9 ? s : '0' + s);
	},
	_replaceImgToIcon: function(str) {
		var result;
		result = str.replace(/<img([^>]+)>/ig, function() {
			var attrStr = arguments[1];
			var regEM = /em\/e(\d{1,3}).gif/i;
			if (regEM.test(attrStr)) {
				return '<img ' + attrStr + '/>';
			};
			return '<span class="icon icon_img evt_hover" rel="imgIcon" onmouseover="BroadCastManager.onMouseEnterImgIcon(this);" onmouseout="BroadCastManager.onMouseLeaveImgIcon(this);"' + attrStr + '></span>';
		});
		return result || str;
	},
	_showImgBubble: function(imgsrc, aim) {
		var MAX_IMAGE_WIDTH = 800,
			DEFAULT_CONTENT_PADDING = 5,
			opts = {
				id: this.BROAD_CAST_IMG_TIP_ID,
				contentPadding: DEFAULT_CONTENT_PADDING,
				noQueue: true,
				backgroundColor: '#fff',
				borderColor: '#c0c0c0',
				arrowType: 2,
				x: -20,
				y: 2,
				arrowOffset: 25,
				arrowPoint: 1,
				needCloseButt: false,
				noCloseButton: true,
				timeout: -1
			};
		this._showImgBubble._showed = true;
		if (!isURL(imgsrc)) {
			console.log('content_broadcast.js BroadCastManager._showImgBubble :你给的图片url不是一个有效的url');
			return;
		}
		var image = new Image();
		image.onload = function() {
			if (image.width > MAX_IMAGE_WIDTH) {
				var scaleRate = MAX_IMAGE_WIDTH / image.width;
				image.width = MAX_IMAGE_WIDTH;
				image.height = scaleRate * image.height;
			}
			opts.width = image.width + DEFAULT_CONTENT_PADDING * 2;
			opts.height = image.height + DEFAULT_CONTENT_PADDING * 2;
			QZFL.widget.tips.show('<img src="' + imgsrc + '" width="' + image.width + '"/>', aim, opts);
		};
		image.onerror = function() {
			console.log('content_broadcast.js BroadCastManager._showImgBubble : 加载图片失败');
		}
		image.src = imgsrc;
	},
	_hideImgBubble: function() {
		var t;
		if (QZFL.widget.tips.instances && (t = QZFL.widget.tips.instances[this.BROAD_CAST_IMG_TIP_ID])) {
			QZFL.widget.tips.close(t);
		}
	},
	_onMouseEnterBroadCastItem: function(target) {
		var isOwner = QZONE.FP.getQzoneConfig('isOwner');
		$e(target).find('.interact_op a').each(function(item) {
			if (isOwner && item.getAttribute('rel') == 'delete_btn') {
				$e(item).removeClass('none');
			}
			if (item.getAttribute('rel') == 'report_btn') {
				$e(item).removeClass('none')
			}
		})
	},
	_onMouseLeaveBroadCastItem: function(target) {
		$e(target).find('.interact_op a').addClass('none');
	},
	onMouseEnterImgIcon: function(target) {
		var _this = this,
			imgsrc = target.getAttribute('src');
		this.imgTipsTimerId = setTimeout(function() {
			_this._showImgBubble(imgsrc, target);
		}, 300);
	},
	onMouseLeaveImgIcon: function(target) {
		console.log('离开图片icon', target);
		clearTimeout(this.imgTipsTimerId);
		this._hideImgBubble();
	}
};
PageScheduler.triggerEvent('CommentContainerRendered', function() {
	BroadCastManager.init();
});
var NamecardScheduler = {
	start: function() {
		NamecardScheduler.loadScript();
		PageScheduler.triggerEvent('onContentNameCard', QZFL.object.bind(this, this.initContent));
		PageScheduler.triggerEvent('onCommentNameCard', QZFL.object.bind(this, this.initCommentList));
		PageScheduler.triggerEvent('onVisitorNameCard', QZFL.object.bind(this, this.initRecentVisitor));
		PageScheduler.triggerEvent('onMentionNameCard', QZFL.object.bind(this, this.initMentionDiv));
	},
	loaded: false,
	loadScript: function() {
		var g_oJSLoader = new QZONE.jsLoader();
		g_oJSLoader.onload = QZONE.event.bind(this, function() {
			this.loaded = true;
		});
		g_oJSLoader.load("http://" + IMGCACHE_DOMAIN + "/qzone/v5/namecardv2.js", document, "utf-8");
	},
	initContent: function() {
		if (!this._checkReady(this.initContent)) {
			return;
		}
		QZBlog.Util.TimerManager.setTimeout(function() {
			try {
				QZONE.namecard.init($("contentAuthorHref").parentNode);
				QZONE.namecard.init("blogDetailDiv");
			} catch (err) {}
		}, 2000);
	},
	initCommentList: function() {
		if (!this._checkReady(this.initCommentList)) {
			return;
		}
		QZBlog.Util.TimerManager.setTimeout(function() {
			try {
				QZONE.namecard.init("commentDiv");
			} catch (err) {}
		}, 2000);
	},
	initRecentVisitor: function() {
		if (!this._checkReady(this.initRecentVisitor)) {
			return;
		}
		try {
			QZONE.namecard.init($("visitorArea"));
		} catch (err) {}
	},
	initMentionDiv: function() {
		if (!this._checkReady(this.initMentionDiv)) {
			return;
		}
		QZBlog.Util.TimerManager.setTimeout(function() {
			try {
				QZONE.namecard.init("mentionDiv");
			} catch (err) {}
		}, 2000);
	},
	_checkReady: function(callback) {
		if (!this.loaded) {
			QZBlog.Util.TimerManager.setTimeout(QZONE.event.bind(this, callback), 100);
			return false;
		}
		return true;
	}
}
PageScheduler.triggerEvent('onStart', QZFL.object.bind(NamecardScheduler, NamecardScheduler.start));
var TCISDScheduler = {
	start: function() {
		if ( !! $("upperInteractive")) {
			QZFL.event.addEvent($("upperInteractive"), "mousedown", QZFL.event.bind(this, function() {
				var event = QZFL.event.getEvent();
				var target = QZFL.event.getTarget(event);
				this.dealInteractiveBar(target, true);
				return;
			}));
		}
		if ( !! $("footerInteractive")) {
			QZFL.event.addEvent($("footerInteractive"), "mousedown", QZFL.event.bind(this, function() {
				var event = QZFL.event.getEvent();
				var target = QZFL.event.getTarget(event);
				this.dealInteractiveBar(target, false);
				return;
			}));
		}
		var mapID = {
			'navigatorSpan1': 'NextBlog.Top',
			'navigatorSpan2': 'NextBlog.Bottom',
			'navigatorSpan4': 'PreviousBlog.Bottom',
			'upperReturnListArea': 'Return_list.Top',
			'footerReturnListArea': 'Return_list.Bottom',
			'visitorSettingSpan': 'Visitors.Set',
			'showVisitorSpan': 'Visitors.More',
			'hideVisitorSpan': 'Visitors.Hide',
			'switchSigHref': 'ShowSignature',
			'shareListTitle': 'Share.',
			'shareBlogBtn': 'Share.',
			'tweetBlogBtn': 'Share.twitter.',
			'modifyListTitle': 'Options.Edit.',
			'editBlogBtn': 'Options.Edit',
			'deleteBlogBtn': 'Options.Delete',
			'useLetterPagerBtn': 'Options.Use_LetterPaper',
			'write_templateblog_link': 'writenew',
			'bigFonts': 'Options.Fontsize.Big',
			'midFonts': 'Options.Fontsize.Medium',
			'smallFonts': 'Options.Fontsize.Small',
			'setBlogRightBtn': 'Options.Permissions_Set',
			'setBlogCateBtn': 'Options.Editcatalog',
			'setRecommendBlogBtn': 'Options.Recommendation',
			'setTopBlogBtn': 'Options.Top_Set',
			'setPrivateBlogBtn': 'Options.To_Private',
			'complaintBlogBtn': 'Options.Police',
			'appealtBlogBtn': 'Options.Appealt',
			'normalUseSignCheck': 'Comment.Signature',
			'propertySelect': 'Comment.Item',
			'cancelEditorHref': 'Comment.Cancel',
			'moreCommentEditorOptions': 'Comment.Advanced',
			'emotionInsertHref': 'Comment.Emotions'
		};
		QZBlog.Logic.TCISDClick.batchBind({
			'.year_vip': 'isd.vip.year.blogcomment',
			'.normal_vip': 'isd.vip.year.blogcomment'
		}, {
			url: '-',
			prepare: true,
			domain: 'mall.qzone.qq.com',
			container: $('commentDiv'),
			eventType: 'click'
		});
		QZFL.event.addEvent(document.body, 'mousedown', QZFL.object.bind(this, function(ev) {
			var tag = QZFL.event.getTarget(ev);
			var text = "";
			if (tag && tag.textContent != undefined) {
				text = tag.textContent;
			} else if (tag && tag.innerText != undefined) {
				text = tag.innerText;
			}
			var id = tag.id;
			var parent = tag.parentNode;
			var offsetParent = tag.offsetParent;
			if (tag && id && mapID[id]) {
				var hottag = mapID[id];
				var isTop = $("shareList").getAttribute("isTop") == "1" ? true : false;
				if (id == 'shareListTitle' || id == 'shareBlogBtn' || id == 'modifyListTitle' || id == 'tweetBlogBtn') {
					hottag += (isTop ? "Top" : "Bottom");
				}
				QZBlog.Logic.TCISDClick(hottag, InfoManager.TCISDURL);
			} else if (tag && parent && QZFL.css.hasClassName(parent, "mod_pagenav_count")) {
				var regIdx = /^[0-9]*[1-9][0-9]*$/i;
				if (regIdx.test(text) && QZFL.css.hasClassName(tag, "c_tx")) {
					QZBlog.Logic.TCISDClick('Pager.Page_Number', InfoManager.TCISDURL);
				}
			} else if (tag && text && parent && QZFL.css.hasClassName(parent, "mod_pagenav_main") && QZFL.css.hasClassName(tag, "c_tx")) {
				if (text == "上一页") {
					QZBlog.Logic.TCISDClick('Pager.Previous_Page', InfoManager.TCISDURL);
				} else if (text == "下一页") {
					QZBlog.Logic.TCISDClick('Pager.Next_Page', InfoManager.TCISDURL);
				}
			} else if (tag && text && parent && QZFL.css.hasClassName(parent, "mod_pagenav_turn")) {
				if (text == "确 定") {
					QZBlog.Logic.TCISDClick('Pager.Goto_Page', InfoManager.TCISDURL);
				}
			} else if ((tag && QZFL.css.hasClassName(tag, "icon_share")) || (text && text.indexOf("分享") == 0) || (parent && parent.id && parent.id == 'shareListTitle' && QZFL.css.hasClassName(tag, "mod_arr"))) {
				var isTop = $("shareList").getAttribute("isTop") == "1" ? true : false;
				QZBlog.Logic.TCISDClick('Share.' + (isTop ? "Top" : "Bottom"), InfoManager.TCISDURL);
			} else if ((tag && QZFL.css.hasClassName(tag, "icon_edit")) || (text && text == "编辑") || (parent && parent.id && parent.id == 'modifyListTitle' && QZFL.css.hasClassName(tag, "mod_arr"))) {
				var isTop = $("modifyList").getAttribute("isTop") == "1" ? true : false;
				QZBlog.Logic.TCISDClick('Options.Edit.' + (isTop ? "Top" : "Bottom"), InfoManager.TCISDURL);
			} else if (tag && parent && parent.id && parent.id == 'emotionInsertHref') {
				QZBlog.Logic.TCISDClick('Comment.Emotions', InfoManager.TCISDURL);
			} else if (tag && text && text == "发表") {
				QZBlog.Logic.TCISDClick('Comment.Post', InfoManager.TCISDURL);
			} else if (tag && text && text == "使用签名档" && QZFL.css.hasClassName(tag, "mod_arrange")) {
				QZBlog.Logic.TCISDClick('Comment.Signature', InfoManager.TCISDURL);
			} else if (tag && ((text && text == "回复" && QZFL.css.hasClassName(tag, "c_tx")) || (parent && QZFL.css.hasClassName(parent, "comments_box")) || (id && id.indexOf("substitutor_content") >= 0))) {
				QZBlog.Logic.TCISDClick('Reply', InfoManager.TCISDURL);
			} else if (tag && id && id.indexOf('commentMoreOP') >= 0) {
				QZBlog.Logic.TCISDClick('Reply.Options', InfoManager.TCISDURL);
			} else if (tag && text && text == "引用" && QZFL.css.hasClassName(tag, "c_tx")) {
				QZBlog.Logic.TCISDClick('Reply.Options.Quote', InfoManager.TCISDURL);
			} else if (tag && text && text == "删除" && QZFL.css.hasClassName(tag, "c_tx")) {
				QZBlog.Logic.TCISDClick('Reply.Options.Del', InfoManager.TCISDURL);
			} else if (tag && text && text == "举报" && QZFL.css.hasClassName(tag, "c_tx")) {
				QZBlog.Logic.TCISDClick('Reply.Options.Police', InfoManager.TCISDURL);
			} else if (tag && text && text == "加黑禁言" && QZFL.css.hasClassName(tag, "c_tx")) {
				QZBlog.Logic.TCISDClick('Reply.Options.Blacklist', InfoManager.TCISDURL);
			} else if (tag && ((text && text == "表情" && QZFL.css.hasClassName(tag, "add_emoticon")) || (parent && QZFL.css.hasClassName(parent, "add_emoticon")))) {
				QZBlog.Logic.TCISDClick('Reply.Emotions', InfoManager.TCISDURL);
			} else if (tag && ((text && text == "好友" && QZFL.css.hasClassName(tag, "add_at")) || (parent && QZFL.css.hasClassName(parent, "add_at")))) {
				QZBlog.Logic.TCISDClick('Reply.At', InfoManager.TCISDURL);
			} else if (tag && tag.value && tag.value == "发表") {
				QZBlog.Logic.TCISDClick('Reply.Post', InfoManager.TCISDURL);
			} else if (tag && tag.tagName && tag.tagName == 'IMG' && offsetParent && QZFL.css.hasClassName(offsetParent, "ui_avatar")) {
				QZBlog.Logic.TCISDClick('Reply.Picture', InfoManager.TCISDURL);
			} else if (tag && id && id.indexOf('_poster_nickname') >= 0) {
				QZBlog.Logic.TCISDClick('Reply.Nick', InfoManager.TCISDURL);
			} else if (tag && text && text == '转播到微博' && parent && QZFL.css.hasClassName(parent, "toolbar")) {
				QZBlog.Logic.TCISDClick('Photo.SynTwitter', InfoManager.TCISDURL);
			} else if (tag && text && text == '评论' && parent && QZFL.css.hasClassName(parent, "toolbar")) {
				QZBlog.Logic.TCISDClick('Photo.Comment', InfoManager.TCISDURL);
			}
		}));
	},
	dealInteractiveBar: function(target, isTop) {
		if (!target) {
			return;
		}
		var subfix = isTop ? ".Top" : ".Bottom";
		var text = QZONE.userAgent.ie ? target.innerText : target.textContent;
		if ((text && text.indexOf("赞") == 0) || QZFL.css.hasClassName(target, "icon_praise") || QZFL.css.hasClassName(target, "icon_praised") || QZFL.css.hasClassName(target, "icon_cancel")) {
			QZBlog.Logic.TCISDClick("Like" + subfix, InfoManager.TCISDURL);
		} else if ((text && text.indexOf("转载") == 0) || QZFL.css.hasClassName(target, "icon_reprint")) {
			QZBlog.Logic.TCISDClick("Reblog" + subfix, InfoManager.TCISDURL);
		} else if ((text && text.indexOf("评论") == 0) || QZFL.css.hasClassName(target, "icon_comment")) {
			QZBlog.Logic.TCISDClick("Comment" + subfix, InfoManager.TCISDURL);
		} else if ((text && text == "复制地址") || QZFL.css.hasClassName(target, "icon_copy")) {
			QZBlog.Logic.TCISDClick("Copylink" + subfix, InfoManager.TCISDURL);
		}
		return;
	}
}
PageScheduler.triggerEvent('onStart', QZFL.object.bind(TCISDScheduler, TCISDScheduler.start)); /*  |xGv00|4bd3c4ffeec7fead525fbe56efdb8ce9 */