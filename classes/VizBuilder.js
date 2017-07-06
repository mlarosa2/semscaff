const rl         = require('readline-sync');
const Utitlities = require('./Utils.js');

class VizBuilder {
    constructor() {
        this.configObj;
        this.vizName;
        this.icon;
        this.dependencies;
        this.removeDuplicates;
        this.jv;
        this.color;
        
        //set up defaults
        this.tags        = ['Visualization'];
        this.showOn      = 'none';
        this.hideHandles = ['tool-panel']; 
        this.contextMenu = {
            'Change Visualization Type': ['visual-panel-layouts'],
            'Change Dimensions': ['visual-panel-dimensions'],
            'Additional Tools': [],
            'Save / Share / Export': ['save', 'share', 'embed-link', 'export-csv', 'export-jpeg', 'expor-svg', 'tableau-connect']
        };
        
        this.template        = {};
        this.files           = [{'serie': true, 'files': ['node_modules/d3/build/d3.min.js']}];
        this.modes           = ['default-mode'];
        this.fields          = [];
        this.state           = {};
        this.multiFieldCheck = {};
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
        
        // this.addDependencies(); commenting out until more complex behavior is needed, until then hard coding D3
        this.addChartingLibrary();
        this.completeFilesArray();
        this.setModes();

        this.removeDuplicates = this.shouldChartHaveDupes();

        this.setFields();
        
        this.color = this.setColor();

        this.setState();
    }

    /**
     * @name setVizName
     * @desc returns the current directory name, which must be properly formatted (pascal case)
     * @return {string}
     */
    setVizName() {
        return Utilities.getDir();
    }

    /**
     * @name setIcon
     * @desc builds file path to svg icon
     * @return {string}
     */
    setIcon() {
        return `widgets/${this.vizName}/${Utilities.pascalToKebab(this.vizName)}.svg`;
    }

    /**
     * @name addAdditionalTools
     * @desc builds array of widgets to display in additional tools section of context menu
     * @return {void}
     */
    addAdditionalTools() {
        let addMore = true, answer;

        while (addMore) {
            answer = rl.question('Press enter to add additional tools (press s to stop): ');
            if (_breakLoop(answer, 's')) {
                addMore = false;
                continue;
            }

            this.contextMenu['Additional Tools'].push(answer);
        }
    }

    /**
     * @name setTemplateNmae
     * @desc sets template name 
     * @return {string}
     */
    setTemplateName() {
        return Utilities.pascalToKebab(this.vizName);
    }

    /**
     * @name addDependencies
     * @desc adds additional dependencies besides D3
     * @return {void}
     */
    addDependencies() {
        let addMore = true, answer;
        
        while (addMore) {
            if (_breakLoop(answer, 's')) {
                addMore = false;
                continue
            }
            answer = rl.question('Add a dependency (path from node modules');
        }
    }

    /**
     * @name addChartingLibrary
     * @desc adds charting library of users choice
     * @return {void}
     */
    addChartingLibrary() {
        let answer;
        answer = rl.question('Add path to charting library: (type none if there is none');
        if (answer === 'none') {
            this.files.push({});
        } else {
            this.files.push({'files': answer});
        }
        if (answer.includes('jvcharts')) {
            this.jv = true;
        }
    }

    /**
     * @name completeFilesArray
     * @desc finishes adding default objects to the files array
     * @return {void}
     */
    completeFilesArray() {
        let cssFiles = ['standard/chart/chart.css'];
        if (this.jv) {
            cssFiles.push('resources/js/jvCharts/src/jv.css');
        }
        this.files.push({'files': cssFiles});
        this.files.push({'files': [`${Utilities.pascalToKebab(this.vizName)}.directive.js`]});
    }

    /**
     * @name setModes
     * @desc enables modes on viz
     * @return {void}
     */
    setModes() {
        let brush, edit, comment, select;

        brush   = rl.question('Enable brush mode? (y/n)', {limit: ['y', 'n']});
        edit    = rl.question('Enable edit mode? (y/n)', {limit: ['y', 'n']});
        comment = rl.question('Enable comment mode? (y/n)', {limit: ['y', 'n']});
        select  = rl.question('Enable select mode? (y/n)', {limit: ['y', 'n']});

        if (brush.toLowerCase() === 'y') {
            this.modes.push('brush-mode');
        }
        if (edit.toLowerCase() === 'y') {
            this.modes.push('edit-mode');
        }
        if (comment.toLowerCase() === 'y') {
            this.modes.push('comment-mode');
        }
        if (select.toLowerCase() === 'y') {
            this.modes.push('select-mode');
        }
    }

