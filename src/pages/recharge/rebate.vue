<style>
    .blue {
        color: blue;
    }
</style>
<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <div v-if="!(this.dialogEditVisible || this.dialogAddVisible || this.dialogGiveVisible)">
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
                            width="140px"
                            prop="money"
                            :label="$t('Money')"
                    >
                        <template #default="scope">{{ scope.row.money}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="140px"
                            prop="rebate"
                            :label="$t('Rebate')"
                    >
                        <template #default="scope">
                            {{scope.row.rebate}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            fixed="right"
                            :label="$t('Action')">
                        <template #default="scope">
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
        </div>

        <!-- Edit Form -->
        <div class="edit-form" v-if="this.dialogEditVisible">
            <div class=""><h2>{{$t('Edit')}}</h2></div>

            <el-form
                    class="margin-md-top"
                    ref="editForm"
                    :model="editForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Money')"
                        required>
                    <el-input size="mini" v-model="editForm.money" placeholder="充值金额"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Rebate')"
                        required>
                    <el-input size="mini" v-model="editForm.rebate" placeholder="返利金额"/>
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
                    class="margin-md-top"
                    ref="addForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >


                <el-form-item
                        :label="$t('Money')"
                        required>
                    <el-input size="mini" v-model="addForm.money" placeholder="充值金额"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Rebate')"
                        required>
                    <el-input size="mini" v-model="addForm.rebate" placeholder="返利金额"/>
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
    import rebateApi from "../../api/rebateApi";

    export default {
        components: {},
        data() {
            return {
                dialogGiveVisible: false,
                dialogAddVisible: false,
                dialogEditVisible: false,
                inputVisible: false,
                queryForm: {},
                rules: {
                    title: [
                        {required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur'},
                        {min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur'}
                    ]
                },
                count: 0,
                tableData: [],
                addForm: {
                    money: 0,
                    rebate: 0,
                },
                editForm: {
                    id: '',
                    money: 0,
                    rebate: 0,
                },
                loading: false,
            }
        },
        computed: {},
        watch: {},
        created() {

        },
        mounted() {
            this.refresh()
        },
        methods: {
            onDelete(id) {
                let that = this;
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
                            rebateApi.delete({id: id}).finally(function () {
                                instance.confirmButtonLoading = false
                                that.refresh();
                                done()
                            });
                        } else {
                            done()
                        }
                    }
                }).then(() => {
                }).catch(() => {
                })
            },
            onAdd() {
                this.addForm = {
                    money: 0,
                    rebate: 0
                };
                this.dialogAddVisible = true
            },
            onEdit(resp) {
                this.editForm.id = resp.id;
                this.editForm.money = resp.money;
                this.editForm.rebate = resp.rebate;
                this.dialogEditVisible = true;
            },
            submitEditForm() {
                let that = this
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        let data = Object.assign({}, this.editForm)
                        data.money = this.editForm.money * 100;
                        data.rebate = this.editForm.rebate * 100;
                        rebateApi.edit(data).then(function () {
                            window.tools.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
                        }).finally(function () {
                                that.loading = false
                                that.dialogEditVisible = false
                                that.refresh()
                        })
                    } else {
                        return false;
                    }
                });
            },
            submitAddForm() {
                let that = this
                this.$refs.addForm.validate((valid) => {
                    if (valid) {

                        let data = Object.assign({}, this.addForm)
                        data.money = this.addForm.money * 100;
                        data.rebate = this.addForm.rebate * 100;
                        this.loading = true;
                        rebateApi.create(data).then(function () {
                            window.tools.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
                        }).finally(function () {
                            that.loading = false
                            that.dialogAddVisible = false
                            that.refresh()
                        })
                    } else {
                        return false;
                    }
                });
            },
            async refresh() {
                // 刷新当前
                // this.tableData = [];
                this.loading = true;
                let that = this;
                try {
                    let data = await rebateApi.query(that.queryForm);
                    data.forEach(element => {
                        element.money = (element.money / 100).toFixed(2);
                        element.rebate = (element.rebate / 100).toFixed(2);
                    });
                    that.tableData = data;
                    that.loading = false
                } catch (err) {
                    console.debug(err);
                    window.tools.alertError(err);
                    that.loading = false
                }
            }
        }
    }
</script>
