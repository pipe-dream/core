export class Stack {
    public readonly fileFactories;
    public readonly masterFileFactory;

    constructor(fileFactories, masterFileFactory) {
        this.fileFactories = fileFactories
        this.masterFileFactory = masterFileFactory ? masterFileFactory : fileFactories[0]
    }
}
