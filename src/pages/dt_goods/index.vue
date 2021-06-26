<style>
    .by-goods .el-input--mini .el-input__inner {
        text-align: center;
    }
</style>
<template>
    <div class="main-content by-goods padding-md-bottom padding-md-top">
        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item>
                    <el-input  :placeholder="$t('Title')" v-model="queryForm.title" size="mini"/>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="refresh()" size="mini" icon="el-icon-search">{{ $t('Search') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                :loading="loading"
                @click="onAdd()">
            {{ $t('Add')}}
        </el-button>
<!--        <el-button-->
<!--                type="primary"-->
<!--                size="mini"-->
<!--                icon="by-icon by-shuaxin"-->
<!--                :loading="loading"-->
<!--                @click="refresh()">-->
<!--            {{ $t('Refresh')}}-->
<!--        </el-button>-->

        <div class="grid-content margin-md-top">
            <el-table
                    ref="table"
                    v-loading="loading"
                    :data="tableData"
                    @cell-mouse-enter="currentRowChange"
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
                >

                    <template #default="scope">
                        {{scope.row.title}}<br/>
                        {{scope.row.sub_title}}
                    </template>
                </el-table-column>
                <el-table-column
                        header-align="center"
                        width="100px"
                        :label="$t('Stock')"
                >
                    <template #default="scope">
                        <el-input size="mini" v-model="scope.row.stock"></el-input>
                        <el-button class="margin-sm-top" @click="onSaveStock(scope.row)" v-if="scope.row.id == currentRow" size="mini" type="primary">保存</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        header-align="center"
                        width="120px"
                        :label="$t('Image')"
                >
                    <template #default="scope">
                        <div>
                            <el-image
                                    style="width: 80px;height:60px;"
                                    :src="scope.row.main_image" alt="主图"  />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        header-align="center"
                        width="80px"
                        :label="$t('Image')"
                >
                    <template #default="scope">
                        <div>
                            <el-image
                                    style="width: 60px;height:60px;"
                                    :src="scope.row.small_image" alt="小图"  />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        header-align="center"
                        width="120px"
                        :label="$t('Price')"
                >
                    <template #default="scope">
                        {{(scope.row.min_price / 100).toFixed(2)}} - {{(scope.row.max_price / 100).toFixed(2)}}
                        {{$t('Unit.Yuan')}} / {{ scope.row.unit}}
                    </template>
                </el-table-column>

                <el-table-column
                        header-align="center"
                        width="120px"
                        :label="$t('CreateTime')">
                    <template #default="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd')}}
                    </template>
                </el-table-column>
                <el-table-column
                        header-align="center"
                        width="100px"
                        :label="$t('Status')">
                    <template #default="scope">
                        <span >
                            <el-button
                                    v-if="scope.row.shelf_status == 'off'"
                                    type="primary"
                                    size="mini"
                                    icon="by-icon by-shangjia"
                                    @click="shelfOn(scope.row.id)">
                                {{$t('OnShelves')}}
                            </el-button>
                            <el-button
                                    v-if="scope.row.shelf_status == 'on'"
                                    type="default"
                                    size="mini"
                                    icon="by-icon by-xiajia"
                                    @click="shelfOff(scope.row.id)">
                                {{$t('OffShelves')}}
                            </el-button>

                            </span>
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                icon="by-icon by-pinpai"
                                @click="onSku(scope.row)">
                            {{$t('Goods')}}{{$t('SKU')}}
                        </el-button>
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)">
                            {{$t('Edit')}}
                        </el-button>

                        <el-dropdown class="margin-md-left" size="mini" type="danger">
                            <el-button size="mini" type="danger">
                                {{$t('More')}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>

                            <template #dropdown>
                            <el-dropdown-menu >
                                <el-dropdown-item>
                                    <el-button
                                            type="text"
                                            size="mini"
                                            icon="el-icon-delete"
                                            @click="onDelete(scope.row.id)">
                                        {{$t('Delete')}}
                                    </el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                            </template>
                        </el-dropdown>
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

    export default {
        components: {
        },
        data () {
            return {
                inputVisible: false,
                queryForm: {
                    title: '',
                    page_index: 1,
                    page_size: 10
                },
                rules: {
                    title: [
                        { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
                        { min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ]
                },
                currentRow: -1,
                count: 0,
                tableData: [],
                loading: false
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
            onSaveStock(row) {
                console.debug(row);
                let that = this;
                that.loading = true;
                dtGoodsApi.saveStock({id: row.id, stock: row.stock}).then(() => {
                    that.refresh();
                }).catch((msg) => {
                    dbh.alertError(msg);
                }).finally(() => {
                    that.loading = false;
                })
            },
            currentRowChange(row, column, cell, event) {
                this.currentRow = row.id;
            },
            async shelfOn(id) {
                this.loading = true;
                try {
                    let resp = await dtGoodsApi.shelfOn({id: id});
                    this.refresh();
                } catch(err) {
                    console.debug(err);
                    window.dbh.alertError(err);
                } finally {
                    this.loading = false
                }
            },
            async shelfOff(id) {
                this.loading = true;
                try {
                    let resp = await dtGoodsApi.shelfOff({id: id});
                    this.refresh();
                } catch(err) {
                    console.debug(err);
                    window.dbh.alertError(err);
                } finally {
                    this.loading = false
                }
            },
            onDelete (id) {
                let that = this;
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.dbh.vue_instance.$i18n.t('Processing').value
                            dtGoodsApi.delete({ id: id }).finally(function () {
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
            byPagerSizeChange (val) {
                this.queryForm.page_size = val
                this.refresh()
            },
            byPagerCurrentChange (val) {
                this.queryForm.page_index = val
                this.refresh()
            },
            onAdd () {
                this.$router.push({ path: 'create' })
            },
            onEdit (row) {
                this.$router.push({ path: 'edit/' + row.id })
            },
            onSku (row) {
                this.$router.push({ path: 'sku/' + row.id })
            },
            async refresh () {
                // 刷新当前
                // this.tableData = [];
                this.loading = true;
                let that = this;
                try {
                    let data = await dtGoodsApi.query(that.queryForm);
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
