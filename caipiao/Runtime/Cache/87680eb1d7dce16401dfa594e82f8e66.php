<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type"content="text/html;charset=utf8">
        <title>中奖方法论--获取期数据</title>
        <script type="text/javascript" src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
        <script type="text/javascript">
            var min,max;
            function request(issue){
                $.ajax({ type:'post',url:'<?php echo U("Index/batch");?>',data:"issue="+issue,success:function(r){
                    if(1 == r){
                        $('body').append('<p style="color:green">'+issue+'</p>');
                    }else{
                        $('body').append('<p style="color:red">'+issue+'</p>');    
                    }
                    if(max>=issue+1){
                        request(issue+1);    
                    }
                }});
            }
            function start(){
                min=$('#min').val(),max=$('#max').val();
                if('' == min || '' == max){return;}
                request(min);
            }
        </script>
    </head>
    <body>
       <div>
            <label for="min">min:</label>
            <input type="number" id="min" min="2013080" max="2013155" value="2013080"/>
            <label for="max">max:</label>
            <input type="number" id="max"  min="2013080" max="2013155" value="2013080"/>
            <button onclick="start();">获取</button>
        </div>
    </body>
</html>