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
      icon="el-icon-back"
      :loading="loading"
      @click="back()"
    >
      {{ $t('Back') }}
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
    <div class="margin-md-bottom margin-md-top">
      选择属性进行关联
    </div>

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
          width="90px"
          :label="$t('ID')"
        />
        <el-table-column
          width="260px"
          prop="title"
          :label="$t('Title')"
        >
          <template #default>
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column
          width="120px"
          prop="is_sale"
          :label="$t('Is') + $t('SaleProperty')"
        >
          <template #default>
            {{ $t('' + scope.row.is_sale) }}
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          :label="$t('Is') + $t('ColorProperty')"
        >
          <template #default="scope">
            {{ $t('' + scope.row.is_color) }}
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          :label="$t('PropertyType')"
        >
          <template #default="scope">
            {{ $t(scope.row.prop_type) }}
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          :label="$t('Is') + $t('Relate')"
        >
          <template #default="scope">
            <el-tag :type="isRelated(scope.row.id) ? 'success': 'info'">
              {{ isRelated(scope.row.id) ? $t("1"): $t("0") }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
              v-if="isRelated(scope.row.id)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="onRemove(scope.row.id)"
            >
              {{ $t('Remove') }}
            </el-button>
            <el-button
              v-else
              size="mini"
              type="primary"
              icon="el-icon-edit-outline"
              @click="onRelate(scope.row.id)"
            >
              {{ $t('Relate') }}
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
        @current-change="byPagerCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import spCateApi from '../../api/spCateApi'

import spPropApi from '../../api/spPropApi'

export default {
  components: {

  },
  data () {
    return {
      queryForm: {
        title: '',
        page_index: 0,
        page_size: 10
      },
      count: 0,
      tableData: [],
      propsData: [],
      loading: false
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  mounted () {
    this.getPropData()
  },
  methods: {
    removePropId (id) {
      id = parseInt(id)
      for (var i = 0; i < this.propsData.length; i++) {
        if (parseInt(this.propsData[i].id) === id) {
                    	this.propsData.splice(i, 1)
          return true
        }
      }
      return false
    },
    isRelated (id) {
      id = parseInt(id)
      for (var i = 0; i < this.propsData.length; i++) {
        if (parseInt(this.propsData[i].id) === id) {
          return true
        }
      }
      return false
    },
    byPagerSizeChange (val) {
      this.queryForm.page_size = val
      this.refresh()
    },
    byPagerCurrentChange (val) {
      this.queryForm.page_index = val
      this.refresh()
    },
    back () {
      this.$router.back()
    },
    onRemove (id) {
      this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
        confirmButtonText: this.$i18n.t('Confirm'),
        cancelButtonText: this.$i18n.t('Cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

            spCateApi.removeProp({ prop_id: id, cate_id: this.$route.params.id }, (res) => {
              instance.confirmButtonLoading = false
              this.removePropId(id)
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
    onRelate (id) {
      spCateApi.relateProp({ cate_id: this.$route.params.id, prop_id: id }, (resp) => {
        this.loading = false
        this.propsData.push({ id: id })
        this.refresh()
      }, (resp) => {
        this.loading = false
        window.tools.alertError(resp.msg)
      })
    },
    refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      let that = this
      spPropApi.query(this.queryForm, (resp) => {
        that.count = parseInt(resp.count)
        that.tableData = resp.list
        that.loading = false
      }, (resp) => {
        window.tools.alertError(resp.msg)
        that.loading = false
      })
    },
    getPropData () {
      this.propsData = []
      this.loading = true
      let that = this
      let data = Object.assign({ cate_id: this.$route.params.id }, that.queryForm)
      spCateApi.getProp(data, (resp) => {
        that.propsData = resp
        that.loading = false
        this.refresh()
      }, (resp) => {
        window.tools.alertError(resp.msg)
        that.loading = false
      })
    }
  }
}
</script>
