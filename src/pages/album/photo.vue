<style>
    .photo {
        width: 120px;
    }
    .by-album-photo .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .by-album-photo .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .by-album-photo .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .by-album-photo .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .by-album-photo .preview-img {
        width: 178px;
        height: 178px;
        display: block;
    }

</style>
<template>
    <div class="main-content by-album-photo padding-md-bottom padding-md-top">

        <div class="margin-md-bottom">
            <el-button
                    type="primary"
                    size="mini"
                    @click="$router.replace('/admin/album/index')"
            >
                <span class="el-icon-back"/>
                {{$t('Back')}}
            </el-button>
        </div>
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
                        width="40px"
                        :label="$t('ID')"
                />
                <el-table-column
                        :label="$t('Photo')">
                    <template slot-scope="scope">
                        <img :src="getImage(scope.row.photo_uri)" alt="photo" class="photo" />
                    </template>
                </el-table-column>
                <el-table-column
                        prop="album_index"
                        :label="$t('Sort')"
                />
                <el-table-column
                        fixed="right"
                        :label="$t('Action')">
                    <template slot-scope="scope">
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
        <div class="text-center">
            <el-pagination
                    :current-page="queryForm.page_index"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="queryForm.page_size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count"
                    @size-change="byPagerSizeChange"
                    @current-change="byPagerCurrentChange" />
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
                        :label="$t('Sort')"
                        prop="sort" >
                    <el-input-number v-model="editForm.album_index"  :min="0" :max="99999999" ></el-input-number>

                </el-form-item>
                <el-form-item
                        :label="$t('Photo')"
                        prop="uri" >
                    <el-radio v-model="sourceType" label="0">网络图片</el-radio>
                    <el-radio v-model="sourceType" label="1">本地上传</el-radio>
                    <el-upload
                            v-if="sourceType === '1'"
                            class="avatar-uploader"
                            name="image"
                            :data="extraData"
                            :action="avatarUploadUrl"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-input v-model="editForm.uri" v-if="sourceType === '0' " />
                    <img :src="getImage(editForm.uri)" v-if="sourceType === '0' " class="preview-img"/>
                </el-form-item>

                <el-form-item
                        label=""
                        prop="photo_id"
                        class="hidden"
                >
                    <el-input
                            v-model="editForm.photo_id"
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
                        :label="$t('Sort')"
                        prop="sort" >
                    <el-input-number v-model="addForm.album_index"  :min="0" :max="99999999" ></el-input-number>
                </el-form-item>
                <el-form-item
                        :label="$t('Photo')"
                        prop="uri" >

                    <el-radio v-model="sourceType" label="0">网络图片</el-radio>
                    <el-radio v-model="sourceType" label="1">本地上传</el-radio>
                    <el-upload
                            v-if="sourceType === '1'"
                            class="avatar-uploader"
                            name="image"
                            :data="extraData"
                            :action="avatarUploadUrl"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-input v-model="addForm.uri" v-if="sourceType === '0' " />
                    <img :src="getImage(addForm.uri)" v-if="sourceType === '0' && addForm.uri " class="preview-img"/>
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
    </div>
</template>

<script>
	import api from '../../api/albumApi'



	export default {
        props: {
            id: String,
            require: true
        },
		components: {
		},
		data() {
			return {
                sourceType: '0',
                imageUrl: '',
                extraData: {'t': 'album'},
                avatarUploadUrl: '',
				queryForm: {
                	album_id: 0,
                	page_index: 1,
                    page_size: 10
				},
				addForm: {
				},
				editForm: {
				},
				rules: {
					sort: [
                        { type: 'number', message: this.$i18n.t('MustBeNumber')}
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
		},
		watch: {
        },
		created() {
            this.avatarUploadUrl = window.tools.getAvatarUploadUrl()
            this.extraData.uid = window.tools.getUID()
            this.extraData.sid = window.tools.getSessionId()
            this.extraData.deviceType = window.tools.getDeviceType()
            this.refresh ();
		},
		mounted: function () {
		},
		methods: {
        	getImage(uri) {
        	    if (!_.startsWith(uri, 'http')) {
                  uri = window.tools.getApiUrl() + uri
                }
                return uri
            },
            handleAvatarSuccess(res, file) {
                if (parseInt(res.code) === 0) {
                    if (this.dialogAddVisible) {
                        this.addForm.uri = res.data.relative_path
                    } else if (this.dialogEditVisible) {
                        this.editForm.uri = res.data.relative_path
                    }
                    this.imageUrl = URL.createObjectURL(file.raw);
                } else {
                    this.$message.error(res.msg);
                }
            },
            beforeAvatarUpload(file) {
                const isJPGOrPng = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPGOrPng) {
                    this.$message.error(this.$i18n.t('FileTypeLimitJpgPng'));
                }
                if (!isLt2M) {
                    this.$message.error(this.$i18n.t('FileSizeLimit2MB'));
                }
                return isJPGOrPng && isLt2M;
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

                            api.removePhoto ({album_id: this.id, 'photo_id': id}, (res) => {
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
				api.updatePhoto (this.editForm, (resp) => {
					this.loading = false
					this.dialogEditVisible = false;
                    this.refresh()
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
					this.dialogEditVisible = false;
				})
			},
			submitAddForm() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						api.addPhoto (this.addForm, (resp) => {
							this.loading = false
							this.dialogAddVisible = false
							window.tools.alertSuc (this.$i18n.t('Action') + this.$i18n.t('Success'))
							this.refresh()
						}, (resp) => {
							window.tools.alertError (resp.msg)
							this.loading = false
						})
					} else {
						return false;
					}
				});
			},
			onAdd() {
				this.addForm = {
					album_index: 0,
                    album_id: this.id,
                    uri: '',
				}
				this.imageUrl = ''
				this.dialogAddVisible = true
			},
			onEdit(row) {
                this.editForm = {
                    photo_id: row.id,
                    album_index: parseInt(row.album_index),
                    album_id: this.id,
                    uri: row.photo_uri,
                }
                this.imageUrl = this.getImage(row.photo_uri)
				this.dialogEditVisible = true;
			},
            byPagerSizeChange(val) {
                this.queryForm.page_size = val
                this.refresh ()
            },
            byPagerCurrentChange(val) {
                this.queryForm.page_index = val
                this.refresh ()
            },
			refresh() {
				// 刷新当前
				this.tableData = []
				this.loading = true
                this.queryForm.album_id = this.id
				api.listPhoto (this.queryForm, (resp) => {
					console.debug ('resp ', resp)
					this.loading = false
                    this.count = parseInt(resp.count)
					this.tableData = resp.list
				}, (resp) => {
					window.tools.alertError (resp.msg)
					this.loading = false
				})
			}
		}
	}
</script>
