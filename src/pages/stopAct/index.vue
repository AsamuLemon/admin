<template>
  <el-form label-width="100px" :model="form" ref="refForm" :rules="rules">
    <el-form-item label="用户Nick" prop="sellerNick">
      <el-col :span="4">
        <el-input v-model="form.sellerNick" placeholder="请填写用户Nick" :clearable="true"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="活动Id" prop="dingActId">
      <el-col :span="4">
        <el-input v-model.number="form.dingActId" placeholder="请输入活动Id" :clearable="true"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="stopAct('mobileInteract')">停止手淘活动</el-button>
      <el-button type="primary" @click="stopAct('promotionInteract')">停止营销活动</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, toRefs } from 'vue'
import axios from 'utils/axios'

const form = reactive({
  sellerNick: '',
  dingActId: ''
})

const rules = {
  sellerNick: [
    { required: true, message: '用户Nick不能为空', trigger: 'blur' }
  ],
  dingActId: [
    { required: true, message: '活动Id不能为空', trigger: 'blur' }
  ]
}

const refForm = ref(null)
const stopAct = (target) => {
  refForm.value.validate((valid) => {
    let url = ''
    if (valid) {
      let data = {}
      data.sellerNick = form.sellerNick
      if (target === 'mobileInteract') {
        url = '/ding/admin/act/actStop.post'
        data.dingActId = form.dingActId
      } else {
        url = '/admin/activity/manager/actStop.post'
        data.actId = form.dingActId
      }
      axios
        .post(url, data, { target })
        .then((res) => {
          console.log(res)
          if (res.data.data === true) {
            ElMessage.success('活动停止成功')
          }
        })
    } else {
      return false
    }
  })
}
</script>

<style>
</style>