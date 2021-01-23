<style>
    .edit-form {
    }

    .edit-form .el-input {
        width: 320px;
    }
    .el-checkbox+.el-checkbox {
        margin-left: 0;
    }
</style>
<template>
    <div class="main-content by-clients padding-md-bottom padding-md-top">

        <el-button
                type="primary"
                size="mini"
                icon="by-icon by-shuaxin"
                :loading="loading"
                @click="refresh()">
            {{ $t('Refresh')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                check-strictly="true"
                :loading="loading"
                @click="onAdd()"
        >
            <span class="el-icon-plus"/>
            {{$t('Add')}}
        </el-button>

        <div class="grid-content margin-md-top">
            <el-table
                    ref="table"
                    v-loading="loading"
                    :data="list"
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
                        prop="client_secret"
                        width="120px"
                        :label="$t('ClientName')"
                >
                    <template slot-scope="scope">
                        ({{scope.row.project_id}}){{scope.row.client_name}}
                    </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="client_id"
                        width="120px"
                        :label="$t('ClientId')"
                />
                <el-table-column
                        prop="client_secret"
                        width="300px"
                        :label="$t('ClientSecret')"
                >
                    <template slot-scope="scope">
                        {{scope.row.client_secret}}&nbsp;&nbsp;&nbsp;<el-button size="mini" :loading="loading"
                                                                                @click.prevent="reset(scope.row.id)">
                        {{ $t('Reset') }}
                    </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="api_alg"
                        width="100px"
                        :label="$t('ClientAlg')"
                />
                <el-table-column
                        width="120px"
                        :label="$t('CreateTime')">
                    <template slot-scope="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd')}}
                    </template>
                </el-table-column>

                <el-table-column
                        width="200px"
                        :label="$t('Pay')">
                    <template slot-scope="scope">
                        <el-button class=""
                                   @click="onPayment(scope.row)"
                                   size="mini">
                            {{ $t('Payment') }}
                        </el-button>
                        <el-button class=""
                                   @click="onPayConfig(scope.row)"
                                   size="mini">
                            {{ $t('AliPay') }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button class=""
                                   @click="onEdit(scope.row)"
                                   icon="el-icon-edit"
                                   size="mini">
                            {{ $t('Edit') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Edit')"
                :visible.sync="dialogEditVisible"
        >
            <el-form label-position="left" label-width="160px" :model="editForm" size="mini" class="edit-form">
                <el-form-item :label="$t('ClientName')">
                    <el-input v-model="editForm.clientName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Project') + $t('ID')">
                    <el-input v-model="editForm.projectId"></el-input>
                </el-form-item>
                <el-form-item :label="$t('ClientAlg')">
                    <el-select v-model="editForm.clientAlg">
                        <el-option
                                v-for="item in algList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('ClientDayLimit')">
                    <el-input v-model="dailyLimitDesc"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="onSave" icon="by-icon by-Icon-baocun"> {{
                        $t('Save') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Add')"
                :visible.sync="dialogAddVisible"
        >
            <el-form label-position="left" label-width="160px" :model="addForm" size="mini" class="edit-form">
                <el-form-item :label="$t('ClientName')">
                    <el-input v-model="addForm.clientName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Project') + $t('ID')">
                    <el-input v-model="addForm.projectId"></el-input>
                </el-form-item>
                <el-form-item :label="$t('ClientAlg')">
                    <el-select v-model="addForm.clientAlg">
                        <el-option
                                v-for="item in algList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="onAddSave" icon="by-icon by-Icon-baocun"> {{ $t('Save') }}
                    </el-button>
                    <el-button @click="dialogAddVisible = false">
                        {{ $t('Cancel') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <!-- 支付宝配置 -->
        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Config')"
                :visible.sync="dialogPayConfigVisible"
        >
            <el-form label-position="left" label-width="160px" :model="payConfigForm" size="mini" class="edit-form">
                <el-form-item :label="$t('AppId')">
                    <el-input v-model="payConfigForm.app_id"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Mode')">
                    <el-input v-model="payConfigForm.mode"></el-input>
                </el-form-item>
                <el-form-item :label="$t('NotifyUrl')">
                    <el-input v-model="payConfigForm.notify_url"></el-input>
                </el-form-item>
                <el-form-item :label="$t('ReturnUrl')">
                    <el-input v-model="payConfigForm.return_url"></el-input>
                </el-form-item>
                <el-form-item :label="$t('AliPublicKey')">
                    <el-input :rows="8" type="textarea" v-model="payConfigForm.ali_public_key"></el-input>
                </el-form-item>
                <el-form-item :label="$t('UserPrivateKey')">
                    <el-input :rows="8" type="textarea" v-model="payConfigForm.private_key"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="onPayConfigSave" icon="by-icon by-Icon-baocun">
                        {{ $t('Save') }}
                    </el-button>
                    <el-button @click="dialogPayConfigVisible = false">
                        {{ $t('Cancel') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 支付通道配置 -->

        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('PaymentChannel')"
                :visible.sync="dialogPaymentVisible"
        >
            <el-form  :model="paymentForm" size="mini" class="edit-form">
                <el-form-item>
                    <div style="width: 200px;">
                        <el-checkbox-group v-model="checkPayment" size="small"  @change="handleChange">
                        <el-checkbox v-for="p in supportPayment" :label="p.code" :key="p.code">{{p.title}}({{p.desc}})</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="onPaymentSave" icon="by-icon by-Icon-baocun">
                        {{ $t('Save') }}
                    </el-button>
                    <el-button @click="dialogPaymentVisible = false">
                        {{ $t('Cancel') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>

</template>

<script>
    import api from '../../api/clientsApi'
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
                dialogEditVisible: false,
                dialogAddVisible: false,
                dialogPayConfigVisible: false,
                dialogPaymentVisible: false,
                algList: [
                    { id: 'nothing', label: 'None' },
                    { id: 'md5_v4', label: 'MD5 Version 4' }
                ],
                supportPayment: [],
                checkPayment: [],
                paymentForm: {
                    m_client_id: '',
                    value: ''
                },
                payConfigForm: {
                    app_id: '',
                    mode: '',
                    notify_url: '',
                    return_url: '',
                    ali_public_key: '',
                    private_key: ''
                },
                addForm: {
                    clientName: '',
                    apiAlg: 'nothing',
                    dailyLimit: 500,
                    projectId: ''
                },
                editForm: {
                    clientName: '',
                    apiAlg: 'nothing',
                    dailyLimit: 500,
                    projectId: ''
                },
                queryForm: {},
                list: [],
                count: 0,
                loading: false
            }
        },
        computed: {
            dailyLimitDesc: {
                get: function () {
                    if (this.editForm.dailyLimit === 0) {
                        return 'No Limit'
                    }
                    return this.editForm.dailyLimit
                },
                // setter
                set: function (newValue) {
                    if (window._.isInteger(parseInt(newValue))) {
                        this.editForm.dailyLimit = newValue
                    }
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
            handleChange(value) {
                console.debug(value);
            },
            onPaymentSave() {
                var that = this;
                this.paymentForm.value = this.checkPayment.join(",");
                this.loading = true
                api.updatePayment(this.paymentForm, (resp) => {
                    that.loading = false
                    that.dialogPaymentVisible = false
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    that.loading = false
                    that.dialogPaymentVisible = false
                });
            },
            onPayment(row) {
                this.dialogPaymentVisible = true
                this.loading = true
                this.paymentForm = {
                    m_client_id: row.client_id,
                    value: '',
                }
                var that = this;
                that.checkPayment = [];
                api.paymentList({m_client_id: row.client_id},  (resp) => {
                    console.debug(resp);
                    that.loading = false
                    that.supportPayment = resp;
                    that.supportPayment.forEach(e => {
                        if (e.enable == 1) {
                            that.checkPayment.push(e.code);
                        }
                    })
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            },
            onPayConfigSave () {

                var that = this;
                this.loading = true
                api.updatePayConfig(this.payConfigForm, (resp) => {
                    that.loading = false
                    that.dialogPayConfigVisible = false
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    that.loading = false
                    that.dialogPayConfigVisible = false
                });
            },
            onPayConfig (row) {
                this.dialogPayConfigVisible = true
                this.loading = true
                this.payConfigForm = {
                    m_client_id: row.client_id,
                    app_id: '',
                    mode: 'dev',
                    notify_url: '',
                    return_url: '',
                    ali_public_key: '',
                    private_key: ''
                }
                var that = this;
                api.payConfig({m_project_id: row.project_id, m_client_id: row.client_id},  (resp) => {
                    that.loading = false
                    that.payConfigForm.app_id = resp.app_id;
                    that.payConfigForm.mode = resp.mode;
                    that.payConfigForm.notify_url = resp.notify_url;
                    that.payConfigForm.return_url = resp.return_url;
                    that.payConfigForm.ali_public_key = resp.ali_public_key;
                    that.payConfigForm.private_key = resp.private_key;
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            },
            reset (id) {
                this.loading = true
                api.reset({ 'id': id }, (resp) => {
                    console.debug('resp ', resp)
                    this.loading = false
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            },
            onSave () {
                this.loading = true
                api.update({
                    'm_client_id': this.editForm.clientId,
                    'm_project_id': this.editForm.projectId,
                    'm_alg': this.editForm.clientAlg,
                    'day_limit': this.editForm.dailyLimit,
                    'client_name': this.editForm.clientName
                }, (resp) => {
                    this.dialogEditVisible = false
                    this.loading = false
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            },
            onAddSave () {
                api.create({
                    'm_project_id': this.addForm.projectId,
                    'm_alg': this.addForm.clientAlg,
                    // 'day_limit': this.addForm.dailyLimit,
                    'client_name': this.addForm.clientName
                }, (resp) => {
                    this.dialogAddVisible = false
                    this.loading = false
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            },
            onAdd () {
                this.addForm = {
                    clientName: '',
                    clientAlg: 'nothing',
                    dailyLimit: 500,
                    projectId: ''
                }
                this.dialogAddVisible = true
            },
            onEdit (row) {
                console.debug(row)
                this.editForm = Object.assign({
                    clientId: row.client_id,
                    clientName: row.client_name,
                    clientSecret: row.client_secret,
                    clientAlg: row.api_alg,
                    totalLimit: parseInt(row.total_limit),
                    dailyLimit: parseInt(row.day_limit),
                    projectId: row.project_id
                })
                this.dialogEditVisible = true
            },
            refresh () {
                // 刷新当前
                this.loading = true
                this.queryForm.uid = window.tools.getUID()
                this.queryForm.user_id = window.tools.getUID()
                api.query(this.queryForm, (resp) => {
                    console.debug('resp ', resp)
                    this.loading = false
                    this.list = resp
                    // this.editForm.apiAlg = resp.api_alg
                    // this.editForm.clientSecret = resp.client_secret
                    // this.editForm.clientId = resp.client_id
                    // this.editForm.clientName = resp.client_name
                    // this.editForm.clientAlg = resp.api_alg
                    // this.editForm.dailyLimit = resp.day_limit
                    // this.editForm.projectId = resp.project_id
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            }
        }
    }
</script>
