# ExecutionEngine 
Execution engine service.

Starting the Execution Engine is as easy as:

```bash
$ npm start
```

### Environment variables used by this service
* SRF_EXECUTIONENGINE_SERVICE_PORT_HTTP - contains the setting of the HTTP port which the service listens on
* SRF_EXECUTION_ASSETS_DIR - contains the directory name where the assets should be downloaded and run
* SRF_EXECUTION_ENGINE_METRICS_SYSTEM - contains the metrics system type for which to publish the metrics. for AWS use "aws".
* AWS_ACCESS_KEY_ID - AWS access key
* AWS_SECRET_ACCESS_KEY - AWS secret access key
* AWS_SESSION_TOKEN - AWS session token (optional)
* AWS_EC2_REGION - AWS region 
* AWS_PROXY - Proxy to use when connecting to AWS. Didn't use HTTP_PROXY to avoid conflicts with rest of the HTTP communication. (optional) 

### Services Consumed by this service:
* Configuration
* Gateway
* Storage
* Test Result

### Unitests
Run a 'test' task using gulp:

```sh
gulp test
```
### Docker
By default, the Docker will expose port 8080.
 
```sh
docker build -t srf/execution-engine:latest .
```

This will create the ExecutionEngine image and pull in the necessary dependencies. Once done, run the Docker and map the port to whatever you wish on your host. In this example, we simply map port 8686 of the host to port 8080 of the Docker.

```sh
docker run --name srf-execution-engine -d -p 8686:8080 --restart="always" -e SRF_CONFIGURATION_SERVICE_HOST=192.168.99.100 -e SRF_CONFIGURATION_SERVICE_PORT_HTTP=7080 -e SRF_GATEWAY_SERVICE_HOST=192.168.99.100 -e SRF_GATEWAY_SERVICE_PORT_HTTP=9070 -e SRF_GATEWAY_SERVICE_PORT_WS=9072 -e SRF_STORAGE_SERVICE_HOST=192.168.99.100 -e SRF_STORAGE_SERVICE_PORT_HTTP=4571 -e SRF_TESTMANAGER_SERVICE_HOST=192.168.99.100 -e SRF_TESTMANAGER_SERVICE_PORT_HTTP=7776 srf/execution-engine:latest
```

### Docker Daemon
for enabling DNS resolution when inside corporate network, please run with `--dns <corporate_dns_server_ip>`

for getting <corporate_dns_server_ip>:
* on windows run `ipconfig /all` and find dns ip under your network adapter's dns servers
* on linux/MacOSX run `cat /etc/resolv.conf` and find dns ip under the "nameserver" entry

docker run command with dns param
```sh
docker run --name srf-execution-engine -d -p 8686:8080 --restart="always" -e SRF_CONFIGURATION_SERVICE_HOST=192.168.99.100 -e SRF_CONFIGURATION_SERVICE_PORT_HTTP=7080 -e SRF_GATEWAY_SERVICE_HOST=192.168.99.100 -e SRF_GATEWAY_SERVICE_PORT_HTTP=9070 -e SRF_GATEWAY_SERVICE_PORT_WS=9072 -e SRF_STORAGE_SERVICE_HOST=192.168.99.100 -e SRF_STORAGE_SERVICE_PORT_HTTP=4571 -e SRF_TESTMANAGER_SERVICE_HOST=192.168.99.100 -e SRF_TESTMANAGER_SERVICE_PORT_HTTP=7776 srf/execution-engine:latest --dns 16.187.23.41
```
