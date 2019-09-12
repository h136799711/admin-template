<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-back"
                @click="onBack()">
            {{ $t('Back')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                :loading="loading"
                @click="onAdd()">
            {{ $t('Add')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                icon="by-icon by-shuaxin"
                :loading="loading"
                @click="refresh()">
            {{ $t('Refresh')}}
        </el-button>

        <div class="grid-content margin-md-top">
            <el-table
                    ref="table"
                    v-loading="loading"
                    :data="tableData"
                    stripe
                    sortable="custom"
                    :element-loading-text="$t('Loading')"
                    style="width: 100%"
            >
                <el-table-column
                        prop="id"
                        width="40px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="120px"
                        prop="title"
                        :label="$t('Title')"
                >
                    <template slot-scope="scope">
                        {{scope.row.title}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        prop="sub_title"
                        :label="$t('SubTitle')"
                />
                <el-table-column
                        width="160px"
                        :label="$t('Price')"
                >
                    <template slot-scope="scope">
                        {{(scope.row.show_price / 100).toFixed(2)}} {{$t('Unit.Yuan')}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        :label="$t('Volume') + '/' + $t('Weight')"
                >
                    <template slot-scope="scope">
                        {{scope.row.volume}} cm <sup style="font-size: 10px;">3</sup> <br/>
                        {{scope.row.weight}} Kg
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        :label="$t('SaleTime')">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sale_open_time > 0">销售开始:<br/>
                        {{(new Date(scope.row.sale_open_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                        </span>
                        <span v-else>不限制</span>
                        <br/>
                        <span v-if="scope.row.sale_end_time > 0">销售截至:<br/>
                        {{(new Date(scope.row.sale_end_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                        </span>
                        <span v-else>不限制</span>
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        :label="$t('CreateTime')">
                    <template slot-scope="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd')}}
                    </template>
                </el-table-column>

                <el-table-column
                        width="360px"
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="onRemove(scope.row.id)">
                            {{$t('Remove')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-center">
                <el-pagination
                        :current-page="queryForm.page_index"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="queryForm.page_size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="count"
                        @size-change="byPagerSizeChange"
                        @current-change="byPagerCurrentChange"/>
            </div>
        </div>


        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Add')"
                :visible.sync="dialogAddVisible"
        >
            <el-form
                    ref="addForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Goods')"
                        prop="goods_id">
                    <el-select
                            v-model="addForm.goods_id"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="queryGoods"
                            :loading="goodsIdLoading">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="'[' + item.id + ']' + item.title"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
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
        </el-dialog>

    </div>
</template>

<script>
    import spShopApi from '../../api/spShopApi'
    import goodsApi from '../../api/goodsApi'
    import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
    import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
    import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

    export default {
        props: {
            id: {
                type: String,
                default () {
                    return '0'
                }
            }
        },
        components: {
            ElForm,
            ElButtonGroup,
            ElButton
        },
        data () {
            return {
                options: [],
                queryForm: {
                    title: '',
                    shop_id: 0,
                    page_index: 1,
                    page_size: 10,
                },
                addForm: {
                    id: '',
                    goods_id: '',
                },
                rules: {
                    title: [
                        { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
                        { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ]
                },
                tableData: [],
                count: 0,
                loading: false,
                goodsIdLoading: false,
                dialogAddVisible: false,
                dialogEditVisible: false
            }
        },
        computed: {},
        watch: {},
        created () {

        },
        mounted () {
            this.refresh()
        },
        methods: {
            async queryGoods (q) {
                if (q !== '') {
                    this.goodsIdLoading = true
                    try {
                        this.options = await goodsApi.queryGoodsId({ title: q })
                    } catch (e) {

                    } finally {
                        this.goodsIdLoading = false
                    }
                } else {
                    this.options = []
                }
            },
            byPagerSizeChange (val) {
                this.queryForm.page_size = val
                this.refresh()
            },
            byPagerCurrentChange (val) {
                this.queryForm.page_index = val
                this.refresh()
            },
            onBack () {
                this.$router.replace('/admin/shop/index')
            },
            onRemove (id) {
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

                            spShopApi.removeGoods({ id: this.id, goods_id: id }, (res) => {
                                instance.confirmButtonLoading = false
                                this.refresh()
                                done()
                            }, (res) => {
                                console.debug(res)
                                done()
                                window.tools.alertError(res.msg)
                                instance.confirmButtonLoading = false
                            })
                        } else {
                            done()
                        }
                    }
                }).then(() => {
                }).catch(() => {
                })
            },
            submitAddForm () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        spShopApi.addGoods(this.addForm, (resp) => {
                            this.loading = false
                            this.dialogAddVisible = false
                            window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                            this.refresh()
                        }, (resp) => {
                            this.loading = false
                            window.tools.alertError(resp.msg)
                        })
                    } else {
                        return false
                    }
                })
            },
            onAdd () {
                this.addForm.id = this.id
                this.addForm.goods_id = ''
                this.dialogAddVisible = true
            },
            refresh () {
                // 刷新当前
                this.tableData = []
                this.loading = true
                let that = this
                this.queryForm.shop_id = this.id
                spShopApi.queryGoods(this.queryForm, (resp) => {
                    that.tableData = resp.list
                    that.count = parseInt(resp.count)
                    that.loading = false
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    that.loading = false
                })
            }
        }
    }
</script>
