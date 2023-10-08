S3 helper for storing state for @softwareasaservice/events

## installation

    #yarn add @softwareasaservice/eventsWorkflowS3
    
    #npm install --save @softwareasaservice/eventsWorkflowS3

## integrating 

    var {Events} = require("@softwareasaservice/events");
    var {setup, checkEvent, setEvent} = require('@softwareasaservice/eventsWorkflowS3');
    var events = new Events(user, {workflow, setup, checkEvent, setEvent, 
      S3: {
         OBJECT_STORE_PREFIX:'s3ext/', 
         client: s3.client
      }
    })


## Licence
MIT

## Authors

importSaaS, a stealth startup that simplifies the SaaS journey for builders. 

Email `help@importsaas.com` to see how to self-host, share feedback, or to to say hello.
