<style>
    .blue {
        color: blue;
    }

    .img-uploader .coverImg {
        width: 300px;
        height: 300px;
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

        <el-row type="flex" class="margin-md-top" justify="center">
            <el-col :span="24">
                <el-steps :active="active" finish-status="success">
                    <el-step title="选择类目"></el-step>
                    <el-step title="商品信息"></el-step>
                    <el-step title="商品规格"></el-step>
                </el-steps>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="24">
                <el-button style="margin-top: 12px;" size="mini" @click="onPrev">上一步</el-button>
                <el-button style="margin-top: 12px;" size="mini" @click="onNext">下一步</el-button>
            </el-col>
        </el-row>


        <el-row v-if="active == 0" type="flex" justify="center">
            <el-col :span="24" class="margin-md-top">
                <div>一个商品只能关联一个类目, 选择后不能再变更，如果以下没有，请到类目中添加</div>
                <el-cascader style="width: 320px;" v-model="cateId" :loading="loading" :options="cateOptions"
                             placeholder="试试搜索：男装" filterable size="small" :props="props"></el-cascader>
            </el-col>
        </el-row>
        <el-form
                class="margin-md-top"
                v-if="active == 1"
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
                <el-input :rows="5" v-model="addForm.sub_title"/>
            </el-form-item>
            <el-form-item
                    :label="$t('Price')"
                    prop="show_price">
                <el-input type="number" v-model="addForm.show_price"/>
            </el-form-item>
            <el-form-item
                    :label="$t('SaleOpenTime')"
                    prop="sale_open_time">
                <el-date-picker
                        v-model="seTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item
                    :label="$t('Cover')">
                <ImgUploader2online show="all" imgCls="coverImg" ref="addImgUploader" @onUploadSuccess="onUploadSuccess"
                                    :defaultImgUrl="addForm.cover_img" imgType="goods"/>
            </el-form-item>
            <el-form-item>
                <el-button

                        :loading="loading"
                        type="primary"
                        @click="submitForm()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
  import spCateApi from '../../api/spCateApi'
  import goodsApi from '../../api/goodsApi'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
  import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
  import ImgUploader2online from '@/components/img-uploader2online.vue'

  export default {
    components: {
      ElForm,
      ElButtonGroup,
      ElButton,
      ImgUploader2online
    },
    data () {
      return {
        seTime: [],
        active: 0,
        cateOptions: [],
        props: {
          multiple: false,
          value: 'id',
          label: 'title',
          children: 'children'
        },
        freightOptions: [
          { key: 1, title: '免运费' },
          { key: 2, title: '到付' },
          { key: 3, title: '预付' }
        ],
        addForm: {
          prop_value_ids: '',
          title: '',
          sub_title: '',
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
        cateId: 0
      }
    },
    computed: {},
    watch: {
      seTime (newVal, oldVal) {
        this.addForm.sale_open_time = (newVal[0].getTime() / 1000)
        this.addForm.sale_end_time = (newVal[1].getTime() / 1000)
      }
    },
    created () {

    },
    mounted () {
      this.refresh()
    },
    methods: {
      onUploadSuccess (data) {
        console.debug('Upload Image', data)
        this.addForm.cover_img = window.tools.getImgUrl(data.path)
      },
      onPrev () {
        if (this.active == 0) {
          return
        }
        this.active--
      },
      onNext () {
        if (this.active == 2) {
          return
        }
        if (this.cateId == 0) {
          window.tools.alertError('请选择类目')
          return
        }
        this.active++
      },
      submitForm () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            goodsApi.create(this.addForm, (resp) => {
              this.loading = false
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
      removeEmptyChildren (child) {
        for (var i in child) {
          if (!child[i].children) {
            continue
          }
          if (child[i].children.length === 0) {
            child[i].children = undefined
          } else {
            this.removeEmptyChildren(child[i].children)
          }
        }
        return child
      },
      refresh () {
        // 刷新当前
        this.tableData = []
        this.loading = true
        let that = this
        spCateApi.query3Level({}, (resp) => {
          that.loading = false
          resp = this.removeEmptyChildren(resp)
          console.debug('三级类目', resp)
          this.cateOptions = resp

        }, (resp) => {
          window.tools.alertError(resp.msg)
          that.loading = false
        })

      }
    }
  }
</script>
