QZONE.module = QZONE.module || {};
QZONE.module.Visitor = function(_w) {
	var TOP = function(w) {
		var t = w;
		try {
			do t = t.parent; while (t != top)
		} catch (e) {}
		return t
	}(_w);
	var getData = function(send_data, succCb, errCb) {
		send_data.fupdate = 1;
		var url = "http://" + (TOP.g_Statistic_Domain || "g.qzone.qq.com") + "/cgi-bin/friendshow/cgi_get_visitor_simple",
			jg = new _w.QZFL.JSONGetter(url, "visitor_simple", send_data, "utf-8");
		jg.onSuccess = function(re) {
			if (re.code === 0) succCb(re.data);
			else {
				errCb && errCb(re);
				QZFL.console.print("\u8bbf\u5ba2\u6570\u636e\u62c9\u53d6\u5931\u8d25")
			}
		};
		jg.onError = function(re) {
			errCb && errCb(re);
			QZFL.console.print("\u8bbf\u5ba2\u6570\u636e\u62c9\u53d6\u5931\u8d25")
		};
		jg.send("_Callback")
	}, dataCache = {}, svp = QZONE.FP.getLoginBitmap(29),
		iLoginUin = TOP.checkLogin();
	var showMsg = function(msg, type) {
		TOP.QZFL.widget.msgbox.show(typeof msg == "string" ? msg : "\u670d\u52a1\u5668\u7e41\u5fd9\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5", type || 1, 2E3)
	};
	var Visitor = function(rawDatas) {
		this.rawDatas = rawDatas;
		this.itemDatas = [];
		this._from = 0;
		this._to = 0;
		this._packedData = {};
		this.dataLength = rawDatas.length;
		this.itemDeleted = new Event(this);
		this.visibleSetting = new Event(this)
	}, VisitorProto = {
			"writeVisibleData": function(type, uinList, cb) {
				var url = "http://" + TOP.g_W_Domain + "/cgi-bin/tfriend/cgi_set_visitor_hidelist",
					fs, uin = TOP.checkLogin(),
					iUin = TOP.g_iUin;
				if (uin !== iUin) uinList = iUin;
				fs = new _w.QZFL.FormSender(url, "POST", {
					"uin": uin,
					"action": type,
					"act_uinlist": uinList
				});
				fs.onSuccess = function(re) {
					if (re.code == 0) cb(re.data);
					else showMsg(re.message, 1)
				};
				fs.onError = showMsg;
				fs.send()
			},
			"setPackedData": function(p) {
				this._packedData =
					p
			},
			"proccess": function(index) {
				var item, sItem;
				if (!(item = this.itemDatas[index])) {
					sItem = this.rawDatas.splice(index - this.itemDatas.length, 1)[0];
					item = this.proccessData(sItem, index);
					item.onlineHTML = sItem.online == 1 ? '<b class="online" title="\u5728\u7ebf"></b>' : '<b class="offline" title="\u79bb\u7ebf"></b>';
					item.imgClass = sItem.src & 64 ? "" : "q_namecard"
				}
				return item
			},
			"proccessData": function(rawData, index) {},
			"setDataIndex": function(from, to) {
				this._from = from;
				this._to = to
			},
			"getItem": function(uin) {
				for (var i = this._from,
						d; i < this._to; i++) {
					d = this.itemDatas[i];
					if (d.uin == uin) return d
				}
			},
			"removeItemAction": function(uin, node) {
				var url = "http://" + TOP.g_W_Domain + "/cgi-bin/tfriend/friendshow_hide_visitor_onelogin",
					item = this.getItem(uin),
					data = QZFL.object.extend({
						"vuin": uin,
						"huin": TOP.g_iUin,
						"type": this.type,
						"src": item.src || 0
					}, this._packedData),
					fs, that = this;
				if (this.type == 1) {
					data.vuin = TOP.g_iUin;
					data.huin = uin
				}
				if (data.vuin == TOP.checkLogin() && this.type == 0) data.type = 1;
				item && item.src != undefined && (data.src = item.src);
				fs = new QZFL.FormSender(url,
					"POST", data, "utf-8"), fs.onSuccess = function(re) {
					if (!re.error) that.removeItem(uin, node)
				};
				fs.onError = showMsg;
				fs.send()
			},
			"visibleAction": function(action, uin, node) {
				var that = this;
				that.writeVisibleData(action == 0 ? 1 : 2, uin, function() {
					that.visibleSetting.notify(+!action, node);
					that.setVisible(uin, action)
				})
			},
			"setVisible": function(uin, visible) {
				var item = this.getItem(uin);
				item && (item.visible = visible)
			},
			"removeItem": function(uin, node) {
				var d, j;
				for (j = this._from; j < this._to; j++) {
					d = this.itemDatas[j];
					if (d.uin == uin) {
						this.itemDatas.splice(j,
							1);
						this._to--;
						break
					}
				}
				this.itemDeleted.notify(node)
			},
			"length": function() {
				return this.itemDatas.length + this.rawDatas.length
			},
			"getTime": function(time) {
				var tmp, td = new Date,
					nowt = new Date,
					d = 3600 * 24 * 1E3,
					fix8 = 3600 * 8 * 1E3,
					_nt = TOP.g_NowTime * 1E3,
					_t = time * 1E3;
				nowt.setTime(_nt);
				td.setTime(_t);
				_t = Math.floor((_nt + fix8) / d - Math.floor((_t + fix8) / d));
				if (_t < 1) tmp = timeFormatString(td, " {h}:{m}");
				else if (_t < 2) tmp = "\u6628\u5929";
				else if (_t < 3) tmp = "\u524d\u5929";
				else tmp = timeFormatString(td, td.getFullYear() != nowt.getFullYear() ?
						"{Y: }\u5e74{M: }\u6708" : "{M: }\u6708{d: }\u65e5").replace(/\s/g, "");
				return tmp
			}
		};
	var RefuseModel = function(d) {
		Visitor.call(this, d);
		this.type = 0;
		this.refuseModel = 1
	};
	RefuseModel.prototype = _w.QZFL.object.extend({}, VisitorProto, {
		"proccessData": function(d, index) {
			return this.itemDatas[index] = {
				"imgSrc": d.img,
				"imgAlt": d.name + "\u7684\u5934\u50cf",
				"nick": '<a data-click="visitor_nick" href="http://user.qzone.qq.com/' + d.uin + '" target="_blank"  class="name textoverflow q_namecard" link="nameCard_' + d.uin + '">' + d.name + "</a>",
				"vtime": this.getTime(d.time),
				"imgUrl": "http://user.qzone.qq.com/" + d.uin,
				"canDelete": 1,
				"vipHTML": QZONE.FP.getVipHTML({
					"lv": d.yellow,
					"isSuper": d.supervip
				}, "s"),
				"uin": d.uin,
				"nickName": d.name
			}
		}
	});
	var VisitMeModel = function() {
		Visitor.apply(this, Array.prototype.slice.call(arguments));
		this.type = 0
	};
	VisitMeModel.prototype = _w.QZFL.object.extend({}, VisitorProto, {
		"proccessData": function(d, index) {
			var isanonymous = d.src & 64,
				toData, alt = "",
				nick = "",
				isHost = TOP.checkLogin() == TOP.g_iUin,
				link;
			if (isanonymous) {
				if (d.loc) {
					nick =
						d.loc.replace(/.*\u7701(?=.*\u5e02)/, "").replace("\u5e02", "");
					alt = d.loc.replace(/\u7701/, "").replace("\u5e02", "")
				}
				alt = (alt && "\u6765\u81ea" + alt + "\u7684") + "\u672a\u767b\u5f55\u7f51\u53cb";
				toData = {
					"imgSrc": "http://" + TOP.siDomain + "/qzone_v6/gb/img/avatar_50.png",
					"imgAlt": alt,
					"nick": '<span class="name textoverflow" title="' + alt + '">' + (nick || "\u672a\u767b\u5f55") + "\u7f51\u53cb" + "</span>",
					"vtime": this.getTime(d.time),
					"imgUrl": "http://" + TOP.imgcacheDomain + "/qzone/v6/accessibility/baby.html",
					"canDelete": TOP.checkLogin() == _w.g_iUin ? 1 : 0,
					"vipHTML": "",
					"uin": d.uin,
					"src": d.src
				}
			} else {
				link = (d.src & 128 ? "http://www.pengyou.com/index.php?mod=profile&u=" : "http://user.qzone.qq.com/") + d.uin;
				toData = {
					"imgSrc": d.img,
					"imgAlt": d.name + "\u7684\u5934\u50cf",
					"nick": '<a data-click="visitor_nick" href="' + link + '" target="_blank" class="name textoverflow q_namecard" link="nameCard_' + d.uin + '" >' + d.name + "</a>",
					"vtime": this.getTime(d.time),
					"imgUrl": link,
					"canDelete": isHost || TOP.checkLogin() == d.uin ? 1 : 0,
					"vipHTML": QZONE.FP.getVipHTML({
						"lv": d.yellow,
						"isSuper": d.supervip
					}, "s"),
					"canHide": !isHost,
					"uin": d.uin,
					"src": d.src
				}
			}
			return this.itemDatas[index] = toData
		}
	});
	var VisitYouModel = function(d) {
		Visitor.call(this, d);
		this.type = 1
	};
	VisitYouModel.prototype = _w.QZFL.object.extend({}, VisitorProto, {
		"proccessData": function(d, index) {
			return this.itemDatas[index] || (this.itemDatas[index] = {
				"imgSrc": d.img,
				"imgAlt": d.name + "\u7684\u5934\u50cf",
				"nick": '<a data-click="visitor_nick" href="http://user.qzone.qq.com/' + d.uin + '" target="_blank" class="name textoverflow q_namecard" link="nameCard_' + d.uin + '" >' + d.name + "</a>",
				"vtime": this.getTime(d.time),
				"imgUrl": "http://user.qzone.qq.com/" + d.uin,
				"canDelete": 1,
				"visible": d.visible,
				"canHide": 1,
				"vipHTML": QZONE.FP.getVipHTML({
					"lv": d.yellow,
					"isSuper": d.supervip
				}, "s"),
				"uin": d.uin
			})
		}
	});
	var Event = function(sender) {
		this._sender = sender;
		this._listeners = []
	};
	Event.prototype = {
		attach: function(listener) {
			this._listeners.push(listener)
		},
		notify: function() {
			for (var i = 0; i < this._listeners.length; i++) this._listeners[i].apply(this._sender, Array.prototype.slice.call(arguments))
		}
	};
	var ViewBase = function(model, controller, opts) {
		var t = this,
			ul;
		t._model = model;
		t._controller = controller;
		t.container = opts.container ? $(opts.container) : null;
		if (t.container.tagName.toUpperCase() != "UL") if (t.container.firstChild && t.container.firstChild.tagName && t.container.firstChild.tagName.toUpperCase() == "UL") t.container = t.container.firstChild;
			else {
				ul = document.createElement("ul");
				this.container.innerHTML = "";
				this.container.appendChild(ul);
				this.container = ul
			}
		t._model.itemDeleted.attach(function(node) {
			t.removeNode(node);
			t.render(t._model._to, 1, {
				"isAppendMode": 1
			});
			opts.onDelete && opts.onDelete.call(node, _insCache[t.index])
		});
		t._model.visibleSetting.attach(function(action, node) {
			node.setAttribute("data-action", action);
			node.setAttribute("data-click", action == 1 ? "visitor_deleteforever" : "visitor_deleteforever_cancel");
			node.innerHTML = action == 1 ? "\u5bf9\u5176\u9690\u8eab\u8bbf\u95ee" : "\u53d6\u6d88\u9690\u8eab\u8bbf\u95ee";
			if (action == 1 || noVisibleConfirm) showMsg("\u8bbe\u7f6e\u6210\u529f\uff01", 4);
			else {
				var html = '<div class="qz_dialog_hint">' +
					'<i class="hint_icon icon_success"></i>' + '<div class="hint_main">' + '<h3 class="hint_tit">\u9690\u8eab\u8bbf\u95ee\u8bbe\u7f6e\u6210\u529f\uff01</h3>' + '<p class="hint_ct">\u60a8\u53ef\u4ee5\u5728<a href="javascript:;" class="to_setting">\u9690\u8eab\u8bbf\u95ee\u5217\u8868</a>\u4e2d\u53d6\u6d88\u8bbe\u7f6e\uff0c\u4e5f\u53ef\u4ee5\u8bbe\u7f6e\u5bf9\u5176\u4ed6\u4eba\u9690\u8eab\u8bbf\u95ee\u3002</p>' + "</div>" + "</div>",
					d = TOP.QZFL.dialog.create("\u6e29\u99a8\u63d0\u793a", html, {
						onLoad: QZFL.emptyFn,
						width: 350,
						height: 175,
						showMask: false,
						statusContent: '<input type="checkbox" class="input_chk" checked="checked" id="visible_nomore" />\u4ee5\u540e\u4e0d\u518d\u63d0\u793a',
						buttonConfig: [{
								type: QZFL.dialog.BUTTON_TYPE.Confirm,
								text: "\u786e\u5b9a"
							}
						],
						onLoad: function(dialog) {
							var E = QZFL.event;
							E.delegate(dialog.dialogContent, ".to_setting", "click", function(evt) {
								if (iLoginUin == TOP.g_iUin) {
									QZONE.FP.toApp("/friends/visitor?tab=setting");
									E.preventDefault(evt);
									dialog.unload()
								} else {
									this.target = "_blank";
									this.href = "http://user.qzone.qq.com/" +
										iLoginUin + "/friends/visitor?tab=setting"
								}
							})
						}
					});
				d.onUnload = function() {
					if (TOP.$("visible_nomore").checked) TOP.QZONE.FrontPage && TOP.QZONE.FrontPage.noShareDb && TOP.QZONE.FrontPage.noShareDb.set("VISITOR_VISIBLE_CONFIRM_" + iLoginUin, 1)
				}
			}
		});
		t.initEvent()
	}, ViewProto = {
			"template": ["{deleteHTML}", '<a href="{imgUrl}" class="ui_avatar {imgClass}" data-from="{dataFrom}" data-index="{index}" link="nameCard_{uin}" target="_blank" data-click="visitor_head"><img src="{imgSrc}" alt="{imgAlt}" />{onlineHTML}</a>', "{nick}{vipHTML}",
					'<div class="op c_tx3">{vtime}</div>'
			],
			"initEvent": function() {
				var E = QZFL.event,
					that = this,
					searchChain = function(dom, className) {
						var DEEP = 5,
							target = null;
						while (DEEP > 0 && dom.nodeType == 1) {
							if (QZFL.css.hasClassName(dom, className)) {
								target = dom;
								break
							}
							dom = dom.parentNode;
							DEEP--
						}
						return target
					};
				if (this.container._eventInit) return false;
				E.delegate(this.container, ".del_record", "click", function(evt) {
					E.preventDefault(evt);
					var dom = searchChain(this, "qz_del_ul"),
						uin = dom.dataset ? dom.dataset.uin : dom.getAttribute("data-uin");
					if (uin) that._controller.confirmDelete(uin, dom.parentNode)
				});
				E.delegate(this.container, "li", "mouseenter", function() {
					if (this.className != "bg") QZFL.css.addClassName(this, "li_hover")
				});
				E.delegate(this.container, "li", "mouseleave", function() {
					if (this.className != "bg") QZFL.css.removeClassName(this, "li_hover")
				});
				E.delegate(this.container, ".visible_setting", "click", function(evt) {
					E.preventDefault(evt);
					var dom = searchChain(this, "qz_del_ul"),
						uin = dom.dataset ? dom.dataset.uin : dom.getAttribute("data-uin"),
						action = this.dataset ?
							this.dataset.action : this.getAttribute("data-action");
					if (uin) {
						action = parseInt(action, 10);
						that._controller.visibleSetting(action, uin, this)
					}
				});
				E.delegate(this.container, ".qz_del_ul", "mouseenter", function(evt) {
					var CSS = QZFL.css;
					if (this.lastChild.className.indexOf("qz_del_ul_option") != -1) {
						CSS.removeClassName(this.lastChild, "none");
						CSS.addClassName(this.firstChild, "bg6")
					}
				});
				E.delegate(this.container, ".qz_del_ul", "mouseleave", function(evt) {
					var CSS = QZFL.css;
					if (this.lastChild.className.indexOf("qz_del_ul_option") != -1) {
						CSS.addClassName(this.lastChild, "none");
						CSS.removeClassName(this.firstChild, "bg6")
					}
				});
				E.delegate(this.container, ".allow_setting", "click", function(evt) {
					E.preventDefault();
					var dom = searchChain(this, "qz_del_ul"),
						name = dom.dataset ? dom.dataset.name : dom.getAttribute("data-name");
					uin = dom.dataset ? dom.dataset.uin : dom.getAttribute("data-uin");
					that._controller.allowUser(uin, name)
				});
				E.delegate(this.container, "a", "click", function(evt) {
					var clickData = this.dateset ? this.dataset.click : this.getAttribute("data-click");
					that._controller.sendClick(clickData);
					E.cancelBubble(evt)
				});
				this.container._eventInit = true
			},
			"render": function(from, length, opts) {
				var html = [],
					format = _w.QZFL.string.format,
					df = document.createDocumentFragment(),
					li, m, delHTML = [],
					to, complexDelete = 0,
					complexAllow = 0,
					ul;
				opts = opts || {};
				if (this._model.length()) {
					container = this.container;
					var onlyRenderOp = from == 0 && (container.dataset ? container.dataset.init : container.getAttribute("data-init")) ? true : false;
					length = length || 9999;
					to = Math.min(this._model.length(), from + length);
					for (var i = from; i < to; i++) {
						li = document.createElement("li");
						m = this._model.proccess(i);
						m.index = 1 + i;
						delHTML.length = 0;
						if (m.canDelete) {
							complexDelete = m.canHide && m.uin.toString().length < 20;
							complexAllow = this._model.refuseModel == 1;
							delHTML.push('<div class="qz_del_ul ', complexDelete || complexAllow ? "w90" : "w20", '" data-uin="', m.uin, '"', complexAllow ? "data-name=" + m.nickName + "" : "", ">", '<a class="c_tx3 ', complexDelete || complexAllow ? "index" : "del_record", ' top_del bg6_hover" ', complexDelete || complexAllow ? "" : 'title="\u5220\u9664"',
								'href="javascript:;">', complexAllow ? '<b class="ui_trig ui_trig_b"></b>' : "\u00d7", "</a>");
							if (complexDelete) delHTML.push('<div class="qz_del_ul_option bor2 none">', "<ul>", m.visible == 1 ? '<li class="bg"><a class="bg6_hover visible_setting" data-action="0" href="javascript:;" data-click="visitor_deleteforever_cancel">\u53d6\u6d88\u9690\u8eab\u8bbf\u95ee</a></li>' : '<li class="bg"><a class="bg6_hover visible_setting" data-action="1" href="javascript:;" data-click="visitor_deleteforever">\u5bf9\u5176\u9690\u8eab\u8bbf\u95ee</a></li>',
									'<li class="bg"><a class="bg6_hover del_record" href="javascript:;">\u5220\u9664\u672c\u6b21\u8bb0\u5f55</a></li>', "</ul>", "</div>");
							if (complexAllow) delHTML.push('<div class="qz_del_ul_option bor2 none">', "<ul>", '<li class="bg"><a class=" bg6_hover del_record" href="javascript:;">\u5220\u9664\u8bbf\u5ba2\u8bb0\u5f55</a></li>', '<li class="bg"><a class=" bg6_hover allow_setting" href="javascript:;">\u5141\u8bb8\u8bbf\u95ee\u7a7a\u95f4</a></li>', "</ul>", "</div>");
							delHTML.push("</div>")
						}
						if (onlyRenderOp) container.children[i] &&
								QZFL.dom.insertAdjacent(container.children[i], 1, delHTML.join(""), false);
						else {
							m.deleteHTML = delHTML.join("");
							if (!m.canHide) m.dataFrom = "visitor";
							else m.dataFrom = "";
							li.innerHTML = format(this.template.join(""), m);
							df.appendChild(li)
						}
					}
					if (!opts.isAppendMode && !onlyRenderOp) {
						container.innerHTML = "";
						this._model._from = from
					}
					if (!onlyRenderOp) container.appendChild(df);
					this._model._to = to
				} else opts.onEmpty && opts.onEmpty(this.container)
			},
			"append": function(from, length) {
				if (from == undefined) from = this._model._to;
				this.render(from,
					length, {
					"isAppendMode": 1
				})
			},
			"setIndex": function(i) {
				this.index = i
			},
			"removeNode": function(n) {
				QZFL.dom.removeElement(n)
			}
		};
	ViewBase.prototype = ViewProto;
	var ControllerBase = function(model) {
		this._model = model
	}, noVisibleConfirm = false;
	ControllerBase.prototype = {
		"confirmDelete": function(uin, node) {
			var m = "\u662f\u5426\u5220\u9664\u8be5\u8bbf\u95ee\u8bb0\u5f55\uff1f",
				c = new TOP.QZFL.widget.Confirm("\u6e29\u99a8\u63d0\u793a", "<div style='line-height:20px;'>" + m + "</div>", QZFL.widget.Confirm.TYPE.OK_NO),
				that = this;
			c.onConfirm = function() {
				that._model.removeItemAction(uin, node)
			};
			c.show();
			this.sendClick(iLoginUin == TOP.g_iUin ? "visitor_delete" : "guest_delete")
		},
		"visibleSetting": function(action, uin, node) {
			var db, key, html, that = this,
				d;
			if (!svp) {
				this.svpPromotion();
				return
			}
			db = TOP.QZONE.FrontPage && TOP.QZONE.FrontPage.noShareDb;
			key = "VISITOR_VISIBLE_CONFIRM_" + iLoginUin;
			if (db) if (action == 0) this._model.visibleAction(action, uin, node);
				else {
					noVisibleConfirm = db.get(key) == 1;
					html = '<div class="qz_dialog_hint">' + '<i class="hint_icon icon_warn"></i>' +
						'<div class="hint_main">' + '<h3 class="hint_tit">\u4f7f\u7528\u201c\u9690\u8eab\u8bbf\u95ee\u201d\u8c6a\u534e\u9ec4\u94bb\u7279\u6743</h3>' + '<p class="hint_ct">\u60a8\u662f\u5426\u60f3\u5bf9\u6b64\u4eba\u9690\u8eab\u8bbf\u95ee\uff1f' + (noVisibleConfirm ? '<br /><br />\u60a8\u53ef\u4ee5\u5728<a href="javascript:;" class="to_setting">\u9690\u8eab\u8bbf\u95ee\u5217\u8868</a>\u4e2d\u8fdb\u884c\u7ba1\u7406\u3002' : "") + "</p>" + "</div>" + "</div>";
					d = TOP.QZFL.dialog.create("\u6e29\u99a8\u63d0\u793a", html, {
						width: 320,
						height: 130,
						showMask: true,
						buttonConfig: [{
								type: QZFL.dialog.BUTTON_TYPE.Confirm,
								text: "\u786e\u5b9a",
								clickFn: function() {
									that._model.visibleAction(action, uin, node)
								}
							}, {
								type: QZFL.dialog.BUTTON_TYPE.Cancel,
								text: "\u53d6\u6d88"
							}
						],
						onLoad: function(dialog) {
							var E = QZFL.event;
							E.delegate(dialog.dialogContent, ".to_setting", "click", function(evt) {
								if (iLoginUin == TOP.g_iUin) {
									QZONE.FP.toApp("/friends/visitor?tab=setting");
									E.preventDefault(evt);
									dialog.unload()
								} else {
									this.target = "_blank";
									this.href = "http://user.qzone.qq.com/" +
										iLoginUin + "/friends/visitor?tab=setting"
								}
							})
						}
					})
				} else this._model.visibleAction(action, uin, node)
		},
		"svpPromotion": function() {
			var isVip = QZONE.FP.isVipUser(1),
				html = '<div class="qz_dialog_hint">' + '<i class="hint_icon icon_warn"></i>' + '<div class="hint_main">' + '<h3 class="hint_tit">\u8d76\u7d27' + (isVip ? "\u5347\u7ea7" : "\u5f00\u901a") + "\u8c6a\u534e\u7248\u9ec4\u94bb\u5427\uff01</h3>" + '<p class="hint_ct">\u8c6a\u534e\u7248\u9ec4\u94bb\u7528\u6237\u53ef\u4ee5\u8bbe\u7f6e\u201c\u9690\u8eab\u8bbf\u95ee\u201d\uff0c<br />\u8bbf\u95ee\u5b8c\u5168\u4e0d\u7559\u75d5\u8ff9\u3002</p>' +
					'<a href="' + (isVip ? "http://vip.qzone.com/supervip.html" : "http://pay.qq.com/qzone/index.shtml?ch=self&aid=zone.ystq") + '" target="_blank"><img src="http://' + TOP.siDomain + "/qzone_v6/img/qz_dialog/" + (isVip ? "update" : "open") + '_s_vip.png" class="update_s_vip"></a>' + "</div>" + "</div>",
				that = this;
			TOP.QZFL.dialog.create("\u6e29\u99a8\u63d0\u793a", html, {
				width: 320,
				height: 160,
				showMask: true,
				onLoad: function(d) {
					QZFL.event.delegate(d.dialogBody, "a", "click", function() {
						that.sendClick(isVip ? "upgrade_luxury" : "open_luxury")
					})
				}
			});
			this.sendClick(isVip ? "pv_upgrade_luxury" : "pv_open_luxury")
		},
		"sendClick": function(clickData) {
			var tc;
			clickData && (tc = TOP.TCISD) && tc.hotClick("visitor_module." + clickData + "." + this._model.modulename, "visitor.qzone.qq.com")
		},
		"allowUser": function(uin, nickName, time) {
			var k = QZONE.FP.getVisitPermit(true);
			if (k == 4) QZONE.FP.popupDialog("\u63a5\u53d7\u8bbf\u95ee\u8bf7\u6c42", {
					"src": ["/qzone/newfriend/friend_msg_setting.html", "?mode=nopower", "&ouin=", uin, "&id=", 0, "&flag=200", "&key=", uin, "&pflag=", "0x10000", "&time=",
						time, "&ureq=", 0
					].join("")
				}, 426, 200);
			else if (k == 1) {
				window.TCISD && TCISD.hotClick("newvisitor.authorise.allowbutton", "visitor.qzone.qq.com");
				var jg = new QZFL.JSONGetter("http://" + "r.qzone.qq.com" + "/cgi-bin/user/cgi_personal_card", "cgi_personal_card", {
					uin: uin,
					fupdate: 1
				}, "utf-8");
				jg.onSuccess = function(o) {
					if (o.code == 0) if (o.data.rflag == 1) QZONE.FP.showMsgbox("\u8be5\u4eba\u5df2\u7ecf\u62e5\u6709\u60a8\u7a7a\u95f4\u7684\u8bbf\u95ee\u6743\u9650\uff0c\u65e0\u9700\u518d\u6388\u6743\u3002", 1, 3E3);
						else QZONE.FP.popupDialog("\u63a5\u53d7\u8bbf\u95ee\u8bf7\u6c42", {
								"src": ["/qzone/newfriend/friend_msg_setting.html", "?mode=allow", "&ouin=", uin, "&name=", encodeURI(nickName), "&id=", 0, "&flag=200", "&key=", uin, "&pflag=", "258", "&ureq=", 0].join("")
							}, 426, 200)
				};
				jg.send("_Callback")
			} else if (k == 0) QZONE.FP.showMsgbox("\u60a8\u7684\u7a7a\u95f4\u8bbe\u7f6e\u4e3a\u6240\u6709\u4eba\u53ef\u89c1\uff0c\u5bf9\u65b9\u53ef\u4ee5\u8bbf\u95ee\u60a8\u7684\u7a7a\u95f4\uff01", 4, 2E3)
		}
	};
	var viewPanel = {
		"_constructor": function(mod, opts) {
			var packedData = {
				"mod": mod
			};
			opts.contentid && (packedData.contentid =
				opts.contentid);
			opts._packedData = packedData;
			getData(QZFL.object.extend({
				"uin": TOP.g_iUin,
				"mask": 2
			}, packedData), function(d) {
				buildFactory(VisitMeModel, ControllerBase, ViewBase, d.items, d, opts)
			}, opts.onError)
		},
		"icenter": function(opts) {
			var cfg = [{
					"mask": 3
				}, {
					"mask": 5,
					"key": "visitto_items"
				}, {
					"mask": 7,
					"mod": 8
				}
			][opts.which],
				modelClass = [VisitMeModel, VisitYouModel, RefuseModel][opts.which],
				itemKey;
			if (cfg) {
				if (opts.which == 2) opts._packedData = {
						"mod": cfg.mod
				};
				if (opts.dataSource) {
					d = opts.dataSource;
					buildFactory(modelClass,
						ControllerBase, ViewBase, d[cfg.key || "items"], d, opts)
				} else getData(QZFL.object.extend({
						"uin": TOP.g_iUin,
						"clear": 1
					}, cfg), function(d) {
						buildFactory(modelClass, ControllerBase, ViewBase, d[cfg.key || "items"], d, opts)
					}, opts.onError)
			}
		},
		"myhome": function(opts) {
			getData({
				"uin": TOP.g_iUin,
				"clear": 1,
				"mask": 3
			}, function(d) {
				buildFactory(VisitMeModel, ControllerBase, ViewBase, d.items, d, opts)
			}, opts.onError)
		},
		"blog": function(opts) {
			viewPanel._constructor(1, opts)
		},
		"photo": function(opts) {
			viewPanel._constructor(2, opts)
		}
	};
	var buildFactory = function(modelClass, controllerClass, viewClass, d, rawData, opts) {
		var c = ++_insCount,
			model = new modelClass(d),
			controller = new controllerClass(model),
			view = new viewClass(model, controller, opts),
			_ins;
		view.setIndex(c);
		opts._packedData && model.setPackedData(opts._packedData);
		opts.first_page_item && view.render(0, opts.first_page_item, {
			"onEmpty": opts.onEmpty
		});
		model.modulename = opts.type;
		_ins = {
			"index": c,
			"render": function() {
				view.render.apply(view, Array.prototype.slice.call(arguments))
			},
			"append": function() {
				view.append.apply(view,
					Array.prototype.slice.call(arguments))
			},
			"length": function() {
				return model.length()
			},
			"getStart": function() {
				return view._from
			},
			"getEnd": function() {
				return view._model._to - 1
			},
			"getData": function() {
				return rawData
			}
		};
		opts.onLoad && opts.onLoad(_ins);
		_insCache[c] = _ins
	}, _insCache = {}, _insCount = 0;
	return {
		"setup": function(opts) {
			opts = opts || {};
			var _construct = viewPanel[opts.type];
			if (_construct) return _construct(opts)
		}
	}
}(window);
/*  |xGv00|42784c670bed50f7f55e887cff413108 */