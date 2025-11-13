# Development Environment Base

## Traefik
Traefik is used as a reverse proxy to manage and route incoming requests to the appropriate services within the development environment.

##  MariaDB and Adminer
MariaDB is a popular open-source relational database management system. Adminer is a full-featured database management tool written in PHP. It supports various database systems including MariaDB.

## MailHog
MailHog is a web and API based SMTP testing tool for developers. It captures emails sent by your application and allows you to view them in a web interface.

## Kibana/Elasticsearch
Kibana is a data visualization and exploration tool used for log and time-series analytics, application monitoring, and operational intelligence use cases. It is commonly used in conjunction with Elasticsearch.

## APM Server
The APM (Application Performance Monitoring) server is part of the Elastic Stack and is used to collect performance metrics and errors from applications.

## Portainer
Portainer is a lightweight management UI that allows you to easily manage your Docker environments.

## Netdata
Netdata is a real-time performance monitoring tool that provides insights into the health and performance of your systems and applications.


## Chrome Headless

### Generating PDF from a URL using Chrome Headless
```sh
  curl -X POST "http://localhost:3001/pdf?token=super-secret-token" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "options": {
      "printBackground": true,
      "format": "A4"
    }
  }' \
  --output output.pdf
  ```

  ### generating a screenshot from a URL using Chrome Headless
  ```sh
curl -X POST "http://localhost:3001/screenshot?token=super-secret-token" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "options": {
      "fullPage": true,
      "type": "png"
    }
  }' \
  --output screenshot.png

```