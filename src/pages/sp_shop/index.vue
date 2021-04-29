<template>
  <div class="main-content by-banners padding-md-bottom padding-md-top">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-plus"
      :loading="loading"
      @click="onAdd()"
    >
      {{ $t('Add') }}
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
          prop="title"
          :label="$t('Title')"
        >
          <template #default="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('Description')"
        >
          <template #default="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column
          width="200px"
          :label="$t('Status')"
        >
          <template #default="scope">
            <el-tag type="info">
              {{ scope.row.closed === 0 ? '营业': '休息' }}
            </el-tag>
            <el-button
              size="mini"
              @click="onCloseOrOpen(scope.row.id, scope.row.closed)"
            >
              {{ scope.row.closed === 1 ? '改为营业': '改为休息' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          :label="$t('CreateTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd') }}
          </template>
        </el-table-column>

        <el-table-column
          width="360px"
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
              size="mini"
              @click="onAddGoods(scope.row.id)"
            >
              {{ $t('Goods') }}
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="onEdit(scope.row)"
            >
              {{ $t('Edit') }}
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="onDelete(scope.row.id)"
            >
              {{ $t('Delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
        label-width="100px"
      >
        <el-form-item
          :label="$t('Title')"
          required
          prop="title"
        >
          <el-input v-model="addForm.title" />
        </el-form-item>

        <el-form-item
          :label="$t('Description')"
          prop="description"
        >
          <el-input
            v-model="addForm.description"
            type="textarea"
            :rows="6"
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
          :label="$t('Title')"
          required
          prop="title"
        >
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item
          :label="$t('Description')"
          prop="description"
        >
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="6"
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
  </div>
</template>

<script>
import spShopApi from '../../api/spShopApi'

export default {
  components: {
  },
  data () {
    return {
      queryForm: {},
      addForm: {
        title: '',
        description: ''
      },
      editForm: {
        id: 0,
        title: '',
        description: ''
      },
      rules: {
        title: [
          { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
          { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ]
      },
      tableData: [],
      loading: false,
      dialogAddVisible: false,
      dialogEditVisible: false
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
    this.refresh()
  },
  methods: {
    onCloseOrOpen (id, status) {
      this.loading = true
      if (status === 0) {
        spShopApi.close({ id: id }, (res) => {
          this.loading = false
          this.refresh()
        }, (res) => {
          this.loading = false
          window.tools.alertError(res.msg)
        })
      } else {
        spShopApi.opening({ id: id }, (res) => {
          this.loading = false
          this.refresh()
        }, (res) => {
          this.loading = false
          window.tools.alertError(res.msg)
        })
      }
    },
    onAddGoods (id) {
      this.$router.replace({ path: '/admin/shop/goods/' + id })
    },
    onDelete (id) {
      this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
        confirmButtonText: this.$i18n.t('Confirm'),
        cancelButtonText: this.$i18n.t('Cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

            spShopApi.delete({ id: id }, (res) => {
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
    submitEditForm () {
      spShopApi.update(this.editForm, (resp) => {
        this.loading = false
        this.dialogEditVisible = false
        this.refresh()
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
        this.dialogEditVisible = false
      })
    },
    submitAddForm () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          spShopApi.create(this.addForm, (resp) => {
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
      this.addForm.title = ''
      this.addForm.description = ''
      this.dialogAddVisible = true
    },
    onEdit (row) {
      this.editForm = {
        id: row.id,
        title: row.title,
        description: row.description
      }
      this.dialogEditVisible = true
    },
    refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      let that = this
      spShopApi.query(that.queryForm, (resp) => {
        that.tableData = resp
        that.loading = false
      }, (resp) => {
        window.tools.alertError(resp.msg)
        that.loading = false
      })
    }
  }
}
</script>
