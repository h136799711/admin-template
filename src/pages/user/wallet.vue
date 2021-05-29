<template>
    <div class="main-content by-user-session padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-back"
                @click="back()">
            {{ $t('Back')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-refresh"
                @click="refresh()">
            {{ $t('Refresh')}}
        </el-button>
        <el-alert class="margin-md-top">
            当前余额: {{ this.balance }}
        </el-alert>
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
                        width="220px"
                        prop="change_money"
                        label="变动金额"
                >
                    <template #default="scope">
                        <span v-if="scope.row.change_money > 0">+</span>
                        <span v-else>-</span>{{(scope.row.change_money/100.0).toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        prop="log_type"
                        label="日志类型"
                >
                </el-table-column>
                <el-table-column
                        width="200px"
                        :label="$t('Time')">
                    <template #default="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="content"
                        :label="$t('Content')"
                >
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
    import userWalletApi from "../../api/userWalletApi";

    export default {
        props: {
            id: 0,
            limit: 0,
        },
        data() {
            return {
                balance: 0,
                queryForm: {
                    page_index: 1,
                    page_size: 30
                },
                tableData: [],
                count: 0,
                loading: false,
            }
        },
        computed: {},
        watch: {},
        created() {
            this.info();
            this.refresh()
        },
        mounted() {
            console.debug('index mounted')
        },
        methods: {
            byPagerSizeChange(val) {
                this.queryForm.page_size = val
                this.refresh()
            },
            byPagerCurrentChange(val) {
                this.queryForm.page_index = val
                this.refresh()
            },
            info() {
                let that = this;
                userWalletApi.info({user_id: this.id}).then((resp) => {
                    that.balance = (resp.balance / 100.0).toFixed(2);
                })
            },
            back() {
                let params = {
                    p: this.limit
                };
                // this.$router.go(-1);
                this.$router.replace({path: '/admin/user/index', query: params})
            },
            refresh() {
                // 刷新当前
                // this.tableData = [];
                this.loading = true;
                this.queryForm.user_id = this.id;
                userWalletApi.query(this.queryForm).then((resp) => {
                    this.loading = false;
                    this.tableData = resp.list;
                    this.count = parseInt(resp.count);
                }).catch((resp) => {
                    window.tools.alertError(resp.msg);
                    this.loading = false
                });
            }
        }
    }
</script>
