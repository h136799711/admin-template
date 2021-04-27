<style>
    .blue {
        color: blue;
    }

</style>
<template>
  <div class="main-content by-banners padding-md-bottom padding-md-top">
    <div class="margin-md-bottom">
      <el-alert>三级行政区域</el-alert>
      <el-form
:inline="true"
               :model="queryForm"
class="demo-form-inline hidden"
>
        <el-form-item>
          <el-input
v-model="queryForm.name"
                    size="mini"
/>
        </el-form-item>
        <el-form-item>
          <el-button
:loading="loading"
                     type="primary"
size="mini" icon="el-icon-search" @click="refresh()">
            {{ $t('Search') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-button
      type="primary"
      size="mini"
      icon="el-icon-back"
      @click="onBack()"
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
      type="warning"
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
          width="160px"
          :label="$t('ID')"
        />
        <el-table-column
          width="200px"
          prop="name"
          :label="$t('Name')"
        />
        <el-table-column
          width="160px"
          prop="code"
          :label="$t('Code')"
        />

        <el-table-column
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
              size="mini"
              icon="by-icon by-tubiao_qudao"
              @click="onSubregion(scope.row)"
            >
              {{ $t('Subregion') }}
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

    <div class="text-center">
      <el-pagination
        :current-page="queryForm.page_index"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryForm.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
        @size-change="byPagerSizeChange"
        @current-change="byPagerCurrentChange"
      />
    </div>

    <el-dialog
      :show-close="false"
      :append-to-body="false"
      v-model="dialogAddVisible"
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
          :label="$t('Name')"
          required
          prop="name"
        >
          <el-input v-model="addForm.name" />
        </el-form-item>

        <el-form-item
          :label="$t('Code')"
          prop="code"
        >
          <el-input v-model="addForm.code"/>
        </el-form-item>
      </el-form>
      <div
slot="footer"
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
    </el-dialog>

    <el-dialog
      :show-close="false"
      :append-to-body="false"
      v-model="dialogEditVisible"
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
          :label="$t('Name')"
          required
          prop="name"
        >
          <el-input v-model="editForm.name" />
        </el-form-item>

        <el-form-item
          :label="$t('Code')"
          prop="code"
        >
          <el-input v-model="editForm.code"/>
        </el-form-item>
      </el-form>
      <div
slot="footer"
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
    </el-dialog>
  </div>
</template>

<script>
import regionApi from '../../api/regionApi'

export default {
  components: {
  },
  props: {
    code: String
  },
  data () {
    return {
      parent_code: '',
      inputVisible: false,
      inputValue: '',
      queryForm: {
        page_index: 1,
        page_size: 50
      },
      addForm: {
        name: '',
        code: ''
      },
      editForm: {
        id: 0,
        name: '',
        code: ''
      },
      rules: {
        name: [
          { required: true, message: this.$i18n.t('Please Input Name'), trigger: 'blur' },
          { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ]
      },
      count: 0,
      tableData: [],
      loading: false,
      dialogAddVisible: false,
      dialogEditVisible: false
    }
  },
  computed: {
  },
  watch: {
    '$route' (to, from) {
      // this.refresh()
    }
  },
  created () {

  },
  mounted () {
    this.refresh()
  },
  methods: {
    onBack () {
      this.$router.replace({ path: '/admin/region/city/' + this.parent_code })
    },
    byPagerSizeChange (val) {
      this.queryForm.page_size = val
      this.refresh()
    },
    byPagerCurrentChange (val) {
      this.queryForm.page_index = val
      this.refresh()
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

            regionApi.deleteCityArea({ id: id }, (res) => {
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
    onSubregion (row) {
      this.$router.push({ path: '/admin/region/town/' + row.code })
    },
    submitEditForm () {
      this.loading = true
      let that = this
      regionApi.updateCityArea(this.editForm, (resp) => {
        that.loading = false
        that.dialogEditVisible = false
        this.refresh()
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
        this.dialogEditVisible = false
      })
    },
    submitAddForm () {
      console.log(this.addForm)
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          regionApi.createCityArea(this.addForm, (resp) => {
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
        name: '',
        code: '',
        parent_code: this.code
      }
      this.dialogAddVisible = true
    },
    onEdit (row) {
      this.editForm = {
        id: row.id,
        name: row.name,
        code: row.code
      }
      this.dialogEditVisible = true
    },
    async refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      let that = this
      this.queryForm.code = this.code
      if (this.parent_code === '') {
        let info = await regionApi.infoCity(this.code)
        this.parent_code = info.parent_code
      }
      regionApi.queryCityArea(this.queryForm, (resp) => {
        that.count = resp.count
        that.tableData = resp.list
        that.loading = false
      }, (resp) => {
        window.tools.alertError(resp.msg)
        that.loading = false
      })
    }
  }
}
</script>
