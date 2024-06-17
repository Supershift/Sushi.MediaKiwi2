using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Testcontainers.MsSql;

namespace Sushi.MediaKiwi.SystemIntegrationTests.Supporting
{
    internal class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        private readonly string _connectionString;

        public CustomWebApplicationFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services
                    .AddAuthentication(defaultScheme: "TestScheme")
                    .AddScheme<AuthenticationSchemeOptions, AuthHandlerMock>(
                        "TestScheme",
                        options => { });

                // replace sql connection string provider
                services.Replace(
                    new ServiceDescriptor(
                        typeof(ConnectionStringProvider),
                        new ConnectionStringProvider(_connectionString)
                    )
                );
            });

            builder.UseEnvironment("Development");
        }
    }
}
