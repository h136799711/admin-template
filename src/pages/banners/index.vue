<style>
    .banner-img {
        width: 120px;
        height: auto;
    }

</style>
<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <div>
            <el-form
                    :inline="true"
                    :model="queryForm"
                    class="demo-form-inline"
            >
                <el-form-item>
                    <el-select
                            v-model="queryForm.position"
                            size="mini"
                    >
                        <el-option
                                key=""
                                :label="$t('All')"
                                value=""
                        />
                        <el-option
                                v-for="item in positionOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                        />
                    </el-select>
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
        </div>
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
                        width="120px"
                        prop="title"
                        :label="$t('Title')"
                >
                    <template #default="scope">
                        <p>{{ scope.row.title }}</p>
                        <el-image class="banner-img" :src="getImgUrl(scope.row.img_url)" />
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$t('JumpUrl')"
                >
                    <template #default="scope">
                        <a
                                v-if="scope.row.jump_type === 'url' "
                                :href="scope.row.jump_url"
                                target="_blank"
                        >
                            [{{ scope.row.jump_type }}]{{ scope.row.jump_url }}
                        </a>
                        <span v-else="scope.row.jump_type !== 'url' ">[{{ scope.row.jump_type }}]{{ scope.row.jump_url }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        width="120px"
                        :label="$t('Sort')"
                >
                    <template #default="scope">
                        {{ scope.row.sort }}
                    </template>
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('CreatedBy')"
                >
                    <template #default="scope">
                        {{ ifLoginUser(scope.row.uid) }}
                    </template>
                </el-table-column>
                <el-table-column
                        width="140px"
                        :label="$t('Showing')"
                >
                    <template #default="scope">
                        <span style="display:inline-block;width: 36px;">From</span> {{ (new Date(scope.row.start_time *
                        1000)).format('yyyy-MM-dd') }} <br>
                        <span style="display:inline-block;width: 36px;">To</span> {{ (new Date(scope.row.end_time *
                        1000)).format('yyyy-MM-dd') }}
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
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)"
                        >
                            {{ $t('Edit') }}
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
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

        <el-dialog
                v-model="dialogAddVisible"
                :show-close="false"
                :append-to-body="false"
                :title="$t('Add')"
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
                        prop="title"
                >
                    <el-input v-model="addForm.title"/>
                </el-form-item>

                <el-form-item
                        required
                        :label="$t('Position')"
                        prop="position"
                >
                    <el-select v-model="addForm.position">
                        <el-option
                                v-for="item in positionOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Image')"
                        prop="image"
                >
                    <ImgUploader
                            :clear="imgUploadClear"
                            img-type="banner"
                            oss_type="qiniu"
                            show="local"
                            default-img-url=""
                            @onUploadSuccess="onUploadSuccess"
                    />
                </el-form-item>
                <el-form-item
                        style="display: none"
                        :label="$t('Width') + '&' +$t('Height') "
                        prop="w"
                >
                    <el-col :span="11">
                        <el-form-item prop="w">
                            <el-input v-model="addForm.w"/>
                        </el-form-item>
                    </el-col>
                    <el-col
                            class="text-center"
                            :span="2"
                    >
                        X
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="h">
                            <el-input v-model="addForm.h"/>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item
                        :label="$t('DateRange')"
                        prop="start_time"
                >
                    <el-date-picker
                            v-model="date_range"
                            type="daterange"
                            :shortcuts="shortcuts"

                            range-separator="-"
                            :start-placeholder="$t('StartDate')"
                            :end-placeholder="$t('EndDate')"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('JumpUrl')"
                        prop="jumpUrl"
                >
                    <el-input v-model="addForm.jump_url"/>
                </el-form-item>
                <el-form-item
                        :label="$t('JumpType')"
                        prop="jumpType"
                >
                    <el-select v-model="addForm.jump_type">
                        <el-option
                                v-for="item in jumpTypeOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number
                            v-model="addForm.sort"
                            :min="0"
                            :max="100000"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div
                        class="dialog-footer"
                >
                <el-button @click="this.dialogAddVisible = false">
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
            >
                <el-form-item
                        :label="$t('Title')"
                        required
                        prop="title"
                >
                    <el-input v-model="editForm.title"/>
                </el-form-item>

                <el-form-item
                        required
                        :label="$t('Position')"
                        prop="position"
                >
                    <el-select v-model="editForm.position">
                        <el-option
                                v-for="item in positionOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Image')"
                        prop="image"
                >
                    <ImgUploader
                            ref="editImgUploader"
                            :default-img-url="editForm.img_url"
                            oss_type="qiniu"
                            :clear="imgUploadClear"
                            img-type="banner"
                            show="all"
                            @onUploadSuccess="onUploadSuccess"
                    />
                </el-form-item>
                <el-form-item
                        style="display: none"
                        :label="$t('Width') + '&' +$t('Height') "
                        prop="w"
                >
                    <el-col :span="11">
                        <el-form-item prop="w">
                            <el-input v-model="editForm.w"/>
                        </el-form-item>
                    </el-col>
                    <el-col
                            class="text-center"
                            :span="2"
                    >
                        X
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="h">
                            <el-input v-model="editForm.h"/>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item
                        :label="$t('DateRange')"
                        prop="start_time"
                >
                    <el-date-picker
                            v-model="date_range"
                            type="daterange"
                            :shortcuts="shortcuts"
                            range-separator="-"
                            :start-placeholder="$t('StartDate')"
                            :end-placeholder="$t('EndDate')"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('JumpUrl')"
                        prop="jumpUrl"
                >
                    <el-input v-model="editForm.jump_url"/>
                </el-form-item>
                <el-form-item
                        :label="$t('JumpType')"
                        prop="jumpType"
                >
                    <el-select v-model="editForm.jump_type">
                        <el-option
                                v-for="item in jumpTypeOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number
                            v-model="editForm.sort"
                            :min="0"
                            :max="100000"
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
            <template #footer>
                <div
                        class="dialog-footer"
                >
                <el-button @click="this.dialogEditVisible = false">
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
    </div>
