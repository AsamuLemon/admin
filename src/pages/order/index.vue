<template>
  <div>
    <div class="header">
      <el-form ref="refForm" :madal="searchForm" :inline="true">
        <el-form-item>
          <el-select v-model="searchForm.tkStatus" placeholder="请选择" @change="orderStatuChange">
            <el-option
              v-for="(item, index) in orderOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.commissionStatus"
            placeholder="请选择"
            @change="coinStatuChange"
          >
            <el-option
              v-for="(item, index) in coinOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            >{{ item.label }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div>
            <el-select v-model="searchForm.timeStatus">
              <el-option
                v-for="(item, index) in timeOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-date-picker
              v-model="time"
              type="datetimerange"
              :shortcuts="shortcuts"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="display: flex">
            <el-input placeholder="请输入订单号" style="width: 300px" v-model="searchForm.orderId"></el-input>
            <el-button type="primary" @click="onSearch">
              <el-icon>
                <search />
              </el-icon>搜索
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" style="width: 100%; margin-top: 20px" v-loading="loading">
      <el-table-column label="订单号" prop="orderId"></el-table-column>
      <el-table-column label="订单状态" prop="tkStatus"></el-table-column>
      <el-table-column label="下单时间" prop="tkCreateTime"></el-table-column>
      <el-table-column label="商品">
        <template #default="scope">
          <img
            :src="scope.row.mainPic"
            style="width: 50px; height: 50px; cursor: pointer"
            @click="toPage(scope.row.itemLink)"
          />
        </template>
      </el-table-column>
      <el-table-column label="完成时间" prop="commissionTime"></el-table-column>
      <el-table-column label="实际金额(元)">
        <template #default="scope">{{ formMoney(scope.row.actualPrice) }}</template>
      </el-table-column>
      <el-table-column label="实际佣金(元)">
        <template #default="scope">{{ formMoney(scope.row.totalCommissionFee) }}</template>
      </el-table-column>
      <el-table-column label="赠送积分" prop="commissionAmount"></el-table-column>
    </el-table>
    <el-pagination
      small
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[5, 10, 15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
  </div>
</template>

<script setup>
import moment from 'moment'
import { ref } from 'vue'
import axios from 'utils/axios'
import { Search } from '@element-plus/icons-vue'


const orderOption = [
  {
    value: '',
    label: '订单状态'
  },
  {
    value: '3',
    label: '订单结算'
  },
  {
    value: '12',
    label: '订单付款'
  },
  {
    value: '13',
    label: '订单失效'
  },
  {
    value: '14',
    label: '订单成功'
  }
]
const coinOption = [
  {
    value: '',
    label: '金币状态'
  },
  {
    value: 'WAIT',
    label: '未返还'
  },
  {
    value: 'SUCCESS',
    label: '已返还'
  },
  {
    value: 'INVALID',
    label: '无需返还'
  }
]
const timeOption = [
  {
    value: '0',
    label: '下单时间'
  },
  {
    value: '1',
    label: '完成时间'
  }
]
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

const searchForm = ref({
  tkStatus: '',
  commissionStatus: '',
  timeStatus: '0',
  orderId: '',
  startTime: '',
  endTime: '',
})
const time = ref('')
const pageNo = ref(1)
const pageSize = ref(5)
const totalCount = ref(0)
const list = ref([])
const loading = ref(false)
const getList = () => {
  if (time.value) {
    searchForm.value.startTime = moment(
      time.value[0]
    ).format('YYYY-MM-DD HH:mm:ss')
    searchForm.value.endTime = moment(time.value[1]).format(
      'YYYY-MM-DD HH:mm:ss'
    )
  } else {
    searchForm.value.startTime = ''
    searchForm.value.endTime = ''
  }
  loading.value = true
  const data = {
    ...searchForm.value,
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  axios
    .get('/client/admin/alipay/orders.get', { data, target: 'yunma' })
    .then((res) => {
      console.log('res:', res)
      loading.value = false
      list.value = res.data.data.data.list
      totalCount.value = res.data.data.data.totalCount
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

const onSearch = () => {
  pageNo.value = 1
  pageSize.value = 5
  getList()
}

const orderStatuChange = (e) => {
  searchForm.value.orderStatus = e
  getList()
}
const coinStatuChange = (e) => {
  searchForm.value.coinStatus = e
  getList()
}

const toPage = (url) => {
  window.open(url)
}

const formMoney = (val) => {
  let money = (val / 100).toFixed(2)
  return money === 'NaN' ? '0.00' : money
}

getList()
</script>

<style>
</style>