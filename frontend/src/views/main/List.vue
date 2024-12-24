<script setup>
import { onMounted, ref, computed, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ipcApiRoute } from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";
import useClipboard from "vue-clipboard3";
import LockScreen from "./LockScreen.vue";

const { toClipboard } = useClipboard();

const copyToClipboard = async (val) => {
  try {
    await toClipboard(val);
    // console.log('复制成功!')
  } catch (e) {
    console.log(e);
  }
};

// ref中可以设置默认值
// const searchVal = ref()

// 表格数据
const tableData = ref([]);

// 加载完成后执行
onMounted(() => {
  init();
  setupLockscreen(); // 初始化锁屏
});

onUnmounted(() => {
  clearLockscreen(); // 销毁锁屏
});

function init() {
  getAllPassword();
  getSettingSync();
  // console.log("isLockscreen: ", isLockscreen.value);
  if (isLockscreen.value) {
    if (null != refLockscreen.value) {
      refLockscreen.value.lock();
      refLockscreen.value.setLockscreenPassword(lockscreenPassword.value);
    }
  } else {
    if (null != refLockscreen.value) {
      refLockscreen.value.unlock();
    }
  }
}

function getAllPassword() {
  ipc.invoke(ipcApiRoute.getAllPassword, "").then((res) => {
    if (res.all_list.length == 0) {
      console.log("没有数据");
      return false;
    }
    // console.log(res.all_list);
    tableData.value = res.all_list;
    Reflect.set(tableData.value, "showPassword", false);
  });
}

// table高度
const tableHeight = ref();

onMounted(() => {
  tableHeight.value = window.innerHeight - 140;
  window.onresize = () => {
    tableHeight.value = window.innerHeight - 140;
  };
});

const showAddPasswordDrawer = ref(false);
const addPasswordForm = ref({
  website: "",
  username: "",
  password: "",
  remark: "",
});

const addPassword = () => {
  // 在这里添加密码逻辑，比如将表单数据添加到 tableData 中
  // console.log(addPasswordForm.value);
  ipc
    .invoke(ipcApiRoute.addPassword, JSON.stringify(addPasswordForm.value))
    .then((res) => {
      if (res.code == -1) {
        console.log("添加失败");
        return false;
      }

      // tableData.value.push(addPasswordForm.value);
      addPasswordForm.value = {
        website: "",
        username: "",
        password: "",
        remark: "",
      };
      getAllPassword();
      showAddPasswordDrawer.value = false;
      ElMessage({
        type: "success",
        message: "添加成功",
      });
    });
};

const showEditPasswordDrawer = ref(false);
const editPasswordForm = ref({});

const showEditPassword = (row) => {
  editPasswordForm.value = { ...row };
  showEditPasswordDrawer.value = true;
};

const saveEditPassword = () => {
  // console.log(editPasswordForm.value);
  ipc
    .invoke(ipcApiRoute.updatePassword, JSON.stringify(editPasswordForm.value))
    .then((res) => {
      if (res.code == -1) {
        console.log("更新失败");
        return false;
      }

      getAllPassword();
      showEditPasswordDrawer.value = false;
      ElMessage({
        type: "success",
        message: "更新成功",
      });
    });
};

const showDeleteConfirmDialogVisible = ref(false);
const rowToDelete = ref(null);

const showDeleteConfirmDialog = (row) => {
  rowToDelete.value = row;
  // console.log(rowToDelete.value);
  showDeleteConfirmDialogVisible.value = true;
};

// const showDeleteConfirm = (row) => {
//   rowToDelete.value = row;
//   console.log(rowToDelete.value);
//   // showDeleteConfirmDialogVisible.value = true;
//   ElMessageBox.confirm(
//     '确定要删除这条记录吗?',
//     '确认删除',
//     {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning',
//     }
//   )
//   .then(() => {
//     deletePassword();
//     ElMessage({
//       type: 'success',
//       message: '删除成功',
//     })
//   })
//   .catch(() => {
//     ElMessage({
//       type: 'info',
//       message: '删除被取消',
//     })
//   });
// };

const deletePassword = () => {
  // console.log(rowToDelete.value)
  ipc.invoke(ipcApiRoute.deletePassword, rowToDelete.value.id).then((res) => {
    if (res.code == -1) {
      console.log("删除失败");
      return false;
    }
    getAllPassword();
    showDeleteConfirmDialogVisible.value = false;

    ElMessage({
      type: "success",
      message: "删除成功",
    });
  });
};

const copyPasswordToClipboard = (row) => {
  copyToClipboard(row.password);
  // console.log('Copied to clipboard:', row.password);
  ElMessage({
    type: "success",
    message: "密码拷贝成功",
  });
};

const searchWebsite = ref("");

