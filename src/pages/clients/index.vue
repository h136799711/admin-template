<style>
    .edit-form {
    }

    .el-checkbox + .el-checkbox {
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
                @click="refresh()"
        >
            {{ $t('Refresh') }}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                check-strictly="true"
                :loading="loading"
                @click="onAdd()"
        >
            <span class="el-icon-plus"/>
            {{ $t('Add') }}
        </el-button>
      <div>
        用户公私钥生成(格式 PKCS8)可参考 支付宝的  https://opendocs.alipay.com/open/291/105971
      </div>

        <div class="grid-content margin-md-top">
            <el-table
                    ref="table"
                    v-loading="loading"
                    :data="list"
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
                    <template #default="scope">
                        ({{ scope.row.project_id }}){{ scope.row.client_name }}
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
                    <template #default="scope">
                        {{ scope.row.client_secret }}&nbsp;&nbsp;&nbsp;<el-button
                            size="mini"
                            :loading="loading"
                            @click.prevent="reset(scope.row)"
                    >
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
                        :label="$t('CreateTime')"
                >
                    <template #default="scope">
                        {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd') }}
                    </template>
                </el-table-column>

                <el-table-column
                        width="300px"
                        :label="$t('Config')"
                >
                    <template #default="scope">

                        <el-button
                                class=""
                                size="mini"
                                @click="onPayment(scope.row)"
                        >
                            {{ $t('Payment') }}
                        </el-button>
                      <el-button
                              class=""
                              size="mini"
                              @click="onPayConfig(scope.row)"
                      >
                        {{ $t('AliPay') }}
                      </el-button>
                      <el-button
                              class=""
                              size="mini"
                              @click="onWeixinPayConfig(scope.row)"
                      >
                        {{ $t('Weixin') }}
                      </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$t('Action')"
                >
                    <template #default="scope">
                        <el-button
                                class=""
                                icon="el-icon-edit"
                                size="mini"
                                @click="onEdit(scope.row)"
                        >
                            {{ $t('Edit') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog
                v-model="dialogEditVisible"
                :show-close="false"
                :title="$t('Edit')"
        >
            <el-form
                    label-position="left"
                    label-width="160px"
                    :model="editForm"
                    size="mini"
                    class="edit-form"
            >
                <el-form-item :label="$t('ClientName')">
                    <el-input v-model="editForm.clientName"/>
                </el-form-item>
                <el-form-item :label="$t('UserPublicKey')">
                    <el-input type="textarea" rows="5" v-model="editForm.user_public_key"/>
                </el-form-item>
                <el-form-item :label="$t('UserPrivateKey')">
                    <el-input type="textarea" rows="8" v-model="editForm.user_private_key"/>
                </el-form-item>

                <el-form-item :label="$t('SysPublicKey')">
                    <el-button
                            :loading="loading"
                            type="primary"
                            icon="by-icon by-Icon-baocun"
                            @click="onResetSysRsaKey"
                    > 重置平台证书
                    </el-button>
                    <el-input class="margin-md-top" type="textarea" disabled rows="8"
                              v-model="editForm.sys_public_key"/>
                </el-form-item>
                <!--                <el-form-item :label="$t('Project') + $t('ID')">-->
                <!--                    <el-input v-model="editForm.projectId"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item :label="$t('ClientAlg')">-->
                <!--                    <el-select v-model="editForm.clientAlg">-->
                <!--                        <el-option-->
                <!--                                v-for="item in algList"-->
                <!--                                :key="item.id"-->
                <!--                                :label="item.label"-->
                <!--                                :value="item.id">-->
                <!--                        </el-option>-->
                <!--                    </el-select>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item :label="$t('ClientDayLimit')">-->
                <!--                    <el-input v-model="dailyLimitDesc"></el-input>-->
                <!--                </el-form-item>-->
            </el-form>

            <template #footer>
        <span class="dialog-footer">
          <el-button
                  :loading="loading"
                  type="primary"
                  icon="by-icon by-Icon-baocun"
                  @click="onSave"
          > {{ $t('Save') }}
          </el-button>
        </span>
            </template>
        </el-dialog>

        <el-dialog
                v-model="dialogAddVisible"
                :show-close="false"
                :append-to-body="false"
                :title="$t('Add')"
        >
            <el-form
                    label-position="left"
                    label-width="160px"
                    :model="addForm"
                    size="mini"
                    class="edit-form"
            >
                <el-form-item :label="$t('ClientName')">
                    <el-input v-model="addForm.clientName"/>
                </el-form-item>
                <el-form-item :label="$t('Project') + $t('ID')">
                    <el-input v-model="addForm.projectId"/>
                </el-form-item>
                <el-form-item :label="$t('ClientAlg')">
                    <el-select v-model="addForm.clientAlg">
                        <el-option
                                v-for="item in algList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button
                            :loading="loading"
                            type="primary"
                            icon="by-icon by-Icon-baocun"
                            @click="onAddSave"
                    >
                        {{
                        $t('Save') }}
                    </el-button>
                    <el-button @click="dialogAddVisible = false">
                        {{ $t('Cancel') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 支付宝配置 -->
        <el-dialog
                v-model="dialogPayConfigVisible"
                :show-close="false"
                :append-to-body="false"
                :title="$t('Config')"
        >
            <el-form
                    label-position="left"
                    label-width="160px"
                    :model="payConfigForm"
                    size="mini"
                    class="edit-form"
            >
                <el-form-item :label="$t('AppId')">
                    <el-input v-model="payConfigForm.app_id"/>
                </el-form-item>
                <el-form-item :label="$t('Mode')">
                    <el-input v-model="payConfigForm.mode"/>
                </el-form-item>
                <el-form-item :label="$t('NotifyUrl')">
                    <el-input v-model="payConfigForm.notify_url"/>
                </el-form-item>
                <el-form-item :label="$t('ReturnUrl')">
                    <el-input v-model="payConfigForm.return_url"/>
                </el-form-item>
                <el-form-item :label="$t('AliPublicKey')">
                    <el-input
                            v-model="payConfigForm.ali_public_key"
                            :rows="8"
                            type="textarea"
                    />
                </el-form-item>
                <el-form-item :label="$t('UserPrivateKey')">
                    <el-input
                            v-model="payConfigForm.private_key"
                            :rows="8"
                            type="textarea"
                    />
                </el-form-item>

                <el-form-item>
                    <el-button
                            :loading="loading"
                            type="primary"
                            icon="by-icon by-Icon-baocun"
                            @click="onPayConfigSave"
                    >
                        {{ $t('Save') }}
                    </el-button>
                    <el-button @click="dialogPayConfigVisible = false">
                        {{ $t('Cancel') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <!-- 微信配置 -->
        <el-dialog
              v-model="dialogWxPayConfigVisible"
              :show-close="false"
              :append-to-body="false"
              :title="$t('Config')"
      >
        <el-form
                label-position="left"
                label-width="160px"
                :model="wxpayConfigForm"
                size="mini"
                class="edit-form"
        >
          <el-form-item :label="'移动应用'+$t('AppId')">
            <el-input v-model="wxpayConfigForm.app_id"/>
          </el-form-item>
          <el-form-item :label="'网站应用' + $t('AppId')">
            <el-input v-model="wxpayConfigForm.h5app_id"/>
          </el-form-item>
          <el-form-item :label="'小程序或公众号' + $t('AppId')">
            <el-input v-model="wxpayConfigForm.miniapp_id"/>
          </el-form-item>
          <el-form-item label="商户号">
            <el-input v-model="wxpayConfigForm.mch_id"/>
          </el-form-item>
          <el-form-item :label="$t('NotifyUrl')">
            <el-input v-model="wxpayConfigForm.notify_url"/>
          </el-form-item>
          <el-form-item :label="'退款' + $t('NotifyUrl')">
            <el-input v-model="wxpayConfigForm.refund_notify_url"/>
          </el-form-item>
          <el-form-item label="API v3密钥">
            <el-input v-model="wxpayConfigForm.key"/>
          </el-form-item>
          <el-form-item label="商户API证书序列号">
            <el-input v-model="wxpayConfigForm.serial_no"/>
            <span>openssl x509 -in 商户证书_cert.pem -noout -serial</span>
          </el-form-item>

          <el-form-item>
            <el-button
                    :loading="loading"
                    type="primary"
                    icon="by-icon by-Icon-baocun"
                    @click="onWxPayConfigSave"
            >
              {{ $t('Save') }}
            </el-button>
            <el-button @click="dialogWxPayConfigVisible = false">
              {{ $t('Cancel') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

        <!-- 支付通道配置 -->

        <el-dialog
                v-model="dialogPaymentVisible"
                :show-close="false"
                :append-to-body="false"
                :title="$t('PaymentChannel')"
        >
            <el-form
                    :model="paymentForm"
                    size="mini"
                    class="edit-form"
            >
                <el-form-item>
                    <div style="width: 200px;">
                        <el-checkbox-group
                                v-model="checkPayment"
                                size="small"
                                @change="handleChange"
                        >
                            <el-checkbox
                                    v-for="p in supportPayment"
                                    :key="p.code"
                                    :label="p.code"
                            >
                                {{ p.title }}({{ p.desc }})
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button
                            :loading="loading"
                            type="primary"
                            icon="by-icon by-Icon-baocun"
                            @click="onPaymentSave"
                    >
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
    import {dbhTool} from '@peter_xiter/dbh-js-tools';

    import api from '../../api/clientsApi'

    export default {
        components: {},
        data () {
            return {
                dialogWxPayConfigVisible: false,
                dialogEditVisible: false,
                dialogAddVisible: false,
                dialogPayConfigVisible: false,
                dialogPaymentVisible: false,
                algList: [
                    { id: 'nothing', label: 'None' },
                    { id: 'rsa_v3', label: 'RsaV3' }
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
                wxpayConfigForm: {
                  m_client_id: '',
                  app_id: '', // 移动应用id
                  h5app_id: '',// h5网站
                  miniapp_id: '', // 小程序或公众号应用
                  refund_notify_url: '',
                  notify_url: '',
                  mch_id: '', // 商户号
                  key: '',
                  serial_no: ''
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
                    projectId: '',
                    user_public_key: '',
                    user_private_key: '',
                    sys_public_key: ''
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
                    this.editForm.dailyLimit = parseInt(newValue)
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
            async onResetSysRsaKey () {
                let that = this
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = dbh.vue_instance.$i18n.t('Processing').value

                            api.resetSysRsaKey({ user_id: this.editForm.uid, id: this.editForm.id })
                                .then((resp) => {
                                    that.editForm.sys_public_key = resp
                                    instance.confirmButtonLoading = false
                                    that.refresh()
                                    done()
                                }).catch((err) => {
                                    done()
                                    window.dbh.alertError(err)
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
            handleChange (value) {
                console.debug(value)
            },
            onPaymentSave () {
                let that = this
                this.paymentForm.value = this.checkPayment.join(',')
                this.loading = true
                api.updatePayment(this.paymentForm, (resp) => {
                    that.loading = false
                    that.dialogPaymentVisible = false
                }, (resp) => {
                    window.dbh.alertError(resp)
                    that.loading = false
                    that.dialogPaymentVisible = false
                })
            },
            onPayment (row) {
                this.dialogPaymentVisible = true
                this.loading = true
                this.paymentForm = {
                    m_client_id: row.client_id,
                    value: ''
                }
                var that = this
                that.checkPayment = []
                api.paymentList({ m_client_id: row.client_id }, (resp) => {
                    console.debug(resp)
                    that.loading = false
                    that.supportPayment = resp
                    that.supportPayment.forEach(e => {
                        if (e.enable == 1) {
                            that.checkPayment.push(e.code)
                        }
                    })
                }, (resp) => {
                    window.dbh.alertError(resp)
                    this.loading = false
                })
            },
            onPayConfigSave () {
                var that = this
                this.loading = true
                api.updatePayConfig(this.payConfigForm, (resp) => {
                    that.loading = false
                    that.dialogWxPayConfigVisible = false
                }, (resp) => {
                    window.dbh.alertError(resp)
                    that.loading = false
                    that.dialogWxPayConfigVisible = false
                })
            },
          onWxPayConfigSave () {
            var that = this
            this.loading = true
            api.updateWxPayConfig(this.wxpayConfigForm, (resp) => {
              that.loading = false
              that.dialogWxPayConfigVisible = false
            }, (resp) => {
              window.dbh.alertError(resp)
              that.loading = false
              that.dialogWxPayConfigVisible = false
            })
          },
            onWeixinPayConfig(row) {
              this.dialogWxPayConfigVisible = true
              this.loading = true
              this.wxpayConfigForm = {
                m_client_id: row.client_id,
                app_id: '', // 移动应用id
                h5app_id: '',// h5网站
                miniapp_id: '', // 小程序或公众号应用
                refund_notify_url: '',
                notify_url: '',
                mch_id: '', // 商户号
                key: '',
                serial_no: ''
              }
              var that = this
              api.wxpayConfig({ m_client_id: row.client_id }, (resp) => {
                that.loading = false
                that.wxpayConfigForm.app_id = resp.app_id
                that.wxpayConfigForm.h5app_id = resp.h5app_id
                that.wxpayConfigForm.miniapp_id = resp.miniapp_id
                that.wxpayConfigForm.refund_notify_url = resp.refund_notify_url
                that.wxpayConfigForm.notify_url = resp.notify_url
                that.wxpayConfigForm.mch_id = resp.mch_id
                that.wxpayConfigForm.key = resp.key
                that.wxpayConfigForm.serial_no = resp.serial_no
              }, (resp) => {
                window.dbh.alertError(resp)
                this.loading = false
              })
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
                var that = this
                api.payConfig({ m_project_id: row.project_id, m_client_id: row.client_id }, (resp) => {
                    that.loading = false
                    that.payConfigForm.app_id = resp.app_id
                    that.payConfigForm.mode = resp.mode
                    that.payConfigForm.notify_url = resp.notify_url
                    that.payConfigForm.return_url = resp.return_url
                    that.payConfigForm.ali_public_key = resp.ali_public_key
                    that.payConfigForm.private_key = resp.private_key
                }, (resp) => {
                    window.dbh.alertError(resp)
                    this.loading = false
                })
            },
            reset (row) {
                this.loading = true
                api.reset({ 'id': row.id, 'user_id': row.uid }, (resp) => {
                    console.debug('resp ', resp)
                    this.loading = false
                    this.refresh()
                }, (resp) => {
                    window.dbh.alertError(resp)
                    this.loading = false
                })
            },
            onSave () {
                this.loading = true
                api.update({
                    'user_id': this.editForm.uid,
                    'm_client_id': this.editForm.clientId,
                    'm_project_id': this.editForm.projectId,
                    'm_alg': this.editForm.clientAlg,
                    'user_public_key': this.editForm.user_public_key,
                    'user_private_key': this.editForm.user_private_key,
                    'day_limit': this.editForm.dailyLimit,
                    'client_name': this.editForm.clientName
                }, (resp) => {
                    this.dialogEditVisible = false
                    this.loading = false
                    this.refresh()
                }, (resp) => {
                    window.dbh.alertError(resp)
                    this.loading = false
                })
            },
            onAddSave () {
                api.createBySelf({
                    'm_project_id': this.addForm.projectId,
                    'm_alg': this.addForm.clientAlg,
                    // 'day_limit': this.addForm.dailyLimit,
                    'client_name': this.addForm.clientName
                }, (resp) => {
                    this.dialogAddVisible = false
                    this.loading = false
                    this.refresh()
                }, (resp) => {
                    window.dbh.alertError(resp)
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
                this.dialogEditVisible = true
                console.debug(row)
                this.editForm = Object.assign({
                    id: row.id,
                    uid: row.uid,
                    clientId: row.client_id,
                    clientName: row.client_name,
                    clientSecret: row.client_secret,
                    user_public_key: row.user_public_key,
                    user_private_key: row.user_private_key,
                    sys_public_key: row.sys_public_key,
                    clientAlg: row.api_alg,
                    totalLimit: parseInt(row.total_limit),
                    dailyLimit: parseInt(row.day_limit),
                    projectId: row.project_id
                })
            },
            refresh () {
                // 刷新当前
                this.loading = true
                this.queryForm.uid = dbhTool.getUID()
                this.queryForm.user_id = dbhTool.getUID()
                let that = this
                // setTimeout(function () {
                //     that.loading = false
                // }, 15000);
                // return;
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
                    window.dbh.alertError(resp)
                    this.loading = false
                })
            }
        }
    }
</script>
