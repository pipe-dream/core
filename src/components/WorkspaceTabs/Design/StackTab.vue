<template>
    <div class="flex flex-col max-w-md mx-auto px-8 bg-white pt-4 text-sm mt-4">
        <div class="p-8 border mb-4"
            v-for="fileFactory in fileFactories" v-bind:key="fileFactory.title"
        >
            <span>
                <input type="checkbox" class="mr-2" checked>{{fileFactory.title}}
            </span>
            <span class="ml-2 text-gray-700 bg-gray-200 rounded px-3 py-1 text-black text-xs">v{{fileFactory.version()}}</span>
        </div>        
    </div>  
</template>

<script>
    export default {
        data() {
            return {
                fileFactories: this.$store.state.fileFactories
            }
        }
    }

</script>