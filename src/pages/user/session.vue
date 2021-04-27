<style>
    .tip {
        float: left;
        width: 78px;
    }
</style>
<template>
  <div class="main-content by-user-session padding-md-bottom padding-md-top">
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
      icon="el-icon-refresh"
      @click="refresh()"
    >
      {{ $t('Refresh') }}
    </el-button>
    <el-form
      v-if="!loading"
      v-model="editForm"
      :inline="true"
      class=""
    >
      <el-form-item label="同时在线会话数">
        <el-input
          v-model="editForm.limit"
          size="mini"
          placeholder="同时在线会话数"
        />
      </el-form-item>
      <el-form-item>
        <el-popconfirm
          icon="el-icon-danger"
          confirm-button-type="danger"
          icon-color="red"
          title="确定更新吗？更新后该用户必须重新登录"
          @onConfirm="onSubmitEdit()"
        >
          <el-button
            slot="reference"
            type="danger"
            size="mini"
            icon="el-icon-edit-outline"
          >
            {{ $t('Save') }}
          </el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

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
          prop="login_session_id"
          width="260px"
          :label="$t('ID')"
        >
          <template #default="scope">
            {{ scope.row.id }}#{{ scope.row.login_session_id }}
          </template>
        </el-table-column>
        <el-table-column
          width="220px"
          prop="device_token"
          :label="$t('Device')"
        />
        <el-table-column
          width="160px"
          prop="login_info"
          :label="$t('Info')"
        />
        <el-table-column
          width="160px"
          prop="login_device_type"
          :label="$t('DeviceType')"
        />
        <el-table-column
          width="200px"
          :label="$t('Time')"
        >
          <template #default="scope">
            {{ $t('CreateTime') }}: {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}<br>
            {{ $t('ExpireTime') }}:{{ (new Date(scope.row.expire_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
          </template>
        </el-table-column>

        <el-table-column
          type="index"
          width="240px"
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-popconfirm
              icon="el-icon-danger"
              icon-color="red"
              confirm-button-type="Danger"
              title="确定删除吗？"
              @onConfirm="onDelete(scope.row)"
            >
              <el-button
                slot="reference"
                type="danger"
                size="mini"
                icon="el-icon-delete"
              >
                {{ $t('Delete') }}
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from '../../api/userApi'

export default {
  components: {
  },
  props: {
    id: 0,
    limit: 0
  },
  data () {
    return {
      editForm: {
        user_id: 0,
        limit: 0
      },
      queryForm: {
        page_index: 1,
        page_size: 30
      },
      tableData: [],
      loading: false
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.editForm.user_id = this.id
    this.editForm.limit = this.limit
    this.refresh()
  },
  mounted () {
    console.debug('index mounted')
  },
  methods: {
    onSubmitEdit () {
      this.loading = true
      api.updateLimit(this.editForm, (resp) => {
        this.loading = false
        this.refresh()
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
      })
    },
    onDelete (row) {
      this.loading = true
      api.logoutSession({ user_id: row.uid, session_id: row.login_session_id }, (resp) => {
        this.loading = false
        this.refresh()
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
      })
    },
    refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      this.queryForm.user_id = this.id
      api.querySession(this.queryForm, (resp) => {
        this.loading = false
        this.tableData = resp
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
      })
    }
  }
}
</script>
