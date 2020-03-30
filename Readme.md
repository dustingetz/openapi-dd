React.js frontend
 
```shell script
cd web-client
yarn
npx parcel src/index.html
```

Node server 1, generated by swagger-codegen

```shell script
cd web-server
npm start

# http://localhost:8080/docs/
# http://localhost:8080/

# Generator incantation
wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.18/swagger-codegen-cli-3.0.18.jar -O swagger-codegen-cli.jar
java -jar swagger-codegen-cli.jar generate -l nodejs-server -i  
```

Node server 2 is like #1, but code pushed around to let me fork the generated server, needs typescript to compile

Node server 3, generated by openapi-generator, a hostile fork of swagger-codegen

```shell script
cd web-server3
node src/index

# Generator incantation
wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/4.2.3/openapi-generator-cli-4.2.3.jar -O openapi-generator-cli.jar
java -jar openapi-generator-cli.jar generate -g nodejs-express-server -i http://petstore.swagger.io/v2/swagger.json -o web-server3
```

mock-server-1
```shell script
npx open-api-mocker -s ../openapi.yaml -w
```

mock-server-2
```shell script
npx prism mock ../petstore-expanded.yaml
npx prism mock https://raw.githack.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore-expanded.yaml

```

Web server 4, which is like web server 3 but generated from petstore-expanded.yaml
```shell script
cd web-server4
node src/index

# Generator incantation
java -jar openapi-generator-cli.jar generate -g nodejs-express-server -i petstore-expanded.yaml -o web-server4
```

## How it works

```yaml
/store/inventory:
get:
  description: Returns a map of status codes to quantities
  operationId: getInventory
  responses:
    "200":
      content:
        application/json:
          schema:
            additionalProperties:
              format: int32
              type: integer
            type: object
      description: successful operation
  security:
  - api_key: []
  summary: Returns pet inventories by status
  tags:
  - store
  x-openapi-router-controller: StoreController
  x-openapi-router-service: StoreService
```