<style>
</style>
<template>
    <div class="main-content by-album padding-md-bottom padding-md-top">
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
                        width="80px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="160px"
                        prop="come_from"
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
                        :label="$t('Sort')"/>
                <el-table-column
                        prop="v_uri"
                        :label="$t('VideoUri')"
                />
                <el-table-column
                        width="240px"
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-view"
                                @click="onView(scope.row)">
                            {{$t('View')}}
                        </el-button>
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="onEdit(scope.row)">
                            {{$t('Edit')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Edit')"
                :visible.sync="dialogEditVisible"
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
                        :label="$t('ComeFrom')"
                        prop="come_from">
                    <el-input v-model="editForm.come_from"/>
                </el-form-item>

                <el-form-item
                        :label="$t('VideoType')"
                        prop="v_type"
                >
                    <el-select size="mini" v-model="editForm.v_type">
                        <el-option
                                v-for="item in category"
                                :key="item.vtype"
                                :label="item.title"
                                :value="item.vtype">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('VideoUri')"
                        prop="v_uri"
                >

                    <el-input v-model="editForm.v_uri"/>

                    <el-alert
                            title=""
                            type="success"
                            description="1. cloud是网盘格式, 网盘地址@提取密码,举例百度网盘: https//pan.baidu.com/s/1jyhLuh75oAoF2HZ8QJwpqw@sbb4
                            ">
                    </el-alert>

                    <el-alert
                            title=""
                            type="success"
                            description="2. iframe是第三方播放, 举例优酷: http://player.youku.com/embed/XNDI0ODY3MDA0OA==
                            ">
                    </el-alert>
                </el-form-item>

                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input v-model="editForm.sort"/>
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
            <div slot="footer" class="dialog-footer">
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
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Add')"
                :visible.sync="dialogAddVisible"
        >
            <el-form
                    status-icon
                    ref="addForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >
                <el-form-item
                        :label="$t('ComeFrom')"
                        prop="come_from">
                    <el-input v-model="addForm.come_from"/>
                </el-form-item>

                <el-form-item
                        :label="$t('VideoType')"
                        prop="v_type"
                >
                    <el-select size="mini" v-model="addForm.v_type">
                        <el-option
                                v-for="item in category"
                                :key="item.vtype"
                                :label="item.title"
                                :value="item.vtype">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        :label="$t('VideoUri')"
                        prop="v_uri"
                >

                    <el-input v-model="addForm.v_uri"/>
                    <el-alert
                            title=""
                            type="success"
                            description="1. cloud是网盘格式, 网盘地址@提取密码,举例百度网盘: https//pan.baidu.com/s/1jyhLuh75oAoF2HZ8QJwpqw@sbb4
                            ">
                    </el-alert>

                    <el-alert
                            title=""
                            type="success"
                            description="2. iframe是第三方播放, 举例优酷: http://player.youku.com/embed/XNDI0ODY3MDA0OA==
                            ">
                    </el-alert>

                </el-form-item>

                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input v-model="addForm.sort"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
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
  import api from '../../api/videoSourceApi'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
  import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

  export default {
    components: {
      ElForm,
      ElButtonGroup,
      ElButton
    },
    props: {
      id: String,
      require: true
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
        queryForm: {
          vid: ''
        },
        addForm: {
          vid: 0,
          v_type: '',
          v_uri: '',
          come_from: '',
          sort: 0
        },
        editForm: {
          id: 0,
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
      this.refresh()
    },
    methods: {
      onView (row) {
        let vtype = encodeURIComponent(row.v_type)
        let vuri = encodeURIComponent(row.v_uri)
        this.$router.push({ path: 'view/' + vtype + '/' + vuri })
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
