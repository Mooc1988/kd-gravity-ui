<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="APP名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getApps">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="apps" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" min-width="180">
            </el-table-column>
            <el-table-column prop="type" label="类型" width="100">
            </el-table-column>
            <el-table-column prop="subType" label="子类型" width="100" v-if="hasSubType">

            </el-table-column>
            <el-table-column label="审核模式" width="120">
                <template scope="scope">
                    <el-switch
                            v-model="scope.row.auditMode"
                            on-text="开"
                            off-text="关"
                            @change="handleSwitchAudit(scope.$index, scope.row)">
                    </el-switch>
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
            <el-table-column prop="User.nickname" label="创建人" width="120" sortable>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="200" :formatter="formatDate" sortable>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="50"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="App名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="推广链接" prop="recommendLink">
                    <el-input v-model="editForm.recommendLink" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="meta数据">
                    <codemirror v-model="editForm.metaStr" :options="editorOptions"></codemirror>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="App名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="App类型" prop="type">
                    <el-input v-model="appType" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="子类型" prop="subType" v-if="hasSubType">
                    <el-select v-model="addForm.subType" placeholder="请选择">
                        <el-option v-for="item in subTypes"
                                   :key="item"
                                   :label="item"
                                   :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
  import util from '../../common/js/util';
  import NProgress from 'nprogress';
  import { app, template } from '../../api'
  export default {
    props: ['appType'],
    watch: {
      appType: function () {
        this.getApps()
      }
    },
    computed: {
      hasSubType: function () {
        return this.appType === '游戏' || this.appType === '工具'
      }
    },
    data() {
      return {
        filters: {
          name: ''
        },
        editorOptions: {
          mode: 'application/json',
          theme: 'dracula',
          height: 'auto',
          lineNumbers: false
        },
        apps: [],
        subTypes: [],
        total: 0,
        offset: 1,
        listLoading: false,
        sels: [], //列表选中列
        editFormVisible: false, //编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          subType: '',
          metaStr: '{}'
        },
        addFormVisible: false, //新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          subType: [{
            required: true,
            message: '选择自类型'
          }]
        },
        //新增界面数据
        addForm: {
          name: '',
          subType: ''
        }
      }
    },
    methods: {
      openLink(link){
        window.open(link)
      },
      handleCurrentChange(val) {
        this.page = val
        this.getApps()
      },
      getSubTypes (){
        template.getSubTypes().then(res => {
          this.subTypes = res.data
        })
      },
      getApps() {
        let para = {
          page: this.page,
          search: this.filters.name,
          type: this.appType
        }
        this.listLoading = true
        NProgress.start()
        app.getAppListPage(para).then((res) => {
          this.total = res.data.count
          this.apps = res.data.rows
          this.listLoading = false
          NProgress.done()
        })
      },
      handleDetail: function functionName (index, row) {
        let id = row.id
        this.$router.push({path: `/h5/apps/${id}`})
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          app.removeApp(row.id).then((res) => {
            this.listLoading = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        }).catch((err) => {
          this.editLoading = false
          let {message} = err.response.data
          this.$message.error(message || err.message)
        })
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row)
        this.editForm.metaStr = row.meta !== null ? JSON.stringify(row.meta) : '{}'
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true
        if (this.$refs.addForm) {
          this.$refs.addForm.resetFields();
        }
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            let para = Object.assign({}, this.editForm)
            try {
              para.meta = JSON.parse(this.editForm.metaStr)
            } catch (err) {
              console.error(err)
              this.$message.error('meta不是标准json')
              return
            }
            this.editLoading = true
            app.modifyApp(para).then((res) => {
              this.editLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getApps()
            }).catch((err) => {
              this.editLoading = false
              let {message} = err.response.data
              this.$message.error(message || err.message)
            })
          }
        })
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            let para = Object.assign({type: this.appType}, this.addForm)
            this.addLoading = true
            app.addApp(para).then((res) => {
              this.addLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getApps()
            }).catch((err) => {
              this.addLoading = false
              let {message} = err.response.data
              this.$message.error(message || err.message)
            })
          }
        })
      },
      handleSwitchAudit: function (index, row) {
        const appId = row.id
        app.switchAuditMode(appId).then((res) => {
          this.$message({
            message: '切换成功',
            type: 'success'
          })
        }).catch((err) => {
          let {message} = err.response.data
          this.$message.error(message || err.message)
        })
      },
      selsChange: function (sels) {
        this.sels = sels
      },
      formatDate: function (row) {
        return row.createdAt.substr(0, 10)
      }
    },
    mounted() {
      this.getApps()
      this.getSubTypes()
    }
  }
</script>
