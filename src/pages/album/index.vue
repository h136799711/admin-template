<template>
    <div class="main-content by-album padding-md-bottom padding-md-top">
        <el-form
                :inline="true"
                :model="queryForm"
        >
            <el-form-item>
                <el-input
                        v-model="queryForm.title"
                        size="mini"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                        :loading="loading"
                        type="primary"
                        size="mini"
                        icon="el-icon-search"
                        @click="refresh()"
                >
                    {{ $t('Search') }}
                </el-button>
            </el-form-item>
        </el-form>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                :loading="loading"
                @click="onAdd()"
        >
            {{ $t('Add') }}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                icon="by-icon by-shuaxin"
                :loading="loading"
                @click="refresh()"
        >
            {{ $t('Refresh') }}
        </el-button>

        <div class="grid-content ">
            <el-table
                    ref="table"
                    v-loading="loading"
                    :data="tableData"
                    stripe
                    sortable="custom"
                    :element-loading-text="$t('Loading')"
                    style="width: 100%"
            >
                <el-table-column type="expand">
                    <template #default="props">
                        <el-row type="flex">
                            <el-col
                                    v-for="p in props.row.photos"
                                    :key="p.id"
                                    :span="6"
                            >
                                <a
                                        :href="p.photo_uri"
                                        target="_blank"
                                >
                                    <img
                                            :src="p.photo_uri"
                                            class="margin-sm"
                                            style="width: 120px;height: auto;"
                                    >
                                </a>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="id"
                        width="80px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="160px"
                        prop="title"
                        :label="$t('Title')"
                />
                <!--<el-table-column-->
                <!--width="160px"-->
                <!--prop="description"-->
                <!--:label="$t('Description')"-->
                <!--/>-->
                <el-table-column
                        prop="source"
                        :label="$t('Source')"
                />
                <el-table-column
                        width="100px"
                        prop="cate.title"
                        :label="$t('Category')"
                />
                <el-table-column
                        prop="total"
                        :label="$t('Total')"
                />
                <el-table-column
                        prop="views"
                        :label="$t('View')"
                />
                <el-table-column
                        width="160px"
                        :label="$t('CreateTime')"
                >
                    <template #default="scope">
                        {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd') }}
                    </template>
                </el-table-column>

                <el-table-column
                        width="200px"
                        fixed="right"
                        :label="$t('Action')"
                >
                    <template #default="scope">
                        <el-button
                                size="mini"
                                icon="by-icon by-xiangce"
                                @click="onPhotoManage(scope.row.id)"
                        >
                            {{ $t('Photo') }}
                        </el-button>
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)"
                        >
                            {{ $t('Edit') }}
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

        <el-dialog
                v-model="dialogEditVisible"
                :show-close="false"
                :append-to-body="false"
                :title="$t('Edit')"
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
                        prop="title"
                >
                    <el-input v-model="editForm.title"/>
                </el-form-item>

                <el-form-item
                        :label="$t('Category')"
                        prop="cate_id"
                >
                    <el-select v-model="editForm.cate_id">
                        <el-option
                                v-for="item in category"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Source')"
                        prop="source"
                >
                    <el-select v-model="editForm.source">
                        <el-option
                                v-for="item in sourceOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Description')"
                        prop="desc"
                >
                    <el-input
                            v-model="editForm.desc"
                            type="textarea"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('Tag')"
                        prop="tags"
                >
                    <el-tag
                            v-for="tag in dynamicTags"
                            :key="tag"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)"
                    >
                        {{ tag }}
                    </el-tag>
                    <el-input
                            v-if="inputVisible"
                            ref="saveTagInput"
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
                        + New Tag
                    </el-button>
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
            <template #footer>
                <div
                        class="dialog-footer"
                >
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
            </template>
        </el-dialog>

        <!-- Add Form -->
        <el-dialog
                v-model="dialogAddVisible"
                :show-close="false"
                :append-to-body="false"
                :title="$t('Add')"
        >
            <el-form
                    ref="addForm"
                    status-icon
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Title')"
                        prop="title"
                >
                    <el-input v-model="addForm.title"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Category')"
                        prop="cate_id"
                >
                    <el-select v-model="addForm.cate_id">
                        <el-option
                                v-for="item in category"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Source')"
                        prop="source"
                >
                    <el-select v-model="addForm.source">
                        <el-option
                                v-for="item in sourceOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Description')"
                        prop="desc"
                >
                    <el-input
                            v-model="addForm.desc"
                            type="textarea"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('Tag')"
                        prop="tags"
                >
                    <el-tag
                            v-for="tag in dynamicTags"
                            :key="tag"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)"
                    >
                        {{ tag }}
                    </el-tag>
                    <el-input
                            v-if="inputVisible"
                            ref="saveTagInput"
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
                        + New Tag
                    </el-button>
                </el-form-item>
            </el-form>
            <template #footer>
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
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../api/albumApi'

    export default {
        components: {},
        data () {
            return {
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                sourceOptions: [
                    { value: 'Internet', label: this.$i18n.t('Internet') },
                    { value: 'Original', label: this.$i18n.t('Original') }
                ],
                category: [],
                queryForm: {
                    title: '',
                    page_index: 1,
                    page_size: 10
                },
                addForm: {
                    title: '',
                    source: 'Internet'
                },
                editForm: {
                    title: '',
                    source: 'Internet'
                },
                rules: {
                    title: [
                        { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
                        { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ]
                },
                count: 0,
                tableData: [],
                loading: false,
                dialogAddVisible: false,
                dialogEditVisible: false,
                dialogPhotoVisible: false
            }
        },
        computed: {},
        watch: {
            dynamicTags: function (oldVal, newVal) {
                if (this.dialogAddVisible) {
                    this.addForm.tags = this.dynamicTags.join(',')
                }
                if (this.dialogEditVisible) {
                    this.editForm.tags = this.dynamicTags.join(',')
                }
            }
        },
        created () {
            api.queryAllCategory({}, (resp) => {
                this.category = resp
                this.refresh()
            }, (resp) => {
                window.dbh.alertError(resp)
                this.loading = false
            })
        },
        mounted: function () {
            // this.refresh();
        },
        methods: {
            onPhotoManage (id) {
                this.$router.push({ path: 'photo/' + id })
            },
            handleClose (tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
            },
            showInput () {
                this.inputVisible = true
                this.$nextTick(() => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },

            handleInputConfirm () {
                let inputValue = this.inputValue.trim()
                if (inputValue) {
                    this.dynamicTags.push(inputValue)
                }
                this.inputVisible = false
                this.inputValue = ''
            },
            submitEditForm () {
                api.update(this.editForm, (resp) => {
                    this.loading = false
                    this.dialogEditVisible = false
                    this.refresh()
                }, (resp) => {
                    window.dbh.alertError(resp)
                    this.loading = false
                    this.dialogEditVisible = false
                })
            },
            submitAddForm () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        api.create(this.addForm, (resp) => {
                            this.loading = false
                            this.dialogAddVisible = false
                            window.dbh.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                            this.refresh()
                        }, (resp) => {
                            window.dbh.alertError(resp)
                            this.loading = false
                        })
                    } else {
                        return false
                    }
                })
            },
            onAdd () {
                this.dynamicTags = []
                this.addForm = {
                    title: '',
                    desc: '',
                    source: 'Internet',
                    tags: '',
                    cate_id: ''
                }
                this.dialogAddVisible = true
            },
            onEdit (row) {
                this.editForm.id = row.id
                this.editForm.title = row.title
                this.editForm.desc = row.description
                this.editForm.source = row.source
                this.editForm.cate_id = row.cate.id
                this.dynamicTags = []
                for (let tag in row.tags) {
                    this.dynamicTags.push(row.tags[tag].title)
                }
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
                api.query(this.queryForm, (resp) => {
                    console.debug('resp ', resp)
                    this.loading = false
                    this.count = parseInt(resp.count)
                    this.tableData = resp.list
                }, (resp) => {
                    window.dbh.alertError(resp)
                    this.loading = false
                })
            }
        }
    }
</script>
