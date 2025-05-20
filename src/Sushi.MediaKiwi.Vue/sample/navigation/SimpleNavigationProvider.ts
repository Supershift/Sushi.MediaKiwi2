import { ObjectNavigationProvider, SimpleSection } from "@/navigation";

const sections: SimpleSection[] = [
  {
    id: "Home",
    name: "Home",
    icon: "$home",
    roles: [],
    items: [
      {
        id: "Home",
        name: "Home",
        icon: "$home",
        componentKey: "./views/Home.vue",
      },
    ],
  },
  {
    id: "Hotels",
    name: "Hotels",
    icon: "$hotel",
    roles: [],
    items: [
      {
        id: "HotelOverview",
        name: "Hotels",
        componentKey: "./views/Hotels/HotelsOverview.vue",
        layout: "custom-css-layout",
        children: [
          {
            id: "HotelEdit",
            name: "Hotel detail",
            componentKey: "./views/Hotels/HotelEdit.vue",
            parameterName: "hotelId",
            appendDivider: true,
          },
          {
            id: "RoomsGroup",
            name: "Rooms",
            parameterName: "hotelId",
            isGroup: true,
            children: [
              {
                id: "RoomTypesOverview",
                name: "Room types",
                componentKey: "./views/Hotels/RoomTypesOverview.vue",
                parameterName: "hotelId",
                children: [
                  {
                    id: "RoomTypesEdit",
                    name: "Room type detail",
                    componentKey: "./views/Hotels/RoomTypesEdit.vue",
                    parameterName: "roomTypeId",
                  },
                  {
                    id: "BoardTypesOverview",
                    name: "Board types",
                    componentKey: "./views/Hotels/BoardTypesOverview.vue",
                    parameterName: "roomTypeId",
                    children: [
                      {
                        id: "BoardTypeEdit",
                        name: "Board type detail",
                        componentKey: "./views/Hotels/BoardTypeEdit.vue",
                        parameterName: "boardTypeId",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "SunbedsGroup",
            name: "Sunbeds",
            parameterName: "hotelId",
            isGroup: true,
            children: [
              {
                id: "SunbedTypes",
                name: "Sunbed types",
                componentKey: "./views/Hotels/SunbedTypesOverview.vue",
                parameterName: "hotelId",
              },
            ],
          },
          {
            id: "HotelSendOffer",
            name: "Hotel Send Offer",
            componentKey: "./views/Hotels/HotelSendOffer.vue",
            parameterName: "hotelId",
          },
        ],
      },
      {
        id: "HotelOverview2",
        name: "Hotels zaken",
        children: [
          {
            id: "HotelEdit2",
            name: "Hotel zaak",
            componentKey: "./views/Hotels/HotelEdit.vue",
          },
          {
            id: "HotelEdit3",
            name: "Hotel zaak 2",
            componentKey: "./views/Hotels/HotelEdit.vue",
          },
        ],
      },
    ],
  },
  {
    id: "Customers",
    name: "Customers",
    roles: [],
    items: [
      {
        id: "CustomerOverview",
        name: "Customers",
        icon: "$customer",
        componentKey: "./views/Customers.vue",
        layout: "custom-css-layout",
      },
    ],
  },
  {
    id: "CRM",
    name: "CRM",
    roles: [],
    items: [
      {
        id: "Countries",
        name: "Countries",
        componentKey: "./views/Country/Countries.vue",
        children: [
          {
            id: "CountryEdit",
            name: "Country",
            componentKey: "./views/Country/CountryEdit.vue",
            parameterName: "countryId",
          },
        ],
      },
      {
        id: "CountriesEmpty",
        name: "Countries Empty state",
        componentKey: "./views/Country/CountriesEmpty.vue",
      },
      {
        id: "CountriesEmptyCustomActions",
        name: "Countries Empty state (custom)",
        componentKey: "./views/Country/CountriesEmptyCustomActions.vue",
      },
    ],
  },
  {
    id: "Account",
    name: "Account",
    icon: "symbols:person",
    roles: [],
    items: [
      {
        id: "Errors",
        name: "Errors",
        componentKey: "./views/Account/ErrorSamples.vue",
      },
      {
        id: "Filters",
        name: "Filters",
        componentKey: "./views/Demo/FiltersOverview.vue",
      },
      {
        id: "GetAccount",
        name: "Get Account",
        componentKey: "./views/Account/GetAccount.vue",
        children: [
          {
            id: "EditAccount",
            name: "Edit Account",
            componentKey: "./views/Account/EditAccount.vue",
            parameterName: "accountId",
          },
        ],
      },
    ],
  },
  {
    id: "Settings",
    name: "Settings",
    icon: "symbols:settings",
    roles: [],
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
    ],
  },
];

const provider = new ObjectNavigationProvider();
provider.SetTree(sections);

export default provider;
