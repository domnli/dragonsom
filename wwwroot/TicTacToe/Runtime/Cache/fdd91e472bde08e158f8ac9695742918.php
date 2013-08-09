<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type"content="text/html;charset=utf8">
        <title>TicTacToe</title>
        <script type="text/javascript" src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript" src="__PUBLIC__/js/iioEngine.js"></script>
        <!--<script type="text/javascript" src="http://192.168.1.101:9922/target/target-script-min.js#anonymous"></script>-->        
        <style type="text/css">
            body{text-align: center}
        </style>
        <script type="text/javascript" charset="utf-8">
            var userkey,websocket,wsserver='ws://58.221.254.151:8000';
            //var userkey,websocket,wsserver='ws://192.168.1.101:8000';
            var map,pos,roomid,status;
            function connect(){
                if(!('WebSocket' in window)){
                    alert('浏览器不支持');
                    return;
                }
                if(undefined != websocket){return;}
                websocket=new WebSocket(wsserver);
                websocket.onopen=function(event){
                    websocket.send('system|connected');
                };
                websocket.onmessage=function(event){
                    userkey=event.data;
                    console.log(event);
                    $('#readypanl').show();
                };
                websocket.onerror=function(event){
                    console.log(event);
                };
                websocket.onclose=function(event){
                    websocket=undefined;
                    console.log(event);
                }
            }
            function ready(flg){
              if(status == 1){return;}
              iio.start(TicTacToe,'canvaspanl',360);
              websocket.send('room|'+flg);
              websocket.onmessage=function(event){
                    status=1;
                    console.log(event);
                    var msg=event.data;
                    if(msg.indexOf('wait')>=0){
                      $('#textpanl').text('等待其他玩家加入');
                    }else if(msg.indexOf('turn')>=0){
                      var inf=msg.split('|');
                      map=inf[5];
                      pos=inf[6];
                      roomid=inf[1];
                      if(inf[4] == userkey){
                        $('#textpanl').text('your turn');
                        TicTacToe.readymove();
                      }else{
                        $('#textpanl').text('wait to move');
                        TicTacToe.forbidmove();
                      }
                    }else if(msg.indexOf('userleave')>=0){
                      $('#textpanl').text('用户离开，等待其他玩家加入');
                      TicTacToe.forbidmove();
                    }
                };
            }
            function sendmsg(){
              websocket.send('map|'+roomid+'|'+pos+'|'+map);
            }
        </script>
    </head>
    <body>
        <div style="z-index:1">
            <div><button onclick="connect()">网络对战</button></div>
            <div id="readypanl" style="display:none"><button onclick="ready(0)">随机分配</button><button onclick="ready(1)">创建新对局</button></div>
            <div id="textpanl"></div>
        </div>
        <div id="canvaspanl" style="text-align:center"></div>
         <script type="text/javascript">
            TicTacToe = function(io){
 
              var grid = io.addObj(new iio.Grid(0,0,3,3,120)
                             .setStrokeStyle('black'));
              var xTurn=true;
              TicTacToe.readymove=function(callback){
                io.canvas.addEventListener('mousedown',move);
                drawmap();
                if(typeof callback == 'function'){
                  callback();
                }
              };
              TicTacToe.forbidmove=function(callback){
                io.canvas.removeEventListener('mousedown',move);
                drawmap();
                if(typeof callback == 'function'){
                  callback();
                } 
              };
              move=function(event){
                var c = grid.getCellAt(io.getEventPosition(event),true);
                if(map[c.x*grid.C+c.y] == 0){
                  var tmp=map.split('');
                  tmp[c.x*grid.C+c.y]=pos;
                  map=tmp.join('');
                  if(pos == 1){
                    io.addObj(new iio.XShape(grid.getCellCenter(c),80)
                          .setStrokeStyle('red',2));
                  }else{
                     io.addObj(new iio.Circle(grid.getCellCenter(c),40)
                          .setStrokeStyle('#00baff',2));
                  }
                  drawmap();
                  sendmsg();
                }
                TicTacToe.forbidmove();
               }
               drawmap=function(){
                var C=grid.C,R=grid.R;
                for(var i=0;i<R;i++){
                  for(var j=0;j<C;j++){
                    switch(map[i*C+j]){
                      case '0':
                      break;
                      case '1':
                        console.log(io.addObj(new iio.XShape(grid.getCellCenter(i,j),80)
                          .setStrokeStyle('red',2)));
                      break;
                      case '2':
                        console.log(io.addObj(new iio.Circle(grid.getCellCenter(i,j),40)
                          .setStrokeStyle('#00baff',2)));
                      break;
                    }
                  }
                }
               }
            };
        </script>
    </body>
</html>