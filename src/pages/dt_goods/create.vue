<style>

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
                @click="back()">
            {{ $t('Back')}}
        </el-button>

        <el-form
                class="margin-md-top"
                v-if="active == 0"
                :model="addForm"
                label-position="right"
                :rules="rules"
                label-width="100px"
        >

            <el-form-item
                    :label="$t('Title')"
                    required
                    prop="title">
                <el-input maxlength="60" size="mini" show-word-limit v-model="addForm.title" placeholder="商品标题"/>
            </el-form-item>
            <el-form-item
                    :label="$t('SubTitle')"
                    required
                    prop="sub_title">
                <el-input maxlength="250" size="mini" show-word-limit  v-model="addForm.sub_title" placeholder="商品子标题"/>
            </el-form-item>
<!--            <el-form-item-->
<!--                    :label="$t('Description')"-->
<!--                    required-->
<!--                    prop="sub_title">-->
<!--                <el-input maxlength="500" size="mini" show-word-limit type="textarea" :rows="5"-->
<!--                          v-model="addForm.description"-->
<!--                          placeholder="商品简介"/>-->
<!--            </el-form-item>-->
            <el-form-item
                    :label="$t('Stock')"
                    required
            >
                <el-input-number :min="0" :max="9999999"  size="mini"  v-model="addForm.stock" placeholder="库存"/>
            </el-form-item>
            <el-form-item
                    :label="$t('Unit')"
                    required
            >
                <el-input maxlength="8" size="mini" show-word-limit v-model="addForm.unit" placeholder="单位"/>
            </el-form-item>
            <el-form-item
                    label="限购数量"
                    required>
                <el-input type="number" v-model="addForm.limit_items"/>

                <div>(0: 表示不限购)</div>
            </el-form-item>
            <el-form-item
                    label="多少天内"
                    required>
                <el-input type="number" v-model="addForm.limit_days"/>
            </el-form-item>
            <el-form-item
                    :label="$t('Cover')">
                <ImgUploaderV3 show="local" imgCls="coverImg" ref="addImgUploader" @onUploadSuccess="onUploadSuccess"
                                    :defaultImgUrl="addForm.main_image" imgType="goods"/>
                <span>推荐宽高比 4:3</span>
            </el-form-item>
            <el-form-item
                    :label="$t('SmallImage')">
                <ImgUploaderV3 show="local" imgCls="smallCoverImg" ref="addSmallImgUploader" @onUploadSuccess="onSmallUploadSuccess"
                                    :defaultImgUrl="addForm.small_image" imgType="goods"/>
                <span>推荐宽高比 1:1</span>
            </el-form-item>
            <el-form-item
                    :label="$t('DisplayOrder')">
                <el-input  size="mini"  v-model="addForm.display_order" placeholder="商品排序序号"/>
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
    import ImgUploaderV3 from '../../components/img-uploaderV3.vue'
    import {dbhTool} from '@peter_xiter/dbh-js-tools'

    export default {
        components: {
            ImgUploaderV3
        },
        data () {
            return {
                skuProperties: [],
                active: 0, // 当前步骤
                cateOptions: [],
                addForm: {
                    stock: 0,
                    limit_days: 1,
                    limit_items: 0,
                    small_image:'',
                    title: '',
                    sub_title: '',
                    main_image: '',
                    description: '',
                    display_order: 0,
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
                this.addForm.main_image = dbhTool.getImgUrl(data.trim(','))
            },
            onSmallUploadSuccess (data) {
                console.debug("onSmallUploadSuccess", data)
                this.addForm.small_image = dbhTool.getImgUrl(data.trim(','))
            },
            onCreate () {
                let that = this
                that.loading = true
                goodsApi.create(this.addForm).then(function () {
                    window.dbh.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
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
