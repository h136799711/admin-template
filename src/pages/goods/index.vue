<style>
    .blue {
        color: blue;
    }

</style>
<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="queryForm.title" size="mini"/>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="refresh()" size="mini" icon="el-icon-search">{{
                        $t('Search') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-back"
                v-if="grandpa !== -1"
                :loading="loading"
                @click="back()">
            {{ $t('Back')}}
        </el-button>
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
                        prop="title"
                        :label="$t('Title')"
                />
                <el-table-column
                        width="160px"
                        prop="sub_title"
                        :label="$t('SubTitle')"
                />
                <el-table-column
                        width="160px"
                        :label="$t('Price')"
                >
                    <template slot-scope="scope">
                        {{(scope.row.show_price / 100).toFixed(2)}} {{$t('Unit.Yuan')}}
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button
                                v-if="scope.row.leaf"
                                size="mini"
                                icon="by-icon by-pinpai"
                                @click="onRelateBrand(scope.row)">
                            {{$t('Goods')}}{{$t('SKU')}}
                        </el-button>
                        <el-button
                                v-if="scope.row.leaf"
                                size="mini"
                                icon="el-icon-edit-outline"
                                @click="onRelateProp(scope.row)">
                            {{$t('Goods')}}{{$t('Property')}}
                        </el-button>
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
</template>

<script>
  import spCateApi from '../../api/spCateApi'
  import goodsApi from '../../api/goodsApi'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
  import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

  export default {
    components: {
      ElForm,
      ElButtonGroup,
      ElButton
    },
    data () {
      return {
        inputVisible: false,
        freightOptions: [
          { key: 1, title: '免运费' },
          { key: 2, title: '到付' },
          { key: 3, title: '预付' }
        ],
        queryForm: {
          title: '',
          page_index: 1,
          page_size: 10
        },
        addForm: {
          prop_value_ids: '',
          title: '',
          sub_title: 0,
          show_price: 0,
          cover_img: '',
          small_cover_img: '',
          img_list: '',
          sale_open_time: 0,
          sale_end_time: 0,
          cate_id: 0,
          freight_type: 1,
          freight_tpl_id: 0,
          country_code: 1,
          country_name: '中国',
          province_code: '',
          province_name: '',
          city_code: '',
          city_name: '',
          area_code: '',
          area_name: '',
          town_code: '',
          town_name: ''
        },
        editForm: {
          id: 0,
          prop_value_ids: '',
          title: '',
          sub_title: 0,
          show_price: 0,
          cover_img: '',
          small_cover_img: '',
          img_list: '',
          sale_open_time: 0,
          sale_end_time: 0,
          cate_id: 0,
          freight_type: 1,
          freight_tpl_id: 0,
          country_code: 1,
          country_name: '中国',
          province_code: '',
          province_name: '',
          city_code: '',
          city_name: '',
          area_code: '',
          area_name: '',
          town_code: '',
          town_name: ''
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
        dialogAddVisible: false,
        dialogEditVisible: false
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
      onRelateBrand (row) {
      },
      onRelateProp (row) {
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

              spCateApi.delete({ id: id }, (res) => {
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
      submitEditForm () {
        spCateApi.update(this.editForm, (resp) => {
          this.loading = false
          this.dialogEditVisible = false
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
            spCateApi.create(this.addForm, (resp) => {
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
      byPagerSizeChange (val) {
        this.queryForm.page_size = val
        this.refresh()
      },
      byPagerCurrentChange (val) {
        this.queryForm.page_index = val
        this.refresh()
      },

      onAdd () {
        this.$router.push({ path: 'create' })
      },
      onEdit (row) {
        this.$router.push({ path: 'edit' })
      },
      refresh () {
        // 刷新当前
        this.tableData = []
        this.loading = true
        let that = this
        goodsApi.query(that.queryForm, (resp) => {
          that.tableData = resp.list
          that.count = parseInt(resp.count)
          that.loading = false
        }, (resp) => {
          window.tools.alertError(resp.msg)
          that.loading = false
        })
      }
    }
  }
</script>
