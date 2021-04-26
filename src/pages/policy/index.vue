<template>
    <div class="main-content by-policy padding-md-bottom padding-md-top">

        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item>
                    <el-input size="mini" v-model="queryForm.name"/>
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
                        width="60px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="160px"
                        prop="name"
                        :label="$t('Name')"
                />
                <el-table-column
                        width="180px"
                        prop="note"
                        :label="$t('Note')"/>
                <el-table-column
                        width="120px"
                        :label="$t('Action')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)">
                            {{$t('Edit')}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        prop="statements"
                        :label="$t('Statements')">
                    <template #default="scope">
                        <el-popover trigger="hover" width="400px"  placement="top">
                            <template #reference>
                                <el-tag type="success" size="medium">{{ $t('Policy') }}</el-tag>
                            </template>
                            <vue-json-pretty
                                    :path="'res'"
                                    :deep="8"
                                    :data="JSON.parse(scope.row.statements)"
                            >
                            </vue-json-pretty>
                        </el-popover>
                    </template>

                </el-table-column>
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
                        :label="$t('Name')"
                        prop="name">
                    <el-input v-model="editForm.name"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Statements')"
                        prop="statements"
                >
                    <el-input :rows="8" type="textarea" v-model="formattedStatements"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Note')"
                        prop="note"
                >
                    <el-input v-model="editForm.note" type="textarea"/>
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
                        @click="onSave()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </el-dialog>

        <!-- Add Form -->
        <el-dialog
                :show-close="false"
                :append-to-body="false"
                :title="$t('Add')"
                v-model="dialogAddVisible"
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
                        required
                        :label="$t('Name')"
                        prop="name">
                    <el-input v-model="addForm.name"/>
                </el-form-item>
                <el-form-item
                        required
                        :label="$t('Statements')"
                        prop="statements"
                >
                    <el-input :rows="8" type="textarea" v-model="addForm.statements"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Note')"
                        prop="note"
                >
                    <el-input v-model="addForm.note" type="textarea"/>
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
    </div>
</template>

<script>
    import api from '../../api/policyApi'
    import VueJsonPretty from 'vue-json-pretty'

    export default {
        components: {
            VueJsonPretty
        },
        data () {
            var validateStatements = (rule, value, callback) => {
                if (!this.isJsonString(value)) {
                    callback(new Error(this.$i18n.t('JsonFormatString')))
                } else {
                    callback()
                }
            }
            return {
                queryForm: {
                    name: '',
                    page_index: 1,
                    page_size: 10
                },
                addForm: {
                    note: '',
                    statements: '',
                    name: ''
                },
                editForm: {
                    note: '',
                    statements: '',
                    id: 0,
                    name: ''
                },
                rules: {
                    name: [
                        { required: true, message: this.$i18n.t('Please Input Name'), trigger: 'blur' },
                        { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ],
                    statements: [
                        { validator: validateStatements, trigger: 'blur' },
                        { required: true, message: this.$i18n.t('Please Input Statements'), trigger: 'change' }
                    ],
                    notes: [
                        { min: 0, max: 250, message: this.$i18n.t('String Length Between', [0, 250]), trigger: 'blur' }
                    ]
                },
                count: 0,
                tableData: [],
                loading: false,
                dialogAddVisible: false,
                dialogEditVisible: false,
                selectTableRowId: '' // 选中的表格行id
            }
        },
        computed: {
            formattedStatements: {
                get: function () {
                    if (this.isJsonString(this.editForm.statements)) {
                        return JSON.stringify(JSON.parse(this.editForm.statements), null, 4)
                    } else {
                        return this.editForm.statements
                    }
                },
                set: function (newValue) {
                    this.editForm.statements = newValue
                }
            }
        },
        watch: {},
        created () {
            this.refresh()
        },
        mounted: function () {
        },
        methods: {
            isJsonString (str) {
                try {
                    if (typeof JSON.parse(str) === 'object') {
                        return true
                    }
                } catch (e) {
                }
                return false
            },
            onSave () {
                api.update(this.editForm, (resp) => {
                    this.loading = false
                    this.dialogEditVisible = false
                    window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                    this.dialogEditVisible = false
                })
            },
            submitAddForm () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.addForm.statements = JSON.stringify(JSON.parse(this.addForm.statements))
                        api.create(this.addForm, (resp) => {
                            this.loading = false
                            this.dialogAddVisible = false
                            window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                            this.refresh()
                        }, (resp) => {
                            window.tools.alertError(resp.msg)
                            this.loading = false
                        })
                    } else {
                        return false
                    }
                })
            },
            onAdd () {
                this.addForm = {
                    note: '',
                    statements: '',
                    name: ''
                }
                this.dialogAddVisible = true
            },
            onEdit (row) {
                this.editForm = row
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
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            }
        }
    }
</script>
