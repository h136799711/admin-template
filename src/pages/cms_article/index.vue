<style>
    .by-img-uploader .avatar {
        border-radius: 5px;
        margin: 0px;
    }

    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
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
                {{ $t('Refresh') }}
            </el-button>
            <el-button
                    type="primary"
                    size="mini"
                    :loading="loading"
                    @click="onAdd()"
            >
                <span class="el-icon-plus"/>
                {{ $t('Add') }}
            </el-button>
            <div class="margin-md">
                <label>{{ $t('Article') }}{{ $t('Status') }}</label>:
                <el-select
                        v-model="queryForm.status"
                        size="mini"
                        clearable
                        :placeholder="$t('All')"
                >
                    <el-option
                            key=""
                            value=""
                            :label="$t('All')"
                    />
                    <el-option
                            key="draft"
                            value="draft"
                            :label="$t('CmsArticle.draft')"
                    />
                    <el-option
                            key="published"
                            value="published"
                            :label="$t('CmsArticle.published')"
                    />
                </el-select>
                <label>{{ $t('Category') }}</label>:
                <el-select
                        v-model="queryForm.category_id"
                        size="mini"
                        clearable
                        :placeholder="$t('All')"
                >
                    <el-option
                            key=""
                            value=""
                            :label="$t('All')"
                    />
                    <el-option
                            v-for="item in category"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                    />
                </el-select>

                <el-button
                        type="primary"
                        size="mini"
                        :loading="loading"
                        @click="refresh"
                >
                    <span class="el-icon-search"/>
                    {{ $t('Search') }}
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
                            width="220px"
                            :label="$t('Title')"
                    >
                        <template #default="scope">
                            【{{ scope.row.cate_name }}】{{ scope.row.title }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="cover"
                            width="140px"
                            :label="$t('Cover')"
                    >
                        <template #default="scope">
                            <img
                                    v-if="scope.row.cover"
                                    alt="cover"
                                    :src="scope.row.cover"
                                    style="width:120px;height: auto;"
                            >
                            <span v-else>{{ $t('NoCover') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="come_from"
                            width="100px"
                            :label="$t('Source')"
                    >
                        <template #default="scope">
                            <div v-if="scope.row.source_url">
                                <a
                                        :href="scope.row.source_url"
                                        target="_blank"
                                >{{ scope.row.come_from }}</a>
                            </div>
                            <div v-else>
                                {{ scope.row.come_from }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="tags"
                            width="120px"
                            :label="$t('Tag')"
                    >
                        <template #default="scope">
                            {{ scope.row.tags }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="author_nick"
                            width="100px"
                            :label="$t('Author')"
                    >
                        <template #default="scope">
                            {{ scope.row.author_nick }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="views"
                            width="90px"
                            :label="$t('View')"
                    >
                        <template #default="scope">
                            {{ scope.row.views }}
                        </template>
                    </el-table-column>

                    <el-table-column
                            width="180px"
                            :label="$t('Status')"
                    >
                        <template #default="scope">
              <span>
                <el-button
                        v-if="scope.row.publish_status == 'draft'"
                        type="primary"
                        size="mini"
                        icon="by-icon by-shangjia"
                        @click="onPublish(scope.row.id)"
                >
                  {{ $t('Publish') }}
                </el-button>
                <el-button
                        v-if="scope.row.publish_status == 'published'"
                        size="mini"
                        icon="by-icon by-xiajia"
                        @click="onDraft(scope.row.id)"
                >{{ $t('draft') }}
                </el-button>
              </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            width="200px"
                            :label="$t('Action')"
                    >
                        <template #default="scope">
                            <el-button
                                    size="mini"
                                    icon="el-icon-edit"
                                    @click="onEdit(scope.row)"
                            >
                                {{ $t('Edit') }}
                            </el-button>
                            <el-button
                                    type="danger"
                                    size="mini"
                                    icon="el-icon-delete"
                                    @click="onDelete(scope.row.id)"
                            >
                                {{ $t('Delete') }}
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
        <div
                v-if="this.dialogEditVisible"
                class="edit-form"
        >
            <div class="">
                <h2>{{ $t('Edit') }}</h2>
            </div>
            <el-form
                    ref="editForm"
                    :status-icon="true"
                    :model="editForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        required
                        :label="$t('Title')"
                        prop="title"
                >
                    <el-input v-model="editForm.title"/>
                </el-form-item>
                <el-form-item
                        required
                        :label="$t('Source')"
                        prop="come_from"
                >
                    <el-input v-model="editForm.come_from"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Source') + 'Url'"
                >
                    <el-input v-model="editForm.source_url"/>
                </el-form-item>
                <el-form-item
                        required
                        :label="$t('Summary')"
                        prop="summary"
                >
                    <el-input
                            v-model="editForm.summary"
                            type="textarea"
                            rows="5"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('Category')"
                        prop="category"
                >
                    <el-select
                            v-model="editForm.category_id"
                            size="mini"
                            clearable
                            placeholder="请选择"
                    >
                        <el-option
                                v-for="item in category"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Cover')"
                        prop="cover"
                >
                    <ImgUploader
                            ref="editImgUploader"
                            :default-img-url="editForm.cover"
                            :clear="imgUploadClear"
                            img-type="cms_article"
                            @onUploadSuccess="onUploadSuccess"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('Tag')"
                        prop="tag"
                >
                    <el-tag
                            v-for="t in editForm.tags"
                            :key="t"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)"
                    >
                        {{ t }}
                    </el-tag>
                    <el-input
                            v-if="inputVisible"
                            ref="refEditTag"
                            v-model="inputValue"
                            class="input-new-tag"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                    />
                    <el-button
                            v-else
                            class="button-new-tag"
                            size="small"
                            @click="showInput"
                    >
                        {{ $t('Add') + $t('Tag') }}
                    </el-button>
                </el-form-item>

                <el-form-item
                        :label="$t('Content')"
                        prop="content"
                >
                    <v-md-editor :disabled-menus="[]"
                                 @upload-image="editorUploadImageForAdd" v-model="editForm.content"
                                 height="400px"></v-md-editor>
                </el-form-item>
            </el-form>
            <div>
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
        <div
                v-if="this.dialogAddVisible"
                class="add-form"
        >
            <div class="">
                <h2>{{ $t('Add') }}</h2>
            </div>
            <el-form
                    ref="addForm"
                    status-icon
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        required
                        :label="$t('Title')"
                        prop="title"
                >
                    <el-input v-model="addForm.title"/>
                </el-form-item>
                <el-form-item
                        required
                        :label="$t('Source')"
                        prop="come_from"
                >
                    <el-input v-model="addForm.come_from"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Source') + 'Url'"
                >
                    <el-input v-model="addForm.source_url"/>
                </el-form-item>
                <el-form-item
                        required
                        :label="$t('Summary')"
                        prop="summary"
                >
                    <el-input
                            v-model="addForm.summary"
                            type="textarea"
                            rows="5"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('Category')"
                        prop="category"
                >
                    <el-select
                            v-model="addForm.category_id"
                            size="mini"
                            clearable
                            placeholder="请选择"
                    >
                        <el-option
                                v-for="item in category"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Cover')"
                        prop="cover"
                >
                    <ImgUploader
                            ref="addImgUploader"
                            :default-img-url="addForm.cover"
                            :clear="imgUploadClear"
                            img-type="cms_article"
                            @onUploadSuccess="onUploadSuccess"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('Tag')"
                        prop="tag"
                >
                    <el-tag
                            v-for="t in addForm.tags"
                            :key="t"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)"
                    >
                        {{ t }}
                    </el-tag>
                    <el-input
                            v-if="inputVisible"
                            ref="refAddTag"
                            v-model="inputValue"
                            class="input-new-tag"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                    />
                    <el-button
                            v-else
                            class="button-new-tag"
                            size="small"
                            @click="showInput"
                    >
                        {{ $t('Add') }}{{ $t('Tag') }}
                    </el-button>
                </el-form-item>
                <el-form-item
                        :label="$t('Content')"
                        prop="content"
                >
                    <v-md-editor :disabled-menus="[]"
                                 @upload-image="editorUploadImageForAdd" v-model="addForm.content"
                                 height="400px"></v-md-editor>
                </el-form-item>
            </el-form>
            <div
                    class="dialog-footer"
            >
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
    import ImgUploader from '../../components/img-uploaderV3.vue'

    export default {
        components: {
            ImgUploader,
        },
        data () {
            return {
                inputVisible: false,
                inputValue: '',
                imgUploadClear: false,
                pickerOptions2: {},
                queryForm: {
                    status: '',
                    category_id: '',
                    title: '',
                    contain_detail: 1,
                    page_index: 1, // 当前页码
                    page_size: 10
                },
                category: [],
                addForm: {
                    title: '',
                    summary: '',
                    cover: '',
                    source_url: '',
                    category_id: '',
                    tags: [],
                    content: '',
                    come_from: ''
                },
                editForm: {
                    id: 0,
                    title: '',
                    summary: '',
                    source_url: '',
                    cover: '',
                    category_id: '',
                    tags: [],
                    content: '',
                    come_from: ''
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
                        { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
                        { min: 1, max: 48, message: this.$i18n.t('String Length Between', [1, 48]), trigger: 'blur' }
                    ],
                    target_money: [
                        { required: true, message: '目标金额不能为空' },
                        { type: 'number', message: '目标金额必须为数字值' }
                    ],
                    cate_id: [
                        { required: true, message: this.$i18n.t('Please Input') + ' ' + this.$i18n.t('Category') }
                    ]
                }
            }
        },
        computed: {},
        watch: {
            dialogAddVisible (newVal) {
                if (!newVal) {
                    this.imgUploadClear = true
                }
            },
            dialogEditVisible (newVal) {
                // if (!newVal) {
                // this.imgUploadClear = true
                // }
            }
        },
        created () {
        },
        mounted: function () {
            this.refresh()
        },
        methods: {
            onPublish (id) {
                this.loading = true
                articleApi.publish({ id: id }, (resp) => {
                    this.loading = false
                    window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp)
                    this.loading = false
                })
            },
            onDraft (id) {
                this.loading = true
                articleApi.draft({ id: id }, (resp) => {
                    this.loading = false
                    window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp)
                    this.loading = false
                })
            },
            showInput () {
                this.inputVisible = true
                // this.$nextTick(_ => {
                //   if (this.dialogAddVisible) {
                //     this.$refs.refAddTag.$refs.input.focus()
                //   } else if (this.dialogEditVisible) {
                //     this.$refs.refEditTag.$refs.input.focus()
                //   }
                // })
            },
            handleInputConfirm () {
                let inputValue = this.inputValue
                if (inputValue) {
                    this.inputVisible = false
                    this.inputValue = ''
                    if (this.dialogAddVisible) {
                        for (let t in this.addForm.tags) {
                            if (this.addForm.tags[t] == inputValue) {
                                return
                            }
                        }
                        this.addForm.tags.push(inputValue)
                    } else if (this.dialogEditVisible) {
                        for (let t in this.editForm.tags) {
                            if (this.editForm.tags[t] == inputValue) {
                                return
                            }
                        }
                        this.editForm.tags.push(inputValue)
                    }
                }
            },
            handleClose (tag) {
                if (this.dialogAddVisible) {
                    this.addForm.tags.splice(this.addForm.tags.indexOf(tag), 1)
                } else if (this.dialogEditVisible) {
                    this.editForm.tags.splice(this.editForm.tags.indexOf(tag), 1)
                }
            },
            onDelete (id) {
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
                            articleApi.delete({ id: id }, (resp) => {
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
                }).then(() => {
                    console.debug('[ajax]')
                }).catch(() => {
                })
            },
            editorUploadImageForAdd (event, insertImage, files) {
                console.debug('编辑器图片文件', files, insertImage)
                if (!files || files.length === 0) {
                    window.tools.alertInfo('请选择文件')
                    return
                }
                fileApi.upload(files[0], 'cms_article').then(({ data }) => {
                    console.debug(data)
                    if (data.code === 0) {
                        let imgUrl = data.data.oss_key
                        insertImage({
                            url: imgUrl,
                            desc: '图片',
                        })
                    } else {
                        window.tools.alertError(data.msg)
                    }
                }).catch((reason) => {
                    window.tools.alertError(reason)
                })
            },
            editorUploadImageForEdit (event, insertImage, files) {
                console.debug('编辑器图片文件', files, insertImage)
                if (!files || files.length === 0) {
                    window.tools.alertInfo('请选择文件')
                    return
                }
                fileApi.upload(files[0], 'cms_article').then(({ resp }) => {
                    if (resp.code === 0) {
                        let imgUrl = resp.data.oss_key

                        insertImage({
                            url: imgUrl,
                            desc: '',
                        })
                    } else {
                        window.tools.alertError(data.msg)
                    }
                }).catch((reason) => {
                    window.tools.alertError(reason)
                })
            },
            onUploadSuccess (data) {
                if (this.dialogAddVisible) {
                    this.addForm.cover = data.trim(',')
                } else if (this.dialogEditVisible) {
                    this.editForm.cover = data.trim(',')
                }
                console.debug('image upload success', data)
            },
            submitEditForm () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let data = Object.assign({}, this.editForm)
                        data.tags = data.tags.join(',')
                        articleApi.update(data, (resp) => {
                            this.loading = false
                            this.dialogEditVisible = false
                            window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                            this.refresh()
                        }, (resp) => {
                            window.tools.alertError(resp)
                            this.loading = false
                        })
                    } else {
                        return false
                    }
                })
            },
            submitAddForm () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        let data = Object.assign({}, this.addForm)
                        data.tags = data.tags.join(',')
                        articleApi.create(data, (resp) => {
                            this.loading = false
                            this.dialogAddVisible = false
                            window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                            this.refresh()
                        }, (resp) => {
                            window.tools.alertError(resp)
                            this.loading = false
                        })
                    } else {
                        return false
                    }
                })
            },
            onAdd () {
                this.addForm = {
                    uid: window.tools.getUID(),
                    title: '',
                    summary: '',
                    source_url: '',
                    cover: '',
                    category_id: '',
                    tags: [],
                    content: '',
                    come_from: ''
                }
                this.dialogAddVisible = true
            },
            onEdit (row) {
                this.editForm.id = row.id
                this.editForm.come_from = row.come_from
                this.editForm.title = row.title
                this.editForm.summary = row.summary
                this.editForm.content = row.content
                this.editForm.cover = row.cover
                this.editForm.source_url = row.source_url
                this.editForm.category_id = row.category_id
                this.editForm.tags = row.tags.length > 0 ? row.tags.split(',') : []
                this.dialogEditVisible = true
            },
            byPagerSizeChange (val) {
                this.queryForm.page_size = val
                this.refresh()
            },
            byPagerCurrentChange (val) {
                this.queryForm.page_index = val
                this.refresh()
            },
            refresh () {
                // 刷新当前
                this.tableData = []
                this.loading = true
                articleApi.cate({}, (respCate) => {
                    this.category = respCate
                    articleApi.query(this.queryForm, (resp) => {
                        console.debug('resp ', resp)
                        this.loading = false
                        this.count = parseInt(resp.count)
                        this.tableData = resp.list
                    }, (resp) => {
                        window.tools.alertError(resp)
                        this.loading = false
                    })
                }, (resp) => {
                    window.tools.alertError(resp)
                    this.loading = false
                })
            }
        }
    }
</script>
