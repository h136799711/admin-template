<style>
    .tip {
        float: left;
        width: 78px;
    }
</style>
<template>
    <div class="main-content by-users padding-md-bottom padding-md-top">
        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="queryForm.mobile" :placeholder="$t('Mobile')"/>
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
                        width="160px"
                        prop="title"
                        :label="$t('Mobile')"
                >
                    <template slot-scope="scope">
                        ({{scope.row.country_no}}) {{scope.row.mobile}}
                        <div v-if="scope.row.mobile_auth == 1" class="el-text-success">
                            <el-alert
                                    class="alert-small tip"
                                    effect="dark"
                                    :closable="false"
                                    title="已验证"
                                    show-icon
                                    type="success">
                            </el-alert>
                        </div>
                        <div v-else>
                            <el-alert
                                    class="alert-small tip"
                                    show-icon
                                    :closable="false"
                                    effect="dark"
                                    title="未验证"
                                    type="warning">
                            </el-alert>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        prop="title"
                        :label="$t('Email')"
                >
                    <template slot-scope="scope">
                        {{scope.row.email}}
                        <div v-if="scope.row.email_auth == 1" class="el-text-success">
                            <el-alert
                                    class="alert-small tip"
                                    effect="dark"
                                    :closable="false"
                                    title="已验证"
                                    show-icon
                                    type="success">
                            </el-alert>
                        </div>
                        <div v-else>
                            <el-alert
                                    class="alert-small tip"
                                    show-icon
                                    :closable="false"
                                    effect="dark"
                                    title="未验证"
                                    type="warning">
                            </el-alert>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                        width="200px"
                        :label="$t('Time')">
                    <template slot-scope="scope">
                        {{ $t('RegTime')}}: {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd
                        hh:mm:ss')}}<br/>
                        {{$t('LastLoginTime')}}:{{(new Date(scope.row.last_login_time * 1000)).format('yyyy-MM-dd
                        hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="180px"
                        :label="$t('Ip')">
                    <template slot-scope="scope">
                        {{ $t('RegIp')}}: {{ numberToIp(scope.row.reg_ip) }}<br/>
                        {{ $t('LastLoginIp')}}: {{ numberToIp(scope.row.last_login_ip) }}
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
                        <el-switch
                                @change="onDisableEnable(scope.row)"
                                v-model="scope.row.status"
                                :active-value="1"
                                :inactive-value="0"
                        >
                        </el-switch>
                        <span v-if="scope.row.status == 1">{{$t('Enable')}}</span>
                        <span v-else>{{$t('Disable')}}</span>
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
                :modal-append-to-body="false"
                :title="$t('Add')"
                :visible.sync="dialogAddVisible"
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
                        prop="title">
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
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Image')"
                        prop="image"
                >
                    <ImgUploader @onUploadSuccess="onUploadSuccess" :clear="imgUploadClear" imgType="banner"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Width') + '&' +$t('Height') "
                        prop="w"
                >
                    <el-col :span="11">
                        <el-form-item prop="w">
                            <el-input v-model="addForm.w"/>
                        </el-form-item>
                    </el-col>
                    <el-col class="text-center" :span="2">X</el-col>
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
                            v-model="addForm.date_range"
                            type="daterange"
                            :picker-options="pickerOptions2"
                            range-separator="-"
                            value-format="timestamp"
                            :start-placeholder="$t('StartDate')"
                            :end-placeholder="$t('EndDate')">
                    </el-date-picker>
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
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number v-model="addForm.sort" :min="0" :max="100000"></el-input-number>
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
            >

                <el-form-item
                        :label="$t('Title')"
                        required
                        prop="title">
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
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Image')"
                        prop="image"
                >
                    <ImgUploader ref="editImgUploader" @onUploadSuccess="onUploadSuccess"
                                 :defaultImgUrl="editForm.img_url" :clear="imgUploadClear" imgType="banner"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Width') + '&' +$t('Height') "
                        prop="w"
                >
                    <el-col :span="11">
                        <el-form-item prop="w">
                            <el-input v-model="editForm.w"/>
                        </el-form-item>
                    </el-col>
                    <el-col class="text-center" :span="2">X</el-col>
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
                            v-model="editForm.date_range"
                            type="daterange"
                            :picker-options="pickerOptions2"
                            range-separator="-"
                            value-format="timestamp"
                            :start-placeholder="$t('StartDate')"
                            :end-placeholder="$t('EndDate')">
                    </el-date-picker>
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
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number v-model="editForm.sort" :min="0" :max="100000"></el-input-number>
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
    import api from '../../api/userApi'
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
        data () {
            return {
                imgUploadClear: false,
                pickerOptions2: {
                    shortcuts: [{
                        text: this.$i18n.t('OneYear'),
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 365)
                            picker.$emit('pick', [start, end])
                        }
                    },
                        {
                            text: this.$i18n.t('ThreeYear'),
                            onClick (picker) {
                                const end = new Date()
                                const start = new Date()
                                end.setTime(end.getTime() + 3600 * 1000 * 24 * 365 * 3)
                                picker.$emit('pick', [start, end])
                            }
                        }
                    ]
                },
                inputVisible: false,
                inputValue: '',
                jumpTypeOptions: [
                    { code: 'url', name: this.$i18n.t('Url') },
                    { code: 'out_url', name: this.$i18n.t('Absolute') + this.$i18n.t('Url') }
                ],
                positionOptions: [],
                queryForm: {
                    mobile: '',
                    page_index: 1,
                    page_size: 10
                },
                addForm: {},
                editForm: {},
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
            this.refresh()
        },
        mounted () {
            console.debug('index mounted')
        },
        methods: {
            numberToIp (number) {
                return (Math.floor(number / (256 * 256 * 256))) + '.' +
                    (Math.floor(number % (256 * 256 * 256) / (256 * 256))) + '.' +
                    (Math.floor(number % (256 * 256) / 256)) + '.' +
                    (Math.floor(number % 256))
            },
            getImgUrl (url) {
                return window.tools.getImgUrl(url)
            },
            onEnable (id) {
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

                            api.enable({ id: id }, (res) => {
                                instance.confirmButtonLoading = false
                                this.refresh()
                                done()
                            }, (res) => {
                                console.debug(res)
                                done()
                                window.tools.alertError(res.msg)
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
            onDisableEnable (row) {
                if (row.status == 0) {
                    this.onEnable(row.id)
                } else {
                    this.onDisable(row.id)
                }
            },
            onDisable (id) {
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

                            api.disable({ id: id }, (res) => {
                                instance.confirmButtonLoading = false
                                this.refresh()
                                done()
                            }, (res) => {
                                console.debug(res)
                                done()
                                window.tools.alertError(res.msg)
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
                    this.addForm.img_url = this.getImgUrl(data.path)
                    this.addForm.w = data.w
                    this.addForm.h = data.h
                } else if (this.dialogEditVisible) {
                    this.editForm.img_url = this.getImgUrl(data.path)
                    this.editForm.w = data.w
                    this.editForm.h = data.h
                }
                console.debug('image upload success', data)
            }
            ,
            ifLoginUser (uid) {
                return uid === window.tools.getUID() ? 'You' : 'Other'
            }
            ,
            submitEditForm () {
                api.update(this.editForm, (resp) => {
                    this.loading = false
                    this.dialogEditVisible = false
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                    this.dialogEditVisible = false
                })
            }
            ,
            submitAddForm () {
                console.log(this.addForm)
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        api.create(this.addForm, (resp) => {
                            this.loading = false
                            this.dialogAddVisible = false
                            window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                            this.refresh()
                        }, (resp) => {
                            this.loading = false
                            window.tools.alertError(resp.msg)
                        })
                    } else {
                        return false
                    }
                })
            }
            ,
            onAdd () {
                this.addForm = {
                    title: '',
                    position: '',
                    sort: 0,
                    date_range: '',
                    img_url: '',
                    jump_url: '',
                    jump_type: 'url',
                    user_id: 0
                }
                this.addForm.user_id = window.tools.getUID()
                this.dialogAddVisible = true
            }
            ,
            onEdit (row) {

                this.editForm = {
                    position: row.position,
                    sort: row.sort,
                    start_time: row.start_time,
                    end_time: row.end_time,
                    date_range: [row.start_time * 1000, row.end_time * 1000],
                    img_url: tools.getImgUrl(row.img_url),
                    jump_url: row.jump_url,
                    jump_type: row.jump_type,
                    user_id: window.tools.getUID(),
                    w: row.w,
                    h: row.h
                }
                if (this.$refs.editImgUploader) {
                    this.$refs.editImgUploader.imageUrl = this.editForm.img_url
                } else {
                    // this.$nextTick(function () {
                    // this.$refs.editImgUploader.imageUrl = this.editForm.img_url
                    // })
                }
                this.editForm.id = row.id
                this.editForm.title = row.title
                this.dialogEditVisible = true
            }
            ,
            byPagerSizeChange (val) {
                this.queryForm.page_size = val
                this.refresh()
            }
            ,
            byPagerCurrentChange (val) {
                this.queryForm.page_index = val
                this.refresh()
            }
            ,
            refresh () {
                // 刷新当前
                this.tableData = []
                this.loading = true
                api.queryByPagingNoCount(this.queryForm, (resp) => {
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
