<style>
    .videoCover {
        width: 144px;
        height: 240px;
    }
</style>
<template>
  <div class="main-content by-album padding-md-bottom padding-md-top">
    <div>
      <el-form
        :inline="true"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-select
            v-model="queryForm.cate_id"
            size="mini"
          >
            <el-option
              :key="0"
              :label="$t('All')"
              :value="0"
            />
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="queryForm.show_status"
            size="mini"
          >
            <el-option
              :key="1"
              :label="$t('OnShelves')"
              :value="1"
            />
            <el-option
              :key="0"
              :label="$t('OffShelves')"
              :value="0"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryForm.title"
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
            {{
              $t('Search') }}
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
          width="80px"
          :label="$t('ID')"
        />
        <el-table-column
          width="100px"
          prop="cover"
          :label="$t('Cover')"
        >
          <template #default="scope">
            <img
              :src="scope.row.cover"
              class="margin-sm"
              style="width: 72px;height: 120px;"
              alt="cover"
            >
          </template>
        </el-table-column>
        <el-table-column
          width="140px"
          prop="title"
          :label="$t('Title')"
        />
        <el-table-column
          width="180px"
          :label="$t('Info')"
        >
          <template #default>
            {{ $t('Actor') }}:{{ scope.row.actors }}<br>
            {{ $t('Director') }}::{{ scope.row.directors }}<br>
            {{ $t('Year') }}::{{ scope.row.year }}<br>
            {{ $t('Area') }}::{{ scope.row.area }}<br>
            {{ $t('Language') }}::{{ scope.row.language }}<br>
            {{ $t('Tag') }}::{{ scope.row.tags }}<br>
          </template>
        </el-table-column>
        <!--                <el-table-column-->
        <!--                        width="160px"-->
        <!--                        prop="description"-->
        <!--                        :label="$t('Description')"-->
        <!--                />-->
        <el-table-column
          width="100px"
          prop="cate_id"
          :label="$t('Category')"
        >
          <template #default="scope">
            {{ getCateName(scope.row.cate_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="views"
          :label="$t('View') + $t('Count')"
        />
        <el-table-column
          width="140px"
          :label="$t('CreateTime')"
        >
          <template #default="scope">
            {{ (new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
          label="推荐"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.recommend"
              size="mini"
              style="display: block"
              :active-value="1"
              :inactive-value="0"
              active-text="推荐"
              @change="onRecommend(scope.row.id, scope.row.recommend)"
            />
          </template>
        </el-table-column>

        <el-table-column
          width="320px"
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.show_status == 0"
              size="mini"
              icon="el-icon-top"
              @click="OnShelves(scope.row.id)"
            >
              {{ $t('OnShelves') }}
            </el-button>
            <el-button
              v-if="scope.row.show_status == 1"
              size="mini"
              icon="el-icon-bottom"
              @click="OffShelves(scope.row.id)"
            >
              {{ $t('OffShelves') }}
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-video-play"
              @click="onVideoSource(scope.row.id)"
            >
              {{ $t('Source') }}
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="onEdit(scope.row)"
            >
              {{ $t('Edit') }}
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

    <el-dialog
      v-model="dialogEditVisible"
      :show-close="false"
      :append-to-body="false"
      :title="$t('Edit')"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
        class="edit-form"
      >
        <el-form-item
          :label="$t('Title')"
          prop="title"
        >
          <el-input v-model="editForm.title" />
        </el-form-item>

        <el-form-item
          :label="$t('Year')"
          prop="year"
        >
          <el-input v-model="editForm.year" />
        </el-form-item>
        <el-form-item
          :label="$t('Area')"
          prop="area"
        >
          <el-input v-model="editForm.area" />
        </el-form-item>
        <el-form-item
          :label="$t('Director')"
          prop="directors"
        >
          <el-input v-model="editForm.directors" />
        </el-form-item>
        <el-form-item
          :label="$t('Actor')"
          prop="actors"
        >
          <el-input v-model="editForm.actors" />
        </el-form-item>
        <el-form-item
          :label="$t('End')"
          prop="end"
        >
          <el-radio
            v-model="editForm.is_end"
            :label="1"
          >
            {{ $t('Yes') }}
          </el-radio>
          <el-radio
            v-model="editForm.is_end"
            :label="0"
          >
            {{ $t('No') }}
          </el-radio>
        </el-form-item>
        <el-form-item
          :label="$t('Category')"
          prop="cate_id"
        >
          <el-select v-model="editForm.cate_id">
            <el-option
              v-for="item in category"
              :key="parseInt(item.id)"
              :label="item.title"
              :value="parseInt(item.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('Cover')"
          prop="cover"
        >
          <ImgUploader
            ref="editImgUploader"
            show="all"
            img-cls="videoCover"
            :default-img-url="editForm.cover"
            :clear="imgUploadClear"
            img-type="video_cover"
            @onUploadSuccess="onUploadSuccess"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Tag')"
          prop="tag"
        >
          <el-tag
            v-for="t in editForm.tags"
            :key="t"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ t }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="refEditTag"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
          >
            {{ $t('Add') + $t('Tag') }}
          </el-button>
        </el-form-item>
        <el-form-item
          :label="$t('Description')"
          prop="description"
        >
          <el-input
            v-model="editForm.description"
            :rows="5"
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          label=""
          prop="id"
          class="hidden"
        >
          <el-input
            v-model="editForm.id"
            :disabled="true"
            class="hidden"
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
    </el-dialog>

    <!-- Add Form -->
    <el-dialog
      v-model="dialogAddVisible"
      :show-close="false"
      :append-to-body="false"
      :title="$t('Add')"
    >
      <el-form
        ref="addForm"
        status-icon
        :model="addForm"
        label-position="right"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          :label="$t('Title')"
          prop="title"
        >
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item
          :label="$t('Year')"
          prop="year"
        >
          <el-input v-model="addForm.year" />
        </el-form-item>
        <el-form-item
          :label="$t('Area')"
          prop="area"
        >
          <el-input v-model="addForm.area" />
        </el-form-item>
        <el-form-item
          :label="$t('Director')"
          prop="directors"
        >
          <el-input v-model="addForm.directors" />
        </el-form-item>
        <el-form-item
          :label="$t('Actor')"
          prop="actors"
        >
          <el-input v-model="addForm.actors" />
        </el-form-item>

        <el-form-item
          :label="$t('End')"
          prop="end"
        >
          <el-radio
            v-model="addForm.is_end"
            :label="1"
          >
            {{ $t('Yes') }}
          </el-radio>
          <el-radio
            v-model="addForm.is_end"
            :label="0"
          >
            {{ $t('No') }}
          </el-radio>
        </el-form-item>
        <el-form-item
          :label="$t('Category')"
          prop="cate_id"
        >
          <el-select v-model="addForm.cate_id">
            <el-option
              v-for="item in category"
              :key="parseInt(item.id)"
              :label="item.title"
              :value="parseInt(item.id)"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('Cover')"
          prop="cover"
        >
          <ImgUploader
            ref="editImgUploader"
            img-cls="videoCover"
            :default-img-url="addForm.cover"
            :clear="imgUploadClear"
            img-type="video_cover"
            @onUploadSuccess="onUploadSuccess"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Tag')"
          prop="tag"
        >
          <el-tag
            v-for="t in addForm.tags"
            :key="t"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ t }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="refAddTag"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
          >
            {{ $t('Add') + $t('Tag') }}
          </el-button>
        </el-form-item>
        <el-form-item
          :label="$t('Description')"
          prop="description"
        >
          <el-input
            v-model="addForm.description"
            type="textarea"
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
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api/videoApi'
import fileApi from '../../api/fileApi'
import cateApi from '../../api/videoCateApi'

import ImgUploader from '@/components/img-uploader2online.vue'

export default {
  components: {
    ImgUploader
  },
  data () {
    return {
      imgUploadClear: false,
      inputVisible: false,
      inputValue: '',
      category: [],
      queryForm: {
        show_status: 0,
        cate_id: 0,
        title: '',
        page_index: 1,
        page_size: 10
      },
      addForm: {
        tags: [],
        title: '',
        description: '',
        cover: '',
        cate_id: 1,
        year: 0
      },
      editForm: {
        id: 0,
        title: '',
        description: '',
        cover: '',
        cate_id: 1,
        year: 0,
        tags: []
      },
      rules: {
        title: [
          { required: true, message: this.$i18n.t('Please Input Title'), trigger: 'blur' },
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
  computed: {},
  watch: {
    dialogAddVisible (newVal) {
      if (!newVal) {
        this.imgUploadClear = true
      }
    },
    dialogEditVisible (newVal) {
      // if (!newVal) {
      //     this.imgUploadClear = true
      // }
    }
  },
  created () {
    cateApi.query({}, (resp) => {
      this.category = resp
      this.refresh()
    }, (resp) => {
      window.tools.alertError(resp.msg)
      this.loading = false
    })
  },
  mounted: function () {
    // this.refresh();
  },
  methods: {
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        if (this.dialogAddVisible) {
          this.$refs.refAddTag.$refs.input.focus()
        } else if (this.dialogEditVisible) {
          this.$refs.refEditTag.$refs.input.focus()
        }
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.inputVisible = false
        this.inputValue = ''
        if (this.dialogAddVisible) {
          for (let t in this.addForm.tags) {
            if (this.addForm.tags[t] == inputValue) {
              return
            }
          }
          this.addForm.tags.push(inputValue)
        } else if (this.dialogEditVisible) {
          for (let t in this.editForm.tags) {
            if (this.editForm.tags[t] == inputValue) {
              return
            }
          }
          this.editForm.tags.push(inputValue)
        }
      }
    },
    handleClose (tag) {
      if (this.dialogAddVisible) {
        this.addForm.tags.splice(this.addForm.tags.indexOf(tag), 1)
      } else if (this.dialogEditVisible) {
        this.editForm.tags.splice(this.editForm.tags.indexOf(tag), 1)
      }
    },
    onRecommend (id, recommend) {
      console.debug('recommend', recommend)
      if (parseInt(recommend) === 0) {
        api.unrecommend({ id: id }, (resp) => {
          this.loading = false
        }, (resp) => {
          window.tools.alertError(resp.msg)
          this.loading = false
        })
      } else {
        api.recommend({ id: id }, (resp) => {
          this.loading = false
        }, (resp) => {
          window.tools.alertError(resp.msg)
          this.loading = false
        })
      }
    },
    OnShelves (id) {
      api.onShelves({ id: id }, (resp) => {
        this.loading = false
        this.dialogEditVisible = false
        this.refresh()
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
        this.dialogEditVisible = false
      })
    },
    OffShelves (id) {
      api.offShelves({ id: id }, (resp) => {
        this.loading = false
        this.dialogEditVisible = false
        this.refresh()
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
        this.dialogEditVisible = false
      })
    },
    onVideoSource (id) {
      this.$router.push({ path: 'source/' + id })
    },
    editorImgAdd (pos, file) {
      fileApi.upload(file, 'video_cover').then(({ data }) => {
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
        this.addForm.cover = window.tools.getImgUrl(data.path)
      } else if (this.dialogEditVisible) {
        this.editForm.cover = window.tools.getImgUrl(data.path)
      }
      console.debug('image upload success', data)
    },
    getCateName (cateId) {
      for (let index in this.category) {
        let cate = this.category[index]
        if (parseInt(cate.id) === parseInt(cateId)) {
          return cate.title
        }
      }
      return ''
    },
    submitEditForm () {
      let data = Object.assign({}, this.editForm)
      data.tags = data.tags.join(',')
      api.update(data, (resp) => {
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
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.addForm)
          data.tags = data.tags.join(',')
          api.create(data, (resp) => {
            this.loading = false
            this.dialogAddVisible = false
            window.tools.alertSuc(this.$i18n.t('Action') + this.$i18n.t('Success'))
            this.refresh()
          }, (resp) => {
            window.tools.alertError(resp.msg)
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    onAdd () {
      this.addForm = {
        tags: [],
        title: '',
        description: '',
        cover: '',
        cate_id: 1,
        year: 0,
        directors: '',
        actors: '',
        area: '',
        language: '',
        is_end: 0
      }
      this.dialogAddVisible = true
    },
    onEdit (row) {
      console.log('row', row)
      this.editForm.is_end = row.is_end
      this.editForm.directors = row.directors
      this.editForm.actors = row.actors
      this.editForm.area = row.area
      this.editForm.language = row.language
      this.editForm.tags = row.tags.length > 0 ? row.tags.split(',') : []
      this.editForm.id = row.id
      this.editForm.title = row.title
      this.editForm.description = row.description
      this.editForm.cover = row.cover
      this.editForm.year = row.year
      this.editForm.cate_id = parseInt(row.cate_id)
      this.dialogEditVisible = true
    },
    byPagerSizeChange (val) {
      this.queryForm.page_size = val
      this.refresh()
    },
    byPagerCurrentChange (val) {
      this.queryForm.page_index = val
      this.refresh()
    },
    refresh () {
      // 刷新当前
      this.tableData = []
      this.loading = true
      api.query(this.queryForm, (resp) => {
        console.debug('resp ', resp)
        this.loading = false
        this.count = parseInt(resp.count)
        this.tableData = resp.list
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
      })
    }
  }
}
</script>
