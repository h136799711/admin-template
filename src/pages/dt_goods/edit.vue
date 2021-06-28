<style>
    .blue {
        color: blue;
    }

    .by-img-uploader .avatar-uploader-icon.coverImg, .coverImg {
        width: 160px;
        height: 120px;
        line-height: 120px;
    }
    .by-img-uploader .avatar-uploader-icon.smallCoverImg,
    .smallCoverImg {
        width: 120px;
        height: 120px;
        line-height: 120px;
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
<!--            <el-form-item-->
<!--                    :label="$t('Description')"-->
<!--                    required-->
<!--                    prop="sub_title">-->
<!--                <el-input maxlength="500" size="mini" show-word-limit type="textarea" :rows="5"-->
<!--                          v-model="editForm.description"-->
<!--                          placeholder="商品简介"/>-->
<!--            </el-form-item>-->

            <el-form-item
                    :label="$t('Unit')"
                    required
            >
                <el-input maxlength="8" size="mini" show-word-limit v-model="editForm.unit" placeholder="单位"/>
            </el-form-item>

            <el-form-item
                    :label="$t('Cover')">
                <ImgUploaderV3 show="local" imgCls="coverImg" ref="addImgUploader" @onUploadSuccess="onUploadSuccess"
                                    :defaultImgUrl="editForm.main_image" imgType="goods"/>
                <span>推荐宽高比 4:3</span>
            </el-form-item>
            <el-form-item
                    :label="$t('SmallImage')">
                <ImgUploaderV3 show="local" imgCls="smallCoverImg" ref="addSmallImgUploader" @onUploadSuccess="onSmallUploadSuccess"
                                    :defaultImgUrl="editForm.small_image" imgType="goods"/>
                <span>推荐宽高比 1:1</span>
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
    import ImgUploaderV3 from '../../components/img-uploaderV3.vue'
    import {dbhTool} from '@peter_xiter/dbh-js-tools'
    export default {
        props: {
            id: String
        },
        components: {
            ImgUploaderV3
        },
        data () {
            return {
                editForm: {
                    // stock: 0,
                    // limit_days: 1,
                    // limit_items: 0,
                    title: '',
                    sub_title: '',
                    main_image: '',
                    description: '',
                    display_order: 0,
                    small_image:'',
                    unit: ''
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
                this.editForm.main_image = dbhTool.getImgUrl(data.trim(','))
            },
            onSmallUploadSuccess (data) {
                console.debug("onSmallUploadSuccess", data)
                this.editForm.small_image = dbhTool.getImgUrl(data.trim(','))
            },
            onSave () {
                let that = this
                that.loading = true
                this.editForm.id = this.id
                goodsApi.edit(this.editForm).then(function () {
                    window.dbh.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
                }).finally(function () {
                    that.loading = false;
                    that.back();
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
                this.editForm.small_image = resp.small_image;
                // this.editForm.limit_days = resp.limit_days;
                // this.editForm.limit_items = resp.limit_items;
                this.editForm.unit = resp.unit;
                // this.editForm.stock = parseInt(resp.stock);

                this.loading = false;
            }
        }
    }
</script>
