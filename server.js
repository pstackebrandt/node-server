// Purpose: Create a basic HTTP server with auto-launching browser
// Code by Peter Stackebrandt

'use strict';

const express = require('express');
const os = require('os');

(async () => {
    const open = await import('open');

    const server = express();

    // Middleware to serve static files from the 'public' directory
    server.use(express.static('public'));

    // 80 is the default port for HTTP
    server.listen(80, err => console.log(err || 'Server läuft'));
    // Server listens on all available network interfaces (localhost, LAN, etc.)

    const networkInterfaces = os.networkInterfaces();

    let ipAddress = '127.0.0.1';
    // Iterate over all network interfaces to find a non-internal IPv4 address
    for (const iface of Object.values(networkInterfaces)) {
        // Loop through each network interface's addresses
        for (const alias of iface) {
            // Find first non-internal IPv4 address 
            if (alias.family === 'IPv4' && !alias.internal) {
                ipAddress = alias.address;
                break;
            }
        }
        // Exit main loop if we found a non-localhost IPv4 address
        if (ipAddress !== '127.0.0.1') break;
    }

    // Check specifically for Wi-Fi interface as it's often the preferred network connection
    if (networkInterfaces['Wi-Fi']) {
        // Find first non-internal IPv4 address on Wi-Fi interface
        const wifiIPv4 = networkInterfaces['Wi-Fi'].find(alias => alias.family === 'IPv4'
            && !alias.internal
        );
        if (wifiIPv4) {
            ipAddress = wifiIPv4.address;
        }
    }

    // Construct URL using found IP address and standard HTTP port
    const url = `http://${ipAddress}:80`;
    console.log(`Server läuft. Öffnen Sie ${url} im Browser.`);
    // Automatically open the URL in system's default browser
    open.default(url);
})();

/*
This file creates a basic HTTP server with the following key features:

Server Setup

Uses Express.js framework
Serves static files from a 'public' directory
Listens on port 80 (standard HTTP port)
Network Configuration

Determines the server's IP address by scanning network interfaces
Prioritizes non-internal IPv4 addresses
Can use localhost (127.0.0.1) as fallback
Auto Browser Launch

Uses the 'open' module to automatically launch the default browser
Opens the server URL using the detected IP address
Purpose

Development web server for static content
Accessible both locally and from other devices on the network
Auto-launches browser for convenient testing
The server prioritizes finding a network-accessible IP address to allow other devices to connect while maintaining localhost functionality for local development.

Note: This script requires the 'express' and 'open' modules to be installed. You can install them using npm install express open.

How server.listen(80) works:
============================

Listens on all IPv4 and IPv6 interfaces by default
This includes:
    Loopback (127.0.0.1, ::1)
    Private network interfaces (192.168.x.x, etc.)
    Public interfaces (if any)

Limitation:
-----------
While it listens on all interfaces, access is typically limited by:
    Network configuration
    Firewalls
    Router settings
    Operating system security
*/