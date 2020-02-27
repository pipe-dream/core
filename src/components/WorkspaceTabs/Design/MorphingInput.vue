<template>
    <div>
        <label v-if="isOfType(datatype,'boolean')" :class="classes.label">
            <input type="checkbox" v-model="actual" :class="classes.checkbox">
            {{label}}
        </label>
        <label v-else-if="isOfType(datatype,'number')" :class="classes.label">
            {{label}}
            <input type="number" v-model="actual" :class="classes.number || classes.text">
        </label>
        <label v-else-if="isOfType(datatype, 'array')" :class="classes.label">
            {{label}}
            <select v-model="actual" :class="classes.select || classes.text">
                <option :value="option" v-for="option in value">{{option}}</option>
            </select>
        </label>
        <label v-else :class="classes.label">
            {{label}}
            <input type="text" :placeholder="name" v-model="actual" :class="classes.text">
        </label>
        <blockquote class="border-l-4 border-gray-400 px-4 py-1" v-if="help" v-html="helpText"></blockquote>
    </div>
</template>

<script>
    export default {
        props: {
            datatype: {
                required: false,
                default: 'string'
            },
            value: {
                required: true,
            },
            name: {
                required: true,
                type: String
            },
            callback: {
                required: true,
                type: Function
            },
            fileFactoryTitle: String,
            classes: Object,
            label: String,
            help: String,
        },

        data() {
            return {
                actual: null
            }
        },

        mounted() {
            this.actual = this.value

        },

        methods: {
            isOfType(constructor, type) {
                if (typeof constructor === "function")
                    return constructor.name.toLowerCase() === type
                return type === constructor.toLowerCase()
            }
        },

        computed: {
            helpText(){
                return this.help.replace('\n', '<br />')
            }
        },

        watch: {
            actual: function (val) {
                this.callback(this.name, val, this.fileFactoryTitle)
            }
        }
    }
</script>


