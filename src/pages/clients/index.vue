<style>
    .edit-form {
    }
    .edit-form .el-input {
        width: 320px;
    }
</style>
<template>
    <div class="main-content by-clients padding-md-bottom padding-md-top">

        <el-button
                type="primary"
                size="mini"
                icon="by-icon by-shuaxin"
                :loading="loading"
                @click="refresh()">
            {{ $t('Refresh')}}
        </el-button>
        <el-button
                type="primary"
                size="mini"
                check-strictly="true"
                :loading="loading"
                @click="onAdd()"
        >
            <span class="el-icon-plus"/>
            {{$t('Add')}}
        </el-button>

        <div class="grid-content margin-md-top">
            <el-table
                    ref="table"
                    v-loading="loading"
                    :data="list"
                    stripe
                    sortable="custom"
                    :element-loading-text="$t('Loading')"
                    style="width: 100%"
            >
                <el-table-column
                        prop="id"
                        width="60px"
                        :label="$t('ID')"
                />
                <el-table-column
                        prop="project_id"
                        width="100px"
                        :label="$t('Project') + $t('ID')"
                />
                <el-table-column
                        prop="client_name"
                        width="120px"
                        :label="$t('ClientName')"
                />
                <el-table-column
                        prop="client_id"
                        width="120px"
                        :label="$t('ClientId')"
                />
                <el-table-column
                        prop="client_secret"
                        width="300px"
                        :label="$t('ClientSecret')"
                >
                    <template slot-scope="scope">
                        {{scope.row.client_secret}}&nbsp;&nbsp;&nbsp;<el-button size="mini" :loading="loading"
                                                                                @click.prevent="reset(scope.row.id)"> {{
                        $t('Reset') }}
                    </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="api_alg"
                        width="100px"
                        :label="$t('ClientAlg')"
                />
                <el-table-column
                        width="160px"
                        :label="$t('CreateTime')">
                    <template slot-scope="scope">
                        {{(new Date(scope.row.create_time * 1000)).format('yyyy-MM-dd')}}
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        width="200px"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button class=""
                                   @click="onEdit(scope.row)"
                                   icon="el-icon-edit"
                                   size="mini">
                            {{ $t('Edit') }}
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
            <el-form label-position="left" label-width="160px" :model="editForm" size="mini" class="edit-form">
                <el-form-item :label="$t('ClientName')">
                    <el-input v-model="editForm.clientName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Project') + $t('ID')">
                    <el-input v-model="editForm.projectId"></el-input>
                </el-form-item>
                <el-form-item :label="$t('ClientAlg')">
                    <el-select v-model="editForm.clientAlg" >
                        <el-option
                                v-for="item in algList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('ClientDayLimit')">
                    <el-input v-model="dailyLimitDesc"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="onSave" icon="by-icon by-Icon-baocun"> {{ $t('Save') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <el-dialog
                :show-close="false"
                :modal-append-to-body="false"
                :title="$t('Add')"
                :visible.sync="dialogAddVisible"
        >
            <el-form label-position="left" label-width="160px" :model="addForm" size="mini" class="edit-form">
                <el-form-item :label="$t('ClientName')">
                    <el-input v-model="addForm.clientName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Project') + $t('ID')">
                    <el-input v-model="addForm.projectId"></el-input>
                </el-form-item>
                <el-form-item :label="$t('ClientAlg')">
                    <el-select v-model="addForm.clientAlg">
                        <el-option
                                v-for="item in algList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="onAddSave" icon="by-icon by-Icon-baocun"> {{
                        $t('Save') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>

</template>

<script>
  import api from '../../api/clientsApi'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button.vue'
  import ElButtonGroup from '../../../node_modules/element-ui/packages/button/src/button-group.vue'
  import ElForm from '../../../node_modules/element-ui/packages/form/src/form.vue'

  export default {
		components: {
			ElForm,
			ElButtonGroup,
			ElButton
		},
		data() {
			return {
              dialogEditVisible: false,
              dialogAddVisible: false,
                algList: [
                    {id: 'nothing', label: 'None'},
                  { id: 'md5_v4', label: 'MD5 Version 4' }
                ],
              addForm: {
                clientName: '',
                apiAlg: 'nothing',
                dailyLimit: 500,
                projectId: ''
              },
				editForm: {
					clientName: '',
					apiAlg: 'nothing',
                  dailyLimit: 500,
                  projectId: ''
				},
              queryForm: {},
              list: [],
              count: 0,
				loading: false
			}
		},
		computed: {
			dailyLimitDesc: {
                get: function () {
                    if (this.editForm.dailyLimit === 0) {
                        return 'No Limit'
                    }
                    return this.editForm.dailyLimit
                },
                // setter
                set: function (newValue) {
                    if (window._.isInteger(parseInt(newValue))) {
                        this.editForm.dailyLimit = newValue;
                    }
                }
            }
		},
		watch: {},
		created() {
            this.refresh ();
		},
		mounted: function () {
		},
		methods: {
          reset (id) {
				this.loading = true
            api.reset({ 'id': id }, (resp) => {
					console.debug ('resp ', resp)
					this.loading = false
              this.refresh()
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
				})
			},
			onSave() {
				this.loading = true
				api.update ({
                  'm_client_id': this.editForm.clientId,
                  'm_project_id': this.editForm.projectId,
                  'm_alg': this.editForm.clientAlg,
					'day_limit': this.editForm.dailyLimit,
					'client_name': this.editForm.clientName
				}, (resp) => {
                  this.dialogEditVisible = false
                  this.loading = false
                  this.refresh()
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
				})
			},
          onAddSave () {
            api.create({
              'm_project_id': this.addForm.projectId,
              'm_alg': this.addForm.clientAlg,
              // 'day_limit': this.addForm.dailyLimit,
              'client_name': this.addForm.clientName
            }, (resp) => {
              this.dialogAddVisible = false
              this.loading = false
              this.refresh()
            }, (resp) => {
              window.tools.alertError(resp.msg)
              this.loading = false
            })
          },
          onAdd () {
            this.addForm = {
              clientName: '',
              clientAlg: 'nothing',
              dailyLimit: 500,
              projectId: ''
            }
            this.dialogAddVisible = true
          },
          onEdit (row) {
            console.debug(row)
            this.editForm = Object.assign({
              clientId: row.client_id,
              clientName: row.client_name,
              clientSecret: row.client_secret,
              clientAlg: row.api_alg,
              totalLimit: parseInt(row.total_limit),
              dailyLimit: parseInt(row.day_limit),
              projectId: row.project_id
            })
            this.dialogEditVisible = true
          },
          refresh () {
            // 刷新当前
            this.loading = true
            this.queryForm.uid = window.tools.getUID()
            this.queryForm.user_id = window.tools.getUID()
            api.query(this.queryForm, (resp) => {
					console.debug ('resp ', resp)
					this.loading = false
              this.list = resp
              // this.editForm.apiAlg = resp.api_alg
              // this.editForm.clientSecret = resp.client_secret
              // this.editForm.clientId = resp.client_id
              // this.editForm.clientName = resp.client_name
              // this.editForm.clientAlg = resp.api_alg
              // this.editForm.dailyLimit = resp.day_limit
              // this.editForm.projectId = resp.project_id
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
				})
			}
		}
	}
</script>
