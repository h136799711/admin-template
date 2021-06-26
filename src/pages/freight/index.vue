<style>
    .price-input {
        width: 80px;
    }
</style>
<template>
  <div class="main-content by-banners padding-md-bottom padding-md-top">

    <div
      v-if="!dialogAddVisible && !dialogEditVisible"
      class="grid-content "
    >
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
          width="120px"
          :label="$t('Method')"
        >
          <template #default="scope">
            {{ getMethodType(scope.row.method) }}
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          :label="$t('LogisticsType')"
        >
          <template #default="scope">
            {{ getLogisticType(scope.row.logistics_type) }}
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          prop="freight_type"
          :label="$t('Freight')"
        >
          <template #default="scope">
            {{ getFreightType(scope.row.freight_type) }}
          </template>
        </el-table-column>
        <el-table-column
          width="400px"
          prop="price_define"
          :label="$t('Place')"
        >
          <template #default="scope">
            <span v-html="parsePlace(scope.row.price_define)" />
          </template>
        </el-table-column>
        <el-table-column
          width="400px"
          :label="$t('FreeShipping')"
        >
          <template #default="scope">
            <span v-html="parseFreeCondition(scope.row.free_condition)" />
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('UpdateTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.update_time * 1000)).format('yyyy-MM-dd') }}
          </template>
        </el-table-column>

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

    <!-- 添加 -->
    <div v-if="dialogAddVisible">
      <div class="margin-md-top">
        {{ $t('Add') }}
      </div>
      <el-form
        ref="ruleForm"
        :model="addForm"
        label-position="right"
        :rules="rules"
        label-width="160px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('Name')">
          <el-input
            v-model="addForm.name"
            size="mini"
            required
            placeholder="运费模板名称,例如: 江浙沪免邮"
            class=""
          />
        </el-form-item>
        <el-form-item :label="$t('Method')">
          <el-radio
            v-model="addForm.method"
            label="weight"
          >
            按重量
          </el-radio>
          <el-radio
            v-model="addForm.method"
            label="count"
          >
            按件数
          </el-radio>
        </el-form-item>
        <el-form-item :label="$t('Freight')">
          <el-radio
            v-model="addForm.freight_type"
            :label="1"
          >
            免运费
          </el-radio>
          <el-radio
            v-model="addForm.freight_type"
            :label="2"
          >
            货到付款
          </el-radio>
          <el-radio
            v-model="addForm.freight_type"
            :label="3"
          >
            预付
          </el-radio>
        </el-form-item>
        <el-form-item :label="$t('LogisticsType')">
          <el-radio
            v-model="addForm.logistics_type"
            label="express"
          >
            快递
          </el-radio>
          <el-radio
            v-model="addForm.logistics_type"
            label="ems"
          >
            EMS
          </el-radio>
          <el-radio
            v-model="addForm.logistics_type"
            label="surface_mail"
          >
            平邮
          </el-radio>
        </el-form-item>
        <el-form-item :label="$t('Place')">
          <el-alert>除指定地区外,其余地区的运费采用"默认运费"</el-alert>
          <el-table
            :data="placeTable"
            border
            style="width: 100%"
          >
            <el-table-column
              label="送达地区"
            >
              <template #default="scope">
                <el-cascader
                  v-if="scope.row.index > 0"
                  v-model="placeTable[scope.row.index].place"
                  style="width: 240px;"
                  :options="pcaOptions"
                  filterable
                  placeholder=""
                  size="small"
                  :props="pcaProps"
                />

                <span v-else>默认地区(除指定地区外的其余地区)</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="addForm.method === 'weight' ? '首重kg' : '首件'"
              width="180"
            >
              <template #default="scope">
                <el-input v-model="placeTable[scope.row.index].first" />
              </template>
            </el-table-column>
            <el-table-column
              :label="addForm.method === 'weight' ? '首重价格' : '首件价格'"
              width="180"
            >
              <template #default="scope">
                <el-input v-model="placeTable[scope.row.index].first_price" />
              </template>
            </el-table-column>
            <el-table-column
              :label="addForm.method === 'weight' ? '续重kg' : '续件'"
              width="180"
            >
              <template #default="scope">
                <el-input v-model="placeTable[scope.row.index].continuous" />
              </template>
            </el-table-column>
            <el-table-column
              :label="addForm.method === 'weight' ? '续重kg价格:元' : '续件价格:元'"
              width="180"
            >
              <template #default="scope">
                <el-input v-model="placeTable[scope.row.index].continuous_price" />
              </template>
            </el-table-column>
          </el-table>
          <div class="margin-md-top">
            <el-button
              size="mini"
              @click="onAppend"
            >
              为指定地区城市设置运费
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="addForm.enable_free_cond">
            指定条件包邮(可选)
          </el-checkbox>
          <el-table
            v-if="addForm.enable_free_cond"
            :data="freeTable"
            border
            style="width: 100%"
          >
            <el-table-column
              label="送达地区"
            >
              <template #default="scope">
                <el-cascader
                  v-model="freeTable[scope.row.index].place"
                  style="width: 240px;"
                  :options="pcaOptions"
                  filterable
                  placeholder=""
                  size="small"
                  :props="pcaProps"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="选择运送方式"
              width="180"
            >
              <template #default="scope">
                <el-select
                  v-model="freeTable[scope.row.index].logistics_type"
                  size="mini"
                >
                  <el-option
                    v-for="item in logisticsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="设置包邮条件"
              width="540"
            >
              <template #default="scope">
                <el-select
                  v-model="freeTable[scope.row.index].method"
                  class="margin-md-bottom"
                  size="mini"
                >
                  <el-option
                    v-for="item in freeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>

                <div v-if="freeTable[scope.row.index].method === 1">
                  满
                  <el-input
                    v-model="freeTable[scope.row.index].count"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  件包邮
                </div>
                <div v-else-if="freeTable[scope.row.index].method === 2">
                  满
                  <el-input
                    v-model="freeTable[scope.row.index].money"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  元包邮
                </div>
                <div v-else-if="freeTable[scope.row.index].method === 3">
                  满
                  <el-input
                    v-model="freeTable[scope.row.index].count"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  件 且满
                  <el-input
                    v-model="freeTable[scope.row.index].money"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  元包邮
                </div>
                <div v-else-if="freeTable[scope.row.index].method === 4">
                  满
                  <el-input
                    v-model="freeTable[scope.row.index].weight"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  Kg重包邮
                </div>
                <div v-else-if="freeTable[scope.row.index].method === 5">
                  满
                  <el-input
                    v-model="freeTable[scope.row.index].weight"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  Kg重, 且满
                  <el-input
                    v-model="freeTable[scope.row.index].money"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  元包邮
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="addForm.enable_free_cond"
            class="margin-md-top"
          >
            <el-button
              size="mini"
              @click="onAppendFree"
            >
              为指定地区设置包邮(最多设置3条记录)
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div
            class="dialog-footer"
        >
        <el-button
          size="mini"
          @click="dialogAddVisible = false"
        >
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

    <!-- 编辑 -->
    <div v-if="dialogEditVisible">
      <div class="margin-md-top">
        {{ $t('Edit') }}
      </div>
      <el-form
        ref="ruleForm"
        :model="editForm"
        label-position="right"
        :rules="rules"
        label-width="160px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('Name')">
          <el-input
            v-model="editForm.name"
            size="mini"
            required
            placeholder="运费模板名称,例如: 江浙沪免邮"
            class=""
          />
        </el-form-item>
        <el-form-item :label="$t('Method')">
          <el-radio
            v-model="editForm.method"
            label="weight"
          >
            按重量
          </el-radio>
          <el-radio
            v-model="editForm.method"
            label="count"
          >
            按件数
          </el-radio>
        </el-form-item>
        <el-form-item :label="$t('Freight')">
          <el-radio
            v-model="editForm.freight_type"
            :label="1"
          >
            包邮
          </el-radio>
          <el-radio
            v-model="editForm.freight_type"
            :label="2"
          >
            货到付款
          </el-radio>
          <el-radio
            v-model="editForm.freight_type"
            :label="3"
          >
            预付
          </el-radio>
        </el-form-item>
        <el-form-item :label="$t('LogisticsType')">
          <el-radio
            v-model="editForm.logistics_type"
            label="express"
          >
            快递
          </el-radio>
          <el-radio
            v-model="editForm.logistics_type"
            label="ems"
          >
            EMS
          </el-radio>
          <el-radio
            v-model="editForm.logistics_type"
            label="surface_mail"
          >
            平邮
          </el-radio>
        </el-form-item>
        <el-form-item :label="$t('Place')">
          <el-alert>除指定地区外,其余地区的运费采用"默认运费"</el-alert>
          <el-table
            :data="placeTable"
            border
            style="width: 100%"
          >
            <el-table-column
              label="送达地区"
            >
              <template #default="scope">
                <el-cascader
                  v-if="scope.row.index > 0"
                  v-model="placeTable[scope.row.index].place"
                  style="width: 240px;"
                  :options="pcaOptions"
                  filterable
                  placeholder=""
                  size="small"
                  :props="pcaProps"
                />
                <span v-else>默认地区(除指定地区外的其余地区)</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="editForm.method === 'weight' ? '首重kg' : '首件'"
              width="180"
            >
              <template #default="scope">
                <el-input v-model="placeTable[scope.row.index].first" />
              </template>
            </el-table-column>
            <el-table-column
              :label="editForm.method === 'weight' ? '首重价格' : '首件价格'"
              width="180"
            >
              <template #default="scope">
                <el-input v-model="placeTable[scope.row.index].first_price" />
              </template>
            </el-table-column>
            <el-table-column
              :label="editForm.method === 'weight' ? '续重kg' : '续件'"
              width="180"
            >
              <template #default="scope">
                <el-input v-model="placeTable[scope.row.index].continuous" />
              </template>
            </el-table-column>
            <el-table-column
              :label="editForm.method === 'weight' ? '续重kg价格:元' : '续件价格:元'"
              width="180"
            >
              <template #default="scope">
                <el-input v-model="placeTable[scope.row.index].continuous_price" />
              </template>
            </el-table-column>
          </el-table>
          <div class="margin-md-top">
            <el-button
              size="mini"
              @click="onAppend"
            >
              为指定地区城市设置运费
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="editForm.enable_free_cond">
            指定条件包邮(可选)
          </el-checkbox>
          <el-table
            v-if="editForm.enable_free_cond"
            :data="freeTable"
            border
            style="width: 100%"
          >
            <el-table-column
              label="送达地区"
            >
              <template #default="scope">
                <el-cascader
                  v-model="freeTable[scope.row.index].place"
                  style="width: 240px;"
                  :options="pcaOptions"
                  filterable
                  placeholder=""
                  size="small"
                  :props="pcaProps"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="选择运送方式"
              width="180"
            >
              <template #default="scope">
                <el-select
                  v-model="freeTable[scope.row.index].logistics_type"
                  size="mini"
                >
                  <el-option
                    v-for="item in logisticsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="设置包邮条件"
              width="540"
            >
              <template #default="scope">
                <el-select
                  v-model="freeTable[scope.row.index].method"
                  class="margin-md-bottom"
                  size="mini"
                >
                  <el-option
                    v-for="item in freeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>

                <div v-if="freeTable[scope.row.index].method === 1">
                  满
                  <el-input
                    v-model="freeTable[scope.row.index].count"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  件包邮
                </div>
                <div v-else-if="freeTable[scope.row.index].method === 2">
                  满
                  <el-input
                    v-model="freeTable[scope.row.index].money"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  元包邮
                </div>
                <div v-else-if="freeTable[scope.row.index].method === 3">
                  满
                  <el-input
                    v-model="freeTable[scope.row.index].count"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  件 且满
                  <el-input
                    v-model="freeTable[scope.row.index].money"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  元包邮
                </div>
                <div v-else-if="freeTable[scope.row.index].method === 4">
                  满
                  <el-input
                    v-model="freeTable[scope.row.index].weight"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  Kg重包邮
                </div>
                <div v-else-if="freeTable[scope.row.index].method === 5">
                  满
                  <el-input
                    v-model="freeTable[scope.row.index].weight"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  Kg重, 且满
                  <el-input
                    v-model="freeTable[scope.row.index].money"
                    size="mini"
                    min="0"
                    type="number"
                    class="input-number price-input"
                  />
                  元包邮
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="editForm.enable_free_cond"
            class="margin-md-top"
          >
            <el-button
              size="mini"
              @click="onAppendFree"
            >
              为指定地区设置包邮(最多设置3条记录)
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogEditVisible = false"
        >
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

export default {
  components: {
  },
  data () {
    return {
      freeTable: [],
      pcaMap: [],
      pcaOptions: [],
      defaultFreight: [1, 0, 0, 0],
      placeTable: [],
      dialogEditVisible: false,
      dialogAddVisible: false,
      allFreeOptions: {
        1: '件数',
        2: '金额',
        3: '件数+金额',
        4: '重量',
        5: '重量+金额'
      },
      freeOptions: [
        { value: 4, label: '重量' },
        { value: 5, label: '重量+金额' },
        { value: 2, label: '金额' }
      ],
      freightOptions: [
        { value: 1, label: '包邮' },
        { value: 2, label: '货到付款' },
        { value: 3, label: '预付' }
      ],
      methodOptions: [
        { value: 'count', label: '件数' },
        { value: 'weight', label: '重量' }
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
        free_condition: '',
        enable_free_cond: 0
      },
      editForm: {
        name: '',
        freight_type: '',
        method: 'weight',
        logistics_type: 'express',
        price_define: ''
      },
      pcaProps: {
        checkStrictly: true,
        multiple: true,
        value: 'code',
        label: 'name',
        children: 'children',
        leaf: 'leaf'
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
  watch: {
    'editForm.method' (newVal) {
      this.freeOptions = []
      this.freeOptions.push({ value: 2, label: '金额' })
      if (newVal === 'count') {
        this.freeOptions.push({ value: 1, label: '件数' })
        this.freeOptions.push({ value: 3, label: '件数+金额' })
      } else {
        this.freeOptions.push({ value: 4, label: '重量' })
        this.freeOptions.push({ value: 5, label: '重量+金额' })
      }
    },
    'addForm.method' (newVal) {
      console.debug('addForm.method => ', this.addForm.method)
      this.freeOptions = []
      this.freeOptions.push({ value: 2, label: '金额' })
      if (newVal === 'count') {
        this.freeOptions.push({ value: 1, label: '件数' })
        this.freeOptions.push({ value: 3, label: '件数+金额' })
      } else {
        this.freeOptions.push({ value: 4, label: '重量' })
        this.freeOptions.push({ value: 5, label: '重量+金额' })
      }
    }
  },
  created () {
    this.queryPca()
  },
  mounted () {
    this.refresh()
  },
  methods: {
    parseFreeCondition (condition) {
      condition = JSON.parse(condition)
      let desc = ''
      if (condition.length > 0) {
        for (let i = 0; i < condition.length; i++) {
          let provDesc = ''
          for (let k = 0; k < condition[i].f_place.prov.length; k++) {
            provDesc += this.pcaMap[condition[i].f_place.prov[k]] + ','
          }
          let cityDesc = ''
          for (let k = 0; k < condition[i].f_place.city.length; k++) {
            cityDesc += this.pcaMap[condition[i].f_place.city[k]] + ','
          }
          desc += '<br/>地区: ' + provDesc + cityDesc
          // desc += '<br/>运送方式: ' + this.allFreeOptions[condition[i].method]
          desc += '<br/>运送方式: ' + condition[i].logistics_type
          if (condition[i].method == 1) {
            desc += '<br/>条件: 满' + condition[i].count + '件包邮'
            // 1: '件数',
            //     2: '金额',
            //     3: '件数+金额',
            //     4: '重量',
            //     5: '重量+金额',
            // desc += '<br/>条件: 满' + condition[i].weight + ' kg以内, 满' + condition[i].count + '件, 满' + condition[i].money + ' 元包邮'
          } else if (condition[i].method == 2) {
            desc += '<br/>条件: 满' + condition[i].money + ' 元包邮'
          } else if (condition[i].method == 3) {
            desc += '<br/>条件: 满' + condition[i].count + '件, 满' + condition[i].money + ' 元包邮'
          } else if (condition[i].method == 4) {
            desc += '<br/>条件: 满' + condition[i].weight + ' kg以内包邮'
          } else if (condition[i].method == 5) {
            desc += '<br/>条件: 满' + condition[i].weight + ' kg以内, 满' + condition[i].money + ' 元包邮'
          }
        }
      }
      return desc
    },
    parsePlace (place) {
      place = JSON.parse(place)
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
        window.dbh.alertError(err)
      })
    },
    onAppendFree () {
      if (this.freeTable.length === 3) {
        window.dbh.alertError('最多3条记录')
        return
      }
      // 包邮表单数据
      this.freeTable.push({
        index: this.freeTable.length,
        place: [],
        logistics_type: '',
        method: '',
        money: 0, // 满多少金额,
        weight: 0, // 多少重量kg内,
        count: 0 // 满多少件
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
    getMethodType (id) {
      for (let i in this.methodOptions) {
        if ((this.methodOptions[i].value) === (id)) {
          return this.methodOptions[i].label
        }
      }
    },
    getLogisticType (id) {
      for (let i in this.logisticsOptions) {
        if ((this.logisticsOptions[i].value) === (id)) {
          return this.logisticsOptions[i].label
        }
      }
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
      this.addForm.enable_free_cond = this.addForm.enable_free_cond ? 1 : 0
      this.addForm.price_define = this.getPlaceTable()
      this.addForm.free_condition = this.getFreeTable()
      // 添加
      freightApi.create(this.addForm, (resp) => {
        this.loading = false
        this.dialogAddVisible = false
        this.refresh()
      }, (err) => {
        this.loading = false
        window.dbh.alertError(err)
      })
    },
    onSubmitEditForm () {
      // 编辑
      this.loading = true
      this.editForm.enable_free_cond = this.editForm.enable_free_cond ? 1 : 0
      this.editForm.price_define = this.getPlaceTable()
      this.editForm.free_condition = this.getFreeTable()
      // 编辑
      freightApi.update(this.editForm, (resp) => {
        this.loading = false
        this.dialogEditVisible = false
        this.refresh()
      }, (err) => {
        this.loading = false
        window.dbh.alertError(err)
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
            instance.confirmButtonText = window.dbh.vue_instance.$i18n.t('Processing').value
            freightApi.delete({ id: id }, (res) => {
              instance.confirmButtonLoading = false
              this.refresh()
              done()
            }, (res) => {
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
    onAdd () {
      this.freeTable = []
      this.placeTable = []
      this.onAppend()
      this.dialogEditVisible = false
      this.dialogAddVisible = true
      this.addForm.name = ''
      this.addForm.logistics_type = 'express'
      this.addForm.freight_type = 1
      this.addForm.method = 'weight'
    },
    getFreeTable () {
      for (let i in this.freeTable) {
        this.freeTable[i].f_place = {
          prov: [],
          city: []
        }
        for (let j in this.freeTable[i].place) {
          let tmp = this.freeTable[i].place[j]
          if (tmp.length > 0) {
            if (tmp.length > 1) {
              let city = tmp[1]
              if (this.freeTable[i].f_place.city.indexOf(city) === -1) {
                this.freeTable[i].f_place.city.push(city)
              }
            } else {
              let prov = tmp[0]
              if (this.freeTable[i].f_place.prov.indexOf(prov) === -1) {
                this.freeTable[i].f_place.prov.push(prov)
              }
            }
          }
        }
        this.freeTable[i].place = null
        delete this.freeTable[i].place
      }
      return JSON.stringify(this.freeTable)
    },
    restoreFreeTable (freeCondition) {
      freeCondition = JSON.parse(freeCondition)
      // 设置其它运费
      for (let i = 0; i < freeCondition.length; i++) {
        this.freeTable.push({
          index: i,
          logistics_type: freeCondition[i].logistics_type,
          method: freeCondition[i].method,
          weight: freeCondition[i].weight,
          money: freeCondition[i].money,
          count: freeCondition[i].count,
          place: []
        })
        for (let j = 0; j < freeCondition[i].f_place.prov.length; j++) {
          this.freeTable[i].place.push([freeCondition[i].f_place.prov[j]])
        }
        for (let j = 0; j < freeCondition[i].f_place.city.length; j++) {
          let tmpProv = freeCondition[i].f_place.city[j]
          tmpProv = tmpProv.substr(0, 2).padEnd(tmpProv.length, '0')
          this.freeTable[i].place.push([tmpProv, freeCondition[i].f_place.city[j]])
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
    restorePlaceTable (price_define) {
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
      this.dialogAddVisible = false
      this.dialogEditVisible = true
      this.placeTable = []
      this.freeTable = []
      this.restorePlaceTable(row.price_define)
      this.restoreFreeTable(row.free_condition)
      this.editForm = {
        id: row.id,
        name: row.name,
        enable_free_cond: parseInt(row.enable_free_cond) === 1,
        logistics_type: row.logistics_type,
        freight_type: parseInt(row.freight_type),
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
        window.dbh.alertError(e)
        this.loading = false
      }
    }
  }
}
</script>
