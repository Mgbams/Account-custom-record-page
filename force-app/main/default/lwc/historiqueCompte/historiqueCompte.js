import { LightningElement } from 'lwc';
import generateData from './generateData';

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class HistoriqueCompte extends LightningElement {
    data = [];
    columns = columns;

    connectedCallback() {
        const data = generateData({ amountOfRecords: 3 });
        this.data = data;
    }
}
