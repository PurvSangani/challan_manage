const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dns.promises.resolveSrv("_mongodb._tcp.cluster0.nlq770z.mongodb.net")
  .then(result => {
    console.log("SRV lookup successful:");
    console.log(result);
  })
  .catch(err => {
    console.error("SRV lookup failed:");
    console.error(err);
  });
