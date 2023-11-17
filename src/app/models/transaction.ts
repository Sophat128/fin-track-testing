export class Transaction{

    date!:String;
    id!:number;
    action!:String;
    amount!:number;

    constructor(date: String, id: number, action: string, amount: number) {
        this.date = date;
        this.id = id;
        this.action = action;
        this.amount = amount;
    }
}