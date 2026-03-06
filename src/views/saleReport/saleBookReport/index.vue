<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="customerId">
        <el-select v-model="queryParams.customerId" placeholder="请选择客户" clearable filterable >
          <el-option
            v-for="dict in customerIdOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="合同日期">
        <el-date-picker
          v-model="daterangeSignDate"

          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料名称"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button  type="primary"   @click="handleQuery">搜索</el-button>
        <el-button    @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain


          @click="handleExport"
        >导出</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="contractDetailList">
      <el-table-column label="合同id" align="center" prop="contractId"  width="200" />
      <el-table-column label="合同编号" align="center" prop="contractNo"  width="200" />
      <!-- <el-table-column label="订单编号" align="center" prop="orderNo"  width="200" /> -->
      <el-table-column label="客户名称" align="center" prop="customerName"  width="200" />
      <el-table-column label="合同金额" align="center" prop="contractAmount"  width="200" />
      <el-table-column label="签订日期" align="center" prop="signDate"  width="200" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.signDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料名称" align="center" prop="materialName"  width="200" />
       <el-table-column label="型号" align="center" prop="materialModel"  width="200" />
      <el-table-column label="规格" align="center" prop="materialSpecification"  width="200" />
      <!-- <el-table-column label="单位" align="center" prop="materialUnit"  width="200" /> -->
      <el-table-column label="单价" align="center" prop="price"  width="200" />
      <el-table-column label="订货数量" align="center" prop="quantity"  width="200" />
      <el-table-column label="应收金额" align="center" prop="amount"  width="200" />
      <el-table-column label="退款金额" align="center" prop="returnTotal"  width="200" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listSaleBook, exportSaleBook} from "@/api/saleReport/saleBook";

export default {
  name: "SaleBookReport",
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
      // 销售合同明细表格数据
      contractDetailList: [],
      // 客户id字典
      customerIdOptions: [],
      // 签订日期时间范围
      daterangeSignDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractId: null,
        contractNo: null,
        orderId: null,
        orderNo: null,
        customerId: null,
        signDate: null,
        customerName: null,
        materialId: null,
        materialName: null,
      },
    };
  },
  created() {
    this.getList();
    this.getQueryData("query_customer").then(res => {
      this.customerIdOptions = res.data;
    });
  },
  methods: {
    /** 查询销售合同明细列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeSignDate && '' != this.daterangeSignDate) {
        this.queryParams.params["beginSignDate"] = this.daterangeSignDate[0];
        this.queryParams.params["endSignDate"] = this.daterangeSignDate[1];
      }
      listSaleBook(this.queryParams).then(response => {
        this.contractDetailList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 客户id字典翻译
    customerIdFormat(row, column) {
      return this.selectDictLabel(this.customerIdOptions, row.customerId);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeSignDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有销售台账数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSaleBook(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
