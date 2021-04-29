<style>
    .icon {
        width: 48px;
        height: 48px;
    }
</style>
<template>
  <div class="main-content by-banners padding-md-bottom padding-md-top">
    <div>
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-input
            v-model="queryForm.title"
            size="mini"
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
            {{ $t('Search') }}
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
          prop="is_sale"
          :label="$t('Image')"
        >
          <template #default="scope">
            <img
              :src="scope.row.icon"
              alt="icon"
              class="icon"
            >
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
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
          width="320px"
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
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
          :label="$t('Icon')"
          prop="icon"
        >
          <ImgUploader
            ref="addImgUploader"
            :default-img-url="addForm.icon"
            :clear="imgUploadClear"
            img-type="brand_icon"
            @onUploadSuccess="onUploadSuccess"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Description')"
          required
          prop="description"
        >
          <el-input
            v-model="addForm.description"
            type="textarea"
            rows="5"
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
          :label="$t('Icon')"
          prop="icon"
        >
          <ImgUploader
            ref="editImgUploader"
            show="all"
            :default-img-url="editForm.icon"
            :clear="imgUploadClear"
            img-type="brand_icon"
            @onUploadSuccess="onUploadSuccess"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Description')"
          prop="description"
        >
          <el-input
            v-model="editForm.description"
            type="textarea"
            rows="5"
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
import fileApi from '../../api/fileApi'
import spBrand from '../../api/spBrandApi'

import ImgUploader from '../../components/img-uploaderV3.vue'

export default {
  components: {
    ImgUploader
  },
  data () {
    return {
      imgUploadClear: false,
      grandpa: 0,
      queryForm: {
        title: '',
        page_index: 1,
        page_size: 10
      },
      addForm: {
        title: '',
        description: 0,
        icon: 0
      },
      editForm: {
                	id: 0,
        title: '',
        description: 0,
        icon: 0
      },
      rules: {
        title: [
          { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
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
    dialogAddVisible (newVal) {
      if (!newVal) {
        this.imgUploadClear = true
      }
    }
  },
  created () {

  },
  mounted () {
    this.refresh()
  },
  methods: {
    editorImgAdd (pos, file) {
      fileApi.upload(file, 'brand_icon').then(({ data }) => {
        if (data.code === 0) {
          let imgUrl = window.tools.getImgUrl(data.data.relative_path)
          this.$refs.md.$img2Url(pos, imgUrl)
        } else {
          window.tools.alertError(data.msg)
        }
      }).catch((reason) => {
        window.tools.alertError(reason)
      })
    },
    onUploadSuccess (data) {
      if (this.dialogAddVisible) {
        this.addForm.icon = data.trim(",")
      } else if (this.dialogEditVisible) {
        this.editForm.icon = data.trim(",")
      }
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

            spBrand.delete({ id: id }, (res) => {
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
      spBrand.update(this.editForm, (resp) => {
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
          spBrand.create(this.addForm, (resp) => {
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
    onAddValue (row) {
      this.$router.replace({ path: '/admin/sp_prop/value/' + parseInt(row.id) })
    },
    onAdd () {
      this.addForm = {
        title: '',
        description: '',
        icon: ''
      }
      this.dialogAddVisible = true
    },
    onEdit (row) {
      this.editForm = {
        id: row.id,
        title: row.title,
        description: row.description,
        icon: row.icon
      }
      this.dialogEditVisible = true
    },
    refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      let that = this
      spBrand.query(that.queryForm, (resp) => {
        that.tableData = resp.list
        that.count = parseInt(resp.count)
        that.loading = false
      }, (resp) => {
        window.tools.alertError(resp.msg)
        that.loading = false
      })
    }
  }
}
</script>
