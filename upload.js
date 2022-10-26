'use strict';

// 服务器路径相关配置
const host = '47.105.173.199'; // 服务器的IP地址
const port = '22'; // 服务器端口， 一般为 22
const username = 'root'; // 用户名
const password = 'Coreframe@#KG3l865Jkshg#'; // 密码
const path = '/usr/local/nginx/html/bohai_admin'; // 项目部署的服务器目标位置
// const path = "/usr/local/nginx/html/bohai_test"; // 项目部署的服务器目标位置 测试

// 引入scp2
const client = require('scp2');
// 下面三个插件是部署的时候控制台美化所用 可有可无
const ora = require('ora');
const chalk = require('chalk');
const spinner = ora(chalk.green(`正在发布到---${host}---服务器...`));
spinner.start();

client.scp(
    './dist/', // 本地打包文件的位置
    {
        host,
        port,
        username,
        password,
        path
    },
    err => {
        spinner.stop();
        if (!err) {
            console.log(
                chalk.green(`项目发布完毕,上传服务器目录为--->${path}`)
            );
        } else {
            console.log('err', err);
        }
    }
);
