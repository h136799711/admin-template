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
      @click="back()"
    >
      {{ $t('Back') }}
    </el-button>

    <el-row
      type="flex"
      class="margin-md-top"
      justify="center"
    >
      <el-col :span="24">
        <el-steps
          :active="active"
          finish-status="success"
        >
          <el-step title="选择类目" />
          <el-step title="商品信息" />
          <el-step title="商品图片" />
        </el-steps>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="24">
        <el-button
          style="margin-top: 12px;"
          size="mini"
          @click="onPrev"
        >
          {{ this.$t('Prev') }}
        </el-button>
        <el-button
          style="margin-top: 12px;"
          size="mini"
          @click="onNext"
        >
          {{ this.$t('Next') }}
        </el-button>
      </el-col>
    </el-row>

    <el-row
      v-if="active == 0"
      type="flex"
      justify="center"
    >
      <el-col
        :span="24"
        class="margin-md-top"
      >
        <el-alert type="warning">
          一个商品只能关联一个类目, 选择后不能再变更，如果以下没有，请到类目中添加
        </el-alert>
        <el-cascader
          v-model="cateId"
          style="width: 320px;"
          :options="cateOptions"
          placeholder="试试搜索：男装"
          filterable
          size="small"
          :props="props"
        />
      </el-col>
    </el-row>
    <div v-if="active == 0">
      <h5 class="margin-md-top">
        类目属性:
      </h5>
      <div
        v-for="(prop, index) in cateProperties"
        :key="prop.id"
      >
        <div class="cate-prop-item margin-md-top">
          <div class="margin-sm-bottom">
            {{ prop.title }}:
          </div>
          <div class="cate-prop-values">
            <el-select
              v-if="prop.prop_type === 'single'"
              v-model="selectedPropValueIds[index]"
              size="mini"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in prop.prop_values"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-if="prop.prop_type === 'multiple'"
              v-model="selectedPropValueIds[index]"
              size="mini"
              multiple
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in prop.prop_values"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <el-form
      v-if="active == 1"
      class="margin-md-top"
      :model="addForm"
      label-position="right"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        :label="$t('Title')"
        required

        prop="title"
      >
        <el-input
          v-model="addForm.title"
          maxlength="50"
          size="mini"
          show-word-limit
          placeholder="商品标题"
        />
      </el-form-item>
      <el-form-item
        :label="$t('SubTitle')"
        required
        prop="sub_title"
      >
        <el-input
          v-model="addForm.sub_title"
          maxlength="500"
          size="mini"
          show-word-limit
          type="textarea"
          :rows="5"
          placeholder="商品子标题简介"
        />
      </el-form-item>
      <el-form-item
        :label="$t('Price')"
        prop="show_price"
      >
        <el-input
          v-model="addForm.show_price"
          type="number"
          size="mini"
          class="number-input"
        />
        {{ $t('Unit.Yuan') }}
      </el-form-item>
      <el-form-item
        :label="$t('Weight')"
        prop="weight"
      >
        <el-input
          v-model="addForm.weight"
          type="number"
          size="mini"
          class="number-input"
        />
        kg/公斤
      </el-form-item>
      <el-form-item
        :label="$t('Volume')"
        prop="volume"
      >
        <el-input
          v-model="addForm.volume"
          type="number"
          size="mini"
          class="number-input"
        />
        cm<sup style="font-size: 10px">3</sup>/立方厘米（不是米）
      </el-form-item>
      <el-form-item
        :label="$t('SaleTime')"
        prop="sale_open_time"
      >
        <el-date-picker
          v-model="seTime"
          size="mini"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item
        :label="$t('Place')"
      >
        <el-cascader
          ref="placeCascader"
          v-model="place"
          style="width: 320px;"
          placeholder=""
          size="small"
          :props="pcaProps"
        />
      </el-form-item>

      <el-form-item
        :label="$t('SupportServices')"
      >
        <el-select
          v-model="supportService"
          size="mini"
          multiple
          placeholder="可选"
        >
          <el-option
            v-for="item in supportServiceOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('Freight')"
      >
        <el-select
          v-model="addForm.freight_type"
          size="mini"
          placeholder="请选择"
        >
          <el-option
            v-for="item in freightOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-form
      v-if="active == 2"
      class="margin-md-top"
      label-position="right"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        :label="$t('Cover')"
      >
        <ImgUploaderV3
          ref="addImgUploader"
          show="all"
          img-cls="coverImg"
          :default-img-url="addForm.cover_img"
          img-type="goods"
          @onUploadSuccess="onUploadSuccess"
        />
      </el-form-item>
      <el-form-item
        :label="$t('SmallCover')"
      >
        <ImgUploaderV3
          ref="smallImgUploader"
          show="all"
          img-cls="coverImg"
          :default-img-url="addForm.small_cover_img"
          img-type="goods"
          @onUploadSuccess="onSmallUploadSuccess"
        />
      </el-form-item>
      <el-form-item
        :label="$t('Image')"
      >
        <ImgUploaderV3
          ref="imgListUploader"
          :items="3"
          show="all"
          img-cls="imgList"
          :default-img-url="addForm.img_list"
          img-type="goods"
          @onUploadSuccess="onImgListUploadSuccess"
        />
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

