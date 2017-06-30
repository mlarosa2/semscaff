const rl            = require('readline-sync');
const VizBuilder    = require('./VizBuilder.js');
const WidgetBuilder = require('./DefaultWidgetBuilder.js');

class Main {
    constructor(clArg) {
        this.clArg = clArg;
    }

    initialize() {
        const acceptableVizArgs = ['viz', 'visual', 'visualization', 'visualize', 'vis'];
        const acceptableDWArgs  = ['default', 'widget', 'dw', 'default-widget'];
        if (!!this.clArg) {
            if (acceptableVizArgs.include(this.clArg)) {
                initViz();
            } else if (acceptableDWArgs.include(this.clArg)) {
                initWidget();
            } else {
                console.log(`Sorry, ${this.clArg} is not an understood command. Enter visualization to create a visualization, default to create a default-widget, or quit to exit the program.`);
                this.vizWidgetOrQuit();
            }
        } else {
            console.log('Enter visualization to create a visualization, default to create a default-widget, or quit to exit the program.');
            this.vizWidgetOrQuit();
        }
    }

    vizWidgetOrQuit() {
        rl.promptCLLoop({
            visualization: function () {
                initViz();
            },
            default: function () {
                initWidget();
            },
            quit: function () {
                return true;
            }
        });
    }

    initViz() {
        const viz = new VizBuilder();
        viz.initialize();
    }

    initWidget() {
        const widget = new WidgetBuilder();
        widget.initialize();
    }
}