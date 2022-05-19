<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 
 *
 * @icon fa fa-circle-o
 */
class Product extends Backend
{

    /**
     * Product模型对象
     * @var \app\admin\model\Product
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Product;

    }

    public function shop()
    {
        # code...
        $list = $this->model->select();

        $this->view->assign("list",$list);
        $this->assignconfig('list',$list);
        return $this->view->fetch();
    }

    public function getTempByPid($id)
    {
        # code...
        $row = $this->model->alias("p")
            ->join(["fa_temple"=>"t"], "t.id = p.temp_id")
            ->field("t.tempdata, t.fielddata")
            ->where("p.id", intval($id))
            ->find();
        return json($row);
    }

    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */


}
