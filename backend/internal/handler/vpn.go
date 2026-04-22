package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type VPNClientResponse struct {
	ID        string `json:"id"`
	Protocol  string `json:"protocol"`
	Name      string `json:"name"`
	Service   string `json:"service,omitempty"`
	Address   string `json:"address,omitempty"`
	Uptime    string `json:"uptime,omitempty"`
	RxBytes   int64  `json:"rxBytes,omitempty"`
	TxBytes   int64  `json:"txBytes,omitempty"`
	CallerID  string `json:"callerId,omitempty"`
	Interface string `json:"interface,omitempty"`
}

// HandleListVPNClients godoc
// @Summary List active VPN clients
// @Description Merges PPP active sessions, WireGuard peers and IPsec active peers
// @Tags VPN
// @Accept json
// @Produce json
// @Security BasicAuth
// @Param X-RouterOS-Host header string true "RouterOS host address"
// @Success 200 {object} map[string]interface{} "VPN clients"
// @Failure 401 {object} map[string]interface{} "Unauthorized"
// @Failure 500 {object} map[string]interface{} "Internal server error"
// @Router /api/vpn/clients [get]
func HandleListVPNClients(c echo.Context) error {
	client, err := GetRouterOSClient(c)
	if err != nil {
		return err
	}
	defer func() { _ = client.Close() }()

	clients, err := client.ListAllVPNClients()
	if err != nil {
		if IsCredentialError(err) {
			return ErrorResponse(c, http.StatusUnauthorized, "Invalid RouterOS credentials", err)
		}
		return ErrorResponse(c, http.StatusInternalServerError, "Failed to list VPN clients", err)
	}

	responses := make([]VPNClientResponse, 0, len(clients))
	for _, v := range clients {
		responses = append(responses, VPNClientResponse{
			ID:        v.ID,
			Protocol:  v.Protocol,
			Name:      v.Name,
			Service:   v.Service,
			Address:   v.Address,
			Uptime:    v.Uptime,
			RxBytes:   v.RxBytes,
			TxBytes:   v.TxBytes,
			CallerID:  v.CallerID,
			Interface: v.Interface,
		})
	}

	return SuccessResponse(c, http.StatusOK, "VPN clients retrieved", responses)
}
