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
        <el-button
                type="primary"
                size="mini"
                check-strictly="true"
                :loading="loading"
                @click="onAdd()"
        >
            <span class="el-icon-plus"/>
            {{$t('Add')}}
        </el-button>

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
                    :current-page="this.queryForm.page_index"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="this.queryForm.page_size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count"
                    @size-change="byPagerSizeChange"
                    @current-change="byPagerCurrentChange" />
        </div>

        <!-- Add Form -->
        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Add')"
                :visible.sync="dialogAddVisible"
        >
            <el-form
                    status-icon
                    ref="addForm"
                    :model="addForm"
                    label-position="right"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Mobile')"
                        prop="name">
                    <el-autocomplete
                            :clearable="true"
                            v-model="addDialog.mobile"
                            :fetch-suggestions="querySearchAsync"
                            :placeholder="$t('Mobile')"
                            @clear="onMobileClear"
                            @select="handleSelect"
                    ></el-autocomplete>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        :loading="loading"
                        type="primary"
                        @click="submitAddForm()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import api from '../../api/roleApi'
	import userApi from '../../api/userApi'
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
					mobile: '',
                    page_index: 1,
                    page_size: 10,
                },
                addForm: {
				    user_id: 0
                },
                addDialog: {
				    mobile: ''
                },
                dialogAddVisible: false,
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
		watch: {
            dialogAddVisible: function(oldVal, newVal) {
            	if (newVal === false) {
                    this.addDialog.mobile = ''
                    this.addForm.user_id = 0
                }
            }
        },
		created() {
            this.refresh();
        },
        mounted: function() {
        },
		methods: {
        	onMobileClear() {
            	console.debug('onMobileClear')
                this.addForm.user_id = 0;
            },
            handleSelect(item) {
                console.debug(item);
                this.addForm.user_id = item.id;
            },
            querySearchAsync(queryString, cb) {
                userApi.queryByPagingNoCount({'mobile': queryString}, (res) => {
                    var formatRes = [];
                	for(var i=0;i < res.length;i++) {
                        formatRes.push({
                        	value: res[i].mobile,
                            id: res[i].id
                        })
                	}
                    cb(formatRes);
                }, (res) => {
                    window.tools.alertError (res.msg)
                })
            },
        	submitAddForm() {
                if (this.addForm.user_id > 0) {
                	api.attachUser({'user_id': this.addForm.user_id, 'role_id': this.id}, (res) => {
                        this.refresh()
                        this.dialogAddVisible = false
                    }, (res) => {
                        window.tools.alertError (res.msg)
                        this.dialogAddVisible = false
                    })
                }
            },
        	onAdd() {
        		this.dialogAddVisible = true;
            },
            byPagerSizeChange(val) {
                this.queryForm.page_size = val
                this.refresh ()
            },
            byPagerCurrentChange(val) {
                this.queryForm.page_index = val
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

                            console.debug(uid)
                            let data = {
                                'user_id': uid,
                            	'role_id': this.id,
                            }
                            api.removeUser (data, (res) => {
                                instance.confirmButtonLoading = false
                                this.refresh()
                                done()
                            }, (res) => {
                                console.debug (res)
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
				console.debug(this.id)
				// 刷新当前
                this.loading = true
                this.queryForm.role_id = this.id
                api.user (this.queryForm, (resp) => {
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
