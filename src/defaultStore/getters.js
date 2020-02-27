export default function() {
	return {
		templates: state => state.templates,
		preferences: state => state.preferences,
		// Get only active preferences ie the entities in the schema
		strippedPreferences: state => state.schema.reduce((carry, entity) => {
			carry[entity.name] = entity
			return carry
		}, {}),
		sketch: state => state.sketch,
		masterFileFactory: state => state.masterFileFactory,
		settings: state => state.settings,

		deployedFileFactories: state => {
			return state.fileFactories.filter(fileFactory => state.enabledFileFactories.includes(fileFactory.name) )
		},

		deployedPipes: (state, getters) => {
			return getters.deployedFileFactories.map(fileFactory => {
				return fileFactory.pipes().filter(pipe => {
					return state.selectedPipes.includes(pipe.title)
				})
			}).reduce((all, pipes) => {
				return [
					...all,
					...pipes
				]
			}, [])
		},
        dependencies: state => state.dependencies
	}
}
