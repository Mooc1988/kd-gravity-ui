<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="名称或作者"></el-input>
                </el-form-item>
                <el-select v-model="category" placeholder="请选择" v-on:change="getBooks">
                    <el-option :label="'所有分类'" :value="0" :key="'0'"></el-option>
                    <el-option v-for="item in categories" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
                <el-form-item>
                    <el-button type="primary" v-on:click="getBooks">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="handleAdd">添加</el-button>
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
                    <img :src="scope.row.coverImage" width="120" height="150" />
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
                <el-form-item label="作者" prop="author">
                    <el-input v-model="editForm.author" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="brief">
                    <el-input type="textarea" v-model="editForm.brief"></el-input>
                </el-form-item>
            </el-form>
            <el-upload
                    class="avatar-uploader"
                    action="http://upload.hizuoye.com/upload/book/image"
                    :data="editBook"
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

        <!--添加界面-->
        <el-dialog title="添加" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="名称" prop="title">
                    <el-input v-model="addForm.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="编号" prop="uid">
                    <el-input v-model="addForm.uid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-input v-model="addForm.author" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="CategoryId">
                    <el-select v-model="addForm.categoryId" placeholder="请选择">
                        <el-option v-for="cate in categories"
                                   :key="cate.id"
                                   :label="cate.name"
                                   :value="cate.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="简介" prop="title">
                    <el-input type="textarea" v-model="addForm.brief"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
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
          title: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          author: [{
            required: true,
            message: '请输入作者',
            trigger: 'blur'
          }],
        },
        //编辑界面数据
        editForm: {
          id: 0,
        },
        addForm: {
          title: null,
          categoryId: null,
          author: null,
          uid: null
        },
        addFormVisible: false,
        addLoading: false,
        addFormRules: {
          title: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          uid: [{
            required: true,
            message: '请输入编号',
            trigger: 'blur'
          }],
          author: [{
            required: true,
            message: '请输入作者',
            trigger: 'blur'
          }],
          categoryId: [{
            required: true,
            message: '请输选择分类'
          }]
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
    computed: {
      editBook: function () {
        return {book: this.editForm.uid}
      }
    },
    methods: {

      handleAdd(){
        this.addFormVisible = true
        if (this.$refs.addForm) {
          this.$refs.addForm.resetFields();
        }
      },

      addSubmit(){
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addLoading = true
            let data = Object.assign({}, this.addForm)
            dzs.addBook(data).then(res => {
              this.getBooks()
              this.addLoading = false
              this.$message({
                message: '添加图书成功',
                type: 'success'
              })
              this.addFormVisible = false
            }).catch((err) => {
              this.addLoading = false
              let {message} = err.response.data
              this.$message.error(message || err.message)
            })
          }
        })
      },
      handleCurrentChange(val) {
        this.page = val
        this.getBooks()
      },

      getCategories(){
        dzs.getCategories().then((res) => {
          this.categories = res.data
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
        this.imageUrl = row.coverImage
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
          console.log(res)
          let uid = this.editForm.uid
          let name = res.name
          this.editForm.coverImage = `https://book.hizuoye.com/books/${uid}/${name}`
          this.$message({
            message: '上传图片成功',
            type: 'success'
          })
          this.imageUrl = URL.createObjectURL(file.raw);
        } else {
          this.$message.error('上传图片失败');
        }
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

    .el-table .cell {
        padding: 10px;
    }
</style>
