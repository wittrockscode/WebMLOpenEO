# WebMLOpenEO - Web-based Machine Learning for OpenEO

## About this Project
This project was created for the course "Geosoftware II" at the University of Münster, Institute for Geoinformatics. The task was to create a web based application building upon the [openeocubes](https://github.com/PondiB/openeocubes)-Framework. It should enable researchers and remote sensing experts to perform machine-learning based Land-Use-Land-Cover (LULC) classifications.

In our application we provide a web-app with an adjoined Express-API to expose functionality and handle requests. Computations are performed on a third container runnning the framework [openeocubes](https://github.com/PondiB/openeocubes).

# Installation Guide

## Prerequisites

This respository uses a submodule, so some extra steps may be necessary.

It can be cloned with `git clone --recurse-submodules https://github.com/wittrockscode/WebMLOpenEO.git`. This ensures that also the newest version of https://github.com/TimCi/openeocubes is fetched.

If this repository was cloned without the `recurse-submodules` flag, use `git submodule update --init --recursive` to update the state of the submodule.

For further information please refer to the [git documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules).


## Local deployment with docker

### Requirements

Docker and docker compose have to be installed on your system.
The application operates on the ports `80`, `3000` and `8000` locally, which have to be free while using it.

### Starting

To start the whole application navigate to the project directory and use:

```bash
docker compose up -d --build
```


## Local deployment without docker

Please refer to the individual application segments to start them locally without docker:

- [Frontend](app/frontend/README.md)

- [Node-Backend](app/node-backend/README.md)

- [R-Backend](https://github.com/TimCi/openeocubes?tab=readme-ov-file#development-notes)



## Remote deployment

### Requirements

[Docker](https://docs.docker.com/get-docker/) and docker compose have to be installed on the machine.

### Configuration

The frontend depends on some environment variables which hold relevant URLs of the application:

- Navigate to `./app/frontend`.

- Open the file `.env` with a text editor (for example `nano`).

- Replace the `VITE_NODE_BACKEND_URI` value with `http://your_server_url.com/api` (note the `/api`).

- Replace the `VITE_BASE_URL` value with `http://your_server_url.com`.

- Replace the `VITE_ENV` value with `production`.

- Finally, save the file.


We have provided a sample file with the data for the AWS instance used while developing this application, it can be found [here](app/frontend/.env.prod).
### Starting

Execute the `docker compose up -d --build` command in the terminal.

## Testing

Please also refer to the individual application segments to get information about testing.
