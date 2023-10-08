S3 helper for storing state for @softwareasaservice/events

## installation

    # via yarn
    yarn add @softwareasaservice/eventsWorkflowS3
    
    # or via npm
    npm install --save @softwareasaservice/eventsworkflows3

## integrating 

    var {Events} = require("@softwareasaservice/events");
    var {setup, checkEvent, setEvent} = require('@softwareasaservice/eventsworkflows3');
    var events = new Events(user, {workflow, setup, checkEvent, setEvent, 
      S3: {
         OBJECT_STORE_PREFIX:'prefix-for-your-bucket/', 
         client: myS3Client  // should implement get(path), list(path), put(path, obj);
      }
    })


## Licence
MIT

## Authors

importSaaS, a stealth startup that simplifies the SaaS journey for builders. 

Email `help@importsaas.com` to see how to self-host, share feedback, or to to say hello.
