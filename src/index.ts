import './css/app.css';
require('./utilities/extendArray.js');
import Vue from 'vue';
import VTooltip from 'v-tooltip'

export const PipeDreamVueTools = {
    install: function (Vue: Vue.VueConstructor, options: {}) {
        /* Register all vue components */
        //@ts-ignore
        const files = require.context('./', true, /\.vue$/i);
        files.keys().map((key: string) => Vue.component(
            //@ts-ignore
            key.split('/').pop().split('.')[0],
            files(key).default)
        );
       Vue.use(VTooltip)
    }
}

export const Globals = {
    SINGLE_LINE_BREAK: "\n",
    get DOUBLE_LINE_BREAK() {
        return this.SINGLE_LINE_BREAK.repeat(2)
    }
}

export const PipeDream = require("./PipeDream").PipeDream;
export const defaultStore = require("./defaultStore");
export const Template = require("./utilities/Template").Template;
export const SketchButton = require("./utilities/SketchButton").SketchButton
export const BaseFileFactory = require("./fileFactories/BaseFileFactory").BaseFileFactory
export const ModelEntity = require("./objectModel/ObjectModelEntity").ObjectModelEntity
export const Formatter = require("./utilities/Formatter").Formatter;
export const Schema = require("./objectModel/Schema").Schema
