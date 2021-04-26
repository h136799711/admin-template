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
                    <template #default>
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
                        <div v-else-if="scope.row.mobile">
                            <el-button size="mini" @click="showBindPhone(scope.row)"
                                       type="info">发送验证短信
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        prop="title"
                        :label="$t('Email')"
                >
                    <template #default>
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
                        <div v-else-if="scope.row.email">
                            <el-button :loading="sendEmail" size="mini" @click="sendAuthEmail(scope.row.id)"
                                       type="info">发送验证邮件
                            </el-button>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                        width="200px"
                        label="第三方登录">
                    <template #default="scope">
                        QQ: {{ scope.row.qq_openid}}<br/>
                        GITHUB: {{ scope.row.github_openid}}<br/>
                        WEIBO: {{ scope.row.weibo_openid}}<br/>
                    </template>
                </el-table-column>

                <el-table-column
                        width="200px"
                        :label="$t('Time')">
                    <template #default="scope">
                        {{ $t('RegTime')}}: {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}<br/>
                        {{$t('LastLoginTime')}}:{{(new Date(scope.row.last_login_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="180px"
                        :label="$t('Ip')">
                    <template #default="scope">
                        {{ $t('RegIp')}}: {{ numberToIp(scope.row.reg_ip) }}<br/>
                        {{ $t('LastLoginIp')}}: {{ numberToIp(scope.row.last_login_ip) }}
                    </template>
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('2StepVerify')">
                    <template #default="scope">
                        <el-switch
                                @change="changeGoogleSecret(scope.row)"
                                v-model="scope.row.google_secret_switch"
                                :active-value="1"
                                :inactive-value="0"
                        >
                        </el-switch>

                        <span v-if="scope.row.google_secret">
                            <el-popover
                                    placement="right"
                                    width="120"
                                    trigger="hover">
                            <qrcode-vue :value="getQrcontent(scope.row)" :size="100" level="H"></qrcode-vue>
                            <el-button size="mini" slot="reference">二维码</el-button>
                            </el-popover>
                        </span>
                        <span v-else>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('Session')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                @click="goSession(scope.row)">
                            {{$t('View')}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('Client')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                @click="goClient(scope.row)">
                            {{$t('Client')}}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column
                        width="360px"
                        fixed="right"
                        :label="$t('Action')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-tickets"
                                @click="goLog(scope.row)">
                            {{$t('Log')}}
                        </el-button>
                        <el-button
                                size="mini"
                                icon="el-icon-folder"
                                @click="goProfile(scope.row)">
                            {{$t('Detail')}}
                        </el-button>
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
                        <span v-if="scope.row.status==1">{{$t('Enable')}}</span>
                        <span v-else-if="scope.row.status==0">{{$t('Disable')}}</span>
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
                :title="$t('Add')"
                v-model="dialogAddVisible"
        >
            <el-form
                    ref="addForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="160px"
            >
                <el-form-item
                        :label="$t('Mobile')"
                        required
                        prop="mobile">
                    <el-input v-model="addForm.mobile"/>
                </el-form-item>

                <el-form-item
                        :label="$t('Password')"
                        required
                        prop="password"
                >
                    <el-input v-model="addForm.password"/>
                </el-form-item>
                <el-form-item
                        :label="$t('RePassword')"
                        required
                        prop="repassword"
                >
                    <el-input v-model="addForm.repassword"/>
                </el-form-item>
                <el-form-item>
                    除了英文大小写字母数字之外<br/>密码可含特殊字符 (_!@#$%^&*()_+-=[]{}|;:,.&lt;&gt;)
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
            >

                <el-form-item
                        :label="$t('Email')"
                        required
                        prop="email">
                    <el-input v-model="editForm.email"/>
                </el-form-item>
                <el-form-item :label="$t('Password')">
                    <el-button
                            size="mini"
                            icon="el-icon-refresh-left"
                            :loading="loading"
                            @click="resetPwd(editForm.id)" >
                        重置密码
                    </el-button>
                    <div>默认为: {{ getYear }}654321</div>
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

        <el-dialog
                :show-close="false"
                :append-to-body="false"
                :title="'验证手机号' + bindPhoneForm.country_no + bindPhoneForm.mobile"
                v-model="dialogBindPhoneVisible"
        >
            <el-form
                    ref="editForm"
                    :model="bindPhoneForm"
                    label-position="right"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Code')"
                        required
                        prop="code">
                    <el-input style="width: 120px;" v-model="bindPhoneForm.code"/>
                    <el-button
                            :loading="sendCode"
                            type="primary"
                            @click="sendAuthCode()"
                    >
                        {{ $t('Send') }}
                    </el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogBindPhoneVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        :loading="sendCode"
                        type="primary"
                        @click="onBindPhone()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import QrcodeVue from 'qrcode.vue'
    import api from '../../api/userApi'




    export default {
        components: {
            QrcodeVue,
        },
        data () {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (value && value.length < 8) {
                        callback(new Error('密码至少8位'))
                        return
                    }
                    if (this.addForm.repassword !== '') {
                        this.$refs.addForm.validateField('repassword')
                    }
                    callback()
                }
            }
            var validatePass2 = (rule, value, callback) => {
                if (value && value.length < 8) {
                    callback(new Error('密码至少8位'))
                    return
                }
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.addForm.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }

            return {
                dialogBindPhoneVisible: false,
                queryForm: {
                    mobile: '',
                    page_index: 1,
                    page_size: 10
                },
                addForm: { mobile: '', countryNo: '86', password: '', repassword: '' },
                editForm: { id: 0, nickname: '' },
                rules: {
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    repassword: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    nickname: [
                        { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
                        { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ]
                },
                count: 0,
                tableData: [],
                loading: false,
                sendEmail: false,
                sendCode: false,
                dialogAddVisible: false,
                dialogEditVisible: false,
                sendCodeForm: {
                    accepter: '',
                    code_type: 3,
                    code_length: 6,
                    country_no: 86
                },
                bindPhoneForm: {
                    user_id: 0,
                    mobile: '',
                    country_no:'',
                    code: ''
                },
            }
        },
        computed: {
            getYear() {
                let date = (new Date());
                let m = (1 + date.getMonth());
                if (m < 10) m = '0' + m;

                return date.getFullYear() + m.toString();
            }
        },
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
            goSession (row) {
                this.$router.push({ path: 'session/' + row.id + '/' + row.login_device_cnt })
            },
            goLog (row) {
                this.$router.push({ path: 'log/' + row.id })
            },
            goClient (row) {
                this.$router.push({ path: 'client/' + row.id })
            },
            goProfile (row) {
                this.$router.push({ path: 'profile/' + row.id })
            },
            getQrcontent (row) {
                return 'otpauth://totp/user-' + row.mobile + '?secret=' + row.google_secret + '&issuer=greater-china'
            },
            showBindPhone (row) {
                this.dialogBindPhoneVisible = true
                this.bindPhoneForm.code = ''
                this.bindPhoneForm.user_id = row.id
                this.bindPhoneForm.mobile = row.mobile
                this.bindPhoneForm.country_no = row.country_no

                this.sendCodeForm.accepter = row.mobile
                this.sendCodeForm.country_no = row.country_no
            },
            resetPwd(id) {
                this.loading = true
                api.resetPwd({user_id: id}, (resp) => {
                    this.loading = false
                    window.tools.alertSuc('密码已重置')
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            },
            onBindPhone () {
                this.sendCode = true
                api.bindPhone(this.bindPhoneForm, (resp) => {
                    this.sendCode = false
                    this.dialogBindPhoneVisible = false
                    console.log(resp)
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.sendCode = false
                })
            },
            sendAuthCode () {
                this.sendCode = true
                api.sendAuthCode(this.sendCodeForm, (resp) => {
                    this.sendCode = false
                    console.log(resp)
                    window.tools.alertSuc(resp, 3000)
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.sendCode = false
                })
            },
            sendAuthEmail (id) {
                this.sendEmail = true
                api.sendAuthEmail({ id: id }, (resp) => {
                    this.sendEmail = false
                    window.tools.alertSuc('已发送')
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.sendEmail = false
                })
            },
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
            onTurnOn (id) {
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
                            api.turnOn2StepVerify({ id: id }, (res) => {
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
            onTurnOff (id) {
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
                            api.turnOff2StepVerify({ id: id }, (res) => {
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
            changeGoogleSecret (row) {
                if (row.google_secret_switch == 1) {
                    this.onTurnOn(row.id)
                } else {
                    this.onTurnOff(row.id)
                }
            },
            onDisableEnable (row) {
                console.log('状态', row.status)
                if (row.status == 1) {
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
            ifLoginUser (uid) {
                return uid === window.tools.getUID() ? 'You' : 'Other'
            },
            submitEditForm () {
                this.loading = true
                api.updateInfo(this.editForm, (resp) => {
                    this.loading = false
                    this.dialogEditVisible = false
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            },
            submitAddForm () {
                console.log(this.addForm)
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        api.registerByMobileCode(this.addForm, (resp) => {
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
            },
            onAdd () {
                this.addForm = {
                    mobile: '', countryNo: '86', password: ''
                }
                this.dialogAddVisible = true
            },
            onEdit (row) {

                this.editForm = {
                    email: row.email
                }

                this.editForm.id = row.id

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
                api.queryByPaging(this.queryForm, (resp) => {
                    this.loading = false
                    this.count = parseInt(resp.count)
                    this.tableData = resp.list
                    for (let i = 0; i < this.tableData.length; i++) {
                        this.tableData[i].google_secret_switch = this.tableData[i].google_secret.length > 0 ? 1 : 0
                    }
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                })
            }
        }
    }
</script>