    /**
     * @name shouldChartHaveDupes
     * @desc ask user to remove duplicates or not
     * @return {boolean}
     */
    shouldChartHaveDupes() {
        let answer = rl.question('Should chart remove duplicates? (y/n)', {limit: ['y', 'n']});
        if (answer.toLowerCase() === 'y') {
            return true;
        }

        return false;
    }

    /**
     * @name setFields
     * @desc sets fields for config obj
     * @return {void}
     */
    setFields() {
        console.log('Add fields to your visualization.');
        let addMore = true;

        while (addMore) {
            const fieldObj = {
                'model': '',
                'name': '',
                'acceptableTypes': [],
                'optional': false,
                'multiField': false
            };
            let answer, str, num, date, optional, multiField;
            
            answer = rl.question('What is the name of the field? (press s to stop)');
            if (_breakLoop(answer, 's')) {
                addMore = false;
                continue;
            }

            fieldObj['model'] = answer.toLowerCase();
            answer[0]         = answer[0].toUpperCase();
            fieldObj['value'] = answer; 

            str  = rl.question('Does this field accept string values? (y/n)', {limit: ['y', 'n']});
            num  = rl.question ('Does this field accept number values? (y/n)', {limt: ['y', 'n']});
            date = rl.question('Does this field accept date values? (y/n)', {limit: ['y', 'n']});

            if (str.toLowerCase() === 'y') {
                fieldObj['acceptableTypes'].push('STRING');
            }
            if (num.toLowerCase() === 'y') {
                fieldObj['acceptableTypes'].push('NUMBER');
            }
            if (date.toLowerCase() === 'y') {
                fieldObj['acceptaleTypes'].push('DATE');
            }

            optional   = rl.question('Is this field optional? (y/n)', {limit: ['y', 'n']});
            multiField = rl.question('Does this field accept multiple columns? (y/n)', {limit: ['y', 'n']});

            if (optional.toLowerCase() === 'y') {
                fieldObj['optional'] = true;
            }
            if (multiField.toLowerCase() === 'y') {
                fieldObj['multiField'] = true;

                //lets us know if this prop is multifield
                this.multiFieldCheck[fieldObj['model']] = true;
            }

            this.field.push(fieldObj);
        }
    }

    /**
     * @name setColor
     * @desc builds color object
     * @return {object}
     */
    setColor() {
        let addMore = true;
        const colorObj = {};
        console.log('Configure color for your visualization');

        while (addMore) {
            let answer, instances;

            answer = rl.question('What is the name of the field to color on? (press s to stop)');
            
            if (_breakLoop(answer, 's')) {
                addMore = false;
                continue;
            }

            colorObj[answer.toLowerCase()] = {};

            if (this.multiFieldCheck[answer.toLowerCase()]) {
                colorObj[answer.toLowerCase()].multiField = true;
            } else {
                colorObj[answer.toLowerCase()].multiField = false;
            }

            instances = rl.question('Color on instances? (y/n)', {limit: ['y', 'n']});

            if (instances.toLowerCase() === 'y') {
                colorObj[answer.toLowerCase()].instances = true;
            } else {
                colorObj[answer.toLowerCase()].instances = false;
            }
        }

        return colorObj;
    }

    /**
     * @name setState
     * @desc builds state obj
     * @return {void}
     */
    setState() {
        console.log('Add state to your visualization.');
        let addMore = true;

        while (addMore) {
            let key, value;

            key = rl.question('Add a key to the state object. (press s to stop)');

            if (_breakLoop(key, 's')) {
                addMore = false;
                continue;
            }

            value = rl.question (`Add a value for ${key}`);
            
            this.state[key] = value;
        }
    }
 
    /**
     * @name _breakLoop
     * @param {string} ans 
     * @param {string} key 
     * @desc if the answer matches the key, return true.
     * @return {boolean}
     */
    _breakLoop(ans, key) {
        if (ans.trim().toLowerCase() === key) {
            return true;
        }

        return false;
    }
}