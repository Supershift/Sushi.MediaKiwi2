# Get Started
## About
This guide describes how to get started with your local development environment for the SampleAPI.
## Prerequisites
- Visual Studio 2022 or higher
- Registered user (contact project administrator)
## User secrets
Two projects require user secrets:
- Sushi.MediaKiwi.SampleAPI
- Sushi.MediaKiwi.DAL.ManualTests

Contact the project administrator to get the secrets.

Apply the secrets by right-clicking on a project and choosing 'Manage User Secrets'. The secrets should be added to the file that opens.
## Validate database access
Run Sushi.MediaKiwi.DAL.ManualTests to validate database access.
## Run SampleAPI
1. Right click the SampleAPI project and choose 'Set as Startup Project'. 
2. Press Ctrl-F5 to run the project.
3. Open https://localhost:7223/swagger in your browser

A Swagger UI page listing all available API methods should open.
## Test API call
All API calls require an authenticated user. To obtain an access token:
1. Open DEV environment in your browser (url can be provided by project administrator)
2. Inspect network calls
3. Sign in
4. Copy 'Authorization' header value from one of the API calls

To test API connectivity:
1. Go back to the Swagger UI page and click the 'Authorize' button
2. Paste the copied value in the 'Value' field and click 'Authorize'
3. Select definition 'SampleApi' in the top right corner
4. Open the GET /sample/ping method and click 'Try it out'
5. Click execute

The response should be a 200 status code.


