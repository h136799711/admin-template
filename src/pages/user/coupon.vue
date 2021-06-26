<template>
  <div class="main-content by-user-session padding-md-bottom padding-md-top">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-back"
      @click="$router.replace('/admin/user/index')"
    >
      {{ $t('Back') }}
    </el-button>
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-refresh"
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
          width="160px"
          prop="title"
          :label="$t('Title')"
        />
        <el-table-column
          width="160px"
          prop="note"
          :label="$t('Note')"
        />
        <el-table-column
          width="160px"
          prop="cond_goods_id"
          :label="$t('GoodsId')"
        >
          <template #default="scope">
            <span v-if="scope.row.cond_goods_id=='0'">任何商品</span>
            <span
              v-for="(item,index) in scope.row.cond_goods_info"
              v-else
              :key="index"
            >{{ item.title }}
              <span v-if="index<scope.row.cond_goods_info.length-1">,</span> </span>
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('DiscountAmount')"
        >
          <template #default="scope">
            {{ (scope.row.discount_amount / 100).toFixed(2) }}
            {{ $t('Unit.Yuan') }}
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('CondAmount')"
        >
          <template #default="scope">
            {{ (scope.row.cond_order_amount / 100).toFixed(2) }}
            {{ $t('Unit.Yuan') }}
          </template>
        </el-table-column>

        <el-table-column
          width="160px"
          :label="$t('StartDate')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.begin_date * 1000)).format('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('EndDate')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.end_date * 1000)).format('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('GetTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd') }}
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>

<script>
import api from '../../api/userApi'
import dtCouponApi from '../../api/dtCouponApi'

export default {
  components: {
  },
  props: {
    id: 0,
  },
  data () {
    return {
      queryForm: {
        page_index: 1,
        page_size: 20
      },
      count: 0,
      tableData: [],
      loading: false
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.refresh()
  },
  mounted () {
    console.debug('index mounted')
  },
  methods: {
    byPagerSizeChange (val) {
      this.queryForm.page_size = val
      this.refresh()
    },
    byPagerCurrentChange (val) {
      this.queryForm.page_index = val
      this.refresh()
    },
    async refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      this.queryForm.user_id = this.id
      let that = this
      try {
        let data = await dtCouponApi.queryByUserId(that.queryForm)
        that.tableData = data.list
        that.tableData.forEach(element => {
          if (element.cond_goods_info) {
            element.cond_goods_info = JSON.parse(element.cond_goods_info)
          }
        })
        that.count = parseInt(data.count)
        that.loading = false
      } catch (err) {
        console.debug(err)
        window.dbh.alertError(err)
        that.loading = false
      }
    }
  }
}
</script>
