<style>
    .blue {
        color: blue;
    }

    .img-uploader .coverImg, .uploadedimg .coverImg {
        width: 200px;
        height: 150px;
    }

    .img-uploader-container .imgList {
        width: 160px;
        height: 120px;
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
                @click="back()">
            {{ $t('Back')}}
        </el-button>

        <el-form
                class="margin-md-top"
                :model="editForm"
                label-position="right"
                :rules="rules"
                label-width="100px"
        >
            <el-form-item
                    :label="$t('Title')"
                    required
                    prop="title">
                <el-input maxlength="60" size="mini" show-word-limit v-model="editForm.title" placeholder="商品标题"/>
            </el-form-item>
            <el-form-item
                    :label="$t('SubTitle')"
                    required
                    prop="sub_title">
                <el-input maxlength="250" size="mini" show-word-limit  v-model="editForm.sub_title" placeholder="商品子标题"/>
            </el-form-item>
            <el-form-item
                    :label="$t('Description')"
                    required
                    prop="sub_title">
                <el-input maxlength="500" size="mini" show-word-limit type="textarea" :rows="5"
                          v-model="editForm.description"
                          placeholder="商品简介"/>
            </el-form-item>
            <el-form-item
                    :label="$t('Cover')">
                <ImgUploader2online show="local" imgCls="coverImg" ref="addImgUploader" @onUploadSuccess="onUploadSuccess"
                                    :defaultImgUrl="editForm.main_image" imgType="goods"/>
            </el-form-item>
            <el-form-item
                    :label="$t('DisplayOrder')">
                <el-input  size="mini"  v-model="editForm.display_order" placeholder="商品排序序号"/>
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
    import goodsApi from '../../api/dtGoodsApi'



    import ImgUploader2online from '@/components/img-uploader2online.vue'

    export default {
        props: {
            id: String
        },
        components: {
            ImgUploader2online
        },
        data () {
            return {
                editForm: {
                    title: '',
                    sub_title: '',
                    main_image: '',
                    description: '',
                    display_order: 0,
                },
                rules: {
                    title: [
                        { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
                        { min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ]
                },
                count: 0,
                loading: false,
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
                this.$router.replace({ path: '/admin/dt_goods/index'})
            },
            onUploadSuccess (data) {
                console.debug("onUploadSuccess", data)
                this.editForm.main_image = window.tools.getImgUrl(data.path)
            },
            onSave () {
                let that = this
                that.loading = true
                this.editForm.id = this.id
                goodsApi.edit(this.editForm).then(function () {
                    window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                }).finally(function () {
                    setTimeout(function () {
                        that.loading = false
                        that.back()
                    }, 1500)
                })
            },
            async refresh () {
                // 刷新当前
                // let that = this
                this.loading = true;
                let resp = await goodsApi.info({id: this.id});
                console.debug(resp)
                this.editForm.title = resp.title;
                this.editForm.sub_title = resp.sub_title;
                this.editForm.description = resp.description;
                this.editForm.main_image = resp.main_image;
                this.editForm.display_order = resp.display_order;
                this.loading = false;
            }
        }
    }
</script>
