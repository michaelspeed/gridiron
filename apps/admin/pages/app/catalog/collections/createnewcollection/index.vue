<template>
    <div>
      <div class="d-flex flex-column-fluid">
        <div class=" container-fluid ">
          <div class="subheader py-2 py-lg-4  subheader-transparent " id="kt_subheader">
            <div class="d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap w-100">
              <!--begin::Details-->
              <div class="d-flex align-items-center flex-wrap mr-2">

                <!--begin::Title-->
                <h5 class="text-dark font-weight-bold mt-2 mb-2 mr-5">Create New Root Collection</h5>
                <!--end::Title-->

                <!--begin::Separator-->
                <div class="subheader-separator subheader-separator-ver mt-2 mb-2 mr-5 bg-gray-200"></div>
                <!--end::Separator-->

              </div>
              <!--end::Details-->

              <!--begin::Toolbar-->
              <div class="d-flex align-items-center">
                <!--begin::Button-->
                <a href="#" class="">

                </a>
                <!--end::Button-->

              </div>
              <!--end::Toolbar-->
            </div>
          </div>

          <v-sheet elevation="4">
            <div class="card-body">
              <div class="form-group">
                <label>Enter Collection Name</label>
                <a-input v-model="name"></a-input>
                <small class="form-text text-muted">{{$t('store.storenameinfo')}}</small>
              </div>
              <div class="form-group">
                <div class="d-flex justify-content-between">
                  <label>Include In Menu</label>
                  <a-switch
                    v-model="inMenu"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </a-switch>
                </div>
                <small class="form-text text-muted">{{$t('store.storenameinfo')}}</small>
              </div>
              <div class="form-group">
                <label>Enter Collection Title Description</label>
                <a-input type="textarea" v-model="desc"></a-input>
                <small class="form-text text-muted">{{$t('store.storenameinfo')}}</small>
              </div>
              <div style="margin-bottom: 10px">
                <h6 class="text-secondary">SEO</h6>
              </div>
              <hr style="margin-bottom: 10px"/>
              <div class="form-group">
                <label>Enter Meta URL</label>
                <a-input v-model="metaUrl" :disabled="true"></a-input>
                <small class="form-text text-muted">{{$t('store.storenameinfo')}}</small>
              </div>
              <div class="form-group">
                <label>Enter Meta Title</label>
                <a-input v-model="metaTitle"></a-input>
                <small class="form-text text-muted">{{$t('store.storenameinfo')}}</small>
              </div>
              <div class="form-group">
                <label>Enter Meta Keywords</label>
                <vue-tags-input
                  v-model="metaKey" @tags-changed="newTags => metaKeywords = newTags"
                  :tags="metaKeywords" placeholder="Enter keywords"
                />
                <!--<Select filterable multiple allow-create @on-create="handleCreateKeyword" placeholder="Enter Meta Keywords">
                    <Option v-for="(item, index) in existing" :value="index" :key="index">{{ item }}</Option>
                </Select>-->
                <small class="form-text text-muted">{{$t('store.storenameinfo')}}</small>
              </div>
              <div class="form-group">
                <label>Enter Meta Description</label>
                <a-input type="textarea" v-model="metaDesc"></a-input>
                <small class="form-text text-muted">{{$t('store.storenameinfo')}}</small>
              </div>
              <div>
                <button type="button" class="btn btn-light-primary" :class="{'spinner spinner-darker-primary spinner-left mr-3': loading}" @click="onCreatCollection">Create Collection</button>
                <button type="button" class="btn btn-light-danger" @click="onGoBack">Cancel</button>
              </div>
            </div>
          </v-sheet>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {
        Collection,
        CreateOneCollectionDocument,
        CreateOneCollectionMutationVariables, CreateOneSeoDocument,
        CreateOneSeoMutationVariables,
        Seo, SetSeoOnCollectionDocument, SetSeoOnCollectionMutationVariables
    } from '../../../../../gql';
    import {SlugLoader} from '../../../../../utils/slugLoader';

    @Component({
        layout: 'console'
    })
    export default class CreateNewCollection extends Vue {
      private loading = false
        // new root
        private name: string = ''
        private desc: string = ''
        private inMenu: boolean = true
        private isPrivate: boolean = true
        private metaUrl: string = ''
        private metaTitle: string = ''
        private metaDesc: string = ''
        private metaKeywords: any[] = []
        private existing: string[] = []
        private isRoot: boolean = true
        private metaKey: any = ''

        handleCreateKeyword(val){
            this.existing.push(val)
            this.metaKeywords.push(val)
        }

        @Watch('name')
        onChangeName() {
            this.metaUrl = SlugLoader(this.name)
        }

        onGoBack() {
            this.$router.back()
        }

        onCreatCollection() {
          this.loading = true
            const load = this.$message
                .loading('Creating Collection..')
            this.$apollo.mutate<{createOneCollection: Collection}, CreateOneCollectionMutationVariables>({
                mutation: CreateOneCollectionDocument,
                variables: {
                    isRoot: this.isRoot,
                    name: this.name,
                    desc: this.desc
                }
            }).then(value => {
                this.$apollo.mutate<{createOneSeo: Seo}, CreateOneSeoMutationVariables>({
                    mutation: CreateOneSeoDocument,
                    variables: {
                        urlKey: this.metaUrl,
                        metatitle: this.metaTitle,
                        metakeywords: this.metaKeywords.map(item => item.text),
                        metadesc: this.metaDesc
                    }
                }).then(value1 => {
                    this.$apollo.mutate<{setSeoOnCollection: Collection}, SetSeoOnCollectionMutationVariables>({
                        mutation: SetSeoOnCollectionDocument,
                        variables: {
                            id: value.data!.createOneCollection!.id,
                            relationId: value1.data!.createOneSeo!.id
                        }
                    }).then(value2 => {
                      this.loading = false
                        load()
                        this.$router.back()
                    }).catch(error => {
                      load()
                      this.loading = false
                      this.$Message.error(error.message)
                    })
                }).catch(error => {
                  load()
                  this.loading = false
                  this.$Message.error(error.message)
                })
            })
        }

    }
</script>
