import { getSection } from "@/helpers/env-helper";
import { Configuration } from "@/models/Configuration";

export class ConfigurationConnector {
  Get(sections: string[] = []): Configuration {
    sections.push("MediaKiwi");

    // Get Values from process.env with the prefixes
    let result = {} as Configuration;

    sections.forEach((section) => {
      const sectionValues = getSection(section);
      result = { ...result, ...sectionValues };
    });

    return { ...result };
  }
}
