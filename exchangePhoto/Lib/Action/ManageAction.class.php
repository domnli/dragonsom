<?php

/**
 * 照片管理
 */


class ManageAction extends Action {

  protected function _initialize() {
      header("Content-Type:text/html; charset=utf-8");
  }

  public function index(){
  	if(isset($_FILES['upload'])){
  		if ((($_FILES["upload"]["type"] == "image/gif")|| ($_FILES["upload"]["type"] == "image/jpeg")|| ($_FILES["upload"]["type"] == "image/pjpeg")) && ($_FILES["upload"]["size"] < 102400)){
			if ($_FILES["upload"]["error"] == 0){
				$imginfo=getimagesize($_FILES["upload"]["tmp_name"]);
				//if($imginfo[0] < 800 && $imginfo[1] < 600 ){
					$tmpname='tmp'.rand(0,10).($imginfo[2] == 1 ? '.gif':'.jpg');
					if(move_uploaded_file($_FILES["upload"]["tmp_name"],TEMP_PATH.$tmpname)){
						$this->assign('image',array('prop'=>$imginfo[3],'w'=>$imginfo[0],'h'=>$imginfo[1],'filename'=>$tmpname));
					}
				//}
				
			}
		  }else{
		  	$this->assign('error','图片格式不正确/图片大于100k');
		  }
  	}
      $this->display();
  }
  public function upload(){
  	 	$openid=$this->_param('openid','','');
    	$imgdata=$this->_param('imgdata','','');
    	$poolstatus=F('poolstatus');
    	if(!$poolstatus){
            $poolstatus=array('user'=>0,'sexy'=>0);
            F('poolstatus',$poolstatus);
        }
        if($poolstatus['sexy'] < C('SEXYPOOL_MAX_SIZE')){
            $poolstatus['sexy']++;
            F('imgdata/sexy/'.$poolstatus['sexy'],array('openid'=>$openid,'imgdata'=>$imgdata));
        }else{
            F('imgdata/sexy/'.rand(1,$poolstatus['sexy']),array('openid'=>$openid,'imgdata'=>$imgdata));
        }
        F('poolstatus',$poolstatus);

    	$return=array('status'=>1,'msg'=>'success','type'=>'sexy');
        echo json_encode($return);
  }

  public function pool(){
      $type=$this->_param('type','','');
      $p=$this->_param('p','',1);
      $amount=30;//每页显示个数

      $poolstatus=F('poolstatus');
      $total=$poolstatus[$type];
      $start=($p-1)*$amount+1;
      $end=$p*$amount;
      $more=1;
      if($end >= $total){
        $end = $total;
        $more=0;
      }

      $dirarr=scandir("Runtime/Data/imgdata/$type/");
      $realtotal=count($dirarr)-2;
      $this->assign('type',$type);
      $this->assign('realtotal',$realtotal);
      $this->assign('page',array('start'=>$start,'end'=>$end,'more'=>$more,'p'=>$p));
      $this->display();
  }

  public function delete(){
    $pos=$this->_param('pos','',0);
    $type=$this->_param('type','','');
    if(0 == $pos || '' == $type){
      echo 0;
      exit;
    }
    F("imgdata/$type/$pos",NULL);
    echo 1;
  }

}

?>