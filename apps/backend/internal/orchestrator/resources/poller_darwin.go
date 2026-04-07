//go:build darwin

package resources

import (
	"context"
	"fmt"

	"backend/internal/events"

	"go.uber.org/zap"
)

type ResourcePollerConfig struct {
	ResourceLimiter *ResourceLimiter
	EventBus        events.EventBus
	Logger          *zap.Logger
}

type ResourcePoller struct{}

func NewResourcePoller(_ ResourcePollerConfig) (*ResourcePoller, error) {
	return &ResourcePoller{}, nil
}

func (rp *ResourcePoller) Start(_ context.Context) error {
	return fmt.Errorf("not supported on darwin")
}
func (rp *ResourcePoller) Stop() error { return nil }
func (rp *ResourcePoller) AddInstance(_, _, _ string, _, _ int) error {
	return fmt.Errorf("not supported on darwin")
}
func (rp *ResourcePoller) RemoveInstance(_ string) {}
