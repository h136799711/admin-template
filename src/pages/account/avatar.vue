<style>
    .avatar-uploader {
        text-align: center;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
        margin: auto;
    }
    .by-avatar .update-avatar {
        margin: 0 auto;
        display: block;
    }
</style>
<template>
    <div class="main-content by-avatar padding-md-bottom padding-md-top">
            <el-row type="flex" >
                <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="12">
                    <el-upload
                            class="avatar-uploader"
                            ref="uploader"
                            name="image"
                            :data="extraData"
                            :action="avatarUploadUrl"
                            :show-file-list="true"
                            :on-success="handleAvatarSuccess"
                            drag=""
                            :auto-upload="false"
                            :before-upload="beforeAvatarUpload">
                        <img :src="imageUrl" class="avatar">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">{{$t('Drag')}}&nbsp;{{$t('File')}}，{{$t('Or')}}&nbsp;<em>{{$t('Click')}}&nbsp;{{$t('Upload')}}</em></div>
                        <div class="el-upload__tip" slot="tip">{{$t('FileTypeLimitJpg')}}，{{$t('FileSizeLimit2MB')}}</div>
                    </el-upload>

                    <el-button class="update-avatar" :loading="loading" type="primary" @click="submitUpload()"  size="mini" icon="by-icon by-Icon-baocun">{{ $t('Save') }}</el-button>
                </el-col>
                <el-col :span="3"><div class="grid-content bg-purple"></div></el-col>

            </el-row>
    </div>
</template>

<script>
	import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
	import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

	export default {
		components: {
			ElForm,
			ElButton
		},
		data() {
			return {
                extraData: {'t': 'avatar'},
				avatarUploadUrl: '',
				imageUrl: '',
                rules: {
                },
				loading: false,
			}
		},
		computed: {
        },
		watch: {},
		created() {
            this.avatarUploadUrl = window.tools.getAvatarUploadUrl()
            this.extraData.uid = window.tools.getUID()
            this.extraData.sid = window.tools.getSessionId()
            this.extraData.deviceType = window.tools.getDeviceType()
            this.imageUrl = 'https://image.hebidu.cn/uploads/avatar/' + window.tools.getUID() + '/avatar.png'
		},
		mounted: function () {
		},
		methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error(this.$i18n.t('FileTypeLimitJpg'));
                }
                if (!isLt2M) {
                    this.$message.error(this.$i18n.t('FileSizeLimit2MB'));
                }
                return isJPG && isLt2M;
            },
            submitUpload() {
                this.$refs.uploader.submit();
            }
		}
	}
</script>
