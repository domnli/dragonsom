<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type"content="text/html;charset=utf8">
        <title>空间搜索-说说</title>
        <link rel="stylesheet" type="text/css" href="http://lib.sinaapp.com/js/bootstrap/latest/css/bootstrap.min.css">
        <link href="http://lib.sinaapp.com/js/bootstrap/latest/css/bootstrap-responsive.css" rel="stylesheet">
        <script type="text/javascript" src="http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="http://lib.sinaapp.com/js/bootstrap/latest/js/bootstrap.min.js"></script>
        <script type="text/javascript">
          var list;
          Date.prototype.toCusString=function(){
            return this.getFullYear()
                  +'-'+(parseInt(this.getMonth())+1<10?'0':'')+(parseInt(this.getMonth())+1)
                  +'-'+(this.getDate()<10?'0':'')+this.getDate()
                  +' '+(this.getHours()<10?'0':'')+this.getHours()
                  +':'+(this.getMinutes()<10?'0':'')+this.getMinutes()
                  +':'+(this.getSeconds()<10?'0':'')+this.getSeconds();
          }
          $(function(){
              $('#search').click(function(){
                $(this).attr('disabled','disabled');
                  var key=$.trim($('#keyword').val());
                  if('' == key){
                    $(this).removeAttr('disabled');
                    return;
                  }
                  $.ajax({
                      type:'post',
                      url:"<?php echo U('/Index/search');?>",
                      data:'keyword='+key,
                      success:function(msg){
                        var obj=eval('('+msg+')');
                        console.log(obj);
                        list=obj.data.data.resultdata;
                        if(0 != obj.code){
                          $('#listpanl table tbody').html('<td colspan="5" style="text-align:center"><font color="red">(失败原因：'+obj.msg_soso+')</font>登录态失效？重新录入试试</td>');
                          $('#search').removeAttr('disabled');
                          return;
                        }
                        var html='';
                        for(var i in list){
                          var date=new Date(list[i].time*1000);
                          html+='<tr><td>'+(parseInt(i)+1)+'</td><td>'+list[i].uin+'</td><td>'+list[i].isFriend+'</td><td>'+date.toCusString()+'</td><td colspan="2">'+list[i].text+'</td></tr>';
                        }
                        $('#listpanl table tbody').html(html);
                        $('#search').removeAttr('disabled');
                      }
                  });
              });

              $('#download').click(function(){
                  if(undefined == list){
                    return;
                  }
                  var data='';
                  for(var i in list){
                    data+=list[i].uin+'|';
                  }
                  var form = $("<form>");  
                  form.attr('style','display:none');  
                  form.attr('method','post');  
                  form.attr('action',"<?php echo U('/Index/download');?>");  
                    
                  var input = $('<input>');  
                  input.attr('type','hidden');  
                  input.attr('name','data');  
                  input.attr('value',data);  

                  $('body').append(form);  
                  form.append(input);  
                    
                  form.submit();  
                  form.remove();  
              });
          });
        </script>
        <style type="text/css">
          .c_tx4{color:red;}
        </style>
    </head>
    <body>
        <div class="container-fluid">
          <div class="row-fluid">
            <div class="span2">
              <b style="margin: 70px;font-size: 54px;line-height: 118px;display: block;font-family: Microsoft Yahei;">说<br>说<br>搜<br>索</b>
            </div>
            <div class="span10">
               <div class="navbar navbar-static-top">
                  <div class="navbar-inner">
                     <div class="navbar-form pull-left" style="width: 800px;">
                          <input id="uin" type="text" class="input-small uneditable-input" disabled="disabled" value='<?php echo ($ls["uin"]); ?>' />
                          <input id="skey" type="text" class="input-small uneditable-input" disabled="disabled" value='<?php echo ($ls["skey"]); ?>' />
                          <input id="g_tk" type="text" class="input-small uneditable-input" disabled="disabled" value='<?php echo ($ls["g_tk"]); ?>' />
                          <a href="<?php echo U('/Index/index/opt/change');?>" class="btn">切换登录态</a>
                          
                          <button id="search" class="btn" type="button" style="float:right">Search</button>
                          <input id="keyword" class="span3" type="text" style="float:right"/>
                      </div>
                  </div>
              </div>
              <div class="span9 offset1" id="listpanl">
                  <table class="table table-condensed">
                    <thead>
                      <tr>
                        <th width="5%">#</th>
                        <th width="15%">QQ</th>
                        <th width="10%">是否好友</th>
                        <th width="10%">日期</th>
                        <th width="50%">内容</th>
                        <th width="10%"><button id="download" type="button" title="生成QQ邮箱格式文本" class="btn btn-inverse">生成</btn></th>
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