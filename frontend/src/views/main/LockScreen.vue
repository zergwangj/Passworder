<script setup>
import { onMounted, defineExpose, ref, nextTick } from "vue";

const isLocked = ref(false);
const lockscreenPassword = ref(""); // 锁屏密码（数据库中保存的，用于校验）
const inputPassword = ref(""); // 输入的密码
const showPasswordErrorDialogVisible = ref(false);

const refInput = ref(null);

onMounted(() => {});

const focusInput = () => {
  nextTick(() => {
    refInput.value.focus();
  });
};

const lock = () => {
  isLocked.value = true;
  inputPassword.value = "";
  focusInput();
};

const unlock = () => {
  isLocked.value = false;
  inputPassword.value = "";
};

const setLockscreenPassword = (password) => {
  lockscreenPassword.value = password;
};

const checkLockscreenPassword = () => {
  if (inputPassword.value === "") {
    return;
  }
  if (inputPassword.value === lockscreenPassword.value) {
    unlock();
  } else {
    showPasswordErrorDialogVisible.value = true;
  }
  inputPassword.value = "";
};

defineExpose({
  lock,
  unlock,
  setLockscreenPassword,
});
</script>

<template>
  <div>
    <div v-if="isLocked" class="lock-screen">
      <div class="lock-screen-content">
        <h1>已锁屏</h1>
        <el-form @submit.prevent>
          <el-form-item>
            <el-input
              ref="refInput"
              placeholder="输入锁屏密码"
              show-password
              v-model="inputPassword"
              @keyup.enter="checkLockscreenPassword"
              style="width: 300px"
            >
              <template #suffix>
                <el-icon
                  class="custom-icon-cursor"
                  @click="checkLockscreenPassword"
                  ><right
                /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 密码错误弹框 -->
      <el-dialog
        v-model="showPasswordErrorDialogVisible"
        :show-close="false"
        width="300px"
      >
        <h3>密码不正确，请再输入一次。</h3>
        <template #footer>
          <el-button
            type="primary"
            link
            @click="showPasswordErrorDialogVisible = false"
            >确定</el-button
          >
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.lock-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7); /* 遮罩层背景色 */
  backdrop-filter: blur(6px); /* 模糊效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  z-index: 9999; /* 确保遮罩层在最上层 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.lock-screen-content {
  /* 这里添加锁屏内容的样式 */
  background-color: rgba(255, 255, 255, 0.3);
  padding: 20px;
  border-radius: 5px;
}

.myclass {
  z-index: 999999;
}

:deep(.custom-icon-cursor) {
  cursor: pointer;
}
</style>
