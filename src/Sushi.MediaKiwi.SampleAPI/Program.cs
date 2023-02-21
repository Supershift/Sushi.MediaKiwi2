using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.WebAPI;
using Sushi.MediaKiwi.WebAPI.Paging;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// get config
var config = builder.Configuration;
var connectionString = config.GetConnectionString("portal");

// Add services to the container.
var services = builder.Services;
services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
services.AddEndpointsApiExplorer();

// todo: move MK stuff to helper method
services.AddSwaggerGen(options =>
{
    // add documentation
    var webModelFilename = $"{Assembly.GetAssembly(typeof(Sushi.MediaKiwi.Services.SectionService)).GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, webModelFilename));

    // add paging parameters
    options.OperationFilter<PagingSwaggerFilter>();

    // add docs for mediakiw
    options.SwaggerDoc("MediaKiwi", new OpenApiInfo { Title = "MediaKiwi" });

    options.EnableAnnotations();
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

app.UseAuthorization();

app.MapControllers();

app.Run();
