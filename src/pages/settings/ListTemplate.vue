<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="APP名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getTemplates">查询</el-button>
                </el-form-item>
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
            <el-table-column prop="User.nickname" label="所属用户" width="100">
            </el-table-column>
            <el-table-column label="meta字段" width="100">
                <template scope="scope">
                    <el-popover
                            ref="popover1"
                            placement="top-start"
                            width="200"
                            trigger="hover">
                        <p>{{scope.row.meta}}</p>
                    </el-popover>
                    <el-button type="text" v-popover:popover1 v-if="scope.row.meta">查看</el-button>
                    <span v-if="!scope.row.meta">-</span>
                </template>
            </el-table-column>
            <el-table-column label="推广链接" width="120">
                <template scope="scope">
                    <el-button v-if="scope.row.recommendLink" type="text" @click="openLink(scope.row.recommendLink)">
                        预览
                    </el-button>
                    <span v-if="!scope.row.recommendLink">-</span>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="200" :formatter="formatDate" sortable>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
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
      handleCurrentChange(val) {
        this.page = val
        this.getTemplates()
      },
      getTemplates() {
        let para = {
          page: this.page,
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
