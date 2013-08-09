<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type"content="text/html;charset=utf8">
        <title>照片管理</title>
        <link rel="stylesheet" type="text/css" href="http://libs.baidu.com/bootstrap/2.3.1/css/bootstrap.min.css">
        <link href="http://libs.baidu.com/bootstrap/2.3.1/css/bootstrap-responsive.min.css" rel="stylesheet">
        <script type="text/javascript" src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript" src="http://libs.baidu.com/bootstrap/2.3.1/js/bootstrap.min.js"></script>
        <!--<script type="text/javascript" src="__TMPL__/Public/pixastic/pixastic.core.js"></script>-->
        <script type="text/javascript" charset="utf-8" src="http://fusion.qq.com/fusion_loader?appid=100715725&platform=qzone"></script>
        <style type="text/css">
        #loading{text-align: center;z-index: 100;position: fixed;left: 23%;top: 240px;width: 200px;padding: 10px;background: black;opacity:0.8;color: white;-webkit-border-radius: 10px;-moz-border-radius: 10px;border-radius: 10px;}
        </style>
        <script type="text/javascript">
            var imgdata,v;
            $(function(){
                v=document.getElementById('imgprev');
                $('#btnsave').click(function(){
                    $(this).attr('disabled','disabled');
                    ph();
                    $('#loading').show();
                    var cimgdata=imgdata.replace(/\+/g, "%2B");
                    cimgdata = cimgdata.replace(/\&/g, "%26");
                    $.ajax({
                        type:'post',
                        url:'<?php echo U("/Manage/upload");?>',
                        data:'imgdata='+cimgdata,
                        dataType:'json',
                        success:function(obj){
                            $('#loading').hide();
                            if(obj.status == 1){
                                alert('保存成功');
                                window.location.reload();
                            }
                        }
                    });
                });
            });
            function ph(){ var canvas =document.createElement('canvas');canvas.width=640;canvas.height=480;var ctx = canvas.getContext('2d');ctx.fillStyle = "#ffffff";ctx.fillRect(0, 0, 640, 480);ctx.drawImage(v, 0, 0, <?php echo ($image["w"]); ?>,<?php echo ($image["h"]); ?>, 0,0, 640,480);imgdata=canvas.toDataURL('image/jpeg');}
        </script>
    </head>
    <body>
      <div class="container">
        <div class="navbar">
          <div class="navbar-inner">
            <a class="brand" href="#">照片管理</a>
            <ul class="nav">
              <li class="active"><a href="#">SEXY上传</a></li>
              <li><a href="./pool/type/user">用户池</a></li>
              <li><a href="./pool/type/sexy">SEXY池</a></li>
            </ul>
          </div>
        </div>
        <?php if(isset($error)): ?><div class="alert">
              <button type="button" class="close" data-dismiss="alert">&times;</button>
              <strong>Warning!</strong><?php echo ($error); ?>
            </div><?php endif; ?>
        <?php if(!isset($image)): ?><form action="<?php echo U('Manage/index');?>" method="post" enctype="multipart/form-data">
                <input type="file" name="upload" />
                <button class="btn" type="submit">预览</button>支持.gif .jpg 不大于100k
            </form>
        <?php else: ?>
            <div style="width:640px"> 
                <div><span class="label">预览</span>&nbsp;&nbsp;</div>
                <div style="margin:0 0 10px 60px"><button class="btn btn-small" id="btnsave">上传</button></div>
                <img id="imgprev" src="__ROOT__/exchangePhoto/Runtime/Temp/<?php echo ($image["filename"]); ?>" style="width:640px;height:480px"/>
                <div id="loading" style="display:none"><img alt="Loading..." src="__PUBLIC__/images/6RMhx.gif"></div>
            </div><?php endif; ?>
      </div>
    </body>
</html>