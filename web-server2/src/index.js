'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var SwaggerExpressConfig_1 = require("./SwaggerExpressConfig");
var path = require('path');
var http = require('http');
var cors = require('cors');
//var oas3Tools = require('oas3-tools');
var serverPort = 8080;
var expressAppConfig = new SwaggerExpressConfig_1.ExpressAppConfig(path.join(__dirname, 'api/openapi.yaml'), { controllers: path.join(__dirname, './controllers') });
expressAppConfig.addValidator();
var app = expressAppConfig.getApp();
app.use(cors({ credentials: true }));
console.log('C');
// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});
//# sourceMappingURL=index.js.map