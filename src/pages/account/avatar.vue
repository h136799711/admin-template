<style>
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
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
<template>
    <div class="main-content by-policy padding-md-bottom padding-md-top">
        <div >
                <el-upload
                        class="avatar-uploader"
                        :action="avatarUploadUrl"
                        :show-file-list="true"
                        :on-success="handleAvatarSuccess"
                        drag=""
                        :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">{{$t('Drag')}}&nbsp;{{$t('File')}}，{{$t('Or')}}&nbsp;<em>{{$t('Click')}}&nbsp;{{$t('Upload')}}</em></div>
                    <div class="el-upload__tip" slot="tip">{{$t('FileTypeLimitJpg')}}，{{$t('FileSizeLimit2MB')}}</div>
                </el-upload>

                <el-button :loading="loading" type="primary" @click="submitForm()"  size="mini" icon="by-icon by-Icon-baocun">{{ $t('Save') }}</el-button>
        </div>

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
			this.avatarUploadUrl = window.tools.getAvatarUrl()
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
            submitForm() {
                // api.upload (this.editForm, (resp) => {
                //     this.loading = false
                //     this.$router.push('/logout')
                //
                // }, (resp) => {
                //     window.tools.alertError (resp.msg)
                //     this.loading = false
                // })
            }
		}
	}
</script>
