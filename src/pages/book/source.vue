<style>
</style>
<template>
    <div class="main-content by-album padding-md-bottom padding-md-top">

        <el-button
                type="primary"
                size="mini"
                icon="el-icon-back"
                @click="$router.replace('/admin/book/index')"
        >
            {{$t('Back')}}
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
                        width="80px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="160px"
                        prop="source_type_name"
                        :label="$t('source_type_name')"
                />
                <el-table-column
                        width="120px"
                        prop="start_url"
                        :label="$t('StartUrl')"
                >
                    <template slot-scope="scope">
                        <a :href="scope.row.start_url" target="_blank">{{scope.row.start_url}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        width="120px"
                        prop="current_url"
                        :label="$t('CurrentUrl')"
                >
                    <template slot-scope="scope">
                        <a :href="scope.row.current_url" target="_blank">{{scope.row.current_url}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                        width="90px"
                        prop="page_no"
                        :label="$t('Chapter') + $t('Total')"
                >
                    <template slot-scope="scope">
                        {{scope.row.page_no}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="120px"
                        prop="next_crawling_time"
                        :label="$t('NextCrawlingTime')"
                >
                    <template slot-scope="scope">
                        {{(new Date(scope.row.next_crawling_time * 1000)).format('yyyy-MM-dd')}}
                    </template>
                </el-table-column>

                <el-table-column
                        width="100px"
                        :label="$t('State')"
                >
                    <template slot-scope="scope">
                        {{getState(scope.row.crawling_state)}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="320px"
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import api from '../../api/bookApi'
    import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
    import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
    import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

    export default {
        components: {
            ElForm,
            ElButtonGroup,
            ElButton
        },
        props: {
            id: String,
            require: true
        },
        data () {
            return {
                inputVisible: false,
                inputValue: '',
                source: [],
                queryForm: {
                    source_type_id: 2
                },
                rules: {
                    title: [
                        { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
                        { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ]
                },
                count: 0,
                tableData: [],
                loading: false,
                dialogAddVisible: false,
                dialogEditVisible: false
            }
        },
        computed: {},
        watch: {},
        created () {
        },
        mounted: function () {
            this.refresh()
        },
        methods: {
            getState (state) {
                switch (state) {
                    case 1:
                        return '更新中'
                    case 0:
                        return '等待更新'
                    case -1:
                        return '更新出错'
                    case 2:
                        return '更新完毕'
                    default:
                        return '未知'
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
            refresh () {
                // 刷新当前
                this.tableData = []
                this.loading = true
                this.queryForm.book_id = this.id
                api.querySource(this.queryForm, (resp) => {
                    console.debug('resp ', resp)
                    this.loading = false
                    this.tableData = resp
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            }
        }
    }
</script>
