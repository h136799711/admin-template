<template>
  <div class="main-content padding-md-bottom padding-md-top">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-back"
      @click="$router.replace('/admin/video/index')"
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
          width="80px"
          :label="$t('ID')"
        />
        <el-table-column
          width="160px"
          prop="come_from_alias"
          :label="$t('ComeFrom')"
        />
        <el-table-column
          width="120px"
          prop="v_type"
          :label="$t('VideoType')"
        />
        <el-table-column
          width="120px"
          prop="sort"
          :label="$t('Sort')"
        />
        <el-table-column
          prop="v_uri"
          :label="$t('VideoUri')"
        />
        <el-table-column
          width="320px"
          fixed="right"
          :label="$t('Action')"
        >
          <template #default="scope">
            <el-button
              size="mini"
              icon="el-icon-view"
              @click="onView(scope.row)"
            >
              {{ $t('View') }}
            </el-button>
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
      v-model="dialogEditVisible"
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
          prop="src_key"
        >
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item
          :label="$t('ComeFrom')"
          prop="come_from"
        >
          <el-select
            v-model="editForm.come_from"
            size="mini"
          >
            <el-option
              v-for="item in source"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('VideoType')"
          prop="v_type"
        >
          <el-select
            v-model="editForm.v_type"
            size="mini"
          >
            <el-option
              v-for="item in category"
              :key="item.vtype"
              :label="item.title"
              :value="item.vtype"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('VideoUri')"
          prop="v_uri"
        >
          <el-input v-model="editForm.v_uri" />
          <el-alert
            title=""
            type="success"
            description="1. cloud是网盘格式, 网盘地址@提取密码,举例百度网盘: https//pan.baidu.com/s/1jyhLuh75oAoF2HZ8QJwpqw@sbb4"
          />

          <el-alert
            title=""
            type="success"
            description="2. iframe是第三方播放, 举例优酷: http://player.youku.com/embed/XNDI0ODY3MDA0OA=="
          />
        </el-form-item>

        <el-form-item
          :label="$t('Sort')"
          prop="sort"
        >
          <el-input v-model="editForm.sort" />
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
      <template #footer>
      <div
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
      </template>
    </el-dialog>

    <!-- Add Form -->
    <el-dialog
      v-model="dialogAddVisible"
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
          prop="src_key"
        >
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item
          :label="$t('ComeFrom')"
          prop="come_from"
        >
          <!--                    <el-input v-model="addForm.come_from"/>-->
          <el-select
            v-model="addForm.come_from"
            size="mini"
          >
            <el-option
              v-for="item in source"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('VideoType')"
          prop="v_type"
        >
          <el-select
            v-model="addForm.v_type"
            size="mini"
          >
            <el-option
              v-for="item in category"
              :key="item.vtype"
              :label="item.title"
              :value="item.vtype"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('VideoUri')"
          prop="v_uri"
        >
          <el-input v-model="addForm.v_uri" />
          <el-alert
            title=""
            type="success"
            description="1. cloud是网盘格式, 网盘地址@提取密码,举例百度网盘: https//pan.baidu.com/s/1jyhLuh75oAoF2HZ8QJwpqw@sbb4
                            "
          />

          <el-alert
            title=""
            type="success"
            description="2. iframe是第三方播放, 举例优酷: http://player.youku.com/embed/XNDI0ODY3MDA0OA==
                            "
          />
        </el-form-item>

        <el-form-item
          :label="$t('Sort')"
          prop="sort"
        >
          <el-input v-model="addForm.sort" />
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
          :loading="loading"
          type="primary"
          @click="submitAddForm()"
        >
          {{ $t('Confirm') }}
        </el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api/videoSourceApi'

export default {
  components: {
  },
  props: {
    id: String,
  },
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      category: [
        { 'title': 'mp4', 'vtype': 'video/mp4' },
        { 'title': 'webm', 'vtype': 'video/webm' },
        { 'title': 'm3u8', 'vtype': 'application/x-mpegURL' },
        { 'title': 'cloud', 'vtype': 'cloud_disk' },
        { 'title': 'iframe', 'vtype': 'iframe_insert' }
      ],
      source: [],
      queryForm: {
        vid: ''
      },
      addForm: {
        directors: '',
        actors: '',
        language: '',
        area: '',
        is_end: 0,
        title: '',
        vid: 0,
        v_type: '',
        v_uri: '',
        come_from: '',
        sort: 0
      },
      editForm: {
        id: 0,
        directors: '',
        actors: '',
        language: '',
        area: '',
        is_end: 0,
        title: '',
        v_type: '',
        v_uri: '',
        come_from: '',
        sort: 0
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
  watch: {},
  created () {
  },
  mounted: function () {
    api.queryComeFrom({}, (res) => {
      this.source = res
      this.refresh()
    }, (res) => {
      console.debug(res)
    })
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

            api.delete({ 'id': id }, (res) => {
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
    onView (row) {
      let vtype = encodeURIComponent(row.v_type)
      let vuri = encodeURIComponent(row.v_uri)
      this.$router.push({ path: 'play/' + vtype + '/' + vuri })
    },
    submitEditForm () {
      api.update(this.editForm, (resp) => {
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
          api.create(this.addForm, (resp) => {
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
        directors: '',
        actors: '',
        language: '',
        area: '',
        is_end: 0,
        title: '',
        vid: this.id,
        v_type: '',
        v_uri: '',
        come_from: '',
        sort: 0
      }
      this.dialogAddVisible = true
    },
    onEdit (row) {
      this.editForm.id = row.id
      this.editForm.is_end = row.is_end
      this.editForm.directors = row.directors
      this.editForm.actors = row.actors
      this.editForm.language = row.language
      this.editForm.area = row.area
      this.editForm.title = row.title
      this.editForm.v_type = row.v_type
      this.editForm.v_uri = row.v_uri
      this.editForm.sort = row.sort
      this.editForm.come_from = row.come_from
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
      this.queryForm.vid = this.id
      api.query(this.queryForm, (resp) => {
        console.debug('resp ', resp)
        this.loading = false
        this.tableData = resp
      }, (resp) => {
        window.tools.alertError(resp.msg)
        this.loading = false
      })
    }
  }
}
</script>