</template>

<script>
    import api from '../../api/bannersApi'
    import {dbhTool} from '@peter_xiter/dbh-js-tools'
    import ImgUploader from '../../components/img-uploaderV3.vue'

    export default {
        components: {
            ImgUploader
        },
        data () {
            return {
                imgUploadClear: false,
                shortcuts: [{
                    text: this.$i18n.t('OneYear'),
                    value: (() => {
                        const end = new Date()
                        const start = new Date()
                        end.setTime(end.getTime() + 3600 * 1000 * 24 * 365)
                        return [start, end]
                    })()
                },
                    {
                        text: this.$i18n.t('ThreeYear'),
                        value: (() => {
                            const end = new Date()
                            const start = new Date()
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 365 * 3)
                            return [start, end]
                        })()
                    }
                ]
                ,
                inputVisible: false,
                inputValue: '',
                jumpTypeOptions: [
                    { code: 'url', name: this.$i18n.t('Url') },
                    { code: 'out_url', name: this.$i18n.t('Absolute') + this.$i18n.t('Url') }
                ],
                positionOptions: [],
                queryForm: {
                    position: '',
                    page_index: 1,
                    page_size: 10
                },
                addForm: {
                    title: '',
                    position: '',
                    sort: 0,
                    jump_url: '',
                    jump_type: '',
                    img: {}
                },
                editForm: {
                    title: ''
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
            let that = this
            console.log(that.queryForm)
            api.queryPosition({}, (resp) => {
                console.debug(resp)
                if (resp.length > 0) {
                    console.log(that)
                    // that.queryForm.position = resp[0].code
                    that.positionOptions = resp
                }
                that.refresh()
            }, (resp) => {
                window.dbh.alertError(resp)
                that.loading = false
            })
        },
        mounted () {
            console.debug('index mounted')
        },
        methods: {
            getImgUrl (url) {
                return dbhTool.getImgUrl(url)
            },
            onDelete (id) {
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.dbh.vue_instance.$i18n.t('Processing').value

                            api.delete({ id: id }, (res) => {
                                instance.confirmButtonLoading = false
                                this.refresh()
                                done()
                            }, (res) => {
                                console.debug(res)
                                done()
                                window.dbh.alertError(res.msg)
                                instance.confirmButtonLoading = false
                            })
                        } else {
                            done()
                        }
                    }
                }).then(() => {
                }).catch(() => {
                })
            },
            onUploadSuccess (data) {
                if (this.dialogAddVisible) {
                    this.addForm.img_url = data.trim(',');
                    this.addForm.w = 0
                    this.addForm.h = 0
                } else if (this.dialogEditVisible) {
                    this.editForm.img_url = data.trim(',');
                    this.editForm.w = 0
                    this.editForm.h = 0
                }
            },
            ifLoginUser (uid) {
                return uid === dbhTool.getUID() ? 'You' : 'Other'
            },
            submitEditForm () {
              this.editForm.start_time = this.date_range[0].getTime() / 1000
              this.editForm.end_time = this.date_range[1].getTime() / 1000
              this.editForm.w = 0
              this.editForm.h = 0
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
                this.addForm.start_time = this.date_range[0].getTime() / 1000
                this.addForm.end_time = this.date_range[1].getTime() / 1000
                this.addForm.w = 0
                this.addForm.h = 0
                console.debug(this.addForm)
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        api.create(this.addForm, (resp) => {
                            this.loading = false
                            this.dialogAddVisible = false
                            window.dbh.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                            this.refresh()
                        }, (resp) => {
                            this.loading = false
                            window.dbh.alertError(resp)
                        })
                    } else {
                        return false
                    }
                })
            },
            onAdd () {
                this.date_range = [new Date(), new Date(Date.now() + 365 * 3 * 24 * 3600 * 1000)]
                this.addForm = {
                    title: '',
                    position: '',
                    sort: 0,
                    img_url: '',
                    jump_url: '',
                    jump_type: 'url',
                    user_id: 0
                }
                this.addForm.user_id = dbhTool.getUID()
                this.dialogAddVisible = true
            },
            onEdit (row) {
                this.date_range = [new Date(row.start_time * 1000), new Date(row.end_time * 1000)]
                this.editForm = {
                    position: row.position,
                    sort: row.sort,
                    img_url: row.img_url,
                    jump_url: row.jump_url,
                    jump_type: row.jump_type,
                    user_id: dbhTool.getUID(),
                    w: row.w,
                    h: row.h
                }
                this.editForm.id = row.id
                this.editForm.title = row.title
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
