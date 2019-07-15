export abstract class Exception extends Error{
    protected constructor(msg?: string){
        if(!msg)
            msg = "An error happened"
        super(msg)
    }
}
