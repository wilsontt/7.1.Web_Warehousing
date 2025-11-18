# CDF
**中文名稱：** 代碼檔1

| 欄位代號     | 中文欄名   | 英文欄名            | 程式欄名       | REACT欄名    | 型態         | Identity | PK  | Unique | FK  | 備註 |
| ------------ | ---------- | ------------------- | -------------- | ------------ | ------------ | -------- | --- | ------ | --- | ---- |
| CDF00        | 大分類編碼 | major_category_no   | major_cat_no   | majorCatNo   | char(3)      |          |     | Y      |     |      |
| CDF01        | 大分類名稱 | major_category_name | major_cat_name | majorCatName | varchar(120) |          |     |        |     |      |
| CRE_USERID   | 建檔人員   | created_by          | created_by     | createdBy    | varchar(10)  |          |     |        |     |      |
| CRE_DTIME    | 建檔日期   | created_date        | created_date   | createdDate  | char(14)     |          |     |        |     |      |
| UPD_USERID   | 修改人員   | modified_by         | modified_by    | modifiedBy   | varchar(10)  |          |     |        |     |      |
| UPD_DTIME    | 修改日期   | modified_date       | modified_date  | modifiedDate | char(14)     |          |     |        |     |      |
| id           | 大分類序號 | major_category_id   | major_cat_id   | majorCatId   | bigint(8)    | Y        | Y   | Y      |     |      |
| lock_version | 鎖定版本   | lock_version        | lock_ver       | lockVer      | bigint(8)    |          |     |        |     |      |
| created_at   | 建立時間   | create_time         | created_time   | createdTime  | datetime(8)  |          |     |        |     |      |
| updated_at   | 更新時間   | update_time         | update_time    | updateTime   | datetime(8)  |          |     |        |     |      |
| PageIndex    | 頁索引     | page_index          |                | pageIndex    | int(4)       |          |     |        |     |      |
