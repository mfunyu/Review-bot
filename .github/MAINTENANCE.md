[English (en)](README.md) • [日本語 (ja)](README_ja.md) • [Instllation Guide](INSTALL.md)

# Maintenance Guide

Periodic update of 42 API is required.

### Updating 42 API Secret

-   Access https://profile.intra.42.fr/oauth/applications/14827

-   Copy SECRET

-   Run
    ```
    flyctl secrets set CLIENT_SECRET=""
    ```

### Changing UID

-   Run
    ```
    flyctl secrets set CLIENT_UID=""
    ```

## `fly.io` commands

### Status

-   Status check
    ```
    fly status
    ```
    ```
    fly status -a 42review-bot
    ```

### Start / Restart

-   Down

    ```
    fly scale count 0
    ```

-   Start
    ```
    fly scale count 1
    ```
