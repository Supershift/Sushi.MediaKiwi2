

-- REMOVE FK'S

ALTER TABLE [dbo].[mk_Views] DROP CONSTRAINT [FK_mk_Views_mk_Sections]

ALTER TABLE [dbo].[mk_SectionsRoles] DROP CONSTRAINT [FK_mk_SectionsRoles_mk_Sections]

ALTER TABLE [dbo].[mk_NavigationItems] DROP CONSTRAINT [FK_mk_NavigationItems_mk_Sections]

-- REMOVE PK's
/****** Object:  Index [PK_mk_Sections]    Script Date: 07/05/2024 11:19:47 ******/
ALTER TABLE [dbo].[mk_Sections] DROP CONSTRAINT [PK_mk_Sections] WITH ( ONLINE = OFF )

/****** Object:  Index [PK_mk_SectionsRoles]    Script Date: 07/05/2024 11:34:25 ******/
ALTER TABLE [dbo].[mk_SectionsRoles] DROP CONSTRAINT [PK_mk_SectionsRoles] WITH ( ONLINE = OFF )

-- REMOVE RELATION BETWEEEN VIEW AND SECTION
ALTER TABLE mk_Views
DROP COLUMN SectionID

-- CHANGE SECTIONID TYPE
EXEC sp_rename 'dbo.mk_Sections.SectionID', 'SectionID_Old', 'COLUMN';

ALTER TABLE mk_Sections
ADD SectionID VARCHAR(64) NULL

GO

UPDATE mk_Sections
SET SectionID = SectionID_Old

ALTER TABLE mk_Sections
ALTER COLUMN SectionID VARCHAR(64) NOT NULL

GO

-- RECREATE PRIMARY KEY sections

/****** Object:  Index [PK_mk_Sections]    Script Date: 07/05/2024 11:19:49 ******/
ALTER TABLE [dbo].[mk_Sections] ADD  CONSTRAINT [PK_mk_Sections] PRIMARY KEY CLUSTERED 
(
	[SectionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]


-- CHANGE FOREIGN KEY COLUMN TYPES
ALTER TABLE mk_SectionsRoles
ALTER COLUMN SectionID VARCHAR(64) NOT NULL

ALTER TABLE mk_NavigationItems
ALTER COLUMN SectionID VARCHAR(64) NOT NULL

-- RECREATE FOREIGN KEYS
ALTER TABLE [dbo].[mk_SectionsRoles]  WITH CHECK ADD  CONSTRAINT [FK_mk_SectionsRoles_mk_Sections] FOREIGN KEY([SectionID])
REFERENCES [dbo].[mk_Sections] ([SectionID])
ON UPDATE CASCADE
ON DELETE CASCADE

ALTER TABLE [dbo].[mk_NavigationItems]  WITH CHECK ADD  CONSTRAINT [FK_mk_NavigationItems_mk_Sections] FOREIGN KEY([SectionID])
REFERENCES [dbo].[mk_Sections] ([SectionID])
ON UPDATE CASCADE

-- RECREATE PRIMARY KEY section roles
/****** Object:  Index [PK_mk_SectionsRoles]    Script Date: 07/05/2024 11:34:27 ******/
ALTER TABLE [dbo].[mk_SectionsRoles] ADD  CONSTRAINT [PK_mk_SectionsRoles] PRIMARY KEY CLUSTERED 
(
	[SectionID] ASC,
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]

-- DROP OLD SectionID column
ALTER TABLE mk_Sections
DROP COLUMN SectionID_Old

-- UPDATE ADMIN section
UPDATE mk_Sections
SET SectionID = 'Admin'
WHERE SectionID = '1'

