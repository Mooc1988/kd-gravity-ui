<template>
    <section>
        <div style="margin: 40px;"></div>
        <el-row>
            <el-col :span="16" :offset="2">
                <el-form label-width="90px" :model="templateForm" :rules="templateFormRules" ref="templateForm">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="templateForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="templateForm.type" placeholder="请选择">
                            <el-option v-for="item in appTypes"
                                       :key="item"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属用户" prop="UserId">
                        <el-select v-model="templateForm.UserId" placeholder="请选择">
                            <el-option v-for="user in users"
                                       :key="user.id"
                                       :label="user.nickname"
                                       :value="user.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="推广链接">
                        <el-input v-model="templateForm.recommendLink"></el-input>
                    </el-form-item>
                    <el-form-item label="meta数据">
                        <codemirror v-model="templateForm.metaStr" :options="editorOptions"></codemirror>
                    </el-form-item>
                    <el-form-item label="广告数据" prop="adsStr">
                        <codemirror v-model="templateForm.adsStr" :options="editorOptions"></codemirror>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="add">添加</el-button>
                        <el-button @click="back">返回</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </section>
</template>
<script>
  import util from '../../common/js/util';
  import NProgress from 'nprogress';
  import { template, user } from '../../api'
  import { APP_TYPES } from '../common/consts'
  import ElRow from '../../../node_modules/element-ui/packages/row/src/row'
  export default {
    components: {ElRow}, data() {
      return {
        users: [],
        appTypes: APP_TYPES,
        editorOptions: {
          mode: 'application/json',
          theme: 'dracula',
          height: 'auto',
          lineNumbers: true
        },
        templateFormRules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '选择App类型',
            trigger: 'blur'
          }],
          adsStr: [{
            required: true,
            message: '没有广告数据'
          }],
          UserId: [{
            required: true,
            type: 'number',
            message: '请输选择用户',
            trigger: 'blur'
          }]
        },
        templateForm: {
          "name": '',
          "recommendLink": '',
          "type": '',
          "metaStr": '',
          "adsStr": '',
          "UserId": ''
        }
      }
    },
    methods: {
      add(){
        let data = Object.assign({}, this.templateForm)
        let {metaStr, adsStr} = data
        if (metaStr) {
          try {
            data.meta = JSON.parse(metaStr)
          } catch (err) {
            this.$message.error('meta数据不是标准json')
          }
        }
        try {
          let ads = JSON.parse(adsStr)
          if (!Array.isArray(ads)) {
            this.$message.error('广告数据必须为数组')
            return
          } else {
            data.ads = ads
          }
        } catch (err) {
          this.$message.error('广告数据不是标准json')
          return
        }
        delete data['adsStr']
        delete data['metaStr']
        this.$refs.templateForm.validate((valid) => {
          if (valid) {
            template.createOrUpdate(data).then(res => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }).catch((err) => {
              let {message} = err.response.data
              this.$message.error(message || err.message)
            })
          }
        })
      },
      getUsers() {
        user.findAll({}).then(res => this.users = res.data)
      },
      back(){
        this.$router.push({path: '/settings/templates'})
      }
    },
    mounted() {
      this.getUsers()
    }
  }
</script>
<style>
    .CodeMirror {
        border: 1px solid #eee;
        height: auto !important;
    }
</style>
