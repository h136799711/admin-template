<template>
    <div class="main-content by-tree padding-md-bottom padding-md-top">
        <el-tooltip  effect="dark" :content="$t('Back')" placement="bottom">
            <el-button
                    type="primary"
                    size="mini"
                    @click="$router.replace('/admin/roles/index')"
            >
                <span class="el-icon-back"/>
            </el-button>
        </el-tooltip>
            <el-tooltip  effect="dark" :content="$t('Refresh')" placement="right">
            <el-button
                    type="primary"
                    size="mini"
                    check-strictly="true"
                    :loading="loading"
                    @click="refresh()"
            >
                <span class="by-icon by-shuaxin"/>
            </el-button>

        </el-tooltip>

        <el-button
                type="primary"
                size="mini"
                :loading="loading"
                @click="onSave()"
                icon="by-icon by-Icon-baocun"
        >
            {{ $t('Save') }} {{ $t('Checked') }}
        </el-button>
        <el-button
                type="danger"
                size="mini"
                :loading="loading"
                @click="onDelete()"
                icon="el-icon-delete"
        >
            {{ $t('Delete') }} {{ $t('Unchecked') }}
        </el-button>
        <h2 class="h2 margin-md">{{ $t('Policy') }}</h2>
        <el-tree
                highlight-current
                ref="tree"
                default-expand-all
                :check-strictly="true"
                :data="list"
                :show-checkbox="true"
                node-key="id"
                :props="defaultProps">
        </el-tree>

    </div>
</template>

<script>
	import api from '../../api/roleApi'


	export default {
        props: {
            id: String
        },
		components: {
		},
		data() {
			return {
				loading: false,
                list: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
			}
		},
		computed: {},
		watch: {},
		created() {},
        mounted: function() {
		    this.refresh();
        },
		methods: {
        	getUncheckedKeys() {
        		var uncheckedNodes = [];

                var traverse = function traverse(node) {
                    var childNodes = node.root ? node.root.childNodes : node.childNodes;

                    childNodes.forEach(function (child) {
                        if (!child.checked) {
                            uncheckedNodes.push(child.data);
                        }
                        traverse(child);
                    });
                };

                traverse(this.$refs.tree.root);

                return uncheckedNodes.map(function (data) {
                    return (data || {})['id'];
                });
            },
        	onSave() {
                api.attachPolicies ({'role_id': this.id, 'policy_ids': this.$refs.tree.getCheckedKeys().join(',')}, (res) => {
                    this.refresh()
                }, (res) => {
                    console.debug (res)
                    window.tools.alertError (res.msg)
                })
            },
            onDelete() {
                if (this.getUncheckedKeys().length === 0) {
                    window.tools.alertError (window.itboye.vue_instance.$i18n.t('SelectItems'))
        	    	return;
                }
                this.$confirm (this.$i18n.t('Action Confirm'), this.$t('Alert'), {
                    confirmButtonText: this.$i18n.t('Confirm'),
                    cancelButtonText: this.$i18n.t('Cancel'),
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true
                            instance.confirmButtonText = window.itboye.vue_instance.$i18n.t('Processing').value

                            let data = {
                            	'role_id': this.id,
                                'policy_ids': this.getUncheckedKeys().join(',')
                            }
                            api.removePolicies (data, (res) => {
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
                    console.debug ('[ajax] delete datatree')
                }).catch (() => {
                })
            },
			refresh() {
				console.debug(this.id)
				// 刷新当前
                this.loading = true
                api.policy ({'role_id': this.id}, (resp) => {
                    console.debug ('resp ', resp)
                    this.loading = false
                    if (resp.length === 2) {
                        this.list = resp[1]
                        this.$refs.tree.setCheckedKeys(resp[0]);
                    }
                }, (resp) => {
                    window.tools.alertError (resp.msg)
                    this.loading = false
                })
			}
		}
	}
</script>
