<img src="https://github.com/ozgurgunes/Sketch-Symbol-States/blob/master/assets/icon.png?raw=true" alt="Sketch Case Converter" width="192" align="right" />

Symbol States  [![Download Latest][image]][link]
=============

[image]: https://img.shields.io/github/release/ozgurgunes/Sketch-Symbol-States.svg?label=Download
[link]: https://github.com/ozgurgunes/Sketch-Symbol-States/releases/latest/download/symbol-states.sketchplugin.zip

Symbol States plugin for Sketch, saves overrides of a symbol instance as states, which could be applied on any instance of that symbol later.

The plugin does not support image overrides natively. Still you can use the plugin with images by making symbols or styles.

Installation
------------

[Download][link] the latest release, unzip and double click on the .sketchplugin file.

#### Alternatively:

Search for Symbol States in [Sketchrunner](http://sketchrunner.com/) or [Sketchpacks](https://sketchpacks.com/).

Usage
-----

### Save Symbol State

To save current state of selected symbol;

* Go to ```Plugins > Symbol States > Save State``` or hit <kbd>Cmd</kbd>+<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd>.
* Give a name to new state or choose an existing one.
* Click ```Save```. (Click ```OK``` in confirmation dialog if you want to update an existing state.)

### Set Symbol State

To apply a state to any instance of that symbol;

* Go to ```Plugins > Symbol States > Set State``` or hit <kbd>Cmd</kbd>+<kbd>Ctrl</kbd>+<kbd>O</kbd>.
* Choose a state in opening dialog window.
* Click ```Apply```.

### Delete Symbol States

To delete states of selected symbol;

* Go to ```Plugins > Symbol States > Delete States``` or hit <kbd>Cmd</kbd>+<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd>.
* Check states which you want to delete (Click ```Delete All``` if you want to delete all states).
* Click ```Delete```.

### States from Document & Library

If you're working on a document and you've imported a symbol from a library; states coming from library will be listed with an `asterisk *`. You can't update or delete states coming from library.