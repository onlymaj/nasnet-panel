//go:build darwin

package isolation

import (
	"context"
	"errors"
	"os/exec"

	"go.uber.org/zap"
)

type NamespaceStrategy struct {
	logger *zap.Logger
}

func (s *NamespaceStrategy) Name() string { return "network-namespace" }

func (s *NamespaceStrategy) PrepareProcess(_ context.Context, _ *exec.Cmd, _ *ProcessIsolationConfig) error {
	return errors.New("not supported on darwin")
}

func (s *NamespaceStrategy) PostStart(_ context.Context, _ int, _ *ProcessIsolationConfig) error {
	return errors.New("not supported on darwin")
}

func (s *NamespaceStrategy) Cleanup(_ context.Context, _ *ProcessIsolationConfig) error {
	return errors.New("not supported on darwin")
}
