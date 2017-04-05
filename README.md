#semscaff

##What is this?
semscaff is a tool that generates the files necessary to build 
[SEMOSS](http://semoss.org/) visualizations.

##How to install
semscaff is available via npm. Simply run npm install -g semscaff on the 
command line.

##How to use
To use semscaff, create a new directory under semoss/embed/widgets. The recommended 
naming convention for this directory is all lower case letters and kebab case.
cd into this directory and on the command line and enter: semscaff.

You will be prompted to answer a few yes or no questions, and some information 
about the fields required. Upon completion all the necessary files will be generated.
Don't forget to add your SVG!

##Things semscaff doesn't do, but would like to
* Generate a jvChart file.
* update jv.js
* update widget.service.js