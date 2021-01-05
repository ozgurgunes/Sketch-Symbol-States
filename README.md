<img src="https://github.com/ozgurgunes/Sketch-Symbol-States/blob/master/assets/icon.png?raw=true" alt="Sketch Symbol States" width="192" align="right" />

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

* Go to ```Plugins > Symbol States > Save State```.
* Give a name to new state or choose an existing one.
* Click ```Save```. (Click ```OK``` in confirmation dialog if you want to update an existing state.)

#### Save defaults

By default, the plugin only saves the edited override values of the symbol. If this option is checked, symbol's default override values also be saved in the state data.

### Set Symbol State

To apply a state to selected symbols;

* Go to ```Plugins > Symbol States > Set State```.
* Choose a state in opening dialog window.
* Click ```Apply```.

#### Reset overrides

By default, the plugin resets the symbol overrides before applying a state. If this option is unchecked, symbol will not be reseted and the state data will be applied on current state of the symbol.

### Delete Symbol States

To delete states of selected symbol;

* Go to ```Plugins > Symbol States > Delete States```.
* Check states which you want to delete (Click ```Delete All``` if you want to delete all states).
* Click ```Delete```.

### States from Document & Library

States can be saved in library and used on any document. States imported from library are being listed with an `asterisk (*)`. It is possible to save or delete new states on working document for imported symbols.