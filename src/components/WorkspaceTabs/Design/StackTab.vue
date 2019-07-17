<template>
    <div class="flex flex-col max-w-md mx-auto px-8 bg-white pt-4 text-sm mt-4">
        <div class="p-8 border mb-4"
            v-for="fileFactory in fileFactories" v-bind:key="fileFactory.name"
        >
            <span>
                <input type="checkbox" class="mr-2" checked>{{fileFactory.name}}
            </span>
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