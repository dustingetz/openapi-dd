'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var fs = require("fs");
var jsyaml = require("js-yaml");
var express_openapi_validator_1 = require("express-openapi-validator");
var ExpressAppConfig = /** @class */ (function () {
    function ExpressAppConfig(definitionPath, routingOptions) {
        this.definitionPath = definitionPath;
        this.routingOptions = routingOptions;
        this.app = express();
        var spec = fs.readFileSync(definitionPath, 'utf8');
        var swaggerDoc = jsyaml.safeLoad(spec);
        this.app.use(bodyParser.urlencoded());
        this.app.use(bodyParser.text());
        this.app.use(bodyParser.json());
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        // const swaggerUi = new SwaggerUI(swaggerDoc, undefined);
        // this.app.use(swaggerUi.serveStaticContent());
    }
    ExpressAppConfig.prototype.addValidator = function () {
        var _this = this;
        new express_openapi_validator_1.OpenApiValidator({
            apiSpec: this.definitionPath,
        })
            .install(this.app)
            .then(function () {
            // this.app.use(new SwaggerParameters().checkParameters());
            // this.app.use(new SwaggerRouter().initialize(this.routingOptions));
            _this.app.use(function (err, req, res, next) {
                // format errors
                res.status(err.status || 500).json({
                    message: err.message,
                    errors: err.errors,
                });
            });
        });
    };
    ExpressAppConfig.prototype.getApp = function () {
        return this.app;
    };
    return ExpressAppConfig;
}());
exports.ExpressAppConfig = ExpressAppConfig;
//# sourceMappingURL=SwaggerExpressConfig.js.map