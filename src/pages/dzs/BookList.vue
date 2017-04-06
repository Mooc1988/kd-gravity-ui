<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="名称或作者"></el-input>
                </el-form-item>
                <el-select v-model="category" placeholder="请选择" v-on:change="getBooks">
                    <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-form-item>
                    <el-button type="primary" v-on:click="getBooks">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAddToApp" :disabled="this.sels.length===0">
                        添加至APP


                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="books" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="100"></el-table-column>
            <el-table-column label="封面" min-width="150">
                <template scope="scope">
                    <img :src="'http://book.hizuoye.com/images/full/'+scope.row.coverImage" width="120" height="150" />
                </template>
            </el-table-column>
            <el-table-column prop="title" label="名称" min-width="150"></el-table-column>
            <el-table-column prop="author" label="作者" min-width="150"></el-table-column>
            <el-table-column label="分类" min-width="150">
                <template scope="scope">
                    <el-tag v-for="tag in scope.row.tags" :key="tag" type="gray">{{tag}}</el-tag>
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
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="30"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="名称" prop="title">
                    <el-input v-model="editForm.title" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <el-upload
                    class="avatar-uploader"
                    action="http://upload.hizuoye.com/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--添加至APP界面-->
        <el-dialog title="添加至App" v-model="addToAppFormVisible" :close-on-click-modal="false">
            <el-form :model="addToAppForm" label-width="80px" :rules="addToAppFormRules" ref="addToAppForm">
                <el-form-item label="AppId" prop="appId">
                    <el-input v-model="addToAppForm.appId" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addToAppFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addToApp" :loading="addToAppLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
  import util from '../../common/js/util'
  import NProgress from 'nprogress'
  import { dzs } from '../../api'

  export default {
    data() {
      return {
        imageUrl: '',
        categories: [],
        category: 0,
        filters: {
          name: ''
        },
        books: [],
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
        addToAppFormVisible: false, //新增界面是否显示
        addToAppLoading: false,
        addToAppForm: {
          appId: ''
        },
        addToAppFormRules: {
          appId: [{
            required: true,
            message: '请输入AppId',
            trigger: 'blur'
          }]
        }
      }
    },
    filters: {
      imgPath(val){
        return `http://book.hizuoye.com/images/full/${val}`
      }
    },
    methods: {

      handleCurrentChange(val) {
        this.page = val
        this.getBooks()
      },

      getCategories(){
        dzs.getCategories().then((res) => {
          let categories = res.data
          categories.unshift({id: 0, name: '所有分类'})
          this.categories = categories
        })
      },
      getBooks() {
        let para = {
          page: this.page,
          keyword: this.filters.keyword,
          category: this.category === 0 ? undefined : this.category
        }
        this.listLoading = true
        dzs.getBooks(para).then((res) => {
          this.total = res.data.count
          this.books = res.data.rows
          this.listLoading = false
        })
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
        this.imageUrl = 'http://book.hizuoye.com/images/full/' + row.coverImage
      },
      handleAddToApp: function () {
        this.addToAppFormVisible = true
        this.addToAppForm = {appId: ''}
      },

      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editLoading = true
            let para = Object.assign({}, this.editForm)
            dzs.modifyBookById(para).then((res) => {
              this.editLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getBooks()
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
      selsChange: function (sels) {
        this.sels = sels
      },
      addToApp: function () {
        this.$refs.addToAppForm.validate((valid) => {
          if (valid) {
            this.addToAppLoading = true
            let appId = this.addToAppForm.appId
            let bookIds = this.sels.map(item => item.id)
            dzs.addToApp({
              appId,
              bookIds
            }).then((res) => {
              this.addToAppLoading = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$refs['addToAppForm'].resetFields()
              this.addToAppFormVisible = false
            }).catch((err) => {
              console.log(err)
              this.addToAppLoading = false
              let {message} = err.response.data
              this.$message.error(message || err.message)
            })
          }
        })
      },
      handleAvatarSuccess(res, file) {
        if (res.success) {
          this.editForm.coverImage = res.name
        }
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    },
    mounted() {
      this.getBooks()
      this.getCategories()
    }
  }
</script>
<style>
    .el-tag {
        margin: 5px
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        margin-left: 80px
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar {
        width: 120px;
        height: 150px;
        display: block;
    }
</style>
