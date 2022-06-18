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
        $this->tempModel = new \app\admin\model\Temple;
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
                ->join(["fa_temple"=>"t"],"t.id = m.temp_id")
                ->field("m.*, t.name, t.exa_image")
                ->where($where)
                ->order($sort, $order)
                ->paginate($limit);

            $result = array("total" => $list->total(), "rows" => $list->items());

            return json($result);
        }
        return $this->view->fetch();
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
        // 查询模板
        $exist_temp = $this->userTempModel
            ->where('temp_id', $product['temp_id'])
            ->where('admin_id', $admin_id)
            ->find();
        if($exist_temp){
            $this->error("您已拥有相同模板，请勿重复购买");
        }

        // 查询订单
        $lastlog = $this->buyLogModel
            ->where('product_id', $product['id'])
            ->where('admin_id', $admin_id)
            ->find();

        // 创建订单记录
        if(!$lastlog){
            $newlog = [
                'purchase_price'=>$product['price'],
                'product_id'=>$product['id'],
                'admin_id'=>$admin_id,
                'createtime'=>date("Y-m-d H:i:s"),
                'ispay'=>0,
            ];
            $lastlog = $this->buyLogModel::create($newlog);
            if(!$newlog){
                $this->error("创建订单出错");
            }
        }

        if($lastlog['ispay']==1){
            $this->error("您已购买该产品，请勿重复购买");
        }

        // 免费的模板通过ajax完成
        if ($this->request->isAjax()) {
            
            if($product['price']==0){
                $lastlog['ispay'] = 1;
                $lastlog->save();
                // 因为没有打开窗口的回调函数，所以在这里直接录入用户模板
                $temp = $this->tempModel->where("id", $product['temp_id'])->find();
                $usertemp = [
                    'temp_id'=>$temp['id'],
                    'admin_id'=>$admin_id,
                    'createtime'=>date("Y-m-d H:i:s"),
                    'updatetime'=>date("Y-m-d H:i:s"),
                    'weigh'=>10,
                    'tempdata'=>$temp['tempdata'],
                    'fielddata'=>$temp['fielddata'],
                    'purchaselog_id'=>$lastlog['id'],
                    'overdue_days'=>$product['overdue_days'],
                    'shop_link'=>$product['shop_link']
                ];
                $result = $this->userTempModel->allowField(true)->save($usertemp);
                if ($result) {
            
                    $this->success('在我的模板中查看');
                } else {
                    $this->error('添加用户模板出错');
                }
                
            }else{
                $this->error("请购买");
            }
        }
        
        // 创建支付链接
        $encryptInfo = $product['price'].'-'.$product['id'].'-'.$admin_id;
        $key = 'camesoft';
        $orderCode = openssl_encrypt($encryptInfo, 'DES-ECB', $key);

        if ($lastlog !== false) {
            // base64 urlsafe encode
            $find = array('+', '/');
            $replace = array('-', '_');
            $orderCode = str_replace($find, $replace, $orderCode);
            // $this->success($orderCode);
        } else {
            $this->error('购买出错');
        }
        $serverurl = '101.35.112.113';
        $pay_url = 'http://'.$serverurl.'/paycenter/paycentersk.php?ordercode='.$orderCode.'&p_name='.$product['p_name'];
        $this->view->assign("pay_url", $pay_url);
        $this->assignconfig('pay_url', $pay_url);
        return $this->view->fetch();
        
    }

    // 检查订单是否已支付完成
    public function ispay($id=null)
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

        if(!$lastlog){
            $this->error("购买出错，购买记录不存在");
        }

        if($lastlog['ispay']==0){
            $this->error("支付失败未完成");
        }
        
        // 添加用户模板
        $temp = $this->tempModel->where("id", $product['temp_id'])->find();
        
        $usertemp = [
            'temp_id'=>$temp['id'],
            'admin_id'=>$admin_id,
            'createtime'=>date("Y-m-d H:i:s"),
            'updatetime'=>date("Y-m-d H:i:s"),
            'weigh'=>10,
            'tempdata'=>$temp['tempdata'],
            'fielddata'=>$temp['fielddata'],
            'purchaselog_id'=>$lastlog['id'],
            'overdue_days'=>$product['overdue_days'],
            'shop_link'=>$product['shop_link']
        ];
        $result = $this->userTempModel->allowField(true)->save($usertemp);
        if ($result) {
    
            $this->success('在我的模板中查看');
        } else {
            $this->error('添加用户模板出错');
        }
        
    }

    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */


}
