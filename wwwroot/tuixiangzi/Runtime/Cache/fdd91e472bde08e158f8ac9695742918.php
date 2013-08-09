<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html><html><head><meta http-equiv="content-type"content="text/html;charset=utf8"><title>小乌龟推箱子</title><link rel="stylesheet" href="__PUBLIC__/Buttons/font-awesome.min.css"><link rel="stylesheet" href="__PUBLIC__/Buttons/buttons.css"><link rel="stylesheet" href="__PUBLIC__/Messenger/css/messenger.css"><link rel="stylesheet" href="__PUBLIC__/Messenger/css/messenger-theme-future.css"><link rel="stylesheet" type="text/css" href="http://libs.baidu.com/bootstrap/2.3.1/css/bootstrap.min.css"><link href="http://libs.baidu.com/bootstrap/2.3.1/css/bootstrap-responsive.min.css" rel="stylesheet"><script type="text/javascript" src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script><script type="text/javascript" src="http://libs.baidu.com/bootstrap/2.3.1/js/bootstrap.min.js"></script><script type="text/javascript" src="__PUBLIC__/Messenger/js/messenger.min.js"></script><script type="text/javascript" charset="utf-8" src="http://fusion.qq.com/fusion_loader?appid=100722800&platform=qzone"></script><script type="text/javascript" src="http://ftp_dml.hzsx15.badudns.cc/Public/js/iioEngine.min.js"></script><script src="__PUBLIC__/js/tuixiangzi.js" type="text/javascript" charset="utf-8"></script><style type="text/css">            body{text-align:center;background-color:lightGrey}
            #oppanl{width:760px;margin:10px auto;text-align:center}
            #gamepanl{width:760px;margin:10px auto}
            #loading{text-align: center;z-index: 100;position: fixed;left: 0;top: 0;width: 100%;height:100%;padding: 10px;background: black;opacity:0.8;color: white;-webkit-border-radius: 10px;-moz-border-radius: 10px;border-radius: 10px;}
        </style><script type="text/javascript">        var leveldata=<?php echo $leveldata;?>;
        var level=1;
        function start(){
            $('#loading').show();
            $('#gamepanl').html('');
            iio.apps=[];
            iio.start(tuixiangzi.init,'gamepanl',leveldata.column*50,leveldata.row*50);
            $('#loading').hide();
        }
        tuixiangzi.success=function(){
            tuixiangzi.removeKeyboard();
            msg=Messenger().post({
              message: '恭喜过关,5秒后自动进入下一关,或者设计自己的关卡并向你的好友发起挑战',
   
              actions:{
                    next:{ label:'下一关',auto:true,delay:5,phrase:'下一关',action:function(){
                            msg.hide();
                           $.ajax({ type:'post',url:'<?php echo U("Index/passcuslevel");?>',success:function(r){
                            if('0' == r){
                                Messenger().post({
                                      message: '木有了？再来一次试试',
                                      type: 'error',
                                      showCloseButton: true,
                                      delay:3
                                    });
                            }else{
                                var ra=r.split('&&&');
                                $('#playtitle').text(ra[0]);
                                leveldata=JSON.parse(ra[1].replace(/\\/g,''));
                                start();
                            }
                           }});
                        }
                    },
                    design:{ label:'设计关卡',action:function(){
                        msg.hide();
                        window.location.href='<?php echo U("Index/edit");?>'
                    }}
                }
            });
        }
        function next(){
            $('#loading').show();
            $.ajax({ type:'post',url:'<?php echo U("Index/randomlevel");?>',success:function(r){
                            if('0' == r){
                                Messenger().post({
                                      message: '木有了？再来一次试试',
                                      type: 'error',
                                      showCloseButton: true,
                                      delay:3
                                    });
                            }else{
                                leveldata=eval('('+r+')');
                                start();
                            }
                            $('#loading').hide();
                }});
        }
        function share(){
            fusion2.dialog.sendStory({
                title :"来挑战我的关卡呀~",

                img:"http://ftp_dml.hzsx15.badudns.cc/Public/images/game/tuixiangzi.jpg",

                summary :"经典的推箱子游戏，玩家也可以自己设计关卡让你的好友来挑战",

                msg:"这是我设计的关卡，不指望你能通过，但可以试试嘛~~",

                button :"挑战关卡",

                source :"type=customer&level="+level,
            });
        }
        Messenger.options = {
            extraClasses: 'messenger-fixed messenger-on-top messenger-on-left',
            theme: 'future'
        }
        </script></head><body><div id="oppanl"><div style="display: inline-block;width: 150px;"><a style="text-decoration:none;color:white" href="javascript:;" onclick="next()" class="button button-circle button-highlight">换一关</a></div><div style="display:inline-block;width:320px"><button class="button" onclick="start()">重新开始</button><button onclick="$('#loading').show();window.location.href='__APP__/Index/edit'" class="button button-action">设计关卡</button><br><button onclick="$('#loading').show();window.location.href='__APP__/Index/customer'" style="width:300px" class="button button-royal">玩玩玩家设计的关卡</button></div><div style="display: inline-block;width: 150px;"><a style="text-decoration:none;color:white" href="javascript:;" onclick="share();" class="button button-circle button-highlight">考考好友</a></div></ul></div><div id="gamepanl"></div><div class="row footer" style="text-align:center;color:#6b6b6b">声明:本应用由董明理提供，若对本应用有任何意见或建议，请联系QQ:418005608</div></div><div id="loading" style="display:none"><img alt="Loading..." src="__PUBLIC__/images/6RMhx.gif"></div></body><script type="text/javascript">iio.start(tuixiangzi.init,'gamepanl',leveldata.column*50,leveldata.row*50);</script></html>