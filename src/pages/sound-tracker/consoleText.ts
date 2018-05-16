class consoleText {
    msg: string;
    situacao : boolean = true;
    constructor(message: string) {
        this.msg = message;
    }

    console(msgm: string){
        if(this.situacao){
            console.log(msgm);
        }
    }
    consoleDuo(msgm: string, msgm2:string){
        if(this.situacao){
            console.log(msgm + " - "+ msgm2);
        }
    }

}
