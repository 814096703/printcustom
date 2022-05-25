<?php

namespace app\admin\controller;

use app\common\controller\Backend;
use think\Db;
use think\exception\PDOException;
use think\exception\ValidateException;
use Exception;
use app\admin\library\Auth;

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
        $this->buyLogModel = new \app\admin\model\Userpurchaselog;
        $this->userTempModel = new \app\admin\model\Usertemp;
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

    public function buy($id)
    {
        $auth = Auth::instance();
        $admin_id = $auth->isLogin() ? $auth->id : 0;
        if($admin_id==0){
            $this->error("请先登录");
        }

        $product = $this->model->get(intval($id));
        if(!$id || !$product ){
            $this->error("购买的产品不存在");
        }

        $lastlog = $this->buyLogModel
            ->where('product_id', $product['id'])
            ->where('admin_id', $admin_id)
            ->find();
        if($lastlog){
            $this->error("您已购买该产品，请勿重复购买");
        }
        
       
        
        Db::startTrans();
        try {
            $newlog = [
                'purchase_price'=>$product['price'],
                'product_id'=>$product['id'],
                'admin_id'=>$admin_id,
                'createtime'=>date("Y-m-d H:i:s"),
                
            ];
            $logResult = $this->buyLogModel->allowField(true)->save($newlog);
            $usertemp = [
                'temp_id'=>$product['temp_id'],
                'admin_id'=>$admin_id,
                'createtime'=>date("Y-m-d H:i:s"),
                'updatetime'=>date("Y-m-d H:i:s"),
                'weigh'=>10,
                'default_data'=>'{}',
                'purchase_id'=>$logResult['id']
            ];
            $result = $this->userTempModel->allowField(true)->save($usertemp);
            Db::commit();
        } catch (ValidateException $e) {
            Db::rollback();
            $this->error($e->getMessage());
        } catch (PDOException $e) {
            Db::rollback();
            $this->error($e->getMessage());
        } catch (Exception $e) {
            Db::rollback();
            $this->error($e->getMessage());
        }
        if ($result !== false) {
            $this->success('购买成功！');
        } else {
            $this->error('购买出错');
        }
        
    }

    public function pay()
    {
        # code...
        // echo '111';
        // echo \addons\epay\library\Service::submitOrder("99.9", "4646", "wechat", "订单标题", "回调地址", "返回地址", "web");
        
    }

    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */


}
