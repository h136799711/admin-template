<style>

</style>
<template>
    <div class="main-content by-datatree padding-md-bottom padding-md-top">
        <el-button-group>
            <el-button
                    type="primary"
                    size="mini"
                    :loading="loading"
                    @click="refresh()"
            >
                <span class="by-icon by-shuaxin"/>
                {{ $t('Refresh')}}
            </el-button>
        </el-button-group>

        <el-row :gutter="20">
            <el-col :span="24">
                <div class="grid-content margin-md-top">
                    <div class="margin-sm-bottom">
                            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                                <el-form-item >
                                    <el-date-picker
                                            v-model="queryForm.ymd"
                                            format="yyyy-MM-dd"
                                            value-format="yyyyMMdd"
                                            align="left"
                                            :editable="false"
                                            type="date"
                                            :placeholder="$t('Date')"
                                            :picker-options="pickerDateOption">
                                    </el-date-picker>
                                </el-form-item>

                                <el-form-item>
                                    <el-button :loading="loading" type="primary" @click="onSearch"  icon="el-icon-search">{{ $t('Search') }}</el-button>
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
                            @sort-change="sortTable"
                    >
                        <el-table-column
                                type="selection"
                                width="55"
                        />
                        <el-table-column
                                prop="service_type"
                                :label="$t('Name')"
                                width="320"
                        />
                        <el-table-column
                                prop="ymd"
                                :label="$t('Date')"
                                width="120"
                        />
                        <el-table-column
                                prop="cnt"
                                sortable
                                :label="$t('Times')"
                        />
                        <el-table-column
                                prop="client_id"
                                :label="$t('ClientId')"
                        />
                    </el-table>
                </div>
                <div class="text-center">
                    <el-pagination
                            background
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 30, 50]"
                            :page-size="pageSize"
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

    </div>
</template>

<script>
	import apiLogApi from '../../api/apiLogApi'
	import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
	import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
	import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

	export default {
		components: {
			ElForm,
			ElButtonGroup,
			ElButton
		},
		data() {
			return {
                pickerDateOption: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: this.$i18n.t('Today'),
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: this.$i18n.t('Yesterday'),
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }]
                },
				currentPage: 1, // 当前页码
                queryForm: {
					ymd: ''
				},
				pageSize: 10,
				filterText: '',
				list: [],
				count: 0,
				tableData: [],
				loading: false,
				dialogAddVisible: false,
				dialogEditVisible: false,
				order: 0, // 排序信息 1：sort从大到小排序 2：sort从小到大排序
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
			this.queryForm.ymd = (new Date()).format('yyyyMMdd');
		    this.refresh();
        },
		methods: {
			onSearch() {
              this.refresh();
            },
			sortTable(data) {
				console.log ('排序', data.column, data.prop, data.order)
				if (data.prop === 'sort' && data.order === 'ascending') {
					this.order = 'cnt,asc'
				} else {
					this.order = 'cnt,desc'
				}
                this.refresh()
			},
			byPagerSizeChange(val) {
				console.log (`每页 ${val} 条`)
				this.pageSize = val
                this.refresh()
			},
			byPagerCurrentChange(val) {
				console.log (`当前页: ${val}`)
				this.currentPage = val
                this.refresh()
			},
			query(suc) {
			},
			refresh() {
				// 刷新当前
                this.tableData = []
                this.loading = true
                apiLogApi.query ({'order': this.order, 'ymd': this.queryForm.ymd, 'page_index': this.currentPage, 'page_size': this.pageSize}, (resp) => {
                    console.debug ('resp ', resp)
                    this.loading = false
                    console.debug('currentPage', this.currentPage)
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
