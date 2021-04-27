<template>
  <div class="main-content by-album padding-md-bottom padding-md-top">
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
          width="80px"
          :label="$t('ID')"
        />
        <el-table-column
          width="160px"
          prop="title"
          :label="$t('Title')"
        />
        <el-table-column
          width="160px"
          prop="description"
          :label="$t('Description')"
        />
        <el-table-column
          prop="vid_cnt"
          :label="$t('Video') + $t('Total')"
        />
        <el-table-column
          prop="sort"
          :label="$t('Sort')"
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
          width="200px"
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
        ref="editForm"
        :model="editForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
        class="edit-form"
      >
        <el-form-item
          :label="$t('Title')"
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
          />
        </el-form-item>

        <el-form-item
          :label="$t('Sort')"
          prop="sort"
        >
          <el-input v-model="editForm.sort" />
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
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          :label="$t('Title')"
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
          />
        </el-form-item>

        <el-form-item
          :label="$t('Sort')"
          prop="sort"
        >
          <el-input v-model="addForm.sort" />
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
  </div>
</template>

<script>
import api from '../../api/videoCateApi'

export default {
  components: {
  },
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      category: [],
      queryForm: {},
      addForm: {
        title: '',
        description: '',
        sort: 0
      },
      editForm: {
        id: 0,
        title: '',
        description: '',
        sort: 0
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
  computed: {},
  watch: {},
  created () {

  },
  mounted: function () {
    this.refresh()
  },
  methods: {
    handleInputConfirm () {
      let inputValue = this.inputValue.trim()
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    submitEditForm () {
      api.update(this.editForm, (resp) => {
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
          api.create(this.addForm, (resp) => {
            this.loading = false
            this.dialogAddVisible = false
            window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
            this.refresh()
          }, (resp) => {
            window.tools.alertError(resp.msg)
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    onAdd () {
      this.addForm = {
        title: '',
        description: '',
        sort: 0
      }
      this.dialogAddVisible = true
    },
    onEdit (row) {
      this.editForm.id = row.id
      this.editForm.title = row.title
      this.editForm.description = row.description
      this.editForm.sort = row.sort
      this.dialogEditVisible = true
    },
    byPagerSizeChange (val) {
      this.refresh()
    },
    byPagerCurrentChange (val) {
      this.refresh()
    },
    refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      api.query(this.queryForm, (resp) => {
        console.debug('resp ', resp)
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
