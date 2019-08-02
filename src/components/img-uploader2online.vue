<style>
    .by-img-uploader .photo {
        width: 120px;
    }

    .by-img-uploader .img-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        line-height: 0px;
        position: relative;
        overflow: hidden;
    }

    .by-img-uploader .img-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .by-img-uploader .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .by-img-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .by-img-uploader .preview-img {
        width: 178px;
        height: 178px;
        display: block;
    }

    .by-img-uploader .uploadedimg {
        padding: 5px;
        border: 1px solid #666666;
    }

    .by-img-uploader .uploadedimg .el-image.actived {
        border: 5px solid rgb(148, 63, 63);
    }

    .by-img-uploader .uploadedimg .el-image {
        border: 1px solid #777777;
        margin-right: 5px;
    }
</style>
<template>
    <div class="by-img-uploader ">
        <el-radio v-if="show === 'remote' || show === 'all'" v-model="sourceType" label="0">网络图片</el-radio>
        <el-radio v-if="show === 'local' || show === 'all'" v-model="sourceType" label="1">本地上传</el-radio>
        <el-radio v-if="show === 'local' || show === 'all'" @change="sourceTypeChange" v-model="sourceType" label="2">
            线上图片
        </el-radio>
        <div class="uploadedimg" v-if="sourceType === '2' " :loading="loadingUploadedImgs">
            <!-- 线上图片 -->
            <span v-for="img in uploadedImgs">
                    <el-image
                            :class="(chooseImgId == img.id) ? 'actived':''"
                            @click="choose(img)"
                            style="cursor:pointer;width: 80px; height: 100px"
                            :src="img.url"
                            fit="fill" lazy></el-image>
                </span>
            <div class="text-center">
                <el-pagination
                        :current-page="pageIndex"
                        :page-sizes="[6]"
                        layout="total, prev, pager, next, jumper"
                        :total="count"
                        @current-change="byPagerCurrentChange"/>
            </div>
        </div>
        <el-upload
                v-if="sourceType === '1'"
                class="img-uploader"
                name="image"
                :data="extraData"
                :action="avatarUploadUrl"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeUpload">
            <img v-if="imageUrl" :src="imageUrl" :class="imgCls">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-input v-model="imageUrl" v-if="sourceType === '0' "/>
        <img :src="imageUrl" @load="remoteUrlLoad" v-if="sourceType === '0' && imageUrl " class="preview-img"/>
    </div>
</template>

<script>
  import fileApi from '../api/fileApi'

  export default {
    props: {
      imgCls: {
        type: String,
        default () {
          return 'avatar'
        }
      },
      defaultImgUrl: String,
      show: String,// remote , local, uploaded, all
      imgType: String,
      clear: Boolean
    },
    data () {
      return {
        chooseImgId: 0,
        loadingUploadedImgs: false,
        date: '',
        pageIndex: 0,
        count: 0,
        uploadedImgs: [],
        imageUrl: '',
        sourceType: '1',
        avatarUploadUrl: '',
        extraData: { 't': 'other' },
      }
    },
    computed: {},
    watch: {
      clear (newVal, oldVal) {
        if (newVal) {
          this.imageUrl = ''
        }
      },
      defaultImgUrl (newVal) {
        this.imageUrl = this.defaultImgUrl
      },
      imageUrl (newVal) {
        if (newVal.length === '') {
          this.imageUrl = this.defaultImgUrl
        }
      }
    },
    mounted () {
      console.debug('img uploader mounted')
    },
    created () {
      console.debug('img uploader created')
      this.extraData.t = this.imgType
      this.avatarUploadUrl = window.tools.getAvatarUploadUrl()
      this.extraData.uid = window.tools.getUID()
      this.extraData.sid = window.tools.getSessionId()
      this.extraData.deviceType = window.tools.getDeviceType()
      this.imageUrl = this.defaultImgUrl
    },
    methods: {
      choose (img) {
        this.chooseImgId = img.id
        this.$emit('onUploadSuccess', { h: img.h, w: img.w, path: img.url })
      },
      sourceTypeChange (val) {
        console.debug('source type', val)
        if (val == 2) {
          this.queryUploaded()
        }
      },
      getImgUrl (relativePath) {

      },
      byPagerCurrentChange (val) {
        this.pageIndex = val
        this.queryUploaded()
      },
      queryUploaded () {
        this.loadingUploadedImgs = true
        let promise = fileApi.query(this.date, this.pageIndex - 1 > 0 ? this.pageIndex - 1 : 0, 6)
        console.debug('promise', promise)
        promise.then(({ data }) => {
          console.log(data)
          if (data.code === 0) {
            this.uploadedImgs = data.data.list
            this.count = parseInt(data.data.count)
          } else {
            window.tools.alertError(data.msg)
          }
        }).catch((reason) => {
          window.tools.alertError(reason)
        }).finally(() => {
          this.loadingUploadedImgs = false
        })
      },
      getImage (uri) {
        if (uri.length === 0) return false
        if (!_.startsWith(uri, 'http')) {
          uri = window.tools.getApiUrl() + uri
        }
        return uri
      },
      remoteUrlLoad (res) {
        console.debug(res)
        this.$emit('onUploadSuccess', { h: 0, w: 0, path: getImage(this.imageUrl) })
      },
      handleSuccess (res, file) {
        if (parseInt(res.code) === 0) {
          this.$emit('onUploadSuccess', { h: res.data.h, w: res.data.w, path: res.data.relative_path })
          this.imageUrl = URL.createObjectURL(file.raw)
        } else {
          this.$message.error(res.msg)
        }
      },
      beforeUpload (file) {
        const isJPGOrPng = (file.type === 'image/jpeg' || file.type === 'image/png')
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPGOrPng) {
          this.$message.error(this.$i18n.t('FileTypeLimitJpgPng'))
        }
        if (!isLt2M) {
          this.$message.error(this.$i18n.t('FileSizeLimit2MB'))
        }
        return isJPGOrPng && isLt2M
      },
    },
    name: 'uploader2online'
  }
</script>

<style scoped>

</style>
