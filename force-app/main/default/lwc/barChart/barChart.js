import { LightningElement } from 'lwc';
import chartjs from '@salesforce/resourceUrl/chartJs';
import { loadScript } from 'lightning/platformResourceLoader';

/**
 * When using this component in an LWR site, please import the below custom implementation of 'loadScript' module
 * instead of the one from 'lightning/platformResourceLoader'
 *
 * import { loadScript } from 'c/resourceLoader';
 *
 * This workaround is implemented to get around a limitation of the Lightning Locker library in LWR sites.
 * Read more about it in the "Lightning Locker Limitations" section of the documentation
 * https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/template_limitations.htm
 * // DOWNLOAD LINK
 * https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js
 */

const generateRandomNumber = () => {
    return Math.round(Math.random() * 100);
};

export default class BarChart extends LightningElement {
    error;
    chart;
    chartjsInitialized = false;

    //Combobox
    value = 'inProgress';

    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

    config = {
        type: 'bar',
        data: {
            labels: ["2015", "2014", "2013", "2012", "2011"],
      
            datasets: [{
              label: 'Dataset 1', 
              data: [727, 589, 537, 543, 574],
              backgroundColor: "rgba(63,103,126,1)",
              hoverBackgroundColor: "rgba(50,90,100,1)"
            },{
                label: 'Dataset 2', 
              data: [238, 553, 746, 884, 903],
              backgroundColor: "rgba(163,103,126,1)",
              hoverBackgroundColor: "rgba(140,85,100,1)"
            },{
                label: 'Dataset 3',
              data: [1238, 553, 746, 884, 903],
              backgroundColor: "rgba(63,203,226,1)",
              hoverBackgroundColor: "rgba(46,185,235,1)"
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
              x: {
                stacked: true
              },
              y: {
                stacked: true
              }
            },
            responsive: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                align: 'end',
                labels: {
                    color: 'rgb(255, 99, 132)'
                }
              }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    async renderedCallback() {
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;

        try {
            await loadScript(this, chartjs);
            const canvas = document.createElement('canvas');
            canvas.style.width = '100%';   // Width set to 550 pixels
            canvas.height = 300;  // Height set to 300 pixels
            this.template.querySelector('div.chart').appendChild(canvas);
            const ctx = canvas.getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
        } catch (error) {
            //this.error = error;
        }
    }
}
