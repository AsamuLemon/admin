<template>
  <el-form ref="refWithDraw" :inline="true" :model="withDrawForm" class="demo-form-inline">
    <el-row type="flex" justify="space-between">
      <el-col :span="5">
        <el-form-item>
          <el-select v-model="withDrawForm.refundStatus" placeholder="请选择">
            <el-option
              v-for="item in optionsSort"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="15">
        <el-form-item label="用户Nick:">
          <el-input v-model="withDrawForm.nick" placeholder="请输入用户nick"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="orderTime"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
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
    <el-table-column label="用户Nick" prop="nick" min-width="150"></el-table-column>
    <el-table-column label="提现流量（M）" min-width="150">
      <template #default="scope">{{ scope.row.refundAmount * 10 }}</template>
    </el-table-column>
    <el-table-column label="折现提现金额（元）" prop="refundAmount" min-width="150">
      <template #default="scope">{{ formMoney(scope.row.refundAmount) }}</template>
    </el-table-column>
    <el-table-column label="提现申请时间" prop="refundApplyTime" min-width="200"></el-table-column>
    <el-table-column label="提现状态" prop="remainingTime" min-width="120">
      <template #default="scope">
        <span v-if="scope.row.refundStatus === 0">待审核</span>
        <span v-else-if="scope.row.refundStatus === 1">审核拒绝</span>
        <span v-else-if="scope.row.refundStatus === 2">退款成功</span>
        <span v-else>已取消</span>
      </template>
    </el-table-column>
    <el-table-column label="退款支付宝账号" prop="refundAlipayNo" min-width="100"></el-table-column>
    <el-table-column label="支付流水号" prop="refundSerialNo" min-width="150"></el-table-column>
    <el-table-column label="操作" min-width="200">
      <template #default="scope">
        <el-button type="text" @click="onCheck(scope.row.id)">审核</el-button>
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
    title="流量提现审核"
    v-model="dialogVisible"
    :append-to-body="true"
    width="30%"
    @close="closeDialog"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="flowForm"
      label-width="110px"
      class="demo-ruleForm"
    >
      <el-form-item label="审核结果" prop="audit">
        <el-radio-group v-model="ruleForm.audit">
          <el-radio :label="2">审核通过</el-radio>
          <el-radio :label="1">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支付宝账号" prop="refundPartyAlipayNo" v-if="ruleForm.audit == 2">
        <el-input v-model="ruleForm.refundPartyAlipayNo"></el-input>
      </el-form-item>
      <el-form-item label="支付宝流水号" prop="alipayFlowNo" v-if="ruleForm.audit == 2">
        <el-input v-model="ruleForm.alipayFlowNo"></el-input>
      </el-form-item>
      <el-form-item label="审核不通过原因" prop="auditNoPassMsg" v-if="ruleForm.audit == 1">
        <el-input type="textarea" v-model="ruleForm.auditNoPassMsg" placeholder="审核不通过原因"></el-input>
      </el-form-item>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="oncheckFlow">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { ref, reactive, toRefs, watch } from 'vue'
import axios from 'utils/axios'

const state = reactive({
  withDrawForm: {
    refundStatus: 4,
    nick: '',
    startTime: '',
    endTime: ''
  },
  ruleForm: {
    audit: 2,
    refundPartyAlipayNo: '',
    alipayFlowNo: '',
    auditNoPassMsg: '',
    id: ''
  },
  pageNo: 1,
  pageSize: 5,
  total: 0,
  listData: [],
  loading: false
})

const { withDrawForm, ruleForm, pageNo, pageSize, total, listData, loading } = toRefs(state)
const orderTime = ref('')


const validateRefundPartyAlipayNo = (rule, value, callback) => {
  if (!value) {
    callback(new Error('支付宝账号不能为空'))
  } else {
    callback()
  }
}
const validateAlipayFlowNo = (rule, value, callback) => {
  if (!value) {
    callback(new Error('支付宝流水号不能为空'))
  } else {
    callback()
  }
}
const validateRefundId = (rule, value, callback) => {
  if (!value) {
    callback(new Error('退款记录id不能为空'))
  } else {
    callback()
  }
}
const validateAuditNoPassMsg = (rule, value, callback) => {
  if (!value) {
    callback(new Error('审核不通过原因不能为空'))
  } else {
    callback()
  }
}

const rules = {
  refundPartyAlipayNo: [
    { validator: validateRefundPartyAlipayNo, trigger: 'blur' }
  ],
  alipayFlowNo: [{ validator: validateAlipayFlowNo, trigger: 'blur' }],
  auditNoPassMsg: [
    { validator: validateAuditNoPassMsg, trigger: 'blur' }
  ],
  id: [{ validator: validateRefundId, trigger: 'blur' }]
}

const optionsSort = [
  {
    value: 0,
    label: '待审核'
  },
  {
    value: 1,
    label: '审核拒绝'
  },
  {
    value: 2,
    label: '退款成功'
  },
  {
    value: 3,
    label: '已取消'
  },
  {
    value: 4,
    label: '全部'
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

watch(() => ruleForm.value.audit, (val) => {
  console.log(val)
  if (val == 2) {
    ruleForm.value.auditNoPassMsg = ''
    flowForm.value.clearValidate('auditNoPassMsg')
  } else {
    ruleForm.value.alipayFlowNo = ''
    ruleForm.value.refundPartyAlipayNo = ''
    flowForm.value.clearValidate('alipayFlowNo')
    flowForm.value.clearValidate('refundPartyAlipayNo')
  }
})

const getRefundList = () => {
  loading.value = true
  const data = {
    ...withDrawForm.value,
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  console.log('这是啥：', data)
  axios
    .get('/ding/admin/refundList.get', { data })
    .then((res) => {
      console.log('测试：', res)
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
  getRefundList()
}
const handleCurrentChange = (e) => {
  pageNo.value = e
  getRefundList()
}

const refWithDraw = ref(null)
const onSearch = () => {
  if (orderTime.value) {
    const startTime = orderTime.value[0]
    const endTime = orderTime.value[1]
    withDrawForm.value.startTime = moment(startTime).format(
      'YYYY-MM-DD HH:mm:ss'
    )
    withDrawForm.value.endTime = moment(endTime).format(
      'YYYY-MM-DD HH:mm:ss'
    )
  } else {
    withDrawForm.value.startTime = ''
    withDrawForm.value.endTime = ''
  }
  refWithDraw.value.validate((valid) => {
    if (valid) {
      getRefundList()
    } else {
      return false
    }
  })
}

//审核
const dialogVisible = ref(false)
const flowForm = ref(null)
const onCheck = (id) => {
  ruleForm.value.id = id
  dialogVisible.value = true
}
const oncheckFlow = () => {
  flowForm.value.validate((valid) => {
    if (valid) {
      const data = { ...ruleForm.value }
      axios
        .post('/ding/admin/refundAudit.post', data)
        .then((res) => {
          console.log(res)
          if (res.data.auditSuccess) {
            ElMessage.success('流量提现审核操作成功')
            dialogVisible.value = false
            getRefundList()
          }
        })
    }
  })
}

const closeDialog = () => {
  dialogVisible.value = false
  ruleForm.value.refundPartyAlipayNo = ''
  ruleForm.value.alipayFlowNo = ''
  ruleForm.value.auditNoPassMsg = ''
  ruleForm.value.id = ''
}

const formMoney = (val) => {
  let money = (val / 100).toFixed(2)
  return money === 'NaN' ? '0.00' : money
}

getRefundList()
</script>

<style>
</style>