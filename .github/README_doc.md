# Installation Guide

-   Clone this repo

    ```shell
    git clone https://github.com/42Tokyo/Review-bot.git
    cd Review-bot
    ```

### Requirements

-   Discord-bot and it's token
-   42 Application and it's UID and SECRET

### Secrets

| Secrets                        | Reqired | Details                                                                                     |
| ------------------------------ | ------- | ------------------------------------------------------------------------------------------- |
| DISCORD_TOKEN                  | ✔︎      | [Discord-bot token](https://discord.com/developers/applications/)                           |
| CLIENT_UID                     |         | [42 Application's UID](https://profile.intra.42.fr/oauth/applications) ※42 students only    |
| CLIENT_SECRET                  |         | [42 Application's SECRET](https://profile.intra.42.fr/oauth/applications) ※42 students only |
| PGPASSWORD & POSTGRES_PASSWORD | ✔︎      | Create your own for local environment / Set password from fly.io                            |

## Deploy to `fly.io`

Review-bot uses [fly.io](https://fly.io/)'s free plan.

### Requirement

-   [fly.io](https://fly.io/app/sign-up) Acccount

### Procedure

-   Clone this repo

-   Login to fly.io

    ```
    fly auth login
    ```

-   Launch the app and setup Postgresql database

    ```
    flyctl launch
    ```

    ```shell
    $> flyctl launch
    Scanning source code
    Detected a Go app
    Using the following build configuration:
            Builder: paketobuildpacks/builder:base
            Buildpacks: gcr.io/paketo-buildpacks/go
    ? App Name (leave blank to use an auto-generated name): review-bot-test
    Automatically selected personal organization: ******
    ? Select region: nrt (Tokyo, Japan)
    Created app app221023 in organization personal
    Wrote config file fly.toml
    ? Would you like to set up a Postgresql database now? Yes
    ...
    ? Would you like to deploy now? No
    Your app is ready. Deploy with `flyctl deploy`
    ```

    Select `Yes` for setting up a Postgresql database, and you will see the prompt like below

    ```shell
    Creating postgres cluster review-bot-test-db
    Creating app...
    Setting secrets...
    Provisioning 1 of 1 machines with image flyio/postgres:14.4
    Waiting for machine to start...Machine e784079b449483 is created
      Username:    postgres
      Password:    PASSWORD_YOU_MUST_NOTE
      Hostname:    review-bot-test-db.internal
      Proxy port:  5432
      Postgres port:  5433
    Save your credentials in a secure place -- you won't be able to see them again!

    Connect to postgres
    Any app within the TestOrg organization can connect to this Postgres using the following credentials:
    For example: postgres://postgres:PASSWORD_YOU_MUST_NOTE@review-bot-test-db.internal:5432
    ```

    > 📝 Don't forget to take note of the credentials shown above.
    > You will need to set them into fly.io secrects

-   Set secrets

    -   Set `Password` from Postgresql credentials to `PGPASSWORD`

    ```
    flyctl secrets set DISCORD_TOKEN=""
    flyctl secrets set CLIENT_UID=""
    flyctl secrets set CLIENT_SECRET=""
    flyctl secrets set PGPASSWORD=""
    ```

-   Set environments

    -   In `flyio.toml` file, set the credential to `PGHOST`

    ```toml
    [env]
      PORT = "8080"
      VOICE_CATEGORY = "📝 Project Review"
      INTERVAL = "0 0 0 * *"
      CURSUS_ID = "21,28,50"
      PGUSER = "postgres"
      PGHOST = ""
    ```

-   Deploy
    ```
    flyctl deploy
    ```

## Run on local environment

### Requirement

-   [Docker](https://www.docker.com/)

### Procedure

-   Setup environments

    ```shell
    cp .env.sample .env
    ```

    -   Modify `.env` by adding secrets
        -   DISCORD_TOKEN
        -   CLIENT_UID
        -   CLIENT_SECRET
        -   POSTGRES_PASSWORD

-   Start Postgresql database

    ```shell
    docker-compose up --build -d
    ```

-   Start the app

    ```shell
    node .
    ```

## Details

### Environments

There are several environment variables used. These are all required.

| Environments   | Details                                       | Format                                                                          |
| -------------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| VOICE_CATEGORY | Channel category's name in the discord server |                                                                                 |
| CURSUS_ID      | 42 cursus ids to fetch                        | comma separated list: `NB,NB,NB` ex) `21,28,50`                                 |
| INTERVAL       | Interval to fetch 42API for review histories  | In [cron format](https://www.ibm.com/docs/en/db2oc?topic=task-unix-cron-format) |
