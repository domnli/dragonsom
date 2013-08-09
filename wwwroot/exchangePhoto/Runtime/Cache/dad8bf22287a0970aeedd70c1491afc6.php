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
        </style>
        <script type="text/javascript">
        function del(type,pos){
            $.ajax({
                type:'post',
                url:"<?php echo U('/Manage/delete');?>",
                data:'type='+type+'&pos='+pos,
                success:function(r){
                    if(1 == r){
                        $("#spn_total").text(parseInt($("#spn_total").text())-1);
                        $('#li'+pos).hide();
                    }
                }
            });
        }
        </script>
    </head>
    <body>
      <div class="container">
        <div class="navbar">
          <div class="navbar-inner">
            <a class="brand" href="#">照片管理</a>
            <ul class="nav">
              <li><a href="<?php echo U('Manage/index');?>">SEXY上传</a></li>
              <li class="<?php echo ($type == 'user' ? 'active':''); ?>"><a href="__ACTION__/type/user">用户池</a></li>
              <li class="<?php echo ($type == 'sexy' ? 'active':''); ?>"><a href="__ACTION__/type/sexy">SEXY池</a></li>
            </ul>
          </div>
        </div>
        <strong>total:<span id="spn_total"><?php echo ($realtotal); ?></span></strong>
        <?php if($page["start"] != 1): ?><a class="link" href="__ACTION__/type/<?php echo ($type); ?>/p/<?php echo ($page['p']-1); ?>"><<<</a><?php endif; ?>
        <?php if($page["more"] == 1): ?><a class="link" href="__ACTION__/type/<?php echo ($type); ?>/p/<?php echo ($page['p']+1); ?>">>>></a><?php endif; ?>
        <ul class="thumbnails">
            <?php $__FOR_START_27273__=$page["start"];$__FOR_END_27273__=$page["end"];for($i=$__FOR_START_27273__;$i <= $__FOR_END_27273__;$i+=1){ ?><li class="span3" id="li<?php echo ($i); ?>">
                    <div class="thumbnail">
                      <img src="__ROOT__/exchangePhoto/view.php?type=<?php echo ($type); ?>&pos=<?php echo ($i); ?>" alt="">
                      <button class="btn btn-danger" style="margin:5px 0 0 90px" onclick="del('<?php echo ($type); ?>',<?php echo ($i); ?>)">删除</button>
                    </div>
                </li><?php } ?>
        </ul>

      </div>
    </body>
</html>