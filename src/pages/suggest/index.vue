<style>

</style>
<template>
    <div class="main-content by-datatree padding-md-bottom padding-md-top">
        <el-row :gutter="20">
            <el-col :span="24">
                <div class="grid-content ">
                    <div class="margin-sm-bottom">
                            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                                <el-form-item >
                                    <el-input size="mini" type="text" v-model="queryForm.email" placeholder="搜索邮箱地址" />
                                </el-form-item>
                                <el-form-item>
                                    <el-select size="mini" v-model="queryForm.proc_status" placeholder="请选择">
                                        <el-option
                                                v-for="item in statusOptions"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button size="mini" :loading="loading" type="primary" @click="onSearch"  icon="el-icon-search">{{ $t('Search') }}</el-button>
                                </el-form-item>
                            </el-form>
                    </div>

                    <el-table
                            ref="logTable"
                            v-loading="loading"
                            :data="tableData"
                            stripe
                            sortable="custom"
                            :element-loading-text="$t('Loading')"
                            style="width: 100%"
                    >
                        <el-table-column
                                prop="nick"
                                :label="$t('Nickname')"
                                width="120"
                        />
                        <el-table-column
                                prop="email"
                                :label="$t('Email')"
                                width="120"
                        />
                        <el-table-column
                                width="180"
                                :label="$t('Date')"
                        >
                            <template slot-scope="scope">
                                {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="content"
                                :label="$t('Content')"
                        />
                        <el-table-column
                                prop="reply_info"
                                :label="$t('Reply')"
                        />
                        <el-table-column
                                width="180"
                                :label="$t('Action')"
                        >
                            <template slot-scope="scope">
                                <el-button
                                        type="primary"
                                        size="mini"
                                        :loading="loading"
                                        @click="onReply(scope.row)">
                                    {{ $t('Reply')}}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="text-center">
                    <el-pagination
                            background
                            :current-page="this.queryForm.page_index"
                            :page-sizes="[10, 20, 30, 50]"
                            :page-size="this.queryForm.page_size"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="count"
                            @prev-click="byPagerCurrentChange"
                            @next-click="byPagerCurrentChange"
                            @size-change="byPagerSizeChange"
                            @current-change="byPagerCurrentChange"
                    />
                </div>
            </el-col>
        </el-row>

        <!-- Reply Form -->
        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Reply')"
                :visible.sync="dialogReplyVisible"
        >
            <el-form
                    status-icon
                    ref="replyForm"
                    :model="replyForm"
                    label-position="right"
                    label-width="100px"
            >
                <el-form-item
                >
                    {{replyForm.content }}
                </el-form-item>
                <el-form-item
                        :label="$t('Content')"
                >
                    <el-input v-model="replyForm.reply_content" type="textarea" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                <el-button @click="dialogReplyVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        :loading="loading"
                        type="primary"
                        @click="submitReplyForm()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import suggestApi from '../../api/suggestApi'




	export default {
		components: {

		},
		data() {
			return {
                statusOptions: [
                    {id: 2, name: '全部'},
                    {id: 1, name: '已回复'},
                    {id: 0, name: '待回复'},
                ],
                queryForm: {
                    email: '',
                    proc_status: 2,
                    page_index: 1, // 当前页码
                    page_size: 10,
				},
                replyForm: {
                    id: 0,
                    content: '',
                    reply_content: ''
                },
				filterText: '',
				list: [],
				count: 0,
				tableData: [],
				loading: false,
                dialogReplyVisible: false,
				selectTableRowId: '' // 选中的表格行id
			}
		},
		computed: {},
		watch: {
			order(newValue) {
				// TODO 手动排序
			}
		},
		created() {
		},
        mounted: function() {
		    this.refresh();
        },
		methods: {
            submitReplyForm() {
                suggestApi.reply(this.replyForm, (resp) => {
                    this.loading = false
                    this.dialogReplyVisible = false
                    window.tools.alertSuc (this.$i18n.t('Action') + this.$i18n.t('Success'))
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError (resp.msg)
                    this.loading = false
                })
            },
            onReply(row) {
                this.replyForm.id = row.id;
                this.replyForm.content = row.content;
                this.dialogReplyVisible = true
            },
			onSearch() {
              this.refresh();
            },
			byPagerSizeChange(val) {
                this.queryForm.page_size = val
                this.refresh()
			},
			byPagerCurrentChange(val) {
				this.queryForm.page_index = val
                this.refresh()
			},
			query(suc) {
			},
			refresh() {
				// 刷新当前
                this.tableData = []
                this.loading = true

                suggestApi.query (this.queryForm, (resp) => {
                    console.debug ('resp ', resp)
                    this.loading = false
                    this.count = parseInt (resp.count)
                    this.tableData = resp.list
                }, (resp) => {
                    window.tools.alertError (resp.msg)
                    this.loading = false
                })
			}
		}
	}
</script>
