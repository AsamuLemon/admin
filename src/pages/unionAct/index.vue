<template>
  <el-form :inline="true" :model="unionForm">
    <el-row type="flex" justify="space-between">
      <el-col :span="15">
        <el-form-item label="用户Nick:">
          <el-input v-model="unionForm.sellerNick" placeholder="请输入用户nick" clearable></el-input>
        </el-form-item>
        <el-form-item label="活动id:">
          <el-input v-model="unionForm.actId" placeholder="请输入活动id" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch()">查询</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-table
    :data="listData"
    border
    style="width: 100%; margin-top: 20px"
    max-height="500"
    v-loading="loading"
  >
    <el-table-column label="用户Nick" prop="sellerNick" min-width="150"></el-table-column>
    <el-table-column label="活动ID" min-width="150" prop="actId"></el-table-column>
    <el-table-column label="任务ID" min-width="150" prop="taskId"></el-table-column>
    <el-table-column label="日限制量（元）" prop="quotaDay" min-width="150">
      <template #default="scope">{{ formMoney(scope.row.quotaDay) }}</template>
    </el-table-column>
    <el-table-column label="日总赠送量（元）" prop="dayConsume" min-width="200">
      <template #default="scope">{{ formMoney(scope.row.dayConsume) }}</template>
    </el-table-column>
    <el-table-column label="总限额（元）" prop="quota" min-width="120">
      <template #default="scope">{{ formMoney(scope.row.quota) }}</template>
    </el-table-column>
    <el-table-column label="渠道类型" prop="channel" min-width="120">
      <template #default="scope">{{ getChannel(scope.row.channel) }}</template>
    </el-table-column>
    <el-table-column label="投放状态" prop="status" min-width="120"></el-table-column>
    <el-table-column label="操作" min-width="200">
      <template #default="scope">
        <el-button
          type="text"
          v-if="scope.row.status === '投放中'"
          @click="onChange(scope.row.taskId, scope.row.channel)"
        >修改渠道</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    small
    v-show="total > 0"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pageNo"
    :page-sizes="[5, 10, 15]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  ></el-pagination>
  <el-dialog
    title="渠道修改"
    v-model="dialogVisible"
    :append-to-body="true"
    width="30%"
    @close="dialogVisible = false"
  >
    <el-select v-model="formData.channel" placeholder="请选择">
      <el-option
        v-for="item in channelOption"
        :key="item.key"
        :value="item.key"
        :label="item.value"
      ></el-option>
    </el-select>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="commitChange">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, toRefs } from 'vue'
import axios from 'utils/axios'

const state = reactive({
  unionForm: {
    actId: '',
    sellerNick: ''
  },
  formData: {
    channel: '',
    taskId: 0
  },
  listData: [],
  loading: false,
  pageNo: 1,
  pageSize: 5,
  total: 0,
})

const { unionForm, formData, listData, loading, pageNo, pageSize, total } = toRefs(state)

const getTableList = () => {
  loading.value = true
  const data = {
    ...unionForm.value,
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  axios
    .get('/admin/union/activity/manager/taskList.get', { data, target: 'union' })
    .then(res => {
      loading.value = false
      const { list, totalCount } = res.data.data
      listData.value = list
      total.value = totalCount
    })
    .catch((err) => {
      loading.value = false
      throw err
    })
}
const handleSizeChange = (e) => {
  pageSize.value = e
  getTableList()
}
const handleCurrentChange = (e) => {
  pageNo.value = e
  getTableList()
}

const onSearch = () => {
  pageNo.value = 1
  pageSize.value = 5
  getTableList()
}

//修改渠道
const dialogVisible = ref(false)
const channelOption = [
  {
    key: 'QD-BBTKJ-923276',
    value: '宝贝团渠道'
  },
  {
    key: '99',
    value: '全部渠道'
  }
]
const getChannel = (channel) => {
  if (channel === 'QD-BBTKJ-923276') {
    return '宝贝团渠道'
  } else if (channel === '99') {
    return '全部渠道'
  }
}
const onChange = (id, channel) => {
  formData.value.taskId = id
  formData.value.channel = getChannel(channel)
  dialogVisible.value = true
}
const commitChange = () => {
  const data = { ...formData.value }
  if (
    formData.value.channel === '宝贝团渠道' ||
    formData.value.channel === '全部渠道'
  ) {
    ElMessage.warning('渠道未改变')
  } else {
    axios
      .post('/admin/union/activity/manager/changeChannel.post', data, { target: 'union' })
    changeChannel(formData.value)
      .then((res) => {
        if (res.data) {
          ElMessage.success('渠道修改成功')
          dialogVisible.value = false
          getTableList()
        }
      })
  }
}

const formMoney = (val) => {
  let money = (val / 100).toFixed(2)
  return money === 'NaN' ? '0.00' : money
}

getTableList()
</script>

<style>
</style>