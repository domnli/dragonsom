<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link href="http://www.shijiongtu.com/Yuanmapu/Tpl/Admin/Default/Public/Css/admincp.css" rel="stylesheet" type="text/css" />
	</head>
	<body>
		<table width="100%" border="0" cellpadding="2" cellspacing="6" style="_margin-left:-10px; ">
			<tr>
			  <td><table width="100%" border="0" cellpadding="2" cellspacing="6">
				<tr>
				  <td>
	<script type='text/javascript' src='http://code.jquery.com/jquery-1.9.1.min.js'></script>
	<script type="text/javascript">
		var cjdata;
		function cj(gid,dimgurl){
			$('button').attr('disabled','disabled');
			$.ajax({
				type: 'post',
				url: '<?php echo U("Xemhcj/getcontentfromgid");?>',
				data:'gid='+gid+'&dimgurl='+dimgurl,
				dataType:'json',
				success:function(data){
					if(0 == data){
						alert('目录封面图片保存失败，请重试');
					}
					console.log(data);
					cjdata = data.picInfo;
					batchgetcontent(gid,0);
				},
				error:function(a,b,c){
					console.log('cj失败原因:'+b);
				}
			});
		}
		function batchgetcontent(gid,index){
			if(index>=cjdata.length){
				$('#btncj-'+gid).removeAttr('onclick').addClass('disabled');
				$('button').removeAttr('disabled');
				$('#btncj-'+gid).text('已采集');
				$('#btncj-'+gid+',.disabled').attr('disabled','disabled');
                                $('button[class!=disabled]').eq(0).click();
				return;
			}
			$.ajax({
				type:'post',
				url:'<?php echo U("Xemhcj/savecontentimg");?>',
				data:'amount='+cjdata.length+'&index='+index+'&gid='+gid+'&title='+cjdata[index].title+'&add_intro='+cjdata[index].add_intro+'&source='+cjdata[index].source+'&pic_id='+cjdata[index].pic_id,
				success:function(data){
					if(1 == data){
						$('#plusnum-'+gid).text(parseInt($('#plusnum-'+gid).text())+1);
						batchgetcontent(gid,index+1);
					}else{
						batchgetcontent(gid,index+1);
					}
					
				},
				error:function(a,b,c){
					console.log('batchgetcontent失败原因：'+b);
					batchgetcontent(gid,index+1);
				}
			});
		}
	</script>
	<div style="width:100%; height:15px;color:#000;margin:0px 0px 10px;">
	  <div style="float:left;"><a href="<?php echo U('Index/stat');?>" target="main"><b>控制面板首页</b></a>&nbsp;&raquo;&nbsp;邪恶漫画采集</div>
	</div>
	<table cellspacing="1" cellpadding="4" width="100%" align="center" style="border: 0 none !important; border-collapse: separate !important;empty-cells: show;margin-bottom: 0px;">
		<tr class="header" align="center">
			<td  width="10%" class="center">目录标题</td>
			<td  width="20%" class="center">内容数量</td>
			<td  width="50%" class="center">目录封面图片地址</td>
			<td  width="20%" class="center">采集目录下的内容</td>
		</tr>
	</table>
	<ul id="list">
		<?php if($catalog != NULL): if(is_array($catalog)): $i = 0; $__LIST__ = $catalog;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$vo): $mod = ($i % 2 );++$i;?><li style="list-style:none;">
					<table  id="table1" cellspacing="1" cellpadding="4" width="100%" align="center" style="border: 0 none !important; border-collapse: separate !important;empty-cells: show;margin-bottom: 0px;"> 
						<tr align="center" class="smalltxt">
							<td width="10%" class="altbg1 center"><?php echo ($vo["title"]); ?></td>
							<?php if(0 == $vo['isgetcontent']): ?><td width="20%" class="altbg2 center"><span id="plusnum-<?php echo ($vo["gid"]); ?>">0</span>/<?php echo ($vo["amount"]); ?></td>
							<?php else: ?>
								<td width="20%" class="altbg2 center"><?php echo ($vo["amount"]); ?>/<?php echo ($vo["amount"]); ?></td><?php endif; ?>
							<td width="50%" class="altbg1 center"><?php echo ($vo["dimgurl"]); ?></td>
							<td width="20%" class="altbg1 center">
							<?php if(0 == $vo['isgetcontent']): ?><button id="btncj-<?php echo ($vo["gid"]); ?>" onclick="cj(<?php echo ($vo["gid"]); ?>,'<?php echo ($vo["dimgurl"]); ?>')">采集</button>
							<?php else: ?>
								已采集<?php endif; ?>
							</td>
						</tr>
					</table>
				</li><?php endforeach; endif; else: echo "" ;endif; ?>
		<?php else: ?>
			<li>
				<table  id="table1" cellspacing="1" cellpadding="4" width="100%" align="center" style="border: 0 none !important; border-collapse: separate !important;empty-cells: show;margin-bottom: 0px;"> 
					<tr align="center" class="smalltxt">
						<td class="altbg1" style="text-align:center;font-weight:bold;color:#E01558;padding:10px 0px;">所有目录内容都已采集</td>
					</tr>
				</table>
			</li><?php endif; ?>	
	</ul>
<br/>
					<div style="CLEAR: both; MARGIN: 5px auto; TEXT-ALIGN: center"><A href="http://www.dragonsom.com" target="_blank">www.dragonsom.com</A></div>
				</tr>
			</tbody>
		</table>
	</body>
</html>