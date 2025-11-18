import { z } from "zod";

// 正體中文錯誤訊息對照表
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  let message: string;

  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "undefined") {
        message = "此欄位為必填";
      } else {
        message = `預期為 ${issue.expected}，但收到 ${issue.received}`;
      }
      break;
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        message = "請輸入有效的電子郵件地址";
      } else if (issue.validation === "url") {
        message = "請輸入有效的網址";
      } else {
        message = "字串格式無效";
      }
      break;
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        message = `至少需要 ${issue.minimum} 個字元`;
      } else if (issue.type === "number") {
        message = `數值必須大於或等於 ${issue.minimum}`;
      } else {
        message = "輸入值太小";
      }
      break;
    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        message = `最多只能輸入 ${issue.maximum} 個字元`;
      } else if (issue.type === "number") {
        message = `數值必須小於或等於 ${issue.maximum}`;
      } else {
        message = "輸入值太大";
      }
      break;
    default:
      message = ctx.defaultError;
  }

  return { message };
};

// 設定全域錯誤訊息對照表
z.setErrorMap(customErrorMap);

// 登入表單驗證 Schema
export const loginSchema = z.object({
  username: z
    .string({
      required_error: "帳號為必填欄位",
      invalid_type_error: "帳號必須為文字",
    })
    .min(1, "帳號為必填欄位")
    .trim()
    .refine((val) => val.length > 0, {
      message: "帳號為必填欄位",
    }),
  password: z
    .string({
      required_error: "密碼為必填欄位",
      invalid_type_error: "密碼必須為文字",
    })
    .min(1, "密碼為必填欄位")
    .refine((val) => val.trim().length > 0, {
      message: "密碼為必填欄位",
    }),
});

// 匯出型別
export type LoginFormData = z.infer<typeof loginSchema>;

