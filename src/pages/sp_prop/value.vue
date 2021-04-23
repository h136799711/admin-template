<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <div class="h4 margin-md-bottom" style="font-size: 2rem;">
            属性值管理
        </div>
        <div class="hidden">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item >
                    <el-input v-model="queryForm.title" size="mini"  />
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="refresh()"  size="mini" icon="el-icon-search">{{ $t('Search') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-back"
                :loading="loading"
                @click="back()">
            {{ $t('Back')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                :loading="loading"
                @click="onAdd()">
            {{ $t('Add')}}
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
                        width="40px"
                        :label="$t('ID')"
                />
                <el-table-column
                        prop="title"
                        :label="$t('Title')"
                >
                    <template slot-scope="scope">
                        {{scope.row.title}}
                    </template>
                </el-table-column>

                <el-table-column
                        width="320px"
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)">
                            {{$t('Edit')}}
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="onDelete(scope.row.id)">
                            {{$t('Delete')}}
                        </el-button>
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

        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Add')"
                :visible.sync="dialogAddVisible"
        >
            <el-form
                    ref="addForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Title')"
                        required
                        prop="title" >
                    <el-input v-model="addForm.title"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
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


        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Edit')"
                :visible.sync="dialogEditVisible"
        >
            <el-form
                    ref="editForm"
                    :model="editForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >

                <el-form-item
                        :label="$t('Title')"
                        required
                        prop="title" >
                    <el-input v-model="editForm.title"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                <el-button @click="dialogEditVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button

                        :loading="loading"
                        type="primary"
                        @click="submitEditForm()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import spPropValueApi from '../../api/spPropValueApi'
	import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
	import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
	import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

	export default {
		props: {
			id: String
        },

		components: {
			ElForm,
			ElButtonGroup,
			ElButton
		},
		data() {
			return {
				queryForm: {
					title: '',
                    page_index: 1,
                    page_size: 10
				},
				addForm: {
					title: '',
				},
				editForm: {
                	id: 0,
                    title: '',
				},
				rules: {
					title: [
						{required: true, message: this.$i18n.t ('Please Input Title'), trigger: 'blur'},
						{min: 1, max: 32, message: this.$i18n.t ('String Length Between', [1, 32]), trigger: 'blur'}
					]
				},
				count: 0,
				tableData: [],
				loading: false,
                dialogAddValueVisible: false,
				dialogAddVisible: false,
				dialogEditVisible: false
			}
		},
		computed: {
		},
		watch: {
            // '$route' (to, from) {
             //    console.debug("fullPath", this.$router.history.current.fullPath)
             //    console.debug(to, from)
			// 	this.queryForm.parent_id = parseInt(to.params.id)
             //    this.refresh()
			// }
        },
		created() {

		},
        mounted() {
            this.refresh()
        },
		methods: {
            byPagerSizeChange(val) {
                this.queryForm.page_size = val
                this.refresh ()
            },
            byPagerCurrentChange(val) {
                this.queryForm.page_index = val
                this.refresh ()
            },
			back() {
			    this.$router.replace({path: '/admin/sp_prop/index'})
            },
			onDelete(id) {
                this.$confirm (this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

                            spPropValueApi.delete ({id: id}, (res) => {
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
			submitEditForm() {
                spPropValueApi.update (this.editForm, (resp) => {
					this.loading = false
					this.dialogEditVisible = false
                    this.refresh()
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
					this.dialogEditVisible = false
				})
			},
			submitAddForm() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
                        spPropValueApi.create (this.addForm, (resp) => {
							this.loading = false
							this.dialogAddVisible = false
							window.tools.alertSuc (this.$i18n.t('Action') + this.$i18n.t('Success'))
							this.refresh()
						}, (resp) => {
                            this.loading = false
							window.tools.alertError (resp.msg)
						})
					} else {
						return false
					}
				});
			},
			onAdd() {
				this.addForm.title = ''
                this.addForm.prop_id = this.id
				this.dialogAddVisible = true
			},
			onEdit(row) {
                this.editForm = {
                    id: row.id,
                    title: row.title,
                    is_color: row.is_color,
                    is_sale: row.is_sale,
                    prop_type: row.prop_type
                 }
				this.dialogEditVisible = true;
			},
			refresh() {
				// 刷新当前
				this.tableData = []
				this.loading = true
                let that = this
                let data = Object.assign({prop_id: this.id}, that.queryForm)
                spPropValueApi.query(data, (resp) => {
                    that.tableData = resp.list
                    that.count = parseInt(resp.count)
                    that.loading = false
                }, (resp) => {
                    window.tools.alertError (resp.msg)
                    that.loading = false
                })
			}
		}
	}
</script>
