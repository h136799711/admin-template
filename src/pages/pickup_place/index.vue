<style>
    .blue {
        color: blue;
    }
</style>
<template>
  <div class="main-content by-banners padding-md-bottom padding-md-top">
    <div v-if="!(this.dialogEditVisible || this.dialogAddVisible || this.dialogGiveVisible)">
      <div>
        <el-form
          :inline="true"
          :model="queryForm"
          class="demo-form-inline"
        >
          <el-form-item>
            <el-input
              v-model="queryForm.title"
              clearable
              size="mini"
              :placeholder="$t('Title')"
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
            width="180px"
            prop="title"
            :label="$t('Title')"
          />
          <el-table-column
            width="200px"
            prop="description"
            :label="$t('Description')"
          />
          <el-table-column
            width="160px"
            prop="title"
            :label="$t('Image')"
          >
            <template #default="scope">
              <div>
                <el-image
                  style="width: 120px;height:90px;"
                  :src="scope.row.thumbnail"
                  alt="主图"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="160px"
            prop="lng"
            :label="$t('Lng')"
          />
          <el-table-column
            width="160px"
            prop="lat"
            :label="$t('Lat')"
          />
          <el-table-column
            width="160px"
            prop="phone"
            :label="$t('ContactPhone')"
          />
          <el-table-column
            width="160px"
            prop="booking_days"
            :label="$t('BookingDays')"
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
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click="onDelete(scope.row.id)"
              >
                {{ $t('Delete') }}
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
            @current-change="byPagerCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <div
      v-if="this.dialogEditVisible"
      class="edit-form"
    >
      <div class="">
        <h2>{{ $t('Edit') }}</h2>
      </div>

      <el-form
        ref="editForm"
        class="margin-md-top"
        :model="editForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          :label="$t('Title')"
          required
          prop="title"
        >
          <el-input
            v-model="editForm.title"
            maxlength="60"
            size="mini"
            show-word-limit
            placeholder="标题"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Description')"
          required
          prop="description"
        >
          <el-input
            v-model="editForm.description"
            maxlength="60"
            size="mini"
            show-word-limit
            placeholder="位置备注"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Lng')"
          required
          prop="lng"
        >
          <el-input v-model="editForm.lng" />
        </el-form-item>
        <el-form-item
          :label="$t('Lat')"
          required
          prop="lat"
        >
          <el-input v-model="editForm.lat" />
        </el-form-item>
        <el-form-item
          :label="$t('Cover')"
          prop="thumbnail"
        >
          <ImgUploader
            ref="editImgUploader"
            :default-img-url="editForm.thumbnail"
            :clear="imgUploadClear"
            img-type="pic"
            @onUploadSuccess="onUploadSuccess"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Location')"
          required
          prop="location"
        >
          <el-input v-model="editForm.location" />
        </el-form-item>
        <el-form-item
          :label="$t('ContactPhone')"
          required
          prop="phone"
        >
          <el-input
            v-model="editForm.phone"
            type="number"
          />
        </el-form-item>
        <el-form-item
          :label="$t('BookingDays')"
          required
          prop="booking_days"
        >
          <el-input
            v-model="editForm.booking_days"
            type="number"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
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
    </div>
    <!-- Add Form -->
    <div
      v-if="this.dialogAddVisible"
      class="add-form"
    >
      <div class="">
        <h2>{{ $t('Add') }}</h2>
      </div>
      <el-form
        ref="addForm"
        class="margin-md-top"
        :model="addForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          :label="$t('Title')"
          required
          prop="title"
        >
          <el-input
            v-model="addForm.title"
            maxlength="60"
            size="mini"
            show-word-limit
            placeholder="优惠券标题"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Description')"
          required
          prop="description"
        >
          <el-input
            v-model="addForm.description"
            maxlength="60"
            size="mini"
            show-word-limit
            placeholder="位置备注"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Lng')"
          required
          prop="lng"
        >
          <el-input v-model="addForm.lng" />
        </el-form-item>
        <el-form-item
          :label="$t('Lat')"
          required
          prop="lat"
        >
          <el-input v-model="addForm.lat" />
        </el-form-item>
        <el-form-item
          :label="$t('Cover')"
          prop="thumbnail"
        >
          <ImgUploader
            ref="addImgUploader"
            :default-img-url="addForm.thumbnail"
            :clear="imgUploadClear"
            img-type="pic"
            @onUploadSuccess="onUploadSuccess"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Location')"
          required
          prop="location"
        >
          <el-input v-model="addForm.location" />
        </el-form-item>
        <el-form-item
          :label="$t('ContactPhone')"
          required
          prop="phone"
        >
          <el-input
            v-model="addForm.phone"
            type="number"
          />
        </el-form-item>
        <el-form-item
          :label="$t('BookingDays')"
          required
          prop="booking_days"
        >
          <el-input
            v-model="addForm.booking_days"
            type="number"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
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
    </div>
  </div>
