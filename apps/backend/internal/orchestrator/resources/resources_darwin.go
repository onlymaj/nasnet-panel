//go:build darwin

package resources

import (
	"context"
	"fmt"

	"backend/generated/ent"

	"go.uber.org/zap"
)

const (
	DefaultSystemMemoryMB    = 4096
	DefaultAvailableMemoryMB = 2048
	ResourceBufferPercentage = 0.10
)

type SystemResources struct {
	TotalMemoryMB     int     `json:"totalMemoryMb"`
	AvailableMemoryMB int     `json:"availableMemoryMb"`
	UsedMemoryMB      int     `json:"usedMemoryMb"`
	UsagePercent      float64 `json:"usagePercent"`
	IsProcAvailable   bool    `json:"isProcAvailable"`
}

type AllocatedResources struct {
	TotalAllocatedMB int                       `json:"totalAllocatedMb"`
	InstanceCount    int                       `json:"instanceCount"`
	Instances        []InstanceResourceSummary `json:"instances"`
}

type InstanceResourceSummary struct {
	InstanceID    string `json:"instanceId"`
	FeatureID     string `json:"featureId"`
	InstanceName  string `json:"instanceName"`
	MemoryLimitMB int    `json:"memoryLimitMb"`
	Status        string `json:"status"`
}

type ResourceAvailability struct {
	Available        bool                      `json:"available"`
	RequiredMB       int                       `json:"requiredMb"`
	AvailableMB      int                       `json:"availableMb"`
	AllocatedMB      int                       `json:"allocatedMb"`
	BufferMB         int                       `json:"bufferMb"`
	Suggestions      []ResourceSuggestion      `json:"suggestions"`
	RunningInstances []InstanceResourceSummary `json:"runningInstances"`
}

type ResourceSuggestion struct {
	Action       string `json:"action"`
	InstanceID   string `json:"instanceId"`
	InstanceName string `json:"instanceName"`
	FeatureID    string `json:"featureId"`
	MemoryMB     int    `json:"memoryMb"`
	Reason       string `json:"reason"`
}

type ResourceManagerConfig struct {
	Store  *ent.Client
	Logger *zap.Logger
}

type ResourceManager struct {
	logger *zap.Logger
}

func NewResourceManager(config ResourceManagerConfig) (*ResourceManager, error) {
	return &ResourceManager{logger: config.Logger}, nil
}

func (rm *ResourceManager) GetSystemResources(_ context.Context) (*SystemResources, error) {
	return nil, fmt.Errorf("not supported on darwin")
}

func (rm *ResourceManager) GetAllocatedResources(_ context.Context) (*AllocatedResources, error) {
	return nil, fmt.Errorf("not supported on darwin")
}

func (rm *ResourceManager) CheckResourceAvailability(_ context.Context, _ int) (*ResourceAvailability, error) {
	return nil, fmt.Errorf("not supported on darwin")
}
