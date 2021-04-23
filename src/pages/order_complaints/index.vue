<style>
    .blue {
        color: blue;
    }
</style>
<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <div>
            <div>
                <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                    <el-form-item>
                        <el-input v-model="queryForm.order_no" clearable size="mini" :placeholder="$t('OrderNo')"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" type="primary" @click="refresh()" size="mini" icon="el-icon-search">{{ $t('Search') }}
                        </el-button>
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
                    <el-table-column
                            prop="id"
                            width="40px"
                            :label="$t('ID')"
                    />
                    <el-table-column
                            width="180px"
                            :label="$t('OrderCode')">
                        <template slot-scope="scope">
                            {{scope.row.order_no}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                            width="160px"
                            :label="$t('Mobile')">
                        <template slot-scope="scope">
                            {{scope.row.mobile}}
                        </template>
                    </el-table-column> -->
                    <el-table-column
                            width="160px"
                            prop="user_id"
                            :label="$t('User')+$t('ID')"
                    />
                    <el-table-column
                            width="360"
                            :label="$t('Image')"
                    >
                        <template slot-scope="scope">
                            <span v-for="image in scope.row.img_list">
                                <a :href="image" target="_blank">
                                <el-image
                                        style="width: 80px; height: 80px"
                                        :key="image"
                                        fit="contain"
                                        :src="image" >
                                </el-image>
                                </a>
                            </span>

                        </template>
                    </el-table-column>
                    <el-table-column
                            width="160px"
                            prop="reason"
                            :label="$t('Reason')"
                    />
                    <el-table-column
                            width="160px"
                            prop="cate"
                            :label="$t('otherReason')"
                    />

                    <el-table-column
                            fixed="right"
                            :label="$t('Action')">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    icon="el-icon-folder"
                                    @click="onView(scope.row.order_id)">
                                订单详情
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
                            @current-change="byPagerCurrentChange"/>
                </div>
            </div>
        </div>


        <!-- 查看 -->
        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                title="订单详情"
                :visible.sync="dialogViewVisible"
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
                    {{(new Date(viewForm.pick_up_time_begin * 1000)).format('yyyy-MM-dd hh:mm')}}-{{(new Date(viewForm.pick_up_time_end * 1000)).format('hh:mm')}}
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
                            <template slot-scope="scope">
                                <el-image :src="scope.row.item_image" style="width: 80px;height:60px;"></el-image><br/>
                                {{scope.row.item_title}}/{{scope.row.item_sku_title}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                width="100px"
                                :label="$t('Price')">
                            <template slot-scope="scope">
                                {{(scope.row.item_sku_price/100.0).toFixed(2)}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                width="100px"
                                label="数量">
                            <template slot-scope="scope">
                                {{(scope.row.item_count)}}
                            </template>
                        </el-table-column>
                    </el-table>

                </el-form-item>


                <el-form-item
                        label="状态日志"
                >
                    <el-table
                            ref="table"
                            :data="viewForm.his"
                            stripe
                            style="width: 100%"
                    >
                        <el-table-column
                                width="120px"
                                :label="$t('CreateTime')">
                            <template slot-scope="scope">
                                {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                :label="$t('Note')">
                            <template slot-scope="scope">
                                {{scope.row.note}}
                            </template>
                        </el-table-column>
                    </el-table>

                </el-form-item>

            </el-form>
            <div v-else>
                载入中...
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogViewVisible = false">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import dtOrderApi from '../../api/dtOrderApi'
    import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
    import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
    import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

    export default {
        components: {
            ElForm,
            ElButtonGroup,
            ElButton,
        },
        data () {
            return {
                dialogViewVisible: false,
                dialogViewLoading: true,
                viewForm:{
                    order_no: ''
                },
                inputVisible: false,
                queryForm: {
                    order_no: '',
                    page_index: 1,
                    page_size: 10
                },
                tableData: [],
                count: 0,
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
            async onView(id) {
                this.dialogViewVisible = true;
                this.dialogViewLoading = true;
                let order = await dtOrderApi.info({id: id});

                this.dialogViewLoading = false;
                this.viewForm = order;
                this.viewForm.pick_up_place_info = JSON.parse(this.viewForm.pick_up_place_info);
                this.viewForm.user_coupon_info = JSON.parse(this.viewForm.user_coupon_info);
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
                this.loading = true;
                let that = this;
                try {
                    let data = await dtOrderApi.queryComplaints(that.queryForm);
                    that.tableData = data.list;
                    that.tableData.forEach(element => {
                        if(element.img_list){
                            element.img_list = element.img_list.split(',');
                        }
                    });
                    that.count = parseInt(data.count);
                    that.loading = false
                } catch (err) {
                    console.debug(err);
                    window.tools.alertError(err);
                    that.loading = false
                }
            }
        }
    }
</script>
