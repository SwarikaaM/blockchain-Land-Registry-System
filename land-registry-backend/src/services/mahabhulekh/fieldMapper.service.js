// src/services/mahabhulekh/fieldMapper.service.js

class FieldMapper {
  mapToMahabhulekh(input) {
    return {
      districtValue: input.districtValue,
      talukaValue: input.talukaValue,
      villageValue: input.villageValue,
      fullSurveyInput: input.fullSurveyInput,
      mobile: input.mobile || "9999999999"
    };
  }
}

module.exports = new FieldMapper();