<template>
    <div class="main-content by-cate padding-md-bottom ">
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
                        width="160px"
                        prop="title"
                        :label="$t('Title')"
                >
                    <template #default="scope">
                        {{ scope.row.title }}
                    </template>
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('Sort')"
                >
                    <template #default="scope">
                        {{ scope.row.display_sort }}
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')"
                >
                    <template #default="scope">
                        <el-button
                                size="mini"
                                icon="by-icon by-pinpai"
                                @click="onRelateGoods(scope.row)"
                        >
                            {{ $t('Relate') }}{{ $t('Goods') }}
                        </el-button>

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

        <el-dialog
                :append-to-body="false"
                v-model="dialogAddVisible"
                :show-close="false"
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
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number
                            v-model="addForm.display_sort"
                            :min="0"
                            :max="100000"
                    />
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

        <el-dialog

                :append-to-body="false"
                v-model="dialogEditVisible"
                :show-close="false"
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
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number
                            v-model="editForm.display_sort"
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
    </div>
</template>

<script>
    import dtCateApi from '../../api/dtCateApi'

    export default {
        components: {},
        data () {
            return {
                queryForm: {},
                addForm: {
                    title: '',
                    display_sort: 0
                },
                editForm: {
                    title: '',
                    display_sort: 0
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
        watch: {},
        created () {

        },
        mounted () {
            this.refresh()
        },
        methods: {
            onRelateGoods (row) {
                this.$router.push({ path: '/admin/cate/relate_goods/' + row.id })
            },
            onDelete (id) {
                let that = this
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

                            dtCateApi.delete({ id: id }).then((res) => {
                                instance.confirmButtonLoading = false
                                that.refresh()
                                done()
                            }).catch((res) => {
                                console.debug(res)
                                done()
                                window.tools.alertError(res)
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
            submitEditForm () {
                dtCateApi.update(this.editForm).then((resp) => {
                    this.loading = false
                    this.dialogEditVisible = false
                    this.refresh()
                }).catch((resp) => {
                    window.tools.alertError(resp)
                    this.loading = false
                    this.dialogEditVisible = false
                })
            },
            submitAddForm () {
                let that = this
                console.log(this.addForm)
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        dtCateApi.add(this.addForm).then((resp) => {
                            that.loading = false
                            that.dialogAddVisible = false
                            window.tools.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
                            that.refresh()
                        }).catch((resp) => {
                            that.loading = false
                            window.tools.alertError(resp)
                        })
                    } else {
                        return false
                    }
                })
            },
            onAdd () {
                this.addForm = {
                    title: '',
                    display_sort: 0
                }
                this.dialogAddVisible = true
            },
            onEdit (row) {
                this.editForm = {
                    display_sort: row.display_sort,
                    id: row.id,
                    title: row.title,
                }
                this.dialogEditVisible = true
            },
            refresh () {
                // 刷新当前
                this.tableData = []
                this.loading = true
                let that = this
                dtCateApi.query(that.queryForm).then((resp) => {
                    that.tableData = resp
                }).catch((resp) => {
                    window.tools.alertError(resp)
                }).finally(() => {
                    that.loading = false
                })
            }
        }
    }
</script>
