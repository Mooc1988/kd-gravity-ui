<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="templates" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" min-width="180">
            </el-table-column>
            <el-table-column prop="type" label="APP类型" width="100">
            </el-table-column>
            <el-table-column prop="subType" label="子类型" width="100">
            </el-table-column>
            <el-table-column prop="version" label="版本" width="100">
            </el-table-column>
            <el-table-column prop="User.nickname" label="所属用户" width="100">
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="200" :formatter="formatDate" sortable>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                    <el-button size="small" :plain="true" type="danger" @click="handleUpgrade(scope.$index, scope.row)">
                        升级
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                           :page-size="50"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
  import NProgress from 'nprogress';
  import util from '../../common/js/util';
  import { template } from '../../api'
  export default {
    computed: {
      hasSubType: function () {
        return this.appType === '游戏'
      }
    },
    data() {
      return {
        filters: {
          name: ''
        },
        templates: [],
        total: 0,
        offset: 1,
        listLoading: false,
        sels: [], //列表选中列
      }
    },
    methods: {
      openLink(link){
        window.open(link)
      },
      handleUpgrade(index, row){
        let {id, name} = row
        this.$confirm(`确认升级模版 ${name}`, '提示', {
          type: 'warning'
        }).then(() => {
          template.upgradeById({id}).then(res => {
            this.getTemplates()
            this.$message({
              message: '模版升级成功',
              type: 'success'
            })
          })
        })
      },
      handleCurrentChange(val) {
        this.page = val
        this.getTemplates()
      },
      getTemplates() {
        let para = {
          page: this.page,
          enable: true,
          search: this.filters.name,
          type: this.appType
        }
        this.listLoading = true
        NProgress.start()
        template.getAll(para).then((res) => {
          this.total = res.data.count
          this.templates = res.data.rows
          this.listLoading = false
          NProgress.done()
        })
      },
      handleDetail: function functionName (index, row) {
        let id = row.id
        this.$router.push({path: `/settings/templates/${id}`})
      },
      //显示新增界面
      handleAdd: function () {
        this.$router.push({path: '/settings/templates/add'})
      },
      selsChange: function (sels) {
        this.sels = sels
      },
      formatDate: function (row) {
        return row.createdAt.substr(0, 10)
      }
    },
    mounted() {
      this.getTemplates()
    }
  }
</script>
