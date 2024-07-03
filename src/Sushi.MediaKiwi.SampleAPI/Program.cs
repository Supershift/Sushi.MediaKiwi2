using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Sushi.MediaKiwi.SampleAPI;
using Sushi.MediaKiwi.WebAPI;
using Sushi.MediaKiwi;
using Sushi.MicroORM;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// get config
var config = builder.Configuration;
var connectionString = config.GetConnectionString("portal")!;
var addCORS = config.GetValue<bool>("AddCORS");

// Add services to the container.
var services = builder.Services;

// add micro orm
services.AddMicroORM(new SqlServerConnectionString(connectionString, true), typeof(Program).Assembly);

// add fluent validators
services.AddValidatorsFromAssemblyContaining<CreateHotelRequestValidator>();

// add localization
services.AddLocalization();

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

// Define admin roles
var adminRoles = new[] { Sushi.MediaKiwi.WebAPI.Constants.AdminRoleName };

// add mediakiwi API
services.AddMediaKiwi(    
    azureAdConfig: config.GetSection("AzureAd"), 
    autoMapperConfig: c => c.AddProfile<Sushi.MediaKiwi.SampleAPI.Service.Model.AutoMapperProfile>(),
    authorizationOptions: options => {
        
        // Add authorization policies for admin roles
        options.AddPolicy(Sushi.MediaKiwi.WebAPI.Constants.AdminPolicyName, policy =>
        {
            policy.RequireRole(adminRoles);
        });

        // Add custom authorization policies
        options.AddPolicy(Sushi.MediaKiwi.SampleAPI.Constants.CustomPolicyName, policy =>
        {
            policy.RequireRole([Sushi.MediaKiwi.SampleAPI.Constants.CustomRoleName, Sushi.MediaKiwi.WebAPI.Constants.AdminRoleName ]);
        });
    });

// add sample api depedencies
services.AddSampleApiServices();

var app = builder.Build();

// add localization
var supportedCultures = new[] { "en-US", "nl" };
var localizationOptions = new RequestLocalizationOptions().SetDefaultCulture(supportedCultures[0])
    .AddSupportedCultures(supportedCultures)
    .AddSupportedUICultures(supportedCultures);

app.UseRequestLocalization(localizationOptions);

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