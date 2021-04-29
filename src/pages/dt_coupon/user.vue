<style>
    .tip {
        float: left;
        width: 78px;
    }
</style>
<template>
    <div class="main-content by-users padding-md-bottom padding-md-top">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
            <el-form-item>
                <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-back"
                        :loading="loading"
                        @click="back()">
                    {{ $t('Back')}}
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-input size="mini" v-model="queryForm.mobile" placeholder="查询手机号"/>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" @click="refresh()" size="mini" icon="el-icon-search">{{ $t('Search') }}
                </el-button>
            </el-form-item>
        </el-form>

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
                        width="100px"
                        prop="title"
                        label="用户ID"
                >
                    <template #default="scope">
                        {{scope.row.user_id}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="140px"
                        label="用户手机号"
                >
                    <template #default="scope">
                        {{scope.row.mobile}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        label="过期日期">
                    <template #default="scope">
                        {{(new Date(scope.row.end_date * 1000)).format('yyyy-MM-dd')}}
                    </template>
                </el-table-column>

                <el-table-column
                        width="160px"
                        label="领取时间">
                    <template #default="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}<br/>
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$t('UsedTime')">
                    <template #default="scope">
                        <div v-if="scope.row.used == 1">
                            {{(new Date(scope.row.used_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                        </div>
                        <div v-else>
                            未使用
                        </div>
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
</template>

<script>

    import api from '../../api/dtCouponApi'

    export default {
        props:{
            id: String
        },
        data () {
            return {
                queryForm: {
                    mobile: '',
                    page_index: 1,
                    page_size: 10
                },
                rules: {
                },
                count: 0,
                tableData: [],
                loading: false,
            }
        },
        computed: {
        },
        watch: {
        },
        created () {
            this.refresh()
        },
        mounted () {
            console.debug('index mounted')
        },
        methods: {
            back() {
                this.$router.replace({ path: '/admin/dt_coupon/index'})
            },
            byPagerSizeChange (val) {
                this.queryForm.page_size = val
                this.refresh()
            },
            byPagerCurrentChange (val) {
                this.queryForm.page_index = val
                this.refresh()
            },
            async refresh () {
                // 刷新当前
                this.loading = true;
                this.queryForm.coupon_id = this.id;
                let resp = await api.queryByCouponId(this.queryForm);
                this.count = parseInt(resp.count);
                this.tableData = resp.list;
                this.loading = false;
            }
        }
    }
</script>
