<template>
  <div>
    <el-table
      :data="listData"
      border
      style="width: 100%; margin-top: 20px"
      max-height="500"
      v-loading="loading"
    >
      <el-table-column label="权益编号" prop="benefitId" min-width="150"></el-table-column>
      <el-table-column label="开始时间" min-width="150" prop="startTime"></el-table-column>
      <el-table-column label="结束时间" min-width="150" prop="endTime"></el-table-column>
      <el-table-column label="面额（元）" prop="denomination" min-width="150">
        <template #default="scope">{{ formMoney(scope.row.denomination) }}</template>
      </el-table-column>
      <el-table-column label="红包名称" prop="outObjectName" min-width="200"></el-table-column>
      <el-table-column label="数量" prop="validTotalNum" min-width="120"></el-table-column>
      <el-table-column label="操作" min-width="200" prop="existBind">
        <template #default="scope">
          <span v-if="scope.row.existBind">已绑定</span>
          <el-button
            v-else
            type="text"
            @click="toBind(scope.row.benefitId, scope.row.denomination)"
          >去绑定</el-button>
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
      title="绑定红包"
      v-model="dialogVisible"
      :append-to-body="true"
      width="30%"
      @close="dialogVisible = false"
    >
      <el-form label-width="90px" :model="formData">
        <el-form-item label="红包金额：">
          <el-input v-model="formData.denomination" class="input"></el-input>
          <span>元</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="commitChange">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, toRefs } from 'vue'
import axios from 'utils/axios'

const state = reactive({
  formData: {
    denomination: 0,
    benefitId: ''
  },
  listData: [],
  pageNo: 1,
  pageSize: 5,
  total: 0,
  loading: false,
})

const { formData, listData, pageNo, pageSize, total, loading } = toRefs(state)

const getList = () => {
  loading.value = true
  const data = { pageNo: pageNo.value, pageSize: pageSize.value }
  axios
    .get('/admin/netflow/manager/getAliPayRedPackets.get', { data, target: 'promotionInteract' })
    .then((res) => {
      console.log('res:', res)
      loading.value = false
      listData.value = res.data.data
      total.value = res.data.data.length
    })
    .catch((err) => {
      loading.value = false
      throw err
    })
}
const handleSizeChange = (e) => {
  pageSize.value = e
  getList()
}
const handleCurrentChange = (e) => {
  pageNo.value = e
  getList()
}

//去绑定
const dialogVisible = ref(false)
const toBind = (id, denomination) => {
  dialogVisible.value = true
  formData.value.denomination = denomination / 100
  formData.value.benefitId = id + ''
}
const commitChange = () => {
  const data = { ...formData.value }
  data.denomination = data.denomination * 100
  axios
    .post('/admin/netflow/manager/benefitActivityRelation.post', data, { target: 'promotionInteract' })
    .then(res => {
      if (res.data.data === true) {
        ElMessage.success('绑定成功')
      }
      dialogVisible.value = false
      getList()
    })
    .catch(() => {
      dialogVisible.value = false
    })
}

const formMoney = (val) => {
  let money = (val / 100).toFixed(2)
  return money === 'NaN' ? '0.00' : money
}

getList()
</script>

<style>
</style>