<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同编号" prop="contractNo">
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入合同编号"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supplierId">
        <el-select v-model="queryParams.supplierId" placeholder="请选择供应商" clearable filterable >
          <el-option
            v-for="dict in supplierIdOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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

    <el-table v-loading="loading" :data="purchaseArriveDetailReportList">
      <el-table-column label="合同编号" align="center" prop="contractNo"  width="200" />
      <el-table-column label="供应商名称" align="center" prop="supplierName"  width="200" />
      <el-table-column label="物料名称" align="center" prop="materialName"  width="200" />
      <el-table-column label="型号" align="center" prop="materialModel"  width="200" />
      <el-table-column label="规格" align="center" prop="materialSpecification"  width="200" />
      <el-table-column label="单位" align="center" prop="materialUnit"  width="200" />
      <el-table-column label="生产批号" align="center" prop="batchNo"  width="200" />
      <el-table-column label="单价" align="center" prop="price"  width="200" />
      <el-table-column label="到货数量" align="center" prop="arriveQuantity"  width="200" />
      <el-table-column label="退货数量" align="center" prop="returnQuantity"  width="200" />
      <el-table-column label="入库数量" align="center" prop="inWarehouseQuantity"  width="200" />
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
import { listPurchaseArriveDetailReport, exportPurchaseArriveDetailReport } from "@/api/purchaseReport/purchaseArriveDetailReport";

export default {
  name: "PurchaseArriveDetailReport",
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
      // 采购到货详细报表表格数据
      purchaseArriveDetailReportList: [],
      // 供应商id字典
      supplierIdOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractNo: null,
        supplierId: null,
        supplierName: null,
        materialId: null,
        materialName: null,
        materialCode: null,
        materialModel: null,
        materialSpecification: null,
        materialUnit: null,
        batchNo: null,
        price: null,
        arriveQuantity: null,
        returnQuantity: null,
        inWarehouseQuantity: null
      },
    };
  },
  created() {
    this.getList();
    this.getQueryData("query_supplier").then(res => {
      this.supplierIdOptions = res.data;
    });
  },
  methods: {
    /** 查询采购到货详细报表列表 */
    getList() {
      this.loading = true;
      listPurchaseArriveDetailReport(this.queryParams).then(response => {
        this.purchaseArriveDetailReportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 供应商id字典翻译
    supplierIdFormat(row, column) {
      return this.selectDictLabel(this.supplierIdOptions, row.supplierId);
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
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购到货详细报表数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPurchaseArriveDetailReport(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
