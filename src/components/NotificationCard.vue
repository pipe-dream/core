<template>
    <div :class="style()">
        {{ message }}
    </div>
</template>

<script>
export default {
    props: ['type', 'message'],
    
    methods: {
        styles() {
            return {
                warning: "bg-yellow-dark text-white",
                info: "bg-white-light text-gray-600 border-blue",
                success: "bg-green-light text-white",
            }
        },

        style() {
            let defaultStyle = "info"
            let commonStyle = "flex p-1 items-start text-start rounded text-xs border-b"
            return [
                commonStyle,
                this.styles()[this.type ? this.type : defaultStyle]
            ].join(" ")
        }
    }
}
</script>