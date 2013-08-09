<?php
// 本类由系统自动生成，仅供测试用途
class IndexAction extends Action {
    public function index(){
		$this->display();
    }
    public function getdata(){
        $this->display();
    }
    public function showdata(){
        cookie('isfresh','1',259200);
        $data=S('caipiaodata50');
        if($data){
            echo json_encode($data);
            exit;
        }
        $data=M('detail')->field('issue,numstr')->order('issue desc')->limit(50)->select();
        S('caipiaodata50',$data,604800);
        echo json_encode($data);
    }
    public function batch(){
    	$issue=$this->_param('issue',null,'0');
    	if('0' == $issue){
    		exit(0);
    	}
    	$savedata=getDataByIssue($issue);
    	echo M('detail')->add($savedata);
    }
}