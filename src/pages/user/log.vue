<template>
    <div class="main-content by-user-session padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-back"
                @click="$router.replace('/admin/user/index')">
            {{ $t('Back')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-refresh"
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
                        width="80px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="100px"
                        prop="device_type"
                        :label="$t('DeviceType')"
                >
                </el-table-column>
                <el-table-column
                        width="120px"
                        prop="ip"
                        :label="$t('Ip')"
                >
                </el-table-column>
                <el-table-column
                        width="200px"
                        prop="note"
                        :label="$t('Note')"
                >
                </el-table-column>
                <el-table-column
                        width="160px"
                        :label="$t('CreateTime')">
                    <template slot-scope="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}<br/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="ua"
                        :label="$t('UserAgent')"
                >
                </el-table-column>
            </el-table>
        </div>
        <div class="text-center">
            <el-pagination
                    :current-page="queryForm.page_index"
                    :page-sizes="[15, 30]"
                    :page-size="queryForm.page_size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count"
                    @size-change="byPagerSizeChange"
                    @current-change="byPagerCurrentChange"/>
        </div>
    </div>
</template>

<script>
    import api from '../../api/userApi'
    import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
    import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
    import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

    export default {
        components: {
            ElForm,
            ElButtonGroup,
            ElButton,
        },
        props: {
            id: 0,
        },
        data () {
            return {
                queryForm: {
                    page_index: 1,
                    page_size: 15
                },
                tableData: [],
                loading: false,
            }
        },
        computed: {},
        watch: {
        },
        created () {
            this.refresh()
        },
        mounted () {
            console.debug('index mounted')
        },
        methods: {
            byPagerSizeChange (val) {
                this.queryForm.page_size = val
                this.refresh()
            },
            byPagerCurrentChange (val) {
                this.queryForm.page_index = val
                this.refresh()
            },
            refresh () {
                // 刷新当前
                this.tableData = []
                this.loading = true
                this.queryForm.user_id = this.id
                api.queryLog(this.queryForm, (resp) => {
                    this.loading = false
                    this.tableData = resp.list
                    this.count = parseInt(resp.count)
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            }
        }
    }
</script>
