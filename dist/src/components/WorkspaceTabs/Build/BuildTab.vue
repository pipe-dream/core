<template>
    <div class="flex flex-col max-w-lg mx-auto px-8 bg-white pt-4 h-full">        
        <div class="flex flex-col mt-8 text-center" v-if="this.results.length">
            <div v-if="!isLoading" class="mx-auto my-4 font-semibold p-4 bg-white text-blue-600 text-xs border rounded border-blue-600 shadow">
                Success! The following files were injected
            </div>            
            <div v-if="!isLoading">
                <notification-card v-for="result in results" v-bind:key="result"
                    :type="'info'"
                    :message="result"
                ></notification-card>       
            </div>
        </div>

        <button v-if="hasSomethingToBuild() && !isLoading" class="mt-4" @click="build()"
            :class="buttonStyle()"
        >{{buildLabel()}}</button>
        <hint-box v-else-if="isLoading" message="Building ..."></hint-box>
        <hint-box v-else message="No files to build yet."></hint-box>        
    </div>  
</template>

<script>

    export default {
        data() {
            return {
                message: false,
                isLoading: false
            }
        },


        methods: {
            hasSomethingToBuild() {
                return Boolean(Object.keys(this.$store.state.selectedFiles).length)
            },

            build() {

                (async () => {
                    this.isLoading = true

                    // Temporary extra save request to fix the case
                    // where user change name and starts the build withing 5 sec.
                    await this.$store.dispatch('save');

                    let response = await this.$store.dispatch('buildFiles');

                    this.isLoading = false
                    this.message = response.message
                    this.results = this.$store.state.reviewFiles.filter(file => {
                        return this.$store.state.selectedFiles[file.path]
                    }).map(file => file.path)
                })();
            },
            
            buildLabel() {
                return this.results.length ? "Clean & Rebuild!" : "Build!"
            },

            buttonStyle() {
                return 'bg-blue-600 text-white border bg-white py-4 px-8 rounded'
            }
        },

        computed: {
            results: {
                get() {
                    return this.$store.state.builtFiles.sortByPath()
                },

                set(value) {
                    this.$store.dispatch('setBuiltFiles', 
                        JSON.parse(JSON.stringify(value))
                    )
                }
            }
        },

        mounted() {
            //
        }
    }
</script>
