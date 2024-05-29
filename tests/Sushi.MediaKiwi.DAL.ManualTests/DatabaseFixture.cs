using System.Reflection;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.SqlServer.Dac;
using Sushi.MediaKiwi.DAL;
using Sushi.MicroORM;
using Testcontainers.MsSql;
using Xunit.Extensions.AssemblyFixture;

[assembly: TestFramework(AssemblyFixtureFramework.TypeName, AssemblyFixtureFramework.AssemblyName)]
namespace Sushi.MediaKiwi.IntegrationTests
{
    public class DatabaseFixture : IAsyncLifetime
    {
        private readonly MsSqlContainer _msSqlContainer;
        private readonly string dbName = "mediakiwi";

        public DatabaseFixture()
        {
            _msSqlContainer = new MsSqlBuilder().Build();
        }

        public async Task InitializeAsync()
        {
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
                connectionString = _msSqlContainer.GetConnectionString();

                // import bacpac
                var package = BacPackage.Load("TestValues/mediakiwi.bacpac");
                var dacService = new DacServices(connectionString);
                dacService.ImportBacpac(package, dbName, cts.Token);

                // prepare connection string to use the database
                var connectionStringBuilder = new SqlConnectionStringBuilder(_msSqlContainer.GetConnectionString());
                connectionStringBuilder.InitialCatalog = dbName;
                connectionString = connectionStringBuilder.ToString();
            }

            InitializeServices(configuration, connectionString);
        }

        private void InitializeServices(IConfigurationRoot configuration, string connectionString)
        {
            // create service collection
            IServiceCollection serviceCollection = new ServiceCollection();

            // add micro orm
            serviceCollection.AddMicroORM(new SqlServerConnectionString(connectionString, true));

            // add mediakiwi dal
            serviceCollection.AddMediaKiwiDAL();

            // build service provider
            Services = serviceCollection.BuildServiceProvider();
        }

        public async Task DisposeAsync()
        {
            await _msSqlContainer.DisposeAsync();
        }

        public ServiceProvider Services { get; private set; } = null!;
    }
}
