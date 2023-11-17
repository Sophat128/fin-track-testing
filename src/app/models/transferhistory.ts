export class TransferHistory{
    id!:number;
    savingAccount!:string;
    receiverAccount!:string;
    amount!:number;
    date!:string;

    constructor(id: number, savingAccount: string, receiverAccount: string, amount: number, date: string) {
        this.id = id;
        this.savingAccount = savingAccount;
        this.receiverAccount = receiverAccount;
        this.amount = amount;
        this.date = date;
    }
}