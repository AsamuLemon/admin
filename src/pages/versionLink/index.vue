<template>
  <div class="content-box">
    <div class="box-header">
      <div class="left-header">
        <el-input placeholder="请输入备注或活动代码" v-model="searchValue"></el-input>
        <el-button @click="search">
          <i class="el-icon-search"></i>
          查询
        </el-button>
        <el-button type="primary" @click="addLink">
          <el-icon color="#fff">
            <plus />
          </el-icon>新增链接
        </el-button>
      </div>
      <div class="right-header">
        <el-select v-model="versionForm.sellerNick" class="nickInput">
          <el-option value="tb4808290101" label="tb4808290101"></el-option>
          <el-option value="tb979768_44" label="tb979768_44"></el-option>
        </el-select>
        <el-select v-model="versionForm.version" class="version-select">
          <el-option value="FREE" label="免费版"></el-option>
          <el-option value="STANDARD" label="标准版"></el-option>
          <el-option value="PLUS" label="增强版"></el-option>
        </el-select>
        <el-button type="primary" @click="changeVersion">
          <el-icon>
            <refresh-left />
          </el-icon>切换
        </el-button>
        <el-input v-model="versionForm.deadline" placeholder="请输入到期天数" class="deadline-input"></el-input>
        <el-button type="primary" @click="changeDeadLine">
          <el-icon>
            <refresh-left />
          </el-icon>修改
        </el-button>
      </div>
    </div>

    <el-table
      :data="tableData"
      row-key="id"
      border
      style="width: 100%; margin-top: 20px"
      :default-expand-all="false"
      v-loading="loading"
      class="table"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <el-table
            :data="scope.row.config"
            v-if="scope.row.config.length > 0"
            style="padding-left: 47px;"
            :border="false"
          >
            <el-table-column prop="showVersionType" label="展示在哪个版本"></el-table-column>
            <el-table-column prop="type" label="链接类型"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope2">
                <el-button type="danger" circle @click="delConfigFn(scope2.row.id)">
                  <el-icon>
                    <delete />
                  </el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="活动代码" prop="activityCode" min-width="150"></el-table-column>
      <el-table-column label="周期（月）" prop="cycle" min-width="150"></el-table-column>
      <el-table-column label="版本" prop="versionType" min-width="150"></el-table-column>
      <el-table-column label="实际价格（元）" prop="price" min-width="150">
        <template #default="scope">{{ formMoney(scope.row.price) }}</template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" min-width="150"></el-table-column>
      <el-table-column label="操作" min-width="200">
        <template #default="scope">
          <el-button type="primary" circle @click="addConfigFn(scope.row.id)">
            <el-icon>
              <plus />
            </el-icon>
          </el-button>
          <el-button type="primary" circle @click="editLink(scope.row)">
            <el-icon>
              <edit />
            </el-icon>
          </el-button>
          <el-button type="danger" circle @click="delLink(scope.row.id)">
            <el-icon>
              <delete />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :small="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[5, 10, 15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog
      title="新增链接"
      v-model="addInfoVisible"
      :append-to-body="true"
      width="30%"
      @close="addInfoVisible = false"
    >
      <el-form label-width="150px" :model="formData">
        <el-form-item label="链接：" prop="link">
          <el-input class="input" v-model="formData.link"></el-input>
        </el-form-item>
        <el-form-item label="活动代码：" prop="activityCode">
          <el-input class="input" v-model="formData.activityCode"></el-input>
        </el-form-item>
        <el-form-item label="商品代码：" prop="itemCode">
          <el-input class="input" v-model="formData.itemCode"></el-input>
        </el-form-item>
        <el-form-item label="版本类型：" prop="versionType">
          <el-input class="input" v-model="formData.versionType"></el-input>
        </el-form-item>
        <el-form-item label="周期（月）：" prop="cycle">
          <el-input class="input" v-model="formData.cycle"></el-input>
        </el-form-item>
        <el-form-item label="实际价格（元）：" prop="price">
          <el-input class="input" v-model="formData.price"></el-input>
        </el-form-item>
        <el-form-item label="原价（元）：" prop="originalPrice">
          <el-input class="input" v-model="formData.originalPrice"></el-input>
        </el-form-item>
        <el-form-item label="升级返还（元）：" prop="upgradeGift">
          <el-input class="input" v-model="formData.upgradeGift"></el-input>
        </el-form-item>
        <el-form-item label="续订返还（元）：" prop="renewGift">
          <el-input class="input" v-model="formData.renewGift"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input class="input" v-model="formData.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addInfoVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="删除链接"
      v-model="delInfoVisible"
      :append-to-body="true"
      width="30%"
    >
      <p>是否确定删除？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delInfoVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDel">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="新增配置"
      v-model="addConfigVisible"
      :append-to-body="true"
      width="30%"
    >
      <el-form label-width="150px" :model="configData">
        <el-form-item label="展示在哪个版本：" prop="showVersionType">
          <el-input class="input" v-model="configData.showVersionType"></el-input>
        </el-form-item>
        <el-form-item label="链接类型：" prop="type">
          <el-input class="input" v-model="configData.type"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addConfigVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddFn">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="删除配置"
      v-model="delConfigVisible"
      :append-to-body="true"
      width="30%"
    >
      <p>是否确定删除？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delConfigVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelFn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import axios from 'utils/axios'
import { Plus, RefreshLeft, Edit, Delete } from '@element-plus/icons-vue'




const searchValue = ref('')




