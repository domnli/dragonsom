<?php
class TuixiangziAction extends Action {
	protected function _initialize() {
      header("Content-Type:text/html; charset=utf-8");
      $this->assign('ac','Html5');
      $this->assign('title','dragonsom  --  推箱子');
	}
    public function index(){
        $level=cookie('level') == '' ? 1 : cookie('level');
        $leveldata=F("tuixiangzi/level/$level.json");
        $this->assign('leveldata',$leveldata);
        $this->display();
    }
    public function passlevel(){
        $level=cookie('level') == '' ? 1 : cookie('level');
        $level++;
        $leveldata=F("tuixiangzi/level/$level.json");
        if('' == $leveldata){
            exit('0');
        }
        cookie('level',$level);
        echo $leveldata;
    }
    public function edit(){
    	$this->display();
    }
    public function cusLevel(){//用户自定义关卡提交处理
        $title=$this->_param('title',null,'无名关卡');
        $leveldata=$this->_param('leveldata','');
        if(!isset($leveldata)){//没有参数
            exit('0');
        }
        M('tuixiangzi_cuslevel')->add(array('title'=>$title,'leveldata'=>$leveldata));
        echo 1;
    }
    public function customer(){
        $lid=cookie('cuslevel') == '' ? 1 : cookie('level');
        $lid=$this->_param('level',null,$lid);
        $data=M('tuixiangzi_cuslevel')->where("lid=$lid")->find();
        if($data){
            $this->assign('data',$data);
            $this->display();
        }else{
           $this->redirect('Tuixiangzi/edit',null, 5, '没有此用户自定义关卡，着手设计一个吧,正在跳转到关卡编辑页...');
        }
    }
    public function passcuslevel(){
        $lid=cookie('cuslevel') == '' ? 1 : cookie('cuslevel');
        $lid++;
        $data=M('tuixiangzi_cuslevel')->where("lid=$lid")->find();
        if($data){
            cookie('cuslevel',$lid);
            echo $data['title'].'&&&'.$data['leveldata'];
        }else{
            exit('0');
        }
        
    }
}