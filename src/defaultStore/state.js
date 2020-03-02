function defaultKeyValuePairs(options) {
    return {
        //Keep track of active tabs in each section
        navigation: {
            workspace: 'Design',
            design: 'object model',
            template: '',
            review: '',
        }, // DONE

        selectedFiles: {},// DONE

        sketch: '',

        reviewFiles: [],// DONE

        builtFiles: [],// DONE

        schema: [],

        offsiteSegments: new Set(),
        offsiteSegmentCache: {},

        dependencies: {
            npm: {},
            composer: {}
        },

        availablePipes: options.fileFactories.reduce((all, fileFactory) => {
            return [
                ...all,
                ...fileFactory.pipes()
            ]
        }, []),

        selectedPipes: options.fileFactories.reduce((all, fileFactory) => {
            return [
                ...all,
                ...fileFactory.pipes().map(pipe => pipe.name)
            ]
        }, []),

        settings: options.fileFactories.reduce((allFileFactories, fileFactory) => {
            return {
                ...allFileFactories,
                ...{
                    [fileFactory.title]: fileFactory.settings().reduce((allSettings, setting) => {
                        return {
                            ...allSettings,
                            [setting.name]: setting
                        }
                    }, {}),
                }
            }
        }, {}),


        fileFactories: options.fileFactories,// DONE
        enabledFileFactories: (() => {
            if (options.fileFactories[0])
                return [options.fileFactories[0].title]
            return []
        })(), //DONE
        masterFileFactory: options.fileFactories[0],
        // TODO: namepace and group the templates per factory
        templates: options.fileFactories.reduce((all, fileFactory) => {
            return {
                ...all,
                ...fileFactory.templates()
            }
        }, {}), //DONE

        originalTemplates: options.fileFactories.reduce((all, fileFactory) => {
            return {
                ...all,
                ...fileFactory.templates()
            }
        }, {}), //DONE
        reverseHistory: true,
        preferences: options.fileFactories.reduce((all, fileFactory) => {
            return {
                ...all,
                ...fileFactory.defaultPreferences()
            }
        }, {}),
        ...options
    }
}

function keyValuePairsFromSavedWorkbenchDataLocalStorage() {
    let pipedreamData = localStorage.getItem('pipedream_data')
    pipedreamData = JSON.parse(pipedreamData)
    if (pipedreamData == null) return {}
    let result = Object.keys(pipedreamData.workbench_data).filter((key) => {
        return (
            typeof pipedreamData.workbench_data !== 'undefined' &&
            typeof pipedreamData.workbench_data[key] !== 'undefined' &&
            pipedreamData.workbench_data[key] !== null
        )
    }).filter(key => {
        // exclude complex things for now
        return ![
            'availablePipes',
            'fileFactories',
            'preferences',
            'masterFileFactory',
        ].includes(key)
    }).reduce((toBeMerged, key) => {
        return {[key]: pipedreamData.workbench_data[key], ...toBeMerged}
    }, {})
    //console.log('local-storage', result)
    return result
}

function keyValuePairsFromSavedWorkbenchData(options) {
    if (options.workbench_data == null) return {}
    let result = Object.keys(options.workbench_data).filter((key) => {
        return (
            typeof options.workbench_data !== 'undefined' &&
            typeof options.workbench_data[key] !== 'undefined' &&
            options.workbench_data[key] !== null
        )
    }).filter(key => {
        // exclude complex things for now
        return ![
            'availablePipes',
            'fileFactories',
            'preferences',
            'masterFileFactory',
        ].includes(key)
    }).reduce((toBeMerged, key) => {
        return {[key]: options.workbench_data[key], ...toBeMerged}
    }, {})
    //console.log('regular', result)
    return result
}

export default function (options) {
    return {
        ...defaultKeyValuePairs(options),
        ...keyValuePairsFromSavedWorkbenchData(options),
        ...keyValuePairsFromSavedWorkbenchDataLocalStorage(options),
    }
}
