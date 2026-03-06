<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="行业" prop="industry">
        <el-select v-model="queryParams.industry" placeholder="请选择行业" clearable filterable >
          <el-option
            v-for="dict in industryOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
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
      <el-form-item label="产品种类" prop="productCategory">
        <el-input
          v-model="queryParams.productCategory"
          placeholder="请输入产品种类"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产量" prop="production">
        <el-input
          v-model="queryParams.production"
          placeholder="请输入产量"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司规模" prop="enterpriseScale">
        <el-input
          v-model="queryParams.enterpriseScale"
          placeholder="请输入公司规模"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司性质" prop="enterpriseNature">
        <el-input
          v-model="queryParams.enterpriseNature"
          placeholder="请输入公司性质"
          clearable

          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['distribusion:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain


          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['distribusion:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain


          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['distribusion:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain


          @click="handleExport"
          v-hasPermi="['distribusion:info:export']"
        >导出</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center"/>
      <el-table-column label="id" align="center" prop="id"  width="200" />
      <el-table-column label="行业" align="center" prop="industry" :formatter="industryFormat"  width="200" />
      <el-table-column label="企业" align="center" prop="enterpriseId" :formatter="enterpriseIdFormat"  width="200" />
      <el-table-column label="产品种类" align="center" prop="productCategory"  width="200" />
      <el-table-column label="产量" align="center" prop="production"  width="200" />
      <el-table-column label="公司规模" align="center" prop="enterpriseScale"  width="200" />
      <el-table-column label="公司性质" align="center" prop="enterpriseNature"  width="200" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template #default="scope">
          <el-button

           text

            @click="handleUpdate(scope.row)"
            v-hasPermi="['distribusion:info:edit']"
          >修改</el-button>
          <el-button

           text

            @click="handleDelete(scope.row)"
            v-hasPermi="['distribusion:info:remove']"
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

    <!-- 添加或修改企业信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="行业" prop="industry">
          <el-select v-model="form.industry" placeholder="请选择行业" clearable filterable>
            <el-option
              v-for="dict in industryOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterpriseId">
          <el-select v-model="form.enterpriseId" placeholder="请选择企业" clearable filterable>
            <el-option
              v-for="dict in enterpriseIdOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品种类" prop="productCategory">
          <el-input v-model="form.productCategory" placeholder="请输入产品种类" />
        </el-form-item>
        <el-form-item label="产量" prop="production">
          <el-input v-model="form.production" placeholder="请输入产量" />
        </el-form-item>
        <el-form-item label="公司规模" prop="enterpriseScale">
          <el-input v-model="form.enterpriseScale" placeholder="请输入公司规模" />
        </el-form-item>
        <el-form-item label="公司性质" prop="enterpriseNature">
          <el-input v-model="form.enterpriseNature" placeholder="请输入公司性质" />
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo, exportInfo } from "@/api/distribusion/info";

export default {
  name: "Info",
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
      // 企业信息表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 行业字典
      industryOptions: [],
      // 企业字典
      enterpriseIdOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        industry: null,
        enterpriseId: null,
        productCategory: null,
        production: null,
        enterpriseScale: null,
        enterpriseNature: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        industry: [
          { required: true, message: "行业不能为空", trigger: "change" }
        ],
        enterpriseId: [
          { required: true, message: "企业不能为空", trigger: "change" }
        ],
        productCategory: [
          { required: true, message: "产品种类不能为空", trigger: "blur" }
        ],
        production: [
          { required: true, message: "产量不能为空", trigger: "blur" }
        ],
        enterpriseScale: [
          { required: true, message: "公司规模不能为空", trigger: "blur" }
        ],
        enterpriseNature: [
          { required: true, message: "公司性质不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("industry_list").then(response => {
      this.industryOptions = response.data;
    });
    this.getQueryData("enterprises_info_list").then(res => {
      this.enterpriseIdOptions = res.data;
    });
  },
  methods: {
    /** 查询企业信息列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 行业字典翻译
    industryFormat(row, column) {
      return this.selectDictLabel(this.industryOptions, row.industry);
    },
    // 企业字典翻译
    enterpriseIdFormat(row, column) {
      return this.selectDictLabel(this.enterpriseIdOptions, row.enterpriseId);
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
        industry: null,
        enterpriseId: null,
        productCategory: null,
        production: null,
        enterpriseScale: null,
        enterpriseNature: null,
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
      this.title = "添加企业信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改企业信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除企业信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有企业信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
