'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');

/**
 * settingdb
 * @class
 */
class SettingdbController extends Controller {

  constructor(ctx) {
    super(ctx);
  }

/**
* 所有方法接收两个参数
* @param args 前端传的参数
* @param event - ipc通信时才有值。详情见：控制器文档
*/

async setSetting(args) {
    const data = {
        result: null,
        all_list: [],
        code: 0
      };

    try {
        // test
        Services.get('settingdb').getDataDir();
    } catch (err) {
        console.log(err);
        data.code = -1;
        return data;
    }
    const setting = JSON.parse(args);
    const result = await Services.get('settingdb').setSettingSqlite(setting);
    if (!result) {
      data.code = -1;
    }

    return data;
}

async getSetting(args) {
    const data = {
        result: null,
        all_list: [],
        code: 0
      };

    try {
        // test
        Services.get('settingdb').getDataDir();
    } catch (err) {
        console.log(err);
        data.code = -1;
        return data;
    }

    data.result = await Services.get('settingdb').getSettingSqlite(args);

    return data;
}

}

SettingdbController.toString = () => '[class SettingdbController]';
module.exports = SettingdbController;