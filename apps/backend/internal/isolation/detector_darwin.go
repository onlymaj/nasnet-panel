//go:build darwin

package isolation

func detectNamespaceSupport() bool { return false }
