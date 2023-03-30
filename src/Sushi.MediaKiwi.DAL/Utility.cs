using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Sushi.MediaKiwi.DAL
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
