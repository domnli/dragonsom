<?php
/*
*邪恶漫画采集类
*/
class Xemhcj{
	//获取多玩邪恶漫画频道目录
	static public function getduowancjcat($offset){
		$retjson = self::request_by_curl("http://tu.duowan.com/m/xemh?offset=$offset&order=created&math=".rand(0,100)/313,'');
		$Arr=json_decode($retjson,true); //array([html]=>html [more] => 1 [offset] => 30 [enabled] => 1)
          	//echo $Arr['html'];
		preg_match_all('/<li class="box" style="position: absolute;">([\s\S]*?)<\/li>/',$Arr['html'],$matchs); //$dlist为目录列表
		$dlist=array();
		foreach($matchs[1] as $k=>$v){
			preg_match('/<span class="fr">([\s\S]\d+)/',$v,$amount);//目录下图片数量

			preg_match('/<a href="([\s\S]*?)"/',$v,$gid);//gid
			$gid2=str_replace(array('http://tu.duowan.com/g/','.html','/'),'',$gid[1]);
			$gid3=hexdec($gid2);

			preg_match('/<img src="([\s\S]*?)"/',$v,$dimgurl);//目录封面图片地址

			preg_match('/<em>.*target="_blank">([\s\S]*?)<\/a>/',$v,$title);//目录标题
			
			$data=array('title'=>$title[1],'amount'=>$amount[1],'gid'=>$gid3,'dimgurl'=>$dimgurl[1]);

                  if(null == M('xemh_catalogue')->where('gid='.$gid3)->find()){
                  	$dlist[]=$data;
                  	M('xemh_catalogue')->add($data);
                  }
		}
				
          	return $dlist;	
	}
	//通过gid获取多玩邪恶漫画目录下内容
	static public function get_list_by_gid($gid){
		return self::request_by_curl("http://tu.duowan.com/index.php?r=show/getByGallery/&gid=$gid",'');
	}
	static function request_by_curl($remote_server, $post_string)
	{
		$headers_org = array('Host:tu.duowan.com');  
	    $user_agent = "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.60 Safari/537.1";  
	  
		$curl = curl_init();  
		curl_setopt($curl,CURLOPT_URL, $remote_server); //设置请求URL  
		curl_setopt($curl,CURLOPT_HTTPHEADER, $headers_org); //设置请求头  
		curl_setopt($curl,CURLOPT_POST, 1 ); //设置为post形式的请求  
		curl_setopt($curl,CURLOPT_POSTFIELDS, $post_string); 
		curl_setopt($curl,CURLOPT_RETURNTRANSFER,1); //将curl_exec()获取的信息以文件流的形式返回，而不是直接输出。  
		curl_setopt($curl,CURLOPT_USERAGENT, $user_agent);
		curl_setopt($curl, CURLOPT_REFERER, 'http://tu.duowan.com/m/xemh');
		curl_setopt($curl,CURLOPT_TIMEOUT, 20);//设置超时时间，单位为s  
		curl_setopt( $curl,CURLOPT_HTTP_VERSION , CURL_HTTP_VERSION_1_0); //使用1.0
		$output = curl_exec($curl); //这边的output就是返回的response  
		if ($output === FALSE) {
			return "cURL Error: ".curl_errno($curl).':'.curl_error($curl);
		}
		curl_close($curl);  
		return $output;
	}
	static function getimg_by_curl($remote_server){
		$headers_org = array();  //格式：array('Host:s1.dwstatic.com','')
	    $user_agent = "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.60 Safari/537.1";  

		$curl = curl_init();  
		curl_setopt($curl,CURLOPT_URL, $remote_server); //设置请求URL  
		curl_setopt($curl,CURLOPT_HTTPHEADER, $headers_org); //设置请求头  
		curl_setopt($curl,CURLOPT_RETURNTRANSFER,1); //将curl_exec()获取的信息以文件流的形式返回，而不是直接输出。  
		curl_setopt($curl,CURLOPT_USERAGENT, $user_agent);
		curl_setopt($curl, CURLOPT_REFERER, 'http://tu.duowan.com');
		curl_setopt($curl,CURLOPT_TIMEOUT, 20);//设置超时时间，单位为s  
		curl_setopt( $curl,CURLOPT_HTTP_VERSION , CURL_HTTP_VERSION_1_0); //使用1.0
		$output = curl_exec($curl); //这边的output就是返回的response  
		if ($output === FALSE) {
			return "cURL Error: ".curl_errno($curl).':'.curl_error($curl);
		}
		$info= curl_getinfo($curl);
		curl_close($curl);
		switch($info['content_type']){
			case 'image/jpeg':
			case 'application/x-jpg':
				$ext='.jpg';
			break;
			case 'image/png':
			case 'application/x-png':
				$ext='.png';
			break;
			case 'image/gif':
				$ext='.gif';
			break;
			default:
				$ext='.jpg';
		}
		return array('ext'=>$ext,'stream'=>$output);
	}
}