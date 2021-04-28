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
          <label>{{ $t('OrderStatus') }}</label>:
          <el-select
            v-model="queryForm.order_status"
            size="mini"
            clearable
            :placeholder="$t('All')"
          >
            <el-option
              key=""
              value=""
              :label="$t('All')"
            />
            <el-option
              key="0"
              value="0"
              :label="$t('NoPickedUp')"
            />
            <el-option
              key="1"
              value="1"
              :label="$t('PickedUp')"
            />
            <el-option
              key="2"
              value="2"
              :label="$t('Canceled')"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryForm.mobile"
            size="mini"
            :placeholder="$t('Mobile')"
            clearable
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
          width="180px"
          :label="$t('OrderCode')"
        >
          <template #default="scope">
            {{ scope.row.order_no }}
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('Mobile')"
        >
          <template #default="scope">
            {{ scope.row.user_mobile }}
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('PickupCode')"
        >
          <template #default="scope">
            {{ scope.row.pickup_code }}
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          :label="$t('Money')"
        >
          <template #default="scope">
            {{ scope.row.total_price/100 }} {{ $t('Unit.Yuan') }}<br>
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          :label="$t('Pay') + $t('Money')"
        >
          <template #default="scope">
            {{ scope.row.pay_price/100 }} {{ $t('Unit.Yuan') }}
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
          width="140px"
          :label="$t('PayTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.paid_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
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
          width="120px"
          :label="$t('OrderStatus')"
        >
          <template #default="scope">
            <span v-if="scope.row.order_status==0">{{ $t('NoPickedUp') }}</span>
            <span v-if="scope.row.order_status==1">{{ $t('PickedUp') }}</span>
            <span v-if="scope.row.order_status==2">{{ $t('Canceled') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.order_status==0"
              size="mini"
              @click="onSetOut(scope.row)"
            >
              {{ $t('Delivery') }}
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

    <el-dialog
      v-model="dialogGiveVisible"
      :show-close="false"
      :append-to-body="false"
      :title="$t('Delivery')"
    >
      <el-form
        label-position="right"
        label-width="100px"
      >
        <el-form-item>
          是否确认发货？
        </el-form-item>
      </el-form>
      <template #footer>
        <div
                class="dialog-footer"
        >
        <el-button @click="dialogGiveVisible = false">
          {{ $t('Cancel') }}
        </el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="sureSetOut()"
        >
          {{ $t('Confirm') }}
        </el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import dtOrderApi from '../../api/dtOrderApi'

export default {
  components: {
  },
  data () {
    return {
      notifyHistory: [],
      dialogGiveVisible: false,
      queryForm: {
        mobile: '',
        order_status: '',
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
      order_id: '',
      user_id: '',
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
        case 'wxpay_mini':
          return this.$i18n.t('WxappMini')
        case 'fake':
          return this.$i18n.t('Fake')
        default:
          return payType
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
    async refresh () {
      // 刷新当前
      // this.tableData = [];
      this.loading = true
      let that = this
      try {
        let data = await dtOrderApi.query(that.queryForm)
        that.tableData = data
        that.count = parseInt(that.tableData.length)
        that.loading = false
      } catch (err) {
        console.debug(err)
        window.tools.alertError(err)
        that.loading = false
      }
    },
    onSetOut (row) {
      this.order_id = row.id
      this.user_id = row.user_id
      this.dialogGiveVisible = true
    },
    sureSetOut () {
      this.loading = true
      let that = this
      dtOrderApi.setOut({ id: this.order_id, uid: this.user_id }).then(function () {
        window.tools.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
      }).finally(function () {
        setTimeout(function () {
          that.loading = false
          that.dialogGiveVisible = false
          that.refresh()
        }, 1000)
      })
    }
  }
}
</script>
