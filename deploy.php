<?php
namespace Deployer;

require 'recipe/common.php';

// Project name
set('application', 'admin-template');

// Project repository
set('repository', 'https://github.com/h136799711/admin-template.git');

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', true);

// Shared files/dirs between deploys
set('shared_files', []);
set('shared_dirs', []);

// Writable dirs by web server
set('writable_dirs', []);
set('allow_anonymous_stats', false);

// Hosts

host('hebidu.cn')
    ->set('deploy_path', '/home/repo/api.admin');

task('update', function (){
    $random = date("Ymd_H_i_s", time());

    if (test('[ -d {{deploy_path}}/public_bak ]')) {
        writeln("移除服务器的备份");
        run("rm -fr {{deploy_path}}/public_bak");
    }
    if (!testLocally('[ -d ./dist ]')) {
        writeln("等待编译");
        runLocally("npm run prod");
    }
    writeln("本地编译完成,准备上传到服务器");
    if (test('[ -d {{deploy_path}}/public ]')) {
        writeln("备份服务器上的正式版本");
        run("mv {{deploy_path}}/public {{deploy_path}}/public_bak");
    }
    writeln("上传新版本到服务器");
    upload('dist/', '{{deploy_path}}/public');
    if (testLocally('[ -d ./dist ]')) {
        writeln("删除本地dist");
        runLocally("rm -fr ./dist/");
    }
});

