import { LightningElement, wire, track } from 'lwc';
import generateData from './generateData';
import getContacts from '@salesforce/apex/PaginationDemoController.getContacts'; // TO BE DELETED
import getContactsGL from '@salesforce/apex/PaginationDemoController.getContactsGL';
import getTotalContactsGlCount from '@salesforce/apex/PaginationDemoController.getTotalContactsGlCount';


const columns = [
    { label: 'Nom', fieldName: 'Nom__c' },
    { label: 'Prenom', fieldName: 'Prenom__c'},
    { label: 'Poste', fieldName: 'Poste__c'},
    //{ label: 'Proprietaire', fieldName: 'Owner.Name', type: 'url' }
];

export default class ContactGlEventsLists extends LightningElement {
    data = [];
    columns = columns;
    isLoading = true;
    error;
    //PAGINATOR PROPERTIES
    pageSize = 1; //10
    totalRecords = 0;
    pageNumber = 1;
    enablePagination = true;
    lastRecordId = '';
    itemsPerPageOptions = [5, 10, 20, 50, 100];
    _showPaginator;
    _recordsToDisplay;
    
    get hasRecords() {
        return this.data.length > 0;
    }

    //pagination property - check whther to show the paginator
    get showPaginator() {
        return this.enablePagination && this.hasRecords;
    }

    set showPaginator(value) {
        this._showPaginator = value;
    }

     //Get total records count
     @wire(getTotalContactsGlCount)
     wiredGetTotalContactsGlCount(result) {
         if (result.data) {
             this.totalRecords = parseInt(result.data);
             this.showPaginator = (this.totalRecords > this.pageSize);
         } else if(result.error) {
             //
         }
     }

    connectedCallback() {
        this.fetchRecordsFromServer();
    }

    fetchRecordsFromServer() {
        getContactsGL({pageSize: this.pageSize, lastRecordId: this.lastRecordId}).then(response => {
            if (response) {
                this.isLoading = false;
                //this.recordsToDisplay = response;
                this.data = [...this.data, ...response];
                let from = (this.pageNumber - 1) * this.pageSize;
                let to = this.pageSize * this.pageNumber;
                this.recordsToDisplay = this.data?.slice(from, to);
            }
        });
    }

    paginationChangeHandler(event) {
        if (event.detail) {
            if(this.pageSize != event.detail.pageSize) {
                this.data = []; // reset records array on page size change
                this.pageSize = event.detail.pageSize;
            }
            this.pageNumber = event.detail.pageNumber;
            if (this.data?.length < (this.pageSize * this.pageNumber)) { // Get more data from server
                this.lastRecordId = this.data[this.data.length - 1]?.Id;
                this.isLoading = true;
                this.fetchRecordsFromServer();
            } else { // Get and show data from data list
                let from = (this.pageNumber - 1) * this.pageSize;
                let to = this.pageSize * this.pageNumber;
                this.recordsToDisplay = this.data?.slice(from, to);
            }
        }
    }

    //Pagination property - calculate and return records to display
    get recordsToDisplay() {
        return this._recordsToDisplay;
    }

    set recordsToDisplay(value) {
        this._recordsToDisplay = value;
    }
}
