
/**
 * 主进程与渲染进程通信频道定义
 * Definition of communication channels between main process and rendering process
 */
const ipcApiRoute = {
  test: 'controller.example.test',

  // Password
  getAllPassword:　'controller.passworddb.getAllPassword',
  addPassword: 'controller.passworddb.addPassword',
  batchAddPassword: 'controller.passworddb.batchAddPassword',
  deletePassword: 'controller.passworddb.deletePassword',
  updatePassword: 'controller.passworddb.updatePassword',
  getPassword: 'controller.passworddb.getPassword',

  // FileDirDialog
  getExportDirPath: 'controller.filedirdialog.getExportDirPath',
  getImportFilePath: 'controller.filedirdialog.getImportFilePath',

  // Excel
  exportDataToExcel: 'controller.excel.exportDataToExcel',
  exportTemplateFile: 'controller.excel.exportTemplateFile',
  importExcelFile: 'controller.excel.importExcelFile',

  // Setting
  getSetting: 'controller.settingdb.getSetting',
  setSetting: 'controller.settingdb.setSetting',
}

export {
  ipcApiRoute
}

