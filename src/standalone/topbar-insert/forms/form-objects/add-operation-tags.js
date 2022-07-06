import { fromJS } from "immutable"
import { selectOperationForm, selectOperationObject } from "./select-operation"

const tagItem = (updateForm, path) => 
  fromJS({ 
    tag: {
      value: "",
      isRequired: true, 
      name: "标签",
      description: "标签的名称必填",
      validationMessage: "请输入标签名称。该字段为必填字段。",
      updateForm: newForm => updateForm(newForm, path.concat(["tag"]))
    }
  })

export const addOperationTagsForm = (updateForm, path, existing) =>  
  fromJS({ 
    selectoperation: {
      name: "选择操作添加该标签。",
      value: selectOperationForm(updateForm, path.concat(["selectoperation", "value"]), existing),
      isRequired: true,
      updateForm: newForm => updateForm(newForm, path.concat(["selectoperation"]))
    },
    tags: {
      value: [],
      dependsOn: ["selectoperation", "value", "operation", "value"],
      name: "所有标签",
      description: "用于 API 文档控制的标记列表。标记可用于按资源或任何其他限定符对操作进行逻辑分组。",
      updateForm: newForm => updateForm(newForm, path.concat(["tags"])),
      defaultItem: i => tagItem(updateForm, path.concat(["tags", "value", i]))
    }
  })

export const addOperationTagsObject = (formData) => {
  const parsedTags = []
  const tags = formData.getIn(["tags", "value"])

  tags.forEach((tag) => {
    parsedTags.push(tag.getIn(["tag", "value"]))
  })

  const selectedAndTags = {
    selectedOperation: selectOperationObject(formData.getIn(["selectoperation", "value"])),
    tags: parsedTags
  }

  return selectedAndTags
}