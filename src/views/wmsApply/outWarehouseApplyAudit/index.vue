<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="90px">
      <el-form-item label="单据号" prop="serialNo">
        <el-input v-model="queryParams.serialNo" clearable placeholder="请输入单据号"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="业务类型" prop="bizType">
        <el-select v-model="queryParams.bizType" clearable filterable placeholder="请选择业务类型">
          <el-option v-for="dict in bizTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="客户" prop="customerId">
        <el-select v-model="queryParams.customerId" clearable filterable placeholder="请选择客户">
          <el-option v-for="dict in customerIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="合同类型" prop="contractType">
        <el-select v-model="queryParams.contractType" clearable filterable placeholder="请选择合同类型">
          <el-option v-for="dict in contractTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applyUser">
        <el-select v-model="queryParams.applyUser" clearable filterable placeholder="请选择申请人">
          <el-option v-for="dict in applyUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期">
        <el-date-picker v-model="daterangeApplyTime" end-placeholder="结束日期" range-separator="-"
                        start-placeholder="开始日期"
                        style="width: 240px" type="daterange" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="申请状态" prop="applyStatus">
        <el-select v-model="queryParams.applyStatus" clearable filterable placeholder="请选择申请状态">
          <el-option v-for="dict in applyStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="auditUser">
        <el-select v-model="queryParams.auditUser" clearable filterable placeholder="请选择审核人">
          <el-option v-for="dict in auditUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="审核日期">
        <el-date-picker v-model="daterangeAuditTime" end-placeholder="结束日期" range-separator="-"
                        start-placeholder="开始日期"
                        style="width: 240px" type="daterange" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" clearable filterable placeholder="请选择审核状态">
          <el-option v-for="dict in auditStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="单据状态" prop="billStatus">
        <el-select v-model="queryParams.billStatus" clearable filterable placeholder="请选择单据状态">
          <el-option v-for="dict in billStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                     :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="outWarehouseApplyList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection"/>
      <el-table-column align="center" label="编号" prop="id"/>
      <el-table-column align="center" label="单据号" prop="serialNo" width="200"/>
      <el-table-column align="center" label="关联单据号" prop="bizBillNo" width="200"/>
      <el-table-column :formatter="bizTypeFormat" align="center" label="业务类型" prop="bizType" width="200"/>
      <el-table-column :formatter="customerIdFormat" align="center" label="客户" prop="customerId" width="200"/>
      <el-table-column align="center" label="合同编号" prop="contractNo" width="200"/>
      <el-table-column :formatter="contractTypeFormat" align="center" label="合同类型" prop="contractType" width="200"/>
      <el-table-column :formatter="applyTypeFormat" align="center" label="申请类型" prop="applyType" width="200"/>
      <el-table-column :formatter="applyUserFormat" align="center" label="申请人" prop="applyUser" width="200"/>
      <el-table-column align="center" label="申请日期" prop="applyTime" width="200">
        <template #default="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="applyStatusFormat" align="center" label="申请状态" prop="applyStatus" width="200"/>
      <el-table-column :formatter="auditUserFormat" align="center" label="审核人" prop="auditUser" width="200"/>
      <el-table-column align="center" label="审核日期" prop="auditTime" width="200">
        <template #default="scope">
          <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="auditStatusFormat" align="center" label="审核状态" prop="auditStatus" width="200"/>
      <el-table-column :formatter="billStatusFormat" align="center" label="单据状态" prop="billStatus" width="200"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" width="200">
        <template #default="scope">
          <el-button text @click="handleUpdate(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNum" :total="total"
                @pagination="getList"/>

    <!-- 添加或修改出库申请对话框 -->
    <el-dialog v-model="open" :title="title" append-to-body width="1000px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="单据号" prop="serialNo">
          <el-input v-model="form.serialNo" disabled placeholder=""/>
        </el-form-item>
        <el-form-item label="关联单据号" prop="bizBillNo">
          <el-input v-model="form.bizBillNo" disabled placeholder="请输入关联单据号">
            <template #append>
              <el-button slot="append" disabled @click="handleSelectBiz">选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="业务类型" prop="bizType">
          <el-select v-model="form.bizType" clearable disabled filterable placeholder="请选择业务类型">
            <el-option v-for="dict in bizTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户" prop="customerId">
          <el-select v-model="form.customerId" clearable disabled filterable placeholder="请选择客户">
            <el-option v-for="dict in customerIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractId">
          <el-input v-model="form.contractId" disabled placeholder=""/>
        </el-form-item>
        <el-form-item disabled label="合同类型" prop="contractType">
          <el-select v-model="form.contractType" clearable disabled filterable placeholder="">
            <el-option v-for="dict in contractTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" prop="applyUser">
          <el-select v-model="form.applyUser" clearable disabled filterable placeholder="">
            <el-option v-for="dict in applyUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applyTime">
          <el-date-picker v-model="form.applyTime" clearable disabled placeholder="" type="date"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请状态" prop="applyStatus">
          <el-select v-model="form.applyStatus" clearable disabled filterable placeholder="">
            <el-option v-for="dict in applyStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核人" prop="auditUser">
          <el-select v-model="form.auditUser" clearable disabled filterable placeholder="">
            <el-option v-for="dict in auditUserOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核日期" prop="auditTime">
          <el-date-picker v-model="form.auditTime" clearable disabled placeholder="" type="date"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditStatus">
          <el-select v-model="form.auditStatus" clearable disabled filterable placeholder="">
            <el-option v-for="dict in auditStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditComment">
          <el-input v-model="form.auditComment" placeholder="" type="textarea"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" disabled placeholder="请输入内容" type="textarea"/>
        </el-form-item>
        <el-form-item label="单据状态" prop="billStatus">
          <el-select v-model="form.billStatus" clearable disabled filterable placeholder="">
            <el-option v-for="dict in billStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
                       :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="center">出库申请明细信息</el-divider>
        <el-table ref="wmsOutWarehouseApplyDetail" :data="wmsOutWarehouseApplyDetailList"
                  :row-class-name="rowWmsOutWarehouseApplyDetailIndex">
          <el-table-column align="center" type="selection"/>
          <el-table-column align="center" label="序号" prop="index" width="200"/>
          <el-table-column label="物料" prop="materialName" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsOutWarehouseApplyDetailList.'+scope.$index+'.materialName'"
                            :rules="rules.materialName">
                <el-input v-model="scope.row.materialName" disabled placeholder="请选择物料">
                  <template #append>
                    <el-button slot="append" :disabled="form.auditStatus!='1'&&form.applyStatus!='1'?false:true"
                               @click="handleSelectMaterial(scope.$index)">选择
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="仓库" prop="warehouseId" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsOutWarehouseApplyDetailList.'+scope.$index+'.warehouseId'">
                <el-select v-model="scope.row.warehouseId" disabled placeholder="">
                  <el-option v-for="dict in warehouseIdOptions" :key="dict.dictValue" :label="dict.dictLabel"
                             :value="dict.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库区" prop="whRegionId" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsOutWarehouseApplyDetailList.'+scope.$index+'.whRegionId'">
                <el-select v-model="scope.row.whRegionId" disabled placeholder="">
                  <el-option v-for="dict in scope.row.whRegionOptions" :key="dict.id" :label="dict.name"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="whLocationId" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsOutWarehouseApplyDetailList.'+scope.$index+'.whLocationId'">
                <el-select v-model="scope.row.whLocationId" disabled placeholder="">
                  <el-option v-for="dict in scope.row.whLocationOptions" :key="dict.id" :label="dict.name"
                             :value="dict.id"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="出库数量" prop="outQuantity" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsOutWarehouseApplyDetailList.'+scope.$index+'.outQuantity'"
                            :rules="rules.outQuantity">
                <el-input v-model.number="scope.row.outQuantity"
                          :disabled="form.auditStatus!='1'&&form.applyStatus!='1'?false:true"
                          placeholder="请输入出库数量"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="型号" prop="materialModel" width="200">
          </el-table-column>
          <el-table-column label="规格" prop="materialSpecification" width="200">
          </el-table-column>
          <el-table-column label="单位" prop="materialUnit" width="200">
          </el-table-column>
          <el-table-column label="生产批号" prop="batchNo" width="200">
            <template #default="scope">
              <el-form-item :prop="'wmsOutWarehouseApplyDetailList.'+scope.$index+'.batchNo'">
                <el-input v-model="scope.row.batchNo" disabled placeholder=""/>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button v-if="form.applyStatus!='2'" type="primary" @click="submitForm('1')">通 过</el-button>
        <el-button v-if="form.applyStatus!='2'" type="warning" @click="submitForm('0')">驳 回</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  auditOutWarehouseApply,
  getOutWarehouseApply,
  listOutWarehouseApply4Audit
} from "@/api/wmsApply/outWarehouseApply";
import {listWarehouseRegion} from "@/api/warehouse/warehouseRegion";
import {listWarehouseLocation} from "@/api/warehouse/warehouseLocation";