const filteredTableData = computed(() => {
  return tableData.value.filter((item) =>
    item.website.toLowerCase().includes(searchWebsite.value.toLowerCase())
  );
});

const togglePasswordVisibility = (row, show) => {
  row.showPassword = show;
};

const rowStyle = (arg) => {
  return {
    rowHeight: "20px",
  };
};

const showImportDropdown = ref(false);

const exportDirPath = ref("");

// 导出数据到excel
const exportDataToExcel = () => {
  // console.log("exportDataToExcel");
  const args = {
    dirPath: "",
    datas: [],
  };

  ipc.invoke(ipcApiRoute.getExportDirPath).then((res) => {
    if (res.code == -1) {
      console.log("获取导出目录失败");
      return false;
    }
    exportDirPath.value = res.result;

    args.dirPath = exportDirPath.value;
    args.datas = tableData.value;
    ipc
      .invoke(ipcApiRoute.exportDataToExcel, JSON.stringify(args))
      .then((res) => {
        if (res.code == -1) {
          console.log("导出失败");
          return false;
        }
        ElMessage({
          type: "success",
          message: "导出成功",
        });
      });
  });
};

// 下载模板文件
const exportTemplateFile = () => {
  // console.log("exportTemplateFile");
  const args = {
    dirPath: "",
    datas: [
      {
        id: 1,
        website: "baidu",
        username: "test",
        password: "123456",
        remark: "test",
      },
    ],
  };

  ipc.invoke(ipcApiRoute.getExportDirPath).then((res) => {
    if (res.code == -1) {
      console.log("获取导出目录失败");
      return false;
    }
    exportDirPath.value = res.result;

    args.dirPath = exportDirPath.value;
    ipc
      .invoke(ipcApiRoute.exportTemplateFile, JSON.stringify(args))
      .then((res) => {
        if (res.code == -1) {
          console.log("导出失败");
          return false;
        }
        ElMessage({
          type: "success",
          message: "导出成功",
        });
      });
  });
};

const importFilePath = ref("");
// 导入Excel文件
const importExcelFile = () => {
  // console.log("importExcelFile");

  ipc.invoke(ipcApiRoute.getImportFilePath).then((res) => {
    if (res.code == -1) {
      console.log("获取导入文件失败");
      return false;
    }
    importFilePath.value = res.result;

    ipc
      .invoke(ipcApiRoute.importExcelFile, JSON.stringify(importFilePath.value))
      .then((res) => {
        if (res.code == -1) {
          console.log("导入失败");
          return false;
        }

        let importTableData = res.all_list;
        ipc
          .invoke(ipcApiRoute.batchAddPassword, JSON.stringify(importTableData))
          .then((res) => {
            if (res.code == -1) {
              console.log("导入失败");
              return false;
            }
            getAllPassword();
            ElMessage({
              type: "success",
              message: "导入成功",
            });
          });
      });
  });
};

const showSettingDrawer = ref(false);
const settingForm = ref({});

const showSetting = () => {
  getSetting();
  showSettingDrawer.value = true;
};

const getSetting = () => {
  ipc.invoke(ipcApiRoute.getSetting).then((res) => {
    if (res.code == -1) {
      console.log("获取设置失败");
      return false;
    }
    settingForm.value = res.result;
    // console.log(res.result);
    isLockscreen.value = res.result.is_lockscreen;
    lockscreenPassword.value = res.result.lockscreen_password;
  });
};

function getSettingSync() {
  const res = ipc.sendSync(ipcApiRoute.getSetting);
  if (res.code == -1) {
    console.log("获取设置失败");
    return false;
  }
  settingForm.value = res.result;
  // console.log(res.result);
  isLockscreen.value = res.result.is_lockscreen;
  lockscreenPassword.value = res.result.lockscreen_password;
}

const saveSetting = () => {
  // console.log(settingForm.value);
  if (settingForm.value.is_lockscreen == false) {
    settingForm.value.lockscreen_password = "";
  }
  ipc
    .invoke(ipcApiRoute.setSetting, JSON.stringify(settingForm.value))
    .then((res) => {
      if (res.code == -1) {
        console.log("更新失败");
        return false;
      }

      getAllPassword();
      showSettingDrawer.value = false;
      ElMessage({
        type: "success",
        message: "更新成功",
      });
      getSetting();
    });
};

const timerLockscreen = ref(null);
const TIMEOUT = 1000 * 60 * 5; // 5分钟
// const TIMEOUT = 1000 * 10;
const refLockscreen = ref(null);
const isLockscreen = ref(false);
const lockscreenPassword = ref("");

// const lockScreen = () => {
//   refLockscreen.value.lock();
// };

