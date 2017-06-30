const rl = require('readline-sync');

class VizBuilder {
    constructor() {
        this.configObj;
        this.vizname;
        this.icon;
        this.dependencies;
        this.removeDupes;
        
        this.tags   = ['Visualization'];
        this.contextMenu = {
            'Change Visualization Type': ['visual-panel-dimensions'],
            'Additional Tools': [],
            'Save / Share / Export': ['save', 'share', 'embed-link', 'export-csv', 'export-jpeg', 'expor-svg', 'tableau-connect']
        };
        this.modes  = ["default-mode"];
        this.fields = [];
        this.state  = {};
    }


}