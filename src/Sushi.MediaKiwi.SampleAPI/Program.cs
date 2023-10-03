using Sushi.MediaKiwi.SampleAPI;
using Sushi.MediaKiwi.WebAPI;

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

services.AddControllers();
services.AddEndpointsApiExplorer();

services.AddSwaggerGen(options =>
{
    options.AddMediaKiwiSwagger();
});

// add mediakiwi API
services.AddMediaKiwiApi(defaultConnectionString: connectionString, 
    azureAdConfig: config.GetSection("AzureAd"), 
    autoMapperConfig: c=>c.AddProfile<Sushi.MediaKiwi.SampleAPI.Service.Model.AutoMapperProfile>(),
    adminRoles: new[] { "SuperAdmin", "Admin" } );

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
