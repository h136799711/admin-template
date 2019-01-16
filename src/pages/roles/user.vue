<template>
    <div class="main-content by-tree padding-md-bottom padding-md-top">
        <el-tooltip  effect="dark" :content="$t('Back')" placement="bottom">
            <el-button
                    type="primary"
                    size="mini"
                    @click="$router.replace('/admin/roles/index')"
            >
                <span class="el-icon-back"/>
            </el-button>
        </el-tooltip>
            <el-tooltip  effect="dark" :content="$t('Refresh')" placement="right">
            <el-button
                    type="primary"
                    size="mini"
                    check-strictly="true"
                    :loading="loading"
                    @click="refresh()"
            >
                <span class="by-icon by-shuaxin"/>
            </el-button>

        </el-tooltip>

        <h2 class="h2 margin-md">{{ $t('User') }}</h2>

        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item >
                    <el-input size="mini" :placeholder="$t('Mobile')" v-model="queryForm.mobile" />
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="refresh()"  size="mini" icon="el-icon-search">{{ $t('Search') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="grid-content margin-md-top">
            <el-table
                    ref="table"
                    v-loading="loading"
                    :data="list"
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
                        prop="nickname"
                        width="180px"
                        :label="$t('Nick')"
                />

                <el-table-column
                        width="200px"
                        :label="$t('Mobile')">
                    <template slot-scope="scope">
                        {{scope.row.country_no}} {{scope.row.mobile}}
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="onRemove(scope.row.id)">
                            {{$t('Remove')}}
                        </el-button>
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
                    @current-change="byPagerCurrentChange" />
        </div>
    </div>
</template>

<script>
	import api from '../../api/roleApi'
	import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'

	export default {
        props: {
            id: String
        },
		components: {
			ElButton
		},
		data() {
			return {
				queryForm: {
					mobile: ''
                },
				currentPage: 0,
                pageSize: 10,
				loading: false,
                count: 0,
                list: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
			}
		},
		computed: {},
		watch: {},
		created() {
            this.refresh();
        },
        mounted: function() {
        },
		methods: {
            byPagerSizeChange(val) {
                this.pageSize = val
                this.refresh ()
            },
            byPagerCurrentChange(val) {
                this.currentPage = val
                this.refresh ()
            },
            onRemove(uid) {
                this.$confirm (this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

                            let data = {
                            	'role_id': this.id,
                                'uid': uid
                            }
                            api.removeUser (data, (res) => {
                                instance.confirmButtonLoading = false
                                this.refresh()
                                done()
                            }, (res) => {
                                console.log (res)
                                done()
                                window.tools.alertError (res.msg)
                                instance.confirmButtonLoading = false
                            })
                        } else {
                        	done()
                        }
                    }
                }).then (() => {
                }).catch (() => {
                })
            },
			refresh() {
				console.log(this.id)
				// 刷新当前
                this.loading = true
                api.user ({'role_id': this.id, 'mobile': this.queryForm.mobile}, (resp) => {
                    this.loading = false
                    this.list = resp.list
                    this.count = resp.count
                }, (resp) => {
                    window.tools.alertError (resp.msg)
                    this.loading = false
                })
			}
		}
	}
</script>
