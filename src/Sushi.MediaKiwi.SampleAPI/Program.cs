using Microsoft.OpenApi.Models;
using Sushi.MediaKiwi.SampleAPI;
using Sushi.MediaKiwi.WebAPI;
using Sushi.MediaKiwi.Core;
using Sushi.MicroORM;

var builder = WebApplication.CreateBuilder(args);

// get config
var config = builder.Configuration;

/*
 * If portal in the connectionstring is null a secrets.json should be set
 * Example:
 * {
 *   "ConnectionStrings": {
 *     "portal": "Server=localhost;Initial Catalog=mediakiwi;Persist Security Info=False;Integrated Security=SSPI;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;"
 *   },
 *   "AddCORS":  true
 * }
 */
var connectionString = config.GetConnectionString("portal") ?? "";
var addCORS = config.GetValue<bool>("AddCORS");

// Add services to the container.
var services = builder.Services;

// add micro orm
services.AddMicroORM(new SqlServerConnectionString(connectionString, true));

// add CORS (only useful on servers that don't add CORS headers, like kestrel)
if (addCORS)
{
    services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    });
}

services.AddControllers();
services.AddEndpointsApiExplorer();

services.AddSwaggerGen(options =>
{
    options.AddMediaKiwiSwagger();
    options.SwaggerDoc("SampleApi", new OpenApiInfo { Title = "SampleApi" });
});

// add mediakiwi API
services.AddMediaKiwi(    
    azureAdConfig: config.GetSection("AzureAd"), 
    autoMapperConfig: c => c.AddProfile<Sushi.MediaKiwi.SampleAPI.Service.Model.AutoMapperProfile>(),
    authorizationOptions: options => {
        
        // Add custom authorization policies
        options.AddPolicy(Sushi.MediaKiwi.SampleAPI.Constants.CustomPolicyName, policy =>
        {
            policy.RequireRole(Sushi.MediaKiwi.SampleAPI.Constants.CustomRoleName, Sushi.MediaKiwi.WebAPI.Constants.AdminRoleName);
        });
    });

// add sample api depedencies
services.AddSampleApiServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.AddMediaKiwiSwaggerUI();
        options.SwaggerEndpoint("../swagger/SampleApi/swagger.json", "SampleApi");        
    });
}

app.UseHttpsRedirection();

// add CORS (only useful on servers that don't add CORS headers, like kestrel)
if (addCORS)
{
    app.UseCors();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// this exposes the program class for testing
public partial class Program { }