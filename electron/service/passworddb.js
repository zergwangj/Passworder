'use strict';

const { Service } = require('ee-core');
const Storage = require('ee-core/storage');
const _ = require('lodash');
const path = require('path');

/**
 * sqlite数据存储
 * @class
 */
class PassworddbService extends Service {

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
    this.passwordSqliteDB = Storage.connection(this.sqliteFile, sqliteOptions);
  }

  /*
   * 检查并创建表 (sqlite)
   */
  async checkAndCreateTableSqlite(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name is required`);
    }
    // 检查表是否存在
    const userTable = this.passwordSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
    const result = userTable.get('table', tableName);
    //console.log('result:', result);
    if (result) {
      return;
    }

    // 创建表
    const create_table_password =
    `CREATE TABLE ${tableName}
     (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        website CHAR(128) UNIQUE NOT NULL,
        username CHAR(128) NOT NULL,
        password CHAR(128) NOT NULL,
        remark CHAR(512) NOT NULL
     );`
    this.passwordSqliteDB.db.exec(create_table_password);
  }

  /*
   * 增加 Password (sqlite)
   */
  async addPasswordSqlite(password) {
    // console.log("add password:", password);

    let table = 'password';
    await this.checkAndCreateTableSqlite(table);

    try {
      const insert = this.passwordSqliteDB.db.prepare(`INSERT INTO ${table} (website, username, password, remark) VALUES (@website, @username, @password, @remark)`);
      insert.run(password);

      return true;
    }
    catch (err) {
      console.log("addPasswordSqlite error:", err);
      return false;
    }
  }

  async batchAddPasswordSqlite(passwords) {
    console.log("add passwords:", passwords);

    let table = 'password';
    await this.checkAndCreateTableSqlite(table);

    try {
      const insert = this.passwordSqliteDB.db.prepare(`INSERT OR REPLACE INTO ${table} (website, username, password, remark) VALUES (@website, @username, @password, @remark)`);
      for (let password of passwords) {
        insert.run(password);
      }

      return true;
    }
    catch (err) {
      console.log("batchAddPasswordSqlite error:", err);
      return false;
    }
  }

  /*
   * 删除 Password (sqlite)
   */
  async deletePasswordSqlite(id = '') {
    //console.log("delete id:", id);

    let table = 'password';
    await this.checkAndCreateTableSqlite(table);

    try {
      const delPassword = this.passwordSqliteDB.db.prepare(`DELETE FROM ${table} WHERE id = ?`);
      delPassword.run(id);

      return true;
    }
    catch (err) {
      console.log("delPasswordSqlite error:", err);
      return false;
    }
  }

  /*
   * 修改 Password (sqlite)
   */
  async updatePasswordSqlite(password) {
    //console.log("update password:", password);

    let table = 'password';
    await this.checkAndCreateTableSqlite(table);

    try {
      const updatePassword = this.passwordSqliteDB.db.prepare(`UPDATE ${table} SET website = @website,username = @username,password = @password,remark = @remark WHERE id = @id`);
      updatePassword.run(password);
    }
    catch (err) {
      console.log("updatePasswordSqlite error:", err);
      return false;
    }

    return true;
  }  

  /*
   * 查询 Password (sqlite)
   */
  async getPasswordSqlite(website = '') {
    //console.log("select :", {website});

    let table = 'password';
    await this.checkAndCreateTableSqlite(table);

    try {
      const selectPassword = this.passwordSqliteDB.db.prepare(`SELECT * FROM ${table} WHERE website = ?`);
      const password = selectPassword.get(website);
      //console.log("select password:", password);
      return password;
    }
    catch (err) {
      console.log("getPasswordSqlite error:", err);
      return false;
    }
  }  
  
  /*
   * 全部 Password (sqlite)
   */
  async getAllPasswordSqlite() {
    //console.log("select all password");

    let table = 'password';
    await this.checkAndCreateTableSqlite(table);

    try {
      const selectAllPassword = this.passwordSqliteDB.db.prepare(`SELECT * FROM ${table} `);
      const allPassword =  selectAllPassword.all();
      //console.log("select allPassword:", allPassword);
      return allPassword;
    }
    catch (err) {
      console.log("getAllPasswordSqlite error:", err);
      return false;
    }
  }
  
  /*
   * get data dir (sqlite)
   */
  async getDataDir() {
    const dir = this.passwordSqliteDB.getStorageDir();    

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
    this.passwordSqliteDB = Storage.connection(dbFile, sqliteOptions);    

    return;
  }
}

PassworddbService.toString = () => '[class PassworddbService]';
module.exports = PassworddbService;
