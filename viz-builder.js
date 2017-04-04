const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const vizName;
const dir;
const isJV;
const icon;
const dependencies = ["../bower_components/d3_v4/d3.min.js"];
const additionalTools;
const removeDupes;
const configObj = {};
const tags = ["Visualization"];
const modes = ["default-mode"];
const fields = [];
const color = {};
const state = {};

if (__dirname.split('/').length === 1) {
    dir = __dirname.split('\\')[__dirname.split('\\').length - 1];
} else {
    dir = __dirname.split('/')[__dirname.split('/').length - 1];
}

vizName = dir.toLowerCase();

rl.question('Icon Name: ', (answer) => {
    icon = answer.split('.svg')[0];
    
    rl.close();
});

rl.question('Is this a JV Chart? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        isJV = true;
    } else {
        isJV = false;
    }

    rl.close();
});

rl.question('Does this visualization require libraries other than D3? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        getDependencies();
    } else {
        rl.close();
    }

    rl.close();
});

rl.question('Enable Edit Mode? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        modes.push('edit-mode');
    }

    rl.close();
});

rl.question('Enable Comment Mode? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        modes.push('comment-mode');
    }

    rl.close();
});

rl.question('Enable Brush Mode? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        modes.push('brush-mode');
    }

    rl.close();
});

rl.question('Does this visualization require additional tools? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        additionalTools = true;
    } else {
        additionalTools = false;
    }

    rl.close();
});

rl.question('Do you want to remove duplicated data? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        removeDupes = true;
    } else {
        removeDupes = false;
    }

    rl.close();
});

console.log('Add fields for the visualization');

buildFieldsAndColor();

console.log('Configure Visualization State');

buildState();

const buildState = () => {
    rl.question('Add new state data: (press s to stop) ', (answer) => {
        if (answer.toLowerCase !== 's') {
            const key, val;

            rl.question('Name of key: ', (answer) => {
                key = answer;
            });
            rl.question('Value for key: ', (answer) => {
                val = answer;
            });

            state[key] = val;

            buildState();
        } else {
            rl.close();
        }
    });
};

const buildFieldsAndColor = () => {
    rl.question('Add a field: (press s to stop) ', (answer) => {
        if (answer.toLowerCase !== 's') {
            const fieldObj = {};

            rl.question('Model: ', (answer) => {
                fieldObj.model = answer.toLowerCase();
                rl.close();
            });

            rl.question('Name: ', (answer) => {
                answer = answer.toLowerCase();
                answer = answer.split("");
                answer[0] = answer[0].toUpperCase();
                answer = answer.join("");
                fieldObj.name = answer;
                rl.close();
            });
            
            //start acceptable types
            fieldObj.acceptableTypes = [];
            rl.question('Does this field accept string values? (y/n) ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    fieldObj.acceptableTypes.push("STRING");
                }

                rl.close();
            });

            rl.question('Does this field accept numeric values? (y/n) ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    fieldObj.acceptableTypes.push("NUMBER");
                }

                rl.close();
            });

            rl.question('Does this field accept date values? (y/n) ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    fieldObj.acceptableTypes.push("DATE");
                }

                rl.close()
            });
            
            rl.question('Is this field optional? (y/n) ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    fieldObj.optional = true;
                } else {
                    fieldObj.optional = false;
                }
                
                rl.close();
            });

            rl.question('Is this a multi-field? (y/n) ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    fieldObj.multifield = true;
                } else {
                    fieldObj.multifield = false;
                }

                rl.close();
            });

            fields.push(fieldObj);
            rl.question('Does this field affect color? (y/n) ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    color[fieldObj.model] = {
                        multifield: fieldObj.multifield;
                    }
                    rl.question('Does color depend on instances? (y/n) ', (answer) => {
                        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                            color[fieldObj.model].instances = true;
                        } else {
                            color[fieldObj.model].instances = false;
                        }
                    });
                }

                rl.close();
            });
            
            buildFieldsAndColor();
        } else {
            rl.close();
        }
    });
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
    rl.question('Path from bower_components: (press s to stop adding dependences) ', (answer) => {
        if (answer.toLowerCase() !== 's') {
            dependencies.push(answer);
        } else {
            rl.close();
        }
        getDependencies();
    });
};

const buildConfigObj = () => {
    configObj.name = createWidgetName(vizName);
    configObj.icon = `widgets/${creatWidgetName(vizName)}/${icon}.svg`;
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
        position: "inline";
    }

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