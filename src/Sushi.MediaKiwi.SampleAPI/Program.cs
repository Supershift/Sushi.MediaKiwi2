using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.WebAPI;
using Sushi.MediaKiwi.WebAPI.Paging;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// get config
var config = builder.Configuration;
var connectionString = config.GetConnectionString("portal");
var addCORS = config.GetValue<bool>("AddCORS");

// Add services to the container.
var services = builder.Services;

// add CORS (only useful on servers that don't add CORS headers, like kestrel)
if (addCORS)
{
    services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    });
}

// add authentication, maybe move to MK?
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

services.AddControllers();
services.AddEndpointsApiExplorer();

// todo: move MK stuff to helper method
services.AddSwaggerGen(options =>
{
    // add documentation
    var apiFilename = $"{Assembly.GetAssembly(typeof(SectionController))?.GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, apiFilename));

    var webModelFilename = $"{Assembly.GetAssembly(typeof(SectionService))?.GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, webModelFilename));

    // add paging parameters
    options.OperationFilter<PagingSwaggerFilter>();
    options.OperationFilter<ContinuationSwaggerFilter>();

    // add docs for mediakiw
    options.SwaggerDoc("MediaKiwi", new OpenApiInfo { Title = "MediaKiwi" });
    options.EnableAnnotations();

    // add JWT bearer
    // add bearer token
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

services.AddMediaKiwiApi(connectionString);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {   
        options.SwaggerEndpoint("../swagger/MediaKiwi/swagger.json", "MediaKiwi");
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
