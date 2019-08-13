<style>
    .blue {
        color: blue;
    }

</style>
<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-back"
                :loading="loading"
                @click="back()">
            {{ $t('Back')}}
        </el-button>

        <el-steps :active="active" finish-status="success">
            <el-step title="选择类目"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
        </el-steps>

        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>

        <el-cascader :props="props"></el-cascader>

        <el-form
                :visible.sync="dialogAddVisible"
                ref="addForm"
                :model="addForm"
                label-position="right"
                :rules="rules"
                label-width="100px"
        >

            <el-form-item
                    :label="$t('Title')"
                    required
                    prop="title">
                <el-input v-model="addForm.title"/>
            </el-form-item>
            <el-form-item
                    :label="$t('SubTitle')"
                    required
                    prop="sub_title">
                <el-input v-model="addForm.sub_title"/>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddVisible = false">
                {{ $t('Cancel') }}
            </el-button>
            <el-button

                    :loading="loading"
                    type="primary"
                    @click="submitAddForm()"
            >
                {{ $t('Confirm') }}
            </el-button>
        </div>
    </div>
</template>

<script>
  import spCateApi from '../../api/spCateApi'
  import goodsApi from '../../api/goodsApi'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
  import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

  export default {
    components: {
      ElForm,
      ElButtonGroup,
      ElButton
    },
    data () {
      return {
        cateLevel1: [],
        cateLevel2: [],
        cateLevel3: [],
        props: {
          lazy: true,
          lazyLoad (node, resolve) {
            const { level } = node

            setTimeout(() => {
              const nodes = Array.from({ length: level + 1 })
                .map(item => ({
                  value: ++id,
                  label: `选项${id}`,
                  leaf: level >= 2
                }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            }, 1000)
          }
        },
        freightOptions: [
          { key: 1, title: '免运费' },
          { key: 2, title: '到付' },
          { key: 3, title: '预付' }
        ],
        addForm: {
          prop_value_ids: '',
          title: '',
          sub_title: 0,
          show_price: 0,
          cover_img: '',
          small_cover_img: '',
          img_list: '',
          sale_open_time: 0,
          sale_end_time: 0,
          cate_id: 0,
          freight_type: 1,
          freight_tpl_id: 0,
          country_code: 1,
          country_name: '中国',
          province_code: '',
          province_name: '',
          city_code: '',
          city_name: '',
          area_code: '',
          area_name: '',
          town_code: '',
          town_name: ''
        },
        editForm: {
          id: 0,
          prop_value_ids: '',
          title: '',
          sub_title: 0,
          show_price: 0,
          cover_img: '',
          small_cover_img: '',
          img_list: '',
          sale_open_time: 0,
          sale_end_time: 0,
          cate_id: 0,
          freight_type: 1,
          freight_tpl_id: 0,
          country_code: 1,
          country_name: '中国',
          province_code: '',
          province_name: '',
          city_code: '',
          city_name: '',
          area_code: '',
          area_name: '',
          town_code: '',
          town_name: ''
        },
        rules: {
          title: [
            { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
            { min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
          ]
        },
        count: 0,
        tableData: [],
        loading: false,
        dialogAddVisible: false,
        dialogEditVisible: false
      }
    },
    computed: {},
    watch: {},
    created () {

    },
    mounted () {
      this.refresh()
    },
    methods: {
      onRelateBrand (row) {
        this.$router.replace({ path: '/admin/spcate/relate_brand/' + row.id, params: { grandpa: this.grandpa } })
      },
      onRelateProp (row) {
        this.$router.replace({ path: '/admin/spcate/relate_prop/' + row.id, params: { grandpa: this.grandpa } })
      },
      onDelete (id) {
        this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
          confirmButtonText: this.$i18n.t('Confirm'),
          cancelButtonText: this.$i18n.t('Cancel'),
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

              spCateApi.delete({ id: id }, (res) => {
                instance.confirmButtonLoading = false
                this.refresh()
                done()
              }, (res) => {
                console.debug(res)
                done()
                window.tools.alertError(res.msg)
                instance.confirmButtonLoading = false
              })
            } else {
              done()
            }
          }
        }).then(() => {
        }).catch(() => {
        })
      },
      submitEditForm () {
        spCateApi.update(this.editForm, (resp) => {
          this.loading = false
          this.dialogEditVisible = false
          this.refresh()
        }, (resp) => {
          window.tools.alertError(resp.msg)
          this.loading = false
          this.dialogEditVisible = false
        })
      },
      submitAddForm () {
        console.log(this.addForm)
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            spCateApi.create(this.addForm, (resp) => {
              this.loading = false
              this.dialogAddVisible = false
              window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
              this.refresh()
            }, (resp) => {
              this.loading = false
              window.tools.alertError(resp.msg)
            })
          } else {
            return false
          }
        })
      },
      onAdd () {
        this.addForm = {
          parent_id: this.queryForm.parent_id,
          title: '',
          leaf: 0,
          sort: 0
        }
        this.dialogAddVisible = true
      },
      onEdit (row) {
        this.editForm = {
          sort: row.sort,
          id: row.id,
          title: row.title,
          leaf: row.leaf
        }
        this.dialogEditVisible = true
      },
      refresh () {
        // 刷新当前
        this.tableData = []
        this.loading = true
        let that = this
        spCateApi.info({}, (resp) => {

          that.loading = false
        }, (resp) => {
          window.tools.alertError(resp.msg)
          that.loading = false
        })

      }
    }
  }
</script>
