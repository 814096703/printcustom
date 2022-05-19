<?php

namespace app\admin\model;

use think\Model;


class Userpurchaselog extends Model
{

    

    

    // 表名
    protected $name = 'userpurchaselog';
    
    // 自动写入时间戳字段
    // protected $autoWriteTimestamp = 'int';
    protected $autoWriteTimestamp = 'datetime';
    protected $dateFormat = 'Y-m-d H:i:s';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = false;
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];
    

    







}
