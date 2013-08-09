<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type"content="text/html;charset=utf8">
        <title>换照片</title>
        <link rel="stylesheet" type="text/css" href="http://libs.baidu.com/bootstrap/2.3.1/css/bootstrap.min.css">
        <!--<link rel="stylesheet" type="text/css" href="http://lib.sinaapp.com/bootstrap/2.3.1/css/bootstrap.min.css">-->
        <link href="http://libs.baidu.com/bootstrap/2.3.1/css/bootstrap-responsive.min.css" rel="stylesheet">
        <script type="text/javascript" src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript" src="http://libs.baidu.com/bootstrap/2.3.1/js/bootstrap.min.js"></script>
        <script type="text/javascript" charset="utf-8" src="http://fusion.qq.com/fusion_loader?appid=100715725&platform=qzone"></script>
        <style type="text/css">body{background: url(__TMPL__Public/images/blk.jpg)}.container{width:760px;margin:20px auto}#loading{text-align: center;z-index: 100;position: fixed;left: 35%;top: 240px;width: 200px;padding: 10px;background: black;opacity:0.8;color: white;-webkit-border-radius: 10px;-moz-border-radius: 10px;border-radius: 10px;}#img_preview{width: 640px;height: 480px;}
        </style>
        <script type="text/javascript"> var ua = {},imgdata,objReturn;(function() {var agent = navigator.userAgent,nv = navigator.appVersion,r, m;if (window.ActiveXObject) {ua.ie = 6;(window.XMLHttpRequest || agent.indexOf("MSIE 7.0") > -1) && (ua.ie = 7);(window.XDomainRequest || agent.indexOf("Trident/4.0") > -1) && (ua.ie = 8);agent.indexOf("Trident/5.0") > -1 && (ua.ie = 9);agent.indexOf("Trident/6.0") > -1 && (ua.ie = 10);ua.isBeta = navigator.appMinorVersion && navigator.appMinorVersion.toLowerCase().indexOf("beta") > -1;if (ua.ie < 7)try {document.execCommand("BackgroundImageCache", false, true)} catch (ign) {}} else if (document.getBoxObjectFor || typeof window.mozInnerScreenX != "undefined") {r = /(?:Firefox|GranParadiso|Iceweasel|Minefield).(d+.d+)/i;ua.firefox = parseFloat((r.exec(agent) || r.exec("Firefox/3.3"))[1], 10)} else if (!navigator.taintEnabled) {m = /AppleWebKit.(d+.d+)/i.exec(agent);ua.webkit = m ? parseFloat(m[1], 10) : document.evaluate ? document.querySelector ? 525 : 420 : 419;if ((m = /Chrome.(d+.d+)/i.exec(agent)) || window.chrome)ua.chrome = m ? parseFloat(m[1], 10) : "2.0";else if ((m = /Version.(d+.d+)/i.exec(agent)) || window.safariHandler)ua.safari = m ? parseFloat(m[1], 10) : "3.3";ua.air = agent.indexOf("AdobeAIR") > -1 ? 1 : 0;ua.isiPod = agent.indexOf("iPod") > -1;ua.isiPad = agent.indexOf("iPad") > -1;ua.isiPhone = agent.indexOf("iPhone") > -1} else if (window.opera) ua.opera = parseFloat(window.opera.version(), 10);else ua.ie = 6; if (!(ua.macs = agent.indexOf("Mac OS X") > -1)) {ua.windows = (m = /Windows.+?(d+.d+)/i.exec(agent), m && parseFloat(m[1], 10));ua.linux = agent.indexOf("Linux") > -1;ua.android =agent.indexOf("Android") > -1}ua.iOS = agent.indexOf("iPhone OS") > -1;!ua.iOS && (m = /OS (\d+(?:_\d+)*) like Mac OS X/i.exec(agent), ua.iOS = m && m[1] ? true : false)})();navigator.getMedia = ( navigator.getUserMedia ||navigator.webkitGetUserMedia ||navigator.mozGetUserMedia ||navigator.msGetUserMedia || function(){});function ph(){var canvas =document.createElement('canvas');var cw = $(v).width();var ch = $(v).height();canvas.width=cw;canvas.height=ch;var ctx = canvas.getContext('2d');ctx.fillStyle = "#ffffff";ctx.fillRect(0, 0, cw, ch);ctx.drawImage(v, 0, 0, cw,ch, 0,0, cw,ch);imgdata=canvas.toDataURL('image/jpeg');}
        </script>
        <script type="text/javascript">
            var openid='<?php echo ($userinfo["openid"]); ?>',openkey='<?php echo ($userinfo["openkey"]); ?>',iopenid='';
        </script>
    </head>
    <body>
      <div class="container">
        <div class="row">
            <div class="alert alert-error" style="display:none" id="div_alert">
                  <button type="button" class="close" data-dismiss="alert">&times;</button>
                  <strong>没有摄像头？</strong>没有摄像头就不能换照片了 :(
            </div>
        </div>
        <div class="row" id="div_video">
            <div style="float:left">
                <video class="img-polaroid" id="video" width="640" height="480" autoplay="">
                    <p class="text-error" style="width:640px;height:480px">We are sorry! your browser does not support html5 elements</p>
                </video>
            </div>
            <div style="float:left;margin:220px 0 0 20px">
                <button class="btn btn-info btn-large" id="btn_ph">拍照</button>
            </div>
        </div>
        <div class="row" id="div_prev" style="display:none">
            <div style="float:left">
                <img class="img-polaroid" width="640" height="480" id="img_preview" />
            </div>
           <div id="loading" style="display:none"><img alt="Loading..." src="__PUBLIC__/images/6RMhx.gif"></div>
            <div style="float:left;margin-left:20px;width:80px;" id="btnpanl_c">
                <button class="btn" style="margin-top:20px" id="btn_back"><i class="icon-arrow-left"></i></button>
                <button class="btn btn-success btn-large" style="margin-top:180px" id="btn_upload">上传交换</button>
            </div>
            <div style="float:left;margin-left:20px;width:80px;display:none;margin-top:180px" id="btnpanl_s">
                <button class="btn btn-info btn-large"  id="btn_friend">加TA</button>
                <button class="btn btn-success btn-large" style="margin-top:15px" id="btn_share" onclick="share();">分&nbsp;享</button>
            </div>
        </div>
        <div class="row footer" style="text-align:center;color:white">声明:本应用由董明理提供，若对本应用有任何意见或建议，请联系QQ:418005608</div>
      </div>
      <script type="text/javascript">
        var v=document.getElementById('video');navigator.getMedia({audio:false, video:true},function(s){v.src=webkitURL.createObjectURL(s)}, function(err){console.log(err);$('#div_alert').show();nomedia();});
        $(function(){
            $('#btn_ph').click(function(){
                ph();
                $('#img_preview').attr('src',imgdata);
                $('#div_video').fadeOut('fast',function(){ $('#div_prev').show();});
            });
            $('#btn_back').click(function(){
                $('#loading').hide();
                $('#div_prev').hide('slow',function(){ $('#div_video').animate({height:'toggle'});});
            });
            $('#btn_upload').click(function(){
                $('#btn_upload,#btn_back').attr('disabled','disabled');
                $('#loading').show();
                var cimgdata=imgdata.replace(/\+/g, "%2B");
                cimgdata = cimgdata.replace(/\&/g, "%26");
                $.ajax({
                    type:'post',
                    url:'<?php echo U("/Index/upload");?>',
                    data:'openid='+openid+'&imgdata='+cimgdata,
                    dataType:'json',
                    success:function(obj){
                        $('#loading').hide();
                        if(obj.status == 1){
                            $('#img_preview').attr('src',obj.data.imgdata);
                            iopenid=obj.data.openid;
                            objReturn=obj;
                        }
                        if("" == iopenid){
                            $('#btn_friend').hide();
                        }
                        $('#btnpanl_c').hide('fast',function(){ $('#btnpanl_s').show();});
                    }
                });
            });
        });
        function adpal(openid){fusion2.dialog.addPal ({openid : openid});}
        function share(){ fusion2.dialog.sendStory({ title :"我在这里找到了TA",img:"http://<?php echo ($_SERVER['HTTP_HOST']); ?>/exchangePhoto/view.php?type="+objReturn.type+"&pos="+objReturn.pos});}
        function nomedia(){ $('#div_video').hide();$('#div_prev').show();$('#loading').show();$.ajax({ type:'post',url:'<?php echo U("/Index/nomedia");?>',data:'',dataType:'json',success:function(obj){ $('#loading').hide();if(obj.status == 1){ $('#img_preview').attr('src',obj.data.imgdata);iopenid=obj.data.openid;objReturn=obj;}else{ $('#img_preview').attr('src','__TMPL__Public/images/oops.jpg');$('#btn_share').hide();}if("" == iopenid){ $('#btn_friend').hide();}$('#btnpanl_c').hide('fast',function(){ $('#btnpanl_s').show();});}});}
      </script>
    </body>
</html>