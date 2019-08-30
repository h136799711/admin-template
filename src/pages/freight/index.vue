<style>
</style>
<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                :loading="loading"
                @click="onAdd()">
            {{ $t('Add')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                icon="by-icon by-shuaxin"
                :loading="loading"
                @click="refresh()">
            {{ $t('Refresh')}}
        </el-button>

        <div v-if="!dialogAddVisible && !dialogEditVisible" class="grid-content margin-md-top">
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
                        prop="name"
                        :label="$t('Name')"
                />
                <el-table-column
                        width="160px"
                        prop="method"
                        :label="$t('Method')"
                />

                <el-table-column
                        width="160px"
                        prop="logistics_type"
                        :label="$t('LogisticsType')"
                />
                <el-table-column
                        width="160px"
                        prop="logistics_type"
                        :label="$t('LogisticsType')"
                />
                <el-table-column
                        width="200px"
                        prop="price_define"
                        :label="$t('Freight')"
                />
                <el-table-column
                        width="160px"
                        :label="$t('UpdateTime')">
                    <template slot-scope="scope">
                        {{(new Date(scope.row.update_time * 1000)).format('yyyy-MM-dd')}}
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)">
                            {{$t('Edit')}}
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="onDelete(scope.row.id)">
                            {{$t('Delete')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div v-if="dialogAddVisible">
            <div class="margin-md-top">{{$t('Add')}}</div>
            <el-form
                    ref="ruleForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
                    class="demo-ruleForm"
            >
                <el-form-item :label="$t('Name')">
                    <el-input size="mini" placeholder="运费模板名称,例如: 江浙沪免邮" class="" v-model="addForm.name"/>
                </el-form-item>
                <el-form-item :label="$t('Method')">
                    <el-radio v-model="addForm.method" label="weight">按重量</el-radio>
                    <el-radio v-model="addForm.method" label="count">按件数</el-radio>
                </el-form-item>
                <el-form-item :label="$t('Freight')">
                    <el-radio v-model="addForm.freight_type" :label="1">免运费</el-radio>
                    <el-radio v-model="addForm.freight_type" :label="2">到付</el-radio>
                    <el-radio v-model="addForm.freight_type" :label="3">预付</el-radio>
                </el-form-item>
                <el-form-item :label="$t('LogisticsType')">
                    <el-radio v-model="addForm.logistics_type" label="express">快递</el-radio>
                    <el-radio v-model="addForm.logistics_type" label="ems">EMS</el-radio>
                    <el-radio v-model="addForm.logistics_type" label="surface_mail">平邮</el-radio>
                </el-form-item>
                <el-form-item :label="$t('Place')">
                    <el-alert>除指定地区外,其余地区的运费采用"默认运费"</el-alert>
                    <div>
                        默认运费:
                        <el-input size="mini" v-model="defaultFreight[0]" placeholder="" class="number-input"/>
                        Kg内,
                        <el-input size="mini" v-model="defaultFreight[1]" placeholder="" class="number-input"/>
                        元,
                        每增加
                        <el-input size="mini" v-model="defaultFreight[2]" placeholder="" class="number-input"/>
                        Kg,
                        增加运费:
                        <el-input size="mini" v-model="defaultFreight[3]" placeholder="" class="number-input"/>
                        元
                    </div>
                    <el-table
                            :data="placeTable"
                            border
                            style="width: 100%">
                        <el-table-column
                                label="送达地区"
                                width="320">
                            <template slot-scope="scope">
                                <el-cascader style="width: 240px;" v-model="placeTable[scope.row.index].place"
                                             :loading="loading"
                                             placeholder="" size="small" :props="pcaProps"></el-cascader>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="首重kg/件"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-model="placeTable[scope.row.index].first"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="首重/件价格:元"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-model="placeTable[scope.row.index].first_price"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="续重kg/件"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-model="placeTable[scope.row.index].continuous"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="续重/件价格:元"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-model="placeTable[scope.row.index].continuous_price"/>
                            </template>
                        </el-table-column>

                    </el-table>
                    <div class="margin-md-top">
                        <el-button size="mini" @click="onAppend">为指定地区城市设置运费</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div
                    slot="footer"
                    class="dialog-footer"
            >
                <el-button size="mini" @click="dialogAddVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        size="mini"
                        type="primary"
                        @click="onSubmitAddForm"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import pcaApi from '../../api/pcaApi'
    import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
    import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
    import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
    import goodsPlaceApi from '../../api/goodsPlaceApi'

    export default {
        props: {
            id: {
                type: String,
                default () {
                    return '0'
                }
            }
        },
        components: {
            ElForm,
            ElButtonGroup,
            ElButton
        },
        data () {
            return {
                place: [],
                defaultFreight: [1, 0, 0, 0],
                placeTable: [],
                dialogEditVisible: false,
                dialogAddVisible: false,
                freightOptions: [
                    { value: 1, label: '免运费' },
                    { value: 2, label: '到付' },
                    { value: 3, label: '预付' }
                ],
                methodOptions: [
                    { value: 'count', label: '件数' },
                    { value: 'weight', label: '重量' },
                    // 暂时屏蔽
                    // { value: 'volume', label: '体积' }
                ],
                logisticsOptions: [
                    { value: 'express', label: '快递' },
                    { value: 'surface_mail', label: '平邮' },
                    { value: 'ems', label: 'EMS' }
                ],
                addForm: {
                    name: '',
                    freight_type: '',
                    method: 'weight',
                    logistics_type: 'express',
                    price_define: '',
                },
                pcaProps: {
                    multiple: true,
                    lazy: true,
                    lazyLoad (node, resolve) {
                        const { value, level } = node
                        switch (parseInt(level)) {
                            case 0 :
                                pcaApi.query({}, function (resp) {
                                    let nodes = resp.map(item => ({
                                        value: item.code,
                                        label: item.name,
                                        leaf: false
                                    }))
                                    resolve(nodes)
                                })
                                break
                            case 1:
                                pcaApi.queryCity({ code: value }, function (resp) {
                                    let nodes = resp.map(item => ({
                                        value: item.code,
                                        label: item.name,
                                        leaf: true
                                    }))
                                    resolve(nodes)
                                })
                                break
                            default:
                                break
                        }
                    }
                },
                rules: {
                    title: [
                        { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
                        { min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ]
                },
                count: 0,
                tableData: [],
                loading: false,

            }
        },
        computed: {},
        watch: {
            place (newVal, oldVal) {
                let chkNode = this.$refs.addPlaceCascader.getCheckedNodes()
                console.debug(chkNode)
                let place = {
                    province_name: '',
                }
                place.province_name = chkNode[0].pathLabels[0]
                place.city_name = chkNode[0].pathLabels[1]
                place.area_name = chkNode[0].pathLabels[2]
                place.province_code = newVal[0]
                place.city_code = newVal[1]
                place.area_code = newVal[2]

            }
        },
        created () {
        },
        mounted () {
            this.onAppend()
            this.refresh()
        },
        methods: {
            onAppend () {
                // 新增一个地区
                this.placeTable.push({
                    index: this.placeTable.length,
                    place: [],
                    first: 0,
                    first_price: 0,
                    continuous: 0,
                    continuous_price: 0
                })
            },
            getFreightType (id) {
                for (let i in this.freightOptions) {
                    if (parseInt(this.freightOptions[i].value) === parseInt(id)) {
                        return this.freightOptions[i].label
                    }
                }
            },
            onSubmitAddForm () {
                this.loading = true
                console.debug(this.addForm)
                // 添加
                goodsPlaceApi.create(this.addForm, (resp) => {
                    this.loading = false
                    this.dialogAddVisible = false
                    this.refresh()
                }, (err) => {
                    this.loading = false
                    window.tools.alertError(err)
                })
            },
            onSubmitEditForm () {
                // 编辑

            },
            onDelete (id) {
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
                            goodsPlaceApi.delete({ id: id }, (res) => {
                                instance.confirmButtonLoading = false
                                this.refresh()
                                done()
                            }, (res) => {
                                console.debug(res)
                                done()
                                window.tools.alertError(res.msg)
                                instance.confirmButtonLoading = false
                            })
                        } else {
                            done()
                        }
                    }
                }).then(() => {
                }).catch(() => {
                })
            },
            onAdd () {
                this.dialogAddVisible = true
                this.addForm = {
                    logistics_type: 'express',
                    goods_id: this.id,
                    freight_type: 1,
                    freight_tpl_id: 0,
                    method: 'weight'
                }
            },
            onEdit (row) {
                this.dialogEditVisible = true
                this.editForm = {
                    goods_id: this.id,
                    freight_type: row.freight_type,
                    freight_tpl_id: row.freight_tpl_id,
                    method: row.method
                }
            },
            async refresh () {
                // 刷新当前
                this.tableData = []
                this.loading = true
                // try {
                let resp = await goodsPlaceApi.query({ 'goods_id': this.id })
                console.debug(resp)
                this.tableData = resp
                this.loading = false
            }
        }
    }
</script>
