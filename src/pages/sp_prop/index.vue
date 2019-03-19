<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <div>
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
                        <router-link :to="{path: '/admin/spcate/index/' + scope.row.id, params: {id:scope.row.id}}" >{{scope.row.title}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column
                        width="120px"
                        prop="is_sale"
                        :label="$t('Is') + $t('SaleProperty')"
                >
                    <template slot-scope="scope">
                        {{$t('' + scope.row.is_sale)}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('Is') + $t('ColorProperty')">
                    <template slot-scope="scope">
                        {{$t('' + scope.row.is_color)}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('PropertyType')">
                    <template slot-scope="scope">
                        {{$t(scope.row.prop_type)}}
                    </template>
                </el-table-column>

                <el-table-column
                        width="200px"
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
                    :page-size="queryForm.pageSize"
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
                <el-form-item
                        :label="$t('Is') + $t('SaleProperty')"
                        prop="is_sale"
                >
                    <el-select size="mini" v-model="addForm.is_sale">
                        <el-option
                                :key="0"
                                :label="$t('No')"
                                :value="0">
                        </el-option>
                        <el-option
                                :key="1"
                                :label="$t('Yes')"
                                :value="1">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Is') + $t('ColorProperty')"
                        prop="is_color"
                >
                    <el-select size="mini" v-model="addForm.is_color">
                        <el-option
                                :key="0"
                                :label="$t('No')"
                                :value="0">
                        </el-option>
                        <el-option
                                :key="1"
                                :label="$t('Yes')"
                                :value="1">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('PropertyType')"
                        prop="type"
                >
                    <el-select size="mini" v-model="addForm.prop_type">
                        <el-option
                                v-for="item in propTypeOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                        </el-option>
                    </el-select>
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
                <el-form-item
                        :label="$t('Is') + $t('SaleProperty')"
                        prop="is_sale"
                ><el-select size="mini" v-model="editForm.is_sale">
                    <el-option
                            :key="0"
                            :label="$t('No')"
                            :value="0">
                    </el-option>
                    <el-option
                            :key="1"
                            :label="$t('Yes')"
                            :value="1">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Is') + $t('ColorProperty')"
                        prop="is_color"
                >
                    <el-select size="mini" v-model="editForm.is_color">
                        <el-option
                                :key="0"
                                :label="$t('No')"
                                :value="0">
                        </el-option>
                        <el-option
                                :key="1"
                                :label="$t('Yes')"
                                :value="1">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('PropertyType')"
                        prop="type"
                >
                    <el-select size="mini" v-model="editForm.prop_type">
                        <el-option
                                v-for="item in propTypeOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                        </el-option>
                    </el-select>
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
	import spPropApi from '../../api/spPropApi'
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
				count:0,
                propTypeOptions: [
                        {code: 'single', 'name': this.$i18n.t('single')},
                        {code: 'multiple', 'name': this.$i18n.t('multiple')}
                ],
                inputVisible: false,
                inputValue: '',
                grandpa: 0,
				queryForm: {
                    title: '',
                    page_index: 1,
                    page_size: 10
				},
				addForm: {
					title: '',
                    is_color: 0,
                    is_sale: 0,
                    prop_type: 'single',
				},
				editForm: {
                	id: 0,
                    title: '',
                    is_color: 0,
                    is_sale: 0,
                    prop_type: 'single',
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
                this.queryForm.pageSize = val
                this.refresh ()
            },
            byPagerCurrentChange(val) {
                this.queryForm.currentPage = val
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

                            spPropApi.delete ({id: id}, (res) => {
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
                spPropApi.update (this.editForm, (resp) => {
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
                        spPropApi.create (this.addForm, (resp) => {
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
                this.addForm.is_color = 0
                this.addForm.is_sale = 0
                this.addForm.prop_type = 'single'
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
                spPropApi.query(that.queryForm, (resp) => {
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
