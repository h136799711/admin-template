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

    .by-img-uploader .img-uploader-container {
        text-align: left;
    }

    .by-img-uploader .img-uploader-container .img-item {
        position: relative;
        display: inline-block;
        cursor: pointer;
        margin: 0 auto;
    }

    .by-img-uploader .img-uploader-container .remove {
        position: absolute;
        top: 5px;
        right: -5px;
        font-size: 25px;
        color: red;
        background: #FFF;
    }
</style>
<template>
    <div class="by-img-uploader ">
        <el-radio v-if="show === 'remote' || show === 'all'" v-model="sourceType" label="0">网络图片</el-radio>
        <el-radio v-if="show === 'local' || show === 'all'" v-model="sourceType" label="1">本地上传</el-radio>
        <el-radio v-if="show === 'local' || show === 'all'" @change="sourceTypeChange" v-model="sourceType" label="2">
            线上图片
        </el-radio>

        <!-- 线上图片 -->
        <div class="uploadedimg" v-if="sourceType === '2' ">
            <div class="margin-sm-bottom">
                上传日期
                <el-date-picker
                        v-model="date"
                        format="YYYY-MM-DD"
                        :editable="false"
                        type="date"
                        :placeholder="$t('Date')">
                </el-date-picker>
                <el-button @click="queryUploaded">
                    {{$t('Search')}}
                </el-button>
            </div>
            <el-alert v-if="editMode" class="margin-sm-bottom "
                      type="info">
                如果提示最多选n张图片, 请选择本地上传并移除掉已选择的图片, 再到线上图片进行选择即可
            </el-alert>
            <span class="el-icon-loading" v-if="loadingUploadedImgs"></span>
            <span v-if="!loadingUploadedImgs && uploadedImgs.length === 0">
                {{date && date.format('yyyy-MM-dd')}} 没有图片上传
            </span>
            <span v-else v-for="img in uploadedImgs">
                    <el-image
                            :class="(imageUrlArr.indexOf(img.url) !== -1) ? 'actived':''"
                            @click="choose(img)"
                            style="cursor:pointer;width: 80px; height: 100px"
                            :src="img.url.removeSchema()"
                            fit="fill" lazy></el-image>
                </span>
            <div class="text-center">
                <el-pagination
                        :current-page="pageIndex"
                        :page-sizes="[pageSize]"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="count"
                        @current-change="byPagerCurrentChange"/>
            </div>
        </div>
        <!-- 线上图片 END -->

        <!-- 本地上传图片 -->
        <div v-if="sourceType === '1'" class="img-uploader-container">
        <span v-for="src in imageUrlArr " class="img-item">
            <img :src="src" :class="imgCls">
            <span @click="removeUploadImg(src)" title="移除该图片" class="el-icon-delete remove"></span>
        </span>
            <el-upload
                    class="img-uploader"
                    name="image"
                    :data="extraData"
                    :action="uploadApiUrl"
                    :show-file-list="false"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload">
                <i :class="imgCls" v-if="this.imageUrlArr.length < this.items" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
        <!-- 本地上传图片 END-->

        <!-- 互联网图片 图片地址,多个逗号隔开 START-->
        <el-input @change="inputRemoteImgs" v-model="imageUrl" v-if="sourceType === '0' "/>
        <span v-for="src in imageUrlArr ">
            <img :src="src" v-if="sourceType === '0'" class="preview-img"/>
        </span>

        <!-- 互联网图片 END-->
    </div>
</template>

