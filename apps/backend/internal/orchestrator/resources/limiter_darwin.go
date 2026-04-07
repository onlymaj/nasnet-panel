//go:build darwin

package resources

import (
	"context"
	"fmt"
	"time"

	"backend/internal/events"

	"go.uber.org/zap"
)

type ResourceUsage struct {
	MemoryMB uint64
	PID      int
	Time     time.Time
}

type ResourceLimiterConfig struct {
	EventBus events.EventBus
	Logger   *zap.SugaredLogger
}

type ResourceLimiter struct {
	logger *zap.SugaredLogger
}

func NewResourceLimiter(config ResourceLimiterConfig) (*ResourceLimiter, error) {
	return &ResourceLimiter{logger: config.Logger}, nil
}

func (rl *ResourceLimiter) IsCgroupsEnabled() bool { return false }

func (rl *ResourceLimiter) ApplyMemoryLimit(_ context.Context, _, _ int, _, _ string) error {
	return fmt.Errorf("not supported on darwin")
}

func (rl *ResourceLimiter) GetResourceUsage(_ int) (*ResourceUsage, error) {
	return nil, fmt.Errorf("not supported on darwin")
}

func (rl *ResourceLimiter) StartMonitoring(_ context.Context, _ int, _, _ string, _ int) error {
	return fmt.Errorf("not supported on darwin")
}

func (rl *ResourceLimiter) StopMonitoring(_ int) {}

func (rl *ResourceLimiter) Close() error { return nil }
