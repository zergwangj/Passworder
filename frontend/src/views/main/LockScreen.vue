<script setup>
import { onMounted, defineExpose, ref, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const isLocked = ref(false);
const lockscreenPassword = ref(""); // 锁屏密码（数据库中保存的，用于校验）
const inputPassword = ref(""); // 输入的密码

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
  if (inputPassword.value === lockscreenPassword.value) {
    unlock();
  } else {
    ElMessage({
      type: "error",
      message: "密码错误",
      duration: 10000,
      customClass: "myclass",
    });
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
            suffix-icon="Right"
            style="width: 300px"
          >
          </el-input>
        </el-form-item>
      </el-form>
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
</style>