const setupLockscreen = () => {
  const resetTimer = () => {
    clearTimeout(timerLockscreen.value);
    timerLockscreen.value = setTimeout(function () {
      getSetting();
      if (isLockscreen.value) {
        refLockscreen.value.lock();
        refLockscreen.value.setLockscreenPassword(lockscreenPassword.value);
      } else {
        refLockscreen.value.unlock();
      }
    }, TIMEOUT);
  };

  document.addEventListener("mousemove", resetTimer);
  document.addEventListener("keypress", resetTimer);
  resetTimer(); // 初始化计时器
};

const clearLockscreen = () => {
  clearTimeout(timerLockscreen.value);
  if (null != refLockscreen.value) {
    refLockscreen.value.unlock();
  }
};
</script>

<template>
  <div class="app-container">
    <el-container>
      <el-header height="0px"> </el-header>
      <el-main>
        <div class="layout-wrapper">
          <div class="layout-left-container">
            <el-button
              type="primary"
              icon="Plus"
              @click="showAddPasswordDrawer = true"
            >
              添加密码
            </el-button>
            <el-dropdown
              style="margin-left: 15px; margin-right: 15px"
              trigger="click"
            >
              <el-button text icon="Upload">
                导入<el-icon class="el-icon--right">
                  <ArrowDown />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="importExcelFile" icon="Upload"
                    >导入</el-dropdown-item
                  >
                  <el-dropdown-item @click="exportTemplateFile"
                    >下载模板文件</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button text icon="Download" @click="exportDataToExcel">
              导出
            </el-button>
            <el-button text icon="Setting" @click="showSetting">
              设置
            </el-button>
          </div>
          <div class="layout-right-container">
            <el-input
              placeholder="搜索网站"
              v-model="searchWebsite"
              clearable
              suffix-icon="Search"
              style="width: 300px"
            >
            </el-input>
          </div>
        </div>
        <div class="table-container">
          <el-table
            :data="filteredTableData"
            style="width: 100%"
            :height="tableHeight"
            empty-text="暂无数据"
            :border="true"
            :header-cell-style="{ background: '#F0F0F0', color: '#000000' }"
            :row-style="rowStyle"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="website" label="网站"> </el-table-column>
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="password" label="密码">
              <template #default="scope">
                <div class="layout-wrapper">
                  <div
                    class="layout-left-container"
                    v-if="!scope.row.showPassword"
                  >
                    <span v-if="scope.row.password">{{ "•".repeat(8) }}</span>
                    <!-- <el-button v-if="scope.row.password" size="mini" @click="togglePasswordVisibility(scope.row)">显示</el-button> -->
                  </div>
                  <div class="layout-left-container" v-else>
                    <span>{{ scope.row.password }}</span>
                    <!-- <el-button v-if="scope.row.password" size="mini" @click="togglePasswordVisibility(scope.row)">隐藏</el-button> -->
                    <!-- <Edit /> -->
                  </div>
                  <div
                    class="layout-right-container"
                    v-if="!scope.row.showPassword"
                  >
                    <el-icon
                      @mousedown="togglePasswordVisibility(scope.row, true)"
                      @mouseleave="togglePasswordVisibility(scope.row, false)"
                      @mouseup="togglePasswordVisibility(scope.row, false)"
                      :size="20"
                      style="vertical-align: middle"
                    >
                      <View />
                    </el-icon>
                  </div>
                  <div class="layout-right-container" v-else>
                    <el-icon
                      @mousedown="togglePasswordVisibility(scope.row, true)"
                      @mouseleave="togglePasswordVisibility(scope.row, false)"
                      @mouseup="togglePasswordVisibility(scope.row, false)"
                      :size="20"
                      style="vertical-align: middle"
                    >
                      <Hide />
                    </el-icon>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-link
                  type="primary"
                  href="#"
                  size="small"
                  @click="showEditPassword(scope.row)"
                  >编辑</el-link
                >
                &nbsp;
                <el-link
                  type="primary"
                  href="#"
                  size="small"
                  @click="showDeleteConfirmDialog(scope.row)"
                  >删除</el-link
                >
                &nbsp;
                <el-link
                  type="primary"
                  href="#"
                  size="small"
                  @click="copyPasswordToClipboard(scope.row)"
                  >拷贝密码</el-link
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 添加密码弹框 -->
        <el-drawer size="40%" v-model="showAddPasswordDrawer">
          <template #header>
            <h5>添加密码</h5>
          </template>
          <el-form
            label-position="top"
            label-width="60px"
            :model="addPasswordForm"
          >
            <el-form-item prop="website">
              <template #label>
                <div class="require-star">网站</div>
              </template>
              <el-input v-model="addPasswordForm.website"></el-input>
            </el-form-item>
            <el-form-item prop="username">
              <template #label>
                <div class="require-star">用户名</div>
              </template>
              <el-input v-model="addPasswordForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <template #label>
                <div class="require-star">密码</div>
              </template>
              <el-input
                v-model="addPasswordForm.password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :rows="8"
                v-model="addPasswordForm.remark"
              ></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button type="primary" @click="addPassword">保存</el-button>
            <el-button @click="showAddPasswordDrawer = false">取消</el-button>
          </template>
        </el-drawer>
        <!-- 编辑弹框 -->
        <el-drawer size="40%" v-model="showEditPasswordDrawer">
          <template #header>
            <h5>编辑密码</h5>
          </template>
          <el-form
            label-position="top"
            label-width="60px"
            :model="editPasswordForm"
          >
            <el-form-item prop="website">
              <template #label>
                <div class="require-star">网站</div>
              </template>
              <el-input v-model="editPasswordForm.website"></el-input>
            </el-form-item>
            <el-form-item prop="username">
              <template #label>
                <div class="require-star">用户名</div>
              </template>
              <el-input v-model="editPasswordForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <template #label>
                <div class="require-star">密码</div>
              </template>
              <el-input
                v-model="editPasswordForm.password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :rows="8"
                v-model="editPasswordForm.remark"
              ></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button type="primary" @click="saveEditPassword">保存</el-button>
            <el-button @click="showEditPasswordDrawer = false">取消</el-button>
          </template>
        </el-drawer>
        <!-- 删除确认弹框 -->
        <el-dialog
          v-model="showDeleteConfirmDialogVisible"
          :show-close="false"
          width="300px"
        >
          <h3>确定删除记录？</h3>
          确定后，记录无法被找回
          <template #footer>
            <el-button link @click="showDeleteConfirmDialogVisible = false"
              >取消</el-button
            >
            <el-button type="danger" link @click="deletePassword"
              >确定</el-button
            >
          </template>
        </el-dialog>
        <!-- 设置弹框 -->
        <el-drawer size="40%" v-model="showSettingDrawer">
          <template #header>
            <h5>设置</h5>
          </template>
          <el-form label-position="top" label-width="60px" :model="settingForm">
            <el-form-item prop="">
              <template #label>
                <el-checkbox
                  v-model="settingForm.is_lockscreen"
                  :true-value="1"
                  :false-value="0"
                  >锁屏</el-checkbox
                >
              </template>
              <el-input
                placeholder="锁屏密码"
                show-password
                :disabled="!settingForm.is_lockscreen"
                v-model="settingForm.lockscreen_password"
              ></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button type="primary" @click="saveSetting">保存</el-button>
            <el-button @click="showSettingDrawer = false">取消</el-button>
          </template>
        </el-drawer>
      </el-main>
      <el-footer height="20px">
        <div class="layout-wrapper">
          <div class="layout-left-container">
            <div>共 {{ tableData.length }} 条密码记录</div>
          </div>
          <div class="layout-right-container">
            <div>版本V1.0.1 Copyright© 2024 All Rights Reserved.</div>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
  <lock-screen ref="refLockscreen"></lock-screen>
