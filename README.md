# Assets-Service

A minimal HTTP Server for delivering static assets like JS bundles. 
Ideal for integrating and serving Micro Frontends like SPAs as well as CSS files.

- Concatenates JS-assets in 'public/' with a header code to a stream.
- Sends stream as a response to the browser.


## Run application

Following parameters can be passed before running the application:

```
node server.js --help
```

Output will be:

```
  Usage: server [options]


  Options:

    -V, --version    output the version number
    -p --port <i>    port number for the web-server (default: 7000)
    -d --dir <path>  directory to the assets (default: ./public)
    -l --log <path>  file for writing logs (default: ./combined.log)
    -h, --help       output usage information

```

