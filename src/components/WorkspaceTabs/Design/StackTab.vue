<template>
    <div class="flex flex-col max-w-lg mx-auto px-8 bg-white pt-4 text-sm mt-4 border border-gray-200 pb-12">
        <p class="font-semibold text-gray-800 text-base mb-2">Primary tech</p>
        <div class="flex flex-col bg-gray-100 p-4 border-l-4 border-blue-400">
            <select v-model="masterFileFactory" class="bg-white border font-semibold">
                <option v-for="fileFactory in fileFactories" v-bind:key="fileFactory.title"
                    :value="fileFactory"
                >
                    {{fileFactory.title}}
                </option>
            </select>
            <p class="text-gray-800 text-xs px-2 mt-2">
            The primary file factory determines the behavior of the Pipe Dream workbench. Typically use a back end framework as primary file factory.
            </p>            
        </div>           


        <p class="font-semibold text-gray-800 text-base mt-8 mb-2">Secondary tech</p>
        <div class="flex flex-col bg-gray-100 p-4">
            <div v-for="secondary in secondary" v-bind:key="secondary.title" class="flex items-center py-1 mb-4">
                <input type="checkbox" :name="secondary.title" :value="true" @change="toggleSecondaryFileFactory"
                    :checked="enabledFileFactories.includes(secondary.title)"
                >
                <p class="ml-2 font-semibold text-sm">{{secondary.title}}</p>    
            </div>
            <p class="text-gray-800 text-xs px-2 mt-2">
            Add additional file factories, for instance front end frameworks.
            </p>                                              
        </div>

    </div>  
</template>

<script>
    import core from '../../../PipeDream'

    export default {
        data() {
            return {
                fileFactories: this.$store.state.fileFactories,
            }
        },

        computed: {
            secondary() {
                return this.fileFactories.filter(fileFactory => {
                    return fileFactory.title != this.masterFileFactory.title
                })
            },
            masterFileFactory: {
                get() {
                    return this.$store.state.masterFileFactory
                },

                set(masterFileFactory) {
                    this.$store.dispatch('setEnabledFileFactory', masterFileFactory.title)
                    this.$store.dispatch('setMasterFileFactory', masterFileFactory)
                }
            },

            enabledFileFactories: {
                get() {
                    return this.$store.state.enabledFileFactories
                },

                set(value) {

                }
            }
        },

        methods: {
            toggleSecondaryFileFactory(event) {
                this.$store.dispatch('toggleEnabledFileFactory', event.srcElement.name)
            }
        }
    }

</script>