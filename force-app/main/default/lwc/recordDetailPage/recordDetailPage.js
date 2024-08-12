import { LightningElement } from 'lwc';

export default class RecordDetailPage extends LightningElement {
  activeSections = [];
  activeSectionsMessage = "";

  handleSectionToggle(event) {
    const openSections = event.detail.openSections;

    if (openSections.length === 0) {
      this.activeSectionsMessage = "All sections are closed";
    } else {
      this.activeSectionsMessage = "Open sections: " + openSections.join(", ");
    }
  }
}