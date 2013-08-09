<?php
/*
*邪恶漫画频道Admin/Action类
*/
class XemhcjAction extends Action {
	public function index(){
		$offset=isset($_GET['offset'])?$_GET['offset']:0;
		import('@.ORG.Xemhcj');
		$catalog = Xemhcj::getduowancjcat($offset);
		$this->assign('catalog',$catalog);
		$this->display();
	}
	public function getcontentfromgid(){
		$gid=$_POST['gid'];
		$dimgurl=$_POST['dimgurl'];
		import('@.ORG.Xemhcj');
          //$dir='Public/xemh/catalogue';
          //if(!is_dir($dir)){
          //	mkdir($dir);
          //}
          //$imgInfoArr = Xemhcj::getimg_by_curl($dimgurl);
          //if(!is_array($imgInfoArr)){
          //	exit(0);
          //}
          //file_put_contents($dir.'/'.$gid.$imgInfoArr['ext'],$imgInfoArr['stream']);
		echo Xemhcj::get_list_by_gid($gid);
	}

	public function savecontentimg(){
		$index=$_POST['index'];
		$amount=$_POST['amount'];
		unset($_POST['index']);
		unset($_POST['amount']);
		M('xemh_content')->add($_POST);
          //$dir='Public/xemh/content/'.$_POST['gid'];
          //if(!is_dir($dir)){
          //	mkdir($dir);
          //}
          //import('@.ORG.Xemhcj');
          //$imgInfoArr=Xemhcj::getimg_by_curl($_POST['source']);
          //if(!is_array($imgInfoArr)){
          //	exit(0);
          //}
          //file_put_contents($dir.'/'.$index.$imgInfoArr['ext'],$imgInfoArr['stream']);
		if($index == $amount-1){
			M('xemh_catalogue')->where("gid = ".$_POST['gid'])->setField('isgetcontent',1);
		}
		echo 1;
	}
	//检查未获取内容的目录
	public function failcjlist(){
		$catalog=M('xemh_catalogue')->where('isgetcontent = 0')->select();
		$this->assign('catalog',$catalog);
		$this->display();
	}
	public function cj(){
		//import('@.ORG.Xemhcj');
		//$imgInfoArr=Xemhcj::getimg_by_curl('http://s1.dwstatic.com/group1/M00/5A/05/5a059565d6842eac6e073ca94baa09395198.jpg');
		//file_put_contents('11111'.$imgInfoArr['ext'],$imgInfoArr['stream']);
		$dir='Public/xemh/content/';
		if(!is_dir($dir)){
			mkdir($dir);
		}
	}
}