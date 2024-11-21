import jsPreviewDocx, { JsDocxPreview } from "@js-preview/docx";
import jsPreviewExcel, { JsExcelPreview } from "@js-preview/excel";
import jsPreviewPdf, { JsPdfPreview } from "@js-preview/pdf";
import '@js-preview/docx/lib/index.css'
import '@js-preview/excel/lib/index.css';

type FileType = 'docx' | 'excel' | 'pdf';
type filePreviewerType = JsDocxPreview | JsExcelPreview | JsPdfPreview;
type InstancePreviewer = typeof jsPreviewDocx | typeof  jsPreviewExcel | typeof jsPreviewPdf | null;
/**
 * @description 在线预览文档
 */
export const usePreview = () => {
  let filePreviewer: filePreviewerType | null = null;
  /**
   * 
   * @param fileType 文件类型 FileType
   * @param src      文件地址
   * @param idContainer 展示容器的id
   * @returns 
   */
  const preview = (fileType: FileType, src: string | ArrayBuffer | Blob, idContainer: HTMLElement) => {
    filePreviewer && filePreviewer.destroy() && (filePreviewer = null);
    let previewer: InstancePreviewer = null;
    switch (fileType) {
      case 'docx':
        previewer = jsPreviewDocx;
        break;
      case 'excel':
        previewer = jsPreviewExcel;
        break;
      case 'pdf':
        previewer = jsPreviewPdf;
        break;
      default:
        previewer = jsPreviewPdf;
        break;
    }
    filePreviewer = previewer.init(idContainer as HTMLElement);
    return filePreviewer.preview(src);
  };
  /**
   * 
   * @param idContainer 展示容器的id
   * @param fileType 文件类型 FileType
   * @param fileName 下载的文件名称
   * @returns 
   */
  const save = (idContainer: HTMLElement, fileType: FileType, fileName?: string) => {
    filePreviewer && filePreviewer.destroy() && (filePreviewer = null);
    let tempPreviewer: InstancePreviewer = null;
    switch (fileType) {
      case 'docx':
        tempPreviewer = jsPreviewDocx;
        break;
      case 'excel':
        tempPreviewer = jsPreviewExcel;
        break;
      case 'pdf':
        tempPreviewer = jsPreviewPdf;
        break;
      default:
        tempPreviewer = jsPreviewPdf;
        break;
    }
    !filePreviewer && (filePreviewer = tempPreviewer.init(idContainer as HTMLElement));
    return filePreviewer.save(fileName);
  };

  return {
    preview,
    save
  };
};