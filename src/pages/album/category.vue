<template>
    <div class="main-content by-album-category padding-md-bottom padding-md-top">

        <div>

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
                />
                <el-table-column
                        width="160px"
                        :label="$t('CreateTime')">
                    <template slot-scope="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)">
                            {{$t('Edit')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


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
                    class="edit-form"
            >

                <el-form-item
                        :label="$t('Title')"
                        prop="title" >
                    <el-input v-model="editForm.title"/>
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
                        :label="$t('Title')"
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
    </div>
</template>

<script>
	import api from '../../api/albumApi'
	import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
	import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

	export default {
		components: {
			ElForm,
			ElButton
		},
		data() {
			return {
				queryForm: {
				},
				addForm: {
				},
				editForm: {
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
        },
		created() {
            this.refresh ();
		},
		mounted: function () {
		},
		methods: {

			submitEditForm() {
				api.updateCategory (this.editForm, (resp) => {
					this.loading = false
					this.dialogEditVisible = false;
                    this.refresh()
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
					this.dialogEditVisible = false;
				})
			},
			submitAddForm() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						api.createCategory (this.addForm, (resp) => {
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
					title: ''
				}
				this.dialogAddVisible = true
			},
			onEdit(row) {
                this.editForm.id = row.id
                this.editForm.title = row.title
				this.dialogEditVisible = true;
			},
			refresh() {
				// 刷新当前
				this.tableData = []
				this.loading = true
				api.queryCategory (this.queryForm, (resp) => {
					console.debug ('resp ', resp)
					this.loading = false
					this.tableData = resp
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
				})
			}
		}
	}
</script>
