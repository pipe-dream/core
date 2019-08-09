<template>
        <div :class="'flex + ' + color +  ' w-full mb-2 p-4'">
            <div class="flex flex-col flex-1 items-start">
                <p :class="'text-lg text-' + textColor + ' font-semibold mb-2'">{{ heading }}</p>
                <select :class="'text-sm'">
                    <option>Laravel</option>
                    <option>Vue</option>
                    <option>Example</option>
                    <option>React</option>
                </select>
            </div>
            <div class="flex flex-1 overflow-hidden">
                <img :src="logo">
            </div>

        </div>
</template>

<script>
    export default {
        props: {
            textColor: {
                type: String,
                default: 'white'
            },
            color: {
                type: String,
                default: 'white'
            },
            heading: {
                type: String,
                default: 'No heading'
            },
            logo: {
                type: String,
                default: ''
            },                        
        },
    }

</script>