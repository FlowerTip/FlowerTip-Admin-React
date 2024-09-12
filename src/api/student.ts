import instance from "@/utils/service";
import { PagainationType } from "@/types/index";

// 学员相关接口的枚举类型
enum API {
  STUDENT_LIST = "/permission/roleList",
  ADD_STUDENT = "/permission/saveRole",
  DEL_STUDENT = "/permission/delRole",
}

// 获取学员列表数据接口
export const reqStudentList = (data: PagainationType) =>
  instance.post<Res.StudentListData>(API.STUDENT_LIST, data);

// 保存学员数据接口
export const reqSaveStudent = (data: Req.SaveStudentParam) =>
  instance.post<Res.SaveStudentData>(API.ADD_STUDENT, data);

// 删除学员数据接口
export const reqDelStudent = (data: Req.DelStudentParam) =>
  instance.post<Res.DelStudentData>(API.DEL_STUDENT, data);