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

    .by-goods-edit .cate-prop-item {
        width: 30%;
        float: left;
    }
</style>
<template>
  <div class="main-content by-goods-edit padding-md-bottom padding-md-top">
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
          <el-step title="编辑属性" />
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
          v-if="active == 2"
          style="margin-top: 12px;"
          size="mini"
          @click="onSave"
        >
          {{ $t('Confirm') }}
        </el-button>
        <el-button
          v-else
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
          一个商品只能关联一个类目, 选择后不能再编辑, 如果要更改请重新添加商品
        </el-alert>
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
        />
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
        <ImgUploader2online
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
        <ImgUploader2online
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
          :edit-mode="true"
          :page-size="12"
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
          @click="onSave()"
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

import ImgUploader2online from '@/components/img-uploader2online.vue'
import ImgUploaderV3 from '../../../src/components/img-uploaderV3'
import datatreeApi from '../../api/datatreeApi'

export default {
  components: {
    ImgUploaderV3,
    ImgUploader2online
  },
  props: {
    id: String
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
      props: {
        multiple: false,
        value: 'id',
        label: 'title',
        children: 'children'
      },
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
        cate_id: 0
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
    supportService (newVal) {
      this.addForm.support_services = newVal.join(',')
    },
    seTime (newVal, oldVal) {
      this.addForm.sale_open_time = (newVal[0].getTime() / 1000)
      this.addForm.sale_end_time = (newVal[1].getTime() / 1000)
    }
  },
  created () {
    let eTime = 10 * 365 * 24 * 3600 + ((new Date()).getTime() / 1000)
    this.seTime = [new Date(), new Date(eTime * 1000)]
  },
  mounted () {
    this.refresh()
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    classify (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].is_sale) {
          this.skuProperties.push(data[i])
        } else {
          this.cateProperties.push(data[i])
        }
      }
    },
    getRelateProp (cateId, propValues) {
      let that = this

      spCateApi.getProp({ cate_id: cateId, is_sale: 0 }, (resp) => {
        this.classify(resp)
        this.selectedPropValueIds = null
        this.selectedPropValueIds = new Array(this.cateProperties.length)
        for (let i = 0; i < that.cateProperties.length; i++) {
          for (let k = 0; k < that.cateProperties[i].prop_values.length; k++) {
            for (let j = 0; j < propValues.length; j++) {
              if (parseInt(that.cateProperties[i].prop_values[k].id) === propValues[j]) {
                that.selectedPropValueIds[i] = propValues[j]
              }
            }
          }
        }
      }, (err) => {
        window.tools.alertError('获取类目属性失败')
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
      if (this.active == 2) {
        return
      }

      this.active++
    },
    onSave () {
      this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
        confirmButtonText: this.$i18n.t('Confirm'),
        cancelButtonText: this.$i18n.t('Cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.addForm.show_price = 100 * this.addForm.show_price
            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
            this.addForm.id = this.id
            goodsApi.update(this.addForm, (resp) => {
              window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
              instance.confirmButtonLoading = false
              done()
              this.$router.go(-1)
            }, (resp) => {
              done()
              instance.confirmButtonLoading = false
              window.tools.alertError(resp.msg)
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

      datatreeApi.query({ parent_id: 65 }, (resp) => {
        this.supportServiceOptions = resp.list
        this.loading = false
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
      })
      goodsApi.info({ id: this.id }, (resp) => {
        that.addForm.title = resp.title
        that.addForm.show_price = (resp.show_price / 100).toFixed(2)
        that.addForm.sub_title = resp.sub_title
        that.seTime = [new Date(resp.sale_open_time * 1000), new Date(resp.sale_end_time * 1000)]
        that.addForm.small_cover_img = resp.small_cover_img
        that.addForm.cover_img = resp.cover_img
        that.support_services = resp.support_services
        that.addForm.cate_id = resp.cate_id
        that.addForm.img_list = resp.img_list
        that.supportService = resp.support_service
        that.getRelateProp(that.addForm.cate_id, resp.prop_values.map(item => {
          return parseInt(item.id)
        }))
        this.loading = false
      }, (resp) => {
        window.tools.alertError(resp.msg)
        that.loading = false
      })
    }
  }
}
</script>
