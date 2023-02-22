import type { ISampleData } from './ISampleData'

export const SampleDataService = {
  GetAll(countryCode: string | undefined): ISampleData[] {
    
    let result = <ISampleData[]>[];
    for (let i = 1; i <= 10; i++) {
      let resultItem = <ISampleData>{
        id: i,
        name: `I am data ${i}`,
        countryCode: i % 3 == 0 ? 'BE' : 'NL',
        countryName: i % 3 == 0 ? 'België' : 'Nederland',
      }
      result.push(resultItem);
    }
    if (countryCode !== undefined) {
      result = result.filter(x => x.countryCode == countryCode);
    }
    return result;
  },
};
