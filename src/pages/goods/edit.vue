<style>
    .blue {
        color: blue;
    }

    .img-uploader .coverImg {
        width: 160px;
        height: 160px;
    }

    .img-uploader-container .imgList {
        width: 160px;
        height: 160px;
    }

    .by-goods-create .cate-prop-item {
        width: 30%;
        float: left;
    }
</style>
<template>
    <div class="main-content by-goods-create padding-md-bottom padding-md-top">
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
                    <el-step title="商品图片"></el-step>
                </el-steps>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="24">
                <el-button style="margin-top: 12px;" size="mini" @click="onPrev">{{ this.$t('Prev')}}</el-button>
                <el-button style="margin-top: 12px;" size="mini" @click="onNext">{{ this.$t('Next')}}</el-button>
            </el-col>
        </el-row>


        <el-row v-if="active == 0" type="flex" justify="center">
            <el-col :span="24" class="margin-md-top">
                <div>一个商品只能关联一个类目, 选择后不能再变更，如果以下没有，请到类目中添加</div>
                <el-cascader style="width: 320px;" v-model="cateId" :loading="loading" :options="cateOptions"
                             placeholder="试试搜索：男装" filterable size="small" :props="props"></el-cascader>
            </el-col>
        </el-row>
        <div v-if="active == 0">
            <h5>类目属性: </h5>
            <div v-for="(prop, index) in cateProperties" :key="prop.id">
                <div class="cate-prop-item margin-md-top">
                    {{prop.title}}:
                    <div class="cate-prop-values">
                        <el-select v-if="prop.prop_type === 'single'" v-model="selectedPropValueIds[index]" clearable
                                   placeholder="请选择">
                            <el-option
                                    v-for="item in prop.prop_values"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-if="prop.prop_type === 'multiple'" multiple v-model="selectedPropValueIds[index]"
                                   clearable placeholder="请选择">
                            <el-option
                                    v-for="item in prop.prop_values"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </div>
        <el-form
                class="margin-md-top"
                v-if="active == 1"
                :model="addForm"
                label-position="right"
                :rules="rules"
                label-width="100px"
        >

            <el-form-item
                    :label="$t('Title')"
                    required

                    prop="title">
                <el-input maxlength="50" show-word-limit v-model="addForm.title" placeholder="商品标题"/>
            </el-form-item>
            <el-form-item
                    :label="$t('SubTitle')"
                    required
                    prop="sub_title">
                <el-input maxlength="500" show-word-limit type="textarea" :rows="5" v-model="addForm.sub_title"
                          placeholder="商品子标题简介"/>
            </el-form-item>
            <el-form-item
                    :label="$t('Price')"
                    prop="show_price">
                <el-input type="number" v-model="addForm.show_price"/>
            </el-form-item>
            <el-form-item
                    :label="$t('SaleTime')"
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
                    :label="$t('Place')">
                <el-cascader style="width: 320px;" v-model="place" :loading="loading"
                             placeholder="" size="small" ref="placeCascader" :props="pcaProps"></el-cascader>
            </el-form-item>

            <el-form-item
                    :label="$t('SupportServices')">
                <el-select v-model="supportService" multiple placeholder="可选">
                    <el-option
                            v-for="item in supportServiceOptions"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>


            <el-form-item
                    :label="$t('Freight')">
                <el-select v-model="addForm.freight_type" placeholder="请选择">
                    <el-option
                            v-for="item in freightOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>


        <el-form
                class="margin-md-top"
                v-if="active == 2"
                label-position="right"
                :rules="rules"
                label-width="100px"
        >
            <el-form-item
                    :label="$t('Cover')">
                <ImgUploader2online show="all" imgCls="coverImg" ref="addImgUploader" @onUploadSuccess="onUploadSuccess"
                                    :defaultImgUrl="addForm.cover_img" imgType="goods"/>
            </el-form-item>
            <el-form-item
                    :label="$t('SmallCover')">
                <ImgUploader2online show="all" imgCls="coverImg" ref="smallImgUploader"
                                    @onUploadSuccess="onSmallUploadSuccess"
                                    :defaultImgUrl="addForm.small_cover_img" imgType="goods"/>
            </el-form-item>
            <el-form-item
                    :label="$t('Image')">
                <ImgUploaderV3 :items="3" show="all" imgCls="imgList" ref="imgListUploader"
                               @onUploadSuccess="onImgListUploadSuccess"
                               :defaultImgUrl="addForm.img_list" imgType="goods"/>
            </el-form-item>

            <el-form-item>
                <el-button

                        :loading="loading"
                        type="primary"
                        @click="onCreate()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
  import pcaApi from '../../api/pcaApi'
  import spCateApi from '../../api/spCateApi'
  import goodsApi from '../../api/goodsApi'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
  import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
  import ImgUploader2online from '@/components/img-uploader2online.vue'
  import ImgUploaderV3 from '../../../src/components/img-uploaderV3'
  import datatreeApi from '../../api/datatreeApi'

  export default {
    components: {
      ElForm,
      ElButtonGroup,
      ElButton,
      ImgUploaderV3,
      ImgUploader2online
    },
    data () {
      return {
        selectedPropValueIds: [],
        cateProperties: [],
        skuProperties: [],
        supportServiceOptions: [],// 商品支持服务选项
        place: [],
        seTime: [],
        active: 0, // 当前步骤
        cateOptions: [],
        pcaProps: {
          lazy: true,
          lazyLoad (node, resolve) {
            const { value, level } = node
            switch (parseInt(level)) {
              case 0 :
                pcaApi.query({}, function (resp) {
                  let nodes = resp.map(item => ({
                    value: item.code,
                    label: item.name,
                    leaf: false
                  }))
                  resolve(nodes)
                })
                break
              case 1:
                pcaApi.queryCity({ code: value }, function (resp) {
                  let nodes = resp.map(item => ({
                    value: item.code,
                    label: item.name,
                    leaf: false
                  }))
                  resolve(nodes)
                })
                break
              case 2:
                pcaApi.queryArea({ code: value }, function (resp) {
                  let nodes = resp.map(item => ({
                    value: item.code,
                    label: item.name,
                    leaf: false
                  }))
                  resolve(nodes)
                })
                break
              case 3:
                pcaApi.queryTown({ 'code': value }, function (resp) {
                  let nodes = resp.map(item => ({
                    value: item.code,
                    label: item.name,
                    leaf: true
                  }))
                  resolve(nodes)
                })
                break
              default:
                break
            }
          }
        },
        props: {
          multiple: false,
          value: 'id',
          label: 'title',
          children: 'children'
        },
        freightOptions: [
          { value: 1, label: '免运费' },
          { value: 2, label: '到付' },
          { value: 3, label: '预付' }
        ],
        supportService: [],
        addForm: {
          support_services: '',
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
      selectedPropValueIds (newVal) {
        // 商品属性
        this.addForm.prop_value_ids = newVal.filter(item => {
          return parseInt(item) > 0
        }).join(',')
      },
      cateId (newVal) {
        this.addForm.cate_id = newVal[newVal.length - 1]
        this.getRelateProp(this.addForm.cate_id)
      },
      supportService (newVal) {
        this.addForm.support_services = newVal.join(',')
      },
      seTime (newVal, oldVal) {
        this.addForm.sale_open_time = (newVal[0].getTime() / 1000)
        this.addForm.sale_end_time = (newVal[1].getTime() / 1000)
      },
      place (newVal, oldVal) {
        let chkNode = this.$refs.placeCascader.getCheckedNodes()
        this.addForm.province_name = chkNode[0].pathLabels[0]
        this.addForm.city_name = chkNode[0].pathLabels[1]
        this.addForm.area_name = chkNode[0].pathLabels[2]
        this.addForm.town_name = chkNode[0].pathLabels[3]

        this.addForm.province_code = newVal[0]
        this.addForm.city_code = newVal[1]
        this.addForm.area_code = newVal[2]
        this.addForm.town_code = newVal[3]
      }
    },
    created () {
      this.addForm.show_price = 100
      let eTime = 10 * 365 * 24 * 3600 + ((new Date()).getTime() / 1000)
      this.seTime = [new Date(), new Date(eTime * 1000)]
    },
    mounted () {
      this.refresh()
    },
    methods: {
      classify (data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].is_sale) {
            this.skuProperties.push(data[i])
          } else {
            this.cateProperties.push(data[i])
          }
        }
      },
      getRelateProp (cateId) {
        spCateApi.getProp({ cate_id: cateId, is_sale: 0 }, (resp) => {
          this.classify(resp)
          this.selectedPropValueIds = null
          this.selectedPropValueIds = new Array(this.cateProperties.length)
        }, (err) => {
          window.tools.alertError('获取类目属性失败')
        })
      },
      onImgListUploadSuccess (data) {
        this.addForm.img_list = data
      },
      onSmallUploadSuccess (data) {
        this.addForm.small_cover_img = window.tools.getImgUrl(data.path)
      },
      onUploadSuccess (data) {
        this.addForm.cover_img = window.tools.getImgUrl(data.path)
      },
      onPrev () {
        if (this.active == 0) {
          return
        }
        this.active--
      },
      onNext () {
        if (this.active == 3) {
          return
        }
        console.debug(this.addForm)
        // 测试注释掉

        if (this.active > 0) {
          // 检测类目是否选择
          if (parseInt(this.cateId) === 0) {
            window.tools.alertError('请选择类目')
            return
          }
        }
        if (this.active > 1) {
          // 检测发货地是否选择
          if (this.addForm.town_code.length === 0) {
            this.$message.error('请选择发货地')
            return
          }
        }
        this.active++
      },
      onCreate () {

        this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
          confirmButtonText: this.$i18n.t('Confirm'),
          cancelButtonText: this.$i18n.t('Cancel'),
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              this.addForm.show_price = 100 * this.addForm.show_price
              instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
              goodsApi.create(this.addForm, (resp) => {
                window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                instance.confirmButtonLoading = false
                done()
                this.$router.go(-1)
              }, (resp) => {
                done()
                instance.confirmButtonLoading = false
                window.tools.alertError(resp.msg)
              })
            }
          }
        }).then(() => {
        }).catch(() => {
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

        datatreeApi.query({ parent_id: 65 }, (resp) => {
          this.supportServiceOptions = resp.list
        }, (resp) => {
          window.tools.alertError(resp.msg)
          that.loading = false
        })

      }
    }
  }
</script>
