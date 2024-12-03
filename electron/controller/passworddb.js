'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');

/**
 * passworddb
 * @class
 */
class PassworddbController extends Controller {

  constructor(ctx) {
    super(ctx);
  }

/**
* 所有方法接收两个参数
* @param args 前端传的参数
* @param event - ipc通信时才有值。详情见：控制器文档
*/

async getAllPassword() {
    const data = {
        result: null,
        all_list: [],
        code: 0
      };

    try {
        // test
        Services.get('passworddb').getDataDir();
    } catch (err) {
        console.log(err);
        data.code = -1;
        return data;
    }

    data.all_list = await Services.get('passworddb').getAllPasswordSqlite();

    return data;
}

async addPassword(args) {
    const data = {
        result: null,
        all_list: [],
        code: 0
      };

    try {
        // test
        Services.get('passworddb').getDataDir();
    } catch (err) {
        console.log(err);
        data.code = -1;
        return data;
    }

    const password = JSON.parse(args);
    const result = await Services.get('passworddb').addPasswordSqlite(password);
    if (!result) {
        data.code = -1;
    }

    return data;
}

async batchAddPassword(args) {
    const data = {
        result: null,
        all_list: [],
        code: 0
      };

    try {
        // test
        Services.get('passworddb').getDataDir();
    } catch (err) {
        console.log(err);
        data.code = -1;
        return data;
    }

    const passwords = JSON.parse(args);
    const result = await Services.get('passworddb').batchAddPasswordSqlite(passwords);
    if (!result) {
        data.code = -1;
    }

    return data;
}

async deletePassword(args) {
    const data = {
        result: null,
        all_list: [],
        code: 0
      };

    try {
        // test
        Services.get('passworddb').getDataDir();
    } catch (err) {
        console.log(err);
        data.code = -1;
        return data;
    }

    const id = args;
    const result = await Services.get('passworddb').deletePasswordSqlite(id);
    if (!result) {
      data.code = -1;
    }

    return data;
}

async updatePassword(args) {
    const data = {
        result: null,
        all_list: [],
        code: 0
      };

    try {
        // test
        Services.get('passworddb').getDataDir();
    } catch (err) {
        console.log(err);
        data.code = -1;
        return data;
    }
    const password = JSON.parse(args);
    const result = await Services.get('passworddb').updatePasswordSqlite(password);
    if (!result) {
      data.code = -1;
    }

    return data;
}

async getPassword(args) {
    const data = {
        result: null,
        all_list: [],
        code: 0
      };

    try {
        // test
        Services.get('passworddb').getDataDir();
    } catch (err) {
        console.log(err);
        data.code = -1;
        return data;
    }

    data.result = await Services.get('passworddb').getPasswordSqlite(args);

    return data;
}

}

PassworddbController.toString = () => '[class PassworddbController]';
module.exports = PassworddbController;