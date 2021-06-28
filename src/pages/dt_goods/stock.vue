<template>
    <div class="main-content by-goods-sku padding-md-bottom padding-md-top">
        <div v-if="showStockHistory">
            <el-button
                    type="primary"
                    size="mini"
                    :loading="loading"
                    @click="back()">
                {{ $t('Back')}}
            </el-button>

            <div class="grid-content margin-md-top">
                <el-table
                        ref="table"
                        v-loading="loading"
                        :data="hisTableData"
                        stripe
                        :element-loading-text="$t('Loading')"
                        style="width: 100%"
                >
                    <el-table-column
                            width="120px"
                            :label="$t('CreateTime')"
                    >
                        <template #default="scope">
                            {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="120px"
                            prop="change_num"
                            :label="$t('Stock')"
                    />
                    <el-table-column
                            prop="note"
                            :label="$t('Note')"
                    />
                </el-table>

            </div>
        </div>
        <div v-else>
        <el-button
                type="primary"
                size="mini"
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
                    :element-loading-text="$t('Loading')"
                    style="width: 100%"
            >
                <el-table-column
                        prop="id"
                        width="80px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="120px"
                        prop="stock"
                        :label="$t('Stock')"
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
                                style="width: 90px;height:60px"
                                :src="scope.row.img"/>
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                @click="onStock(scope.row)">
                            库存管理
                        </el-button>
                        <el-button
                                size="mini"
                                @click="onShowStock(scope.row)">
                            库存历史
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>

        </div>

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
                :append-to-body="false"
                title="库存管理"
                v-model="dialogStockVisible"
        >
            <el-form
                    ref="stockForm"
                    :model="stockForm"
                    label-position="right"
                    label-width="100px"
            >

                <el-form-item
                        label="库存变化"
                        required
                        prop="change_num" >
                    <el-input v-model="stockForm.change_num"/>
                </el-form-item>

                <el-form-item
                        :label="$t('Note')"
                         >
                    <el-input type="textarea" rows="5" v-model="stockForm.note"/>
                </el-form-item>


            </el-form>
            <template #footer>
                <div  class="dialog-footer" >
                    <el-button @click="dialogStockVisible = false">
                        {{ $t('Cancel') }}
                    </el-button>
                    <el-button
                            :loading="loading"
                            type="primary"
                            @click="submitStockForm()"
                    >
                        {{ $t('Confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import dtStockHisApi from "../../api/dtStockHisApi";
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
                showStockHistory: false,
                imgUploadClear: false,
                dialogStockVisible: false,
                queryForm: {
                    page_index: 1,
                    page_size: 10,
                },
                queryHisForm: {
                    sku_id: 0,
                    page_index: 1,
                    page_size: 10,
                },
                stockForm: {
                    sku_id: 0,
                    change_num: 0,
                    note: ""
                },
                count: 0,
                tableData: [],
                hisCount: 0,
                hisTableData: [],
                loading: false
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
            back() {
                this.showStockHistory = false;
            },
            onShowStock(row) {
                this.queryHisForm.sku_id = row.id;
                this.showStockHistory = true;
                this.refreshHis();
            },
            byPagerSizeChange2 (val) {
                this.queryHisForm.page_size = val
                this.refreshHis()
            },
            byPagerCurrentChange2 (val) {
                this.queryHisForm.page_index = val
                this.refreshHis()
            },
            byPagerSizeChange (val) {
                this.queryForm.page_size = val
                this.refresh()
            },
            byPagerCurrentChange (val) {
                this.queryForm.page_index = val
                this.refresh()
            },
            onStock(row) {
                this.stockForm.sku_id = row.id;
                this.stockForm.change_num = 0;
                this.stockForm.note = '';
                this.dialogStockVisible = true;
            },
            submitStockForm() {
                let that = this;
                this.loading = true;
                dtStockHisApi.create(this.stockForm).catch(function (err) {
                    tools.alertError(err);
                }).finally(function () {
                    that.dialogStockVisible = false;
                    that.loading = false;
                    that.refresh();
                })
            },
            async refresh() {
                this.loading = true;
                let resp = await dtStockHisApi.querySku({goods_id: this.id});
                this.tableData = resp.list;
                this.count = parseInt(resp.count);
                this.loading = false
            },
            async refreshHis() {
                this.loading = true;
                let resp = await dtStockHisApi.query(this.queryHisForm);
                this.hisTableData = resp.list;
                this.hisCount = parseInt(resp.count);
                this.loading = false
            }
        }
    }
</script>
