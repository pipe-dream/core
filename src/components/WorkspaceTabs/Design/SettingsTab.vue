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
            <div class="flex flex-col ml-4 mt-4 w-full"
                 v-for="(setting, settingName) in $store.state.settings[fileFactory.title]"
                 v-bind:key="fileFactory.title + '_' +settingName">
                <div class="h-full mt-8 mx-auto w-full">
                    <morphing-input :fileFactoryTitle="fileFactory.title" :name="setting.name" :value="setting.value"
                                    :datatype="setting.dataType"
                                    :callback="setSetting" :classes="classes" :label="setting.name"
                                    :help="setting.help"/>
                </div>
            </div>

        </div>
    </div>
</template>

<script>

    import {flattenKeys} from '../../../utilities/JSONLeaves'
    import MorphingInput from "./MorphingInput";

    export default {
        data() {
            return {
                fileFactories: this.$store.getters.deployedFileFactories,
                settings: this.$store.state.settings,
                classes: {
                    text: "pipedream-input",
                    label: "pb-2 font-semibold text-gray-800 text-base"
                }
            }
        },

        methods: {
            isChecked(name) {
                return this.$store.state.selectedPipes.includes(name)
            },

            toggle(name) {
                this.$store.dispatch('toggleSelectedPipe', name)
            },

            setSetting(name, value, factory) {
                let settingName = name
                let fileFactoryTitle = factory

                this.$store.dispatch('setSetting', {
                    fileFactoryTitle,
                    settingName,
                    value
                })
                let ns = window.store.getters.settings[fileFactoryTitle][settingName]

                if (ns.onChange)
                    ns.onChange(value)
            }
        },

        mounted() {
            console.log(this.$store.state.settings)
        }
    }
</script>
