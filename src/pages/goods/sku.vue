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

    .by-goods-sku .goods-img {
        border-radius: 0;
        width: 80px;
        height: 80px;
    }
</style>
<template>
  <div class="main-content by-goods-sku padding-md-bottom padding-md-top">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-plus"
      :loading="loading"
      @click="onBack()"
    >
      {{ $t('Back') }}
    </el-button>
    <div class="margin-md-bottom">
      <el-alert class="margin-md-bottom">
        1. 单库存商品,用户就不用选库存(比如颜色、尺码、内存等),直接购买<br>
        2. 多库存商品,用户需要选择库存(比如颜色 白色还是黑色，尺码 大还是小 )，不同库存可设置不同价格
        3. 多库存商品尽量不要选择过多参数<br>
        4. 修改库存请先下架商品
      </el-alert>
      <el-radio
        v-model="skuForm.single_sku"
        :label="1"
      >
        单库存
      </el-radio>
      <el-radio
        v-model="skuForm.single_sku"
        :label="0"
      >
        多库存
      </el-radio>
    </div>
    <div v-if="skuForm.single_sku">
      <el-button
        size="mini"
        type="primary"
        :loading="loading"
        @click="onSave"
      >
        保存
      </el-button>
    </div>
    <div v-else>
      <div class="sku-panel">
        <div
          v-for="(prop, index) in saleProp"
          :key="prop.id"
          class="sku-item margin-md-right"
        >
          <div class="sku-title">
            {{ prop.title }}
          </div>
          <div>
            <el-select
              v-model="selectedValues[index]"
              size="mini"
              clearable
              multiple
            >
              <el-option
                v-for="item in prop.prop_values"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
      </div>
      <div class="margin-md-top">
        <el-button
          size="mini"
          :loading="loading"
          @click="initMutipleSku"
        >
          生成表格
        </el-button>
        <el-button
          size="mini"
          :loading="loading"
          type="primary"
          @click="onSave"
        >
          保存
        </el-button>
      </div>
    </div>
    <div
      v-if="tableData.length > 0"
      class="grid-content margin-md-top"
    >
      <el-table
        ref="table"
        v-loading="loading"
        :data="tableData"
        stripe
        :element-loading-text="$t('Loading')"
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          width="80px"
          :label="$t('Key')"
        />
        <el-table-column
          width="200px"
          prop="title"
          :label="$t('Title')"
        />
        <el-table-column
          width="160px"
          prop="pic"
          :label="$t('Image')"
        >
          <template #default>
            <ImgUploader
              :ref="'imgUploader' + scope.row.index"
              :number="'' + scope.row.index"
              img-cls="goods-img"
              :default-img-url="skuForm.pic[scope.row.index]"
              img-type="goods"
              @onUploadSuccess="onUploadSuccess"
            />
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('Goods') + $t('Number')"
        >
          <template #default>
            <el-input v-model="skuForm.out_goods_no[scope.row.index]" />
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('Stock') + $t('Price')"
        >
          <template #default>
            <el-input v-model="skuForm.stock_price[scope.row.index]" />
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('Price')"
        >
          <template #default>
            <el-input v-model="skuForm.price[scope.row.index]" />
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          :label="$t('Stock')"
        >
          <template #default>
            <el-input v-model="skuForm.stock[scope.row.index]" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import goodsSkuApi from '../../api/goodsSkuApi'
import spCateApi from '../../api/spCateApi'
import goodsApi from '../../api/goodsApi'

import ImgUploader from '../../components/img-uploaderV3'

