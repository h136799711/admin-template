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
      icon="el-icon-back"
      :loading="loading"
      @click="onBack()"
    >
      {{ $t('Back') }}
    </el-button>
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
          prop="freight"
          :label="$t('Freight')"
        >
          <template #default="scope">
            {{ $t('Freight') }}{{ $t('Template') }}: {{ scope.row.freight_tpl_id }}
          </template>
        </el-table-column>
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
          :label="$t('Action')"
        >
          <template #default="scope">
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
    </div>

    <el-dialog
      v-model="dialogAddVisible"
      :show-close="false"
      :append-to-body="false"
      :title="$t('Add')"
    >
      <el-form
        ref="ruleForm"
        :model="addForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="$t('Place')"
        >
          <el-cascader
            ref="addPlaceCascader"
            v-model="place"
            style="width: 320px;"
            placeholder=""
            size="small"
            :props="pcaProps"
          />
        </el-form-item>

        <el-form-item
          :label="$t('Freight') + $t('Template')"
        >
          <el-select
            v-model="addForm.freight_tpl_id"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in freightTplList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div
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
      </template>
    </el-dialog>

    <el-dialog
      v-model="dialogEditVisible"
      :show-close="false"
      :append-to-body="false"
      :title="$t('Edit')"
    >
      <el-form
        ref="ruleForm"
        :model="editForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          :label="$t('Place')"
        >
          <el-cascader
            ref="editPlaceCascader"
            v-model="place"
            style="width: 320px;"
            placeholder=""
            size="small"
            :props="pcaProps"
          />
        </el-form-item>

        <el-form-item
          :label="$t('Freight') + $t('Template')"
        >
          <el-select
            v-model="editForm.freight_tpl_id"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in freightTplList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div
                class="dialog-footer"
        >
        <el-button @click="dialogEditVisible = false">
          {{ $t('Cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmitEditForm"
        >
          {{ $t('Confirm') }}
        </el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import freightApi from '../../api/freightApi'
import pcaApi from '../../api/pcaApi'

import goodsPlaceApi from '../../api/goodsPlaceApi'

export default {
  components: {
  },
  props: {
    id: {
      type: String,
      default () {
        return '0'
      }
    }
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
      editForm: {
        id: 0,
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
      },
      addForm: {
        goods_id: 0,
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
      },
      pcaProps: {
        lazy: true,
        lazyLoad (node, resolve) {
          const { value, level } = node
          switch (parseInt(level)) {
            case 0 :
              pcaApi.query({country_id: 1, page_size: 5000}, function (resp) {
                let nodes = resp.list.map(item => ({
                  value: item.code,
                  label: item.name,
                  leaf: false
                }))
                resolve(nodes)
              })
              break
            case 1:
              pcaApi.queryCity({ code: value, page_size: 5000 }, function (resp) {
                let nodes = resp.list.map(item => ({
                  value: item.code,
                  label: item.name,
                  leaf: false
                }))
                resolve(nodes)
              })
              break
            case 2:
              pcaApi.queryArea({ code: value, page_size: 5000 }, function (resp) {
                let nodes = resp.list.map(item => ({
                  value: item.code,
                  label: item.name,
                  leaf: false
                }))
                resolve(nodes)
              })
              break
            case 3:
              pcaApi.queryTown({ 'code': value, page_size: 5000 }, function (resp) {
                let nodes = resp.list.map(item => ({
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
      freightTplList: []
    }
  },
  computed: {},
  watch: {
    place (newVal, oldVal) {
      let chkNode = []
      if (this.dialogAddVisible) {
        chkNode = this.$refs.addPlaceCascader.getCheckedNodes()
      } else if (this.dialogEditVisible) {
        chkNode = this.$refs.editPlaceCascader.getCheckedNodes()
      }
      this.addForm.province_name = chkNode[0].pathLabels[0]
      this.addForm.city_name = chkNode[0].pathLabels[1]
      this.addForm.area_name = chkNode[0].pathLabels[2]
      this.addForm.town_name = chkNode[0].pathLabels[3]
      this.addForm.province_code = newVal[0]
      this.addForm.city_code = newVal[1]
      this.addForm.area_code = newVal[2]
      this.addForm.town_code = newVal[3]
    }
  },
  created () {
  },
  mounted () {
    this.refresh()
  },
  methods: {
    onBack () {
      this.$router.go(-1)
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
      this.loading = true
      console.debug(this.editForm)
      // 添加
      goodsPlaceApi.update(this.editForm, (resp) => {
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
            goodsPlaceApi.delete({ id: id }, (res) => {
              instance.confirmButtonLoading = false
              this.refresh()
              done()
            }, (res) => {
              console.debug(res)
              done()
              window.tools.alertError(res)
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
      if (this.freightTplList.length === 0) {
        this.getFreightTemplate()
      }
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
      if (this.freightTplList.length === 0) {
        this.getFreightTemplate()
      }
      this.dialogEditVisible = true
      this.editForm = {
        id: row.id,
        freight_tpl_id: parseInt(row.freight_tpl_id),
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
    },
    async getFreightTemplate () {
      let resp = await freightApi.query({})
      console.debug(resp)
      this.freightTplList = resp
    }
  }
}
</script>
