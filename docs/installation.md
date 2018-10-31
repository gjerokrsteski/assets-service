# Download & Install
1. Please navigate to latest assets-server releases
2. Download latest greatest version of asset-server `Download -> Artifacts`
3. Unpack the `zip` file
4. After unpacking the artifact you will receive the asset-server binary for each operating system, like:

```
production/
└── bin
    ├── asset-server-linux
    ├── asset-server-macos
    └── asset-server-win.exe
```

5. Please choose the asset-server binary according to the operating system where the binary should bin installed.
6. Copy the asset-server binary to destination server and start it as daemon or as service using `systemd` for example.  

## Run cli application

Following parameters can be passed before running the application:

```
./asset-server-linux  --help
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


[<< back](../README.md)
