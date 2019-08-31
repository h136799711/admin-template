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
                        width="200px"
                        prop="freight_type"
                        :label="$t('Freight')"
                >
                    <template slot-scope="scope">
                        {{getFreightType(scope.row.freight_type)}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="400px"
                        prop="price_define"
                        :label="$t('Place')"
                >
                    <template slot-scope="scope">
                        <span v-html="parsePlace(scope.row.price_define)"></span>
                    </template>
                </el-table-column>
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

        <!-- 添加 -->
        <div v-if="dialogAddVisible">
            <div class="margin-md-top">{{$t('Add')}}</div>
            <el-form
                    ref="ruleForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="160px"
                    class="demo-ruleForm"
            >
                <el-form-item :label="$t('Name')">
                    <el-input size="mini" required placeholder="运费模板名称,例如: 江浙沪免邮" class="" v-model="addForm.name"/>
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
                        <el-input size="mini" v-model="placeTable[0].first" placeholder="" class="number-input"/>
                        Kg内,
                        <el-input size="mini" v-model="placeTable[0].first_price" placeholder="" class="number-input"/>
                        元,
                        每增加
                        <el-input size="mini" v-model="placeTable[0].continuous" placeholder="" class="number-input"/>
                        Kg,
                        增加运费:
                        <el-input size="mini" v-model="placeTable[0].continuous_price" placeholder=""
                                  class="number-input"/>
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
                                <el-cascader v-if="scope.row.index > 0" style="width: 240px;"
                                             v-model="placeTable[scope.row.index].place"
                                             :loading="loading"
                                             :options="pcaOptions"
                                             filterable
                                             placeholder="" size="small" :props="pcaProps"></el-cascader>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="首重kg/件"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.index > 0" v-model="placeTable[scope.row.index].first"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="首重/件价格:元"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.index > 0" v-model="placeTable[scope.row.index].first_price"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="续重kg/件"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.index > 0" v-model="placeTable[scope.row.index].continuous"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="续重/件价格:元"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.index > 0"
                                          v-model="placeTable[scope.row.index].continuous_price"/>
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
        <!-- 添加 END-->


        <!-- 添加 -->
        <div v-if="dialogEditVisible">
            <div class="margin-md-top">{{$t('Edit')}}</div>
            <el-form
                    ref="ruleForm"
                    :model="editForm"
                    label-position="right"
                    :rules="rules"
                    label-width="160px"
                    class="demo-ruleForm"
            >
                <el-form-item :label="$t('Name')">
                    <el-input size="mini" required placeholder="运费模板名称,例如: 江浙沪免邮" class="" v-model="editForm.name"/>
                </el-form-item>
                <el-form-item :label="$t('Method')">
                    <el-radio v-model="editForm.method" label="weight">按重量</el-radio>
                    <el-radio v-model="editForm.method" label="count">按件数</el-radio>
                </el-form-item>
                <el-form-item :label="$t('Freight')">
                    <el-radio v-model="editForm.freight_type" :label="1">免运费</el-radio>
                    <el-radio v-model="editForm.freight_type" :label="2">到付</el-radio>
                    <el-radio v-model="editForm.freight_type" :label="3">预付</el-radio>
                </el-form-item>
                <el-form-item :label="$t('LogisticsType')">
                    <el-radio v-model="editForm.logistics_type" label="express">快递</el-radio>
                    <el-radio v-model="editForm.logistics_type" label="ems">EMS</el-radio>
                    <el-radio v-model="editForm.logistics_type" label="surface_mail">平邮</el-radio>
                </el-form-item>
                <el-form-item :label="$t('Place')">
                    <el-alert>除指定地区外,其余地区的运费采用"默认运费"</el-alert>
                    <div>
                        默认运费:
                        <el-input size="mini" v-model="placeTable[0].first" placeholder="" class="number-input"/>
                        Kg内,
                        <el-input size="mini" v-model="placeTable[0].first_price" placeholder="" class="number-input"/>
                        元,
                        每增加
                        <el-input size="mini" v-model="placeTable[0].continuous" placeholder="" class="number-input"/>
                        Kg,
                        增加运费:
                        <el-input size="mini" v-model="placeTable[0].continuous_price" placeholder=""
                                  class="number-input"/>
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
                                <el-cascader v-if="scope.row.index > 0" style="width: 240px;"
                                             v-model="placeTable[scope.row.index].place"
                                             :loading="loading"
                                             :options="pcaOptions"
                                             filterable
                                             placeholder="" size="small" :props="pcaProps"></el-cascader>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="首重kg/件"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.index > 0" v-model="placeTable[scope.row.index].first"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="首重/件价格:元"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.index > 0" v-model="placeTable[scope.row.index].first_price"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="续重kg/件"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.index > 0" v-model="placeTable[scope.row.index].continuous"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="续重/件价格:元"
                                width="180">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.index > 0"
                                          v-model="placeTable[scope.row.index].continuous_price"/>
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
                <el-button size="mini" @click="dialogEditVisible = false">
                    {{ $t('Cancel') }}
                </el-button>
                <el-button
                        size="mini"
                        type="primary"
                        @click="onSubmitEditForm"
                >
                    {{ $t('Confirm') }}
                </el-button>
            </div>
        </div>
        <!-- 添加 END-->


    </div>
</template>

<script>
    import freightApi from '../../api/freightApi'
    import pcaApi from '../../api/pcaApi'
    import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
    import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

    export default {
        components: {
            ElForm,
            ElButton
        },
        data () {
            return {
                pcaMap: [],
                pcaOptions: [],
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
                editForm: {
                    name: '',
                    freight_type: '',
                    method: 'weight',
                    logistics_type: 'express',
                    price_define: '',
                },
                pcaProps: {
                    checkStrictly: true,
                    multiple: true,
                    value: 'code',
                    label: 'name',
                    children: 'children',
                    leaf: 'leaf',
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
        watch: {},
        created () {
            this.queryPca()
        },
        mounted () {
            this.refresh()
        },
        methods: {
            parsePlace (place) {
                place = JSON.parse(place)
                console.debug(place)
                let desc = ''
                if (place.length > 0) {
                    desc = '默认运费: ' + place[0].first + ' kg以内, ' + place[0].first_price + '元 每增加' + place[0].continuous + ' kg, 多' + place[0].continuous_price + '元'
                    for (let i = 1; i < place.length; i++) {

                        let provDesc = ''
                        for (let k = 0; k < place[i].f_place.prov.length; k++) {
                            provDesc += this.pcaMap[place[i].f_place.prov[k]] + ','
                        }
                        let cityDesc = ''
                        for (let k = 0; k < place[i].f_place.city.length; k++) {
                            cityDesc += this.pcaMap[place[i].f_place.city[k]] + ','
                        }
                        desc += '<br/>' + provDesc + cityDesc
                        desc += '<br/>运费: ' + place[i].first + ' kg以内, ' + place[i].first_price + '元 每增加' + place[i].continuous + ' kg, 多' + place[i].continuous_price + '元'
                    }
                }
                return desc
            },
            setPcaOptions (resp, pcaMap) {
                for (let i in resp) {
                    pcaMap[resp[i].code] = resp[i].name
                    if (resp[i].children && resp[i].children.length > 0) {
                        this.setPcaOptions(resp[i].children, pcaMap)
                        resp[i].leaf = false
                    } else {
                        resp[i].leaf = true
                    }
                }
                return resp
            },
            queryPca () {
                pcaApi.query3Level({}, (resp) => {
                    this.pcaMap = []
                    this.pcaOptions = this.setPcaOptions(resp, this.pcaMap)
                    console.log(this.pcaMap)
                }, (err) => {
                    window.tools.alertError(err)
                })
            },
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
            getPlaceTable () {
                for (let i in this.placeTable) {
                    this.placeTable[i].f_place = {
                        prov: [],
                        city: []
                    }
                    for (let j in this.placeTable[i].place) {
                        let tmp = this.placeTable[i].place[j]
                        if (tmp.length > 0) {
                            if (tmp.length > 1) {
                                let city = tmp[1]
                                if (this.placeTable[i].f_place.city.indexOf(city) === -1) {
                                    this.placeTable[i].f_place.city.push(city)
                                }
                            } else {
                                let prov = tmp[0]
                                if (this.placeTable[i].f_place.prov.indexOf(prov) === -1) {
                                    this.placeTable[i].f_place.prov.push(prov)
                                }
                            }
                        }
                    }
                    this.placeTable[i].place = null
                    delete this.placeTable[i].place
                }
                return JSON.stringify(this.placeTable)
            },
            onSubmitAddForm () {
                this.loading = true
                this.addForm.price_define = this.getPlaceTable()
                // 添加
                freightApi.create(this.addForm, (resp) => {
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
                this.loading = true
                this.editForm.price_define = this.getPlaceTable()
                // 编辑
                freightApi.update(this.editForm, (resp) => {
                    this.loading = false
                    this.dialogEditVisible = false
                    this.refresh()
                }, (err) => {
                    this.loading = false
                    window.tools.alertError(err)
                })
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
                            freightApi.delete({ id: id }, (res) => {
                                instance.confirmButtonLoading = false
                                this.refresh()
                                done()
                            }, (res) => {
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
                this.placeTable = []
                this.onAppend()
                this.dialogAddVisible = true
                this.addForm = {
                    name: '',
                    logistics_type: 'express',
                    freight_type: 1,
                    method: 'weight'
                }
            },
            restorePlaceTable (priceDefine) {
                this.onAppend()
                let define = JSON.parse(price_define)
                // 设置默认运费
                this.placeTable[0].first = define[0].first
                this.placeTable[0].first_price = define[0].first_price
                this.placeTable[0].continuous = define[0].continuous
                this.placeTable[0].continuous_price = define[0].continuous_price
                // 设置其它运费
                for (let i = 1; i < define.length; i++) {
                    this.placeTable.push({
                        index: i,
                        first: define[i].first,
                        first_price: define[i].first_price,
                        continuous: define[i].continuous,
                        continuous_price: define[i].continuous_price,
                        place: []
                    })
                    for (let j = 0; j < define[i].f_place.prov.length; j++) {
                        this.placeTable[i].place.push([define[i].f_place.prov[j]])
                    }
                    for (let j = 0; j < define[i].f_place.city.length; j++) {
                        let tmpProv = define[i].f_place.city[j]
                        tmpProv = tmpProv.substr(0, 2).padEnd(tmpProv.length, '0')
                        this.placeTable[i].place.push([tmpProv, define[i].f_place.city[j]])
                    }
                }
            },
            onEdit (row) {
                this.dialogEditVisible = true
                this.placeTable = []
                this.restorePlaceTable(row.price_define)
                this.editForm = {
                    id: row.id,
                    name: row.name,
                    logistics_type: row.logistics_type,
                    freight_type: row.freight_type,
                    method: row.method
                }
            },
            async refresh () {
                // 刷新当前
                this.tableData = []
                this.loading = true
                try {
                    let resp = await freightApi.query({})
                    this.tableData = resp
                    this.loading = false
                } catch (e) {
                    window.tools.alertError(e)
                    this.loading = false
                }
            }
        }
    }
</script>
