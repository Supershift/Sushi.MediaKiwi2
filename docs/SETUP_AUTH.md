# How to setup authentication

MediaKiwi2 uses Azure Entra ID's Role Based Authenticaion (RBAC) for user management.

To setup authentication, you need to create a new Azure AD app registration and assign the necessary roles to the users.

## Create a new Azure AD app registration

1. Go to the Azure portal and navigate to Entra ID.
1. Click on "App registrations" and then "New registration".
1. Enter a name for the app registration.
1. Choose the account types you want to support. When not sure, choose "Accounts in this organizational directory only".
1. Click "Register".

## Setup redirect URI

1. Go to the app registration you just created.
1. Click on "Authentication" and then "Add a platform".						
1. Choose Single-page application.
1. Enter the following redirect URI's
	- https://{your-domain}/signIn
	- https://{your-domain}/loginRedirect
	- https://{your-domain}/logoutRedirect
1. Select both ID and Access tokens

## Expose an API

1. Click on "Expose an API"
1. Click on "Add" next to "Application ID URI"
1. The default suggestion is ok, click on "Save"
1. Click on "Add a scope"
1. Enter the following values
	- Scope name: api://<application-id>/access_via_approle_assignments
	- Who can consent: When not sure, choose "Admins and users"
	- Admin consent display name: Access the application on behalf of the signed-in user
	- Admin consent description: Allows the app to access the app on behalf of the signed-in user	
	- State: Enabled
1. Click on "Add Scope"

## Add app roles

1. Click on "App Roles"
1. Click on "Create app role"
1. Add at least the following role. You can define your own additional roles if desired
	- Display name: Admin
	- Allowed member types: User/Groups
	- Value: Admin
	- Description: Admins have full access to the application
	- Enabled: Yes

## Restrict access to application

1. In EntraID, go to "Enterprise applications"
1. Choose your application
1. Click 'Properties'			
1. Set "Assignment required" to "Yes"
1. Set "Visible to users" to "No"

## Assign users to roles
1. In the Enterprise application, click on "Users and groups"
1. Click on "Add user/group"
1. Select users or groups you want to add
1. Select the desired role
1. Click assign

You can assign multiple roles to a user by repeating the steps above and choosing different roles.

## Add config to MediaKiwi

Go the the overview page of your app registration.

Set the following config values in your MediaKiwi API application:
- AzureAd:Instance "https://login.microsoftonline.com/"
- AzureAd:TenantId "Directory (tenant) ID"
- AzureAd:ClientId "Application (client) ID"