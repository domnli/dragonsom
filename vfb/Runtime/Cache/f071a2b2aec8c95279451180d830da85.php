<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type"content="text/html;charset=utf8">
        <title>日志最新访客</title>
        <link rel="stylesheet" type="text/css" href="http://lib.sinaapp.com/js/bootstrap/latest/css/bootstrap.min.css">
        <link href="http://lib.sinaapp.com/js/bootstrap/latest/css/bootstrap-responsive.css" rel="stylesheet">
        <script type="text/javascript" src="http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="http://lib.sinaapp.com/js/bootstrap/latest/js/bootstrap.min.js"></script>
        <script type="text/javascript">
          var list,blogids='<?php echo ($blogids); ?>';
          $(function(){
              $('#blogid2ad').popover({title:'日志ID',trigger:'focus',placement:'bottom',html:'true'});
              if('' != blogids){
                $('#blogid2ad').attr('data-content',blogids.replace(/\|/g,'<br>'));
              }
              $('#addid').click(function(){
                var id=$.trim($('#blogid2ad').val());
                if('' != id && !isNaN(id)){
                  if(-1 == blogids.indexOf(id)){
                    blogids+=((blogids == '')?'':'|')+id;
                    $('#blogid2ad').attr('data-content',blogids.replace(/\|/g,'<br>'));
                  }
                  $('#blogid2ad').popover('show');
                  setTimeout("$('#blogid2ad').popover('hide')",5000);
                }else{
                  alert('日志ID是数字');
                }
              });
              $('#cv').click(function(){
                $(this).attr('disabled','disabled');
                $('#vipanl table tbody').html('<td colspan="7" style="text-align:center"><img alt="Loading..." src="__PUBLIC__/loading.gif"></td>');
                if('' == blogids){
                  $('#vipanl table tbody').html('<td colspan="7" style="text-align:center">没有设置日志ID?</td>');
                  return;
                }
                $.ajax({
                    type:'post',
                    url:"<?php echo U('/Index/gv');?>",
                    data:'blogids='+blogids,
                    success:function(msg){
                        if('[]' == msg || -1 ==msg){
                            $('#vipanl table tbody').html('<td colspan="7" style="text-align:center">登录态失效？重新录入试试</td>');
                            $('#cv').removeAttr('disabled');
                            return;
                        }
                        var obj=eval(msg);
                        var html='';
                        for(var i in obj){
                            html+='<tr><td>'+(parseInt(i)+1)+'</td><td><img width="30" height="30" src="'+obj[i].img+'" /></td><td>'+obj[i].uin+'</td><td>'+obj[i].name+'</td><td>'+obj[i].online+'</td><td>'+obj[i].yellow+'</td><td></td></tr>';
                        }
                        $('#vipanl table tbody').html(html);
                        $('#cv').removeAttr('disabled');
                    }
                });
            });
          });
          function clearblogid(){
            blogids='';
             $('#blogid2ad').attr('data-content','');
          }
        </script>
        <style type="text/css">
          .c_tx4{color:red;}
        </style>
    </head>
    <body>
        <div class="container-fluid">
          <div class="row-fluid">
            <div class="span2">
              <b style="margin: 70px;font-size: 54px;line-height: 118px;display: block;font-family: Microsoft Yahei;">日<br>志<br>访<br>客</b>
            </div>
            <div class="span10">
               <div class="navbar navbar-static-top">
                  <div class="navbar-inner">
                     <div class="navbar-form pull-left" style="width: 800px;">
                        <input id="uin" type="text" class="input-small uneditable-input" disabled="disabled" value='<?php echo ($ls["uin"]); ?>' />
                        <input id="skey" type="text" class="input-small uneditable-input" disabled="disabled" value='<?php echo ($ls["skey"]); ?>' />
                        <input id="g_tk" type="text" class="input-small uneditable-input" disabled="disabled" value='<?php echo ($ls["g_tk"]); ?>' />
                        <a href="<?php echo U('/Index/index/opt/change');?>" class="btn">切换登录态</a>
                        
                        <button id="cv" class="btn" type="button" style="float:right">采集</button>
                        <!--<button id="addid" class="btn" type="button" style="float:right">添加日志ID</button>-->
                        <div class="btn-group"  style="float: right;display: inline-block;">
                          <button id="addid" class="btn" type="button">添加日志ID</button>
                          <button class="btn dropdown-toggle" data-toggle="dropdown">
                            <span class="caret"></span>
                          </button>
                          <ul class="dropdown-menu">
                            <li><a href="javascript:;" onclick="clearblogid();return false;">清空日志ID</a></li>
                          </ul>
                        </div>
                        <input id="blogid2ad" class="span3" type="text" style="float:right"/>
                      </div>
                  </div>
              </div>
              <div class="span9 offset1" id="vipanl">
                  <table class="table table-condensed">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>头像</th>
                        <th>QQ</th>
                        <th>昵称</th>
                        <th>在线</th>
                        <th>黄钻等级</th>
                        <th><a id="download" href="<?php echo U('/Index/download');?>" class="btn btn-small btn-inverse">生成QQ邮箱文本</a></th>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
              </div>
            </div>
          </div>
           
        </div>
    </body>
</html>