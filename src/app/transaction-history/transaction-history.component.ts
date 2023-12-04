import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { Transaction } from '../models/transaction';

import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {

  userId = localStorage.getItem("userId");
  savingAccNo =localStorage.getItem("savingAccNo")
  public savingBalance: number = 0;


  public transactionList: Array<Transaction> = [];
  public columnDefs: ColDef[] = [
    { field: "date" }, { field: "id" }, { field: "action" }, { field: "amount" }
  ];
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {

    this.transactionService.getTransactions(this.savingAccNo).subscribe((res: any) => {
      const dataList: Array<Transaction> = [];
      res.payload.map((transaction: any) => {
        if(transaction.type != "TRANSFER"){
          
          const data = new Transaction(new Date(transaction.createdAt).toLocaleString() ,transaction.id, transaction.type, transaction.amount)
          
          dataList.push(data);

        }
      })
      this.transactionList = dataList;
    });

    this.transactionService.getUserInfo(this.userId).subscribe(res => {
      this.savingBalance = res.currentBalance;
    });
  }

  

  


}