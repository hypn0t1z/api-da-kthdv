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
## Get provider
get: /:account_id/provider

## Create Provider
post: /:account_id/create-provider
body: {
        "name": "Hungdang company",
        "identity_card": 13232938323,
        "phone": "04442349589",
        "addr_province": "01",
        "addr_district": "001",
        "open_time": "2h",
        "close_time": "4h",
        "addr_ward": "00001",
        "address_more": "k85/15/14",
        "latitude": "7392",
        "longtitude": "2223" ,
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

## Update Provider
patch: /:account_id/update-provider
body: {
        "name": "Hungdang company 123",
        "identity_card": 13232938323,
        "phone": "04442349589",
        "addr_province": "01",
        "addr_district": "001",
        "open_time": "1h",
        "close_time": "4h",
        "addr_ward": "00001",
        "address_more": "k85/15/14",
        "latitude": "7392",
        "longtitude": "2223", 
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

## Find nearby Providers
get: api/find-nearby
params: mylat, mylon, dist( option, default = 10 );
ex: /api/find-nearby?mylat=121.44&mylon=37.79

## Delete Provider
delete: /:account_id/delete-provider

## Block User
get: /block/:account_id

## Get list provider's services 
get: /:account_id
params: account_id

## Get profile by account id
get: user/:account_id/profile

## Create profile
post: user/1/create-profile
params: province, district, ward, address_more, birthday, avatar
body:{
        "full_name": "Dang Ba SoCuTo",
        "avatar": {base64String}, //option
        "province": "001",
        "district": "0002",
        "ward": "00004",
        "address_more: "K85/H15/14",
        "birthday": "1996-10-17",
    }

## Update Profile
post: user/:account_id/update-profile
params: province, district, ward, address_more, birthday, avatar
body:{
        "full_name": "Dang Ba SoCuTo",
        "avatar": {base64String}, //option 
        "province": "001",
        "district": "0002",
        "ward": "00004",
        "address_more: "K85/H15/14",
        "birthday": "1996-10-17",
    }

## Get Providers by Service Types
get: /api/service/types
param: typeIds (array)
body:   {
	        "typeIds": [1,2,3,4,5]
        }

## Get rate by rate_id
get: /api/user/:id/rate/:rate_id

## Get rates by provider_id
get : /:id/rate/provider/:provider_id

## create rate by provider_id
post: /:id/rate/create/:provider_id

body: {
    star_number (required): 1,
    comment (option): "xxx" 
}

## Update rate by rate_id
patch: /:id/rate/update/:rate_id

body: {
    star_number (option): 1,
    comment (option): "xxx" 
}