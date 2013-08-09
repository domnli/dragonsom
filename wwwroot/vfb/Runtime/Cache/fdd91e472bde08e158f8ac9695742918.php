<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type"content="text/html;charset=utf8">
        <title>空间日志--登录态</title>
        <link rel="stylesheet" type="text/css" href="http://lib.sinaapp.com/js/bootstrap/latest/css/bootstrap.min.css">
        <link href="http://lib.sinaapp.com/js/bootstrap/latest/css/bootstrap-responsive.css" rel="stylesheet">
        <script type="text/javascript" src="http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="http://lib.sinaapp.com/js/bootstrap/latest/js/bootstrap.min.js"></script>
        <style type="text/css">
            .prettyprint {padding: 8px;background-color: #F7F7F9;border: 1px solid #E1E1E8;}
        </style>
        <script type="text/javascript">
            $(function(){
                $('#checkls').click(function(){
                    var uin=$.trim($('#uin').val());
                    var skey=$.trim($('#skey').val());
                    var g_tk=$.trim($('#g_tk').val());
                    if('' == uin || '' == skey || '' == g_tk){
                        return;
                    }
                    $.ajax({
                        type:'post',
                        url:"<?php echo U('/Index/check');?>",
                        data:'uin='+uin+'&skey='+skey+'&g_tk='+g_tk,
                        success:function(msg){
                            if(-1 == msg){
                                $('.alert-error').text('连接到腾讯服务器失败').fadeIn('slow',function(){setTimeout("$('.alert-error').fadeOut()",3000)});
                                return;
                            }
                            if(1 != msg){
                                $('.alert-error').text('验证失败,失败原因：'+msg).fadeIn('slow',function(){setTimeout("$('.alert-error').fadeOut()",3000)});
                                return;
                            }
                            $('.alert-success').text('验证成功，正在跳转。。。')
                                                .fadeIn('slow',function(){
                                                    setTimeout("window.location.href='"+"<?php echo U('/Index/detail');?>"+"'",2000)
                                                });
                        }
                    });
                });
            });
        </script>
    </head>
    <body>
      <div class="container">
        <div class="span9">

        </div>
        <div class="span5 form-inline" style="margin-top:20px">
            <input id="uin" type="text" class="input-small" placeholder="QQ" value="">
            <input id="skey" type="text" class="input-small" placeholder="skey" value="">
            <input id="g_tk" type="text" class="input-small" placeholder="g_tk" value="">
            <button id="checkls" type="button" class="btn btn-primary">check</button>
            <div class="alert alert-success" style="display:none"></div>
            <div class="alert alert-error" style="display:none"></div>
        </div>
         <div class="span9 prettyprint" style="margin-top:20px">
            <h3>如何获取skey和g_tk？</h3>
            <a href="javascript:'skey:'+QZFL.cookie.get('skey')+'&lt;br/&gt;g_tk:'+QZFL.pluginsDefine.getACSRFToken()" class="btn"><i class="icon-star" style="margin-top:0px"></i>获取skey&g_tk</a>
            <p class="text-info" style="margin-top:10px">采集该用户日志访客的QQ邮箱，需要用到该用户QQ的登录态，按下列步骤获取：</p>
            <p class="text-warning" style="margin-top:10px">1.拖动上述按钮到浏览器书签栏(IE浏览器：右键添加到收藏夹)</p>
            <p class="text-warning">2.在需要获取的帐号<a href="http://qzone.qq.com" target="_blank">QQ空间</a>登录状态下，点击书签栏/收藏夹中的按钮即可获取所需的skey和g_tk</p>
        </div>
      </div>
    </body>
</html>