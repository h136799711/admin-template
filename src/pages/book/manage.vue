<template>
  <div class="main-content padding-md-bottom padding-md-top">
    <div>
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item label="不大于章节数">
          <el-input
            v-model="queryForm.chapters"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryForm.book_name"
            size="mini"
            :placeholder="$t('Title')"
          />
        </el-form-item>
        <el-form-item label="最新章节标题">
          <el-input
            v-model="queryForm.chapter_title"
            size="mini"
            :placeholder="$t('Title')"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="search()"
          >
            {{ $t('Search') }}
          </el-button>
        </el-form-item>
      </el-form>
      <div>
        (可以查含 本书,完,大结局,感言,后记,番外,最终章,完本,全书,完结,感言,全文,终结,新书,新的开始,尾声,结束语)

        <el-button
                :loading="loading"
                type="primary"
                size="mini"
                @click="onBatchEnd()"
        >
          {{ $t('Batch') + $t('End') }}
        </el-button>
      </div>
    </div>

    <div class="grid-content margin-md-top">
      <el-table
        ref="table"
        v-loading="loading"
        :data="tableData"
        stripe
        sortable="custom"
        @selection-change="handleSelectionChange"
        :element-loading-text="$t('Loading')"
        style="width: 100%"
      >
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column
          width="140px"
          prop="title"
          :label="$t('Title')"
        />
        <el-table-column
          width="100px"
          prop="cate_name"
          :label="$t('Category')"
        >
          <template #default="scope">
            {{ scope.row.cate_name }}
          </template>
        </el-table-column>
        <el-table-column
          width="140px"
          prop="total_chapters"
          :label="$t('Total')"
        />
        <el-table-column
          width="200px"
          :label="$t('Title')"
        >
          <template #default="scope">
            <a
              target="_blank"
              :href="'https://book-demo.hebidu.cn/book/' + scope.row.id + '_' + scope.row.def_source_type_id + '/' + scope.row.latest_page_no"
            > {{ scope.row.latest_chapter_title }}</a>
          </template>
        </el-table-column>
        <el-table-column
          width="140px"
          :label="$t('CreateTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.latest_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
              size="mini"
              @click="onEnd(scope.row.id)"
            >
              {{ $t('End') }}
            </el-button>
            <el-button
              size="mini"
              @click="onCrawlingFirst(scope.row.id)"
            >
              {{ $t('CrawlingFirst') }}
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
  </div>
</template>

<script>
import api from '../../api/bookApi'

export default {
  components: {
  },
  data () {
    return {
      queryForm: {
        chapter_title: '',
        chapters: 6000,
        book_name: '',
        page_index: 1,
        page_size: 10
      },
      count: 0,
      tableData: [],
      loading: false,
      multipleSelection: []
    }
  },
  mounted: function () {
    this.refresh()
  },
  methods: {
    onBatchEnd () {
      let ids = '';
      this.multipleSelection.forEach((value) => {
        if (ids.length > 0) {
          ids += ',';
        }
        ids += value.id;
      });
      api.batchSetEnd({ ids: ids }, (resp) => {
        console.debug(resp);
        this.loading = false
        this.refresh()
      }, (resp) => {
        window.dbh.alertError(resp.msg)
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      console.debug("选择", val);
      this.multipleSelection = val;
    },
    onCrawlingFirst (id) {
      api.setSort({ book_id: id, crawler_sort: 111 }, (resp) => {
        this.loading = false
        this.refresh()
      }, (resp) => {
        window.dbh.alertError(resp.msg)
        this.loading = false
      })
    },
    onEnd (id) {
      api.setEnd({ id: id }, (resp) => {
        this.loading = false
        this.refresh()
      }, (resp) => {
        window.dbh.alertError(resp.msg)
        this.loading = false
      })
    },
    byPagerSizeChange (val) {
      this.queryForm.page_size = val
      this.refresh()
    },
    byPagerCurrentChange (val) {
      this.queryForm.page_index = val
      this.refresh()
    },
    search () {
      this.queryForm.page_index = 1
      this.refresh()
    },
    refresh () {
      // 刷新当前

      this.multipleSelection = [];
      this.tableData = []
      this.loading = true
      api.queryChapters(this.queryForm, (resp) => {
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
