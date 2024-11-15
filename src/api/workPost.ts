import instance from "@/utils/service";

// 部门相关接口的枚举类型
enum API {
  WORK_POST_LIST = "/workPost/workPostList",
  ADD_WORK_POST = "/workPost/saveWorkPost",
  DELETE_WORK_POST = "/workPost/delWorkPost",
}

// 获取岗位列表接口数据
export const reqWorkPostList = (data: Req.WorkPostListParam) =>
  instance.post<Res.WorkPostListData>(API.WORK_POST_LIST, data);

// 保存岗位信息数据接口
export const reqSaveWorkPost = (data: WorkPostItem) =>
  instance.post<Res.SaveWorkPostRes>(API.ADD_WORK_POST, data);

// 删除岗位信息数据接口
export const reqDelWorkPost = (data: {
  ids: number[];
}) =>
  instance.delete<Res.DelWorkPostRes>(API.DELETE_WORK_POST, {
    params: data,
  });
