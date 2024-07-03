using System.Transactions;

namespace Sushi.LanguageExtensions
{
    /// <summary>
    /// Provides utility methods.
    /// </summary>
    public static class TransactionUtility
    {
        /// <summary>
        /// Creates a transactionscope with ReadCommitted Isolation, sql server's default level.
        /// </summary>
        /// <returns>A transaction scope</returns>
        public static TransactionScope CreateTransactionScope()
        {
            var options = new TransactionOptions
            {
                IsolationLevel = IsolationLevel.ReadCommitted
            };

            return new TransactionScope(TransactionScopeOption.Required, options, TransactionScopeAsyncFlowOption.Enabled);
        }
    }
}
