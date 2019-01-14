<style>

</style>
<template>
    <div class="main-content by-datatree padding-md-bottom padding-md-top">
        <el-button-group>
            <el-button
                    type="primary"
                    size="small"
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
                    <el-table
                            ref="roleTable"
                            v-loading="loading"
                            :data="tableData"
                            stripe
                            sortable="custom"
                            :element-loading-text="$t('Loading')"
                            style="width: 100%"
                    >
                        <el-table-column
                                prop="id"
                                width="60px"
                                :label="$t('ID')"
                        />
                        <el-table-column
                                prop="name"
                                :label="$t('Name')"
                        />
                        <el-table-column
                                prop="note"
                                :label="$t('Note')"
                        />
                        <el-table-column
                                fixed="right"
                                :label="$t('Action')">
                            <template slot-scope="scope">
                                <el-button class=""
                                           size="mini">
                                    {{ $t('Policy') }}
                                </el-button>
                                <el-button
                                        @click="goMenu(scope.row.id)"
                                        size="mini">
                                    {{ $t('Menu') }}
                                </el-button>
                                <el-switch
                                        v-model="scope.row.enable"
                                        @change="onEnableChange(scope.row)"
                                        active-value="1"
                                        inactive-value="0">
                                </el-switch>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="text-center">
                    <el-pagination
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 30, 50]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="count"
                            @size-change="byPagerSizeChange"
                            @current-change="byPagerCurrentChange"
                    />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
	import api from '../../api/roleApi'
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
				currentPage: 1, // 当前页码
				pageSize: 10,
				count: 0,
				tableData: [],
				loading: false,
				dialogAddVisible: true,
				dialogEditVisible: false,
				order: 0, // 排序信息 1：sort从大到小排序 2：sort从小到大排序
				selectTableRowId: '' // 选中的表格行id
			}
		},
		computed: {},
		watch: {},
		created() {
		},
		mounted: function () {
			this.refresh ();
		},
		methods: {
			goMenu(id) {
				console.log ('go menu = ', id)
				this.$router.push ({path: 'menu/' + id})
			},
			onEnableChange(row) {
				api.enable ({'id': row.id, 'status': row.enable}, (resp) => {
					this.loading = false
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
				})
			},
			byPagerSizeChange(val) {
				this.pageSize = val
				this.refresh ()
			},
			byPagerCurrentChange(val) {
				this.currentPage = val
				this.refresh ()
			},
			refresh() {
				// 刷新当前
				this.count = 0
				this.tableData = []
				this.loading = true
				api.query ({'name': ''}, (resp) => {
					console.debug ('resp ', resp)
					this.loading = false
					this.count = parseInt (resp.count)
					var i;
					for (i = 0; i < resp.list.length; i++) {
						resp.list[i]['enable'] = String (resp.list[i]['enable']);
					}
					this.tableData = resp.list
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
				})
			}
		}
	}
</script>
