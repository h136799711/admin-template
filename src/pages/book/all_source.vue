<style>
</style>
<template>
  <div class="main-content by-album padding-md-bottom padding-md-top">
    <el-form
      :inline="true"
      :model="queryForm"
      class="demo-form-inline"
    >
      <el-form-item label="书籍ID">
        <el-input
          v-model="queryForm.id"
          size="mini"
          placeholder="本站书籍ID"
        />
      </el-form-item>
      <el-form-item :label="$t('State')">
        <!--                    :placeholder="$t('All')"-->
        <el-select
          v-model="queryForm.state"
          size="mini"
        >
          <el-option
            :key="10"
            :value="10"
            :label="$t('All')"
          />
          <el-option
            v-for="item in states"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          icon="by-icon by-shuaxin"
          :loading="loading"
          @click="refresh()"
        >
          {{ $t('Refresh') }}
        </el-button>
        <label> 已收录书籍总数: {{ statics.books }} 本</label>
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
          prop="book_id"
          width="80px"
          :label="$t('Book') + $t('ID')"
        />
        <el-table-column
          width="120px"
          prop="source_type_name"
          :label="$t('source_type_name')"
        />
        <el-table-column
          width="160px"
          prop="start_url"
          :label="$t('StartUrl')"
        >
          <template #default="scope">
            <a
              :href="scope.row.start_url"
              target="_blank"
            >{{ scope.row.start_url }}</a>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          prop="current_url"
          :label="$t('CurrentUrl')"
        >
          <template #default="scope">
            <a
              :href="scope.row.current_url"
              target="_blank"
            >{{ scope.row.current_url }}</a>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          prop="page_no"
          :label="$t('Chapter') + $t('Total')"
        >
          <template #default="scope">
            {{ scope.row.page_no }} <br>
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="onViewChapter(scope.row)"
            >
              查看已更新章节
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          prop="next_crawling_time"
          :label="$t('NextCrawlingTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.next_crawling_time * 1000)).format('yyyy-MM-dd') }}
          </template>
        </el-table-column>

        <el-table-column
          width="220px"
          :label="$t('State')"
        >
          <template #default="scope">
            {{ getState(scope.row) }}
            <br>
            最近新章节更新时间: {{ (new Date(scope.row.last_suc_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
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
          :label="$t('State')"
          prop="state"
        >
          <el-select
            v-model="editForm.state"
            size="mini"
            :placeholder="$t('All')"
          >
            <el-option
              v-for="item in states"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
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
            format="YYYY-MM-DD HH:mm:ss"
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
        page_index: 1,
        page_size: 10,
        id: '',
        state: 10
      },
      editForm: {
        id: 0,
        state: '0',
        start_url: '',
        current_url: '',
        next_crawling_time: 0
      },
      rules: {
        title: [
          { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
          { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ]
      },
      count: 0,
      statics: {
        pages: 0,
        books: 0
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
    this.queryStatics()
  },
  mounted: function () {
    this.refresh()
  },
  methods: {
    queryStatics () {
      // 刷新当前
      api.statics({}, (resp) => {
        console.debug('resp ', resp)
        this.statics.books = resp.books
        this.statics.pages = resp.pages
      }, (resp) => {
        window.tools.alertError(resp)
      })
    },
    onViewChapter (row) {
      this.$router.push({ path: 'pages/' + row.source_type_id + '/' + row.book_id })
    },
    submitEditForm () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.editForm.next_crawling_time instanceof Date) {
            this.editForm.next_crawling_time = this.editForm.next_crawling_time.getTime() / 1000;
          }
          this.editForm.nextCrawlingTime = this.editForm.next_crawling_time;
          console.debug(this.editForm.next_crawling_time)
          api.updateSource(this.editForm, (resp) => {
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
    onEdit (row) {
      console.log('row', row)
      this.editForm.id = row.id
      this.editForm.start_url = row.start_url
      this.editForm.current_url = row.current_url
      this.editForm.next_crawling_time = new Date(row.next_crawling_time * 1000)
      this.editForm.state = row.crawling_state.toString()
      this.dialogEditVisible = true
    },
    getState (state) {
      switch (state.crawling_state) {
        case 1:
          return '更新中'
        case 0:
          return '等待更新'
        case -1:
          return '更新出错:' + state.crawling_error
        case 2:
          return '更新完毕'
        default:
          return '未知'
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
    refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      api.queryAllSource(this.queryForm, (resp) => {
        console.debug('resp ', resp)
        this.loading = false
        this.count = parseInt(resp.count)
        this.tableData = resp.list
      }, (resp) => {
        window.tools.alertError(resp)
        this.loading = false
      })
    }
  }
}
</script>
