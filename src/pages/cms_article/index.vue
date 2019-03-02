<style>
    .by-img-uploader .avatar{
        border-radius: 5px;
        margin: 0px;
    }
</style>
<template>
    <div class="main-content by-datatree padding-md-bottom padding-md-top">

        <div v-if="!(this.dialogEditVisible || this.dialogAddVisible)">
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
            <div class="margin-md">
                <label>{{ $t('Article')}}{{ $t('Status')}}</label>:
                <el-select size="mini" v-model="queryForm.status" clearable :placeholder="$t('All')">
                    <el-option key="" value="" :label="$t('All')">
                    </el-option>
                    <el-option key="draft" value="draft" :label="$t('CmsArticle.draft')">
                    </el-option>
                    <el-option key="published" value="published" :label="$t('CmsArticle.published')">
                    </el-option>
                </el-select>
                <label>{{ $t('Category')}}</label>:
                <el-select size="mini" v-model="queryForm.category_id" clearable :placeholder="$t('All')">
                    <el-option key="" value="" :label="$t('All')">
                    </el-option>
                    <el-option
                            v-for="item in category"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                    </el-option>
                </el-select>

                <el-button
                        type="primary"
                        size="mini"
                        :loading="loading"
                        @click="refresh"
                >
                    <span class="el-icon-search"/>
                    {{ $t('Search')}}
                </el-button>
            </div>

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
                            prop="title"
                            width="160px"
                            :label="$t('Title')"
                    >
                        <template slot-scope="scope">
                            【{{scope.row.cate_name}}】{{scope.row.title}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="cover"
                            width="160px"
                            :label="$t('Cover')"
                    >
                        <template slot-scope="scope">
                            <img alt="cover" :src="scope.row.cover" style="width:120px;height: auto;"/>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="summary"
                            width="180px"
                            :label="$t('Summary')"
                    >
                        <template slot-scope="scope">
                            {{scope.row.summary}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="author_nick"
                            width="160px"
                            :label="$t('Author')"
                    >
                        <template slot-scope="scope">
                            {{scope.row.author_nick}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="views"
                            width="100px"
                            :label="$t('View')"
                    >
                        <template slot-scope="scope">
                            {{scope.row.views}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="cf_status"
                            width="200px"
                            :label="$t('Status')"
                    >
                        <template slot-scope="scope">
                            <span >
                                {{ $t('CmsArticle.' + scope.row.publish_status) }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            width="200px"
                            :label="$t('Action')">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    icon="el-icon-edit"
                                    @click="onEdit(scope.row)">
                                {{$t('Edit')}}
                            </el-button>
                            <el-button
                                    type="danger"
                                    size="mini"
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
                        @current-change="byPagerCurrentChange"
                />
            </div>
        </div>
        <!-- Edit Form -->
        <div class="edit-form" v-if="this.dialogEditVisible">
            <div class=""><h2>{{$t('Edit')}}</h2></div>
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
                        :label="$t('Title')"
                        prop="title">
                    <el-input v-model="editForm.title"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Category')"
                        prop="category"
                >
                    <el-select size="mini" v-model="editForm.cate_id" clearable placeholder="请选择">
                        <el-option
                                v-for="item in category"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('CfProject.CanExcess')"
                        prop="can_excess"
                >
                    <el-switch :active-value="1" :inactive-value="0" v-model="editForm.can_excess"></el-switch>
                </el-form-item>
                <el-form-item
                        :label="$t('RealName')"
                        prop="realname"
                >
                    <el-input v-model="editForm.realname" />
                </el-form-item>
                <el-form-item
                        :label="$t('IdCardNo')"
                        prop="id_card_no"
                >
                    <el-input v-model="editForm.id_card_no" />
                </el-form-item>
                <el-form-item
                        :label="$t('ValidDate')"
                        prop="id_valid_date"
                >
                    <el-date-picker
                            :disabled="this.longTermChecked"
                            v-model="editForm.id_valid_date"
                            type="date"
                            :picker-options="pickerOptions2"
                            value-format="yyyyMMdd">
                    </el-date-picker>
                    <el-checkbox v-model="longTermChecked">{{$t('LongTerm')}}</el-checkbox>
                </el-form-item>
                <el-form-item
                        :label="$t('BankCardNo')"
                        prop="bank_card_no"
                >
                    <el-input v-model="editForm.bank_card_no" />
                </el-form-item>
                <el-form-item
                        :label="$t('CfProject.IdCardImgHold')"
                        prop="cover"
                >
                    <ImgUploader ref="idCardImgHold" @onUploadSuccess="onIdCardHoldUploadSuccess" :defaultImgUrl="editForm.id_card_img_hold" :clear="imgUploadClear" imgType="id_card"/>
                </el-form-item>
                <el-form-item
                        :label="$t('CfProject.IdCardImgFront')"
                        prop="cover"
                >
                    <ImgUploader ref="idCardImgFront" @onUploadSuccess="onIdCardFrontUploadSuccess" :defaultImgUrl="editForm.id_card_img_front" :clear="imgUploadClear" imgType="id_card"/>
                </el-form-item>
                <el-form-item
                        :label="$t('CfProject.TargetMoney')"
                        prop="target_money"
                >
                    <el-input v-model="editForm.target_money"/>
                </el-form-item>
                <el-form-item
                        :label="$t('CfProject.Cover')"
                        prop="cover"
                >
                    <ImgUploader ref="editImgUploader" @onUploadSuccess="onUploadSuccess" :defaultImgUrl="editForm.cover" :clear="imgUploadClear" imgType="cf_cover"/>
                </el-form-item>

                <el-form-item
                        :label="$t('CfProject.Period')"
                        prop="description"
                >
                    <!--<el-date-picker-->
                            <!--v-model="editForm.date_range"-->
                            <!--type="daterange"-->
                            <!--:picker-options="pickerOptions2"-->
                            <!--range-separator="-"-->
                            <!--value-format="timestamp"-->
                            <!--:start-placeholder="$t('StartDate')"-->
                            <!--:end-placeholder="$t('EndDate')">-->
                    <!--</el-date-picker>-->

                    <el-input v-model="editForm.days" />
                </el-form-item>
                <el-form-item
                        :label="$t('Hide')"
                        prop="hidden"
                >
                    <el-switch :active-value="1" :inactive-value="0" v-model="editForm.hidden"></el-switch>
                </el-form-item>
                <el-form-item
                        :label="$t('CfProject.Detail')"
                        prop="detail"
                >
                    <mavon-editor ref="md" @imgAdd="editorImgAdd" v-model="editForm.detail"/>
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
        </div>

        <!-- Add Form -->
        <div class="add-form" v-if="this.dialogAddVisible">
            <div class=""><h2>{{$t('Add')}}</h2></div>
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
                        :label="$t('Title')"
                        prop="title">
                    <el-input v-model="addForm.title"/>
                </el-form-item>
                <el-form-item
                        required
                        :label="$t('Summary')"
                        prop="summary">
                    <el-input type="textarea" rows="5" v-model="addForm.summary"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Category')"
                        prop="category"
                >
                    <el-select size="mini" v-model="addForm.category_id" clearable placeholder="请选择">
                        <el-option
                                v-for="item in category"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Cover')"
                        prop="cover"
                >
                    <ImgUploader ref="editImgUploader" @onUploadSuccess="onUploadSuccess" :defaultImgUrl="addForm.cover" :clear="imgUploadClear" imgType="cms_article"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Content')"
                        prop="content"
                >
                    <mavon-editor ref="md" @imgAdd="editorImgAdd" v-model="editForm.content"/>
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
        </div>
    </div>
</template>

<script>
	import fileApi from '../../api/fileApi'
	import articleApi from '../../api/articleApi'
	import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
	import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
	import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
	import ImgUploader from '@/components/img-uploader.vue'


	export default {
		components: {
			ElForm,
			ElButtonGroup,
			ElButton,
            ImgUploader
		},
		data() {
			return {
                imgUploadClear: false,
				pickerOptions2: {},
				queryForm: {
					status: '',
					category_id: '',
					title: '',
					page_index: 1, // 当前页码
					page_size: 10,
				},
				category: [],
				addForm: {
                    title: '',
                    summary: '',
                    cover: '',
                    category_id: '',
                    tags: ''
                },
				editForm: {
					id: 0,

				},

				count: 0,
				tableData: [],
				loading: false,
				dialogAddVisible: false,
				dialogEditVisible: false,
				order: 0, // 排序信息 1：sort从大到小排序 2：sort从小到大排序
				selectTableRowId: '', // 选中的表格行id,
				rules: {
                    title: [
                        {required: true, message: this.$i18n.t ('Please Input Title'), trigger: 'blur'},
                        {min: 1, max: 48, message: this.$i18n.t ('String Length Between', [1, 48]), trigger: 'blur'}
                    ],
                    target_money: [
                        { required: true, message: '目标金额不能为空'},
                        { type: 'number', message: '目标金额必须为数字值'}
                    ],
                    cate_id: [
                        { required: true, message: this.$i18n.t ('Please Input') +' ' + this.$i18n.t('Category')},
                    ]
				}
			}
		},
		computed: {},
        watch: {
            dialogAddVisible(newVal) {
                if (!newVal) {
                    this.imgUploadClear = true
                }
            },
            dialogEditVisible(newVal) {
                // if (!newVal) {
                // this.imgUploadClear = true
                // }
            }
        },
        created() {
		},
		mounted: function () {
			this.refresh ();
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
                            articleApi.delete({id: id}, (resp) => {
                                this.loading = false
                                this.refresh()
                                done()
                                instance.confirmButtonLoading = false
                            }, () => {
                                this.loading = false
                                done()
                                instance.confirmButtonLoading = false
                            })

                        } else {
                            done()
                        }
                    }
                }).then (() => {
                    console.debug ('[ajax]')
                }).catch (() => {
                })
            },
            editorImgAdd(pos, file){
                fileApi.upload(file, 'cms_article').then(({data}) => {
                	if (data.code === 0) {
                        this.$refs.md.$img2Url(pos, window.tools.getImgUrl(data.data.relative_path))
                    } else {
                        window.tools.alertError(data.msg)
                    }
                }).catch((reason) => {
                	window.tools.alertError(reason)
                })
            },
            onUploadSuccess(data) {
                if (this.dialogAddVisible) {
                    this.addForm.cover = window.tools.getImgUrl(data.path)
                } else if (this.dialogEditVisible) {
                    this.editForm.cover = window.tools.getImgUrl(data.path)
                }
                console.debug ('image upload success', data)
            },
			submitEditForm() {
                if (this.longTermChecked) {
                    this.editForm.id_valid_date = 1
                }
				this.$refs.editForm.validate ((valid) => {
					if (valid) {
						cfProjectApi.update (this.editForm, (resp) => {
							this.loading = false
							this.dialogEditVisible = false
							window.tools.alertSuc (this.$i18n.t ('Action') + this.$i18n.t ('Success'))
							this.refresh ()
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
				this.$refs.addForm.validate ((valid) => {
					if (valid) {
						if (this.longTermChecked) {
                            this.addForm.id_valid_date = 1
                        }
						cfProjectApi.create (this.addForm, (resp) => {
							this.loading = false
							this.dialogAddVisible = false
							window.tools.alertSuc (this.$i18n.t ('Action') + this.$i18n.t ('Success'))
							this.refresh ()
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
                    uid: window.tools.getUID(),
                    title: '',
                    summary: '',
                    cover: '',
                    category_id: '',
                    tags: ''
				}
				this.dialogAddVisible = true
			},
			onEdit(row) {
				this.editForm.id = row.id
				this.editForm.title = row.title
				this.editForm.summary = row.summary
                this.editForm.content = row.content
				this.editForm.cover = row.cover
                this.editForm.category_id = row.category_id
                this.editForm.tags = row.tags
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
				articleApi.cate ({}, (respCate) => {
					this.category = respCate
                    articleApi.query (this.queryForm, (resp) => {
						console.debug ('resp ', resp)
						this.loading = false
						this.count = parseInt (resp.count)
						this.tableData = resp.list
					}, (resp) => {
						window.tools.alertError (resp.msg)
						this.loading = false
					})
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
				})

			}
		}
	}
</script>