const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const tableData = ref([])
const getList = () => {
  loading.value = true
  const data = {
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    search: searchValue.value,
  }
  axios
    .get('/ding/admin/softOrder/itemLink.get', { data })
    .then((res) => {
      console.log(res)
      loading.value = false
      tableData.value = res.data.data.list
      total.value = res.data.data.totalCount

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


let formData = ref({
  link: '',
  activityCode: '',
  itemCode: '',
  versionType: '',
  cycle: '',
  price: '',
  originalPrice: '',
  upgradeGift: '',
  renewGift: '',
  remark: ''
})
//新增链接
const addInfoVisible = ref(false)
const type = ref('add')
const addLink = () => {
  formData.value.link = ''
  formData.value.activityCode = ''
  formData.value.itemCode = ''
  formData.value.versionType = ''
  formData.value.cycle = ''
  formData.value.price = ''
  formData.value.price = ''
  formData.value.originalPrice = ''
  formData.value.upgradeGift = ''
  formData.value.renewGift = ''
  formData.value.remark = ''
  addInfoVisible.value = true
  type.value = 'add'
}
const confirm = () => {
  let data = { ...formData.value }
  data.cycle = +data.cycle
  data.price = data.price * 100 || 0
  data.originalPrice = data.originalPrice * 100 || 0
  data.upgradeGift = data.upgradeGift * 100 || 0
  data.renewGift = data.renewGift * 100 || 0
  if (type.value === 'add') {
    console.log('待提交数据：', data)
    axios
      .post('/ding/admin/softOrder/addItemLink.post', data)
      .then((res) => {
        if (res.data.success) {
          ElMessage.success('提交成功')
          getList()
          addInfoVisible.value = false
        } else {
          ElMessage.warning('提交失败')
        }
      })
  } else {
    data = oprateId
    axios
      .post('/ding/admin/softOrder/modifyItemLink.post', data)
      .then((res) => {
        if (res.data.success) {
          ElMessage.success('提交成功')
          getList()
          addInfoVisible.value = false
        } else {
          ElMessage.warning('提交失败')
        }
      })
  }
}

let oprateId = 0
//编辑
const editLink = (row) => {
  console.log(row)
  oprateId = row.id
  addInfoVisible.value = true
  formData.value.link = row.link
  formData.value.activityCode = row.activityCode
  formData.value.itemCode = row.itemCode
  formData.value.versionType = row.versionType
  formData.value.cycle = row.cycle
  formData.value.price = row.price / 100
  formData.value.originalPrice = row.originalPrice / 100
  formData.value.upgradeGift = row.upgradeGift / 100
  formData.value.renewGift = row.renewGift / 100
  formData.value.type = row.type
  formData.value.remark = row.remark
  // formData = row
  type.value = 'edit'
}

//删除链接
const delInfoVisible = ref(false)
const delLink = (id) => {
  console.log('点了', id)
  oprateId = id
  delInfoVisible.value = true
}
const confirmDel = () => {
  axios
    .post('/ding/admin/softOrder/removeItemLink.post', { id: oprateId })
    .then((res) => {
      if (res.data.success) {
        ElMessage.success('删除成功')
        getList()
        delInfoVisible.value = false
      }
    })
    .catch((err) => {
      ElMessage.warning('删除失败')
      delInfoVisible.value = false
      throw err
    })
}

//添加配置
const configData = ref({
  showVersionType: '',
  type: ''
})
const addConfigVisible = ref(false)
const addConfigFn = (id) => {
  console.log('当前操作的id:', id)
  oprateId = id
  addConfigVisible.value = true
}
const confirmAddFn = () => {
  const postData = { ...configData.value, id: oprateId }
  axios
    .post('/ding/admin/softOrder/addItemLinkConfig.post', postData)
    .then((res) => {
      if (res.data.success) {
        ElMessage.success('提交成功')
        getList()
        addConfigVisible.value = false
      } else {
        ElMessage.warning('提交失败')
      }
    })
}

let configId = 0
//删除配置
const delConfigVisible = ref(false)
const delConfigFn = (id) => {
  console.log('当前操作的id:', id)
  configId = id
  delConfigVisible.value = true
}
const confirmDelFn = () => {
  axios
    .post('/ding/admin/softOrder/removeItemLinkConfig.post', { id: configId })
    .then((res) => {
      if (res.data.success) {
        ElMessage.success('删除成功')
        getList()
        delConfigVisible.value = false
      } else {
        ElMessage.warning('删除失败')
      }
    })
}

const search = () => {
  pageSize.value = 10
  pageNo.value = 1
  searchValue.value = searchValue.value.trim()
  getList()
}

//切换版本
const versionForm = ref({
  sellerNick: 'tb4808290101',
  version: 'FREE',
  deadline: ''
})
const changeVersion = () => {
  const data = {
    sellerNick: versionForm.value.sellerNick,
    version: versionForm.value.version
  }
  axios
    .post('/ding/admin/softOrder/modifyVersion.post', data)
    .then((res) => {
      if (res.data.success) {
        ElMessage.success('切换成功')
      }
    })
}

const changeDeadLine = () => {
  const data = {
    deadline: +versionForm.value.deadline,
    customerNick: versionForm.value.sellerNick
  }
  if (!versionForm.value.deadline) {
    ElMessage.success('请输入到期天数')
  } else {
    axios
      .post('/ding/admin/modifyDeadline.post', data)
      .then((res) => {
        if (res.data) {
          ElMessage.success('修改成功')
        }
      })
  }
}

const formMoney = (val) => {
  let money = (val / 100).toFixed(2)
  return money === 'NaN' ? '0.00' : money
}

getList()
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>