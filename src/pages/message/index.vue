<style>
    .read{
        color: #999999;
    }
    .read .el-button--text {
        color: #999999;
    }
    .message-time {
        text-align: center;
    }
    .el-dialog--center .el-dialog__body {
        padding: 5px;
    }

</style>
<template>
    <div class="main-content by-policy padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                icon="by-icon by-shuaxin"
                :loading="loading"
                @click="refresh()">
            {{ $t('Refresh')}}
        </el-button>
        <div class="margin-md-top">
            <el-radio-group size="mini" v-model="queryForm.dtree_type" >
                <el-radio-button label="announce">{{$t('System')}}-{{$t('Notification')}}</el-radio-button>
                <el-radio-button label="user">{{$t('User')}}-{{$t('Notification')}}</el-radio-button>
            </el-radio-group>
        </div>
        <div class="margin-md-top">
            <el-radio v-model="queryForm.msg_status" label="1">{{$t('Read')}}</el-radio>
            <el-radio v-model="queryForm.msg_status" label="0">{{$t('Unread')}}</el-radio>
        </div>

        <div class="grid-content margin-md-top">
            <el-table
                    ref="table"
                    v-loading="loading"
                    :data="tableData"
                    stripe
                    sortable="custom"

                    :row-class-name="tableRowClassName"
                    :element-loading-text="$t('Loading')"
                    style="width: 100%"
            >
                <el-table-column
                        prop="id"
                        width="60px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="200px"
                        :label="$t('Title')">
                    <template slot-scope="scope">
                        <el-button  type="text" @click="onView(scope.row)">
                            {{scope.row.title}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="summary"
                        :label="$t('Summary')"/>

                <el-table-column
                        :label="$t('Time')">
                    <template slot-scope="scope">
                        {{(new Date(scope.row.createTime * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
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
                    @current-change="byPagerCurrentChange" />
        </div>

        <!-- View Dialog -->
        <el-dialog
                :show-close="true"
                center
                :modal-append-to-body="false"
                :title="viewForm.title"
                :visible.sync="dialogViewVisible"
        >
            <i class="el-icon-loading" v-if="viewForm.loading"></i>
            <div v-if="!viewForm.loading" class="message-time">
                {{(new Date(this.viewForm.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
            </div>
            <div class="message-content" v-html="viewForm.content">
            </div>

        </el-dialog>

    </div>
</template>

<script>
	import api from '../../api/msgApi'




	export default {
		components: {

		},
		data() {
			return {
				viewForm: {
					loading: true
                },
				queryForm: {
				    page_index: 1,
                    page_size: 10,
                    msg_status: '0',
                    dtree_type: 'announce'
                },
				count: 0,
				tableData: [],
				loading: false,
                dialogViewVisible: false
			}
		},
		computed: {},
		watch: {
            queryForm: {
                handler(val){
                  this.refresh()
                },
                deep: true
            }
        },
		created() {
			this.refresh ();
		},
		mounted: function () {
		},
		methods: {
            onView(row) {
            	this.dialogViewVisible = true
                this.viewForm.loading = true
                api.info({'id': row.id}, (resp) => {
                    this.viewForm = Object.assign(this.viewForm, resp)
                    this.viewForm.loading = false
                    console.debug(this.viewForm)
                }, (resp) => {
                    this.viewForm.loading = false
                })
            },
			tableRowClassName({row, rowIndex}) {
                console.debug(row)
                if (parseInt(row.msgStatus) === 1) {
                    return 'read';
                } else if (parseInt(row.msgStatus) === 0) {
                    return 'unread';
                }
                return '';
            },
            byPagerSizeChange(val) {
				this.queryForm.page_size = val
				this.refresh ()
			},
			byPagerCurrentChange(val) {
				this.queryForm.page_index = val
				this.refresh ()
			},
			refresh() {
				// 刷新当前
				this.tableData = []
				this.loading = true

				api.queryAllMsg (this.queryForm, (resp) => {
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
