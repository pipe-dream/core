<template>
    <div class="flex flex-col max-w-3xl mx-auto px-8 bg-white pt-4 text-sm">
        <div v-for="fileFactory in fileFactories"
            v-bind:key="fileFactory.title"
            class="border p-4 mb-8"
        >
            <p class="mb-2 border-b pb-4 font-semibold text-gray-800 text-xl">{{ fileFactory.title }}</p>
            <!-- FILE FACTORY PIPES -->
            <div class="flex flex-col ml-4 mt-4">
                <p class="mb-2 font-semibold text-gray-800 text-base">Pipes</p>
                <div v-for="pipe in fileFactory.pipes()" v-bind:key="pipe.title" class="flex items-center">
                    <input type="checkbox" :checked="isChecked(pipe.title)" @click="toggle(pipe.title)">
                    <p class="ml-2">{{pipe.title}}</p>
                </div>
            </div>

            <!-- FILE FACTORY SETTINGS -->
            <div class="flex flex-col ml-4 mt-4" v-for="(setting, settingName) in $store.state.settings[fileFactory.title]" v-bind:key="settingName">
                <p class="mb-2 font-semibold text-gray-800 text-base">{{setting.name}}</p>
                <input type="text" class="pipedream-input"
                    :settingName="setting.name"
                    :fileFactoryTitle="fileFactory.title"
                    :value="$store.state.settings[fileFactory.title][setting.name].value"
                    @input="setSetting"
                    :placeholder="setting.name"
                >
            </div>

        </div>
    </div>  
</template>

<script>

    import {flattenKeys} from '../../../utilities/JSONLeaves'

    export default {
        data() {
            return {
                fileFactories: this.$store.getters.deployedFileFactories,
                settings: this.$store.state.settings
            }
        },

        methods: {
            isChecked(name) {
                return this.$store.state.selectedPipes.includes(name)
            },

            toggle(name) {
                this.$store.dispatch('toggleSelectedPipe', name)
            },

            setSetting(event) {

                let settingName = event.srcElement.attributes.settingName.nodeValue
                let fileFactoryTitle = event.srcElement.attributes.fileFactoryTitle.nodeValue
                let value = event.srcElement.value

                this.$store.dispatch('setSetting', {
                    fileFactoryTitle,
                    settingName,
                    value
                })
                
            },

            getSetting(path) {

            }
        },

        mounted() {
            //
        }
    }
</script>
