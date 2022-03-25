<template>
    <el-form
        ref="refForm"
        :rules="rules"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        width="80%"
    >
        <el-row>
            <el-col style="display: flex;">
                <el-form-item label="用户Nick:">
                    <el-input v-model="formInline.nick" placeholder="请输入用户nick"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="formInline.indexType" placeholder="请选择">
                        <el-option
                            v-for="item in optionsSort"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="剩余时长:">
                    <el-row>
                        <el-col :span="9">
                            <el-input v-model="formInline.deadLineMin" placeholder="请输入开始天数"></el-input>
                        </el-col>
                        <el-col :span="6" style="text-align: center;">---</el-col>
                        <el-col :span="9">
                            <el-input v-model="formInline.deadLineMax" placeholder="请输入结束天数"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-col>
            <el-col style="display: flex;">
                <el-form-item label="订购时间:">
                    <el-date-picker
                        v-model="formInline.orderTime"
                        type="datetimerange"
                        :shortcuts="shortcuts"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="商家等级:">
                    <el-row>
                        <el-col :span="10">
                            <el-input v-model="formInline.sellerCreditMin" placeholder="起"></el-input>
                        </el-col>
                        <el-col :span="4">---</el-col>
                        <el-col :span="10">
                            <el-input v-model="formInline.sellerCreditMax" placeholder="终"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch('formInline')">查询</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <div style="width:100%;over-flow:auto;">
        <el-table
            :data="state.list"
            border
            style="margin-top: 20px;width: 100%"
            max-height="500"
            v-loading="loading"
        >
            <el-table-column label="用户Nick" prop="nick" min-width="150"></el-table-column>
            <el-table-column label="是否钻展用户" min-width="110">
                <template v-slot="scope">{{ scope.row.indexType === 3 ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column label="手机号码" prop="mobile" min-width="150"></el-table-column>
            <el-table-column label="订购时间" prop="createTime" min-width="150"></el-table-column>
            <el-table-column label="剩余时长（天）" prop="remainingTime" min-width="120"></el-table-column>
            <el-table-column label="商家等级" prop="sellerCredit" min-width="100"></el-table-column>
            <el-table-column label="累计充值金额（元）" min-width="150">
                <template v-slot="scope">{{ formMoney(scope.row.chargeSum) }}</template>
            </el-table-column>
            <el-table-column label="账户余额（元）" min-width="120">
                <template v-slot="scope">{{ formMoney(scope.row.balance) }}</template>
            </el-table-column>
            <el-table-column label="代金券余额（元）" min-width="140">
                <template v-slot="scope">{{ formMoney(scope.row.limitSum) }}</template>
            </el-table-column>
            <el-table-column label="操作" min-width="300">
                <template v-slot="scope">
                    <el-button type="text" @click="onGive(scope.row.customerId)">赠送</el-button>
                    <el-button type="text" @click="onDeduct(scope.row.customerId)">扣除</el-button>
                    <el-button type="text" @click="showGiveScore(scope.row.customerId)">赠送积分</el-button>
                    <el-button type="text" @click="showRefundButton(scope.row.customerId)">显示退款按钮</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
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

    <el-dialog title="赠送推广包" v-model="giveFlowVisible" :append-to-body="true" width="30%">
        <el-input v-model="pushNum" placeholder="请输入推广数量" style="width: 150px;"></el-input>
        <span>元</span>
        <div slot="footer" class="dialog-footer">
            <el-button @click="giveFlowVisible = false">取消</el-button>
            <el-button type="primary" @click="onGiveFlow">确定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="扣除推广包" v-model="deductFlowVisible" :append-to-body="true" width="30%">
        <el-input v-model="pushNum" placeholder="请输入推广数量" style="width: 150px;"></el-input>
        <span>元</span>
        <div slot="footer" class="dialog-footer">
            <el-button @close="deductFlowVisible = false">取消</el-button>
            <el-button type="primary" @click="onDeductFlow">确定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="赠送积分" v-model="giveScoreVisible" :append-to-body="true" width="30%">
        <el-select v-model="scoreType">
            <el-option label="给软件好评" :value="13"></el-option>
            <el-option label="问卷调查（开发中）" :value="14" disabled></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
            <el-button @click="giveScoreVisible = false">取消</el-button>
            <el-button type="primary" @click="onGiveScore">确定</el-button>
        </div>
    </el-dialog>
</template>
<script setup>
import moment  from 'moment'
import { ElMessage } from 'element-plus'
import { ref, reactive, toRefs } from 'vue'
import axios from 'utils/axios'


const validateNickName = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('用户nick不能为空'))
    } else {
        callback()
    }
}

