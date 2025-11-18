# CDT
**中文名稱：** 代碼檔3

| 欄位代號     | 中文欄名   | 英文欄名           | 程式欄名      | REACT欄名    | 型態         | Identity | PK  | Unique | FK  | 備註                                                                                         |
| ------------ | ---------- | ------------------ | ------------- | ------------ | ------------ | -------- | --- | ------ | --- | -------------------------------------------------------------------------------------------- |
| CDF00        | 大分類編碼 | major_category_no  | major_cat_no  | majorCatNo   | char(3)      |          |     | Y      | Y   | Value：CDF.CDF00，Display：CDF.CDF01，Condition：CDF.CDF00=CDT.CDF00                         |
| CDS00        | 中分類編碼 | mid_category_code  | mid_cat_code  | midCatCode   | char(3)      |          |     | Y      | Y   | Value：CDS.CDS00，Display：CDS.CDS01，Condition：CDS.CDF00=CDT.CDF00 AND CDS.CDS00=CDT.CDS00 |
| CDT00        | 細分類編碼 | sub_category_code  | subcat_code   | subcatCode   | char(3)      |          |     | Y      |     |                                                                                              |
| CDT01        | 編碼說明   | coding_description | code_desc     | codeDesc     | varchar(120) |          |     |        |     |                                                                                              |
| CRE_USERID   | 建檔人員   | created_by         | created_by    | createdBy    | varchar(10)  |          |     |        | Y   | Value：USERS.USERID，Display：USERS.USERNAME, Condition：USERS.USERID=CDT.CRE_USERID         |
| CRE_DTIME    | 建檔日期   | created_date       | created_date  | createdDate  | char(14)     |          |     |        |     |                                                                                              |
| UPD_USERID   | 修改人員   | modified_by        | modified_by   | modifiedBy   | varchar(10)  |          |     |        | Y   | Value：USERS.USERID，Display：USERS.USERNAME, Condition：USERS.USERID=CDT.UPD_USERID         |
| UPD_DTIME    | 修改日期   | modified_date      | modified_date | modifiedDate | char(14)     |          |     |        |     |                                                                                              |
| CDT02        | 備註       | remarks            | remark        | remark       | varchar(240) |          |     |        |     |                                                                                              |
| id           | 細分類序號 | id                 | id            | id           | bigint(8)    | Y        | Y   | Y      |     |                                                                                              |
| cds_id       | 中分類序號 | mid_category_id    | mid_cat_id    | midCatId     | bigint(8)    |          |     | Y      | Y   | Value：CDS.id，Condition：CDS.CDF00=CDT.CDF00 AND CDS.CDS00=CDT.CDS00                        |
| lock_version | 鎖定版本   | lock_version       | lock_ver      | lockVer      | bigint(8)    |          |     |        |     |                                                                                              |
| created_at   | 建立時間   | create_time        | created_time  | createdTime  | datetime(8)  |          |     |        |     |                                                                                              |
| updated_at   | 更新時間   | update_time        | update_time   | updateTime   | datetime(8)  |          |     |        |     |                                                                                              |
