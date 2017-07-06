const fs = require('fs');
const Utilities = require('./Utils.js');
const Templates = require('./Templates.js');

class FileSaving {
    constructor(config) {
        this.config = config
        this.vizName = config.name;
        this.asChart = `${this.vizName.toLowerCase().split('-')[0]}Chart`;
        this.directive = Templates.directiveTemplate(this.vizName);
    }

    save() {
       fs.writeFile('config.json', JSON.stringify(this.config, null, '\t'), (err) => {
            if (err) {
                throw err;
            }
            console.log('Widget configuration has been created.');
        }); 

        fs.writeFile(`${Utilities.pascalToKebab(this.vizName)}.directive.js`, this.directive, (err) => {
            if (err) {
                throw err;
            }
            console.log(`${Utilities.pascalToKebab(this.vizName)}.directive.js has been created.`);
        });
    }
}

module.exports = FileSaving;