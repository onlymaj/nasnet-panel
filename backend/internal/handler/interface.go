package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type InterfaceTrafficResponse struct {
	Name               string `json:"name"`
	RxBitsPerSecond    int64  `json:"rxBitsPerSecond"`
	TxBitsPerSecond    int64  `json:"txBitsPerSecond"`
	RxPacketsPerSecond int64  `json:"rxPacketsPerSecond"`
	TxPacketsPerSecond int64  `json:"txPacketsPerSecond"`
}

type InterfaceResponse struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Type     string `json:"type"`
	Running  bool   `json:"running"`
	Disabled bool   `json:"disabled"`
	Mac      string `json:"mac,omitempty"`
	MTU      int    `json:"mtu,omitempty"`
	Comment  string `json:"comment,omitempty"`
}

// HandleListInterfaces godoc
// @Summary List all interfaces
// @Description Returns all configured interfaces on the RouterOS device
// @Tags Interfaces
// @Accept json
// @Produce json
// @Security BasicAuth
// @Param X-RouterOS-Host header string true "RouterOS host address"
// @Success 200 {object} map[string]interface{} "Interfaces list"
// @Failure 401 {object} map[string]interface{} "Unauthorized"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/interfaces [get]
func HandleListInterfaces(c echo.Context) error {
	client, err := GetRouterOSClient(c)
	if err != nil {
		return err
	}
	defer func() { _ = client.Close() }()

	list, err := client.ListInterfaces()
	if err != nil {
		if IsCredentialError(err) {
			return ErrorResponse(c, http.StatusUnauthorized, "Invalid RouterOS credentials", err)
		}
		return ErrorResponse(c, http.StatusInternalServerError, "Failed to list interfaces", err)
	}

	responses := make([]InterfaceResponse, 0, len(list))
	for _, iface := range list {
		responses = append(responses, InterfaceResponse{
			ID:       iface.ID,
			Name:     iface.Name,
			Type:     iface.Type,
			Running:  iface.Running,
			Disabled: iface.Disabled,
			Mac:      iface.Mac,
			MTU:      iface.MTU,
			Comment:  iface.Comment,
		})
	}

	return SuccessResponse(c, http.StatusOK, "Interfaces retrieved", responses)
}

// HandleGetInterfaceTraffic godoc
// @Summary Get one-shot interface traffic sample
// @Description Returns a single rx/tx bits-per-second sample from RouterOS /interface/monitor-traffic
// @Tags Interfaces
// @Accept json
// @Produce json
// @Security BasicAuth
// @Param X-RouterOS-Host header string true "RouterOS host address"
// @Param name path string true "Interface name (e.g. ether1)"
// @Success 200 {object} map[string]interface{} "Interface traffic sample"
// @Failure 400 {object} map[string]interface{} "Bad request"
// @Failure 401 {object} map[string]interface{} "Unauthorized"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/interfaces/{name}/traffic [get]
func HandleGetInterfaceTraffic(c echo.Context) error {
	name := c.Param("name")
	if name == "" {
		return ErrorResponse(c, http.StatusBadRequest, "interface name is required", nil)
	}

	client, err := GetRouterOSClient(c)
	if err != nil {
		return err
	}
	defer func() { _ = client.Close() }()

	traffic, err := client.MonitorTraffic(name)
	if err != nil {
		if IsCredentialError(err) {
			return ErrorResponse(c, http.StatusUnauthorized, "Invalid RouterOS credentials", err)
		}
		return ErrorResponse(c, http.StatusInternalServerError, "Failed to monitor interface traffic", err)
	}

	return SuccessResponse(c, http.StatusOK, "Interface traffic retrieved", InterfaceTrafficResponse{
		Name:               traffic.Name,
		RxBitsPerSecond:    traffic.RxBitsPerSecond,
		TxBitsPerSecond:    traffic.TxBitsPerSecond,
		RxPacketsPerSecond: traffic.RxPacketsPerSecond,
		TxPacketsPerSecond: traffic.TxPacketsPerSecond,
	})
}
