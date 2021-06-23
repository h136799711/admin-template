<style>
    .avatar-uploader {
        margin: 0 auto;
        width: 200px;
    }
    .by-avatar .by-img-uploader .img-uploader-container{
        text-align: center;
    }
</style>
<template>
    <div class="main-content by-avatar padding-md-bottom padding-md-top">
        <div class="help-block">
            <el-alert
                    title="上传头像文件不要超过500KB"
                    type="info">
            </el-alert>
        </div>
        <div class="avatar-uploader margin-md-top">
            <div class="margin-md-bottom" style="padding: 0px 6px;">
                <el-input type="text" id="nickname" name="nickname" size="mini" placeholder="昵称"
                          v-model="editForm.nickname"/>
            </div>
            <ImgUploader
                    ref="editImgUploader"
                    :default-img-url="editForm.head"
                    img-type="avatar"
                    @onUploadSuccess="onUploadSuccess"
            />
            <div class="text-center">
                <el-button
                        type="primary"
                        size="mini"
                        :loading="loading"
                        @click="save()"
                >
                    {{ $t('Save') }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import userApi from '../../api/userApi'
    import ImgUploader from '../../components/img-uploaderV3.vue'

    export default {
        components: {
            ImgUploader
        },
        data () {
            return {
                editForm: {
                    nickname: '',
                    head: ''
                },
                loading: false
            }
        },
        computed: {
            userSessionData () {
                return this.$store.getters.userSessionData
            },
        },
        watch: {},
        created () {
            this.editForm.head = tools.getAvatar()
            this.editForm.nickname = tools.getNick()
        },
        mounted: function () {
        },
        methods: {
            onUploadSuccess (data) {
                this.editForm.head = data.trim(',');
                console.debug('image upload success', this.editForm.head)
            },
            save () {
                this.loading = true
                userApi.updateNicknameHead(this.editForm, (suc) => {
                    this.loading = false
                    tools.setAvatar(this.editForm.head)
                    tools.setNick(this.editForm.nickname)
                    this.$store.dispatch('updateNicknameHead', {
                        head: this.editForm.head,
                        nickname: this.editForm.nickname
                    })

                    window.tools.alertSuc('操作成功')
                }, (err) => {
                    this.loading = false
                    window.tools.alertError(err)
                })
            }
        }
    }
</script>
