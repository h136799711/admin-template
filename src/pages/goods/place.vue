<style>
    .blue {
        color: blue;
    }

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
                        width="160px"
                        prop="province_name"
                        :label="$t('Province')"
                />
                <el-table-column
                        width="160px"
                        prop="city_name"
                        :label="$t('City')"
                />
                <el-table-column
                        width="160px"
                        prop="area_name"
                        :label="$t('Area')"
                />
                <el-table-column
                        width="160px"
                        prop="town_name"
                        :label="$t('Town')"
                />
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
    </div>
</template>

<script>
    import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
    import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
    import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'
    import goodsPlaceApi from '../../api/goodsPlaceApi'

    export default {
        props: {
            id: {
                type: Number,
                default () {
                    return 0
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
                rules: {
                    title: [
                        { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
                        { min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
                    ]
                },
                count: 0,
                tableData: [],
                loading: false
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
            onDelete (id) {
                this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
                            goodsApi.delete({ id: id }, (res) => {
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
                this.$router.push({ path: 'create' })
            },
            onEdit (row) {
                this.$router.push({ path: 'edit/' + row.id })
            },
            async refresh () {
                // 刷新当前
                this.tableData = []
                this.loading = true
                // try {
                let resp = await goodsPlaceApi.query({ 'goods_id': this.id })
                console.debug(resp)
                this.loading = false
                // } catch (err) {
                //     console.debug(err)
                //     this.loading = false
                //     window.tools.alertError(err)
                // }
            }
        }
    }
</script>
