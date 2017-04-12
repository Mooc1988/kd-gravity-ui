<template>
    <section>
        <div style="margin: 40px;"></div>
        <el-row>
            <el-col :span="14" :offset="2">
                <el-form label-width="100px" :model="templateForm" :rules="templateFormRules" ref="templateForm">

                    <el-form-item label="APP类型" prop="type">
                        <el-select v-model="templateForm.type" placeholder="请选择" @change="getTemplates">
                            <el-option v-for="item in appTypes"
                                       :key="item"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="所属用户" prop="UserId">
                        <el-select v-model="templateForm.UserId" placeholder="请选择" @change="getTemplates">
                            <el-option v-for="user in users"
                                       :key="user.id"
                                       :label="user.nickname"
                                       :value="user.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="版本" prop="version">
                        <el-select v-model="templateForm.version" placeholder="请选择" @change="selectVersion">
                            <el-option v-for="t in templates"
                                       :key="t.id"
                                       :label="t.version"
                                       :value="t.version">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="广告位" prop="position">
                        <el-select v-model="templateForm.position" placeholder="请选择" @change="selectPosition">
                            <el-option v-for="p in positions"
                                       :key="p.position"
                                       :label="p.name"
                                       :value="p.position">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="广告数据" prop="adsStr">
                        <codemirror v-model="templateForm.adsStr" :options="editorOptions"></codemirror>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="batchModify">修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </section>
</template>
<script>
  import util from '../../common/js/util';
  import NProgress from 'nprogress';
  import { template, user, app } from '../../api'
  import { APP_TYPES } from '../common/consts'
  import ElRow from '../../../node_modules/element-ui/packages/row/src/row'
  export default {
    components: {ElRow}, data() {
      return {
        users: [],
        positions: [],
        templates: [],
        appTypes: APP_TYPES,
        editorOptions: {
          mode: 'application/json',
          lineNumbers: false,
        },
        templateFormRules: {
          type: [{
            required: true,
            message: '选择App类型',
            trigger: 'blur'
          }],
          dataStr: [{
            required: true,
            message: '没有广告数据'
          }],
          UserId: [{
            required: true,
            message: '请选择用户'
          }],
          version: [{
            required: true,
            message: '请选择版本'
          }],
          position: [{
            required: true,
            message: '请选择广告位'
          }]
        },
        templateForm: {
          "version": null,
          "type": null,
          "adsStr": '',
          "UserId": null,
          "position": null
        }
      }
    },
    methods: {
      selectVersion(v){
        if (v) {
          let {ads} = this.templates.filter(t => t.version === v)[0]
          this.positions = ads
        }
      },

      selectPosition(v){
        let ad = this.positions.filter(p => p.position = v)[0]
        this.templateForm.adsStr = JSON.stringify(ad, undefined, 4)
      },

      batchModify(){
        let data = Object.assign({}, this.templateForm)
        let {adsStr} = data
        this.$confirm('确定批量修改广告位？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$refs.templateForm.validate((valid) => {
            if (valid) {
              try {
                data.data = JSON.parse(adsStr)
              } catch (err) {
                this.$message.error('广告数据不是标准json')
                return
              }
              app.batchModifyAds(data).then(res => {
                let {affectedCount} = res.data
                this.$message({
                  message: `修改app数量:${affectedCount} `,
                  type: 'success'
                })
              }).catch(err => {
                let {message} = err.response.data
                this.$message.error(message || err.message)
              })
            }
          })
        }).catch(() => {})
      },

      getUsers() {
        user.findAll({}).then(res => this.users = res.data)
      },

      getTemplates(){
        let {UserId, type} = this.templateForm
        this.templateForm.position = null
        this.templateForm.version = null
        if (UserId && type)
          template.getUserTemplates({UserId, type}).then(res => {
            this.templates = res.data
          })
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
    }
</style>
