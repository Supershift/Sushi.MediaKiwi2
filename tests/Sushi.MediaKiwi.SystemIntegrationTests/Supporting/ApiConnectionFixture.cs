using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.SqlServer.Dac;
using System.Net.Http.Headers;
using System.Reflection;
using Testcontainers.MsSql;
using Xunit.Extensions.AssemblyFixture;

[assembly: TestFramework(AssemblyFixtureFramework.TypeName, AssemblyFixtureFramework.AssemblyName)]
namespace Sushi.MediaKiwi.SystemIntegrationTests.Supporting
{
    /// <summary>
    /// Provides all the necessary setup for the API connection tests.
    /// </summary>
    public class ApiConnectionFixture : IAsyncLifetime
    {
        private readonly MsSqlContainer _msSqlContainer;
        private readonly string dbName = "mediakiwi";
        private HttpClient? _client;

        public ApiConnectionFixture()
        {
            _msSqlContainer = new MsSqlBuilder().Build();
        }

        public async Task InitializeAsync()
        {
            // setup database
            var configuration = new ConfigurationBuilder()
                .AddUserSecrets(Assembly.GetExecutingAssembly(), optional: true)
                .AddEnvironmentVariables()
                .Build();

            var dbFixtureConfig = configuration.GetSection("DatabaseFixture")!;
            bool useDocker = bool.Parse(dbFixtureConfig["UseDocker"] ?? "true");
            string connectionString = configuration.GetConnectionString("portal")!;

            if (useDocker)
            {
                // start container
                using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(5));
                await _msSqlContainer.StartAsync();
                var bacpacImportConnectionString = _msSqlContainer.GetConnectionString();

                // import bacpac
                var package = BacPackage.Load("TestValues/mediakiwi.bacpac");
                var dacService = new DacServices(bacpacImportConnectionString);
                dacService.ImportBacpac(package, dbName, cts.Token);

                // prepare connection string to use the database
                var connectionStringBuilder = new SqlConnectionStringBuilder(_msSqlContainer.GetConnectionString());
                connectionStringBuilder.InitialCatalog = dbName;
                connectionString = connectionStringBuilder.ToString();
            }

            // create web application factory
            var factory = new CustomWebApplicationFactory(connectionString);

            // create client
            _client = factory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(scheme: "TestScheme");
        }

        internal HttpClient GetClient()
        {
            if (_client == null)
                throw new Exception("Fixture not initialized. Inject using AssemblyFixture.");

            return _client;
        }

        internal ApiConnector GetConnector()
        {
            return new ApiConnector(GetClient());
        }

        public async Task DisposeAsync()
        {
            await _msSqlContainer.DisposeAsync();
        }
    }
}
