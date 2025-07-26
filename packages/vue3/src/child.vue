<template>
  <div class="refresh-on-focus-demo__container">
    <div v-if="data && !error">
      <NSpace vertical align="center">
        <NAvatar :src="data.avatar" :size="100" round />
        <div class="refresh-on-focus-demo__slogen">Hey! {{ data.name }}!</div>
        <NButton @click="handleLogout">Logout</NButton>
      </NSpace>
    </div>
    <NResult v-else status="403" title="403" description="Not authorized!">
      <template #footer>
        <NButton @click="handleLogin">Login</NButton>
      </template>
    </NResult>
  </div>
</template>

<script lang="ts">
import { NAvatar, NButton, NResult, NSpace } from 'naive-ui';
import { defineComponent } from 'vue';
import { useRequest } from '@async-handler/request/vue3-request';

type UserInfo = {
  name: string;
  avatar: string;
};

const storeKey = 'vue-request-token';

function getStore() {
  return localStorage.getItem(storeKey);
}
function setStore() {
  window.localStorage.setItem(storeKey, 'vue-request');
}

function clearStore() {
  window.localStorage.removeItem(storeKey);
}

function getToken() {
  return new Promise<string>(resolve => {
    setTimeout(() => {
      setStore();
      resolve('token');
    }, 300);
  });
}

function getUserInfo() {
  return new Promise<UserInfo>((resolve, reject) => {
    setTimeout(() => {
      if (getStore()) {
        return resolve({
          name: 'John60676',
          avatar:
            'https://portrait.gitee.com/uploads/avatars/user/1838/5516429_john60676_1608255970.png!avatar200',
        });
      } else {
        reject('Not authorized!');
      }
    }, 300);
  });
}

export default defineComponent({
  components: {
    NResult,
    NButton,
    NSpace,
    NAvatar,
  },
  setup() {
    const { data, error, run } = useRequest(getUserInfo, {
      refreshOnWindowFocus: true,
      refocusTimespan: 1000,
    });

    const { run: login } = useRequest(getToken, {
      manual: true,
    });

    const handleLogin = () => {
      login();
      run();
    };

    const handleLogout = () => {
      clearStore();
      run();
    };
    return {
      data,
      error,
      handleLogin,
      handleLogout,
    };
  },
});
</script>

<style scoped lang="scss">
.refresh-on-focus-demo {
  &__slogen {
    font-weight: 600;
    font-size: 20px;
  }
}
</style>
