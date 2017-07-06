const rl         = require('readline-sync');
const Utitlities = require('./Utils.js');

class VizBuilder {
    constructor() {
        this.configObj;
        this.vizName;
        this.icon;
        this.dependencies;
        this.removeDupes;
        
        this.tags        = ['Visualization'];
        this.showOn      = 'none';
        this.hideHandles = ['tool-panel']; 
        this.contextMenu = {
            'Change Visualization Type': ['visual-panel-layouts'],
            'Change Dimensions': ['visual-panel-dimensions'],
            'Additional Tools': [],
            'Save / Share / Export': ['save', 'share', 'embed-link', 'export-csv', 'export-jpeg', 'expor-svg', 'tableau-connect']
        };
        
        this.template = {};
        this.modes    = ["default-mode"];
        this.files    = [{'files': ['node_modules/d3/build/d3.min.js']}];
        this.fields   = [];
        this.state    = {};
    }

    /**
     * @name initViz
     * @desc begins process of gathering information to create the files necessary for a visualization
     * @return {void}
     */
    initViz() {
        this.vizName = this.setVizName();
        this.icon    = this.setIcon();
        this.addAdditionalTools();
        
        this.template.name = this.setTemplateName();
        this.addDependencies(); 
    }

    setVizName() {
        let viz;
        return Utilities.getDir();
    }

    setIcon() {
        return `widgets/${Utitlities.getDir()}/`;
    }

    addAdditionalTools() {
        let addMore = true, answer;

        while (addMore) {
            answer = rl.question('Press enter to add additional tools (press S to stop): ');
            if (_breakLoop(answer, 's')) {
                addMore = false;
                continue;
            }

            this.contextMenu['Additional Tools'].push(answer);
        }
    }

    setTemplateName() {
        return rl.question('Name your template in lower kebab case: ');
    }

    addDependencies() {

    }

    _breakLoop(ans, key) {
        if (ans.trim().toLowerCase() === key) {
            return true;
        }

        return false;
    }
}