export default {
  components: {
    ImgUploader
  },
  props: {
    id: String
  },
  data () {
    return {
      main_img: '',
      selectedValues: [],
      sku: [],
      uniq_goods_no: [],
      skuForm: {
        price: [],
        out_goods_no: [],
        stock_price: [],
        stock: [],
        specs: [],
        pic: [],
        sku_index: [],
        uniq_goods_no: [],
        single_sku: 0,
        goods_id: 0
      },
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
  watch: {
    'skuForm.single_sku' (newVal) {
      if (newVal === 1) {
        this.tableData = null
        this.tableData = []
        this.initSingleSku()
      } else {
        this.tableData = null
        this.tableData = []
      }
    }
  },
  created () {
    this.skuForm.goods_id = parseInt(this.id)
  },
  mounted () {
    this.refresh()
  },
  methods: {
    initSingleSku () {
      this.tableData = [{ key: '0_0_0', title: '单库存:单库存', index: 0 }]
      this.skuForm.sku_index = null
      this.skuForm.specs = null
      this.skuForm.sku_index = ['0_0_0']
      this.skuForm.specs = [JSON.stringify([0, '单库存', 0, '单库存'])]
      this.initSkuForm()
      this.fillData()
    },
    onUploadSuccess (data) {
      console.debug('image upload success', this.skuForm, data)
      this.skuForm.pic[parseInt(data.id)] = window.tools.getImgUrl(data.path)
    },
    fillUniqGoodsNo () {
      // 设置 系统货号，如果有的话
      // 用于更新数据用的
      for (let i in this.skuForm.sku_index) {
        if (this.uniq_goods_no[this.skuForm.sku_index[i]]) {
          this.skuForm.uniq_goods_no[i] = this.uniq_goods_no[this.skuForm.sku_index[i]]
        }
      }
    },
    onSave () {
      this.fillUniqGoodsNo()
      this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
        confirmButtonText: this.$i18n.t('Confirm'),
        cancelButtonText: this.$i18n.t('Cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
            this.loading = true
            goodsSkuApi.create(this.skuForm, (resp) => {
              done()
              this.loading = false
            }, (err) => {
              done()
              window.tools.alertError(err)
              this.loading = false
            })
          } else {
            done()
          }
        }
      }).then(() => {
        done()
      }).catch(() => {
        done()
      })
    },
    setExistsProps () {
      let cnt = 0
      let buildFlag = false
      for (let i in this.sku) {
        for (let j in this.sku[i].specs) {
          for (let k in this.saleProp) {
            console.debug(this.sku[i].specs[j][2], this.saleProp[k].id)
            if (this.sku[i].specs[j][2] === this.saleProp[k].id) {
              if (!this.selectedValues[k]) {
                this.selectedValues[k] = []
              }
              if (this.selectedValues[k].indexOf(this.sku[i].specs[j][0]) === -1) {
                this.selectedValues[k].push(this.sku[i].specs[j][0])
                buildFlag = true
              }
            }
          }
        }
        cnt++
      }

      if (buildFlag) {
        this.initMutipleSku()
      }
      this.fillData()
    },
    fillData () {
      for (let i in this.sku) {
        for (let j in this.skuForm.sku_index) {
          if (this.skuForm.sku_index[j] === this.sku[i].specs_index) {
            this.skuForm.stock_price[j] = this.sku[i].stock_price
            this.skuForm.stock[j] = this.sku[i].stock
            this.skuForm.price[j] = this.sku[i].price
            this.skuForm.pic[j] = this.sku[i].pic
            this.skuForm.out_goods_no[j] = this.sku[i].goods_no
            this.skuForm.uniq_goods_no[j] = this.sku[i].uniq_goods_no
            this.uniq_goods_no[this.sku[i].specs_index] = this.sku[i].uniq_goods_no
          }
        }
      }
      console.debug(this.skuForm)
    },
    getRelateProp (cateId) {
      spCateApi.getProp({ cate_id: cateId, is_sale: 1 }, (resp) => {
        this.saleProp = resp
        this.selectedValues = null
        this.selectedValues = new Array(this.saleProp.length)
        // 设置已经选择的
        this.setExistsProps()
      }, (err) => {
        window.tools.alertError('获取类目属性失败')
      })
    },
    onBack (row) {
      this.$router.go(-1)
    },
    initMutipleSku () {
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
      this.initSkuForm()
      this.fillData()
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
    initSkuForm () {
      let size = this.tableData.length
      this.skuForm.price = new Array(size)
      this.skuForm.out_goods_no = new Array(size)
      this.skuForm.stock_price = new Array(size)
      this.skuForm.stock = new Array(size)
      // this.skuForm.specs = new Array(size)
      this.skuForm.pic = new Array(size)
      this.skuForm.uniq_goods_no = new Array(size)
      for (let i = 0; i < size; i++) {
        this.skuForm.pic[i] = this.main_img
        this.skuForm.uniq_goods_no[i] = ''
      }
      // this.skuForm.sku_index = new Array(size)
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

        // console.debug('当前遍历次数', cnt, 'curLevel', curLevel, 'stack', stack)
        // console.debug('formatComb[' + curLevel + ']', formatComb[curLevel])
        // console.debug('formatComb[' + curLevel + '][2]', formatComb[curLevel][2][stack[curLevel]])

        let node = formatComb[curLevel][2][stack[curLevel]]

        result.push([node.id, node.title, formatComb[curLevel][0], formatComb[curLevel][1]])
        if (result.length < maxLevel) {
          // console.debug('往下递归一层')
          curLevel++
        } else {
          console.debug('found result', result)
          findResult.push(this.iterationCopy(result))
          result.pop()
          // console.debug('找到一个结果，继续递增 栈的索引')
          stack[curLevel]++
        }
      }

      // console.debug('foundResult', findResult)
      // 改变存储结构方便使用
      let formatResult = []
      let index = 0
      this.skuForm.sku_index = []
      this.skuForm.specs = []
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
        let specs = JSON.stringify(tmp)
        formatResult.push({
          index: index++,
          key: key,
          specs: specs,
          title: title
        })
        this.skuForm.sku_index.push(key)
        this.skuForm.specs.push(specs)
      }

      console.debug('formatResult', formatResult)
      this.tableData = formatResult
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
        this.sku = resp.sku
        if (this.sku.length > 0) {
          this.skuForm.single_sku = this.sku[0].single_sku
        }
        this.main_img = resp.cover_img
        this.loading = false
      }, (err) => {
        window.tools.alertError(err)
        this.loading = false
      })
    }
  }
}
</script>
