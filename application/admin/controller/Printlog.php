<?php

namespace app\admin\controller;

use app\common\controller\Backend;

/**
 * 
 *
 * @icon fa fa-circle-o
 */
class Printlog extends Backend
{

    /**
     * Printlog模型对象
     * @var \app\admin\model\Printlog
     */
    protected $model = null;
    protected $dataLimit = 'auth';
    protected $dataLimitField = 'print_admin_id';

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\Printlog;

    }

    /**
     * 查看
     */
    public function index()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags', 'trim']);
        if ($this->request->isAjax()) {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField')) {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            $list = $this->model->alias("m")
                ->join(["fa_usertemp"=>"ut"],"ut.id = m.temp_id")
                ->join(["fa_temple"=>"t"],"t.id = ut.temp_id")
                ->join(["fa_admin"=>"admin"],"admin.id = m.print_admin_id")
                ->field("m.*, t.name, t.exa_image, admin.username")
                ->where($where)
                ->order($sort, $order)
                ->paginate($limit);

            $result = array("total" => $list->total(), "rows" => $list->items());

            return json($result);
        }
        return $this->view->fetch();
    }


    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */


}
