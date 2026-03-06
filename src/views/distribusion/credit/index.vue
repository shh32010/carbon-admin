<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业" prop="enterpriseId">
        <el-select v-model="queryParams.enterpriseId" placeholder="请选择企业" clearable filterable >
          <el-option
            v-for="dict in enterpriseIdOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="使用方法" prop="method">-->
<!--        <el-select v-model="queryParams.method" placeholder="请选择方法" clearable filterable>-->
<!--          <el-option-->
<!--            v-for="dict in methodOptions"-->
<!--            :key="dict.dictValue"-->
<!--            :label="dict.dictLabel"-->
<!--            :value="parseInt(dict.dictValue)"-->
<!--          ></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary"   @click="handleQuery">搜索</el-button>
        <el-button   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          -->
<!--          -->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['distribusion:credit:add']"-->
<!--        >新增</el-button>-->
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain


          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['distribusion:credit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          -->
<!--          -->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['distribusion:credit:remove']"-->
<!--        >删除</el-button>-->
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain


          @click="handleExport"
          v-hasPermi="['distribusion:credit:export']"
        >导出</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="creditList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center"/>
      <el-table-column label="id" align="center" prop="id"  width="200" />
      <el-table-column label="企业" align="center" prop="enterpriseId" :formatter="enterpriseIdFormat"  width="200" />
      <el-table-column label="总额度" align="center" prop="credit"  width="200" />
      <el-table-column label="剩余额度" align="center" prop="remainingCredit"  width="200" />
<!--      <el-table-column label="使用的方法" align="center" prop="method" :formatter="methodFormat"  width="200" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template #default="scope">
          <el-button

           text

            @click="handleUpdate(scope.row)"
            v-hasPermi="['distribusion:credit:edit']"
          >修改</el-button>
<!--          <el-button-->
<!--            -->
<!--            type="text"-->
<!--            -->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['distribusion:credit:remove']"-->
<!--          >删除</el-button>-->
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
        <el-form-item label="企业">
<!--          <el-select v-model="form.enterpriseId" placeholder="请选择企业" clearable filterable>-->
<!--            <el-option-->
<!--              v-for="dict in enterpriseIdOptions"-->
<!--              :key="dict.dictValue"-->
<!--              :label="dict.dictLabel"-->
<!--              :value="parseInt(dict.dictValue)"-->
<!--            ></el-option>-->
<!--          </el-select>-->
          <el-input disabled v-model="enterpriseName" />
        </el-form-item>
        <el-form-item label="获得额度" prop="credit">
          <el-input v-model="form.credit" placeholder="请输入获得额度" />
        </el-form-item>
        <el-form-item label="剩余额度">
          <el-input v-model="form.remainingCredit" placeholder="请输入获得额度" />
        </el-form-item>
<!--        <el-form-item label="使用的方法" prop="method">-->
<!--          <el-select v-model="form.method" placeholder="请选择方法" clearable filterable>-->
<!--            <el-option-->
<!--              v-for="dict in methodOptions"-->
<!--              :key="dict.dictValue"-->
<!--              :label="dict.dictLabel"-->
<!--              :value="parseInt(dict.dictValue)"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
      </el-form>
      <template #footer class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { listCredit, getCredit, delCredit, addCredit, updateCredit, exportCredit } from "@/api/distribusion/credit";

export default {
  name: "Credit",
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
      creditList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 企业字典
      enterpriseIdOptions: [],
      methodOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        enterpriseId: null,
        credit: null,
        method: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        enterpriseId: [
          { required: true, message: "企业不能为空", trigger: "change" }
        ],
        credit: [
          { required: true, message: "获得额度不能为空", trigger: "blur" }
        ],
        method: [
          { required: true, message: "使用的方法不能为空", trigger: "blur" }
        ]
      },
      enterpriseName: null
    };
  },
  created() {
    this.getList();
    this.getQueryData("enterprises_info_list").then(res => {
      this.enterpriseIdOptions = res.data;
    });
    this.getQueryData("distribusion_method_query").then(res => {
      this.methodOptions = res.data;
    });
  },
  methods: {
    /** 查询额度列表 */
    getList() {
      this.loading = true;
      listCredit(this.queryParams).then(response => {
        this.creditList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 企业字典翻译
    enterpriseIdFormat(row, column) {
      return this.selectDictLabel(this.enterpriseIdOptions, row.enterpriseId);
    },
    // 企业字典翻译
    methodFormat(row, column) {
      return this.selectDictLabel(this.methodOptions, row.method);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.enterpriseName = null
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        enterpriseId: null,
        credit: null,
        method: null,
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
      getCredit(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改额度";
        this.enterpriseIdOptions.forEach(item=>{
          if(item.dictValue == this.form.enterpriseId){
            this.enterpriseName = item.dictLabel
          }
        })
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCredit(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCredit(this.form).then(response => {
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
          return delCredit(ids);
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
          return exportCredit(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
