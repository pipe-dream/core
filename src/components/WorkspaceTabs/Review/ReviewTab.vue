<template>
    <div class="flex flex-col mx-auto max-w-6xl px-8 bg-white pt-4 items-center">
        <HintBox v-if="reviewFiles.length"
                 message="Here you can do any finishing touches or ignore files. Be aware - further changes in the Design tab will overwrite your edits.">
        </HintBox>
        <div class="flex mx-auto w-full">
            <div class="flex flex-1 mx-auto text-sm" v-if="reviewFiles.length">
                <div class="flex w-2/5 bg-white text-xs border">
                    <div v-for="(group,i) in groupedFiles" class="w-full">
                        <div class="px-1 py-2 flex bg-gray-200 bg-white hover:bg-gray-400 disable-select" style="cursor: pointer;"
                             @click="group.open = !group.open"><i v-if="group.open">-</i><i
                            v-else>+</i>&nbsp;<b>{{i}}</b></div>
                        <div v-for="(pipe, k) in group.pipes" v-if="group.open">
                            <div class="px-2 py-2 flex bg-gray-200 bg-white hover:bg-gray-400 disable-select border-l-4 border-gray-400" style="cursor: pointer;"
                                 @click="pipe.open = !pipe.open"><i v-if="pipe.open">-</i><i
                                v-else>+</i>&nbsp;<b>{{k}}</b></div>
                            <div v-for="file in pipe.files" v-if="pipe.open"
                                 :key="file.path"
                                 :class="listingStyleFor(file)"
                                 @click="tab = file.path; $store.dispatch('navigate', {namespace: 'review', tab})"
                            >
                                <input type="checkbox" :checked="isChecked(file.path)" @click="toggle(file.path)"
                                       class="mr-2">
                                {{ file.path }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-auto bg-white ml-2 border p-2">
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
            factories.forEach(factory => {
                grouped[factory] = {open: false, pipes: {}}
                files.forEach(file => {
                    if (!grouped[factory]["pipes"][file.pipe])
                        grouped[factory]["pipes"][file.pipe] = {open: false, files: []}
                    grouped[factory]["pipes"][file.pipe]["files"].push(file)
                })
            })

            this.groupedFiles = grouped
        },
        data() {
            return {
                groupedFiles: {}
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

                        // Between equals (files or folders) use alfabetic
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
                return file.path == this.$store.state.navigation.review
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
