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
    <div >
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item>
          <label>{{ $t('PayStatus')}}</label>:
          <el-select size="mini" v-model="queryForm.pay_status" clearable :placeholder="$t('All')">
            <el-option key="" value="" :label="$t('All')">
            </el-option>
            <el-option key="0" value="0" :label="$t('NotPaid')">
            </el-option>
            <el-option key="1" value="1" :label="$t('Paid')">
            </el-option>
          </el-select>
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
            <el-option key="3" value="3" :label="$t('Sent')">
            </el-option>
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

    <div
      class="grid-content "
    >
      <el-table
        ref="table"
        v-loading="loading"
        :data="tableData"
        stripe
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
          :label="$t('Paid')"
        >
          <template #default="scope">
            {{ $t(scope.row.pay_status.toString()) }}
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
            <span v-if="scope.row.order_status==3">{{ $t('Sent') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('Action')"
        >
          <template #default="scope">

            <el-button
                    size="mini"
                    @click="onView(scope.row)"
            >
              {{ $t('View') }}
            </el-button>


            <el-button
              :disabled="scope.row.order_status !== 0"
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


    <!-- 查看 -->
    <el-dialog
            :show-close="false"
            :append-to-body="false"
            title="订单详情"
            v-model="dialogViewVisible"
    >
      <el-form
              v-if="!dialogViewLoading"
              label-width="120px"
      >

        <el-form-item
                label="用户ID/手机"
        >
          [{{ viewForm.user_id }}]{{ viewForm.user_mobile }}
        </el-form-item>
        <el-form-item
                label="订单号"
        >
          {{ viewForm.order_no }}
        </el-form-item>
        <el-form-item
                label="总金额/支付金额"
        >
          {{ (viewForm.total_price/100.0).toFixed(2) }}元 / {{(viewForm.pay_price/100.0).toFixed(2)}}元
        </el-form-item>
        <el-form-item
                label="下单时间"
        >
          {{(new Date(viewForm.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
        </el-form-item>
        <el-form-item
                label="取餐号码"
        >
          {{viewForm.pickup_code}}
        </el-form-item>
        <el-form-item
                label="取餐日期"
        >
          {{(new Date(viewForm.pick_up_time_begin * 1000)).format('yyyy-MM-dd hh:mm')}}-{{(new
          Date(viewForm.pick_up_time_end * 1000)).format('hh:mm')}}
        </el-form-item>
        <el-form-item
                label="取餐地点"
        >
          {{ viewForm.pick_up_place_info.title }}({{ viewForm.pick_up_place_info.phone }})<br/>
          {{ viewForm.pick_up_place_info.location }}
        </el-form-item>

        <el-form-item
                label="备注"
        >
          {{ viewForm.note }}
        </el-form-item>
        <el-form-item
                label="券信息"
        >
          <div v-if="viewForm.user_coupon_id == 0">
            没有使用券
          </div>
          <div v-else>
            [{{ viewForm.user_coupon_id }}]
            {{viewForm.user_coupon_info.title}}

            {{viewForm.user_coupon_info.note}}

          </div>
        </el-form-item>
        <el-form-item
                label="商品"
        >
          <el-table
                  ref="table"
                  :data="viewForm.items"
                  stripe
                  style="width: 100%"
          >
            <el-table-column
                    :label="$t('Title')">
              <template #default="scope">
                <el-image :src="scope.row.item_image" style="width: 80px;height:60px;"></el-image>
                <br/>
                {{scope.row.item_title}}/{{scope.row.item_sku_title}}
              </template>
            </el-table-column>
            <el-table-column
                    width="100px"
                    :label="$t('Price')">
              <template #default="scope">
                {{(scope.row.item_sku_price/100.0).toFixed(2)}}
              </template>
            </el-table-column>
            <el-table-column
                    width="100px"
                    label="数量">
              <template #default="scope">
                {{(scope.row.item_count)}}
              </template>
            </el-table-column>
          </el-table>

        </el-form-item>


        <el-form-item
                label="状态日志"
        >
          <el-table
                  :data="viewForm.his"
                  stripe
                  style="width: 100%"
          >
            <el-table-column
                    width="120px"
                    :label="$t('CreateTime')">
              <template #default="scope">
                {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
              </template>
            </el-table-column>
            <el-table-column
                    :label="$t('Note')">
              <template #default="scope">
                {{scope.row.note}}
              </template>
            </el-table-column>
          </el-table>

        </el-form-item>

      </el-form>
      <div v-else>
        载入中...
      </div>
      <template #footer>
      <div  class="dialog-footer">
        <el-button @click="dialogViewVisible = false">
          确定
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
      dialogViewVisible: false,
      dialogViewLoading: true,
      notifyHistory: [],
      dialogGiveVisible: false,
      queryForm: {
        mobile: '',
        order_status: '',
        pay_status: '',
        page_index: 1,
        page_size: 10
      },
      viewForm: {
        address_info: {
          name: '',mobile:'',detail:''
        }
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
    async onView(row) {
      this.dialogViewVisible = true;
      this.dialogViewLoading = true;
      let order = await dtOrderApi.info({id: row.id});

      this.dialogViewLoading = false;
      // this.viewForm.order_no = row.order_no
      this.viewForm = order;
      this.viewForm.pick_up_place_info = JSON.parse(this.viewForm.pick_up_place_info);
      if (this.viewForm.user_coupon_info.length > 0) {
        this.viewForm.user_coupon_info = JSON.parse(this.viewForm.user_coupon_info);
      }
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
      this.loading = true
      let that = this
      try {
        let data = await dtOrderApi.query(that.queryForm)
        that.tableData = data.list
        that.count = parseInt(data.count)
        that.loading = false
      } catch (err) {
        console.debug(err)
        window.dbh.alertError(err)
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
      dtOrderApi.setOut({ id: this.order_id, uid: this.user_id }).catch((err) => {
        dbh.alertError(err.message);
      }).then(function () {
        that.refresh()
      }).finally(function () {
          that.loading = false
          that.dialogGiveVisible = false
      })
    }
  }
}
</script>
