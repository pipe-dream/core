<template>
    <div class="flex flex-col max-w-lg items-center mx-auto bg-white text-sm mt-4 p-4">
        <hint-box message="What's your your stack? Select a primary tech and add additional file factories as needed."></hint-box>
        <div class="shadow-lg flex flex-col items-center mx-auto px-8 bg-white text-sm mt-4 bg-gray-100 p-4">
            <stack-item
                color="bg-red-500"
                heading="primary file factory"
                logo="https://19yw4b240vb03ws8qm25h366-wpengine.netdna-ssl.com/wp-content/uploads/Laravel-logo.png"
            ></stack-item>
            <div class="border-b border-gray-500 p-1 mb-4 mt-1 w-full"></div>
            <stack-item
                color="bg-green-500"
                heading="secondary"
                logo="https://css-tricks.com/wp-content/uploads/2018/03/vue-circles.jpg"
            ></stack-item>
            <stack-item
                class="mt-16 border border-gray-500 border-dashed"
                color="bg-gray-200"
                textColor="gray-500"
                heading="add file factory"
            ></stack-item>        
        </div>
    </div>  
</template>

<script>
    import core from '../../../PipeDream'

    export default {
        data() {
            return {
                fileFactories: this.$store.state.fileFactories,
                core
            }
        }
    }

</script>










        <!--
        <div class="px-8 py-2 border bg-blue-500 text-white"
            
        >
            <span class="">
                You are using pipe-dream/core
            </span>
            <span class="ml-2 text-gray-700 bg-gray-200 rounded px-3 py-1 text-black text-xs">v{{core.version()}}</span>
        </div>        
        <div class="p-8 border"
            v-for="fileFactory in fileFactories" v-bind:key="fileFactory.title"
        >
            <span>
                <input type="checkbox" class="mr-2" checked>{{fileFactory.title}}
            </span>
            <span class="ml-2 text-gray-700 bg-gray-200 rounded px-3 py-1 text-black text-xs">v{{fileFactory.version()}}</span>
        </div>
        -->