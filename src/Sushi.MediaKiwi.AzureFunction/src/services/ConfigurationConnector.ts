import { getSection } from "@/helpers/envHelper";
import { Configuration } from "@/models/Configuration";

export class ConfigurationConnector {
  Get(sections: string[] = []): Configuration {
    // Fetch the MediaKiwi section by default
    sections.push("MediaKiwi");

    // Get Values from process.env with the prefixes
    let result = {} as Configuration;

    // Fetch each section from the configuration
    sections.forEach((section) => {
      const sectionValues = getSection(section);
      result = { ...result, ...sectionValues };
    });

    return { ...result };
  }
}
