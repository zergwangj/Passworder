'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');

/**
 * example
 * @class
 */
class FiledirdialogController extends Controller {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  async getExportDirPath() {
    const data = {
      result: null,
      all_list: [],
      code: 0
    };

    const result = await Services.get('filedirdialog').getExportDirPath();
    if (!result) {
      data.code = -1;
    }
    data.result = result;

    return data;
  }

  async getImportFilePath() {
    const data = {
      result: null,
      all_list: [],
      code: 0
    };

    const result = await Services.get('filedirdialog').getImportFilePath();
    if (!result) {
      data.code = -1;
    }
    data.result = result;

    return data;
  }
}

FiledirdialogController.toString = () => '[class FiledirdialogController]';
module.exports = FiledirdialogController;  