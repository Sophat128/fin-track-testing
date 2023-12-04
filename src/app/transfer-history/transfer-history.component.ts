import { Component, OnInit, ViewChild } from '@angular/core';
import { TransferHistory } from '../models/transferhistory'
import { TransferhistoryService } from '../services/transfer_service/transfer-history.service';

import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transfer-history',
  templateUrl: './transfer-history.component.html',
  styleUrls: ['./transfer-history.component.css']
})
export class TransferHistoryComponent implements OnInit {

  userId = localStorage.getItem("userId");
  savingAccNo =localStorage.getItem("savingAccNo")
  public transferList: Array<TransferHistory> = [];
  public columnDefs: ColDef[] = [
    { field: "date" }, { field: "id" }, { field: "amount" }, { field: "savingAccount",  headerName:"Savings A/C No" }, { field: "receiverAccount" , headerName:"Primary A/C No"}
  ];
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };


  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {

    this.transactionService.getTransactions(this.savingAccNo).subscribe((res: any) => {
      const dataList: Array<TransferHistory> = [];
      res.payload.map((transaction: any) => {
        if(transaction.type == "TRANSFER" && transaction.statementType == "EXPENSE"){
          
          const data = new TransferHistory(transaction.id,transaction.bankAccountNumber, transaction.receivedAccountNumber,transaction.amount,new Date(transaction.createdAt).toLocaleString());
          
          dataList.push(data);

        }
      })
      this.transferList = dataList;
    });

  }

}