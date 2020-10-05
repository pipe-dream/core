// eslint-disable
Array.prototype.mapWithRemaining = function(callback) {
	const items = this.map((item, key) => {
		const remaining = [...this]
		remaining.splice(
			remaining.indexOf(item), 1
		)

		return callback(item, remaining)
	})

	return items
}

Array.prototype.first = function() {
	return this.length ? this[0] : null
}

Array.prototype.sortByPath = function() {
	const pathSorter = (first,second) => {
		const firstParts = first.split('/')
		const secondParts = second.split('/')

		for(let i=0; i<Math.min(firstParts.length, secondParts.length); i++) {
			const FIRST_PART_IS_FOLDER = firstParts.length > i + 1
			const SECOND_PART_IS_FOLDER = secondParts.length > i + 1

			// Folders always has precedence
			if(FIRST_PART_IS_FOLDER && !SECOND_PART_IS_FOLDER) return -1
			if(!FIRST_PART_IS_FOLDER && SECOND_PART_IS_FOLDER) return 1

			// Between equals (files or folders) use alfabetic
			if(firstParts[i] < secondParts[i]) return -1
			if(firstParts[i] > secondParts[i]) return 1
		}

		// Default
		return 0
	}

	return this.sort(pathSorter)
}
