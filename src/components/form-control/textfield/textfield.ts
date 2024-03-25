/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AswConfirmDialog } from '@asoftwareworld/form-builder/form-control/confirm-dialog';
import { AswTextDialog, Constants } from '@asoftwareworld/form-builder/form-control/core';
import { TextFieldControl } from './textfield-control';

@Component({
    selector: 'asw-textfield',
    templateUrl: './textfield.html'
})
export class AswTextField {

    constants: any = Constants;
    /**
     * TextField control
     */
    @Input() control: TextFieldControl | null = null;

    /**
     * TextField control index to help update or delete button from drop area
     */
    @Input() controlIndex!: number;
    @Input() isPreviewTemplate = false;

    /***** JN : textFieldUpdateEvent emits an event when the TextField control is updated *****/
    @Output() textFieldUpdateEvent = new EventEmitter<{ control: TextFieldControl, index: number }>();


    @Output() textFieldDeleteEvent = new EventEmitter<number>();
    @Output() aswModelChange = new EventEmitter<TextFieldControl>();
    @Output() duplicateControl = new EventEmitter<TextFieldControl>();

    constructor(public dialog: MatDialog) {
    }

    deleteTextFieldDialog(control: TextFieldControl, controlIndex: number): void {
        const dialogRef = this.dialog.open(AswConfirmDialog, {
            width: '350px',
            data: { name: control.controlType, message: this.constants.messages.waringMessage }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.textFieldDeleteEvent.emit(controlIndex);
            }
        });
    }


    editTextFieldDialog(control: TextFieldControl, controlIndex: number): void {
        console.log("enter editTextFieldDialog : Manages the entire workflow of editing a text field control via a dialog including ")
        console.log("1- initiating the dialog ")
        const dialogRef = this.dialog.open(AswTextDialog, {
            disableClose: true,
            width: '744px',
            data: control
        });

        console.log("2- Handling the result when the dialog is closed ")
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                console.log("2.1- If the result is not undefined , Emits an event named textFieldUpdateEvent: ")
                console.log("that inform other parts of the application that the text field control has been updated")
                console.log("includes an object with properties:\n* control (containing the result data) \n* index (representing the index of the control being updated)")
                console.log("Control:", result);
                console.log("Index:", controlIndex);
                this.textFieldUpdateEvent.emit({ control: result, index: controlIndex });


            }
        });
    }

    onChange(control: TextFieldControl): void {
        console.log("enter onChange : emits an event with the control object as data using an EventEmitter named aswModelChange");
        console.log("inspect the properties and values of the control object ", control);
        this.aswModelChange.emit(control);
    }

    duplicateTextFieldControl(control: TextFieldControl): void {
        this.duplicateControl.emit(control);
    }
}
