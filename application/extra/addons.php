<?php

return [
    'autoload' => false,
    'hooks' => [
        'app_init' => [
            'epay',
        ],
        'admin_login_init' => [
            'loginbg',
        ],
    ],
    'route' => [],
    'priority' => [],
    'domain' => '',
];
