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

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .el-tree-node__content {
        margin-top: 4px;
    }
</style>
<template>
  <div class="main-content by-policy padding-md-bottom padding-md-top">
    <el-button
      type="primary"
      size="mini"
      icon="by-icon by-shuaxin"
      :loading="loading"
      @click="refresh()"
    >
      {{ $t('Refresh') }}
    </el-button>
    <div
      class="margin-md-top"
      style="width: 640px;"
    >
      <el-tree
        ref="tree"
        highlight-current
        default-expand-all
        :data="list"
        node-key="id"
        :expand-on-click-node="false"
        :props="defaultProps"
      >
        <template #default="{ node, data }"
        >
          <div class="custom-tree-node">
          <div>{{ node.label }}</div>
          <div>
            <el-button
              :disabled="data.id == 0"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="onEdit(data)"
            >
              {{ $t('Edit') }}
            </el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="onAppend(data)"
            >
              {{ $t('Append') }}
            </el-button>
            <el-button
              :disabled="data.id == 0"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="onRemove(node, data)"
            >
              {{ $t('Delete') }}
            </el-button>
          </div>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- Edit Form -->
    <el-dialog
      v-model="dialogEditVisible"
      :show-close="false"
      :append-to-body="false"
      :title="$t('Edit')"
    >
      <el-form
        ref="editForm"
        status-icon
        :model="editForm"
        label-position="right"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item
          :label="$t('Title')"
          prop="name"
        >
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item
          :label="$t('Icon')"
          prop="icon"
        >
          <el-input v-model="editForm.icon" />
        </el-form-item>
        <el-form-item
          :label="$t('ValueType')"
        >
          <el-select v-model="editForm.url_type">
            <el-option
              v-for="item in urlTypeList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('Url')"
          prop="value"
        >
          <el-input v-model="editForm.url" />
        </el-form-item>

        <el-form-item
          :label="$t('Sort')"
          prop="sort"
        >
          <el-input-number
            v-model="editForm.sort"
            :min="0"
            :max="10000000000"
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

    <!-- Add Form -->
    <el-dialog
      v-model="dialogAddVisible"
      :show-close="false"
      :append-to-body="false"
      :title="$t('Add')"
    >
      <el-form
        ref="addForm"
        status-icon
        :model="addForm"
        label-position="right"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item
          :label="$t('Scene')"
          prop="name"
        >
          <el-select v-model="addForm.scene">
            <el-option
              v-for="item in sceneEnum"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('Title')"
          prop="name"
        >
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item
          :label="$t('Icon')"
          prop="icon"
        >
          <el-input v-model="addForm.icon" />
        </el-form-item>
        <el-form-item
          :label="$t('ValueType')"
        >
          <el-select v-model="addForm.url_type">
            <el-option
              v-for="item in urlTypeList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('Url')"
          prop="value"
        >
          <el-input v-model="addForm.url" />
        </el-form-item>

        <el-form-item
          :label="$t('Sort')"
          prop="sort"
        >
          <el-input-number
            v-model="addForm.sort"
            :min="0"
            :max="10000000000"
          />
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
  </div>
</template>

<script>
import api from '../../api/menuApi'

export default {
  data () {
    return {
      urlTypeList: [
        { id: 0, value: '#' },
        { id: 1, value: 'RoutePath' }
      ],
      sceneEnum: [
        { id: 'backend', value: 'backend' },
        { id: 'front', value: 'front' }
      ],
      addForm: {
        pid: 0,
        scene: '',
        url: '',
        title: '',
        icon: '',
        sort: 0,
        url_type: 1
      },
      editForm: {},
      addFormRules: {
        title: [
          { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
          { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ]
      },
      list: [],
      loading: false,
      dialogEditVisible: false,
      dialogAddVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.refresh()
  },
  mounted: function () {
  },
  methods: {
    submitEditForm () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          api.update(this.editForm, (resp) => {
            this.loading = false
            this.dialogEditVisible = false
            window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
            this.refresh()
          }, (resp) => {
            window.tools.alertError(resp)
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    onEdit (data) {
      this.dialogEditVisible = true
      this.loading = true
      api.info({ 'id': data.id }, (resp) => {
        this.editForm = Object.assign({
          id: 0,
          url: '',
          title: '',
          icon: '',
          sort: 0,
          url_type: 1,
          scene: 'backend'
        }, resp)
        this.loading = false
      }, (resp) => {
        window.tools.alertError(resp)
        this.loading = false
      })
      console.debug(this.editForm)
    },
    submitAddForm () {
      this.loading = true
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          api.create(this.addForm, (resp) => {
            this.loading = false
            this.dialogAddVisible = false
            window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
            this.refresh()
          }, (resp) => {
            window.tools.alertError(resp)
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    onAppend (data) {
      console.debug('data', data)
      this.dialogAddVisible = true
      this.addForm = {
        pid: data.id,
        url: '',
        title: '',
        icon: '',
        sort: 0,
        url_type: 1
      }
    },
    onRemove (node, data) {
      console.debug('data', data)
      this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
        confirmButtonText: this.$i18n.t('Confirm'),
        cancelButtonText: this.$i18n.t('Cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

            api.delete({ 'id': data.id }, (res) => {
              instance.confirmButtonLoading = false
              this.refresh()
              done()
            }, (res) => {
              console.debug(res)
              done()
              window.tools.alertError(res)
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
    refresh () {
      // 刷新当前
      this.list = []
      this.loading = true
      api.queryAll({}, (resp) => {
        this.loading = false
        console.debug(resp)
        this.list = [{
          id: '0',
          label: 'Root',
          children: resp
        }]
      }, (resp) => {
        window.tools.alertError(resp)
        this.loading = false
      })
    }
  }
}
</script>
