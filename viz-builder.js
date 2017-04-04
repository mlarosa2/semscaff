const rl = require('readline-sync');
const fs       = require('fs');
rl.setDefaultOptions({ prompt: 'SEMOSS-Viz-Scaffold> '});
let vizName = "";
let dir = "" ;
let isJV;
let icon = "";
const dependencies = ["../bower_components/d3_v4/d3.min.js"];
let additionalTools;
let answer;
let removeDupes;
const configObj = {};
const tags = ["Visualization"];
const modes = ["default-mode"];
const fields = [];
const color = {};
const state = {};
const buildState = () => {
    while (true) {
        loopAnswer = rl.question('Add new state data: (press s to stop) ');
        if (loopAnswer.trim().toLowerCase() === 's') {
            break;
        }

        let key = rl.question('Name of key: ');
        let val = rl.question('Value for key: ');

        state[key] = val;
    }
};

const buildFieldsAndColor = () => {
    while (true) {
        answer = rl.question('Add a field: (press s to stop adding fields, press enter to add a field) ');

        if (answer.trim().toLowerCase() === 's') {
            break;
        }
        let answer2;
        const fieldObj = {};

        answer2 = rl.question('Model: ');
        fieldObj.model = answer2.toLowerCase();

        answer2 = rl.question('Name: ');
        answer2 = answer2.toLowerCase();
        answer2 = answer2.split("");
        answer2[0] = answer2[0].toUpperCase();
        answer2 = answer2.join("");
        fieldObj.name = answer2;

        //start acceptable types
        fieldObj.acceptableTypes = [];
        answer2 = rl.question('Does this field accept string values? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y') {
            fieldObj.acceptableTypes.push("STRING");
        }

        answer2 = rl.question('Does this field accept numeric values? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
            fieldObj.acceptableTypes.push("NUMBER");
        }

        answer2 = rl.question('Does this field accept date values? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
            fieldObj.acceptableTypes.push("DATE");
        }
        
        answer2 = rl.question('Is this field optional? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
            fieldObj.optional = true;
        } else {
            fieldObj.optional = false;
        }

        answer2 = rl.question('Is this a multi-field? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
            fieldObj.multifield = true;
        } else {
            fieldObj.multifield = false;
        }

        fields.push(fieldObj);
        answer2 = rl.question('Does this field affect color? (y/n) ', {limit: ['y','n']});
        if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
            color[fieldObj.model] = {
                multifield: fieldObj.multifield
            };
            let answer3 = rl.question('Does color depend on instances? (y/n) ', {limit: ['y','n']});
            if (answer3.toLowerCase() === 'y' || answer3.toLowerCase() === 'yes') {
                color[fieldObj.model].instances = true;
            } else {
                color[fieldObj.model].instances = false;
            }
        }
    }
};

const createWidgetName = (vizName) => {
    const words = vizName.split("-").map( (word) => {
        word = word.split("");
        word[0] = word[0].toUpperCase();
        
        return word.join("");
    });

    return words.join(" ");
};

const getDependencies = () => {
    while (true) {
        answer = rl.question('Path from bower_components: (press s to stop adding dependencies) ');
        if (answer.toLowerCase() === 's') {
            break
        }
        dependencies.push(`../bower_components/${answer}`);
    }
};

const buildConfigObj = () => {
    configObj.name = createWidgetName(vizName);
    configObj.icon = `widgets/${vizName}/${icon}.svg`;
    if (isJV) {
        tags.push('JVChart');
    }
    configObj.widgetList = {
        tags: tags
    };
    configObj.showOn = 'none';
    configObj.content = {
        template: {}
    };
    if (isJV) {
        configObj.content.template.name = `jv-viz ${vizName}`;
    } else {
        configObj.content.template.name = vizName;
    }
    configObj.content.template.files = [
        {
            serie: true,
            files: dependencies
        }
    ];
    if (isJV) {
        configObj.content.template.files.push({
            files: ["resources/js/jvCharts/jvcharts.min.js"]
        });
        configObj.content.template.files.push({
            files: [
                "standard/chart/chart.css",
                "resources/js/jvCharts/src/jv.css"
            ]
        });
    } else {
        configObj.content.template.files.push({
            files: [
                "standard/chart/chart.css"
            ]
        })
    }
    const semossFiles = [`standard/chart/chart.directive.js`];
    if (isJV) {
        semossFiles.push(`standard/jv-viz/jv-viz.directive.js`);
    }
    semossFiles.push(`widgets/${dir}/${vizName}.directive.js`);
    if (additionalTools) {
        semossFiles.push(`widgets/${dir}/${vizName}-tools.directive.js`);
    }
    configObj.content.template.files.push({
        files: semossFiles
    });

    configObj.display = {
        position: "inline"
    };

    configObj.visualization = {};
    configObj.visualization.visibleModes = modes;
    if (additionalTools) {
        configObj.visualization.tools = `${vizName}-tools`;
    }
    configObj.visualization.removeDuplicates = removeDupes;
    configObj.visualization.fields = fields;
    configObj.visualization.color = color;

    configObj.state = state;
}

if (__dirname.split('/').length === 1) {
    dir = __dirname.split('\\')[__dirname.split('\\').length - 1];
} else {
    dir = __dirname.split('/')[__dirname.split('/').length - 1];
}

vizName = dir.toLowerCase();

icon = rl.question('Icon Name: ');
icon = icon.split('.svg')[0];


answer = rl.question('Is this a JV Chart? (y/n) ', {limit: ['y','n']});
if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    isJV = true;
} else {
    isJV = false;
}


answer = rl.question('Does this visualization require libraries other than D3? (y/n) ', {limit: ['y','n']});
if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    getDependencies();
}

answer = rl.question('Enable Edit Mode? (y/n) ', {limit: ['y','n']})
if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    modes.push('edit-mode');
}

answer = rl.question('Enable Comment Mode? (y/n) ', {limit: ['y','n']});
if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    modes.push('comment-mode');
}

answer = rl.question('Enable Brush Mode? (y/n) ', {limit: ['y','n']})
if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    modes.push('brush-mode');
}


answer = rl.question('Does this visualization require additional tools? (y/n) ', {limit: ['y','n']})
if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    additionalTools = true;
} else {
    additionalTools = false;
}

answer = rl.question('Do you want to remove duplicated data? (y/n) ', {limit: ['y','n']})
if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    removeDupes = true;
} else {
    removeDupes = false;
}

console.log('Add fields for the visualization');

buildFieldsAndColor();

console.log('Configure Visualization State');

buildState();

buildConfigObj();

fs.writeFile('config.json', JSON.stringify(configObj, null, '\t'), (err) => {
    if (err) {
        throw err;
    }
    console.log('Widget configuration has been created.');
});