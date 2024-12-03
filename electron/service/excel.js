'use strict';

const { Service } = require('ee-core');
const XLSX = require('xlsx');
const path = require('path');

/**
 * Excel service
 * @class
 */
class ExcelService extends Service {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * 导出数据到Excel文件
   */
  async exportDataToExcel(datas, dirPath) {
    if (!datas || !dirPath) return;

    try {
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(datas);
      XLSX.utils.book_append_sheet(wb, ws, 'Passwords');
      let filePath = path.join(dirPath, 'passwords.xlsx');
      XLSX.writeFile(wb, filePath);

      return true;
    }
    catch (e) {
      console.log(e);
      return false;
    }
  }

  /**
   * 导出模板文件
   */
  async exportTemplateFile(datas, dirPath) {
    if (!datas || !dirPath) return;

    try {
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.json_to_sheet(datas);
      XLSX.utils.book_append_sheet(wb, ws, 'Passwords');
      let filePath = path.join(dirPath, 'template.xlsx');
      XLSX.writeFile(wb, filePath);

      return true;
    }
    catch (e) {
      console.log(e);
      return false;
    }
  }

  /**
   * 导入Excel文件
   */
  async importExcelFile(filePath) {
    if (!filePath) return;

    try {
      let wb = XLSX.readFile(filePath);
      let ws = wb.Sheets[wb.SheetNames[0]];
      let datas = XLSX.utils.sheet_to_json(ws, { });
      console.log(datas);
      return datas;
    }
    catch (e) {
      console.log(e);
      return false;
    }
  }
}

ExcelService.toString = () => '[class ExcelService]';
module.exports = ExcelService;