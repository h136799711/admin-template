<template>
    <div class="main-content by-policy padding-md-bottom padding-md-top">
        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item>
                    <el-input size="mini" v-model="queryForm.username" :placeholder="$t('Please Input') + ' '+ $t('Username')"/>
                </el-form-item>
                <el-form-item>
                    <el-select size="mini" v-model="queryForm.audit_status">
                        <el-option
                                v-for="item in algList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="query()" size="mini"
                               icon="el-icon-search">{{ $t('Search') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

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
                        width="120px"
                        prop="username"
                        :label="$t('Username')"
                />
                <el-table-column
                        width="100px"
                        prop="amount"
                        :label="$t('Amount')">
                <template slot-scope="scope">
                    <span>{{ $t('Amount') }}: <el-tag type="primary" size="mini">{{scope.row.amount}}</el-tag></span><br/>
                    <span>{{ $t('Fee')}}: <el-tag type="primary" size="mini">{{scope.row.fee}}</el-tag></span>
                </template>
                </el-table-column>
                <el-table-column
                        width="280px"
                        :label="$t('Card')">
                    <template slot-scope="scope">
                        <span>{{ $t('Name') }}: <el-tag type="primary" size="mini">{{scope.row.name}}</el-tag></span><br/>
                        <span>{{ $t('Account') }}: <el-tag type="primary" size="mini">{{scope.row.account_no}}</el-tag></span>
                    </template>
                </el-table-column>
                <el-table-column
                        width="280px"
                        :label="$t('Information')">
                    <template slot-scope="scope">
                        <span>Email: {{scope.row.account_email}}</span><br/>
                        <span>Phone: {{scope.row.account_mobile}}</span><br/>
                        <span>Company: {{scope.row.account_company}}</span><br/>
                        <span>Branch Company Or IFSC: {{scope.row.account_branch_company}}</span><br/>
                    </template>
                </el-table-column>


                <el-table-column
                        width="200px"
                        :label="$t('Extra')">
                    <template slot-scope="scope">
                        <el-tag type="primary">{{scope.row.to_wallet_info}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        width="180px"
                        prop="create_time"
                        :label="$t('CreateTime')"/>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.audit_status==0"
                                   size="mini"
                                   @click="onPass(scope.row.id)">
                            {{$t('Pass')}}
                        </el-button>
                        <el-button v-if="scope.row.audit_status==0"
                                   size="mini"
                                   @click="onDeny(scope.row.id)">
                            {{$t('Deny')}}
                        </el-button>
                        <span v-else>
                            {{ auditStatus(scope.row.audit_status)}}<br/>
                            {{ scope.row.reply}}
                        </span>
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


        <!-- Reply Form -->
        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Reply')"
                :visible.sync="dialogReplyVisible"
        >
            <el-form
                    status-icon
                    ref="replyForm"
                    :model="replyForm"
                    label-position="right"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Reason')"
                >
                    <el-input v-model="replyForm.reply" type="textarea" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
                <el-button @click="dialogReplyVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        :loading="loading"
                        type="primary"
                        @click="submitReplyForm()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../api/widthdrawApi'
    import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
    import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
    import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

    export default {
        components: {
            ElForm,
            ElButtonGroup,
            ElButton
        },
        data () {
            return {
                algList: [
                    { id: 99, label: this.$i18n.t('All') },
                    { id: 0, label: this.$i18n.t('NotReviewed') },
                    { id: 1, label: this.$i18n.t('Passed') },
                    { id: -1, label: this.$i18n.t('Rejected') }
                ],
                algList2: [
                    { id: 1, label: this.$i18n.t('Passed') },
                    { id: -1, label: this.$i18n.t('Rejected') }
                ],
                cateList: [],
                queryForm: {
                    username: '',
                    audit_status: 0,
                    page_index: 1,
                    page_size: 10
                },
                replyForm: {
                    id: 0,
                    reply: '',
                },
                audit_status: '',
                count: 0,
                tableData: [],
                loading: false,
                dialogReplyVisible: false
            }
        },
        computed: {},
        watch: {
            // "queryForm.audit_status": function(oldVal, newVal) {
            //   this.query(newVal);
            // }
        },
        created () {
            this.query()
        },
        mounted: function () {
        },
        methods: {
            auditStatus(audit_status) {
                if (audit_status == 1) {
                    return this.$i18n.t('Passed')
                } else if (audit_status == 0) {
                    return  this.$i18n.t('NotReviewed')
                } else {
                    return this.$i18n.t('Rejected')
                }
            },
            submitReplyForm() {
                api.deny(this.replyForm, (resp) => {
                    this.loading = false
                    this.dialogReplyVisible = false
                    window.tools.alertSuc (this.$i18n.t('Action') + this.$i18n.t('Success'))
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError (resp.msg)
                    this.loading = false
                })
            },
            onDeny(id) {
                this.replyForm.id = id;
                this.replyForm.reply = '管理员拒绝提现';
                this.dialogReplyVisible = true
            },
            // onDeny (id) {
            //     this.$confirm (this.$i18n.t('Action Confirm'), this.$t('Alert'), {
            //         confirmButtonText: this.$i18n.t('Confirm'),
            //         cancelButtonText: this.$i18n.t('Cancel'),
            //         type: 'warning',
            //         beforeClose: (action, instance, done) => {
            //             if (action === 'confirm') {
            //                 instance.confirmButtonLoading = true
            //                 instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
            //
            //                 api.deny({id: id}, (res) => {
            //                     instance.confirmButtonLoading = false
            //                     this.refresh()
            //                     done()
            //                 }, (res) => {
            //                     console.debug (res)
            //                     done()
            //                     window.tools.alertError (res.msg)
            //                     instance.confirmButtonLoading = false
            //                 })
            //             } else {
            //                 done()
            //             }
            //         }
            //     }).then (() => {
            //     }).catch (() => {
            //     })
            // },
            onPass (id) {
                this.$confirm (this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

                            api.pass({id: id}, (res) => {
                                instance.confirmButtonLoading = false
                                this.refresh()
                                done()
                            }, (res) => {
                                console.debug (res)
                                done()
                                window.tools.alertError (res.msg)
                                instance.confirmButtonLoading = false
                            })
                        } else {
                            done()
                        }
                    }
                }).then (() => {
                }).catch (() => {
                })
            },
            byPagerSizeChange (val) {
                this.queryForm.page_size = val
                this.query()
            },
            byPagerCurrentChange (val) {
                this.queryForm.page_index = val
                this.query()
            },
            query () {
                this.loading = true
                api.query(
                    this.queryForm,
                    resp => {
                        console.debug('resp ', resp)
                        this.loading = false
                        this.count = parseInt(resp.count)
                        this.tableData = resp.list
                        this.tableData.forEach(element => {
                            // element.to_wallet_info = element.to_wallet_info
                            element.amount = (Number(element.amount) / 100).toFixed(2)
                            element.fee = (Number(element.fee) / 100).toFixed(2)
                            element.create_time = (new Date(element.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')
                        })
                    },
                    resp => {
                        window.tools.alertError(resp.msg)
                        this.loading = false
                    }
                )
            },
            refresh () {
                // 刷新当前
                (this.queryForm = {
                    username: '',
                    audit_status: 0,
                    page_index: 1,
                    page_size: 10
                }),
                    (this.tableData = [])
                this.query()
            }
        }
    }
</script>
