<template>
    <div class="main-content by-user-profile padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-back"
                @click="$router.replace('/admin/recharge/index')">
            {{ $t('Back')}}
        </el-button>

        <div class="grid-content margin-md-top">
            <el-form ref="form" :disabled="loading" :model="info" label-width="120px">
                <el-row type="flex" >
                    <el-col :span="6">
                        <el-form-item :label="$t('TradeNo')">
                            {{info.trade_no}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('TradeStatus')">
                            {{info.trade_status}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" >
                    <el-col :span="6">
                        <el-form-item :label="$t('Money')">
                            {{info.money}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('PayStatus')">
                            {{info.pay_status}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" >
                    <el-col :span="6">
                        <el-form-item :label="$t('OrderNo')">
                            {{info.out_order_no}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('PayCode')">
                            {{info.pay_code}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" >
                    <el-col :span="6">
                        <el-form-item :label="$t('OrderType')">
                            {{info.out_order_type}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('PayTime')">
                            {{info.pay_time}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" >
                    <el-col :span="6">
                        <el-form-item :label="$t('PayType')">
                            {{info.pay_type}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('CreateTime')">
                            {{info.create_time}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" >
                    <el-col :span="6">
                        <el-form-item :label="$t('Subject')">
                            {{info.subject}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
import api from "../../api/rechargeApi";
import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
import ElButtonGroup from "../../../node_modules/element-ui/packages/button/src/button-group.vue";
import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";

export default {
  components: {
    ElForm,
    ElButtonGroup,
    ElButton
  },
  props: {
    id: 0
  },
  data() {
    return {
      info: {
        trade_no: "", // 第三方支付交易编号
        trade_status: "", // 第三方支付状态
        subject: "",
        pay_status: 0, // 支付状态 0 待支付 1 已支付
        out_order_no: "", // 商品订单id
        out_order_type: "", // 商品订单类型 目前只有recharge充值订单
        pay_code: "", // 支付订单编号
        money: "",
        pay_time: "", // 支付时间
        pay_type: "", // 支付方式
        create_time: ""
      },
      loading: false
    };
  },
  computed: {},
  watch: {},
  created() {
    this.refresh();
  },
  mounted() {},
  methods: {
    refresh() {
      // 刷新当前
      this.loading = true;
      api.payInfo(
        { id: this.id },
        respon => {
          this.loading = false;
          let resp = respon[0];
          this.info.trade_no = resp.trade_no;
          this.info.trade_status = this.$i18n.t(resp.trade_status);
          this.info.subject = resp.subject;
          this.info.pay_status = resp.pay_status;
          if(this.info.pay_status==1){
            this.info.pay_status = this.$i18n.t('Paid');
          }else if(this.info.pay_status==0){
            this.info.pay_status = this.$i18n.t('NotPaid');
          }
          this.info.out_order_no = resp.out_order_no;
          this.info.out_order_type = resp.out_order_type;
          this.info.pay_code = resp.pay_code;
          this.info.money = (Number(resp.money) / 100).toFixed(2);
          this.info.pay_time = new Date(resp.pay_time * 1000).format(
            "yyyy-MM-dd hh:mm:ss"
          );
          this.info.pay_type = resp.pay_type;
          this.info.create_time = new Date(resp.create_time * 1000).format(
            "yyyy-MM-dd hh:mm:ss"
          );
        },
        resp => {
          window.tools.alertError(resp.msg);
          this.loading = false;
        }
      );
    }
  }
};
</script>
