export default class Stack {
    constructor(fileFactories, masterFileFactory) {
        this.fileFactories = fileFactories
        this.masterFileFactory = masterFileFactory ? masterFileFactory : fileFactories[0]
    }

}