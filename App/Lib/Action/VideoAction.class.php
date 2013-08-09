<?php

/**
 * 首页
 */


class VideoAction extends Action {

  protected function _initialize() {
      header("Content-Type:text/html; charset=utf-8");
      $this->assign('ac',is_null($_GET['_URL_'][0])?'Index':$_GET['_URL_'][0]);
      $this->assign('title','dragonsom');
  }

  public function index() {
      $this->display();
  }

}

?>