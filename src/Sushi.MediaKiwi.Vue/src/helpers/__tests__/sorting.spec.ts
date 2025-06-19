import { SortDirection } from "@/models";
import { compareValues, sortArray, sortArrayByKey } from "../sorting"
import { DateTime } from "luxon";

type testFake={
    name: string;
    age: number;
}

describe("compareValues", () => {
    it("should return 0 for two null values", () => {
        expect(compareValues(null, null)).equals(0);
    });
    it("should return 1 for null and a value", () => {
        expect(compareValues(null, "test")).equals(1);
    });
    it("should return -1 for a value and null", () => {
        expect(compareValues("test", null)).equals(-1);
    });
    it("should return 0 for two undefined values", () => {
        expect(compareValues(undefined, undefined)).equals(0);
    });
    it("should return 1 for undefined and a value", () => {
        expect(compareValues(undefined, "test")).equals(1);
    });
    it("should return -1 for a value and undefined", () => {
        expect(compareValues("test", undefined)).equals(-1);
    });
    it("should return 0 for two equal strings", () => {
        expect(compareValues("test", "test")).equals(0);
    });
    it("should return 1 for a greater string", () => {
        expect(compareValues("test2", "test1")).equals(1);
    });
    it("should return -1 for a lesser string", () => {
        expect(compareValues("test1", "test2")).equals(-1);
    });
    it("should return 0 for two equal case-insensitive strings", () => {
        expect(compareValues("TEst", "test")).equals(0);
    });
    it("should return 1 for a greater case-insensitive string", () => {
        expect(compareValues("Test2", "test1")).equals(1);
    });
    it("should return -1 for a lesser case-insensitive string", () => {
        expect(compareValues("test1", "Test2")).equals(-1);
    });
    it("should return 0 for two equal numbers", () => {
        expect(compareValues(1, 1)).equals(0);
    });
    it("should return 1 for a greater number", () => {
        expect(compareValues(2, 1)).equals(1);
    });
    it("should return -1 for a lesser number", () => {
        expect(compareValues(1, 2)).equals(-1);
    });
    it("should return 0 for two equal DateTime objects", () => {
        const a = DateTime.fromISO("2023-10-01T00:00:00");
        const b = DateTime.fromISO("2023-10-01T00:00:00");
        expect(compareValues(a, b)).equals(0);
    });
    it("should return 1 for a greater DateTime object", () => {
        const a = DateTime.fromISO("2023-10-02T00:00:00");
        const b = DateTime.fromISO("2023-10-01T00:00:00");
        expect(compareValues(a, b)).equals(1);
    });
    it("should return -1 for a lesser DateTime object", () => {
        const a = DateTime.fromISO("2023-10-01T00:00:00");
        const b = DateTime.fromISO("2023-10-02T00:00:00");
        expect(compareValues(a, b)).equals(-1);
    });

});

describe("sortArray", () => {
    it("should sort an array of objects by a specified key in ascending order", () => {
        const array : testFake[] = [
            { name: "Charlie", age: 30 },
            { name: "Alice", age: 25 },
            { name: "Bob", age: 20 },
        ];
        const sortedArray = sortArray(array, x=>x.name, SortDirection.Asc);
        expect(sortedArray[0].name).equals("Alice");
        expect(sortedArray[1].name).equals("Bob");
        expect(sortedArray[2].name).equals("Charlie");
    });
    it("should sort an array of objects by a specified key in descending order", () => {
        const array : testFake[] = [
            { name: "Charlie", age: 30 },
            { name: "Alice", age: 25 },
            { name: "Bob", age: 20 },
        ];
        const sortedArray = sortArray(array, x=>x.name, SortDirection.Desc);
        expect(sortedArray[0].name).equals("Charlie");
        expect(sortedArray[1].name).equals("Bob");
        expect(sortedArray[2].name).equals("Alice");
    });
})

describe("sortArrayByKey", () => {
    it("should sort an array of objects by a specified key in ascending order", () => {
        const array : testFake[] = [
            { name: "Charlie", age: 30 },
            { name: "Alice", age: 25 },
            { name: "Bob", age: 20 },
        ];
        const sortedArray = sortArrayByKey(array, "age", SortDirection.Asc);
        expect(sortedArray[0].age).equals(20);
        expect(sortedArray[1].age).equals(25);
        expect(sortedArray[2].age).equals(30);
    });
})