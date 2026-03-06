<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业名称" prop="enterpriseId">
        <el-input
          v-model="queryParams.enterpriseName"
          placeholder="请输入企业主键"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="招标标题" prop="bidId">
        <el-input
          v-model="queryParams.bidTitle"
          placeholder="请输入招标主键"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable filterable >
          <el-option
            v-for="dict in bidStatus"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"   @click="handleQuery">搜索</el-button>
        <el-button   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain


          @click="handleAdd"
          v-hasPermi="['scm:bidding:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain


          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['scm:bidding:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain


          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['scm:bidding:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain


          @click="handleExport"
          v-hasPermi="['scm:bidding:export']"
        >导出
        </el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="biddingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center"  />
<!--      <el-table-column label="主键" align="center" prop="id" width="200" />-->
      <el-table-column label="No." type="index"  width="200" ></el-table-column>
      <el-table-column label="企业名称" align="center" prop="enterpriseName" width="200" />
      <el-table-column label="招标项目" align="center" prop="bidTitle" width="200" />
      <el-table-column label="状态" align="center" prop="status" width="200" >
        <template #default="{row}">
          {{  (row.status) ? formatBidStatus(row.status) : '' }}
        </template>
      </el-table-column>
      <el-table-column label="身份证签名" align="center" prop="idCard" width="200" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template #default="scope">
          <el-button

           text

            @click="handleUpdate(scope.row)"
            v-hasPermi="['scm:bidding:edit']"
          >修改
          </el-button>
          <el-button

           text

            @click="handleDelete(scope.row)"
            v-hasPermi="['scm:bidding:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改企业投标对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form"  label-width="80px">
        <el-form-item label="企业名称" prop="enterpriseId">
          <el-select v-model="form.enterpriseId" placeholder="请选择企业">
            <el-option v-for="item in listenterprise" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招标标题" prop="bidId">
          <el-select v-model="form.bidId" placeholder="招标标题">
            <el-option v-for="item in biddingListnew" :key="item.id" :label="item.bidTitle" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="状态">
<!--          <el-radio-group v-model="form.status">-->
<!--            <el-radio label="1">请选择字典生成</el-radio>-->
<!--          </el-radio-group>-->
          <el-select v-model="form.status" placeholder="请选择状态" clearable filterable >
            <el-option
              v-for="dict in bidStatus"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  listEnterpriseBidding,
  getEnterpriseBidding,
  delEnterpriseBidding,
  addEnterpriseBidding,
  updateEnterpriseBidding,
  exportEnterpriseBidding
} from '@/api/bid/enterpriseBidding'
import {
  listEnterprise
} from '@/api/bid/enterprise'
import {listBidding} from '@/api/bid/bidding'

export default {
  name: 'EnterpriseBidding',
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      biddingListnew: [],
      listenterprise:[],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 企业投标表格数据
      biddingList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enterpriseName: null,
        bidTitle: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      // rules: {
      //   enterpriseId: [
      //     { required: true, message: "企业主键不能为空", trigger: "blur" }
      //   ],
      //   bidId: [
      //     { required: true, message: "招标主键不能为空", trigger: "blur" }
      //   ],
      // }
      bidStatus: [],
    }
  },
  created() {
    this.getList()
    this.getBidingList()
    this.getEnterpriseList()
    const that = this
    this.getDicts('bid_status').then(response => {
      that.bidStatus = response.data
    })
  },
  methods: {
    getBidingList() {
      listBidding(this.queryParams).then(response => {
        this.biddingListnew = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    getEnterpriseList() {
      this.loading = true
      listEnterprise(this.queryParams).then(response => {
        this.listenterprise = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    formatBidStatus(key) {
      const dict = this.bidStatus.filter(x => x.dictValue === key.toString())
      if (dict && dict.length > 0) {
        return dict[0].dictLabel
      }
      return ''
    },
    /** 查询企业投标列表 */
    getList() {
      this.loading = true
      listEnterpriseBidding(this.queryParams).then(response => {
        this.biddingList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        enterpriseId: null,
        bidId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        status: 0
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加企业投标'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getEnterpriseBidding(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改企业投标'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEnterpriseBidding(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addEnterpriseBidding(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除企业投标编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delEnterpriseBidding(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有企业投标数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportEnterpriseBidding(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    }
  },
}
</script>
