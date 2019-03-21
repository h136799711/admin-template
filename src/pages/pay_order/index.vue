<style>
.extra_info .el-form-item__label{
    font-size: 12px;
    line-height: 20px;
    width: 140px;
}
.extra_info .el-form-item {
    margin-bottom: 0px;
}
.extra_info .el-form-item__content{
    line-height: 20px;
    font-size: 12px;
}
</style>
<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item >
                    <el-radio v-model="queryForm.pay_status" :label="0">{{$t('NotPaid')}}</el-radio>
                    <el-radio v-model="queryForm.pay_status" :label="1">{{$t('Paid')}}</el-radio>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="refresh()"  size="mini" icon="el-icon-search">{{ $t('Search') }}</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-button
                type="primary"
                size="mini"
                icon="by-icon by-shuaxin"
                :loading="loading"
                @click="refresh()">
            {{ $t('Refresh')}}
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
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" class="extra_info">
                            <el-form-item
                                :label="$t('CallbackUrl')">
                                <span>{{ unescape(props.row.callback) }}</span>
                            </el-form-item>
                            <el-form-item
                                    :label="$t('TradeNo')">
                                {{props.row.trade_no}}
                            </el-form-item>
                            <el-form-item
                                    :label="$t('PayType')">
                                    {{getPayType(props.row.pay_type)}}
                            </el-form-item>
                            <el-form-item
                                    :label="$t('Initiate') + $t('PayTime')">
                                    {{(new Date(props.row.pay_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                            </el-form-item>
                            <el-form-item :label="$t('PayTime')">
                                {{(new Date(props.row.notify_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column
                        width="120px"
                        prop="channel"
                        :label="$t('Channel')"
                >
                    <template slot-scope="scope">
                        {{scope.row.client_id}}({{scope.row.channel}})
                    </template>
                </el-table-column>
                <el-table-column
                        width="180px"
                        prop="pay_code"
                        :label="$t('PayCode')"
                >
                    <template slot-scope="scope">
                        {{scope.row.pay_code}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        :label="$t('MerchantOrderCode')">
                    <template slot-scope="scope">
                        {{scope.row.merchant_order_code}}
                    </template>
                </el-table-column>

                <el-table-column
                        width="120px"
                        :label="$t('Money')">
                    <template slot-scope="scope">
                        {{scope.row.money/100}} {{$t('Unit.Yuan')}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="140px"
                        :label="$t('CreateTime')">
                    <template slot-scope="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="120px"
                        :label="$t('Is') + $t('Paid')">
                    <template slot-scope="scope">
                        {{$t('' + scope.row.pay_status)}}
                    </template>
                </el-table-column>
                <el-table-column
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-view"
                                @click="onNotifyHistory(scope.row)">
                            {{$t('Notify')}}{{$t('History')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="text-center">
            <el-pagination
                    :current-page="queryForm.page_index"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="queryForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count"
                    @size-change="byPagerSizeChange"
                    @current-change="byPagerCurrentChange" />
        </div>

    </div>
</template>

<script>
	import payOrder from '../../api/payOrderApi'
	import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
	import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
	import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'


	export default {
		components: {
			ElForm,
			ElButtonGroup,
			ElButton
		},
		data() {
			return {
				queryForm: {
					pay_status: 1,
                    page_index: 1,
                    page_size: 10
				},
				rules: {
					title: [
						{required: true, message: this.$i18n.t ('Please Input Title'), trigger: 'blur'},
						{min: 1, max: 32, message: this.$i18n.t ('String Length Between', [1, 32]), trigger: 'blur'}
					]
				},
				count: 0,
				tableData: [],
				loading: false,
			}
		},
		computed: {
		},
		watch: {
        },
		created() {

		},
        mounted() {
            this.refresh()
        },
		methods: {
            onNotifyHistory(row) {

            },
            unescape(url) {
                return decodeURIComponent(url)
            },
			getPayType(payType) {
				switch (parseInt(payType)) {
                  case 1:
                  	return this.$i18n.t('PcAliPay');
                  default: return "Unknown"
                }
            },
            byPagerSizeChange(val) {
                this.queryForm.pageSize = val
                this.refresh ()
            },
            byPagerCurrentChange(val) {
                this.queryForm.currentPage = val
                this.refresh ()
            },
			refresh() {
				// 刷新当前
				this.tableData = []
				this.loading = true
                let that = this
                payOrder.query(that.queryForm, (resp) => {
                    that.tableData = resp.list
                    that.count = parseInt(resp.count)
                    that.loading = false
                }, (resp) => {
                    window.tools.alertError (resp.msg)
                    that.loading = false
                })
			}
		}
	}
</script>
