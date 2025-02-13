# MkTable

## Slots

Basic example of some the slots avaiable on the MkTable.

- header: Add markup above the entire component
- footer: Add markup below the entire component
- toolbar: Visible action slot for the MkToolbar
- overflowMenuActions: Add actions behind an overflow menu (kebab-menu)
- bulkActionBar: Add actions for when the bulk action bar appears
- prependTable: Add markup between the filterbar and table
- table: Replace the table with you're own component
- thead: Header for the table body using templating
- tbody: Body for the table body using templating
- emptyState: Add a custom component for the empty state
- toolbarTitle: Custom title
- contextmenu: Context menu slot

```tsx
<template>
<mk-table>
	<template #prependTable>
	<v-btn-toggle v-model="displayMode" variant="outlined" class="mr-2">
		<v-btn :value="1">List</v-btn>
		<v-btn :value="2">Grid</v-btn>
	</v-btn-toggle>
    </template>

    <template #table="{ data }">
      <ul>
        <li v-for="dataItem in data">
          {{ dataItem.name }}
        </li>
      </ul>
    </template>

    <template #toolbar>
		<!-- buttons available in the toolbar above the table -->
		<v-btn>Your custom button</v-btn>
    </template>

    <template #overflowMenuActions>
		<!-- list actions behind a <v-menu> component -->
		<v-list-item>Your custom button</v-list-item>
    </template>

    <template #thead>
		<!-- Table headers go here, you can use the default <th /> or <mk-th /> with some additional features -->
		<mk-th v-model:sorting="sorting" :sorting-options="{ id: 'name' }">{{ t("Name") }}</mk-th>
		<mk-th v-model:sorting="sorting" :sorting-options="{ id: 'created' }">{{ t("Created") }}</mk-th>
		<th>{{ t("Country") }}</th>
		<th>{{ t("Active") }}</th>
		<th>{{ t("SRP") }}</th>
		<th></th>
    </template>

    <template #tbody="{ dataItem }">
		<!-- Table cells go here, you can use the default <td /> or <mk-td /> with some additional features -->
		<td>{{ dataItem.name }}</td>
		<td>{{ formatDateTime(dataItem.created) }}</td>
		<mk-td @click.stop>
			<v-autocomplete
				v-model="dataItem.countryCode"
				:items="countryOptions"
				hide-details
				@update:model-value="(code: string) => onCountryCodeChanged(dataItem, code)"
			/>
		</mk-td>
		<mk-td :value="dataItem.isActive" />
		<td>{{ dataItem.srpFormatted }}</td>
		<mk-td :value="srpIcon(dataItem)" />
    </template>
  </mk-table>
</template>
```
