<template>
  <div class="main-content by-policy padding-md-bottom padding-md-top">
    <div style="width: 480px;">
      <el-form
        ref="editForm"
        status-icon
        label-position="right"
        label-width="160px"
        :model="editForm"
        :rules="rules"
      >
        <el-form-item
          required
          :label="$t('Old_Password')"
          prop="old_pwd"
        >
          <el-input
            v-model="editForm.old_pwd"
            size="mini"
          />
        </el-form-item>
        <el-form-item
          required
          :label="$t('New_Password')"
          prop="new_pwd"
        >
          <el-input
            v-model="editForm.new_pwd"
            size="mini"
          />
        </el-form-item>
        <el-form-item
          required
          :label="$t('Confirm_Password')"
          prop="confirm_pwd"
        >
          <el-input
            v-model="editForm.confirm_pwd"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="mini"
            icon="by-icon by-Icon-baocun"
            @click="submitForm()"
          >
            {{ $t('Save') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '../../api/userApi'

export default {
  components: {
  },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('Please Input Password')))
      } else {
        if (this.editForm.confirm_pwd !== '') {
          this.$refs.editForm.validateField('confirm_pwd')
        }
        callback()
      }
    }
    var validateConfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('Please Input Password')))
      } else if (value !== this.editForm.new_pwd) {
        callback(new Error(this.$t('Two_Password_Not_Match')))
      } else {
        callback()
      }
    }
    return {
      editForm: {
        old_pwd: '',
        new_pwd: '',
        confirm_pwd: ''
      },
      rules: {
        old_pwd: [
          { required: true, message: this.$i18n.t('Please Input Name'), trigger: 'blur' },
          { min: 8, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ],
        new_pwd: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, message: this.$i18n.t('Please Input Password'), trigger: 'blur' },
          { min: 8, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ],
        confirm_pwd: [
          { validator: validateConfirmPass, trigger: 'blur' },
          { required: true, message: this.$i18n.t('Please Input Password'), trigger: 'blur' },
          { min: 8, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
  },
  watch: {},
  created () {
  },
  mounted: function () {
  },
  methods: {
    submitForm () {
      this.loading = true
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          api.updatePassword(this.editForm, (resp) => {
            this.loading = false
            this.$router.push('/logout')
          }, (resp) => {
            window.dbh.alertError(resp)
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
