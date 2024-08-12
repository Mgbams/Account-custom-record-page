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
                console.log('RESPONSE ' +  JSON.stringify(response));
                console.log('this.recordsToDisplay 44 ' +  JSON.stringify(this.recordsToDisplay));
                this.data = [...this.data, ...response];
                let from = (this.pageNumber - 1) * this.pageSize;
                let to = this.pageSize * this.pageNumber;
                this.recordsToDisplay = this.data?.slice(from, to);
                console.log('data ' +  this.data);
            }
        });
    }

    paginationChangeHandler(event) {
        console.log('GOT HERE');
        console.log('event.detail ' + JSON.stringify(event.detail));
        console.log('event.detail.pageSize ' + event.detail.pageSize);
        if (event.detail) {
            if(this.pageSize != event.detail.pageSize) {
                this.data = []; // reset records array on page size change
                this.pageSize = event.detail.pageSize;
                console.log('pageSize is set here ');
            }
            this.pageNumber = event.detail.pageNumber;
            console.log('pageSize 85 ' + this.pageSize);
            console.log('pageNumber 86 ' + this.pageNumber);
            console.log('data 87 ' + JSON.stringify(this.data));
            //console.log('data 88 ' + JSON.stringify(this.data?.slice(0, this.pageSize)));
            if (this.data?.length < (this.pageSize * this.pageNumber)) { // Get more data from server
                console.log('ENTERED 90 ');
                this.lastRecordId = this.data[this.data.length - 1]?.Id;
                console.log('data 92 ' + this.lastRecordId );
                this.isLoading = true;
                this.fetchRecordsFromServer();
            } else { // Get and show data from data list
                console.log('ERROR 96 ');
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

    /*@wire(getContactsGL, { pageSize: '$pageSize',  offset: 2 })
    wiredContacts({ data, error }) {
        this.isLoading = true;
        if (data) {
            this.data = data;
            this.totalRecords = data.length;
            this.isLoading = false;
            this.error = undefined;
        }

        if (error) {
            this.data = undefined;
            this.isLoading = false;
            // create a toast message below
        }
    }*/
    
}
