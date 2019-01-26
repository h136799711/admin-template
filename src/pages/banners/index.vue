<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">

        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item >
                    <el-select size="mini" v-model="queryForm.position" >
                        <el-option
                                v-for="item in positionOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                        </el-option>
                    </el-select>
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
                />
                <el-table-column
                        width="160px"
                        prop="jumpUrl"
                        :label="$t('Url')"
                />
                <el-table-column
                        width="120px"
                        :label="$t('Image')">
                    <template slot-scope="scope">
                        {{scope.row.img_url}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        :label="$t('CreateTime')">
                    <template slot-scope="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd')}}
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
                        :label="$t('Source')"
                        prop="source"
                >
                    <el-select v-model="editForm.source" >
                        <el-option
                                v-for="item in positionOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Description')"
                        prop="desc"
                >
                    <el-input v-model="editForm.desc" type="textarea" />
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
	import api from '../../api/bannersApi'
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
                inputVisible: false,
                inputValue: '',
				positionOptions: [
                ],
				queryForm: {
					position: '',
                    page_index: 1,
                    page_size: 10
				},
				addForm: {
					title: '',
                    source: 'Internet',
				},
				editForm: {
					title: '',
                    source: 'Internet',
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
			api.queryPosition({}, (resp) => {
				console.debug(resp)
                if (resp.length > 0) {
                    this.queryForm.position = resp[0].code
                    this.positionOptions = resp
                }
                this.refresh ();
            }, (resp) => {
                window.tools.alertError (resp.msg)
                this.loading = false
            });
		},
		mounted: function () {
		},
		methods: {
            onPhotoManage(id) {
                this.$router.push ({path: 'photo/' + id})
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(() => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = window._.trim(this.inputValue);
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
			submitEditForm() {
				api.update (this.editForm, (resp) => {
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
                this.dynamicTags = [];
				this.addForm = {
					title: '',
                    desc: '',
                    source: 'Internet',
                    tags: '',
                    cate_id: ''
				}
				this.dialogAddVisible = true
			},
			onEdit(row) {
                this.editForm.id = row.id
                this.editForm.title = row.title
                this.editForm.desc = row.description
                this.editForm.source = row.source
                this.editForm.cate_id = row.cate.id
                this.dynamicTags = [];
                for (let tag in row.tags) {
                    this.dynamicTags.push(row.tags[tag].title)
                }
				this.dialogEditVisible = true;
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
