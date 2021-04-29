<template>
  <div class="main-content by-clients padding-md-bottom padding-md-top">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-back"
      @click="$router.replace('/admin/user/index')"
    >
      {{ $t('Back') }}
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
    <el-button
      type="primary"
      size="mini"
      check-strictly="true"
      :loading="loading"
      @click="onAdd()"
    >
      <span class="el-icon-plus" />
      {{ $t('Add') }}
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
          width="60px"
          :label="$t('ID')"
        />
        <el-table-column
          prop="project_id"
          width="100px"
          :label="$t('Project') + $t('ID')"
        />
        <el-table-column
          prop="client_name"
          width="120px"
          :label="$t('ClientName')"
        />
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
              {{
                $t('Reset') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="api_alg"
          width="100px"
          :label="$t('ClientAlg')"
        />
        <el-table-column
          width="160px"
          :label="$t('CreateTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          width="200px"
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
      :append-to-body="false"
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
            {{ $t('Save') }}
          </el-button>
        </el-form-item>
      </el-form>
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
          <el-input v-model="addForm.clientName" />
        </el-form-item>
        <el-form-item :label="$t('Project') + $t('ID')">
          <el-input v-model="addForm.projectId" />
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
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api/clientsApi'

export default {
  components: {
  },
  props: {
    id: 0
  },
  data () {
    return {
      dialogEditVisible: false,
      dialogAddVisible: false,
      algList: [
        { id: 'nothing', label: 'None' },
        { id: 'rsa_v3', label: 'Rsa Version 3' }
      ],
      addForm: {
        user_id: 0,
        clientName: '',
        apiAlg: 'nothing',
        dailyLimit: 500,
        projectId: ''
      },
      editForm: {
        user_id: 0,
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
    reset (row) {
      this.loading = true
      api.reset({ 'id': row.id, 'user_id': row.uid }, (resp) => {
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
        'user_id': this.editForm.user_id,
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
      this.loading = true
      api.create({
        'user_id': this.addForm.user_id,
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
        user_id: this.id,
        clientName: '',
        clientAlg: 'nothing',
        dailyLimit: 500,
        projectId: ''
      }
      this.dialogAddVisible = true
    },
    onEdit (row) {
      this.editForm = Object.assign({
        user_id: row.uid,
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
      this.queryForm.user_id = this.id
      api.query(this.queryForm, (resp) => {
        console.debug('resp ', resp)
        this.loading = false
        this.list = resp
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
      })
    }
  }
}
</script>
