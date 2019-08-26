<style>
    .sku-panel {
        display: flex;
        flex-flow: row wrap;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .sku-panel .sku-item {
        width: 160px;
    }
</style>
<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-plus"
                :loading="loading"
                @click="onBack()">
            {{ $t('Back')}}
        </el-button>
        <div class="sku-panel">
            <div v-for="(prop, index) in saleProp" :key="prop.id" class="sku-item margin-md-right">
                <div class="sku-title">
                    {{ prop.title }}
                </div>
                <div>
                    <el-select size="mini" clearable multiple v-model="selectedValues[index]">
                        <el-option
                                v-for="item in prop.prop_values"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="margin-md-top">
            <el-button size="mini" @click="formatSelectValues">生成</el-button>
        </div>

        <div class="grid-content margin-md-top">
            <el-table
                    ref="table"
                    v-loading="loading"
                    :data="tableData"
                    stripe
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
                        width="160px"
                        :label="$t('SaleTime')">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sale_open_time > 0">销售开始:<br/>
                        {{(new Date(scope.row.sale_open_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                        </span>
                        <span v-else>不限制</span>
                        <br/>
                        <span v-if="scope.row.sale_end_time > 0">销售截至:<br/>
                        {{(new Date(scope.row.sale_end_time * 1000)).format('yyyy-MM-dd hh:mm:ss')}}
                        </span>
                        <span v-else>不限制</span>
                    </template>
                </el-table-column>
                <el-table-column
                        width="160px"
                        :label="$t('CreateTime')">
                    <template slot-scope="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd')}}
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                icon="by-icon by-pinpai"
                                @click="onSku(scope.row)">
                            {{$t('Goods')}}{{$t('SKU')}}
                        </el-button>
                        <el-button
                                size="mini"
                                icon="by-icon by-pinpai"
                                @click="onSku(scope.row)">
                            {{$t('Delivery')}}{{$t('Place')}}
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
    props: {
      id: String
    },
    components: {
      ElForm,
      ElButtonGroup,
      ElButton
    },
    data () {
      return {
        selectedValues: [],
        inputVisible: false,
        rules: {
          title: [
            { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
            { min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
          ]
        },
        tableData: [],
        saleProp: [],
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
      getRelateProp (cateId) {
        spCateApi.getProp({ cate_id: cateId, is_sale: 1 }, (resp) => {
          console.debug('getSaleProp', resp)
          this.saleProp = resp
          this.selectedValues = null
          this.selectedValues = new Array(this.saleProp.length)

        }, (err) => {
          window.tools.alertError('获取类目属性失败')
        })
      },
      onBack (row) {
        this.$router.go(-1)
      },
      formatSelectValues () {
        let combInitial = []
        this.selectedValues = this.selectedValues.filter((item) => {
          return item.length > 0
        })
        // console.debug(this.selectedValues, this.saleProp);
        let len = this.saleProp.length
        for (let i = 0; i < this.selectedValues.length; i++) {
          let selProp = this.selectedValues[i]
          for (let i2 = 0; i2 < selProp.length; i2++) {
            // console.debug("selPropValue", selProp[i2])
            for (let j = 0; j < this.saleProp.length; j++) {
              for (let k = 0; k < this.saleProp[j].prop_values.length; k++) {
                if (parseInt(this.saleProp[j].prop_values[k].id) === selProp[i2]) {
                  // console.debug("value", this.saleProp[j].prop_values[k], selProp[i2])
                  let key = 'k' + this.saleProp[j].id
                  if (!(key in combInitial)) {
                    combInitial[key] = [
                      this.saleProp[j].id,
                      this.saleProp[j].title,
                      []
                    ]
                  }
                  combInitial[key][2].push(this.saleProp[j].prop_values[k])
                }
              }
            }
          }
        }
        console.debug('选中的属性值', combInitial)
        this.buildTableData(combInitial)
      },
      isObject (obj) {
        let type = typeof obj
        return type === 'function' || type === 'object' && !!obj
      },
      iterationCopy (src) {
        let target = {}
        for (let prop in src) {
          if (src.hasOwnProperty(prop)) {
            // if the value is a nested object, recursively copy all it's properties
            if (this.isObject(src[prop])) {
              target[prop] = this.iterationCopy(src[prop])
            } else {
              target[prop] = src[prop]
            }
          }
        }
        return target
      },
      buildTableData (combInitial) {
        let formatComb = []
        for (let item in combInitial) {
          formatComb.push(combInitial[item])
        }
        let maxLevel = formatComb.length
        let curLevel = 0
        let result = []
        let findResult = []
        let stack = new Array(maxLevel)
        for (let i = 0; i < stack.length; i++) {
          stack[i] = 0
        }
        console.debug(stack, formatComb, maxLevel)
        let cnt = 0
        while (true) {
          if (cnt++ > 50) break
          console.debug('当前层次' + curLevel)
          if (stack[curLevel] >= formatComb[curLevel][2].length) {
            console.debug('该层已经遍历完毕，则向上回归，重置下层的索引')
            for (let k = curLevel; k < maxLevel; k++) {
              stack[k] = 0
            }
            curLevel--
            console.debug('移除临时结果中的该层数据')
            result.pop()
            if (curLevel < 0) {
              break
            }
            stack[curLevel]++
            continue
          }

          console.debug('当前遍历次数', cnt, 'curLevel', curLevel, 'stack', stack)
          console.debug('formatComb[' + curLevel + ']', formatComb[curLevel])
          console.debug('formatComb[' + curLevel + '][2]', formatComb[curLevel][2][stack[curLevel]])

          let node = formatComb[curLevel][2][stack[curLevel]]

          result.push([node.id, node.title, formatComb[curLevel][0], formatComb[curLevel][1]])
          if (result.length < maxLevel) {
            console.debug('往下递归一层')
            curLevel++
          } else {
            console.debug('found result', result)
            findResult.push(this.iterationCopy(result))
            result.pop()
            console.debug('找到一个结果，继续递增 栈的索引')
            stack[curLevel]++
          }
        }

        console.debug('foundResult', findResult)
        let formatResult = []
        for (let i = 0; i < findResult.length; i++) {
          let key = ''
          let tmp = []
          let title = ''
          for (let j in findResult[i]) {
            if (key > 0) {
              key += '_'
              title += ';'
            }
            key += findResult[i][j][0]
            title += findResult[i][j][3] + ':' + findResult[i][j][1]
            tmp.push([findResult[i][j][0], findResult[i][j][1], findResult[i][j][2], findResult[i][j][3]])
          }
          formatResult.push({
            key: key,
            specs: JSON.stringify(tmp),
            title: title
          })
        }

        console.debug('formatResult', formatResult)
      },
      sortAsc (a, b) {
        return a - b
      },
      refresh () {
        // 刷新当前
        this.tableData = []
        this.loading = true
        let that = this
        goodsApi.info({ id: this.id }, (resp) => {
          this.getRelateProp(resp.cate_id)
          this.loading = false
        }, (err) => {
          window.tools.alertError(err)
          this.loading = false
        })
      }
    }
  }
</script>
