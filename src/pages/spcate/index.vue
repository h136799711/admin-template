<style>
    .blue {
        color: blue;
    }

</style>
<template>
    <div class="main-content by-banners padding-md-bottom padding-md-top">
        <div>
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item >
                    <el-input v-model="queryForm.title" size="mini"  />
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="refresh()"  size="mini" icon="el-icon-search">{{ $t('Search') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-button
                type="primary"
                size="mini"
                icon="el-icon-back"
                v-if="grandpa !== -1"
                :loading="loading"
                @click="back()">
            {{ $t('Back')}}
        </el-button>
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
        <div class="margin-md-bottom margin-md-top">
            <el-button
                type="text"
                size="mini"
                v-if="grandpa !== -1"
                @click="back()">
            {{grandpaTitle}}>>
        </el-button>
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
                        width="40px"
                        :label="$t('ID')"
                />
                <el-table-column
                        width="160px"
                        prop="title"
                        :label="$t('Title')"
                >
                    <template slot-scope="scope">
                        <router-link class="blue" :to="{path: '/admin/spcate/index/' + scope.row.id, params: {id:scope.row.id}}" >{{scope.row.title}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column
                        width="120px"
                        prop="level"
                        :label="$t('Level')"
                >
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('Leaf')">
                    <template slot-scope="scope">
                        {{$t('' + scope.row.leaf)}}

                    </template>
                </el-table-column>
                <el-table-column
                        width="100px"
                        :label="$t('Sort')">
                    <template slot-scope="scope">
                        {{scope.row.sort}}
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
                        <el-button
                                v-if="scope.row.leaf"
                                size="mini"
                                icon="by-icon by-pinpai"
                                @click="onRelateBrand(scope.row)">
                            {{$t('Relate')}}{{$t('Brand')}}
                        </el-button>
                        <el-button
                                v-if="scope.row.leaf"
                                size="mini"
                                icon="el-icon-edit-outline"
                                @click="onRelateProp(scope.row)">
                            {{$t('Relate')}}{{$t('Property')}}
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


        <el-dialog
                :show-close="false"
                :append-to-body="false"
                :title="$t('Add')"
                v-model="dialogAddVisible"
        >
            <el-form
                    ref="addForm"
                    :model="addForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >

                <el-form-item
                        :label="$t('Title')"
                        required
                        prop="title" >
                    <el-input v-model="addForm.title"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Leaf')"
                        prop="leaf"
                >
                    <el-radio v-model="addForm.leaf" :label="0">{{$t('0')}}</el-radio>
                    <el-radio v-model="addForm.leaf" :label="1">{{$t('1')}}</el-radio>
                </el-form-item>
                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number v-model="addForm.sort" :min="0" :max="100000" ></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" >
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


        <el-dialog
                :show-close="false"
                :append-to-body="false"
                :title="$t('Edit')"
                v-model="dialogEditVisible"
        >
            <el-form
                    ref="editForm"
                    :model="editForm"
                    label-position="right"
                    :rules="rules"
                    label-width="100px"
            >

                <el-form-item
                        :label="$t('Title')"
                        required
                        prop="title" >
                    <el-input v-model="editForm.title"/>
                </el-form-item>
                <el-form-item
                        :label="$t('Leaf')"
                        prop="leaf"
                >
                    <el-radio v-model="editForm.leaf" :label="0">{{$t('0')}}</el-radio>
                    <el-radio v-model="editForm.leaf" :label="1">{{$t('1')}}</el-radio>
                </el-form-item>
                <el-form-item
                        :label="$t('Sort')"
                        prop="sort"
                >
                    <el-input-number v-model="editForm.sort" :min="0" :max="100000" ></el-input-number>
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
            <div slot="footer" class="dialog-footer" >
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
    </div>
</template>

<script>
	import spCateApi from '../../api/spCateApi'




	export default {
		components: {

		},
		data() {
			return {
                grandpaTitle: '',
                inputVisible: false,
                inputValue: '',
                grandpa: 0,
				queryForm: {
					parent_id: 0,
                    title: '',
				},
				addForm: {
					title: '',
                    leaf: 0,
                    sort: 0,
				},
				editForm: {
                    title: '',
                    leaf: 0,
                    sort: 0,
				},
				rules: {
					title: [
						{required: true, message: this.$i18n.t ('Please Input Title'), trigger: 'blur'},
						{min: 1, max: 32, message: this.$i18n.t ('String Length Between', [1, 32]), trigger: 'blur'}
					]
				},
				count: 0,
				tableData: [],
				loading: false,
				dialogAddVisible: false,
				dialogEditVisible: false
			}
		},
		computed: {
          parentId () {
            return parseInt(this.$route.params.id)
          }
		},
		watch: {
            '$route' (to, from) {
				this.queryForm.parent_id = parseInt(to.params.id)
                this.refresh()
			}
        },
		created() {

		},
        mounted() {
          this.queryForm.parent_id = this.parentId
          console.debug('ParentId = ', this.$route.params.id, this.parentId)
            this.refresh()
        },
		methods: {
            onRelateBrand(row) {
              this.$router.push({ path: '/admin/spcate/relate_brand/' + row.id })
            },
            onRelateProp(row) {
              this.$router.push({ path: '/admin/spcate/relate_prop/' + row.id })
            },
			back() {
			    this.$router.replace({path: '/admin/spcate/index/' + this.grandpa})
            },
			onDelete(id) {
                this.$confirm (this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

                            spCateApi.delete ({id: id}, (res) => {
                                instance.confirmButtonLoading = false
                                this.refresh()
                                done()
                            }, (res) => {
                                console.debug (res)
                                done()
                                window.tools.alertError (res.msg)
                                instance.confirmButtonLoading = false
                            })
                        } else {
                            done()
                        }
                    }
                }).then (() => {
                }).catch (() => {
                })
            },
			submitEditForm() {
				spCateApi.update (this.editForm, (resp) => {
					this.loading = false
					this.dialogEditVisible = false
                    this.refresh()
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
					this.dialogEditVisible = false
				})
			},
			submitAddForm() {
                console.log(this.addForm)
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						spCateApi.create (this.addForm, (resp) => {
							this.loading = false
							this.dialogAddVisible = false
							window.tools.alertSuc (this.$i18n.t('Action') + this.$i18n.t('Success'))
							this.refresh()
						}, (resp) => {
                            this.loading = false
							window.tools.alertError (resp.msg)
						})
					} else {
						return false
					}
				});
			},
			onAdd() {
				this.addForm = {
					parent_id: this.queryForm.parent_id,
                    title: '',
                    leaf: 0,
                    sort: 0
				}
				this.dialogAddVisible = true
			},
			onEdit(row) {
                this.editForm = {
                    sort: row.sort,
                    id: row.id,
                    title: row.title,
                    leaf: row.leaf
                }
				this.dialogEditVisible = true;
			},
			refresh() {
				// 刷新当前
				this.tableData = []
				this.loading = true
                let that = this
              spCateApi.info({ id: this.parentId }, (resp) => {
                    that.grandpa = resp.parent_id
                    that.grandpaTitle = resp.title;
                    spCateApi.query(that.queryForm, (resp) => {
                        that.tableData = resp
                        that.loading = false
                    }, (resp) => {
                        window.tools.alertError (resp.msg)
                        that.loading = false
                    })
                }, (resp) => {
                    window.tools.alertError (resp.msg)
                    that.loading = false
                })

			}
		}
	}
</script>
