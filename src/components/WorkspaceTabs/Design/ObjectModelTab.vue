<template>
    <div class="flex flex-col max-w-6xl mx-auto px-8 bg-white pt-4">
        <HintBox :message="hintMessage"></HintBox>
        <div class="flex w-full">
            <div class="flex-1 mr-2">
                <div class="flex h-8 bg-blue-600 text-white border text-sm">
                    <div class="flex text-center justify-center items-center flex-grow" style="position:relative">sketch
                        <div style="position:absolute; right:0" class="mr-2">
                            <button v-if="$store.state.offsiteSegments.length" style="float:right" @click="loadOffsiteSegments">
                                Load offsite Segments
                            </button>
                        </div>
                    </div>
                </div>
                <code-editor
                    class="w-full bg-gray-100 rounded p-2 text-sm border"
                    v-model="sketch"
                    lang="json"
                    :placeholder="placeholder"
                ></code-editor>
                <div class="mt-1">
                    <button
                        v-for="button in $store.state.masterFileFactory.buttons()"
                        v-bind:key="button.name()"
                        @click="button.click()"
                        :class="buttonStyle"> {{ button.name() }}
                    </button>
                </div>

            </div>
            <div class="flex-1 ml-2">
                <div class="flex h-8 bg-gray-100 border text-center justify-center items-center text-sm">schema</div>
                <code-editor
                    class="w-full bg-gray-100 rounded p-2 text-sm border"
                    v-model="schema"
                    lang="json"
                    :showGutter="true"
                ></code-editor>
            </div>
        </div>
    </div>
</template>

<script>
    import {decycle} from "../../../utilities/decycle";
    import Axios from 'axios'

    export default {
        data() {
            return {
                hintMessage: "Start by listing your models in the sketch window (left). You may adjust the attribute properties in the schema window (right)",
                buttonStyle: "ml-2 text-xs border p-1 rounded shadow bg-white text-gray-900  px-2",
                // How to make a multiline placeholder?
                placeholder: "Start typing here. Click the buttons below to get some help on the syntax. ",
                loadingOffsite: false,
                recentlyLoadedOffsite: false,
                offsiteError: false
            }
        },

        computed: {
            sketch: {
                get() {
                    return this.$store.state.sketch
                },

                set(value) {
                    this.$store.dispatch('setSketch', value)
                }
            },

            schema: {
                get() {
                    return JSON.stringify(decycle(this.$store.state.schema), null, 4)
                },

                set(value) {
                    try {
                        let data = JSON.parse(value)
                        this.$store.dispatch('setSchema', data)
                    } catch (SyntaxError) {
                        // await fix by user
                    }
                }
            }

        },

        methods: {
            replaceWithSampleApp() {
                this.$store.dispatch('setSketch',
                    this.$store.state.masterFileFactory.sampleApp()
                )
            },
            async loadOffsiteSegments(){
                let segments = this.$store.state.offsiteSegments;
                let waterfall = []
                let sketch = this.$store.getters.sketch
                segments.forEach(segment =>{
                    waterfall.push(this.loadOffsiteSegment(segment))
                })
                let result = await Axios.all(waterfall)
                result.forEach(res => {
                    // Ugly as fuck, but it works
                    console.log(sketch.slice(-2))
                    let prevNewLines = (sketch.slice(-2).match(/\n/g) || []).length
                    sketch += "\n".repeat(2 - prevNewLines) + res.data
                });
                // Do some clean up before committing, diff segments etc.
                this.$store.dispatch('setSketch', sketch)
            },
            loadOffsiteSegment(url){
                let CorsProxy = "https://api.codetabs.com/v1/proxy?quest="
                return Axios.get(CorsProxy + url)
            }
        }
    }
</script>
