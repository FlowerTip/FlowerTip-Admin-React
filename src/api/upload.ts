import instance from "@/utils/service";
import { getToken } from "@/utils/auth";

// 文件上传相关接口的枚举类型
enum API {
  UPLOAD_AVATAR = "/upload/avatar",
}

// 上传学员头像数据接口
export const reqUploadAvatar = (data: FormData) =>
  instance.post<Res.UploadAvatarData>(API.UPLOAD_AVATAR, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  });