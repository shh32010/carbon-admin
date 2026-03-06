<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型" prop="result">
        <el-input
          v-model="queryParams.type"
          placeholder="类型"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="lastEmission">
        <el-input
          v-model="queryParams.lastEmission"
          placeholder="状态"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择企业" clearable filterable >
          <el-option
            v-for="dict in emissionTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="企业id" prop="enterpriseId">-->
<!--        <el-select v-model="queryParams.enterpriseId" placeholder="请选择企业id" clearable filterable >-->
<!--          <el-option-->
<!--            v-for="dict in enterpriseIdOptions"-->
<!--            :key="dict.dictValue"-->
<!--            :label="dict.dictLabel"-->
<!--            :value="dict.dictValue"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
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
          v-hasPermi="['distribusion:cal:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain


          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['distribusion:cal:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain


          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['distribusion:cal:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain


          @click="handleExport"
          v-hasPermi="['distribusion:cal:export']"
        >导出</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="calList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center"/>
      <el-table-column label="id" align="center" prop="id"  width="200" />
      <el-table-column label="编号" align="center" prop="emissionNo"  width="200" />
      <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat"  width="200" />
      <el-table-column label="金额" align="center" prop="money"  width="200" />
      <el-table-column label="额度" align="center" prop="amount"   width="200" />
      <el-table-column label="企业" align="center" prop="enterpriseId" :formatter="enterpriseIdFormat"  width="200" />
      <el-table-column label="状态" align="center" prop="status" :formatter="orderFormat"  width="200" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template #default="scope">
          <el-button

           text

            @click="handleCheck(scope.row)"
            v-hasPermi="['distribusion:cal:edit']"
            v-if="scope.row.type == 2"
          >审核</el-button>
          <el-button

           text

            @click="handleUpdate(scope.row)"
            v-hasPermi="['distribusion:cal:edit']"
          >修改</el-button>
          <el-button

           text

            @click="handleDelete(scope.row)"
            v-hasPermi="['distribusion:cal:remove']"
          >删除</el-button>
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

    <!-- 添加或修改额度对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="计算结果" prop="result">
          <el-input v-model="form.result" placeholder="请输入计算结果" />
        </el-form-item>
        <el-form-item label="往年排放" prop="lastEmission">
          <el-input v-model="form.lastEmission" placeholder="请输入往年排放" />
        </el-form-item>
        <el-form-item label="变动方式" prop="type">
          <el-select v-model="form.type" placeholder="请选择变动方式" clearable filterable>
            <el-option
              v-for="dict in emissionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业id" prop="enterpriseId">
          <el-select v-model="form.enterpriseId" placeholder="请选择企业id" clearable filterable>
            <el-option
              v-for="dict in enterpriseIdOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
    <el-dialog :title="title" v-model="checkOpen" width="500px" append-to-body @close="checkCancel">
      <span>是否通过企业额度申请？</span>
      <div slot="footer">
        <el-button type="success" @click="pass">通过</el-button>
        <el-button type="error" @click="noPass">不通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listCal, getCal, delCal, addCal, updateCal, exportCal, checkPass, checkNoPass} from "@/api/distribusion/cal";
import {getType} from "@/api/system/dict/type";

export default {
  name: "Cal",
  components: {
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
      // 额度表格数据
      calList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 变动方式字典
      emissionTypeOptions: [],
      // 企业id字典
      enterpriseIdOptions: [],
      typeOptions: [],
      orderStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        result: null,
        lastEmission: null,
        type: null,
        enterpriseId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        result: [
          { required: true, message: "计算结果不能为空", trigger: "blur" }
        ],
        lastEmission: [
          { required: true, message: "往年排放不能为空", trigger: "blur" }
        ],
        enterpriseId: [
          { required: true, message: "企业id不能为空", trigger: "change" }
        ],
      },
      checkOpen: false,
      enterprise: null
    };
  },
  created() {
    this.getList();
    this.getDicts("emission_type").then(response => {
      this.emissionTypeOptions = response.data;
    });
    this.getQueryData("enterprises_info_list").then(res => {
      this.enterpriseIdOptions = res.data;
    });
    this.getDicts("order_type").then(res => {
      this.typeOptions = res.data
    })
    this.getDicts("order_status").then(res => {
      this.orderStatusOptions = res.data
    })
  },
  methods: {
    getType,
    /** 查询额度列表 */
    getList() {
      this.loading = true;
      listCal(this.queryParams).then(response => {
        this.calList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 变动方式字典翻译
    emissionTypeFormat(row, column) {
      return this.selectDictLabel(this.emissionTypeOptions, row.type);
    },
    // 企业id字典翻译
    enterpriseIdFormat(row, column) {
      return this.selectDictLabel(this.enterpriseIdOptions, row.enterpriseId);
    },
    typeFormat(row,column){
      return this.selectDictLabel(this.typeOptions,row.type)
    },
    orderFormat(row,column){
      return this.selectDictLabel(this.orderStatusOptions,row.status)
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        result: null,
        lastEmission: null,
        type: null,
        enterpriseId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加额度";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCal(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改额度";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCal(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCal(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除额度编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCal(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有额度数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCal(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    handleCheck(row){
      this.checkOpen = true
      this.title = "提示"
      this.enterprise = row
    },
    pass(){
      checkPass(this.enterprise.id).then(res=>{
        this.$message.success("审核通过！")
      })
    },
    noPass(){
      checkNoPass(this.enterprise.id).then(res=>{
        this.$message.error("审核未通过！")
      })
    },
    checkCancel(){
      this.checkOpen = false
      this.title = ""
      this.enterprise = null
    }
  }
};
</script>
