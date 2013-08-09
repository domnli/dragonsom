<?php
class IndexAction extends Action {
    public function index(){
        $openid=isset($_GET['openid']) ? $_GET['openid'] : '';
        $openkey=isset($_GET['openkey']) ? $_GET['openkey'] : '';
        $this->assign('userinfo',array('openid'=>$openid,'openkey'=>$openkey));
		$this->display();
    }
    public function upload(){
        if(cookie('tms') >= 1){
            //$return = array('status'=>0,'msg'=>'fail');
            //echo json_encode($return);
           // exit;//一天操作一次
        }

        $openid=$this->_param('openid','','');
    	$imgdata=$this->_param('imgdata','','');
    	$poolstatus=F('poolstatus');
    	if(!$poolstatus){
            $poolstatus=array('user'=>0,'sexy'=>0);
            F('poolstatus',$poolstatus);
        }
        if($poolstatus['user'] < C('USERPOOL_MAX_SIZE')){
            $poolstatus['user']++;
            F('imgdata/user/'.$poolstatus['user'],array('openid'=>$openid,'imgdata'=>$imgdata));
        }else{
            F('imgdata/user/'.rand(1,$poolstatus['user']),array('openid'=>$openid,'imgdata'=>$imgdata));
        }
        F('poolstatus',$poolstatus);

        if(rand(1,100) > C('SEXY_RATE')){
            $type = 'user';
        }else{
            $type = 'sexy';
        }
        $rand=rand(1,$poolstatus[$type]);

        do{
            $data=F("imgdata/$type/".$rand);   
        }while(!$data);

    	$return=array('status'=>1,'msg'=>'success','type'=>'','pos'=>$rand,'data'=>$data);

        cookie('tms',1,86400-(time()-strtotime(date('Y-m-d'))));
        echo json_encode($return);
    }
    public function nomedia(){
        if(cookie('tms') >= 1){
            $return = array('status'=>0,'msg'=>'fail');
            //echo json_encode($return);
            //exit;//一天操作一次
        }
        $poolstatus=F('poolstatus');

        if(rand(1,100) > C('SEXY_RATE')){
            $type = 'user';
        }else{
            $type = 'sexy';
        }
        $rand=rand(1,$poolstatus[$type]);

        do{
            $data=F("imgdata/$type/".$rand);   
        }while(!$data);
        
        $return=array('status'=>1,'msg'=>'success','type'=>'','pos'=>$rand,'data'=>$data);

        cookie('tms',1,86400-(time()-strtotime(date('Y-m-d'))));
        echo json_encode($return);
    }
}