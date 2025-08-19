import { ObjectNavigationProvider, SimpleSection } from "@/navigation";

export const sections: SimpleSection[] = [
  {
    id: "HomeSection",
    name: "Home",
    icon: "$home",
    items: [
      {
        id: "HomeOverview",
        name: "Home",
        componentKey: "./home/views/Home.vue",
        icon: "$home",
      },
    ],
  },
  {
    id: "HotelsSection",
    name: "Hotels",
    icon: "symbols:apartment",
    items: [
      {
        id: "HotelOverview",
        name: "Hotels",
        componentKey: "./hotels/views/HotelsOverview.vue",
        icon: "$hotel",
        layout: "custom-css-layout",
        children: [
          {
            id: "HotelEdit",
            name: "Hotel detail",
            componentKey: "./hotels/views/HotelEdit.vue",
            parameterName: "hotelId",
            children: [
              {
                id: "RoomTypesOverview",
                name: "Room types",
                componentKey: "./hotels/views/RoomTypesOverview.vue",
                parameterName: "hotelId",
                children: [
                  {
                    id: "RoomTypesEdit",
                    name: "Room type detail",
                    componentKey: "./hotels/views/RoomTypesEdit.vue",
                    parameterName: "roomTypeId",
                    children: [
                      {
                        id: "BoardTypesOverview",
                        name: "Board types",
                        componentKey: "./hotels/views/BoardTypesOverview.vue",
                        parameterName: "roomTypeId",
                        children: [
                          {
                            id: "BoardTypeEdit",
                            name: "Board type detail",
                            componentKey: "./hotels/views/BoardTypeEdit.vue",
                            parameterName: "boardTypeId",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: "SunbedTypesOverview",
                name: "Sunbed types",
                componentKey: "./hotels/views/SunbedTypesOverview.vue",
                parameterName: "hotelId",
              },
              {
                id: "HotelSendOffer",
                name: "Hotel Send Offer",
                componentKey: "./hotels/views/HotelSendOffer.vue",
                parameterName: "hotelId",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "CustomersSection",
    name: "Customers",
    icon: "symbols:group",
    items: [
      {
        id: "CustomerOverview",
        name: "Customers",
        componentKey: "./customers/views/Customers.vue",
        icon: "$customer",
        layout: "custom-css-layout",
      },
    ],
  },
  {
    id: "CRMSection",
    name: "CRM",
    icon: "symbols:manage_accounts",
    items: [
      {
        id: "CountriesGroup",
        name: "Countries",
        children: [
          {
            id: "CountriesManual",
            name: "Countries manual",
            componentKey: "./countries/views/CountriesManualSort.vue",
            children: [
              {
                id: "CountryEdit",
                name: "Country",
                componentKey: "./countries/views/CountryEdit.vue",
                parameterName: "countryId",
              },
            ],
          },
          {
            id: "CountriesAuto",
            name: "Countries auto",
            componentKey: "./countries/views/CountriesAutoSort.vue",
          },
          {
            id: "CountriesServer",
            name: "Countries server",
            componentKey: "./countries/views/CountriesServer.vue",
          },
        ],
      },
      {
        id: "EmptyStates",
        name: "Empty states",
        children: [
          {
            id: "CountriesEmpty",
            name: "Countries (Empty state)",
            componentKey: "./countries/views/CountriesEmpty.vue",
          },
          {
            id: "CountriesEmptyCustomActions",
            name: "Countries (Custom Empty state)",
            componentKey: "./countries/views/CountriesEmptyCustomActions.vue",
          },
        ],
      },
    ],
  },
  {
    id: "AccountSection",
    name: "Account",
    icon: "symbols:person",
    items: [
      {
        id: "GetAccount",
        name: "Get Account",
        componentKey: "./crm/views/GetAccount.vue",
        children: [
          {
            id: "EditAccount",
            name: "Edit Account",
            componentKey: "./crm/views/EditAccount.vue",
            parameterName: "accountId",
          },
        ],
      },
    ],
  },
  {
    id: "SettingsSection",
    name: "Settings",
    icon: "symbols:settings",
    items: [
      {
        id: "MkLocaleOverview",
        name: "Localization",
        componentKey: "MkLocaleOverview",
        children: [
          {
            id: "MkLocaleEdit",
            name: "Edit Localization",
            componentKey: "MkLocaleEdit",
            parameterName: "localeId",
          },
        ],
      },
      {
        id: "MkStyleGuideView",
        name: "Style Guide",
        componentKey: "MkStyleGuideView",
      },
      {
        id: "ErrorsOverview",
        name: "Errors",
        componentKey: "./settings/views/ErrorSamples.vue",
      },
      {
        id: "FiltersOverview",
        name: "Filters",
        componentKey: "./settings/views/FiltersOverview.vue",
      },
    ],
  },
];

// build provider
const navigationProvider = new ObjectNavigationProvider();
navigationProvider.SetTree(sections);

export default navigationProvider;
