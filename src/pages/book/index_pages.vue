
<template>
  <div class="main-content by-album padding-md-bottom padding-md-top">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-back"
      @click="$router.replace('/admin/book/index')"
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
          width="80px"
          prop="page_no"
          :label="$t('No')"
        />
        <el-table-column
          width="180px"
          prop="title"
          :label="$t('Title')"
        />
        <el-table-column
          width="120px"
          prop="source_type"
          :label="$t('SourceTypeName')"
        />
        <el-table-column
          width="200px"
          :label="$t('Time')"
        >
          <template #default="scope">
            {{ $t('CreateTime') }}: {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
            <br>
            {{ $t('UpdateTime') }}: {{ (new Date(scope.row.update_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          width="300px"
          :label="$t('Url')"
        >
          <template #default="scope">
            <a
              :href="scope.row.url"
              target="_blank"
            >{{ scope.row.url }}</a>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <a
              :href="getPageContent(scope.row)"
              target="_blank"
            >
              查看内容页
            </a>
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
        label-width="200px"
        class="edit-form"
      >
        <el-form-item
          :label="$t('StartUrl')"
          prop="start_url"
        >
          <el-input
            v-model="editForm.start_url"
          />
        </el-form-item>
        <el-form-item
          :label="$t('CurrentUrl')"
          prop="current_url"
        >
          <el-input
            v-model="editForm.current_url"
          />
        </el-form-item>
        <el-form-item
          :label="$t('NextCrawlingTime')"
        >
          <el-date-picker
            v-model="editForm.next_crawling_time"
            size="mini"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="timestamp"
            :editable="false"
            type="datetime"
            :placeholder="$t('Date')"
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
import api from '../../api/bookApi.js'

export default {
  components: {
  },
  props: {
    id: {
      type: String,
      default () {
        return '0'
      }
    },
    bookId: {
      type: String,
      default () {
        return '0'
      }
    }
  },
  data () {
    return {
      states: [
        { 'code': '0', 'name': '等待更新' },
        { 'code': '1', 'name': '正在更新' },
        { 'code': '-1', 'name': '更新失败' },
        { 'code': '2', 'name': '更新完毕' }
      ],
      inputVisible: false,
      inputValue: '',
      queryForm: {
        no: '',
        page_index: 1,
        page_size: 10
      },
      editForm: {
        id: 0,
        start_url: '',
        current_url: '',
        next_crawling_time: new Date()
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
    getPageContent (row) {
      var url = new URL(dbh.config.getApiUrl())
      return url.origin + '/book/' + row.source_type_id + '/' + row.book_id + '/' + row.id
    },
    submitEditForm () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          api.updateSource(this.editForm, (resp) => {
            this.loading = false
            this.dialogEditVisible = false
            window.dbh.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
            this.refresh()
          }, (resp) => {
            window.dbh.alertError(resp.msg)
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    onEdit (row) {
      console.log('row', row)
      this.editForm.id = row.id
      this.editForm.start_url = row.start_url
      this.editForm.current_url = row.current_url
      this.editForm.next_crawling_time = new Date(row.next_crawling_time * 1000)

      this.dialogEditVisible = true
    },
    byPagerSizeChange (val) {
      this.queryForm.page_size = val
      this.refresh()
    },
    byPagerCurrentChange (val) {
      this.queryForm.page_index = val
      this.refresh()
    },
    refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      this.queryForm.source_type_id = this.id
      this.queryForm.book_id = this.book_id
      api.queryBookPages(this.queryForm, (resp) => {
        console.debug('resp ', resp)
        this.loading = false
        this.count = parseInt(resp.count)
        this.tableData = resp.list
      }, (resp) => {
        window.dbh.alertError(resp.msg)
        this.loading = false
      })
    }
  }
}
</script>
