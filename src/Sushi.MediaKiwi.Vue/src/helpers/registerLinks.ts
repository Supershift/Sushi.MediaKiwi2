import { LinkMetaData } from "@/models/options/LinkMetaData";
import { createLinksFromMetaData } from "@/plugins/vuetify/linkMetaData";

export function registerLinks(metaData?: Array<LinkMetaData>) {
  if (metaData) {
    // register links
    createLinksFromMetaData(metaData);
  }
}
