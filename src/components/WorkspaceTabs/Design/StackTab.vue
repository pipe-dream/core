<template>
    <div class="flex flex-col max-w-lg mx-auto px-8 bg-white pt-4 text-sm mt-4">
        <p class="font-semibold text-gray-800 text-base mb-2">Primary file factory</p>
        <div class="flex flex py-1">
            <select v-model="masterFileFactory" class="flex-1 bg-white border">
                <option v-for="fileFactory in fileFactories" v-bind:key="fileFactory.title"
                    :value="fileFactory"
                >
                    {{fileFactory.title}}
                </option>
            </select>
        </div>           


        <p class="font-semibold text-gray-800 text-base mt-2 mb-2">Secondary file factories</p>
        <div v-for="secondary in secondary" v-bind:key="secondary.title" class="flex items-center py-1 mb-4">
            <input type="checkbox" :name="secondary.title" :value="true" @change="toggleSecondaryFileFactory"
                :checked="enabledFileFactories.includes(secondary.title)"
            >
            <p class="ml-2">{{secondary.title}}</p>    
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