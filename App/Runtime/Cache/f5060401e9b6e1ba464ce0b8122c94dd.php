<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh-cn">
<head> 
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
<meta name="keywords" content="邪恶漫画,dragonsom">
<meta name="description" content="邪恶漫画">
<meta name="author" content="" />
<meta name="copyright" content="www.dragonsom.com,版权所有">
<meta name="baidu-site-verification" content="iVvqEMxZQGW7JnG4" />
<meta name="360-site-verification" content="2eb84f4c1d73e4695ab35f0ed74f647a" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo ($title); ?></title>
<link rel="stylesheet" type="text/css" href="http://libs.baidu.com/bootstrap/2.3.1/css/bootstrap.min.css">
  <style type="text/css">
    	body{padding-top:40px}
    	.brand{ -webkit-transition: all .5s linear 0.1s;-moz-transition: all .5s linear 0.1s;}
        .nav li{ -webkit-transition: all .5s linear 0.1s;-moz-transition: all .5s linear 0.1s;}
        <?php if(date('N')%2): ?>.brand:hover{ -webkit-transform:scale(1.2);-moz-transform:scale(1.2);-webkit-transition: all .5s linear 0.1s;-moz-transition: all .5s linear 0.1s;}
    	.nav li:hover{ -webkit-transform:scale(1.2);-moz-transform:scale(1.2);-webkit-transition: all .5s linear 0.1s;-moz-transition: all .5s linear 0.1s;}
    	<?php else: ?>
        .brand:hover{ -webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transition: all .5s linear 0.1s;-moz-transition: all .5s linear 0.1s;}
    	.nav li:hover{ -webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transition: all .5s linear 0.1s;-moz-transition: all .5s linear 0.1s;}<?php endif; ?>
  </style>
<link href="http://libs.baidu.com/bootstrap/2.3.1/css/bootstrap-responsive.min.css" rel="stylesheet">
<script type="text/javascript" src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="http://libs.baidu.com/bootstrap/2.3.1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="__PUBLIC__/js/jquery.masonry.min.js"></script>
<script type="text/javascript" src="__PUBLIC__/js/jquery.lazyload.min.js"></script>
</head>
<body>
<div class="navbar navbar-fixed-top">
  <div class="navbar-inner">
  <div class="container">
    <a class="brand" href="http://www.dragonsom.com">dragonsom</a>
    <ul class="nav">
      <li <?php if($ac == 'Index') echo 'class="active"' ?> ><a href="<?php echo U('Index/index');?>">首页</a></li>
      <li><a target="_blank" href="__ROOT__/exchangePhoto">换照片</a></li>
      <li <?php if($ac == 'Html5') echo 'class="active"' ?> ><a href="__APP__/Html5">html5游戏</a></li>
      <li <?php if($ac == 'Xemh') echo 'class="active"' ?> ><a href="<?php echo U('Xemh/index');?>">邪恶漫画</a></li>
      <li><a target="_blank" href="__ROOT__/caipiao">中奖方法论</a></li>
      <li class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
          QQ邮箱采集工具
          <b class="caret"></b>
        </a>
        <ul class="dropdown-menu">
            <li><a href="__ROOT__/vfb" target="_blank">日志访客邮箱</a></li>
            <li><a href="__ROOT__/qzonesoso" target="_blank">空间说说关键字</a></li>
        </ul>
      </li>
    </ul>
    </div>
  </div>
</div>
<style type="text/css">
  	a{outline:none}
  	#image-show{position:relative;margin-top:20px;width:750px;margin:0 auto;text-align:center}
  	#image-show .prev {display: block;width: 50%;height: 100%;position: absolute;top: 0;left: 0;z-index: 100;}
	#image-show .next {display: block;width: 50%;height: 100%;position: absolute;top: 0;right: 0;z-index: 100;}
  	#image-show .prev:hover {cursor: url(__PUBLIC__/images/arrow-prev.gif),auto;zoom:1;}
	#image-show .next:hover {cursor: url(__PUBLIC__/images/arrow-next.gif),auto;zoom:1;}
   .imgtitle{margin:10px auto;text-align: center}
  	.loading {background: url(__PUBLIC__/images/loading.gif) no-repeat top center;}
