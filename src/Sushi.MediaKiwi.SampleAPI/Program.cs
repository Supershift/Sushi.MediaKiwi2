using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Sushi.MediaKiwi.Services;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// get config
var config = builder.Configuration;
var connectionString = config.GetConnectionString("portal");

// Add services to the container.
var services = builder.Services;

services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyMethod());
});

services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer();

// todo: move MK stuff to helper method
services.AddSwaggerGen(options =>
{
    var webModelFilename = $"{Assembly.GetAssembly(typeof(Sushi.MediaKiwi.Services.SectionService)).GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, webModelFilename));

    options.SwaggerDoc("MediaKiwi", new OpenApiInfo { Title = "MediaKiwi" });

    options.EnableAnnotations();
});

services.AddMediaKiwiServices(connectionString);

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

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
