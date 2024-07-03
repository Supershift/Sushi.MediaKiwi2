DELETE FROM [mediakiwi].[dbo].[mk_Translations]
WHERE [TranslationKey] in ('Select Filter intro', 'Radio Filter intro', 'searchFilterItemLabel', 'searchedFilterItemLabel', 'currentSearchFilterItemLabel', 'Loading filter...' )