const state = reactive(
    {
        pushNum: 0,
        customerId: 0,
        formInline: {
            nick: '',
            indexType: 0,
            deadLineMin: '',
            deadLineMax: '',
            orderTime: '',
            purchaseTimeMin: '',
            purchaseTimeMax: '',
            sellerCreditMin: '',
            sellerCreditMax: ''
        },
        list: [],
        pageNo: 1,
        pageSize: 5,
        total: 0,
        loading: false,
        optionsSort: [
            {
                value: 0,
                label: '全部'
            },
            {
                value: 3,
                label: '钻展用户'
            },
            {
                value: 1,
                label: '非钻展用户'
            }
        ],
        shortcuts: [
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
        ],
        dialogVisible: false,
        scoreType: 13,
        rules: {
            nickName: [{ validator: validateNickName, trigger: 'blur' }]
        },
    }
)

const {
    formInline,
    loading,
    pageNo,
    pageSize,
    total,
    rules,
    optionsSort,
    shortcuts,
    customerId,
    pushNum,
    scoreType
} = toRefs(state)

const getCustomerList = () => {
    loading.value = true
    const data = {
        ...formInline.value,
        pageNo: pageNo.value,
        pageSize: pageSize.value
    }
    console.log('data:', data)
    axios
        .get('/ding/admin/customerList.get', { data })
        .then(res => {
            loading.value = false
            if (res.data) {
                const { list, totalCount } = res.data.data
                console.log('list:', list)
                state.list = list || []
                total.value = totalCount
            }
        })
        .catch((err) => {
            loading.value = false
            throw err
        })
}
const handleSizeChange = (e) => {
    pageSize.value = e
    getCustomerList()
}
const handleCurrentChange = (e) => {
    pageNo.value = e
    getCustomerList()
}

const giveFlowVisible = ref(false)
const onGive = (id) => {
    customerId.value = id
    giveFlowVisible.value = true
}
const onGiveFlow = () => {
    const data = { amount: pushNum.value * 100, customerId: customerId.value }
    axios
        .post('/ding/admin/giftCoupon.post', data)
        .then((res) => {
            if (res.data.success) {
                giveFlowVisible.value = false
                ElMessage.success('赠送操作成功')
                getCustomerList()
            }
        })
}

const deductFlowVisible = ref(false)
const onDeduct = (id) => {
    customerId.value = id
    deductFlowVisible.value = true
}
const onDeductFlow = () => {
    const data = { amount: pushNum.value * 100, customerId: customerId.value }
    axios
        .post('/ding/admin/deductCoupon.post', data)
        .then((res) => {
            if (res.data.success) {
                deductFlowVisible.value = false
                ElMessage.success('扣除操作成功')
                getCustomerList()
            }
        })
        .catch((err) => {
            throw err
        })

}

const giveScoreVisible = ref(false)
const showGiveScore = (id) => {
    customerId.value = id
    giveScoreVisible.value = true
}
const onGiveScore = () => {
    const data = { customerId: customerId.value, scoreType: scoreType.value }
    axios
        .post('/ding/admin/resendMemberScore.post', data)
        .then((res) => {
            if (res.data.success) {
                giveScoreVisible.value = false
                ElMessage.success('赠送积分成功')
                getCustomerList()
            }
        })
}

const showRefundButton = (customerId) => {
    axios
        .post(`/ding/admin/showRefundButton.post?customerId=${customerId}`)
        .then((res) => {
            if (res.data.success) {
                ElMessage.success('操作成功')
            }
        })
        .catch((err) => {
            throw err
        })
}




const refForm = ref(null)
const onSearch = () => {
    if (formInline.value.orderTime) {
        const startTime = formInline.value.orderTime[0]
        const endTime = formInline.value.orderTime[1]
        formInline.value.purchaseTimeMin = moment(startTime).format(
            'YYYY-MM-DD HH:mm:ss'
        )
        formInline.value.purchaseTimeMax = moment(endTime).format(
            'YYYY-MM-DD HH:mm:ss'
        )
    } else {
        formInline.value.purchaseTimeMax = ''
        formInline.value.purchaseTimeMin = ''
    }
    refForm.value.validate((valid) => {
        if (valid) {
            getCustomerList()
        } else {
            return false
        }
    })

}

const formMoney = (val) => {
    let money = (val / 100).toFixed(2)
    return money === 'NaN' ? '0.00' : money
}





getCustomerList()
</script>

<style lang="scss" scoped>
</style>
