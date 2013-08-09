<?php
class IndexAction extends Action {
	//检查登录状态
	public function checkls(){
		if(!session('?uin') || !session('?skey') || !session('?g_tk')){
    		$this->redirect('index');	
    	}
	}
    public function index(){
		$opt=$this->_param('opt','','');
        if(session('?uin') && session('?skey') && session('?g_tk') && $opt != 'change'){
            $this->redirect('detail');
        }
    	$this->display();
    }
    public function detail(){
    	$this->checkls();
        $this->assign('ls',array('uin'=>session('uin'),'skey'=>session('skey'),'g_tk'=>session('g_tk')));
        $blogids=F(session('uin').'blogids');
        $this->assign('blogids',$blogids);
    	$this->display();
    }
    public function check(){
        $uin=$this->_param('uin','','0');
        $skey=$this->_param('skey','','0');
        $g_tk=$this->_param('g_tk','','0');
        $cookie="uin=o$uin; skey=$skey";
        //'http://search.qzone.qq.com/cgi-bin/qzonesoso/cgi_qzonesoso_clickstream?g_tk=831280827'
        $stm=curlFetch("http://search.qzone.qq.com/cgi-bin/qzonesoso/cgi_qzonesoso_clickstream?g_tk=$g_tk",$cookie);
        if($stm){
            $stm=str_replace(array('callback(',');'),'',$stm);
            //{"ret":0,"msg":"succ","code":0,"subcode":0,"message":"succ"}
            $ls=json_decode($stm,true);
            if(0 == $ls['ret']){
                session('uin',$uin);
                session('skey',$skey);
                session('g_tk',$g_tk);
                echo 1;
                exit;
            }
            echo $ls['msg'];
        }else{
            echo -1;
        }
    }
    public function gv(){
        $this->checkls();
        $blogids=$this->_param('blogids','','');
        F(session('uin').'blogids',$blogids);
        $blogids=explode('|',$blogids);
        $uin=session('uin');
        $skey=session('skey');
        $g_tk=session('g_tk');
        $cookie="uin=o$uin; skey=$skey";

        $visitorURLtpl='http://g.qzone.qq.com/cgi-bin/friendshow/cgi_get_visitor_simple?uin=%uin%&mask=2&mod=1&contentid=%contentid%&fupdate=1&g_tk=%g_tk%';
        $visitorInfo=array();
        foreach($blogids as $k=>$v){
            $visitorURL=str_replace(array('%uin%','%contentid%','%g_tk%'),array($uin,$v,$g_tk),$visitorURLtpl);
            $ret=trim(curlFetch($visitorURL,$cookie));
            if('_Callback(' == substr($ret,0,10)){
                $ret=substr($ret,10);
            }
            if(');' == substr($ret,-2)){
                $ret=substr($ret,0,strlen($ret)-2);
            }
            $arr=json_decode($ret,true);
            if(isset($arr['data']['items'])){
                $visitorInfo=array_merge($visitorInfo,$arr['data']['items']);
            }
        }
        //保存为文件
        $stream='';
        $qqArr=array();
        foreach($visitorInfo as $k=>$v){
            if(in_array($v['uin'],$qqArr)){
                continue;
            }
            $qqArr[]=$v['uin'];
            $stream.=$v['uin']."@qq.com\r\n";
        }
        F('visitorlist',$stream);
        echo json_encode($visitorInfo);
    }
    public function download(){
        header("Content-type: application/octet-stream");
        header('Content-Disposition: attachment; filename="visitormaillist.txt"');
        echo F('visitorlist');
    }
}