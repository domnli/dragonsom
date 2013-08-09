<?php
class Html5Action extends Action {
	protected function _initialize() {
      header("Content-Type:text/html; charset=utf-8");
      $this->assign('ac',is_null($_GET['_URL_'][0])?'Index':$_GET['_URL_'][0]);
      $this->assign('title','dragonsom');
	}
    public function index(){
        $this->display();
    }
    public function game(){
    	$app=$this->_param('app','','');
    	$this->assign('app',$app);
    	$this->display($app);
    }
}