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
        float: left;
        margin-right: 10px;
        margin-top: 5px;
    }

    .by-img-uploader .uploadedimg {
        padding: 5px;
        border: 1px solid #666666;
        text-align: center;
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
            <div>
                <el-date-picker
                        v-model="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        align="left"
                        :editable="false"
                        type="date"
                        :placeholder="$t('Date')">
                </el-date-picker>
                <el-button @click="queryUploaded">
                    {{$t('Search')}}
                </el-button>
            </div>
            <!-- 线上图片 -->
            <span v-for="img in uploadedImgs">
                    <el-image
                            :class="(chooseImgId.indexOf(img.id + ',') !== -1) ? 'actived':''"
                            @click="choose(img)"
                            style="cursor:pointer;width: 80px; height: 100px"
                            :src="img.url"
                            fit="fill" lazy></el-image>
                </span>
            <div class="text-center">
                <el-pagination
                        :current-page="pageIndex"
                        :page-sizes="[6]"
                        :page-size="6"
                        layout="total, prev, pager, next, jumper"
                        :total="count"
                        @current-change="byPagerCurrentChange"/>
            </div>
        </div>

        <div v-if="sourceType === '1'" class="img-uploader-container">
        <span v-for="src in imageUrlArr ">
            <img :src="src" :class="imgCls">
        </span>
            <el-upload
                    class="img-uploader"
                    name="image"
                    :data="extraData"
                    :action="avatarUploadUrl"
                    :show-file-list="false"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload">
                <i v-if="this.choosedImgPaths.length < this.items" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
        <el-input @change="inputRemoteImgs" v-model="imageUrl" v-if="sourceType === '0' "/>
        <span v-for="src in imageUrlArr ">
            <img :src="src" v-if="sourceType === '0'" class="preview-img"/>
        </span>
    </div>
</template>

<script>
  import fileApi from '../api/fileApi'

  export default {
    props: {
      items: {
        type: Number,
        default () {
          return 1
        }
      },
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
        chooseImgId: '',
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
    computed: {
      imageUrlArr () {
        return this.imageUrl.split(',').filter(function (item) {
          return item && item.length > 0
        })
      },
      choosedImgPaths () {
        let imgArr = this.imageUrl.split(',').filter(function (item) {
          return item && item.length > 0
        })
        return imgArr
      }
    },
    watch: {
      clear (newVal, oldVal) {
        if (newVal) {
          // this.imageUrl = ''
        }
      },
      defaultImgUrl (newVal) {
        this.imageUrl = this.defaultImgUrl
      },
      imageUrl (newVal) {
        console.log('image url', newVal)
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
      inputRemoteImgs () {
        this.$emit('onUploadSuccess', this.imageUrl)
      },
      appendImageUrl (url) {
        if (this.imageUrl.indexOf(url + ',') !== -1) {
          this.imageUrl.replace(url + ',', '')
          return
        }
        this.imageUrl = this.imageUrl + url + ','
      },
      pushChooseImageId (img) {
        console.debug(this.imageUrl, this.chooseImgId, img.id, this.chooseImgId.indexOf(img.id + ','))
        if (this.chooseImgId.indexOf(img.id + ',') !== -1) {
          this.chooseImgId = this.chooseImgId.replace(img.id + ',', '')
          this.imageUrl = this.imageUrl.replace(img.url + ',', '')
          return
        }
        if (this.choosedImgPaths.length >= this.items) {
          // 限制数量
          this.$message.error('最多选' + this.items + '张图片')
          return
        }
        this.chooseImgId = this.chooseImgId + img.id + ','
        this.imageUrl = this.imageUrl + img.url + ','
        console.debug('url => ', this.imageUrl)
      },
      choose (img) {
        this.pushChooseImageId(img)
        this.$emit('onUploadSuccess', this.imageUrl)
      },
      sourceTypeChange (val) {
        console.debug('source type', val)
        if (parseInt(val) === 2) {
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
        if (!this.date) {
          this.date = ''
        }
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
      handleSuccess (res, file) {
        if (parseInt(res.code) === 0) {
          this.appendImageUrl(res.data.relative_path)
          this.$emit('onUploadSuccess', this.imageUrl)
        } else {
          this.$message.error(res.msg)
        }
      },
      beforeUpload (file) {
        const isJPGOrPng = (file.type === 'image/jpeg' || file.type === 'image/png')
        const isLt2M = file.size / 1024 / 1024 < 2
        if (this.choosedImgPaths.length >= this.items) {
          this.$message.error('最多传' + this.items + '张图片')
          return false
        }
        if (!isJPGOrPng) {
          this.$message.error(this.$i18n.t('FileTypeLimitJpgPng'))
        }
        if (!isLt2M) {
          this.$message.error(this.$i18n.t('FileSizeLimit2MB'))
        }
        return isJPGOrPng && isLt2M
      },
    },
    name: 'uploaderV3'
  }
</script>

<style scoped>

</style>
