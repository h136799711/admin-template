<style>
    .tip {
        float: left;
        width: 78px;
    }
</style>
<template>
  <div class="main-content by-users padding-md-bottom padding-md-top">

    <div>
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-input
                  size="mini"
            v-model="queryForm.mobile"
            :placeholder="$t('Mobile')"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="refresh()"
          >
            {{
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
      @click="onAdd()"
    >
      {{ $t('Add') }}
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
                prop="nickname"
                label="用户昵称"
        >
          <template #default="scope">
            {{scope.row.nickname}}
          </template>
        </el-table-column>
        <el-table-column
          width="140px"
          prop="title"
          :label="$t('Mobile')"
        >
          <template #default="scope">
            ({{ scope.row.country_no }}) {{ scope.row.mobile }}
            <div
              v-if="scope.row.mobile_auth == 1"
              class="el-text-success"
            >
              <el-alert
                class="alert-small tip"
                size="mini"
                effect="dark"
                :closable="false"
                title="已验证"
                show-icon
                type="success"
              />
            </div>
            <div v-else-if="scope.row.mobile">
              <el-button
                size="mini"
                type="info"
                @click="showBindPhone(scope.row)"
              >
                发送验证短信
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="140px"
          prop="title"
          :label="$t('Email')"
        >
          <template #default="scope">
            {{ scope.row.email }}
            <div
              v-if="scope.row.email_auth == 1"
              class="el-text-success"
            >
              <el-alert
                class="alert-small tip"
                effect="dark"
                size="mini"
                :closable="false"
                title="已验证"
                show-icon
                type="success"
              />
            </div>
            <div v-else-if="scope.row.email">
              <el-button
                :loading="sendEmail"
                size="mini"
                type="info"
                @click="sendAuthEmail(scope.row.id)"
              >
                发送验证邮件
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          width="180px"
          label="第三方登录"
        >
          <template #default="scope">
            QQ: {{ scope.row.qq_openid }}<br>
            GITHUB: {{ scope.row.github_openid }}<br>
            WEIBO: {{ scope.row.weibo_openid }}<br>
          </template>
        </el-table-column>
        <el-table-column
                width="180px"
                :label="$t('Time')"
        >
          <template #default="scope">
            {{ $t('RegTime') }}: {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}<br>
            {{ $t('LastLoginTime') }}:{{ (new Date(scope.row.last_login_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
                width="120px"
                label="邀请码"
        >
          <template #default="scope">
          {{ scope.row.idcode }}
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--          width="180px"-->
<!--          :label="$t('Ip')"-->
<!--        >-->
<!--          <template #default="scope">-->
<!--            {{ $t('RegIp') }}: {{ numberToIp(scope.row.reg_ip) }}<br>-->
<!--            {{ $t('LastLoginIp') }}: {{ numberToIp(scope.row.last_login_ip) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
                type="index"
          width="100px"
          :label="$t('2StepVerify')"
        >
          <template #default="scope">
            <el-switch
                    v-model="scope.row.google_secret_switch"
                    :inactive-value="0"
                    :active-value="1"
                    :beforeChange="allowChangeGoogleSecret"
                    @change="changeGoogleSecret($event, scope.row.id)"
            />
            <span v-if="scope.row.google_secret_switch">
              <el-popover
                placement="right"
                width="120"
                trigger="hover"
              >
                <qrcode-vue
                  :value="getQrcontent(scope.row)"
                  :size="100"
                  level="H"
                />
              <template #reference>
                <el-button
                  size="mini"
                >二维码</el-button>
              </template>
              </el-popover>
            </span>
            <span v-else />
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          :label="$t('Session')"
        >
          <template #default="scope">
            <el-button
              size="mini"
              @click="goSession(scope.row)"
            >
              {{ $t('View') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          :label="$t('Client')"
        >
          <template #default="scope">
            <el-button
              size="mini"
              @click="goClient(scope.row)"
            >
              {{ $t('Client') }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
                    size="mini"
                    icon="el-icon-tickets"
                    @click="goWallet(scope.row)"
            >
              {{ $t('Wallet') }}
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-tickets"
              @click="goLog(scope.row)"
            >
              {{ $t('Log') }}
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-folder"
              @click="goProfile(scope.row)"
            >
              {{ $t('Detail') }}
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="onEdit(scope.row)"
            >
              {{ $t('Edit') }}
            </el-button>
            <el-switch
              v-model="scope.row.status"
              :inactive-value="0"
              :active-value="1"
              :beforeChange="allowChangeGoogleSecret"
              @change="onDisableEnable($event, scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="text-center">
      <el-pagination
          :current-page="page_index"
        :page-sizes="[3, 10, 20, 30, 50]"
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
        label-width="160px"
      >
        <el-form-item
          :label="$t('Mobile')"
          required
          prop="mobile"
        >
          <el-input v-model="addForm.mobile" />
        </el-form-item>

        <el-form-item
          :label="$t('Password')"
          required
          prop="password"
        >
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item
          :label="$t('RePassword')"
          required
          prop="repassword"
        >
          <el-input v-model="addForm.repassword" />
        </el-form-item>
        <el-form-item>
          除了英文大小写字母数字之外<br>密码可含特殊字符 (_!@#$%^&*()_+-=[]{}|;:,.&lt;&gt;)
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
          :label="$t('Email')"
          required
          prop="email"
        >
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item :label="$t('Password')">
          <el-button
            size="mini"
            icon="el-icon-refresh-left"
            :loading="loading"
            @click="resetPwd(editForm.id)"
          >
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

    <el-dialog
      v-model="dialogBindPhoneVisible"
      :show-close="false"
      :append-to-body="false"
      :title="'验证手机号' + bindPhoneForm.country_no + bindPhoneForm.mobile"
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
          prop="code"
        >
          <el-input
            v-model="bindPhoneForm.code"
            style="width: 120px;"
          />
          <el-button
            :loading="sendCode"
            type="primary"
            @click="sendAuthCode()"
          >
            {{ $t('Send') }}
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <div
                class="dialog-footer"
        >
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
      </template>
    </el-dialog>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import api from '../../api/userApi'
import { getCurrentInstance,onMounted, onUpdated, onUnmounted,ref } from 'vue'
import {dbhTool} from '@peter_xiter/dbh-js-tools'

export default {
  components: {
    QrcodeVue
  },
  setup(){
    onUpdated(() =>  {
      console.debug('on Updated');
      // const internalInstance = getCurrentInstance()
      // internalInstance.data.queryForm.page_index = 3;
//      console.debug(internalInstance, internalInstance.data.queryForm.page_index);
    })
  //   const route = useRoute();
  //   const page_index = ref(route.query.p ? parseInt(route.query.p) : 1);
  //   return {
  //     page_index
  //   };
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
      page_index: 1,
      dialogBindPhoneVisible: false,
      queryForm: {
        mobile: '',
        page_index: 1,
        page_size: 3
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
        country_no: '',
        code: ''
      }
    }
  },
  computed: {
    getYear () {
      let date = (new Date())
      let m = (1 + date.getMonth())
      if (m < 10) m = '0' + m

      return date.getFullYear() + m.toString()
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
  },
  mounted () {
    this.queryForm.page_index = parseInt(this.$route.query.p ?? 1);
    this.refresh();
  },
  methods: {
    goSession (row) {
     this.$router.push({ path: 'session/' + row.id + '/' + row.login_device_cnt })
    },
    goWallet (row) {
      this.$router.push({ path: 'wallet/' + row.id + '/' + this.queryForm.page_index })
    },
    goLog (row) {
      this.$router.push({ path: 'log/' + row.id })
    },
    goClient (row) {
      this.$router.push({ path: 'client/' + row.id + '/' + this.queryForm.page_index })
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
    resetPwd (id) {
      this.loading = true
      api.resetPwd({ user_id: id }, (resp) => {
        this.loading = false
        window.dbh.alertSuc('密码已重置')
      }, (resp) => {
        window.dbh.alertError(resp)
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
        window.dbh.alertError(resp)
        this.sendCode = false
      })
    },
    sendAuthCode () {
      this.sendCode = true
      api.sendAuthCode(this.sendCodeForm, (resp) => {
        this.sendCode = false
        console.log(resp)
        window.dbh.alertSuc(resp, 3000)
      }, (resp) => {
        window.dbh.alertError(resp)
        this.sendCode = false
      })
    },
    sendAuthEmail (id) {
      this.sendEmail = true
      api.sendAuthEmail({ id: id }, (resp) => {
        this.sendEmail = false
        window.dbh.alertSuc('已发送')
      }, (resp) => {
        window.dbh.alertError(resp)
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
      return dbhTool.getImgUrl(url)
    },
    onTurnOn (id) {
      return api.turnOn2StepVerify({ id: id }, (res) => {
        this.refresh()
      }, (res) => {
        window.dbh.alertError(res.msg)
      });
    },
    onTurnOff (id) {
      return api.turnOff2StepVerify({ id: id }, (res) => {
      }, (res) => {
        window.dbh.alertError(res.msg)
      });
    },
    allowChangeGoogleSecret() {
      return new Promise((resolve, reject) => {
        this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
          confirmButtonText: this.$i18n.t('Confirm'),
          cancelButtonText: this.$i18n.t('Cancel'),
          type: 'warning',
        }).then(() => {
          resolve('123');
        }).catch(() => {
          reject(new Error('Cancel'));
        });
      });
    },
    changeGoogleSecret (row, id) {
      console.log('change', row, id)
      if (!id) return ;
      if (row === 1) {
        this.onTurnOn(id)
      } else {
        this.onTurnOff(id)
      }
    },
    onDisableEnable (status, id) {
      console.log('状态', status, id)
      if (!id) return ;
      if (status === 1) {
        this.onEnable(id)
      } else {
        this.onDisable(id)
      }
    },
    onEnable (id) {
      return api.enable({ id: id }, (res) => {
        // this.refresh()
      }, (res) => {
        console.debug(res)
        window.dbh.alertError(res.msg)
      });
    },
    onDisable (id) {
      return api.disable({ id: id }, (res) => {
        // this.refresh()
      }, (res) => {
        window.dbh.alertError(res.msg)
      })
    },
    ifLoginUser (uid) {
      return uid === dbhTool.getUID() ? 'You' : 'Other'
    },
    submitEditForm () {
      this.loading = true
      api.updateInfo(this.editForm, (resp) => {
        this.loading = false
        this.dialogEditVisible = false
        this.refresh()
      }, (resp) => {
        window.dbh.alertError(resp)
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
//    this.tableData = []
      this.loading = true
      api.queryByPaging(Object.assign({},this.queryForm), (resp) => {
        this.loading = false
        this.count = parseInt(resp.count)
        this.tableData = resp.list
          for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].google_secret_switch = this.tableData[i].google_secret.length > 0 ? 1 : 0
        }
        this.page_index = this.queryForm.page_index;
      }, (resp) => {
        window.dbh.alertError(resp)
        this.loading = false
      })
    }
  }
}
</script>
