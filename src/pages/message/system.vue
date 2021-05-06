<style>
    .read {
        color: #999999;
    }

    .read .el-button--text {
        color: #999999;
    }

    .message-time {
        text-align: center;
    }

    .el-dialog--center .el-dialog__body {
        padding: 5px;
    }

</style>
<template>
    <div class="main-content by-policy padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                :loading="loading"
                @click="refresh()">
            {{ $t('Refresh')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                icon="by-icon by-plus"
                @click="onAdd()">
            {{ $t('Add')}}
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
                        width="200px"
                        :label="$t('Title')">
                    <template #default="scope">
                        {{scope.row.title}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="summary"
                        :label="$t('Summary')"/>

                <el-table-column
                        :label="$t('Time')">
                    <template #default="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>


                <el-table-column
                        :label="$t('Action')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                @click="onEdit(scope.row)">
                            {{$t('Edit')}}
                        </el-button>
                        <el-button
                                type="danger"
                                size="mini"
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
                    @current-change="byPagerCurrentChange"/>
        </div>

        <!-- View Dialog -->
        <el-dialog
                :show-close="true"
                center
                :append-to-body="false"
                :title="viewForm.title"
                v-model="dialogViewVisible"
        >
            <i class="el-icon-loading" v-if="viewForm.loading"></i>
            <div v-if="!viewForm.loading" class="message-time">
                {{(new Date(this.viewForm.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
            </div>
            <div class="message-content" v-html="viewForm.content">
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
                    ref="addForm"
                    :model="addForm"
                    label-position="right"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Title')"
                        prop="title">
                    <el-input v-model="addForm.title"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Summary')">
                    <el-input type="textarea" rows="5" v-model="addForm.summary"/>
                </el-form-item>
<!--                <el-form-item-->
<!--                        :label="$t('Content')">-->
<!--                    <el-input type="textarea" rows="5" v-model="addForm.content"/>-->
<!--                </el-form-item>-->

            </el-form>
            <template #footer>
            <div  class="dialog-footer">
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



        <!-- Edit Form -->
        <el-dialog
                :show-close="false"
                :append-to-body="false"
                :title="$t('Edit')"
                v-model="dialogEditVisible"
        >
            <el-form
                    status-icon
                    ref="editForm"
                    :model="editForm"
                    label-position="right"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Title')"
                        prop="title">
                    <el-input v-model="editForm.title"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Summary')">
                    <el-input type="textarea" rows="5" v-model="editForm.summary"/>
                </el-form-item>
<!--                <el-form-item-->
<!--                        :label="$t('Content')">-->
<!--                    <el-input type="textarea" rows="5" v-model="editForm.content"/>-->
<!--                </el-form-item>-->

            </el-form>
            <template #footer>
            <div  class="dialog-footer">
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
    import api from '../../api/msgApi'

    export default {
        components: {
        },
        data() {
            return {
                viewForm: {
                    loading: true
                },
                addForm: {
                    title: '',
                    summary: '',
                    content: '',
                },
                editForm: {
                    id: 0,
                    title: '',
                    summary: '',
                    content: '',
                },
                queryForm: {
                    page_index: 1,
                    page_size: 10
                },
                count: 0,
                tableData: [],
                loading: false,
                dialogViewVisible: false,
                dialogAddVisible: false,
                dialogEditVisible: false
            }
        },
        computed: {},
        watch: {
        },
        created() {
            this.refresh();
        },
        mounted: function () {
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
                            api.delete({ id: id }).finally(function () {
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
                this.dialogAddVisible = true;
                this.addForm.title = '';
                this.addForm.summary = '';
                this.addForm.content = '';
            },
            onEdit(row) {
                this.dialogEditVisible = true;
                this.editForm.id = row.id;
                this.editForm.title = row.title;
                this.editForm.summary = row.summary;
                this.editForm.content = row.content;
            },
            async submitAddForm() {
                try {
                    this.loading = true;
                    let resp = await api.createSystem(this.addForm);
                    this.refresh();
                } catch (e) {
                    window.tools.alertError(e.message)
                } finally {
                    this.loading = false;
                    this.dialogAddVisible = false;
                }
                // this.$refs.addForm.validate((valid) => {
                //     if (valid) {
                //     } else {
                //         return false
                //     }
                // })
            },
            async submitEditForm() {
                try {
                    this.loading = true;
                    let resp = await api.editMessage(this.editForm);
                    this.refresh();
                } catch (e) {
                    window.tools.alertError(e.message)
                } finally {
                    this.loading = false;
                    this.dialogEditVisible = false;
                }
            },
            byPagerSizeChange(val) {
                this.queryForm.page_size = val;
                this.refresh()
            },
            byPagerCurrentChange(val) {
                this.queryForm.page_index = val;
                this.refresh()
            },
            async refresh() {
                // 刷新当前
                // this.tableData = [];
                this.loading = true;
                try {
                    let resp = await api.querySystem(this.queryForm);
                    this.count = parseInt(resp.count);
                    this.tableData = resp.list;
                } catch (e) {
                    window.tools.alertError(e.message)
                } finally {
                    this.loading = false
                }
            }
        }
    }
</script>
