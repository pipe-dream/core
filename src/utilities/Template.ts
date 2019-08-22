export class Template {

    protected text: string;

    constructor(text: string) {
        this.text = text
    }

    public static for(template: string): Template {
        return new this((<any>window).store.getters.templates[template])
    }

    public replace(replacementPairs: { [key: string]: string }): string {
        Object.keys(replacementPairs).forEach(marker => {
            if (!this.text.includes(marker)) return;
            if (marker.endsWith("_BLOCK___")) return this.blockReplace(marker, replacementPairs[marker]);
            this.inlineReplace(marker, replacementPairs[marker])
        })

        return this.text
    }

    private inlineReplace(marker: string, text: string): void {
        this.text = this.text.replace(new RegExp(marker, 'g'), text);
    }

    private blockReplace(marker: string, text: string): void {
        if (text === "") return this.removeBlock(marker);

        let matches: RegExpMatchArray = RegExp(`([ ]*)(${marker})`).exec(this.text);
        let tabsBeforeItem: number = matches[1].length / 4;
        let fullMarker: string = matches[0];

        this.text = this.text.replace(new RegExp(fullMarker, 'g'),
            this.indent(text, tabsBeforeItem))
    }

    private indent(text: string, tabs: number): string {
        return text.split('\n').map(line => {
            if (line === "") return line;
            return " ".repeat(tabs * 4) + line;
        }).join('\n')
    }

    private removeBlock(marker: string): void {
        let regex: string = `^([\\n])*[ ]*${marker}([\\n])?([\\n]+)?`;
        let matches: RegExpMatchArray = RegExp(regex, 'gm').exec(this.text);

        if (!matches) {
            // TODO: Implement
        }

        let spacingAbove: string = matches[1];
        let imidiateFollowingLineBreak: string = matches[2];
        let spacingBelow: string = matches[3]

        this.text = this.text.replace(new RegExp(regex, 'gm'), (!!spacingAbove && !!spacingBelow) ? "\n" : "")
    }
}
