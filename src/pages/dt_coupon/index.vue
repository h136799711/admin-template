<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <div v-if="!(this.dialogEditVisible || this.dialogAddVisible || this.dialogGiveVisible)">
            <div>
                <el-form
                        :inline="true"
                        :model="queryForm"
                        class="demo-form-inline"
                >
                    <el-form-item>
                        <el-input
                                v-model="queryForm.title"
                                clearable
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
                                @click="refresh()"
                        >
                            {{ $t('Search') }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    :loading="loading"
                    @click="onAdd()"
            >
                {{ $t('Add') }}
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
                            width="40px"
                            :label="$t('ID')"
                    />
                    <el-table-column
                            width="120px"
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
                            <span v-if="scope.row.cond_goods_id=='0' || scope.row.cond_goods_id==''">任何商品</span>
                            <span
                                    v-for="(item,index) in scope.row.cond_goods_info"
                                    v-else
                                    :key="index"
                            >{{ item.title }}
                <span v-if="index<scope.row.cond_goods_info.length-1">,</span> </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="100px"
                            :label="$t('DiscountAmount')"
                    >
                        <template #default="scope">
                            {{ (scope.row.discount_amount / 100).toFixed(2) }}
                            {{ $t('Unit.Yuan') }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="100px"
                            :label="$t('CondAmount')"
                    >
                        <template #default="scope">
                            {{ (scope.row.cond_order_amount / 100).toFixed(2) }}
                            {{ $t('Unit.Yuan') }}
                        </template>
                    </el-table-column>

                    <el-table-column
                            width="160px"
                            :label="$t('Date')"
                    >
                        <template #default="scope">
                            {{ (new Date(scope.row.begin_date * 1000)).format('yyyy-MM-dd') }}<br/>{{ (new Date(scope.row.end_date * 1000)).format('yyyy-MM-dd') }}
                        </template>
                    </el-table-column>

                    <el-table-column
                            fixed="right"
                            :label="$t('Action')"
                    >
                        <template #default="scope">

                          <el-button
                                  size="mini"
                                  @click="onUser(scope.row)">
                            已领取的用户
                          </el-button>
                          <el-button
                                  size="mini"
                                  icon="el-icon-s-promotion"
                                  @click="onGive(scope.row.id)"
                          >
                            {{ $t('Give') }}
                          </el-button>
                            <el-button
                                    size="mini"
                                    icon="el-icon-edit"
                                    @click="onEdit(scope.row)"
                            >
                                {{ $t('Edit') }}
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click="onDelete(scope.row.id)"
                            >
                                {{ $t('Delete') }}
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

        <!-- Give Form -->
        <div
                v-if="this.dialogGiveVisible"
                class="edit-form"
        >
            <div class="">
                <h2>{{ $t('Give') }}</h2>
            </div>

            <el-form
                    ref="giveForm"
                    class="margin-md-top"
                    :model="giveForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('User')"
                        required
                        prop="mobile"
                >
                    <el-autocomplete
                            v-model="giveForm.mobile"
                            :clearable="true"
                            class="inline-input"
                            :fetch-suggestions="querySearchAsync"
                            :placeholder="$t('Mobile')"
                            @clear="onMobileClear"
                            @select="handleSelect"
                    />
                </el-form-item>
            </el-form>
            <div
                    class="dialog-footer"
            >
                <el-button @click="dialogGiveVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        :loading="loading"
                        type="primary"
                        @click="submitGiveForm()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </div>

        <!-- Edit Form -->
        <div
                v-if="this.dialogEditVisible"
                class="edit-form"
        >
            <div class="">
                <h2>{{ $t('Edit') }}</h2>
            </div>

            <el-form
                    ref="editForm"
                    class="margin-md-top"
                    :model="editForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Title')"
                        required
                        prop="title"
                >
                    <el-input
                            v-model="editForm.title"
                            maxlength="60"
                            size="mini"
                            show-word-limit
                            placeholder="商品标题"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('Note')"
                        required
                        prop="note"
                >
                    <el-input
                            v-model="editForm.note"
                            maxlength="60"
                            size="mini"
                            show-word-limit
                            placeholder="优惠券备注"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('DiscountAmount')"
                        required
                        prop="discount_amount"
                >
                    <el-input-number v-model="editForm.discount_amount"/>
                </el-form-item>
                <el-form-item
                        :label="$t('CondAmount')"
                        required
                        prop="cond_order_amount"
                >
                    <el-input-number v-model="editForm.cond_order_amount"/>
                </el-form-item>
                <el-form-item
                        :label="$t('GoodsId')"
                        required
                        prop="cond_goods_id"
                >
                    <el-select
                            v-model="cond_goods_id"
                            multiple
                            :multiple-limit="multiplelimit"
                            placeholder="默认全场商品"
                            @change="changeGoods"
                    >
                        <el-option
                                label="全场商品"
                                value="0"
                                :disabled="defultoption"
                        />
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('StartDate')"
                        required
                        prop="begin_date"
                >
                    <el-date-picker
                            v-model="editForm.begin_date"
                            format="YYYY-MM-DD"
                            :editable="false"
                            :disabled-date="disabledDate"
                            type="date"
                            :placeholder="$t('Date')"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('EndDate')"
                        required
                        prop="end_date"
                >
                    <el-date-picker
                            v-model="editForm.end_date"
                            :disabled-date="disabledDate"
                            format="YYYY-MM-DD"
                            :editable="false"
                            type="date"
                            :placeholder="$t('Date')"
                    />
                </el-form-item>
            </el-form>
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
        </div>
        <!-- Add Form -->
        <div
                v-if="this.dialogAddVisible"
                class="add-form"
        >
            <div class="">
                <h2>{{ $t('Add') }}</h2>
            </div>
            <el-form
                    ref="addForm"
                    class="margin-md-top"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('Title')"
                        required
                        prop="title"
                >
                    <el-input
                            v-model="addForm.title"
                            maxlength="60"
                            size="mini"
                            show-word-limit
                            placeholder="优惠券标题"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('Note')"
                        required
                        prop="note"
                >
                    <el-input
                            v-model="addForm.note"
                            maxlength="60"
                            size="mini"
                            show-word-limit
                            placeholder="优惠券备注"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('DiscountAmount')"
                        required
                        prop="discount_amount"
                >
                    <el-input-number v-model="addForm.discount_amount"/>
                </el-form-item>
                <el-form-item
                        :label="$t('CondAmount')"
                        required
                        prop="cond_order_amount"
                >
                    <el-input-number v-model="addForm.cond_order_amount"/>
                </el-form-item>
                <el-form-item
                        :label="$t('GoodsId')"
                        prop="cond_goods_id"
                >
                    <el-select
                            v-model="cond_goods_id"
                            multiple
                            :multiple-limit="multiplelimit"
                            placeholder="默认全场商品"
                            @change="changeGoods"
                    >
                        <el-option
                                label="全场商品"
                                value="0"
                                :disabled="defultoption"
                        />
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('StartDate')"
                        required
                        prop="begin_date"
                >
                    <el-date-picker
                            v-model="addForm.begin_date"
                            :disabled-date="disabledDate"
                            format="YYYY-MM-DD"
                            :editable="false"
                            type="date"
                            :placeholder="$t('Date')"
                    />
                </el-form-item>
                <el-form-item
                        :label="$t('EndDate')"
                        required
                        prop="end_date"
                >
                    <el-date-picker
                            v-model="addForm.end_date"
                            :disabled-date="disabledDate"
                            format="YYYY-MM-DD"
                            :editable="false"
                            type="date"
                            :placeholder="$t('Date')"
                    />
                </el-form-item>
            </el-form>
            <div
                    class="dialog-footer"
            >
                <el-button @click="dialogAddVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        :loading="loading"
                        type="primary"
                        @click="submitAddForm()"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import dtCouponApi from '../../api/dtCouponApi'
    import dtGoodsApi from '../../api/dtGoodsApi'
    import userApi from '../../api/userApi'

    export default {
        components: {},
        data () {
            return {
                dialogAddVisible: false,
                dialogEditVisible: false,
                dialogGiveVisible: false,
                inputVisible: false,
                queryForm: {
                    title: '',
                    page_index: 1,
                    page_size: 10
                },
                tableData: [],
                options: [],
                multiplelimit: 3,
                cond_goods_id: [],
                user_id: '',
                coupon_id: '',
                giveForm: {
                    mobile: ''
                },
                addForm: {
                    title: '',
                    note: '',
                    discount_amount: '',
                    cond_order_amount: '',
                    cond_goods_id: '0',
                    begin_date: '',
                    end_date: '',
                    cate: ''
                },
                editForm: {
                    id: '',
                    title: '',
                    note: '',
                    discount_amount: '',
                    cond_order_amount: '',
                    cond_goods_id: '0',
                    begin_date: '',
                    end_date: '',
                    cate: ''
                },
                rules: {
                    title: [
                        { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
                        { min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ]
                },
                count: 0,
                loading: false,
                defultoption: false
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

          onUser(row) {
            this.$router.push({ path: 'user/' + row.id });
          },
            disabledDate (time) {
                return time.getTime() < (Date.now() - 24 * 3600 * 1000)
            },
            onDelete (id) {
                let that = this
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.dbh.vue_instance.$i18n.t('Processing').value
                            dtCouponApi.delete({ id: id }).finally(function () {
                                instance.confirmButtonLoading = false
                                that.refresh()
                                done()
                            })
                        } else {
                            done()
                        }
                    }
                }).then(() => {
                }).catch(() => {
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
            onAdd () {
                this.getGoods()
                this.addForm = {
                    title: '',
                    note: '',
                    discount_amount: 0,
                    cond_order_amount: 0,
                    cond_goods_id: '0',
                    begin_date: '',
                    end_date: '',
                    cate: ''
                }
                this.cond_goods_id = ['0'];
                this.dialogAddVisible = true
            },
            onEdit (resp) {
                this.getGoods()
                this.editForm.id = resp.id
                this.editForm.title = resp.title
                this.editForm.note = resp.note
                this.cond_goods_id = []
                let cond_goods_id = resp.cond_goods_id.split(',')
                if (resp.cond_goods_id != '0' &&  resp.cond_goods_id != "") {
                    cond_goods_id.forEach(element => {
                        element = Number(element)
                        this.cond_goods_id.push(element)
                    })
                } else {
                    this.cond_goods_id = cond_goods_id
                    this.multiplelimit = 1
                }
                this.editForm.discount_amount = resp.discount_amount / 100
                this.editForm.cond_order_amount = resp.cond_order_amount / 100
                this.editForm.begin_date = new Date(resp.begin_date * 1000)
                this.editForm.end_date = new Date(resp.end_date * 1000)
                this.dialogEditVisible = true
                console.debug('条件', this.cond_goods_id);
            },
            onGive (id) {
                this.coupon_id = id
                this.dialogGiveVisible = true
            },
            querySearchAsync (queryString, cb) {
                userApi.queryByPagingNoCount({ 'mobile': queryString }, (res) => {
                    var formatRes = []
                    for (var i = 0; i < res.length; i++) {
                        formatRes.push({
                            value: res[i].mobile,
                            id: res[i].id
                        })
                    }
                    cb(formatRes)
                }, (res) => {
                    window.dbh.alertError(res.msg)
                })
            },
            handleSelect (item) {
                this.user_id = item.id
            },
            submitGiveForm () {
                let that = this
                this.$refs.giveForm.validate((valid) => {
                    if (valid) {
                        let data = {}
                        data.user_id = this.user_id
                        data.coupon_id = this.coupon_id
                        this.loading = true
                        dtCouponApi.give(data).then(function () {
                            window.dbh.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
                        }).finally(function () {
                            setTimeout(function () {
                                that.loading = false
                                that.dialogGiveVisible = false
                            }, 1000)
                        })
                    } else {
                        return false
                    }
                })
            },
            onMobileClear () {
                this.user_id = ''
            },
            changeGoods (data) {
                console.log(this.cond_goods_id)
                if (data == '0') {
                    this.multiplelimit = 1
                } else if (data.length == 0) {
                    this.multiplelimit = 3
                    this.defultoption = false
                } else {
                    this.multiplelimit = 3
                    this.defultoption = true
                }
            },
            submitEditForm () {
                let that = this
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let data = Object.assign({}, this.editForm)
                        data.cond_goods_id = this.cond_goods_id.join(',')
                        if (data.begin_date instanceof Date) {
                          data.begin_date = data.begin_date.getTime();
                        }
                        if (data.end_date instanceof Date) {
                          data.end_date = data.end_date.getTime();
                        }
                        data.begin_date = data.begin_date / 1000
                        data.end_date = data.end_date / 1000
                        data.discount_amount = data.discount_amount * 100
                        data.cond_order_amount = data.cond_order_amount * 100
                        this.loading = true
                        dtCouponApi.edit(data).then(function () {
                            window.dbh.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
                        }).finally(function () {
                            setTimeout(function () {
                                that.loading = false
                                that.dialogEditVisible = false
                                that.refresh()
                            }, 1000)
                        })
                    } else {
                        return false
                    }
                })
            },
            submitAddForm () {
                let that = this
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        let data = Object.assign({}, this.addForm)
                        data.cond_goods_id = this.cond_goods_id.join(',')
                        if (data.begin_date instanceof Date) {
                          data.begin_date = data.begin_date.getTime();
                        }
                        if (data.end_date instanceof Date) {
                          data.end_date = data.end_date.getTime();
                        }
                        data.begin_date = data.begin_date / 1000
                        data.end_date = data.end_date / 1000
                        data.discount_amount = data.discount_amount * 100
                        data.cond_order_amount = data.cond_order_amount * 100
                        this.loading = true
                        dtCouponApi.create(data).then(function () {
                            window.dbh.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
                        }).finally(function () {
                            setTimeout(function () {
                                that.loading = false
                                that.dialogAddVisible = false
                                that.refresh()
                            }, 1000)
                        })
                    } else {
                        return false
                    }
                })
            },
            async refresh () {
                // 刷新当前
                // this.tableData = [];
                this.loading = true
                let that = this
                try {
                    let data = await dtCouponApi.query(that.queryForm)
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
            },
            async getGoods () {
                // 刷新当前
                let that = this
                try {
                    let data = await dtGoodsApi.query({ page_index: 1, page_size: 50 })
                    that.options = data.list
                } catch (err) {
                    console.debug(err)
                    window.dbh.alertError(err)
                }
            }
        }
    }
</script>
