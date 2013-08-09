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
<!--<script type="text/javascript" src="https://raw.github.com/sbiermanlytle/iioengine/master/core/iioEngine.js"></script>-->
<script type="text/javascript" src="http://ftp_dml.hzsx15.badudns.cc/Public/js/iioEngine.min.js"></script>
<!--<script type="text/javascript" src="http://iioengine.com/js/iioDebugger.js"></script>-->
<script src="http://libs.baidu.com/json/json2/json2.js"></script>
<style type="text/css">
body{text-align: center}
</style>
<div class="row form-inline" style="margin:5px auto">
     <input type="text" class="input-small" id="txtrow" placeholder="输入行(大于4)">
     <input type="text" class="input-small" id="txtcolumn" placeholder="输入列(大于4)">
     <button type="button" class="btn" onclick="startedit()">重置</button>
     <button type="button" class="btn" style="display:none" id="btnplay" onclick="startgame()">试玩</button>
     <button type="button" class="btn" style="display:none" id="btnfinish" onclick="finish()">完成</button>
     <p class="text-error" style="display:none"></p>
</div>
<div id="canvaspanl"></div>
<script src="__TMPL__Public/js/tuixiangzi.js" type="text/javascript" charset="utf-8"></script>
<script>
    var leveldata={};
    function startgame(){
        if(undefined == leveldata.map || undefined == leveldata.boxes || undefined == leveldata.row || undefined == leveldata.column || undefined == leveldata.person){
            return;
        }
        //检查箱子数量和红色区域数量是否相同
        var amountred=0;
        for(var i=0;i<leveldata.map.length;i++){
            for(var j=0;j<leveldata.map[i].length;j++){
                if(leveldata.map[i][j] == 3){
                    amountred++;
                }
            }
        }
        if(amountred != leveldata.boxes.length){
            alert('箱子数量和目标区域数量不一致');
            return;
        }
        $('#canvaspanl').html('');
        iio.apps=[];
        iio.start(tuixiangzi.init,'canvaspanl',leveldata.column*50,leveldata.row*50);   
        tuixiangzi.success=function(){
            alert('win');
            $('#btnfinish').show();
        } 
    }
    function finish(){
        var title=prompt('为你的关卡起个名字吧','超简单关卡~等你挑战');
        if($.trim(title) != ''){
            $.ajax({type:'post',url:'__APP__/Tuixiangzi/cusLevel',data:'title='+title+'&leveldata='+JSON.stringify(leveldata),success:function(r){
                    if(1==r){
                        if(confirm('提交成功，挑战其他玩家设计的关卡')){
                            window.location.href='__APP__/Tuixiangzi/customer';
                        }
                    }
            }})
        }
    }
    function startedit(){
        leveldata={};
        $(".text-error").text('').hide();
        $("#btnfinish").hide();
        var row=$.trim($('#txtrow').val());
        var column=$.trim($('#txtcolumn').val());
        if('' == row || '' == column || isNaN(row) || isNaN(column) || row <= 4 || column <= 4){
            $(".text-error").text('行和列的值应为大于4的数字').show();
            return;
        }
        $("#btnplay").show();
        leveldata.row=row;
        leveldata.column=column;
        leveldata.map=new Array();
        for(var i=0;i<row;i++){
            leveldata.map[i]=new Array();
            for(var j=0;j<column;j++){
                leveldata.map[i][j]=2;
            }
        }
        $('#canvaspanl').html('');
        tuixiangzi.removeKeyboard();
        iio.apps=[];
        iio.start(tuixiangzi_edit,'canvaspanl',column*50,row*50);
    }


    tuixiangzi_edit=function(am){
        var currentStep={};//此次点击的CELL中心POS
        am.setBGColor('gray');
        var gridBG=new iio.Grid(0,0,leveldata.column,leveldata.row,50).setStrokeStyle('white');
        am.addObj(gridBG);
        am.canvas.addEventListener('click',selCellListener);

        function selCellListener(event){
            var coor=gridBG.getCellAt(am.getEventPosition(event));
            if('NO' != am.indexOfTag('layerObj')){
                am.canvas.groups.splice([am.indexOfTag('layerObj')],1);    
            }
            currentStep.coor=coor;
            currentStep.pos=gridBG.getCellCenter(coor);
            am.addToGroup('layerObj',new iio.Text('+',currentStep.pos.x,currentStep.pos.y+27).setFont('80px Arial').setTextAlign('center').setFillStyle('#a3da58'),1);
            layerObj.draw(am,coor.x,coor.y);
            am.draw().update();
            am.canvas.removeEventListener('click',selCellListener);
            am.canvas.addEventListener('click',selObjListener);
        }
        function selObjListener(event){
            var coor=layerObj.grid.getCellAt(am.getEventPosition(event));
            if(coor == false){
                return;    
            }
            var list=layerObj.coorObj;
            var map=tuixiangzi.convertRC(leveldata.map);
            for(var i in list){
                if(list[i].x == coor.x && list[i].y == coor.y){
                    switch(list[i].name){
                        case 'wall':
                            map[currentStep.coor.x][currentStep.coor.y]=1;
                            am.addObj(list[i].object.setPos(currentStep.pos));
                        break;
                        case 'box':
                            var boxes=leveldata.boxes;
                            if(map[currentStep.coor.x][currentStep.coor.y] == 1){
                                //判断此位置是否有墙
                                map[currentStep.coor.x][currentStep.coor.y]=2;
                            }
                            if(undefined == boxes)
                                boxes=new Array();
                            boxes[boxes.length]={x:currentStep.coor.x,y:currentStep.coor.y};
                            leveldata.boxes=boxes;
                            am.addObj(list[i].object.setPos(currentStep.pos));
                        break;
                        case 'red':
                            map[currentStep.coor.x][currentStep.coor.y]=3;
                            am.addObj(list[i].object.setPos(currentStep.pos));
                        break;
                        case 'person':
                            if('NO' != am.indexOfTag('person')){
                                am.canvas.groups.splice([am.indexOfTag('person')],1);    
                            }
                            if(map[currentStep.coor.x][currentStep.coor.y] == 1){
                                //判断此位置是否有墙
                                map[currentStep.coor.x][currentStep.coor.y]=2;
                            }
                            leveldata.person={x:currentStep.coor.x,y:currentStep.coor.y};
                            am.addToGroup('person',list[i].object.setPos(currentStep.pos));
                        break;

                    }
                    leveldata.map=tuixiangzi.convertRC(map);
                }
            }
            if('NO' != am.indexOfTag('layerObj')){
                am.canvas.groups.splice([am.indexOfTag('layerObj')],1);    
            }
            am.draw().update();
            am.canvas.removeEventListener('click',selObjListener);
            am.canvas.addEventListener('click',selCellListener);    
            
        }
        
    };
    layerObj={
        draw:function(am,coorX,coorY){
            this.args=arguments;
            this.loadRes();
            this.loadResIntvl=setInterval('layerObj.checkRes()',50);

        },
        init:function(){
            var am=this.args[0],coorX=this.args[1],coorY=this.args[2];
            var x=(coorX-1)*50,y=(coorY-1)*50,coorObj=[{x:1,y:0},{x:0,y:1},{x:2,y:1},{x:2,y:0}],column=3,row=2;
            if(coorX == 0){
                //第一列
                x=0;
                y=coorY*50;

                coorObj=[{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:0}];
            }
            if(coorX == leveldata.column-1){
                //最后一列
                x=(coorX-2)*50;
                y=coorY*50;

                coorObj=[{x:1,y:0},{x:1,y:1},{x:2,y:1},{x:0,y:0}];
            }
            if(coorY == 0){
                //第一行
                x=coorX*50;
                y=0;

                coorObj=[{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:2,y:0}];
            }
            if(coorY == leveldata.row-1){
                //最后一行
                x=coorX*50;
                y=(coorY-1)*50;

                coorObj=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:0}];
            }
            if(coorY == 0 && coorX == leveldata.column-1){
                //第一行最后一个方格
                x=(coorX-2)*50;
                coorObj=[{x:1,y:0},{x:1,y:1},{x:2,y:1},{x:0,y:0}];
            }
            if(coorX == 0 && coorY == leveldata.row-1){
                //第一列最后一个
                y=(coorY-1)*50;
                coorObj=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:2,y:0}];
            }
            if(coorX == leveldata.column-1 && coorY == leveldata.row-1){
                //最后一列最后一个
                x=(coorX-2)*50;
                y=(coorY-1)*50;
                coorObj=[{x:1,y:0},{x:1,y:1},{x:2,y:0},{x:0,y:0}];
            }
            if(coorX == leveldata.column-2 && coorY ==0){
                //第一行倒数第二个
                x=(coorX-1)*50;
                y=0;
                coorObj=[{x:2,y:0},{x:1,y:1},{x:2,y:1},{x:0,y:0}]
            }
            if(coorX == leveldata.column-2 && coorY ==leveldata.row-1){
                //最后一行倒数第二个
                x=(coorX-1)*50;
                y=(coorY-1)*50;
                coorObj=[{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:0,y:0}]
            }
            this.coorObj=coorObj;
            var grid=new iio.Grid(x,y,column,row,50).setStrokeStyle('black').setAlpha(0);
            this.grid=grid;
            am.addToGroup('layerObj',grid,1);
            var simrct0=this.wall(grid.getCellCenter(coorObj[0].x,coorObj[0].y));
                this.coorObj[0].name='wall';
                this.coorObj[0].flag=1;
                am.addToGroup('layerObj',simrct0,1);
                this.coorObj[0].object=simrct0.setImgSize(50,50).setAlpha(1);
            var simrct1=this.box(grid.getCellCenter(coorObj[1].x,coorObj[1].y));
                this.coorObj[1].name='box';
                am.addToGroup('layerObj',simrct1,1);
                this.coorObj[1].object=simrct1.setImgSize(50,50).setAlpha(1);
            var simrct2=this.person(grid.getCellCenter(coorObj[2].x,coorObj[2].y));
                this.coorObj[2].name='person';
                am.addToGroup('layerObj',simrct2,1);
                this.coorObj[2].object=simrct2.setImgSize(50,50).setAlpha(1);
            var simrct3=this.red(grid.getCellCenter(coorObj[3].x,coorObj[3].y));
                this.coorObj[3].name='red';
                am.addToGroup('layerObj',simrct3,1);
                this.coorObj[3].object= new iio.SimpleRect(grid.getCellCenter(coorObj[3].x,coorObj[3].y),50).setFillStyle('red').setAlpha(1);

        },
        wall:function(vec){
            return new iio.SimpleRect(vec,50).createWithImage(this.res[0]).setAlpha(.5).setImgSize(30,30);
        },
        person:function(vec){
            return new iio.SimpleRect(vec,50).createWithImage(this.res[2]).setAlpha(.5).setImgSize(30,30);
        },
        box:function(vec){
            return new iio.SimpleRect(vec,50).createWithImage(this.res[1]).setAlpha(.5).setImgSize(30,30);
        },
        red:function(vec){
            //红色目标区域
            return new iio.SimpleRect(vec,30).setFillStyle('red').setAlpha(.5);
        },
        res:[],
        checkRes:function(){
            for(var i in this.res){
                if(typeof this.res[i] != 'function' && undefined == this.res[i].loaded){
                    return false;
                }
            }
            clearInterval(this.loadResIntvl);
            this.init();
            return true;
        },
        loadRes:function(){
            var res=this.res=[];
            var srcs=['http://ftp_dml.hzsx15.badudns.cc/Public/images/wall.png',
                      'http://ftp_dml.hzsx15.badudns.cc/Public/images/box.png',
                      'http://ftp_dml.hzsx15.badudns.cc/Public/images/up.png'
                     ];
            for(var i in srcs){
                if('function' == typeof srcs[i])
                    continue;
                res[i]=new Image();
                res[i].src=srcs[i];
                res[i].onload=function(){
                    this.loaded=true;
                }
            }

        }
    };
</script>

<div style="display:none;">
<script type="text/javascript">
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F52aa22b260ccf1aff9883b5f44382402' type='text/javascript'%3E%3C/script%3E"));
</script>
</div>
</body>
</html>