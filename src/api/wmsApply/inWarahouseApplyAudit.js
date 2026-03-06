import request from '@/utils/request'

// 查询入库申请审核列表
export function listInWarahouseApplyAudit(query) {
  return request({
    url: '/wmsApply/inWarahouseApplyAudit/list',
    method: 'get',
    params: query
  })
}

// 查询入库申请审核详细
export function getInWarahouseApplyAudit(id) {
  return request({
    url: '/wmsApply/inWarahouseApplyAudit/' + id,
    method: 'get'
  })
}

// 新增入库申请审核
export function addInWarahouseApplyAudit(data) {
  return request({
    url: '/wmsApply/inWarahouseApplyAudit',
    method: 'post',
    data: data
  })
}

// 修改入库申请审核
export function updateInWarahouseApplyAudit(data) {
  return request({
    url: '/wmsApply/inWarahouseApplyAudit',
    method: 'put',
    data: data
  })
}

// 删除入库申请审核
export function delInWarahouseApplyAudit(id) {
  return request({
    url: '/wmsApply/inWarahouseApplyAudit/' + id,
    method: 'delete'
  })
}

// 导出入库申请审核
export function exportInWarahouseApplyAudit(query) {
  return request({
    url: '/wmsApply/inWarahouseApplyAudit/export',
    method: 'get',
    params: query
  })
}