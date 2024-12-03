'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');

/**
 * Excel Controller
 * @class
 */
class ExcelController extends Controller {

  constructor(ctx) {
    super(ctx);
  }


  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  async exportDataToExcel(args) {
    const data = {
      result: null,
      all_list: [],
      code: 0
    };

    const datas = JSON.parse(args).datas;
    const dirPath = JSON.parse(args).dirPath;
    const result = await Services.get('excel').exportDataToExcel(datas, dirPath);
    if (!result) {
        data.code = -1;
    }

    return data;
  }

  async exportTemplateFile(args) {
    const data = {
      result: null,
      all_list: [],
      code: 0
    };

    const datas = JSON.parse(args).datas;
    const dirPath = JSON.parse(args).dirPath;
    const result = await Services.get('excel').exportTemplateFile(datas, dirPath);
    if (!result) {
        data.code = -1;
    }

    return data;
  }

  async importExcelFile(args) {
    const data = {
      result: null,
      all_list: [],
      code: 0
    };

    const filePath = JSON.parse(args);
    const result = await Services.get('excel').importExcelFile(filePath);
    if (!result) {
        data.code = -1;
    }
    data.all_list = result;

    return data;
  }
}

ExcelController.toString = () => '[class ExcelController]';
module.exports = ExcelController;  