</style>
  <script type="text/javascript">
    var imgdata=eval(<?php echo ($data); ?>);
    var pos=0;
    var sText=imgdata[0].add_intro;
    var sImg=imgdata[0].source;
    $(function(){
      $("img").lazyload({effect : "fadeIn"});
      $("#image-show").removeClass('loading');
      $("#image-show img").attr("src",imgdata[0].source);
      $(".imgtitle").text(imgdata[0].add_intro);
    });
    function prev(){
      $("#image-show").addClass('loading');
      $("#image-show img").fadeTo(0,0);
      window.scrollTo(0,0);
      pos=pos-1;
      if(pos <= 0){
      	pos=0;
      }
      var img=new Image();
      img.src=imgdata[pos].source;
      $(".imgtitle").text(imgdata[pos].add_intro);
      img.onload=function(){
         img.onload=null;
         $("#image-show").removeClass('loading');
       	 $("#image-show img").fadeTo(240,1);
         $("#image-show img").attr("src",imgdata[pos].source);
         bdShare.fn.conf.bdComment=bdShare.fn.conf.bdText=sText=imgdata[pos].add_intro;
         bdShare.fn.conf.bdPic=sImg=imgdata[pos].source;
      }
      img.src=imgdata[pos].source;
      if(img.complete){
      	 img.onload=null;
         $("#image-show").removeClass('loading');
       	 $("#image-show img").fadeTo(240,1);
         $("#image-show img").attr("src",imgdata[pos].source);
         bdShare.fn.conf.bdComment=bdShare.fn.conf.bdText=sText=imgdata[pos].add_intro;
         bdShare.fn.conf.bdPic=sImg=imgdata[pos].source;
      }
    }
    function next(){
      $("#image-show").addClass('loading');
      $("#image-show img").fadeTo(0,0);
      window.scrollTo(0,0);
      pos=pos+1;
      if(pos >= imgdata.length){
      	pos=imgdata.length-1;
      }
       var img=new Image();
       img.src=imgdata[pos].source;
       $(".imgtitle").text(imgdata[pos].add_intro);
       img.onload=function(){
         img.onload=null;
         $("#image-show").removeClass('loading');
         $("#image-show img").fadeTo(240,1);
         $("#image-show img").attr("src",imgdata[pos].source);
         bdShare.fn.conf.bdComment=bdShare.fn.conf.bdText=sText=imgdata[pos].add_intro;
         bdShare.fn.conf.bdPic=sImg=imgdata[pos].source;
       }
       img.src=imgdata[pos].source;
       if(img.complete){
      	 img.onload=null;
         $("#image-show").removeClass('loading');
       	 $("#image-show img").fadeTo(240,1);
         $("#image-show img").attr("src",imgdata[pos].source);
         bdShare.fn.conf.bdComment=bdShare.fn.conf.bdText=sText=imgdata[pos].add_intro;
         bdShare.fn.conf.bdPic=sImg=imgdata[pos].source;
       }
    }
  </script>
<div class="container" style="height:20px"></div>
  <div class="container">
    <div class="adleft"></div>
    <div class="imgtitle"></div>
    <div class="loading" id="image-show">
    	<img src="" />
      <a href="javascript:;" onfocus="this.blur()" onclick="prev();return false;" class="prev"></a>
      <a href="javascript:;" onfocus="this.blur()" onclick="next();return false;" class="next"></a>
    </div>
    <div class="adright"></div>
  </div>
  <p class="text-info" style="text-align:center">This is dragonsom.com</p>
<!-- Baidu Button BEGIN -->
<script type="text/javascript" id="bdshare_js" data="type=slide&amp;img=3&amp;pos=right&amp;uid=3072460" ></script>
<script type="text/javascript" id="bdshell_js"></script>
<a class="shareCount" style="display:none"></a> 
<script type="text/javascript">
  var bds_config = {
          'bdDes':'www.dragonsom.com',
          'bdText':sText,
          'bdComment':sText,
          'bdPic':sImg,
          'searchPic':1,
          'review':'normal'		//'请参考自定义分享回流签名'
  }
document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date()/3600000);
</script>
<!-- Baidu Button END -->
<div style="display:none;">
<script type="text/javascript">
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F52aa22b260ccf1aff9883b5f44382402' type='text/javascript'%3E%3C/script%3E"));
</script>
</div>
</body>
</html>