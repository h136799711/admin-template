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

    <el-form
      v-if="active == 0"
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
          maxlength="60"
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
          maxlength="250"
          size="mini"
          show-word-limit
          placeholder="商品子标题"
        />
      </el-form-item>
      <el-form-item
        :label="$t('Description')"
        required
        prop="sub_title"
      >
        <el-input
          v-model="addForm.description"
          maxlength="500"
          size="mini"
          show-word-limit
          type="textarea"
          :rows="5"
          placeholder="商品简介"
        />
      </el-form-item>
      <el-form-item
        :label="$t('Cover')"
      >
        <ImgUploader2online
          ref="addImgUploader"
          show="local"
          img-cls="coverImg"
          :default-img-url="addForm.main_image"
          img-type="goods"
          @onUploadSuccess="onUploadSuccess"
        />
      </el-form-item>
      <el-form-item
        :label="$t('DisplayOrder')"
      >
        <el-input
          v-model="addForm.display_order"
          size="mini"
          placeholder="商品排序序号"
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
import goodsApi from '../../api/dtGoodsApi'

import ImgUploader2online from '@/components/img-uploader2online.vue'

export default {
  components: {
    ImgUploader2online
  },
  data () {
    return {
      skuProperties: [],
      active: 0, // 当前步骤
      cateOptions: [],
      addForm: {
        title: '',
        sub_title: '',
        main_image: '',
        description: '',
        display_order: 0
      },
      rules: {
        title: [
          { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
          { min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ]
      },
      count: 0,
      loading: false
    }
  },
  computed: {},
  watch: {
  },
  created () {
  },
  mounted () {
    this.refresh()
  },
  methods: {
    back () {
      this.$router.replace({ path: '/admin/dt_goods/index' })
    },
    onUploadSuccess (data) {
      console.debug('onUploadSuccess', data)
      this.addForm.main_image = window.tools.getImgUrl(data.path)
    },
    onCreate () {
      let that = this
      that.loading = true
      goodsApi.create(this.addForm).then(function () {
        window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
      }).finally(function () {
        setTimeout(function () {
          that.loading = false
          that.back()
        }, 1500)
      })
    },
    refresh () {
      // 刷新当前
    }
  }
}
</script>
