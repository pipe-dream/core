<template>
    <div class="flex flex-col max-w-3xl mx-auto px-8 bg-white pt-4 text-sm">
        <div v-for="fileFactory in fileFactories"
            v-bind:key="fileFactory.title"
            class="border p-4"
        >
            <h2>{{ fileFactory.title }}</h2>
            <!-- FILE FACTORY PIPES -->
            <div class="flex flex-col ml-4 mt-4">
                <h3 class="mb-2">Pipes</h3>
                <div v-for="pipe in fileFactory.pipes()" v-bind:key="pipe.title" class="flex items-center">
                    <input type="checkbox" :checked="isChecked(pipe.title)" @click="toggle(pipe.title)">
                    <p class="ml-2">{{pipe.title}}</p>
                </div>
            </div>

            <!-- FILE FACTORY SETTINGS -->
            <div class="flex flex-col ml-4 mt-4" v-for="setting in fileFactory.settings()" v-bind:key="setting.title">
                    <h3 class="mb-2">{{setting.title}}</h3>
                    <input type="text" name="fname" class="border" :value="setting.default"> 
            </div>

        </div>
    </div>  
</template>

<script>
    export default {
        data() {
            return {
                fileFactories: this.$store.state.fileFactories,
                availablePipes: this.$store.state.availablePipes
            }
        },

        methods: {
            isChecked(name) {
                return this.$store.state.selectedPipes.includes(name)
            },

            toggle(name) {
                this.$store.dispatch('toggleSelectedPipe', name)
            }
        },

        mounted() {
            //
        }
    }
</script>
