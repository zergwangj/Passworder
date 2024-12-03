'use strict';

const { Service } = require('ee-core');
const Storage = require('ee-core/storage');
const _ = require('lodash');
const path = require('path');

/**
 * sqlite数据存储
 * @class
 */
class SettingdbService extends Service {

  constructor (ctx) {
    super(ctx);

    this.sqliteFile = 'data.db';
    let sqliteOptions = {
      driver: 'sqlite',
      default: {
        timeout: 6000,
        verbose: console.log // 打印sql语法
      }
    }
    this.settingSqliteDB = Storage.connection(this.sqliteFile, sqliteOptions);
  }

  /*
   * 检查并创建表 (sqlite)
   */
  async checkAndCreateTableSqlite(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name is required`);
    }
    // 检查表是否存在
    const userTable = this.settingSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
    const result = userTable.get('table', tableName);
    //console.log('result:', result);
    if (result) {
      return;
    }

    try {
      // 创建表
      const create_table_setting =
      `CREATE TABLE ${tableName}
      (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          is_lockscreen INTEGER NOT NULL,
          lockscreen_password CHAR(128) NOT NULL
      );`
      this.settingSqliteDB.db.exec(create_table_setting);

      // 插入默认数据
      const insert = this.settingSqliteDB.db.prepare(`INSERT OR REPLACE INTO ${tableName} (id, is_lockscreen, lockscreen_password) VALUES (1, 0, '')`);
      insert.run();
    }
    catch (err) {
      console.log("checkAndCreateTableSqlite error:", err);
    }
  }

  /*
   * 修改 Setting (sqlite)
   */
  async setSettingSqlite(setting) {
    console.log("set setting:", setting);

    let table = 'setting';
    await this.checkAndCreateTableSqlite(table);
    setting.id = 1;

    try {
      const setSetting = this.settingSqliteDB.db.prepare(`UPDATE ${table} SET is_lockscreen = @is_lockscreen,lockscreen_password = @lockscreen_password WHERE id = @id`);
      setSetting.run(setting);
    }
    catch (err) {
      console.log("setSettingSqlite error:", err);
      return false;
    }

    return true;
  }  

  /*
   * 查询 Setting (sqlite)
   */
  async getSettingSqlite() {
    //console.log("get setting");

    let table = 'setting';
    await this.checkAndCreateTableSqlite(table);
    let id = 1;

    try {
      const getSetting = this.settingSqliteDB.db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
      const setting = getSetting.get(id);
      //console.log("get setting:", setting);
      return setting;
    }
    catch (err) {
      console.log("getSettingSqlite error:", err);
      return false;
    }
  }  
  
  /*
   * get data dir (sqlite)
   */
  async getDataDir() {
    const dir = this.settingSqliteDB.getStorageDir();    

    return dir;
  } 

  /*
   * set custom data dir (sqlite)
   */
  async setCustomDataDir(dir) {
    if (_.isEmpty(dir)) {
      return;
    }

    // the absolute path of the db file
    const dbFile = path.join(dir, this.sqliteFile);
    const sqliteOptions = {
      driver: 'sqlite',
      default: {
        timeout: 6000,
        verbose: console.log
      }
    }
    this.settingSqliteDB = Storage.connection(dbFile, sqliteOptions);    

    return;
  }
}

SettingdbService.toString = () => '[class SettingdbService]';
module.exports = SettingdbService;
