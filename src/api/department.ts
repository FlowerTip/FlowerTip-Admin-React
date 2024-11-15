import instance from "@/utils/service";

// 部门相关接口的枚举类型
enum API {
  DEPART_MENT_LIST = "/department/departmentList",
  ADD_DEPART_MENT__INFO = "/department/saveDepartment",
  DELETE_DEPART_MENT = "/department/delDepartment",
}

// 获取部门列表接口数据
export const reqDepartmentList = (data: Req.DepartMentListParam) =>
  instance.post<Res.DepartMentListData>(API.DEPART_MENT_LIST, data);


// 保存部门信息数据接口
export const reqSaveDepartment = (data: DepartMentItem) =>
  instance.post<Res.SaveDepartMentRes>(API.ADD_DEPART_MENT__INFO, data);

export const reqDelDepartMent = (data: {
  departmentId: number;
}) =>
  instance.delete<Res.DelRoleData>(API.DELETE_DEPART_MENT, {
    params: data,
  });
