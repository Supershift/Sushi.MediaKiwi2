using System.Transactions;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Provides utility methods.
    /// </summary>
    public static class Utility
    {
        /// <summary>
        /// Creates a transactionscope with ReadCommitted Isolation, the same level as sql server
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