<script>
    import fileApi from '../api/fileApi'

    export default {
        emits: ['onUploadSuccess'],
        props: {
            pageSize: {
                type: Number,
                default () {
                    return 6
                }
            },
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
            editMode: {
                type: Boolean,
                default () {
                    return false
                }
            },
            oss_type: {
                type: String,
                default () {
                    // ali,qiniu
                    return 'qiniu'
                }
            },
            defaultImgUrl: String,
            show: String,// remote , local, uploaded, all
            imgType: {
                type: String,
                default () {

                    return 'other'
                }
            },
            clear: {
                type: Boolean,
                default () {

                    return false
                }
            },
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
                uploadApiUrl: '',
                tmpLastImageUrl: '',
                extraData: { 't': 'other' },
            }
        },
        computed: {
            imageUrlArr () {
                return this.imageUrl.split(',').filter(function (item) {
                    return item && item.length > 0
                })
            },
            defaultImgUrl (newVal, oldVal) {
                console.debug('默认图片', newVal)
                this.imageUrl = this.defaultImgUrl;
            }
        },
        watch: {
            imageUrl (newVal, oldVal) {
                console.debug('当前选择值', newVal)
                if (newVal.length > 0) {
                    let start = newVal.length - 1
                    if (newVal.substr(start, 1) !== ',') {
                        this.imageUrl = this.imageUrl + ','
                    }
                }
            }
        },
        mounted () {
        },
        created () {
            this.extraData.t = this.imgType
            this.uploadApiUrl = window.tools.getAvatarUploadUrl() + '/v2/upload';
            this.extraData.uid = window.tools.getUID()
            this.extraData.jwt = window.tools.getJwt();
            this.extraData.oss_type = this.oss_type
            if (this.defaultImgUrl) {
                this.imageUrl = this.defaultImgUrl
            }
        },
        methods: {
            removeUploadImg (url) {
                if (this.imageUrl.indexOf(url + ',') !== -1) {
                    this.imageUrl = this.imageUrl.replace(url + ',', '')
                }
                console.debug('remove', url, this.imageUrl)
            },
            inputRemoteImgs () {
                this.$emit('onUploadSuccess', this.imageUrl)
            },

            pushChooseImageId (url) {
                console.debug('选择的图片', url)
                if (url.length === 0) {
                    console.debug('error')
                    return
                }
                if (this.imageUrl.indexOf(url + ',') !== -1) {
                    this.imageUrl = this.imageUrl.replace(url + ',', '')
                    console.debug('REPLACE', this.imageUrl, url)
                    return
                }
                console.debug('APPEND', this.imageUrl, url)
                if (this.imageUrlArr.length >= this.items) {
                    // 限制数量
                    this.$message.error('最多选' + this.items + '张图片')
                    return
                }
                this.imageUrl = this.imageUrl + url + ','
                console.debug('imageUrl', this.imageUrl)
            },
            choose (img) {
                this.pushChooseImageId(img.url)
                this.$emit('onUploadSuccess', this.imageUrl)
            },
            sourceTypeChange (val) {
                console.debug('source type', val)
                if (parseInt(val) === 2) {
                    // 如果线上则清除
                    this.tmpLastImageUrl = this.imageUrl;
                    this.imageUrl = ''
                    this.queryUploaded()
                } else {
                    if (this.imageUrl.length === 0) {
                        this.imageUrl = this.tmpLastImageUrl;
                    }
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
                let qDate = ''

                if (this.date instanceof Date) {
                    qDate = this.date.format('yyyy-MM-dd')
                }
                let promise = fileApi.query(qDate, this.pageIndex - 1 > 0 ? this.pageIndex - 1 : 0, this.pageSize)
                let that = this

                promise.then(({ data }) => {
                    console.log(data)
                    if (data.code === 0) {
                        that.uploadedImgs = data.data.list

                        that.count = parseInt(data.data.count)
                    } else {
                        window.tools.alertError(data.msg)
                    }
                }).catch((reason) => {
                    window.tools.alertError(reason)
                }).finally(() => {
                    console.debug('finally')
                    that.loadingUploadedImgs = false
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
                    console.debug('上传图片', res.data)
                    if (res.data.oss_key.length > 0) {
                        this.pushChooseImageId(res.data.oss_key)
                    } else {
                        this.pushChooseImageId(res.data.relative_path)
                    }
                    this.$emit('onUploadSuccess', this.imageUrl)
                } else {
                    this.$message.error(res.msg)
                }
            },
            beforeUpload (file) {
                const isJPGOrPng = (file.type === 'image/jpeg' || file.type === 'image/png')
                const isLt2M = file.size / 1024 / 1024 < 2
                if (this.imageUrlArr.length >= this.items) {
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
