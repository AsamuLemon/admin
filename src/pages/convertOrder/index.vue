<template>
  <div>
    <el-form
      :madal="searchForm"
      :inline="true"
      style="display: flex; justify-content: space-between; width: 50%"
    >
      <el-form-item>
        <div style="display: flex">
          <el-input
            placeholder="请输入用户nick"
            v-model="searchForm.sellerNick"
            @input="searchForm.sellerNick = searchForm.sellerNick.trim()"
          ></el-input>
          <el-button type="primary" @click="onSearch">
            <el-icon>
              <search />
            </el-icon>
          </el-button>
          <el-button type="primary" @click="onRefresh" style="margin--left: 0">
            <el-icon>
              <el-icon>
                <refresh />
              </el-icon>
            </el-icon>
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="订单状态：">
        <el-select v-model="searchForm.state" @change="orderStatuChange">
          <el-option
            v-for="(item, index) in stateOption"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="list" style="width: 100%; margin-top: 20px" v-loading="loading">
      <el-table-column label="用户nick" prop="sellerNick"></el-table-column>
      <el-table-column label="订单状态" prop="orderId">
        <template #default="scope">{{ scope.row.state === 3 ? '待发货' : '已发货' }}</template>
      </el-table-column>
      <el-table-column label="兑换时间" prop="createTime"></el-table-column>
      <el-table-column label="兑换礼品" prop="title"></el-table-column>
      <el-table-column label="收货人信息" prop="consignee">
        <template #default="scope">
          <span>{{ scope.row.consignee }}</span>
          <el-popover placement="bottom" trigger="hover">
            <!-- template -->
            <template #reference>
              <el-button type="text" style="margin-left: 5px">更多</el-button>
            </template>
            <template #default>
              <div>
                <h3>发货信息</h3>
                <p>发货地址：{{ scope.row.address }}</p>
                <p>收货人：{{ scope.row.consignee }}</p>
                <p>联系方式：{{ scope.row.phone }}</p>
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="物流单号" prop="waybillNum">
        <template #default="scope">
          <span v-if="scope.row.waybillNum">{{ scope.row.type }}{{ scope.row.waybillNum }}</span>
          <span v-else>
            无
            <el-button type="text" style="margin-left: 5px" @click="openDelivery(scope.row.id)">发货</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="淘宝订单号">
        <template #default="scope">{{ scope.row.tbOrderId ? scope.row.tbOrderId : '无' }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      small
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[5, 10, 15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="发货" v-model="dialogVisible" :append-to-body="true" width="30%">
      <el-form label-width="100px">
        <el-form-item label="物流信息:">
          <el-input v-model="deliveryForm.type"></el-input>
        </el-form-item>
        <el-form-item label="物流单号:">
          <el-input v-model="deliveryForm.waybillNum"></el-input>
        </el-form-item>
        <el-form-item label="淘宝订单号:">
          <el-input v-model="deliveryForm.tbOrderId" placeholder="没有则不填"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onDelivery">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import axios from 'utils/axios'
import { Search, Refresh } from '@element-plus/icons-vue'

const stateOption = [
  {
    value: 3,
    label: '待发货'
  },
  {
    value: 7,
    label: '已发货'
  }
]

const searchForm = ref({
  state: 3,
  sellerNick: ''
})
const pageNo = ref(1)
const pageSize = ref(5)
const total = ref(0)
const list = ref([])
const loading = ref(false)
const getList = () => {
  const data = {
    ...searchForm.value,
    pageNo: pageNo.value,
    pageSize: pageSize.value,
  }
  axios
    .get('/ding/admin/member/cardBagEntities.get', { data })
    .then((res) => {
      loading.value = false
      list.value = res.data.data.list
      total.value = res.data.data.totalCount
      console.log(res)
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

const onSearch = () => {
  pageNo.value = 1
  pageSize.value = 5
  getList()
}
const orderStatuChange = (e) => {
  searchForm.value.state = e
  pageNo.value = 1
  pageSize.value = 5
  getList()
}
const onRefresh = () => {
  pageNo.value = 1
  pageSize.value = 5
  searchForm.value.sellerNick = ''
  searchForm.value.state = 3
  getList()
}

//发货
const dialogVisible = ref(false)
const deliveryForm = ref({
  waybillNum: '',
  type: '',
  tbOrderId: '',
  cardBagId: ''
})
const openDelivery = (id) => {
  dialogVisible.value = true
  deliveryForm.value.cardBagId = id
}
const onDelivery = () => {
  if (!deliveryForm.value.type) {
    return ElMessage.warning('请输入物流信息')
  }
  if (!deliveryForm.value.waybillNum) {
    return ElMessage.warning('请输入物流单号')
  }
  // dialogVisible.value = false
  const data = { ...deliveryForm.value }
  axios
    .post('/ding/admin/member/confirmDelivery.post', data)
    .then((res) => {
      if (res.data) {
        ElMessage.success('发货成功')
        onRefresh()
      }
    })
}

getList()
</script>

<style>
</style>