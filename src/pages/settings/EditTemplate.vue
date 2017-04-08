<template>
    <section>
        <div style="margin: 40px;"></div>
        <el-row>
            <el-col :span="16" :offset="2">
                <el-form label-width="80px" :model="templateForm" :rules="templateFormRules" ref="templateForm">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="templateForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-input v-model="templateForm.type" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="所属用户">
                        <el-input v-model="templateForm.User.nickname" :disabled="true"></el-input>
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
                        <el-button type="primary" @click="modify">修改</el-button>
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
  import { template } from '../../api'
  import ElRow from '../../../node_modules/element-ui/packages/row/src/row'
  export default {
    components: {ElRow}, data() {
      return {
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
          }]
        },
        templateForm: {
          "id": null,
          "name": '',
          "recommendLink": '',
          "meta": null,
          "metaStr": "",
          "adsStr": "",
          "type": '',
          "User": {}
        }
      }
    },
    methods: {
      modify(){
        let data = this.templateForm
        let {metaStr, adsStr} = data
        if (metaStr && metaStr.trim() !== '') {
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
            template.modifyById(data).then((res) => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            })
          }
        })
      },
      getTemplate() {
        let templateId = this.$route.params.id
        template.getById(templateId).then((res) => {
          let data = res.data
          let {meta, ads} = data
          if (meta) {
            data.metaStr = JSON.stringify(meta, undefined, 4)
          }
          if (ads) {
            data.adsStr = JSON.stringify(ads, undefined, 4)
          }
          this.templateForm = Object.assign(this.templateForm, data)
        })
      },
      back(){
        this.$router.push({path: '/settings/templates'})
      }
    },
    mounted() {
      this.getTemplate()
    }
  }
</script>
<style>
    .CodeMirror {
        border: 1px solid #eee;
        height: auto !important;
    }
</style>
