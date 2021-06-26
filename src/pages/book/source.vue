<style>
</style>
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
          width="160px"
          prop="source_type_name"
          :label="$t('source_type_name')"
        />
        <el-table-column
          width="120px"
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
          width="120px"
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
          width="90px"
          prop="page_no"
          :label="$t('Chapter') + $t('Total')"
        >
          <template #default="scope">
            {{ scope.row.page_no }}
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
          width="100px"
          :label="$t('State')"
        >
          <template #default="scope">
            {{ getState(scope.row.crawling_state) }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
              size="mini"
              icon="el-icon-top"
              @click="SetDefault(scope.row)"
            >
              设置为默认来源
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from '../../api/bookApi'

export default {
  components: {
  },
  props: {
    id: String,
  },
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      source: [],
      queryForm: {
        source_type_id: 2,
        page_index: 1,
        page_size: 10
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
    getState (state) {
      switch (state) {
        case 1:
          return '更新中'
        case 0:
          return '等待更新'
        case -1:
          return '更新出错'
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
    SetDefault (row) {
      this.loading = true
      api.setDefaultSource({ id: this.id, source_type_id: row.source_type_id }, (resp) => {
        this.loading = false
      }, (resp) => {
        window.dbh.alertError(resp)
        this.loading = false
      })
    },
    refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      this.queryForm.book_id = this.id
      api.querySource(this.queryForm, (resp) => {
        console.debug('resp ', resp)
        this.loading = false
        this.tableData = resp
      }, (resp) => {
        window.dbh.alertError(resp.msg)
        this.loading = false
      })
    }
  }
}
</script>
