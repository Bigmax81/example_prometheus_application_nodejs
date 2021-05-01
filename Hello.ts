const restify = require("restify");
const {Counter, register} = require("prom-client");

const server = restify.createServer(); // Server creation

// Creation of Counter metric
const nb_request_total = new Counter({
    name: "nb_request_total",
    help: "Number of req"
});

// Definition of the main route localhost:1000
server.get("/", async (req, res) =>{
    nb_request_total.inc(); // incrementation of the metric
   try{
       res.send("Hello World !!"); // Send a message on the main route
   } catch(err){
       console.log(err);
   }
});

// Definition of the localhost:1000/metrics route who will receive the metric(s)
server.get("/metrics", async (req, res) => {
   try{
       res.sendRaw(await register.metrics()); // send metric(s) to the localhost:1000/metrics route
   } catch(err){
       console.log(err);
   }
});

const port = process.env.port || 1000; // Creation of the port
server.listen(port); // Listen of the port
console.log("Server listen on port "+port);