</template>

<script>
import fileApi from '../../api/fileApi'
import pickupPlaceApi from '../../api/pickupPlaceApi'

import ImgUploader from '@/components/img-uploaderV3.vue'

export default {
  components: {
    ImgUploader
  },
  data () {
    return {
      dialogAddVisible: false,
      dialogEditVisible: false,
      dialogGiveVisible: false,
      inputVisible: false,
      imgUploadClear: false,
      queryForm: {
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
      addForm: {
        title: '',
        description: '',
        lat: '',
        lng: '',
        thumbnail: '',
        location: '',
        phone: '',
        booking_days: ''
      },
      editForm: {
        id: '',
        title: '',
        description: '',
        lat: '',
        lng: '',
        thumbnail: '',
        location: '',
        phone: '',
        booking_days: ''
      },
      rules: {
        title: [
          { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
          { min: 1, max: 50, message: this.$i18n.t('String Length Between', [1, 32]), trigger: 'blur' }
        ]
      },
      count: 0,
      loading: false
    }
  },
  computed: {},
  watch: {
    dialogAddVisible (newVal) {
      if (!newVal) {
        this.imgUploadClear = true
      }
    }
  },
  created () {

  },
  mounted () {
    this.refresh()
  },
  methods: {
    onDelete (id) {
      let that = this
      this.$confirm(this.$i18n.t('Action Confirm'), this.$t('Alert'), {
        confirmButtonText: this.$i18n.t('Confirm'),
        cancelButtonText: this.$i18n.t('Cancel'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value
            pickupPlaceApi.delete({ id: id }).finally(function () {
              instance.confirmButtonLoading = false
              that.refresh()
              done()
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
      this.addForm = {
        title: '',
        description: '',
        lat: '',
        lng: '',
        thumbnail: '',
        location: '',
        phone: '',
        booking_days: ''
      }
      this.dialogAddVisible = true
    },
    onEdit (resp) {
      this.editForm.id = resp.id
      this.editForm.title = resp.title
      this.editForm.description = resp.description
      this.editForm.lat = resp.lat
      this.editForm.lng = resp.lng
      this.editForm.thumbnail = resp.thumbnail
      this.editForm.location = resp.location
      this.editForm.phone = resp.phone
      this.editForm.booking_days = resp.booking_days
      this.dialogEditVisible = true
    },
    editorImgAdd (pos, file) {
      fileApi.upload(file, 'pic').then(({ data }) => {
                	if (data.code === 0) {
                		let imgUrl = window.tools.getImgUrl(data.data.relative_path)
          this.$refs.md.$img2Url(pos, imgUrl)
        } else {
          window.tools.alertError(data.msg)
        }
      }).catch((reason) => {
                	window.tools.alertError(reason)
      })
    },
    onUploadSuccess (data) {
      if (this.dialogAddVisible) {
        this.addForm.thumbnail = window.tools.getImgUrl(data.path)
      } else if (this.dialogEditVisible) {
        this.editForm.thumbnail = window.tools.getImgUrl(data.path)
      }
      console.debug('image upload success', data)
    },
    submitEditForm () {
      let that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.editForm)
          this.loading = true
          pickupPlaceApi.edit(data).then(function () {
            window.tools.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
          }).finally(function () {
            setTimeout(function () {
              that.loading = false
							    that.dialogEditVisible = false
							    that.refresh()
            }, 1000)
          })
        } else {
          return false
        }
      })
    },
    submitAddForm () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.addForm)
          this.loading = true
          pickupPlaceApi.create(data).then(function () {
            window.tools.alertSuc(that.$i18n.t('Action') + that.$i18n.t('Success'))
          }).finally(function () {
            setTimeout(function () {
              that.loading = false
							    that.dialogAddVisible = false
							    that.refresh()
            }, 1000)
          })
        } else {
          return false
        }
      })
    },
    async refresh () {
      // 刷新当前
      // this.tableData = [];
      this.loading = true
      let that = this
      try {
        let data = await pickupPlaceApi.query(that.queryForm)
        that.tableData = data
        that.count = parseInt(that.tableData.length)
        that.loading = false
      } catch (err) {
        console.debug(err)
        window.tools.alertError(err)
        that.loading = false
      }
    }
  }
}
</script>
