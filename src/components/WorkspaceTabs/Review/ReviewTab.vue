<template>
    <div class="flex flex-col mx-auto max-w-6xl px-8 bg-white pt-4 items-center">
        <HintBox v-if="reviewFiles.length"
                 message="Here you can do any finishing touches or ignore files. Be aware - further changes in the Design tab will overwrite your edits.">
        </HintBox>
        <div class="flex w-full">
            <div class="flex flex-1 mx-auto text-sm" v-if="reviewFiles.length">
                <div class="block w-2/5 bg-white text-xs">
                    <div v-for="(group,i) in groupedFiles" class="w-full border-t border-l border-r">
                        <div class="px-1 py-2 flex bg-gray-200 bg-white hover:bg-gray-400 disable-select"
                             style="cursor: pointer;"
                             @click="group.open = !group.open"><i v-if="group.open">-</i><i
                            v-else>+</i>&nbsp;<b>{{i}}</b></div>
                        <div v-for="(pipe, k) in group.pipes" v-if="group.open">
                            <div
                                class="px-2 py-2 flex bg-gray-200 bg-white hover:bg-gray-400 disable-select border-l-4 border-gray-400"
                                style="cursor: pointer;"
                                @click="pipe.open = !pipe.open"><i v-if="pipe.open">-</i><i
                                v-else>+</i>&nbsp;<b>{{k}}</b></div>
                            <div v-for="file in pipe.files" v-if="pipe.open"
                                 :key="file.path"
                                 :class="listingStyleFor(file)" class=" hover:bg-gray-400"
                                 @click="tab = file.path; $store.dispatch('navigate', {namespace: 'review', tab})"
                            >
                                <input type="checkbox" :checked="isChecked(file.path)" @click="toggle(file.path)"
                                       class="mr-2">
                                {{ file.path }}
                            </div>
                        </div>
                    </div>
                    <div class="w-full border-t border-l border-r" v-if="dependencies.total > 0">
                        <div class="px-1 py-2 flex bg-gray-200 bg-white hover:bg-gray-400 disable-select"
                             style="cursor: pointer;"
                             @click="dependencies.open = !dependencies.open"><i v-if="dependencies.open">-</i><i
                            v-else>+</i>&nbsp;<b>Dependencies</b></div>
                        <div v-for="(values,system) in dependencies.systems" v-if="dependencies.open">
                            <div
                                class="px-2 py-2 flex bg-gray-200 bg-white hover:bg-gray-400 disable-select border-l-4 border-gray-400"
                                style="cursor: pointer;"
                                v-if="values.dependencies"
                                @click="values.open = !values.open">
                                <i v-if="values.open">-</i><i v-else>+</i>&nbsp;<b>{{system}}</b>
                            </div>
                            <div v-for="(dependency,name) in values.dependencies" v-if="values.open"
                                 class="px-3 py-2 block hover:bg-gray-200 disable-select border-l-8 border-gray-400">
                                <div class="block"><b>{{ name }}</b></div>
                                <div class="px-3 py-2 block w-full hover:bg-gray-200 disable-select border-l-8 border-gray-400">
                                    <b>Needed by</b><br/>
                                    {{ Array.from(dependency.neededBy).join() }}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="flex w-3/5 bg-white ml-2 border p-2">
                    <code-editor
                        class="w-full bg-white rounded text-sm"
                        v-model="activeFileContent"
                        lang="php"
                    ></code-editor>
                </div>
            </div>
            <HintBox class="flex max-w-sm mx-auto mt-16" v-else message="No files yet!">
            </HintBox>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            let files = this.$store.state.reviewFiles
            let factories = Array.from(new Set(files.map(f => f.factory)))
            let grouped = {}

            files.forEach(file => {
                if (!grouped[file.factory])
                    grouped[file.factory] = {open: false, pipes: {}}
                if (!grouped[file.factory].pipes[file.pipe])
                    grouped[file.factory].pipes[file.pipe] = {open: false, files: []}
                grouped[file.factory].pipes[file.pipe].files.push(file)
            })
            this.groupedFiles = grouped

            let test = {dependency: "test", neededBy: "me", version: 1}
            let t = {...this.$store.getters.dependencies}
            let systems = {}
            let total = 0
            for (let system of Object.keys(t)) {
                systems[system] = {open: false, dependencies: {...t[system]}}
                total+= Object.keys(systems[system].dependencies).length
            }
            t.systems = systems
            t.total = total
            t.open = false
            console.log(t)
            this.dependencies = t
        },
        data() {
            return {
                groupedFiles: {},
                dependencies: {}
            }
        },
        computed: {
            reviewFiles() {
                return this.$store.state.reviewFiles.sort((first, second) => {
                    let firstParts = first.path.split("/")
                    let secondParts = second.path.split("/")

                    for (let i = 0; i < Math.min(firstParts.length, secondParts.length); i++) {
                        let FIRST_PART_IS_FOLDER = firstParts.length > i + 1
                        let SECOND_PART_IS_FOLDER = secondParts.length > i + 1

                        // Folders always has precedence
                        if (FIRST_PART_IS_FOLDER && !SECOND_PART_IS_FOLDER) return -1;
                        if (!FIRST_PART_IS_FOLDER && SECOND_PART_IS_FOLDER) return 1;

                        // Between equals (files or folders) use alphabetic
                        if (firstParts[i] < secondParts[i]) return -1;
                        if (firstParts[i] > secondParts[i]) return 1;
                    }

                    return 0
                })
            },
            activeFileContent: {
                get() {
                    let activeFile = this.reviewFiles.find(
                        file => this.isActiveFile(file)
                    )

                    if (!activeFile) {
                        activeFile = this.reviewFiles[0]
                        this.$store.dispatch('navigate', {
                            namespace: 'review',
                            tab: activeFile.path
                        })
                    }

                    return activeFile ? activeFile.content : ""
                },

                set(content) {
                    if (!this.activeFile()) return;
                    this.$store.dispatch('setReviewFile', {
                        path: this.activeFile().path,
                        content: content,
                        pipe: this.activeFile().pipe,
                        factory: this.activeFile().factory
                    })
                }
            }
        },

        methods: {
            activeFile() {
                return this.reviewFiles.find(
                    file => this.isActiveFile(file)
                )
            },

            isActiveFile(file) {
                return file.path === this.$store.state.navigation.review
            },

            listingStyleFor(file) {
                let common = 'px-3 py-2 flex hover:bg-gray-200 disable-select border-l-8 border-gray-400 '
                let passive = 'bg-white'
                let active = 'bg-blue-600 text-white hover:bg-blue-400'
                return this.isActiveFile(file) ? common + active : common + passive
            },

            isChecked(path) {
                return Boolean(this.$store.state.selectedFiles[path])
            },

            toggle(path) {
                this.$store.dispatch('toggleSelectedFile', path)
            }
        },
    }
</script>
<style scoped>
    .disable-select {
        user-select: none; /* supported by Chrome and Opera */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
    }
</style>
