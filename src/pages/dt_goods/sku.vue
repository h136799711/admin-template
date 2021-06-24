<style>
    .sku-panel {
        display: flex;
        flex-flow: row wrap;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .sku-panel .sku-item {
        width: 160px;
    }

    .by-goods-sku .goods-img {
        border-radius: 0;
        width: 80px;
        height: 80px;
    }
    .goodsImg {
        width: 160px;
        height: 120px;
    }
</style>
<template>
    <div class="main-content by-goods-sku padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-back"
                :loading="loading"
                @click="onBack()">
            {{ $t('Back')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-refresh"
                :loading="loading"
                @click="refresh()">
            {{ $t('Refresh')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                :loading="loading"
                @click="onAdd()">
            {{ $t('Add')}}
        </el-button>

        <div class="grid-content margin-md-top">
            <el-table
                    ref="table"
                    v-loading="loading"
                    :data="tableData"
                    stripe
                    :element-loading-text="$t('Loading')"
                    style="width: 100%"
            >
                <el-table-column
                        prop="id"
                        width="80px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="200px"
                        prop="title"
                        :label="$t('Title')"
                />
                <el-table-column
                        width="160px"
                        :label="$t('Price')"
                >
                    <template #default="scope">
                        {{(scope.row.price/100.0).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        :label="$t('Image')"
                >
                    <template #default="scope">
                        <el-image
                                style="width: 120px;height:90px"
                                :src="scope.row.img"/>
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)">
                            {{$t('Edit')}}
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="onDelete(scope.row.id)">
                            {{$t('Delete')}}
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>


        <el-dialog
                :show-close="false"
                :append-to-body="false"
                :title="$t('Add')"
                v-model="dialogAddVisible"
        >
            <el-form
                    ref="addForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >

                <el-form-item
                        :label="$t('Title')"
                        required
                        prop="title" >
                    <el-input v-model="addForm.title"/>
                </el-form-item>

                <el-form-item
                        :label="$t('Price')"
                        required
                        prop="price" >
                    <el-input v-model="addForm.price"/>
                </el-form-item>

                <el-form-item
                        :label="$t('Image')"
                        prop="img"
                >
                    <ImgUploaderV3 imgCls="goodsImg"  @onUploadSuccess="onUploadSuccess" :clear="imgUploadClear" imgType="goods" />
                </el-form-item>

            </el-form>
            <template #footer>
                <div  class="dialog-footer" >
                <el-button @click="dialogAddVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button

                        :loading="loading"
                        type="primary"
                        @click="submitAddForm()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
            </template>
        </el-dialog>


        <el-dialog

                :append-to-body="false"
                :show-close="false"
                :title="$t('Edit')"
                v-model="dialogEditVisible"
        >
            <el-form
                    ref="editForm"
                    :model="editForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >

                <el-form-item
                        :label="$t('Title')"
                        required
                        prop="title" >
                    <el-input v-model="editForm.title"/>
                </el-form-item>

                <el-form-item
                        :label="$t('Price')"
                        required
                        prop="price" >
                    <el-input v-model="editForm.price"/>
                </el-form-item>

                <el-form-item
                        :label="$t('Image')"
                        prop="img"
                >
                    <ImgUploaderV3 imgCls="goodsImg" :default-img-url="editForm.img"  @onUploadSuccess="onUploadSuccess" :clear="imgUploadClear" imgType="goods" />
                </el-form-item>

            </el-form>
            <template #footer>

                <div  class="dialog-footer" >
                <el-button @click="dialogEditVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button

                        :loading="loading"
                        type="primary"
                        @click="submitEditForm()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
            </template>
        </el-dialog>

    </div>
</template>

<script>
    import goodsSkuApi from '../../api/dtGoodsApi'
    import ImgUploaderV3 from '../../components/img-uploaderV3'

    export default {
        props: {
            id: String
        },
        components: {
            ImgUploaderV3,
        },
        data() {
            return {
                imgUploadClear: false,
                addForm: {
                    price: 0,
                    img: '',
                    title: '',
                    goods_id: 0
                },
                editForm: {
                    id: 0,
                    price: '',
                    img: '',
                    title: ''
                },
                rules: {
                    title: [
                        {required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur'},
                        {min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur'}
                    ]
                },
                tableData: [],
                loading: false,
                dialogAddVisible: false,
                dialogEditVisible: false,
            }
        },
        computed: {},
        watch: {
        },
        created() {
        },
        mounted() {
            this.refresh()
        },
        methods: {
            onUploadSuccess(data) {
                console.debug('image upload success', data)
                if (this.dialogEditVisible) {
                    this.editForm.img = window.tools.getImgUrl(data.trim(","))
                } else {
                    this.addForm.img = window.tools.getImgUrl(data.trim(","))
                }
            },
            onAdd() {
                this.imgUploadClear = true;
                this.dialogAddVisible = true;
                this.addForm.goods_id = this.id;
                this.addForm.title = '';
                this.addForm.price = 0;
                this.addForm.img = '';
            },
            submitAddForm() {
                let that = this;
                this.loading = true;
                this.addForm.price = (this.addForm.price * 100).toFixed(0);
                goodsSkuApi.addSku(this.addForm).finally(function () {
                    that.dialogAddVisible = false;
                    that.loading = false;
                    that.refresh();
                })
            },

            onEdit(row) {
                this.dialogEditVisible = true;
                this.editForm.id = row.id;
                this.editForm.title = row.title;
                this.editForm.price = row.price / 100.0;
                this.editForm.img = row.img;
            },
            submitEditForm() {
                let that = this;
                this.loading = true;
                this.editForm.price = (this.editForm.price * 100).toFixed(0);
                goodsSkuApi.editSku(this.editForm).finally(function () {
                    that.dialogEditVisible = false;
                    that.loading = false;
                    that.refresh();
                })
            },
            onBack() {
                this.$router.replace({ path: '/admin/dt_goods/index'})
            },
            onDelete(id) {
                let that = this;
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
                            goodsSkuApi.removeSku({ id: id }).finally(function () {
                                instance.confirmButtonLoading = false
                                that.refresh();
                                done()
                            });
                        } else {
                            done()
                        }
                    }
                }).then(() => {
                }).catch(() => {
                })
            },
            async refresh() {
                // 刷新当前
                this.loading = true;
                this.tableData = await goodsSkuApi.querySku({goods_id: this.id});
                this.loading = false
            }
        }
    }
</script>
