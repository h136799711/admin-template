<style>
    .blue {
        color: blue;
    }

</style>
<template>
  <div class="main-content by-banners padding-md-bottom padding-md-top">
    <div>
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item>

          <el-input
            v-model="queryForm.title"
            size="mini"
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
          width="160px"
          prop="title"
          :label="$t('Title')"
        />
<!--        <el-table-column-->
<!--          width="160px"-->
<!--          prop="sub_title"-->
<!--          :label="$t('SubTitle')"-->
<!--        />-->
        <el-table-column
          width="160px"
          :label="$t('Price')"
        >
          <template #default="scope">
            {{ (scope.row.show_price / 100).toFixed(2) }} {{ $t('Unit.Yuan') }}
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('Volume') + '/' + $t('Weight')"
        >
          <template #default="scope">
            {{ scope.row.volume }} cm <sup style="font-size: 10px;">3</sup> <br>
            {{ scope.row.weight }} Kg
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('SaleTime')"
        >
          <template #default="scope">
            <span v-if="scope.row.sale_open_time > 0">销售开始:<br>
              {{ (new Date(scope.row.sale_open_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
            </span>
            <span v-else>不限制</span>
            <br>
            <span v-if="scope.row.sale_end_time > 0">销售截至:<br>
              {{ (new Date(scope.row.sale_end_time * 1000)).format('yyyy-MM-dd hh:mm:ss') }}
            </span>
            <span v-else>不限制</span>
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('CreateTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd') }}
          </template>
        </el-table-column>

        <el-table-column
                width="400px"
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
              size="mini"
              icon="by-icon by-pinpai"
              @click="onSku(scope.row)"
            >
              {{ $t('SKU') }}
            </el-button>
            <el-button
              size="mini"
              icon="by-icon by-pinpai"
              @click="onPlace(scope.row)"
            >
              {{ $t('Delivery') }}{{ $t('Place') }}
            </el-button>
            &nbsp;&nbsp;

            <el-dropdown
              size="mini"
              type="danger"
              :split-button="true"
            >
                {{ $t('More') }}
              <template #dropdown>
                <el-dropdown-menu  >
                  <el-dropdown-item>
                    <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-edit"
                            @click="onEdit(scope.row)"
                    >
                      {{ $t('Edit') }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                            type="text"
                            size="mini"
                            icon="el-icon-delete"
                            @click="onDelete(scope.row.id)"
                    >
                      {{ $t('Delete') }}
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
</template>

<script>
import spCateApi from '../../api/spCateApi'
import goodsApi from '../../api/goodsApi'

export default {
  components: {
  },
  data () {
    return {
      inputVisible: false,
      queryForm: {
        title: '',
        page_index: 1,
        page_size: 10
      },
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
            instance.confirmButtonText = window.dbh.vue_instance.$i18n.t('Processing').value
            goodsApi.delete({ id: id }, (res) => {
              instance.confirmButtonLoading = false
              this.refresh()
              done()
            }, (res) => {
              console.debug(res)
              done()
              window.dbh.alertError(res.msg)
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
      this.$router.push({ path: 'edit/' + row.id })
    },
    onSku (row) {
      this.$router.push({ path: 'sku/' + row.id })
    },
    onPlace (row) {
      this.$router.push({ path: 'place/' + row.id })
    },
    async refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      let that = this
      try {
        let data = await goodsApi.query(that.queryForm)
        that.tableData = data.list
        that.count = parseInt(data.count)
        that.loading = false
      } catch (err) {
        console.debug(err)
        window.dbh.alertError(err)
        that.loading = false
      }
    }
  }
}
</script>
