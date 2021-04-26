<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                icon="by-icon by-shuaxin"
                :loading="loading"
                @click="refresh()">
            {{ $t('Refresh')}}
        </el-button>

        <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                :loading="loading"
                @click="onAdd()">
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
                        width="120px"
                        prop="name"
                        :label="$t('Title')"
                >
                    <template #default>
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$t('JumpUrl')">
                    <template #default="scope">
                        {{scope.row.alias}}
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$t('Sort')">
                    <template #default="scope">
                        {{scope.row.sort}}
                    </template>
                </el-table-column>

                <el-table-column
                        width="140px"
                        :label="$t('CreateTime')">
                    <template #default="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd')}}
                    </template>
                </el-table-column>

                <el-table-column
                        width="200px"
                        fixed="right"
                        :label="$t('Action')">
                    <template #default="scope">
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

        <el-dialog
                :show-close="false"
                :append-to-body="false"
                :title="$t('Add')"
                v-model="dialogAddVisible"
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
                        prop="name" >
                    <el-input v-model="addForm.name"/>
                </el-form-item>

                <el-form-item
                        :label="$t('JumpUrl')"
                        prop="alias"
                >
                    <el-input v-model="addForm.alias" />
                </el-form-item>

                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number v-model="addForm.sort" :min="0" :max="100000" ></el-input-number>
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
                :append-to-body="false"
                :title="$t('Edit')"
                v-model="dialogEditVisible"
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
                    prop="name" >
                <el-input v-model="editForm.name"/>
            </el-form-item>

                <el-form-item
                        :label="$t('JumpUrl')"
                        prop="alias"
                >
                    <el-input v-model="editForm.alias" />
                </el-form-item>

                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number v-model="editForm.sort" :min="0" :max="100000" ></el-input-number>
                </el-form-item>

                <el-form-item
                        label=""
                        prop="id"
                        class="hidden"
                >
                    <el-input
                            v-model="editForm.id"
                            :disabled="true"
                            class="hidden"
                    />
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
	import api from '../../api/datatreeApi'



	export default {
		components: {
		},
		data() {
			return {
                queryForm: {
                    parent_id: 74,
                    page_size: 100,
                },
				addForm: {
                    data_level: 0,
                    parent_id: 74,
					name: '',
                    alias: '',
                    sort: 0,
				},
				editForm: {
                    name: '',
                    alias: '',
                    sort: 0,
				},
				rules: {
					name: [
						{required: true, message: this.$i18n.t ('Please Input Title'), trigger: 'blur'},
						{min: 1, max: 32, message: this.$i18n.t ('String Length Between', [1, 32]), trigger: 'blur'}
					]
				},
				tableData: [],
				loading: false,
				dialogAddVisible: false,
				dialogEditVisible: false
			}
		},
		computed: {
		},
		watch: {
        },
		created() {
		    this.refresh();
		},

        mounted() {
			console.debug('index mounted')
        },
		methods: {
			onDelete(id) {
                this.$confirm (this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

                            api.delete ({id: id}, (res) => {
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
				api.update (this.editForm, (resp) => {
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
                console.log(this.addForm)
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						api.add (this.addForm, (resp) => {
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
                this.addForm.name = '';
                this.addForm.alias = '';
                this.addForm.sort = 0;
				this.dialogAddVisible = true
			},
			onEdit(row) {

                this.editForm = {
                    name: row.name,
                    alias: row.alias,
                    sort: row.sort,
                }
                this.editForm.id = row.id
				this.dialogEditVisible = true;
			},
			refresh() {
				// 刷新当前
				this.tableData = []
				this.loading = true
				api.query (this.queryForm, (resp) => {
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
