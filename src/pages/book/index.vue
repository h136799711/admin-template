<style>
    .bookCover {
        width: 144px;
        height: 240px;
    }
    .summary {
        height: 5rem;
        line-height: 1rem;
        width: 100%;
        text-overflow: ellipsis;
        word-break: break-word;
    }
    .text-center {
        text-align: center;
    }
</style>
<template>
    <div class="main-content by-album padding-md-bottom padding-md-top">

        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item >
                    <el-select size="mini" v-model="queryForm.cate_id" placeholder="请选择">
                        <el-option
                                :key="0"
                                label="全部"
                                :value="0">
                        </el-option>
                        <el-option
                                v-for="item in category"
                                :key="item.id"
                                :label="item.cate_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input size="mini" :placeholder="$t('Title')" v-model="queryForm.book_name"/>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="refresh()" size="mini" icon="el-icon-search">{{
                        $t('Search') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
                <el-button
                        type="primary"
                        size="mini"
                        @click="onManage()">
                    书籍状态管理
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
                        class="text-center"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="80px"
                        prop="thumbnail"
                        :label="$t('Cover')">
                    <template #default="scope">
                        <img :src="scope.row.thumbnail" class="margin-sm" style="width: 60px;height: 90px;" alt="cover"/>
                    </template>
                </el-table-column>
                <el-table-column
                        width="140px"
                        prop="title"
                        :label="$t('Title')"
                />

                <el-table-column
                        width="160px"
                        prop="summary"
                        :label="$t('Description')"
                >
                <template #default>
                    <div class="summary">{{scope.row.summary}}</div>
                </template>
                </el-table-column>
                <el-table-column
                        width="100px"
                        prop="cate_name"
                        :label="$t('Category')">
                    <template #default="scope">
                        {{scope.row.cate_name}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="140px"
                        :label="$t('CreateTime')">
                    <template #default="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd')}}
                    </template>
                </el-table-column>
<!--                <el-table-column-->
<!--                        width="160px"-->
<!--                        :label="$t('Recommend')">-->
<!--                    <template #default>-->
<!--                        <el-switch-->
<!--                                size="mini"-->
<!--                                style="display: block"-->
<!--                                :active-value="1"-->
<!--                                :inactive-value="0"-->
<!--                                v-model="scope.row.recommend"-->
<!--                                :active-text="$t('Recommend')"-->
<!--                                @change="onRecommend(scope.row.id, scope.row.recommend)"-->
<!--                        >-->
<!--                        </el-switch>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column
                        width="160px"
                        :label="$t('State')">
                    <template #default="scope">
                        <el-button
                                v-if="scope.row.state == 0"
                                size="mini"
                                icon="el-icon-top"
                                @click="SetEnd(scope.row.id)">
                            {{$t('Set') + $t('WritingEnd')}}
                        </el-button>
                        <el-button
                                v-if="scope.row.state == 1"
                                size="mini"
                                icon="el-icon-bottom"
                                @click="SetWriting(scope.row.id)">
                            {{$t('Set') + $t('Writing')}}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onViewChapter(scope.row)">
                            查看章节(默认来源)
                        </el-button>
                        <el-button
                                size="mini"
                                icon="el-icon-s-data"
                                @click="onBookSource(scope.row.id)">
                            {{$t('Source')}}
                        </el-button>
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
                    @current-change="byPagerCurrentChange"/>
        </div>

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
                    class="edit-form"
            >

                <el-form-item
                        :label="$t('Title')"
                        prop="title">
                    {{editForm.title}}
                </el-form-item>
                <el-form-item
                        :label="$t('Description')"
                        prop="description"
                >
                    <el-input v-model="editForm.summary" :rows="5" type="textarea"/>
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
    </div>
</template>

<script>
    import api from '../../api/bookApi'




    export default {
        components: {
        },
        data () {
            return {
                imgUploadClear: false,
                inputVisible: false,
                inputValue: '',
                category: [],
                queryForm: {
                    cate_id: 0,
                    book_name: '',
                    page_index: 1,
                    page_size: 10
                },
                editForm: {
                    id: 0,
                    title: '',
                    cate_name: '',
                    author_name: '',
                    author_id: '',
                    summary: '',
                    thumbnail: '',
                    cate_id: 1,
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
                dialogEditVisible: false
            }
        },
        computed: {},
        watch: {
            dialogEditVisible (newVal) {
                // if (!newVal) {
                //     this.imgUploadClear = true
                // }
            }
        },
        created () {
            this.loading = true
            api.category({ gender: -1 }, (resp) => {
                this.category = resp
                this.refresh()
            }, (resp) => {
                window.tools.alertError(resp.msg)
                this.loading = false
            })
        },
        mounted: function () {
            // this.refresh();
        },
        methods: {
            onManage() {
                this.$router.push({ path: 'manage' })
            },
            onViewChapter (row) {
                this.$router.push({ path: 'pages2/' + row.def_source_type_id + '/' + row.id })
            },
            showInput () {
                this.inputVisible = true
                this.$nextTick(_ => {
                    if (this.dialogAddVisible) {
                        this.$refs.refAddTag.$refs.input.focus()
                    } else if (this.dialogEditVisible) {
                        this.$refs.refEditTag.$refs.input.focus()
                    }
                })
            },
            SetEnd (id) {
                api.setState({ id: id, state: 1 }, (resp) => {
                    this.loading = false
                    this.dialogEditVisible = false
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                    this.dialogEditVisible = false
                })
            },
            SetWriting (id) {
                api.offShelves({ id: id, state: 0 }, (resp) => {
                    this.loading = false
                    this.dialogEditVisible = false
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                    this.dialogEditVisible = false
                })
            },
            onBookSource (id) {
                this.$router.push({ path: 'source/' + id })
            },
            getCateName (cateId) {
                for (let index in this.category) {
                    let cate = this.category[index]
                    if (parseInt(cate.id) === parseInt(cateId)) {
                        return cate.title
                    }
                }
                return ''
            },
            onEdit (row) {
                console.log('row', row)
                this.editForm.id = row.id
                this.editForm.title = row.title
                this.editForm.summary = row.summary
                this.editForm.thumbnail = row.thumbnail
                this.editForm.cate_id = parseInt(row.cate_id)
                this.editForm.cate_name = row.cate_name
                this.editForm.author_name = row.author_name
                this.editForm.author_id = row.author_id
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
                api.search(this.queryForm, (resp) => {
                    console.debug('resp ', resp)
                    this.loading = false
                    this.count = parseInt(resp.count)
                    this.tableData = resp.list
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            }
        }
    }
</script>
