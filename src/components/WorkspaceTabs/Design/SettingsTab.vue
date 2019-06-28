<template>
    <div class="flex flex-col max-w-3xl mx-auto px-8 bg-white pt-4 text-sm">
        <div v-for="fileFactory in fileFactories"
            v-bind:key="fileFactory.name"
            class="border p-4"
        >
            <h2>{{ fileFactory.name }}</h2>
            <!-- PIPES -->
            <div class="flex flex-col ml-4 mt-4">
                <h3 class="mb-2">Pipes</h3>
                <div v-for="pipe in availablePipes" v-bind:key="pipe.name" class="flex items-center">
                    <input type="checkbox" :checked="isChecked(pipe.name)" @click="toggle(pipe.name)"> 
                    <p class="ml-2">{{pipe.name}}</p>
                </div>
            </div>

            <!-- FILE FACTORY SETTINGS -->
            <div class="flex flex-col ml-4 mt-4" v-for="setting in fileFactory.settings()" v-bind:key="setting.name">                
                    <h3 class="mb-2">{{setting.name}}</h3>
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