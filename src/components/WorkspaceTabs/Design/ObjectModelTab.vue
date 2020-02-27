<template>
    <div class="flex flex-col max-w-6xl mx-auto px-8 bg-white pt-4">
        <HintBox :message="hintMessage"></HintBox>
        <div class="flex w-full">
            <div class="flex-1 mr-2">
                <div class="flex h-8 bg-blue-600 text-white border text-sm">
                    <div class="flex text-center justify-center items-center flex-grow" style="position:relative">
                        <div style="position:absolute; left:0" class="ml-2">
                            <button style="float:right" @click="fixSketch(null)" :class="buttonStyle"
                                    v-if="$store.state.sketch.length" v-tooltip="'Merge and sort the sketch'">
                                <i class="fas fa-code-branch"/>
                            </button>
                        </div>
                        sketch
                        <div style="position:absolute; right:0" class="mr-2">
                            <button v-if="$store.state.offsiteSegments.size" style="float:right" :class="buttonStyle"
                                    @click="loadOffsiteSegments(null)"
                                    :disabled="loadingOffsite || recentlyLoadedOffsite" v-tooltip="'Download segments'">
                                <i class="fas fa-download"/>
                            </button>
                        </div>
                        <div class="slider" v-if="loadingOffsite">
                            <div class="line"></div>
                            <div class="subline inc"></div>
                            <div class="subline dec"></div>
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
    import {SketchParser} from "../../../objectModel/SketchParser";
    import {Segment} from "../../../objectModel/Segment";
    import {Globals} from "../../../index";
    import Schema from "../../../objectModel/Schema";
    export default {
        data() {
            return {
                hintMessage: "Start by listing your models in the sketch window (left). You may adjust the attribute properties in the schema window (right)",
                buttonStyle: "ml-2 text-xs border p-1 rounded shadow bg-white text-gray-900  px-2",
                // How to make a multiline placeholder?
                placeholder: "Start typing here. Click the buttons below to get some help on the syntax. ",
                loadingOffsite: false,
                recentlyLoadedOffsite: false,
                offsiteError: false,
                alreadyLoadedOffsite: new Set(),
                overflowPrevention: 0,
            }
        },

        computed: {
            sketch: {
                get() {
                    return this.$store.state.sketch
                },

                set(value) {
                    this.debounce(async () => {
                        let result = await this.$store.dispatch('setSketch', value)
                    }, 500)()

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

        mounted(){

        },

        methods: {
            debounce(func, delay) {
                return function() {
                    const context = this
                    const args = arguments
                    clearTimeout(this.saveDebounce)
                    this.saveDebounce = setTimeout(() => func.apply(context, args), delay)
                }.bind(this)
            },
            replaceWithSampleApp() {
                this.$store.dispatch('setSketch',
                    this.$store.state.masterFileFactory.sampleApp()
                )
            },
            async loadOffsiteSegments(sketch = null) {
                this.overflowPrevention++
                if (this.overflowPrevention > 10)
                    return
                this.loadingOffsite = true
                if (!sketch) {
                    this.alreadyLoadedOffsite = new Set()
                    sketch = this.$store.state.sketch
                }

                let segments = SketchParser.getOffsiteAddresses(sketch)

                let waterfall = []
                segments.forEach(segment => {
                    let req = this.loadOffsiteSegment(segment)
                    if (req)
                        waterfall.push(req)
                })
                let result = await Axios.all(waterfall)
                let parser = new DOMParser()
                result.forEach(res => {
                    let buffer = new Buffer(res.data, 'binary')
                    let data = buffer.toString()
                    let doc = parser.parseFromString(data, 'text/html');
                    console.log(doc.getElementsByTagName('body')[0].children.length)
                    if (doc.getElementsByTagName('body')[0].children.length > 0)
                        // This segment has HTML. Likely wrong url
                        return
                    let prevNewLines = (sketch.slice(-2).match(/\n/g) || []).length
                    sketch += "\n".repeat(2 - prevNewLines) + data
                });
                // Recalculate segments
                segments = SketchParser.getOffsiteAddresses(sketch)

                if (this.alreadyLoadedOffsite.size !== new Set(segments.map(x => x.toLowerCase())).size)
                    await this.loadOffsiteSegments(sketch)
                else {
                    await this.$store.dispatch('setSketch', this.fixSketch(sketch))
                    this.loadingOffsite = false
                    this.recentlyLoadedOffsite = true
                    setTimeout(() => this.recentlyLoadedOffsite = false, 4000)
                }
            },
            loadOffsiteSegment(url) {
                if (this.alreadyLoadedOffsite.has(url.toLowerCase()))
                    return
                this.alreadyLoadedOffsite.add(url.toLowerCase())
                let CorsProxy = "https://api.codetabs.com/v1/proxy?quest="
                return Axios.get(CorsProxy + url, {responseType: "arraybuffer"})
            },
            fixSketch(sketch = null) {
                let save = false
                /**
                 * We can call sketch with a "ghost" sketch instead of using the vuex instance.
                 * Meant to be used with recursion.
                 */
                if (!sketch) {
                    sketch = this.$store.state.sketch
                    save = true
                }

                // Get all of the segments that are used for offsite loading, these will be moved to the top of the sketch
                let offsiteSegments = SketchParser.getOffsiteSegments(sketch)
                let otherSegments = SketchParser.getSchemaWithoutOffsiteSegments(sketch)

                if (otherSegments.length === 0) return sketch
                let offsites = []
                let pastebins = []

                offsiteSegments.forEach(segment => {
                    segment.offsiteAddresses.forEach(address => {
                        let pastebin = address.match(/(\/\/pastebin\.com\/(raw\/)?)?([a-zA-Z0-9]{8})\/?$/)
                        if ((pastebin || []).length)
                            pastebins.push(pastebin[3].toLowerCase())
                        else
                            offsites.push(address)
                    })
                })
                let offsiteText = ""
                if (pastebins.length)
                    offsiteText += "pastebin > " + this.uniques(pastebins).join(', ') + Globals.DOUBLE_LINE_BREAK
                if (offsites.length)
                    offsiteText += "load > " + this.uniques(offsites).join(', ') + Globals.DOUBLE_LINE_BREAK

                let text = SketchParser.mergeDiffs([...otherSegments]).map(segment => Segment.toText(segment))
                sketch = offsiteText + text.join("\n\n").replace(/\n\s*\n/g, Globals.DOUBLE_LINE_BREAK).trim()
                if (save)
                    this.$store.dispatch('setSketch', sketch || '')
                return sketch
            },
            uniques(array) {
                return Array.from(new Set(array))
            }
        }
    }
</script>

<style scoped>
    .slider {
        position: absolute;
        width: 100%;
        height: 5px;
        bottom: -5px;
        overflow-x: hidden;
        z-index: 5;
    }

    .line {
        position: absolute;
        opacity: 0.4;
        background: #4a8df8;
        width: 150%;
        height: 5px;
    }

    .subline {
        position: absolute;
        background: #4a8df8;
        height: 5px;

    }

    .inc {
        animation: increase 2s infinite;
    }

    .dec {
        animation: decrease 2s 0.5s infinite;
    }

    @keyframes increase {
        from {
            left: -5%;
            width: 5%;
        }
        to {
            left: 130%;
            width: 100%;
        }
    }

    @keyframes decrease {
        from {
            left: -80%;
            width: 80%;
        }
        to {
            left: 110%;
            width: 10%;
        }
    }

</style>
