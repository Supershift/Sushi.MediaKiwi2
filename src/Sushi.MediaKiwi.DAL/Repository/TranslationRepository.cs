using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <inheritdoc/>
    public class TranslationRepository : ITranslationRepository
    {
        private readonly IConnector<Translation> _connector;

        /// <summary>
        /// Creates a new instance of <see cref="TranslationRepository"/>.
        /// </summary>
        /// <param name="connector"></param>
        public TranslationRepository(IConnector<Translation> connector)
        {
            _connector = connector;
        }

        /// <inheritdoc/>
        public async Task DuplicateAsync(string baseLocaleId, string targetLocaleId)
        {
            var query = _connector.CreateQuery();
            query.AddParameter("@baseLocaleID", baseLocaleId);
            query.AddParameter("@targetLocaleID", targetLocaleId);
            query.SqlQuery = @"
INSERT INTO dbo.mk_Translations
(LocaleID
,Namespace
,TranslationKey
,Value
,IsNew)
SELECT @targetLocaleID, Namespace, TranslationKey, Value, 1
FROM mk_Translations AS base
WHERE LocaleID = @baseLocaleID
AND NOT EXISTS
(
	SELECT *
	FROM mk_Translations AS target
	WHERE target.LocaleID = @targetLocaleID
	AND target.Namespace = base.Namespace
	AND target.TranslationKey = base.TranslationKey
)";
            await _connector.ExecuteNonQueryAsync(query);
        }

        /// <inheritdoc/>
        public async Task InsertMissingAsync(string @namespace, string key, string defaultValue)
        {
            var query = _connector.CreateQuery();
            query.AddParameter("@namespace", @namespace);
            query.AddParameter("@key", key);
            query.AddParameter("@value", defaultValue);
            query.SqlQuery = @"
INSERT INTO dbo.mk_Translations
(LocaleID
,Namespace
,TranslationKey
,Value
,IsNew)
SELECT LocaleID, @namespace, @key, @value, 1
FROM mk_Locales
WHERE NOT EXISTS
(
	SELECT *
	FROM mk_Translations 
	WHERE mk_Locales.LocaleID = mk_Translations.LocaleID
	AND Namespace = @namespace
	AND TranslationKey = @key	
)";
            await _connector.ExecuteNonQueryAsync(query);
        }

        /// <inheritdoc/>
        public async Task<QueryListResult<Translation>> GetAllAsync(string? localeId, string? @namespace, string? key, string? value)
        {
            var query = _connector.CreateQuery();
            if (!string.IsNullOrWhiteSpace(localeId)) query.Add(x => x.LocaleId, localeId);
            if (!string.IsNullOrWhiteSpace(@namespace)) query.Add(x => x.Namespace, @namespace);
            if (!string.IsNullOrWhiteSpace(key)) query.Add(x => x.Key, key);
            if (!string.IsNullOrWhiteSpace(value)) query.AddLike(x => x.Value, value);
            query.AddOrder(x => x.Namespace);                
            query.AddOrder(x => x.Key);
            var result = await _connector.GetAllAsync(query);
            return result;
        }

        /// <inheritdoc/>
        public async Task<Translation?> GetAsync(string localeId, string @namespace, string key)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.LocaleId, localeId);
            query.Add(x => x.Namespace, @namespace);
            query.Add(x => x.Key, key);
            var result = await _connector.GetFirstAsync(query);
            return result;
        }

        /// <inheritdoc/>
        public async Task InsertAsync(Translation translation)
        {
            await _connector.InsertAsync(translation);
        }

        /// <inheritdoc/>
        public async Task UpdateAsync(Translation translation)
        {
            await _connector.UpdateAsync(translation);
        }

        /// <inheritdoc/>
        public async Task DeleteAsync(Translation translation)
        {
            await _connector.DeleteAsync(translation);
        }

        /// <inheritdoc/>
        public async Task<List<string?>> GetNamespacesAsync(string? localeId)
        {
            var query = _connector.CreateQuery();
            query.SqlQuery = "SELECT DISTINCT(Namespace) FROM mk_Translations";
            if(localeId != null)
            {
                query.SqlQuery += " WHERE LocaleId = @localeId";
                query.AddParameter("@localeId", localeId);
            }

            var result = await _connector.ExecuteSetAsync<string>(query);
            result = result.OrderBy(x => x).ToList();
            return result;
        }

        /// <inheritdoc/>
        public async Task<List<string?>> GetKeysAsync(string? localeId)
        {
            var query = _connector.CreateQuery();
            query.SqlQuery = "SELECT DISTINCT(TranslationKey) FROM mk_Translations";
            if (localeId != null)
            {
                query.SqlQuery += " WHERE LocaleId = @localeId";
                query.AddParameter("@localeId", localeId);
            }

            var result = await _connector.ExecuteSetAsync<string>(query);
            result = result.OrderBy(x => x).ToList();
            return result;
        }
    }
}
