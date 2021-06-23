<template>
  <div class="main-content by-clients padding-md-bottom padding-md-top">
    <div class="grid-content margin-md-top">
      <el-form
        label-position="left"
        label-width="160px"
        :model="editForm"
        size="mini"
        class="edit-form"
      >
        <el-form-item :label="$t('ClientId')">
          <el-input
            v-model="editForm.clientId"
            disabled="disabled"
          />
        </el-form-item>
        <el-form-item :label="$t('ClientSecret')">
          <el-input
            v-model="editForm.clientSecret"
            disabled="disabled"
          />
          <el-button
            icon="el-icon-refresh"
            :loading="loading"
            @click.prevent="reset()"
          >
            {{ $t('Reset') }}
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('ClientName')">
          <el-input v-model="editForm.clientName" />
        </el-form-item>
        <el-form-item :label="$t('Project') + $t('ID')">
          <el-input v-model="editForm.projectId" />
        </el-form-item>
        <el-form-item :label="$t('ClientAlg')">
          <el-select v-model="editForm.clientAlg">
            <el-option
              v-for="item in algList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('ClientDayLimit')">
          <el-input v-model="dailyLimitDesc" />
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            icon="by-icon by-Icon-baocun"
            @click="onSave"
          >
            {{
              $t('Save') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '../../api/clientsApi'

export default {
  components: {
  },
  data () {
    return {
      algList: [
        { id: 'nothing', label: 'None' },
        { id: 'md5v3', label: 'MD5 Version 3' }
      ],
      editForm: {
        clientId: '',
        clientName: '',
        clientSecret: '',
        apiAlg: 'nothing',
        dailyLimit: 500,
        projectId: ''
      },
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
    reset () {
      this.loading = true
      api.reset({}, (resp) => {
        console.debug('resp ', resp)
        this.loading = false
        this.editForm.clientSecret = resp
      }, (resp) => {
        window.tools.alertError(resp)
        this.loading = false
      })
    },
    onSave () {
      this.loading = true
      api.update({
        'm_client_id': this.editForm.clientId,
        'm_project_id': this.editForm.projectId,
        'day_limit': this.editForm.dailyLimit,
        'client_name': this.editForm.clientName
      }, (resp) => {
        this.loading = false
        this.editForm.apiAlg = resp.api_alg
        this.editForm.clientSecret = resp.client_secret
        this.editForm.clientId = resp.client_id
        this.editForm.clientName = resp.client_name
        this.editForm.clientAlg = resp.api_alg
        this.editForm.dailyLimit = resp.day_limit
        this.editForm.projectId = resp.project_id
      }, (resp) => {
        window.tools.alertError(resp)
        this.loading = false
      })
    },
    refresh () {
      // 刷新当前
      this.editForm = Object.assign({
        clientId: '',
        clientName: '',
        clientSecret: '',
        clientAlg: 'nothing',
        totalLimit: 0,
        dailyLimit: 0,
        projectId: ''
      })
      this.loading = true
      api.info({}, (resp) => {
        console.debug('resp ', resp)
        this.loading = false
        this.editForm.apiAlg = resp.api_alg
        this.editForm.clientSecret = resp.client_secret
        this.editForm.clientId = resp.client_id
        this.editForm.clientName = resp.client_name
        this.editForm.clientAlg = resp.api_alg
        this.editForm.dailyLimit = resp.day_limit
        this.editForm.projectId = resp.project_id
      }, (resp) => {
        window.tools.alertError(resp)
        this.loading = false
      })
    }
  }
}
</script>
