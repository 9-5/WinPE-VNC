const websockify = require('@maximegris/node-websockify');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const eth = interfaces['Ethernet'];
  
  if (!eth) {
    console.log('No eth0 interface found.');
    return null;
  }

  const ipv4Addresses = eth.filter((info) => info.family === 'IPv4' && !info.internal);

  if (ipv4Addresses.length > 0) {
    return ipv4Addresses[0].address;
  } else {
    console.log('No IPv4 addresses found.');
    return null;
  }
}

const IP_ADDR = getLocalIP();

if (IP_ADDR === null) {
  process.exit(1);
} else {
  console.log(`Using IP address: ${IPADDR}`);
  websockify({source: `${IP_ADDR}:8113`, target: `${IP_ADDR}:5900`}); // The first port (8113) is for the websocket connection. It can be be anything up to 65535, but I opted for 8113. The second port (5900) is dependent on what TightVNC was set to, 5900 being the default.
}
