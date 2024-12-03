'use strict';

const { Service } = require('ee-core');
const { dialog } = require('electron');
const Storage = require('ee-core/storage');
const _ = require('lodash');
const path = require('path');
const fs = require("fs");

/**
 * 文件/目录选择服务
 * @class
 */
class FiledirdialogService extends Service {

  constructor(ctx) {
    super(ctx);
  }

  async getExportDirPath() {
    const dirPaths = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });
    if (dirPaths === undefined) return false;
    if (dirPaths.length > 0) {
      const dirPath = dirPaths[0];
      return dirPath;
    } else {
      return false;
    }
  };
  
  async getImportFilePath() {
    const filePaths = dialog.showOpenDialogSync({
      properties: ["openFile"],
      filters: [
        { name: 'Excel Files', extensions: ['xlsx', 'xls'] },
        { name: 'All Files', extensions: ['*'] }
      ],
    });
    if (filePaths === undefined) return false;
    if (filePaths.length > 0) {
      const filePath = filePaths[0];
      return filePath;
    } else {
      return false;
    }
  };
}

FiledirdialogService.toString = () => '[class FiledirdialogService]';
module.exports = FiledirdialogService;