// eslint-disable
import _ from 'lodash'

export const flattenKeys = (obj, path = []) => {
	return !_.isObject(obj) || _.isFunction(obj)
		? { [path.join('.')]: obj }
		: _.reduce(obj, (cum, next, key) => _.merge(cum, flattenKeys(next, [...path, key])), {})
}
