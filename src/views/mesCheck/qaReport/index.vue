<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="完工单号" prop="productFinishNo">
        <el-input v-model="queryParams.productFinishNo" placeholder="请输入完工单号" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="计划编号" prop="productPlanNo">
        <el-input v-model="queryParams.productPlanNo" placeholder="请输入生产计划编号" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="作业名称" prop="productJobName">
        <el-input v-model="queryParams.productJobName" placeholder="请输入生产作业名称" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品名称" prop="materialName">
        <el-input v-model="queryParams.materialName" placeholder="请输入物料产品名称" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="检验批次" prop="materialBatchNo">
        <el-input v-model="queryParams.materialBatchNo" placeholder="请输入检验批次" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="生产日期">
        <el-date-picker v-model="daterangeProductDate"  style="width: 240px" value-format="yyyy-MM-dd"
          type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="检验项" prop="checkItemName">
        <el-input v-model="queryParams.checkItemName" placeholder="请输入检验项" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button  type="primary"   @click="handleQuery">搜索</el-button>
        <el-button    @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">

    </el-row>

    <el-table v-loading="loading" :data="productCheckList">
      <el-table-column label="编号" align="center" prop="id"  />
      <el-table-column label="检验编号" align="center" prop="serialNo"  width="200" />
      <el-table-column label="计划编号" align="center" prop="productPlanNo"  width="200" />
      <el-table-column label="完工单号" align="center" prop="productFinishNo"  width="200" />
      <el-table-column label="作业名称" align="center" prop="productJobName"  width="200" />
      <!-- <el-table-column label="计划排产编号" align="center" prop="productScheduleId"  width="200" /> -->
      <el-table-column label="产线名称" align="center" prop="productLineName"  width="200" />
      <el-table-column label="检验批次" align="center" prop="materialBatchNo"  width="200" />
      <el-table-column label="产品名称" align="center" prop="materialName"  width="200" />
      <el-table-column label="生产日期" align="center" prop="productDate"  width="200" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.productDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检验项" align="center" prop="checkItemName"  width="200" />
      <el-table-column label="生产数量" align="center" prop="productQuantity"  width="200" />
      <el-table-column label="抽检数量" align="center" prop="checkQuantity"  width="200" />
      <el-table-column label="检验人" align="center" prop="checkUser" :formatter="checkUserFormat"  width="200" />
      <el-table-column label="合格数量" align="center" prop="qualifiedRate"  width="200" />
      <el-table-column label="检验时间" align="center" prop="checkDate"  width="200" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.checkDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

  </div>
</template>

<script>
  import {
    listProductCheck,
    exportProductCheck
  } from "@/api/mesCheck/qaReport";

  export default {
    name: "QaReport",
    components: {
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 生产检验单表格数据
        productCheckList: [],
        // 生产日期时间范围
        daterangeProductDate: [],
        // 检验结果：0不合格1合格字典
        checkResultOptions: [],
        // 检验人字典
        checkUserOptions: [],
        // 检验时间时间范围
        daterangeCheckDate: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          serialNo: null,
          productFinishNo: null,
          productPlanId: null,
          productScheduleId: null,
          productLineId: null,
          productJobId: null,
          materialId: null,
          materialBatchNo: null,
          productDate: null,
          productQuantity: null,
          checkStandardId: null,
          checkQuantity: null,
          checkValue: null,
          maxValue: null,
          minValue: null,
          checkResult: null,
          checkUser: null,
          checkDate: null,
          materialName: null,
          checkItemName: null,
          productPlanNo: null,
          materialName: null
        },
      };
    },
    created() {
      this.getList();
      this.getDicts("mes_check_result").then(response => {
        this.checkResultOptions = response.data;
      });
      this.getQueryData("query_user").then(res => {
        this.checkUserOptions = res.data;
      });
    },
    methods: {
      /** 查询生产检验单列表 */
      getList() {
        this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeProductDate && '' != this.daterangeProductDate) {
          this.queryParams.params["beginProductDate"] = this.daterangeProductDate[0];
          this.queryParams.params["endProductDate"] = this.daterangeProductDate[1];
        }
        if (null != this.daterangeCheckDate && '' != this.daterangeCheckDate) {
          this.queryParams.params["beginCheckDate"] = this.daterangeCheckDate[0];
          this.queryParams.params["endCheckDate"] = this.daterangeCheckDate[1];
        }
        listProductCheck(this.queryParams).then(response => {
          this.productCheckList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 检验结果：0不合格1合格字典翻译
      checkResultFormat(row, column) {
        return this.selectDictLabel(this.checkResultOptions, row.checkResult);
      },
      // 检验人字典翻译
      checkUserFormat(row, column) {
        return this.selectDictLabel(this.checkUserOptions, row.checkUser);
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.daterangeProductDate = [];
        this.daterangeCheckDate = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有生产检验单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportProductCheck(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };

</script>