</template>

<style scoped>
.el-table th {
  background: rgb(234, 234, 234);
}

:deep(.el-input__suffix .el-input__suffix-inner) {
  flex-direction: row-reverse;
  -webkit-flex-direction: row-reverse;
  display: flex;
}

:deep(.el-drawer .el-drawer__header) {
  padding: 0px 0px;
  height: 30px;
  color: #000000;
  margin-bottom: 0px;
  border-bottom: 1px solid #ccc;
}

:deep(.el-drawer .el-drawer__header h5) {
  text-align: left;
  margin-left: 10px;
}

:deep(.el-drawer .el-drawer__body) {
  overflow-y: auto;
}

:deep(.el-drawer .el-drawer__body::-webkit-scrollbar) {
  display: none;
}

.require-star:after {
  vertical-align: middle;
  content: " *";
  color: rgba(255, 59, 48, 1);
  font-size: 100%;
}

:deep(.el-drawer .el-drawer__footer) {
  text-align: left;
  border-top: 1px solid #ccc;
}
:deep(.el-drawer .el-drawer__footer .el-button) {
  min-width: 100px;
}
:deep(.el-dialog .el-dialog__footer) {
  padding-top: 50px;
  text-align: center;
}
:deep(.el-dialog .el-dialog__footer .el-button) {
  min-width: 100px;
}

.app-container {
  background-image: ("@/assets/background.png");
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 0.9;
}

.table-container {
  margin-top: 20px;
}

.table-row {
  line-height: 20px;
}

.layout-wrapper {
  display: flex;
  justify-content: space-between;
}

.layout-left-container {
  display: inline-block;
  text-align: left;
}

.layout-right-container {
  display: inline-block;
  text-align: right;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}
</style>
