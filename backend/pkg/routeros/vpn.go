package routeros

import (
	"fmt"
	"strconv"
)

type VPNClient struct {
	ID        string
	Protocol  string // ppp, wireguard, ipsec
	Name      string // username / peer name
	Service   string // e.g. l2tp, pptp, sstp, ovpn, ppp (from /ppp/active) or interface name
	Address   string // assigned / remote address
	Uptime    string
	RxBytes   int64
	TxBytes   int64
	CallerID  string // PPP caller-id / remote endpoint
	Interface string
}

func (c *Client) ListActivePPP() ([]VPNClient, error) {
	results, err := c.GetAll("/ppp/active")
	if err != nil {
		return nil, fmt.Errorf("failed to list active PPP sessions: %w", err)
	}

	clients := make([]VPNClient, 0, len(results))
	for _, r := range results {
		clients = append(clients, VPNClient{
			ID:       r[".id"],
			Protocol: "ppp",
			Name:     r["name"],
			Service:  r["service"],
			Address:  r["address"],
			Uptime:   r["uptime"],
			CallerID: r["caller-id"],
		})
	}
	return clients, nil
}

func (c *Client) ListWireguardPeers() ([]VPNClient, error) {
	results, err := c.GetAll("/interface/wireguard/peers")
	if err != nil {
		return nil, fmt.Errorf("failed to list wireguard peers: %w", err)
	}

	clients := make([]VPNClient, 0, len(results))
	for _, r := range results {
		if parseRouterOSBool(r["disabled"]) {
			continue
		}
		rx, _ := strconv.ParseInt(r["rx"], 10, 64)
		tx, _ := strconv.ParseInt(r["tx"], 10, 64)
		name := r["name"]
		if name == "" {
			name = r["comment"]
		}
		if name == "" {
			name = r["public-key"]
		}
		clients = append(clients, VPNClient{
			ID:        r[".id"],
			Protocol:  "wireguard",
			Name:      name,
			Service:   "wireguard",
			Address:   r["current-endpoint-address"],
			Uptime:    r["last-handshake"],
			RxBytes:   rx,
			TxBytes:   tx,
			Interface: r["interface"],
		})
	}
	return clients, nil
}

func (c *Client) ListIPsecActivePeers() ([]VPNClient, error) {
	results, err := c.GetAll("/ip/ipsec/active-peers")
	if err != nil {
		return nil, fmt.Errorf("failed to list ipsec active peers: %w", err)
	}

	clients := make([]VPNClient, 0, len(results))
	for _, r := range results {
		clients = append(clients, VPNClient{
			ID:       r[".id"],
			Protocol: "ipsec",
			Name:     r["id"],
			Service:  "ipsec",
			Address:  r["remote-address"],
			Uptime:   r["uptime"],
		})
	}
	return clients, nil
}

func (c *Client) listOutboundPPPClient(kind string) ([]VPNClient, error) {
	results, err := c.GetAll("/interface/" + kind + "-client")
	if err != nil {
		return nil, fmt.Errorf("failed to list %s-client interfaces: %w", kind, err)
	}

	clients := make([]VPNClient, 0, len(results))
	for _, r := range results {
		if !parseRouterOSBool(r["running"]) {
			continue
		}
		clients = append(clients, VPNClient{
			ID:        r[".id"],
			Protocol:  kind + "-client",
			Name:      r["name"],
			Service:   kind,
			Address:   r["connect-to"],
			CallerID:  r["user"],
			Interface: r["name"],
		})
	}
	return clients, nil
}

func (c *Client) ListAllVPNClients() ([]VPNClient, error) {
	all := make([]VPNClient, 0)

	if ppp, err := c.ListActivePPP(); err == nil {
		all = append(all, ppp...)
	}
	if wg, err := c.ListWireguardPeers(); err == nil {
		all = append(all, wg...)
	}
	if ipsec, err := c.ListIPsecActivePeers(); err == nil {
		all = append(all, ipsec...)
	}
	for _, kind := range []string{"l2tp", "pptp", "ovpn", "sstp"} {
		if out, err := c.listOutboundPPPClient(kind); err == nil {
			all = append(all, out...)
		}
	}

	return all, nil
}
