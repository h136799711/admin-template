<template>
  <div class="main-content by-user-profile padding-md-bottom padding-md-top">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-back"
      @click="$router.replace('/admin/user/index')"
    >
      {{ $t('Back') }}
    </el-button>
    <el-button
      type="primary"
      size="mini"
      :loading="loading"
      icon="el-icon-refresh"
      @click="refresh()"
    >
      {{ $t('Refresh') }}
    </el-button>

    <div class="grid-content margin-md-top">
      <el-form
        ref="form"
        :disabled="loading"
        :model="info"
        label-width="80px"
      >
        <el-form-item label="邀请码">
          {{ info.idcode }}
        </el-form-item>
        <el-form-item label="邀请人ID">
          {{ info.invite_uid }}
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="info.nickname" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio
            v-model="info.sex"
            :label="0"
          >
            女
          </el-radio>
          <el-radio
            v-model="info.sex"
            :label="1"
          >
            男
          </el-radio>
        </el-form-item>
        <el-form-item>
          <ImgUploader
            ref="imgUploader"
            :default-img-url="info.head"
            :clear="imgUploadClear"
            img-type="avatar"
            @onUploadSuccess="onUploadSuccess"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="onSave()"
          >
            {{ $t('Save') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '../../api/userApi'

import ImgUploader from '@/components/img-uploaderV3.vue'

export default {
  components: {
    ImgUploader
  },
  props: {
    id: 0,
  },
  data () {
    return {
      imgUploadClear: false,
      info: {
        userId: 0,
        nickname: '',
        sex: 0,
        head: ''
      },
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.info.user_id = this.id
    this.refresh()
  },
  mounted () {
    console.debug('index mounted')
  },
  methods: {
    onSave () {
      this.loading = true
      api.update(this.info, (resp) => {
        this.loading = false
        this.refresh()
      }, (resp) => {
        window.dbh.alertError(resp)
        this.loading = false
      })
    },
    onUploadSuccess (data) {
      this.info.head = data.trim(',')
      console.debug('image upload success', data)
    },
    refresh () {
      // 刷新当前
      this.loading = true
      api.detail({ user_id: this.id }, (resp) => {
        this.loading = false
        console.log(resp)
        this.info.nickname = resp.nickname
        this.info.head = resp.head
        this.info.sex = resp.sex
        this.info.userId = resp.uid
      }, (resp) => {
        window.dbh.alertError(resp)
        this.loading = false
      })
    }
  }
}
</script>
