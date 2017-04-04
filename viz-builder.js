const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const vizName;
const isJV;
const icon;
const dependencies;
const additionalTools;
const removeDupes;
const configObj;
const modes = ["default-mode"];
const fields = [];
const color = {};
const state = {};

if (__dirname.split('/').length === 1) {
    vizName = __dirname.split('\\')[__dirname.split('\\').length - 1];
} else {
    vizName = __dirname.split('/')[__dirname.split('/').length - 1];
}

vizName = vizName.toLowerCase();

rl.question('Is this a JV Chart? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        isJV = true;
    } else {
        isJV = false;
    }

    rl.close();
});

rl.question('Icon Name: ', (answer) => {
    icon = answer.split('.svg')[0];
    
    rl.close();
});

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

rl.question('Does this visualization require libraries other than D3? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        getDependencies();
    } else {
        rl.close();
    }
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

console.log('Add fields for the visualization');

buildFieldsAndColor();

const buildState = () => {
    rl.question('Add new state data: (press s to stop) ', (answer) => {
        if (answer.toLowerCase !== 's') {
            
        } else {
            rl.close();
        }
    });
}
