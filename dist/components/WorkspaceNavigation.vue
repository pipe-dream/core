<template>
    <ul class="flex justify-around border-b bg-gray-100">
        <li :class="styleButtonContainer(tab)" v-for="tab in availableTabs" :key="tab">
            <a 
                :class="styleButton(tab)"
                @click="activeTab = tab; $store.dispatch('navigate', {namespace: 'workspace', tab})"
            >{{ tab }}</a>
        </li>
    </ul>
</template>

<script>
    import Vue from 'vue'
    export default {
        data: function() {
            return {
                availableTabs: ["Design", "Review", "Build"],
                activeTab: this.$store.state.navigation.workspace,
            }
        },

        methods: {
            styleButtonContainer(tab) {
                let activeStyle = "flex-1 -mb-px mr-1 shadow-l"
                let passiveStyle = "flex-1 mr-1"
                return this.activeTab == tab ? activeStyle : passiveStyle
            },

            styleButton(tab) {
                let common = "py-4 w-full text-center flex-1 inline-block font-semibold cursor-pointer border-gray-400 "
                let activeStyle = "bg-white border-l border-t border-r py-2 px-4 text-blue"
                let passiveStyle = "py-2 px-4 hover:text-blue-800 bg-gray-100 text-gray-800"

                return this.activeTab == tab ? common + activeStyle : common + passiveStyle
            },
        }
    }
</script>
