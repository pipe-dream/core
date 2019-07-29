<template>
    <div>
        <workspace-navigation></workspace-navigation>
        <div :is="activeTabComponent"></div>
    </div>
</template>

<script>
    export default {
        computed: {
            activeTab() {
                return this.$store.state.navigation.workspace
            },

            activeTabComponent() {
                return this.activeTab.toLowerCase() + "-tab"
            },
        },

        data() {
            return {
                saveDebounce: null
            }
        },

        mounted() {
            const debounce = (func, delay) => {
                return function() {
                    const context = this
                    const args = arguments
                    clearTimeout(this.saveDebounce)
                    this.saveDebounce = setTimeout(() => func.apply(context, args), delay)
                }.bind(this)
            }

            this.$store.subscribe((mutation, state) => {
                // Assume each mutation produces a new state - no need for hash
                debounce(() => {
                    console.log("Here we will trigger a save with debouncing.");
                }, 5000)()                
            })
        }
    }
</script>