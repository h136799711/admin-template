<style>

</style>
<template>
    <div class="main-content by-datatree padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                :loading="loading"
                @click="refresh()"
        >
            <span class="by-icon by-shuaxin"/>
            {{ $t('Refresh')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                :loading="loading"
                @click="onAdd()"
        >
            <span class="el-icon-plus"/>
            {{ $t('Add')}}
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
                        width="60px"
                        :label="$t('ID')"
                />
                <el-table-column
                        prop="name"
                        width="160px"
                        :label="$t('Name')"
                />
                <el-table-column
                        prop="note"
                        width="200px"
                        :label="$t('Note')"
                />
                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button class=""
                                   @click="goUser(scope.row.id)"
                                   size="mini">
                            {{ $t('User') }}
                        </el-button>
                        <el-button class=""
                                   @click="goPolicy(scope.row.id)"
                                   size="mini">
                            {{ $t('Policy') }}
                        </el-button>
                        <el-button
                                @click="goMenu(scope.row.id)"
                                size="mini">
                            {{ $t('Menu') }}
                        </el-button>
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)">
                            {{$t('Edit')}}
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

        <!-- Edit Form -->
        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Edit')"
                :visible.sync="dialogEditVisible"
        >
            <el-form
                    status-icon
                    ref="editForm"
                    :model="editForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        required
                        :label="$t('Name')"
                        prop="name">
                    <el-input v-model="editForm.name"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Note')"
                        prop="note"
                >
                    <el-input :rows="3" v-model="editForm.note" type="textarea"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
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
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        required
                        :label="$t('Name')"
                        prop="name">
                    <el-input v-model="addForm.name"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Note')"
                        prop="note"
                >
                    <el-input :rows="3" v-model="addForm.note" type="textarea"/>
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
				addForm: {},
                editForm: {},
				currentPage: 1, // 当前页码
				pageSize: 10,
				count: 0,
				tableData: [],
				loading: false,
				dialogAddVisible: false,
				dialogEditVisible: false,
				order: 0, // 排序信息 1：sort从大到小排序 2：sort从小到大排序
				selectTableRowId: '', // 选中的表格行id,
                rules: {
                    name: [
                        {required: true, message: this.$i18n.t ('Please Input Name'), trigger: 'blur'},
                        {min: 1, max: 32, message: this.$i18n.t ('String Length Between', [1, 32]), trigger: 'blur'}
                    ],
                    notes: [
                        {min: 0, max: 250, message: this.$i18n.t ('String Length Between', [0, 250]), trigger: 'blur'}
                    ]
                }
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
            submitEditForm() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        api.update (this.editForm, (resp) => {
                            this.loading = false
                            this.dialogEditVisible = false
                            window.tools.alertSuc (this.$i18n.t('Action') + this.$i18n.t('Success'))
                            this.refresh()
                        }, (resp) => {
                            window.tools.alertError (resp.msg)
                            this.loading = false
                        })
                    } else {
                        return false;
                    }
                });
            },
			submitAddForm() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        api.create (this.addForm, (resp) => {
                            this.loading = false
                            this.dialogAddVisible = false
                            window.tools.alertSuc (this.$i18n.t('Action') + this.$i18n.t('Success'))
                            this.refresh()
                        }, (resp) => {
                            window.tools.alertError (resp.msg)
                            this.loading = false
                        })
                    } else {
                        return false;
                    }
                });
            },
			onAdd() {
				this.addForm = {
					name: '',
					note: ''
				}
				this.dialogAddVisible = true
			},
            onEdit(row) {
                this.editForm = row
                this.dialogEditVisible = true;
            },
			goMenu(id) {
				this.$router.push ({path: 'menu/' + id})
			},
            goPolicy(id) {
                this.$router.push ({path: 'policy/' + id})
            },
            goUser(id) {
                this.$router.push ({path: 'user/' + id})
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
