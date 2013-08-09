<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type"content="text/html;charset=utf8">
        <title>中奖方法论</title>
        <script type="text/javascript" src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript" src="__PUBLIC__/js/iioEngine.js"></script>
        <script type="text/javascript" charset="utf-8">
             caipiao=function(am){
                    var D=caipiaodata;
                    am.setBGColor('black');
                    
                    (function(){
                        moveToTop = function(obj){
                            obj.setPos(iio.getRandomInt(10, am.canvas.width-10)
                                        ,iio.getRandomInt(-540, -300));
                            return true;
                        }
                        am.addGroup('BG');
                        for(var i=0;i<caipiaodata.length;i++){
                            am.addToGroup('BG',new iio.Text(D[i].issue+':'+D[i].numstr,iio.getRandomInt(10,am.canvas.width-10),-500))
                                                .setStrokeStyle('green')
                                                .rotate(Math.PI/2)
                                                .setFont(iio.getRandomInt(10,25)+'px  Consolas')
                                                .enableKinematics()
                                                .setVel(0,iio.getRandomInt(1,7))
                                                .setBound('bottom',am.canvas.height,moveToTop);
                        }
                    })();
                    am.setFramerate(60);
                };
        </script>
    </head>
    <body>
       
    </body>
        <script type="text/javascript">
            var caipiaodata;
            function initData(){
                if(window.localStorage && undefined != window.localStorage.caipiaodata && undefined != getcookie('caipiaoisfresh')){
                    caipiaodata=JSON.parse(window.localStorage.caipiaodata);
                }else{
                    $.ajax({ type:'get',url:'<?php echo U("Index/showdata");?>',success:function(r){
                        caipiaodata=JSON.parse(r);
                        window.localStorage.caipiaodata=JSON.stringify(caipiaodata);
                    }});
                }
                iio.start(caipiao);
            }
            function getcookie(key){
                var cookie=document.cookie;
                return cookie.substr(cookie.search(key)).split('=')[1];
            }
            initData();
        </script>
</html>