/**
 * 代碼維護欄位驗證
 * 
 * 符合規格：3.4 欄位驗證與對照
 * - 必填欄位驗證
 * - 長度限制驗證
 * - 格式驗證
 * - 唯一性驗證（前端提示）
 * 
 * 建立日期: 2025/11/15
 * 最後更新: 2025/11/15
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * 驗證大分類
 */
export function validateMajorCategory(
  majorCatNo: string,
  majorCatName: string,
  existingCodes?: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  // 必填欄位驗證
  if (!majorCatNo || majorCatNo.trim() === "") {
    errors.push({
      field: "majorCatNo",
      message: "大分類編碼為必填欄位",
    });
  }

  if (!majorCatName || majorCatName.trim() === "") {
    errors.push({
      field: "majorCatName",
      message: "大分類名稱為必填欄位",
    });
  }

  // 長度限制驗證
  if (majorCatNo && majorCatNo.length !== 3) {
    errors.push({
      field: "majorCatNo",
      message: "大分類編碼必須為 3 字元",
    });
  }

  if (majorCatName && majorCatName.length > 120) {
    errors.push({
      field: "majorCatName",
      message: "大分類名稱不得超過 120 字元",
    });
  }

  // 格式驗證（代號只能包含英數字）
  if (majorCatNo && !/^[A-Za-z0-9]+$/.test(majorCatNo)) {
    errors.push({
      field: "majorCatNo",
      message: "大分類編碼只能包含英數字",
    });
  }

  // 唯一性驗證（前端提示）
  if (majorCatNo && existingCodes && existingCodes.includes(majorCatNo)) {
    errors.push({
      field: "majorCatNo",
      message: "大分類編碼已存在，請使用其他編碼",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 驗證中分類
 */
export function validateMidCategory(
  midCatCode: string,
  codeDesc: string,
  majorCatNo: string,
  existingCodes?: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  // 必填欄位驗證
  if (!midCatCode || midCatCode.trim() === "") {
    errors.push({
      field: "midCatCode",
      message: "中分類編碼為必填欄位",
    });
  }

  if (!codeDesc || codeDesc.trim() === "") {
    errors.push({
      field: "codeDesc",
      message: "編碼說明為必填欄位",
    });
  }

  if (!majorCatNo || majorCatNo.trim() === "") {
    errors.push({
      field: "majorCatNo",
      message: "大分類編碼為必填欄位",
    });
  }

  // 長度限制驗證
  if (midCatCode && midCatCode.length !== 3) {
    errors.push({
      field: "midCatCode",
      message: "中分類編碼必須為 3 字元",
    });
  }

  if (codeDesc && codeDesc.length > 120) {
    errors.push({
      field: "codeDesc",
      message: "編碼說明不得超過 120 字元",
    });
  }

  // 格式驗證（代號只能包含英數字）
  if (midCatCode && !/^[A-Za-z0-9]+$/.test(midCatCode)) {
    errors.push({
      field: "midCatCode",
      message: "中分類編碼只能包含英數字",
    });
  }

  // 唯一性驗證（前端提示）
  if (midCatCode && existingCodes && existingCodes.includes(midCatCode)) {
    errors.push({
      field: "midCatCode",
      message: "中分類編碼已存在，請使用其他編碼",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 驗證細分類
 */
export function validateSubCategory(
  subcatCode: string,
  codeDesc: string,
  majorCatNo: string,
  midCatCode: string,
  existingCodes?: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  // 必填欄位驗證
  if (!subcatCode || subcatCode.trim() === "") {
    errors.push({
      field: "subcatCode",
      message: "細分類編碼為必填欄位",
    });
  }

  if (!codeDesc || codeDesc.trim() === "") {
    errors.push({
      field: "codeDesc",
      message: "編碼說明為必填欄位",
    });
  }

  if (!majorCatNo || majorCatNo.trim() === "") {
    errors.push({
      field: "majorCatNo",
      message: "大分類編碼為必填欄位",
    });
  }

  if (!midCatCode || midCatCode.trim() === "") {
    errors.push({
      field: "midCatCode",
      message: "中分類編碼為必填欄位",
    });
  }

  // 長度限制驗證
  if (subcatCode && subcatCode.length !== 3) {
    errors.push({
      field: "subcatCode",
      message: "細分類編碼必須為 3 字元",
    });
  }

  if (codeDesc && codeDesc.length > 120) {
    errors.push({
      field: "codeDesc",
      message: "編碼說明不得超過 120 字元",
    });
  }

  // 格式驗證（代號只能包含英數字）
  if (subcatCode && !/^[A-Za-z0-9]+$/.test(subcatCode)) {
    errors.push({
      field: "subcatCode",
      message: "細分類編碼只能包含英數字",
    });
  }

  // 唯一性驗證（前端提示）
  if (subcatCode && existingCodes && existingCodes.includes(subcatCode)) {
    errors.push({
      field: "subcatCode",
      message: "細分類編碼已存在，請使用其他編碼",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 驗證備註欄位
 */
export function validateRemark(remark?: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (remark && remark.length > 240) {
    errors.push({
      field: "remark",
      message: "備註不得超過 240 字元",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

