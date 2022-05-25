<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 
 *
 * @icon fa fa-circle-o
 */
class Usertemp extends Backend
{

    /**
     * Usertemp模型对象
     * @var \app\admin\model\Usertemp
     */
    protected $model = null;
    protected $dataLimit = 'auth';
    protected $dataLimitField = 'admin_id';

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Usertemp;
        $this->tempModel = new \app\admin\model\Temple;
    }

    public function print($ids){
        $row = $this->model->get($ids);
        if(!$row){
            $this->error("不存在该条记录");
        }
        $temp = $this->tempModel->where('id', $row['temp_id'])->find();

        $this->assignconfig("temp",$temp);
        $this->assignconfig("row",$row);
        $this->assignconfig("ids",$ids);
        return $this->view->fetch();
    }

    public function savedefaultdata()
    {
        # code...
        if($this->request->isPost()){
            $id = $this->request->post("id");
            $data = $this->request->post("data");
            $row = $this->model->get($id);
            if(!$row){
                $this->error("不存在该条记录");
            }
            $row['default_data'] = $data;
            $result = $row->save();
            if ($result !== false) {
                $this->success('保存成功！');
            } else {
                $this->error('保存出错');
            }
        }
        

    }


    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */


}
