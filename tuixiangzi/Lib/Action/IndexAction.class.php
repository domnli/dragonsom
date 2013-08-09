<?php
class IndexAction extends Action {
	protected function _initialize() {
      header("Content-Type:text/html; charset=utf-8");
	}
    public function index(){
        if(isset($_GET['type']) && $_GET['type'] == 'customer'){
            $this->redirect('Index/customer',array('cuslevel'=>$_GET['level']));
        }
        $level=cookie('level') == '' ? 1 : cookie('level');
        $leveldata=F("level/$level.json");
        $this->assign('leveldata',$leveldata);
        $this->display();
    }
    public function randomlevel(){
        $level=rand(1,C('MAXLEVEL'));
        $leveldata=F("tuixiangzi/level/$level.json");
        if('' == $leveldata){
            exit('0');
        }
        echo $leveldata;
    }
    public function randomcuslevel(){
        $lid=$this->_param('level',null,0);
        $lid++;
        $data=M('tuixiangzi_cuslevel')->where("lid=$lid")->find();
        if('' == $leveldata){
            exit('0');
        }
        echo $leveldata;
    }
    public function passlevel(){
        $level=cookie('level') == '' ? 1 : cookie('level');
        $level++;
        $leveldata=F("tuixiangzi/level/$level.json");
        if($data){
            echo $data['title'].'&&&'.$data['leveldata'];
        }else{
            exit('0');
        }
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
        echo M('tuixiangzi_cuslevel')->add(array('title'=>$title,'leveldata'=>$leveldata));
    }
    public function customer(){
        $lid=cookie('cuslevel') == '' ? 1 : cookie('cuslevel');
        $lid=$this->_param('cuslevel',null,$lid);
        $data=M('tuixiangzi_cuslevel')->where("lid=$lid")->find();
        if($data){
            $this->assign('data',$data);
            $this->display();
        }else{
           $this->redirect('Index/edit',null, 3, '没有此用户自定义关卡，着手设计一个吧,正在跳转到关卡编辑页...');
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