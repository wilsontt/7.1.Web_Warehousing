"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ThreeColumnLayout from "@/components/layouts/ThreeColumnLayout";
import CodesToolbar from "@/components/codes/CodesToolbar";
import MajorCategoryList from "@/components/codes/MajorCategoryList";
import MidCategoryList from "@/components/codes/MidCategoryList";
import SubCategoryList from "@/components/codes/SubCategoryList";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SearchDialog from "@/components/codes/SearchDialog";
import { getCodesTree } from "@/lib/api/codes";
import type {
  MajorCategory,
  MidCategory,
  SubCategory,
  CodesTreeResponse,
  BatchSaveRequest,
} from "@/lib/types/codes";
import type {
  MajorCategoryWithEdit,
  MidCategoryWithEdit,
  SubCategoryWithEdit,
  EditStatus,
} from "@/lib/types/codesEdit";
import { batchSaveCodes } from "@/lib/api/codes";
import {
  validateMajorCategory,
  validateMidCategory,
  validateSubCategory,
  validateRemark,
} from "@/lib/validation/codesValidation";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

export default function CodesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasSelectedMajor, setHasSelectedMajor] = useState(false);
  const [hasSelectedMid, setHasSelectedMid] = useState(false);
  const [hasSelectedRow, setHasSelectedRow] = useState(false);
  const [hasPendingCreate, setHasPendingCreate] = useState(false);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [majorCategories, setMajorCategories] = useState<MajorCategoryWithEdit[]>([]);
  const [midCategories, setMidCategories] = useState<MidCategoryWithEdit[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryWithEdit[]>([]);

  const [selectedMajorIndex, setSelectedMajorIndex] = useState<number | null>(null);
  const [selectedMidIndex, setSelectedMidIndex] = useState<number | null>(null);
  const [selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<MajorCategory | null>(null);
  const [selectedMid, setSelectedMid] = useState<MidCategory | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmVariant?: "primary" | "danger";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [pendingMajorSelect, setPendingMajorSelect] = useState<{
    category: MajorCategory;
    index: number;
  } | null>(null);
  const [pendingMidSelect, setPendingMidSelect] = useState<{
    category: MidCategory;
    index: number;
  } | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response: CodesTreeResponse = await getCodesTree();
      setMajorCategories(
        response.majorCategories.map((cat) => ({
          ...cat,
          _editStatus: null,
        }))
      );
      setMidCategories(
        response.midCategories.map((cat) => ({
          ...cat,
          _editStatus: null,
        }))
      );
      setSubCategories(
        response.subCategories.map((cat) => ({
          ...cat,
          _editStatus: null,
        }))
      );
    } catch (error) {
      console.error("載入代碼資料失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (hasUnsavedChanges) {
        const shouldLeave = window.confirm(
          "您有未儲存的變更，是否要離開此頁面？"
        );
        if (!shouldLeave) {
          router.push(window.location.pathname);
          throw new Error("Route change cancelled");
        }
      }
    };

    return () => {};
  }, [hasUnsavedChanges, router]);

  const filteredMidCategories = useMemo(() => {
    if (!selectedMajor) return [];
    return midCategories.filter(
      (mid) =>
        mid.majorCatNo === selectedMajor.majorCatNo ||
        mid._editStatus === "pendingCreate"
    );
  }, [midCategories, selectedMajor]);

  const filteredSubCategories = useMemo(() => {
    if (!selectedMajor || !selectedMid) return [];
    return subCategories.filter(
      (sub) =>
        (sub.majorCatNo === selectedMajor.majorCatNo &&
          sub.midCatCode === selectedMid.midCatCode) ||
        sub._editStatus === "pendingCreate"
    );
  }, [subCategories, selectedMajor, selectedMid]);

  const checkHasUnsavedChanges = useMemo(() => {
    const hasPendingMajor =
      majorCategories.some(
        (cat) =>
          cat._editStatus === "pendingCreate" ||
          cat._editStatus === "pendingUpdate" ||
          cat._editStatus === "pendingDelete"
      ) || false;
    const hasPendingMid =
      midCategories.some(
        (cat) =>
          cat._editStatus === "pendingCreate" ||
          cat._editStatus === "pendingUpdate" ||
          cat._editStatus === "pendingDelete"
      ) || false;
    const hasPendingSub =
      subCategories.some(
        (cat) =>
          cat._editStatus === "pendingCreate" ||
          cat._editStatus === "pendingUpdate" ||
          cat._editStatus === "pendingDelete"
      ) || false;
    return hasPendingMajor || hasPendingMid || hasPendingSub;
  }, [majorCategories, midCategories, subCategories]);

  useEffect(() => {
    setHasUnsavedChanges(checkHasUnsavedChanges);
    setHasPendingCreate(
      majorCategories.some((cat) => cat._editStatus === "pendingCreate") ||
        midCategories.some((cat) => cat._editStatus === "pendingCreate") ||
        subCategories.some((cat) => cat._editStatus === "pendingCreate")
    );
  }, [checkHasUnsavedChanges, majorCategories, midCategories, subCategories]);

  const handleMajorDataChange = (index: number, field: string, value: string) => {
    setMajorCategories(
      majorCategories.map((cat, i) => {
        if (i === index) {
          const updated = { ...cat, [field]: value };
          if (cat._editStatus !== "pendingCreate" && cat._editStatus !== "pendingDelete") {
            updated._editStatus = "pendingUpdate";
          }
          return updated;
        }
        return cat;
      })
    );
  };

  const handleMidDataChange = (index: number, field: string, value: string | number) => {
    setMidCategories(
      midCategories.map((cat, i) => {
        if (i === index) {
          const updated = { ...cat, [field]: value };
          if (cat._editStatus !== "pendingCreate" && cat._editStatus !== "pendingDelete") {
            updated._editStatus = "pendingUpdate";
          }
          return updated;
        }
        return cat;
      })
    );
  };

  const handleSubDataChange = (index: number, field: string, value: string) => {
    setSubCategories(
      subCategories.map((cat, i) => {
        if (i === index) {
          const updated = { ...cat, [field]: value };
          if (cat._editStatus !== "pendingCreate" && cat._editStatus !== "pendingDelete") {
            updated._editStatus = "pendingUpdate";
          }
          return updated;
        }
        return cat;
      })
    );
  };

  const executeMajorSelect = (category: MajorCategory, index: number) => {
    setSelectedMajorIndex(index);
    setSelectedMajor(category);
    setHasSelectedMajor(true);
    setSelectedMidIndex(null);
    setSelectedMid(null);
    setHasSelectedMid(false);
    setSelectedSubIndex(null);
  };

  const handleMajorSelect = (category: MajorCategory, index: number) => {
    if (selectedMajor?.majorCatId === category.majorCatId) {
      return;
    }
    if (hasUnsavedChanges) {
      setPendingMajorSelect({ category, index });
      setConfirmDialog({
        isOpen: true,
        title: "確認切換",
        message: "您有未儲存的變更，是否要放棄？",
        onConfirm: () => {
          executeMajorSelect(category, index);
          setHasUnsavedChanges(false);
          setHasPendingCreate(false);
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          setPendingMajorSelect(null);
        },
        onCancel: () => {
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          setPendingMajorSelect(null);
        },
      });
    } else {
      executeMajorSelect(category, index);
    }
  };

  const executeMidSelect = (category: MidCategory, index: number) => {
    setSelectedMidIndex(index);
    setSelectedMid(category);
    setHasSelectedMid(true);
    setSelectedSubIndex(null);
  };

  const handleMidSelect = (category: MidCategory, index: number) => {
    if (selectedMid?.midCatId === category.midCatId) {
      return;
    }
    if (hasUnsavedChanges) {
      setPendingMidSelect({ category, index });
      setConfirmDialog({
        isOpen: true,
        title: "確認切換",
        message: "您有未儲存的變更，是否要放棄？",
        onConfirm: () => {
          executeMidSelect(category, index);
          setHasUnsavedChanges(false);
          setHasPendingCreate(false);
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          setPendingMidSelect(null);
        },
        onCancel: () => {
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          setPendingMidSelect(null);
        },
      });
    } else {
      executeMidSelect(category, index);
    }
  };

  const handleSubSelect = (category: SubCategory, index: number) => {
    setSelectedSubIndex(index);
    setHasSelectedRow(true);
  };

  const generateTempId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddMajor = () => {
    if (hasPendingCreate) {
      return;
    }

    const newMajor: MajorCategoryWithEdit = {
      majorCatId: 0,
      id: 0,
      majorCatNo: "",
      majorCatName: "",
      _editStatus: "pendingCreate",
      _tempId: generateTempId(),
    };

    setMajorCategories([...majorCategories, newMajor]);
  };

  const handleAddMid = () => {
    if (!selectedMajor) {
      return;
    }
    if (hasPendingCreate) {
      return;
    }

    const newMid: MidCategoryWithEdit = {
      midCatId: 0,
      majorCatId: selectedMajor.majorCatId,
      majorCatNo: selectedMajor.majorCatNo,
      midCatCode: "",
      codeDesc: "",
      _editStatus: "pendingCreate",
      _tempId: generateTempId(),
    };

    setMidCategories([...midCategories, newMid]);
  };

  const handleAddSub = () => {
    if (!selectedMajor || !selectedMid) {
      return;
    }
    if (hasPendingCreate) {
      return;
    }

    const newSub: SubCategoryWithEdit = {
      id: 0,
      midCatId: selectedMid.midCatId,
      majorCatNo: selectedMajor.majorCatNo,
      midCatCode: selectedMid.midCatCode,
      subcatCode: "",
      codeDesc: "",
      _editStatus: "pendingCreate",
      _tempId: generateTempId(),
    };

    setSubCategories([...subCategories, newSub]);
  };

  const handleDelete = () => {
    if (!hasSelectedRow && selectedSubIndex === null) {
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: "確認刪除",
      message: "確定要刪除此筆資料嗎？",
      confirmVariant: "danger",
      onConfirm: () => {
        if (selectedSubIndex !== null) {
          setSubCategories(
            subCategories.map((sub, index) => {
              if (index === selectedSubIndex) {
                return { ...sub, _editStatus: "pendingDelete" as EditStatus };
              }
              return sub;
            })
          );
          setSelectedSubIndex(null);
          setHasSelectedRow(false);
        } else if (selectedMidIndex !== null) {
          setMidCategories(
            midCategories.map((mid, index) => {
              if (index === selectedMidIndex) {
                return { ...mid, _editStatus: "pendingDelete" as EditStatus };
              }
              return mid;
            })
          );
          setSelectedMidIndex(null);
        } else if (selectedMajorIndex !== null) {
          setMajorCategories(
            majorCategories.map((major, index) => {
              if (index === selectedMajorIndex) {
                return {
                  ...major,
                  _editStatus: "pendingDelete" as EditStatus,
                };
              }
              return major;
            })
          );
          setSelectedMajorIndex(null);
          setHasSelectedMajor(false);
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
      onCancel: () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  const handleQuery = () => {
    setIsSearchDialogOpen(true);
  };

  const handlePrint = () => {
    const printContent = generatePrintContent();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const generatePrintContent = (): string => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const userInfo = "admin";

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>代碼維護 - 列印</title>
        <style>
          @media print {
            @page {
              margin: 1cm;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .header {
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 18px;
            }
            .header p {
              margin: 5px 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>代碼維護 - 三欄層級表格</h1>
          <p>列印日期：${dateStr}</p>
          <p>操作者：${userInfo}</p>
          ${selectedMajor ? `<p>目前篩選：大分類 ${selectedMajor.majorCatNo} - ${selectedMajor.majorCatName}</p>` : ""}
          ${selectedMid ? `<p>目前篩選：中分類 ${selectedMid.midCatCode} - ${selectedMid.codeDesc}</p>` : ""}
        </div>
        <table>
          <thead>
            <tr>
              <th>大分類編碼</th>
              <th>大分類名稱</th>
              <th>中分類編碼</th>
              <th>編碼說明</th>
              <th>細分類編碼</th>
              <th>編碼說明</th>
            </tr>
          </thead>
          <tbody>
    `;

    majorCategories.forEach((major) => {
      if (major._editStatus === "pendingDelete") return;
      const relatedMids = midCategories.filter((mid) => mid.majorCatNo === major.majorCatNo && mid._editStatus !== "pendingDelete");
      const relatedSubs = subCategories.filter((sub) => sub.majorCatNo === major.majorCatNo && sub._editStatus !== "pendingDelete");

      if (relatedMids.length === 0 && relatedSubs.length === 0) {
        html += `
          <tr>
            <td>${major.majorCatNo || ""}</td>
            <td>${major.majorCatName || ""}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `;
      } else {
        relatedMids.forEach((mid) => {
          const subs = relatedSubs.filter((sub) => sub.midCatCode === mid.midCatCode);
          if (subs.length === 0) {
            html += `
              <tr>
                <td>${major.majorCatNo || ""}</td>
                <td>${major.majorCatName || ""}</td>
                <td>${mid.midCatCode || ""}</td>
                <td>${mid.codeDesc || ""}</td>
                <td></td>
                <td></td>
              </tr>
            `;
          } else {
            subs.forEach((sub) => {
              html += `
                <tr>
                  <td>${major.majorCatNo || ""}</td>
                  <td>${major.majorCatName || ""}</td>
                  <td>${mid.midCatCode || ""}</td>
                  <td>${mid.codeDesc || ""}</td>
                  <td>${sub.subcatCode || ""}</td>
                  <td>${sub.codeDesc || ""}</td>
                </tr>
              `;
            });
          }
        });
      }
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    return html;
  };

  const handleSearchResultSelect = (type: "major" | "mid" | "sub", id: number) => {
    if (type === "major") {
      const category = majorCategories.find((cat) => cat.majorCatId === id);
      if (category) {
        const index = majorCategories.indexOf(category);
        handleMajorSelect(category, index);
      }
    } else if (type === "mid") {
      const category = midCategories.find((cat) => cat.midCatId === id);
      if (category) {
        const index = midCategories.indexOf(category);
        handleMidSelect(category, index);
      }
    } else if (type === "sub") {
      const category = subCategories.find((cat) => cat.id === id);
      if (category) {
        const index = subCategories.indexOf(category);
        handleSubSelect(category, index);
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setValidationErrors({});

      const errors: Record<string, string[]> = {};

      majorCategories.forEach((cat, index) => {
        if (cat._editStatus === "pendingCreate" || cat._editStatus === "pendingUpdate") {
          const existingCodes = majorCategories
            .filter((c, i) => i !== index && c.majorCatNo)
            .map((c) => c.majorCatNo);
          const result = validateMajorCategory(cat.majorCatNo, cat.majorCatName, existingCodes);
          if (!result.isValid) {
            result.errors.forEach((err) => {
              const key = `major_${index}_${err.field}`;
              if (!errors[key]) errors[key] = [];
              errors[key].push(err.message);
            });
          }
        }
      });

      midCategories.forEach((cat, index) => {
        if (cat._editStatus === "pendingCreate" || cat._editStatus === "pendingUpdate") {
          const existingCodes = midCategories
            .filter((c, i) => i !== index && c.midCatCode && c.majorCatNo === cat.majorCatNo)
            .map((c) => c.midCatCode);
          const result = validateMidCategory(
            cat.midCatCode,
            cat.codeDesc,
            cat.majorCatNo,
            existingCodes
          );
          if (!result.isValid) {
            result.errors.forEach((err) => {
              const key = `mid_${index}_${err.field}`;
              if (!errors[key]) errors[key] = [];
              errors[key].push(err.message);
            });
          }
          if (cat.remark) {
            const remarkResult = validateRemark(cat.remark);
            if (!remarkResult.isValid) {
              remarkResult.errors.forEach((err) => {
                const key = `mid_${index}_${err.field}`;
                if (!errors[key]) errors[key] = [];
                errors[key].push(err.message);
              });
            }
          }
        }
      });

      subCategories.forEach((cat, index) => {
        if (cat._editStatus === "pendingCreate" || cat._editStatus === "pendingUpdate") {
          const existingCodes = subCategories
            .filter(
              (c, i) =>
                i !== index &&
                c.subcatCode &&
                c.majorCatNo === cat.majorCatNo &&
                c.midCatCode === cat.midCatCode
            )
            .map((c) => c.subcatCode);
          const result = validateSubCategory(
            cat.subcatCode,
            cat.codeDesc,
            cat.majorCatNo,
            cat.midCatCode,
            existingCodes
          );
          if (!result.isValid) {
            result.errors.forEach((err) => {
              const key = `sub_${index}_${err.field}`;
              if (!errors[key]) errors[key] = [];
              errors[key].push(err.message);
            });
          }
          if (cat.remark) {
            const remarkResult = validateRemark(cat.remark);
            if (!remarkResult.isValid) {
              remarkResult.errors.forEach((err) => {
                const key = `sub_${index}_${err.field}`;
                if (!errors[key]) errors[key] = [];
                errors[key].push(err.message);
              });
            }
          }
        }
      });

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setIsLoading(false);
        console.error("驗證失敗:", errors);
        return;
      }

      const request: BatchSaveRequest = {
        creates: [],
        updates: [],
        deletes: [],
      };

      majorCategories.forEach((cat) => {
        if (cat._editStatus === "pendingCreate") {
          request.creates.push({
            majorCatNo: cat.majorCatNo,
            majorCatName: cat.majorCatName,
            createdBy: "admin",
          });
        } else if (cat._editStatus === "pendingUpdate") {
          request.updates.push({
            majorCatId: cat.majorCatId,
            lockVer: cat.lockVer || 1,
            majorCatName: cat.majorCatName,
            modifiedBy: "admin",
          });
        } else if (cat._editStatus === "pendingDelete") {
          request.deletes.push({
            majorCatId: cat.majorCatId,
            lockVer: cat.lockVer || 1,
            type: "major",
          });
        }
      });

      midCategories.forEach((cat) => {
        if (cat._editStatus === "pendingCreate") {
          request.creates.push({
            majorCatNo: cat.majorCatNo,
            midCatCode: cat.midCatCode,
            codeDesc: cat.codeDesc,
            value1: cat.value1,
            value2: cat.value2,
            remark: cat.remark,
            createdBy: "admin",
          });
        } else if (cat._editStatus === "pendingUpdate") {
          request.updates.push({
            midCatId: cat.midCatId,
            lockVer: cat.lockVer || 1,
            codeDesc: cat.codeDesc,
            value1: cat.value1,
            value2: cat.value2,
            remark: cat.remark,
            modifiedBy: "admin",
          });
        } else if (cat._editStatus === "pendingDelete") {
          request.deletes.push({
            midCatId: cat.midCatId,
            lockVer: cat.lockVer || 1,
            type: "mid",
          });
        }
      });

      subCategories.forEach((cat) => {
        if (cat._editStatus === "pendingCreate") {
          request.creates.push({
            majorCatNo: cat.majorCatNo,
            midCatCode: cat.midCatCode,
            subcatCode: cat.subcatCode,
            codeDesc: cat.codeDesc,
            remark: cat.remark,
            createdBy: "admin",
          });
        } else if (cat._editStatus === "pendingUpdate") {
          request.updates.push({
            id: cat.id,
            lockVer: cat.lockVer || 1,
            codeDesc: cat.codeDesc,
            remark: cat.remark,
            modifiedBy: "admin",
          });
        } else if (cat._editStatus === "pendingDelete") {
          request.deletes.push({
            id: cat.id,
            lockVer: cat.lockVer || 1,
            type: "sub",
          });
        }
      });

      const response = await batchSaveCodes(request);

      if (response.success) {
        await loadData();
        setValidationErrors({});
      } else {
        console.error("儲存失敗:", response.message, response.errors);
        const backendErrors: Record<string, string[]> = {};
        if (response.errors) {
          response.errors.forEach((err) => {
            const key = err.field || "general";
            if (!backendErrors[key]) backendErrors[key] = [];
            backendErrors[key].push(err.message || "發生錯誤");
          });
        }
        setValidationErrors(backendErrors);
      }
    } catch (error) {
      console.error("儲存失敗:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmDialog({
      isOpen: true,
      title: "確認取消",
      message: "您有未儲存的變更，是否要放棄？",
      onConfirm: async () => {
        setHasUnsavedChanges(false);
        setHasPendingCreate(false);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        await loadData();
      },
      onCancel: () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600 dark:text-gray-400">載入中...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-shrink-0 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
        <Breadcrumbs
          items={[
            { label: "首頁", href: "/dashboard" },
            { label: "基本作業" },
            { label: "基本代碼維護" },
          ]}
        />
        <CodesToolbar
          hasUnsavedChanges={hasUnsavedChanges}
          hasSelectedMajor={hasSelectedMajor}
          hasSelectedMid={hasSelectedMid}
          hasSelectedRow={hasSelectedRow}
          hasPendingCreate={hasPendingCreate}
          onAddMajor={handleAddMajor}
          onAddMid={handleAddMid}
          onAddSub={handleAddSub}
          onDelete={handleDelete}
          onQuery={handleQuery}
          onPrint={handlePrint}
          onSave={handleSave}
          onCancel={handleCancel}
          className="ml-auto"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <ThreeColumnLayout
          leftPanel={
            <MajorCategoryList
              data={majorCategories}
              selectedIndex={selectedMajorIndex}
              onRowSelect={handleMajorSelect}
              isLoading={isLoading}
              onDataChange={handleMajorDataChange}
            />
          }
          middlePanel={
            <MidCategoryList
              data={filteredMidCategories}
              selectedIndex={selectedMidIndex}
              onRowSelect={handleMidSelect}
              isLoading={isLoading}
              hasSelectedMajor={hasSelectedMajor}
              onDataChange={handleMidDataChange}
            />
          }
          rightPanel={
            <SubCategoryList
              data={filteredSubCategories}
              selectedIndex={selectedSubIndex}
              onRowSelect={handleSubSelect}
              isLoading={isLoading}
              hasSelectedMid={hasSelectedMid}
              onDataChange={handleSubDataChange}
            />
          }
          defaultLeftSize={22}
          defaultMiddleSize={39}
          minSize={18}
          maxSize={35}
        />
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
        confirmVariant={confirmDialog.confirmVariant}
      />

      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        onResultSelect={handleSearchResultSelect}
      />
    </div>
  );
}
