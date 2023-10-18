import { describe, it, expect } from "vitest";
import { useValidationRules  } from "./../useValidationRules";
import { mountFunction } from "../../../test/utils/mount";

const { required, min, max, email, numeric } = useValidationRules();

describe("useValidationRules", () => {
    // required
    it.each([
      ["", required("", "This field is required!"), ["This field is required!"]],
      ["", required("", "Changed text!"), ["Changed text!"]],
      ["value", required("value", "This field is required!"), []],
    ])("Should validate if value is present", async (modelValue, rules, expected) => {

        // props for the validation component
        const props = { rules, modelValue }
        // wrapper for the validation component
        const wrapper = mountFunction(props)
        // check if the validity check works and that it returns the correct value
        expect(wrapper.vm.errorMessages).toEqual([])
        await wrapper.vm.validate()
        expect(wrapper.vm.errorMessages).toEqual(expected)
    });
    // minimal length text
    it.each([
      ["", min("", 5, "Minimal length is 5"), ["Minimal length is 5"]],
      ["", min("", 4, "Minimal length is 4"), ["Minimal length is 4"]],
      ["12345", min("12345", 4, "Minimal length is 4"), []],
    ])("Should validate if value is of minimal length", async (modelValue, rules, expected) => {

        // props for the validation component
        const props = { rules, modelValue }
        // wrapper for the validation component
        const wrapper = mountFunction(props)
        // check if the validity check works and that it returns the correct value
        expect(wrapper.vm.errorMessages).toEqual([])
        await wrapper.vm.validate()
        expect(wrapper.vm.errorMessages).toEqual(expected)
    });
    // maximum length text
    it.each([
      ["", max("", 5, "Maximum length is 5"), []],
      ["", max("", 4, "Maximum length is 4"), []],
      ["12345", max("12345", 4, "Maximum length is 4"), ["Maximum length is 4"]],
    ])("Should validate if value is of maximum length", async (modelValue, rules, expected) => {

        // props for the validation component
        const props = { rules, modelValue }
        // wrapper for the validation component
        const wrapper = mountFunction(props)
        // check if the validity check works and that it returns the correct value
        expect(wrapper.vm.errorMessages).toEqual([])
        await wrapper.vm.validate()
        expect(wrapper.vm.errorMessages).toEqual(expected)
    });
    // email
    it.each([
      ["", email("", "This is not a valid email address"), ["This is not a valid email address"]],
      ["", email("", "Changed text!"), ["Changed text!"]],
      ["a@b.com", email("a@b.com", "This is not a valid email address"), []],
    ])("Should validate if value is a valid email address", async (modelValue, rules, expected) => {

        // props for the validation component
        const props = { rules, modelValue }
        // wrapper for the validation component
        const wrapper = mountFunction(props)
        // check if the validity check works and that it returns the correct value
        expect(wrapper.vm.errorMessages).toEqual([])
        await wrapper.vm.validate()
        expect(wrapper.vm.errorMessages).toEqual(expected);
    });
    // numeric
    it.each([
      ["", numeric("", "This is not a numeric value"), ["This is not a numeric value"]],
      ["", numeric("", "Changed text!"), ["Changed text!"]],
      ["adawdad", numeric("adawdad", "This is not a numeric value"), ["This is not a numeric value"]],
    ])("Should validate if value is numeric", async (modelValue, rules, expected) => {

        // props for the validation component
        const props = { rules, modelValue }
        // wrapper for the validation component
        const wrapper = mountFunction(props)
        // check if the validity check works and that it returns the correct value
        expect(wrapper.vm.errorMessages).toEqual([])
        await wrapper.vm.validate()
        expect(wrapper.vm.errorMessages).toEqual(expected);
    });
});
