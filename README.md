# Api

## Deployment

```
$ npm i
```

## Environment Variables

## Copy env variables of the env example

```
$ npm run cp:env
```

Must have set server and database variables

If you need in creating database then run command `$ npm run db:create`

## Migrations

```
$ npm run db:migrate
```

## Start server

```
$ npm start
```

## Watch server

Must use nodemon or any package that similar

```
$ nodemon server.js
```
## Create/Update Provider
post: /:account_id/provider
body: {
        "identity_card": 13232938323,
        "phone": "04442349589",
        "addr_province": "01",
        "addr_district": "001",
        "open_time": "2h",
        "close_time": "4h",
        "addr_ward": "00001",
        "address_more": "k85/15/14",
        "latitude": "7392",
        "longtitude": "2223" 
        "images": [
            {
                "path": {base64String},
                "description": ""
            },
            {
                "path": {base64String},
                "description": ""
            }
        ]
    }

## Block User
get: /block/:account_id

## Get list provider's services 
get: /
params: provider_id

