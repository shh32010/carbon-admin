<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="bidTitle">
        <el-input
          v-model="queryParams.bidTitle"
          placeholder="请输入招投标标题"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="bidPublishDatetime">
        <el-date-picker clearable
                        v-model="dateRange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"

        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发布者" prop="bidPublisher">
        <el-input
          v-model="queryParams.bidPublisher"
          placeholder="请输入发布者"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布分类" prop="category">
        <!--        <el-input-->
        <!--          v-model="queryParams.category"-->
        <!--          placeholder="请输入发布分类"-->
        <!--          clearable-->
        <!--          -->
        <!--         -->
        <!--        />-->

        <el-select v-model="queryParams.category" placeholder="请输入发布分类" @keyup.enter.native="handleQuery">
          <el-option
            v-for="dict in contentCategory"
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
          v-hasPermi="['bid:bidding:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain


          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bid:bidding:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain


          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bid:bidding:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain


          @click="handleExport"
          v-hasPermi="['bid:bidding:export']"
        >导出
        </el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="biddingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center" width="200" />
      <el-table-column label="No." type="index"  width="200" ></el-table-column>
      <el-table-column label="招投标标题" align="center" prop="bidTitle" width="200" />
      <el-table-column label="发布时间" align="center" prop="bidPublishDatetime"  width="200" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.bidPublishDatetime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布者" align="center" prop="bidPublisher" width="200" />
      <el-table-column label="发布分类" align="center" prop="category" width="200" >
        <template #default="scope">
          {{ getDictValue(scope.row.category) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template #default="scope">
          <el-button

           text

            @click="handleShowEnterpriseBiddings(scope.row)"
            v-hasPermi="['scm:bidding:edit']"
          >查看投标企业
          </el-button>

          <el-button

           text

            @click="handleUpdate(scope.row)"
            v-hasPermi="['bid:bidding:edit']"
          >修改
          </el-button>
          <el-button

           text

            @click="handleDelete(scope.row)"
            v-hasPermi="['bid:bidding:remove']"
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

    <!-- 添加或修改招投标对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="bidTitle">
          <el-input v-model="form.bidTitle" placeholder="请输入招投标标题"/>
        </el-form-item>
        <el-form-item label="发布者" prop="bidPublisher">
          <el-input v-model="form.bidPublisher" placeholder="请输入发布者"/>
        </el-form-item>
        <el-form-item label="发布分类" prop="category">
          <!--          1招标预告 2招标公告 3 中标公告 4企业采购-->
          <!--          <el-input v-model="form.category" placeholder="请输入发布分类"/>-->
          <el-select v-model="form.category" placeholder="请输入发布分类">
            <el-option
              v-for="dict in contentCategory"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招投标内容">
          <editor v-model="form.bidContent" :min-height="192" :height="400"/>
        </el-form-item>
        <el-form-item label="发布时间" prop="bidPublishDatetime">
          <el-date-picker clearable
                          v-model="form.bidPublishDatetime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择发布时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" v-if="form.category == 2" prop="beginDate">
              <el-date-picker clearable
                              v-model="form.beginDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" v-if="form.category == 2" prop="endDate" :span="6">
              <el-date-picker clearable
                              v-model="form.endDate"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" :span="6" v-if="form.category == 2">
          <!--          <el-radio-group v-model="form.status">-->
          <!--            <el-radio label="1">请选择字典生成</el-radio>-->
          <!--          </el-radio-group>-->

          <el-select v-model="form.status" placeholder="请输入类型">
            <el-option
              v-for="dict in bidStatus"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="上传文件">
          <file-upload :value="fileList" @input="(value) => {fileList = value}" :file-type="fileType" :fileSize="100" :limit="10"/>
        </el-form-item>

      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showEnterpriseBiddings" width="1000px">
      <el-table :data="enterpriseBiddings">
        <el-table-column label="No." type="index"  width="200" ></el-table-column>
        <el-table-column label="企业名称" align="center" prop="enterpriseName" width="200" />
        <el-table-column label="招标项目" align="center" prop="bidTitle" width="200" />
        <el-table-column label="状态" align="center" prop="status" width="200" >
          <template #default="{row}">
            {{  (row.status) ? formatBidStatus(row.status) : '' }}
          </template>
        </el-table-column>

        <el-table-column label="身份证签名" align="center" prop="idCard" width="200" >
          <template #default="{row}">
            <el-button @click="previewIdCard = true; previewIdCardUrl = row.idCard; ">预览</el-button>
          </template>
        </el-table-column>

        <el-table-column label="投标文件" align="center" prop="filesList" width="200" >
          <template #default="{row}">
            <ul>
              <li v-for="file in row.filesList">
                <a :href="file.filePath" target="_blank">{{ file.fileName }}</a>
              </li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog append-to-body v-model="previewIdCard">
      <el-image :src="previewIdCardUrl"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import { listBidding, getBidding, delBidding, addBidding, updateBidding, exportBidding } from '@/api/bid/bidding'
import Editor from '@/components/MyEditor'
import ImageUpload from '@/components/ImageUpload'
import FileUpload from '@/components/FileUpload'
import {listEnterpriseBidding} from "../../../api/bid/enterpriseBidding";
import {getBaseUrl} from "../../../utils/env";

export default {
  name: 'Bidding',
  components: {
    Editor,
    ImageUpload,
    FileUpload
  },
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 招投标表格数据
      biddingList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bidTitle: null,
        bidContent: null,
        bidPublishDatetime: null,
        bidPublisher: null,
        category: null,
        beginDate: null,
        endDate: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        bidTitle: [
          { required: true, message: '招投标标题不能为空', trigger: 'blur' }
        ],
        bidContent: [
          { required: true, message: '招投标内容不能为空', trigger: 'blur' }
        ]
      },
      //1招标预告 2招标公告 3 中标公告 4企业采购
      contentCategory: [],
      bidStatus: [],
      fileList: [],
      fileType: ['pdf', 'zip', 'rar', 'png', 'jpg', 'jpeg'],
      dateRange: [],


      showEnterpriseBiddings: false,
      enterpriseBiddings: [],
      previewIdCard: false,
      previewIdCardUrl: undefined
    }
  },
  created() {
    this.getList()
    this.getDicts('bid_category').then(response => {
      this.contentCategory = response.data
    })
    this.getDicts('bid_status').then(response => {
      this.bidStatus = response.data
    })

  },
  methods: {
    getBaseUrl,

    getDictValue(key) {
      if (!key) return

      const dict = this.contentCategory.filter(x => x.dictValue === key.toString())
      if (dict && dict.length > 0) {
        return dict[0].dictLabel
      }
      return ''
    },

    formatBidStatus(key) {
      if (!key) return

      const dict = this.bidStatus.filter(x => x.dictValue === key.toString())
      if (dict && dict.length > 0) {
        return dict[0].dictLabel
      }
      return ''
    },

    /** 查询招投标列表 */
    getList() {
      const that = this
      this.loading = true

      if (that.dateRange) {
        that.queryParams['fromDate'] = that.dateRange[0]
        that.queryParams['toDate'] = that.dateRange[1]
      }
      listBidding(this.queryParams).then(response => {
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
        bidTitle: null,
        bidContent: null,
        bidPublishDatetime: null,
        bidPublisher: null,
        category: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        beginDate: null,
        endDate: null,
        status: 0
      }
      this.resetForm('form')

      this.fileList = []

      this.dateRange = []
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
      this.title = '添加招投标'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBidding(id).then(response => {
        this.form = response.data

        if (response.data.filesList) {
          response.data.filesList.map(x => {
            this.fileList.push({
              fileName: x.fileName,
              originalFileName: x.fileName,
              url: x.filePath
            })
          })
        }
        this.open = true
        this.title = '修改招投标'
      })
    },
    /** 提交按钮 */
    submitForm() {
      if (this.fileList) {
        const file = []
        this.fileList.forEach(item => {
          file.push({
            fileName: item.originalFileName,
            filePath: item.url
          })
        })

        this.form['filesList'] = file
      }

      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBidding(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBidding(this.form).then(response => {
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
      this.$confirm('是否确认删除招投标编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delBidding(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有招投标数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportBidding(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    },

    async handleShowEnterpriseBiddings(row) {
      const tempEnterpriseBiddings = (await listEnterpriseBidding({bidId: row.id})).rows

      this.enterpriseBiddings = [...tempEnterpriseBiddings.filter(it => it.filesList.length > 0), ...tempEnterpriseBiddings.filter(it => it.filesList.length === 0)]
      this.showEnterpriseBiddings = true
    },
  }
}
</script>
