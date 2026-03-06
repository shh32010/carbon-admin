<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="储备额度" prop="storageEmission">
        <el-input
          v-model="queryParams.storageEmission"
          placeholder="请输入储备额度"
          clearable

          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="付费额度" prop="payEmission">
        <el-input
          v-model="queryParams.payEmission"
          placeholder="请输入付费额度"
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
          v-hasPermi="['distribusion:totalEmission:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain


          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['distribusion:totalEmission:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain


          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['distribusion:totalEmission:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="totalEmissionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection"  align="center"/>
      <el-table-column label="id" align="center" prop="id"  width="200" />
      <el-table-column label="储备额度" align="center" prop="storageEmission"  width="200" />
      <el-table-column label="付费额度" align="center" prop="payEmission"  width="200" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" >
        <template #default="scope">
          <el-button

           text

            @click="handleUpdate(scope.row)"
            v-hasPermi="['distribusion:totalEmission:edit']"
          >修改</el-button>
          <el-button

           text

            @click="handleDelete(scope.row)"
            v-hasPermi="['distribusion:totalEmission:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" :gutter="10" style="margin-top:10px;">
      <el-col :span="24">
        <el-card>
          <div slot="header">
            <span>总览</span>
          </div>
          <div>
            <div id="energyMap" :style="{height: '300px'}"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改配额管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="储备额度" prop="storageEmission">
          <el-input v-model="form.storageEmission" placeholder="请输入储备额度" />
        </el-form-item>
        <el-form-item label="付费额度" prop="payEmission">
          <el-input v-model="form.payEmission" placeholder="请输入付费额度" />
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
import { listTotalEmission, getTotalEmission, delTotalEmission, addTotalEmission, updateTotalEmission, exportTotalEmission } from "@/api/distribusion/totalEmission";

export default {
  name: "TotalEmission",
  components: {
  },
  data() {
    return {
      energyMapOpts: {
        title: {
        },
        tooltip: {
        },
        series: [
          {
            name: '总配额',
            type: 'treemap',
            visibleMin: 300,
            label: {
              show: true,
              formatter: '{b}'
            },
            itemStyle: {
              borderColor: '#fff'
            },
            levels: [
              {
                itemStyle: {
                  borderWidth: 0,
                  gapWidth: 5,
                }
              },
              {
                itemStyle: {
                  gapWidth: 1,
                }
              },
              {
                colorSaturation: [0.35, 0.5],
                itemStyle: {
                  gapWidth: 1,
                  borderColorSaturation: 0.6,
                }
              }
            ],
            data: []
          }
        ]
      },

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
      // 配额管理表格数据
      totalEmissionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storageEmission: null,
        payEmission: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {

    drawEnergyMap() {
      let myChart = this.$echarts.init(document.getElementById('energyMap'));
      // 绘制图表
      myChart.setOption(this.energyMapOpts);
      window.addEventListener('resize', myChart.resize);
    },
    /** 查询配额管理列表 */
    getList() {
      this.loading = true;
      listTotalEmission(this.queryParams).then(response => {
        this.totalEmissionList = response.rows;
        this.total = response.total;
        this.loading = false;

        this.energyMapOpts.series[0].data.push();this.energyMapOpts.series[0].data=[
          {
            "value": this.totalEmissionList[0].storageEmission,
            "name": "储备配额",

          },
          {
            "value": this.totalEmissionList[0].payEmission,
            "name": "付费配额",

          }
        ];
        this.drawEnergyMap();
      });



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
        storageEmission: null,
        payEmission: null,
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
      this.title = "添加配额管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTotalEmission(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改配额管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTotalEmission(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTotalEmission(this.form).then(response => {
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
      this.$confirm('是否确认删除配额管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTotalEmission(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有配额管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTotalEmission(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
