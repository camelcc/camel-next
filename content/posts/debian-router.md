---
title: Home Lab
date: 2025-04-13
---

## Hardware

![Home Lab Hardware](/img/HomeLabHardware.svg)

#### 1. Modem

All traffic is coming from the Modem which is provided by the IPS vendor. My modem comes with a fiber adaptor with one ethernet port.

I didn't use any other functionalities, nor using any IPS routers that given to me during setup.

#### 2. Main Router (Debian)

The main router is a 4 ethernet port mini PC running on Debian OS. I choose this approach for stability and flexibility. All the OEM routers are either too weak or not extentable, openwrt is not an option since it's not that stable and not as flexible as mainstream linux distribution.

Hardware spec: `N6005 CPU, 4x Intel i226 Nics, 512 NVMe SSD, 2*8GB DDR4`

#### 3. Wifi Mesh

Using Wifi Mesh system `Tp-Link Deco X60` for more stability and wifiless coverage. My setup should give decent coverage for most use cases (3 beacons).

I only use these devices for AP purpose since main router will do the DHCP and DNS monitoring.

#### 4. NAS

NAS mainly serve my personal documents and media files. I picked `Synology DS923+` for convience, it's also feasible to build one based on open source system given additional free PCs.

By default, I can configure the NAS file system type to be `RAID 0` for fault tolerance.

## Network services

Idea is to build **All in One** router for inhouse network service. Hardware failure is relatively rare, compare to power/network outages, at least in US, lol.

![Network Service](/img/HomeLabNetworkService.svg)

#### 1. Debian Router

Network traffic is serve and routed by Debian OS running on the mini PC. A common used Linux distribution provide much stability and flexibility to many usecases such as SSL striping, rever proxy etc. These services are hard to support on OEM or opensource routers.

* DHCP and DNS service served by `AdGuard` for easy configuration.
* `cloudflared` is used for reverse proxy so that I can access the services from internet.
* `firewalld` for overall network audit, iptables is just very hard to use and understand to me.
* There is a cron job running `certbot` to update the SSL certificate since I have use cases to self-host the remote NAS in some other places.

#### 2. NAS

NAS system provide many build in features such as Drive and Photos for file backup. Another big usecase for me is serve media service so I can streaming music. For this, I deploy a docker image for `Jellyfin` service and reverse proxy that though cloudflare tunnel.

The NAS also using sFTP and other tools to sync and backup files to a remote NAS.


## Debian System Config

> Not that important now since one can just prompt the AI for configurations.

#### 1. Network interface config

All LAN ports are grouped together using bridge, so that it can be managed together.

Install tool: `sudo apt install bridge-utils isc-dhcp-server`.

```
# /etc/network/interfaces
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

source /etc/network/interfaces.d/*

# The loopback network interface
auto lo
iface lo inet loopback

# WAN port to get IP via DHCP
auto enp3s0
allow-hotplug enp3s0
iface enp3s0 inet dhcp

# LAN port group by bridge br0
auto br0
iface br0 inet static
    bridge_ports enp4s0 enp5s0 enp6s0
    address 192.168.10.1
    netmask 255.255.255.0
```

DHCP config, later DHCP server is replaced by AdGuard.

```
# /etc/default/isc-dhcp-server
INTERFACESv4="br0"
```

This is serve the DHCP service for br0 interface (4 ethernet LAN ports).

```
# /etc/dhcp/dhcpd.conf
# option definitions common to all supported networks...
option domain-name "lan";
option domain-name-servers 192.168.10.1;

subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.100 192.168.10.200;
    option routers 192.168.10.1;
    # i.e. static ip address
    host ex {
        hardware ethernet XX:XX:XX:XX:XX;
        fixed-address 192.168.10.2;
    }
}
```


#### 2. Enable IP forward


```/etc/sysctl.conf
# /etc/sysctl.conf
net.ipv4.ip_forward=1
```

#### 3. Config Firewalld

Create two zone: `public` and `home`, and enable necessary webservice for `home`. `masquerade` is important to enable port forwarding, since many internal service depend on this to export to internet.

```
# /etc/firewalld/firewalld.conf
DefaultZone=public

# /etc/firewalld/zones/public.xml
<?xml version="1.0" encoding="utf-8"?>
<zone>
  <short>Public</short>
  <description>For use in public areas. You do not trust the other computers on networks to not harm your computer. Only selected incoming connections are accepted.</description>
  <service name="ssh"/>
  <service name="dhcpv6-client"/>
  <masquerade/>
  <forward/>
</zone>

# /etc/firewalld/zones/home.xml
<?xml version="1.0" encoding="utf-8"?>
<zone target="ACCEPT">
  <short>Home</short>
  <description>For use in home areas. You mostly trust the other computers on networks to not harm your computer. Only selected incoming connections are accepted.</description>
  <service name="ssh"/>
  <service name="mdns"/>
  <service name="samba-client"/>
  <service name="dhcpv6-client"/>
  <interface name="br0"/>
  <forward/>
</zone>
```

#### 4. Reverse proxy (cloudflared)

I use [cloudflared](https://github.com/cloudflare/cloudflared) for reverse proxy for simplicity. I use the **Ingress** config to enable custom reverse proxy service. It will serve many webservices to the internet: `jellyfin`, `NAS`, `VPN tunnel`, etc.

#### 5. Let's Encrypt cert

I am using `certbot` with cloudflare plugin to auto renew the certificate, so I can deploy my own web services.