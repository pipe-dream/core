import fetch from "node-fetch";

export class Fileloader {

    public static async get(path: string, isJSON: boolean = false): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            fetch(path)
                .then((response: any) => {
                    if (!response.ok)
                        return reject(Error(response.statusText))
                    if (isJSON)
                        return resolve(response.json())
                    return resolve(response.text())
                })
        })
    }
}
