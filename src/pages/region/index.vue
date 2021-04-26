<style>
    .blue {
        color: blue;
    }

</style>
<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <div class="margin-md-bottom">
            <el-alert>国家级行政区域</el-alert>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="queryForm.name" size="mini"/>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="refresh()" size="mini" icon="el-icon-search">{{$t('Search') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

<!--        <el-button-->
<!--                type="primary"-->
<!--                size="mini"-->
<!--                icon="el-icon-plus"-->
<!--                :loading="loading"-->
<!--                @click="onAdd()">-->
<!--            {{ $t('Add')}}-->
<!--        </el-button>-->
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
                        width="160px"
                        prop="name"
                        :label="$t('Name')"
                >
                </el-table-column>
                <el-table-column
                        width="120px"
                        prop="code"
                        :label="$t('Code')"
                >
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('Telephone')">
                    <template #default="scope">
                        {{scope.row.tel_prefix}}
                    </template>
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('Pinyin')">
                    <template #default="scope">
                        {{scope.row.py}}
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template #default="scope">
                        <el-button
                                size="mini"
                                icon="by-icon by-pinpai"
                                @click="onProvince(scope.row)">
                            {{$t('Region')}}
                        </el-button>

                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)">
                            {{$t('Edit')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <el-dialog
                :show-close="false"
                :append-to-body="false"
                :title="$t('Add')"
                v-model="dialogAddVisible"
        >
            <el-form
                    ref="addForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >

                <el-form-item
                        :label="$t('Name')"
                        required
                        prop="name">
                    <el-input v-model="addForm.name"/>
                </el-form-item>

                <el-form-item
                        :label="$t('Code')"
                        prop="code"
                >
                    <el-input v-model="addForm.code" ></el-input>
                </el-form-item>

                <el-form-item
                        :label="$t('Telephone')"
                        prop="tel_prefix"
                >
                    <el-input v-model="addForm.tel_prefix" ></el-input>
                </el-form-item>

                <el-form-item
                        :label="$t('Pinyin')"
                        prop="py"
                >
                    <el-input v-model="addForm.py" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
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
        </el-dialog>


        <el-dialog
                :show-close="false"
                :append-to-body="false"
                :title="$t('Edit')"
                v-model="dialogEditVisible"
        >
            <el-form
                    ref="editForm"
                    :model="editForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >

                <el-form-item
                        :label="$t('Name')"
                        required
                        prop="name">
                    <el-input v-model="editForm.name"/>
                </el-form-item>

                <el-form-item
                        :label="$t('Code')"
                        prop="code"
                >
                    <el-input v-model="editForm.code" ></el-input>
                </el-form-item>

                <el-form-item
                        :label="$t('Telephone')"
                        prop="tel_prefix"
                >
                    <el-input v-model="editForm.tel_prefix" ></el-input>
                </el-form-item>

                <el-form-item
                        :label="$t('Pinyin')"
                        prop="py"
                >
                    <el-input v-model="editForm.py" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
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
        </el-dialog>
    </div>
</template>

<script>
    import regionApi from '../../api/regionApi'




    export default {
        components: {
        },
        data () {
            return {
                inputVisible: false,
                inputValue: '',
                queryForm: {
                    name: ''
                },
                addForm: {
                    name: '',
                    code: '',
                    tel_prefix: '',
                    py: '',
                },
                editForm: {
                    id: 0,
                    name: '',
                    code: '',
                    tel_prefix: '',
                    py: '',
                },
                rules: {
                    name: [
                        { required: true, message: this.$i18n.t('Please Input Name'), trigger: 'blur' },
                        { min: 1, max: 32, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ]
                },
                count: 0,
                tableData: [],
                loading: false,
                dialogAddVisible: false,
                dialogEditVisible: false
            }
        },
        computed: {
        },
        watch: {
            '$route' (to, from) {
                // this.refresh()
            }
        },
        created () {

        },
        mounted () {
            this.refresh()
        },
        methods: {
            onProvince (row) {
                this.$router.push({ path: '/admin/region/province/' + row.id })
            },
            submitEditForm () {
                this.loading = true;
                let that =  this;
                regionApi.update(this.editForm, (resp) => {
                    that.loading = false
                    that.dialogEditVisible = false
                    this.refresh()
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    this.loading = false
                    this.dialogEditVisible = false
                })
            },
            submitAddForm () {
                console.log(this.addForm)
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        regionApi.create(this.addForm, (resp) => {
                            this.loading = false
                            this.dialogAddVisible = false
                            window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
                            this.refresh()
                        }, (resp) => {
                            this.loading = false
                            window.tools.alertError(resp.msg)
                        })
                    } else {
                        return false
                    }
                })
            },
            onAdd () {
                this.addForm = {
                    name: '',
                    tel_prefix: '',
                    py: '',
                    code: ''
                }
                this.dialogAddVisible = true
            },
            onEdit (row) {
                this.editForm = {
                    id: row.id,
                    name: row.name,
                    tel_prefix: row.tel_prefix,
                    py: row.py,
                    code: row.code
                }
                this.dialogEditVisible = true
            },
            refresh () {
                // 刷新当前
                this.tableData = []
                this.loading = true
                let that = this
                regionApi.query(that.queryForm, (resp) => {
                    that.tableData = resp
                    that.loading = false
                }, (resp) => {
                    window.tools.alertError(resp.msg)
                    that.loading = false
                })

            }
        }
    }
</script>
