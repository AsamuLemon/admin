<template>
  <div class="loginBox">
    <div class="middle-wrapper">
      <div class="adminTitle">后台管理系统</div>
      <div class="content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="refForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label-width="0" prop="account">
            <el-input v-model="ruleForm.account" placeholder="请输入账号" :prefix-icon="User"></el-input>
          </el-form-item>
          <el-form-item prop="pwd" label-width="0">
            <el-input v-model="ruleForm.pwd" placeholder="请输入密码" show-password :prefix-icon="Key"></el-input>
          </el-form-item>
          <div class="btnBox">
            <el-button type="primary" class="btn" @click="loginHandle('ruleForm')">登录系统</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from 'utils/axios'
import { ref, reactive, toRefs } from 'vue'
import router from '@/router'
import { User, Key } from '@element-plus/icons-vue'
const refForm = ref(null)
const state = reactive({
  checkCode: '',
  ruleForm: {
    account: '',
    pwd: ''
  },

})

const { ruleForm } = toRefs(state)
const rules = {
  // account: [
  //   { required: true, message: '请输入账号名称', trigger: 'blur' },
  //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  // ],
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const loginHandle = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      login()
    }
  })
}

const login = () => {
  const datas = {
    name: ruleForm.value.account,
    password: ruleForm.value.pwd
  }
  axios
    .post('/admin/account/login.post', datas)
    .then(res => {
      console.log('?', res)
      sessionStorage.setItem('token', res.data.data)
      router.push('/userSearch')
    })
    .catch((err) => {
      throw err
    })
}


</script>
<style lang="scss" scoped>
.loginBox {
  background: #0277bd;
  width: 100%;
  height: 100%;
  .middle-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    .adminTitle {
      text-align: center;
      font-size: 60px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 30px;
      letter-spacing: 3px;
      text-shadow: 2px 4px rgba(197, 223, 248, 0.8),
        3px 5px rgba(179, 233, 248, 0.8), 4px 6px rgba(179, 233, 248, 0.8),
        5px 7px rgba(179, 233, 248, 0.8), 6px 8px rgba(179, 233, 248, 0.8);
    }
    .content {
      min-width: 520px;
      padding: 30px 50px;
      background: #fff;
      border-radius: 5px;
      box-sizing: border-box;
      .validCodeBox {
        display: flex;
        line-height: 0;
        .code {
          flex: 1;
        }
        .validCode {
          flex: 1;
          text-align: right;
        }
      }
    }
    .btnBox {
      text-align: center;
      margin-top: 10px;
      .btn {
        width: 40%;
      }
    }
  }
}
</style>