import ImgUploaderV3 from '../../../src/components/img-uploaderV3'
import datatreeApi from '../../api/datatreeApi'

export default {
  components: {
    ImgUploaderV3
  },
  data () {
    return {
      selectedPropValueIds: [],
      cateProperties: [],
      skuProperties: [],
      supportServiceOptions: [], // 商品支持服务选项
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
              pcaApi.query({country_id: 1, page_size: 5000}, function (resp) {
                let nodes = resp.list.map(item => ({
                  value: item.code,
                  label: item.name,
                  leaf: false
                }))
                resolve(nodes)
              })
              break
            case 1:
              pcaApi.queryCity({ code: value, page_size: 5000 }, function (resp) {
                let nodes = resp.list.map(item => ({
                  value: item.code,
                  label: item.name,
                  leaf: false
                }))
                resolve(nodes)
              })
              break
            case 2:
              pcaApi.queryArea({ code: value, page_size: 5000 }, function (resp) {
                let nodes = resp.list.map(item => ({
                  value: item.code,
                  label: item.name,
                  leaf: false
                }))
                resolve(nodes)
              })
              break
            case 3:
              pcaApi.queryTown({ 'code': value, page_size: 5000 }, function (resp) {
                let nodes = resp.list.map(item => ({
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
        weight: 0,
        volume: 0,
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
    back () {
      this.$router.go(-1)
    },
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
      this.cateProperties = [];
      this.skuProperties = [];
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
        console.debug('Cate', this.cateProperties, this.skuProperties, resp)
        this.selectedPropValueIds = new Array(this.cateProperties.length)
      }, (err) => {
        window.dbh.alertError('获取类目属性失败')
      })
    },
    onImgListUploadSuccess (data) {
      this.addForm.img_list = data
    },
    onSmallUploadSuccess (data) {
      this.addForm.small_cover_img = data.trim(',')
    },
    onUploadSuccess (data) {
      this.addForm.cover_img = data.trim(',')
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

      if (this.active >= 0) {
        // 检测类目是否选择
        if (parseInt(this.cateId) === 0) {
          window.dbh.alertError('请选择类目')
          return
        }
      }
      if (this.active >= 1) {
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
            this.addForm.show_price = (100 * this.addForm.show_price).toFixed(2);
            instance.confirmButtonText = window.dbh.vue_instance.$i18n.t('Processing').value
            console.debug("保存内容", this.addForm);

            goodsApi.create(this.addForm, (resp) => {
              done()
              instance.confirmButtonLoading = false
              this.$router.push('/admin/goods/index')
            }, (resp) => {
              done()
              instance.confirmButtonLoading = false
              window.dbh.alertError(resp.msg)
            })
          } else {
            done()
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
        window.dbh.alertError(resp.msg)
        that.loading = false
      })

      datatreeApi.query({ parent_id: 65 }, (resp) => {
        this.supportServiceOptions = resp.list
      }, (resp) => {
        window.dbh.alertError(resp.msg)
        that.loading = false
      })
    }
  }
}
</script>