export default {
  name: "OutWarehouseApplyAudit",
  components: {},
  data() {
    let checkAuditComment = (rule, value, callback) => {
      if (this.form.auditStatus == '0') {
        if (!value) {
          callback(new Error('请输入审核意见'));
        }
      }
      callback();
    }
    return {
      material: null,
      currentRowIndex: null,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWmsOutWarehouseApplyDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 出库申请表格数据
      outWarehouseApplyList: [],
      // 出库申请明细表格数据
      wmsOutWarehouseApplyDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      materialSelectOpen: false,
      // 业务类型字典
      bizTypeOptions: [],
      // 客户字典
      customerIdOptions: [],
      // 合同类型字典
      contractTypeOptions: [],
      // 申请类型字典
      applyTypeOptions: [],
      // 申请人字典
      applyUserOptions: [],
      // 申请日期时间范围
      daterangeApplyTime: [],
      // 申请状态字典
      applyStatusOptions: [],
      // 审核人字典
      auditUserOptions: [],
      // 审核日期时间范围
      daterangeAuditTime: [],
      // 审核状态字典
      auditStatusOptions: [],
      // 单据状态字典
      billStatusOptions: [],
      warehouseIdOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serialNo: null,
        bizBillId: null,
        bizType: null,
        customerId: null,
        contractId: null,
        contractType: null,
        applyType: '2',
        applyUser: null,
        applyTime: null,
        applyStatus: null,
        auditUser: null,
        auditTime: null,
        auditStatus: null,
        billStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        auditComment: [{
          validator: checkAuditComment, trigger: 'blur'
        },
          {max: 100, message: "审核意见最多100个字符", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("event_type").then(response => {
      this.bizTypeOptions = response.data.filter(item => item.dictValue == '3' || item.dictValue == '4');

    });
    this.getQueryData("query_customer").then(response => {
      this.customerIdOptions = response.data;
    });
    this.getDicts("contract_type").then(response => {
      this.contractTypeOptions = response.data;
    });
    this.getDicts("wms_apply_type").then(response => {
      this.applyTypeOptions = response.data;
    });
    this.getQueryData("query_user").then(res => {
      this.applyUserOptions = res.data;
    });
    this.getDicts("apply_status").then(response => {
      this.applyStatusOptions = response.data;
    });
    this.getQueryData("query_user").then(res => {
      this.auditUserOptions = res.data;
    });
    this.getDicts("audit_status").then(response => {
      this.auditStatusOptions = response.data;
    });
    this.getDicts("out_warehouse_status").then(response => {
      this.billStatusOptions = response.data;
    });
    this.getQueryData("query_warehouse").then(res => {
      this.warehouseIdOptions = res.data.map(item => ({
        dictValue: item.dictValue * 1,
        dictLabel: item.dictLabel,
      }));
    });
  },
  watch: {
    'wmsOutWarehouseApplyDetailList': {
      handler(newVal, oldVal) {
        this.form.wmsOutWarehouseApplyDetailList = newVal;
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    //选择关联单据号处理函数
    handleSelectBiz() {

    },
    //选择仓库处理函数
    handleWarehouseChange(val, index) {
      if (val) {
        this.getWhRegionOpts(val, index);
      }
    },
    //选择库区处理函数
    handleWhRegionChange(val, index) {
      if (val) {
        this.getWhLocationOpts(val, index);
      }
    },
    //获取库区选项
    getWhRegionOpts(val, index) {
      let queryParams = {
        warehouseId: val,
      }
      listWarehouseRegion(queryParams).then(res => {
        this.wmsOutWarehouseApplyDetailList[index].whRegionOptions = res.rows;
      });
    },
    //获取库位选项
    getWhLocationOpts(val, index) {
      let queryParams = {
        regionId: val,
      }
      listWarehouseLocation(queryParams).then(res => {
        this.wmsOutWarehouseApplyDetailList[index].whLocationOptions = res.rows;
      })
    },
    /** 查询出库申请列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeApplyTime && '' != this.daterangeApplyTime) {
        this.queryParams.params["beginApplyTime"] = this.daterangeApplyTime[0];
        this.queryParams.params["endApplyTime"] = this.daterangeApplyTime[1];
      }
      if (null != this.daterangeAuditTime && '' != this.daterangeAuditTime) {
        this.queryParams.params["beginAuditTime"] = this.daterangeAuditTime[0];
        this.queryParams.params["endAuditTime"] = this.daterangeAuditTime[1];
      }
      listOutWarehouseApply4Audit(this.queryParams).then(response => {
        this.outWarehouseApplyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 业务类型字典翻译
    bizTypeFormat(row, column) {
      return this.selectDictLabel(this.bizTypeOptions, row.bizType);
    },
    // 客户字典翻译
    customerIdFormat(row, column) {
      return this.selectDictLabel(this.customerIdOptions, row.customerId);
    },
    // 合同类型字典翻译
    contractTypeFormat(row, column) {
      return this.selectDictLabel(this.contractTypeOptions, row.contractType);
    },
    // 申请类型字典翻译
    applyTypeFormat(row, column) {
      return this.selectDictLabel(this.applyTypeOptions, row.applyType);
    },
    // 申请人字典翻译
    applyUserFormat(row, column) {
      return this.selectDictLabel(this.applyUserOptions, row.applyUser);
    },
    // 申请状态字典翻译
    applyStatusFormat(row, column) {
      return this.selectDictLabel(this.applyStatusOptions, row.applyStatus);
    },
    // 审核人字典翻译
    auditUserFormat(row, column) {
      return this.selectDictLabel(this.auditUserOptions, row.auditUser);
    },
    // 审核状态字典翻译
    auditStatusFormat(row, column) {
      return this.selectDictLabel(this.auditStatusOptions, row.auditStatus);
    },
    // 单据状态字典翻译
    billStatusFormat(row, column) {
      return this.selectDictLabel(this.billStatusOptions, row.billStatus);
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
        serialNo: null,
        bizBillId: null,
        bizType: null,
        customerId: null,
        contractId: null,
        contractType: null,
        applyType: '2',
        applyUser: null,
        applyTime: null,
        applyStatus: null,
        auditUser: null,
        auditTime: null,
        auditStatus: null,
        auditComment: null,
        remark: null,
        billStatus: null,
        wmsOutWarehouseApplyDetailList: [],
      };
      this.wmsOutWarehouseApplyDetailList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeApplyTime = [];
      this.daterangeAuditTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加出库申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOutWarehouseApply(id).then(response => {
        this.form = response.data;
        response.data.wmsOutWarehouseApplyDetailList.forEach(item => {
          let obj = {
            whRegionOptions: [],
            whLocationOptions: [],
          };
          let detail = Object.assign(obj, item);
          this.wmsOutWarehouseApplyDetailList.push(detail);
        })
        this.wmsOutWarehouseApplyDetailList.forEach((item, index) => {
          this.getWhRegionOpts(item.warehouseId, index);
          this.getWhLocationOpts(item.whRegionId, index);
        })
        this.open = true;
        this.title = "查看出库申请";
      });
    },
    /** 审核按钮 */
    submitForm(status) {
      this.form.auditStatus = status;
      this.$refs["form"].validate(valid => {
        if (valid) {
          auditOutWarehouseApply(this.form).then(response => {
            this.msgSuccess("审核成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 出库申请明细序号 */
    rowWmsOutWarehouseApplyDetailIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
  }
};
</script>
