export const readOnlyProxy = <T extends Record<string, unknown>>(base_obj: T) => {
	return new Proxy(base_obj, {
		get(_, key: string) {
			if (base_obj[key] != null && typeof base_obj[key] === 'object') {
				return readOnlyProxy(base_obj[key] as Record<string, unknown>)
			}
			return Reflect.get(base_obj, key)
		},
		set() {
			return true
		},
	})
}
