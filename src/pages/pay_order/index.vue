<style>
    .extra_info .el-form-item__label {
        font-size: 12px;
        line-height: 20px;
        width: 140px;
    }

    .extra_info .el-form-item {
        margin-bottom: 0px;
    }

    .extra_info .el-form-item__content {
        line-height: 20px;
        font-size: 12px;
    }
</style>
<template>
  <div class="main-content by-banners padding-md-bottom padding-md-top">
    <div v-if="!notifyVisible">
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-radio
            v-model="queryForm.pay_status"
            :label="0"
          >
            {{ $t('NotPaid') }}
          </el-radio>
          <el-radio
            v-model="queryForm.pay_status"
            :label="1"
          >
            {{ $t('Paid') }}
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryForm.merchant_order_code"
            :placeholder="$t('Merchant') + $t('OrderCode')"
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
            {{
              $t('Search') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button
      v-if="notifyVisible"
      type="primary"
      size="mini"
      icon="el-icon-back"
      @click="back()"
    >
      {{ $t('Back') }}
    </el-button>
    <el-button
      v-if="!notifyVisible"
      type="primary"
      size="mini"
      icon="by-icon by-shuaxin"
      :loading="loading"
      @click="refresh()"
    >
      {{ $t('Refresh') }}
    </el-button>

    <div
      v-if="notifyVisible"
      class="grid-content margin-md-top"
    >
      <!-- History Table Start -->
      <el-table
        ref="notifyTable"
        v-loading="loading"
        :data="notifyHistory"
        stripe
        sortable="custom"
        :element-loading-text="$t('Loading')"
        style="width: 100%"
      >
        <el-table-column
          width="220px"
          prop="pay_code"
          :label="$t('PayCode')"
        >
          <template #default="scope">
            {{ scope.row.pay_code }}
          </template>
        </el-table-column>
        <el-table-column
          width="300px"
          :label="$t('Notify') + $t('Message')"
        >
          <template #default="scope">
            {{ scope.row.notify_msg }}
          </template>
        </el-table-column>

        <el-table-column
          width="140px"
          :label="$t('Notify') + $t('Count')"
        >
          <template #default="scope">
            {{ scope.row.notify_count }}
          </template>
        </el-table-column>
        <el-table-column
          width="140px"
          :label="$t('NotifyTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
      <!-- History Table End -->
    </div>

    <div
      class="grid-content margin-md-top "
      :style="notifyVisible ?'display:none':'display:block' "
    >
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
          width="100px"
          type="expand"
          :label="$t('Detail')"
        >
          <template slot-scope="props">
            <el-form
              label-position="left"
              class="extra_info"
            >
              <el-form-item
                :label="$t('Merchant') + $t('CallbackUrl')"
              >
                <span>{{ unescape(props.row.callback) }}</span>
              </el-form-item>
              <el-form-item
                :label="$t('TradeNo')"
              >
                {{ props.row.trade_no }}
              </el-form-item>
              <el-form-item
                :label="$t('PayType')"
              >
                {{ getPayType(props.row.pay_type) }}
              </el-form-item>
              <!--                            <el-form-item-->
              <!--                                    :label="$t('Initiate') + $t('PayTime')">-->
              <!--                                    {{(new Date(props.row.pay_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}-->
              <!--                            </el-form-item>-->
              <el-form-item :label="$t('PayTime')">
                {{ (new Date(props.row.notify_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
              </el-form-item>
              <el-form-item>
                <el-button
                  size="mini"
                  icon="el-icon-view"
                  @click="onNotifyHistory(props.row)"
                >
                  {{ $t('Notify') }}{{ $t('History') }}
                </el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          width="120px"
          prop="channel"
          :label="$t('Channel')"
        >
          <template #default="scope">
            {{ scope.row.client_id }}
          </template>
        </el-table-column>
        <el-table-column
          width="220px"
          prop="pay_code"
          :label="$t('PayCode')"
        >
          <template #default="scope">
            {{ scope.row.pay_code }}
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('Merchant') + $t('OrderCode')"
        >
          <template #default="scope">
            {{ scope.row.out_order_no }}
          </template>
        </el-table-column>
        <el-table-column
          width="200px"
          prop="pay_code"
          :label="$t('PayType')"
        >
          <template #default="scope">
            {{ getPayType(scope.row.pay_type) }}
          </template>
        </el-table-column>

        <el-table-column
          width="120px"
          :label="$t('Money')"
        >
          <template #default="scope">
            {{ $t('Initiate') }}: {{ scope.row.money/100 }} {{ $t('Unit.Yuan') }}<br>
            {{ $t('Notify') }}: {{ scope.row.notify_money/100 }} {{ $t('Unit.Yuan') }}
          </template>
        </el-table-column>
        <el-table-column
          width="140px"
          :label="$t('CreateTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          :label="$t('Is') + $t('Paid')"
        >
          <template #default="scope">
            {{ $t('' + scope.row.pay_status) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
              size="mini"
              @click="onNotifyManual(scope.row.id)"
            >
              {{ $t('Notify') }}
            </el-button>
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
import payOrder from '../../api/payOrderApi'

export default {
  components: {
  },
  data () {
    return {
      notifyHistory: [],
      queryForm: {
        merchant_order_code: '',
        pay_status: 1,
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
      notifyVisible: false
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
    onNotifyHistory (row) {
      this.queryNotifyHistory(row.pay_code)
    },
    back () {
      this.notifyVisible = false
    },
    unescape (url) {
      return decodeURIComponent(url)
    },
    getPayType (payType) {
      switch (payType) {
        case 'alipay_pc':
          return this.$i18n.t('PcAliPay')
        case 'alipay_wap':
          return this.$i18n.t('WapAliPay')
        default:
          return 'Unknown'
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
      let that = this
      payOrder.query(that.queryForm, (resp) => {
        that.tableData = resp.list
        that.count = parseInt(resp.count)
        that.loading = false
      }, (resp) => {
        window.tools.alertError(resp.msg)
        that.loading = false
      })
    },
    onNotifyManual (id) {
      this.loading = true
      let that = this
      payOrder.notify({ id: id }, (resp) => {
        that.loading = false
      }, (resp) => {
        window.tools.alertError(resp.msg)
        that.loading = false
      })
    },
    queryNotifyHistory (payCode) {
      this.loading = true
      let that = this
      that.notifyVisible = true
      payOrder.notifyHistory({ pay_code: payCode }, (resp) => {
        that.notifyHistory = resp
        that.loading = false
      }, (resp) => {
        window.tools.alertError(resp.msg)
        that.loading = false
      })
    }
  }
}
</script>
