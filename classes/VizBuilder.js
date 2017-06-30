const rl = require('readline-sync');

class VizBuilder {
    constructor() {
        this.vizname;
        this.icon;
        this.dependencies;
        this.removeDupes;
        this.configObj;
        
        this.tags   = ["Visualization"];
        this.modes  = ["default-mode"];
        this.fields = [];
        this.state  = {};
    }


}