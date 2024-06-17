

-- REMOVE FK
ALTER TABLE [dbo].[mk_NavigationItems] DROP CONSTRAINT [FK_mk_NavigationItems_mk_NavigationItems]
GO

-- REMOVE PK
ALTER TABLE [dbo].[mk_NavigationItems] DROP CONSTRAINT [PK_mk_NavigationItems] WITH ( ONLINE = OFF )


-- ALTER FK COLUMN TYPE
ALTER TABLE mk_NavigationItems
ALTER COLUMN ParentNavigationItemID VARCHAR(64) NULL

-- CHANGE PK COLUMN TYPE
EXEC sp_rename 'dbo.mk_NavigationItems.NavigationItemID', 'NavigationItemID_Old', 'COLUMN';

ALTER TABLE mk_NavigationItems
ADD NavigationItemID VARCHAR(64) NULL

GO

UPDATE mk_NavigationItems
SET NavigationItemID = NavigationItemID_Old

ALTER TABLE mk_NavigationItems
ALTER COLUMN NavigationItemID VARCHAR(64) NOT NULL

go

-- ADD PK
ALTER TABLE [dbo].[mk_NavigationItems] ADD  CONSTRAINT [PK_mk_NavigationItems] PRIMARY KEY CLUSTERED 
(
	[NavigationItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]


-- ADD FK
ALTER TABLE [dbo].[mk_NavigationItems]  WITH CHECK ADD  CONSTRAINT [FK_mk_NavigationItems_mk_NavigationItems] FOREIGN KEY([ParentNavigationItemID])
REFERENCES [dbo].[mk_NavigationItems] ([NavigationItemID])
GO

-- DROP OLD ID column
ALTER TABLE mk_NavigationItems
DROP COLUMN NavigationItemID_Old

