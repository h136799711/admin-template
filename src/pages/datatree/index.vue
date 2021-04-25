<style>
    .by-datatree .by-ctrl {
        float: right;
    }
</style>
<template>
    <div class="main-content by-datatree padding-md-bottom padding-md-top">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                {{ $t('Home') }}
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/datatree/index' }">
                {{ $t('Datatree') }}
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-alert
                class=""
                title=""
                type="info"
                :description="$t('DatatreeeDescription')"
                show-icon
        />

        <el-button-group class="margin-sm-top">
            <el-tooltip placement="right">
                <div slot="content">
                    {{ $t('Refresh') }}{{ $t('Current Data') }}
                </div>
                <el-button
                        type="primary"
                        size="mini"
                        @click="refresh()"
                >
                    <span class="by-icon by-shuaxin"/>
                    {{ $t('Refresh') }}
                </el-button>
            </el-tooltip>
        </el-button-group>
        <el-row :gutter="20">
            <el-col :span="5">
                <div class="grid-content">
                    <h3 class="margin-sm-bottom">
                        <el-tooltip placement="right">
                            <div slot="content">
                                {{ $t('Loading') }}
                            </div>
                            <el-button
                                    type="text"
                                    @click="refresh()"
                            >
                                {{ $t('Root') }}{{ $t('Node') }}
                            </el-button>
                        </el-tooltip>
                        <span class="">
              {{ '>>' + currentNodeName }}
            </span>
                    </h3>
                    <el-tree
                            class="filter-tree"
                            :highlight-current="true"
                            :data="list"
                            ref="tree2"
                            :load="loadNode"
                            :expand-on-click-node="true"
                            :render-content="renderContent"
                            lazy
                            :auto-expand-parent="true"
                            @node-click="treeNodeClick"
                    />
                </div>
            </el-col>
            <el-col :span="19">
                <div class="grid-content margin-md-bottom">
                    <div class="margin-sm-bottom">
                        <div style="height: 33px;">
                            <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="datatreeAction('edit')"
                            >
                                {{ $t('Edit') }}
                            </el-button>
                            <el-button
                                    type="primary"
                                    icon="el-icon-plus"
                                    size="mini"
                                    @click="datatreeAction('add')"
                            >
                                {{ $t('Add') }}
                            </el-button>
                            <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="datatreeBulkDelete"
                            >
                                {{ $t('Selection') }}{{ $t('Delete') }}
                            </el-button>
                        </div>
                    </div>
                    <el-table
                            ref="datatreeTable"
                            v-loading="loading"
                            :data="tableData"
                            stripe
                            sortable="custom"
                            :element-loading-text="$t('Loading')"
                            style="width: 100%"
                            @select="selectTable"
                            @select-all="selectTableAll"
                            @sort-change="sortTable"
                    >
                        <el-table-column
                                type="selection"
                                width="55"
                        />
                        <el-table-column
                                prop="code"
                                :label="$t('Code')"
                                width="120"
                        />
                        <el-table-column
                                prop="sort"
                                :label="$t('Sort')"
                                sortable
                                width="100"
                        />
                        <el-table-column
                                prop="name"
                                :label="$t('Name')"
                                width="160"
                        />
                        <el-table-column
                                prop="alias"
                                :label="$t('Alias')"
                                width="140"
                        />
                        <el-table-column
                                prop="notes"
                                :label="$t('Note')"
                        />
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
                            @current-change="byPagerCurrentChange"
                    />
                </div>
            </el-col>
        </el-row>

        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Add')"
                :visible.sync="dialogAddVisible"
        >
            <el-form
                    ref="ruleForm"
                    :model="ruleForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
                    class="demo-ruleForm"
            >
                <el-form-item
                        :label="$t('Name')"
                        prop="name"
                >
                    <el-input v-model="ruleForm.name"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Alias')"
                        prop="alias"
                >
                    <el-input v-model="ruleForm.alias"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number
                            v-model="ruleForm.sort"
                            :min="1"
                            :max="99999999"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('Level')"
                        prop="data_level"
                >
                    <el-radio-group v-model="ruleForm.data_level">
                        <el-radio
                                name="data_level"
                                label="0"
                        >
                            {{ $t('Normal Level') }}
                        </el-radio>
                        <el-radio
                                name="data_level"
                                label="1"
                        >
                            {{ $t('System Level') }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :label="$t('Note')"
                        prop="notes"
                >
                    <el-input
                            v-model="ruleForm.notes"
                            type="textarea"
                    />
                </el-form-item>
            </el-form>
            <div
                    slot="footer"
                    class="dialog-footer"
            >
                <el-button @click="dialogAddVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        type="primary"
                        @click="submitDatatreeForm('ruleForm')"
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
                    class="edit-form"
            >
                <el-form-item
                        :label="$t('Label')"
                        prop="name"
                >
                    <el-input v-model="editForm.name"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Alias')"
                        prop="alias"
                >
                    <el-input v-model="editForm.alias"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number
                            v-model="editForm.sort"
                            :min="1"
                            :max="99999999"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('Level')"
                        prop="data_level"
                >
                    <el-radio-group v-model="editForm.data_level">
                        <el-radio
                                name="data_level"
                                label="0"
                        >
                            {{ $t('Normal Level') }}
                        </el-radio>
                        <el-radio
                                name="data_level"
                                label="1"
                        >
                            {{ $t('System Level') }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        :label="$t('Note')"
                        prop="notes"
                >
                    <el-input
                            v-model="editForm.notes"
                            type="textarea"
                    />
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
            <div
                    slot="footer"
                    class="dialog-footer"
            >
                <el-button @click="dialogEditVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        type="primary"
                        @click="submitDatatreeForm('editForm')"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import datatreeApi from '../../api/datatreeApi'




	export default {
		components: {

		},
		data() {
			return {
				editForm: {
					id: 0,
					name: '',
					alias: '',
					sort: 0,
					notes: '',
					data_level: '0'
				},
				ruleForm: {
					name: '',
					alias: '',
					sort: 0,
					notes: '',
					data_level: '0',
					parent_id: 0
				},
				rules: {
					name: [
						{required: true, message: this.$i18n.t ('Please Input Name'), trigger: 'blur'},
						{min: 1, max: 20, message: this.$i18n.t ('String Length Between', [1, 20]), trigger: 'blur'}
					],
					alias: [
						{required: false, message: this.$i18n.t ('Please Input Alias'), trigger: 'change'}
					],
					notes: [
						{min: 0, max: 250, message: this.$i18n.t ('String Length Between', [0, 250]), trigger: 'blur'}
					]
				},
				filterText: '',
				list: [],
				count: 0,
				tableData: [],
				currentNodeName: '', // 当前节点名字
				loading: false,
				cache: [], // 当前请求缓存
				dialogAddVisible: false,
				dialogEditVisible: false,
				currentDtId: 0, // 当前数据字典父级id
				order: 0, // 排序信息 1：sort从大到小排序 2：sort从小到大排序
				selectTableRowId: '', // 选中的表格行id
				currentParentId: 0, // 当前的父级id
				treeExpandKeys: [],
				currentNode: null, // 当前数据节点
                queryForm: {
				    page_index: 1,
                    page_size: 10
                }
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
		methods: {
			selectTableAll(selection) {
				console.debug (selection)
				this.selectTableRowId = ''
				if (selection.length === 0) {
					this.editForm = {
						id: 0,
						name: '',
						alias: '',
						sort: 0,
						notes: '',
						data_level: '0'
					}
				}
				for (let i = 0; i < selection.length; i++) {
					this.selectTableRowId += selection[i].id + ','
					if (i === 0) {
						console.debug ('first selection ', selection[i])
						this.editForm.id = selection[i].id
						this.editForm.name = selection[i].name
						this.editForm.alias = selection[i].alias
						this.editForm.data_level = selection[i].data_level
						this.editForm.iconurl = selection[i].iconurl
						this.editForm.name = selection[i].name
						this.editForm.notes = selection[i].notes
						this.editForm.sort = selection[i].sort
					}
				}
				console.debug (this.selectTableRowId)
			},
			selectTable(selection, row) {
				if (selection.length === 0) {
					this.editForm = {
						id: 0,
						name: '',
						alias: '',
						sort: 0,
						notes: '',
						data_level: '0'
					}
				}
				this.selectTableRowId = ''
				for (let i = 0; i < selection.length; i++) {
					this.selectTableRowId += selection[i].id + ','
					if (i === 0) {
						console.debug ('first selection ', selection[i])
						this.editForm.id = selection[i].id
						this.editForm.name = selection[i].name
						this.editForm.alias = selection[i].alias
						this.editForm.data_level = selection[i].data_level
						this.editForm.iconurl = selection[i].iconurl
						this.editForm.name = selection[i].name
						this.editForm.notes = selection[i].notes
						this.editForm.sort = selection[i].sort
					}
				}
				console.debug ('选择项的id', this.selectTableRowId)
				console.debug ('编辑项目的信息', this.editForm)
			},
			datatreeBulkDelete() {
				this.$confirm (this.$i18n.t('Action Confirm'), this.$i18n.t('Alert'), {
					confirmButtonText: this.$i18n.t('Confirm'),
					cancelButtonText: this.$i18n.t('Cancel'),
					type: 'warning',
					beforeClose: (action, instance, done) => {
						if (action === 'confirm') {
							instance.confirmButtonLoading = true
							instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
							let data = {
								'id': this.selectTableRowId
							}
							datatreeApi.delete (data, (res) => {
								done ()
								instance.confirmButtonLoading = false
								// 删除本地相应的数据
								this.remove (this.selectTableRowId)
								this.list = []
								this.treeExpandKeys = [this.currentParentId]
								this.query (0, (list) => {
									this.list = this.convert (list)
									this.currentNodeName = ''
								})
							}, (res) => {
                                instance.confirmButtonLoading = false
								console.debug (res)
								window.tools.alertError (res.msg)
                                done ()
							})
						} else {
							done ()
						}
					}
				}).then (() => {
					console.debug ('[ajax] delete datatree')
				}).catch (() => {
				})
			},
			sortTable(data) {
				console.debug ('排序', data.column, data.prop, data.order)
				if (data.prop === 'sort' && data.order === 'ascending') {
					this.order = 2
				} else {
					this.order = 1
				}
				this.loadRightTable (this.currentDtId)
			},
			byPagerSizeChange(val) {
				console.debug (`每页 ${val} 条`)
				this.queryForm.page_size = val
				this.loadRightTable (this.currentDtId)
			},
			byPagerCurrentChange(val) {
				console.debug (`当前页: ${val}`)
				this.queryForm.page_index = val
				this.loadRightTable (this.currentDtId)
			},
			submitDatatreeForm(formName) {
				this.$refs[formName].validate ((valid) => {
					if (valid) {
						if (formName === 'ruleForm') {
							let model = this.$refs[formName].model
							model.parent_id = this.currentDtId
							let label = model.name
							datatreeApi.add (model, (data) => {
								// 操作成功，重新加载
								console.debug ('[api] success', data, this.currentNode)
								this.currentNode.insertChild ({data: {id: data.id, label: label}})
								this.loadNode (this.currentNode, (res) => {
								})
								this.$refs[formName].resetFields ()
								this.dialogAddVisible = false
							}, (res) => {
								window.tools.alertError (res.msg)
							})
						} else if (formName === 'editForm') {
							let model = this.$refs[formName].model
							// let label = model.name;
							datatreeApi.update (model, (data) => {
								// 操作成功，重新加载
								console.debug ('[api] success', data, this.$refs.tree2)
								this.loadNode (this.currentNode, (res) => {
									console.debug ('[api] loadNode', res)
									let children = this.currentNode.childNodes
									for (let i = 0; i < children.length; i++) {
										console.debug ('[api] node.data', children[i], children[i].data)
										for (let j = 0; j < res.length; j++) {
											if (res[j].id === children[i].data.id) {
												children[i].data = res[j]
												break
											}
										}
									}
								})

								this.editForm = {
									id: 0,
									name: '',
									alias: '',
									sort: 0,
									notes: '',
									data_level: '0'
								}
								this.dialogEditVisible = false
							}, (res) => {
								window.tools.alertError (res.msg)
							})
						}
					} else {
						console.debug ('error submit!!')
						return false
					}
				})
			},
			datatreeAction(action) {
				if (action === 'edit') {
					this.dialogEditVisible = true
				} else if (action === 'add') {
					this.dialogAddVisible = true
				}
			},
			remove(ids) {
				console.debug ('remove= ' + ids)
				console.debug (this.list)
				console.debug ('tree', this.$refs.tree2)
				// 删除节点
				for (var i = 0; i < this.list.length; i++) {
					var id = this.list[i].id
					if (ids.indexOf (id) === -1) {
						continue
					}
					console.debug (this.list[i])
				}
			},
			loadRightTable(parentId) {
				// 载入右侧表格数据
				this.loading = true
				this.currentDtId = parentId
                datatreeApi.query({'parent_id': parentId, 'page_size': this.queryForm.page_size, 'page_index': this.queryForm.page_index},
                  (resp) => {
                	this.loading = false
                    this.tableData = resp.list
                    this.count = parseInt(resp.count)
                }, (resp) => {
                    window.tools.alertError (resp.msg)
                    this.loading = false
                })
			},
			query(parentId, suc) {
				this.loading = true
				console.log('parent_id', parentId)
				datatreeApi.query ({'parent_id': parentId, 'page_size': 500}, (resp) => {
					this.loading = false
					suc (resp.list)
                    this.loadRightTable (parentId)
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
				})
			},
			refresh() {
				// 刷新当前
				this.list = []
				this.count = 0
				this.tableData = []
				this.query (0, (list) => {
					this.list = this.convert (list)
					this.currentNodeName = ''
				})
			},
			renderContent(h, {node, data, store}) {
				return (
					< span >
					< span class = 'grid-content' >
					{node.label}
			        </span>
				< /span>
			)
			},
			treeNodeClick(data, node, tree) {

                console.debug('treenode click')
                if (this.loading) return
                this.loading = true
				this.loadNode (node, (res) => {
				})
			},
			loadNode(node, resolve) {
				console.debug ('当前节点', this.currentNode)
				if (node === null) {
					return
				}
				this.currentNode = node
				let parentId = 0
				let tmp = ''
				if (node.level > 0) {
					parentId = node.data.id
					tmp = node.data.label
				}
                console.debug ('节点点击', node.data.id, parentId)
				this.query (parentId, (list) => {
					this.currentNodeName = tmp
					resolve (this.convert (list))
                    console.debug('load right table', parentId)
				})
			},
			convert(list) {
				console.debug ('list', list)
				var convertList = []
				for (var i = 0; i < list.length; i++) {
					var a = {
						label: list[i].name,
						id: list[i].id
					}
					convertList.push (a)
				}
				console.debug ('convert', convertList)
				return convertList
			}
		}
	}
</script>
