var PAR = {
	versions: function() {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		return {
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
			weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
			qq: u.match(/\sQQ/i) == " qq" //是否QQ
		};
	}(),
	'start': function() {
		$.ajax({
			url: "/admin/api.php",
			dataType: "json",
			success: function(e) {
				PAR.waittime = e.data.waittime
				PAR.ads = e.data.ads;
				config.logo = e.data.logo;
				up.pbgjz = e.data.pbgjz;
				up.trysee = e.data.trytime;
				config.sendtime = e.data.sendtime;
				config.color = e.data.color;
				config.group_x = PAR.ads.set.group;
				config.dmrule = e.data.dmrule;
				//config.group = PAR.getCookie('group_id');
				danmuon = e.data.danmuon;
				if (config.group < config.group_x && PAR.ads.state == 'on' && config.group != '') {
					if (PAR.ads.set.state == '1') {
						PAR.MYad.vod(PAR.ads.set.vod.url, PAR.ads.set.vod.link);
					} else if (PAR.ads.set.state == '2') {
						PAR.MYad.pic(PAR.ads.set.pic.link, PAR.ads.set.pic.time, PAR.ads.set.pic.img);
					}
				} else {
					PAR.play(config.url);
				}
			}
		});
	},
	'play': function(url) {
		if (!danmuon) {
			PAR.player.play(url);
		} else {
			if (config.av != '') {
				PAR.player.bdplay(url);
			} else {
				PAR.player.dmplay(url);
			}
		}
		$(function() {
			$(".yzmplayer-setting-speeds,.yzmplayer-setting-speed-item").on("click", function() {
				$(".speed-stting").toggleClass("speed-stting-open");
			});
			$(".speed-stting .yzmplayer-setting-speed-item").click(function() {
				$(".yzmplayer-setting-speeds  .title").text($(this).text());
			});
		});
		$(".yzmplayer-fulloff-icon").on("click", function() {
			PAR.dp.fullScreen.cancel();
		});
		$(".yzmplayer-showing").on("click", function() {
			PAR.dp.play();
			$(".vod-pic").remove();
		});
		if (config.title != '') {
			$("#vodtitle").html(config.title + '  ' + config.sid);
		};

	},
	'dmid': function() {
		if (up.diyid[0] == 0 && config.id != '') {
			a = config.id,
				b = config.sid
		} else if (up.diyid[0] == 1 || !config.id) {
			a = up.diyid[1],
				b = up.diyid[2]
		}
		PAR.id = a + ' P' + b
	},
	'load': function() {
		setTimeout(function() {
			$("#link1").fadeIn();
		}, 100);
		setTimeout(function() {
			$("#link1-success").fadeIn();
		}, 500);
		setTimeout(function() {
			$("#link2").show();
		}, 1 * 1000);
		setTimeout(function() {
			$("#link3,#span").fadeIn();
		}, 2 * 1000);
		if (PAR.versions.weixin && (PAR.versions.ios || PAR.versions.iPad)) {
			var css = '<style type="text/css">';
			css += '#loading-box{display: none;}';
			css += '</style>';
			$('body').append(css).addClass("");

		}
		PAR.danmu.send();
		PAR.danmu.list();
		PAR.def();
		PAR.video.try();
		PAR.dp.danmaku.opacity(1);
	},
	'def': function() {
		console.log('播放器开启');
		PAR.stime = 0;
		PAR.headt = yzmck.get("headt");
		PAR.lastt = yzmck.get("lastt");
		PAR.last_tip = parseInt(PAR.lastt) + 10;
		PAR.frists = yzmck.get('frists');
		PAR.lasts = yzmck.get('lasts');
		PAR.playtime = Number(PAR.getCookie("time_" + config.url));
		PAR.ctime = PAR.formatTime(PAR.playtime);
		PAR.dp.on("loadedmetadata", function() {
			PAR.loadedmetadataHandler();
		});
		PAR.dp.on("ended", function() {
			PAR.endedHandler();
		});
		PAR.dp.on('pause', function() {
			PAR.MYad.pause.play(PAR.ads.pause.link, PAR.ads.pause.pic);
		});
		PAR.dp.on('play', function() {
			PAR.MYad.pause.out();
		});
		PAR.dp.on('timeupdate', function(e) {
			PAR.timeupdateHandler();
		});
		PAR.jump.def()

	},
	'video': {
		'play': function() {
			$("#link3").text("视频已准备就绪，即将为您播放");
			setTimeout(function() {
				PAR.dp.play();
				$("#loading-box").remove();
				PAR.jump.head();
			}, 0);
		},
		'next': function() {
			top.location.href = up.mylink + config.next;
		},
		'try': function() {
			if (up.trysee > 0 && config.group < config.group_x && config.group != '') {
				$('#dmtext').attr({
					"disabled": true,
					"placeholder": "登陆后才能发弹幕yo(・ω・)"
				});
				setInterval(function() {
					var t = up.trysee * 60;
					var s = PAR.dp.video.currentTime;
					if (s > t) {
						PAR.dp.video.currentTime = 0;
						PAR.dp.pause();
						layer.confirm(up.trysee + "分钟试看已结束，请登录继续播放完整视频", {
							anim: 1,
							title: '温馨提示',
							btn: ['登录', '注册'],
							yes: function(index, layero) {
								top.location.href = up.mylink + "/index.php/user/login.html";
							},
							btn2: function(index, layero) {
								top.location.href = up.mylink + "/index.php/user/reg.html";
							}
						});
					}
				}, 1000);
			};
		},
		'seek': function() {
			PAR.dp.seek(PAR.playtime);
		},
		'end': function() {
			layer.msg("播放结束啦=。=");
		},
		'con_play': function() {
			if (!danmuon) {
				PAR.jump.head();
			} else {
				var conplayer =
					` <e>已播放至${PAR.ctime}，继续上次播放？</e><d class="conplay-jump">是 <i id="num">${PAR.waittime}</i>s</d><d class="conplaying">否</d>`
				$("#link3").html(conplayer);
				var span = document.getElementById("num");
				var num = span.innerHTML;
				var timer = null;
				setTimeout(function() {
					timer = setInterval(function() {
						num--;
						span.innerHTML = num;
						if (num == 0) {
							clearInterval(timer);
							PAR.video.seek();
							PAR.dp.play();
							$(".memory-play-wrap,#loading-box").remove();
						}
					}, 1000);
				}, 1);
			};
			var cplayer =
				`<div class="memory-play-wrap"><div class="memory-play"><span class="close">×</span><span>上次看到 </span><span>${PAR.ctime}</span><span class="play-jump">跳转播放</span></div></div>`
			$(".yzmplayer-cplayer").append(cplayer);
			$(".close").on("click", function() {
				$(".memory-play-wrap").remove();
			});
			setTimeout(function() {
				$(".memory-play-wrap").remove();
			}, 20 * 1000);
			$(".conplaying").on("click", function() {
				clearTimeout(timer);
				$("#loading-box").remove();
				PAR.dp.play();
				PAR.jump.head();
			});
			$(".conplay-jump,.play-jump").on("click", function() {
				clearTimeout(timer);
				PAR.video.seek();
				$(".memory-play-wrap,#loading-box").remove();
				PAR.dp.play();
			});

		}
	},
	'jump': {
		'def': function() {
			h = ".yzmplayer-setting-jfrist label";
			l = ".yzmplayer-setting-jlast label";
			f = "#fristtime";
			j = "#jumptime";
			a(h, 'frists', PAR.frists, 'headt', PAR.headt, f);
			a(l, 'lasts', PAR.lasts, 'lastt', PAR.lastt, j);

			function er() {
				layer.msg("请输入有效时间哟！");
			}

			function su() {
				layer.msg("设置完成，将在刷新或下一集生效");
			}

			function a(b, c, d, e, g, t) {
				$(b).on("click", function() {
					o = $(t).val();
					if (o > 0) {
						$(b).toggleClass('checked');
						su();
						g = $(t).val();
						yzmck.set(e, g);
					} else {
						er()
					};
				});
				if (d == 1) {
					$(b).addClass('checked');
					$(b).click(function() {
						o = $(t).val();
						if (o > 0) {
							yzmck.set(c, 0);
						} else {
							er()
						};
					});
				} else {
					$(b).click(function() {
						o = $(t).val();
						if (o > 0) {
							yzmck.set(c, 1);
						} else {
							er()
						};
					});
				}
			};
			$(f).attr({
				"value": PAR.headt
			});
			$(j).attr({
				"value": PAR.lastt
			});
			PAR.jump.last();
		},
		'head': function() {
			if (PAR.stime > PAR.playtime) PAR.playtime = PAR.stime;
			if (PAR.frists == 1) {
				if (PAR.headt > PAR.playtime || PAR.playtime == 0) {
					PAR.jump_f = 1
				} else {
					PAR.jump_f = 0
				}
			}
			if (PAR.jump_f == 1) {
				PAR.dp.seek(PAR.headt);
				PAR.dp.notice("已为您跳过片头");
			}
		},
		'last': function() {
			if (config.next != '') {
				if (PAR.lasts == 1) {
					setInterval(function() {
						var e = PAR.dp.video.duration - PAR.dp.video.currentTime;
						if (e < PAR.last_tip) PAR.dp.notice('即将为您跳过片尾');
						if (PAR.lastt > 0 && e < PAR.lastt) {
							PAR.setCookie("time_" + config.url, "", -1);
							PAR.video.next();
						};
					}, 1000);
				};
			} else {
				$(".icon-xj").remove();
			};
		},
		'ad': function(a, b) {}
	},
	'danmu': {
		'send': function() {
			g = $(".yzm-yzmplayer-send-icon");
			d = $("#dmtext");
			h = ".yzmplayer-comment-setting-";
			$(h + "color input").on("click", function() {
				r = $(this).attr("value");
				setTimeout(function() {
					d.css({
						"color": r
					});
				}, 100);
			});
			$(h + "type input").on("click", function() {
				t = $(this).attr("value");
				setTimeout(function() {
					d.attr("dmtype", t);
				}, 100);
			});

			$(h + "font input").on("click", function() {
				if (up.trysee > 0 && config.group == config.group_x) {
					layer.msg("会员专属功能");
					return;
				};
				t = $(this).attr("value");
				setTimeout(function() {
					d.attr("size", t);
				}, 100);
			});
			g.on("click", function() {
				a = document.getElementById("dmtext");
				a = a.value;
				b = d.attr("dmtype");
				c = d.css("color");
				z = d.attr("size");
				if (up.trysee > 0 && config.group < config.group_x && config.group != '') {
					layer.msg("登陆后才能发弹幕yo(・ω・)");
					return;
				}
				for (var i = 0; i < up.pbgjz.length; i++) {
					if (a.search(up.pbgjz[i]) != -1) {
						layer.msg("请勿发送无意义内容，规范您的弹幕内容");
						return;
					}
				}
				if (a.length < 1) {
					layer.msg("要输入弹幕内容啊喂！");
					return;
				}
				var e = Date.parse(new Date());
				var f = yzmck.get('dmsent', e);
				if (e - f < config.sendtime * 1000) {
					layer.msg('请勿频繁操作！发送弹幕需间隔' + config.sendtime + '秒~');
					return;
				}
				d.val("");
				PAR.dp.danmaku.send({
					text: a,
					color: c,
					type: b,
					size: z
				});
				yzmck.set('dmsent', e);
			});

			function k() {
				g.trigger("click");
			};
			d.keydown(function(e) {
				if (e.keyCode == 13) {
					k();
				};
			});
		},
		'list': function() {
			$(".yzmplayer-list-icon,.yzm-yzmplayer-send-icon").on("click", function() {
				$(".list-show").empty();
				$.ajax({
					url: config.api + "?ac=get&id=" + PAR.id,
					success: function(d) {
						if (d.code == 23) {
							a = d.danmuku;
							b = d.name;
							c = d.danum;
							$(".danmuku-num").text(c)
							$(a).each(function(index, item) {
								l =
									`<d class="danmuku-list" time="${item[0]}"><li>${PAR.formatTime(item[0])}</li><li title="${item[4]}">${item[4]}</li><li title="用户：${item[3]}  IP地址：${item[5]}">${item[6]}</li><li class="report" onclick="PAR.danmu.report(\'${item[5]}\',\'${b}\',\'${item[4]}\',\'${item[3]}\')">举报</li></d>`
								$(".list-show").append(l);
							})
						}
						$(".danmuku-list").on("dblclick", function() {
							PAR.dp.seek($(this).attr("time"))
						})
					}
				});
			});

			$(".yzmplayer-watching-number").text(up.usernum);
			$(".yzmplayer-info-panel-item-title-amount .yzmplayer-info-panel-item-title").html("违规词");
			for (var i = 0; i < up.pbgjz.length; i++) {
				var gjz_html = "<e>" + up.pbgjz[i] + "</e>";
				$("#vod-title").append(gjz_html);
			}
			add('.yzmplayer-list-icon', ".yzmplayer-danmu", 'show');

			function add(div1, div2, div3, div4) {
				$(div1).click(function() {
					$(div2).toggleClass(div3);
					$(div4).remove();
				});
			}
		},
		'report': function(a, b, c, d) {
			layer.confirm('' + c + '<!--br><br><span style="color:#333">请选择需要举报的类型</span-->', {
				anim: 1,
				title: '举报弹幕',
				btn: ['违法违禁', '色情低俗', '恶意刷屏', '赌博诈骗', '人身攻击', '侵犯隐私', '垃圾广告', '剧透', '引战'],
				btn3: function(index, layero) {
					PAR.danmu.post_r(a, b, c, d, '恶意刷屏');
				},
				btn4: function(index, layero) {
					PAR.danmu.post_r(a, b, c, d, '赌博诈骗');
				},
				btn5: function(index, layero) {
					PAR.danmu.post_r(a, b, c, d, '人身攻击');
				},
				btn6: function(index, layero) {
					PAR.danmu.post_r(a, b, c, d, '侵犯隐私');
				},
				btn7: function(index, layero) {
					PAR.danmu.post_r(a, b, c, d, '垃圾广告');
				},
				btn8: function(index, layero) {
					PAR.danmu.post_r(a, b, c, d, '剧透');
				},
				btn9: function(index, layero) {
					PAR.danmu.post_r(a, b, c, d, '引战');
				}
			}, function(index, layero) {
				PAR.danmu.post_r(a, b, c, d, '违法违禁');
			}, function(index) {
				PAR.danmu.post_r(a, b, c, d, '色情低俗');
			});
		},
		'post_r': function(a, b, c, d, type) {
			$.ajax({
				type: "get",
				url: config.api + '?ac=report&cid=' + d + '&user=' + a + '&type=' + type + '&title=' + b + '&text=' + c,
				cache: false,
				dataType: 'json',
				beforeSend: function() {},
				success: function(data) {
					layer.msg("举报成功！感谢您为守护弹幕作出了贡献");
				},
				error: function(data) {
					var msg = "服务故障 or 网络异常，稍后再试6！";
					layer.msg(msg);
				}
			});
		}
	},
	'setCookie': function(c_name, value, expireHours) {
		var exdate = new Date();
		exdate.setHours(exdate.getHours() + expireHours);
		document.cookie = c_name + "=" + escape(value) + ((expireHours === null) ? "" : ";expires=" + exdate.toGMTString());
	},
	'getCookie': function(c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start !== -1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end === -1) {
					c_end = document.cookie.length;
				};
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}
		return "";
	},
	'formatTime': function(seconds) {
		return [parseInt(seconds / 60 / 60), parseInt(seconds / 60 % 60), parseInt(seconds % 60)].join(":").replace(
			/\b(\d)\b/g, "0$1");
	},
	'loadedmetadataHandler': function() {
		if (PAR.playtime > 0 && PAR.dp.video.currentTime < PAR.playtime) {
			setTimeout(function() {
				PAR.video.con_play()
			}, 1 * 1000);
		} else {
			setTimeout(function() {
				if (!danmuon) {
					PAR.jump.head();
				} else {
					PAR.dp.notice("视频已准备就绪，即将为您播放");
					PAR.video.play()
				}
			}, 0);

		}
		PAR.dp.on("timeupdate", function() {
			PAR.timeupdateHandler();
		});
	},
	'timeupdateHandler': function() {
		PAR.setCookie("time_" + config.url, PAR.dp.video.currentTime, 24);
	},
	'endedHandler': function() {
		PAR.setCookie("time_" + config.url, "", -1);
		if (config.next != '') {
			PAR.dp.notice("5s后,将自动为您播放下一集");
			setTimeout(function() {
				PAR.video.next();
			}, 5 * 1000);
		} else {
			PAR.dp.notice("视频播放已结束");
			setTimeout(function() {
				PAR.video.end();
			}, 2 * 1000);
		}
	},
	'player': {
		'play': function(url) {
			$('body').addClass("danmu-off");
			PAR.dp = new yzmplayer({
				autoplay: true,
				element: document.getElementById('player'),
				theme: config.color,
				logo: config.logo,
				video: {
					url: url,
					pic: config.pic,
					type: 'auto',
				},
			});
			var css = '<style type="text/css">';
			css += '#loading-box{display: none;}';
			css += '</style>';
			$('body').append(css).addClass("");
			PAR.def();
			//PAR.jump.head();				
		},
		'adplay': function(url) {
			$('body').addClass("danmu-off");
			PAR.ad = new yzmplayer({
				autoplay: true,
				element: document.getElementById('ADplayer'),
				theme: config.color,
				logo: config.logo,
				video: {
					url: url,
					pic: config.pic,
					type: 'auto',
				},
			});
			$('.yzmplayer-controller,.yzmplayer-cplayer,.yzmplayer-logo,#loading-box,.yzmplayer-controller-mask').remove();
			$('.yzmplayer-mask').show();
			PAR.ad.on('timeupdate', function() {
				if (PAR.ad.video.currentTime > PAR.ad.video.duration - 0.1) {
					$('body').removeClass("danmu-off");
					PAR.ad.destroy();
					$("#ADplayer").remove();
					$("#ADtip").remove();
					PAR.play(config.url);
				}
			});
		},
		'dmplay': function(url) {
			PAR.dmid();
			PAR.dp = new yzmplayer({
				autoplay: false,
				element: document.getElementById('player'),
				theme: config.color,
				logo: config.logo,
				video: {
					url: url,
					pic: config.pic,
					type: 'auto',
				},
				danmaku: {
					id: PAR.id,
					api: config.api + '?ac=dm',
					user: config.user
				}
			});
			PAR.load();

		},
		'bdplay': function(url) {
			PAR.dmid();
			PAR.dp = new yzmplayer({
				autoplay: false,
				element: document.getElementById('player'),
				theme: config.color,
				logo: config.logo,
				video: {
					url: url,
					pic: config.pic,
					type: 'auto',
				},
				danmaku: {
					id: PAR.id,
					api: config.api + '?ac=dm',
					user: config.user,
					addition: [config.api + 'bilibili/?av=' + config.av]
				}
			});
			PAR.load();
		}
	},
	'MYad': {
		'vod': function(u, l) {
			$("#ADtip").html('<a id="link" href="' + l + '" target="_blank">查看详情</a>');
			$("#ADplayer").click(function() {
				document.getElementById('link').click();
			});
			PAR.player.adplay(u);
		},
		'pic': function(l, t, p) {
			$("#ADtip").html('<a id="link" href="' + l + '" target="_blank">广告 <e id="time_ad">' + t + '</e></a><img src="' +
				p + '">');
			$("#ADtip").click(function() {
				document.getElementById('link').click();
			});
			var span = document.getElementById("time_ad");
			var num = span.innerHTML;
			var timer = null;
			setTimeout(function() {
				timer = setInterval(function() {
					num--;
					span.innerHTML = num;
					if (num == 0) {
						clearInterval(timer);
						PAR.play(config.url);
						$('#ADtip').remove();
					}
				}, 1000);
			}, 1);

		},
		'pause': {
			'play': function(l, p) {
				if (PAR.ads.pause.state == 'on') {
					var pause_ad_html = '<div id="player_pause"><div class="tip">广告</div><a href="' + l +
						'" target="_blank"><img src="' + p + '"></a></div>';
					$('#player').before(pause_ad_html);
				}
			},
			'out': function() {
				$('#player_pause').remove();
			}
		}
	}

}


// 控制台报错
//setInterval(function() {
//window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized ? t("on") : (a = "off", ("undefined"!==typeof console.clear) && console.clear());
//debugger;
//}, 10);
