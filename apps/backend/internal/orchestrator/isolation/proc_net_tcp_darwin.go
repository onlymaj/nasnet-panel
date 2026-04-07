//go:build darwin

package isolation

type ProcessBindingConflict struct {
	LocalIP   string
	LocalPort int
	State     string
}

func (iv *IsolationVerifier) parseProcNetTCP(_ string) ([]ProcessBindingConflict, error) {
	return nil, nil
}
