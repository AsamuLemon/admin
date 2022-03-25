<template>
  <div>
    <el-table :data="list" style="width: 100%; margin-top: 20px" v-loading="loading">
      <el-table-column label="店铺链接" prop="shopLink" min-width="200"></el-table-column>
      <el-table-column label="活动id" prop="dingActId"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="bindShop(scope.row.dingActId)">绑定店铺</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      small
      v-show="totalCount > 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[5, 10, 15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
    <el-dialog title="赠送积分" v-model="dialogVisible" :append-to-body="true" width="30%" destroy-on-close>
      <el-form ref="refBindShop" :model="shopData" :inline="true" label-suffix="：" :rules="rules">
        <el-form-item label="店铺名" :required="true" prop="shopName">
          <el-input v-model="shopData.shopName" onkeyup="value = value.trim()"></el-input>
        </el-form-item>
        <el-form-item label="淘宝名" :required="true" prop="sellerNick">
          <el-input v-model="shopData.sellerNick" onkeyup="value = value.trim()"></el-input>
        </el-form-item>
        <el-form-item label="店铺id" :required="true" prop="shopId">
          <el-input v-model.number="shopData.shopId"></el-input>
        </el-form-item>
        <el-form-item label="淘宝id" :required="true" prop="sellerId">
          <el-input v-model.number="shopData.sellerId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitShop">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import axios from 'utils/axios'
const rules = {
  shopName: [
    { required: true, message: '请输入店铺名', trigger: 'blur' }
  ],
  sellerNick: [
    { required: true, message: '请输入淘宝名', trigger: 'blur' }
  ],
  shopId: [{ required: true, message: '请输入店铺id', trigger: 'blur' }],
  sellerId: [{ required: true, message: '请输入淘宝id', trigger: 'blur' }]
}

const pageNo = ref(1)
const pageSize = ref(5)
const totalCount = ref(0)
const list = ref([])
const loading = ref(false)
const getList = () => {
  loading.value = true
  const data = {
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  axios
    .get('/ding/admin/shopBind/shopBindLinks.get', { data, target: 'ding_admin' })
    .then((res) => {
      list.value = res.data.list
      totalCount.value = res.data.totalCount
      loading.value = false
    })
    .catch(() => {
      loading.value = false
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

const actId = ref('')
const dialogVisible = ref(false)
const refBindShop = ref(null)
const shopData = ref({
  shopName: '',
  sellerNick: '',
  shopId: '',
  sellerId: ''
})
//绑定店铺
const bindShop = (id) => {
  actId.value = id
  dialogVisible.value = true
}
const submitShop = () => {
  const data = { ...shopData.value, dingActId: actId.value }
  refBindShop.value.validate((valid) => {
    if (!valid) {
      return false
    } else {
      axios
        .post('/ding/admin/shopBind/shopBind.post', data, { target: 'ding_admin' })
        .then((res) => {
          if (res.data) {
            ElMessage.success('绑定成功')
            pageNo.value = 1
            getList()
          } else {
            ElMessage.error('绑定失败')
          }
          refBindShop.value.resetFields()
          dialogVisible.value = false
        })
    }
  })
}
</script>

<style>
</style>