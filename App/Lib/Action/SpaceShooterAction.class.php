<?php
class SpaceShooterAction extends Action {
	protected function _initialize() {
      header("Content-Type:text/html; charset=utf-8");
      $this->assign('ac','Html5');
      $this->assign('title','SpaceShooter');
	}
    public function index(){
        $this->display();
    }
}