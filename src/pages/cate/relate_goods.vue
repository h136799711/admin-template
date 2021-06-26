<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">

        <div>
            <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-back"
                    :loading="loading"
                    @click="onBack()"
            >
                {{ $t('Back') }}
            </el-button>
        </div>
        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item>
                    <el-input :placeholder="$t('Title')" v-model="queryForm.title" size="mini"/>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="refresh()" size="mini" icon="el-icon-search">{{ $t('Search') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="grid-content">
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
                        width="160px"
                        prop="title"
                        :label="$t('Title')"
                />
<!--                <el-table-column-->
<!--                        width="160px"-->
<!--                        prop="sub_title"-->
<!--                        :label="$t('SubTitle')"-->
<!--                />-->
<!--                <el-table-column-->
<!--                        width="160px"-->
<!--                        prop="description"-->
<!--                        :label="$t('Description')"-->
<!--                />-->
                <el-table-column
                        width="160px"
                        :label="$t('Image')"
                >
                    <template #default="scope">
                        <div>
                            <el-image
                                    style="width: 80px;height:60px;"
                                    :src="scope.row.main_image" alt="主图"/>
                        </div>
                    </template>
                </el-table-column>
<!--                <el-table-column-->
<!--                        width="120px"-->
<!--                        :label="$t('Image')"-->
<!--                >-->
<!--                    <template #default="scope">-->
<!--                        <div>-->
<!--                            <el-image-->
<!--                                    style="width: 80px;height:60px;"-->
<!--                                    :src="scope.row.small_image" alt="小图"/>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column
                        width="120px"
                        :label="$t('Price')"
                >
                    <template #default="scope">
                        {{(scope.row.min_price / 100).toFixed(2)}} - {{(scope.row.max_price / 100).toFixed(2)}}
                        {{$t('Unit.Yuan')}}
                    </template>
                </el-table-column>

<!--                <el-table-column-->
<!--                        width="120px"-->
<!--                        :label="$t('CreateTime')">-->
<!--                    <template #default="scope">-->
<!--                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd')}}-->
<!--                    </template>-->
<!--                </el-table-column>-->

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template #default="scope">
                        <el-button
                                v-if="inCateGoods(scope.row.id)"
                                size="mini"
                                type="primary"
                                @click="removeGoods(scope.row.id)">
                            取消关联
                        </el-button>
                        <el-button
                                v-else
                                size="mini"
                                @click="addGoods(scope.row.id)">
                            关联商品
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
    </div>
</template>

<script>
    import dtGoodsApi from '../../api/dtGoodsApi'
    import dtCateApi from "../../api/dtCateApi";

    export default {
        components: {
        },
        props:{
            id: String
        },
        data() {
            return {
                queryForm: {
                    title: '',
                    page_index: 1,
                    page_size: 10
                },
                rules: {
                    title: [
                        {required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur'},
                        {min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur'}
                    ]
                },
                count: 0,
                tableData: [],
                cateGoods: [],
                loading: false
            }
        },
        computed: {},
        watch: {},
        created() {

        },
        mounted() {
            this.refresh()
        },
        methods: {
            onBack() {
                this.$router.replace("/admin/cate/index");
            },
            inCateGoods(id) {
                return this.cateGoods.indexOf(id) !== -1;
            },
            async addGoods(goodsId) {
                this.loading = true;
                try {
                    let resp = await dtCateApi.addGoods({id: this.id, goods_id: goodsId});
                    this.refresh();
                } catch (err) {
                    console.debug(err);
                    window.dbh.alertError(err);
                } finally {
                    this.loading = false
                }
            },
            async removeGoods(goodsId) {
                this.loading = true;
                try {
                    let resp = await dtCateApi.removeGoods({id: this.id, goods_id: goodsId});
                    this.refresh();
                } catch (err) {
                    console.debug(err);
                    window.dbh.alertError(err);
                } finally {
                    this.loading = false
                }
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
                            instance.confirmButtonText = window.dbh.vue_instance.$i18n.t('Processing').value
                            dtGoodsApi.delete({id: id}).finally(function () {
                                instance.confirmButtonLoading = false
                                that.refresh();
                                done()
                            });
                            // , (res) => {
                            //     instance.confirmButtonLoading = false
                            //     this.refresh()
                            //     done()
                            // }, (res) => {
                            //     console.debug(res)
                            //     done()
                            //     window.dbh.alertError(res.msg)
                            //     instance.confirmButtonLoading = false
                            // })
                        } else {
                            done()
                        }
                    }
                }).then(() => {
                }).catch(() => {
                })
            },
            byPagerSizeChange(val) {
                this.queryForm.page_size = val
                this.refresh()
            },
            byPagerCurrentChange(val) {
                this.queryForm.page_index = val
                this.refresh()
            },
            async refresh() {
                // 刷新当前
                // this.tableData = [];
                this.loading = true;
                let that = this;
                try {
                    let data = await dtGoodsApi.query(that.queryForm);
                    this.cateGoods = await  dtCateApi.queryGoods({id: this.id, only_id: 1});
                    that.tableData = data.list;
                    that.count = parseInt(data.count);
                    that.loading = false
                } catch (err) {
                    console.debug(err);
                    window.dbh.alertError(err);
                    that.loading = false
                }
            }
        }
    }
</script>
