<template>
    <div class="main-content by-policy padding-md-bottom padding-md-top">
        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item>
                    <el-input size="mini" v-model="queryForm.mobile" :placeholder="$t('Please Input') + ' ' + $t('Mobile')"/>
                </el-form-item>
                <el-form-item>
                    <el-select size="mini" v-model="queryForm.status">
                        <el-option
                                v-for="item in algList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="queryConfig()" size="mini"
                               icon="el-icon-search">{{ $t('Search') }}
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
                        width="60px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="150px"
                        :label="$t('Information')"
                >
                    <template #default>
                        {{$t('Username')}}: {{ scope.row.username}}<br/>
                        {{$t('Mobile')}}: {{ scope.row.mobile}}<br/>
                        {{$t('Email')}}: {{ scope.row.email}}<br/>
                    </template>
                </el-table-column>
                <el-table-column
                        width="140px"
                        prop="amount"
                        :label="$t('Amount')"
                />
                <el-table-column
                        width="140px"
                        prop="method"
                        :label="$t('Method')"
                />
                <el-table-column
                        width="200px"
                        prop="create_time"
                        :label="$t('CreateTime')"/>
                <el-table-column
                        width="100px"
                        prop="recharge_status"
                        :label="$t('Status')"/>
                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-folder"
                                @click="goProfile(scope.row.id)">
                            {{$t('Detail')}}
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
                    @current-change="byPagerCurrentChange"/>
        </div>
    </div>
</template>

<script>
    import api from '../../api/rechargeApi'


    export default {
        components: {
        },
        data () {
            return {
                algList: [
                    { id: 'all', label: this.$i18n.t('All') },
                    { id: 'success', label: this.$i18n.t('Success') },
                    { id: 'fail', label: this.$i18n.t('Fail') },
                    { id: 'wait', label: this.$i18n.t('Wait') }
                ],
                cateList: [],
                queryForm: {
                    mobile: '',
                    status: 'all',
                    page_index: 1,
                    page_size: 10
                },
                addForm: {},
                editForm: {
                    id: ''
                },
                count: 0,
                tableData: [],
                loading: false,
                dialogAddVisible: false,
                dialogEditVisible: false
            }
        },
        computed: {},
        watch: {

        },
        created () {
            this.queryConfig()
        },
        mounted: function () {
        },
        methods: {
            goProfile (id) {
                this.$router.push({ path: 'profile/' + id })
            },
            byPagerSizeChange (val) {
                this.queryForm.page_size = val
                this.queryConfig()
            },
            byPagerCurrentChange (val) {
                this.queryForm.page_index = val
                this.queryConfig()
            },
            queryConfig () {
                this.loading = true
                api.query(
                    this.queryForm,
                    resp => {
                        console.debug('resp ', resp)
                        this.loading = false
                        this.count = parseInt(resp.count)
                        if (this.count > 0) {
                            this.tableData = resp.list
                            this.tableData.forEach(element => {
                                if (element.recharge_status == 'success') {
                                    element.recharge_status = this.$i18n.t('Success')
                                } else if (element.recharge_status == 'wait') {
                                    element.recharge_status = this.$i18n.t('Wait')
                                } else if (element.recharge_status == 'fail') {
                                    element.recharge_status = this.$i18n.t('Fail')
                                } else {
                                    element.recharge_status = this.$i18n.t('All')
                                }
                                element.amount = (Number(element.amount) / 100).toFixed(2)
                                element.create_time = (new Date(element.create_time * 1000)).format('yyyy-MM-dd hh:mm:ss')
                            })
                        }
                    },
                    resp => {
                        window.tools.alertError(resp.msg)
                        this.loading = false
                    }
                )
            },
            refresh () {
                // 刷新当前
                (this.queryForm = {
                    mobile: '',
                    status: 'all',
                    page_index: 1,
                    page_size: 10
                }),
                    (this.tableData = [])
                this.queryConfig()
            }
        }
    }
</script>
