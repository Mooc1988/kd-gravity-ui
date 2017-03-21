<template>
<section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
            <el-form-item>
                <el-input v-model="filters.keyword" placeholder="APP名称"></el-input>
            </el-form-item>
            <el-select v-model="category" placeholder="请选择" v-on:change="getAlbums">
                <el-option v-for="item in catergories" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-form-item>
                <el-button type="primary" v-on:click="getAlbums">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleAdd" :disabled="this.sels.length===0">添加至APP</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="albums" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="title" label="名称" min-width="150"></el-table-column>
        <el-table-column prop="YssCategory.title" label="类型" width="120"></el-table-column>
        <el-table-column label="标签" min-width="150">
            <template scope="scope">
            <el-tag v-for="tag in scope.row.tags" :key="tag" type="gray">
              {{tag}}
            </el-tag>
        </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="查看次数" width="120" sortable>
        </el-table-column>
        <el-table-column label="操作" width="150">
            <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
        </el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="30" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
    <!--编辑界面-->
    <el-dialog title="添加至App" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="AppId" prop="appId">
          <el-input v-model="addForm.appId" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addToApp" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
	</section>
</template>

<script>
import util from '../../common/js/util'
import NProgress from 'nprogress'
import {
    categories
} from './consts'
import {
    getAlbumListPage,
    addAlbumsToApp
} from '../../api/api';
export default {
    data() {
        return {
            catergories: categories,
            category: '',
            filters: {
                name: ''
            },
            albums: [],
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
            },
            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            addForm: {
                appId: ''
            },
            addFormRules: {
                appId: [{
                    required: true,
                    message: '请输入AppId',
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {

        handleCurrentChange(val) {
            this.page = val
            this.getAlbums()
        },

        getAlbums() {
            let para = {
                page: this.page,
                search: this.filters.keyword,
                YssCategoryId: this.category
            }
            this.listLoading = true
            NProgress.start()
            getAlbumListPage(para).then((res) => {
                this.total = res.data.count
                this.albums = res.data.rows
                this.listLoading = false
                NProgress.done()
            })
        },

        //显示编辑界面
        handleEdit: function(index, row) {
            this.editFormVisible = true
            this.editForm = Object.assign({}, row)
        },

        handleAdd: function() {
            this.addFormVisible = true
            this.addForm={appId:''}
        },

        //编辑
        editSubmit: function() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.editLoading = true
                    let para = Object.assign({}, this.editForm)
                    modifyApp(para).then((res) => {
                        this.editLoading = false
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        })
                        this.$refs['editForm'].resetFields()
                        this.editFormVisible = false
                        this.getAlbums()
                    }).catch((err) => {
                        this.editLoading = false
                        let {
                            message
                        } = err.response.data
                        this.$message.error(message || err.message)
                    })
                }
            })
        },

        selsChange: function(sels) {
            this.sels = sels
        },

        formatDate: function(row) {
            return row.createdAt.substr(0, 10)
        },

        addToApp: function() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.editLoading = true
                    let appId = this.addForm.appId
                    let albumIds = this.sels.map(item => item.id)
                    addAlbumsToApp({
                        appId,
                        albumIds
                    }).then((res) => {
                      this.addLoading = false
                      this.$message({
                          message: '添加成功',
                          type: 'success'
                      })
                      this.$refs['addForm'].resetFields()
                      this.addFormVisible = false
                    }).catch((err) => {
                      this.addLoading = false
                      let {message} = err.response.data
                      this.$message.error(message || err.message)
                    })
                }
            })
        }
    },
    mounted() {
        this.getAlbums()
    }
}
</script>
<style>
.el-tag {
    margin: 5px
}
</style>
