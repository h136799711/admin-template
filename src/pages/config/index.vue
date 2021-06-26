<template>
  <div class="main-content by-policy padding-md-bottom padding-md-top">
    <div>
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
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
            size="mini"
            icon="el-icon-search"
            @click="queryConfig()"
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
      @click="queryConfig()"
    >
      {{ $t('Refresh') }}
    </el-button>

    <div class="margin-md-top">
      <el-radio-group
        v-model="queryForm.cate"
        size="mini"
      >
        <span v-for="(item,index) in cateList">
          <el-radio-button :label="index">{{ item }}</el-radio-button>
        </span>
      </el-radio-group>
    </div>

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
          width="60px"
          :label="$t('ID')"
        />
        <el-table-column
          width="200px"
          prop="name"
          :label="$t('Name')"
        />
        <el-table-column
          width="200px"
          prop="title"
          :label="$t('Title')"
        />
        <el-table-column
          prop="remark"
          :label="$t('Remark')"
        />
        <el-table-column
          prop="sort"
          :label="$t('Sort')"
        />
        <el-table-column
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

    <!-- Edit Form -->
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
          prop="name"
        >
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item
          :label="$t('Name')"
          prop="name"
        >
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item
          :label="$t('Category')"
        >
          <el-select v-model="editForm.cate">
            <el-option
              v-for="(item,index) in cateList"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('ValueType')"
        >
          <el-select v-model="editForm.cfg_type">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('Value')"
          prop="value"
        >
          <el-input
            v-model="editForm.value"
            :rows="5"
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Remark')"
          prop="note"
        >
          <el-input
            v-model="editForm.remark"
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Sort')"
          prop="sort"
        >
          <el-input-number
            v-model="editForm.sort"
            class="input-number"
            :min="0"
          />
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
          @click="onSave()"
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
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          :label="$t('Title')"
          prop="name"
        >
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item
          :label="$t('Name')"
          prop="name"
        >
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item
          :label="$t('Category')"
        >
          <el-select v-model="addForm.cate">
            <el-option
              v-for="(item,index) in cateList"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('ValueType')"
        >
          <el-select v-model="addForm.cfg_type">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('Value')"
          prop="value"
        >
          <el-input
            v-model="addForm.value"
            :rows="5"
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Remark')"
          prop="note"
        >
          <el-input
            v-model="addForm.remark"
            type="textarea"
          />
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
import api from '../../api/configApi'

export default {
  components: {

  },
  data () {
    return {
      typeList: [
        { id: 0, label: this.$i18n.t('Number') },
        { id: 1, label: this.$i18n.t('Char') },
        { id: 2, label: this.$i18n.t('Text') },
        { id: 3, label: this.$i18n.t('Array') },
        { id: 4, label: this.$i18n.t('Enum') }
      ],
      cateList: [],
      queryForm: {
        cate: '',
				    name: '',
        page_index: 1,
        page_size: 10
      },
      addForm: {},
      editForm: {
        id: 0,
        remark: '',
        name: '',
        title: '',
        sort: 0,
        value: '',
        cate: '',
        cfg_type: ''
      },
      rules: {
        title: [
          { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
          { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$i18n.t('Please Input Name'), trigger: 'blur' },
          { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ],
        remark: [
          { min: 0, max: 250, message: this.$i18n.t('String Length Between', [0, 250]), trigger: 'blur' }
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
    'queryForm.cate': function (oldVal, newVal) {
      this.queryConfig(newVal)
    }
  },
  created () {
    this.refresh()
  },
  mounted: function () {
  },
  methods: {
    onDelete (id) {
      this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
        confirmButtonText: this.$i18n.t('Confirm'),
        cancelButtonText: this.$i18n.t('Cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = window.dbh.vue_instance.$i18n.t('Processing').value

            let data = {
              'id': id
            }
            api.delete(data, (res) => {
              instance.confirmButtonLoading = false
              this.queryConfig()
              done()
            }, (res) => {
              console.debug(res)
              done()
              window.dbh.alertError(res)
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      }).then(() => {
        console.debug('[ajax] delete datatree')
      }).catch(() => {
      })
    },
    onSave () {
      api.update(this.editForm, (resp) => {
                 	this.loading = false
        this.dialogEditVisible = false
        window.dbh.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
        this.queryConfig()
      }, (resp) => {
                 	window.dbh.alertError(resp)
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
            window.dbh.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
            this.queryConfig()
          }, (resp) => {
            window.dbh.alertError(resp)
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    onAdd () {
      this.addForm = {
        remark: '',
        name: '',
        title: '',
        sort: 0,
        value: '',
        cate: '',
        cfg_type: '' }
      this.dialogAddVisible = true
    },
    onEdit (row) {
      this.editForm = Object.assign({
        id: 0,
        remark: '',
        name: '',
        title: '',
        sort: 0,
        value: '',
        cate: '',
        cfg_type: ''
      }, row)
      this.editForm.cfg_type = row.type
      this.dialogEditVisible = true
    },
    byPagerSizeChange (val) {
      this.queryForm.page_size = val
      this.queryConfig()
    },
    byPagerCurrentChange (val) {
      this.queryForm.page_index = val
      this.queryConfig()
    },
    queryConfig () {
      this.loading = true
      api.query(this.queryForm, (resp) => {
                	console.debug('resp ', resp)
                	this.loading = false
                	this.count = parseInt(resp.count)
                	this.tableData = resp.list
      }, (resp) => {
                	window.dbh.alertError(resp)
                	this.loading = false
      })
    },
    refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      api.listCate({}, (resp) => {
                	this.loading = false
        this.cateList = resp
        console.debug(this.cateList)
        for (var a in resp) {
                		this.queryForm.cate = a
          break
        }
        //                    this.queryConfig()
      }, (resp) => {
                	this.loading = false
      })
    }
  }
}
</script>
