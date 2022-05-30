## lambda-clipper
Simple Node JS clipper function for DigitalOcean Functions.

### Setup
1. Deploy in DO Functions service.
2. Set ```USER_TOKEN``` env var.

### Usage
Make request ```<path-to-app>/clipper/clip?url=YOUR-URL``` with header ```x-user-id=USER_TOKEN```.