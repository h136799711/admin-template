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

        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Add')"
                :visible.sync="dialogAddVisible"
        >
            <el-form
                    ref="ruleForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
                    class="demo-ruleForm"
            >

                <el-form-item :label="$t('Name')">
                    <el-input size="mini" class="number-input" v-model="addForm.name"/>
                </el-form-item>
                <el-form-item :label="$t('Method')">
                    <el-input size="mini" class="number-input" v-model="addForm.method"/>
                </el-form-item>

                <el-form-item :label="$t('Freight')">
                    <el-select size="mini" v-model="addForm.freight_type" placeholder="请选择">
                        <el-option
                                v-for="item in freightOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                        :label="$t('Place')">
                    <el-cascader style="width: 320px;" v-model="place" :loading="loading"
                                 placeholder="" size="small" ref="addPlaceCascader" :props="pcaProps"></el-cascader>
                </el-form-item>

            </el-form>
            <div
                    slot="footer"
                    class="dialog-footer"
            >
                <el-button @click="dialogAddVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        type="primary"
                        @click="onSubmitAddForm"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </el-dialog>
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
                    name: 1,
                    freight_type: '',
                    method: 0,
                    logistics_type: 'express',
                    price_define: '',
                },
                pcaProps: {
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
                                        leaf: false
                                    }))
                                    resolve(nodes)
                                })
                                break
                            case 2:
                                pcaApi.queryArea({ code: value }, function (resp) {
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
                // this.addForm.province_name = chkNode[0].pathLabels[0]
                // this.addForm.city_name = chkNode[0].pathLabels[1]
                // this.addForm.area_name = chkNode[0].pathLabels[2]
                // this.addForm.province_code = newVal[0]
                // this.addForm.city_code = newVal[1]
                // this.addForm.area_code = newVal[2]
            }
        },
        created () {
        },
        mounted () {
            this.refresh()
        },
        methods: {
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
                    goods_id: this.id,
                    freight_type: 1,
                    freight_tpl_id: 0,
                    country_code: '1',
                    country_name: '中国',
                    province_code: '',
                    province_name: '',
                    city_code: '',
                    city_name: '',
                    area_code: '',
                    area_name: '',
                    town_code: '',
                    town_name: ''
                }
            },
            onEdit (row) {
                this.dialogEditVisible = true
                this.editForm = {
                    goods_id: this.id,
                    freight_type: row.freight_type,
                    freight_tpl_id: row.freight_tpl_id,
                    country_code: row.country_code,
                    country_name: row.country_name,
                    province_code: row.province_code,
                    province_name: row.province_name,
                    city_code: row.city_code,
                    city_name: row.city_name,
                    area_code: row.area_code,
                    area_name: row.area_name,
                    town_code: row.town_code,
                    town_name: row.town_name
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
