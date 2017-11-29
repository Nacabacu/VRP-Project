import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA) private action: any,
        public dialogRef: MatDialogRef<DeleteDialogComponent>
    ) { }

}
