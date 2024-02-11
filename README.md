# M3TL

## Prerequisites

This respository uses a submodule, so some extra steps may be necessary.

It can be cloned with `git clone --recurse-submodules https://github.com/wittrockscode/WebMLOpenEO.git`.

If this repository was cloned without the `recurse-submodules` flag, use `git submodule update --init --recursive`.


## Local deploy with docker

### Requirements

Docker and docker compose have to be installed on your system.
The application operates on the ports `80`, `3000` and `8000` locally, which have to be free while using it.

### Starting

To start the whole application use:

```bash
docker compose up -d --build
```


## Local deploy without docker

Please refer to the individual application segments to start them locally without docker:

[Frontend](app/frontend/README.md)

[Node-Backend](app/node-backend/README.md)

[R-Backend](app/r_backend/README.md)



## Remote deployment

### Requirements

Docker and docker compose have to be installed on the machine.

### Configuration

The frontend depends on some environment variables which hold relevant urls of the application.

Navigate to `./app/frontend`.

Open the file `.env` with a text editor (for example `nano`).

Replace the `VITE_NODE_BACKEND_URI` value with `http://your_server_url.com/api` (note the `/api`).

Replace the `VITE_BASE_URL` value with `http://your_server_url.com`.

Replace the `VITE_ENV` value with `production`.

Finally, save the file.


We have provided a sample file with the data for the AWS instance used while developing this application, it can be found [here](app/frontend/.env.prod)
### Starting

Execute the `docker compose up -d --build` command in the terminal.

## Testing

Please also refer to the individual application segments to get information about testing.
