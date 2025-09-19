

const data={
        "communityType": "Pet Organization",
        "fields": [
            {
                "name": "Name",
                "required": true,
                "type": "string"
            },
            {
                "name": "Description",
                "required": true,
                "type": "string"
            },
            {
                "name": "Location",
                "required": true,
                "type": "string"
            },
            {
                "name": "Established Date",
                "required": true,
                "type": "date"
            },
            {
                "name": "Number of Members",
                "required": false,
                "type": "number"
            },
            {
                "name": "Website",
                "required": false,
                "type": "string"
            },
            {
                "name": "Community Form Link",
                "required": true,
                "type": "string"
            },
            {
                "name": "Contact Email",
                "required": true,
                "type": "string"
            }
        ]
    }




console.log(data['fields'])