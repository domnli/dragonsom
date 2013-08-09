<?php

/**
 * 邪恶漫画
 */


class XemhAction extends Action {

  protected function _initialize() {
      header("Content-Type:text/html; charset=utf-8");
      $this->assign('ac',is_null($_GET['_URL_'][0])?'Index':$_GET['_URL_'][0]);
      $this->assign('title','邪恶漫画');
  }

  public function index() {
      $catlist=M('xemh_catalogue')->field('dimgurl,gid')->where('isgetcontent = 1')->order('cid desc')->limit(30)->select();
      $this->assign('clist',$catlist);
      $this->display();
  }
  public function catload($offset){
      $catlist=M('xemh_catalogue')->field('dimgurl,gid')->where('isgetcontent = 1')->order('cid desc')->limit("$offset,30")->select();
      if($catlist){
    	  $this->ajaxReturn($catlist,'',1);
      }else{
      	$this->ajaxReturn(0,'',0);
      }
        
  }
  public function details($gid){
  	$contents=M('xemh_content')->field('add_intro,source')->where("gid = $gid")->select();
        $json=json_encode($contents);
        $this->assign('data',$json);
  	$this->display();
  }

}

?>